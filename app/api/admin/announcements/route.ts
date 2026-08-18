import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  const rows = await prisma.announcement.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return unauthorized();
  const body = await req.json();
  const row = await prisma.announcement.create({
    data: {
      titleAr:   body.titleAr   ?? "",
      titleEn:   body.titleEn   ?? "",
      bodyAr:    body.bodyAr    ?? "",
      bodyEn:    body.bodyEn    ?? "",
      imageUrl:  body.imageUrl  ?? "",
      date:      body.date      ?? new Date().toISOString().slice(0, 10),
      active:    body.active    ?? true,
      sortOrder: body.sortOrder ?? 99,
    },
  });
  revalidateTag("announcements", {});
  return NextResponse.json(row, { status: 201 });
}
