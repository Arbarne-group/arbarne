"use client";

import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function PricingPage() {
  return (
    <AppShell>
      <div className="max-w-[1024px] mx-auto w-full p-4 md:p-10 space-y-8 flex-1">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-surface-variant pb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-on-background tracking-tight mb-2">
              Assessment Pricing
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg">
              Choose how you want to assess and grow your farm.
            </p>
          </div>
        </div>

        {/* Top Informative Banner */}
        <div className="bg-primary-container/10 border border-primary-container/20 rounded-2xl p-4 flex items-start gap-4 shadow-xs">
          <span
            className="material-symbols-outlined text-primary mt-0.5 shrink-0 fill"
          >
            info
          </span>
          <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
            Assess your farm across the Future Farms Framework (8 Pillars, 40 Capabilities) and get instant insights to improve, grow and thrive.
          </p>
        </div>

        {/* Pricing Options Column */}
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-on-surface">
              Choose Your Assessment Option
            </h2>
            <p className="text-xs md:text-sm text-on-surface-variant">
              Powered by Paystack recurring billing. Cancel or switch plans anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1024px] mx-auto items-stretch">
            {/* Card 1: 1 Pillar Assessment */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-level-1 border border-outline-variant flex flex-col h-full w-full transition-transform hover:-translate-y-1 hover-lift">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-container/10">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    article
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">
                    1 Pillar Assessment
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Assess any single pillar
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-3xl lg:text-4xl font-bold text-on-surface">KES 100</span>
                <span className="text-xs text-on-surface-variant ml-1.5 font-medium">
                  / month
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-bold mb-3 text-xs uppercase tracking-wider text-on-surface-variant">
                    Includes:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        <strong className="text-on-surface font-medium">
                          Pillars Covered:
                        </strong>{" "}
                        Any 1 pillar
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        <strong className="text-on-surface font-medium">
                          25 questions
                        </strong>{" "}
                        (from 200+ Yes/No Questions)
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Instant Recommendations (for &apos;No&apos; answers)
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Capability Status Feedback
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Pillar Scores
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-surface-variant">
                  <p className="text-xs text-on-surface-variant">
                    <span className="font-bold text-on-surface">Best For:</span>{" "}
                    Quick check of one pillar
                  </p>
                </div>
              </div>

              <Link
                href="/checkout?plan=1_PILLAR&amount=100"
                className="w-full mt-6 bg-surface-container-high hover:bg-surface-dim text-on-surface font-bold py-3 px-4 rounded-xl transition-all shadow-level-1 hover:shadow-md text-sm text-center block"
              >
                Assess 1 Pillar - KES 100
              </Link>
            </div>

            {/* Card 2: 4 Pillars Assessment */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-level-1 border border-outline-variant flex flex-col h-full w-full relative transition-transform hover:-translate-y-1 hover-lift">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    assignment
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">
                    4 Pillars Assessment
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Assess any 4 key pillars
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-3xl lg:text-4xl font-bold text-on-surface">KES 500</span>
                <span className="text-xs text-on-surface-variant ml-1.5 font-medium">
                  / month
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-bold mb-3 text-xs uppercase tracking-wider text-on-surface-variant">
                    Includes:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        <strong className="text-on-surface font-medium">
                          Pillars Covered:
                        </strong>{" "}
                        Any 4 pillars
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        <strong className="text-on-surface font-medium">
                          100 questions
                        </strong>{" "}
                        (from 200+ Yes/No Questions)
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Instant Recommendations (for &apos;No&apos; answers)
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Capability Status Feedback
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Pillar Scores
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        <strong className="text-on-surface">
                          Farm Transformation Plan (PDF):
                        </strong>{" "}
                        Summary Plan
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-surface-variant">
                  <p className="text-xs text-on-surface-variant">
                    <span className="font-bold text-on-surface">Best For:</span>{" "}
                    Focus on key areas &amp; improve performance
                  </p>
                </div>
              </div>

              <Link
                href="/checkout?plan=4_PILLARS&amount=500"
                className="w-full mt-6 bg-surface-container-high hover:bg-surface-dim text-on-surface font-bold py-3 px-4 rounded-xl transition-all shadow-level-1 hover:shadow-md text-sm text-center block"
              >
                Assess 4 Pillars - KES 500
              </Link>
            </div>

            {/* Card 3: Full Assessment (8 Pillars) */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-level-1 border-2 border-primary relative flex flex-col h-full w-full transition-transform hover:-translate-y-1 hover-lift">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                BEST VALUE
              </div>

              <div className="flex items-center gap-4 mb-4 mt-1">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl fill">
                    fact_check
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    Full Assessment
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    (8 Pillars Complete)
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-3xl lg:text-4xl font-bold text-primary">KES 1,000</span>
                <span className="text-xs text-on-surface-variant ml-1.5 font-medium">
                  / month
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-bold mb-3 text-xs uppercase tracking-wider text-primary">
                    Includes All 8 Pillars:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0 fill">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        <strong className="text-on-surface font-medium">
                          Pillars Covered:
                        </strong>{" "}
                        All 8 pillars
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0 fill">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        <strong className="text-on-surface font-medium">
                          200 questions
                        </strong>{" "}
                        (Complete Yes/No set)
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0 fill">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Instant Recommendations (for &apos;No&apos; answers)
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0 fill">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Capability Status Feedback
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0 fill">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Pillar Scores (all 8 pillars)
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0 fill">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        <strong className="text-on-surface">
                          Farm Transformation Plan (PDF):
                        </strong>{" "}
                        Full Plan
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0 fill">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Farm classification included
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-primary/20">
                  <p className="text-xs text-on-surface-variant">
                    <span className="font-bold text-on-surface">Best For:</span>{" "}
                    Complete picture of your farm&apos;s readiness
                  </p>
                </div>
              </div>

              <Link
                href="/checkout?plan=FULL_ASSESSMENT&amount=1000"
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-on-primary font-bold py-3 px-4 rounded-xl transition-all shadow-level-1 hover:shadow-md text-sm text-center block"
              >
                Unlock Full Assessment - KES 1,000
              </Link>
            </div>
          </div>

          {/* Secure Notice & Billing Portal link */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-variant text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">
                lock
              </span>
              <span>Encrypted checkout via Paystack. Card &amp; M-Pesa supported.</span>
            </div>
            <Link
              href="/billing"
              className="font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Already a subscriber? Access Billing Portal</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
