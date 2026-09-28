import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runWithAuditContext } from "@/lib/audit";
import { uniqueToken, sendPasswordResetEmail } from "@/lib/verification";

const RESET_TTL_MIN = 60;

/** Request a password-reset email. Always returns ok (no enumeration). */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "")
      .toLowerCase()
      .trim();

    if (email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        const { token, tokenHash } = await uniqueToken(async (hash) =>
          Boolean(
            await prisma.passwordResetToken.findUnique({ where: { tokenHash: hash } })
          )
        );
        const expiresAt = new Date(Date.now() + RESET_TTL_MIN * 60 * 1000);
        await runWithAuditContext({ actorId: user.id }, async () => {
          await prisma.passwordResetToken.updateMany({
            where: { userId: user.id, usedAt: null },
            data: { usedAt: new Date() },
          });
          await prisma.passwordResetToken.create({
            data: { userId: user.id, tokenHash, expiresAt },
          });
        });
        await sendPasswordResetEmail(email, token);
      }
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists for that email, a reset link was sent.",
    });
  } catch (error: any) {
    console.error("Forgot error:", error);
    return NextResponse.json({ error: "Could not process request." }, { status: 500 });
  }
}
