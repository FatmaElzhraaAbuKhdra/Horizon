import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const SECRET    = (process.env.ADMIN_SECRET ?? "aldenham-admin-secret-2026").trim();
const VIDEO_DIR = path.join(process.cwd(), "public", "videos");
const VIDEO_PATH = path.join(VIDEO_DIR, "hero.mp4");
const ALLOWED   = new Set(["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"]);

async function isAuthed() {
  const store = await cookies();
  return store.get("admin_token")?.value === SECRET;
}

// GET → current hero video info
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!existsSync(VIDEO_PATH)) {
    return NextResponse.json({ exists: false });
  }
  const s = await stat(VIDEO_PATH);
  return NextResponse.json({
    exists: true,
    size: s.size,
    updatedAt: s.mtime.toISOString(),
    url: "/videos/hero.mp4",
  });
}

// DELETE → remove hero video
export async function DELETE() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!existsSync(VIDEO_PATH)) {
    return NextResponse.json({ error: "لا يوجد فيديو لحذفه" }, { status: 404 });
  }
  const { unlink } = await import("fs/promises");
  await unlink(VIDEO_PATH);
  return NextResponse.json({ ok: true });
}

// POST → upload new hero video (replaces existing)
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "تعذّر قراءة البيانات المرسلة" }, { status: 400 });
  }

  const file = form.get("video") as File | null;
  if (!file) return NextResponse.json({ error: "لم يُرسَل ملف" }, { status: 400 });
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "نوع الملف غير مدعوم — يُرجى رفع MP4 أو WebM" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(VIDEO_PATH, buffer);

  const s = await stat(VIDEO_PATH);
  return NextResponse.json({
    ok: true,
    url: "/videos/hero.mp4",
    size: s.size,
    updatedAt: s.mtime.toISOString(),
  }, { status: 200 });
}
