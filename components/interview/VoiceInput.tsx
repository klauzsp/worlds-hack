"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";

type VoiceState = "idle" | "requesting" | "recording" | "transcribing";

type Take = {
  stream: MediaStream | null;
  recorder: MediaRecorder | null;
  chunks: Blob[];
  bytes: number;
  timeout: number;
  controller: AbortController;
  released: boolean;
};

const MAX_RECORD_MS = 30_000;
const MAX_BYTES = 8 * 1024 * 1024;
const MIME_CANDIDATES = ["audio/webm;codecs=opus", "audio/mp4"];
const transcriptSchema = z.object({ text: z.string().trim().min(1).max(500) });

/*
 * Push-to-talk. Press and hold to record; release sends the take to
 * /api/transcribe and the transcript lands in the input — it never sends
 * itself. Permission is only requested on a deliberate press, and every
 * path (cancel, blur, unmount, error, oversize) stops the tracks. Each
 * attempt is its own Take object so a stale release or unmount can never
 * transcribe the wrong recording or stop a newer take's tracks.
 */
export function VoiceInput({
  onTranscript,
  disabled,
  onBusyChange,
}: {
  onTranscript: (text: string) => void;
  disabled: boolean;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState<string | null>(null);
  const active = useRef<Take | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    onBusyChange?.(state !== "idle");
  }, [state, onBusyChange]);

  const setIdle = () => {
    if (mounted.current) setState("idle");
  };

  const discard = (take: Take) => {
    if (active.current !== take) return;
    active.current = null;
    take.controller.abort();
    window.clearTimeout(take.timeout);
    const rec = take.recorder;
    take.recorder = null;
    if (rec && rec.state !== "inactive") rec.stop();
    take.stream?.getTracks().forEach((t) => t.stop());
    take.stream = null;
    setIdle();
  };

  useEffect(() => {
    mounted.current = true;
    const onHide = () => {
      if (active.current) discard(active.current);
    };
    const onVisibility = () => {
      if (document.hidden && active.current) discard(active.current);
    };
    window.addEventListener("blur", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mounted.current = false;
      window.removeEventListener("blur", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
      if (active.current) discard(active.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transcribe = async (take: Take, blob: Blob, mime: string) => {
    if (active.current !== take) return;
    setState("transcribing");
    try {
      const form = new FormData();
      form.append("audio", blob, mime.startsWith("audio/mp4") ? "answer.mp4" : "answer.webm");
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: form,
        signal: take.controller.signal,
      });
      if (!res.ok) {
        const body = z
          .object({ error: z.string() })
          .safeParse(await res.json().catch(() => null));
        throw new Error(
          body.success ? body.data.error : "Transcription failed — you can keep typing.",
        );
      }
      const parsed = transcriptSchema.safeParse(await res.json().catch(() => null));
      if (!parsed.success) throw new Error("Transcription failed — you can keep typing.");
      if (active.current === take) onTranscript(parsed.data.text);
    } catch (e) {
      if (active.current === take && !(e instanceof DOMException && e.name === "AbortError")) {
        setError(e instanceof Error ? e.message : "Transcription failed — you can keep typing.");
      }
    } finally {
      if (active.current === take) {
        active.current = null;
        setIdle();
      }
    }
  };

  const begin = async () => {
    if (disabled || active.current) return;
    const take: Take = {
      stream: null,
      recorder: null,
      chunks: [],
      bytes: 0,
      timeout: 0,
      controller: new AbortController(),
      released: false,
    };
    active.current = take;
    const isCurrent = () => active.current === take;
    setError(null);
    setState("requesting");

    let mic: MediaStream;
    try {
      mic = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      if (isCurrent()) {
        active.current = null;
        setError("Microphone permission was denied — you can keep typing.");
        setIdle();
      }
      return;
    }
    if (take.released || !isCurrent()) {
      mic.getTracks().forEach((t) => t.stop());
      return;
    }
    take.stream = mic;

    let rec: MediaRecorder;
    try {
      const mime = MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported(m));
      if (!mime) throw new Error("unsupported");
      rec = new MediaRecorder(mic, { mimeType: mime });
      take.recorder = rec;
      rec.ondataavailable = (e) => {
        if (!isCurrent() || e.data.size === 0) return;
        take.chunks.push(e.data);
        take.bytes += e.data.size;
        if (take.bytes > MAX_BYTES) {
          discard(take);
          if (mounted.current) setError("That recording is too long — you can keep typing.");
        }
      };
      rec.onerror = () => {
        if (!isCurrent()) return;
        discard(take);
        if (mounted.current) setError("Recording failed — you can keep typing.");
      };
      rec.onstop = () => {
        const blob = new Blob(take.chunks, { type: mime });
        take.chunks = [];
        take.stream?.getTracks().forEach((t) => t.stop());
        take.stream = null;
        if (!isCurrent()) return;
        void transcribe(take, blob, mime);
      };
      rec.start(250);
    } catch {
      mic.getTracks().forEach((t) => t.stop());
      take.stream = null;
      take.recorder = null;
      if (isCurrent()) {
        active.current = null;
        setError("Voice input is not supported in this browser — you can keep typing.");
        setIdle();
      }
      return;
    }

    setState("recording");
    take.timeout = window.setTimeout(() => {
      if (isCurrent() && take.recorder && take.recorder.state === "recording") {
        take.recorder.stop();
      }
    }, MAX_RECORD_MS);
  };

  const end = () => {
    const take = active.current;
    if (!take) return;
    if (take.recorder && take.recorder.state === "recording") {
      take.recorder.stop();
      return;
    }
    if (!take.recorder) {
      take.released = true;
      active.current = null;
      setIdle();
    }
  };

  const label =
    state === "requesting"
      ? "Asking for the microphone…"
      : state === "recording"
        ? "Listening… release to finish"
        : state === "transcribing"
          ? "Transcribing…"
          : "Hold to speak";

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        disabled={disabled}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            /* synthetic or already-released pointers have no capture */
          }
          void begin();
        }}
        onPointerUp={end}
        onPointerCancel={() => {
          if (active.current) discard(active.current);
        }}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            if (!e.repeat) void begin();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            end();
          }
        }}
        className="border border-brass/30 px-4 py-2 font-sans text-xs tracking-wide text-text-muted outline-none transition-colors hover:border-brass/60 hover:text-text focus-visible:border-brass disabled:opacity-40"
      >
        {label}
      </button>
      {error && <p className="font-sans text-xs text-danger">{error}</p>}
    </div>
  );
}
