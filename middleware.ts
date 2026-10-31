import { NextRequest, NextResponse } from "next/server";

// Set to false (or delete this file) once the site is ready to go live again.
const MAINTENANCE_MODE = false;

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
