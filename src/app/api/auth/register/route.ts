import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { runWithAuditContext } from "@/lib/audit";
import {
  requestVerificationCode,
  VERIFY_RESEND_SECONDS,
} from "@/lib/verification";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function strongEnough(password: string): string | null {
  if (!password || password.length < 8)
    return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
    return "Password must include both letters and numbers.";
  return null;
}

/**
 * Step 1 of manual signup: names + email + password (+ confirmation).
 * Creates a PENDING_VERIFICATION user and emails a verification code.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = String(body.firstName || "").trim();
    const middleName = String(body.middleName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const email = String(body.email || "")
      .toLowerCase()
      .trim();
    const password = String(body.password || "");
    const confirmPassword = String(body.confirmPassword || "");

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }
    const weak = strongEnough(password);
    if (weak) {
      return NextResponse.json({ error: weak }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.accountStatus === "VERIFIED") {
      return NextResponse.json(
        { error: "An account with this email already exists. Try logging in." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const displayName = [firstName, middleName, lastName].filter(Boolean).join(" ");

    const user = await runWithAuditContext({ actorId: existing?.id }, async () => {
      if (existing) {
        // Retry path: refresh a still-pending account with the new details.
        return prisma.user.update({
          where: { email },
          data: {
            firstName,
            middleName: middleName || null,
            lastName,
            name: displayName,
            passwordHash,
            authProvider: "password",
          },
        });
      }
      return prisma.user.create({
        data: {
          firstName,
          middleName: middleName || null,
          lastName,
          name: displayName,
          email,
          passwordHash,
          authProvider: "password",
          accountStatus: "PENDING_VERIFICATION",
          role: "FFFarmer",
        },
      });
    });

    const { publicId, retryAfter, mailSent } = await requestVerificationCode(email);
    if (retryAfter) {
      return NextResponse.json(
        {
          success: true,
          publicId,
          retryAfter,
          mailSent: true,
          message: `A code was sent recently. You can request a new one in ${retryAfter}s.`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      publicId,
      mailSent,
      message: mailSent
        ? "Account created. Enter the verification code sent to your email."
        : "Account created, but the email could not be delivered. Open the verification page and tap Resend.",
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}

export { VERIFY_RESEND_SECONDS };
