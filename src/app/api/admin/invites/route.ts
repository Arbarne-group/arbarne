import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requireStaff, ALL_ROLES } from "@/lib/access";
import { runWithAuditContext } from "@/lib/audit";
import { sendMail, appBaseUrl } from "@/lib/mailer";
import { inviteEmail } from "@/lib/emailTemplates";
import { uniqueToken } from "@/lib/verification";

const INVITE_TTL_DAYS = 7;

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Staff: list invites. */
export async function GET() {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  const invites = await prisma.invite.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({
    success: true,
    invites: invites.map((i) => ({ ...i, tokenHash: undefined })),
  });
}

/**
 * Staff: invite a user (FFDeveloper / FFAdmin / FFStaff / FFFarmer /
 * FFFarmManager / Other). Emails an accept link valid 7 days.
 */
export async function POST(request: Request) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const body = await request.json();
    const email = String(body.email || "").toLowerCase().trim();
    const role = String(body.role || "");
    const otherRoleLabel = String(body.otherRoleLabel || "").trim() || null;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!ALL_ROLES.includes(role)) {
      return NextResponse.json({ error: "Select a valid role." }, { status: 400 });
    }
    if (role === "Other" && !otherRoleLabel) {
      return NextResponse.json(
        { error: "Describe the role when choosing Other." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.role !== role) {
      return NextResponse.json(
        { error: `That email already has an account with role ${existingUser.role}. An existing user cannot be invited to a different role.` },
        { status: 409 }
      );
    }

    const { token, tokenHash } = await uniqueToken(async (hash) =>
      Boolean(await prisma.invite.findFirst({ where: { tokenHash: hash } }))
    );
    const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);

    await runWithAuditContext({ actorId: gate.user.id }, async () => {
      await prisma.invite.upsert({
        where: { email },
        create: {
          email,
          role,
          otherRoleLabel,
          tokenHash: hashToken(token),
          expiresAt,
          invitedById: gate.user.id,
          acceptedAt: null,
        },
        update: {
          role,
          otherRoleLabel,
          tokenHash: hashToken(token),
          expiresAt,
          invitedById: gate.user.id,
          acceptedAt: null,
        },
      });
    });

    const link = `${appBaseUrl()}/invite/accept?token=${token}`;
    const mail = inviteEmail({ role, label: otherRoleLabel, link, ttlDays: INVITE_TTL_DAYS });
    await sendMail({ to: email, subject: mail.subject, text: mail.text, html: mail.html });

    return NextResponse.json({ success: true, message: "Invitation sent." }, { status: 201 });
  } catch (error: any) {
    console.error("Invite error:", error);
    return NextResponse.json({ error: "Could not send invite." }, { status: 500 });
  }
}
