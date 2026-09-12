import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { putSeedImage } from "./store";

const bodySchema = z.object({ prompt: z.string().min(1).max(4000) });

/*
 * Seed image via OpenAI — the Runware sponsor key has no credits, so the
 * OpenAI key we already hold does this instead. gpt-image-1-mini at
 * 1536x1024 is a 1.5 landscape frame, inside the world model's required
 * 1.5–2.0 ratio. The model fetches the frame itself, so it needs a public
 * URL: we serve the bytes at GET /api/seed-image/[id] behind
 * PUBLIC_BASE_URL (the dev tunnel). The SDK's Blob upload path is broken
 * upstream — the session resolves it to a URL the model cannot fetch
 * (action_error 400001).
 */
export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
  }
  const publicBaseUrl = process.env.PUBLIC_BASE_URL;
  if (!publicBaseUrl) {
    return NextResponse.json({ error: "PUBLIC_BASE_URL is not configured" }, { status: 500 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const openai = new OpenAI();
  const result = await openai.images.generate({
    model: "gpt-image-1-mini",
    prompt: `First-person point-of-view photograph, eye height: ${parsed.data.prompt}. No person in frame representing the viewer. Cinematic, dim, photographic.`,
    size: "1536x1024",
    quality: "medium",
    output_format: "jpeg",
  });

  const imageBase64 = result.data?.[0]?.b64_json;
  if (!imageBase64) {
    console.error("OpenAI seed image returned no data:", result);
    return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
  }
  const id = putSeedImage(Buffer.from(imageBase64, "base64"), "image/jpeg");
  return NextResponse.json({ imageUrl: `${publicBaseUrl}/api/seed-image/${id}.jpg` });
}
