import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const DEFAULTS: Array<{ key: string; valAr: string; valEn: string }> = [
  { key: "contact.phone",   valAr: "+920015440", valEn: "+920015440" },
  { key: "contact.email",   valAr: "Info@horizon.sch.sa", valEn: "Info@horizon.sch.sa" },
  { key: "contact.address", valAr: "فرع حي الورود ، شمال الرياض ، المملكة العربيه السعودية\nفرع ظهرة لبن ، المملكة العربيه السعودية", valEn: "Al-Woroud Branch, North Riyadh, Saudi Arabia\nZahrat Laban Branch, Saudi Arabia" },
  { key: "contact.hours",   valAr: "الأحد – الخميس: ٧:٠٠ ص – ٣:٠٠ م | السبت: ٩:٠٠ ص – ١:٠٠ م", valEn: "Sunday – Thursday: 7:00 AM – 3:00 PM | Saturday: 9:00 AM – 1:00 PM" },
  { key: "contact.tourInfo",valAr: "متاحة أيام الأحد والثلاثاء — بحجز مسبق", valEn: "Available Sundays and Tuesdays — prior booking required" },
  { key: "gallery.speed",   valAr: "5", valEn: "5" },
];

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  const rows = await prisma.schoolSetting.findMany();
  if (rows.length === 0) {
    await prisma.schoolSetting.createMany({ data: DEFAULTS });
    return NextResponse.json(DEFAULTS);
  }
  return NextResponse.json(rows);
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthed())) return unauthorized();
  const { key, valAr, valEn } = await req.json();
  const row = await prisma.schoolSetting.upsert({
    where: { key },
    update: { valAr, valEn },
    create: { key, valAr, valEn },
  });
  return NextResponse.json(row);
}
