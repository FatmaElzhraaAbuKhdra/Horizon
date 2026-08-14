import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getIp } from "@/lib/rate-limit";
import { sendEventEmail } from "@/lib/email";

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function isValidPhone(p: string) {
  return /^\+?[\d\s\-()]{7,20}$/.test(p);
}

export async function POST(req: Request) {
  const { allowed } = checkRateLimit(getIp(req), "event", 10, 60 * 60 * 1000);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  try {
    const d = await req.json();

    if (!d.name?.trim())                            return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
    if (!d.phone?.trim() || !isValidPhone(d.phone)) return NextResponse.json({ error: "رقم الهاتف غير صحيح" }, { status: 400 });
    if (!d.email?.trim() || !isValidEmail(d.email)) return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });

    const reg = await prisma.eventRegistration.create({
      data: {
        name:      d.name.trim(),
        phone:     d.phone.trim(),
        email:     d.email.trim().toLowerCase(),
        ageGroups: Array.isArray(d.ageGroups) ? d.ageGroups.join(", ") : (d.ageGroups || ""),
        notes:     d.notes?.trim() || null,
      },
    });
    sendEventEmail({
      name:      d.name.trim(),
      phone:     d.phone.trim(),
      email:     d.email.trim(),
      ageGroups: Array.isArray(d.ageGroups) ? d.ageGroups.join(", ") : (d.ageGroups || ""),
      notes:     d.notes?.trim(),
    }).catch(e => console.error("Email send error:", e));
    return NextResponse.json({ success: true, id: reg.id }, { status: 201 });
  } catch (err) {
    console.error("Event registration error:", err);
    return NextResponse.json({ error: "Failed to save event registration" }, { status: 500 });
  }
}
