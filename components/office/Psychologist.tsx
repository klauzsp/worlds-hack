"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { mixer } from "@/lib/audio/mixer";
import { PSYCHOLOGIST_BASE, type PsychologistLine } from "@/content/psychologist";

export type PsychologistHandle = { play: (line: PsychologistLine) => Promise<void> };

/** One audible video at a time. Idle stays underneath to avoid flashes between lines. */
export const Psychologist = forwardRef<PsychologistHandle>(function Psychologist(_, ref) {
  const speechRef = useRef<HTMLVideoElement>(null);
  const pendingRef = useRef<(() => void) | null>(null);

  useImperativeHandle(ref, () => ({
    play(line) {
      const video = speechRef.current;
      if (!video) return Promise.reject(new Error("The psychologist video is unavailable."));
      pendingRef.current?.();
      mixer.attachMedia(video);
      video.style.opacity = "1";
      return new Promise<void>((resolve, reject) => {
        let settled = false;
        const finish = (error?: Error) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          video.onended = null;
          video.onerror = null;
          video.pause();
          video.style.opacity = "0";
          pendingRef.current = null;
          if (error) reject(error); else resolve();
        };
        const timer = window.setTimeout(() => finish(new Error("The psychologist video stalled.")), 60_000);
        pendingRef.current = () => finish(new Error("Psychologist playback cancelled."));
        video.onended = () => finish();
        video.onerror = () => finish(new Error(`The psychologist clip ${line} could not be played.`));
        video.src = `${PSYCHOLOGIST_BASE}/${line}.mp4`;
        void video.play().catch(() => finish(new Error("The psychologist video could not start.")));
      });
    },
  }), []);

  useEffect(() => () => {
    // Strict Mode replays a newly mounted child's effects while its parent
    // may already be playing a line. Cancel only after a real unmount.
    queueMicrotask(() => {
      if (!speechRef.current) pendingRef.current?.();
    });
  }, []);

  return (
    <div className="grade-office absolute inset-0 overflow-hidden">
      <video src={`${PSYCHOLOGIST_BASE}/idle.webm`} autoPlay loop muted playsInline
        className="absolute inset-0 h-full w-full object-cover object-top" aria-hidden="true" />
      <video ref={speechRef} playsInline preload="auto" style={{ opacity: 0 }}
        className="absolute inset-0 h-full w-full object-cover object-top" aria-label="The psychologist speaking" />
    </div>
  );
});
