import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return unauthorized();
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.testimonial.update({ where: { id }, data: body });
  revalidateTag("testimonials", {});
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return unauthorized();
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  revalidateTag("testimonials", {});
  return NextResponse.json({ success: true });
}
