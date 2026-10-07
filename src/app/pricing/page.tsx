"use client";

import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

const TIERS = [
  {
    name: "First FFMI/24 Assessment",
    price: "FREE",
    tag: "Start your farm transformation journey",
    desc: "Complete your first FFMI/24 assessment for free and receive a free Farm Transformation Report showing your farm classification, capability strengths, development gaps and priority areas for improvement.",
    features: [
      "All 8 pillars, 200 questions",
      "Farm classification + maturity stage",
      "Free Farm Transformation Report",
    ],
    cta: "Start free assessment",
    href: "/assessment",
    highlight: false,
  },
  {
    name: "Individual Pillar Assessment & Report",
    price: "KES 1,500",
    per: "per pillar",
    tag: "Choose: reassess your pillar or generate your existing pillar report",
    desc: "During the valid assessment period, choose what you need: reassess the pillar if you have made progress and want to update your results, or get the pillar report as it currently stands. Either option costs KES 1,500 per pillar.",
    features: [
      "Reassess: bypasses the 90-day cooldown",
      "Or generate the referenced PDF report",
      "Referral credit: each onboarded farmer → KES 500 off",
    ],
    cta: "Choose a pillar",
    href: "/assessment",
    highlight: true,
  },
  {
    name: "Pillar Verification (FFV)",
    price: "KES 2,500",
    per: "per pillar",
    tag: "Verify your farm's capabilities when you are ready",
    desc: "Request Future Farm Verification (FFV) for any pillar at any time. Provide the required evidence and have your farm's capabilities reviewed and verified.",
    features: [
      "Evidence review by our team",
      "Verified / Needs Review outcomes",
      "Stronger profile for lenders & partners",
    ],
    cta: "Verify a pillar",
    href: "/ffv",
    highlight: false,
  },
  {
    name: "90-Day FFMI/24 Reassessment",
    price: "Mandatory",
    tag: "Measure the progress you have made",
    desc: "Your initial FFMI/24 establishes your farm's baseline. You then have 90 days to work on your identified development priorities. At the end of the 90-day period, you are required to reassess your farm so that Future Farms can measure your progress, identify remaining gaps and establish your next development priorities.",
    features: [
      "Required every 90 days",
      "Free of charge",
      "New baseline + next priorities",
    ],
    cta: "Check reassessment status",
    href: "/assessment",
    highlight: false,
  },
  {
    name: "Annual FFMI/24 Assessment",
    price: "KES 5,600",
    per: "per year",
    tag: "Complete your annual farm maturity review",
    desc: "Undertake a comprehensive annual FFMI/24 assessment to review your farm's capabilities, measure transformation over the year and establish your next stage of development.",
    features: [
      "All 8 pillars reassessable for a full year",
      "Year-on-year transformation tracking",
    ],
    cta: "Get annual access",
    href: "/checkout?product=ANNUAL_ASSESSMENT",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <AppShell>
      <div className="max-w-[1100px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
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
                payments
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Pricing
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
                Pay only for what moves your farm forward
              </h1>
              <p className="text-sm md:text-[15px] text-on-surface-variant leading-relaxed max-w-2xl">
                Your first full assessment is free. Afterwards, pay per pillar
                action and refer fellow farmers to earn assessment credit.
                Have a coupon? Apply it at checkout.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#009924]/30 bg-[#009924]/5 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #00992425 0%, #00992445 100%)" }}
          >
            <span className="material-symbols-outlined text-[22px]" style={{ color: "#009924" }}>
              group_add
            </span>
          </span>
          <div className="flex-1">
            <p className="font-bold text-on-surface text-sm md:text-base">
              Referral credit: every onboarded farmer earns you KES 500 off
            </p>
            <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
              Each referred farmer who completes an assessment earns you KES 500
              credit, up to KES 1,000 applies to every pillar assessment or
              report (never below KES 500 per pillar).
            </p>
          </div>
          <Link
            href="/referrals"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs md:text-sm font-bold"
          >
            My referrals
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TIERS.map((t) => (
            <article
              key={t.name}
              className={`rounded-3xl border bg-surface shadow-level-1 p-6 md:p-7 flex flex-col ${
                t.highlight ? "border-primary/40 ring-1 ring-primary/20" : "border-outline-variant/30"
              }`}
            >
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                {t.tag}
              </p>
              <h2 className="text-xl font-bold text-on-surface mt-1">{t.name}</h2>
              <p className="mt-2">
                <span className="text-3xl font-black text-on-surface">{t.price}</span>
                {t.per && (
                  <span className="text-sm text-on-surface-variant font-medium"> {t.per}</span>
                )}
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-3 flex-1">
                {t.desc}
              </p>
              <ul className="mt-4 space-y-1.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                      check_circle
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={t.href}
                className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                {t.cta}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </article>
          ))}
        </div>

        <p className="text-center text-xs text-on-surface-variant">
          Payments via M-Pesa and card through Paystack. Questions?{" "}
          <Link href="/support" className="font-bold text-primary">
            Open a support ticket
          </Link>
          .
        </p>
      </div>
    </AppShell>
  );
}
