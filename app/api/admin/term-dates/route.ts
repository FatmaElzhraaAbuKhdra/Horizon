import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

async function auth() {
  const c = await cookies();
  return c.get("admin_token")?.value === (process.env.ADMIN_SECRET ?? "aldenham-admin-secret-2026").trim();
}

const SEED = [
  { year: "2025-2026", termNumber: 1, labelAr: "الفصل الأول", labelEn: "First Term", startAr: "الأحد ٣١ أغسطس ٢٠٢٥", startEn: "Sunday, August 31, 2025", endAr: "الخميس ١١ ديسمبر ٢٠٢٥", endEn: "Thursday, December 11, 2025", halfTermStartAr: "الأحد ٢٦ أكتوبر ٢٠٢٥", halfTermStartEn: "Sunday, October 26, 2025", halfTermEndAr: "الخميس ٣٠ أكتوبر ٢٠٢٥", halfTermEndEn: "Thursday, October 30, 2025", sortOrder: 1 },
  { year: "2025-2026", termNumber: 2, labelAr: "الفصل الثاني", labelEn: "Second Term", startAr: "الأحد ٤ يناير ٢٠٢٦", startEn: "Sunday, January 4, 2026", endAr: "الخميس ١٩ مارس ٢٠٢٦", endEn: "Thursday, March 19, 2026", halfTermStartAr: "الأحد ٢٢ فبراير ٢٠٢٦", halfTermStartEn: "Sunday, February 22, 2026", halfTermEndAr: "الخميس ٢٦ فبراير ٢٠٢٦", halfTermEndEn: "Thursday, February 26, 2026", sortOrder: 2 },
  { year: "2025-2026", termNumber: 3, labelAr: "الفصل الثالث", labelEn: "Third Term", startAr: "الاثنين ٦ أبريل ٢٠٢٦", startEn: "Monday, April 6, 2026", endAr: "الخميس ٢ يوليو ٢٠٢٦", endEn: "Thursday, July 2, 2026", halfTermStartAr: "", halfTermStartEn: "", halfTermEndAr: "", halfTermEndEn: "", sortOrder: 3 },
];

export async function GET() {
  try {
    const count = await prisma.termDate.count();
    if (count === 0) await prisma.termDate.createMany({ data: SEED });
    const rows = await prisma.termDate.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(rows);
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function POST(req: Request) {
  if (!await auth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const row = await prisma.termDate.create({ data });
  return NextResponse.json(row);
}
