# Exposure

A psychologist interviews you for a minute. Then you walk through her door into a real-time, navigable horror world generated from your answers — and at the end she tells you what you were actually afraid of.

Built for WORLDS LONDON, a world-model hackathon, in about ten hours.

**Live: https://worlds-lemon-zeta.vercel.app**

## The idea

The world isn't a 3D scene — it's a video model. Reactor's `happy-oyster` model generates frames in real time from a text prompt and a seed image, streamed over WebRTC. There is no mesh, no collision, no entity system. The thing pursuing you exists because the prompt says it exists; turn around and back and the world has legitimately changed. Every design decision follows from that: you can't jump-scare a morphing video, so the horror is carried by the soundscape, the grade, and a slow escalation baked into the prompt itself.

The contrast is the product: an ordinary, expensive consulting room — identical at the start and the end — against whatever your answers built.

## The experience

1. **Gate** — one click. It unlocks the audio context and mints the Reactor session token.
2. **Interview** — a prerecorded VEED presenter (lip-synced, voice by Verity) asks four fixed questions about fear. You type answers.
3. **Inference** — your answers become a structured `FearProfile` via OpenAI: a world prompt, a seed-image prompt, an escalation trajectory, and a closing line for the notebook.
4. **The door** — her last lines, an Open door button, then one more clip ("Go on. I'll be watching.") covers the black while the seed image generates and the world builds behind it.
5. **The world** — ~60 seconds of first-person travel. Hold-to-move (WASD), mouse look. At t=30s the world escalates; the sub-bass and pulse build to the cut.
6. **Return** — back in the same office, unchanged. She says one line. The notebook shows the profile she inferred.

## Stack

- **Next.js 15** (App Router, TypeScript strict) on **Vercel** — one page, one state machine, no database
- **Reactor `happy-oyster`** — the world model; the browser gets a short-lived JWT, nothing else
- **OpenAI** — `FearProfile` inference (structured outputs) and the seed image
- **Vercel Blob** — hosts the seed frame at a public URL the model fetches server-side
- **VEED / OpenEdit** — all psychologist clips are pre-rendered and committed; nothing is generated during a session
- **Web Audio** — every sound routes through one mixer (`lib/audio/mixer.ts`)

## Run locally

```bash
cp .env.example .env   # fill in the keys
pnpm install
pnpm dev               # localhost:3000
```

Required: `REACTOR_API_KEY`, `OPENAI_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_INTERVIEW_MODE=veed`. Details in `.env.example`.

## Docs

- `docs/PRD.md` — what it is, the nine features, acceptance criteria
- `docs/ARCHITECTURE.md` — state machine, `FearProfile` shape, integration specs
- `docs/DESIGN.md` — visual system: the 2.39:1 letterbox, grade, the no-spinner rule
- `content/veed/README.md` — clip provenance and VEED spending
