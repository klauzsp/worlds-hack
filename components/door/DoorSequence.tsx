"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Subtitle } from "@/components/interview/Subtitle";
import { LINES } from "@/content/questions";
import { mixer } from "@/lib/audio/mixer";
import { PROMPT_RULES } from "@/lib/world/prompt-rules";
import { DOOR_APPROACH_MS, DOOR_OPEN_MS, DOOR_PAN_MS } from "@/components/office/shots";

export type DoorPhase = "lines" | "turn" | "approach" | "opening" | "black";

/*
 * The stretchable cover for the world build — the room itself performs it.
 * Her two lines play in sequence, the seated camera turns to the door,
 * glides to it, and the leaf swings away as the camera passes through.
 * Opening requires: approach reached, the full approach glide elapsed, the
 * world built, and the player having asked — a click at any earlier phase
 * is remembered rather than discarded.
 */
export function DoorSequence({
  worldReady,
  speak,
  onPhase,
  onError,
  onWorldEnter,
  onTimeout,
}: {
  worldReady: boolean;
  speak: (url: string, signal?: AbortSignal) => Promise<void>;
  onPhase: (phase: DoorPhase) => void;
  onError: (error: unknown) => void;
  onWorldEnter: () => void;
  onTimeout: () => void;
}) {
  const [phase, setPhase] = useState<DoorPhase>("lines");
  const [line, setLine] = useState<string>(LINES.understand);
  const [requested, setRequested] = useState(false);
  const approachAt = useRef<number | null>(null);
  const timers = useRef<number[]>([]);
  const entered = useRef(false);

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  // Her two lines in sequence, then the turn and the walk to the door.
  useEffect(() => {
    const local = new AbortController();
    let cancelled = false;
    void (async () => {
      try {
        await speak("/audio/psychologist/understand.mp3", local.signal);
        if (cancelled) return;
        setLine(LINES.direction);
        await speak("/audio/psychologist/direction.mp3", local.signal);
      } catch (error) {
        if (!cancelled) onError(error);
        return;
      }
      if (cancelled) return;
      setPhase("turn");
      later(DOOR_PAN_MS, () => {
        if (cancelled) return;
        approachAt.current = performance.now();
        setPhase("approach");
      });
    })();
    return () => {
      cancelled = true;
      local.abort();
    };
  }, [speak, onError, later]);

  // The 3D door and camera rig are driven by this phase.
  useEffect(() => onPhase(phase), [phase, onPhase]);

  // Opening waits for approach elapsed + world ready + the player's request.
  useEffect(() => {
    if (phase !== "approach" || !requested || !worldReady) return;
    const remaining = DOOR_APPROACH_MS - (performance.now() - (approachAt.current ?? 0));
    const t = window.setTimeout(() => {
      // Office ambience fades out; the sub-bass rises through the opening.
      mixer.stopLoop("office-tone", 1.5);
      mixer.stopLoop("clock", 1.5);
      mixer.playLoop("door-sub", "/audio/door-sub.mp3", 0.8, 3);
      setPhase("opening");
      // the fade lands only in the last stretch of the walk through
      const fadeT = window.setTimeout(() => setPhase("black"), DOOR_OPEN_MS - 900);
      const enterT = window.setTimeout(() => {
        if (entered.current) return;
        entered.current = true;
        onWorldEnter();
      }, DOOR_OPEN_MS);
      timers.current.push(fadeT, enterT);
    }, Math.max(0, remaining));
    timers.current.push(t);
    return () => window.clearTimeout(t);
  }, [phase, requested, worldReady, onWorldEnter]);

  // Absolute cap: never hold at the door forever.
  useEffect(() => {
    const cap = window.setTimeout(() => onTimeout(), PROMPT_RULES.doorTimeoutMs);
    timers.current.push(cap);
    return () => window.clearTimeout(cap);
  }, [onTimeout]);

  // All tracked timers die with the sequence.
  useEffect(
    () => () => {
      for (const id of timers.current) window.clearTimeout(id);
      timers.current = [];
    },
    [],
  );

  return (
    <button
      type="button"
      className="absolute inset-0 z-20 cursor-pointer outline-none"
      onClick={() => setRequested(true)}
      aria-label="Approach the door"
    >
      {(phase === "lines" || phase === "turn" || phase === "approach") && (
        <Subtitle text={line} />
      )}

      {/* Fade to black only as the camera passes the threshold. */}
      <div
        className={`fade-black door-fade pointer-events-none absolute inset-0 bg-black ${
          phase === "black" ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}
