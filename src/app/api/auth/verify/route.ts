import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCodeById, getVerificationChallenge } from "@/lib/verification";
import { sendMail } from "@/lib/mailer";
import { welcomeEmail } from "@/lib/emailTemplates";
import { signSession, sessionCookieHeader } from "@/lib/session";
import { runWithAuditContext } from "@/lib/audit";

/** Challenge metadata for rendering /verify/<id> (no email, no code). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = (searchParams.get("id") || "").trim();
  if (!id) {
    return NextResponse.json({ error: "Invalid verification link." }, { status: 400 });
  }
  const challenge = await getVerificationChallenge(id);
  if (!challenge) {
    return NextResponse.json({ error: "This verification link is invalid or already used." }, { status: 400 });
  }
  return NextResponse.json({ success: true, challenge });
}

/** Step 2: verify the emailed code → mark VERIFIED + set session. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = String(body.id || "").trim();
    const code = String(body.code || "").trim();

    if (!id || !code) {
      return NextResponse.json(
        { error: "Verification link and code are required." },
        { status: 400 }
      );
    }

    const result = await verifyCodeById(id, code);
    if (!result.ok) {
      const messages: Record<string, string> = {
        NO_CODE: "This verification link is invalid. Please sign up again.",
        EXPIRED: "That code expired. Request a new one.",
        TOO_MANY_ATTEMPTS: "Too many wrong attempts. Request a new code.",
        INVALID: "Incorrect code. Check and try again.",
      };
      return NextResponse.json(
        { success: false, error: messages[result.reason || "INVALID"], code: result.reason },
        { status: 400 }
      );
    }

    const email = result.email!;
    const existing = await prisma.user.findUnique({ where: { email } });
    const user = await runWithAuditContext({ actorId: existing?.id }, async () =>
      prisma.user.update({
        where: { email },
        data: { accountStatus: "VERIFIED" },
      })
    );

    // Welcome email (best-effort — never fails verification).
    try {
      const mail = welcomeEmail({ name: user.firstName || undefined });
      await sendMail({ to: user.email, subject: mail.subject, text: mail.text, html: mail.html });
    } catch (mailErr) {
      console.warn("[Verify] welcome email notice:", (mailErr as Error)?.message);
    }

    const res = NextResponse.json({
      success: true,
      needsDetails: !user.countryCode || !user.phone || !user.farmingType || !user.businessName,
    });
    const token = await signSession({ userId: user.id, email: user.email });
    res.headers.append("Set-Cookie", sessionCookieHeader(token));
    return res;
  } catch (error: any) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
