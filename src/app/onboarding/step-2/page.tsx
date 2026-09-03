"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function FarmManagementPage() {
  const router = useRouter();
  const [mgmtAbility, setMgmtAbility] = useState("Experienced");
  const [operators, setOperators] = useState<string[]>([
    "Myself (Owner/Operator)",
    "Hired Farm Manager",
  ]);
  const [otherOperator, setOtherOperator] = useState("");
  const [desiredInvolvement, setDesiredInvolvement] = useState("Moderately involved");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.farmManagement) {
          const fm = data.user.farmManagement;
          if (fm.mgmtAbility) setMgmtAbility(fm.mgmtAbility);
          if (fm.operators) {
            try {
              setOperators(JSON.parse(fm.operators));
            } catch (e) {}
          }
          if (fm.otherOperator) setOtherOperator(fm.otherOperator);
          if (fm.desiredInvolvement) setDesiredInvolvement(fm.desiredInvolvement);
        }
      })
      .catch(console.error);
  }, []);

  const toggleOperator = (item: string) => {
    if (operators.includes(item)) {
      setOperators(operators.filter((o) => o !== item));
    } else {
      setOperators([...operators, item]);
    }
  };

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
            operators,
            otherOperator,
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

  const abilities = [
    {
      id: "Beginner",
      desc: "I am new to farming and rely heavily on advisors or external help to make operational decisions.",
    },
    {
      id: "Intermediate",
      desc: "I have some experience and can manage basic operations, but still seek guidance for complex issues.",
    },
    {
      id: "Experienced",
      desc: "I confidently manage most day-to-day operations and strategic planning independently.",
    },
    {
      id: "Expert",
      desc: "I have extensive experience, optimize complex systems, and often advise other farmers.",
    },
  ];

  const operatorOptions = [
    "Myself (Owner/Operator)",
    "Family Members",
    "Hired Farm Manager",
    "Contracted Workers / Agency",
  ];

  const involvementOptions = [
    {
      id: "Very involved",
      desc: "I want to make all day-to-day decisions and oversee all operations directly.",
      icon: "front_hand",
    },
    {
      id: "Moderately involved",
      desc: "I want to handle key decisions but delegate routine tasks to trusted staff.",
      icon: "handshake",
    },
    {
      id: "Strategically involved",
      desc: "I focus on high-level strategy and planning, leaving execution entirely to management.",
      icon: "monitoring",
    },
    {
      id: "Minimally involved",
      desc: "I view this primarily as an investment and want minimal operational involvement.",
      icon: "visibility_off",
    },
  ];

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto w-full pb-28">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/onboarding/step-1"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Step 1
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
            Farm Management Experience
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            Help us understand how you currently manage your farm.
          </p>
        </div>

        <div className="space-y-10">
          {/* Question 6: Ability Level */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <h3 className="text-base font-semibold text-on-surface mb-5">
              6. Which statement best describes your current farm management ability?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {abilities.map((item) => {
                const isSelected = mgmtAbility === item.id;
                return (
                  <label
                    key={item.id}
                    onClick={() => setMgmtAbility(item.id)}
                    className={`cursor-pointer rounded-2xl border p-5 flex items-start gap-4 transition-all hover:bg-surface-container-low ${
                      isSelected
                        ? "border-primary bg-primary-container/5 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-on-surface mb-1">
                        {item.id}
                      </h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Question 7: Operators */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <h3 className="text-base font-semibold text-on-surface mb-1">
              7. Who is currently responsible for day-to-day farm operations?
            </h3>
            <p className="text-xs text-on-surface-variant mb-5">
              Select all that apply.
            </p>

            <div className="space-y-3">
              {operatorOptions.map((opt) => {
                const isChecked = operators.includes(opt);
                return (
                  <label
                    key={opt}
                    onClick={() => toggleOperator(opt)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      isChecked
                        ? "border-primary/50 bg-primary-container/5"
                        : "border-outline-variant/60 hover:bg-surface-container-low"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                    <span className="text-sm font-medium text-on-surface">
                      {opt}
                    </span>
                  </label>
                );
              })}

              {/* Other option */}
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Other (Please specify)"
                  value={otherOperator}
                  onChange={(e) => setOtherOperator(e.target.value)}
                  className="w-full max-w-md rounded-xl border border-outline-variant px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-surface-bright"
                />
              </div>
            </div>
          </section>

          {/* Question 8: Desired Involvement */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <h3 className="text-base font-semibold text-on-surface mb-5">
              8. How involved would you like to be in the day-to-day management of your farm?
            </h3>
            <div className="flex flex-col gap-3">
              {involvementOptions.map((opt) => {
                const isSelected = desiredInvolvement === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => setDesiredInvolvement(opt.id)}
                    className={`cursor-pointer rounded-2xl border p-4 sm:p-5 flex items-center justify-between gap-4 transition-all hover:bg-surface-container-low ${
                      isSelected
                        ? "border-primary bg-primary-container/5 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-on-surface mb-0.5">
                          {opt.id}
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary text-2xl shrink-0 hidden sm:block">
                      {opt.icon}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {/* Floating Bottom Nav for Step Navigation */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/onboarding/step-1"
            className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            &larr; Back
          </Link>
          <div className="text-xs text-on-surface-variant font-medium">
            Step 2 of 5
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm btn-shadow hover-lift transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
          >
            <span>{saving ? "Saving..." : "Next"}</span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
