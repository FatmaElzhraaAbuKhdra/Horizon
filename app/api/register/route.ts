import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getIp } from "@/lib/rate-limit";
import { sendRegistrationEmail } from "@/lib/email";

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function isValidPhone(p: string) {
  return /^\+?[\d\s\-()]{7,20}$/.test(p);
}

export async function POST(req: Request) {
  const { allowed } = checkRateLimit(getIp(req), "register", 10, 60 * 60 * 1000);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  try {
    const d = await req.json();

    if (!d.studentName?.trim()) return NextResponse.json({ error: "اسم الطالب مطلوب" }, { status: 400 });
    if (!d.parentName?.trim())  return NextResponse.json({ error: "اسم ولي الأمر مطلوب" }, { status: 400 });
    if (!d.level?.trim())       return NextResponse.json({ error: "المرحلة الدراسية مطلوبة" }, { status: 400 });
    if (!d.phone?.trim() || !isValidPhone(d.phone)) return NextResponse.json({ error: "رقم الهاتف غير صحيح" }, { status: 400 });
    if (!d.email?.trim() || !isValidEmail(d.email)) return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });

    const reg = await prisma.registration.create({
      data: {
        studentName:  d.studentName.trim(),
        dateOfBirth:  d.dob || null,
        gender:       d.gender || null,
        level:        d.level.trim(),
        academicYear: d.year || d.academicYear,
        parentName:   d.parentName.trim(),
        phone:        d.phone.trim(),
        email:        d.email.trim().toLowerCase(),
        nationality:  d.nationality || null,
        source:       d.source || null,
        notes:        d.notes || null,
      },
    });
    sendRegistrationEmail({
      studentName: d.studentName.trim(),
      parentName:  d.parentName.trim(),
      level:       d.level.trim(),
      phone:       d.phone.trim(),
      email:       d.email.trim(),
      dob:         d.dob,
      gender:      d.gender,
      nationality: d.nationality,
      source:      d.source,
      notes:       d.notes,
    }).catch(e => console.error("Email send error:", e));
    return NextResponse.json({ success: true, id: reg.id }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Failed to save registration" }, { status: 500 });
  }
}
