import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { qualifyReferralFor } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

/**
 * Link an invite code after the fact — for farmers who joined by word of
 * mouth and received the referrer's code later.
 * Body: { email?, code }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const user = await getOrCreateCurrentUser(
      String(body.email || "").trim() || undefined
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }
    const code = String(body.code || "").toUpperCase().trim();
    if (!code) {
      return NextResponse.json(
        { error: "Enter the invite code you were given." },
        { status: 400 }
      );
    }
    const referrer = await prisma.user.findUnique({
      where: { referralCode: code },
      select: { id: true, name: true },
    });
    if (!referrer) {
      return NextResponse.json(
        { error: "That code doesn't match any farmer." },
        { status: 404 }
      );
    }
    if (referrer.id === user.id) {
      return NextResponse.json(
        { error: "You can't use your own invite code." },
        { status: 400 }
      );
    }
    const existing = await prisma.referral.findUnique({
      where: { referredId: user.id },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Your account is already linked to an inviter." },
        { status: 409 }
      );
    }
    const row = await prisma.referral.create({
      data: { referrerId: referrer.id, referredId: user.id },
    });
    // Qualify immediately if this farmer already completed an assessment.
    try {
      await qualifyReferralFor(user.id);
    } catch (e) {
      console.warn("Post-claim qualification notice:", e);
    }
    const fresh = await prisma.referral.findUnique({
      where: { id: row.id },
      select: { status: true },
    });
    return NextResponse.json({
      success: true,
      status: fresh?.status || "pending",
      referrerName: referrer.name || null,
      message:
        fresh?.status === "qualified"
          ? "Invite linked: Your inviter earned KES 500 credit."
          : "Invite linked: Your inviter earns KES 500 credit once you complete an assessment.",
    });
  } catch (error: any) {
    console.error("Claim referral error:", error);
    return NextResponse.json(
      { error: "Could not link that code. Please try again." },
      { status: 500 }
    );
  }
}
