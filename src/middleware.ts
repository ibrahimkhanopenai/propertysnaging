import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * 1. Protects /admin/* (except /admin/login/) with the JWT session cookie.
 * 2. i18n routing: English has NO URL prefix (keeps the old site URLs) → internally
 *    rewritten to /en/...; Arabic is served from /ar/...; /en/... is 301'd away
 *    so English content never has two URLs.
 *
 * NOTE (Next.js 16+): this file is renamed to `proxy.ts` — see docs/architecture.md.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname.startsWith("/admin/login")) return NextResponse.next();
    const token = req.cookies.get("pi_admin")?.value;
    const secret = process.env.AUTH_SECRET;
    let ok = false;
    if (token && secret) {
      try {
        await jwtVerify(token, new TextEncoder().encode(secret));
        ok = true;
      } catch {
        ok = false;
      }
    }
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login/";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    return NextResponse.redirect(url, 301);
  }

  if (pathname === "/ar" || pathname.startsWith("/ar/")) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API, Next internals, uploads and any file with an extension
  matcher: ["/((?!api/|_next/|uploads/|favicon.ico|.*\\..*).*)"],
};
