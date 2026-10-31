import { NextRequest, NextResponse } from "next/server";

// Maintenance is ON unless the server's .env sets MAINTENANCE_MODE=false
// (production keeps it on; the preview instance turns it off for client review).
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE !== "false";

export function middleware(req: NextRequest) {
  if (!MAINTENANCE_MODE) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/maintenance";
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip admin, API, Next internals, and any request for a static file (has a dot in the path).
  matcher: ["/((?!admin|api|_next/static|_next/image|maintenance|.*\\..*).*)"],
};
