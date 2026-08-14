import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const SEED = [
  { icon: "💰", labelAr: "وديعة ضمان قابلة للاسترداد", labelEn: "Refundable Security Deposit", valueAr: "٢,٥٠٠ ريال — تُدفع في ١ أبريل (الفصل الثالث)", valueEn: "2,500 SAR — due 1 April (Term 3)", sortOrder: 0 },
  { icon: "🍽️", labelAr: "وجبات الطعام", labelEn: "Meals", valueAr: "الغداء إلزامي — الإفطار اختياري", valueEn: "Lunch is mandatory — Breakfast available as optional add-on", sortOrder: 1 },
  { icon: "👕", labelAr: "الزي المدرسي", labelEn: "School Uniform", valueAr: "طقم كامل للطلاب الجدد (صيفي، شتوي، رياضة)", valueEn: "Complete set required for new students (summer, winter, PE)", sortOrder: 2 },
  { icon: "👨‍👩‍👧", labelAr: "خصم الأشقاء", labelEn: "Sibling Discount", valueAr: "١,٢٥٠ ريال خصم لكل أخ/أخت إضافية — الأكبر يدفع الرسوم كاملة", valueEn: "1,250 SAR discount per additional sibling — eldest pays full fees", sortOrder: 3 },
];

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  const rows = await prisma.feeAdditional.findMany({ orderBy: { sortOrder: "asc" } });
  if (rows.length === 0) {
    await prisma.feeAdditional.createMany({ data: SEED });
    return NextResponse.json(await prisma.feeAdditional.findMany({ orderBy: { sortOrder: "asc" } }));
  }
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return unauthorized();
  const body = await req.json();
  const row = await prisma.feeAdditional.create({ data: body });
  return NextResponse.json(row);
}
