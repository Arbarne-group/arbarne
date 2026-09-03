"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { ALL_PILLARS, PillarData, Capability, AssessmentQuestion } from "@/data/allPillarsData";
import { computeAssessmentResults, getMaturityTier } from "@/lib/assessmentScoring";

export default function AssessmentPage() {
  // Mode: "overview" (default matching user template) or "questionnaire" (active assessment of a pillar)
  const [viewMode, setViewMode] = useState<"overview" | "questionnaire">("overview");
  const [selectedPillarId, setSelectedPillarId] = useState<number>(1);
  const [activeCapId, setActiveCapId] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<"all" | "gaps" | "strengths">("all");
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  // Load answers from localStorage on mount, seeding realistic baseline if empty
  useEffect(() => {
    try {
      const saved = localStorage.getItem("future_farms_all_answers");
      if (saved) {
        setAnswers(JSON.parse(saved));
      } else {
        const initialAnswers: Record<string, "yes" | "no"> = {};
        ALL_PILLARS.forEach((pillar) => {
          pillar.capabilities.forEach((cap, cIdx) => {
            cap.questions.forEach((q, qIdx) => {
              if (pillar.id === 1) {
                initialAnswers[q.id] = qIdx < 3 || (cIdx === 1 && qIdx < 4) ? "yes" : "no";
              } else if (pillar.id === 2) {
                initialAnswers[q.id] = qIdx % 2 === 0 || cIdx < 2 ? "yes" : "no";
              } else if (pillar.id === 3) {
                initialAnswers[q.id] = qIdx < 4 ? "yes" : "no";
              } else if (pillar.id === 4) {
                initialAnswers[q.id] = qIdx < 3 ? "yes" : "no";
              } else if (pillar.id === 5) {
                initialAnswers[q.id] = qIdx < 4 || cIdx === 0 ? "yes" : "no";
              } else if (pillar.id === 6) {
                initialAnswers[q.id] = qIdx < 3 || cIdx === 2 ? "yes" : "no";
              } else if (pillar.id === 7) {
                initialAnswers[q.id] = qIdx < 4 || cIdx === 3 ? "yes" : "no";
              } else {
                initialAnswers[q.id] = qIdx < 3 ? "yes" : "no";
              }
            });
          });
        });
        setAnswers(initialAnswers);
        localStorage.setItem("future_farms_all_answers", JSON.stringify(initialAnswers));
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

  // Current active pillar for questionnaire
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

  // Filter capabilities & questions for display in questionnaire mode
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

  // Meta for the 8 pillar bento cards matching user design tokens
  const pillarBentoMeta = [
    {
      id: 1,
      name: "Smart Farming & Digital Transformation",
      icon: "memory",
      iconBg: "bg-primary-container/20 text-primary",
    },
    {
      id: 2,
      name: "Productive Use of Renewable Energy",
      icon: "solar_power",
      iconBg: "bg-secondary-container/30 text-secondary",
    },
    {
      id: 3,
      name: "Food Safety, Quality & Compliance",
      icon: "verified",
      iconBg: "bg-tertiary-container/20 text-tertiary",
    },
    {
      id: 4,
      name: "Indigenous Knowledge & Climate Resilience",
      icon: "psychology",
      iconBg: "bg-outline-variant/30 text-on-surface-variant",
    },
    {
      id: 5,
      name: "Farm Business Performance & Growth",
      icon: "trending_up",
      iconBg: "bg-primary-container/20 text-primary",
    },
    {
      id: 6,
      name: "Human Capital, Leadership & Farm Operations",
      icon: "groups",
      iconBg: "bg-secondary-container/30 text-secondary",
    },
    {
      id: 7,
      name: "Market Access, Customer Value & Competitiveness",
      icon: "storefront",
      iconBg: "bg-tertiary-container/20 text-tertiary",
    },
    {
      id: 8,
      name: "Investment Readiness & Enterprise Development",
      icon: "account_balance",
      iconBg: "bg-outline-variant/30 text-on-surface-variant",
    },
  ];

  const answeredCount = scoringResults.totalAnswered;
  const statusLabel =
    answeredCount === 0
      ? "Not Started"
      : answeredCount < 200
      ? "In Progress"
      : "Completed";

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8 p-4 md:p-10 pb-28">
        {/* ========================================================
            VIEW MODE 1: ASSESSMENT OVERVIEW (User Template Layout)
            ======================================================== */}
        {viewMode === "overview" && (
          <>
            {/* Page Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="font-display-lg text-2xl md:text-4xl font-bold text-on-surface mb-2 tracking-tight">
                  Assessment Overview
                </h1>
                <p className="font-body-md text-sm md:text-base text-on-surface-variant max-w-2xl">
                  Complete the assessment to discover your farm&apos;s strengths and areas for improvement.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                className="px-6 py-2 border border-outline text-primary font-label-sm text-sm rounded-full hover:bg-surface-variant transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">history</span>
                <span>Assessment History</span>
              </button>
            </div>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* Stat Card 1: 40 Capabilities */}
              <div className="bg-surface rounded-2xl p-6 shadow-level-1 flex flex-col items-center justify-center gap-2 border border-outline-variant/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="material-symbols-outlined text-3xl text-primary mb-1">
                  checklist
                </span>
                <span className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface">
                  40
                </span>
                <span className="font-label-sm text-xs text-on-surface-variant text-center">
                  Capabilities
                </span>
              </div>

              {/* Stat Card 2: 8 Pillars */}
              <div className="bg-surface rounded-2xl p-6 shadow-level-1 flex flex-col items-center justify-center gap-2 border border-outline-variant/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="material-symbols-outlined text-3xl text-secondary mb-1">
                  view_module
                </span>
                <span className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface">
                  8
                </span>
                <span className="font-label-sm text-xs text-on-surface-variant text-center">
                  Pillars
                </span>
              </div>

              {/* Stat Card 3: ~60 min */}
              <div className="bg-surface rounded-2xl p-6 shadow-level-1 flex flex-col items-center justify-center gap-2 border border-outline-variant/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="material-symbols-outlined text-3xl text-tertiary mb-1">
                  schedule
                </span>
                <span className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface">
                  ~60 <span className="text-lg font-normal text-on-surface-variant">min</span>
                </span>
                <span className="font-label-sm text-xs text-on-surface-variant text-center">
                  Estimated Time
                </span>
              </div>

              {/* Stat Card 4: Status */}
              <div className="bg-surface rounded-2xl p-6 shadow-level-1 flex flex-col items-center justify-center gap-2 border border-outline-variant/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="material-symbols-outlined text-3xl text-outline mb-1">
                  {statusLabel === "Completed" ? "verified" : "pending"}
                </span>
                <span className="font-title-md text-base md:text-lg font-semibold text-on-surface mt-2 text-center">
                  {statusLabel}
                </span>
                <span className="font-label-sm text-xs text-on-surface-variant text-center">
                  {answeredCount > 0 ? `${scoringResults.overallFfmiScore}% Maturity Score` : "Status"}
                </span>
              </div>
            </div>

            {/* The 8 Pillars Section */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-title-md text-xl md:text-2xl font-semibold text-on-surface">
                    The 8 Pillars
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Select any pillar to review its capabilities, diagnostic questions, and tailored action plan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPillarId(1);
                    setActiveCapId("all");
                    setViewMode("questionnaire");
                  }}
                  className="text-primary font-label-sm text-sm hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>View all pillars</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              {/* Bento Grid for Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {pillarBentoMeta.map((pillar) => {
                  const pResult = scoringResults.pillarScores.find(
                    (r) => r.pillarId === pillar.id
                  );
                  const pScore = pResult?.score ?? 0;
                  const yesCount = pResult?.yesCount ?? 0;
                  const noCount = pResult?.noCount ?? 0;

                  return (
                    <div
                      key={pillar.id}
                      onClick={() => {
                        setSelectedPillarId(pillar.id);
                        setActiveCapId("all");
                        setViewMode("questionnaire");
                      }}
                      className="bg-surface rounded-2xl p-5 shadow-level-1 border border-outline-variant/50 hover:shadow-level-2 transition-all flex flex-col justify-between gap-4 hover:-translate-y-1 cursor-pointer group"
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${pillar.iconBg}`}
                        >
                          <span className="material-symbols-outlined text-[22px]">
                            {pillar.icon}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {pScore > 0 && (
                            <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              {pScore}%
                            </span>
                          )}
                          <span className="font-label-sm text-xs font-bold text-on-surface-variant bg-surface-variant px-2 py-1 rounded-full">
                            {pillar.id}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-title-md text-base font-semibold text-on-surface leading-tight min-h-12 mb-2 group-hover:text-primary transition-colors">
                          {pillar.name}
                        </h3>

                        {/* Progress bar and details */}
                        <div className="pt-2 border-t border-surface-variant/50 space-y-1.5">
                          <div className="flex justify-between items-center text-[11px] text-on-surface-variant font-medium">
                            <span>{yesCount}/25 Verified</span>
                            <span className="text-amber-800 font-semibold">{noCount} Gaps</span>
                          </div>
                          <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-300"
                              style={{ width: `${pScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-outline-variant/50 pt-8">
              <div className="text-xs text-on-surface-variant">
                Overall Assessment Progress: <strong>{answeredCount} of 200 Questions Answered</strong> • Average FFMI: <strong className="text-primary">{scoringResults.overallFfmiScore}%</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPillarId(1);
                  setActiveCapId("all");
                  setViewMode("questionnaire");
                }}
                className="bg-[#009924] text-on-primary font-label-sm text-sm px-10 py-4 rounded-xl shadow-level-1 hover:shadow-level-2 transition-all duration-200 flex items-center gap-3 w-full md:w-auto justify-center font-semibold group cursor-pointer"
              >
                <span>Start / Continue Assessment</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </>
        )}

        {/* ========================================================
            VIEW MODE 2: INTERACTIVE QUESTIONNAIRE (All 8 Pillars)
            ======================================================== */}
        {viewMode === "questionnaire" && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Navigation Bar: Return to Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant pb-4">
              <button
                type="button"
                onClick={() => setViewMode("overview")}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Assessment Overview</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowRoadmapModal(true)}
                  className="px-4 py-2 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">assignment</span>
                  <span>Gap Roadmap ({currentPillarScoreResult.noCount} Gaps)</span>
                </button>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary/90 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">insights</span>
                  <span>View Farm Radar</span>
                </Link>
              </div>
            </div>

            {/* Active Pillar Hero Card */}
            <div className="bg-surface rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-level-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                    <span>Pillar {currentPillar.id} of 8</span>
                    <span>•</span>
                    <span>Principle: &ldquo;{currentPillar.principle}&rdquo;</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface">
                    {currentPillar.name}
                  </h2>
                  <p className="text-xs md:text-sm text-on-surface-variant italic mt-1 max-w-3xl">
                    &ldquo;{currentPillar.guidingQuestion}&rdquo;
                  </p>
                </div>

                <div className="text-left md:text-right shrink-0 bg-primary-container/10 p-4 rounded-2xl border border-primary/20">
                  <div className="text-2xl font-black text-primary">
                    {currentPillarScoreResult.score}%
                  </div>
                  <div className="text-xs text-on-surface-variant font-semibold">
                    {currentPillarScoreResult.yesCount} / 25 Capabilities Verified
                  </div>
                </div>
              </div>
            </div>

            {/* 8-Pillar Tab Buttons */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {ALL_PILLARS.map((p) => {
                  const isSelected = p.id === selectedPillarId;
                  const pScore =
                    scoringResults.pillarScores.find((r) => r.pillarId === p.id)?.score ?? 0;

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPillarId(p.id);
                        setActiveCapId("all");
                      }}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-surface text-on-surface-variant border-outline-variant/60 hover:bg-surface-container-high"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                          isSelected ? "bg-white/20 text-white" : "bg-surface-variant text-on-surface"
                        }`}
                      >
                        P0{p.id}
                      </span>
                      <span className="truncate max-w-[140px]">{p.name}</span>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                          isSelected ? "bg-white/20 text-white" : "text-primary"
                        }`}
                      >
                        {pScore}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Capability Sub-Tabs & Filter Options */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-variant pb-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCapId("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeCapId === "all"
                      ? "bg-primary text-white shadow-xs"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  All 5 Capabilities
                </button>
                {currentPillar.capabilities.map((cap) => {
                  const cScore =
                    currentPillarScoreResult.capabilityScores[cap.id]?.score ?? 0;

                  return (
                    <button
                      key={cap.id}
                      type="button"
                      onClick={() => setActiveCapId(cap.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeCapId === cap.id
                          ? "bg-primary text-white shadow-xs"
                          : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                      }`}
                    >
                      <span>
                        {cap.id}: {cap.name}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 rounded-full font-bold ${
                          activeCapId === cap.id ? "bg-white/20 text-white" : "text-primary"
                        }`}
                      >
                        {cScore}%
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Gaps vs Strengths Toggle */}
              <div className="flex items-center gap-1 bg-surface-container-high p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFilterMode("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    filterMode === "all"
                      ? "bg-surface text-on-surface shadow-xs"
                      : "text-on-surface-variant"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode("gaps")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                    filterMode === "gaps"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-on-surface-variant"
                  }`}
                >
                  <span>Gaps</span>
                  <span className="text-[10px]">({currentPillarScoreResult.noCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode("strengths")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                    filterMode === "strengths"
                      ? "bg-primary text-white shadow-xs"
                      : "text-on-surface-variant"
                  }`}
                >
                  <span>Strengths</span>
                  <span className="text-[10px]">({currentPillarScoreResult.yesCount})</span>
                </button>
              </div>
            </div>

            {/* Questions List by Capability */}
            <div className="space-y-8">
              {displayedCapabilities.map((capability) => {
                const capScoreData = currentPillarScoreResult.capabilityScores[capability.id] || {
                  score: 0,
                  yes: 0,
                  total: 5,
                };

                return (
                  <div
                    key={capability.id}
                    className="bg-surface rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-level-1 space-y-6"
                  >
                    {/* Capability Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                            Capability {capability.id}
                          </span>
                          <h3 className="text-lg md:text-xl font-bold text-on-surface">
                            {capability.name}
                          </h3>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          <strong>Focus:</strong> {capability.focus}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-xl font-extrabold text-primary">
                          {capScoreData.score}%
                        </div>
                        <div className="text-[11px] text-on-surface-variant font-medium">
                          {capScoreData.yes}/{capScoreData.total} Yes
                        </div>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-5">
                      {capability.questions.map((q) => {
                        const currentAnswer = answers[q.id];
                        const isYes = currentAnswer === "yes";
                        const isNo = currentAnswer === "no";

                        return (
                          <div
                            key={q.id}
                            className={`rounded-2xl border p-5 transition-all ${
                              isNo
                                ? "border-amber-300 bg-amber-50/20"
                                : isYes
                                ? "border-primary/30 bg-primary-container/5"
                                : "border-outline-variant/60 bg-surface"
                            }`}
                          >
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
                                    <p className="text-[11px] text-on-surface-variant mt-1 flex items-center gap-1.5">
                                      <span className="material-symbols-outlined text-[14px]">
                                        inventory_2
                                      </span>
                                      <span>
                                        <strong>Evidence:</strong> {q.evidenceRequired}
                                      </span>
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* YES / NO Selection Buttons */}
                              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                <button
                                  type="button"
                                  onClick={() => handleAnswer(q.id, "yes")}
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

                                <button
                                  type="button"
                                  onClick={() => handleAnswer(q.id, "no")}
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

                            {/* CONDITIONAL RECOMMENDATION RULE:
                                - If "No": Recommendation expands with why it matters, quick win, support channel, and priority badge.
                                - If "Yes": Recommendation card stays completely HIDDEN throughout. */}
                            {isNo && (
                              <div className="mt-4 pt-4 border-t border-amber-200/80 space-y-3 animate-fade-in">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-amber-700 text-[18px]">
                                      lightbulb
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                                      Guidance &amp; Recommendation
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-surface text-on-surface border border-outline-variant/60">
                                    Priority: {q.priority}
                                  </span>
                                </div>

                                <div className="bg-surface rounded-xl p-4 border border-outline-variant/60 space-y-3">
                                  <div>
                                    <h5 className="text-xs font-bold text-on-surface mb-0.5">
                                      Recommended Action
                                    </h5>
                                    <p className="text-xs text-on-surface-variant leading-relaxed">
                                      {q.recommendation}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-surface-variant/40">
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
                                        <span className="material-symbols-outlined text-[14px]">
                                          bolt
                                        </span>
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
                                        className="text-primary font-bold hover:underline"
                                      >
                                        Request Advisory Support &rarr;
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {isYes && (
                              <div className="mt-2.5 flex items-center gap-2 text-[11px] text-primary font-semibold">
                                <span className="material-symbols-outlined text-[15px] fill">
                                  check_circle
                                </span>
                                <span>
                                  Capability demonstrated. Recommendations remain hidden.
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 z-30 shadow-level-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-on-surface-variant font-medium">
                  Pillar {currentPillar.id} Score:
                </span>
                <span className="text-lg font-black text-primary">
                  {currentPillarScoreResult.score}% ({currentPillarScoreResult.yesCount} / 25 Yes)
                </span>
                <span className="text-xs text-on-surface-variant">|</span>
                <span className="text-xs text-on-surface-variant">
                  Overall FFMI: <strong className="text-primary">{scoringResults.overallFfmiScore}%</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode("overview")}
                  className="px-4 py-2 rounded-xl border border-outline-variant bg-surface hover:bg-surface-variant text-on-surface font-semibold text-xs cursor-pointer"
                >
                  Overview Grid
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs btn-shadow flex items-center gap-1.5"
                >
                  <span>Sync with Radar</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL: ASSESSMENT HISTORY
            ======================================================== */}
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-surface-variant animate-fade-in-up">
              <div className="flex justify-between items-center border-b border-surface-variant pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  <h3 className="text-lg font-bold text-on-surface">Assessment History</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1 rounded-full text-on-surface-variant hover:bg-surface-variant cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Current Verified Audit
                    </span>
                    <span className="text-xs font-black text-primary">
                      {scoringResults.overallFfmiScore}%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface mt-1">
                    September 2026 Audit
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {answeredCount} of 200 Questions Completed • {scoringResults.tier.label}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-surface-variant bg-surface/50 opacity-80">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Baseline Review
                    </span>
                    <span className="text-xs font-black text-on-surface">64%</span>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface mt-1">
                    March 2026 Baseline
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    200 Questions Verified • Advancing Stage
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-variant flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="px-5 py-2 rounded-xl bg-primary text-white font-semibold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL: GAP ROADMAP & ACTION PLAN
            ======================================================== */}
        {showRoadmapModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl border border-surface-variant my-8 max-h-[90vh] flex flex-col animate-fade-in-up">
              <div className="flex justify-between items-start border-b border-surface-variant pb-4 mb-4 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary uppercase">Action Plan</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {currentPillarScoreResult.noCount} Gaps
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-on-surface">
                    Pillar {currentPillar.id}: {currentPillar.name} Gaps
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRoadmapModal(false)}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="overflow-y-auto pr-2 space-y-4 flex-1">
                {currentPillar.capabilities
                  .flatMap((c) => c.questions)
                  .filter((q) => answers[q.id] === "no")
                  .map((gap) => (
                    <div
                      key={gap.id}
                      className="p-4 rounded-xl bg-surface border border-outline-variant/60 text-xs space-y-2"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-on-surface">
                          {gap.id}: {gap.question}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant">
                          {gap.priority}
                        </span>
                      </div>
                      <p className="text-on-surface-variant leading-relaxed">
                        <strong>Action:</strong> {gap.recommendation}
                      </p>
                      <div className="bg-primary/5 p-2 rounded-lg text-[11px] text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
                        <span><strong>Quick Win:</strong> {gap.quickWin}</span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="pt-4 border-t border-surface-variant flex justify-end shrink-0 mt-4">
                <button
                  type="button"
                  onClick={() => setShowRoadmapModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs cursor-pointer"
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
