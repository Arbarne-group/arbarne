"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function OnboardingOverviewPage() {
  const [user, setUser] = useState<any>(null);
  const isStep1Done = Boolean(user?.farmerProfile?.jobTitle);
  const isStep2Done = Boolean(user?.farmManagement?.mgmtAbility);
  const isStep3Done = Boolean(user?.operatingStyle?.decisionStyle);
  const isStep4Done = Boolean(user?.aspiration?.fmResponsibility || user?.aspiration?.twelveMonthSuccess);
  const isStep5Done = Boolean(user?.digitalPlatform?.remoteComfort || user?.digitalPlatform?.supportReasons);

  const completedCount = [isStep1Done, isStep2Done, isStep3Done, isStep4Done, isStep5Done].filter(Boolean).length;
  const totalSections = 5;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  useEffect(() => {
    // Attempt to load from localStorage or fetch user from DB
    const cached = localStorage.getItem("future_farms_user");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setUser(parsed);
      } catch (e) {
        console.error(e);
      }
    }

    // Fetch user details from database
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const userName = user?.name || "Keziah Wanjiku";
  const userRole = user?.farmerProfile?.jobTitle?.includes("Owner") || user?.farmerProfile?.jobTitle === "owner" 
    ? "Farm Owner" 
    : (user?.farmerProfile?.jobTitle || "Farm Owner");

  const cards = [
    {
      step: 1,
      href: "/onboarding/step-1",
      title: "Farmer Profile",
      desc: "Questions 1–5 · Occupation, value chains, experience & education level.",
      icon: "person",
      status: isStep1Done ? "completed" : "in_progress",
    },
    {
      step: 2,
      href: "/onboarding/step-2",
      title: "Farm Management Experience",
      desc: "Questions 6–8 · Management capability, operations oversight & desired involvement.",
      icon: "manage_accounts",
      status: isStep2Done ? "completed" : isStep1Done ? "in_progress" : "pending",
    },
    {
      step: 3,
      href: "/onboarding/step-3",
      title: "Your Operating Style",
      desc: "Questions 9–14 · Decision making, problem response, obstacles & guidance preferences.",
      icon: "psychology",
      status: isStep3Done ? "completed" : isStep2Done ? "in_progress" : "pending",
    },
    {
      step: 4,
      href: "/onboarding/step-4",
      title: "Your Future Farms Aspirations",
      desc: "Questions 15–21 · 12-month goals, impact areas, manager delegation & 25-year vision.",
      icon: "rocket_launch",
      status: isStep4Done ? "completed" : isStep3Done ? "in_progress" : "pending",
    },
    {
      step: 5,
      href: "/onboarding/step-5",
      title: "Working With Digital Platforms",
      desc: "Questions 22–27 · Remote solutions comfort, record keeping & periodic audit visits.",
      icon: "devices",
      status: isStep5Done ? "completed" : isStep4Done ? "in_progress" : "pending",
    },
  ];

  // First unfinished step
  const nextStepHref = !isStep1Done ? "/onboarding/step-1"
    : !isStep2Done ? "/onboarding/step-2"
    : !isStep3Done ? "/onboarding/step-3"
    : !isStep4Done ? "/onboarding/step-4"
    : !isStep5Done ? "/onboarding/step-5"
    : "/pricing";

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
                      {completedCount === totalSections ? "Review Completed Onboarding" : "Continue Onboarding"}
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
              className="w-full h-full object-cover rounded-2xl shadow-md"
              src="https://lh3.googleusercontent.com/aida/AEtjO1We64MQUaGsXjzRP8tdnhq6TOE5QCcMOaGlV2uds2PGUjSDq0ts_RYK39wdTVQGPipX7Puw4951nBRNnB-XI3bo1m14bR7DBfgaaZDgKmUM7LbgSkRdHXqM9Jum8qVGcvdCxslhOtZd1aCcFZ2olZDV05MulVhotuh9YFrx3pNFvosBFRiYWoGg6O5PrHie_ukd-tGjd0ysF-rBjlmw_e3QynPOyQ8NP_pTcgw1rFeyc6h0Nx5NK4ocFw"
            />
          </div>
        </section>

        {/* Questionnaire Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface">
                Farmer &amp; Farm Onboarding Sections
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
                Answer all 27 questions across 5 sections to establish your farm maturity baseline
              </p>
            </div>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              Phase 1: Initial Profiling
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {cards.map((card, idx) => {
              const isCompleted = card.status === "completed";
              const isInProgress = card.status === "in_progress";

              return (
                <Link
                  key={idx}
                  href={card.href}
                  className={`bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border transition-all hover:shadow-md group flex flex-col h-full ${
                    isInProgress
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-surface border-primary"
                      : "border-surface-container-high hover:border-primary/40"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                        isInProgress
                          ? "bg-primary text-white shadow-sm"
                          : "bg-primary-container/20 text-primary group-hover:bg-primary group-hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {card.icon}
                      </span>
                    </div>

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        Completed
                      </span>
                    )}
                    {isInProgress && (
                      <span className="text-xs text-primary font-semibold border border-primary px-2.5 py-1 rounded-full bg-primary/5">
                        In Progress
                      </span>
                    )}
                    {!isCompleted && !isInProgress && (
                      <span className="material-symbols-outlined text-outline text-xl">
                        radio_button_unchecked
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1">
                    Section {card.step} of 5
                  </div>

                  <h3 className="font-semibold text-lg text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-auto">
                    {card.desc}
                  </p>
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
              <span>{completedCount === totalSections ? "Proceed to Assessment Pricing" : "Continue Onboarding"}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
