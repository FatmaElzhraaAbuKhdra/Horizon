import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

async function auth() {
  const c = await cookies();
  return c.get("admin_token")?.value === (process.env.ADMIN_SECRET ?? "aldenham-admin-secret-2026").trim();
}

const SEED = [
  { titleAr: "بدء برامج الأنشطة اللامنهجية", titleEn: "CCA Programs Begin", dateAr: "١٢ أبريل ٢٠٢٦", dateEn: "April 12, 2026", category: "academic", sortOrder: 1 },
  { titleAr: "يوم الكتاب العالمي", titleEn: "World Book Day", dateAr: "٢٣ أبريل ٢٠٢٦", dateEn: "April 23, 2026", category: "culture", sortOrder: 2 },
  { titleAr: "معرض العلوم", titleEn: "Science Fair", dateAr: "٧ – ١٠ مايو ٢٠٢٦", dateEn: "May 7–10, 2026", category: "academic", sortOrder: 3 },
  { titleAr: "يوم الأبواب المفتوحة للعائلات", titleEn: "Open Day for Prospective Families", dateAr: "١٦ مايو ٢٠٢٦", dateEn: "May 16, 2026", category: "admissions", sortOrder: 4 },
  { titleAr: "لقاءات أولياء الأمور مع المعلمين", titleEn: "Parent-Teacher Consultations", dateAr: "١٩ – ٢٠ مايو ٢٠٢٦", dateEn: "May 19–20, 2026", category: "parents", sortOrder: 5 },
  { titleAr: "يوم المهن", titleEn: "Career's Day", dateAr: "٤ يونيو ٢٠٢٦", dateEn: "June 4, 2026", category: "academic", sortOrder: 6 },
  { titleAr: "الامتحانات الصيفية", titleEn: "Summer Examinations", dateAr: "١٥ – ١٨ يونيو ٢٠٢٦", dateEn: "June 15–18, 2026", category: "exams", sortOrder: 7 },
  { titleAr: "عروض المسرحية المدرسية", titleEn: "School Play Performances", dateAr: "٢٨ – ٢٩ يونيو ٢٠٢٦", dateEn: "June 28–29, 2026", category: "arts", sortOrder: 8 },
  { titleAr: "يوم الخريج وعروض الموسيقى", titleEn: "Speech Day & Music Performances", dateAr: "٣٠ يونيو – ١ يوليو ٢٠٢٦", dateEn: "June 30 – July 1, 2026", category: "arts", sortOrder: 9 },
  { titleAr: "نهاية العام الدراسي", titleEn: "End of Academic Year", dateAr: "٢ يوليو ٢٠٢٦", dateEn: "July 2, 2026", category: "academic", sortOrder: 10 },
  { titleAr: "بداية العام الدراسي الجديد ٢٠٢٦-٢٠٢٧", titleEn: "New Academic Year Begins 2026-27", dateAr: "٣٠ أغسطس ٢٠٢٦", dateEn: "August 30, 2026", category: "academic", sortOrder: 11 },
];

export async function GET() {
  try {
    const count = await prisma.academicCalendarEvent.count();
    if (count === 0) await prisma.academicCalendarEvent.createMany({ data: SEED });
    const rows = await prisma.academicCalendarEvent.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
    return NextResponse.json(rows);
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function POST(req: Request) {
  if (!await auth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const row = await prisma.academicCalendarEvent.create({ data });
  return NextResponse.json(row);
}
