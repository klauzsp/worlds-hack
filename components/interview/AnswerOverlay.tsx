"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_ANSWER_LENGTH } from "@/content/questions";
import { VoiceInput } from "./VoiceInput";

/*
 * The answer composer — a floating lower third over the room, not a wash.
 * Typed or spoken, the text is always reviewed before it sends: voice
 * populates the draft, never submits. A rejected submission keeps the text.
 */
export function AnswerOverlay({
  onSubmit,
  hidden = false,
  disabled = false,
}: {
  onSubmit: (answer: string) => Promise<void>;
  hidden?: boolean;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [sending, setSending] = useState(false);
  const [voiceBusy, setVoiceBusy] = useState(false);
  const lock = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shakeTimer = useRef(0);

  useEffect(() => {
    if (!busy && !hidden) inputRef.current?.focus();
  });

  useEffect(() => () => window.clearTimeout(shakeTimer.current), []);

  const busy = disabled || sending || voiceBusy;

  async function submit() {
    const answer = value.trim();
    if (!answer) {
      setShake(true);
      window.clearTimeout(shakeTimer.current);
      shakeTimer.current = window.setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
      return;
    }
    if (lock.current || busy) return;
    lock.current = true;
    setSending(true);
    setError(null);
    try {
      await onSubmit(answer);
    } catch {
      setError("Your answer could not be played back. Try sending it again.");
      inputRef.current?.focus();
    } finally {
      lock.current = false;
      setSending(false);
    }
  }

  return (
    <div className={`answer-composer z-30 ${hidden ? "invisible" : "overlay-in"}`} aria-hidden={hidden}>
      <div className={`input-rise w-full max-w-[52ch] ${shake ? "reject" : ""}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            disabled={busy}
            onChange={(e) => setValue(e.target.value.slice(0, MAX_ANSWER_LENGTH))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!e.nativeEvent.isComposing) void submit();
              }
            }}
            className="w-full min-w-0 border-b border-brass/20 bg-transparent pb-2 text-center font-sans text-sm text-text caret-burgundy outline-none focus:border-brass/60 disabled:opacity-40"
            autoComplete="off"
            spellCheck={false}
            aria-label="Your answer"
          />
          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="shrink-0 whitespace-nowrap border border-brass/30 px-4 py-2 font-sans text-xs tracking-wide text-text-muted outline-none transition-colors hover:border-brass/60 hover:text-text focus-visible:border-brass focus-visible:outline focus-visible:outline-brass disabled:opacity-40"
            >
              Send answer
            </button>
            <div className="shrink-0">
              <VoiceInput
                disabled={disabled || sending}
                onBusyChange={setVoiceBusy}
                onTranscript={(text) => setValue(text.slice(0, MAX_ANSWER_LENGTH))}
              />
            </div>
          </div>
        </form>
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="font-sans text-xs text-text-muted">
            Microphone audio is sent to OpenAI for transcription. Review the text before sending.
          </p>
          {value.length > 400 && (
            <p className="shrink-0 font-sans text-xs text-text-muted">
              {value.length} / {MAX_ANSWER_LENGTH}
            </p>
          )}
        </div>
        {error && <p className="mt-2 text-center font-sans text-xs text-danger">{error}</p>}
      </div>
    </div>
  );
}
