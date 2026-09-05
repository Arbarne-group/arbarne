"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function FarmManagementPage() {
  const router = useRouter();
  const [mgmtAbility, setMgmtAbility] = useState("");
  const [operationsResponsible, setOperationsResponsible] = useState("");
  const [otherOperator, setOtherOperator] = useState("");
  const [desiredInvolvement, setDesiredInvolvement] = useState("");
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
          if (fm.mgmtAbility) setMgmtAbility(fm.mgmtAbility);
          if (fm.operationsResponsible || fm.opsResponsibility) {
            setOperationsResponsible(fm.operationsResponsible || fm.opsResponsibility);
          } else if (fm.operators) {
            try {
              const parsed = JSON.parse(fm.operators);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setOperationsResponsible(parsed[0]);
              }
            } catch (e) {}
          }
          if (fm.otherOperator) setOtherOperator(fm.otherOperator);
          if (fm.desiredInvolvement) {
            setDesiredInvolvement(fm.desiredInvolvement);
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
            operationsResponsible,
            opsResponsibility: operationsResponsible,
            operators: [operationsResponsible],
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

  const abilityOptions = [
    {
      title: "I manage most farm operations myself.",
      desc: "Direct hands-on involvement in daily farm chores and operational decisions.",
      icon: "person",
    },
    {
      title: "I direct farm operations confidently and delegate execution to my team.",
      desc: "Set strategic goals and oversee workforce execution with structured feedback.",
      icon: "groups",
    },
    {
      title: "I understand farm management, but I rely on a Farm Manager or technical professional for significant support.",
      desc: "Possess fundamental understanding while leaning on professional expertise for agronomy and systems.",
      icon: "support_agent",
    },
    {
      title: "I have limited farm management experience and rely heavily on a Farm Manager or other professionals.",
      desc: "Rely substantially on experienced staff or consulting agronomists for key operational execution.",
      icon: "diversity_3",
    },
    {
      title: "I am new to farm management and would like structured professional support.",
      desc: "Starting fresh and seeking end-to-end guidance, systems, and standard operating procedures.",
      icon: "school",
    },
  ];

  const operatorOptions = [
    "I am",
    "A Farm Manager",
    "A Farm Supervisor",
    "A family member",
    "Farm workers",
    "Operations are shared between several people",
    "No one has a clearly defined responsibility",
  ];

  const involvementOptions = [
    {
      title: "Very involved — I want to participate in most operational decisions.",
      desc: "Active participation in daily workflows, inputs purchasing, and crop schedules.",
      icon: "front_hand",
    },
    {
      title: "Moderately involved — I want regular updates and to approve major decisions.",
      desc: "Regular dashboard digests, weekly reviews, and approval over significant expenditures.",
      icon: "handshake",
    },
    {
      title: "Strategically involved — I want to focus on business direction while the Farm Manager handles operations.",
      desc: "Focus on capital, markets, and enterprise growth while professional management executes production.",
      icon: "monitoring",
    },
    {
      title: "Minimally involved — I prefer the Farm Manager to handle most operations and report performance to me.",
      desc: "Hands-off management with monthly / quarterly board-level performance reports.",
      icon: "visibility_off",
    },
  ];

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
              Section 2 of 5
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Questions 6 – 8</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2 tracking-tight">
            Farm Management Experience
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Help us understand how you currently manage your farm.
          </p>
        </div>

        <div className="space-y-8">
          {/* Question 6: Ability Level */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <h3 className="text-base font-semibold text-on-surface mb-1">
              6. Which statement best describes your current farm management ability?
            </h3>
            <p className="text-xs text-on-surface-variant mb-5">
              Select the statement that best aligns with your day-to-day management level.
            </p>

            <div className="space-y-3">
              {abilityOptions.map((opt) => {
                const isSelected = mgmtAbility === opt.title;
                return (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => setMgmtAbility(opt.title)}
                    className={`w-full text-left rounded-2xl border p-5 flex items-start justify-between gap-4 transition-all hover:bg-surface-container-low cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <h4
                          className={`font-semibold text-sm mb-1 ${
                            isSelected ? "text-primary" : "text-on-surface"
                          }`}
                        >
                          {opt.title}
                        </h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`material-symbols-outlined text-[22px] shrink-0 hidden sm:block ${
                        isSelected ? "text-primary" : "text-on-surface-variant/60"
                      }`}
                    >
                      {opt.icon}
                    </span>
                  </button>
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
              Select the primary person or group managing operational execution.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {operatorOptions.map((opt) => {
                const isSelected = operationsResponsible === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setOperationsResponsible(opt)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all ${
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

            {/* Other option */}
            <div className="pt-2">
              <input
                type="text"
                placeholder="Other arrangement (Please specify)..."
                value={otherOperator}
                onChange={(e) => setOtherOperator(e.target.value)}
                className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-surface"
              />
            </div>
          </section>

          {/* Question 8: Desired Involvement */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <h3 className="text-base font-semibold text-on-surface mb-1">
              8. How involved would you like to be in the day-to-day management of your farm?
            </h3>
            <p className="text-xs text-on-surface-variant mb-5">
              Define your ideal future balance between operations and oversight.
            </p>

            <div className="flex flex-col gap-3">
              {involvementOptions.map((opt) => {
                const isSelected = desiredInvolvement === opt.title;
                return (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => setDesiredInvolvement(opt.title)}
                    className={`cursor-pointer rounded-2xl border p-5 flex items-center justify-between text-left gap-4 transition-all hover:bg-surface-container-low ${
                      isSelected
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
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
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <h4
                          className={`font-semibold text-sm mb-1 ${
                            isSelected ? "text-primary" : "text-on-surface"
                          }`}
                        >
                          {opt.title}
                        </h4>
                        <p className="text-xs text-on-surface-variant">{opt.desc}</p>
                      </div>
                    </div>
                    <span
                      className={`material-symbols-outlined text-[24px] shrink-0 hidden sm:block ${
                        isSelected ? "text-primary" : "text-on-surface-variant/60"
                      }`}
                    >
                      {opt.icon}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Floating Bottom Nav */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/onboarding/step-1"
            className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            &larr; Back to Step 1
          </Link>
          <div className="text-xs text-on-surface-variant font-medium">
            Section 2 of 5
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm btn-shadow hover-lift transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
          >
            <span>{saving ? "Saving..." : "Save & Continue"}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
