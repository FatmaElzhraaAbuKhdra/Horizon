import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getIp } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email";

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export async function POST(req: Request) {
  const { allowed } = checkRateLimit(getIp(req), "contact", 10, 60 * 60 * 1000);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  try {
    const d = await req.json();

    if (!d.name?.trim())                          return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
    if (!d.email?.trim() || !isValidEmail(d.email)) return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });

    const msg = await prisma.contactMessage.create({
      data: {
        name:    d.name.trim(),
        phone:   d.phone?.trim() || null,
        email:   d.email.trim().toLowerCase(),
        subject: d.subject?.trim() || null,
        message: d.message?.trim() || null,
      },
    });
    sendContactEmail({
      name:    d.name.trim(),
      email:   d.email.trim(),
      phone:   d.phone?.trim(),
      subject: d.subject?.trim(),
      message: d.message?.trim(),
    }).catch(e => console.error("Email send error:", e));
    return NextResponse.json({ success: true, id: msg.id }, { status: 201 });
  } catch (err) {
    console.error("Contact message error:", err);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
