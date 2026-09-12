# Exposure

A psychologist interviews you for forty seconds. Then you walk through a door into a real-time, navigable world generated from your answers — built for WORLDS LONDON (world-model hackathon, 12 Sep 2026).

Spec lives in `docs/` — read `PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`. Working rules in `CLAUDE.md`.

## Run

```bash
cp .env.example .env.local   # fill in REACTOR_API_KEY, OPENAI_API_KEY, RUNWARE_API_KEY
pnpm install
pnpm dev                     # localhost:3000
```

## Flow

gate → 4 fixed typed questions → OpenAI structured `FearProfile` → Runware seed image → Reactor `happy-oyster-adventure` world (60s, first-person, WASD hold-to-move) → escalation instruction at t=30s → hard cut to end scene → notebook reveal.

## Assets

Committed audio placeholders are `say`-rendered. Regenerate with real TTS once `RUNWARE_API_KEY` is set:

```bash
pnpm generate:assets
```

## Notes

- Adventure mode has no `set_prompt` — the t=30s escalation uses `instruct()` (the only live text channel) and the world prompt itself carries the escalation trajectory. See `lib/world/prompt-rules.ts`.
- There is no audio-prompt parameter on the world model; `audioPrompt` is folded into the world prompt.
- The office interview supports the generated VEED presenter or the original audio mode.

## VEED interview clips

A prerecorded video interview can be selected with `NEXT_PUBLIC_INTERVIEW_MODE=veed` after the full clip set is installed. It plays the same four questions and opens each answer overlay when the corresponding video ends. Voice comes from the video through the existing audio mixer. The presenter listens silently during answers and acknowledgement subtitles. Door and return lines use the same presenter. World inference, Runware and Happy Oyster controls are unchanged.

All seven generated clips and the silent listening loop are installed in `public/video/psychologist/`. Set `NEXT_PUBLIC_INTERVIEW_MODE=veed` in your local environment and restart the server to use them; `audio` selects the original interview. Generation scripts and spending notes are in `content/veed/`. No VEED generation runs during gameplay.
