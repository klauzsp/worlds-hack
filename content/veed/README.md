# Psychologist clip set

Presenter: VEED Character 20 (warm room, seated woman); voice: Verity, English UK.
The scripts in shots.json match content/questions.ts verbatim. Seven speaking clips cover the four questions, both door lines, and the return line. Acknowledgements remain silent subtitle beats while the presenter listens.

All seven clips were generated with the approved OpenEdit set `exposure-psychologist` and installed in `public/video/psychologist/`: q1.mp4 through q4.mp4, understand.mp4, direction.mp4, and closing.mp4. They are reused during gameplay without further VEED charges.

The silent idle.webm is a four-second held portrait loop. Its source is the same VEED presenter thumbnail at https://cdn-site-assets.veed.io/20_66526d0e4f/20_66526d0e4f.jpg (the provider returns PNG bytes).

## Landscape set (active)

The same seven lines were re-rendered from `presenter-landscape.png` as the approved set `exposure-landscape` (shots-landscape.json) and installed in `public/video/psychologist-landscape/` — 1312×736 clips that fit inside the 2.39:1 letterbox without cropping. The component points here; the portrait set above is retained but unreferenced. `idle.png` is the held still used between lines.

## Spending

Portrait set: OpenEdit estimated 129 AI Playground credits, with a range of 114–179. The observed workspace balance moved from 29,680 to 29,474: **206 credits**, above the estimate. Individual observed movements were 46, 48, 36, 26, 12, 20, and 18. VEED exposes no per-job charge, so these are workspace balance observations rather than a provider invoice. Measured generation rates were roughly 8–9 credits per video second, above the estimator's assumption.

Landscape set: estimated 112, observed 206 again (identical scripts and durations), taking the balance to ~29,268.

## Playback

Set `NEXT_PUBLIC_INTERVIEW_MODE=veed` in your local environment and restart/rebuild. Each question must finish before the answer overlay opens. Missing speaking clips produce a visible error. `audio` explicitly selects the original audio interview.

## Recovery

Generation records remain in the local OpenEdit application-support runs directory. If a downloaded clip is lost, recover its existing job with `npx --yes @veedstudio/openedit-cli generate --key exposure-psychologist-q1 --resume` (substitute the required line name). Do not submit the set again to recover existing files; obtain a fresh estimate and approval before purchasing replacements.
