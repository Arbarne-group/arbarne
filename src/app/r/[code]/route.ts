import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Share-link entry: /r/FF-XXXXXX
 * Records the visit (counted even when the visitor never signs up) and
 * forwards to signup with the referral code attached.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const normalized = (code || "").toUpperCase().trim();
  // Same-origin redirect: works on localhost, staging and production.
  const signupUrl = new URL("/signup", request.url);

  if (!normalized) {
    return NextResponse.redirect(signupUrl);
  }
  try {
    const referrer = await prisma.user.findUnique({
      where: { referralCode: normalized },
      select: { id: true },
    });
    if (!referrer) {
      return NextResponse.redirect(signupUrl);
    }
    await prisma.referralClick.create({
      data: { referrerId: referrer.id },
    });
    signupUrl.searchParams.set("ref", normalized);
    return NextResponse.redirect(signupUrl);
  } catch (e) {
    console.error("Referral redirect failed:", e);
    return NextResponse.redirect(signupUrl);
  }
}
