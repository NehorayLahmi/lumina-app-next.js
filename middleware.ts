import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback_dev_secret_change_me"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect uppercase URLs to lowercase (SEO canonical normalization)
  const lower = pathname.toLowerCase();
  if (pathname !== lower) {
    const url = req.nextUrl.clone();
    url.pathname = lower;
    return NextResponse.redirect(url, { status: 301 });
  }

  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(
        new URL(role === "PRO" ? "/pro/dashboard" : "/login", req.url)
      );
    }

    if (pathname.startsWith("/pro") && role !== "PRO") {
      return NextResponse.redirect(
        new URL(role === "ADMIN" ? "/admin" : "/login", req.url)
      );
    }

    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("auth_token");
    return res;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
