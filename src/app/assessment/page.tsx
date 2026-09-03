"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  ALL_PILLARS,
  PillarData,
  Capability,
  AssessmentQuestion,
} from "@/data/allPillarsData";
import {
  computeAssessmentResults,
  getMaturityTier,
} from "@/lib/assessmentScoring";

export default function AssessmentPage() {
  const [selectedPillarId, setSelectedPillarId] = useState<number>(1);
  const [activeCapId, setActiveCapId] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<"all" | "gaps" | "strengths">("all");
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [roadmapScope, setRoadmapScope] = useState<"current" | "all">("current");

  // Load answers from localStorage on mount, seeding defaults if empty
  useEffect(() => {
    try {
      const saved = localStorage.getItem("future_farms_all_answers");
      if (saved) {
        setAnswers(JSON.parse(saved));
      } else {
        // Initial realistic baseline answers: high maturity in digital & soil, moderate in energy & market
        const initialAnswers: Record<string, "yes" | "no"> = {};

        ALL_PILLARS.forEach((pillar) => {
          pillar.capabilities.forEach((cap, cIdx) => {
            cap.questions.forEach((q, qIdx) => {
              // Create realistic variation
              if (pillar.id === 1) {
                // Digital: 18 Yes, 7 No
                initialAnswers[q.id] = (qIdx < 3 || (cIdx === 1 && qIdx < 4)) ? "yes" : "no";
              } else if (pillar.id === 2) {
                // Energy: 14 Yes, 11 No
                initialAnswers[q.id] = (qIdx % 2 === 0 || cIdx < 2) ? "yes" : "no";
              } else if (pillar.id === 3) {
                // Food Safety: 19 Yes, 6 No
                initialAnswers[q.id] = (qIdx < 4) ? "yes" : "no";
              } else if (pillar.id === 4) {
                // Climate: 15 Yes, 10 No
                initialAnswers[q.id] = (qIdx < 3) ? "yes" : "no";
              } else if (pillar.id === 5) {
                // Business: 20 Yes, 5 No
                initialAnswers[q.id] = (qIdx < 4 || cIdx === 0) ? "yes" : "no";
              } else if (pillar.id === 6) {
                // Human Capital: 17 Yes, 8 No
                initialAnswers[q.id] = (qIdx < 3 || cIdx === 2) ? "yes" : "no";
              } else if (pillar.id === 7) {
                // Market: 21 Yes, 4 No
                initialAnswers[q.id] = (qIdx < 4 || cIdx === 3) ? "yes" : "no";
              } else {
                // Investment: 16 Yes, 9 No
                initialAnswers[q.id] = (qIdx < 3) ? "yes" : "no";
              }
            });
          });
        });

        setAnswers(initialAnswers);
        localStorage.setItem(
          "future_farms_all_answers",
          JSON.stringify(initialAnswers)
        );
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Answer handler
  const handleAnswer = (questionId: string, value: "yes" | "no") => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    try {
      localStorage.setItem("future_farms_all_answers", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Compute scoring results across all 8 pillars
  const scoringResults = useMemo(() => {
    return computeAssessmentResults(answers);
  }, [answers]);

  // Current active pillar
  const currentPillar = useMemo(() => {
    return ALL_PILLARS.find((p) => p.id === selectedPillarId) || ALL_PILLARS[0];
  }, [selectedPillarId]);

  const currentPillarScoreResult = useMemo(() => {
    return (
      scoringResults.pillarScores.find((p) => p.pillarId === selectedPillarId) || {
        pillarId: selectedPillarId,
        pillarName: currentPillar.name,
        score: 0,
        totalQuestions: 25,
        answeredCount: 0,
        yesCount: 0,
        noCount: 0,
        capabilityScores: {},
      }
    );
  }, [scoringResults, selectedPillarId, currentPillar]);

  // Filter capabilities & questions for display
  const displayedCapabilities = useMemo(() => {
    let caps = currentPillar.capabilities;
    if (activeCapId !== "all") {
      caps = caps.filter((c) => c.id === activeCapId);
    }

    return caps.map((cap) => ({
      ...cap,
      questions: cap.questions.filter((q) => {
        if (filterMode === "gaps") return answers[q.id] === "no";
        if (filterMode === "strengths") return answers[q.id] === "yes";
        return true;
      }),
    }));
  }, [currentPillar, activeCapId, filterMode, answers]);

  // Gaps calculation for Roadmap Modal
  const modalGaps = useMemo(() => {
    if (roadmapScope === "current") {
      return currentPillar.capabilities
        .flatMap((c) => c.questions)
        .filter((q) => answers[q.id] === "no");
    }
    return ALL_PILLARS.flatMap((p) => p.capabilities)
      .flatMap((c) => c.questions)
      .filter((q) => answers[q.id] === "no");
  }, [roadmapScope, currentPillar, answers]);

  const quickWinGaps = modalGaps.filter((g) => g.priority === "🟢 Quick Win");
  const mediumTermGaps = modalGaps.filter((g) => g.priority === "🟡 Medium Term");
  const strategicGaps = modalGaps.filter((g) => g.priority === "🔵 Strategic");

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-32">
        {/* Page Top Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm fill">fact_check</span>
            <span>Future Farms Framework • Comprehensive Diagnostic Audit</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-surface-variant pb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                8-Pillar Farm Maturity Assessment
              </h1>
              <p className="text-sm md:text-base text-on-surface-variant max-w-3xl mt-1">
                Evaluate your farm across all 40 capabilities and 200 benchmark questions.
                Specific recommendations expand automatically when an operational gap is identified.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setRoadmapScope("current");
                  setShowRoadmapModal(true);
                }}
                className="px-4 py-2.5 rounded-xl border border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">assignment</span>
                <span>Action Plan ({currentPillarScoreResult.noCount} Gaps)</span>
              </button>

              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs btn-shadow hover-lift flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">insights</span>
                <span>My Farm Radar</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Global Summary Stats Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/50 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Overall FFMI */}
            <div className="md:col-span-4 flex items-center gap-5 border-b md:border-b-0 md:border-r border-surface-variant/50 pb-6 md:pb-0 md:pr-6">
              <div className="w-20 h-20 rounded-2xl bg-primary-container/20 flex flex-col items-center justify-center shrink-0 border border-primary/20">
                <span className="text-3xl font-extrabold text-primary leading-none">
                  {scoringResults.overallFfmiScore}%
                </span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase mt-1">
                  Overall FFMI
                </span>
              </div>
              <div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1.5 ${scoringResults.tier.badgeColor}`}
                >
                  {scoringResults.tier.label}
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {scoringResults.tier.description}
                </p>
              </div>
            </div>

            {/* Current Active Pillar Score */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-on-surface">
                <span>
                  Pillar {currentPillar.id}: {currentPillar.name}
                </span>
                <span className="text-primary font-bold text-sm">
                  {currentPillarScoreResult.score}% ({currentPillarScoreResult.yesCount}/25 Yes)
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentPillarScoreResult.score}%` }}
                />
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-primary font-semibold">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>{currentPillarScoreResult.yesCount} Verified Strengths</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                  <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                  <span>{currentPillarScoreResult.noCount} Opportunities for Growth</span>
                </span>
              </div>
            </div>

            {/* Assessment Rules Banner */}
            <div className="md:col-span-3 bg-surface p-4 rounded-2xl border border-outline-variant/50 text-xs space-y-1">
              <div className="font-bold text-on-surface flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[18px]">rule</span>
                <span>Scoring &amp; Recommendation Rules</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Selecting <strong>&quot;No&quot;</strong> displays personalized interventions and quick wins.
                Selecting <strong>&quot;Yes&quot;</strong> verifies the capability and keeps recommendations hidden.
              </p>
            </div>
          </div>
        </div>

        {/* 8-Pillar Selector Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Select Assessment Pillar (1 to 8):
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              Click any pillar to assess its 5 capabilities
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {ALL_PILLARS.map((p) => {
              const isSelected = p.id === selectedPillarId;
              const pScore = scoringResults.pillarScores.find((r) => r.pillarId === p.id)?.score ?? 0;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPillarId(p.id);
                    setActiveCapId("all");
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-primary bg-primary text-white shadow-sm ring-2 ring-primary ring-offset-1"
                      : "border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high text-on-surface"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                        isSelected ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                      }`}
                    >
                      P0{p.id}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? "text-white" : "text-primary"
                      }`}
                    >
                      {pScore}%
                    </span>
                  </div>

                  <span
                    className={`text-xs font-semibold line-clamp-2 leading-tight ${
                      isSelected ? "text-white" : "text-on-surface"
                    }`}
                  >
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pillar Header Card: Principle & Guiding Question */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-primary/20 shadow-sm bg-gradient-to-br from-primary/5 via-transparent to-transparent">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                <span>Pillar {currentPillar.id}</span>
                <span>•</span>
                <span>Principle: &ldquo;{currentPillar.principle}&rdquo;</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface">
                {currentPillar.name}
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant italic mt-1">
                &ldquo;{currentPillar.guidingQuestion}&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 max-w-md self-start md:self-center">
              {currentPillar.examples.slice(0, 4).map((ex, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium bg-surface px-2.5 py-1 rounded-full border border-outline-variant/60 text-on-surface-variant"
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Capability Filter Bar within Active Pillar */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-variant pb-3">
            {/* Capabilities of Current Pillar */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCapId("all")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCapId === "all"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                All 5 Capabilities
              </button>

              {currentPillar.capabilities.map((cap) => {
                const cScore = currentPillarScoreResult.capabilityScores[cap.id]?.score ?? 0;
                return (
                  <button
                    key={cap.id}
                    type="button"
                    onClick={() => setActiveCapId(cap.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeCapId === cap.id
                        ? "bg-primary text-white shadow-sm"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                    }`}
                  >
                    <span>
                      {cap.id}: {cap.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        activeCapId === cap.id
                          ? "bg-white/20 text-white"
                          : "bg-primary-container/25 text-primary"
                      }`}
                    >
                      {cScore}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filter Toggle: All vs Gaps vs Strengths */}
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
                <span className="text-[10px] opacity-90">
                  ({currentPillarScoreResult.noCount})
                </span>
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
                <span className="text-[10px] opacity-90">
                  ({currentPillarScoreResult.yesCount})
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Questionnaire: Capabilities & Questions */}
        <div className="space-y-10">
          {displayedCapabilities.map((capability) => {
            const capScoreData = currentPillarScoreResult.capabilityScores[capability.id] || {
              score: 0,
              yes: 0,
              total: 5,
            };

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
                    No questions match the current &ldquo;{filterMode}&rdquo; filter in {capability.name}.
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
                      <h3 className="text-xl font-bold text-on-surface">
                        {capability.name}
                      </h3>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      <strong className="text-on-surface">Focus:</strong> {capability.focus}
                    </p>
                  </div>

                  {/* Capability Score Badge */}
                  <div className="text-left sm:text-right shrink-0">
                    <div className="flex items-baseline gap-1.5 sm:justify-end">
                      <span className="text-2xl font-black text-primary">
                        {capScoreData.score}%
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        ({capScoreData.yes}/{capScoreData.total} Yes)
                      </span>
                    </div>
                    <div className="w-32 bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${capScoreData.score}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                  {capability.questions.map((q) => {
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
                              <h4 className="text-sm md:text-base font-semibold text-on-surface leading-snug">
                                {q.question}
                              </h4>
                              {q.evidenceRequired && (
                                <p className="text-[11px] text-on-surface-variant mt-1.5 flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                                    inventory_2
                                  </span>
                                  <span>
                                    <strong>FFV Evidence:</strong> {q.evidenceRequired}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Yes / No Toggle Buttons */}
                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            {/* YES Button */}
                            <button
                              type="button"
                              onClick={() => handleAnswer(q.id, "yes")}
                              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                isYes
                                  ? "bg-primary text-white shadow-sm ring-2 ring-primary ring-offset-1"
                                  : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[16px]">check</span>
                              <span>Yes</span>
                            </button>

                            {/* NO Button */}
                            <button
                              type="button"
                              onClick={() => handleAnswer(q.id, "no")}
                              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                isNo
                                  ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-600 ring-offset-1"
                                  : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                              <span>No</span>
                            </button>
                          </div>
                        </div>

                        {/* CONDITIONAL RECOMMENDATION DISPLAY:
                            - When "No": The recommendation card expands immediately with recommendations, why it matters, quick win, support available, priority badge.
                            - When "Yes": Recommendation card stays completely HIDDEN throughout. */}
                        {isNo && (
                          <div className="mt-5 pt-5 border-t border-amber-200/80 space-y-4 animate-fade-in">
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

                            <div className="bg-surface rounded-xl p-4 border border-outline-variant/60 space-y-3">
                              <div>
                                <h5 className="text-xs font-bold text-on-surface mb-0.5">
                                  Recommended Intervention
                                </h5>
                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                  {q.recommendation}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-surface-variant/40">
                                <div>
                                  <h6 className="text-[11px] font-bold text-on-surface mb-0.5">
                                    Why It Matters
                                  </h6>
                                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                    {q.whyItMatters}
                                  </p>
                                </div>
                                <div className="bg-primary/5 p-2.5 rounded-lg border border-primary/15">
                                  <h6 className="text-[11px] font-bold text-primary mb-0.5 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                                    <span>Immediate Quick Win</span>
                                  </h6>
                                  <p className="text-[11px] text-on-surface leading-relaxed">
                                    {q.quickWin}
                                  </p>
                                </div>
                              </div>

                              {q.supportAvailable && (
                                <div className="pt-2 border-t border-surface-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                                  <span className="text-on-surface-variant">
                                    <strong>Support Available:</strong> {q.supportAvailable}
                                  </span>
                                  <Link
                                    href="/service-desk"
                                    className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                                  >
                                    Request Support on Service Desk &rarr;
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Confirmation when YES is selected */}
                        {isYes && (
                          <div className="mt-3 flex items-center gap-2 text-[11px] text-primary font-semibold">
                            <span className="material-symbols-outlined text-[15px] fill">check_circle</span>
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

        {/* Floating Bottom Bar: Live Assessment Status & Actions */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <span className="text-xs text-on-surface-variant font-medium">
              Pillar {currentPillar.id} Score:
            </span>
            <span className="text-lg font-black text-primary">
              {currentPillarScoreResult.score}% ({currentPillarScoreResult.yesCount} / 25 Yes)
            </span>
            <span className="text-xs text-on-surface-variant">|</span>
            <span className="text-xs text-on-surface-variant">
              Farm Overall FFMI: <strong className="text-primary">{scoringResults.overallFfmiScore}%</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setRoadmapScope("current");
                setShowRoadmapModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs transition-all cursor-pointer"
            >
              Action Plan ({currentPillarScoreResult.noCount} Gaps)
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs btn-shadow hover-lift transition-all flex items-center gap-1.5"
            >
              <span>Sync with Farm Radar</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Roadmap & Action Plan Modal */}
        {showRoadmapModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl border border-surface-variant my-8 max-h-[90vh] flex flex-col animate-fade-in-up">
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-surface-variant pb-4 mb-4 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary uppercase">Action Plan</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {modalGaps.length} Improvement Areas
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-on-surface">
                    {roadmapScope === "current"
                      ? `Pillar ${currentPillar.id}: ${currentPillar.name} Gaps`
                      : "Whole-Farm 8-Pillar Gap Roadmap"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRoadmapModal(false)}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Scope Switcher: Current Pillar vs All 8 Pillars */}
              <div className="flex gap-2 mb-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setRoadmapScope("current")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                    roadmapScope === "current"
                      ? "bg-primary text-white"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  Pillar {currentPillar.id} Gaps ({currentPillarScoreResult.noCount})
                </button>
                <button
                  type="button"
                  onClick={() => setRoadmapScope("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                    roadmapScope === "all"
                      ? "bg-primary text-white"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  All 8 Pillars Gaps ({scoringResults.totalNo})
                </button>
              </div>

              {/* Scrollable Gaps List */}
              <div className="overflow-y-auto pr-2 space-y-6 flex-1">
                {modalGaps.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <span className="material-symbols-outlined text-5xl text-primary fill">verified</span>
                    <h4 className="text-lg font-bold text-on-surface">
                      No Gaps in this Scope!
                    </h4>
                    <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                      All capabilities in this section are currently verified as Yes. Your farm is operating at full maturity.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Quick Wins */}
                    {quickWinGaps.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          🟢 Quick Wins ({quickWinGaps.length})
                        </span>
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
                                  Pillar {gap.pillarId} • Cap {gap.capabilityId}
                                </span>
                              </div>
                              <p className="text-on-surface-variant leading-relaxed">
                                <strong>Action:</strong> {gap.recommendation}
                              </p>
                              <div className="bg-emerald-50 p-2 rounded-lg text-[11px] text-emerald-900 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>
                                <span><strong>Quick Win:</strong> {gap.quickWin}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Medium Term */}
                    {mediumTermGaps.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          🟡 Medium Term ({mediumTermGaps.length})
                        </span>
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
                                  Pillar {gap.pillarId} • Cap {gap.capabilityId}
                                </span>
                              </div>
                              <p className="text-on-surface-variant leading-relaxed">
                                <strong>Action:</strong> {gap.recommendation}
                              </p>
                              {gap.supportAvailable && (
                                <p className="text-[11px] text-on-surface-variant">
                                  <strong>Support:</strong> {gap.supportAvailable}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strategic */}
                    {strategicGaps.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          🔵 Strategic Roadmap ({strategicGaps.length})
                        </span>
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
                                  Pillar {gap.pillarId} • Cap {gap.capabilityId}
                                </span>
                              </div>
                              <p className="text-on-surface-variant leading-relaxed">
                                <strong>Action:</strong> {gap.recommendation}
                              </p>
                              {gap.supportAvailable && (
                                <p className="text-[11px] text-on-surface-variant">
                                  <strong>Support:</strong> {gap.supportAvailable}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-surface-variant flex justify-between items-center gap-3 shrink-0 mt-4">
                <span className="text-xs text-on-surface-variant">
                  {modalGaps.length} gaps to address for a 100% Leading Rating
                </span>
                <button
                  type="button"
                  onClick={() => setShowRoadmapModal(false)}
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
