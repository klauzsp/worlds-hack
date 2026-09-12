"use client";

/*
 * The room. Deliberately not a horror set: a warm, dim, expensive consulting
 * room rendered in grade and shadow rather than an image — the lobby stays
 * minimal so the contrast lands on the world act instead.
 */
export function OfficeScene({ children }: { children?: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="grade-office office-drift absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 42%, rgba(217,199,167,0.14) 0%, rgba(58,42,30,0.35) 45%, rgba(10,9,8,0.97) 100%)",
        }}
      />
      <div className="treatment" />
      <div className="letterbox top" />
      <div className="letterbox bottom" />
      {children}
    </div>
  );
}
