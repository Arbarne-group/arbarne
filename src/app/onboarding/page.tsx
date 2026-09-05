"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function OnboardingOverviewPage() {
  const [user, setUser] = useState<any>(null);
  const [resetting, setResetting] = useState(false);

  const isStep1Done = Boolean(user?.farmerProfile?.jobTitle);
  const isStep2Done = Boolean(user?.farmManagement?.mgmtAbility);
  const isStep3Done = Boolean(user?.operatingStyle?.decisionStyle);
  const isStep4Done = Boolean(user?.aspiration?.fmResponsibility || user?.aspiration?.twelveMonthSuccess);
  const isStep5Done = Boolean(user?.digitalPlatform?.remoteComfort || user?.digitalPlatform?.supportReasons);

  const completedCount = [isStep1Done, isStep2Done, isStep3Done, isStep4Done, isStep5Done].filter(Boolean).length;
  const totalSections = 5;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  useEffect(() => {
    // Fetch user details from database
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("future_farms_user", JSON.stringify(data.user));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleResetOnboarding = async () => {
    if (!confirm("Are you sure you want to reset all onboarding responses to start fresh?")) return;
    setResetting(true);
    try {
      localStorage.removeItem("future_farms_user");
      await fetch("/api/onboarding/step?email=keziah@futurefarms.africa", {
        method: "DELETE",
      });
      setUser((prev: any) => ({
        ...prev,
        farmerProfile: null,
        farmManagement: null,
        operatingStyle: null,
        aspiration: null,
        digitalPlatform: null,
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  const userName = user?.name || "Keziah Wanjiku";
  const userRole = user?.farmerProfile?.jobTitle || "Farm Owner";

  const cards = [
    {
      step: 1,
      href: "/onboarding/step-1",
      title: "Farmer Profile",
      desc: "Job title, value chains, experience, business background & education level (Q1–Q5)",
      icon: "person",
      questions: "Q1 – Q5",
      isDone: isStep1Done,
    },
    {
      step: 2,
      href: "/onboarding/step-2",
      title: "Farm Management Experience",
      desc: "Management ability, day-to-day operations & desired involvement (Q6–Q8)",
      icon: "manage_accounts",
      questions: "Q6 – Q8",
      isDone: isStep2Done,
    },
    {
      step: 3,
      href: "/onboarding/step-3",
      title: "Your Operating Style",
      desc: "Decision making, setbacks response, growth obstacles, guidance & reports (Q9–Q14)",
      icon: "psychology",
      questions: "Q9 – Q14",
      isDone: isStep3Done,
    },
    {
      step: 4,
      href: "/onboarding/step-4",
      title: "Future Farms Aspirations",
      desc: "12-month success, support impact, market insight, manager role & 25-yr vision (Q15–Q21)",
      icon: "rocket_launch",
      questions: "Q15 – Q21",
      isDone: isStep4Done,
    },
    {
      step: 5,
      href: "/onboarding/step-5",
      title: "Digital Management Platforms",
      desc: "Platform readiness, remote confidence, audits & record-keeping (Q22–Q27)",
      icon: "devices",
      questions: "Q22 – Q27",
      isDone: isStep5Done,
    },
  ];

  // First unfinished step
  const nextStepHref = !isStep1Done ? "/onboarding/step-1"
    : !isStep2Done ? "/onboarding/step-2"
    : !isStep3Done ? "/onboarding/step-3"
    : !isStep4Done ? "/onboarding/step-4"
    : !isStep5Done ? "/onboarding/step-5"
    : "/assessment";

  return (
    <AppShell userName={userName} userRole={userRole}>
      <div className="px-4 md:px-10 py-6 max-w-[1280px] mx-auto w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 md:p-10 mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-surface-variant/30">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="flex-1 z-10">
            <h1 className="text-3xl md:text-5xl font-bold text-on-surface mb-3 tracking-tight">
              Welcome to Future Farms!
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant mb-8 max-w-lg leading-relaxed">
              Let&apos;s get to know you and your farm across 5 core sections so we can personalize your transformation journey.
            </p>

            {/* Progress Card */}
            <div className="bg-surface rounded-2xl p-6 border border-surface-container-high max-w-md shadow-sm">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="font-semibold text-base mb-1">
                    <Link
                      href={nextStepHref}
                      className="text-primary hover:underline inline-flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {completedCount === 0
                        ? "Start Onboarding"
                        : completedCount === totalSections
                        ? "Review Completed Onboarding"
                        : "Continue Onboarding"}
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </Link>
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {completedCount} of {totalSections} sections completed (27 questions total)
                  </p>
                </div>
                <span className="text-2xl text-primary font-bold">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-3 mt-4 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full md:w-[380px] h-[260px] md:h-[340px] relative z-10 shrink-0">
            <img
              alt="Sustainable Farmer"
              className="w-full h-full object-cover rounded-2xl shadow-md border border-surface-variant/30"
              src="/images/sustainable-farmer.jpg"
            />
          </div>
        </section>

        {/* Questionnaire Grid */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface">
                Farmer &amp; Farm Onboarding Sections
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
                Answer all 27 questions across 5 sections to establish your farm maturity baseline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetOnboarding}
                disabled={resetting}
                className="text-xs font-semibold text-on-surface-variant hover:text-error bg-surface-container-high hover:bg-error/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Clear all responses and restart onboarding from scratch"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                <span>{resetting ? "Resetting..." : "Reset Responses"}</span>
              </button>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                Phase 1: Initial Profiling
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
            {cards.map((card, idx) => {
              const isCompleted = card.isDone;

              return (
                <Link
                  key={idx}
                  href={card.href}
                  className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border transition-all hover:shadow-md group flex flex-col h-full border-surface-container-high hover:border-primary/40"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[20px]">
                        {card.icon}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-container-high text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {card.questions}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      Section {card.step} of 5
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm md:text-base text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-3 mb-4">
                    {card.desc}
                  </p>

                  <div className="mt-auto pt-3 border-t border-surface-variant/40 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>{isCompleted ? "Completed" : "Start Section"}</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="flex justify-start">
            <Link
              href={nextStepHref}
              className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-8 py-3.5 rounded-xl shadow-sm hover:shadow-md btn-shadow hover-lift transition-all flex items-center gap-2"
            >
              <span>
                {completedCount === 0
                  ? "Start Onboarding"
                  : completedCount === totalSections
                  ? "Proceed to Assessment"
                  : "Continue Onboarding"}
              </span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
