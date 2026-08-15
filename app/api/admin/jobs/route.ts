import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

async function auth() {
  const c = await cookies();
  return c.get("admin_token")?.value === (process.env.ADMIN_SECRET ?? "aldenham-admin-secret-2026").trim();
}

const SEED = [
  { titleAr: "معلم لغة إنجليزية (المرحلة الابتدائية)", titleEn: "English Teacher (Primary)", descAr: "نبحث عن معلم لغة إنجليزية متميز ذو خبرة في المنهج البريطاني للعمل مع طلاب المرحلة الابتدائية. يشترط الحصول على شهادة تعليمية معترف بها وخبرة لا تقل عن سنتين في التدريس.", descEn: "We are looking for an exceptional English teacher with experience in the British curriculum to work with primary students. A recognized teaching qualification and minimum 2 years teaching experience required.", active: true },
  { titleAr: "معلم رياضيات (جميع المراحل)", titleEn: "Mathematics Teacher (All Stages)", descAr: "فرصة للانضمام إلى فريق تدريسي متميز. نبحث عن معلم رياضيات شغوف بتعليم الرياضيات بأسلوب إبداعي وتفاعلي وفق معايير المنهج البريطاني الدولي.", descEn: "An opportunity to join a distinguished teaching team. We are looking for a Mathematics teacher passionate about teaching maths creatively and interactively in line with British international curriculum standards.", active: true },
];

export async function GET() {
  try {
    const count = await prisma.job.count();
    if (count === 0) await prisma.job.createMany({ data: SEED });
    const rows = await prisma.job.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(rows);
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function POST(req: Request) {
  if (!await auth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const row = await prisma.job.create({ data });
  revalidateTag("jobs", {});
  return NextResponse.json(row);
}
