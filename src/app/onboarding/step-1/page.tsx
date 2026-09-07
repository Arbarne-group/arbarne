"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

export default function FarmerProfilePage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [valueChain, setValueChain] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [businessHistory, setBusinessHistory] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [otherEducation, setOtherEducation] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    const email = getActiveUserEmail();

    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.farmerProfile) {
          const fp = data.user.farmerProfile;
          if (fp.jobTitle) setJobTitle(fp.jobTitle);
          if (fp.valueChain) setValueChain(fp.valueChain);
          if (fp.experienceYears) setExperienceYears(fp.experienceYears);
          if (fp.businessHistory) setBusinessHistory(fp.businessHistory);
          if (fp.educationLevel || fp.education) setEducationLevel(fp.educationLevel || fp.education);
          if (fp.otherEducation) setOtherEducation(fp.otherEducation);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (navigateNext = true) => {
    setSaving(true);
    setSaveFeedback(null);
    const email = getActiveUserEmail();
    try {
      const res = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 1,
          email,
          data: {
            jobTitle,
            valueChain,
            experienceYears,
            businessHistory,
            educationLevel,
            otherEducation,
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
        router.push("/onboarding/step-2");
      }
    } catch (e) {
      console.error(e);
      if (navigateNext) {
        router.push("/onboarding/step-2");
      }
    } finally {
      setSaving(false);
    }
  };

  const jobOptions = [
    { title: "Farm Owner", icon: "agriculture" },
    { title: "Farm Manager", icon: "manage_accounts" },
    { title: "Farm Consultant | Specialist", icon: "support_agent" },
    { title: "Farm Assistant", icon: "engineering" },
    { title: "Farm Supervisor", icon: "supervisor_account" },
  ];

  const experienceOptions = [
    "Less than 1 year",
    "1–3 years",
    "4–6 years",
    "7–10 years",
    "More than 10 years",
  ];

  const businessHistoryOptions = [
    "Yes, I currently run a business",
    "Yes, I have run a business before",
    "No, this is my first business venture",
  ];

  const educationOptions = [
    "No formal qualification",
    "Primary school",
    "Secondary school",
    "Vocational or trade certificate",
    "Undergraduate degree",
    "Postgraduate degree",
    "Other",
  ];

  const valueChainSuggestions = [
    "Horticulture & Specialty Vegetables",
    "Dairy Production",
    "Poultry & Eggs",
    "Cereals & Grains (Maize, Wheat, Rice)",
    "Coffee & Tea",
    "Livestock & Beef",
    "Aquaculture & Fish Farming",
    "Fruits & Tree Crops (Avocado, Macadamia)",
  ];

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto w-full pb-28">
        {/* Header Section */}
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
              Section 1 of 5
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Questions 1 – 5</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2 tracking-tight">
            Farmer Profile
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Tell us about the person building the future-ready farm.
          </p>
        </div>

        {/* Form Container */}
        <div className="space-y-8">
          {/* Question 1 */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <label className="block text-base font-semibold text-on-surface mb-1">
              1. What is your current job title or primary occupation?
            </label>
            <p className="text-xs text-on-surface-variant mb-5">
              Select the role that best defines your primary day-to-day engagement.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {jobOptions.map((opt) => {
                const isSelected = jobTitle === opt.title;
                return (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => setJobTitle(opt.title)}
                    className={`rounded-2xl border p-4 text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {opt.icon}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        {opt.title}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 2 */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <label
              className="block text-base font-semibold text-on-surface mb-1"
              htmlFor="value_chain"
            >
              2. Which agricultural value chain(s) are you involved in?
            </label>
            <p className="text-xs text-on-surface-variant mb-4">
              Enter your key crops, livestock, or value chains.
            </p>

            <input
              id="value_chain"
              type="text"
              placeholder="e.g., Horticulture & Vegetables, Dairy, Poultry, Cereals..."
              value={valueChain}
              onChange={(e) => setValueChain(e.target.value)}
              className="w-full rounded-xl border border-outline-variant px-5 py-3.5 text-sm md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/40 bg-surface transition-all mb-3"
            />

            {/* Quick Suggestions */}
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block mb-2">
                Quick Suggestions (click to append):
              </span>
              <div className="flex flex-wrap gap-2">
                {valueChainSuggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      if (!valueChain) {
                        setValueChain(sug);
                      } else if (!valueChain.includes(sug)) {
                        setValueChain(`${valueChain}, ${sug}`);
                      }
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg border border-outline-variant/70 bg-surface-container-low hover:bg-primary/10 hover:border-primary/50 text-on-surface transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question 3 */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <label className="block text-base font-semibold text-on-surface mb-1">
              3. How many years of professional or business experience do you have?
            </label>
            <p className="text-xs text-on-surface-variant mb-5">
              Include all relevant business, management, or farming background.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {experienceOptions.map((opt) => {
                const isSelected = experienceYears === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setExperienceYears(opt)}
                    className={`rounded-2xl border p-4 text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        isSelected ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {opt}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 4 */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <label className="block text-base font-semibold text-on-surface mb-1">
              4. Have you previously started, owned, or managed a business?
            </label>
            <p className="text-xs text-on-surface-variant mb-5">
              Helps us assess your entrepreneurial background and strategic needs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {businessHistoryOptions.map((opt) => {
                const isSelected = businessHistory === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBusinessHistory(opt)}
                    className={`rounded-2xl border p-4 text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        isSelected ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {opt}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 5 */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <label className="block text-base font-semibold text-on-surface mb-1">
              5. What is your highest level of education?
            </label>
            <p className="text-xs text-on-surface-variant mb-5">
              Select the option that best reflects your educational attainment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {educationOptions.map((opt) => {
                const isSelected = educationLevel === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setEducationLevel(opt)}
                    className={`rounded-2xl border p-4 text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        isSelected ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {opt}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {educationLevel === "Other" && (
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Please specify your educational background..."
                  value={otherEducation}
                  onChange={(e) => setOtherEducation(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-surface"
                />
              </div>
            )}
          </div>
        </div>

        {/* Floating Bottom Nav */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/onboarding"
            className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            &larr; Back to Overview
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
