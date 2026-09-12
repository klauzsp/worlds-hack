/*
 * In-memory seed-image store. The world model fetches firstFrameImageUrl
 * from its own servers, so the bytes must be reachable at a public URL —
 * we serve them ourselves (see [id]/route.ts) behind the PUBLIC_BASE_URL
 * tunnel. Session-scoped, nothing persists.
 *
 * The Map lives on globalThis because Next dev compiles route modules in
 * separate instances — a module-level Map would lose entries between the
 * POST that stores and the GET that serves.
 */
type StoredImage = { bytes: Buffer; mimeType: string; createdAt: number };

const TTL_MS = 10 * 60 * 1000;

const globalStore = globalThis as unknown as { __seedImages?: Map<string, StoredImage> };
const store = (globalStore.__seedImages ??= new Map<string, StoredImage>());

export function putSeedImage(bytes: Buffer, mimeType: string): string {
  const now = Date.now();
  for (const [id, image] of store) {
    if (now - image.createdAt > TTL_MS) store.delete(id);
  }
  const id = crypto.randomUUID();
  store.set(id, { bytes, mimeType, createdAt: now });
  return id;
}

export function getSeedImage(id: string): StoredImage | undefined {
  return store.get(id);
}
