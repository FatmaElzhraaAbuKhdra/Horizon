import { existsSync } from "fs";
import { readdir } from "fs/promises";
import path from "path";

export async function slotImages(slot: string): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "img", slot);
  if (!existsSync(dir)) return [];
  const files = await readdir(dir);
  return files
    .filter(f => /\.(jpe?g|png|webp|gif|svg)$/i.test(f))
    .map(f => `/img/${slot}/${f}`);
}

export async function slotImage(slot: string): Promise<string | null> {
  const imgs = await slotImages(slot);
  return imgs[0] ?? null;
}
