# The Consultation

A fictional evil psychologist interviews the player, then produces a personalized horror-world brief for Reactor.

## Run

Run `npm start` and open http://localhost:3000. Node 20.6+ is required. The existing .env is preserved. Without videos, the doctor uses browser speech with subtitles. Each answer box appears after its video finishes; submitting the answer starts the next video. Video controls allow replay. Answers are held in browser memory and submitted to build the brief, not written to disk.

## Use your VEED credits

Create a talking psychologist in VEED: an unsettlingly calm middle-aged doctor, direct eye contact, dim Victorian office, single amber desk lamp, subtle knowing smile. Use the same character and voice for all three clips. Export MP4 files into `public/clips/`:

- `turn-0.mp4`: “Good evening. I've been expecting you. Please... sit. Before we begin, tell me your name.”
- `turn-1.mp4`: “Mm. Breathe slowly. Now — when the lights go out and the house goes quiet... what do you see?”
- `turn-2.mp4`: “One last question. Answer carefully — what you tell me next becomes the world you wake up in. What is your greatest fear?”

Optionally add `portrait.png` (or jpg/webp). Restart the server after adding files. Clips are reused across players. This version is a scripted interview; it does not generate conversational follow-up questions.

VEED editor credits and fal.ai API billing should not be assumed interchangeable. The optional existing fal generation pipeline requires `FAL_KEY` and explicit `ENABLE_GENERATION=1` in .env; it calls Flux, ElevenLabs and VEED Fabric via fal and may incur charges. Leave generation disabled to use exported VEED videos and browser speech. No paid generation is needed to demo.

## Reactor is the game renderer

The flow is VEED video → answer, repeated three times → consultation-based prompt → **Reactor FastH3** (`reactor/fast-h3`) video and sound. The local canvas maze and its keyword-selected worlds have been removed. FastH3 accepts text directly, so neither a doctor portrait nor a synthetic maze image biases generation.

The final greatest-fear answer is the primary subject in every scene; the second answer supplies compatible atmosphere only. Sharks produce an underwater diving-cage scenario, visibly circling animal sharks, and an escape route to a rescue boat. Snakes produce visible animal snakes in a greenhouse. Other fears are preserved literally with instructions to choose their actual physical habitat. A dark-bedroom answer cannot move a shark scenario out of the water. The expandable prompt panel shows exactly what H3 receives.

W/A/S/D/E select forward, left, back, right and investigate actions after each scene. A text field also accepts arbitrary actions. Each action generates a six-second H3 clip, with `continue_from_clip_id` preserving continuity where the model can. This is generated scene interaction, not continuous WASD locomotion or a deterministic physics engine. There is no claimed collision, inventory or automatic win detector. Wake up closes the session.

### Interpretation service

A server-side language-model director is implemented through fal's `openrouter/router` (Gemini 2.5 Flash). Set `ENABLE_DIRECTOR=1` in `.env` to enable it. It interprets the consultation into validated subject, setting, opening and objective fields. It requires funded fal access; the configured account returned HTTP 403, exhausted balance, during verification. VEED and Reactor credits do not fund this account.

With the director disabled (default), the prompt is built directly from consultation text, explicitly identified as `source: consultation`. This does not claim AI interpretation. FastH3 itself performs generation from that text. If the enabled director fails, an error is shown; it does not silently substitute another game.

`REACTOR_API_KEY` stays in ignored `.env`; the browser receives a temporary token scoped to one FastH3 session, capped at ten minutes. Reactor bills session time while open, including time between choices. The server binds to localhost.

Run `npm start` (builds browser bundle), or `npm run build` after frontend edits. Run `node --test tests/director.test.js` for fear/prompt regression checks.

References: [FastH3 API](https://www.reactor.inc/models/fast-h3/api), [fal LLM API](https://fal.ai/models/openrouter/router/api).

## API

- `POST /api/reactor/token` mints a scoped browser token.
- `POST /api/session` prepares reusable media.
- `GET /api/session` reports media readiness.
- `POST /api/brief` accepts `{answers: [name, imagery, fear], intensity, exclusions}` and returns a world brief. Intensity is `slow dread`, `strong suspense` or `nightmare`.

Player answers are not shared in session state. Generated media metadata is cached locally. Keep this development server local until authentication and spending controls are added for any enabled paid generation.

The supplied “Beware of listening ears” videos are installed in order: unnumbered, -2, -3, as turn-0 through turn-2.

## Live verification

A real browser run submitted the three consultation answers, including `snake (the animal)`, and received 155 decoded FastH3 frames at 1344×768 with audio and video tracks. The captured image in `docs/h3-snake-check.png` shows animal snakes across a greenhouse floor. The test closed its Reactor session afterward. This verifies the opening scene; generation remains probabilistic. `tests/live-h3.mjs` is an explicit paid smoke check, not part of the normal test suite.

After the Reactor balance was replenished, the shark browser test passed: the three consultation answers (including `sharks are my biggest fear` and secondary imagery `my dark bedroom`) produced an underwater diving cage with visibly circling sharks. The first scene delivered 154 decoded frames at 1344×768 with audio and video tracks. A subsequent typed action, `Swim backwards toward the guide rope while keeping the sharks in view`, completed another generated scene preserving the sharks, cage and guide rope. Screenshots: `docs/h3-shark-opening.png` and `docs/h3-shark-action.png`. The test closed the session afterward. This verifies those two generated scenes, not every possible fear or action.
