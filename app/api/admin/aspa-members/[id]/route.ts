import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

async function auth() {
  const c = await cookies();
  return c.get("admin_token")?.value === (process.env.ADMIN_SECRET ?? "aldenham-admin-secret-2026").trim();
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await auth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  const row = await prisma.aspaMember.update({ where: { id }, data });
  revalidateTag("aspa", {});
  return NextResponse.json(row);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await auth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.aspaMember.delete({ where: { id } });
  revalidateTag("aspa", {});
  return NextResponse.json({ ok: true });
}
