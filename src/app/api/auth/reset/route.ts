import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { runWithAuditContext } from "@/lib/audit";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Consume a reset token and set a new strong password. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token || "").trim();
    const password = String(body.password || "");
    const confirmPassword = String(body.confirmPassword || "");

    if (!token) {
      return NextResponse.json({ error: "Reset token is required." }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters with letters and numbers." },
        { status: 400 }
      );
    }

    const row = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });
    if (!row || row.usedAt || row.expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "This reset link is invalid or expired." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await runWithAuditContext({ actorId: row.userId }, async () => {
      await prisma.user.update({
        where: { id: row.userId },
        data: { passwordHash, accountStatus: "VERIFIED" },
      });
      await prisma.passwordResetToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      });
    });

    return NextResponse.json({ success: true, message: "Password updated. You can now log in." });
  } catch (error: any) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "Could not reset password." }, { status: 500 });
  }
}
