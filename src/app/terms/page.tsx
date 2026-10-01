import Link from "next/link";

const SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: "1. Agreement",
    body: [
      "These Terms of Service (“Terms”) govern your use of the Future Farms application (“the Service”), operated by Future Farms. By creating an account or using the Service, you agree to these Terms. If you do not agree, do not use the Service.",
    ],
  },
  {
    title: "2. Accounts and eligibility",
    body: [
      "You must be at least 18 years old. You may register with an email address and password or with Google sign-in. You are responsible for keeping your credentials confidential and for all activity under your account. One account per person; let us know promptly at support@futurefarms.africa if you suspect unauthorised access.",
    ],
  },
  {
    title: "3. Acceptable use",
    body: [
      "Use the Service only for lawful farming and agribusiness purposes. You must not: misrepresent your farm or upload false verification evidence; upload unlawful, infringing or harmful content; attempt to breach, scan or disrupt the Service; resell or scrape the Service; or use the Service to spam or harass others. We may suspend accounts that breach these rules.",
    ],
  },
  {
    title: "4. Assessments, verification and content",
    body: [
      "Assessment scores, maturity tiers and recommendations are guidance tools based on your answers — they are not professional agronomic, veterinary, financial or legal advice. Verification (“Verified” badges) reflects the evidence available at review time. Learning materials, reports and site content remain our intellectual property; we grant you a personal, non-transferable licence to use them for your own farming. By uploading evidence or messages, you grant us the licence needed to store, display and review that content to operate the Service.",
    ],
  },
  {
    title: "5. Plans, payments and refunds",
    body: [
      "Some features require a paid plan, processed securely by our payment providers (including M-Pesa mobile money). Prices are shown before you pay. Completed assessment unlocks are delivered immediately and are generally non-refundable once used; where the law in your country provides otherwise, statutory rights apply. Contact support@futurefarms.africa for billing issues.",
    ],
  },
  {
    title: "6. Availability and liability",
    body: [
      "We work to keep the Service available and accurate but do not guarantee uninterrupted, error-free operation; farming outcomes depend on many factors beyond our control. To the maximum extent permitted by law, we are not liable for indirect or consequential losses (including crop, income or opportunity losses). Our total liability for any claim is limited to the fees you paid us in the 12 months before the claim.",
    ],
  },
  {
    title: "7. Termination",
    body: [
      "You may stop using the Service and request account deletion at any time via support@futurefarms.africa. We may suspend or terminate accounts for breach of these Terms, fraud, or prolonged inactivity, with reasonable notice where practical.",
    ],
  },
  {
    title: "8. Governing law and changes",
    body: [
      "These Terms are governed by the laws of Kenya, and disputes will be handled in Kenyan courts (subject to mandatory consumer protections where you live). We may update these Terms; material changes take effect after notice by email or in-app message. Continued use after the effective date means you accept the updated Terms.",
    ],
  },
  {
    title: "9. Contact",
    body: [
      "Questions about these Terms: support@futurefarms.africa. See also our Privacy Policy for how we handle personal data.",
    ],
  },
];

export default function TermsPage() {
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
                description
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Legal
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Terms of Service</h1>
              <p className="text-sm text-on-surface-variant">
                Effective 1 October 2026. The rules for using Future Farms.
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
          <Link href="/privacy" className="font-bold text-primary">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
