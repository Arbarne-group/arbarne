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
import { getActiveUserEmail } from "@/lib/onboardingGuard";

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
  const [assessmentResult, setAssessmentResult] = useState<OverallAssessmentResult | null>(null);

  // Modals & Interactive States
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showAllPlanModal, setShowAllPlanModal] = useState(false);
  const [showStrengthsModal, setShowStrengthsModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [newActionText, setNewActionText] = useState("");
  const [showAddAction, setShowAddAction] = useState(false);

  // Recommendations / Action Items
  const [actions, setActions] = useState<ActionItem[]>([
    { id: "act-1", text: "[P1.1.1] List top production challenges and explore technology solutions with an advisor", completed: true, category: "Pillar 1" },
    { id: "act-2", text: "[P2.3.1] Install energy sub-meters on high-consumption solar & grid irrigation pumps", completed: false, category: "Pillar 2" },
    { id: "act-3", text: "[P3.2.2] Establish daily harvest hygiene logs and designated field worker wash stations", completed: false, category: "Pillar 3" },
    { id: "act-4", text: "[P4.1.3] Construct water-catchment swales and plant vetiver grass along field contours", completed: false, category: "Pillar 4" },
    { id: "act-5", text: "[P8.3.1] Consolidate farm financial documentation and separate personal from enterprise cash flow", completed: false, category: "Pillar 8" },
  ]);

  useEffect(() => {
    const email = clerkUser?.primaryEmailAddress?.emailAddress || getActiveUserEmail();

    if (email) {
      fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));

      fetch(`/api/assessment/responses?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.answers && Object.keys(data.answers).length > 0) {
            setAssessmentResult(computeAssessmentResults(data.answers));
          } else {
            // Fallback to local storage if available
            try {
              const saved = localStorage.getItem("future_farms_all_answers");
              if (saved) {
                const answers = JSON.parse(saved);
                setAssessmentResult(computeAssessmentResults(answers));
              } else {
                setAssessmentResult(computeAssessmentResults({}));
              }
            } catch (e) {}
          }
        })
        .catch(() => {
          setAssessmentResult(computeAssessmentResults({}));
        });
    } else {
      setLoading(false);
    }

    try {
      const savedActions = localStorage.getItem("future_farms_dashboard_actions");
      if (savedActions) {
        setActions(JSON.parse(savedActions));
      }
    } catch (e) {
      console.error(e);
    }
  }, [clerkUser]);

  const handleToggleAction = (id: string) => {
    const updated = actions.map((act) =>
      act.id === id ? { ...act, completed: !act.completed } : act
    );
    setActions(updated);
    localStorage.setItem("future_farms_dashboard_actions", JSON.stringify(updated));
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
    localStorage.setItem("future_farms_dashboard_actions", JSON.stringify(updated));
  };

  // Compute canonical radar labels & scores
  const radarLabels = [
    ["P1 Smart Farming", "& Digital Transformation"],
    "P2 Renewable Energy",
    ["P3 Food Safety,", "Quality & Compliance"],
    ["P4 Indigenous Knowledge", "& Climate Resilience"],
    ["P5 Business", "Performance & Growth"],
    ["P6 Human Capital,", "Leadership & Operations"],
    ["P7 Market Access,", "Customer Value"],
    ["P8 Investment", "Readiness"],
  ];

  const radarScores = useMemo(() => {
    return ALL_PILLARS.map((p) => {
      const pResult = assessmentResult?.pillarScores.find((r) => r.pillarId === p.id);
      return pResult ? pResult.score : 67;
    });
  }, [assessmentResult]);

  const benchmarkScores = [62, 50, 62, 62, 55, 50, 70, 50];

  // FFMI out of 24 points (8 pillars * 3 max capability points or normalized score)
  const overallPercentage = assessmentResult?.overallFfmiScore ?? 67;
  const ffmiScore24 = Math.round((overallPercentage / 100) * 24) || 16;
  const maturityTier = getMaturityTier(overallPercentage);

  // Development Plan Priority Items
  const developmentPlanItems = [
    {
      id: 1,
      num: 1,
      numColor: "text-error",
      title: "Energy Efficiency & Management",
      subtitle: "Pillar 2 • Capability 2.3",
      transition: "Basic → Developing",
      pillarId: 2,
    },
    {
      id: 2,
      num: 2,
      numColor: "text-[#d97706]",
      title: "Financial & Investment Documentation",
      subtitle: "Pillar 8 • Capability 8.3",
      transition: "Emerging → Basic",
      pillarId: 8,
    },
    {
      id: 3,
      num: 3,
      numColor: "text-[#d97706]",
      title: "Workforce Planning & Recruitment",
      subtitle: "Pillar 6 • Capability 6.2",
      transition: "Developing → Established",
      pillarId: 6,
    },
  ];

  const verifiedPillarsCount = assessmentResult?.pillarScores
    ? assessmentResult.pillarScores.filter((s) => s.score > 0 || s.answeredCount > 0).length
    : 0;

  const farmIdentifier =
    (user as any)?.futureFarmId ||
    (user?.id ? `FFF-KE-PROD-${user.id.slice(-4).toUpperCase()}` : "FFF-KE-PROD");

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
                {verifiedPillarsCount}/8 Pillars Verified
              </span>
            </div>
          </div>

          {/* Top Section: Bento Grid for Maturity Index & Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left Col: Maturity Index */}
            <div className="col-span-1 lg:col-span-4 flex flex-col gap-gutter">
              <div className="bg-surface rounded-2xl p-6 shadow-ambient h-full flex flex-col justify-between hover:shadow-hover transition-shadow relative overflow-hidden group border border-outline-variant/40">
                {/* Subtle decorative background shape */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-container opacity-10 rounded-full blur-2xl group-hover:bg-primary transition-colors duration-500 pointer-events-none" />

                <div>
                  <h3 className="font-title-md text-title-md text-on-surface-variant mb-1 font-semibold">
                    Future Farm Maturity Index
                  </h3>
                  <p className="font-label-sm text-label-sm text-primary font-bold tracking-wider uppercase mb-6">
                    FFMI/24
                  </p>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="font-display-lg text-display-lg text-on-surface font-black">
                      {ffmiScore24}
                    </span>
                    <span className="font-title-md text-title-md text-on-surface-variant font-bold">
                      /24
                    </span>
                  </div>

                  <div className="mb-6">
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-2 font-medium">
                      Classification
                    </p>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-sm font-semibold">
                      <span className="material-symbols-outlined text-[18px] mr-1 fill">
                        verified
                      </span>
                      Structured Farm
                    </span>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                    You are on the right track! Keep improving your capabilities to become a Future-Ready Farm.
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
            <div className="col-span-1 lg:col-span-8 bg-surface rounded-2xl p-6 shadow-ambient h-[400px] lg:h-auto flex flex-col relative overflow-hidden border border-outline-variant/40">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  8 Pillar Summary
                </h3>
                <div className="flex items-center gap-3">
                  <Link
                    href="/assessment/report?pillar=all"
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                    <span>Download Report (PDF)</span>
                  </Link>
                  <Link
                    href="/assessment"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Edit Assessment</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </Link>
                </div>
              </div>

              <div className="flex-1 w-full h-full min-h-[250px] relative flex justify-center items-center">
                <RadarChart
                  labels={radarLabels}
                  scores={radarScores}
                  benchmarkScores={benchmarkScores}
                />
              </div>

              <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Your Score
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-outline-variant" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Average Future Farm
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Stats Row (Glassmorphism inspired pills) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <span className="font-bold">3</span> Capabilities
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
                  <span className="font-bold">3</span> Capabilities
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
                  Learning In Progress
                </p>
                <p className="font-title-md text-title-md text-on-surface mt-1">
                  <span className="font-bold">2</span> Modules
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
                  Opportunities for You
                </p>
                <p className="font-title-md text-title-md text-on-surface mt-1">
                  <span className="font-bold">5</span> New
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
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  My Development Plan (Top Priorities)
                </h3>
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
                      Continue
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Next Actions */}
            <div className="bg-surface rounded-2xl p-6 shadow-ambient flex flex-col relative overflow-hidden border border-outline-variant/40">
              {/* Abstract soft green shape background */}
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-fixed-dim opacity-10 rounded-tl-full pointer-events-none" />

              <div className="flex justify-between items-center mb-6 z-10">
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  Recommended Next Actions
                </h3>
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
                    className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors"
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

          {/* Future Farms Verification (FFV) Section */}
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
                  FFV verifies the evidence behind your self-assessment claims and strengthens the credibility of your Future Farm Profile for lenders, buyers, and investors.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                  3 of 8 pillars verified
                </span>
                <Link
                  href="/assessment"
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>Start Verification</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Instant Status Indicators Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant pb-2">
              <span className="font-semibold text-on-surface">Status Legend:</span>
              <span className="inline-flex items-center gap-1">
                <span className="text-outline text-base">○</span> Not Started
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-[#d97706] text-base">◐</span> In Review / Submitted
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-primary text-base font-bold">✓</span> Verified
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-error text-base font-bold">!</span> Needs Review
              </span>
            </div>

            {/* 8 Pillars FFV Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pillar 1 */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-primary/30 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-on-surface">Pillar 1</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary flex items-center gap-0.5">
                      ✓ Verified
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface mb-2">Smart Farming &amp; Digital</h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-on-surface-variant flex justify-between">
                      <span>Assessment:</span>
                      <span className="font-semibold text-on-surface">21/25</span>
                    </p>
                    <p className="text-primary flex justify-between font-bold">
                      <span>Verified:</span>
                      <span>18/25 ✓</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
                  4/5 Capabilities Approved
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-[#d97706]/30 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-on-surface">Pillar 2</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d97706]/10 text-[#d97706] flex items-center gap-0.5">
                      ◐ In Review
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface mb-2">Renewable Energy</h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-on-surface-variant flex justify-between">
                      <span>Assessment:</span>
                      <span className="font-semibold text-on-surface">19/25</span>
                    </p>
                    <p className="text-[#d97706] flex justify-between font-semibold">
                      <span>Verified:</span>
                      <span>16/25 (In Review)</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
                  Telemetry logs undergoing review
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-primary/30 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-on-surface">Pillar 3</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary flex items-center gap-0.5">
                      ✓ Verified
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface mb-2">Food Safety &amp; Quality</h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-on-surface-variant flex justify-between">
                      <span>Assessment:</span>
                      <span className="font-semibold text-on-surface">22/25</span>
                    </p>
                    <p className="text-primary flex justify-between font-bold">
                      <span>Verified:</span>
                      <span>20/25 ✓</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
                  Packhouse &amp; spray records validated
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-on-surface">Pillar 4</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container-high text-on-surface-variant">
                      ○ Not Started
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface mb-2">Climate Resilience</h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-on-surface-variant flex justify-between">
                      <span>Assessment:</span>
                      <span className="font-semibold text-on-surface">16/25</span>
                    </p>
                    <p className="text-outline flex justify-between">
                      <span>Verified:</span>
                      <span>--/25</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
                  Evidence submission open
                </div>
              </div>

              {/* Pillar 5 */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-[#d97706]/30 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-on-surface">Pillar 5</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d97706]/10 text-[#d97706] flex items-center gap-0.5">
                      ◐ In Review
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface mb-2">Business Performance</h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-on-surface-variant flex justify-between">
                      <span>Assessment:</span>
                      <span className="font-semibold text-on-surface">18/25</span>
                    </p>
                    <p className="text-[#d97706] flex justify-between font-semibold">
                      <span>Verified:</span>
                      <span>15/25 (In Review)</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
                  P&amp;L records under verification call
                </div>
              </div>

              {/* Pillar 6 */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-on-surface">Pillar 6</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container-high text-on-surface-variant">
                      ○ Not Started
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface mb-2">Human Capital</h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-on-surface-variant flex justify-between">
                      <span>Assessment:</span>
                      <span className="font-semibold text-on-surface">17/25</span>
                    </p>
                    <p className="text-outline flex justify-between">
                      <span>Verified:</span>
                      <span>--/25</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
                  Evidence submission open
                </div>
              </div>

              {/* Pillar 7 */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-on-surface">Pillar 7</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container-high text-on-surface-variant">
                      ○ Not Started
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface mb-2">Market Access</h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-on-surface-variant flex justify-between">
                      <span>Assessment:</span>
                      <span className="font-semibold text-on-surface">20/25</span>
                    </p>
                    <p className="text-outline flex justify-between">
                      <span>Verified:</span>
                      <span>--/25</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
                  Evidence submission open
                </div>
              </div>

              {/* Pillar 8 */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-on-surface">Pillar 8</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container-high text-on-surface-variant">
                      ○ Not Started
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface mb-2">Investment Readiness</h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-on-surface-variant flex justify-between">
                      <span>Assessment:</span>
                      <span className="font-semibold text-on-surface">15/25</span>
                    </p>
                    <p className="text-outline flex justify-between">
                      <span>Verified:</span>
                      <span>--/25</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
                  Evidence submission open
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex justify-between items-center py-4 text-xs text-on-surface-variant px-4 border-t border-outline-variant/30">
            <p>Last Assessment: 15 May 2025</p>
            <p>Next Assessment Recommended: 15 Aug 2025</p>
          </div>
        </div>

        {/* Modal: View Progress Over Time */}
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
                    <span className="text-xs font-bold text-on-surface block">Q1 2025 • Post Soil & Water Audit</span>
                    <span className="text-[11px] text-on-surface-variant">Stage: Developing Farm</span>
                  </div>
                  <span className="text-sm font-extrabold text-on-surface-variant">14 / 24</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/30">
                  <div>
                    <span className="text-xs font-bold text-primary block">Q2 2025 (Current) • Structured Audit</span>
                    <span className="text-[11px] text-primary/80">Stage: Structured Farm</span>
                  </div>
                  <span className="text-base font-black text-primary">16 / 24</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-dashed border-outline-variant">
                  <div>
                    <span className="text-xs font-bold text-on-surface-variant block">Q3 2025 (Target Projection)</span>
                    <span className="text-[11px] text-on-surface-variant">Target: Future-Ready Farm</span>
                  </div>
                  <span className="text-sm font-bold text-secondary">19 / 24</span>
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
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">assignment</span>
                  <h3 className="text-lg font-bold text-on-surface">Complete 8-Pillar Development Plan</h3>
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
                Prioritized capability milestones across all 8 Future Farms transformation pillars.
              </p>

              <div className="space-y-3 mb-6">
                {ALL_PILLARS.map((p, idx) => (
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
                    <Link
                      href="/assessment"
                      className="px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors shrink-0"
                    >
                      Audit
                    </Link>
                  </div>
                ))}
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
            <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-outline-variant animate-fade-in-up">
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
                These capabilities are operating at or above the Future-Ready benchmark:
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-900 mb-1">
                    <span className="material-symbols-outlined text-emerald-700 text-sm fill">check_circle</span>
                    <span>P4.4: Soil & Water Conservation Ecosystem</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">Practicing cover cropping, biological mulching, and rainwater retention.</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-900 mb-1">
                    <span className="material-symbols-outlined text-emerald-700 text-sm fill">check_circle</span>
                    <span>P3.2: Export Traceability & Hygiene</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">Harvest batch tagging and sanitized sorting tables in place.</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-900 mb-1">
                    <span className="material-symbols-outlined text-emerald-700 text-sm fill">check_circle</span>
                    <span>P7.1: Direct Premium Offtaker Contracts</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">Long-term supply agreements established with wholesale distributors.</p>
                </div>
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
            <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-outline-variant animate-fade-in-up">
              <div className="flex justify-between items-center mb-4 border-b border-surface-variant pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-2xl">priority_high</span>
                  <h3 className="text-lg font-bold text-on-surface">Urgent Priority Gap Areas</h3>
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
                Targeting these 3 priority areas will yield the highest ROI on your overall maturity score:
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-900 mb-1">
                    <span className="material-symbols-outlined text-rose-700 text-sm fill">warning</span>
                    <span>Pillar 2 • Renewable Energy Integration (Score: 40%)</span>
                  </div>
                  <p className="text-[11px] text-rose-800">High diesel generator expenditure. Solar drip irrigation transition recommended.</p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-900 mb-1">
                    <span className="material-symbols-outlined text-rose-700 text-sm fill">warning</span>
                    <span>Pillar 8 • Financial Documentation (Score: 45%)</span>
                  </div>
                  <p className="text-[11px] text-rose-800">Incomplete balance sheet and seasonal cash flow modeling limit bank loan eligibility.</p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-900 mb-1">
                    <span className="material-symbols-outlined text-rose-700 text-sm fill">warning</span>
                    <span>Pillar 6 • Formal Workforce Contracts (Score: 50%)</span>
                  </div>
                  <p className="text-[11px] text-rose-800">Establish written health & safety equipment logs for casual workers.</p>
                </div>
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
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
