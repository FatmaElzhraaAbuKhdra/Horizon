import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return unauthorized();
  const { id } = await params;
  const body = await req.json();
  const { group, term1, term2, term3, total, totalVat, sortOrder } = body;

  const t1 = term1 !== undefined ? Number(term1) : undefined;
  const t2 = term2 !== undefined ? Number(term2) : undefined;
  const t3 = term3 !== undefined ? Number(term3) : undefined;

  const update: any = {};
  if (group !== undefined)     update.group    = group;
  if (t1 !== undefined)        update.term1    = t1;
  if (t2 !== undefined)        update.term2    = t2;
  if (t3 !== undefined)        update.term3    = t3;
  if (total !== undefined)     update.total    = Number(total);
  if (totalVat !== undefined)  update.totalVat = Number(totalVat);
  if (sortOrder !== undefined) update.sortOrder = Number(sortOrder);

  const row = await prisma.feeRow.update({ where: { id }, data: update });
  return NextResponse.json(row);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return unauthorized();
  const { id } = await params;
  await prisma.feeRow.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
