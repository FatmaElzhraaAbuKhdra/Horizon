import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { name, roleAr, textAr, textEn, phone } = await req.json();
  if (!name || !textAr || !roleAr) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  await prisma.pendingTestimonial.create({
    data: { name, roleAr, textAr, textEn: textEn ?? "", phone: phone ?? "" },
  });
  return NextResponse.json({ ok: true });
}
