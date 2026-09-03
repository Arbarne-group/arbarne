"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import RadarChart from "@/components/dashboard/RadarChart";

export default function DashboardPage() {
  const [assessment, setAssessment] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const pillarDetails = [
    { name: "Market Access & Contracts", score: 90, status: "Leading", color: "bg-primary" },
    { name: "Business & Financials", score: 88, status: "Leading", color: "bg-primary" },
    { name: "Soil & Crop Health", score: 84, status: "Advancing", color: "bg-primary" },
    { name: "Labor & Team Mgmt", score: 80, status: "Advancing", color: "bg-primary" },
    { name: "Post-Harvest Quality", score: 79, status: "Advancing", color: "bg-primary-container" },
    { name: "Water & Irrigation", score: 78, status: "Advancing", color: "bg-primary-container" },
    { name: "Climate Resilience", score: 75, status: "Developing", color: "bg-secondary" },
    { name: "Tech & Mechanization", score: 72, status: "Developing", color: "bg-secondary" },
  ];

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
              Comprehensive Future Farms Maturity &amp; Capability Index
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Downloading Farm Transformation Plan (PDF)...")}
              className="px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export PDF Plan</span>
            </button>
            <Link
              href="/pricing"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-semibold text-xs flex items-center gap-1.5 shadow-sm btn-shadow hover-lift transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
              <span>Re-Assess</span>
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
                  Overall Maturity Score
                </span>
                <div className="flex items-baseline gap-3 my-4">
                  <span className="text-5xl md:text-6xl font-extrabold text-primary">
                    82
                  </span>
                  <span className="text-xl font-bold text-on-surface-variant">
                    / 100
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-container/20 text-primary text-xs font-bold mb-4">
                  <span className="material-symbols-outlined text-sm fill">workspace_premium</span>
                  <span>Classification: Advancing Stage</span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Your farm scores higher than <strong>84% of surveyed commercial farms</strong> in your regional agro-ecological zone.
                </p>
              </div>

              <div className="pt-6 border-t border-surface-variant/50 mt-6">
                <div className="flex justify-between items-center text-xs font-semibold mb-2 text-on-surface">
                  <span>Pillars Optimized</span>
                  <span className="text-primary font-bold">6 of 8 Strong</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "75%" }} />
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
                  Comparison between your assessed operational baseline and regional benchmarks
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary inline-block" />
                  Your Score
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-secondary inline-block" />
                  Benchmark
                </span>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="flex-1">
              <RadarChart
                labels={[
                  "Soil & Crops",
                  "Water Mgmt",
                  "Technology",
                  "Business",
                  "Labor & Team",
                  "Resilience",
                  "Market Access",
                  "Post-Harvest",
                ]}
                scores={[84, 78, 72, 88, 80, 75, 90, 79]}
                benchmarkScores={[65, 60, 50, 70, 62, 58, 72, 60]}
              />
            </div>
          </div>
        </div>

        {/* Middle Section: Pillar Breakdown */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
          <h3 className="text-lg font-bold text-on-surface mb-6">
            Detailed Pillar Performance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillarDetails.map((pillar) => (
              <div
                key={pillar.name}
                className="p-4 rounded-2xl border border-surface-variant/60 bg-surface/50 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-on-surface">
                    {pillar.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pillar.status === "Leading"
                        ? "bg-primary/10 text-primary"
                        : pillar.status === "Advancing"
                        ? "bg-secondary-container text-secondary"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {pillar.status}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-2xl font-bold text-on-surface">
                    {pillar.score}
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    / 100
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`${pillar.color} h-full rounded-full`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Action Recommendations */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl fill">
              lightbulb
            </span>
            <h3 className="text-lg font-bold text-on-surface">
              Top 3 Priority Growth Opportunities
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  1. Automation &amp; Telemetry
                </span>
                <h4 className="text-sm font-bold text-on-surface mt-1 mb-2">
                  Automated Drip Scheduling
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Integrate solar-powered soil moisture probes with automated solenoid valves to cut diesel pumping costs by 28%.
                </p>
              </div>
              <button
                onClick={() => alert("Connecting to Service Desk for Irrigation Partners...")}
                className="mt-4 text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Explore Providers &rarr;
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-secondary/30 bg-secondary/5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  2. Post-Harvest Preservation
                </span>
                <h4 className="text-sm font-bold text-on-surface mt-1 mb-2">
                  Decentralized Solar Cold Storage
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Deploy modular pre-cooling lockers to extend organic leafy green shelf-life from 2 days to 11 days.
                </p>
              </div>
              <button
                onClick={() => alert("Opening Cold Chain Financing Options...")}
                className="mt-4 text-xs font-bold text-secondary hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                View Financing Options &rarr;
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-outline-variant bg-surface flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  3. Delegation &amp; Workforce
                </span>
                <h4 className="text-sm font-bold text-on-surface mt-1 mb-2">
                  Codified SOP Handbooks
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Document harvest grading rules and packaging specs so farm managers can run shifts without daily owner oversight.
                </p>
              </div>
              <button
                onClick={() => alert("Opening SOP Digital Templates...")}
                className="mt-4 text-xs font-bold text-on-surface hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Download Templates &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
