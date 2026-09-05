"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { ALL_PILLARS, PillarData, Capability, AssessmentQuestion } from "@/data/allPillarsData";
import { computeAssessmentResults, getMaturityTier } from "@/lib/assessmentScoring";
import { PILLAR_BRANDS } from "@/data/brandColors";

export default function AssessmentPage() {
  // Mode: "overview" (default matching user template), "questionnaire" (active assessment of a pillar), or "results" (submitted pillar recommendations & summary)
  const [viewMode, setViewMode] = useState<"overview" | "questionnaire" | "results">("overview");
  const [selectedPillarId, setSelectedPillarId] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [downloadingReport, setDownloadingReport] = useState(false);

  // Load answers from database API on mount, falling back to localStorage or realistic baseline
  useEffect(() => {
    async function loadResponses() {
      try {
        const res = await fetch("/api/assessment/responses");
        if (res.ok) {
          const data = await res.json();
          if (data.answers && Object.keys(data.answers).length > 0) {
            setAnswers(data.answers);
            localStorage.setItem("future_farms_all_answers", JSON.stringify(data.answers));
            return;
          }
        }
      } catch (e) {
        console.error("Failed to load responses from DB, falling back to local storage", e);
      }

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

          // Save seed baseline to DB in background
          fetch("/api/assessment/save-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers: initialAnswers }),
          }).catch((err) => console.error("Background seed save failed:", err));
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadResponses();
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

  // Save progress handler to database
  const handleSaveProgress = async () => {
    try {
      localStorage.setItem("future_farms_all_answers", JSON.stringify(answers));
      setSaveFeedback("Saving to database...");

      const res = await fetch("/api/assessment/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pillarId: selectedPillarId,
          answers,
        }),
      });

      if (res.ok) {
        setSaveFeedback("Progress saved to database!");
      } else {
        setSaveFeedback("Progress saved locally!");
      }
      setTimeout(() => setSaveFeedback(null), 3500);
    } catch (e) {
      console.error(e);
      setSaveFeedback("Progress saved locally!");
      setTimeout(() => setSaveFeedback(null), 3000);
    }
  };

  // Submit pillar assessment handler
  const handleSubmitPillar = async () => {
    try {
      localStorage.setItem("future_farms_all_answers", JSON.stringify(answers));
      setViewMode("results");
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Save and finalize submission in database
      await fetch("/api/assessment/submit-pillar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pillarId: selectedPillarId,
          answers,
        }),
      });
    } catch (e) {
      console.error(e);
      setViewMode("results");
    }
  };

  // Download Pillar Report JSON / Print
  const handleDownloadPillarReport = async (pillarId: number) => {
    try {
      setDownloadingReport(true);
      const res = await fetch(`/api/assessment/report?pillarId=${pillarId}`);
      if (!res.ok) throw new Error("Failed to fetch report");
      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data.report, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Future_Farms_Pillar_0${pillarId}_Report.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setDownloadingReport(false);
    }
  };

  // Download Overall 8-Pillars Report JSON / Print
  const handleDownloadOverallReport = async () => {
    try {
      setDownloadingReport(true);
      const res = await fetch("/api/assessment/report");
      if (!res.ok) throw new Error("Failed to fetch report");
      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data.report, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Future_Farms_Overall_8_Pillar_Transformation_Report.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setDownloadingReport(false);
    }
  };

  // Compute scoring results across all 8 pillars
  const scoringResults = useMemo(() => {
    return computeAssessmentResults(answers);
  }, [answers]);

  // Current active pillar for questionnaire / results
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

  // All questions in the current pillar where answer is "no" (gaps for results page)
  const currentPillarGaps = useMemo(() => {
    return currentPillar.capabilities
      .flatMap((c) => c.questions)
      .filter((q) => answers[q.id] === "no");
  }, [currentPillar, answers]);

  // Capabilities for current pillar
  const displayedCapabilities = useMemo(() => {
    return currentPillar.capabilities;
  }, [currentPillar]);

  // Meta for the 8 pillar bento cards aligned with official FFF branding colors
  const pillarBentoMeta = Object.values(PILLAR_BRANDS);

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
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadOverallReport}
                  disabled={downloadingReport}
                  className="px-5 py-2 border border-primary/30 bg-primary/5 text-primary font-label-sm text-sm rounded-full hover:bg-primary/10 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-sm">
                    {downloadingReport ? "sync" : "download"}
                  </span>
                  <span>{downloadingReport ? "Generating Report..." : "Download 8-Pillars Report"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(true)}
                  className="px-6 py-2 border border-outline text-primary font-label-sm text-sm rounded-full hover:bg-surface-variant transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">history</span>
                  <span>Assessment History</span>
                </button>
              </div>
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
                  return (
                    <div
                      key={pillar.id}
                      onClick={() => {
                        setSelectedPillarId(pillar.id);
                        setViewMode("questionnaire");
                      }}
                      className="bg-surface rounded-2xl p-5 shadow-level-1 border border-outline-variant/50 hover:shadow-level-2 transition-all flex flex-col justify-between gap-4 hover:-translate-y-1 cursor-pointer group"
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${pillar.iconBg} ${pillar.iconColor} ${pillar.borderClass}`}
                        >
                          <span className="material-symbols-outlined text-[24px]">
                            {pillar.icon}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pillar.badgeBg} ${pillar.badgeText}`}
                            title={`${pillar.element}: ${pillar.meaning}`}
                          >
                            {pillar.element.includes("(") ? pillar.element.split("(")[1].replace(")", "") : pillar.element}
                          </span>
                          <span className="font-label-sm text-xs font-bold text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded-full">
                            P0{pillar.id}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-title-md text-base font-semibold text-on-surface leading-tight min-h-12 mb-2 group-hover:text-primary transition-colors">
                          {pillar.name}
                        </h3>

                        {/* Pillar Details */}
                        <div className="pt-3 border-t border-surface-variant/50 flex justify-between items-center text-xs text-on-surface-variant font-medium">
                          <span>5 Capabilities • 25 Questions</span>
                          <span className="font-semibold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                            Assess <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </span>
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
            <div className="flex items-center justify-between border-b border-surface-variant pb-4">
              <button
                type="button"
                onClick={() => setViewMode("overview")}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Assessment Overview</span>
              </button>

              <div className="text-xs font-semibold text-on-surface-variant">
                Pillar {currentPillar.id} of 8: <span className="text-on-surface font-bold">{currentPillar.name}</span>
              </div>
            </div>

            {/* Active Pillar Hero Card with FFF Brand Colors */}
            {(() => {
              const activeBrand = PILLAR_BRANDS[currentPillar.id];
              return (
                <div className="bg-surface rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-level-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${activeBrand.iconBg} ${activeBrand.iconColor} ${activeBrand.borderClass}`}
                      >
                        <span className="material-symbols-outlined text-[32px]">
                          {activeBrand.icon}
                        </span>
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] ${activeBrand.badgeBg} ${activeBrand.badgeText}`}
                          >
                            {activeBrand.element}
                          </span>
                          <span className="text-on-surface-variant">•</span>
                          <span className="text-on-surface-variant">
                            Principle: &ldquo;{currentPillar.principle}&rdquo;
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface">
                          {currentPillar.name}
                        </h2>
                        <p className="text-xs md:text-sm text-on-surface-variant italic mt-1 max-w-3xl">
                          &ldquo;{currentPillar.guidingQuestion}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="text-left md:text-right shrink-0 bg-surface-container-high px-5 py-3.5 rounded-2xl border border-outline-variant/60">
                      <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Diagnostic Scope
                      </div>
                      <div className="text-sm font-bold text-primary mt-0.5">
                        5 Capabilities • 25 Questions
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Questions List by Capability */}
            <div className="space-y-8">
              {displayedCapabilities.map((capability) => {
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
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
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
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Floating Bar with Save Draft and Submit Buttons */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 z-30 shadow-level-2">
              <button
                type="button"
                onClick={() => setViewMode("overview")}
                className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                &larr; Back to Overview
              </button>

              <div className="flex items-center gap-3">
                {saveFeedback && (
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1 animate-fadeIn">
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                    {saveFeedback}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveProgress}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-semibold text-xs md:text-sm transition-all flex items-center gap-1.5 cursor-pointer bg-surface"
                >
                  <span className="material-symbols-outlined text-[17px]">save</span>
                  <span>Save Progress</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmitPillar}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs md:text-sm btn-shadow hover-lift transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Submit Pillar 0{currentPillar.id} Assessment</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW MODE 3: PILLAR RESULTS & RECOMMENDATIONS
            ======================================================== */}
        {viewMode === "results" && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode("overview")}
                  className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Assessment Overview</span>
                </button>
                <span className="text-outline-variant">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("questionnaire");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Edit Questionnaire Answers</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDownloadPillarReport(currentPillar.id)}
                  disabled={downloadingReport}
                  className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {downloadingReport ? "sync" : "file_download"}
                  </span>
                  <span>{downloadingReport ? "Generating..." : `Download Pillar 0${currentPillar.id} Report`}</span>
                </button>
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  Assessment Results: Pillar 0{currentPillar.id}
                </span>
              </div>
            </div>

            {/* Results Score Banner */}
            {(() => {
              const activeBrand = PILLAR_BRANDS[currentPillar.id];
              const score = currentPillarScoreResult.score;
              const tier = getMaturityTier(score);

              return (
                <div className="bg-surface rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-level-1 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${activeBrand.iconBg} ${activeBrand.iconColor} ${activeBrand.borderClass}`}
                      >
                        <span className="material-symbols-outlined text-[36px]">
                          {activeBrand.icon}
                        </span>
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] ${activeBrand.badgeBg} ${activeBrand.badgeText}`}
                          >
                            Pillar 0{currentPillar.id} Complete
                          </span>
                          <span className="text-on-surface-variant">•</span>
                          <span className="text-on-surface-variant">
                            {activeBrand.element}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface">
                          {currentPillar.name}
                        </h2>
                        <p className="text-xs md:text-sm text-on-surface-variant italic mt-1 max-w-2xl">
                          &ldquo;{currentPillar.principle}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-surface-container-high p-5 rounded-2xl border border-outline-variant/60 shrink-0">
                      <div className="text-center">
                        <div className="text-3xl font-black text-primary">
                          {score}%
                        </div>
                        <div className="text-xs text-on-surface-variant font-semibold">
                          {currentPillarScoreResult.yesCount} of 25 Verified
                        </div>
                      </div>
                      <div className="h-10 w-px bg-outline-variant/50" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
                          Maturity Stage
                        </span>
                        <span className="text-sm font-extrabold text-on-surface">
                          {tier.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Targeted Recommendations Section for Questions Answered "No" */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600">lightbulb</span>
                    <span>Targeted Recommendations &amp; Action Plan</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Actionable guidance tailored specifically to the operational areas marked as &ldquo;No&rdquo;.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 self-start sm:self-auto">
                  {currentPillarGaps.length} Recommendations
                </span>
              </div>

              {currentPillarGaps.length === 0 ? (
                <div className="bg-surface rounded-2xl p-8 border border-primary/20 text-center space-y-2">
                  <span className="material-symbols-outlined text-primary text-4xl">verified</span>
                  <h4 className="text-base font-bold text-on-surface">
                    Outstanding! Zero Operational Gaps
                  </h4>
                  <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                    You have verified all 25 diagnostic capabilities for this pillar. Your farm demonstrates advanced operating maturity in this area.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {currentPillarGaps.map((q) => (
                    <div
                      key={q.id}
                      className="bg-surface rounded-2xl p-5 md:p-6 border border-amber-200/80 shadow-level-1 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-surface-variant pb-3">
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg shrink-0 mt-0.5">
                            {q.id}
                          </span>
                          <div>
                            <h4 className="text-sm md:text-base font-bold text-on-surface leading-snug">
                              {q.question}
                            </h4>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant/60 shrink-0 self-start">
                          Priority: {q.priority}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h5 className="text-xs font-bold text-on-surface mb-1 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-primary">task_alt</span>
                            <span>Recommended Action</span>
                          </h5>
                          <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
                            {q.recommendation}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-surface-container-high border border-outline-variant/40">
                            <h6 className="text-[11px] font-bold text-on-surface mb-1">
                              Why It Matters
                            </h6>
                            <p className="text-[11px] text-on-surface-variant leading-relaxed">
                              {q.whyItMatters}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                            <h6 className="text-[11px] font-bold text-primary mb-1 flex items-center gap-1">
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
                              <span>Request Advisory Support</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Diagnostic Capability Breakdown */}
            <div className="space-y-4 pt-4 border-t border-surface-variant">
              <h3 className="text-lg font-bold text-on-surface">
                Capability Breakdown (5 Areas)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {displayedCapabilities.map((cap) => {
                  const capScoreData = currentPillarScoreResult.capabilityScores[cap.id] || {
                    score: 0,
                    yes: 0,
                    total: 5,
                  };
                  const tier = getMaturityTier(capScoreData.score);

                  return (
                    <div
                      key={cap.id}
                      className="bg-surface rounded-2xl p-4 border border-outline-variant/60 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {cap.id}
                          </span>
                          <span className="text-xs font-black text-on-surface">
                            {capScoreData.score}%
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-on-surface line-clamp-2 mb-1">
                          {cap.name}
                        </h4>
                        <p className="text-[10px] text-on-surface-variant line-clamp-2">
                          {cap.focus}
                        </p>
                      </div>

                      <div className="pt-2 mt-3 border-t border-surface-variant/40 flex justify-between items-center text-[10px] text-on-surface-variant font-medium">
                        <span>{capScoreData.yes}/{capScoreData.total} Verified</span>
                        <span className="font-bold text-on-surface">{tier.label.replace(" Stage", "")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Floating Bar in Results View */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-level-2">
              <button
                type="button"
                onClick={() => setViewMode("overview")}
                className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                &larr; Return to Assessment Hub
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("questionnaire");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-semibold text-xs md:text-sm transition-all flex items-center gap-1.5 cursor-pointer bg-surface"
                >
                  <span className="material-symbols-outlined text-[17px]">edit</span>
                  <span>Review Answers</span>
                </button>
                {selectedPillarId < 8 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPillarId(selectedPillarId + 1);
                      setViewMode("questionnaire");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs md:text-sm btn-shadow hover-lift transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue to Pillar 0{selectedPillarId + 1}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                ) : (
                  <Link
                    href="/dashboard"
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs md:text-sm btn-shadow hover-lift transition-all flex items-center gap-1.5"
                  >
                    <span>View Overall Farm Radar</span>
                    <span className="material-symbols-outlined text-[18px]">insights</span>
                  </Link>
                )}
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
      </div>
    </AppShell>
  );
}
