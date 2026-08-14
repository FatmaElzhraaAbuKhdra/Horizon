import { NextResponse } from "next/server";
import { checkRateLimit, getIp } from "@/lib/rate-limit";

const SECRET = (process.env.ADMIN_SECRET ?? "aldenham-admin-secret-2026").trim();

export async function POST(req: Request) {
  const ip = getIp(req);
  const { allowed } = checkRateLimit(ip, "admin-login", 100, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "تم تجاوز الحد المسموح. حاول مرة أخرى لاحقاً." },
      { status: 429 }
    );
  }

  try {
    const { username, password } = await req.json();

    if (
      username === (process.env.ADMIN_USERNAME ?? "admin").trim() &&
      password === (process.env.ADMIN_PASSWORD ?? "Aldenham2026").trim()
    ) {
      const res = NextResponse.json({ ok: true });
      res.cookies.set("admin_token", SECRET, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    }

    return NextResponse.json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
