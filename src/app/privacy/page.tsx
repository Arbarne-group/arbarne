import Link from "next/link";

const SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: "1. Who we are",
    body: [
      "Future Farms (“we”, “us”, “our”) provides a digital farm maturity assessment, verification, learning and support platform for farmers, currently operating in Kenya. This policy explains what personal data we collect when you use the Future Farms application, why we collect it, and the choices you have.",
    ],
  },
  {
    title: "2. Data we collect",
    body: [
      "Account data: your name, email address and profile photo when you sign in with Google, or your name, email address and password (stored as a one-way hash, never in readable form) when you register with email and password.",
      "Farm profile and business data: the details you provide about yourself, your farm and your business: location, farm size, enterprises, production practices, labour, markets and goals.",
      "Assessment and verification data: your FFMI/24 questionnaire answers, scores, and the photos, scans or documents you upload as verification evidence.",
      "Support data: the contents of support tickets you open with us.",
      "Payment metadata: when you pay for a plan, our payment processors (Paystack, including M-Pesa mobile money) handle the transaction. We receive confirmation and receipts, we never see or store your card numbers, bank details or M-Pesa PIN.",
      "Technical data: sign-in session cookies strictly necessary to keep you logged in, plus basic operational logs (pages visited, error diagnostics) used to keep the service secure and reliable.",
    ],
  },
  {
    title: "3. Sign in with Google",
    body: [
      "When you choose “Sign in with Google”, Google shares your name, email address and profile photo with us under the openid, email and profile scopes. We use this only to create and identify your account and to pre-fill your profile name.",
      "We do not request access to your Gmail, Google Drive, contacts or any other Google services, and we do not use your Google data for advertising.",
    ],
  },
  {
    title: "4. How we use your data",
    body: [
      "To create and secure your account and keep you signed in; to compute your farm maturity scores, reports and verification status; to match you with learning materials, opportunities and services; to respond to support tickets; to send transactional emails (verification codes, password resets, ticket confirmations); and to operate, secure and improve the platform. We do not sell your personal data.",
    ],
  },
  {
    title: "5. Sharing and processors",
    body: [
      "We share data only as needed to run the service: secure cloud database hosting (Neon Postgres), application hosting, email delivery, payment processing (Paystack / M-Pesa providers) and, where you request it, verification reviewers and financing or market partners you explicitly engage with. We also disclose data where required by law. Anonymised, aggregated statistics (never identifying you or your farm) may be used for research and reporting.",
    ],
  },
  {
    title: "6. Retention and security",
    body: [
      "We keep your data while your account is active and for a reasonable period afterwards to meet legal and accounting obligations. You may ask us to delete your account and personal data at any time (see Contact below); anonymised analytics may be retained. We protect data with encrypted connections (HTTPS), hashed passwords, access-controlled infrastructure and regular backups, but no internet service is perfectly secure.",
    ],
  },
  {
    title: "7. Your rights",
    body: [
      "You may request a copy of your data, correction of inaccurate data, or deletion of your account and personal data, and you may withdraw consent for optional processing at any time. Contact us at support@futurefarms.africa and we will respond within 30 days. Where you signed in with Google, you can also review or revoke our access at any time from your Google Account security settings.",
    ],
  },
  {
    title: "8. Children",
    body: [
      "Future Farms is intended for adult farmers and agribusiness operators. We do not knowingly collect data from children under 18.",
    ],
  },
  {
    title: "9. Changes to this policy",
    body: [
      "If we change this policy materially, we will post the updated version here with a new effective date and, where appropriate, notify you by email before the changes take effect.",
    ],
  },
  {
    title: "10. Contact",
    body: [
      "Questions about privacy or this policy: support@futurefarms.africa. We aim to answer within 30 days.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <div className="max-w-[860px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Future Farms
        </Link>
        <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, #045D6114 0%, transparent 60%)" }}
          />
          <div className="relative p-6 md:p-8 flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #045D6125 0%, #045D6145 100%)" }}
            >
              <span className="material-symbols-outlined text-[30px] drop-shadow-sm" style={{ color: "#045D61" }}>
                privacy_tip
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Legal
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Privacy Policy</h1>
              <p className="text-sm text-on-surface-variant">
                Effective 1 October 2026. Short, plain-language notice of what we collect and why.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {SECTIONS.map((s) => (
            <section
              key={s.title}
              className="rounded-2xl border border-outline-variant/50 bg-surface shadow-level-1 p-5 md:p-6"
            >
              <h2 className="font-bold text-on-surface mb-2">{s.title}</h2>
              <div className="space-y-2">
                {s.body.map((p, i) => (
                  <p key={i} className="text-sm text-on-surface-variant leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="text-center text-sm text-on-surface-variant">
          Related:{" "}
          <Link href="/terms" className="font-bold text-primary">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}
