"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function AspirationsPage() {
  const router = useRouter();
  const [twelveMonthSuccess, setTwelveMonthSuccess] = useState("");
  const [greatestImpactSupport, setGreatestImpactSupport] = useState("");
  const [marketInsight, setMarketInsight] = useState("");
  const [threeToFiveYearRole, setThreeToFiveYearRole] = useState("");
  const [fmResponsibility, setFmResponsibility] = useState("All of the above");
  const [personallyApprovedDecisions, setPersonallyApprovedDecisions] = useState("");
  const [twentyFiveYearVision, setTwentyFiveYearVision] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let email = "keziah@futurefarms.africa";
    const cached = localStorage.getItem("future_farms_user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        if (u.email) email = u.email;
      } catch (e) {}
    }

    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.aspiration) {
          const asp = data.user.aspiration;
          if (asp.twelveMonthSuccess) setTwelveMonthSuccess(asp.twelveMonthSuccess);
          if (asp.greatestImpactSupport) setGreatestImpactSupport(asp.greatestImpactSupport);
          if (asp.marketInsight) setMarketInsight(asp.marketInsight);
          if (asp.threeToFiveYearRole) setThreeToFiveYearRole(asp.threeToFiveYearRole);
          if (asp.fmResponsibility) {
            setFmResponsibility(asp.fmResponsibility);
          } else if (asp.handoverResponsibilities) {
            try {
              const parsed = JSON.parse(asp.handoverResponsibilities);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setFmResponsibility(parsed[0]);
              }
            } catch (e) {}
          }
          if (asp.personallyApprovedDecisions)
            setPersonallyApprovedDecisions(asp.personallyApprovedDecisions);
          if (asp.twentyFiveYearVision) setTwentyFiveYearVision(asp.twentyFiveYearVision);
        }
      })
      .catch(console.error);
  }, []);

  const handleNext = async () => {
    setSaving(true);
    try {
      await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 4,
          email: "keziah@futurefarms.africa",
          data: {
            twelveMonthSuccess,
            greatestImpactSupport,
            marketInsight,
            threeToFiveYearRole,
            fmResponsibility,
            personallyApprovedDecisions,
            twentyFiveYearVision,
          },
        }),
      });
      router.push("/onboarding/step-5");
    } catch (e) {
      console.error(e);
      router.push("/onboarding/step-5");
    } finally {
      setSaving(false);
    }
  };

  const responsibilityOptions = [
    "Production planning",
    "Day-to-day operations",
    "Worker supervision",
    "Input management",
    "Cost control",
    "Farm records",
    "Production monitoring",
    "Risk management",
    "Reporting",
    "Market preparation",
    "All of the above",
  ];

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Overview
          </Link>
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-primary uppercase tracking-wider">
            <span>Section 4 of 5</span>
            <span>•</span>
            <span>Questions 15–21</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
            Your Future Farms Aspirations
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Tell us where you want your farm to go.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 md:p-10 border border-surface-variant/40">
          <form className="space-y-10">
            {/* Question 15 */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-on-surface">
                15. What would success look like for your farm over the next 12 months?
              </label>
              <p className="text-xs text-on-surface-variant font-medium">
                Consider areas such as production, profitability, markets, systems, workforce, technology, or expansion.
              </p>
              <textarea
                rows={3}
                value={twelveMonthSuccess}
                onChange={(e) => setTwelveMonthSuccess(e.target.value)}
                placeholder="Describe your 12-month vision in detail..."
                className="w-full rounded-xl border border-outline-variant p-4 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/40 bg-surface-bright transition-all"
              />
            </div>

            {/* Question 16 */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-on-surface">
                16. What kind of support would have the greatest impact on your farm business right now?
              </label>
              <textarea
                rows={2}
                value={greatestImpactSupport}
                onChange={(e) => setGreatestImpactSupport(e.target.value)}
                placeholder="The support that would help most right now..."
                className="w-full rounded-xl border border-outline-variant p-4 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/40 bg-surface-bright transition-all"
              />
            </div>

            {/* Question 17 */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-on-surface">
                17. What is one thing you understand about your market or customers that you believe many other farmers may not yet have recognized?
              </label>
              <textarea
                rows={2}
                value={marketInsight}
                onChange={(e) => setMarketInsight(e.target.value)}
                placeholder="Share your unique market insight..."
                className="w-full rounded-xl border border-outline-variant p-4 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/40 bg-surface-bright transition-all"
              />
            </div>

            {/* Question 18 */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-on-surface">
                18. What do you want your role in the farm business to look like over the next three to five years?
              </label>
              <textarea
                rows={2}
                value={threeToFiveYearRole}
                onChange={(e) => setThreeToFiveYearRole(e.target.value)}
                placeholder="Your future role and strategic focus..."
                className="w-full rounded-xl border border-outline-variant p-4 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/40 bg-surface-bright transition-all"
              />
            </div>

            {/* Question 19 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                19. What would you like a professional Farm Manager to take responsibility for on your behalf?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {responsibilityOptions.map((opt) => {
                  const isSelected = fmResponsibility === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setFmResponsibility(opt)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary-container/10 ring-1 ring-primary text-primary font-semibold"
                          : "border-outline-variant hover:bg-surface-container-low text-on-surface"
                      }`}
                    >
                      <span className="text-sm">{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Question 20 */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-on-surface">
                20. What decisions would you always want to personally approve before they are made?
              </label>
              <textarea
                rows={2}
                value={personallyApprovedDecisions}
                onChange={(e) => setPersonallyApprovedDecisions(e.target.value)}
                placeholder="e.g., Capital expenditures above $5,000, new enterprise partnerships, major hiring..."
                className="w-full rounded-xl border border-outline-variant p-4 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/40 bg-surface-bright transition-all"
              />
            </div>

            {/* Question 21 */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-on-surface">
                21. Describe your vision for African farms 25 years from now. How do you want your farm or agricultural business to contribute to that future?
              </label>
              <textarea
                rows={3}
                value={twentyFiveYearVision}
                onChange={(e) => setTwentyFiveYearVision(e.target.value)}
                placeholder="Describe your long-term 25-year vision for African agriculture..."
                className="w-full rounded-xl border border-outline-variant p-4 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/40 bg-surface-bright transition-all"
              />
            </div>

            {/* Footer Navigation */}
            <div className="pt-8 border-t border-surface-variant/50 flex items-center justify-between">
              <Link
                href="/onboarding/step-3"
                className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Previous Section
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-xs text-on-surface-variant font-medium">
                  Section 4 of 5
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-on-primary text-sm font-semibold px-8 py-3.5 rounded-xl shadow-md btn-shadow hover-lift transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  <span>{saving ? "Saving..." : "Save & Continue"}</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
