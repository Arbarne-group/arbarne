
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const [heroImage, setHeroImage] = useState(0);

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



  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [onboardingStage, setOnboardingStage] =
    useState<string>("INITIAL_IN_PROGRESS");

  const [assessmentResult, setAssessmentResult] =
    useState<OverallAssessmentResult | null>(null);



  const [showProgressModal, setShowProgressModal] = useState(false);



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

  const profileApproved = Boolean(user?.onboardingStatus?.profileApproved);

  const fetchStatus = () => {
    let email =
      clerkUser?.primaryEmailAddress?.emailAddress || getActiveUserEmail();
    const cached = localStorage.getItem("future_farms_user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        if (u.email && !email) email = u.email;
        setUser(u);
        const st = computeOnboardingStageFromUser(u);
        setOnboardingStage(st.stage);
      } catch (e) { }
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
          localStorage.setItem(
            "future_farms_user",
            JSON.stringify({ ...data.user, stage: st.stage }),
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImage((current) => (current === heroImages.length - 1 ? 0 : current + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchStatus();

    const email =
      clerkUser?.primaryEmailAddress?.emailAddress || getActiveUserEmail();
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
                setAssessmentResult(
                  computeAssessmentResults(JSON.parse(saved)),
                );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkUser]);

  const userName = user?.name || clerkUser?.fullName || "Farmer";
  const userRole = user?.farmerProfile?.jobTitle || "Farm Owner";



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



  const nextInitialStepHref = !isStep1Done
    ? "/onboarding/step-1"
    : !isStep2Done
      ? "/onboarding/step-2"
      : !isStep3Done
        ? "/onboarding/step-3"
        : !isStep4Done
          ? "/onboarding/step-4"
          : "/onboarding/step-5";



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
            : "/assessment";


  const farmId =
    user?.futureFarmId ||
    (user?.id
      ? `FFF-KE-PROD-${user.id
        .slice(-4)
        .toUpperCase()}`
      : "FFF-KE-PROD");



  const overallPercentage =
    assessmentResult?.overallFfmiScore ?? 0;

  const ffmiScore24 = Math.round(
    (overallPercentage / 100) * 24,
  );

  const maturityTier =
    getMaturityTier(overallPercentage);


  const showFarmProfile =
    initialSurveyComplete &&
    farmProfileSurveyComplete;



  return (
    <AppShell
      userName={userName}
      userRole={userRole}
    >
      <div className="px-4 md:px-10 py-6 max-w-[1280px] mx-auto w-full pb-20">


        {showFarmProfile ? (
          <div className="space-y-8 animate-fadeIn">

            {/* Header Section */}
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

                  <span>
                    Take Farm Assessment
                  </span>

                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>

              </div>
            </div>

            <FarmProfileMetadata

            />

            {/* Progress Over Time Modal */}
            {showProgressModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

                <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-outline-variant animate-fade-in-up">

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
                      className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined">
                        close
                      </span>
                    </button>

                  </div>

                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                    Track your farm&apos;s capability index growth across
                    quarterly diagnostic reviews.
                  </p>

                  <div className="space-y-4 mb-6">

                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/10 border border-secondary/30">

                      <div>

                        <span className="text-sm font-bold text-secondary block">
                          Current Score
                        </span>

                        <span className="text-[11px] text-secondary/80">
                          Stage:{" "}
                          {assessmentResult
                            ? maturityTier.label ||
                            "Structured Farm"
                            : "Not assessed yet"}
                        </span>

                      </div>

                      <span className="text-base font-black text-secondary">
                        {assessmentResult
                          ? `${ffmiScore24} / 24`
                          : "— / 24"}
                      </span>

                    </div>

                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-surface-variant">

                    <Link
                      href="/assessment"
                      className="px-4 py-2 rounded-xl bg-secondary text-white text-sm font-bold hover:bg-secondary-container transition-colors inline-flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        fact_check
                      </span>

                      <span>
                        Run Full Audit
                      </span>
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



            <section className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-surface-container-high">

              {/* Background Decorative Blob */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

              <div className="flex-1 z-10">

                <h1 className="text-[28px] leading-9 md:text-3xl lg:text-4xl md:leading-tight font-bold text-primary mb-2 tracking-tight">
                  Welcome to Future Farms!
                </h1>

                <h2 className="text-base md:text-lg font-semibold text-on-surface mb-2">
                  Your journey to a future-ready farm starts here.
                </h2>

                <p className="text-md md:text-base text-on-surface-variant mb-6 max-w-lg leading-relaxed">
                  Build your farm profile, assess your capabilities, identify
                  development priorities, verify your progress, and access
                  opportunities to grow.
                </p>

               

                {initialSurveyComplete ? (

                  /* SURVEY 1 COMPLETE */
                  <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container-high max-w-md shadow-xs mt-3">

                    <div className="flex justify-between items-end mb-2">

                      <div>

                        <h3 className="font-semibold text-sm text-on-surface mb-0.5">

                          <Link
                            href={nextAdditionalStepHref}
                            className="text-primary hover:underline inline-flex items-center gap-1 font-bold"
                          >
                            <span>
                              {additionalDoneCount === 0
                                ? "Create farm profile"
                                : "Complete farm profile"}
                            </span>

                            <ArrowRight className="text-[15px]" />
                          </Link>

                        </h3>
                        <p className="text-sm text-on-surface-variant">
                          {initialDoneCount} of {initialTotal} sections completed
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

                  /* SURVEY 1 IN PROGRESS */
                  <div className="bg-surface rounded-xl p-5 border border-surface-container-high max-w-md shadow-xs">

                    <div className="flex justify-between items-end mb-2">

                      <div>

                        <h3 className="font-semibold text-sm md:text-md text-on-surface mb-0.5">

                          <Link
                            href={nextInitialStepHref}
                            className="text-secondary hover:underline inline-flex items-center gap-1 font-bold"
                          >
                            <span>
                              Complete Onboarding Survey (For Shambany)
                            </span>

                            <span className="material-symbols-outlined text-md">
                              arrow_forward
                            </span>
                          </Link>

                        </h3>

                        <p className="text-sm text-on-surface-variant">
                          {initialDoneCount} of {initialTotal} sections completed
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

              
              <div className="w-full md:w-150 h-70 md:h-70 relative z-10 shrink-0 group">

                {/* Images */}
                <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-sm border border-surface-container-high/60">

                  {heroImages.map((image, index) => (
                    <img
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${heroImage === index
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
                        className={`h-1.5 rounded-full transition-all duration-300 ${heroImage === index
                            ? "w-6 bg-white"
                            : "w-1.5 bg-white/60 hover:bg-white/90"
                          }`}
                      />
                    ))}

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                SINGLE FARM PROFILE CARD SECTION
            ================================================== */}

            <section className="space-y-4">

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">

                <h2 className="text-lg md:text-xl font-bold text-on-surface tracking-tight">
                  Tell us about yourself &amp; your farm
                </h2>

              </div>

              {/* =================================================
                  ONE INSTANCE OF THE CARDS
              ================================================== */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {additionalCards.map((card, idx) => {

                  const isDone = card.isDone;

                  const cardClassName = `bg-surface-container-lowest rounded-2xl p-5 shadow-xs border transition-all hover:shadow-md flex flex-col h-full group ${isDone
                      ? "border-secondary/30 hover:border-secondary"
                      : "border-surface-container-high hover:border-secondary/40"
                    }`;

                  const cardContent = (
                    <>
                      <div className="flex items-start justify-between mb-3">

                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${isDone
                              ? "bg-secondary text-white"
                              : "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white"
                            }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {card.icon}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${isDone
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
                   * IMPORTANT:
                   *
                   * Survey 1 incomplete:
                   * render a DIV instead of a Link.
                   *
                   * Survey 1 complete:
                   * render the normal Link.
                   *
                   * The visual markup/classes remain the same.
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

          </div>
        )}

      </div>
    </AppShell>
  );
}