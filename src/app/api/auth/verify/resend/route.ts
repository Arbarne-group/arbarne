import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requestVerificationCode } from "@/lib/verification";

/** Resend a verification code (30s cooldown). Accepts { id } or { email }.
 *  Email-based lookup requires a pending (unverified) account. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = String(body.id || "").trim();
    let email = String(body.email || "")
      .toLowerCase()
      .trim();

    if (!email && id) {
      const row = await prisma.emailVerification.findUnique({ where: { publicId: id } });
      if (!row) {
        return NextResponse.json({ error: "Invalid verification link." }, { status: 400 });
      }
      email = row.email;
    }
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (!id) {
      const account = await prisma.user.findUnique({ where: { email } });
      if (!account || account.accountStatus === "VERIFIED") {
        return NextResponse.json(
          { error: "No pending verification for this email." },
          { status: 400 }
        );
      }
    }

    const { publicId, retryAfter, mailSent } = await requestVerificationCode(email);
    if (retryAfter) {
      return NextResponse.json(
        {
          error: `Please wait ${retryAfter}s before requesting another code.`,
          retryAfter,
          publicId,
          mailSent: true,
        },
        { status: 429 }
      );
    }
    return NextResponse.json({
      success: true,
      publicId,
      mailSent,
      message: mailSent ? "A new code was sent." : "Code issued, but the email could not be delivered. Try resending.",
    });
  } catch (error: any) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Could not resend code." }, { status: 500 });
  }
}
