import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const SEED = [
  {
    num: "١", titleAr: "الاستفسار", titleEn: "Enquiry", color: "#7A24B2", sortOrder: 0,
    itemsAr: JSON.stringify(["استلام حزمة المعلومات الكاملة", "نظرة عامة على المنهج البريطاني", "هيكل الرسوم الدراسية", "دعوة لجولة مدرسية"]),
    itemsEn: JSON.stringify(["Receive full information package", "British curriculum overview", "Fee structure details", "School tour invitation"]),
  },
  {
    num: "٢", titleAr: "الجولة المدرسية", titleEn: "School Tour", color: "#7C3AED", sortOrder: 1,
    itemsAr: JSON.stringify(["مراقبة الفصول والدروس المتخصصة", "استكشاف المرافق وبيئات التعلم", "لقاء فريق الرعاية الطلابية", "لقاء أعضاء القيادة"]),
    itemsEn: JSON.stringify(["Observe classes and specialist lessons", "Explore learning spaces and facilities", "Meet the pastoral care team", "Meet leadership members"]),
  },
  {
    num: "٣", titleAr: "التقييم والتسجيل", titleEn: "Assessment & Registration", color: "#B300C4", sortOrder: 2,
    itemsAr: JSON.stringify(["تقييمات مناسبة لعمر الطالب", "مراجعة التقارير المدرسية السابقة", "مقابلات غير رسمية عند الحاجة"]),
    itemsEn: JSON.stringify(["Age-appropriate evaluations", "Review of previous school reports", "Informal interviews if needed"]),
  },
  {
    num: "٤", titleAr: "العرض والقبول الرسمي", titleEn: "Offer & Acceptance", color: "#DC2626", sortOrder: 3,
    itemsAr: JSON.stringify(["خطاب العرض الرسمي", "وثائق القبول والتأكيد", "تعليمات الدفع وإتمام الإجراءات"]),
    itemsEn: JSON.stringify(["Formal offer letter issued", "Acceptance documents", "Payment instructions and next steps"]),
  },
];

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  let steps = await prisma.admissionsStep.findMany({ orderBy: { sortOrder: "asc" } });
  if (steps.length === 0) {
    await prisma.admissionsStep.createMany({ data: SEED });
    steps = await prisma.admissionsStep.findMany({ orderBy: { sortOrder: "asc" } });
  }
  return NextResponse.json(steps);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return unauthorized();
  const body = await req.json();
  const step = await prisma.admissionsStep.create({
    data: {
      num:      body.num      ?? "٥",
      titleAr:  body.titleAr  ?? "خطوة جديدة",
      titleEn:  body.titleEn  ?? "New Step",
      color:    body.color    ?? "#7A24B2",
      itemsAr:  body.itemsAr  ?? "[]",
      itemsEn:  body.itemsEn  ?? "[]",
      sortOrder: body.sortOrder ?? 99,
    },
  });
  return NextResponse.json(step, { status: 201 });
}
