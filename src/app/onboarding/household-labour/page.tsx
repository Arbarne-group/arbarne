"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default function HouseholdLabourPage() {
  const router = useRouter();

  // State
  const [permanentWorkers, setPermanentWorkers] = useState<number>(2);
  const [seasonalWorkers, setSeasonalWorkers] = useState<number>(14);
  const [managementStructure, setManagementStructure] = useState<string>("owner");
  const [fairEmploymentPractices, setFairEmploymentPractices] = useState<string[]>([
    "equal_pay_women",
    "ppe_clean_water",
    "youth_opportunities",
  ]);

  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.householdLabour) {
          const hl = data.user.householdLabour;
          if (hl.permanentWorkers !== null && hl.permanentWorkers !== undefined) {
            setPermanentWorkers(hl.permanentWorkers);
          }
          if (hl.seasonalWorkers !== null && hl.seasonalWorkers !== undefined) {
            setSeasonalWorkers(hl.seasonalWorkers);
          }
          if (hl.managementStructure) setManagementStructure(hl.managementStructure);
          if (hl.fairEmploymentPractices) {
            try {
              setFairEmploymentPractices(JSON.parse(hl.fairEmploymentPractices));
            } catch {
              // ignore
            }
          }
        }
      })
      .catch(console.error);
  }, []);

  const togglePractice = (id: string) => {
    setFairEmploymentPractices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async (navigateNext: boolean = true) => {
    setSaving(true);
    setSaveFeedback(null);
    try {
      const res = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "household-labour",
          email: "keziah@futurefarms.africa",
          data: {
            permanentWorkers,
            seasonalWorkers,
            managementStructure,
            fairEmploymentPractices,
          },
        }),
      });
      const resData = await res.json();
      if (resData.user) {
        localStorage.setItem("future_farms_user", JSON.stringify(resData.user));
      }
      setSaveFeedback("Workforce profile saved!");
      setTimeout(() => setSaveFeedback(null), 2500);

      if (navigateNext) {
        router.push("/onboarding/farm-profile");
      }
    } catch (e) {
      console.error(e);
      if (navigateNext) {
        router.push("/onboarding/farm-profile");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell userName="Keziah Wanjiku" userRole="Farm Owner">
      <div className="w-full pt-4 pb-28 px-4 md:px-8 max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/onboarding/business-experience"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Business Experience
          </Link>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            Stage 5 of 5: Human Capital Profile
          </span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-2">
          <div className="flex flex-col gap-1 max-w-2xl">
            <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-1">
              Household &amp; Labour
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              Detail your farm&apos;s workforce structure, seasonal labor reliance, and household management to assess human capital readiness and ethical workforce standards.
            </p>
          </div>

          {/* Circular 5/5 stage badge */}
          <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high/60 shrink-0 self-start md:self-auto">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                <circle
                  className="text-surface-container"
                  cx="24"
                  cy="24"
                  fill="transparent"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <circle
                  className="text-primary"
                  cx="24"
                  cy="24"
                  fill="transparent"
                  r="20"
                  stroke="currentColor"
                  strokeDasharray="125.6"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
              <span className="absolute text-xs font-bold text-primary">5/5</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Stage 5 of 5
              </span>
              <span className="text-xs font-bold text-on-surface">Human Capital</span>
              <span className="text-[11px] text-on-surface-variant">Next: Farm Profile</span>
            </div>
          </div>
        </div>

        {/* Main Questionnaire Card */}
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 shadow-sm p-6 md:p-8 flex flex-col gap-8">
          {/* Section 1: Workforce Size */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-on-surface">1. Farm Workforce &amp; Labour Size</h3>
              <p className="text-xs text-on-surface-variant">
                Detail full-time permanent personnel and seasonal hands hired during peak activities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Permanent Workers */}
              <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between space-y-4 border border-surface-container-high/40">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-on-surface">Permanent / Full-Time Workers</span>
                    <span className="px-2 py-0.5 rounded-lg bg-surface-container-high text-on-surface-variant text-[11px] font-semibold">
                      Full-time
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Permanent year-round team managing daily farm tasks, irrigation, and security.
                  </p>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between shadow-xs border border-surface-container-high/60">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-outline uppercase font-semibold">Staff Count</span>
                    <span className="text-xl md:text-2xl font-bold text-primary">
                      {permanentWorkers} active worker{permanentWorkers === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Decrease permanent workers"
                      onClick={() => setPermanentWorkers((prev) => Math.max(0, prev - 1))}
                      className="w-10 h-10 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">remove</span>
                    </button>
                    <button
                      type="button"
                      aria-label="Increase permanent workers"
                      onClick={() => setPermanentWorkers((prev) => prev + 1)}
                      className="w-10 h-10 rounded-xl bg-primary text-white hover:opacity-90 flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Seasonal Workers */}
              <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between space-y-4 border border-surface-container-high/40">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-on-surface">Seasonal / Casual Workers during harvest</span>
                    <span className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-primary/10 text-primary">
                      Peak Season
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Short-term hands recruited during harvesting, weeding, and packing periods.
                  </p>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between shadow-xs border border-surface-container-high/60">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-outline uppercase font-semibold">Seasonal Influx</span>
                    <span className="text-xl md:text-2xl font-bold text-primary">
                      {seasonalWorkers} peak harvest hand{seasonalWorkers === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Decrease seasonal workers"
                      onClick={() => setSeasonalWorkers((prev) => Math.max(0, prev - 1))}
                      className="w-10 h-10 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">remove</span>
                    </button>
                    <button
                      type="button"
                      aria-label="Increase seasonal workers"
                      onClick={() => setSeasonalWorkers((prev) => prev + 1)}
                      className="w-10 h-10 rounded-xl bg-primary text-white hover:opacity-90 flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Management Structure */}
          <div className="flex flex-col gap-4 pt-2 border-t border-surface-container-high/60">
            <div>
              <h3 className="text-base font-bold text-on-surface">2. Day-to-Day Farm Management</h3>
              <p className="text-xs text-on-surface-variant">
                Select the primary operational decision maker and leadership model on your farm.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "owner",
                  title: "Owner-Managed directly by me",
                  desc: "Direct hands-on daily supervision, budgeting, and routine operational decisions.",
                  icon: "person",
                },
                {
                  id: "manager",
                  title: "Employed Farm Manager",
                  desc: "A salaried professional supervisor oversees farm activities and laborers.",
                  icon: "engineering",
                },
                {
                  id: "family",
                  title: "Family Members / Relatives",
                  desc: "Household family members collaboratively manage farm routines and tasks.",
                  icon: "family_restroom",
                },
              ].map((item) => {
                const isSelected = managementStructure === item.id;
                return (
                  <label
                    key={item.id}
                    onClick={() => setManagementStructure(item.id)}
                    className={`relative flex flex-col p-5 rounded-2xl cursor-pointer shadow-xs transition-all border ${
                      isSelected
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-surface-container-low border-transparent hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? "bg-primary text-white" : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected ? "bg-primary text-white shadow-xs" : "bg-surface-variant text-transparent"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-on-surface mb-1">{item.title}</span>
                    <span className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 3: Fair Employment & Inclusion */}
          <div className="flex flex-col gap-4 pt-2 border-t border-surface-container-high/60">
            <div>
              <h3 className="text-base font-bold text-on-surface">3. Fair Employment &amp; Inclusion Practices</h3>
              <p className="text-xs text-on-surface-variant">
                Ethical workforce standards, worker well-being, and social sustainability measures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "equal_pay_women",
                  title: "Equal pay and opportunities for women workers",
                  desc: "Fair wages and leadership roles in harvest and operations.",
                },
                {
                  id: "ppe_clean_water",
                  title: "Protective gear (PPE) and clean drinking water provided",
                  desc: "Safe conditions and standard protective equipment for all hands.",
                },
                {
                  id: "youth_opportunities",
                  title: "Opportunities for youth workers",
                  desc: "Involvement in modern agritech tools, telemetry, and training.",
                },
              ].map((practice) => {
                const isSelected = fairEmploymentPractices.includes(practice.id);
                return (
                  <label
                    key={practice.id}
                    onClick={() => togglePractice(practice.id)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-surface-container-lowest border-primary shadow-xs"
                        : "bg-surface-container-low border-transparent hover:bg-surface-container"
                    }`}
                  >
                    <div className="pt-0.5">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all shadow-xs ${
                          isSelected ? "bg-primary text-white" : "bg-surface-variant text-transparent"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-on-surface leading-snug">{practice.title}</span>
                      <span className="text-xs text-on-surface-variant mt-1">{practice.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Bottom Navigation */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/onboarding/business-experience"
            className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Business Experience</span>
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
              <span>{saving ? "Saving..." : "Proceed to Farm Profile"}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
