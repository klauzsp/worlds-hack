"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Gate } from "@/components/Gate";
import { OfficeScene } from "@/components/office/OfficeScene";
import { Subtitle } from "@/components/interview/Subtitle";
import { AnswerOverlay } from "@/components/interview/AnswerOverlay";
import { DoorSequence } from "@/components/door/DoorSequence";
import { WorldScreen } from "@/components/world/WorldScreen";
import { MovementControls } from "@/components/world/MovementControls";
import { EndScene } from "@/components/return/EndScene";
import { Notebook } from "@/components/return/Notebook";
import { mixer } from "@/lib/audio/mixer";
import { horror } from "@/lib/audio/horror";
import { WorldAdapter } from "@/lib/world/adapter";
import { PROMPT_RULES } from "@/lib/world/prompt-rules";
import { ACKNOWLEDGEMENTS, LINES, QUESTIONS } from "@/content/questions";
import type { AppState, FearProfile } from "@/lib/types";

type InterviewPhase = "speaking" | "awaiting" | "ack";

const VOICE_BASE = "/audio/psychologist";

export default function Page() {
  const [state, setState] = useState<AppState>({ kind: "gate" });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [interviewPhase, setInterviewPhase] = useState<InterviewPhase>("speaking");
  const [ackLine, setAckLine] = useState("");
  const [worldReady, setWorldReady] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [dread, setDread] = useState<"calm" | "escalated" | "climax">("calm");

  const jwtRef = useRef<string | null>(null);
  const answersRef = useRef<string[]>([]);
  const profileRef = useRef<FearProfile | null>(null);
  const adapterRef = useRef<WorldAdapter | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const cancelledRef = useRef(false);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }, []);

  const fail = useCallback((message: string, error?: unknown) => {
    if (error) console.error(message, error);
    clearTimers();
    mixer.stopAll(0.3);
    horror.stop(0.3);
    const adapter = adapterRef.current;
    adapterRef.current = null;
    if (adapter) void adapter.end().catch(() => undefined);
    const detail =
      error instanceof Error ? error.message : error ? String(error) : null;
    setState({
      kind: "error",
      message: detail ? `${message} — ${detail}` : message,
    });
  }, [clearTimers]);

  const later = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  /* Play a committed voice line; resolves when it ends. The files are part
     of the app — a failure is a real error, not a beat to improvise. */
  const speak = useCallback(async (url: string): Promise<void> => {
    await mixer.playOnce(url);
  }, []);

  /* ---- Gate ------------------------------------------------------------ */
  const begin = useCallback(async () => {
    mixer.init();
    mixer.playLoop("office-tone", "/audio/office-tone.mp3", 0.35, 2);
    mixer.playLoop("clock", "/audio/clock.mp3", 0.2, 2);
    try {
      const res = await fetch("/api/reactor/token", { method: "POST", cache: "no-store" });
      if (!res.ok) throw new Error(`token ${res.status}`);
      const { jwt } = (await res.json()) as { jwt: string };
      jwtRef.current = jwt;
    } catch (error) {
      fail("The session could not be started.", error);
      return;
    }
    setState({ kind: "interview" });
  }, [fail]);

  /* ---- Interview -------------------------------------------------------- */
  useEffect(() => {
    if (state.kind !== "interview") return;
    cancelledRef.current = false;
    const cancelled = () => cancelledRef.current;
    const i = questionIndex;

    setInterviewPhase("speaking");
    void (async () => {
      try {
        await speak(`${VOICE_BASE}/q${i + 1}.mp3`);
      } catch (error) {
        fail("Her voice could not be played.", error);
        return;
      }
      if (cancelled()) return;
      mixer.playOnce("/audio/pen-scratch.mp3", 0.5).catch(() => undefined);
      later(350, () => {
        if (!cancelled()) setInterviewPhase("awaiting");
      });
    })();
    return () => {
      cancelledRef.current = true;
    };
  }, [state.kind, questionIndex, speak, later, fail]);

  const submitAnswer = useCallback(
    (answer: string) => {
      answersRef.current.push(answer);
      const ack = ACKNOWLEDGEMENTS[questionIndex % ACKNOWLEDGEMENTS.length];
      setAckLine(ack);
      setInterviewPhase("ack");
      void (async () => {
        try {
          await speak(`${VOICE_BASE}/ack${(questionIndex % 3) + 1}.mp3`);
        } catch (error) {
          fail("Her voice could not be played.", error);
          return;
        }
        if (questionIndex + 1 < QUESTIONS.length) {
          setQuestionIndex(questionIndex + 1);
        } else {
          setState({ kind: "inferring" });
        }
      })();
    },
    [questionIndex, speak, fail],
  );

  /* ---- Inference + world pipeline -------------------------------------- */
  useEffect(() => {
    if (state.kind !== "inferring") return;

    // Warm the Reactor session the instant the fourth answer lands.
    const adapter = new WorldAdapter({
      onStreamError: (error) => {
        console.error("World stream error:", error);
        clearTimers();
        horror.stop(0.5);
        setState({ kind: "endscene" });
      },
      onTravelEnd: () => {
        clearTimers();
        horror.stop(0.5);
        setState({ kind: "endscene" });
      },
    });
    adapterRef.current = adapter;
    const connectPromise = adapter.connect(jwtRef.current ?? "");

    void (async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: answersRef.current }),
        });
        if (!res.ok) throw new Error(`profile ${res.status}`);
        const { profile } = (await res.json()) as { profile: FearProfile };
        profileRef.current = profile;
        setState({ kind: "door" });
      } catch (error) {
        fail("Something went wrong.", error);
        return;
      }

      // The world builds under the door sequence.
      try {
        const profile = profileRef.current;
        if (!profile) throw new Error("profile missing");
        const imgRes = await fetch("/api/seed-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: profile.seedImagePrompt }),
        });
        if (!imgRes.ok) throw new Error(`seed image ${imgRes.status}`);
        const { imageUrl } = (await imgRes.json()) as { imageUrl: string };

        await connectPromise;
        // Adventure has no live text channel — the escalation is carried
        // in the prompt itself (see prompt-rules.ts).
        const worldPrompt = `${profile.worldPrompt}\n\n${profile.escalationPrompt}\n\n${profile.audioPrompt}`;
        await adapter.buildWorld(worldPrompt, imageUrl);
        setWorldReady(true);
      } catch (error) {
        fail("The world could not be built.", error);
      }
    })();
  }, [state.kind, fail, clearTimers]);

  /* ---- World entry ------------------------------------------------------ */
  const enterWorld = useCallback(async () => {
    const adapter = adapterRef.current;
    const video = videoRef.current;
    if (!adapter || !video) {
      fail("The world is not ready.");
      return;
    }
    try {
      await adapter.start(video);
    } catch (error) {
      fail("The world could not be entered.", error);
      return;
    }
    mixer.stopAll(1.5);
    horror.start();
    setState({ kind: "world" });
    setShowHint(true);

    later(30_000, () => {
      horror.escalate();
      setDread("escalated");
    });
    later(PROMPT_RULES.travelSeconds * 1000 - 5000, () => {
      horror.climax(5);
      setDread("climax");
    });
    later(PROMPT_RULES.travelSeconds * 1000, () => {
      clearTimers();
      horror.stop(0.4);
      void adapter.end();
      setState({ kind: "endscene" });
    });
  }, [fail, later, clearTimers]);

  const doorTimeout = useCallback(() => {
    fail("The door never opened.");
  }, [fail]);

  const doorSpeak = useCallback(
    async (url: string): Promise<void> => {
      try {
        await speak(url);
      } catch (error) {
        fail("Her voice could not be played.", error);
      }
    },
    [speak, fail],
  );

  /* ---- Return ------------------------------------------------------------ */
  useEffect(() => {
    if (state.kind === "return") {
      mixer.playLoop("office-tone", "/audio/office-tone.mp3", 0.35, 2);
      mixer.playLoop("clock", "/audio/clock.mp3", 0.2, 2);
      speak(`${VOICE_BASE}/closing.mp3`).catch((error) =>
        fail("Her voice could not be played.", error),
      );
    }
  }, [state.kind, speak, fail]);

  const inOffice = state.kind === "interview" || state.kind === "inferring" || state.kind === "return";
  const inDoorOrWorld = state.kind === "door" || state.kind === "world";

  return (
    <main className="app-frame">
      {/* Small-screen guard — desktop only, one line, per DESIGN. */}
      <div className="absolute inset-0 z-50 hidden items-center justify-center bg-bg max-[1024px]:flex">
        <p className="font-sans text-sm text-text-muted">Please use a larger screen.</p>
      </div>

      {inOffice && <OfficeScene />}

      {state.kind === "interview" && (
        <>
          {interviewPhase !== "ack" && <Subtitle text={QUESTIONS[questionIndex]} />}
          {interviewPhase === "ack" && <Subtitle text={ackLine} italic />}
          {interviewPhase === "awaiting" && <AnswerOverlay onSubmit={submitAnswer} />}
        </>
      )}

      {state.kind === "inferring" && <Subtitle text="Give me a moment." />}

      {/* The video element must exist before the stream opens, so the world
          screen stays mounted beneath the door sequence. */}
      {inDoorOrWorld && (
        <WorldScreen
          ref={videoRef}
          visible={state.kind === "world"}
          showHint={showHint}
          dread={dread}
        />
      )}

      {state.kind === "door" && (
        <DoorSequence
          worldReady={worldReady}
          speak={doorSpeak}
          onWorldEnter={enterWorld}
          onTimeout={doorTimeout}
        />
      )}

      {state.kind === "world" && adapterRef.current && (
        <MovementControls adapter={adapterRef.current} />
      )}

      {state.kind === "endscene" && <EndScene onDone={() => setState({ kind: "return" })} />}

      {state.kind === "return" && profileRef.current && (
        <>
          <Notebook profile={profileRef.current} />
          <Subtitle text={LINES.closing} italic />
        </>
      )}

      {state.kind === "gate" && <Gate onBegin={() => void begin()} />}

      {state.kind === "error" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-bg">
          <p className="font-sans text-sm text-danger">{state.message}</p>
        </div>
      )}
    </main>
  );
}
