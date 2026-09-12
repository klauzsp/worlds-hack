"use client";

export function Subtitle({ text, italic = false }: { text: string; italic?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 z-20 flex justify-center">
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top, rgba(10,9,8,0.72), transparent)" }}
      />
      <p
        key={text}
        className={`subtitle-in relative max-w-[52ch] px-8 text-center font-serif text-lg leading-[1.5] tracking-[0.01em] text-office-cream ${
          italic ? "italic" : ""
        }`}
        style={{ textShadow: "0 1px 12px rgba(10,9,8,0.9)" }}
      >
        {text}
      </p>
    </div>
  );
}
