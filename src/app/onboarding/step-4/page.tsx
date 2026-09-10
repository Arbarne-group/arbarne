"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

export default function AspirationsPage() {
  const router = useRouter();
  const [twelveMonthSuccess, setTwelveMonthSuccess] = useState("");
  const [greatestImpactSupport, setGreatestImpactSupport] = useState("");
  const [marketInsight, setMarketInsight] = useState("");
  const [threeToFiveYearRole, setThreeToFiveYearRole] = useState("");
  const [managerResponsibilities, setManagerResponsibilities] = useState<string[]>([]);
  const [personallyApprovedDecisions, setPersonallyApprovedDecisions] = useState("");
  const [twentyFiveYearVision, setTwentyFiveYearVision] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const email = getActiveUserEmail();

    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.aspiration) {
          const asp = data.user.aspiration;
          if (asp.twelveMonthSuccess) setTwelveMonthSuccess(asp.twelveMonthSuccess);
          if (asp.greatestImpactSupport) setGreatestImpactSupport(asp.greatestImpactSupport);
          if (asp.marketInsight) setMarketInsight(asp.marketInsight);
          if (asp.threeToFiveYearRole) setThreeToFiveYearRole(asp.threeToFiveYearRole);
          if (asp.managerResponsibilities) {
            try {
              const parsed = JSON.parse(asp.managerResponsibilities);
              if (Array.isArray(parsed)) setManagerResponsibilities(parsed);
            } catch {
              if (typeof asp.managerResponsibilities === "string") {
                setManagerResponsibilities([asp.managerResponsibilities]);
              }
            }
          } else if (asp.handoverResponsibilities) {
            try {
              const parsed = JSON.parse(asp.handoverResponsibilities);
              if (Array.isArray(parsed)) setManagerResponsibilities(parsed);
            } catch {}
          } else if (asp.fmResponsibility) {
            setManagerResponsibilities([asp.fmResponsibility]);
          }
          if (asp.personallyApprovedDecisions)
            setPersonallyApprovedDecisions(asp.personallyApprovedDecisions);
          if (asp.twentyFiveYearVision) setTwentyFiveYearVision(asp.twentyFiveYearVision);
        }
      })
      .catch(console.error);
  }, []);

  const managerResponsibilityItems = [
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
  ];

  const isAllSelected =
    managerResponsibilityItems.every((item) => managerResponsibilities.includes(item));

  const toggleResponsibility = (item: string) => {
    let next: string[];
    if (managerResponsibilities.includes(item)) {
      next = managerResponsibilities.filter((r) => r !== item);
    } else {
      next = [...managerResponsibilities, item];
    }
    setManagerResponsibilities(next);
    if (next.length > 0) {
      setValidationErrors((prev) => prev.filter((f) => f !== "managerResponsibilities"));
    }
  };

  const toggleAll = () => {
    if (isAllSelected) {
      setManagerResponsibilities([]);
    } else {
      setManagerResponsibilities([...managerResponsibilityItems]);
      setValidationErrors((prev) => prev.filter((f) => f !== "managerResponsibilities"));
    }
  };

  const handleSave = async (navigateNext = true) => {
    if (navigateNext) {
      const missing: string[] = [];
      if (!twelveMonthSuccess.trim()) missing.push("twelveMonthSuccess");
      if (!greatestImpactSupport.trim()) missing.push("greatestImpactSupport");
      if (!marketInsight.trim()) missing.push("marketInsight");
      if (!threeToFiveYearRole.trim()) missing.push("threeToFiveYearRole");
      if (managerResponsibilities.length === 0) missing.push("managerResponsibilities");
      if (!personallyApprovedDecisions.trim()) missing.push("personallyApprovedDecisions");
      if (!twentyFiveYearVision.trim()) missing.push("twentyFiveYearVision");

      if (missing.length > 0) {
        setValidationErrors(missing);
        const firstMissing = missing[0];
        const el = document.getElementById(`q-${firstMissing}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }

    setSaving(true);
    setSaveFeedback(null);
    const email = getActiveUserEmail();
    try {
      const res = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 4,
          email,
          data: {
            twelveMonthSuccess,
            greatestImpactSupport,
            marketInsight,
            threeToFiveYearRole,
            managerResponsibilities,
            fmResponsibility: managerResponsibilities[0] || "",
            handoverResponsibilities: managerResponsibilities,
            personallyApprovedDecisions,
            twentyFiveYearVision,
          },
        }),
      });
      const data = await res.json();
      if (data.user) {
        localStorage.setItem("future_farms_user", JSON.stringify(data.user));
      }
      setSaveFeedback("Progress saved successfully!");
      setTimeout(() => setSaveFeedback(null), 3000);

      if (navigateNext) {
        router.push("/onboarding/step-5");
      }
    } catch (e) {
      console.error(e);
      if (navigateNext) {
        router.push("/onboarding/step-5");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto w-full pb-28">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Overview
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wide uppercase">
              Section 4 of 5
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Questions 15 – 21</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2 tracking-tight">
            Your Future Farms Aspirations
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Tell us where you want your farm to go over the next 1 to 25 years.
          </p>
        </div>

        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-900/60 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-300 text-sm animate-fadeIn shadow-xs">
            <span className="material-symbols-outlined text-red-500 text-xl shrink-0">error</span>
            <span className="font-semibold">
              Please complete all questions on this page before continuing ({validationErrors.length} required question{validationErrors.length > 1 ? "s" : ""} remaining).
            </span>
          </div>
        )}

        <form className="space-y-8">
          {/* Question 15 */}
          <div
            id="q-twelveMonthSuccess"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 border shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all ${
              validationErrors.includes("twelveMonthSuccess")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="block text-base font-semibold text-on-surface">
                15. What would success look like for your farm over the next 12 months?
              </label>
              {validationErrors.includes("twelveMonthSuccess") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Consider areas such as production, profitability, markets, systems, workforce, technology, or expansion.
            </p>
            <textarea
              rows={3}
              value={twelveMonthSuccess}
              onChange={(e) => {
                setTwelveMonthSuccess(e.target.value);
                if (e.target.value.trim()) {
                  setValidationErrors((prev) => prev.filter((f) => f !== "twelveMonthSuccess"));
                }
              }}
              placeholder="Describe your 12-month goals and operational milestones..."
              className={`w-full rounded-2xl border bg-surface p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none ${
                validationErrors.includes("twelveMonthSuccess") ? "border-red-400 ring-1 ring-red-300" : "border-outline-variant"
              }`}
            />
          </div>

          {/* Question 16 */}
          <div
            id="q-greatestImpactSupport"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 border shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all ${
              validationErrors.includes("greatestImpactSupport")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="block text-base font-semibold text-on-surface">
                16. What kind of support would have the greatest impact on your farm business right now?
              </label>
              {validationErrors.includes("greatestImpactSupport") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Pinpoint the single most valuable technical, managerial, or financial resource needed.
            </p>
            <textarea
              rows={3}
              value={greatestImpactSupport}
              onChange={(e) => {
                setGreatestImpactSupport(e.target.value);
                if (e.target.value.trim()) {
                  setValidationErrors((prev) => prev.filter((f) => f !== "greatestImpactSupport"));
                }
              }}
              placeholder="E.g., Automated irrigation scheduling, expert agronomist advisory, working capital financing..."
              className={`w-full rounded-2xl border bg-surface p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none ${
                validationErrors.includes("greatestImpactSupport") ? "border-red-400 ring-1 ring-red-300" : "border-outline-variant"
              }`}
            />
          </div>

          {/* Question 17 */}
          <div
            id="q-marketInsight"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 border shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all ${
              validationErrors.includes("marketInsight")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="block text-base font-semibold text-on-surface">
                17. What is one thing you understand about your market or customers that you believe many other farmers may not yet have recognized?
              </label>
              {validationErrors.includes("marketInsight") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Share your distinctive market edge or consumer demand insight.
            </p>
            <textarea
              rows={3}
              value={marketInsight}
              onChange={(e) => {
                setMarketInsight(e.target.value);
                if (e.target.value.trim()) {
                  setValidationErrors((prev) => prev.filter((f) => f !== "marketInsight"));
                }
              }}
              placeholder="Share your unique market understanding or customer preference observation..."
              className={`w-full rounded-2xl border bg-surface p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none ${
                validationErrors.includes("marketInsight") ? "border-red-400 ring-1 ring-red-300" : "border-outline-variant"
              }`}
            />
          </div>

          {/* Question 18 */}
          <div
            id="q-threeToFiveYearRole"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 border shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all ${
              validationErrors.includes("threeToFiveYearRole")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="block text-base font-semibold text-on-surface">
                18. What do you want your role in the farm business to look like over the next three to five years?
              </label>
              {validationErrors.includes("threeToFiveYearRole") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Envision your executive, strategic, or hands-on involvement as the farm scales.
            </p>
            <textarea
              rows={3}
              value={threeToFiveYearRole}
              onChange={(e) => {
                setThreeToFiveYearRole(e.target.value);
                if (e.target.value.trim()) {
                  setValidationErrors((prev) => prev.filter((f) => f !== "threeToFiveYearRole"));
                }
              }}
              placeholder="E.g., Strategic oversight, investor relations, multi-site expansion..."
              className={`w-full rounded-2xl border bg-surface p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none ${
                validationErrors.includes("threeToFiveYearRole") ? "border-red-400 ring-1 ring-red-300" : "border-outline-variant"
              }`}
            />
          </div>

          {/* Question 19: Manager Responsibilities */}
          <div
            id="q-managerResponsibilities"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 border shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all ${
              validationErrors.includes("managerResponsibilities")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <label className="block text-base font-semibold text-on-surface">
                  19. What would you like a professional Farm Manager to take responsibility for on your behalf?
                </label>
                {validationErrors.includes("managerResponsibilities") && (
                  <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Required
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-bold px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                {isAllSelected ? "Deselect All" : "All of the above"}
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mb-5">
              Select all functional domains you want delegated to professional management.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {managerResponsibilityItems.map((item) => {
                const isChecked = managerResponsibilities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleResponsibility(item)}
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer text-left transition-all ${
                      isChecked
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        isChecked ? "text-primary font-semibold" : "text-on-surface"
                      }`}
                    >
                      {item}
                    </span>
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                        isChecked
                          ? "bg-primary border-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isChecked && (
                        <span className="material-symbols-outlined text-[15px]">check</span>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* All of the above button card */}
              <button
                type="button"
                onClick={toggleAll}
                className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer text-left transition-all ${
                  isAllSelected
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-dashed border-primary/60 bg-primary/5 hover:bg-primary/10 text-primary"
                }`}
              >
                <span className="text-xs sm:text-sm font-bold">
                  All of the above
                </span>
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ml-2 ${
                    isAllSelected ? "bg-white text-primary border-white" : "border-primary"
                  }`}
                >
                  {isAllSelected && (
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Question 20 */}
          <div
            id="q-personallyApprovedDecisions"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 border shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all ${
              validationErrors.includes("personallyApprovedDecisions")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="block text-base font-semibold text-on-surface">
                20. What decisions would you always want to personally approve before they are made?
              </label>
              {validationErrors.includes("personallyApprovedDecisions") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Define your non-negotiable approval thresholds (e.g. capital purchases, vendor contracts, hiring).
            </p>
            <textarea
              rows={3}
              value={personallyApprovedDecisions}
              onChange={(e) => {
                setPersonallyApprovedDecisions(e.target.value);
                if (e.target.value.trim()) {
                  setValidationErrors((prev) => prev.filter((f) => f !== "personallyApprovedDecisions"));
                }
              }}
              placeholder="E.g., Equipment purchases exceeding $2,000, land leasing, annual budget sign-off..."
              className={`w-full rounded-2xl border bg-surface p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none ${
                validationErrors.includes("personallyApprovedDecisions") ? "border-red-400 ring-1 ring-red-300" : "border-outline-variant"
              }`}
            />
          </div>

          {/* Question 21: 25-Year Vision */}
          <div
            id="q-twentyFiveYearVision"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 border shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all ${
              validationErrors.includes("twentyFiveYearVision")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="block text-base font-semibold text-on-surface">
                21. Describe your vision for African farms 25 years from now. How do you want your farm or agricultural business to contribute to that future?
              </label>
              {validationErrors.includes("twentyFiveYearVision") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Share your transformative perspective on continental food security, sustainability, and technological leapfrogging.
            </p>
            <textarea
              rows={4}
              value={twentyFiveYearVision}
              onChange={(e) => {
                setTwentyFiveYearVision(e.target.value);
                if (e.target.value.trim()) {
                  setValidationErrors((prev) => prev.filter((f) => f !== "twentyFiveYearVision"));
                }
              }}
              placeholder="Paint a vivid picture of the long-term future and your farm's lasting legacy..."
              className={`w-full rounded-2xl border bg-surface p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none ${
                validationErrors.includes("twentyFiveYearVision") ? "border-red-400 ring-1 ring-red-300" : "border-outline-variant"
              }`}
            />
          </div>
        </form>

        {/* Floating Bottom Nav */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/onboarding/step-3"
            className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            &larr; Back to Step 3
          </Link>

          <div className="flex items-center gap-3">
            {saveFeedback && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1 animate-fadeIn">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                {saveFeedback}
              </span>
            )}
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-semibold text-xs md:text-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-70 bg-surface"
            >
              <span className="material-symbols-outlined text-[17px]">save</span>
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs md:text-sm btn-shadow hover-lift transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
            >
              <span>{saving ? "Saving..." : "Save & Continue"}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
