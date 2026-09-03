"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  PILLAR_1_CAPABILITIES,
  AssessmentQuestion,
  Capability,
} from "@/data/pillar1Questions";

export default function Pillar1AssessmentPage() {
  // Answers state: { [questionId: string]: "yes" | "no" }
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<"all" | "gaps" | "strengths">("all");
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Load cached answers from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("future_farms_pillar1_answers");
      if (saved) {
        setAnswers(JSON.parse(saved));
      } else {
        // Default initial baseline for realistic demo: mix of Yes and No
        const initialBaseline: Record<string, "yes" | "no"> = {
          "P1.1.1": "yes",
          "P1.1.2": "yes",
          "P1.1.3": "no",
          "P1.1.4": "no",
          "P1.1.5": "no",
          "P1.2.1": "yes",
          "P1.2.2": "yes",
          "P1.2.3": "yes",
          "P1.2.4": "no",
          "P1.2.5": "yes",
          "P1.3.1": "yes",
          "P1.3.2": "yes",
          "P1.3.3": "no",
          "P1.3.4": "yes",
          "P1.3.5": "no",
          "P1.4.1": "yes",
          "P1.4.2": "yes",
          "P1.4.3": "no",
          "P1.4.4": "yes",
          "P1.4.5": "no",
          "P1.5.1": "yes",
          "P1.5.2": "yes",
          "P1.5.3": "no",
          "P1.5.4": "yes",
          "P1.5.5": "no",
        };
        setAnswers(initialBaseline);
        localStorage.setItem(
          "future_farms_pillar1_answers",
          JSON.stringify(initialBaseline)
        );
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save answers to localStorage
  const handleSelectAnswer = (questionId: string, value: "yes" | "no") => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    try {
      localStorage.setItem(
        "future_farms_pillar1_answers",
        JSON.stringify(updated)
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Flatten all 25 questions
  const allQuestions = useMemo(() => {
    return PILLAR_1_CAPABILITIES.flatMap((cap) => cap.questions);
  }, []);

  // Calculation Engine based on assessment best practices
  const totalQuestions = allQuestions.length; // 25
  const answeredCount = Object.keys(answers).length;
  const yesCount = Object.values(answers).filter((v) => v === "yes").length;
  const noCount = Object.values(answers).filter((v) => v === "no").length;

  // Overall Pillar 1 Score (0 - 100%)
  const pillarScore = Math.round((yesCount / totalQuestions) * 100);

  // Maturity Tier Classification
  const getMaturityTier = (score: number) => {
    if (score >= 80)
      return {
        label: "Leading Stage",
        desc: "Exemplary digital operations and institutional readiness",
        color: "text-primary bg-primary/10 border-primary/20",
        badgeColor: "bg-primary text-white",
      };
    if (score >= 60)
      return {
        label: "Advancing Stage",
        desc: "Robust digital capabilities with strategic growth opportunities",
        color: "text-primary bg-primary-container/20 border-primary-container",
        badgeColor: "bg-primary text-white",
      };
    if (score >= 40)
      return {
        label: "Developing Stage",
        desc: "Foundational digital adoption with key operational gaps",
        color: "text-amber-800 bg-amber-50 border-amber-200",
        badgeColor: "bg-amber-600 text-white",
      };
    return {
      label: "Emerging Stage",
      desc: "Early stage digital awareness; immediate quick wins required",
      color: "text-rose-800 bg-rose-50 border-rose-200",
      badgeColor: "bg-rose-600 text-white",
    };
  };

  const currentTier = getMaturityTier(pillarScore);

  // Capability Scores Calculation: (Yes in capability / 5) * 100%
  const capabilityScores = useMemo(() => {
    const scores: Record<
      string,
      { yes: number; total: number; percent: number }
    > = {};

    PILLAR_1_CAPABILITIES.forEach((cap) => {
      const capYes = cap.questions.filter(
        (q) => answers[q.id] === "yes"
      ).length;
      scores[cap.id] = {
        yes: capYes,
        total: cap.questions.length,
        percent: Math.round((capYes / cap.questions.length) * 100),
      };
    });

    return scores;
  }, [answers]);

  // Questions to display based on active tab and filter mode
  const displayedCapabilities = useMemo(() => {
    if (activeTab === "all") {
      return PILLAR_1_CAPABILITIES.map((cap) => ({
        ...cap,
        questions: cap.questions.filter((q) => {
          if (filterMode === "gaps") return answers[q.id] === "no";
          if (filterMode === "strengths") return answers[q.id] === "yes";
          return true;
        }),
      }));
    }

    const selectedCap = PILLAR_1_CAPABILITIES.find((c) => c.id === activeTab);
    if (!selectedCap) return [];

    return [
      {
        ...selectedCap,
        questions: selectedCap.questions.filter((q) => {
          if (filterMode === "gaps") return answers[q.id] === "no";
          if (filterMode === "strengths") return answers[q.id] === "yes";
          return true;
        }),
      },
    ];
  }, [activeTab, filterMode, answers]);

  // All identified gaps (answered "no")
  const identifiedGaps = useMemo(() => {
    return allQuestions.filter((q) => answers[q.id] === "no");
  }, [allQuestions, answers]);

  const quickWinGaps = identifiedGaps.filter(
    (q) => q.priority === "🟢 Quick Win"
  );
  const mediumTermGaps = identifiedGaps.filter(
    (q) => q.priority === "🟡 Medium Term"
  );
  const strategicGaps = identifiedGaps.filter(
    (q) => q.priority === "🔵 Strategic"
  );

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-28">
        {/* Top Breadcrumbs & Page Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm fill">
              fact_check
            </span>
            <span>Future Farms Framework • Diagnostic Audit</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-surface-variant pb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                Pillar 1: Smart Farming &amp; Digital Transformation
              </h1>
              <p className="text-sm md:text-base text-on-surface-variant max-w-3xl mt-1">
                Evaluate your farm across 5 digital capabilities (25 questions).
                Detailed recommendations are generated automatically when a capability is not yet in place.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowSummaryModal(true)}
                className="px-4 py-2.5 rounded-xl border border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">
                  assignment
                </span>
                <span>View Gap Roadmap ({noCount})</span>
              </button>

              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs btn-shadow hover-lift flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  insights
                </span>
                <span>My Farm Radar</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Real-Time Scoring Banner */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/50 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Score & Tier */}
            <div className="md:col-span-4 flex items-center gap-5 border-b md:border-b-0 md:border-r border-surface-variant/50 pb-6 md:pb-0 md:pr-6">
              <div className="w-20 h-20 rounded-2xl bg-primary-container/20 flex flex-col items-center justify-center shrink-0 border border-primary/20">
                <span className="text-3xl font-extrabold text-primary leading-none">
                  {pillarScore}%
                </span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase mt-1">
                  Pillar Score
                </span>
              </div>
              <div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1.5 ${currentTier.badgeColor}`}
                >
                  {currentTier.label}
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {currentTier.desc}
                </p>
              </div>
            </div>

            {/* Middle: Progress & Breakdown Stats */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-on-surface">
                <span>
                  Audit Completion: {answeredCount} of {totalQuestions} answered
                </span>
                <span className="text-primary font-bold">
                  {Math.round((answeredCount / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(answeredCount / totalQuestions) * 100}%`,
                  }}
                />
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-primary font-semibold">
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  <span>{yesCount} Verified Strengths</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                  <span className="material-symbols-outlined text-[16px]">
                    lightbulb
                  </span>
                  <span>{noCount} Active Action Plans</span>
                </span>
              </div>
            </div>

            {/* Right: Recommendation Rule Notice */}
            <div className="md:col-span-3 bg-surface p-4 rounded-2xl border border-outline-variant/50 text-xs space-y-1">
              <div className="font-bold text-on-surface flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[18px]">
                  tune
                </span>
                <span>Scoring Rules</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Selecting <strong>&quot;No&quot;</strong> instantly reveals the personalized
                recommendation and quick win. Selecting <strong>&quot;Yes&quot;</strong> verifies the
                capability and keeps recommendations hidden.
              </p>
            </div>
          </div>
        </div>

        {/* Capability Navigation Tabs & Filter Strip */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-variant pb-3">
            {/* Capability Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                All 5 Capabilities
              </button>

              {PILLAR_1_CAPABILITIES.map((cap) => {
                const score = capabilityScores[cap.id]?.percent ?? 0;
                return (
                  <button
                    key={cap.id}
                    type="button"
                    onClick={() => setActiveTab(cap.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      activeTab === cap.id
                        ? "bg-primary text-white shadow-sm"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                    }`}
                  >
                    <span>
                      {cap.id} {cap.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        activeTab === cap.id
                          ? "bg-white/20 text-white"
                          : "bg-primary-container/25 text-primary"
                      }`}
                    >
                      {score}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Filter: All vs Gaps Only vs Strengths */}
            <div className="flex items-center gap-1 bg-surface-container-high p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterMode === "all"
                    ? "bg-surface-container-lowest text-on-surface shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("gaps")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  filterMode === "gaps"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span>Gaps Only</span>
                <span className="text-[10px] opacity-90">({noCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("strengths")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  filterMode === "strengths"
                    ? "bg-primary text-white shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span>Strengths</span>
                <span className="text-[10px] opacity-90">({yesCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Questionnaire Capabilities & Questions */}
        <div className="space-y-10">
          {displayedCapabilities.map((capability) => {
            const capScore = capabilityScores[capability.id]?.percent ?? 0;
            const capYesCount = capabilityScores[capability.id]?.yes ?? 0;

            if (capability.questions.length === 0) {
              return (
                <div
                  key={capability.id}
                  className="bg-surface-container-lowest rounded-3xl p-8 border border-surface-variant/40 text-center"
                >
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">
                    filter_list_off
                  </span>
                  <p className="text-sm font-semibold text-on-surface">
                    No questions match the current &quot;{filterMode}&quot; filter in{" "}
                    {capability.name}.
                  </p>
                </div>
              );
            }

            return (
              <section
                key={capability.id}
                className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-6"
              >
                {/* Capability Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant/50 pb-5">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                        Capability {capability.id}
                      </span>
                      <h2 className="text-xl font-bold text-on-surface">
                        {capability.name}
                      </h2>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      <strong className="text-on-surface">Focus:</strong>{" "}
                      {capability.focus}
                    </p>
                  </div>

                  {/* Capability Score Badge */}
                  <div className="text-left sm:text-right shrink-0">
                    <div className="flex items-baseline gap-1.5 sm:justify-end">
                      <span className="text-2xl font-black text-primary">
                        {capScore}%
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        ({capYesCount}/5 Yes)
                      </span>
                    </div>
                    <div className="w-32 bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${capScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                  {capability.questions.map((q, idx) => {
                    const currentAnswer = answers[q.id];
                    const isYes = currentAnswer === "yes";
                    const isNo = currentAnswer === "no";

                    return (
                      <div
                        key={q.id}
                        className={`rounded-2xl border p-5 md:p-6 transition-all duration-200 ${
                          isNo
                            ? "border-amber-300 bg-amber-50/20 shadow-xs"
                            : isYes
                            ? "border-primary/30 bg-primary-container/5"
                            : "border-outline-variant/60 bg-surface/30"
                        }`}
                      >
                        {/* Question Prompt Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3.5 max-w-3xl">
                            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg shrink-0 mt-0.5">
                              {q.id}
                            </span>
                            <div>
                              <h3 className="text-sm md:text-base font-semibold text-on-surface leading-snug">
                                {q.question}
                              </h3>
                              <p className="text-[11px] text-on-surface-variant mt-1.5 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                                  inventory_2
                                </span>
                                <span>
                                  <strong>FFV Evidence:</strong>{" "}
                                  {q.evidenceRequired}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Yes / No Toggle Buttons */}
                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            {/* YES Button */}
                            <button
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, "yes")}
                              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                isYes
                                  ? "bg-primary text-white shadow-sm ring-2 ring-primary ring-offset-1"
                                  : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                check
                              </span>
                              <span>Yes</span>
                            </button>

                            {/* NO Button */}
                            <button
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, "no")}
                              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                isNo
                                  ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-600 ring-offset-1"
                                  : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                close
                              </span>
                              <span>No</span>
                            </button>
                          </div>
                        </div>

                        {/* CONDITIONAL RECOMMENDATION LOGIC:
                            - When "no" is selected: Recommendation, Why it Matters, Quick Win, and Support Available expand.
                            - When "yes" is selected: Recommendations STAY HIDDEN throughout. */}
                        {isNo && (
                          <div className="mt-5 pt-5 border-t border-amber-200/80 space-y-4 animate-fade-in">
                            {/* Alert Banner */}
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-700 text-[18px]">
                                  lightbulb
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                                  Action Plan &amp; Guidance
                                </span>
                              </div>
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-surface text-on-surface border border-outline-variant/60">
                                Priority: {q.priority}
                              </span>
                            </div>

                            {/* Recommendation Body */}
                            <div className="bg-surface rounded-xl p-4 border border-outline-variant/60 space-y-3">
                              <div>
                                <h4 className="text-xs font-bold text-on-surface mb-0.5">
                                  Recommended Intervention
                                </h4>
                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                  {q.recommendation}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-surface-variant/40">
                                <div>
                                  <h5 className="text-[11px] font-bold text-on-surface mb-0.5">
                                    Why It Matters
                                  </h5>
                                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                    {q.whyItMatters}
                                  </p>
                                </div>
                                <div className="bg-primary/5 p-2.5 rounded-lg border border-primary/15">
                                  <h5 className="text-[11px] font-bold text-primary mb-0.5 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">
                                      bolt
                                    </span>
                                    <span>Immediate Quick Win</span>
                                  </h5>
                                  <p className="text-[11px] text-on-surface leading-relaxed">
                                    {q.quickWin}
                                  </p>
                                </div>
                              </div>

                              {/* Support Available */}
                              <div className="pt-2 border-t border-surface-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                                <span className="text-on-surface-variant">
                                  <strong>Support Channel:</strong>{" "}
                                  {q.supportAvailable}
                                </span>
                                <Link
                                  href="/service-desk"
                                  className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                                >
                                  Request Support on Service Desk &rarr;
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Confirmation when YES is selected */}
                        {isYes && (
                          <div className="mt-3 flex items-center gap-2 text-[11px] text-primary font-semibold">
                            <span className="material-symbols-outlined text-[15px] fill">
                              check_circle
                            </span>
                            <span>
                              Capability demonstrated. Recommendation is hidden as this capability requirement is fulfilled.
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Floating Bottom Bar: Live Score & Action */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <span className="text-xs text-on-surface-variant font-medium">
              Pillar 1 Maturity:
            </span>
            <span className="text-lg font-black text-primary">
              {pillarScore}% ({yesCount} / 25 Yes)
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${currentTier.badgeColor}`}
            >
              {currentTier.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSummaryModal(true)}
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs transition-all cursor-pointer"
            >
              Review Action Plan ({noCount} Gaps)
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs btn-shadow hover-lift transition-all flex items-center gap-1.5"
            >
              <span>Apply to Farm Radar</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        {/* Modal: Full Action Plan & Identified Gaps */}
        {showSummaryModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl border border-surface-variant my-8 max-h-[90vh] flex flex-col animate-fade-in-up">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-surface-variant pb-4 mb-6 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary uppercase">
                      Action Plan
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {noCount} Improvement Areas
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-on-surface">
                    Pillar 1 Gap Analysis &amp; Quick Wins
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSummaryModal(false)}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="overflow-y-auto pr-2 space-y-6 flex-1">
                {noCount === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <span className="material-symbols-outlined text-5xl text-primary fill">
                      verified
                    </span>
                    <h4 className="text-lg font-bold text-on-surface">
                      Outstanding! Zero Gaps Identified
                    </h4>
                    <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                      Your farm has verified all 25 capabilities in Smart Farming &amp;
                      Digital Transformation. Your farm is operating at a Leading
                      Benchmark.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Quick Wins Group */}
                    {quickWinGaps.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            🟢 High Priority: Quick Wins ({quickWinGaps.length})
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {quickWinGaps.map((gap) => (
                            <div
                              key={gap.id}
                              className="p-4 rounded-xl bg-surface border border-emerald-200/60 text-xs space-y-1.5"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-bold text-on-surface">
                                  {gap.id}: {gap.question}
                                </span>
                                <span className="font-mono text-[10px] text-on-surface-variant shrink-0">
                                  Cap {gap.capabilityId}
                                </span>
                              </div>
                              <p className="text-on-surface-variant leading-relaxed">
                                <strong>Action:</strong> {gap.recommendation}
                              </p>
                              <div className="bg-emerald-50 p-2 rounded-lg text-[11px] text-emerald-900 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">
                                  bolt
                                </span>
                                <span>
                                  <strong>Quick Win:</strong> {gap.quickWin}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Medium Term Group */}
                    {mediumTermGaps.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            🟡 Medium Term Enhancements ({mediumTermGaps.length})
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {mediumTermGaps.map((gap) => (
                            <div
                              key={gap.id}
                              className="p-4 rounded-xl bg-surface border border-amber-200/60 text-xs space-y-1.5"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-bold text-on-surface">
                                  {gap.id}: {gap.question}
                                </span>
                                <span className="font-mono text-[10px] text-on-surface-variant shrink-0">
                                  Cap {gap.capabilityId}
                                </span>
                              </div>
                              <p className="text-on-surface-variant leading-relaxed">
                                <strong>Action:</strong> {gap.recommendation}
                              </p>
                              <p className="text-[11px] text-on-surface-variant">
                                <strong>Support:</strong> {gap.supportAvailable}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strategic Group */}
                    {strategicGaps.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                            🔵 Strategic Roadmaps ({strategicGaps.length})
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {strategicGaps.map((gap) => (
                            <div
                              key={gap.id}
                              className="p-4 rounded-xl bg-surface border border-blue-200/60 text-xs space-y-1.5"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-bold text-on-surface">
                                  {gap.id}: {gap.question}
                                </span>
                                <span className="font-mono text-[10px] text-on-surface-variant shrink-0">
                                  Cap {gap.capabilityId}
                                </span>
                              </div>
                              <p className="text-on-surface-variant leading-relaxed">
                                <strong>Action:</strong> {gap.recommendation}
                              </p>
                              <p className="text-[11px] text-on-surface-variant">
                                <strong>Support:</strong> {gap.supportAvailable}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-surface-variant flex justify-between items-center gap-3 shrink-0 mt-4">
                <span className="text-xs text-on-surface-variant">
                  {noCount} gaps to address for a 100% Leading Score
                </span>
                <button
                  type="button"
                  onClick={() => setShowSummaryModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary/90 transition-all btn-shadow cursor-pointer"
                >
                  Return to Assessment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
