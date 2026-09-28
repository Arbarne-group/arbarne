import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runWithAuditContext } from "@/lib/audit";
import { signSession, sessionCookieHeader } from "@/lib/session";
import { SIGNUP_ROLES, FARMING_TYPES, getSessionUser, publicUser } from "@/lib/access";

/** Current session user (Auth.js or password session) with safe fields. */
export async function GET() {
  const { user } = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
  }
  return NextResponse.json({ success: true, user: publicUser(user) });
}

/**
 * Step 3 of manual signup (also used post-Google): account type, country,
 * phone (with dial code), farming type.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "")
      .toLowerCase()
      .trim();
    const role = String(body.role || "");
    const countryCode = String(body.countryCode || "")
      .toUpperCase()
      .trim();
    const phoneCountryCode = String(body.phoneCountryCode || "").trim();
    const phoneNational = String(body.phoneNational || "").replace(/[\s-]/g, "");
    const farmingType = String(body.farmingType || "")
      .toUpperCase()
      .trim();
    const businessName = String(body.businessName || "").trim();

    if (!businessName) {
      return NextResponse.json({ error: "Enter your business name." }, { status: 400 });
    }

    if (!SIGNUP_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Choose an account type: Farmer or Farm Manager." },
        { status: 400 }
      );
    }
    const country = await prisma.country.findUnique({ where: { initials: countryCode } });
    if (!country) {
      return NextResponse.json({ error: "Select a valid country." }, { status: 400 });
    }
    if (!/^\+\d{1,4}$/.test(phoneCountryCode)) {
      return NextResponse.json({ error: "Select a valid country dial code." }, { status: 400 });
    }
    if (!/^\d{6,15}$/.test(phoneNational)) {
      return NextResponse.json(
        { error: "Enter a valid phone number (6–15 digits)." },
        { status: 400 }
      );
    }
    if (!FARMING_TYPES.includes(farmingType)) {
      return NextResponse.json({ error: "Select a valid farming type." }, { status: 400 });
    }

    // Prefer the signed-in session (Auth.js or password cookie); fall back to
    // the verified email for the manual email+code flow.
    const session = await getSessionUser();
    const user = session.user ?? (email ? await prisma.user.findUnique({ where: { email } }) : null);
    if (!user) {
      return NextResponse.json({ error: "Account not found. Please log in again." }, { status: 404 });
    }
    if (user.accountStatus !== "VERIFIED") {
      return NextResponse.json(
        { error: "Verify your email first.", code: "UNVERIFIED" },
        { status: 403 }
      );
    }
    const fullPhone = `${phoneCountryCode}${phoneNational}`;
    const updated = await runWithAuditContext({ actorId: user.id }, async () => {
      const saved = await prisma.user.update({
        where: { id: user.id },
        data: {
          role,
          businessName,
          name: businessName,
          countryCode: country.initials,
          phoneCountryCode,
          phoneNational,
          phone: fullPhone,
          farmingType,
        },
      });
      // Business identity lives in its own table (FK → User).
      await prisma.business.upsert({
        where: { userId: user.id },
        create: { userId: user.id, businessName },
        update: { businessName },
      });
      return saved;
    });

    const res = NextResponse.json({ success: true });
    const token = await signSession({ userId: updated.id, email: updated.email });
    res.headers.append("Set-Cookie", sessionCookieHeader(token));
    return res;
  } catch (error: any) {
    console.error("Details error:", error);
    return NextResponse.json({ error: "Could not save details." }, { status: 500 });
  }
}
