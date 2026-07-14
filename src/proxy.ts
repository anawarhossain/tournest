import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require a logged-in user (Requirements §2 / §4).
const PROTECTED_PREFIXES = [
  "/items/add",
  "/items/manage",
  "/items/edit",
  "/booking",
  "/bookings",
  "/profile",
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) return NextResponse.next();

  // Lightweight cookie-presence check — NOT full session verification.
  // (Full verification happens again in each Server Component / API route
  // via auth.api.getSession — a DB round-trip on every request here would
  // slow down all matched routes, so we keep this check cheap.)
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/items/:path*",
    "/booking/:path*",
    "/bookings/:path*",
    "/profile/:path*",
  ],
};
