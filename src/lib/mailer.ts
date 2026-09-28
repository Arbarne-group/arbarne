import * as nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST || "";
  const port = Number(process.env.SMTP_PORT || "587");
  const secure =
    (process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465;
  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    auth:
      process.env.SMTP_USER || process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
  return transporter;
}

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST);
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<void> {
  if (!isMailConfigured()) {
    // Dev fallback: never silently swallow — log so signup can be tested
    // without an SMTP server.
    console.warn(
      `[Mailer] SMTP_HOST not set — email to ${opts.to} not sent. Subject: ${opts.subject}\n${opts.text}`
    );
    return;
  }
  const from =
    process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@futurefarms.africa";
  await getTransporter().sendMail({ from, ...opts });
}

export function appBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}
