import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/login(.*)",
  "/signup(.*)",
  "/pricing(.*)",
  "/help(.*)",
  "/contact(.*)",
  "/api/(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl;

    // Direct legacy /login and /signup routes to Clerk's canonical routes
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    if (pathname === "/signup") {
      return NextResponse.redirect(new URL("/sign-up", req.url));
    }

    // Authenticated users landing on root / should be taken to /onboarding
    if (pathname === "/") {
      const authObj = await auth();
      if (authObj.userId) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
    }

    // Enforce authentication on all private routes
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  },
  {
    authorizedParties: [
      "https://app.futurefarms.africa",
      "https://futurefarms.africa",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
