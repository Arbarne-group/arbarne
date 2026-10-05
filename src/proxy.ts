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
  /^\/privacy(\/|$)/,
  /^\/terms(\/|$)/,
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
  const cookieNames = req.cookies.getAll().map((c) => c.name);
  // Auth.js names the session cookie by scheme: "__Secure-"-prefixed on
  // HTTPS, plain on http. getToken() does NOT auto-detect — called bare it
  // always looks for the plain name, which is why HTTPS logins bounced
  // while localhost worked. Production is always served over HTTPS.
  const isProduction = process.env.NODE_ENV === "production";
  const sessionCookieName = isProduction
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
  let token: { email?: string | null; [key: string]: unknown } | null = null;
  let tokenError: string | null = null;
  try {
    token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      secureCookie: isProduction,
      cookieName: sessionCookieName,
    });
  } catch (e) {
    tokenError = String((e as Error)?.message || e).slice(0, 200);
  }
  console.log(
    "[auth-debug] proxy",
    JSON.stringify({
      path: pathname,
      host: req.nextUrl.host,
      forwardedProto: req.headers.get("x-forwarded-proto"),
      cookies: cookieNames,
      wantedCookie: sessionCookieName,
      wantedCookiePresent: cookieNames.includes(sessionCookieName),
      authSecretSet: Boolean(process.env.AUTH_SECRET),
      tokenEmail: token?.email || null,
      tokenError,
    })
  );

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
    console.log(
      "[auth-debug] proxy BOUNCE",
      JSON.stringify({ path: pathname, cookies: cookieNames })
    );
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
