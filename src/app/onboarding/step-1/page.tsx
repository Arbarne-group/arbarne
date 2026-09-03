"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function FarmerProfilePage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("owner");
  const [valueChain, setValueChain] = useState("Horticulture & Specialty Vegetables");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.farmerProfile) {
          if (data.user.farmerProfile.jobTitle) setJobTitle(data.user.farmerProfile.jobTitle);
          if (data.user.farmerProfile.valueChain) setValueChain(data.user.farmerProfile.valueChain);
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
          data: { jobTitle, valueChain },
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
    {
      id: "owner",
      title: "Farm Owner",
      icon: "agriculture",
    },
    {
      id: "manager",
      title: "Farm Manager",
      icon: "manage_accounts",
    },
    {
      id: "consultant",
      title: "Farm Consultant | Specialist",
      icon: "support_agent",
    },
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        className={`h-full rounded-2xl border p-6 transition-all duration-200 hover:bg-surface-container-low flex flex-col justify-between ${
                          isSelected
                            ? "border-primary bg-primary-container/5 ring-1 ring-primary shadow-sm"
                            : "border-outline-variant"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`material-symbols-outlined text-[28px] ${
                              isSelected ? "text-primary" : "text-on-surface-variant"
                            }`}
                          >
                            {opt.icon}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-primary bg-primary text-white"
                                : "border-outline-variant"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-base font-semibold block ${
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
                placeholder="e.g., Dairy, Horticulture, Poultry, Cereals..."
                value={valueChain}
                onChange={(e) => setValueChain(e.target.value)}
                className="w-full rounded-xl border border-outline-variant px-5 py-3.5 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/40 bg-surface-bright transition-all"
              />
            </div>

            {/* Footer Actions */}
            <div className="pt-8 border-t border-surface-variant/50 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">
                Step 1 of 5
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
          </form>
        </div>
      </div>
    </AppShell>
  );
}
