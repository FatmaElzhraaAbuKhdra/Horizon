import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";

const SEED = [
  { labelAr: "رسوم التقييم والتسجيل", labelEn: "Assessment / Registration Fee", amount: 1000, noteAr: "غير قابلة للاسترداد — تغطي التكاليف الإدارية والتقييم", noteEn: "Non-refundable — covers administrative and evaluation costs", sortOrder: 0 },
  { labelAr: "رسوم القبول", labelEn: "Acceptance Fee", amount: 10000, noteAr: "غير قابلة للاسترداد — لتأمين التحاق الطالب", noteEn: "Non-refundable — secures student enrolment", sortOrder: 1 },
  { labelAr: "رسوم التطوير الرأسمالي", labelEn: "Capital Development Fee", amount: 10000, noteAr: "غير قابلة للاسترداد — احتجاز مقعد الطالب", noteEn: "Non-refundable — reserves student seat", sortOrder: 2 },
];

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  const rows = await prisma.feeOneTime.findMany({ orderBy: { sortOrder: "asc" } });
  if (rows.length === 0) {
    await prisma.feeOneTime.createMany({ data: SEED });
    return NextResponse.json(await prisma.feeOneTime.findMany({ orderBy: { sortOrder: "asc" } }));
  }
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return unauthorized();
  const body = await req.json();
  const row = await prisma.feeOneTime.create({ data: body });
  revalidateTag("fees", {});
  return NextResponse.json(row);
}
