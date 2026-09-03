"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function AspirationsPage() {
  const router = useRouter();
  const [twelveMonthSuccess, setTwelveMonthSuccess] = useState(
    "Achieve 30% yield increase and certify for regional export markets."
  );
  const [greatestImpactSupport, setGreatestImpactSupport] = useState(
    "Precision irrigation automation and cold storage financing."
  );
  const [marketInsight, setMarketInsight] = useState(
    "Contracted supermarket supply chains yield 40% higher margins than open brokers."
  );
  const [threeToFiveYearRole, setThreeToFiveYearRole] = useState(
    "Strategic planning, investor relations, and regional farm network expansion."
  );
  const [handoverResponsibilities, setHandoverResponsibilities] = useState<string[]>([
    "Daily Operations Management",
    "Staff Hiring & Management",
  ]);
  const [personallyApprovedDecisions, setPersonallyApprovedDecisions] = useState(
    "Capital expenditures over $5,000 and major customer contract agreements."
  );
  const [twentyFiveYearVision, setTwentyFiveYearVision] = useState(
    "Thriving, climate-resilient African farms powered by automated telemetry, solar cold-chains, and equitable farmer cooperatives."
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.aspiration) {
          const asp = data.user.aspiration;
          if (asp.twelveMonthSuccess) setTwelveMonthSuccess(asp.twelveMonthSuccess);
          if (asp.greatestImpactSupport) setGreatestImpactSupport(asp.greatestImpactSupport);
          if (asp.marketInsight) setMarketInsight(asp.marketInsight);
          if (asp.threeToFiveYearRole) setThreeToFiveYearRole(asp.threeToFiveYearRole);
          if (asp.handoverResponsibilities) {
            try {
              setHandoverResponsibilities(JSON.parse(asp.handoverResponsibilities));
            } catch (e) {}
          }
          if (asp.personallyApprovedDecisions)
            setPersonallyApprovedDecisions(asp.personallyApprovedDecisions);
          if (asp.twentyFiveYearVision) setTwentyFiveYearVision(asp.twentyFiveYearVision);
        }
      })
      .catch(console.error);
  }, []);

  const toggleHandover = (item: string) => {
    if (handoverResponsibilities.includes(item)) {
      setHandoverResponsibilities(handoverResponsibilities.filter((h) => h !== item));
    } else {
      setHandoverResponsibilities([...handoverResponsibilities, item]);
    }
  };

  const handleNext = async () => {
    setSaving(true);
    try {
      await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 5,
          email: "keziah@futurefarms.africa",
          data: {
            twelveMonthSuccess,
            greatestImpactSupport,
            marketInsight,
            threeToFiveYearRole,
            handoverResponsibilities,
            personallyApprovedDecisions,
            twentyFiveYearVision,
          },
        }),
      });
      router.push("/pricing");
    } catch (e) {
      console.error(e);
      router.push("/pricing");
    } finally {
      setSaving(false);
    }
  };

  const handoverOptions = [
    "Daily Operations Management",
    "Financial Planning & Budgeting",
    "Staff Hiring & Management",
    "Sales & Market Expansion",
  ];

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto w-full pb-28">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/onboarding/step-4"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Step 4
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2 tracking-tight">
            Your Future Farms Aspirations
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Tell us where you want your farm to go so we can construct your personalized roadmap.
          </p>
        </div>

        <form className="space-y-8">
          {/* Question 15 */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <label className="block text-base font-semibold text-on-surface mb-3 flex items-start gap-2.5">
              <span className="text-primary font-bold">Q15.</span>
              <span>What would success look like for your farm over the next 12 months?</span>
            </label>
            <textarea
              rows={3}
              value={twelveMonthSuccess}
              onChange={(e) => setTwelveMonthSuccess(e.target.value)}
              placeholder="Describe your definition of success for the upcoming year..."
              className="w-full rounded-2xl border border-outline-variant bg-surface p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Question 16 */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <label className="block text-base font-semibold text-on-surface mb-3 flex items-start gap-2.5">
              <span className="text-primary font-bold">Q16.</span>
              <span>What kind of support would have the greatest impact on your farm business right now?</span>
            </label>
            <textarea
              rows={3}
              value={greatestImpactSupport}
              onChange={(e) => setGreatestImpactSupport(e.target.value)}
              placeholder="Financial, technical, operational..."
              className="w-full rounded-2xl border border-outline-variant bg-surface p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Question 17 */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <label className="block text-base font-semibold text-on-surface mb-3 flex items-start gap-2.5">
              <span className="text-primary font-bold">Q17.</span>
              <span>What is one thing you understand about your market that others may not?</span>
            </label>
            <textarea
              rows={3}
              value={marketInsight}
              onChange={(e) => setMarketInsight(e.target.value)}
              placeholder="Share your unique insight..."
              className="w-full rounded-2xl border border-outline-variant bg-surface p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Question 18 */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <label className="block text-base font-semibold text-on-surface mb-3 flex items-start gap-2.5">
              <span className="text-primary font-bold">Q18.</span>
              <span>What role do you see yourself playing in the business in 3-5 years?</span>
            </label>
            <textarea
              rows={3}
              value={threeToFiveYearRole}
              onChange={(e) => setThreeToFiveYearRole(e.target.value)}
              placeholder="Strategic oversight, hands-on management, advisory..."
              className="w-full rounded-2xl border border-outline-variant bg-surface p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Question 19: Handover Responsibilities */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <label className="block text-base font-semibold text-on-surface mb-4 flex items-start gap-2.5">
              <span className="text-primary font-bold">Q19.</span>
              <span>Which responsibilities would you eventually like to hand over to a Farm Manager?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {handoverOptions.map((opt) => {
                const isChecked = handoverResponsibilities.includes(opt);
                return (
                  <label
                    key={opt}
                    onClick={() => toggleHandover(opt)}
                    className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-colors ${
                      isChecked
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 text-primary focus:ring-primary accent-primary rounded cursor-pointer"
                    />
                    <span className="ml-3.5 text-sm font-medium text-on-surface">
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Question 20 */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <label className="block text-base font-semibold text-on-surface mb-3 flex items-start gap-2.5">
              <span className="text-primary font-bold">Q20.</span>
              <span>What decisions will you always want to personally approve?</span>
            </label>
            <textarea
              rows={3}
              value={personallyApprovedDecisions}
              onChange={(e) => setPersonallyApprovedDecisions(e.target.value)}
              placeholder="Major investments, partnerships..."
              className="w-full rounded-2xl border border-outline-variant bg-surface p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Question 21: 25-Year Vision */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary" />
            <label className="block text-base font-semibold text-on-surface mb-2 flex items-start gap-2.5 ml-2">
              <span className="text-primary font-bold">Q21.</span>
              <span>What is your vision for African farms 25 years from now?</span>
            </label>
            <p className="text-xs text-on-surface-variant mb-4 ml-6">
              Think broadly about technology, sustainability, and global impact.
            </p>
            <textarea
              rows={4}
              value={twentyFiveYearVision}
              onChange={(e) => setTwentyFiveYearVision(e.target.value)}
              placeholder="Paint a picture of the future..."
              className="w-full rounded-2xl border border-outline-variant bg-surface p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none"
            />
          </div>
        </form>

        {/* Floating Bottom Nav */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/onboarding/step-4"
            className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            &larr; Back
          </Link>
          <div className="text-xs text-on-surface-variant font-medium">
            Step 5 of 5
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="px-8 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm btn-shadow hover-lift transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
          >
            <span>{saving ? "Saving..." : "Review Assessment Pricing"}</span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
