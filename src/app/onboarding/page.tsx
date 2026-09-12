"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import AppShell from "@/components/layout/AppShell";

import { computeOnboardingStageFromUser, getActiveUserEmail } from "@/lib/onboardingGuard";
import {
  computeAssessmentResults,
  getMaturityTier,
  OverallAssessmentResult,
} from "@/lib/assessmentScoring";

export default function OnboardingOverviewPage() {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingStage, setOnboardingStage] = useState<string>("INITIAL_IN_PROGRESS");
  const [assessmentResult, setAssessmentResult] = useState<OverallAssessmentResult | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Initial sections (5)
  const isStep1Done = Boolean(user?.farmerProfile?.jobTitle);
  const isStep2Done = Boolean(user?.farmManagement?.mgmtAbility);
  const isStep3Done = Boolean(user?.operatingStyle?.decisionStyle);
  const isStep4Done = Boolean(user?.aspiration?.fmResponsibility || user?.aspiration?.twelveMonthSuccess);
  const isStep5Done = Boolean(user?.digitalPlatform?.remoteComfort || user?.digitalPlatform?.supportReasons);
  const initialDoneCount = [isStep1Done, isStep2Done, isStep3Done, isStep4Done, isStep5Done].filter(Boolean).length;
  const initialTotal = 5;
  const initialPercent = Math.round((initialDoneCount / initialTotal) * 100);

  // Additional sections (5 - goals & priorities removed)
  const isLocDone = Boolean(user?.farmLocation);
  const isCharDone = Boolean(user?.farmCharacteristics);
  const isSysDone = Boolean(user?.farmingSystem);
  const isBizDone = Boolean(user?.businessExperience);
  const isLabDone = Boolean(user?.householdLabour);
  const additionalDoneCount = [isLocDone, isCharDone, isSysDone, isBizDone, isLabDone].filter(Boolean).length;
  const additionalTotal = 5;
  const additionalPercent = Math.round((additionalDoneCount / additionalTotal) * 100);

  const profileApproved = Boolean(user?.onboardingStatus?.profileApproved);

  const fetchStatus = () => {
    let email = clerkUser?.primaryEmailAddress?.emailAddress || getActiveUserEmail();
    const cached = localStorage.getItem("future_farms_user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        if (u.email && !email) email = u.email;
        setUser(u);
        const st = computeOnboardingStageFromUser(u);
        setOnboardingStage(st.stage);
        if (st.stage === "FULLY_COMPLETED") {
          router.replace("/assessment");
          return;
        }
      } catch (e) {}
    }

    if (!email) {
      setLoading(false);
      return;
    }

    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          const st = computeOnboardingStageFromUser(data.user);
          setOnboardingStage(st.stage);
          localStorage.setItem("future_farms_user", JSON.stringify({ ...data.user, stage: st.stage }));
          if (st.stage === "FULLY_COMPLETED") {
            router.replace("/assessment");
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();

    const email = clerkUser?.primaryEmailAddress?.emailAddress || getActiveUserEmail();
    if (email) {
      fetch(`/api/assessment/responses?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.answers && Object.keys(data.answers).length > 0) {
            setAssessmentResult(computeAssessmentResults(data.answers));
          } else {
            try {
              const saved = localStorage.getItem("future_farms_all_answers");
              if (saved) {
                setAssessmentResult(computeAssessmentResults(JSON.parse(saved)));
              } else {
                setAssessmentResult(computeAssessmentResults({}));
              }
            } catch (e) {
              setAssessmentResult(computeAssessmentResults({}));
            }
          }
        })
        .catch(() => {
          setAssessmentResult(computeAssessmentResults({}));
        });
    }
  }, [clerkUser]);

  const userName = user?.name || clerkUser?.fullName || "Farmer";
  const userRole = user?.farmerProfile?.jobTitle || "Farm Owner";

  // Initial cards (Phase 1)
  const initialCards = [
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

  // Additional cards (Phase 2: 5 sections)
  const additionalCards = [
    {
      step: 1,
      stageNumber: "1/5",
      href: "/onboarding/location",
      title: "Farm Location & Details",
      desc: "Administrative county, trading center, landmarks, and area details.",
      icon: "pin_drop",
      isDone: isLocDone,
    },
    {
      step: 2,
      stageNumber: "2/5",
      href: "/onboarding/characteristics",
      title: "Farm Characteristics",
      desc: "Total acreage, cultivated crop land, pasture split, land tenure, and water source.",
      icon: "landscape",
      isDone: isCharDone,
    },
    {
      step: 3,
      stageNumber: "3/5",
      href: "/onboarding/farming-system",
      title: "Farming System & Energy",
      desc: "Produce & livestock, cultivation methods (drip, greenhouse), mechanization, and solar pumping.",
      icon: "nutrition",
      isDone: isSysDone,
    },
    {
      step: 4,
      stageNumber: "4/5",
      href: "/onboarding/business-experience",
      title: "Business & Sales Experience",
      desc: "Commercial track record, annual revenue bracket, record-keeping method, and produce buyers.",
      icon: "storefront",
      isDone: isBizDone,
    },
    {
      step: 5,
      stageNumber: "5/5",
      href: "/onboarding/household-labour",
      title: "Household & Labour",
      desc: "Permanent workforce, seasonal harvest hands, operational leadership model, and fair employment.",
      icon: "group",
      isDone: isLabDone,
    },
  ];

  const nextInitialStepHref = !isStep1Done ? "/onboarding/step-1"
    : !isStep2Done ? "/onboarding/step-2"
    : !isStep3Done ? "/onboarding/step-3"
    : !isStep4Done ? "/onboarding/step-4"
    : "/onboarding/step-5";

  const nextAdditionalStepHref = !isLocDone ? "/onboarding/location"
    : !isCharDone ? "/onboarding/characteristics"
    : !isSysDone ? "/onboarding/farming-system"
    : !isBizDone ? "/onboarding/business-experience"
    : !isLabDone ? "/onboarding/household-labour"
    : "/assessment";

  const farmSize = user?.farmCharacteristics?.farmSize || 12.5;
  const farmUnit = user?.farmCharacteristics?.farmUnit || "Acres";
  const cultivatedAcres = user?.farmCharacteristics?.cultivatedAcres || 8.0;
  const grazingAcres = user?.farmCharacteristics?.grazingAcres || 4.5;
  const locationText = user?.farmLocation?.locationSearch || "Naivasha, Nakuru County";
  const farmId =
    (user as any)?.futureFarmId ||
    (user?.id ? `FFF-KE-PROD-${user.id.slice(-4).toUpperCase()}` : "FFF-KE-PROD");
  const waterSupplyText = user?.farmingSystem?.waterSource || "Reliable Solar Borehole";
  const overallPercentage = assessmentResult?.overallFfmiScore ?? 67;
  const ffmiScore24 = Math.round((overallPercentage / 100) * 24) || 16;
  const maturityTier = getMaturityTier(overallPercentage);

  return (
    <AppShell userName={userName} userRole={userRole}>
      <div className="px-4 md:px-10 py-6 max-w-[1280px] mx-auto w-full pb-20">
        {/* Onboarding State Status (Only shown when onboarding is NOT yet completed) */}
        {onboardingStage !== "FULLY_COMPLETED" && (
          <div className="flex items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-on-surface-variant">Onboarding State:</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                {onboardingStage === "ADDITIONAL_COMPLETED"
                  ? "Farm Profile Pending Confirmation"
                  : onboardingStage === "INITIAL_COMPLETED"
                  ? "Additional Sections In Progress"
                  : "Initial Profiling In Progress"}
              </span>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STAGE 4: FULLY COMPLETED -> RENDER COMPLETED MY FARM PROFILE
            ───────────────────────────────────────────────────────────── */}
        {onboardingStage === "FULLY_COMPLETED" ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Onboarding Completion Notice Banner & Next Steps CTA */}
            <div className="p-5 md:p-6 rounded-2xl bg-primary/10 border border-primary/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">task_alt</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-wider">
                      Onboarding Completed
                    </span>
                    <span className="text-xs font-medium text-primary">
                      • 2 of 2 Surveys Verified &amp; Saved
                    </span>
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-on-surface">
                    Onboarding Complete! Your Verified Farm Baseline is Ready.
                  </h2>
                  <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                    You have submitted both onboarding surveys. The critical next step is to take your <strong>8-Pillar Farm Assessment</strong> to benchmark all 40 capabilities, verify your FFMI score, and access customized opportunities.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0 self-stretch md:self-auto justify-end">
                <Link
                  href="/assessment"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white hover:bg-primary-container font-semibold text-xs md:text-sm transition-all shadow-sm hover:shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">fact_check</span>
                  <span>Take Farm Assessment</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-surface-container-high">
              <div className="flex flex-col gap-1.5">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  My Farm Profile
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Overview of your verified farm details, crops, and support.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <Link
                  href="/assessment"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all shadow-sm hover:shadow-md font-label-sm text-label-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">fact_check</span>
                  <span>Take Farm Assessment</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high hover:bg-surface-container text-on-surface transition-all shadow-sm hover:shadow-md font-label-sm text-label-sm font-semibold cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">download</span>
                  <span>Download Summary (PDF)</span>
                </button>
              </div>
            </div>

            {/* Top Farmer Identity Banner */}
            <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-surface-container-high/60">
              <div className="flex items-center gap-4">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-primary-container/15 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px] sm:text-[32px]">person</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-title-md text-title-md text-on-surface font-bold text-lg sm:text-[22px]">
                      {userName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container/10 text-primary text-xs font-semibold">
                      {userRole}
                    </span>
                  </div>
                  <span className="text-on-surface-variant text-label-sm mt-0.5">
                    {locationText}
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-secondary-fixed/40 text-on-secondary-fixed text-xs font-mono font-bold">
                      Unified Farm ID: {farmId}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-label-sm text-on-surface w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-surface-container-high/60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">phone_iphone</span>
                  <div>
                    <span className="text-xs text-on-surface-variant block">Phone Number</span>
                    <span className="font-semibold">{user?.phone || "+254 712 345 678"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">landscape</span>
                  <div>
                    <span className="text-xs text-on-surface-variant block">Total Land Size</span>
                    <span className="font-semibold">{farmSize} {farmUnit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">water_drop</span>
                  <div>
                    <span className="text-xs text-on-surface-variant block">Water Supply</span>
                    <span className="font-semibold text-primary">{waterSupplyText}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main 2-Column Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Land, Crops, Markets (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Card 1: What You Grow & Produce */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/60">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">agriculture</span>
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                        What You Grow &amp; Produce
                      </h3>
                      <p className="font-label-sm text-xs text-on-surface-variant">
                        Your ongoing crop farming and dairy livestock
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {/* Produce Item 1 */}
                    <div className="p-4 rounded-xl bg-surface-container-low flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary mt-0.5">
                          <span className="material-symbols-outlined text-[20px]">spa</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                            Vegetables &amp; Horticulture
                          </span>
                          <span className="font-label-sm text-xs text-on-surface-variant mt-0.5">
                            Export French Beans &amp; determinate field tomatoes
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-surface-container-highest text-on-surface font-label-sm text-xs font-bold shrink-0">
                        5.5 Acres
                      </span>
                    </div>
                    {/* Produce Item 2 */}
                    <div className="p-4 rounded-xl bg-surface-container-low flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary mt-0.5">
                          <span className="material-symbols-outlined text-[20px]">grain</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                            Maize &amp; Rhodes Grass
                          </span>
                          <span className="font-label-sm text-xs text-on-surface-variant mt-0.5">
                            Dual-season grain and dairy animal fodder
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-surface-container-highest text-on-surface font-label-sm text-xs font-bold shrink-0">
                        2.5 Acres
                      </span>
                    </div>
                    {/* Produce Item 3 */}
                    <div className="p-4 rounded-xl bg-surface-container-low flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary mt-0.5">
                          <span className="material-symbols-outlined text-[20px]">pets</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                            Dairy Cows
                          </span>
                          <span className="font-label-sm text-xs text-on-surface-variant mt-0.5">
                            4 Friesian cows producing an average of ~62 Litres/day
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container font-label-sm text-xs font-bold shrink-0">
                        4 Head
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Land & Water Setup */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/60">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">water_drop</span>
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                        Land &amp; Water
                      </h3>
                      <p className="font-label-sm text-xs text-on-surface-variant">
                        Total acreage and irrigation status
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1">
                      <span className="text-xs text-on-surface-variant uppercase font-semibold">
                        Total Land Use
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                          {farmSize}
                        </span>
                        <span className="text-label-sm text-on-surface-variant">
                          Gross {farmUnit}
                        </span>
                      </div>
                      <div className="mt-3 pt-2 flex flex-col gap-1.5 text-xs text-on-surface-variant border-t border-surface-container-high/60">
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> Cultivated Crops
                          </span>
                          <span className="font-semibold text-on-surface">
                            {cultivatedAcres} {farmUnit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span> Pasture &amp; Resting
                          </span>
                          <span className="font-semibold text-on-surface">
                            {grazingAcres} {farmUnit}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-on-surface-variant uppercase font-semibold">
                          Water Source
                        </span>
                        <span className="font-title-md text-title-md text-on-surface font-bold mt-1">
                          Solar Borehole &amp; Rain Dam
                        </span>
                        <p className="text-xs text-on-surface-variant mt-1">
                          15,000 Litres storage tank with pressurized drip lines installed across crop fields.
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-container/15 text-primary text-xs font-semibold">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Reliable Year-Round
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Future Farm Maturity Index & Support (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* SECTION: Future Farm Maturity Index FFMI/24 (Replaces Farm Location & Map from My Farm Dashboard) */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/60 h-full flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-container opacity-10 rounded-full blur-2xl group-hover:bg-primary transition-colors duration-500 pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                        Future Farm Maturity Index
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary text-xs font-bold uppercase tracking-wider font-mono">
                        FFMI/24
                      </span>
                    </div>
                    <p className="font-label-sm text-xs text-on-surface-variant mb-6">
                      Composite diagnostic score across all 8 capability pillars
                    </p>

                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="font-display-lg text-display-lg text-on-surface font-extrabold text-[44px] leading-tight">
                        {ffmiScore24}
                      </span>
                      <span className="font-title-md text-title-md text-on-surface-variant font-bold">
                        /24
                      </span>
                    </div>

                    <div className="mb-6">
                      <p className="font-label-sm text-xs text-on-surface-variant mb-2 font-medium">
                        Classification
                      </p>
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-sm font-semibold">
                        <span className="material-symbols-outlined text-[18px] mr-1.5">
                          verified
                        </span>
                        {maturityTier.label || "Structured Farm"}
                      </span>
                    </div>

                    <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed text-sm">
                      You are on the right track! Keep improving your capabilities to become a Future-Ready Farm.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-2">
                    <Link
                      href="/assessment"
                      className="w-full py-3 px-4 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-label-sm text-sm transition-all flex justify-center items-center gap-2 cursor-pointer font-semibold shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        fact_check
                      </span>
                      <span>Take 8-Pillar Assessment</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowProgressModal(true)}
                      className="w-full py-3 px-4 border border-outline rounded-xl text-primary font-label-sm text-sm hover:bg-surface-container transition-colors flex justify-center items-center gap-2 cursor-pointer font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        trending_up
                      </span>
                      View Progress Over Time
                    </button>
                    <Link
                      href="/dashboard"
                      className="w-full py-2 px-4 text-center text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Open My Farm Dashboard</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </Link>
                  </div>
                </div>

                {/* Quick Help & Support Link */}
                <div className="p-4 rounded-2xl bg-surface-container flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0">
                      <span className="material-symbols-outlined text-[20px]">support_agent</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-sm font-semibold text-on-surface">
                        Need help with your farm profile?
                      </span>
                      <span className="font-label-sm text-xs text-on-surface-variant">
                        Our agritech support team is available Mon–Sat.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/contact")}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors shadow-sm shrink-0 cursor-pointer"
                    type="button"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Over Time Modal */}
            {showProgressModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-outline-variant animate-fade-in-up">
                  <div className="flex justify-between items-center mb-4 border-b border-surface-variant pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-2xl">trending_up</span>
                      <h3 className="text-lg font-bold text-on-surface">Maturity Progress Over Time</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowProgressModal(false)}
                      className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                    Track your farm&apos;s capability index growth across quarterly diagnostic reviews.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                      <div>
                        <span className="text-xs font-bold text-on-surface block">Q4 2024 • Initial Baseline</span>
                        <span className="text-[11px] text-on-surface-variant">Stage: Emerging Farm</span>
                      </div>
                      <span className="text-sm font-extrabold text-on-surface-variant">11 / 24</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                      <div>
                        <span className="text-xs font-bold text-on-surface block">Q1 2025 • Post Soil &amp; Water Audit</span>
                        <span className="text-[11px] text-on-surface-variant">Stage: Developing Farm</span>
                      </div>
                      <span className="text-sm font-extrabold text-on-surface-variant">14 / 24</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/30">
                      <div>
                        <span className="text-xs font-bold text-primary block">Q2 2025 (Current) • Structured Audit</span>
                        <span className="text-[11px] text-primary/80">Stage: Structured Farm</span>
                      </div>
                      <span className="text-base font-black text-primary">{ffmiScore24} / 24</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-dashed border-outline-variant">
                      <div>
                        <span className="text-xs font-bold text-on-surface-variant block">Q3 2025 (Target Projection)</span>
                        <span className="text-[11px] text-on-surface-variant">Target: Future-Ready Farm</span>
                      </div>
                      <span className="text-sm font-bold text-secondary">19 / 24</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-surface-variant">
                    <Link
                      href="/assessment"
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors inline-flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">fact_check</span>
                      <span>Run Full Audit</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowProgressModal(false)}
                      className="px-5 py-2.5 rounded-xl border border-surface-container-high bg-surface text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : onboardingStage === "ADDITIONAL_COMPLETED" ? (
          /* ─────────────────────────────────────────────────────────────
              STAGE 3: ALL QUESTIONS ANSWERED -> REVIEW FARM PROFILE
              ───────────────────────────────────────────────────────────── */
          <div className="space-y-8 animate-fadeIn">
            <section className="bg-surface-container-lowest rounded-3xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-primary/30">
              <div className="flex-1 z-10 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-[15px]">task_alt</span>
                  <span>All 10 Modules Complete</span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
                  All onboarding sections completed!
                </h1>
                <p className="text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed">
                  Your responses have established your farm baseline. Directly take your <strong>Farm Assessment</strong> to benchmark all 40 capabilities and unlock customized growth opportunities.
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href="/assessment"
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs md:text-sm shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <span>Take Farm Assessment</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                  <Link
                    href="/onboarding/farm-profile"
                    className="px-4 py-2.5 rounded-xl border border-surface-container-high bg-surface hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
                  >
                    View Farm Profile
                  </Link>
                </div>
              </div>

              <div className="w-full md:w-[320px] h-[200px] relative z-10 shrink-0">
                <img
                  alt="Farm Setup"
                  className="w-full h-full object-cover rounded-2xl shadow-md border border-surface-variant/30"
                  src="/images/smart-farm-landscape.jpg"
                />
              </div>
            </section>

            {/* Overview of the 5 additional modules */}
            <div className="space-y-4">
              <h2 className="text-base md:text-lg font-bold text-on-surface">Additional Farm Sections (Verified)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {additionalCards.map((card, idx) => (
                  <Link
                    key={idx}
                    href={card.href}
                    className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-primary/20 hover:border-primary transition-all flex flex-col h-full group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">check</span>
                        Done
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{card.title}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-auto">{card.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : onboardingStage === "INITIAL_COMPLETED" ? (
          /* ─────────────────────────────────────────────────────────────
              STAGE 2: INITIAL COMPLETE -> "Complete Your Farm Profile"
              Clean, concise, and properly aligned
              ───────────────────────────────────────────────────────────── */
          <div className="space-y-8 animate-fadeIn">
            {/* Dynamic Hero Section - Guiding User to Take Second Onboarding Survey */}
            <section className="bg-surface-container-lowest rounded-3xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-secondary-container">
              <div className="absolute top-0 right-0 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex-1 z-10 space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span>Survey 1 Complete (5/5) • Step 2 of 2: Second Onboarding Survey</span>
                </div>

                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
                  Take Your Second Onboarding Survey
                </h1>
                <h2 className="text-xs md:text-sm font-semibold text-primary">
                  Farm Systems &amp; Operations Deep Dive
                </h2>

                <p className="text-xs md:text-sm text-on-surface-variant max-w-lg leading-relaxed">
                  You have completed the initial questionnaire! Now complete the <strong>second onboarding survey</strong> below (Location, Characteristics, Farming System, Business Experience, and Household &amp; Labour) to establish your farm baseline and unlock your <strong>Farm Assessment</strong>.
                </p>

                {/* Progress Card */}
                <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container-high max-w-md shadow-xs mt-3">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h3 className="font-semibold text-xs text-on-surface mb-0.5">
                        <Link
                          href={nextAdditionalStepHref}
                          className="text-primary hover:underline inline-flex items-center gap-1 font-bold"
                        >
                          <span>{additionalDoneCount === 0 ? "Start Second Onboarding Survey" : "Continue Second Onboarding Survey"}</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </Link>
                      </h3>
                      <p className="text-[11px] text-on-surface-variant">
                        {additionalDoneCount} of {additionalTotal} second survey sections completed
                      </p>
                    </div>
                    <span className="text-base text-primary font-bold">{additionalPercent}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${additionalPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={nextAdditionalStepHref}
                    className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all inline-flex items-center gap-1.5 btn-shadow hover-lift"
                  >
                    <span>{additionalDoneCount === 0 ? "Start Second Onboarding Survey" : "Continue Second Onboarding Survey"}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Landscape Image */}
              <div className="w-full md:w-[320px] h-[200px] md:h-[220px] relative z-10 shrink-0">
                <img
                  alt="Irrigation & Telemetry"
                  className="w-full h-full object-cover rounded-2xl shadow-md border border-surface-variant/30"
                  src="/images/irrigation-telemetry.jpg"
                />
              </div>
            </section>

            {/* Additional Sections Grid */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-on-surface">
                    Second Onboarding Survey Sections
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Complete all 5 sections below to generate your verified Farm Profile and unlock your Farm Assessment.
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Step 2 of 2: Farm Profile Survey
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {additionalCards.map((card, idx) => {
                  const isDone = card.isDone;
                  return (
                    <Link
                      key={idx}
                      href={card.href}
                      className={`bg-surface-container-lowest rounded-2xl p-5 shadow-xs border transition-all hover:shadow-md flex flex-col h-full group ${
                        isDone
                          ? "border-primary/30 hover:border-primary"
                          : "border-surface-container-high hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                            isDone ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isDone
                              ? "bg-primary/10 text-primary flex items-center gap-1"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          {isDone && <span className="material-symbols-outlined text-[13px]">check</span>}
                          {isDone ? "Completed" : `Section ${card.stageNumber}`}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{card.title}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mt-auto">{card.desc}</p>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Assessment Locked Notice */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Navigation &amp; Assessment Hub Locked</h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Attempting to visit other pages will redirect you back here until you complete the second onboarding survey and verify your Farm Profile.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0">
                Step 2 In Progress
              </span>
            </div>
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────
              STAGE 1: INITIAL ONBOARDING IN PROGRESS (STEPS 1 - 5)
              Exact wording matching design & informed of second onboarding
              ───────────────────────────────────────────────────────────── */
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Section */}
            <section className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-surface-container-high">
              {/* Background Decorative Blob */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

              <div className="flex-1 z-10">
                <h1 className="text-[28px] leading-9 md:text-3xl lg:text-4xl md:leading-tight font-bold text-on-surface mb-2 tracking-tight">
                  Welcome to Future Farms!
                </h1>
                <h2 className="text-base md:text-lg font-semibold text-primary mb-2">
                  Your journey to a future-ready farm starts here.
                </h2>
                <p className="text-sm md:text-base text-on-surface-variant mb-6 max-w-lg leading-relaxed">
                  Build your farm profile, assess your capabilities, identify development priorities, verify your progress, and access opportunities to grow.
                </p>

                <div className="bg-surface rounded-xl p-5 border border-surface-container-high max-w-md shadow-xs">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h3 className="font-semibold text-xs md:text-sm text-on-surface mb-0.5">
                        <Link
                          href={nextInitialStepHref}
                          className="text-primary hover:underline inline-flex items-center gap-1 font-bold"
                        >
                          <span>Complete Onboarding Survey (For Shambany)</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        {initialDoneCount} of {initialTotal} sections completed
                      </p>
                    </div>
                    <span className="text-xl text-primary font-bold">{initialPercent}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2.5 mt-3 overflow-hidden">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${initialPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="w-full md:w-[380px] h-[240px] md:h-[280px] relative z-10 shrink-0">
                <img
                  alt="Future Farms Agriculture"
                  className="w-full h-full object-cover rounded-2xl shadow-sm border border-surface-container-high/60"
                  src="/images/sustainable-farmer.jpg"
                />
              </div>
            </section>

            {/* Notice Informing Farmer About Second Onboarding & Assessment */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">info</span>
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-on-surface">
                    Two-Stage Onboarding Notice
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                    Please finish this initial questionnaire and the <strong>second onboarding section</strong> (Farm Location, Characteristics, Farming System, Business Experience, and Household &amp; Labour) to confirm your Farm Profile and access your <strong>Farm Assessment</strong>.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
                Step 1 of 2
              </span>
            </div>

            {/* Questionnaire Grid */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h2 className="text-lg md:text-xl font-bold text-on-surface tracking-tight">
                  Tell us about yourself &amp; your farm
                </h2>
                <span className="text-xs font-semibold text-on-surface-variant">
                  {initialDoneCount} of {initialTotal} Completed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {initialCards.map((card) => {
                  const isDone = card.isDone;
                  return (
                    <Link
                      key={card.step}
                      href={card.href}
                      className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-surface-container-high hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isDone
                              ? "bg-primary text-white"
                              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
                        </div>
                        {isDone ? (
                          <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                        ) : (
                          <span className="material-symbols-outlined text-outline text-xl">radio_button_unchecked</span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mt-auto">
                        {card.desc}
                      </p>
                    </Link>
                  );
                })}
              </div>

              {/* Continue to My Assessment (locked status explaining second onboarding required) */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-surface-container-high/60">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-outline text-[18px]">lock</span>
                  <span>Finish initial &amp; second onboarding sections to unlock My Assessment.</span>
                </div>

                <button
                  type="button"
                  disabled
                  className="bg-surface-container-high text-on-surface-variant/60 text-xs md:text-sm font-semibold px-6 py-3 rounded-xl flex items-center gap-2 cursor-not-allowed opacity-80"
                  title="Finish the initial and second onboarding sections to unlock your assessment"
                >
                  <span>Continue to My Assessment</span>
                  <span className="material-symbols-outlined text-sm">lock</span>
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </AppShell>
  );
}
