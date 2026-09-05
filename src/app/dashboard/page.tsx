"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import RadarChart from "@/components/dashboard/RadarChart";
import { ALL_PILLARS } from "@/data/allPillarsData";
import {
  computeAssessmentResults,
  getMaturityTier,
  OverallAssessmentResult,
} from "@/lib/assessmentScoring";
import { PILLAR_BRANDS } from "@/data/brandColors";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assessmentResult, setAssessmentResult] = useState<OverallAssessmentResult | null>(null);

  useEffect(() => {
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Load answers from localStorage
    try {
      const saved = localStorage.getItem("future_farms_all_answers");
      if (saved) {
        const answers = JSON.parse(saved);
        setAssessmentResult(computeAssessmentResults(answers));
      } else {
        // Compute with empty to get initial framework structure
        setAssessmentResult(computeAssessmentResults({}));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute canonical radar labels & scores
  const radarData = useMemo(() => {
    const labels = ALL_PILLARS.map((p) => {
      // Short friendly name for chart axis
      if (p.id === 1) return "Digital Tech";
      if (p.id === 2) return "Renewable Energy";
      if (p.id === 3) return "Food Safety";
      if (p.id === 4) return "Climate Resilience";
      if (p.id === 5) return "Farm Business";
      if (p.id === 6) return "Human Capital";
      if (p.id === 7) return "Market Access";
      return "Investment Ready";
    });

    const scores = ALL_PILLARS.map((p) => {
      const pResult = assessmentResult?.pillarScores.find((r) => r.pillarId === p.id);
      return pResult ? pResult.score : 75;
    });

    // Regional benchmark scores for comparison
    const benchmarkScores = [60, 52, 65, 58, 70, 62, 68, 55];

    return { labels, scores, benchmarkScores };
  }, [assessmentResult]);

  const pillarDetails = useMemo(() => {
    return ALL_PILLARS.map((p) => {
      const pResult = assessmentResult?.pillarScores.find((r) => r.pillarId === p.id);
      const score = pResult ? pResult.score : 75;
      const tier = getMaturityTier(score);

      return {
        id: p.id,
        name: p.name,
        score,
        yesCount: pResult?.yesCount ?? 0,
        noCount: pResult?.noCount ?? 0,
        status: tier.label.replace(" Stage", ""),
        badgeColor:
          score >= 80
            ? "bg-primary/10 text-primary border-primary/20"
            : score >= 60
            ? "bg-primary-container/20 text-primary border-primary/20"
            : score >= 40
            ? "bg-amber-100 text-amber-800 border-amber-200"
            : "bg-rose-100 text-rose-800 border-rose-200",
        barColor:
          score >= 80 ? "bg-primary" : score >= 60 ? "bg-primary/80" : "bg-amber-600",
      };
    });
  }, [assessmentResult]);

  const overallScore = assessmentResult?.overallFfmiScore ?? 78;
  const maturityTier = getMaturityTier(overallScore);

  return (
    <AppShell
      userName={user?.name || "Keziah Wanjiku"}
      userRole={user?.farmerProfile?.jobTitle === "owner" ? "Farm Owner" : "Farm Operator"}
    >
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-10 py-6 space-y-8 pb-20">
        {/* Page Title & Farm Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-sm fill">verified</span>
              <span>Verified Assessment • 2026 Audit</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface">
              {user?.farmName || "Highland Greens Organic Farm"}
            </h1>
            <p className="text-sm text-on-surface-variant">
              Comprehensive Future Farms Maturity &amp; Capability Index across all 8 Pillars
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => alert("Downloading Farm Transformation Plan (PDF)...")}
              className="px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export PDF Plan</span>
            </button>
            <Link
              href="/assessment"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-semibold text-xs flex items-center gap-1.5 shadow-sm btn-shadow hover-lift transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              <span>Update Assessment</span>
            </Link>
          </div>
        </div>

        {/* Top Bento Grid: Overall Score & Interactive Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Overall Index Score Card */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Overall Maturity Score (FFMI)
                </span>
                <div className="flex items-baseline gap-3 my-4">
                  <span className="text-5xl md:text-6xl font-extrabold text-primary">
                    {overallScore}
                  </span>
                  <span className="text-xl font-bold text-on-surface-variant">
                    / 100
                  </span>
                </div>

                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border ${maturityTier.badgeColor}`}
                >
                  <span className="material-symbols-outlined text-sm fill">workspace_premium</span>
                  <span>Classification: {maturityTier.label}</span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {maturityTier.description}
                </p>
              </div>

              <div className="pt-6 border-t border-surface-variant/50 mt-6 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-on-surface">
                  <span>8-Pillar Alignment</span>
                  <span className="text-primary font-bold">
                    {pillarDetails.filter((p) => p.score >= 60).length} of 8 Strong
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(pillarDetails.filter((p) => p.score >= 60).length / 8) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-on-surface-variant pt-1">
                  <span>Total Answered: {assessmentResult?.totalAnswered ?? 0}/200</span>
                  <Link href="/assessment" className="text-primary font-bold hover:underline">
                    View Assessment &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Radar Chart Canvas */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-on-surface">
                  8-Pillar Farm Maturity Spider Diagram
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Comparison between your live assessment scores and regional benchmarks
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary inline-block" />
                  Your Farm
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-secondary inline-block" />
                  Regional Benchmark
                </span>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="flex-1">
              <RadarChart
                labels={radarData.labels}
                scores={radarData.scores}
                benchmarkScores={radarData.benchmarkScores}
              />
            </div>
          </div>
        </div>

        {/* Middle Section: Pillar Breakdown */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface">
                Detailed 8-Pillar Performance
              </h3>
              <p className="text-xs text-on-surface-variant">
                Click on any pillar card to view its diagnostic questions and tailored action plan.
              </p>
            </div>
            <Link
              href="/assessment"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Open Assessment</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillarDetails.map((pillar) => {
              const pBrand = PILLAR_BRANDS[pillar.id];
              return (
                <Link
                  key={pillar.id}
                  href="/assessment"
                  className="p-4 rounded-2xl border border-surface-variant/60 bg-surface/50 hover:bg-surface-container-high transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2.5 max-w-[70%]">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${pBrand.iconBg} ${pBrand.iconColor}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {pBrand.icon}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-primary block">
                          Pillar 0{pillar.id}
                        </span>
                        <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                          {pillar.name}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pillar.badgeColor}`}
                    >
                      {pillar.status}
                    </span>
                  </div>

                <div className="flex items-baseline justify-between my-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-on-surface">
                      {pillar.score}%
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      ({pillar.yesCount}/25)
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-700 font-semibold">
                    {pillar.noCount} Gaps
                  </span>
                </div>

                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`${pillar.barColor} h-full rounded-full transition-all duration-300`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
              </Link>
            );
          })}
          </div>
        </div>

        {/* Action Priority Quick Wins */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary uppercase">Prescriptive Interventions</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Priority Actions
                </span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">
                Immediate Transformation Roadmap
              </h3>
              <p className="text-xs text-on-surface-variant">
                Targeted actions to unlock higher productivity, credit access, and export compliance.
              </p>
            </div>
            <Link
              href="/assessment"
              className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-colors self-start sm:self-center"
            >
              View Full Gap Roadmap &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  🟢 Quick Win
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-emerald-800 border border-emerald-200">
                  Pillar 1 • Digital
                </span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">
                Daily Digital Activity Logs
              </h4>
              <p className="text-xs text-on-surface-variant">
                Begin recording routine farm operations on smartphone to establish auditable yield and input history.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-emerald-800">
                Support: FAAB Record Keeping Module
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  🟡 Medium Term
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-amber-800 border border-amber-200">
                  Pillar 2 • Energy
                </span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">
                Solar Irrigation Feasibility
              </h4>
              <p className="text-xs text-on-surface-variant">
                Evaluate expected costs, fuel savings, and crop yield increase by transitioning pump to solar PV.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-amber-800">
                Support: Clean Farms Advisory
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                  🔵 Strategic
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-blue-800 border border-blue-200">
                  Pillar 8 • Investment
                </span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">
                Investor-Grade Financial Audit
              </h4>
              <p className="text-xs text-on-surface-variant">
                Compile 3-year cash flow statements and asset register to qualify for blended agricultural credit.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-blue-800">
                Support: Commercial Banks &amp; Future Farms Hub
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
