import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const SEED = [
  { textAr: "ابنتي تحبّ المدرسة بشكل لم نتوقعه. المعلمون يعطون اهتماماً شخصياً لكل طالب والمنهج رائع وممتع.", textEn: "My daughter loves school in a way we never expected. The teachers give individual attention and the curriculum is wonderful.", name: "نورة العنزي", roleAr: "والدة طالبة في الصف الثالث", roleEn: "Parent of a Year 3 student", initials: "ن.ع", sortOrder: 0 },
  { textAr: "منذ التحاق ابني تحسنت لغته الإنجليزية بشكل ملحوظ، وأصبح أكثر ثقةً. البيئة الدولية أثرت شخصيته كثيراً.", textEn: "Since joining Horizon International Schools, my son's English has improved remarkably and he's become more confident. The international environment has greatly enriched his personality.", name: "خالد المطيري", roleAr: "والد طالب في الصف الخامس", roleEn: "Parent of a Year 5 student", initials: "خ.م", sortOrder: 1 },
  { textAr: "التعليم الدولي المتميز في الرياض — هذا ما وجدناه في الأفق العالمية. إدارة محترفة وتواصل ممتاز مع أولياء الأمور.", textEn: "Outstanding international education in Riyadh — that's what we found at Horizon International Schools. Professional management and excellent communication with parents.", name: "سارة القحطاني", roleAr: "والدة طالبتين في المدرسة", roleEn: "Parent of two students", initials: "س.ق", sortOrder: 2 },
];

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  const rows = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  if (rows.length === 0) {
    await prisma.testimonial.createMany({ data: SEED });
    return NextResponse.json(await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }));
  }
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return unauthorized();
  const body = await req.json();
  const row = await prisma.testimonial.create({ data: body });
  return NextResponse.json(row);
}
