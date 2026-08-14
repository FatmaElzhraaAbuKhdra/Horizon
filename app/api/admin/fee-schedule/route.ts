import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const SEED = [
  { labelAr: "الفصل الأول", labelEn: "Term 1", pct: "40%", dateAr: "١٥ أغسطس", dateEn: "15 August",  sortOrder: 0 },
  { labelAr: "الفصل الثاني", labelEn: "Term 2", pct: "40%", dateAr: "١٥ ديسمبر", dateEn: "15 December", sortOrder: 1 },
  { labelAr: "الفصل الثالث", labelEn: "Term 3", pct: "20%", dateAr: "١ أبريل",   dateEn: "1 April",     sortOrder: 2 },
];

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  const rows = await prisma.feeScheduleTerm.findMany({ orderBy: { sortOrder: "asc" } });
  if (rows.length === 0) {
    await prisma.feeScheduleTerm.createMany({ data: SEED });
    return NextResponse.json(await prisma.feeScheduleTerm.findMany({ orderBy: { sortOrder: "asc" } }));
  }
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return unauthorized();
  const body = await req.json();
  const row = await prisma.feeScheduleTerm.create({ data: body });
  return NextResponse.json(row);
}
