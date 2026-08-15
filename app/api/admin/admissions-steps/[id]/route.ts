import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return unauthorized();
  const { id } = await params;
  const body = await req.json();

  const update: any = {};
  if (body.num      !== undefined) update.num      = body.num;
  if (body.titleAr  !== undefined) update.titleAr  = body.titleAr;
  if (body.titleEn  !== undefined) update.titleEn  = body.titleEn;
  if (body.color    !== undefined) update.color    = body.color;
  if (body.itemsAr  !== undefined) update.itemsAr  = typeof body.itemsAr === "string" ? body.itemsAr : JSON.stringify(body.itemsAr);
  if (body.itemsEn  !== undefined) update.itemsEn  = typeof body.itemsEn === "string" ? body.itemsEn : JSON.stringify(body.itemsEn);
  if (body.sortOrder !== undefined) update.sortOrder = Number(body.sortOrder);

  const step = await prisma.admissionsStep.update({ where: { id }, data: update });
  revalidateTag("admissions", {});
  return NextResponse.json(step);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return unauthorized();
  const { id } = await params;
  await prisma.admissionsStep.delete({ where: { id } });
  revalidateTag("admissions", {});
  return NextResponse.json({ ok: true });
}
