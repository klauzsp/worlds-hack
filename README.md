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

## Reactor handoff

After three answers, download `reactor-horror-brief.json` or copy the prompt. The brief contains player imagery, fear, intensity, excluded themes, an opening, an objective and three story beats. Connect `brief.prompt` to your Reactor model session using the SDK for your hackathon model. Live Reactor generation is not yet integrated; the app does not claim to generate a playable world.

## API

- `POST /api/session` prepares reusable media.
- `GET /api/session` reports media readiness.
- `POST /api/brief` accepts `{answers: [name, imagery, fear], intensity, exclusions}` and returns a world brief. Intensity is `slow dread`, `strong suspense` or `nightmare`.

Player answers are not shared in session state. Generated media metadata is cached locally. Keep this development server local until authentication and spending controls are added for any enabled paid generation.

The supplied “Beware of listening ears” videos are installed in order: unnumbered, -2, -3, as turn-0 through turn-2.
