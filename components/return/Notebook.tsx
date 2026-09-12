"use client";

import { useEffect, useState } from "react";
import type { FearProfile } from "@/lib/types";

const CHAR_MS = 32;
const LINE_PAUSE_MS = 600;

/*
 * The reveal. The three lines she wrote — the proof the world came from the
 * player's own answers — typed out one at a time on a paper tone. The only
 * element in the app permitted a paper texture.
 */
export function Notebook({ profile }: { profile: FearProfile }) {
  const [written, setWritten] = useState<string[]>([]);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    let cancelled = false;
    const lines = profile.notebookLines;
    let lineIdx = 0;
    let charIdx = 0;

    function tick() {
      if (cancelled || lineIdx >= lines.length) return;
      const line = lines[lineIdx];
      if (charIdx < line.length) {
        charIdx += 1;
        setCurrent(line.slice(0, charIdx));
        window.setTimeout(tick, CHAR_MS);
      } else {
        setWritten((w) => [...w, line]);
        setCurrent("");
        lineIdx += 1;
        charIdx = 0;
        window.setTimeout(tick, LINE_PAUSE_MS);
      }
    }

    window.setTimeout(tick, 400);
    return () => {
      cancelled = true;
    };
  }, [profile]);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <div
        className="w-full max-w-[52ch] px-12 py-10"
        style={{
          background:
            "linear-gradient(160deg, #efe6d4 0%, #e6dbc4 55%, #ddd0b6 100%)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div className="font-serif text-base leading-[1.65] notebook-ink">
          {written.map((line, i) => (
            <p key={i} className="mb-4 underline decoration-burgundy/40 underline-offset-4">
              {line}
            </p>
          ))}
          {current && (
            <p className="mb-4">
              {current}
              <span className="caret-blink text-burgundy">▏</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
