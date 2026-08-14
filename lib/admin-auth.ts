import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SECRET = (process.env.ADMIN_SECRET ?? "aldenham-admin-secret-2026").trim();

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return (store.get("admin_token")?.value ?? "").trim() === SECRET;
}

export const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });
