/** Enable only after the complete, verified clip set is installed. */
export const VIDEO_INTERVIEW = process.env.NEXT_PUBLIC_INTERVIEW_MODE === "veed";
export const PSYCHOLOGIST_BASE = "/video/psychologist-landscape";
export type PsychologistLine = "q1" | "q2" | "q3" | "q4" | "understand" | "direction" | "closing";
