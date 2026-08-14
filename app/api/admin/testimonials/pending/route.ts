import { NextResponse } from "next/server";
import { isAdminAuthed, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  const rows = await prisma.pendingTestimonial.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows);
}
