import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.REACTOR_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "REACTOR_API_KEY is not configured" }, { status: 500 });
  }

  const response = await fetch("https://api.reactor.inc/tokens", {
    method: "POST",
    headers: {
      "Reactor-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authorization_details: [
        {
          type: "session",
          resources: { models: { match: ["reactor/happy-oyster-adventure"] } },
          constraints: { max_sessions: 5 },
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Reactor token exchange failed: ${response.status} ${body}`);
    return NextResponse.json({ error: "Token exchange failed" }, { status: 502 });
  }

  const { jwt, expires_at } = (await response.json()) as { jwt: string; expires_at: number };
  return NextResponse.json(
    { jwt, expires_at },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
