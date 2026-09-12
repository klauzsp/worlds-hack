"use client";

export function Gate({ onBegin }: { onBegin: () => void }) {
  return (
    <button
      type="button"
      onClick={onBegin}
      className="absolute inset-0 z-20 flex h-full w-full cursor-pointer flex-col items-center justify-center bg-bg outline-none"
      aria-label="Begin"
    >
      <h1 className="font-serif text-2xl tracking-[0.01em] text-text">Exposure</h1>
      <p className="mt-4 font-sans text-xs text-text-muted">
        Sit down. Put on headphones. Click to begin.
      </p>
    </button>
  );
}
