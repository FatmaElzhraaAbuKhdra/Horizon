const _c = new Map<string, { d: unknown; t: number }>();
const TTL = 30_000;

export async function adminFetch<T>(url: string): Promise<T> {
  const now = Date.now();
  const hit = _c.get(url);
  if (hit && now - hit.t < TTL) return hit.d as T;
  const data: T = await fetch(url).then(r => r.json());
  _c.set(url, { d: data, t: now });
  return data;
}

export function bustCache(url: string) {
  _c.delete(url);
}
