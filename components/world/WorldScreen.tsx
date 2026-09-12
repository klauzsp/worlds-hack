"use client";

import { forwardRef, useEffect, useState } from "react";

type Dread = "calm" | "escalated" | "climax";
type Scare = "blackout" | "shake" | "glitch" | null;

/*
 * The world act. The video fills the frame under the cold-crush grade; zero
 * interface on top. A controls hint shows for 2.5s at the start and is then
 * removed permanently.
 *
 * Scares are overlays fired by a randomized scheduler — the model can't
 * jump-cut, so the frame does: blackouts (the picture that returns is
 * never quite the same), shakes on scare beats, glitch slices that read as
 * the world tearing. Frequency and violence follow the dread phase.
 */
export const WorldScreen = forwardRef<
  HTMLVideoElement,
  { visible: boolean; showHint: boolean; dread: Dread }
>(function WorldScreen({ visible, showHint, dread }, videoRef) {
  const [scare, setScare] = useState<Scare>(null);

  useEffect(() => {
    if (!visible) return;
    let dead = false;
    let fireTimer = 0;
    let clearTimer = 0;

    const fire = () => {
      if (dead) return;
      const roll = Math.random();
      const pick: Scare =
        dread === "climax"
          ? roll < 0.45
            ? "blackout"
            : roll < 0.75
              ? "glitch"
              : "shake"
          : dread === "escalated"
            ? roll < 0.4
              ? "blackout"
              : roll < 0.7
                ? "shake"
                : "glitch"
            : "blackout";
      const dur = pick === "blackout" ? 90 + Math.random() * 60 : 300;
      setScare(pick);
      clearTimer = window.setTimeout(() => setScare(null), dur);
      const gap =
        dread === "climax"
          ? 700 + Math.random() * 900
          : dread === "escalated"
            ? 4500 + Math.random() * 5000
            : 12000 + Math.random() * 9000;
      fireTimer = window.setTimeout(fire, dur + gap);
    };
    fireTimer = window.setTimeout(fire, dread === "calm" ? 8000 : 1200);
    return () => {
      dead = true;
      window.clearTimeout(fireTimer);
      window.clearTimeout(clearTimer);
    };
  }, [visible, dread]);

  const videoClass = [
    "grade-world h-full w-full object-cover",
    scare === "shake" ? (dread === "climax" ? "fx-shake-hard" : "fx-shake") : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-black transition-none ${visible ? "" : "invisible"}`}
      aria-hidden={!visible}
    >
      {/* The crawl lives on a wrapper so the shake keyframes can own the
          video's transform. The class is only applied on reveal, which is
          when the animation starts; the video itself must never remount —
          the stream is attached to it during the door phase. */}
      <div className={`h-full w-full ${visible ? "world-crawl" : ""}`}>
        <video ref={videoRef} autoPlay playsInline className={videoClass} />
      </div>
      <div className={`treatment ${dread !== "calm" ? "fx-grain-heavy" : ""}`} />
      {dread !== "calm" && <div className="pulse-vignette" />}
      {scare === "glitch" && <div className="fx-glitch" />}
      {scare === "blackout" && <div className="fx-blackout" />}
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
