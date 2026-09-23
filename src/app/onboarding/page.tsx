

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import AppShell from "@/components/layout/AppShell";
import FarmProfileMetadata from "@/components/FarmProfile";

import {
  computeOnboardingStageFromUser,
  getActiveUserEmail,
} from "@/lib/onboardingGuard";

import {
  computeAssessmentResults,
  getMaturityTier,
  OverallAssessmentResult,
} from "@/lib/assessmentScoring";

import { ArrowRight } from "lucide-react";

export default function OnboardingOverviewPage() {
  const { user: clerkUser } = useUser();

  const [heroImage, setHeroImage] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [onboardingStage, setOnboardingStage] = useState<string>(
    "INITIAL_IN_PROGRESS",
  );

  const [assessmentResult, setAssessmentResult] =
    useState<OverallAssessmentResult | null>(null);

  // IMPORTANT:
  // This is separate from assessmentResult because
  // computeAssessmentResults({}) can still return a result.
  const [hasAssessmentHistory, setHasAssessmentHistory] = useState(false);

  const [showProgressModal, setShowProgressModal] = useState(false);

  

  const heroImages = [
    {
      src: "/photo13.png",
      alt: "Future Farms Agriculture",
    },
    {
      src: "/photo12.png",
      alt: "Future-ready farming",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImage((current) =>
        current === heroImages.length - 1 ? 0 : current + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // SURVEY 1 — INITIAL ONBOARDING
  // ============================================================

  const isStep1Done = Boolean(user?.farmerProfile?.jobTitle);

  const isStep2Done = Boolean(user?.farmManagement?.mgmtAbility);

  const isStep3Done = Boolean(user?.operatingStyle?.decisionStyle);

  const isStep4Done = Boolean(
    user?.aspiration?.fmResponsibility ||
      user?.aspiration?.twelveMonthSuccess,
  );

  const isStep5Done = Boolean(
    user?.digitalPlatform?.remoteComfort ||
      user?.digitalPlatform?.supportReasons,
  );

  const initialDoneCount = [
    isStep1Done,
    isStep2Done,
    isStep3Done,
    isStep4Done,
    isStep5Done,
  ].filter(Boolean).length;

  const initialTotal = 5;

  const initialPercent = Math.round(
    (initialDoneCount / initialTotal) * 100,
  );

  const initialSurveyComplete =
    initialDoneCount === initialTotal;

  // ============================================================
  // SURVEY 2 — FARM PROFILE
  // ============================================================

  const isLocDone = Boolean(user?.farmLocation);

  const isCharDone = Boolean(user?.farmCharacteristics);

  const isSysDone = Boolean(user?.farmingSystem);

  const isBizDone = Boolean(user?.businessExperience);

  const isLabDone = Boolean(user?.householdLabour);

  const additionalDoneCount = [
    isLocDone,
    isCharDone,
    isSysDone,
    isBizDone,
    isLabDone,
  ].filter(Boolean).length;

  const additionalTotal = 5;

  const additionalPercent = Math.round(
    (additionalDoneCount / additionalTotal) * 100,
  );

  const farmProfileSurveyComplete =
    additionalDoneCount === additionalTotal;

  // ============================================================
  // FETCH USER / ONBOARDING STATUS
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const fetchStatus = async () => {
      try {
        let email =
          clerkUser?.primaryEmailAddress?.emailAddress ||
          getActiveUserEmail();

        // --------------------------------------------------------
        // Load cached user first
        // --------------------------------------------------------

        const cached = localStorage.getItem("future_farms_user");

        if (cached) {
          try {
            const cachedUser = JSON.parse(cached);

            if (cachedUser?.email && !email) {
              email = cachedUser.email;
            }

            if (!cancelled) {
              setUser(cachedUser);

              const stage =
                computeOnboardingStageFromUser(cachedUser);

              setOnboardingStage(stage.stage);
            }
          } catch {
            // Ignore invalid cached data
          }
        }

        if (!email) {
          if (!cancelled) {
            setLoading(false);
          }

          return;
        }

        

        const response = await fetch(
          `/api/onboarding/step?email=${encodeURIComponent(email)}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch onboarding status: ${response.status}`,
          );
        }

        const data = await response.json();

        if (data?.user && !cancelled) {
          const latestUser = data.user;

          setUser(latestUser);

          const stage =
            computeOnboardingStageFromUser(latestUser);

          setOnboardingStage(stage.stage);

          localStorage.setItem(
            "future_farms_user",
            JSON.stringify({
              ...latestUser,
              stage: stage.stage,
            }),
          );
        }
      } catch (error) {
        console.error(
          "Failed to load onboarding status:",
          error,
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, [clerkUser]);

  
  useEffect(() => {
    let cancelled = false;

    const fetchAssessment = async () => {
      const email =
        clerkUser?.primaryEmailAddress?.emailAddress ||
        getActiveUserEmail();

      if (!email) {
        if (!cancelled) {
          setAssessmentResult(null);
          setHasAssessmentHistory(false);
        }

        return;
      }

      try {
        const response = await fetch(
          `/api/assessment/responses?email=${encodeURIComponent(email)}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch assessment: ${response.status}`,
          );
        }

        const data = await response.json();

        // --------------------------------------------------------
        // API assessment answers
        // --------------------------------------------------------

        if (
          data?.answers &&
          typeof data.answers === "object" &&
          Object.keys(data.answers).length > 0
        ) {
          if (!cancelled) {
            setHasAssessmentHistory(true);

            setAssessmentResult(
              computeAssessmentResults(data.answers),
            );
          }

          return;
        }

        // --------------------------------------------------------
        // Fallback to local assessment answers
        // --------------------------------------------------------

        try {
          const savedAnswers = localStorage.getItem(
            "future_farms_all_answers",
          );

          if (savedAnswers) {
            const parsedAnswers = JSON.parse(savedAnswers);

            if (
              parsedAnswers &&
              typeof parsedAnswers === "object" &&
              Object.keys(parsedAnswers).length > 0
            ) {
              if (!cancelled) {
                setHasAssessmentHistory(true);

                setAssessmentResult(
                  computeAssessmentResults(parsedAnswers),
                );
              }

              return;
            }
          }
        } catch (localStorageError) {
          console.error(
            "Failed to read local assessment answers:",
            localStorageError,
          );
        }

        // --------------------------------------------------------
        // No assessment exists
        // --------------------------------------------------------

        if (!cancelled) {
          setHasAssessmentHistory(false);
          setAssessmentResult(null);
        }
      } catch (error) {
        console.error(
          "Failed to load assessment history:",
          error,
        );

        // Try local storage even if API failed
        try {
          const savedAnswers = localStorage.getItem(
            "future_farms_all_answers",
          );

          if (savedAnswers) {
            const parsedAnswers = JSON.parse(savedAnswers);

            if (
              parsedAnswers &&
              typeof parsedAnswers === "object" &&
              Object.keys(parsedAnswers).length > 0
            ) {
              if (!cancelled) {
                setHasAssessmentHistory(true);

                setAssessmentResult(
                  computeAssessmentResults(parsedAnswers),
                );
              }

              return;
            }
          }
        } catch {
          // Ignore fallback errors
        }

        if (!cancelled) {
          setHasAssessmentHistory(false);
          setAssessmentResult(null);
        }
      }
    };

    fetchAssessment();

    return () => {
      cancelled = true;
    };
  }, [clerkUser]);

  // ============================================================
  // USER DISPLAY DATA
  // ============================================================

  const userName =
    user?.name ||
    clerkUser?.fullName ||
    clerkUser?.firstName ||
    "Farmer";

  const userRole =
    user?.farmerProfile?.jobTitle ||
    "Farm Owner";

  // ============================================================
  // ADDITIONAL FARM PROFILE CARDS
  // ============================================================

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

  // ============================================================
  // NEXT SURVEY 1 STEP
  // ============================================================

  const nextInitialStepHref = !isStep1Done
    ? "/onboarding/step-1"
    : !isStep2Done
      ? "/onboarding/step-2"
      : !isStep3Done
        ? "/onboarding/step-3"
        : !isStep4Done
          ? "/onboarding/step-4"
          : "/onboarding/step-5";

  // ============================================================
  // NEXT SURVEY 2 STEP
  // ============================================================

  const nextAdditionalStepHref = !isLocDone
    ? "/onboarding/location"
    : !isCharDone
      ? "/onboarding/characteristics"
      : !isSysDone
        ? "/onboarding/farming-system"
        : !isBizDone
          ? "/onboarding/business-experience"
          : !isLabDone
            ? "/onboarding/household-labour"
            : "/onboarding";

  // ============================================================
  // ASSESSMENT SCORE
  // ============================================================

  const overallPercentage =
    assessmentResult?.overallFfmiScore ?? 0;

  const ffmiScore24 = Math.round(
    (overallPercentage / 100) * 24,
  );

  const maturityTier =
    getMaturityTier(overallPercentage);

  // ============================================================
  // COMPLETED FARM PROFILE DISPLAY
  // ============================================================

  const showFarmProfile =
    initialSurveyComplete &&
    farmProfileSurveyComplete;

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading && !user) {
    return (
      <AppShell
        userName={userName}
        userRole={userRole}
      >
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-secondary/30 border-t-secondary animate-spin" />

            <p className="text-sm text-on-surface-variant">
              Loading your farm profile...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  

  return (
    <AppShell
      userName={userName}
      userRole={userRole}
    >
      <div className="px-4 md:px-10 py-6 max-w-[1280px] mx-auto w-full pb-20">

        {/* ======================================================
            COMPLETED FARM PROFILE
        ====================================================== */}

        {showFarmProfile ? (
          <div className="space-y-8 animate-fadeIn">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-surface-container-high">

              <div className="flex flex-col gap-1.5">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  My Farm Profile
                </h1>

                <p className="font-body-md text-body-md text-on-surface-variant">
                  Overview of your farm details.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">

                <Link
                  href="/assessment"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-on-secondary hover:bg-primary-fixed transition-all shadow-sm hover:shadow-md font-label-sm text-label-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    fact_check
                  </span>

                  <span>Take Farm Assessment</span>

                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>

              </div>
            </div>

            {/* Farm Profile */}
            <FarmProfileMetadata />

            {/* ==================================================
                ASSESSMENT SUMMARY
            ================================================== */}

            <section className="bg-surface-container-lowest rounded-2xl border border-surface-container-high p-5 md:p-6 shadow-xs">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-secondary">
                      analytics
                    </span>

                    <h2 className="text-lg font-bold text-on-surface">
                      Farm Assessment
                    </h2>
                  </div>

                  <p className="text-sm text-on-surface-variant">
                    Review your farm capability assessment and
                    track progress over time.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">

                  {hasAssessmentHistory ? (
                    <button
                      type="button"
                      onClick={() =>
                        setShowProgressModal(true)
                      }
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-surface-container-high bg-surface text-on-surface text-sm font-bold hover:bg-surface-container-high transition-colors"
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        trending_up
                      </span>

                      View Progress
                    </button>
                  ) : null}

                  <Link
                    href="/assessment"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-white text-sm font-bold hover:bg-secondary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      fact_check
                    </span>

                    {hasAssessmentHistory
                      ? "Run New Assessment"
                      : "Start Assessment"}
                  </Link>

                </div>

              </div>

              {/* Assessment result */}
              {hasAssessmentHistory && assessmentResult ? (
                <div className="mt-5 pt-5 border-t border-surface-container-high">

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    <div className="rounded-xl bg-surface-container-low p-4">
                      <span className="text-xs text-on-surface-variant block mb-1">
                        FFMI Score
                      </span>

                      <span className="text-2xl font-black text-secondary">
                        {ffmiScore24}/24
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-container-low p-4">
                      <span className="text-xs text-on-surface-variant block mb-1">
                        Capability
                      </span>

                      <span className="text-sm font-bold text-on-surface">
                        {maturityTier.label ||
                          "Assessment completed"}
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-container-low p-4">
                      <span className="text-xs text-on-surface-variant block mb-1">
                        Assessment Status
                      </span>

                      <span className="text-sm font-bold text-secondary">
                        Completed
                      </span>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="mt-5 pt-5 border-t border-surface-container-high">

                  <div className="rounded-xl bg-surface-container-low p-4">

                    <div className="flex items-start gap-3">

                      <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[19px]">
                          fact_check
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-on-surface">
                          Your farm has not been assessed yet
                        </h3>

                        <p className="text-sm text-on-surface-variant mt-1">
                          Complete a farm assessment to understand
                          your current capabilities and identify
                          areas for development.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>
              )}

            </section>

            {/* ==================================================
                PROGRESS MODAL
            ================================================== */}

            {showProgressModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

                <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-outline-variant animate-fade-in-up">

                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-4 border-b border-surface-variant pb-3">

                    <div className="flex items-center gap-2">

                      <span className="material-symbols-outlined text-secondary text-2xl">
                        trending_up
                      </span>

                      <h3 className="text-lg font-bold text-on-surface">
                        Maturity Progress Over Time
                      </h3>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowProgressModal(false)
                      }
                      aria-label="Close progress modal"
                      className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined">
                        close
                      </span>
                    </button>

                  </div>

                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                    Track your farm&apos;s capability index growth
                    across quarterly diagnostic reviews.
                  </p>

                  {/* Current Score */}
                  <div className="space-y-4 mb-6">

                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/10 border border-secondary/30">

                      <div>
                        <span className="text-sm font-bold text-secondary block">
                          Current Score
                        </span>

                        <span className="text-[11px] text-secondary/80">
                          Stage:{" "}
                          {maturityTier.label ||
                            "Structured Farm"}
                        </span>
                      </div>

                      <span className="text-base font-black text-secondary">
                        {ffmiScore24} / 24
                      </span>

                    </div>

                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-between items-center pt-3 border-t border-surface-variant">

                    <Link
                      href="/assessment"
                      className="px-4 py-2 rounded-xl bg-secondary text-white text-sm font-bold hover:bg-secondary-container transition-colors inline-flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        fact_check
                      </span>

                      <span>Run Full Audit</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        setShowProgressModal(false)
                      }
                      className="px-5 py-2.5 rounded-xl border border-surface-container-high bg-surface text-on-surface text-sm font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      Close
                    </button>

                  </div>

                </div>

              </div>
            )}

          </div>
        ) : (

          

          <div className="space-y-8 animate-fadeIn">

            {/* ==================================================
                HERO
            ================================================== */}

            <section className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-surface-container-high">

              {/* Background Decorative Blob */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

              {/* Hero Content */}
              <div className="flex-1 z-10">

                <h1 className="text-[28px] leading-9 md:text-3xl lg:text-4xl md:leading-tight font-bold text-primary mb-2 tracking-tight">
                  Welcome to Future Farms!
                </h1>

                <h2 className="text-base md:text-lg font-semibold text-on-surface mb-2">
                  Your journey to a future-ready farm starts here.
                </h2>

                <p className="text-md md:text-base text-on-surface-variant mb-6 max-w-lg leading-relaxed">
                  Build your farm profile, assess your capabilities,
                  identify development priorities, verify your
                  progress, and access opportunities to grow.
                </p>

                {/* ==================================================
                    SURVEY 1 COMPLETE
                ================================================== */}

                {initialSurveyComplete ? (
                  <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container-high max-w-md shadow-xs mt-3">

                    <div className="flex justify-between items-end mb-2">

                      <div>
                        <h3 className="font-semibold text-sm text-on-surface mb-0.5">

                          <Link
                            href={nextAdditionalStepHref}
                            className="text-primary hover:underline inline-flex items-center gap-1 font-bold"
                          >
                            <span>
                              {farmProfileSurveyComplete
                                ? "Farm profile complete"
                                : additionalDoneCount === 0
                                  ? "Create farm profile"
                                  : "Complete farm profile"}
                            </span>

                            {!farmProfileSurveyComplete && (
                              <ArrowRight className="w-[15px] h-[15px]" />
                            )}
                          </Link>

                        </h3>

                        <p className="text-sm text-on-surface-variant">
                          {additionalDoneCount} of{" "}
                          {additionalTotal} sections completed
                        </p>
                      </div>

                      <span className="text-base text-secondary font-bold">
                        {additionalPercent}%
                      </span>

                    </div>

                    <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">

                      <div
                        className="bg-secondary h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${additionalPercent}%`,
                        }}
                      />

                    </div>

                    
                  </div>
                ) : (

                  /* ==================================================
                     SURVEY 1 IN PROGRESS
                  ================================================== */

                  <div className="bg-surface rounded-xl p-5 border border-surface-container-high max-w-md shadow-xs">

                    <div className="flex justify-between items-end mb-2">

                      <div>
                        <h3 className="font-semibold text-sm md:text-md text-on-surface mb-0.5">

                          <Link
                            href={nextInitialStepHref}
                            className="text-secondary hover:underline inline-flex items-center gap-1 font-bold"
                          >
                            <span>
                              Complete Onboarding Survey
                            </span>

                            <span className="material-symbols-outlined text-md">
                              arrow_forward
                            </span>
                          </Link>

                        </h3>

                        <p className="text-sm text-on-surface-variant">
                          {initialDoneCount} of{" "}
                          {initialTotal} sections completed
                        </p>
                      </div>

                      <span className="text-xl text-secondary font-bold">
                        {initialPercent}%
                      </span>

                    </div>

                    <div className="w-full bg-surface-container-highest rounded-full h-2.5 mt-3 overflow-hidden">

                      <div
                        className="bg-secondary h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${initialPercent}%`,
                        }}
                      />

                    </div>

                    

                  </div>
                )}

              </div>

              {/* ==================================================
                  HERO IMAGE CAROUSEL
              ================================================== */}

              <div className="w-full md:w-[560px] h-70 md:h-70 relative z-10 shrink-0 group">

                <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-sm border border-surface-container-high/60">

                  {heroImages.map((image, index) => (
                    <img
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                        heroImage === index
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  ))}

                  {/* Carousel Indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">

                    {heroImages.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setHeroImage(index)}
                        aria-label={`Go to image ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          heroImage === index
                            ? "w-6 bg-white"
                            : "w-1.5 bg-white/60 hover:bg-white/90"
                        }`}
                      />
                    ))}

                  </div>

                </div>

              </div>

            </section>

            {/* ==================================================
                FARM PROFILE SECTIONS
            ================================================== */}

            <section className="space-y-4">

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">

                <div>
                  <h2 className="text-lg md:text-xl font-bold text-on-surface tracking-tight">
                    Tell us about yourself &amp; your farm
                  </h2>

                  <p className="text-sm text-on-surface-variant mt-1">
                    Complete these sections to build your farm profile.
                  </p>
                </div>

              </div>

              {/* ==================================================
                  SINGLE INSTANCE OF CARDS
              ================================================== */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {additionalCards.map((card, idx) => {
                  const isDone = card.isDone;

                  const cardClassName = `bg-surface-container-lowest rounded-2xl p-5 shadow-xs border transition-all hover:shadow-md flex flex-col h-full group ${
                    isDone
                      ? "border-secondary/30 hover:border-secondary"
                      : "border-surface-container-high hover:border-secondary/40"
                  }`;

                  const cardContent = (
                    <>
                      <div className="flex items-start justify-between mb-3">

                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                            isDone
                              ? "bg-secondary text-white"
                              : "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {card.icon}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isDone
                              ? "bg-secondary/10 text-secondary flex items-center gap-1"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          {isDone && (
                            <span className="material-symbols-outlined text-[13px]">
                              check
                            </span>
                          )}

                          {isDone
                            ? "Completed"
                            : `Section ${card.stageNumber}`}
                        </span>

                      </div>

                      <h3 className="text-md font-bold text-on-surface mb-1 group-hover:text-secondary transition-colors">
                        {card.title}
                      </h3>

                      <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed mt-auto">
                        {card.desc}
                      </p>
                    </>
                  );

                  /*
                   * SURVEY 1 MUST BE COMPLETE BEFORE
                   * FARM PROFILE CARDS BECOME CLICKABLE.
                   */

                  if (!initialSurveyComplete) {
                    return (
                      <div
                        key={idx}
                        className={cardClassName}
                        aria-disabled="true"
                      >
                        {cardContent}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={idx}
                      href={card.href}
                      className={cardClassName}
                    >
                      {cardContent}
                    </Link>
                  );
                })}

              </div>

            </section>

            {/* ==================================================
                ASSESSMENT ACCESS AFTER SURVEY 1
            ================================================== */}

            {initialSurveyComplete && (
              <section className="bg-secondary/5 border border-secondary/20 rounded-2xl p-5 md:p-6">


                


                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  <div className="flex items-start gap-3">

                    <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0">

                      <span className="material-symbols-outlined">
                        fact_check
                      </span>

                    </div>

                    <div>
                      <h2 className="text-base font-bold text-on-surface">
                        Farm assessment is available
                      </h2>

                       <p className="text-md text-on-surface-variant leading-relaxed">
                        Your farm assessment is now available.
                        You can complete your farm profile at your
                        own pace.
                      </p>
                    </div>

                  </div>

                  <Link
                        href="/assessment"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:underline"
                      >
                        Go to Farm Assessment

                        <ArrowRight className="w-4 h-4" />
                      </Link>

                </div>

              </section>
            )}

          </div>
        )}

      </div>
    </AppShell>
  );
}