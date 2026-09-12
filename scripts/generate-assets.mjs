/*
 * Regenerate the committed voice lines with real TTS (Runware inworld:tts@2).
 * Replaces the `say`-rendered placeholders in public/audio/psychologist/.
 *
 *   RUNWARE_API_KEY=... node scripts/generate-assets.mjs
 *
 * Optional: TTS_VOICE=Claire TTS_MODEL=inworld:tts@2
 */
import { createClient } from "@runware/sdk";
import { writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const VOICE = process.env.TTS_VOICE ?? "Claire";
const MODEL = process.env.TTS_MODEL ?? "inworld:tts@2";

const LINES = {
  q1: "[speak calmly, measured] Before we begin. When you were a child — what was the thing in the dark you were most certain was there?",
  q2: "[speak calmly, measured] You're walking home later than you meant to be, and you become certain someone is behind you. What do you do?",
  q3: "[speak calmly, measured] Imagine you can't leave a room until morning. Describe the room you'd least like it to be.",
  q4: "[speak quietly, slowly] What's the last thing you'd want to see when you turn the light on?",
  ack1: "[softly] Mm.",
  ack2: "[softly] Interesting.",
  ack3: "[softly] Take your time.",
  understand: "[quietly, with weight] I think I understand.",
  direction: "[calmly] When you're ready — through the door.",
  closing: "[quietly] Now we both know what's in there with you.",
};

async function main() {
  const apiKey = process.env.RUNWARE_API_KEY;
  if (!apiKey) throw new Error("RUNWARE_API_KEY is not set");

  const client = await createClient({ apiKey, transport: "rest" });
  const outDir = new URL("../public/audio/psychologist/", import.meta.url).pathname;
  await mkdir(outDir, { recursive: true });

  for (const [name, text] of Object.entries(LINES)) {
    const [result] = await client.run({
      model: MODEL,
      speech: { text, voice: VOICE },
      audioSettings: { bitrate: 128, sampleRate: 24000, channels: 1 },
    });
    const url = result?.audioURL;
    if (!url) throw new Error(`No audioURL for ${name}`);
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    const target = `${outDir}${name}.mp3`;
    await writeFile(target, buf);
    // Normalise to mp3 in case the service returns another container.
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", target, `${target}.tmp.mp3`]);
    execFileSync("mv", [`${target}.tmp.mp3`, target]);
    console.log(`✓ ${name}.mp3 (${buf.length} bytes)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
