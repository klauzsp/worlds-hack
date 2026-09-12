"use client";

/*
 * The room. Deliberately not a horror set: a warm, dim, expensive consulting
 * room rendered in grade and shadow rather than an image — the lobby stays
 * minimal so the contrast lands on the world act instead.
 */
export function OfficeScene({ children }: { children?: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="grade-office office-drift office-light absolute inset-0" />
      <div className="treatment" />
      <div className="letterbox top" />
      <div className="letterbox bottom" />
      {children}
    </div>
  );
}
