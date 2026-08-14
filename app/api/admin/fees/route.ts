import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const SEED = [
  { group: "رياض الأطفال (Nursery)",              term1: 18600, term2: 18600, term3: 9300,  total: 46500, totalVat: 53475, sortOrder: 0 },
  { group: "الاستقبال (Reception)",                term1: 19400, term2: 19400, term3: 9700,  total: 48500, totalVat: 55775, sortOrder: 1 },
  { group: "الصف الأول والثاني (Year 1–2)",        term1: 21400, term2: 21400, term3: 10700, total: 53500, totalVat: 61525, sortOrder: 2 },
  { group: "الصف الثالث حتى السادس (Year 3–6)",   term1: 25400, term2: 25400, term3: 12700, total: 63500, totalVat: 73025, sortOrder: 3 },
  { group: "الصف السابع حتى التاسع (Year 7–9)",   term1: 28000, term2: 28000, term3: 14000, total: 70000, totalVat: 80500, sortOrder: 4 },
];

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  let rows = await prisma.feeRow.findMany({ orderBy: { sortOrder: "asc" } });
  if (rows.length === 0) {
    await prisma.feeRow.createMany({ data: SEED });
    rows = await prisma.feeRow.findMany({ orderBy: { sortOrder: "asc" } });
  }
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return unauthorized();
  const body = await req.json();
  const { group, term1, term2, term3, total, totalVat, sortOrder } = body;
  const t1 = Number(term1), t2 = Number(term2), t3 = Number(term3);
  const row = await prisma.feeRow.create({
    data: {
      group: group ?? "مجموعة جديدة",
      term1: t1, term2: t2, term3: t3,
      total: total !== undefined ? Number(total) : t1 + t2 + t3,
      totalVat: totalVat !== undefined ? Number(totalVat) : Math.round((t1 + t2 + t3) * 1.15),
      sortOrder: sortOrder ?? 99,
    },
  });
  return NextResponse.json(row, { status: 201 });
}
