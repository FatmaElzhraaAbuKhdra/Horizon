import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const SEED = [
  {
    titleAr: "يوم الاستكشاف ٢٠٢٦", titleEn: "Discovery Day 2026",
    dateAr: "السبت، ٢٠ يونيو ٢٠٢٦", dateEn: "Saturday, 20 June 2026",
    timeAr: "الساعة ١٠:٣٠ صباحاً", timeEn: "10:30 AM",
    locationAr: "حي الصحافة، الرياض", locationEn: "Al-Sahafa District, Riyadh",
    descAr: "انضم إلينا لاستكشاف المدرسة ولقاء الكادر التدريسي والتعرف على البرامج الأكاديمية. التسجيل مجاني ومحدود.",
    descEn: "Join us for this special day to explore the school, meet our teaching staff, and learn about our academic programmes. Registration is free and limited.",
    active: true,
  },
];

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  const rows = await prisma.schoolEvent.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return unauthorized();
  const body = await req.json();
  const row = await prisma.schoolEvent.create({ data: body });
  return NextResponse.json(row);
}
