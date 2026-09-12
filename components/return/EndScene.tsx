"use client";

import { useEffect, useRef } from "react";

/*
 * The hard cut. A fixed, pre-rendered file — identical for every player,
 * bundled in the repo, never generated. If it cannot play we skip straight
 * to the return rather than sit on black.
 */
export function EndScene({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnd = () => onDone();
    const onError = () => onDone();
    video.addEventListener("ended", onEnd);
    video.addEventListener("error", onError);
    video.play().catch(onError);
    return () => {
      video.removeEventListener("ended", onEnd);
      video.removeEventListener("error", onError);
    };
  }, [onDone]);

  return (
    <div className="absolute inset-0 z-20 bg-black">
      <video
        ref={videoRef}
        src="/video/endscene.mp4"
        playsInline
        className="h-full w-full object-cover"
      />
      <div className="treatment" />
      <div className="letterbox top" />
      <div className="letterbox bottom" />
    </div>
  );
}
