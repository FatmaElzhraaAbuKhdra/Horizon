import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile, readdir, unlink, stat, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { SLOT_KEYS } from "@/lib/image-slots";

const SECRET      = (process.env.ADMIN_SECRET ?? "aldenham-admin-secret-2026").trim();
const UPLOADS_DIR = path.join(process.cwd(), "public", "img");
const MAX_SIZE    = 5 * 1024 * 1024;
const ALLOWED     = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const ON_VERCEL   = !!process.env.VERCEL;

async function isAuthed() {
  const store = await cookies();
  return (store.get("admin_token")?.value ?? "").trim() === SECRET;
}

async function slotDir(slot: string) {
  const dir = path.join(UPLOADS_DIR, slot);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  return dir;
}

// GET /api/admin/images?slot=key  → images in one slot
// GET /api/admin/images            → all slots summary
export async function GET(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slot = new URL(req.url).searchParams.get("slot");

  if (slot) {
    if (!SLOT_KEYS.has(slot)) return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
    const dir   = await slotDir(slot);
    const files = await readdir(dir);
    const imgs  = await Promise.all(
      files.filter(f => /\.(jpe?g|png|webp|gif|svg)$/i.test(f)).map(async f => {
        const s = await stat(path.join(dir, f));
        return { name: f, url: `/img/${slot}/${f}`, size: s.size, createdAt: s.mtime.toISOString() };
      })
    );
    return NextResponse.json(imgs.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }

  // Return summary for all slots
  const summary: Record<string, { url: string; name: string }[]> = {};
  for (const key of SLOT_KEYS) {
    const dir = path.join(UPLOADS_DIR, key);
    if (!existsSync(dir)) { summary[key] = []; continue; }
    const files = await readdir(dir);
    summary[key] = files
      .filter(f => /\.(jpe?g|png|webp|gif|svg)$/i.test(f))
      .map(f => ({ name: f, url: `/img/${key}/${f}` }));
  }
  return NextResponse.json(summary);
}

// POST /api/admin/images  body: FormData { slot, file }
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (ON_VERCEL) {
    return NextResponse.json(
      { error: "رفع الصور غير متاح على الخادم الحالي — أضف الصور مباشرة إلى مجلد public/img في الكود ثم أعد النشر" },
      { status: 503 }
    );
  }

  const form = await req.formData();
  const slot = form.get("slot") as string | null;
  const file = form.get("file") as File | null;

  if (!slot || !SLOT_KEYS.has(slot)) return NextResponse.json({ error: "Slot غير صالح" }, { status: 400 });
  if (!file)                         return NextResponse.json({ error: "لم يتم إرسال ملف" }, { status: 400 });
  if (!ALLOWED.has(file.type))       return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 });
  if (file.size > MAX_SIZE)          return NextResponse.json({ error: "حجم الملف يتجاوز 5 MB" }, { status: 400 });

  const ext      = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const safeName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9\-_]/g, "-").slice(0, 40);
  const filename = `${Date.now()}-${safeName}.${ext}`;

  const dir = await slotDir(slot);
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/img/${slot}/${filename}`, name: filename }, { status: 201 });
}

// DELETE /api/admin/images  body: { slot, name }
export async function DELETE(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (ON_VERCEL) return NextResponse.json({ error: "حذف الصور غير متاح على الخادم الحالي" }, { status: 503 });

  const { slot, name } = await req.json() as { slot: string; name: string };
  if (!slot || !SLOT_KEYS.has(slot))                          return NextResponse.json({ error: "Slot غير صالح" }, { status: 400 });
  if (!name || name.includes("..") || name.includes("/"))     return NextResponse.json({ error: "اسم ملف غير صالح" }, { status: 400 });

  await unlink(path.join(UPLOADS_DIR, slot, name));
  return NextResponse.json({ ok: true });
}
