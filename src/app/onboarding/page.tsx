"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default function OnboardingOverviewPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingStage, setOnboardingStage] = useState<string>("INITIAL_IN_PROGRESS");
  const [resetting, setResetting] = useState(false);

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
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setOnboardingStage(data.stage || "INITIAL_IN_PROGRESS");
          localStorage.setItem("future_farms_user", JSON.stringify(data.user));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleResetOnboarding = async () => {
    if (!confirm("Are you sure you want to reset all onboarding responses to test the flow from scratch?")) return;
    setResetting(true);
    try {
      localStorage.removeItem("future_farms_user");
      await fetch("/api/onboarding/step?email=keziah@futurefarms.africa", {
        method: "DELETE",
      });
      setUser(null);
      setOnboardingStage("INITIAL_IN_PROGRESS");
      fetchStatus();
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  const userName = user?.name || "Keziah Wanjiku";
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
    : "/onboarding/farm-profile";

  const farmSize = user?.farmCharacteristics?.farmSize || 12.5;
  const farmUnit = user?.farmCharacteristics?.farmUnit || "Acres";
  const cultivatedAcres = user?.farmCharacteristics?.cultivatedAcres || 8.0;
  const grazingAcres = user?.farmCharacteristics?.grazingAcres || 4.5;
  const locationText = user?.farmLocation?.locationSearch || "Naivasha, Nakuru County";

  return (
    <AppShell userName={userName} userRole={userRole}>
      <div className="px-4 md:px-10 py-6 max-w-[1280px] mx-auto w-full pb-20">
        {/* Reset / Testing Strip */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-on-surface-variant">Onboarding State:</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
              {onboardingStage === "FULLY_COMPLETED"
                ? "Onboarding Completed"
                : onboardingStage === "ADDITIONAL_COMPLETED"
                ? "Farm Profile Pending Confirmation"
                : onboardingStage === "INITIAL_COMPLETED"
                ? "Additional Sections In Progress"
                : "Initial Profiling In Progress"}
            </span>
          </div>

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
        </div>

        {/* ─────────────────────────────────────────────────────────────
            STAGE 4: FULLY COMPLETED -> RENDER FARM PROFILE (Matches Design)
            ───────────────────────────────────────────────────────────── */}
        {onboardingStage === "FULLY_COMPLETED" ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Section (Title size reduced cleanly) */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-surface-container-high">
              <div className="flex flex-col gap-1.5">
                <h1 className="text-xl md:text-2xl text-on-surface tracking-tight font-bold">
                  My Farm Profile
                </h1>
                <p className="text-xs md:text-sm text-on-surface-variant">
                  Overview of your verified farm details, crops, and support.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alert("Summary PDF downloaded!")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:bg-surface-container text-xs font-semibold text-on-surface transition-all shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Download Summary (PDF)</span>
                </button>
                <Link
                  href="/assessment"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-sm hover:shadow-md text-xs font-semibold"
                >
                  <span>Start Farm Assessment</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Top Farmer Identity Banner */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-surface-container-high/60">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-container/15 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[32px]">person</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg md:text-xl text-on-surface font-bold">{userName}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container/10 text-primary text-xs font-semibold">
                      Farm Owner
                    </span>
                  </div>
                  <span className="text-on-surface-variant text-xs md:text-sm mt-0.5">{locationText}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-on-surface">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">phone_iphone</span>
                  <div>
                    <span className="text-[11px] text-on-surface-variant block">Phone Number</span>
                    <span className="font-semibold">{user?.phone || "+254 712 345 678"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">landscape</span>
                  <div>
                    <span className="text-[11px] text-on-surface-variant block">Total Land Size</span>
                    <span className="font-semibold">{farmSize} {farmUnit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">water_drop</span>
                  <div>
                    <span className="text-[11px] text-on-surface-variant block">Water Supply</span>
                    <span className="font-semibold text-primary">Reliable Solar Borehole</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main 2-Column Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
              {/* Left Column: Land, Crops, Markets (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Card 1: What You Grow & Produce */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/60">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">agriculture</span>
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base text-on-surface font-semibold">What You Grow &amp; Produce</h3>
                      <p className="text-xs text-on-surface-variant">Your ongoing crop farming and dairy livestock</p>
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
                          <span className="text-xs md:text-sm text-on-surface font-semibold">Vegetables &amp; Horticulture</span>
                          <span className="text-xs text-on-surface-variant mt-0.5">Export French Beans &amp; determinate field tomatoes</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-surface-container-highest text-on-surface text-xs font-bold shrink-0">
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
                          <span className="text-xs md:text-sm text-on-surface font-semibold">Maize &amp; Rhodes Grass</span>
                          <span className="text-xs text-on-surface-variant mt-0.5">Dual-season grain and dairy animal fodder</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-surface-container-highest text-on-surface text-xs font-bold shrink-0">
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
                          <span className="text-xs md:text-sm text-on-surface font-semibold">Dairy Cows</span>
                          <span className="text-xs text-on-surface-variant mt-0.5">4 Friesian cows producing an average of ~62 Litres/day</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-bold shrink-0">
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
                      <h3 className="text-sm md:text-base text-on-surface font-semibold">Land &amp; Water</h3>
                      <p className="text-xs text-on-surface-variant">Total acreage and irrigation status</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                    <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1">
                      <span className="text-xs text-on-surface-variant uppercase font-semibold">Total Land Use</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-on-surface">{farmSize}</span>
                        <span className="text-xs text-on-surface-variant">Gross {farmUnit}</span>
                      </div>
                      <div className="mt-3 pt-2 flex flex-col gap-1.5 text-xs text-on-surface-variant border-t border-surface-container-high/60">
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                            Cultivated Crops
                          </span>
                          <span className="font-semibold text-on-surface">{cultivatedAcres} {farmUnit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                            Pasture &amp; Resting
                          </span>
                          <span className="font-semibold text-on-surface">{grazingAcres} {farmUnit}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-on-surface-variant uppercase font-semibold">Water Source</span>
                        <span className="text-sm md:text-base text-on-surface font-bold mt-1">Solar Borehole &amp; Rain Dam</span>
                        <p className="text-xs text-on-surface-variant mt-1">
                          15,000 Litres storage tank with pressurized drip lines installed across crop fields.
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-container/15 text-primary text-xs font-semibold">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Reliable Year-Round
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Location & Support (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Farm Location & Map */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/60 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">distance</span>
                      </div>
                      <div>
                        <h3 className="text-sm md:text-base text-on-surface font-semibold">Farm Location &amp; Map</h3>
                        <p className="text-xs text-on-surface-variant">Naivasha, Nakuru County • Longonot Foothills</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container/10 text-primary text-xs font-semibold shrink-0">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Boundary Verified
                    </span>
                  </div>

                  {/* Styled Vector Map Preview */}
                  <div className="relative w-full h-56 rounded-xl overflow-hidden border border-surface-container-high/60 bg-[#f4f3f0] shadow-inner select-none">
                    <svg className="w-full h-full object-cover" viewBox="0 0 460 224" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="ov-pin-shadow" x="-30%" y="-30%" width="160%" height="160%">
                          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.35" />
                        </filter>
                        <filter id="ov-pill-shadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.2" />
                        </filter>
                      </defs>
                      <rect width="100%" height="100%" fill="#f5f4f0" />
                      <path d="M-20 40 C60 20, 110 50, 180 30 C250 10, 320 40, 480 15 L480 0 L-20 0 Z" fill="#e8ece5" />
                      <polygon points="-20,130 90,120 140,210 20,240" fill="#e5edd9" fillOpacity="0.8" />
                      <polygon points="120,-10 280,-10 320,80 160,75" fill="#ebf3e2" fillOpacity="0.7" />
                      <polygon points="320,60 480,40 480,190 310,170" fill="#d9ecc8" fillOpacity="0.75" />
                      <polygon points="130,224 230,170 330,224" fill="#f0eee6" />
                      <path d="M -20 170 Q 140 160 240 115 T 480 85" stroke="#ffffff" strokeWidth="16" strokeLinecap="square" />
                      <path d="M -20 170 Q 140 160 240 115 T 480 85" stroke="#fce588" strokeWidth="10" strokeLinecap="square" />
                      <path d="M 160 230 L 195 145 L 260 -10" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
                      <path d="M 160 230 L 195 145 L 260 -10" stroke="#fdfcf7" strokeWidth="6" strokeLinecap="round" />
                      <path d="M 195 145 L 360 175 L 430 200" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
                      <path d="M 195 145 L 360 175 L 430 200" stroke="#fdfcf7" strokeWidth="4.5" strokeLinecap="round" />
                      <path d="M 20 -10 L 45 75 L 140 100" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
                      <polygon points="165,55 310,48 335,138 235,152 152,118" fill="#16a34a" fillOpacity="0.24" stroke="#15803d" strokeWidth="2.5" strokeLinejoin="round" />
                      <polygon points="170,59 248,53 242,108 175,104" fill="#15803d" fillOpacity="0.12" stroke="#15803d" strokeWidth="1" strokeDasharray="3 3" />
                      <g opacity="0.75" transform="translate(50, 153) rotate(-6)">
                        <text x="0" y="0" fill="#8c8475" fontSize="8.5" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.05em">OLD NAIVASHA RD</text>
                      </g>
                      <g opacity="0.8" transform="translate(310, 102) rotate(-13)">
                        <text x="0" y="0" fill="#837c6d" fontSize="8.5" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.05em">MAI MAHIU HWY</text>
                      </g>
                      <g filter="url(#ov-pin-shadow)">
                        <g transform="translate(232, 70)">
                          <path d="M12 0C5.37 0 0 5.37 0 12C0 20.25 10.5 30.75 11.05 31.3C11.55 31.8 12.45 31.8 12.95 31.3C13.5 30.75 24 20.25 24 12C24 5.37 18.63 0 12 0Z" fill="#ea4335" />
                          <circle cx="12" cy="11" r="5.5" fill="#ffffff" />
                          <circle cx="12" cy="11" r="3.5" fill="#b31412" />
                        </g>
                      </g>
                      <g filter="url(#ov-pill-shadow)" transform="translate(182, 40)">
                        <rect x="0" y="0" width="124" height="22" rx="11" fill="#ffffff" stroke="#dadce0" strokeWidth="0.8" />
                        <circle cx="11" cy="11" r="4" fill="#16a34a" />
                        <text x="20" y="14.5" fill="#202124" fontSize="9.5" fontWeight="600" fontFamily="sans-serif">Kariuki Farm • {farmSize} Ac</text>
                      </g>
                    </svg>

                    {/* Map/Satellite toggle */}
                    <div className="absolute top-2.5 left-2.5 flex items-center bg-white/95 backdrop-blur-md rounded-md shadow-xs border border-[#dadce0] overflow-hidden text-[11px] font-medium font-sans">
                      <span className="px-2.5 py-1 bg-white text-[#1a73e8] font-semibold border-r border-[#e8eaed]">Map</span>
                      <span className="px-2.5 py-1 text-[#5f6368]">Satellite</span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md border border-[#dadce0] shadow-xs text-[10px] font-semibold text-[#5f6368] tracking-wider">
                      ZONE: UM4 RIFT VALLEY
                    </div>

                    <div className="absolute bottom-1 right-2.5 text-[9px] text-[#70757a] flex items-center gap-2 select-none pointer-events-none">
                      <span className="font-sans">Map data ©2025</span>
                      <div className="flex items-center gap-1 pl-1 border-l border-[#dadce0]">
                        <span className="font-mono text-[8.5px]">200 m</span>
                        <div className="w-8 h-[2px] bg-[#5f6368]" />
                      </div>
                    </div>

                    <div className="absolute bottom-1.5 left-2 flex items-center gap-1.5 pointer-events-none">
                      <span className="font-bold text-[12px] tracking-tight text-[#4285f4]" style={{ fontFamily: "Arial, sans-serif" }}>Google</span>
                      <span className="text-[9px] font-mono text-[#5f6368] bg-white/80 px-1 py-0.5 rounded border border-[#e0e0e0] leading-none">
                        0°59&apos;48&quot;S 36°35&apos;12&quot;E
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => window.open("https://maps.google.com/?q=-0.99672,36.58678", "_blank")}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-semibold transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">map</span>
                      <span>Open in Google Maps</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open("https://maps.google.com/?q=-0.99672,36.58678", "_blank")}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">directions</span>
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>

                {/* Quick Help & Support Link */}
                <div className="p-4 rounded-2xl bg-surface-container flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0">
                      <span className="material-symbols-outlined text-[20px]">support_agent</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-semibold text-on-surface">Need help with your farm profile?</span>
                      <span className="text-xs text-on-surface-variant">Our agritech support team is available Mon–Sat.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/contact")}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors shadow-xs shrink-0 cursor-pointer"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
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
                  Your responses have established your farm baseline. Please review and confirm your <strong>Farm Profile</strong> to finalize onboarding and access the Assessment Hub.
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href="/onboarding/farm-profile"
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs md:text-sm shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <span>Review &amp; Confirm Farm Profile</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                  <Link
                    href="/onboarding/location"
                    className="px-4 py-2.5 rounded-xl border border-surface-container-high bg-surface hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
                  >
                    Edit Responses
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
                    className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-primary/20 hover:border-primary transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">check</span>
                        Done
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface mb-1">{card.title}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2">{card.desc}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-surface-container-high/60 text-xs font-semibold text-primary flex items-center justify-between">
                      <span>Edit Section</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </div>
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
            {/* Dynamic Hero Section */}
            <section className="bg-surface-container-lowest rounded-3xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-secondary-container">
              <div className="absolute top-0 right-0 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex-1 z-10 space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span>Initial Profiling Completed (5/5)</span>
                </div>

                <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
                  Complete Your Farm Profile
                </h1>

                <p className="text-xs md:text-sm text-on-surface-variant max-w-lg leading-relaxed">
                  Complete the 5 remaining farm sections below to generate your verified profile and unlock the Farm Assessment.
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
                          <span>Continue with Additional Onboarding</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </Link>
                      </h3>
                      <p className="text-[11px] text-on-surface-variant">
                        {additionalDoneCount} of {additionalTotal} additional sections completed
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
                    className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Continue Additional Sections</span>
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
                    Required Additional Onboarding Sections
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Complete all 5 sections to generate your verified Farm Profile
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Phase 2: Farm &amp; Operations Profiling
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {additionalCards.map((card, idx) => {
                  const isDone = card.isDone;
                  return (
                    <Link
                      key={idx}
                      href={card.href}
                      className={`bg-surface-container-lowest rounded-2xl p-5 shadow-xs border transition-all hover:shadow-md flex flex-col justify-between ${
                        isDone
                          ? "border-primary/30 hover:border-primary"
                          : "border-surface-container-high hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                            isDone ? "bg-primary text-white" : "bg-primary/10 text-primary"
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
                          {isDone ? "Completed" : `Stage ${card.stageNumber}`}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-on-surface mb-1">{card.title}</h3>
                        <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{card.desc}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-surface-container-high/60 flex items-center justify-between text-xs font-semibold text-primary">
                        <span>{isDone ? "Edit Responses" : "Start Section"}</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Assessment Locked Notice */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Assessment Hub is Locked</h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Access to your farm maturity assessment will unlock immediately once you complete these sections and approve your Farm Profile.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0">
                Phase 2 In Progress
              </span>
            </div>
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────
              STAGE 1: INITIAL ONBOARDING IN PROGRESS (STEPS 1 - 5)
              ───────────────────────────────────────────────────────────── */
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Section */}
            <section className="bg-surface-container-lowest rounded-3xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-surface-container-high">
              <div className="flex-1 z-10 space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-[15px]">eco</span>
                  <span>Future Farms Agritech Platform</span>
                </div>

                <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
                  Welcome, {userName}
                </h1>

                <p className="text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed">
                  Start by completing your initial onboarding questionnaire below. This baseline profile helps us tailor agronomy recommendations, equipment financing, and aggregate market access to your farm.
                </p>

                {/* Progress Card */}
                <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container-high max-w-md shadow-xs mt-3">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h3 className="font-semibold text-xs text-on-surface mb-0.5">
                        <Link
                          href={nextInitialStepHref}
                          className="text-primary hover:underline inline-flex items-center gap-1 font-bold"
                        >
                          <span>Continue Initial Questionnaire</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </Link>
                      </h3>
                      <p className="text-[11px] text-on-surface-variant">
                        {initialDoneCount} of {initialTotal} initial steps completed
                      </p>
                    </div>
                    <span className="text-base text-primary font-bold">{initialPercent}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${initialPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={nextInitialStepHref}
                    className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Continue Questionnaire</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Landscape Image */}
              <div className="w-full md:w-[320px] h-[200px] md:h-[220px] relative z-10 shrink-0">
                <img
                  alt="Future Farms Agriculture"
                  className="w-full h-full object-cover rounded-2xl shadow-md border border-surface-variant/30"
                  src="/images/smart-farm-landscape.jpg"
                />
              </div>
            </section>

            {/* Step Cards Grid */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-on-surface">
                    Initial Onboarding Questionnaire (Steps 1 – 5)
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Complete all 5 steps to proceed to Phase 2 and Farm Profile verification
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Phase 1: Founder &amp; Farm Baseline
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialCards.map((card) => {
                  const isDone = card.isDone;
                  return (
                    <Link
                      key={card.step}
                      href={card.href}
                      className={`bg-surface-container-lowest rounded-2xl p-5 shadow-xs border transition-all hover:shadow-md flex flex-col justify-between ${
                        isDone
                          ? "border-primary/30 hover:border-primary"
                          : "border-surface-container-high hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                            isDone ? "bg-primary text-white" : "bg-primary/10 text-primary"
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
                          {isDone ? "Completed" : card.questions}
                        </span>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-primary mb-0.5">
                          Step {card.step} of 5
                        </div>
                        <h3 className="text-sm font-bold text-on-surface mb-1">{card.title}</h3>
                        <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{card.desc}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-surface-container-high/60 flex items-center justify-between text-xs font-semibold text-primary">
                        <span>{isDone ? "Edit Responses" : "Start Step"}</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </div>
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
