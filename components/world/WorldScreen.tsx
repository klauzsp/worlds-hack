"use client";

import { forwardRef } from "react";

/*
 * The world act. The video fills the frame under the cold-crush grade; zero
 * interface on top. A controls hint shows for 2.5s at the start and is then
 * removed permanently. At escalation a slow breathing vignette closes in —
 * the walls feel tighter even when the frame hasn't changed.
 */
export const WorldScreen = forwardRef<
  HTMLVideoElement,
  { visible: boolean; showHint: boolean; escalated: boolean }
>(function WorldScreen({ visible, showHint, escalated }, videoRef) {
  return (
    <div
      className={`absolute inset-0 bg-black transition-none ${visible ? "" : "invisible"}`}
      aria-hidden={!visible}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="grade-world h-full w-full object-cover"
      />
      <div className="treatment" />
      {escalated && <div className="pulse-vignette" />}
      <div className="letterbox top" />
      <div className="letterbox bottom" />
      {visible && showHint && (
        <div className="hint-out pointer-events-none absolute inset-x-0 bottom-16 z-20 flex justify-center">
          <p className="font-sans text-xs tracking-wide text-text-muted">
            Click to take control · W A S D move · mouse look · Q look back · shift run
          </p>
        </div>
      )}
    </div>
  );
});
