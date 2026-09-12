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
  const [escalated, setEscalated] = useState(false);

  const jwtRef = useRef<string | null>(null);
  const answersRef = useRef<string[]>([]);
  const profileRef = useRef<FearProfile | null>(null);
  const adapterRef = useRef<WorldAdapter | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const cancelledRef = useRef(false);

  const fail = useCallback((message: string, error?: unknown) => {
    if (error) console.error(message, error);
    mixer.stopAll(0.3);
    horror.stop(0.3);
    const detail =
      error instanceof Error ? error.message : error ? String(error) : null;
    setState({
      kind: "error",
      message: detail ? `${message} — ${detail}` : message,
    });
  }, []);

  const later = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  /* Play a pre-baked voice line if the file exists; otherwise hold the
     subtitle for a reading-time beat. Resolves when the line has landed. */
  const speak = useCallback(async (url: string, text: string): Promise<void> => {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        await mixer.playOnce(url);
        return;
      }
    } catch (error) {
      console.error(`Voice line unavailable: ${url}`, error);
    }
    const readingMs = Math.min(6000, Math.max(1800, text.split(" ").length * 320));
    await new Promise((resolve) => setTimeout(resolve, readingMs));
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
      await speak(`${VOICE_BASE}/q${i + 1}.mp3`, QUESTIONS[i]);
      if (cancelled()) return;
      mixer.playOnce("/audio/pen-scratch.mp3", 0.5).catch(() => undefined);
      later(350, () => {
        if (!cancelled()) setInterviewPhase("awaiting");
      });
    })();
    return () => {
      cancelledRef.current = true;
    };
  }, [state.kind, questionIndex, speak, later]);

  const submitAnswer = useCallback(
    (answer: string) => {
      answersRef.current.push(answer);
      const ack = ACKNOWLEDGEMENTS[questionIndex % ACKNOWLEDGEMENTS.length];
      setAckLine(ack);
      setInterviewPhase("ack");
      void (async () => {
        await speak(`${VOICE_BASE}/ack${(questionIndex % 3) + 1}.mp3`, ack);
        if (questionIndex + 1 < QUESTIONS.length) {
          setQuestionIndex(questionIndex + 1);
        } else {
          setState({ kind: "inferring" });
        }
      })();
    },
    [questionIndex, speak],
  );

  /* ---- Inference + world pipeline -------------------------------------- */
  useEffect(() => {
    if (state.kind !== "inferring") return;

    // Warm the Reactor session the instant the fourth answer lands.
    const adapter = new WorldAdapter({
      onStreamError: (error) => {
        console.error("World stream error:", error);
        horror.stop(0.5);
        setState({ kind: "endscene" });
      },
      onTravelEnd: () => {
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
  }, [state.kind, fail]);

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
      setEscalated(true);
    });
    later(PROMPT_RULES.travelSeconds * 1000 - 5000, () => horror.climax(5));
    later(PROMPT_RULES.travelSeconds * 1000, () => {
      horror.stop(0.4);
      void adapter.end();
      setState({ kind: "endscene" });
    });
  }, [fail, later]);

  const doorTimeout = useCallback(() => {
    fail("The door never opened.");
  }, [fail]);

  /* ---- Return ------------------------------------------------------------ */
  useEffect(() => {
    if (state.kind === "return") {
      mixer.playLoop("office-tone", "/audio/office-tone.mp3", 0.35, 2);
      mixer.playLoop("clock", "/audio/clock.mp3", 0.2, 2);
      void speak(`${VOICE_BASE}/closing.mp3`, LINES.closing);
    }
  }, [state.kind, speak]);

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
          escalated={escalated}
        />
      )}

      {state.kind === "door" && (
        <DoorSequence
          worldReady={worldReady}
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
