"use client";

import { useEffect, useRef, useState } from "react";
import { type PsychologistHandle } from "@/components/office/Psychologist";
import { VIDEO_INTERVIEW } from "@/content/psychologist";
import { Subtitle } from "@/components/interview/Subtitle";
import { LINES } from "@/content/questions";
import { mixer } from "@/lib/audio/mixer";
import { PROMPT_RULES } from "@/lib/world/prompt-rules";

type DoorPhase = "lines" | "approach" | "opening" | "black";

/*
 * The stretchable cover for the world build. Plays her closing lines, waits
 * for the approach click, parts the door, and holds on black with the
 * sub-bass rising until the world reports ready. Never shows an indicator.
 */
export function DoorSequence({
  worldReady,
  onWorldEnter,
  onTimeout,
  onDialogueError,
  playDialogue,
}: {
  worldReady: boolean;
  onWorldEnter: () => void;
  onTimeout: () => void;
  onDialogueError: (error: unknown) => void;
  playDialogue: PsychologistHandle["play"];
}) {
  const [phase, setPhase] = useState<DoorPhase>("lines");
  const [line, setLine] = useState<string>(LINES.understand);
  const openedAt = useRef<number | null>(null);
  const timedOut = useRef(false);

  // Her two lines — spoken if the pre-baked files exist — then approach.
  useEffect(() => {
    if (VIDEO_INTERVIEW) {
      let cancelled = false;
      void (async () => {
        try {
          await playDialogue("understand");
          if (cancelled) return;
          setLine(LINES.direction);
          await playDialogue("direction");
          if (!cancelled) setPhase("approach");
        } catch (error) {
          if (!cancelled) {
            console.error("Door dialogue failed", error);
            onDialogueError(error);
          }
        }
      })();
      return () => { cancelled = true; };
    }
    const tryPlay = (name: string) =>
      fetch(`/audio/psychologist/${name}.mp3`, { method: "HEAD" })
        .then((r) => (r.ok ? mixer.playOnce(`/audio/psychologist/${name}.mp3`) : Promise.resolve()))
        .catch(() => undefined);

    const first = window.setTimeout(() => {
      setLine(LINES.direction);
      void tryPlay("direction");
    }, 2200);
    const second = window.setTimeout(() => setPhase("approach"), 4800);
    void tryPlay("understand");
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
    };
  }, [onTimeout, onDialogueError, playDialogue]);

  // Absolute cap: never hold on black forever.
  useEffect(() => {
    const cap = window.setTimeout(() => {
      if (!timedOut.current) {
        timedOut.current = true;
        onTimeout();
      }
    }, PROMPT_RULES.doorTimeoutMs);
    return () => window.clearTimeout(cap);
  }, [onTimeout]);

  // When the world is ready, finish the fade to black then hand over.
  useEffect(() => {
    if (phase === "opening" && worldReady && openedAt.current !== null) {
      const elapsed = Date.now() - openedAt.current;
      const remaining = Math.max(0, 1500 - elapsed);
      const t = window.setTimeout(onWorldEnter, remaining);
      return () => window.clearTimeout(t);
    }
  }, [phase, worldReady, onWorldEnter]);

  function approach() {
    // A click while her line is still playing skips it forward — never
    // ignore input; the door only opens from the approach beat.
    if (phase === "lines" && VIDEO_INTERVIEW) return;
    if (phase === "lines") {
      setPhase("approach");
      return;
    }
    if (phase !== "approach") return;
    openedAt.current = Date.now();
    // Office ambience fades out; the sub-bass fades in and stays through black.
    mixer.stopLoop("office-tone", 1.5);
    mixer.stopLoop("clock", 1.5);
    mixer.playLoop("door-sub", "/audio/door-sub.mp3", 0.8, 3);
    setPhase("opening");
  }

  return (
    <div
      className={`absolute inset-0 z-20 ${VIDEO_INTERVIEW && (phase === "lines" || phase === "approach") ? "" : "bg-bg"}`}
      onClick={approach}
      role={phase === "approach" ? "button" : undefined}
      aria-label={phase === "approach" ? "Approach the door" : undefined}
    >
      {/* The door: a vertical seam of darkness that parts on approach. */}
      <div className={`absolute inset-0 flex items-center justify-center ${VIDEO_INTERVIEW && phase === "lines" ? "invisible" : ""}`}>
        <div className="relative h-[62dvh] w-[24dvh] overflow-hidden">
          <div className="absolute inset-0 bg-walnut/20" />
          <div
            className={`door-panel absolute inset-y-0 left-0 w-1/2 bg-[#120d09] ${
              phase !== "lines" && phase !== "approach" ? "-translate-x-full" : ""
            }`}
            style={{ transitionProperty: "transform" }}
          />
          <div
            className={`door-panel absolute inset-y-0 right-0 w-1/2 bg-[#120d09] ${
              phase !== "lines" && phase !== "approach" ? "translate-x-full" : ""
            }`}
            style={{ transitionProperty: "transform" }}
          />
        </div>
      </div>

      {phase === "approach" && <Subtitle text={line} />}
      {phase === "lines" && <Subtitle text={line} />}

      {/* Fade to black once the door opens. */}
      <div
        className={`fade-black pointer-events-none absolute inset-0 bg-black ${
          phase === "opening" || phase === "black" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
