import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

async function auth() {
  const c = await cookies();
  return c.get("admin_token")?.value === (process.env.ADMIN_SECRET ?? "aldenham-admin-secret-2026").trim();
}

const SEED: Array<{ categoryAr: string; categoryEn: string; titleAr: string; titleEn: string; fileUrl: string; sortOrder: number }> = [
  { categoryAr: "الحماية والرعاية", categoryEn: "Protection & Wellbeing", titleAr: "سياسة مكافحة التنمر", titleEn: "Anti-Bullying Policy", fileUrl: "", sortOrder: 1 },
  { categoryAr: "الحماية والرعاية", categoryEn: "Protection & Wellbeing", titleAr: "سياسة حماية الطفل", titleEn: "Safeguarding and Child Protection Policy", fileUrl: "", sortOrder: 2 },
  { categoryAr: "الحماية والرعاية", categoryEn: "Protection & Wellbeing", titleAr: "سياسة رعاية الطلاب", titleEn: "Student Welfare Policy", fileUrl: "", sortOrder: 3 },
  { categoryAr: "الحماية والرعاية", categoryEn: "Protection & Wellbeing", titleAr: "سياسة تكافؤ الفرص", titleEn: "Equal Opportunities Policy", fileUrl: "", sortOrder: 4 },
  { categoryAr: "الحماية والرعاية", categoryEn: "Protection & Wellbeing", titleAr: "سياسة الدمج والشمول", titleEn: "Inclusion Policy", fileUrl: "", sortOrder: 5 },
  { categoryAr: "السلوك والمجتمع", categoryEn: "Behaviour & Community", titleAr: "سياسة السلوك", titleEn: "Behaviour Policy", fileUrl: "", sortOrder: 6 },
  { categoryAr: "السلوك والمجتمع", categoryEn: "Behaviour & Community", titleAr: "سياسة السلامة الرقمية", titleEn: "Digital Safety Policy", fileUrl: "", sortOrder: 7 },
  { categoryAr: "السلوك والمجتمع", categoryEn: "Behaviour & Community", titleAr: "سياسة الإشراف", titleEn: "Supervision Policy", fileUrl: "", sortOrder: 8 },
  { categoryAr: "الأكاديمي", categoryEn: "Academic", titleAr: "سياسة المناهج", titleEn: "Curriculum Policy", fileUrl: "", sortOrder: 9 },
  { categoryAr: "الأكاديمي", categoryEn: "Academic", titleAr: "سياسة التقييم والتقارير", titleEn: "Assessment and Reporting Policy", fileUrl: "", sortOrder: 10 },
  { categoryAr: "الأكاديمي", categoryEn: "Academic", titleAr: "سياسة الواجبات المنزلية", titleEn: "Homework and Marking Policy", fileUrl: "", sortOrder: 11 },
  { categoryAr: "العمليات المدرسية", categoryEn: "School Operations", titleAr: "سياسة الحضور والغياب", titleEn: "Attendance Policy", fileUrl: "", sortOrder: 12 },
  { categoryAr: "العمليات المدرسية", categoryEn: "School Operations", titleAr: "سياسة الأنشطة اللامنهجية", titleEn: "Co-Curricular Activities (CCA) Policy", fileUrl: "", sortOrder: 13 },
  { categoryAr: "القبول والإدارة", categoryEn: "Admissions & Governance", titleAr: "سياسة القبول", titleEn: "Admissions Policy", fileUrl: "", sortOrder: 14 },
  { categoryAr: "القبول والإدارة", categoryEn: "Admissions & Governance", titleAr: "سياسة الشكاوى", titleEn: "Complaints Policy", fileUrl: "", sortOrder: 15 },
  { categoryAr: "القبول والإدارة", categoryEn: "Admissions & Governance", titleAr: "دليل أولياء الأمور ٢٠٢٥-٢٠٢٦", titleEn: "Parent Handbook 2025-2026", fileUrl: "", sortOrder: 16 },
];

export async function GET() {
  try {
    const count = await prisma.policy.count();
    if (count === 0) await prisma.policy.createMany({ data: SEED });
    const rows = await prisma.policy.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(rows);
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function POST(req: Request) {
  if (!await auth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const row = await prisma.policy.create({ data });
  revalidateTag("policies", {});
  return NextResponse.json(row);
}
