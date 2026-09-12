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
 *   - Adventure mode exposes no set_prompt. The only live text channel is
 *     instruct(), documented for Directing worlds; we fire it once at t=30s and
 *     log the ack. The worldPrompt carries the escalation trajectory itself so
 *     the world tightens regardless.
 *   - There is no audio-prompt parameter. audioPrompt is folded into the world
 *     prompt as a soundscape sentence; joint audio honours it when present and
 *     the sound nouns still shape the visuals when it is not.
 *   - First-frame images must be landscape, width/height ratio 1.5–2.0.
 *     We generate seeds at 1280x768 (1.667).
 *   - Adventure travels default to 60s; the granted budget is readable from
 *     maxExperienceTimeSec (one of 60 | 90 | 120).
 */
export const PROMPT_RULES = {
  seedAspect: { width: 1280, height: 768 },
  travelSeconds: 60,
  escalationAtSec: 30,
  doorTimeoutMs: 150_000,
} as const;
