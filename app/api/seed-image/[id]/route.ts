import { NextResponse } from "next/server";
import { getSeedImage } from "../store";

/* Serves a generated seed frame to the world model, which fetches it
   server-side via firstFrameImageUrl. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const image = getSeedImage(id.replace(/\.[a-z0-9]+$/i, ""));
  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new Response(image.bytes as unknown as BodyInit, {
    headers: { "Content-Type": image.mimeType, "Cache-Control": "no-store" },
  });
}
