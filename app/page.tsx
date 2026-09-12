"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { z } from "zod";
import { Gate } from "@/components/Gate";
import { Subtitle } from "@/components/interview/Subtitle";
import { AnswerOverlay } from "@/components/interview/AnswerOverlay";
import { DoorSequence, type DoorPhase } from "@/components/door/DoorSequence";
import { WorldScreen } from "@/components/world/WorldScreen";
import { MovementControls } from "@/components/world/MovementControls";
import { EndScene } from "@/components/return/EndScene";
import { Notebook } from "@/components/return/Notebook";
import { mixer } from "@/lib/audio/mixer";
import { horror } from "@/lib/audio/horror";
import { WorldAdapter } from "@/lib/world/adapter";
import { PROMPT_RULES } from "@/lib/world/prompt-rules";
import { fearProfileSchema } from "@/lib/profile/schema";
import { ACKNOWLEDGEMENTS, LINES, QUESTIONS } from "@/content/questions";
import type { AppState } from "@/lib/types";
import type { OfficeShot } from "@/components/office/shots";

/* WebGL canvas must not SSR. */
const OfficeScene = dynamic(
  () => import("@/components/office/OfficeScene").then((m) => m.OfficeScene),
  { ssr: false },
);

type InterviewPhase = "speaking" | "awaiting" | "answering" | "ack";

const VOICE_BASE = "/audio/psychologist";

const tokenSchema = z.object({ jwt: z.string().min(1) });
const profileResponseSchema = z.object({ profile: fearProfileSchema });
const seedResponseSchema = z.object({ imageUrl: z.string().url() });

type Session = { controller: AbortController };

export default function Page() {
  const [state, setState] = useState<AppState>({ kind: "gate" });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [interviewPhase, setInterviewPhase] = useState<InterviewPhase>("speaking");
  const [ackLine, setAckLine] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [worldReady, setWorldReady] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [dread, setDread] = useState<"calm" | "escalated" | "climax">("calm");
  const [doorPhase, setDoorPhase] = useState<DoorPhase>("lines");
  const [avatarReady, setAvatarReady] = useState(false);

  const jwtRef = useRef<string | null>(null);
  const answersRef = useRef<string[]>([]);
  const profileRef = useRef<z.infer<typeof fearProfileSchema> | null>(null);
  const adapterRef = useRef<WorldAdapter | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const sessionRef = useRef<Session | null>(null);
  const begunRef = useRef(false);
  const buildStartedRef = useRef(false);
  const enteringRef = useRef(false);
  const worldActiveRef = useRef(false);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }, []);

  /* Unmount tears down the whole session: timers, audio, adapter. */
  useEffect(
    () => () => {
      const session = sessionRef.current;
      sessionRef.current = null;
      worldActiveRef.current = false;
      const adapter = adapterRef.current;
      adapterRef.current = null;
      session?.controller.abort();
      clearTimers();
      mixer.stopAll(0);
      horror.stop(0);
      if (adapter) void adapter.end().catch(() => undefined);
    },
    [clearTimers],
  );

  const fail = useCallback(
    (message: string, error?: unknown) => {
      if (error) console.error(message, error);
      const session = sessionRef.current;
      sessionRef.current = null;
      worldActiveRef.current = false;
      session?.controller.abort();
      clearTimers();
      mixer.stopAll(0.3);
      horror.stop(0.3);
      const adapter = adapterRef.current;
      adapterRef.current = null;
      if (adapter) void adapter.end().catch(() => undefined);
      setState({ kind: "error", message });
    },
    [clearTimers],
  );

  const later = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  /* Play a committed voice line on her channel — abortable, part of the
     session, a failure is a real error. */
  const speak = useCallback(async (url: string, signal?: AbortSignal): Promise<void> => {
    await mixer.playOnce(url, 1, 0, { signal, channel: "psychologist" });
  }, []);

  /* ---- World finish: one path, from timer or stream event -------------- */
  const finishWorld = useCallback(() => {
    if (!worldActiveRef.current) return;
    worldActiveRef.current = false;
    clearTimers();
    horror.stop(0.4);
    const adapter = adapterRef.current;
    adapterRef.current = null;
    if (adapter) void adapter.end().catch(() => undefined);
    setState({ kind: "endscene" });
  }, [clearTimers]);

  /* ---- World build — starts alongside the final answer's speech -------- */
  const runBuild = useCallback(
    async (answers: string[]) => {
      const session = sessionRef.current;
      const jwt = jwtRef.current;
      if (!session || !jwt) return;
      const signal = session.controller.signal;
      const alive = () =>
        sessionRef.current === session && adapterRef.current === adapter && !signal.aborted;

      const adapter = new WorldAdapter({
        onStreamError: (error) => {
          if (!alive()) return;
          console.error("World stream error:", error);
          if (worldActiveRef.current) finishWorld();
          else fail("The world stream failed.", error);
        },
        onTravelEnd: () => {
          if (!alive()) return;
          finishWorld();
        },
      });
      adapterRef.current = adapter;
      const connection = adapter
        .connect(jwt)
        .then(() => ({ ok: true as const }))
        .catch((error) => ({ ok: false as const, error }));

      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
          signal,
        });
        if (!res.ok) throw new Error(`profile ${res.status}`);
        const { profile } = profileResponseSchema.parse(await res.json());
        if (!alive()) return;
        profileRef.current = profile;

        const imgRes = await fetch("/api/seed-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: profile.seedImagePrompt }),
          signal,
        });
        if (!imgRes.ok) throw new Error(`seed image ${imgRes.status}`);
        const { imageUrl } = seedResponseSchema.parse(await imgRes.json());

        const connected = await connection;
        if (!connected.ok) throw connected.error;
        if (!alive()) return;

        // Adventure has no live text channel — the escalation is carried
        // in the prompt itself (see prompt-rules.ts).
        const worldPrompt = `${profile.worldPrompt}\n\n${profile.escalationPrompt}\n\n${profile.audioPrompt}`;
        await adapter.buildWorld(worldPrompt, imageUrl);
        if (alive()) setWorldReady(true);
      } catch (error) {
        if (!alive()) return;
        fail("The world could not be built.", error);
      }
    },
    [fail, finishWorld],
  );

  /* ---- Gate ------------------------------------------------------------ */
  const begin = useCallback(async () => {
    if (begunRef.current) return;
    begunRef.current = true;
    const session: Session = { controller: new AbortController() };
    sessionRef.current = session;
    mixer.init();
    mixer.playLoop("office-tone", "/audio/office-tone.mp3", 0.35, 2);
    mixer.playLoop("clock", "/audio/clock.mp3", 0.2, 2);
    try {
      const res = await fetch("/api/reactor/token", {
        method: "POST",
        cache: "no-store",
        signal: session.controller.signal,
      });
      if (!res.ok) throw new Error(`token ${res.status}`);
      jwtRef.current = tokenSchema.parse(await res.json()).jwt;
    } catch (error) {
      if (sessionRef.current === session) fail("The session could not be started.", error);
      return;
    }
    if (sessionRef.current !== session) return;
    setState({ kind: "interview" });
  }, [fail]);

  /* ---- Interview -------------------------------------------------------- */
  useEffect(() => {
    if (state.kind !== "interview") return;
    const session = sessionRef.current;
    if (!session) return;
    let cancelled = false;
    const local = new AbortController();
    const signal = AbortSignal.any([session.controller.signal, local.signal]);
    const i = questionIndex;

    setInterviewPhase("speaking");
    void (async () => {
      try {
        await speak(`${VOICE_BASE}/q${i + 1}.mp3`, signal);
      } catch (error) {
        if (!signal.aborted) fail("Her voice could not be played.", error);
        return;
      }
      if (cancelled || signal.aborted) return;
      mixer.playOnce("/audio/pen-scratch.mp3", 0.5, 0, { signal }).catch(() => undefined);
      later(350, () => {
        if (!cancelled && !signal.aborted) setInterviewPhase("awaiting");
      });
    })();
    return () => {
      cancelled = true;
      local.abort();
    };
  }, [state.kind, questionIndex, speak, later, fail]);

  /* The visitor's answer is voiced back, then her acknowledgement. The
     answer is only accepted once its playback completes. On the fourth
     answer the world build is already running beside the speech. */
  const submitAnswer = useCallback(
    async (answer: string): Promise<void> => {
      const session = sessionRef.current;
      if (!session) return;
      const signal = session.controller.signal;
      const i = questionIndex;
      const last = i === QUESTIONS.length - 1;
      const draft = [...answersRef.current, answer];

      setSubmitted(answer);
      setInterviewPhase("answering");

      if (last && !buildStartedRef.current) {
        buildStartedRef.current = true;
        void runBuild(draft).catch((error) => {
          if (sessionRef.current === session) fail("The world could not be built.", error);
        });
      }

      try {
        const res = await fetch("/api/speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: answer }),
          signal,
        });
        if (!res.ok) throw new Error(`speech ${res.status}`);
        await mixer.playBytes(await res.arrayBuffer(), { signal, channel: "visitor" });
      } catch (error) {
        if (signal.aborted) return;
        if (last) {
          fail("Your answer could not be played. Please begin again.", error);
          return;
        }
        setInterviewPhase("awaiting");
        throw error;
      }
      if (signal.aborted) return;
      answersRef.current = draft;

      const ack = ACKNOWLEDGEMENTS[i % ACKNOWLEDGEMENTS.length];
      setAckLine(ack);
      setInterviewPhase("ack");
      try {
        await speak(`${VOICE_BASE}/ack${(i % 3) + 1}.mp3`, signal);
      } catch (error) {
        if (!signal.aborted) fail("Her voice could not be played.", error);
        return;
      }
      if (signal.aborted) return;
      if (last) setState({ kind: "door" });
      else setQuestionIndex(i + 1);
    },
    [questionIndex, speak, runBuild, fail],
  );

  /* ---- World entry ------------------------------------------------------ */
  const enterWorld = useCallback(async () => {
    if (enteringRef.current) return;
    enteringRef.current = true;
    const session = sessionRef.current;
    const adapter = adapterRef.current;
    const video = videoRef.current;
    if (!session || !adapter || !video) {
      if (sessionRef.current === session) fail("The world is not ready.");
      return;
    }
    try {
      await adapter.start(video);
    } catch (error) {
      if (sessionRef.current === session && adapterRef.current === adapter) {
        fail("The world could not be entered.", error);
      }
      return;
    }
    if (
      sessionRef.current !== session ||
      adapterRef.current !== adapter ||
      session.controller.signal.aborted
    ) {
      return;
    }
    mixer.stopAll(1.5);
    horror.start();
    worldActiveRef.current = true;
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
    later(PROMPT_RULES.travelSeconds * 1000, finishWorld);
  }, [fail, later, finishWorld]);

  const doorTimeout = useCallback(() => {
    fail("The door never opened.");
  }, [fail]);

  const doorSpeak = useCallback(
    async (url: string, local?: AbortSignal): Promise<void> => {
      const session = sessionRef.current;
      if (!session) throw new DOMException("Playback aborted", "AbortError");
      await speak(
        url,
        local ? AbortSignal.any([session.controller.signal, local]) : session.controller.signal,
      );
    },
    [speak],
  );

  /* ---- Return ------------------------------------------------------------ */
  useEffect(() => {
    if (state.kind !== "return") return;
    const session = sessionRef.current;
    if (!session) return;
    const local = new AbortController();
    const signal = AbortSignal.any([session.controller.signal, local.signal]);
    mixer.playLoop("office-tone", "/audio/office-tone.mp3", 0.35, 2);
    mixer.playLoop("clock", "/audio/clock.mp3", 0.2, 2);
    speak(`${VOICE_BASE}/closing.mp3`, signal).catch((error) => {
      if (!signal.aborted) fail("Her voice could not be played.", error);
    });
    return () => local.abort();
  }, [state.kind, speak, fail]);

  const doneWithEndScene = useCallback(() => setState({ kind: "return" }), []);
  const onAvatarReady = useCallback(() => setAvatarReady(true), []);
  const onSceneError = useCallback(
    () => fail("The consulting room could not be opened."),
    [fail],
  );
  const onDoorError = useCallback(
    (error: unknown) => fail("Her voice could not be played.", error),
    [fail],
  );

  /* The office room renders under the whole session except the world act —
     it unmounts for world/endscene, freeing the GPU for the stream. */
  const inOffice =
    state.kind === "gate" ||
    state.kind === "interview" ||
    state.kind === "inferring" ||
    state.kind === "door" ||
    state.kind === "return";
  const inDoorOrWorld = state.kind === "door" || state.kind === "world";
  const shot: OfficeShot =
    state.kind === "interview"
      ? ((`q${questionIndex + 1}`) as OfficeShot)
      : state.kind === "inferring"
        ? "inferring"
        : state.kind === "door"
          ? "door"
          : state.kind === "return"
            ? "return"
            : "gate";

  return (
    <main className="app-frame">
      {/* Small-screen guard — desktop only, one line, per DESIGN. */}
      <div className="absolute inset-0 z-50 hidden items-center justify-center bg-bg max-[1024px]:flex">
        <p className="font-sans text-sm text-text-muted">Please use a larger screen.</p>
      </div>

      {inOffice && (
        <OfficeScene
          shot={shot}
          doorPhase={state.kind === "door" ? doorPhase : null}
          listening={interviewPhase === "awaiting" || interviewPhase === "answering"}
          onReady={onAvatarReady}
          onError={onSceneError}
        />
      )}

      {state.kind === "interview" && (
        <>
          {(interviewPhase === "speaking" || interviewPhase === "awaiting") && (
            <Subtitle text={QUESTIONS[questionIndex]} />
          )}
          {interviewPhase === "answering" && <Subtitle text={submitted} />}
          {interviewPhase === "ack" && <Subtitle text={ackLine} italic />}
          {interviewPhase !== "speaking" && (
            <AnswerOverlay
              onSubmit={submitAnswer}
              hidden={interviewPhase !== "awaiting"}
              disabled={interviewPhase !== "awaiting"}
            />
          )}
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
          onPhase={setDoorPhase}
          onError={onDoorError}
          onWorldEnter={enterWorld}
          onTimeout={doorTimeout}
        />
      )}

      {state.kind === "world" && adapterRef.current && (
        <MovementControls adapter={adapterRef.current} />
      )}

      {state.kind === "endscene" && <EndScene onDone={doneWithEndScene} />}

      {state.kind === "return" && profileRef.current && (
        <>
          <Notebook profile={profileRef.current} />
          <Subtitle text={LINES.closing} italic />
        </>
      )}

      {state.kind === "gate" && <Gate ready={avatarReady} onBegin={() => void begin()} />}

      {state.kind === "error" && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-bg">
          <p className="font-sans text-sm text-danger">{state.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="border border-brass/30 px-4 py-2 font-sans text-xs tracking-wide text-text-muted outline-none transition-colors hover:border-brass/60 hover:text-text focus-visible:border-brass"
          >
            Begin again
          </button>
        </div>
      )}
    </main>
  );
}
