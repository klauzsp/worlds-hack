import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["audio/webm", "audio/mp4", "audio/wav", "audio/mpeg"]);

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Transcription service is not configured" }, { status: 503 });
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BYTES) {
    return NextResponse.json({ error: "Recording too large" }, { status: 413 });
  }

  let file: File;
  try {
    const form = await request.formData();
    const entry = form.get("audio");
    if (!(entry instanceof File)) {
      return NextResponse.json({ error: "Audio file required" }, { status: 400 });
    }
    file = entry;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "Audio file required" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Recording too large" }, { status: 413 });
  }
  const mediaType = file.type.split(";")[0].trim().toLowerCase();
  if (!ALLOWED.has(mediaType)) {
    return NextResponse.json({ error: "Unsupported audio format" }, { status: 415 });
  }

  try {
    const result = await new OpenAI({ timeout: 30_000, maxRetries: 0 }).audio.transcriptions.create(
      { file, model: "gpt-4o-mini-transcribe", response_format: "json" },
      { signal: request.signal },
    );
    const data = z.object({ text: z.string().trim().min(1).max(500) }).safeParse(result);
    if (!data.success) {
      return NextResponse.json(
        { error: "Nothing intelligible was recorded — hold the button a little longer" },
        { status: 422 },
      );
    }
    return NextResponse.json({ text: data.data.text });
  } catch {
    return NextResponse.json({ error: "Transcription failed" }, { status: 502 });
  }
}
