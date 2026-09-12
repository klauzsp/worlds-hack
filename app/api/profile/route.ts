import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { fearProfileSchema, openaiProfileSchema, profileRequestSchema } from "@/lib/profile/schema";
import { SYSTEM_PROMPT, OPENAI_MODEL } from "@/lib/profile/system-prompt";
import { createSession, getSession } from "@/lib/session";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
  }

  const parsed = profileRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Four non-empty answers required" }, { status: 400 });
  }

  const openai = new OpenAI();
  const session = createSession();
  session.answers = [...parsed.data.answers];

  const completion = await openai.chat.completions.parse({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: parsed.data.answers
          .map((answer, i) => `Q${i + 1}: ${answer}`)
          .join("\n"),
      },
    ],
    response_format: zodResponseFormat(openaiProfileSchema, "fear_profile"),
  });

  const raw = completion.choices[0]?.message.parsed;
  const profile = raw
    ? {
        ...raw,
        notebookLines: [raw.notebookLine1, raw.notebookLine2, raw.notebookLine3],
      }
    : null;
  const validated = fearProfileSchema.safeParse(profile);
  if (!validated.success) {
    console.error("FearProfile failed validation:", validated.error, profile);
    return NextResponse.json({ error: "Profile inference failed" }, { status: 502 });
  }

  session.profile = validated.data;
  if (!getSession(session.id)) {
    return NextResponse.json({ error: "Session lost" }, { status: 500 });
  }
  return NextResponse.json({ sessionId: session.id, profile: validated.data });
}
