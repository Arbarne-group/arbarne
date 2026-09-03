"use client";

import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function PricingPage() {
  return (
    <AppShell>
      <div className="max-w-[1024px] mx-auto w-full px-4 md:px-10 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-surface-variant pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-on-background mb-2">
              Assessment Pricing
            </h1>
            <p className="text-on-surface-variant text-base">
              Choose how you want to assess and grow your farm.
            </p>
          </div>
        </div>

        {/* Top Informative Banner */}
        <div className="bg-primary-container/10 border border-primary-container/20 rounded-2xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary mt-0.5 fill">
            info
          </span>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Assess your farm across the Future Farms Framework (<strong>8 Pillars, 40 Capabilities</strong>) and get instant insights to improve, grow, and thrive.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="w-full space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-center text-on-surface">
            Choose Your Assessment Option
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[840px] mx-auto">
            {/* Card 1: Individual Pillar */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-outline-variant flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container/50 text-on-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">
                      article
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">
                      Individual Pillar Assessment
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Assess any single pillar
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-on-surface">$1</span>
                  <span className="text-xs text-on-surface-variant ml-2">Per Pillar</span>
                </div>

                <div>
                  <p className="font-bold text-xs uppercase tracking-wider text-on-surface mb-3">
                    Includes:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        check_circle
                      </span>
                      <span>Assessment of 1 selected Pillar</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        check_circle
                      </span>
                      <span>Instant recommendations for gaps</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        check_circle
                      </span>
                      <span>Capability status breakdown</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        check_circle
                      </span>
                      <span>Pillar score &amp; baseline metrics</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/checkout?plan=SINGLE_PILLAR&amount=1"
                className="w-full mt-8 bg-surface-container-high hover:bg-surface-dim text-on-surface font-semibold py-3.5 px-6 rounded-xl transition-all text-center block text-sm"
              >
                Assess One Pillar - $1
              </Link>
            </div>

            {/* Card 2: Full Assessment (BEST VALUE) */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_8px_24px_rgba(0,153,36,0.08)] border-2 border-primary relative flex flex-col justify-between hover-lift">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                BEST VALUE
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6 mt-1">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl fill">
                      fact_check
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary">
                      Full Future Farm Assessment
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Complete 8-Pillar transformation audit
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-primary">$10</span>
                  <span className="text-xs text-on-surface-variant ml-2">
                    One-time Payment
                  </span>
                </div>

                <div>
                  <p className="font-bold text-xs uppercase tracking-wider text-primary mb-3">
                    Includes Everything in Individual +
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[18px] fill">
                        check_circle
                      </span>
                      <span>All 8 Pillars Assessment (40 Capabilities)</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[18px] fill">
                        check_circle
                      </span>
                      <span>Interactive Farm Maturity Radar Chart</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[18px] fill">
                        check_circle
                      </span>
                      <span>Personalised operational recommendations</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[18px] fill">
                        check_circle
                      </span>
                      <span>Priority development areas (Top 3-5)</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface font-medium">
                      <span className="material-symbols-outlined text-primary text-[18px] fill">
                        check_circle
                      </span>
                      <span>Full downloadable Transformation Plan (PDF)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/checkout?plan=FULL_ASSESSMENT&amount=10"
                className="w-full mt-8 bg-primary hover:bg-primary/90 text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all shadow-md btn-shadow text-center block text-sm hover-lift"
              >
                Unlock Full Assessment - $10
              </Link>
            </div>
          </div>

          {/* Secure Notice */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[18px]">
              lock
            </span>
            <span>Payments are secure and encrypted. Upgrade anytime.</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
