"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

interface OnboardingUser {
  name?: string;
  farmerProfile?: {
    jobTitle?: string;
  };
  businessExperience?: {
    commercialYears?: string;
    annualRevenueBracket?: string;
    recordKeepingMethod?: string;
    produceBuyers?: string;
  };
}

export default function BusinessExperiencePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<OnboardingUser | null>(null);

  // State
  const [commercialYears, setCommercialYears] = useState<string>("");
  const [annualRevenueBracket, setAnnualRevenueBracket] = useState<string>("");
  const [recordKeepingMethod, setRecordKeepingMethod] = useState<string>("");
  const [produceBuyers, setProduceBuyers] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const email = getActiveUserEmail();
    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
        if (data.user?.businessExperience) {
          const biz = data.user.businessExperience;
          if (biz.commercialYears) setCommercialYears(biz.commercialYears);
          if (biz.annualRevenueBracket) setAnnualRevenueBracket(biz.annualRevenueBracket);
          if (biz.recordKeepingMethod) setRecordKeepingMethod(biz.recordKeepingMethod);
          if (biz.produceBuyers) {
            try {
              setProduceBuyers(JSON.parse(biz.produceBuyers));
            } catch {
              // ignore
            }
          }
        }
      })
      .catch(console.error);
  }, []);

  const toggleBuyer = (id: string) => {
    setProduceBuyers((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length > 0) {
        setValidationErrors((v) => v.filter((k) => k !== "produceBuyers"));
      }
      return next;
    });
  };

  const handleSave = async (navigateNext: boolean = true) => {
    if (navigateNext) {
      const missing: string[] = [];
      if (!commercialYears || commercialYears.trim() === "") missing.push("commercialYears");
      if (!annualRevenueBracket || annualRevenueBracket.trim() === "") missing.push("annualRevenueBracket");
      if (!recordKeepingMethod || recordKeepingMethod.trim() === "") missing.push("recordKeepingMethod");
      if (!produceBuyers || produceBuyers.length === 0) missing.push("produceBuyers");

      if (missing.length > 0) {
        setValidationErrors(missing);
        const firstEl = document.getElementById(`q-${missing[0]}`);
        if (firstEl) {
          firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }

    setValidationErrors([]);
    setSaving(true);
    setSaveFeedback(null);
    try {
      const email = getActiveUserEmail();
      const res = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "business-experience",
          email,
          data: {
            commercialYears,
            annualRevenueBracket,
            recordKeepingMethod,
            produceBuyers,
          },
        }),
      });
      const resData = await res.json();
      if (resData.user) {
        localStorage.setItem("future_farms_user", JSON.stringify(resData.user));
      }
      setSaveFeedback("Business experience saved!");
      setTimeout(() => setSaveFeedback(null), 2500);

      if (navigateNext) {
        router.push("/onboarding/household-labour");
      }
    } catch (e) {
      console.error(e);
      if (navigateNext) {
        router.push("/onboarding/household-labour");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell userName={currentUser?.name || "Keziah Wanjiku"} userRole={currentUser?.farmerProfile?.jobTitle || "Farm Owner"}>
      <div className="w-full pt-4 pb-28 px-4 md:px-8 max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/onboarding/farming-system"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Farming System
          </Link>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            Stage 4 of 5: Commercial Profile
          </span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-2">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-1">
              Business Experience
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              Help us understand your commercial track record, market outlets, and bookkeeping to match you with appropriate financing and buyers.
            </p>
          </div>

          {/* Circular 4/5 stage badge */}
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
                  strokeDashoffset="25.1"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
              <span className="absolute text-xs font-bold text-primary">4/5</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Stage 4 of 5
              </span>
              <span className="text-xs font-bold text-on-surface">Commercial Profile</span>
              <span className="text-[11px] text-on-surface-variant">Next: Household &amp; Labour</span>
            </div>
          </div>
        </div>

        {/* Questionnaire Bento Card */}
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 shadow-sm p-6 md:p-8 space-y-8">
          {validationErrors.length > 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-900/60 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-300 text-sm animate-fadeIn shadow-xs">
              <span className="material-symbols-outlined text-red-500 text-xl shrink-0">error</span>
              <span className="font-semibold">
                Please complete all required questions on this page before continuing ({validationErrors.length} required field{validationErrors.length > 1 ? "s" : ""} remaining).
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-container-high/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">storefront</span>
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-on-surface tracking-tight leading-snug">
                  BUSINESS &amp; SALES EXPERIENCE
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Commercial farming background, market channels, and record keeping
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-low text-secondary text-xs font-semibold w-fit">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
              <span>Verified &amp; Confidential</span>
            </div>
          </div>

          {/* Question 1: Commercial Duration */}
          <div
            id="q-commercialYears"
            className={`space-y-3 p-4 rounded-2xl transition-all ${
              validationErrors.includes("commercialYears")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300 dark:bg-red-950/20"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center text-xs text-primary font-bold">
                  1
                </span>
                <span>How long have you been farming commercially?</span>
                {validationErrors.includes("commercialYears") && (
                  <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Required
                  </span>
                )}
              </label>
              <span className="text-xs text-on-surface-variant">Select one</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 bg-surface-container-low rounded-2xl">
              {[
                { id: "under_1", label: "< 1 Year (Just starting)" },
                { id: "1_3", label: "1 – 3 Years" },
                { id: "3_7", label: "3 – 7 Years" },
                { id: "over_7", label: "Over 7 Years" },
              ].map((opt) => {
                const isSelected = commercialYears === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setCommercialYears(opt.id);
                      setValidationErrors((prev) => prev.filter((k) => k !== "commercialYears"));
                    }}
                    className={`py-3 px-3 rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-surface-container-lowest text-primary shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 2: Revenue Bracket */}
          <div
            id="q-annualRevenueBracket"
            className={`space-y-3 pt-2 p-4 rounded-2xl transition-all ${
              validationErrors.includes("annualRevenueBracket")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300 dark:bg-red-950/20"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center text-xs text-primary font-bold">
                  2
                </span>
                <span>What is your estimated annual farm sales / revenue?</span>
                {validationErrors.includes("annualRevenueBracket") && (
                  <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Required
                  </span>
                )}
              </label>
              <span className="text-xs text-on-surface-variant">Select bracket</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "under_300k",
                  title: "Under KES 300,000",
                  sub: "Less than KES 25,000 / month",
                },
                {
                  id: "300k_1m",
                  title: "KES 300,000 – 1,000,000",
                  sub: "Approx. KES 25,000 – 83,000 / month",
                },
                {
                  id: "1m_3m",
                  title: "KES 1,000,000 – 3,000,000",
                  sub: "Approx. KES 83,000 – 250,000 / month",
                },
                {
                  id: "over_3m",
                  title: "Over KES 3,000,000",
                  sub: "More than KES 250,000 / month commercial scale",
                },
              ].map((bracket) => {
                const isSelected = annualRevenueBracket === bracket.id;
                return (
                  <div
                    key={bracket.id}
                    onClick={() => {
                      setAnnualRevenueBracket(bracket.id);
                      setValidationErrors((prev) => prev.filter((k) => k !== "annualRevenueBracket"));
                    }}
                    className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? "bg-primary/5 border-primary shadow-xs"
                        : "bg-surface-container-low border-transparent hover:bg-surface-container"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className={`text-sm font-bold block ${isSelected ? "text-primary" : "text-on-surface"}`}>
                        {bracket.title}
                      </span>
                      <p className="text-xs text-on-surface-variant">{bracket.sub}</p>
                    </div>
                    {isSelected ? (
                      <span className="material-symbols-outlined text-primary text-[22px] fill">check_circle</span>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-outline-variant" />
                    )}
                  </div>
                );
              })}
            </div>

            {annualRevenueBracket && (
              <div className="p-3.5 rounded-2xl bg-secondary-container/25 flex items-center gap-2.5 text-secondary border border-secondary-container animate-fadeIn">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="text-xs font-semibold">
                  Qualifies for cooperative and SME seasonal input financing &amp; asset leasing
                </span>
              </div>
            )}
          </div>

          {/* Question 3: Record Keeping */}
          <div
            id="q-recordKeepingMethod"
            className={`space-y-3 pt-2 p-4 rounded-2xl transition-all ${
              validationErrors.includes("recordKeepingMethod")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300 dark:bg-red-950/20"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center text-xs text-primary font-bold">
                  3
                </span>
                <span>How do you currently keep farm records?</span>
                {validationErrors.includes("recordKeepingMethod") && (
                  <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Required
                  </span>
                )}
              </label>
              <span className="text-xs text-on-surface-variant">Select primary method</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  id: "physical_book",
                  title: "Physical Record Book / Notebook",
                  desc: "Daily farm record book, harvest ledgers, and receipt stubs",
                  icon: "menu_book",
                },
                {
                  id: "mobile_excel",
                  title: "Mobile App or Excel Spreadsheets",
                  desc: "Excel, Google Sheets, WhatsApp notes, or agritech apps",
                  icon: "smartphone",
                },
                {
                  id: "bank_mpesa",
                  title: "Bank & M-Pesa Statements",
                  desc: "Till numbers, mobile money SMS confirmations, and bank statements",
                  icon: "receipt_long",
                },
                {
                  id: "mental",
                  title: "Informal / Mental Tracking",
                  desc: "Personal memory and informal daily estimates without paper trail",
                  icon: "psychology",
                },
              ].map((item) => {
                const isSelected = recordKeepingMethod === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setRecordKeepingMethod(item.id);
                      setValidationErrors((prev) => prev.filter((k) => k !== "recordKeepingMethod"));
                    }}
                    className={`p-4 rounded-2xl transition-all cursor-pointer flex items-start gap-3 border ${
                      isSelected
                        ? "bg-primary/5 border-primary shadow-xs"
                        : "bg-surface-container-low border-transparent hover:bg-surface-container"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 shrink-0 ${
                        isSelected ? "bg-primary text-white" : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${isSelected ? "text-primary" : "text-on-surface"}`}>
                          {item.title}
                        </span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-primary text-[18px] fill">check_circle</span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question 4: Primary Produce Buyers */}
          <div
            id="q-produceBuyers"
            className={`space-y-3 pt-2 p-4 rounded-2xl transition-all ${
              validationErrors.includes("produceBuyers")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300 dark:bg-red-950/20"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center text-xs text-primary font-bold">
                  4
                </span>
                <span>Primary Produce Buyers &amp; Sales Channels</span>
                {validationErrors.includes("produceBuyers") && (
                  <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Required
                  </span>
                )}
              </label>
              <span className="text-xs text-primary font-semibold">Select all that apply</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "contract_buyers",
                  title: "Contract Buyers / Off-takers",
                  tag: "Guaranteed",
                  desc: "Pre-agreed seasonal contracts with fixed supply rates and quality checks",
                },
                {
                  id: "wholesale_market",
                  title: "Local Open-Air Wholesale Market",
                  tag: "Spot cash",
                  desc: "Direct sales at open markets in regional towns (Wakulima, Naivasha, Karatina)",
                },
                {
                  id: "brokers_gate",
                  title: "Brokers / Aggregators at Farm Gate",
                  tag: "High volume",
                  desc: "Direct truck collection at the farm entrance during harvesting peak weeks",
                },
                {
                  id: "direct_retail",
                  title: "Direct to Consumers & Groceries",
                  tag: "Retail margin",
                  desc: "Weekly deliveries to local retail groceries, institutions, and neighbourhood clients",
                },
              ].map((channel) => {
                const isSelected = produceBuyers.includes(channel.id);
                return (
                  <div
                    key={channel.id}
                    onClick={() => toggleBuyer(channel.id)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-secondary-container/25 border-secondary shadow-xs"
                        : "bg-surface-container-low border-transparent hover:bg-surface-container"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                        isSelected ? "bg-secondary text-white" : "bg-surface-container-lowest border border-outline-variant"
                      }`}
                    >
                      {isSelected && <span className="material-symbols-outlined text-[15px]">check</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-bold ${isSelected ? "text-secondary" : "text-on-surface"}`}>
                          {channel.title}
                        </span>
                        <span className="text-[11px] font-semibold text-outline-variant bg-surface-container-lowest px-2 py-0.5 rounded">
                          {channel.tag}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1">{channel.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Bottom Navigation */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] pb-safe">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link
              href="/onboarding/farming-system"
              className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>&larr;</span>
              <span>Back to Farming System</span>
            </Link>

            {saveFeedback && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full inline-flex items-center gap-1 animate-fadeIn sm:hidden">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                {saveFeedback}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {saveFeedback && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full hidden sm:inline-flex items-center gap-1 animate-fadeIn">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                {saveFeedback}
              </span>
            )}
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-semibold text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70 bg-surface"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs md:text-sm btn-shadow hover-lift transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
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
