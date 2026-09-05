"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function OnboardingOverviewPage() {
  const [user, setUser] = useState<any>(null);
  const [completedSections, setCompletedSections] = useState(5);
  const totalSections = 5;
  const progressPercent = Math.round((completedSections / totalSections) * 100);

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
          // Calculate dynamically completed sections out of 5
          let count = 0;
          if (data.user.farmerProfile?.jobTitle) count += 1; // 1. Farmer Profile
          if (data.user.farmManagement?.mgmtAbility) count += 1; // 2. Management Experience
          if (data.user.operatingStyle?.decisionStyle) count += 1; // 3. Operating Style
          if (data.user.aspiration?.twelveMonthSuccess) count += 1; // 4. Aspirations
          if (data.user.digitalPlatform?.supportReasons) count += 1; // 5. Digital Platforms
          setCompletedSections(count > 0 ? count : 5);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const userName = user?.name || "Keziah Wanjiku";
  const userRole = user?.farmerProfile?.jobTitle || "Farm Owner";

  const cards = [
    {
      step: 1,
      href: "/onboarding/step-1",
      title: "Farmer Profile",
      desc: "Job title, value chains, experience, business background & education (Q1–Q5)",
      icon: "person",
      questions: "Q1 – Q5",
      isDone: !!user?.farmerProfile?.jobTitle,
    },
    {
      step: 2,
      href: "/onboarding/step-2",
      title: "Farm Management Experience",
      desc: "Management ability, day-to-day operations & desired involvement (Q6–Q8)",
      icon: "manage_accounts",
      questions: "Q6 – Q8",
      isDone: !!user?.farmManagement?.mgmtAbility,
    },
    {
      step: 3,
      href: "/onboarding/step-3",
      title: "Your Operating Style",
      desc: "Decision making, setbacks response, growth obstacles, guidance & reports (Q9–Q14)",
      icon: "psychology",
      questions: "Q9 – Q14",
      isDone: !!user?.operatingStyle?.decisionStyle,
    },
    {
      step: 4,
      href: "/onboarding/step-4",
      title: "Future Farms Aspirations",
      desc: "12-month success, support impact, market insight, manager role & 25-yr vision (Q15–Q21)",
      icon: "flag",
      questions: "Q15 – Q21",
      isDone: !!user?.aspiration?.twelveMonthSuccess,
    },
    {
      step: 5,
      href: "/onboarding/step-5",
      title: "Digital Management Platforms",
      desc: "Platform readiness, remote confidence, audits & record-keeping (Q22–Q27)",
      icon: "devices",
      questions: "Q22 – Q27",
      isDone: !!user?.digitalPlatform?.supportReasons,
    },
  ];

  return (
    <AppShell userName={userName} userRole={userRole}>
      <div className="px-4 md:px-10 py-6 max-w-[1280px] mx-auto w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 md:p-10 mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-surface-variant/30">
          {/* Background Decorative Blob */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="flex-1 z-10">
            <h1 className="text-3xl md:text-5xl font-bold text-on-surface mb-3 tracking-tight">
              Welcome to Future Farms!
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant mb-8 max-w-lg leading-relaxed">
              Let&apos;s get to know you and your farm so we can personalize your Future Farms journey.
            </p>

            {/* Progress Card */}
            <div className="bg-surface rounded-2xl p-6 border border-surface-container-high max-w-md shadow-sm">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="font-semibold text-base mb-1">
                    <Link
                      href="/onboarding/step-4"
                      className="text-primary hover:underline inline-flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      Complete Onboarding Process{" "}
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </Link>
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {completedSections} of {totalSections} sections completed
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
            <h2 className="text-xl md:text-2xl font-bold text-on-surface">
              Tell us about yourself &amp; your farm
            </h2>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              Phase 1: Initial Profiling
            </span>
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
                      Step {card.step}
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
              href="/pricing"
              className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-8 py-3.5 rounded-xl shadow-sm hover:shadow-md btn-shadow hover-lift transition-all flex items-center gap-2"
            >
              <span>Continue to My Assessment</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
