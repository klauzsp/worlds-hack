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
 * The stretchable cover for the world build. Plays her closing lines, shows
 * the Open door button, and holds on black with the sub-bass rising until
 * the world reports ready. Never shows an indicator.
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

  function openDoor() {
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
    >
      {phase === "approach" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={openDoor}
            className="cursor-pointer border border-text-muted/40 px-10 py-3 font-serif text-lg text-text transition-colors hover:border-text hover:bg-text/5"
          >
            Open door
          </button>
        </div>
      )}

      {(phase === "lines" || phase === "approach") && <Subtitle text={line} />}

      {/* Fade to black once the door opens. */}
      <div
        className={`fade-black pointer-events-none absolute inset-0 bg-black ${
          phase === "opening" || phase === "black" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
