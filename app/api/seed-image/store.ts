/*
 * In-memory seed-image store. The world model fetches firstFrameImageUrl
 * from its own servers, so the bytes must be reachable at a public URL —
 * we serve them ourselves (see [id]/route.ts) behind the PUBLIC_BASE_URL
 * tunnel. Session-scoped, nothing persists.
 */
type StoredImage = { bytes: Uint8Array; mimeType: string };

const globalStore = globalThis as unknown as { __seedImages?: Map<string, StoredImage> };
const store = (globalStore.__seedImages ??= new Map<string, StoredImage>());

export function putSeedImage(bytes: Uint8Array, mimeType: string): string {
  const id = crypto.randomUUID();
  store.set(id, { bytes, mimeType });
  return id;
}

export function getSeedImage(id: string): StoredImage | undefined {
  return store.get(id);
}
