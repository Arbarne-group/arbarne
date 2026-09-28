/**
 * Premium branded email templates (Future Farms theme).
 * Table-based + inline styles for maximum mail-client compatibility.
 *
 * Palette: deep teal #045D61 (primary), agri green #009924 (secondary),
 * harvest gold #FFD700 (accent), paper #F7F9F5.
 */

import { appBaseUrl } from "./mailer";

const PRIMARY = "#045D61";
const SECONDARY = "#009924";
const GOLD = "#FFD700";
const PAPER = "#F7F9F5";
const INK = "#1a2b2c";
const MUTED = "#5f6f6b";

function logoUrl(): string {
  return `${appBaseUrl()}/logo.webp`;
}

function shell(opts: {
  preheader: string;
  heading: string;
  intro: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
  footnote?: string;
}): { html: string } {
  const ctaRow = opts.cta
    ? `<tr><td align="center" style="padding:8px 32px 24px 32px;">
         <a href="${opts.cta.href}"
            style="display:inline-block;background:${SECONDARY};color:#ffffff;
                   font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;
                   text-decoration:none;padding:13px 34px;border-radius:10px;">
           ${opts.cta.label}
         </a>
       </td></tr>`
    : "";
  const footnoteRow = opts.footnote
    ? `<tr><td style="padding:0 32px 8px 32px;font-family:Arial,Helvetica,sans-serif;
                       font-size:12px;color:${MUTED};line-height:1.6;">${opts.footnote}</td></tr>`
    : "";
  return {
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${PAPER};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;
                    border:1px solid #e3e8e4;">
        <tr><td align="center" style="background:${PRIMARY};padding:30px 24px 24px 24px;">
          <img src="${logoUrl()}" alt="Future Farms" width="170"
               style="display:block;border:0;max-width:170px;height:auto;" />
          <div style="height:4px;width:64px;background:${GOLD};border-radius:2px;margin:16px auto 0 auto;"></div>
        </td></tr>
        <tr><td style="padding:28px 32px 8px 32px;font-family:Arial,Helvetica,sans-serif;">
          <h1 style="margin:0 0 10px 0;font-size:22px;line-height:1.3;color:${INK};">${opts.heading}</h1>
          <p style="margin:0;font-size:14.5px;line-height:1.65;color:${MUTED};">${opts.intro}</p>
        </td></tr>
        <tr><td style="padding:12px 32px 8px 32px;font-family:Arial,Helvetica,sans-serif;
                       font-size:14.5px;line-height:1.65;color:${INK};">${opts.bodyHtml}</td></tr>
        ${ctaRow}
        ${footnoteRow}
        <tr><td style="padding:18px 32px 26px 32px;border-top:1px solid #edf0ed;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${MUTED};">
            Future Farms Initiative, cultivating the future of African agriculture.<br>
            <a href="${appBaseUrl()}" style="color:${SECONDARY};text-decoration:none;">futurefarms.africa</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
  };
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------------- Verification code (OTP) ---------------- */

export function verificationEmail(opts: {
  name?: string;
  code: string;
  ttlMin: number;
}): { subject: string; text: string; html: string } {
  const greet = opts.name ? `Hi ${esc(opts.name)},` : "Hi,";
  const { html } = shell({
    preheader: `Your Future Farms code is ${opts.code}`,
    heading: "Verify your email",
    intro: `${greet} use the code below to verify your email address and finish creating your account.`,
    bodyHtml: `<div style="text-align:center;padding:10px 0 16px 0;">
        <div style="display:inline-block;background:${PAPER};border:1px dashed ${SECONDARY};
                    border-radius:12px;padding:16px 34px;font-size:32px;font-weight:bold;
                    letter-spacing:10px;color:${PRIMARY};font-family:'Courier New',monospace;">
          ${esc(opts.code)}
        </div>
        <p style="font-size:13px;color:${MUTED};margin:14px 0 0 0;">
          Expires in ${opts.ttlMin} minutes. Never share this code with anyone.
        </p>
      </div>`,
    footnote: "If you did not request this code, you can safely ignore this email.",
  });
  return {
    subject: "Your Future Farms verification code",
    text: `${greet}\n\nYour verification code is: ${opts.code}\n\nIt expires in ${opts.ttlMin} minutes. If you did not request this, ignore this email.`,
    html,
  };
}

/* ---------------- Welcome (account created) ---------------- */

export function welcomeEmail(opts: {
  name?: string;
}): { subject: string; text: string; html: string } {
  const greet = opts.name ? `Hi ${esc(opts.name)},` : "Hi,";
  const { html } = shell({
    preheader: "Welcome to Future Farms — your account is ready",
    heading: "Welcome to Future Farms",
    intro: `${greet} your account has been created successfully. You can now assess your farm, track capabilities, and unlock tailored recommendations.`,
    bodyHtml: `<p style="margin:0;">Complete your farm profile, run the 8-pillar diagnostic, and follow your transformation roadmap, all from your dashboard.</p>`,
    cta: { label: "Open your dashboard", href: `${appBaseUrl()}/onboarding` },
  });
  return {
    subject: "Welcome to Future Farms",
    text: `${greet}\n\nYour account has been created successfully. Open your dashboard: ${appBaseUrl()}/onboarding`,
    html,
  };
}

/* ---------------- Password reset ---------------- */

export function passwordResetEmail(opts: {
  name?: string;
  link: string;
  ttlMin: number;
}): { subject: string; text: string; html: string } {
  const greet = opts.name ? `Hi ${esc(opts.name)},` : "Hi,";
  const { html } = shell({
    preheader: "Reset your Future Farms password",
    heading: "Reset your password",
    intro: `${greet} you asked to reset your password. Use the button below to choose a new one — it is single-use and expires soon.`,
    bodyHtml: `<p style="margin:0;">If you did not request this, ignore this email — your password stays unchanged.</p>`,
    cta: { label: "Set a new password", href: opts.link },
    footnote: `Button not working? Paste this URL into your browser:<br>
      <span style="font-size:12.5px;word-break:break-all;">${esc(opts.link)}</span><br>
      Link valid ${opts.ttlMin} minutes.`,
  });
  return {
    subject: "Reset your Future Farms password",
    text:
      `${greet}\n\nYou requested a password reset.\n\n` +
      `Set a new password here (valid ${opts.ttlMin} minutes):\n${opts.link}\n\n` +
      `If you did not request this, ignore this email.`,
    html,
  };
}

/* ---------------- Staff invite ---------------- */

export function inviteEmail(opts: {
  role: string;
  label?: string | null;
  link: string;
  ttlDays: number;
}): { subject: string; text: string; html: string } {
  const roleLine = opts.label ? `${esc(opts.role)} (${esc(opts.label)})` : esc(opts.role);
  const { html } = shell({
    preheader: `You are invited to Future Farms as ${opts.role}`,
    heading: "You're invited to Future Farms",
    intro: `You have been invited to join Future Farms as <strong>${roleLine}</strong>. Accept the invitation to create your account.`,
    bodyHtml: `<p style="margin:0;">The invitation link below can only be used once.</p>`,
    cta: { label: "Accept invitation", href: opts.link },
    footnote: `Valid ${opts.ttlDays} days. If you were not expecting this, ignore this email.`,
  });
  return {
    subject: `You are invited to Future Farms (${opts.role})`,
    text:
      `You have been invited to join Future Farms as ${opts.role}${opts.label ? ` (${opts.label})` : ""}.\n\n` +
      `Accept within ${opts.ttlDays} days:\n${opts.link}`,
    html,
  };
}
