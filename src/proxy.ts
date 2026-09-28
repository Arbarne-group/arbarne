import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_RX = [
  /^\/$/,
  /^\/login(\/|$)/,
  /^\/signup(\/|$)/,
  /^\/complete-profile(\/|$)/,
  /^\/sign-in(\/|$)/,
  /^\/sign-up(\/|$)/,
  /^\/forgot-password(\/|$)/,
  /^\/reset-password(\/|$)/,
  /^\/invite(\/|$)/,
  /^\/pricing(\/|$)/,
  /^\/help(\/|$)/,
  /^\/contact(\/|$)/,
  /^\/verify(\/|$)/,
  /^\/api(\/|$)/,
  // /a/* and /admin self-guard server-side (staff only); the layout
  // redirects everyone else, and every API enforces the role itself.
  /^\/a(\/|$)/,
  /^\/admin(\/|$)/,
];

// Auth routes are only for visitors. Signed-in users get bounced to
// /overview — except /complete-profile, which Google signups must finish
// while signed in.
const AUTHD_ONLY_RX = [
  /^\/login(\/|$)/,
  /^\/signup(\/|$)/,
  /^\/sign-in(\/|$)/,
  /^\/sign-up(\/|$)/,
  /^\/verify(\/|$)/,
  /^\/forgot-password(\/|$)/,
  /^\/reset-password(\/|$)/,
  /^\/invite(\/|$)/,
];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Staff (FFDeveloper / FFAdmin / FFStaff) live exclusively under /a/*.
  // Any other page is a 404 for them; APIs keep working for the admin UI.
  const staffRole = (token as any)?.role;
  const isStaff =
    Boolean(token?.email) &&
    typeof staffRole === "string" &&
    ["FFDeveloper", "FFAdmin", "FFStaff"].includes(staffRole);
  if (
    isStaff &&
    pathname !== "/a" &&
    !pathname.startsWith("/a/") &&
    !pathname.startsWith("/api/")
  ) {
    return NextResponse.rewrite(new URL("/__staff_404__", req.url));
  }

  // Root / → respective dashboard: admin area for staff, farm dashboard
  // for farmers, Login for visitors.
  if (pathname === "/") {
    const role = (token as any)?.role;
    if (token?.email) {
      if (typeof role === "string" && ["FFDeveloper", "FFAdmin", "FFStaff"].includes(role)) {
        return NextResponse.redirect(new URL("/a/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Signed-in users have no business on auth pages (logout lives in the UI).
  if (token?.email && AUTHD_ONLY_RX.some((rx) => rx.test(pathname))) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  if (PUBLIC_RX.some((rx) => rx.test(pathname))) {
    return NextResponse.next();
  }

  // Private routes require an Auth.js session (Google or Credentials).
  // /api routes enforce their own auth (Auth.js or password session cookie),
  // but they are public here so the handlers can respond with JSON 401s.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (!token?.email) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
