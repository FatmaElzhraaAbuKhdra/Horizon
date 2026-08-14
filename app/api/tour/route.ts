import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getIp } from "@/lib/rate-limit";
import { sendTourEmail } from "@/lib/email";

function isValidPhone(p: string) {
  return /^\+?[\d\s\-()]{7,20}$/.test(p);
}

export async function POST(req: Request) {
  const { allowed } = checkRateLimit(getIp(req), "tour", 10, 60 * 60 * 1000);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  try {
    const d = await req.json();

    if (!d.name?.trim())                          return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
    if (!d.phone?.trim() || !isValidPhone(d.phone)) return NextResponse.json({ error: "رقم الهاتف غير صحيح" }, { status: 400 });
    if (!d.day?.trim())                           return NextResponse.json({ error: "اليوم مطلوب" }, { status: 400 });
    if (!d.time?.trim())                          return NextResponse.json({ error: "الوقت مطلوب" }, { status: 400 });

    const booking = await prisma.tourBooking.create({
      data: {
        name:     d.name.trim(),
        phone:    d.phone.trim(),
        email:    d.email?.trim().toLowerCase() || null,
        day:      d.day.trim(),
        time:     d.time.trim(),
        children: d.children || null,
      },
    });
    sendTourEmail({
      name:     d.name.trim(),
      phone:    d.phone.trim(),
      email:    d.email?.trim(),
      day:      d.day.trim(),
      time:     d.time.trim(),
      children: d.children,
    }).catch(e => console.error("Email send error:", e));
    return NextResponse.json({ success: true, id: booking.id }, { status: 201 });
  } catch (err) {
    console.error("Tour booking error:", err);
    return NextResponse.json({ error: "Failed to save tour booking" }, { status: 500 });
  }
}
