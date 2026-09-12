"use client";

import { useEffect, useRef, useState } from "react";
import { type PsychologistHandle } from "@/components/office/Psychologist";
import { PSYCHOLOGIST_BASE, VIDEO_INTERVIEW } from "@/content/psychologist";
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
  const [clipVisible, setClipVisible] = useState(false);
  const openedAt = useRef<number | null>(null);
  const timedOut = useRef(false);
  const clipRef = useRef<HTMLVideoElement>(null);

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

  /* The world-build cover: once the door opens she speaks one last line over
     the black, then the clip's last frame holds — her watching — until the
     world cuts in. */
  useEffect(() => {
    if (phase !== "opening" || !VIDEO_INTERVIEW) return;
    const video = clipRef.current;
    if (!video || video.src) return;
    mixer.attachMedia(video);
    video.oncanplay = () => setClipVisible(true);
    video.onerror = () => onDialogueError(new Error("The threshold clip could not be played."));
    video.src = `${PSYCHOLOGIST_BASE}/threshold.mp4`;
    void video.play().catch((error) => onDialogueError(error));
    return () => {
      video.oncanplay = null;
      video.onerror = null;
    };
  }, [phase, onDialogueError]);

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

      {/* Mounted from approach so the clip is buffered by the click; sits
          above the black once it fades in. */}
      {VIDEO_INTERVIEW && phase !== "lines" && (
        <div
          className="grade-office pointer-events-none absolute inset-x-0 overflow-hidden"
          style={{ top: "max(0px, calc((100dvh - 100vw / 2.39) / 2))", bottom: "max(0px, calc((100dvh - 100vw / 2.39) / 2))" }}
        >
          <video
            ref={clipRef}
            playsInline
            preload="auto"
            className={`breathe fade-black absolute inset-0 h-full w-full object-contain object-center ${clipVisible ? "opacity-100" : "opacity-0"}`}
            aria-label="The psychologist watching"
          />
          {/* The dark breathes around her — a held frame that reads as alive,
              never a spinner. */}
          <div className="pulse-vignette" />
        </div>
      )}
    </div>
  );
}
