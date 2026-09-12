import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const bodySchema = z.object({ text: z.string().trim().min(1).max(500) });

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Speech service is not configured" }, { status: 503 });
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 16 * 1024) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const speech = await new OpenAI({ timeout: 30_000, maxRetries: 0 }).audio.speech.create(
      {
        model: "gpt-4o-mini-tts",
        voice: "ash",
        input: parsed.data.text,
        instructions:
          "Read the provided text verbatim as a person answering a question in a quiet room. Speak naturally, calmly, and conversationally. Do not add words, sound effects, or stage directions.",
        response_format: "mp3",
      },
      { signal: request.signal },
    );
    return new Response(speech.body, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Speech generation failed" }, { status: 502 });
  }
}
