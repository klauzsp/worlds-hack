# PRD: Exposure

> Product definition. What is being built and what "done" means per feature.
> Owns: problem, user, scope, features, acceptance, build order.
> For how it's built see ARCHITECTURE.md; for visual system see DESIGN.md.

## 1. Problem

Every horror game ships the same level to every player, so it frightens some people and bores the rest. World models make it possible to generate the level *after* you know who is playing. Exposure is a 10-hour hackathon prototype that proves the loop end to end: a short interview, an inferred fear, and a real-time navigable world generated specifically from that fear.

## 2. Target user & core action

**User:** A hackathon judge or visitor sitting at a laptop for three minutes, who has never seen the product before.

**Core action:** Answer four questions from a psychologist, walk through the door behind her, and find yourself inside the thing you described.

## 3. Scope

**In scope (v1):**
- Single-player, single-session, browser-based. No accounts, no persistence.
- A static office scene with a psychologist who speaks aloud (voice) while the player replies by typing.
- Four fixed interview questions.
- One LLM inference turning the four answers into a structured fear profile that contains its own generated prompts.
- One generated seed image from that profile.
- One real-time navigable world from Reactor, anchored on that image, with native audio, first person, hold-to-move controls, 60 seconds long.
- One timed prompt swap at t=30s using a second prompt written at profile time.
- A fixed, non-personalised end scene.
- A return to the office and a notebook reveal showing what she inferred.

**Explicitly out of scope — do not build these:**
- Any "Fear Director" agent, telemetry system, behavioural inference, or adaptive loop during gameplay. There is exactly one prompt swap and it is a `setTimeout`.
- Voice input, microphone access, speech-to-text of any kind. Input is typed.
- The psychologist speaking during gameplay. She is silent from the door until the return.
- Adaptive or branching interview questions. Four fixed questions, same order, every time.
- 3D rendering, meshes, characters, physics, collision, combat, or a game engine. There is no scene graph. The world is a video stream.
- A fail state, death, health, score, inventory, or win condition.
- Multiplayer, accounts, database, analytics, mobile layout.
- A second world, a second scenario, or any level design.

## 4. Features

### F1 — Entry gate
A single full-screen frame with the title and one instruction to begin. Clicking it starts everything: it satisfies the browser autoplay gesture requirement, begins office ambience, and mints the Reactor session token. Nothing in the app may play audio before this click.

*Failure case:* none. This screen cannot fail.

### F2 — The office
A static generated image of a warm, expensive, entirely normal psychologist's office, held with a slow drift so it is not visibly a still. Warm grade, film grain, vignette. Ambient room tone loops: a clock, distant traffic, a radiator. The psychologist is present as a portrait within the frame. The office is identical at the start and at the end of the session — it is not a horror set and must never become one.

*Failure case:* if the office image fails to load, throw a visible error. Do not fall back to a colour block.

### F3 — The interview
Four fixed questions, asked in order. For each: her line plays as audio with a synchronised subtitle, a pen-scratch sound plays, then a text input overlay fades in over the scene. The player types and submits. A short acknowledgement line plays ("Mm." / "Interesting." / "Take your time.") before the next question. The whole sequence targets 40–60 seconds. Answers are held in memory for the session.

The four questions are fixed in the codebase and are:
1. "Before we begin. When you were a child — what was the thing in the dark you were most certain was there?"
2. "You're walking home later than you meant to be, and you become certain someone is behind you. What do you do?"
3. "Imagine you can't leave a room until morning. Describe the room you'd least like it to be."
4. "What's the last thing you'd want to see when you turn the light on?"

*Failure case:* empty submission is rejected inline; the input stays focused. A submission over 500 characters is truncated with a visible count.

### F4 — Profile inference
On submission of the fourth answer, one call to OpenAI with a strict JSON schema converts the four answers into a fear profile. The profile is not a label — it contains the finished prompts the rest of the app consumes: a seed image prompt, a world prompt, an escalation prompt, an audio prompt, and three short lines representing what she wrote in the notebook.

*Failure case:* if the call fails, errors, or returns output that does not validate against the schema, throw. Do not fall back to a template profile and do not retry silently — surface a real error to the console and a "Something went wrong" state in the UI.

### F5 — The door sequence
Runs immediately on profile success and in parallel with F6 and F7. She closes the notebook, says "I think I understand," stands, and directs the player to the door. The player clicks to approach. Office ambience fades out; a low sub-bass tone fades in. The door opens. Cut to black.

This sequence is the loading screen for the world and must be able to stretch. It holds on black with the tone building until the Reactor world reports ready, however long that takes. It must never show a spinner, a percentage, or the word "loading".

*Failure case:* if the world is not ready after 150 seconds, cut to a visible error state rather than holding on black indefinitely.

### F6 — Seed image generation
One Runware image call using `profile.seedImagePrompt`. Must be first-person point of view — what the player would see standing in the scene, never a third-person composition of the scene. The result URL is passed to the world model as its anchor frame.

*Failure case:* if generation fails, throw. Do not proceed to F7 with no anchor image.

### F7 — The world
A Reactor session on `reactor/happy-oyster-adventure`, first person, anchored on the F6 image, prompted with `profile.worldPrompt` and `profile.audioPrompt`. Video and native audio stream into a full-bleed element. The player moves with hold-to-move controls and looks around. Runs 60 seconds from first frame.

At t=30s exactly, one `set_prompt` call swaps in `profile.escalationPrompt`. There is no logic behind this, no observation of the player, and no second swap.

*Failure case:* if the session fails to connect or the stream drops, cut immediately to F8. The session dying must not leave a black screen.

### F8 — End scene
A hard cut at t=60s to a single fixed, pre-rendered video file. Identical for every player. Not generated, not personalised, bundled in the repo.

*Failure case:* if the video fails to load, skip directly to F9.

### F9 — Return and notebook reveal
Back in the office, exactly as it was. She is still writing. The notebook opens and the three `notebookLines` from the profile are typed out one at a time, then she says one closing line. This is the moment that makes the inference legible — it shows the audience the connection between what the player typed and the world they were just in.

*Failure case:* none. This screen is pure local state.

## 5. Acceptance criteria

| Feature | Criterion | Pass condition |
|---|---|---|
| F1 | Audio is gated behind a user gesture | No audio plays before the first click; no console autoplay warnings |
| F2 | Office renders and drifts | Image visible, drift animation running, three ambience layers audible, visually identical in F2 and F9 |
| F3 | Four questions complete in sequence | Four answers captured in session state; interview completable in under 60s by a first-time user |
| F4 | Profile is valid structured data | Returned object validates against the Zod schema; all five prompt fields non-empty; three notebook lines present |
| F5 | Door sequence covers world build with no spinner | Transition never shows a loading indicator; holds on black until world ready; errors after 150s |
| F6 | Seed image is first-person POV | Generated image contains no visible full human figure representing the player; passed to F7 as a URL |
| F7 | World is live, navigable, and audible | Video frames render; holding a movement key visibly moves the camera; native audio audible; escalation prompt fires once at t=30s ±1s |
| F8 | End scene plays | Hard cut at t=60s ±2s; video plays to completion |
| F9 | Notebook shows profile-derived lines | The three lines displayed are the ones returned in F4, not hardcoded strings |

**Global:**
- Zero TypeScript errors in strict mode. No `any`.
- Zero console errors on any screen.
- Every external call has explicit error handling. Nothing is silently swallowed.
- No fallback paths. If a precondition is unmet, throw.
- The full flow runs start to finish on a phone hotspot without stalling.

## 6. Build order (folded)

Two developers. Dev A and Dev B never edit the same file — see the ownership table in ARCHITECTURE.md.

**Phase 0 — Both, together, 45 min. Nothing else starts until this is done.**
1. Read the Happy Oyster Adventure pages on `docs.reactor.inc` (use the MCP server at `docs.reactor.inc/mcp`) and write down the exact connect slug, command names, and parameter shapes. Do not guess them.
2. Get *any* Happy Oyster world streaming in the browser with working movement and audible native audio, from a hardcoded prompt and a hardcoded seed image. Scaffold with `npx create-reactor-app`.
3. Push three deliberately dark prompts through the sandbox and note which phrasings the model refuses. Phrasing is the only lever you have; record what passes in `lib/world/prompt-rules.ts`.

If step 2 does not work, stop and switch the world model before building anything else.

**Phase 1 — Dev B: world slice.** Token route, `WorldModel` adapter, world screen, hold-to-move, 60s timer, t=30s swap, hard cut to end scene.

**Phase 2 — Dev A: office and interview.** Entry gate, office image with drift and ambience, subtitle system, question sequencer, text overlay input, TTS playback.

**Phase 3 — Dev A: profile inference.** OpenAI route with strict schema, Zod validation, prompt engineering for the five output fields. This is the highest-value hour in the build.

**Phase 4 — Both: join the halves.** Profile → seed image → world. Door sequence as the stretchable cover. Warm-start the world the instant the fourth answer submits.

**Phase 5 — Dev A: return and notebook reveal.** End scene video, office return, notebook typing.

**Phase 6 — Both: audio and grade.** The sub-bass on the door, the ambience mix, the grain and vignette. Sound carries more of this than picture does.

**Phase 7 — Only if ahead: VEED.** Pre-render her lines through Fabric 1.0 into short lip-synced clips, baked as files. Never called live. Default without it is the still portrait with a breathing loop.

**Phase 8 — Last hour, non-negotiable.** Record a screen capture of a complete successful run as the demo backup. Do this regardless of how well the build is going.
