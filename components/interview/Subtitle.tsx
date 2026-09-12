"use client";

export function Subtitle({ text, italic = false }: { text: string; italic?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 z-20 flex justify-center">
      <div className="subtitle-scrim" />
      <p
        key={text}
        className={`subtitle-in subtitle-text relative max-w-[52ch] px-8 text-center font-serif text-lg leading-[1.5] tracking-[0.01em] text-office-cream ${
          italic ? "italic" : ""
        }`}
      >
        {text}
      </p>
    </div>
  );
}
