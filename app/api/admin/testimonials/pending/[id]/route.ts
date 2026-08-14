import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

// Approve: create Testimonial from pending then mark as approved
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.pendingTestimonial.findUnique({ where: { id } });
  if (!p) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const initials = p.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w: string) => w[0])
    .join(".");

  const maxOrder = await prisma.testimonial.findFirst({ orderBy: { sortOrder: "desc" } });
  await prisma.testimonial.create({
    data: {
      textAr: p.textAr,
      textEn: p.textEn,
      name: p.name,
      roleAr: p.roleAr,
      roleEn: "",
      initials,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  await prisma.pendingTestimonial.update({ where: { id }, data: { status: "approved" } });
  return NextResponse.json({ ok: true });
}

// Reject / delete
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return unauthorized();
  const { id } = await params;
  await prisma.pendingTestimonial.update({ where: { id }, data: { status: "rejected" } });
  return NextResponse.json({ ok: true });
}
