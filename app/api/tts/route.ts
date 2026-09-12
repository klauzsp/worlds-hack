import { NextResponse } from "next/server";
import { createClient } from "@runware/sdk";
import { z } from "zod";

const bodySchema = z.object({
  text: z.string().min(1).max(2000),
  voice: z.string().min(1).default("Claire"),
});

export async function POST(request: Request) {
  const apiKey = process.env.RUNWARE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RUNWARE_API_KEY is not configured" }, { status: 500 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const client = await createClient({ apiKey, transport: "rest" });
  const results = await client.run({
    model: "inworld:tts@2",
    speech: { text: parsed.data.text, voice: parsed.data.voice },
  });

  const audioUrl = results[0] && "audioURL" in results[0] ? results[0].audioURL : undefined;
  if (!audioUrl) {
    console.error("Runware TTS returned no URL:", results);
    return NextResponse.json({ error: "Speech generation failed" }, { status: 502 });
  }
  return NextResponse.json({ audioUrl });
}
