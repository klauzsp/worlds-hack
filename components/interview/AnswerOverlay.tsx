"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_ANSWER_LENGTH } from "@/content/questions";

export function AnswerOverlay({
  onSubmit,
}: {
  onSubmit: (answer: string) => void;
}) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submit() {
    const answer = value.trim();
    if (!answer) {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
      return;
    }
    onSubmit(answer);
  }

  return (
    <div className="overlay-in absolute inset-0 z-30 flex items-center justify-center bg-overlay">
      <div className={`input-rise w-full max-w-[52ch] px-8 ${shake ? "reject" : ""}`}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_ANSWER_LENGTH))}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          className="w-full border-b border-brass/20 bg-transparent pb-2 text-center font-sans text-sm text-text caret-burgundy outline-none focus:border-brass/60"
          autoComplete="off"
          spellCheck={false}
          aria-label="Your answer"
        />
        {value.length > 400 && (
          <p className="mt-3 text-center font-sans text-xs text-text-muted">
            {value.length} / {MAX_ANSWER_LENGTH}
          </p>
        )}
      </div>
    </div>
  );
}
