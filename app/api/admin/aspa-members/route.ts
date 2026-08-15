import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

async function auth() {
  const c = await cookies();
  return c.get("admin_token")?.value === (process.env.ADMIN_SECRET ?? "aldenham-admin-secret-2026").trim();
}

const SEED = [
  { nameAr: "السيدة توفل العكبي", nameEn: "Mrs Tufful AlOkby", roleAr: "الرئيسة", roleEn: "President", sortOrder: 1 },
  { nameAr: "السيدة فاطمة بوعخاريف", nameEn: "Mrs Fatima Bouakharif", roleAr: "السكرتيرة", roleEn: "Secretary", sortOrder: 2 },
  { nameAr: "السيدة ريان زعيم", nameEn: "Mrs Rayanne Zaim", roleAr: "أمينة الصندوق", roleEn: "Treasurer", sortOrder: 3 },
  { nameAr: "السيدة رلى الجرف", nameEn: "Mrs Rula El-Jorf", roleAr: "عضو مجلس الإدارة", roleEn: "Board Member", sortOrder: 4 },
  { nameAr: "السيد إسحاق أوري", nameEn: "Mr Ishaq Uri", roleAr: "عضو مجلس الإدارة", roleEn: "Board Member", sortOrder: 5 },
  { nameAr: "السيد ريتشارد مولدون", nameEn: "Mr Richard Muldoon", roleAr: "عضو مجلس الإدارة", roleEn: "Board Member", sortOrder: 6 },
  { nameAr: "السيد راكان غوث", nameEn: "Mr Rakan Ghoth", roleAr: "عضو مجلس الإدارة", roleEn: "Board Member", sortOrder: 7 },
  { nameAr: "السيدة دورناز بالوش", nameEn: "Mrs Durnaz Balooch", roleAr: "عضو مجلس الإدارة", roleEn: "Board Member", sortOrder: 8 },
  { nameAr: "السيدة ربى رضا", nameEn: "Mrs Rubab Raza", roleAr: "عضو مجلس الإدارة", roleEn: "Board Member", sortOrder: 9 },
];

export async function GET() {
  try {
    const count = await prisma.aspaMember.count();
    if (count === 0) await prisma.aspaMember.createMany({ data: SEED });
    const rows = await prisma.aspaMember.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(rows);
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function POST(req: Request) {
  if (!await auth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const row = await prisma.aspaMember.create({ data });
  revalidateTag("aspa", {});
  return NextResponse.json(row);
}
