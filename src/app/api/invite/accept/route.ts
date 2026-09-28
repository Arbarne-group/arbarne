import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { runWithAuditContext } from "@/lib/audit";
import { signSession, sessionCookieHeader } from "@/lib/session";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function findInvite(token: string) {
  const clean = token.trim();
  if (!/^[a-f0-9]{32,64}$/i.test(clean)) return null;
  const invite = await prisma.invite.findFirst({ where: { tokenHash: hashToken(clean) } });
  if (!invite || invite.acceptedAt || invite.expiresAt.getTime() < Date.now()) return null;
  return invite;
}

/** Look up a pending invite by token only (used by the accept page). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || "";
  if (!token) {
    return NextResponse.json({ error: "Invalid invite link." }, { status: 400 });
  }
  const invite = await findInvite(token);
  if (!invite) {
    return NextResponse.json({ error: "This invite is invalid or expired." }, { status: 400 });
  }
  return NextResponse.json({
    success: true,
    invite: {
      email: invite.email,
      role: invite.role,
      otherRoleLabel: invite.otherRoleLabel,
      expiresAt: invite.expiresAt,
    },
  });
}

/** Accept an invite: set names + password → active VERIFIED account. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token || "").trim();
    const firstName = String(body.firstName || "").trim();
    const middleName = String(body.middleName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const password = String(body.password || "");
    const confirmPassword = String(body.confirmPassword || "");

    if (!token) {
      return NextResponse.json({ error: "Invalid invite link." }, { status: 400 });
    }
    if (!firstName || !lastName) {
      return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
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

    const invite = await findInvite(token);
    if (!invite) {
      return NextResponse.json({ error: "This invite is invalid or expired." }, { status: 400 });
    }
    const email = invite.email;

    const passwordHash = await bcrypt.hash(password, 10);
    const displayName = [firstName, middleName, lastName].filter(Boolean).join(" ");

    const user = await runWithAuditContext({ actorId: invite.invitedById ?? undefined }, async () => {
      const existing = await prisma.user.findUnique({ where: { email } });
      const data = {
        firstName,
        middleName: middleName || null,
        lastName,
        name: displayName,
        passwordHash,
        authProvider: "password",
        accountStatus: "VERIFIED",
        role: invite.role,
        otherRoleLabel: invite.otherRoleLabel,
      };
      const saved = existing
        ? await prisma.user.update({ where: { email }, data })
        : await prisma.user.create({ data: { ...data, email } });
      await prisma.invite.update({ where: { email }, data: { acceptedAt: new Date() } });
      return saved;
    });

    const res = NextResponse.json({ success: true, email: user.email });
    const session = await signSession({ userId: user.id, email: user.email });
    res.headers.append("Set-Cookie", sessionCookieHeader(session));
    return res;
  } catch (error: any) {
    console.error("Accept invite error:", error);
    return NextResponse.json({ error: "Could not accept invite." }, { status: 500 });
  }
}
