/*
 * Phrasings confirmed against the HappyOyster content gate (403004/403005).
 * Phase 0 finding, recorded per CLAUDE.md — extend as the sandbox reveals walls.
 *
 * PASSES (implication):
 *   "a figure at the end of the street, closer than before"
 *   "something metal catching the light"
 *   "the shape has stopped pretending to be still"
 *   "footsteps that are not yours"
 *
 * REFUSED (description):
 *   explicit weapons, wounds, chases framed as attacks, gore, named harm.
 *
 * The model renders the nouns a prompt supplies — negation places the noun
 * anyway. Never write "no X"; write what occupies the space instead.
 *
 * API reality vs the design docs (measured against @reactor-models/happy-oyster):
 *   - Adventure mode exposes no live text channel at all: instruct() is
 *     rejected at runtime ("Cannot send instruct … mode 1, wanderV2"). The
 *     escalation therefore lives entirely in the prompt — the profile's
 *     escalationPrompt is folded into the world prompt at build time.
 *   - There is no audio-prompt parameter. audioPrompt is folded into the world
 *     prompt as a soundscape sentence; joint audio honours it when present and
 *     the sound nouns still shape the visuals when it is not.
 *   - firstFrameImageUrl must be publicly fetchable — the model downloads it
 *     server-side. The Blob upload path resolves to a session-internal URL
 *     upstream cannot reach (action_error 400001); serve the bytes yourself.
 *   - First-frame images must be landscape, width/height ratio 1.5–2.0.
 *     We generate seeds at 1536x1024 (1.5).
 *   - Adventure travels default to 60s; the granted budget is readable from
 *     maxExperienceTimeSec (one of 60 | 90 | 120).
 */
export const PROMPT_RULES = {
  seedAspect: { width: 1536, height: 1024 },
  travelSeconds: 60,
  doorTimeoutMs: 150_000,
} as const;
