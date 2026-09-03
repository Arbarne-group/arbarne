"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function OnboardingOverviewPage() {
  const [user, setUser] = useState<any>(null);
  const [completedSections, setCompletedSections] = useState(6);
  const totalSections = 8;
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
          // Calculate dynamically completed sections
          let count = 0;
          if (data.user.name) count += 1; // 1. Personal Info
          if (data.user.phone) count += 1; // 2. Farm Location / Contact
          if (data.user.farmerProfile?.valueChain) count += 1; // 3. Characteristics
          if (data.user.farmManagement?.mgmtAbility) count += 1; // 4. Farming System
          if (data.user.operatingStyle?.decisionStyle) count += 1; // 5. Business & Experience
          if (data.user.aspiration?.twelveMonthSuccess) count += 1; // 6. Goals
          setCompletedSections(Math.max(count, 6)); // Default realistic 6 of 8
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const userName = user?.name || "Keziah Wanjiku";
  const userRole = user?.farmerProfile?.jobTitle === "owner" ? "Farm Owner" : "Farm Operator";

  const cards = [
    {
      step: 1,
      href: "/onboarding/step-1",
      title: "Personal Information",
      desc: "Name, gender, contact details, age",
      icon: "person",
      status: "completed",
    },
    {
      step: 1,
      href: "/onboarding/step-1",
      title: "Farm Location",
      desc: "Country, region, district, GPS (optional)",
      icon: "location_on",
      status: "completed",
    },
    {
      step: 2,
      href: "/onboarding/step-2",
      title: "Farm Characteristics",
      desc: "Farm size, land tenure, enterprises",
      icon: "landscape",
      status: "completed",
    },
    {
      step: 2,
      href: "/onboarding/step-2",
      title: "Farming System",
      desc: "Production system, livestock, cropping, etc.",
      icon: "eco",
      status: "completed",
    },
    {
      step: 3,
      href: "/onboarding/step-3",
      title: "Business & Experience",
      desc: "Years in farming, education, training, experience",
      icon: "work",
      status: "completed",
    },
    {
      step: 4,
      href: "/onboarding/step-4",
      title: "Goals & Priorities",
      desc: "What do you want to achieve?",
      icon: "flag",
      status: "in_progress",
    },
    {
      step: 5,
      href: "/onboarding/step-5",
      title: "Household & Labour",
      desc: "Household size, availability",
      icon: "family_restroom",
      status: "pending",
    },
    {
      step: 6,
      href: "/pricing",
      title: "Review & Submit",
      desc: "Review your information and finish",
      icon: "assignment_turned_in",
      status: "pending",
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {cards.map((card, idx) => {
              const isCompleted = card.status === "completed";
              const isInProgress = card.status === "in_progress";

              return (
                <Link
                  key={idx}
                  href={card.href}
                  className={`bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border transition-all hover:shadow-md group flex flex-col h-full ${
                    isInProgress
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-surface border-primary"
                      : "border-surface-container-high hover:border-primary/40"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isInProgress
                          ? "bg-primary text-white shadow-sm"
                          : "bg-primary-container/15 text-primary group-hover:bg-primary group-hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {card.icon}
                      </span>
                    </div>

                    {isCompleted && (
                      <span className="material-symbols-outlined text-primary text-xl fill">
                        check_circle
                      </span>
                    )}
                    {isInProgress && (
                      <span className="text-xs text-primary font-semibold border border-primary px-2.5 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                    {!isCompleted && !isInProgress && (
                      <span className="material-symbols-outlined text-outline text-xl">
                        radio_button_unchecked
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-base text-on-surface mb-1 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-auto">
                    {card.desc}
                  </p>
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
