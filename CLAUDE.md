# Exposure

A 10-hour hackathon prototype: a psychologist interviews you, then generates a real-time navigable horror world from your answers using a world model.

## Read these first, in order

The full spec lives in `docs/`. Each file owns one thing — do not look for a fact in the wrong file, and do not restate a fact across files.

- `docs/PRD.md` — what we're building, the nine features, acceptance criteria, and the phased build order
- `docs/ARCHITECTURE.md` — stack, state machine, directory contract, the FearProfile shape, integration specs, dev ownership split
- `docs/DESIGN.md` — the visual system, tokens, and the cinematic treatment layer

There is no DATA_MODEL.md (nothing persists), no API.md (one client; routes are specified in ARCHITECTURE.md), and no BUILD_PLAN.md (build order is folded into PRD.md §6).

## Commands

```bash
pnpm install
pnpm dev            # localhost:3000
pnpm lint           # eslint
pnpm typecheck      # tsc --noEmit
pnpm build          # production build
```

## Stack

Next.js 15 App Router · TypeScript strict · Tailwind v4 · Reactor (world model) · OpenAI (inference) · Runware (image + TTS) · Vercel. No database. Full detail in ARCHITECTURE.md.

## The one thing to understand before writing any code

**Reactor is not a 3D engine.** There is no scene graph, no mesh, no character, no collision, no physics, no entity you can instantiate or query. Reactor generates *video frames* in real time from a prompt and a seed image, and streams them over WebRTC.

Consequences that govern every design decision in this codebase:
- The figure pursuing the player is pixels. It exists because the prompt says it exists. It has no AI and no position.
- The app can never know what is on screen. Only the prompt knows.
- Nothing is persistent. Turn around and back and the world has changed.
- Prompt changes *morph* the picture over a second or more. There is no cut and therefore no jump scare is possible.

Do not write code that assumes otherwise. Do not add raycasting, colliders, positions, or an entity system.

## Conventions

- TypeScript strict. No `any`, no untyped functions, no non-null assertions to silence the compiler.
- All app flow lives in the single discriminated-union state machine in `app/page.tsx`. Do not add routes for the eight states and do not introduce a router transition between them — the audio context and the Reactor session must survive the whole session.
- No state management library. React state plus props. The app is small enough that Zustand would be overhead.
- Every external API response is validated with Zod before use. No trusting a shape.
- Server routes exist only to hold API keys and proxy. No business logic on the server.
- Tailwind utilities referencing the CSS custom properties from DESIGN.md. No hardcoded hex values or arbitrary pixel values in components.
- Audio through the Web Audio mixer in `lib/audio/mixer.ts`. Never construct a bare `new Audio()` in a component.

## House rules (non-negotiable)

- **One correct path.** No fallbacks, no "just in case" branches. If a precondition isn't met, throw. A visible error is better than a silently degraded experience — especially in a demo, where a silent fallback means presenting something broken without knowing it.
- **One way to do a thing.** Don't introduce a second pattern for something already solved here.
- **Clarity over cleverness.** Readable beats compact.
- **Separation of concerns.** Each function does one thing.
- **Surgical changes.** Smallest correct edit at the root cause. No drive-by refactors, no symptom patches.
- **Evidence-based debugging.** Reproduce → isolate with targeted logging → diagnose → fix. Find the cause before editing. Never guess-patch.
- **Real error handling everywhere.** Every await has explicit failure handling. Errors are human-readable and never leak a stack trace to the screen.
- **Don't overengineer.** This ships in ten hours.

## Guardrails (never do these)

- **Never guess a Reactor SDK method, command name, or parameter.** Read `docs.reactor.inc` — every page is available as Markdown by appending `.md`, and there is an MCP server at `https://docs.reactor.inc/mcp`. If the schema is unclear, fetch the docs again. Do not invent an API surface.
- **Never put `REACTOR_API_KEY`, `OPENAI_API_KEY` or `RUNWARE_API_KEY` in client code**, in a `NEXT_PUBLIC_` variable, or in a JSON response body. The browser gets a short-lived JWT and nothing else.
- **Never mint the Reactor JWT at page load.** Mint it at the gate click. A token minted before a 60-second interview can expire before the world connects.
- **Never call VEED Fabric during a live session.** It is a render job, not a stream. Pre-render and commit.
- **Never build the features listed as out of scope in PRD.md §3.** Specifically: no Fear Director, no telemetry, no behavioural inference, no adaptive loop, no voice input, no speech-to-text, no fail state, no 3D. These were considered and deliberately cut for time. Do not helpfully re-add them.
- **Never show a spinner, progress bar, skeleton, or the word "loading".** Waiting is covered by content. See DESIGN.md.
- **Never let the psychologist speak during the world act.** She is silent from the door until the return.
- **Never make the office scary.** It is identical at the start and the end, and it is an ordinary expensive consulting room. The contrast with the world is the entire point of the product.
- **Never send movement as a pulse.** Movement is persistent state on this model: if you don't send idle on keyup, the player walks forever. Hold-to-move only.
- **Never commit a real `.env`.** `.env.example` with placeholders only.

## Working in parallel

Two developers are building this simultaneously. The file ownership table in ARCHITECTURE.md is a hard contract. Before editing `app/page.tsx`, `lib/types.ts`, or `app/globals.css` — the three shared files — check with the other developer. Merge conflicts in the state machine at hour eight will cost the demo.

## Definition of done

A change is done when types pass strict, lint passes, there are no console errors, and the relevant acceptance criterion in PRD.md §5 is satisfied. The build as a whole is done when a first-time user can complete gate → interview → door → world → end scene → notebook without intervention, on a phone hotspot.
