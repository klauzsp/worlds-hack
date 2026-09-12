import { NextResponse } from "next/server";
import { createClient } from "@runware/sdk";
import { z } from "zod";
import { PROMPT_RULES } from "@/lib/world/prompt-rules";

const bodySchema = z.object({ prompt: z.string().min(1).max(2000) });

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
    model: "runware:101@1",
    positivePrompt: parsed.data.prompt,
    width: PROMPT_RULES.seedAspect.width,
    height: PROMPT_RULES.seedAspect.height,
    numberResults: 1,
  });

  const imageUrl = results[0] && "imageURL" in results[0] ? results[0].imageURL : undefined;
  if (!imageUrl) {
    console.error("Runware seed image returned no URL:", results);
    return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
  }
  return NextResponse.json({ imageUrl });
}
