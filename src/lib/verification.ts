import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendMail, appBaseUrl } from "@/lib/mailer";
import { verificationEmail, passwordResetEmail } from "@/lib/emailTemplates";

export const VERIFY_CODE_TTL_MIN = 10;
export const VERIFY_RESEND_SECONDS = 30;
export const VERIFY_MAX_ATTEMPTS = 5;

function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function newCode(): string {
  return String(crypto.randomInt(100000, 1000000));
}

/** Dashless UUID, regenerated until unused (per the caller's check). */
export async function uniquePublicId(
  exists: (id: string) => Promise<boolean>
): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const id = crypto.randomUUID().replace(/-/g, "");
    if (!(await exists(id))) return id;
  }
  return crypto.randomUUID().replace(/-/g, "") + Date.now().toString(36);
}

/** Bearer token for reset/invite links: dashless UUID, hashed at rest. */
export async function uniqueToken(
  hashExists: (hash: string) => Promise<boolean>
): Promise<{ token: string; tokenHash: string }> {
  for (let i = 0; i < 5; i++) {
    const token = crypto.randomUUID().replace(/-/g, "");
    const tokenHash = hashCode(token);
    if (!(await hashExists(tokenHash))) return { token, tokenHash };
  }
  const token = crypto.randomUUID().replace(/-/g, "") + Date.now().toString(36);
  return { token, tokenHash: hashCode(token) };
}

/** Issue (or re-issue) a verification code. Enforces 30s resend cooldown.
 *  Mail delivery never fails issuance: if SMTP throws, the caller still gets
 *  the publicId (plus mailSent:false) so the user can proceed to the OTP
 *  screen and retry sending from there. */
export async function requestVerificationCode(
  email: string
): Promise<{ publicId: string; retryAfter?: number; mailSent: boolean }> {
  const normalized = email.toLowerCase().trim();
  const now = new Date();
  const existing = await prisma.emailVerification.findUnique({ where: { email: normalized } });

  if (existing) {
    const elapsed = (now.getTime() - existing.lastSentAt.getTime()) / 1000;
    if (elapsed < VERIFY_RESEND_SECONDS && !existing.verifiedAt) {
      return { publicId: existing.publicId, retryAfter: Math.ceil(VERIFY_RESEND_SECONDS - elapsed), mailSent: true };
    }
  }

  const code = newCode();
  const expiresAt = new Date(now.getTime() + VERIFY_CODE_TTL_MIN * 60 * 1000);

  const row = existing
    ? await prisma.emailVerification.update({
        where: { email: normalized },
        data: { codeHash: hashCode(code), expiresAt, attempts: 0, lastSentAt: now, verifiedAt: null },
      })
    : await prisma.emailVerification.create({
        data: {
          email: normalized,
          publicId: await uniquePublicId(async (id) =>
            Boolean(await prisma.emailVerification.findUnique({ where: { publicId: id } }))
          ),
          codeHash: hashCode(code),
          expiresAt,
          attempts: 0,
          lastSentAt: now,
        },
      });

  const account = await prisma.user
    .findUnique({ where: { email: normalized }, select: { firstName: true } })
    .catch(() => null);
  const mail = verificationEmail({
    name: account?.firstName || undefined,
    code,
    ttlMin: VERIFY_CODE_TTL_MIN,
  });
  try {
    await sendMail({ to: normalized, subject: mail.subject, text: mail.text, html: mail.html });
  } catch (mailErr) {
    console.error("[Verify] code email failed (code still issued):", (mailErr as Error)?.message);
    return { publicId: row.publicId, mailSent: false };
  }

  return { publicId: row.publicId, mailSent: true };
}

/** Validate a code against a challenge id (from /verify/<id>). */
export async function verifyCodeById(
  id: string,
  code: string
): Promise<{ ok: boolean; reason?: string; email?: string }> {
  const row = await prisma.emailVerification.findUnique({ where: { publicId: id } });
  if (!row) return { ok: false, reason: "NO_CODE" };
  if (row.verifiedAt) return { ok: true, email: row.email };
  if (row.attempts >= VERIFY_MAX_ATTEMPTS) return { ok: false, reason: "TOO_MANY_ATTEMPTS" };
  if (row.expiresAt.getTime() < Date.now()) return { ok: false, reason: "EXPIRED" };

  const candidate = hashCode(code.trim());
  const match =
    row.codeHash.length === candidate.length &&
    crypto.timingSafeEqual(Buffer.from(row.codeHash), Buffer.from(candidate));

  if (!match) {
    await prisma.emailVerification.update({
      where: { publicId: id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, reason: "INVALID" };
  }

  await prisma.emailVerification.update({
    where: { publicId: id },
    data: { verifiedAt: new Date() },
  });
  return { ok: true, email: row.email };
}

/** Challenge lookup for rendering /verify/<id> (never exposes the code). */
export async function getVerificationChallenge(id: string) {
  const row = await prisma.emailVerification.findUnique({ where: { publicId: id } });
  if (!row || row.verifiedAt) return null;
  const elapsed = (Date.now() - row.lastSentAt.getTime()) / 1000;
  return {
    emailMasked: maskEmail(row.email),
    expired: row.expiresAt.getTime() < Date.now(),
    resendIn: elapsed < VERIFY_RESEND_SECONDS ? Math.ceil(VERIFY_RESEND_SECONDS - elapsed) : 0,
  };
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const head = local.slice(0, 2);
  return `${head}${"*".repeat(Math.max(0, Math.min(local.length - 2, 4)))}@${domain}`;
}

export function newResetToken(): { token: string; tokenHash: string } {
  // Synchronous wrapper kept for compatibility; prefer uniqueToken (async).
  const token = crypto.randomUUID().replace(/-/g, "");
  return { token, tokenHash: hashCode(token) };
}

export async function newUniqueResetToken(
  hashExists: (hash: string) => Promise<boolean>
): Promise<{ token: string; tokenHash: string }> {
  return uniqueToken(hashExists);
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const normalized = email.toLowerCase().trim();
  const link = `${appBaseUrl()}/reset-password?token=${token}`;
  const account = await prisma.user
    .findUnique({ where: { email: normalized }, select: { firstName: true } })
    .catch(() => null);
  const mail = passwordResetEmail({
    name: account?.firstName || undefined,
    link,
    ttlMin: 60,
  });
  await sendMail({ to: normalized, subject: mail.subject, text: mail.text, html: mail.html });
}
