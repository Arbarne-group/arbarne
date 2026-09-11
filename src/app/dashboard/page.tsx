"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import AppShell from "@/components/layout/AppShell";
import RadarChart from "@/components/dashboard/RadarChart";
import { ALL_PILLARS } from "@/data/allPillarsData";
import {
  computeAssessmentResults,
  getMaturityTier,
  OverallAssessmentResult,
} from "@/lib/assessmentScoring";
import {
  computeOnboardingStageFromUser,
  countCompletedPillarsFromAnswers,
  getActiveUserEmail,
} from "@/lib/onboardingGuard";

interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rawAnswers, setRawAnswers] = useState<Record<string, "yes" | "no">>({});
  const [assessmentMeta, setAssessmentMeta] = useState<any>(null);
  const [assessmentResult, setAssessmentResult] = useState<OverallAssessmentResult | null>(null);

  // Modals & Interactive States
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showAllPlanModal, setShowAllPlanModal] = useState(false);
  const [showStrengthsModal, setShowStrengthsModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [newActionText, setNewActionText] = useState("");
  const [showAddAction, setShowAddAction] = useState(false);

  // Recommendations / Action Items
  const [actions, setActions] = useState<ActionItem[]>([]);

  useEffect(() => {
    const email = clerkUser?.primaryEmailAddress?.emailAddress || getActiveUserEmail();

    // 1. Immediate local cache verification
    try {
      const cached = localStorage.getItem("future_farms_user");
      if (cached) {
        const u = JSON.parse(cached);
        if (u) {
          const st = computeOnboardingStageFromUser(u);
          if (st.stage !== "FULLY_COMPLETED") {
            router.replace("/onboarding");
            return;
          }
        }
      }
    } catch (e) {}

    let localAnswers: Record<string, "yes" | "no"> | null = null;
    try {
      const saved =
        localStorage.getItem("future_farms_assessment_answers") ||
        localStorage.getItem("future_farms_all_answers");
      if (saved) {
        localAnswers = JSON.parse(saved);
      }
    } catch (e) {}

    if (email) {
      fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            const st = computeOnboardingStageFromUser(data.user);
            if (st.stage !== "FULLY_COMPLETED") {
              router.replace("/onboarding");
              return;
            }
          }
          if (data.completedPillarsCount !== undefined && data.completedPillarsCount < 1) {
            const localCount = countCompletedPillarsFromAnswers(localAnswers);
            if (localCount < 1) {
              router.replace("/assessment");
              return;
            }
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));

      fetch(`/api/assessment/responses?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.answers && Object.keys(data.answers).length > 0) {
            setRawAnswers(data.answers);
            setAssessmentMeta(data);
            setAssessmentResult(computeAssessmentResults(data.answers));
            const count = countCompletedPillarsFromAnswers(data.answers);
            if (count < 1) {
              const localCount = countCompletedPillarsFromAnswers(localAnswers);
              if (localCount < 1) {
                router.replace("/assessment");
                return;
              }
            }
          } else {
            // Fallback to local storage if available
            if (localAnswers && Object.keys(localAnswers).length > 0) {
              setRawAnswers(localAnswers);
              setAssessmentResult(computeAssessmentResults(localAnswers));
              const count = countCompletedPillarsFromAnswers(localAnswers);
              if (count < 1) {
                router.replace("/assessment");
                return;
              }
            } else {
              router.replace("/assessment");
              return;
            }
          }
        })
        .catch(() => {
          if (localAnswers && Object.keys(localAnswers).length > 0) {
            const count = countCompletedPillarsFromAnswers(localAnswers);
            if (count < 1) {
              router.replace("/assessment");
              return;
            }
          } else {
            router.replace("/assessment");
          }
        });
    } else {
      const localCount = countCompletedPillarsFromAnswers(localAnswers);
      if (localCount < 1) {
        router.replace("/assessment");
        return;
      }
      setLoading(false);
    }
  }, [clerkUser, router]);

  // Derive dynamic actions from questions answered "no" or saved custom tasks
  useEffect(() => {
    try {
      const savedActions = localStorage.getItem("future_farms_dashboard_actions");
      if (savedActions) {
        const parsed = JSON.parse(savedActions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActions(parsed);
          return;
        }
      }
    } catch (e) {}

    // Generate real actions from user's "no" answers
    const derivedActions: ActionItem[] = [];
    if (rawAnswers && Object.keys(rawAnswers).length > 0) {
      ALL_PILLARS.forEach((p) => {
        p.capabilities.forEach((c) => {
          c.questions.forEach((q) => {
            if (rawAnswers[q.id] === "no" && derivedActions.length < 5) {
              derivedActions.push({
                id: `act-${q.id}`,
                text: `[P${p.id} • ${c.name}] ${q.recommendation || q.quickWin || q.question}`,
                completed: false,
                category: `Pillar ${p.id}`,
              });
            }
          });
        });
      });
    }

    if (derivedActions.length > 0) {
      setActions(derivedActions);
    } else {
      // Default initial guided onboarding milestones if assessment not yet populated
      setActions([
        {
          id: "act-init-1",
          text: "Complete your 8-Pillar Farm Assessment to benchmark all 40 capabilities",
          completed: false,
          category: "Getting Started",
        },
        {
          id: "act-init-2",
          text: "Review soil and crop health diagnostics to optimize input utilization",
          completed: false,
          category: "Pillar 1",
        },
        {
          id: "act-init-3",
          text: "Log farm water management and irrigation sources for climate readiness",
          completed: false,
          category: "Pillar 2",
        },
      ]);
    }
  }, [rawAnswers]);

  const handleToggleAction = (id: string) => {
    const updated = actions.map((act) =>
      act.id === id ? { ...act, completed: !act.completed } : act
    );
    setActions(updated);
    try {
      localStorage.setItem("future_farms_dashboard_actions", JSON.stringify(updated));
    } catch (e) {}
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;
    const newItem: ActionItem = {
      id: `act-${Date.now()}`,
      text: newActionText.trim(),
      completed: false,
      category: "Custom",
    };
    const updated = [newItem, ...actions];
    setActions(updated);
    setNewActionText("");
    setShowAddAction(false);
    try {
      localStorage.setItem("future_farms_dashboard_actions", JSON.stringify(updated));
    } catch (e) {}
  };

  // Compute canonical radar labels & scores
  const radarLabels = [
    ["P1 Smart Farming", "& Digital"],
    "P2 Renewable Energy",
    ["P3 Food Safety,", "Quality & Compl."],
    ["P4 Indigenous", "Knowledge & Climate"],
    ["P5 Business", "Performance"],
    ["P6 Human Capital,", "Leadership"],
    ["P7 Market Access,", "Customer Value"],
    ["P8 Investment", "Readiness"],
  ];

  const hasAssessment = useMemo(() => {
    return (assessmentResult?.totalAnswered ?? 0) > 0;
  }, [assessmentResult]);

  const radarScores = useMemo(() => {
    return ALL_PILLARS.map((p) => {
      const pResult = assessmentResult?.pillarScores.find((r) => r.pillarId === p.id);
      return pResult && pResult.answeredCount > 0 ? pResult.score : 0;
    });
  }, [assessmentResult]);

  const benchmarkScores = [60, 50, 60, 55, 55, 50, 65, 50];

  // FFMI out of 24 points (8 pillars * 3 max capability points or normalized score)
  const overallPercentage = useMemo(() => {
    if (!hasAssessment || !assessmentResult) return 0;
    return assessmentResult.overallFfmiScore;
  }, [hasAssessment, assessmentResult]);

  const ffmiScore24 = useMemo(() => {
    if (!hasAssessment) return 0;
    return Math.round((overallPercentage / 100) * 24);
  }, [hasAssessment, overallPercentage]);

  const maturityTier = useMemo(() => {
    if (!hasAssessment) {
      return {
        label: "Assessment Pending",
        description: "Take the 8-Pillar Assessment to calculate your farm's verified FFMI score and maturity stage.",
        badgeColor: "bg-surface-variant text-on-surface-variant",
        textColor: "text-on-surface-variant",
        color: "border-outline-variant bg-surface-container-low",
      };
    }
    return getMaturityTier(overallPercentage);
  }, [hasAssessment, overallPercentage]);

  const farmClassification = useMemo(() => {
    if (!hasAssessment) return "Pending Assessment";
    if (overallPercentage >= 80) return "Future-Ready Farm";
    if (overallPercentage >= 60) return "Structured Commercial Farm";
    if (overallPercentage >= 40) return "Developing Farm";
    return "Emerging Farm";
  }, [hasAssessment, overallPercentage]);

  // Verified & completed pillars
  const verifiedPillarsCount = useMemo(() => {
    if (!assessmentResult) return 0;
    return assessmentResult.pillarScores.filter(
      (s) => s.answeredCount >= 25 || s.score > 0
    ).length;
  }, [assessmentResult]);

  // Dynamic Strengths (capabilities scored >= 60%)
  const strengthsList = useMemo(() => {
    if (!assessmentResult || !hasAssessment) return [];
    const list: { pillarId: number; pillarName: string; capId: string; capName: string; score: number }[] = [];
    assessmentResult.pillarScores.forEach((p) => {
      Object.entries(p.capabilityScores || {}).forEach(([capId, cap]: [string, any]) => {
        if (cap.score >= 60 && cap.total > 0) {
          list.push({
            pillarId: p.pillarId,
            pillarName: p.pillarName,
            capId,
            capName: cap.name,
            score: cap.score,
          });
        }
      });
    });
    return list.sort((a, b) => b.score - a.score);
  }, [assessmentResult, hasAssessment]);

  // Dynamic Priority Gap Areas (capabilities scored < 60% with answered questions)
  const priorityGapsList = useMemo(() => {
    if (!assessmentResult || !hasAssessment) return [];
    const list: { pillarId: number; pillarName: string; capId: string; capName: string; score: number }[] = [];
    assessmentResult.pillarScores.forEach((p) => {
      Object.entries(p.capabilityScores || {}).forEach(([capId, cap]: [string, any]) => {
        if (p.answeredCount > 0 && cap.score < 60) {
          list.push({
            pillarId: p.pillarId,
            pillarName: p.pillarName,
            capId,
            capName: cap.name,
            score: cap.score,
          });
        }
      });
    });
    return list.sort((a, b) => a.score - b.score);
  }, [assessmentResult, hasAssessment]);

  // Dynamic Development Plan (Top 3 Priority Improvements)
  const developmentPlanItems = useMemo(() => {
    if (priorityGapsList.length > 0) {
      return priorityGapsList.slice(0, 3).map((item, idx) => ({
        id: idx + 1,
        num: idx + 1,
        numColor: item.score <= 30 ? "text-error" : "text-[#d97706]",
        title: item.capName,
        subtitle: `Pillar ${item.pillarId} • Capability ${item.capId}`,
        transition:
          item.score <= 30
            ? "Emerging → Basic"
            : item.score <= 60
            ? "Basic → Developing"
            : "Developing → Established",
        pillarId: item.pillarId,
      }));
    }

    // Default roadmap if assessment is not yet completed
    return [
      {
        id: 1,
        num: 1,
        numColor: "text-primary",
        title: "Smart Farming & Digital Transformation",
        subtitle: "Pillar 1 • Capability 1.1–1.5",
        transition: "Diagnostic Baseline",
        pillarId: 1,
      },
      {
        id: 2,
        num: 2,
        numColor: "text-primary",
        title: "Renewable Energy & Efficiency",
        subtitle: "Pillar 2 • Capability 2.1–2.5",
        transition: "Diagnostic Baseline",
        pillarId: 2,
      },
      {
        id: 3,
        num: 3,
        numColor: "text-primary",
        title: "Food Safety, Quality & Compliance",
        subtitle: "Pillar 3 • Capability 3.1–3.5",
        transition: "Diagnostic Baseline",
        pillarId: 3,
      },
    ];
  }, [priorityGapsList]);

  const farmIdentifier =
    (user as any)?.futureFarmId ||
    (user?.id ? `FFF-KE-PROD-${user.id.slice(-4).toUpperCase()}` : "FFF-KE-PROD");

  const lastAssessmentDate = useMemo(() => {
    if (assessmentMeta?.assessment?.updatedAt) {
      return new Date(assessmentMeta.assessment.updatedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return hasAssessment ? "Recently Recorded" : "Not yet assessed";
  }, [assessmentMeta, hasAssessment]);

  const nextAssessmentDate = useMemo(() => {
    if (assessmentMeta?.nextEligibleDateFull) {
      return new Date(assessmentMeta.nextEligibleDateFull).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    if (hasAssessment) {
      const d = new Date();
      d.setDate(d.getDate() + 90);
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    }
    return "Complete assessment to schedule";
  }, [assessmentMeta, hasAssessment]);

  return (
    <AppShell
      userName={user?.name || clerkUser?.fullName || "Farmer"}
      userRole={user?.farmerProfile?.jobTitle === "owner" ? "Farm Owner" : "Farm Operator"}
    >
      <div className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop bg-background">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-lg">
          {/* My Future Farm Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-2 border-b border-outline-variant/30">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[26px]">agriculture</span>
                My Future Farm
              </h1>
              <p className="text-xs md:text-sm text-on-surface-variant">
                Farm progression across 8 Pillars (P1–P8) and 40 underlying Capabilities (1.1–8.5).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed text-xs font-mono font-bold">
                ID: {farmIdentifier}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {verifiedPillarsCount}/8 Pillars Completed
              </span>
            </div>
          </div>

          {/* Top Section: Bento Grid for Maturity Index & Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left Col: Maturity Index */}
            <div className="col-span-1 lg:col-span-4 flex flex-col gap-gutter">
              <div className="bg-surface rounded-2xl p-6 shadow-ambient h-full flex flex-col justify-between hover:shadow-hover transition-shadow relative overflow-hidden group border border-outline-variant/40">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-container opacity-10 rounded-full blur-2xl group-hover:bg-primary transition-colors duration-500 pointer-events-none" />

                <div>
                  <h3 className="font-title-md text-title-md text-on-surface-variant mb-1 font-semibold">
                    Future Farm Maturity Index
                  </h3>
                  <p className="font-label-sm text-label-sm text-primary font-bold tracking-wider uppercase mb-6">
                    FFMI / 24
                  </p>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="font-display-lg text-display-lg text-on-surface font-black">
                      {ffmiScore24}
                    </span>
                    <span className="font-title-md text-title-md text-on-surface-variant font-bold">
                      / 24
                    </span>
                  </div>

                  <div className="mb-6">
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-2 font-medium">
                      Classification
                    </p>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm font-semibold ${
                      hasAssessment ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"
                    }`}>
                      <span className="material-symbols-outlined text-[18px] mr-1 fill">
                        {hasAssessment ? "verified" : "hourglass_empty"}
                      </span>
                      {farmClassification}
                    </span>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                    {hasAssessment
                      ? maturityTier.description
                      : "Take the 8-Pillar Assessment to establish your farm's verified capability benchmark and unlock access to commercial opportunities."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProgressModal(true)}
                  className="w-full py-3 px-4 border border-outline rounded-xl text-primary font-label-sm text-label-sm hover:bg-surface-variant transition-colors flex justify-center items-center gap-2 cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    trending_up
                  </span>
                  View Progress Over Time
                </button>
              </div>
            </div>

            {/* Right Col: Radar Chart (8 Pillar Summary) */}
            <div className="col-span-1 lg:col-span-8 bg-surface rounded-2xl p-4 sm:p-6 shadow-ambient min-h-[320px] sm:min-h-[380px] lg:h-auto flex flex-col relative overflow-hidden border border-outline-variant/40">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  8 Pillar Summary
                </h3>
              </div>

              <div className="flex-1 w-full h-full min-h-[250px] relative flex justify-center items-center">
                <RadarChart
                  labels={radarLabels}
                  scores={radarScores}
                  benchmarkScores={benchmarkScores}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-2.5 sm:gap-6 mt-4 pt-4 border-t border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Your Score
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-outline-variant" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Average Future Farm Benchmark
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setShowStrengthsModal(true)}
              className="bg-surface rounded-xl p-4 shadow-ambient border border-surface-variant flex items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer text-left w-full"
            >
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    psychiatry
                  </span>{" "}
                  Strengths
                </p>
                <p className="font-title-md text-title-md text-on-surface mt-1">
                  <span className="font-bold">{strengthsList.length}</span> Capabilities
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">
                chevron_right
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowPriorityModal(true)}
              className="bg-surface rounded-xl p-4 shadow-ambient border border-error-container flex items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer text-left w-full"
            >
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-error">
                    priority_high
                  </span>{" "}
                  Priority Areas
                </p>
                <p className="font-title-md text-title-md text-on-surface mt-1">
                  <span className="font-bold">{priorityGapsList.length}</span> Capabilities
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">
                chevron_right
              </span>
            </button>

            <Link
              href="/learning"
              className="bg-surface rounded-xl p-4 shadow-ambient border border-tertiary-fixed flex items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer"
            >
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">
                    school
                  </span>{" "}
                  Learning Modules
                </p>
                <p className="font-title-md text-title-md text-on-surface mt-1">
                  <span className="font-bold">8</span> Pillars
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">
                chevron_right
              </span>
            </Link>

            <Link
              href="/opportunities"
              className="bg-surface rounded-xl p-4 shadow-ambient border border-secondary-fixed flex items-center justify-between hover:-translate-y-1 transition-transform cursor-pointer"
            >
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    handshake
                  </span>{" "}
                  Opportunities
                </p>
                <p className="font-title-md text-title-md text-on-surface mt-1">
                  <span className="font-bold">Available</span> Now
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">
                chevron_right
              </span>
            </Link>
          </div>

          {/* Bottom Section: Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            {/* My Development Plan */}
            <div className="bg-surface rounded-2xl p-6 shadow-ambient flex flex-col border border-outline-variant/40">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">
                    My Development Plan
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    {priorityGapsList.length > 0 ? "Highest-impact areas based on your assessment gaps" : "Core transformation areas"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllPlanModal(true)}
                  className="font-label-sm text-label-sm text-primary hover:underline font-semibold cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {developmentPlanItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center p-3 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant group"
                  >
                    <span className={`font-title-md text-title-md ${item.numColor} w-8 text-center font-bold`}>
                      {item.num}
                    </span>
                    <div className="flex-1 px-3">
                      <h4 className="font-label-sm text-label-sm text-on-surface font-semibold">
                        {item.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant">
                        {item.subtitle}
                      </p>
                    </div>
                    <div className="hidden sm:block px-3">
                      <span className="text-xs px-2 py-1 bg-surface-variant text-on-surface-variant rounded-md font-medium">
                        {item.transition}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push(`/assessment`)}
                      className="ml-auto px-4 py-1.5 border border-primary text-primary rounded-full font-label-sm text-label-sm hover:bg-primary-container hover:text-on-primary-container transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer font-semibold"
                    >
                      Audit
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Next Actions */}
            <div className="bg-surface rounded-2xl p-6 shadow-ambient flex flex-col relative overflow-hidden border border-outline-variant/40">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-fixed-dim opacity-10 rounded-tl-full pointer-events-none" />

              <div className="flex justify-between items-center mb-6 z-10">
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">
                    Recommended Next Actions
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    Priority tasks generated from your diagnostics
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAction(!showAddAction)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>{showAddAction ? "Cancel" : "Add Task"}</span>
                </button>
              </div>

              {showAddAction && (
                <form onSubmit={handleAddAction} className="mb-4 z-10 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter action or goal..."
                    value={newActionText}
                    onChange={(e) => setNewActionText(e.target.value)}
                    className="flex-1 text-xs p-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-primary"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </form>
              )}

              <div className="flex flex-col gap-4 flex-1 z-10">
                {actions.map((act) => (
                  <label
                    key={act.id}
                    className="flex items-start gap-3 cursor-pointer group select-none"
                  >
                    <input
                      type="checkbox"
                      checked={act.completed}
                      onChange={() => handleToggleAction(act.id)}
                      className="mt-1 rounded text-primary focus:ring-primary border-outline-variant w-5 h-5 bg-surface transition-colors cursor-pointer"
                    />
                    <div>
                      <p
                        className={`font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors ${
                          act.completed ? "line-through opacity-60" : ""
                        }`}
                      >
                        {act.text}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 z-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllPlanModal(true)}
                  className="py-2 px-6 bg-surface-variant text-on-surface rounded-full font-label-sm text-label-sm hover:bg-outline-variant transition-colors font-semibold cursor-pointer"
                >
                  View All Actions
                </button>
              </div>
            </div>
          </div>

          {/* Future Farms Verification (FFV) 8-Pillars Matrix */}
          <div className="bg-surface rounded-2xl p-6 shadow-ambient border border-outline-variant/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">
                    Future Farms Verification (FFV)
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant max-w-xl">
                  Actual progress across all 8 diagnostic pillars. Completing your assessments strengthens the credibility of your profile for lenders and commercial partners.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                  {verifiedPillarsCount} of 8 pillars completed
                </span>
                <Link
                  href="/assessment"
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>Go to Assessment</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant pb-2">
              <span className="font-semibold text-on-surface">Status Legend:</span>
              <span className="inline-flex items-center gap-1">
                <span className="text-outline text-base">○</span> Not Started
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-[#d97706] text-base">◐</span> In Progress
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-primary text-base font-bold">✓</span> Completed
              </span>
            </div>

            {/* Dynamic 8 Pillars FFV Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ALL_PILLARS.map((pillar) => {
                const pResult = assessmentResult?.pillarScores.find((s) => s.pillarId === pillar.id);
                const answered = pResult?.answeredCount || 0;
                const yes = pResult?.yesCount || 0;
                const score = pResult?.score || 0;

                const isComplete = answered >= 25;
                const isInProgress = answered > 0 && answered < 25;

                const advancingCapsCount = pResult?.capabilityScores
                  ? Object.values(pResult.capabilityScores).filter((c: any) => c.score >= 60).length
                  : 0;

                return (
                  <div
                    key={pillar.id}
                    className={`p-4 rounded-xl bg-surface-container-low border flex flex-col justify-between transition-shadow hover:shadow-xs ${
                      isComplete
                        ? "border-primary/40"
                        : isInProgress
                        ? "border-[#d97706]/40"
                        : "border-outline-variant/30"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-xs text-on-surface">Pillar {pillar.id}</span>
                        {isComplete ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary flex items-center gap-0.5">
                            ✓ Completed
                          </span>
                        ) : isInProgress ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d97706]/10 text-[#d97706] flex items-center gap-0.5">
                            ◐ In Progress
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container-high text-on-surface-variant">
                            ○ Not Started
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-on-surface mb-2 line-clamp-1">{pillar.name}</h4>
                      <div className="space-y-1 text-xs">
                        <p className="text-on-surface-variant flex justify-between">
                          <span>Answered:</span>
                          <span className="font-semibold text-on-surface">{answered}/25</span>
                        </p>
                        <p className={`flex justify-between font-bold ${
                          isComplete ? "text-primary" : isInProgress ? "text-[#d97706]" : "text-on-surface-variant"
                        }`}>
                          <span>Score:</span>
                          <span>{answered > 0 ? `${yes}/25 (${score}%)` : "-- / 25"}</span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant flex justify-between items-center">
                      <span>
                        {isComplete
                          ? `${advancingCapsCount}/5 Advancing`
                          : isInProgress
                          ? `${answered}/25 Done`
                          : "Audit Open"}
                      </span>
                      <Link
                        href="/assessment"
                        className="text-primary font-semibold hover:underline text-[11px]"
                      >
                        {answered > 0 ? "Review" : "Start"} &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 text-xs text-on-surface-variant px-4 border-t border-outline-variant/30 gap-2">
            <p>Last Assessment: {lastAssessmentDate}</p>
            <p>Next Assessment Cycle: {nextAssessmentDate}</p>
          </div>
        </div>

        {/* Modal: View Progress Over Time */}
        {showProgressModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface rounded-3xl p-5 sm:p-6 md:p-8 max-w-lg w-full max-h-[90dvh] overflow-y-auto shadow-2xl border border-outline-variant animate-fade-in-up flex flex-col">
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
                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/30">
                  <div>
                    <span className="text-xs font-bold text-primary block">Current Verified Benchmark</span>
                    <span className="text-[11px] text-primary/80">Stage: {farmClassification}</span>
                  </div>
                  <span className="text-base font-black text-primary">{ffmiScore24} / 24</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-dashed border-outline-variant">
                  <div>
                    <span className="text-xs font-bold text-on-surface-variant block">Target Projection (Next Review)</span>
                    <span className="text-[11px] text-on-surface-variant">Target: Future-Ready Farm</span>
                  </div>
                  <span className="text-sm font-bold text-secondary">20 / 24</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-surface-variant">
                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Full Development Plan */}
        {showAllPlanModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-outline-variant max-h-[85vh] overflow-y-auto animate-fade-in-up">
              <div className="flex justify-between items-center mb-4 border-b border-surface-variant pb-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl">assignment</span>
                  <h3 className="text-lg font-bold text-on-surface">8-Pillar Farm Development Plan</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllPlanModal(false)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <p className="text-xs text-on-surface-variant mb-5">
                Overview of capability milestones across all 8 Future Farms transformation pillars.
              </p>

              <div className="space-y-3 mb-6">
                {ALL_PILLARS.map((p, idx) => {
                  const pResult = assessmentResult?.pillarScores.find((s) => s.pillarId === p.id);
                  const answered = pResult?.answeredCount || 0;
                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-on-surface">{p.name}</h4>
                          <p className="text-[11px] text-on-surface-variant">{p.principle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-on-surface-variant">
                          {answered}/25
                        </span>
                        <Link
                          href="/assessment"
                          className="px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors shrink-0"
                        >
                          {answered > 0 ? "Review" : "Audit"}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-surface-variant">
                <button
                  type="button"
                  onClick={() => setShowAllPlanModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Close Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Strengths */}
        {showStrengthsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface rounded-3xl p-5 sm:p-6 md:p-8 max-w-lg w-full max-h-[90dvh] overflow-y-auto shadow-2xl border border-outline-variant animate-fade-in-up flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-surface-variant pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">psychiatry</span>
                  <h3 className="text-lg font-bold text-on-surface">Verified Farm Strengths</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStrengthsModal(false)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <p className="text-xs text-on-surface-variant mb-4">
                Capabilities with strong benchmark adoption (Score &ge; 60%):
              </p>

              <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto">
                {strengthsList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-on-surface-variant bg-surface-container-low rounded-2xl">
                    <span className="material-symbols-outlined text-3xl text-primary mb-2">assignment_turned_in</span>
                    <p className="font-semibold text-on-surface">No verified strengths yet</p>
                    <p className="mt-1">Answer assessment questions with &apos;Yes&apos; to highlight verified operational strengths.</p>
                  </div>
                ) : (
                  strengthsList.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center justify-between gap-2 font-bold text-xs text-emerald-900 mb-1">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-emerald-700 text-sm fill">check_circle</span>
                          <span>Capability {item.capId}: {item.capName}</span>
                        </span>
                        <span className="text-emerald-700 font-extrabold">{item.score}%</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">Pillar {item.pillarId} • {item.pillarName}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end pt-3 border-t border-surface-variant">
                <button
                  type="button"
                  onClick={() => setShowStrengthsModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Priority Areas */}
        {showPriorityModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface rounded-3xl p-5 sm:p-6 md:p-8 max-w-lg w-full max-h-[90dvh] overflow-y-auto shadow-2xl border border-outline-variant animate-fade-in-up flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-surface-variant pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-2xl">priority_high</span>
                  <h3 className="text-lg font-bold text-on-surface">Priority Improvement Areas</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPriorityModal(false)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <p className="text-xs text-on-surface-variant mb-4">
                Capabilities identified with the greatest room for operational growth (Score &lt; 60%):
              </p>

              <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto">
                {priorityGapsList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-on-surface-variant bg-surface-container-low rounded-2xl">
                    <span className="material-symbols-outlined text-3xl text-primary mb-2">task_alt</span>
                    <p className="font-semibold text-on-surface">
                      {hasAssessment ? "No major gaps identified" : "Complete assessment to uncover gaps"}
                    </p>
                    <p className="mt-1">
                      {hasAssessment
                        ? "All assessed capabilities are currently meeting or exceeding standards."
                        : "Take the 8-pillar diagnostic to identify high-ROI priority improvements."}
                    </p>
                  </div>
                ) : (
                  priorityGapsList.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                      <div className="flex items-center justify-between gap-2 font-bold text-xs text-rose-900 mb-1">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-rose-700 text-sm fill">warning</span>
                          <span>Capability {item.capId}: {item.capName}</span>
                        </span>
                        <span className="text-rose-700 font-extrabold">{item.score}%</span>
                      </div>
                      <p className="text-[11px] text-rose-800">Pillar {item.pillarId} • {item.pillarName}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-surface-variant">
                <Link
                  href="/assessment"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Go to Assessment &rarr;
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPriorityModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
