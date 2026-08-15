import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";

const SEED = [
  { icon: "🏆", titleAr: "طلابنا يفوزون في بطولة الرياضيات الإقليمية", titleEn: "Our Students Win Regional Maths Championship", descAr: "أحرز طلاب مدارس الأفق العالمية المركز الأول في بطولة الرياضيات الإقليمية المقامة بالرياض.", descEn: "Horizon International Schools students secured first place in the Regional Mathematics Championship held in Riyadh.", date: "2026-05-10", sortOrder: 0 },
  { icon: "🎭", titleAr: "العرض المسرحي السنوي ٢٠٢٦", titleEn: "Annual Drama Production 2026", descAr: "عرض مسرحي مذهل قدمه طلاب المرحلة الإعدادية أمام حشد من أولياء الأمور والضيوف.", descEn: "A stunning theatrical performance presented by Prep students to an audience of parents and guests.", date: "2026-04-20", sortOrder: 1 },
  { icon: "📚", titleAr: "إطلاق نادي القراءة المدرسي", titleEn: "School Reading Club Launch", descAr: "إطلاق نادي القراءة الجديد بمشاركة واسعة من الطلاب وتحت إشراف مكتبة المدرسة الحديثة.", descEn: "Launch of the new Reading Club with wide student participation under the supervision of the school's modern library.", date: "2026-03-15", sortOrder: 2 },
];

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  let rows = await prisma.newsItem.findMany({ orderBy: { sortOrder: "asc" } });
  if (rows.length === 0) {
    await prisma.newsItem.createMany({ data: SEED });
    rows = await prisma.newsItem.findMany({ orderBy: { sortOrder: "asc" } });
  }
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return unauthorized();
  const body = await req.json();
  const row = await prisma.newsItem.create({
    data: {
      icon:     body.icon     ?? "📰",
      titleAr:  body.titleAr  ?? "",
      titleEn:  body.titleEn  ?? "",
      descAr:   body.descAr   ?? "",
      descEn:   body.descEn   ?? "",
      date:     body.date     ?? new Date().toISOString().slice(0, 10),
      active:   body.active   ?? true,
      sortOrder: body.sortOrder ?? 99,
    },
  });
  revalidateTag("news", {});
  return NextResponse.json(row, { status: 201 });
}
