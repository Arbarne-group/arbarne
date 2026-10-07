"use client";

import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

const TIERS = [
  {
    name: "First FFMI/24 Assessment",
    price: "FREE",
    tag: "Start here",
    desc: "Your first full assessment plus the Farm Transformation Report for free.",
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
    tag: "Reassess or report, per pillar",
    desc: "Reassess a pillar to update results, or generate its PDF report. KES 1,500 each.",
    features: [
      "Reassess skips the 90-day cooldown",
      "Or download the pillar PDF report",
      "Referral credit: KES 500 off per onboarded farmer",
    ],
    cta: "Choose a pillar",
    href: "/assessment",
    highlight: true,
  },
  {
    name: "Pillar Verification (FFV)",
    price: "KES 2,500",
    per: "per pillar",
    tag: "Prove your progress",
    desc: "Submit evidence per pillar and get it reviewed and verified.",
    features: [
      "Review by our team",
      "Verified / Needs Review outcomes",
      "Stronger profile for lenders",
    ],
    cta: "Verify a pillar",
    href: "/ffv",
    highlight: false,
  },
  {
    name: "90-Day FFMI/24 Reassessment",
    price: "Mandatory",
    tag: "Track your improvement",
    desc: "After 90 days working on priorities, reassess to measure progress for free.",
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
    tag: "Full yearly review",
    desc: "A full assessment plus year-on-year transformation tracking.",
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
              Referrals earn KES 500 off each
            </p>
            <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
              Each qualified referral is KES 500 credit — up to KES 1,000 off
              every pillar assessment or report.
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
          <Link href="/support?department=Pricing+%26+Payments" className="font-bold text-primary">
            Open a support ticket
          </Link>
          .
        </p>
      </div>
    </AppShell>
  );
}
