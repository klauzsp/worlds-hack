/*
 * Regenerate the committed voice lines with OpenAI TTS.
 * Replaces the `say`-rendered placeholders in public/audio/psychologist/.
 *
 *   node --env-file=.env.local scripts/generate-assets.mjs
 *
 * Requires OPENAI_API_KEY. The bracketed stage direction at the head of each
 * line is stripped from the spoken input and passed as TTS instructions.
 */
import OpenAI from "openai";
import { writeFile, mkdir } from "node:fs/promises";

const INSTRUCTIONS =
  "A calm, measured British psychologist in a quiet consulting room. " +
  "Speak slowly, low, unhurried, with warmth and clinical distance. Never theatrical.";

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

function splitDirection(raw) {
  const match = raw.match(/^\[(?<direction>[^\]]+)\]\s*(?<text>.*)$/s);
  if (!match?.groups) return { direction: null, text: raw };
  return { direction: match.groups.direction, text: match.groups.text };
}

async function synthesise(openai, text, instructions) {
  try {
    return await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "sage",
      input: text,
      instructions,
      response_format: "mp3",
    });
  } catch (error) {
    console.warn(`gpt-4o-mini-tts unavailable (${error.message}); falling back to tts-1-hd/nova`);
    return openai.audio.speech.create({
      model: "tts-1-hd",
      voice: "nova",
      input: text,
      response_format: "mp3",
    });
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");

  const openai = new OpenAI();
  const outDir = new URL("../public/audio/psychologist/", import.meta.url).pathname;
  await mkdir(outDir, { recursive: true });

  for (const [name, raw] of Object.entries(LINES)) {
    const { direction, text } = splitDirection(raw);
    const instructions = direction ? `${INSTRUCTIONS} For this line: ${direction}.` : INSTRUCTIONS;
    const speech = await synthesise(openai, text, instructions);
    const buf = Buffer.from(await speech.arrayBuffer());
    const target = `${outDir}${name}.mp3`;
    await writeFile(target, buf);
    console.log(`✓ ${name}.mp3 (${buf.length} bytes)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
