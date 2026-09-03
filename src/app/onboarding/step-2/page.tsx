"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function FarmManagementPage() {
  const router = useRouter();
  const [mgmtAbility, setMgmtAbility] = useState(
    "I direct farm operations confidently and delegate execution to my team."
  );
  const [opsResponsibility, setOpsResponsibility] = useState("I am");
  const [desiredInvolvement, setDesiredInvolvement] = useState(
    "Moderately involved — I want regular updates and to approve major decisions."
  );
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
        if (data.user?.farmManagement) {
          const fm = data.user.farmManagement;
          if (fm.mgmtAbility) {
            // Support legacy mapping if any
            if (fm.mgmtAbility === "Experienced") {
              setMgmtAbility("I direct farm operations confidently and delegate execution to my team.");
            } else if (fm.mgmtAbility === "Beginner") {
              setMgmtAbility("I am new to farm management and would like structured professional support.");
            } else {
              setMgmtAbility(fm.mgmtAbility);
            }
          }
          if (fm.opsResponsibility) {
            setOpsResponsibility(fm.opsResponsibility);
          } else if (fm.operators) {
            try {
              const parsed = JSON.parse(fm.operators);
              if (Array.isArray(parsed) && parsed.length > 0) {
                if (parsed[0].includes("Myself")) setOpsResponsibility("I am");
                else if (parsed[0].includes("Manager")) setOpsResponsibility("A Farm Manager");
                else setOpsResponsibility(parsed[0]);
              }
            } catch (e) {}
          }
          if (fm.desiredInvolvement) {
            if (fm.desiredInvolvement === "Moderately involved") {
              setDesiredInvolvement("Moderately involved — I want regular updates and to approve major decisions.");
            } else if (fm.desiredInvolvement === "Very involved") {
              setDesiredInvolvement("Very involved — I want to participate in most operational decisions.");
            } else {
              setDesiredInvolvement(fm.desiredInvolvement);
            }
          }
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
          step: 2,
          email: "keziah@futurefarms.africa",
          data: {
            mgmtAbility,
            opsResponsibility,
            desiredInvolvement,
          },
        }),
      });
      router.push("/onboarding/step-3");
    } catch (e) {
      console.error(e);
      router.push("/onboarding/step-3");
    } finally {
      setSaving(false);
    }
  };

  const abilityOptions = [
    "I manage most farm operations myself.",
    "I direct farm operations confidently and delegate execution to my team.",
    "I understand farm management, but I rely on a Farm Manager or technical professional for significant support.",
    "I have limited farm management experience and rely heavily on a Farm Manager or other professionals.",
    "I am new to farm management and would like structured professional support.",
  ];

  const responsibilityOptions = [
    "I am",
    "A Farm Manager",
    "A Farm Supervisor",
    "A family member",
    "Farm workers",
    "Operations are shared between several people",
    "No one has a clearly defined responsibility",
  ];

  const involvementOptions = [
    "Very involved — I want to participate in most operational decisions.",
    "Moderately involved — I want regular updates and to approve major decisions.",
    "Strategically involved — I want to focus on business direction while the Farm Manager handles operations.",
    "Minimally involved — I prefer the Farm Manager to handle most operations and report performance to me.",
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
            <span>Section 2 of 5</span>
            <span>•</span>
            <span>Questions 6–8</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
            Farm Management Experience
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Help us understand how you currently manage your farm.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 md:p-10 border border-surface-variant/40">
          <form className="space-y-10">
            {/* Question 6 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                6. Which statement best describes your current farm management ability?
              </label>

              <div className="space-y-3">
                {abilityOptions.map((opt) => {
                  const isSelected = mgmtAbility === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setMgmtAbility(opt)}
                      className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex items-start gap-4 ${
                        isSelected
                          ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                          : "border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span
                        className={`text-sm leading-relaxed ${
                          isSelected ? "text-primary font-semibold" : "text-on-surface"
                        }`}
                      >
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Question 7 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                7. Who is currently responsible for day-to-day farm operations?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {responsibilityOptions.map((opt) => {
                  const isSelected = opsResponsibility === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setOpsResponsibility(opt)}
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

            {/* Question 8 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                8. How involved would you like to be in the day-to-day management of your farm?
              </label>

              <div className="space-y-3">
                {involvementOptions.map((opt) => {
                  const isSelected = desiredInvolvement === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setDesiredInvolvement(opt)}
                      className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex items-start gap-4 ${
                        isSelected
                          ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                          : "border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span
                        className={`text-sm leading-relaxed ${
                          isSelected ? "text-primary font-semibold" : "text-on-surface"
                        }`}
                      >
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="pt-8 border-t border-surface-variant/50 flex items-center justify-between">
              <Link
                href="/onboarding/step-1"
                className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Previous Section
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-xs text-on-surface-variant font-medium">
                  Section 2 of 5
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
