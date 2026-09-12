import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import OpenAI from "openai";
import { z } from "zod";

export const maxDuration = 60;

const bodySchema = z.object({ prompt: z.string().min(1).max(4000) });

/*
 * Seed image via OpenAI — the Runware sponsor key has no credits, so the
 * OpenAI key we already hold does this instead. gpt-image-1-mini returns
 * bytes, not a URL, but the world model fetches the frame itself
 * server-side, so it needs a public URL: we park the bytes in Vercel Blob
 * and hand over the store URL. Works identically on localhost and on
 * serverless — no tunnel, no shared store. 1536x1024 is a 1.5 landscape
 * frame, inside the model's required 1.5–2.0 ratio. The SDK's Blob upload
 * path is broken upstream — the session resolves it to a URL the model
 * cannot fetch (action_error 400001).
 */
export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN is not configured" }, { status: 500 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const openai = new OpenAI();
  let imageBase64: string | undefined;
  try {
    const result = await openai.images.generate({
      model: "gpt-image-1-mini",
      prompt: `First-person point-of-view photograph, eye height: ${parsed.data.prompt}. No person in frame representing the viewer. Cinematic, dim, photographic.`,
      size: "1536x1024",
      quality: "medium",
      output_format: "jpeg",
    });
    imageBase64 = result.data?.[0]?.b64_json;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("OpenAI seed image request failed:", detail);
    return NextResponse.json({ error: `Image generation failed: ${detail}` }, { status: 502 });
  }

  if (!imageBase64) {
    return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
  }

  const blob = await put(`seed-${crypto.randomUUID()}.jpg`, Buffer.from(imageBase64, "base64"), {
    access: "public",
    contentType: "image/jpeg",
  });
  return NextResponse.json({ imageUrl: blob.url });
}
