import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  const [registrations, tours, events, messages, unread, pending] = await Promise.all([
    prisma.registration.count(),
    prisma.tourBooking.count(),
    prisma.eventRegistration.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "unread" } }),
    prisma.registration.count({ where: { status: "pending" } }),
  ]);
  return NextResponse.json({ registrations, tours, events, messages, unread, pending });
}
