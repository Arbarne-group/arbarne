"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function FarmerProfilePage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("Farm Owner");
  const [valueChain, setValueChain] = useState("");
  const [experienceYears, setExperienceYears] = useState("4–6 years");
  const [businessHistory, setBusinessHistory] = useState("Yes, I currently run a business");
  const [education, setEducation] = useState("Undergraduate degree");
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
        if (data.user?.farmerProfile) {
          const fp = data.user.farmerProfile;
          if (fp.jobTitle) {
            if (fp.jobTitle === "owner") setJobTitle("Farm Owner");
            else if (fp.jobTitle === "manager") setJobTitle("Farm Manager");
            else if (fp.jobTitle === "consultant") setJobTitle("Farm Consultant | Specialist");
            else setJobTitle(fp.jobTitle);
          }
          if (fp.valueChain) setValueChain(fp.valueChain);
          if (fp.experienceYears) setExperienceYears(fp.experienceYears);
          if (fp.businessHistory) setBusinessHistory(fp.businessHistory);
          if (fp.education) setEducation(fp.education);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 1,
          email: "keziah@futurefarms.africa",
          data: {
            jobTitle,
            valueChain,
            experienceYears,
            businessHistory,
            education,
          },
        }),
      });
      router.push("/onboarding/step-2");
    } catch (e) {
      console.error(e);
      router.push("/onboarding/step-2");
    } finally {
      setSaving(false);
    }
  };

  const jobOptions = [
    { id: "Farm Owner", title: "Farm Owner", icon: "agriculture" },
    { id: "Farm Manager", title: "Farm Manager", icon: "manage_accounts" },
    { id: "Farm Consultant | Specialist", title: "Farm Consultant | Specialist", icon: "support_agent" },
    { id: "Farm Assistant", title: "Farm Assistant", icon: "person_outline" },
    { id: "Farm Supervisor", title: "Farm Supervisor", icon: "supervisor_account" },
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

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-8">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Overview
          </Link>
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-primary uppercase tracking-wider">
            <span>Section 1 of 5</span>
            <span>•</span>
            <span>Questions 1–5</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
            Farmer Profile
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Tell us about the person building the future-ready farm.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 md:p-10 border border-surface-variant/40">
          <form className="space-y-10">
            {/* Question 1 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                1. What is your current job title or primary occupation?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {jobOptions.map((opt) => {
                  const isSelected = jobTitle === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => setJobTitle(opt.id)}
                      className="cursor-pointer relative block"
                    >
                      <input
                        type="radio"
                        name="job_title"
                        value={opt.id}
                        checked={isSelected}
                        onChange={() => setJobTitle(opt.id)}
                        className="sr-only"
                      />
                      <div
                        className={`h-full rounded-2xl border p-5 transition-all duration-200 hover:bg-surface-container-low flex flex-col justify-between ${
                          isSelected
                            ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                            : "border-outline-variant"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`material-symbols-outlined text-[26px] ${
                              isSelected ? "text-primary" : "text-on-surface-variant"
                            }`}
                          >
                            {opt.icon}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-primary bg-primary text-white"
                                : "border-outline-variant"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-sm font-semibold block ${
                            isSelected ? "text-primary" : "text-on-surface"
                          }`}
                        >
                          {opt.title}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-3">
              <label
                className="block text-base font-semibold text-on-surface"
                htmlFor="value_chain"
              >
                2. Which agricultural value chain(s) are you involved in?
              </label>
              <input
                id="value_chain"
                type="text"
                placeholder="e.g., Dairy, Avocado, Horticulture & Specialty Vegetables, Poultry..."
                value={valueChain}
                onChange={(e) => setValueChain(e.target.value)}
                className="w-full rounded-xl border border-outline-variant px-5 py-3.5 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/40 bg-surface-bright transition-all"
              />
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                3. How many years of professional or business experience do you have?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {experienceOptions.map((opt) => {
                  const isSelected = experienceYears === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setExperienceYears(opt)}
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

            {/* Question 4 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                4. Have you previously started, owned, or managed a business?
              </label>

              <div className="space-y-2.5">
                {businessHistoryOptions.map((opt) => {
                  const isSelected = businessHistory === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setBusinessHistory(opt)}
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

            {/* Question 5 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                5. What is your highest level of education?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {educationOptions.map((opt) => {
                  const isSelected = education === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setEducation(opt)}
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

            {/* Footer Actions */}
            <div className="pt-8 border-t border-surface-variant/50 flex items-center justify-between">
              <Link
                href="/onboarding"
                className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Overview
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-xs text-on-surface-variant font-medium">
                  Section 1 of 5
                </span>
                <button
                  type="button"
                  onClick={handleSave}
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
