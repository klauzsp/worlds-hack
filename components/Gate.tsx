"use client";

export function Gate({ onBegin, ready }: { onBegin: () => void; ready: boolean }) {
  return (
    <button
      type="button"
      onClick={onBegin}
      disabled={!ready}
      className="absolute inset-0 z-20 flex h-full w-full cursor-pointer flex-col items-center justify-center bg-bg/70 outline-none backdrop-blur-[2px] disabled:cursor-default"
      aria-label="Begin"
    >
      <h1 className="font-serif text-2xl tracking-[0.01em] text-text">Exposure</h1>
      <p className="mt-4 font-sans text-xs text-text-muted">
        Sit down. Put on headphones. Click to begin.
      </p>
      <p className="mt-2 font-sans text-xs text-text-muted">
        AI-generated voices · Headphones recommended
      </p>
    </button>
  );
}
