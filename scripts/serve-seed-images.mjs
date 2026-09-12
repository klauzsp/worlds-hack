import { createServer } from "node:http";

// Only expose existing seed bytes. No proxying of generation, tokens, or UI.
const server = createServer(async (request, response) => {
  if (request.method !== "GET" || !/^\/api\/seed-image\/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\.jpg$/.test(request.url ?? "")) {
    response.writeHead(404).end();
    return;
  }
  try {
    const upstream = await fetch(`http://127.0.0.1:3000${request.url}`, {
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    if (!upstream.ok || upstream.headers.get("content-type") !== "image/jpeg") {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "Content-Type": "image/jpeg", "Cache-Control": "no-store" });
    response.end(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    response.writeHead(502).end();
  }
});
server.listen(3001, "127.0.0.1", () => console.log("Read-only seed image server: http://127.0.0.1:3001"));
