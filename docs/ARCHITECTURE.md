# Architecture: Exposure

> How the system is built and how its parts relate.
> Feature behaviour → PRD.md. Visual system → DESIGN.md.
> There is no database and no persistence, so there is no DATA_MODEL.md.

## Stack

- Frontend: Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind v4
- Backend: Next.js route handlers only. No separate service, no Python, no Modal.
- State: React state plus one in-memory `Map<string, Session>` in a server module. Lost on redeploy — acceptable and intended.
- World model: Reactor, `@reactor-team/js-sdk`, model `reactor/happy-oyster-adventure`
- LLM: OpenAI, structured outputs with a strict JSON schema
- Generative media: Runware, `@runware/sdk` — seed image, psychologist TTS, office image
- Validation: Zod on every external response
- Hosting: Vercel

**Pinned packages:** `next@15.x` · `react@19.x` · `typescript@5.x` · `tailwindcss@4.x` · `@reactor-team/js-sdk@latest` · `@runware/sdk@latest` · `openai@latest` · `zod@3.x`

**Environment variables** (all server-only; none prefixed `NEXT_PUBLIC_` except the app URL):
```
REACTOR_API_KEY=rk_...
OPENAI_API_KEY=sk-...
RUNWARE_API_KEY=...
VEED_API_KEY=              # optional, Phase 7 only
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## System pattern

Single Next.js deployment, client-driven state machine, thin server routes that exist only to hold API keys.

The entire app is one state machine with eight states: `gate → office → interview → inferring → door → world → endscene → return`. There is no router navigation between them; they are conditional renders inside one page driven by a discriminated union. This is deliberate — the audio context, the Reactor session, and the ambience layers must all survive the whole session, and unmounting them to navigate would kill them.

The server does no orchestration. It mints tokens and proxies three API calls. Nothing clever lives on the server.

## Data flow

```
[gate click] → mint Reactor JWT (POST /api/reactor/token) → hold in client state

[4 typed answers] → POST /api/profile
                        → OpenAI structured output
                        → Zod validate
                        → FearProfile (contains all prompts)

[FearProfile] ──┬─→ POST /api/seed-image → Runware → image URL ─┐
                │                                               │
                └─→ (door sequence plays, stretchable) ──────────┤
                                                                 ▼
                                    browser → Reactor session (WebRTC)
                                    set perspective · set image · set prompt ·
                                    set audio prompt · start
                                                                 │
                                    video + native audio ← ──────┘
                                                                 │
                                    t=30s: set_prompt(escalationPrompt)
                                    t=60s: hard cut → end scene → return
```

Media never transits the server. The browser connects to Reactor over WebRTC directly using the short-lived JWT.

## The FearProfile contract

This is the only structured object in the system and every downstream feature depends on it. It is defined once in `lib/types.ts` and validated by a Zod schema in `lib/profile/schema.ts`.

```ts
type FearProfile = {
  fearLabel: string            // short internal label, e.g. "pursued_at_night"
  entity: string               // what is present with the player
  setting: string              // where
  timeOfDay: string
  weather: string
  seedImagePrompt: string      // first-person POV, fed to Runware
  worldPrompt: string          // fed to the world model at start
  escalationPrompt: string     // fed at t=30s
  audioPrompt: string          // fed to the world model's native audio
  notebookLines: [string, string, string]  // shown in F9
}
```

The LLM writes the prompt fields. The app never assembles a prompt by string concatenation from a label — that approach produces generic worlds and is explicitly rejected.

## Service boundaries and developer ownership

Two developers. These file boundaries are a hard contract; crossing them causes merge conflicts that will cost you the demo.

| Owner | Files |
|---|---|
| **Dev A** | `app/api/profile/`, `app/api/tts/`, `components/office/**`, `components/interview/**`, `components/return/**`, `lib/profile/**`, `lib/audio/**`, `content/questions.ts` |
| **Dev B** | `app/api/reactor/`, `app/api/seed-image/`, `components/world/**`, `lib/world/**` |
| **Both — agree before editing** | `app/page.tsx` (the state machine), `lib/types.ts`, `app/globals.css` |

## Directory structure

This is a contract. Create exactly this tree.

```
exposure/
├── CLAUDE.md
├── .env.example
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   └── DESIGN.md
├── public/
│   ├── audio/
│   │   ├── office-tone.mp3        # looping room tone
│   │   ├── clock.mp3              # looping
│   │   ├── pen-scratch.mp3        # one-shot, per question
│   │   ├── door-sub.mp3           # rising sub-bass, door sequence
│   │   └── psychologist/          # cached TTS, generated at build time
│   ├── images/
│   │   ├── office.jpg             # generated once, committed
│   │   └── psychologist.jpg       # generated once, committed
│   └── video/
│       └── endscene.mp4           # fixed, non-personalised
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                   # THE state machine — single source of flow
│   └── api/
│       ├── reactor/token/route.ts # mints JWT, never exposes rk_ key
│       ├── seed-image/route.ts    # Runware image
│       ├── profile/route.ts       # OpenAI structured output
│       └── tts/route.ts           # Runware TTS, for uncached lines only
├── components/
│   ├── Gate.tsx
│   ├── office/
│   │   ├── OfficeScene.tsx        # image + drift + grade
│   │   └── Psychologist.tsx       # portrait + breathing loop
│   ├── interview/
│   │   ├── Subtitle.tsx
│   │   └── AnswerOverlay.tsx      # the typed-input popup
│   ├── door/
│   │   └── DoorSequence.tsx       # stretchable transition
│   ├── world/
│   │   ├── WorldScreen.tsx        # full-bleed video + timers
│   │   └── MovementControls.tsx   # hold-to-move keybinds
│   └── return/
│       ├── EndScene.tsx
│       └── Notebook.tsx
├── lib/
│   ├── types.ts                   # FearProfile, SessionState, AppState union
│   ├── session.ts                 # in-memory Map (server)
│   ├── profile/
│   │   ├── schema.ts              # Zod schema for FearProfile
│   │   └── system-prompt.ts       # the inference prompt
│   ├── world/
│   │   ├── adapter.ts             # WorldModel interface + Happy Oyster impl
│   │   └── prompt-rules.ts        # phrasings that pass the model filter
│   └── audio/
│       └── mixer.ts               # Web Audio layer management
└── content/
    └── questions.ts               # the four fixed questions + acknowledgements
```

## Integrations

### Reactor — the world
- **Purpose:** the entire second act. A live, navigable, audible video stream generated from the seed image and prompts.
- **Model:** `reactor/happy-oyster-adventure`, `perspective: first_person`.
- **Auth:** server POSTs `REACTOR_API_KEY` (an `rk_...` key) to `https://api.reactor.inc/tokens` and returns a short-lived JWT. The `rk_` key must never reach the browser. **Mint the JWT at the gate click, not at page load** — a token minted before a 60-second interview may expire before the world connects.
- **Command schema:** *not documented here, because it must not be guessed.* Phase 0 is reading the Happy Oyster Adventure schema page on `docs.reactor.inc` and writing `lib/world/adapter.ts` against the real command names. Reactor exposes an MCP server at `https://docs.reactor.inc/mcp` and every docs page is available as clean Markdown by appending `.md` to the URL.
- **Known behaviours that will bite you, confirmed across Reactor's models:**
  - Movement is *persistent state, not a pulse*. Setting movement to forward keeps moving until you explicitly set it back to idle. If you do not send idle on keyup, the player walks forever. Hence hold-to-move.
  - Commands land at chunk boundaries, so a key tapped and released quickly may never register at all.
  - When a run finishes, the server may auto-restart it with the same conditions until you reset.
  - World build takes 30–120 seconds. This is why the door sequence must stretch.
- **Failure behaviour:** connection or stream failure cuts immediately to the end scene. Never leave a black screen. Log the real error.
- **Content filtering:** the model refuses explicit violence and gore. Phrasing is the only lever. Implication passes where description does not — "a figure at the end of the street, closer than before, something catching the light" passes where a direct description of a weapon and an attack does not. The inference system prompt must instruct the LLM to write cinematically for this reason, and the passing phrasings discovered in Phase 0 go in `lib/world/prompt-rules.ts`.

### OpenAI — profile inference
- **Purpose:** one call, turning four typed answers into the `FearProfile`.
- **Auth:** `OPENAI_API_KEY`, server-side only.
- **Method:** structured outputs with a strict JSON schema matching `FearProfile` exactly. Do not parse free text. Do not use function calling.
- **Failure behaviour:** throw. No template fallback, no retry loop. A malformed profile means a broken world, and a visible error is better than a generic one.

### Runware — generative media
- **Purpose:** the seed image (live, per session), plus the office image, psychologist portrait, and cached TTS lines (generated once during the build and committed).
- **Auth:** `RUNWARE_API_KEY`, server-side only. Unified `.run()` call; models addressed by AIR identifier in `creator:family@version` form. REST transport is simpler than WebSocket here — use REST.
- **TTS:** Runware hosts ElevenLabs (`elevenlabs:1@1`), Inworld Realtime TTS-2, xAI TTS and Qwen3-TTS. Audition and pick one voice, then keep it. Generate the four questions and the acknowledgement lines during Phase 2 and commit them as files under `public/audio/psychologist/` — only lines that change per session ever hit the API live, and in v1 there are none.
- **Failure behaviour:** seed image failure throws and aborts the transition. Committed assets cannot fail at runtime, which is why they are committed.

### VEED — optional, Phase 7 only
- **Purpose:** lip-synced psychologist clips via Fabric 1.0 (audio in, video out).
- **Critical constraint:** Fabric is a job, not a stream. It takes seconds to render. It must **never** be called during a live session. Pre-render every line into short video files and commit them, with a seamless idle loop played between them.
- **Failure behaviour:** not in the runtime path at all. If Phase 7 is not reached, `Psychologist.tsx` keeps the still portrait and nothing else changes.

## Not used, and why

- **Modal:** every workload here is I/O orchestration, not GPU compute. Adding it means a second language and a second deploy for no capability.
- **Groq:** with typed input there is no speech-to-text, and with no director loop there is no latency-critical LLM call. Two OpenAI calls per session is the whole LLM surface.
- **Any database:** nothing outlives the session.
- **A game engine:** there is no 3D scene to render. The world is a video stream.
