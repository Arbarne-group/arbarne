"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ALL_PILLARS, AssessmentPillar } from "@/data/assessmentData";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

interface PillarProgressItem {
  completed: boolean;
  score?: number;
  answeredCount: number;
  completedAt?: string | null;
  canReassess?: boolean;
  nextEligibleDate?: string | null;
  daysRemaining?: number;
}

interface AssessmentOverviewViewProps {
  onSelectPillar: (pillarId: number, isLockedByCooldown?: boolean) => void;
}

export default function AssessmentOverviewView({
  onSelectPillar,
}: AssessmentOverviewViewProps) {
  const { user } = useUser();
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [pillarProgress, setPillarProgress] = useState<
    Record<number, PillarProgressItem>
  >({});
  const [fullCooldown, setFullCooldown] = useState<{
    isFullAssessmentComplete: boolean;
    canReassessFull: boolean;
    nextEligibleDateFull: string | null;
    daysRemainingFull: number;
  }>({
    isFullAssessmentComplete: false,
    canReassessFull: true,
    nextEligibleDateFull: null,
    daysRemainingFull: 0,
  });

  // Load progress from API and localStorage
  useEffect(() => {
    async function loadProgress() {
      let answers: Record<string, "yes" | "no"> = {};
      const email = user?.primaryEmailAddress?.emailAddress || getActiveUserEmail();
      let pillarApiStatus: Record<number, any> = {};

      try {
        const res = await fetch(`/api/assessment/responses?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.answers && Object.keys(data.answers).length > 0) {
            answers = data.answers;
          }
          if (data.pillarStatus) {
            pillarApiStatus = data.pillarStatus;
          }
          setFullCooldown({
            isFullAssessmentComplete: Boolean(data.isFullAssessmentComplete),
            canReassessFull: data.canReassessFull ?? true,
            nextEligibleDateFull: data.nextEligibleDateFull ?? null,
            daysRemainingFull: data.daysRemainingFull ?? 0,
          });
        }
      } catch (e) {
        console.error("Failed to load responses from API", e);
      }

      try {
        const savedAnswers = localStorage.getItem("future_farms_assessment_answers");
        if (savedAnswers) {
          answers = { ...answers, ...JSON.parse(savedAnswers) };
        }
      } catch (e) {
        console.error(e);
      }

      const progress: Record<number, PillarProgressItem> = {};

      ALL_PILLARS.forEach((pillar) => {
        const allPillarQuestionIds = pillar.capabilities.flatMap((c) =>
          c.questions.map((q) => q.id)
        );
        const answered = allPillarQuestionIds.filter((id) => answers[id]);
        const yesCount = allPillarQuestionIds.filter((id) => answers[id] === "yes").length;
        const apiP = pillarApiStatus[pillar.id];

        const isCompleted = apiP?.isCompleted || (answered.length === allPillarQuestionIds.length && answered.length > 0);

        progress[pillar.id] = {
          completed: Boolean(isCompleted),
          score: answered.length > 0 ? Math.round((yesCount / allPillarQuestionIds.length) * 100) : (apiP?.score ?? undefined),
          answeredCount: answered.length || (apiP ? 25 : 0),
          completedAt: apiP?.completedAt || null,
          canReassess: apiP?.canReassess ?? true,
          nextEligibleDate: apiP?.nextEligibleDate || null,
          daysRemaining: apiP?.daysRemaining || 0,
        };
      });

      setPillarProgress(progress);
    }

    loadProgress();
  }, []);

  const totalAnswered = Object.values(pillarProgress).reduce(
    (acc, p) => acc + (p.answeredCount || 0),
    0
  );
  const completedPillarsCount = Object.values(pillarProgress).filter(
    (p) => p.completed
  ).length;

  const hasDoneAnyAssessment = completedPillarsCount > 0 || totalAnswered > 0;

  const assessmentStatus =
    completedPillarsCount === 8
      ? "Completed"
      : totalAnswered > 0
      ? "In Progress"
      : "Not Started";

  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface-container-low min-h-full">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        {/* Page Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-display-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2">
              Assessment Overview
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Complete the assessment to discover your farm&apos;s strengths and
              areas for improvement.
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {hasDoneAnyAssessment ? (
              <Link
                href="/assessment/report?pillar=all"
                className="px-5 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-label-sm text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                Download 8-Pillar Report (PDF)
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title="Complete at least one assessment pillar to unlock the report"
                className="px-5 py-2 rounded-full bg-surface-variant/60 text-on-surface-variant/40 font-label-sm text-xs font-bold cursor-not-allowed flex items-center gap-1.5 border border-outline-variant/30 select-none"
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                Download 8-Pillar Report (PDF)
              </button>
            )}

            {hasDoneAnyAssessment ? (
              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                className="px-5 py-2 border border-outline text-primary font-label-sm text-xs font-semibold rounded-full hover:bg-surface-variant transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">history</span>
                Assessment History
              </button>
            ) : (
              <button
                type="button"
                disabled
                title="No assessment history available yet"
                className="px-5 py-2 border border-outline-variant/30 text-on-surface-variant/40 font-label-sm text-xs font-semibold rounded-full cursor-not-allowed flex items-center gap-2 select-none"
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                Assessment History
              </button>
            )}
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Stat Card 1 */}
          <div className="bg-surface rounded-2xl p-6 shadow-level-1 flex flex-col items-center justify-center gap-2 border border-outline-variant/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span className="material-symbols-outlined text-3xl text-primary mb-1">
              checklist
            </span>
            <span className="font-display-lg text-display-lg font-bold text-on-surface">
              40
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-center">
              Capabilities
            </span>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-surface rounded-2xl p-6 shadow-level-1 flex flex-col items-center justify-center gap-2 border border-outline-variant/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span className="material-symbols-outlined text-3xl text-secondary mb-1">
              view_module
            </span>
            <span className="font-display-lg text-display-lg font-bold text-on-surface">
              8
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-center">
              Pillars
            </span>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-surface rounded-2xl p-6 shadow-level-1 flex flex-col items-center justify-center gap-2 border border-outline-variant/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span className="material-symbols-outlined text-3xl text-tertiary mb-1">
              timer
            </span>
            <span className="font-display-lg text-display-lg font-bold text-on-surface">
              ~7{" "}
              <span className="text-title-md font-normal text-on-surface-variant">
                min
              </span>
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-center">
              Per Pillar (7m each)
            </span>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-surface rounded-2xl p-6 shadow-level-1 flex flex-col items-center justify-center gap-2 border border-outline-variant/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span
              className={`material-symbols-outlined text-3xl mb-1 ${
                assessmentStatus === "Completed"
                  ? "text-primary"
                  : assessmentStatus === "In Progress"
                  ? "text-secondary"
                  : "text-outline"
              }`}
            >
              {assessmentStatus === "Completed"
                ? "check_circle"
                : assessmentStatus === "In Progress"
                ? "timelapse"
                : "pending"}
            </span>
            <span className="font-title-md text-title-md font-semibold text-on-surface mt-2 text-center">
              {assessmentStatus}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-center">
              Status
            </span>
          </div>
        </div>

        {/* 90-Day Reassessment Cycle Notice */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
            fullCooldown.isFullAssessmentComplete
              ? "bg-emerald-50/60 border-emerald-300/80"
              : "bg-surface-container-low border-primary/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                fullCooldown.isFullAssessmentComplete
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {fullCooldown.isFullAssessmentComplete ? "verified" : "calendar_month"}
              </span>
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-on-surface">
                {fullCooldown.isFullAssessmentComplete
                  ? "Full 8-Pillar Farm Assessment Completed"
                  : "Individual Pillar Assessments (~7 min per pillar)"}
              </h4>
              <p className="text-[11px] md:text-xs text-on-surface-variant">
                {fullCooldown.isFullAssessmentComplete
                  ? fullCooldown.canReassessFull
                    ? "Your 90-day cooldown cycle has elapsed! You may now retake the diagnostic to benchmark operational improvements."
                    : `Next comprehensive reassessment unlocks in ${fullCooldown.daysRemainingFull} days (on ${new Date(
                        fullCooldown.nextEligibleDateFull!
                      ).toLocaleDateString("en-GB")}). You can download your official PDF report anytime.`
                  : "Assess each pillar individually at your own pace. Once submitted, each pillar and the full assessment can only be repeated after 3 months (90 days) to track genuine capability transition."}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto ${
              fullCooldown.isFullAssessmentComplete
                ? fullCooldown.canReassessFull
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-primary/10 text-primary"
            }`}
          >
            {fullCooldown.isFullAssessmentComplete
              ? fullCooldown.canReassessFull
                ? "Reassessment Available"
                : `Cooldown: ${fullCooldown.daysRemainingFull}d Left`
              : "3-Month Reassessment Rule"}
          </span>
        </div>

        {/* The 8 Pillars Section */}
        <div className="mt-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-title-md text-headline-lg-mobile font-semibold text-on-surface">
                The 8 Pillars
              </h2>
              <p className="text-xs text-on-surface-variant">
                Progression across 8 pillars (P1–P8) and 40 capabilities (1.1–8.5).
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectPillar(1)}
              className="text-primary font-label-sm text-label-sm hover:underline flex items-center gap-1 cursor-pointer"
            >
              View all pillars{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Bento Grid for Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {ALL_PILLARS.map((pillar) => {
              const status = pillarProgress[pillar.id];
              const score = status?.score;
              const isLockedCooldown = status?.completed && status?.daysRemaining !== undefined && status.daysRemaining > 0;
              const isReassessReady = status?.completed && status?.canReassess;

              const feedbackSnippet =
                score !== undefined && score >= 75
                  ? pillar.feedback?.advanced
                  : score !== undefined && score >= 50
                  ? pillar.feedback?.progressing
                  : pillar.feedback?.emerging || pillar.principle;

              return (
                <div
                  key={pillar.id}
                  onClick={() => onSelectPillar(pillar.id, isLockedCooldown)}
                  className="bg-surface rounded-2xl p-5 shadow-level-1 border border-outline-variant/50 hover:shadow-level-2 transition-all flex flex-col justify-between hover:-translate-y-1 cursor-pointer group h-full relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3">
                    {/* Enhanced Interesting Pillar Icon */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${pillar.accentColor}25 0%, ${pillar.accentColor}45 100%)`,
                        border: `1.5px solid ${pillar.accentColor}66`,
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[28px] drop-shadow-xs"
                        style={{ color: pillar.accentColor }}
                      >
                        {pillar.icon}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isLockedCooldown ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <span className="material-symbols-outlined text-[13px]">lock_clock</span>
                          <span>{status.daysRemaining}d Cooldown</span>
                        </span>
                      ) : isReassessReady ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="material-symbols-outlined text-[13px]">lock_open</span>
                          <span>Reassess</span>
                        </span>
                      ) : status?.completed ? (
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          check_circle
                        </span>
                      ) : null}
                      <span className="font-label-sm text-xs font-bold text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded-full">
                        P{pillar.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-title-md text-title-md font-semibold text-on-surface leading-snug mb-1 group-hover:text-primary transition-colors">
                        {pillar.name}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant/80 line-clamp-2 mb-3">
                        {pillar.principle}
                      </p>

                      {/* Pillar Progression / Score & Feedback */}
                      {status?.score !== undefined ? (
                        <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 mb-3">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-on-surface-variant font-medium">Progression Score:</span>
                            <span className="font-bold text-primary">{status.score}%</span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed italic">
                            &ldquo;{feedbackSnippet}&rdquo;
                          </p>
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 mb-3 text-[11px] text-on-surface-variant flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-primary">timer</span>
                          <span>Est. ~7 min • 5 Capabilities</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2.5 border-t border-outline-variant/20 mt-auto">
                      <span className="font-mono text-[11px]">Cap. {pillar.id}.1–{pillar.id}.5</span>
                      {isLockedCooldown ? (
                        <span className="font-semibold text-amber-800 text-[11px] flex items-center gap-1">
                          <span>View Summary</span>
                          <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                        </span>
                      ) : isReassessReady ? (
                        <span className="font-semibold text-emerald-700 text-[11px] group-hover:underline">
                          Retake Assessment →
                        </span>
                      ) : status?.completed ? (
                        <span className="font-semibold text-primary text-[11px]">Completed</span>
                      ) : (
                        <span className="text-primary font-semibold text-[11px] group-hover:underline">Start Pillar →</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 flex justify-center md:justify-end border-t border-outline-variant/50 pt-8">
          <button
            type="button"
            onClick={() => onSelectPillar(2)} // Default opens Pillar 2 as requested in mockups
            className="bg-[#009924] text-on-primary font-label-sm text-label-sm px-10 py-4 rounded-xl shadow-level-1 hover:shadow-level-2 transition-all duration-200 flex items-center gap-3 w-full md:w-auto justify-center font-semibold group cursor-pointer"
          >
            Start / Continue Assessment
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* Assessment History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-level-2 border border-outline-variant">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  history
                </span>
                <h3 className="font-headline-lg text-lg font-bold text-on-surface">
                  Assessment History
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-80 overflow-y-auto pr-1">
              {ALL_PILLARS.filter((p) => {
                const prog = pillarProgress[p.id];
                return prog && (prog.completed || (prog.answeredCount && prog.answeredCount > 0));
              }).length === 0 ? (
                <div className="text-center py-8 px-4 text-on-surface-variant space-y-2">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 block">
                    inventory_2
                  </span>
                  <p className="font-semibold text-sm text-on-surface">
                    No Assessment History Recorded Yet
                  </p>
                  <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                    Complete any of the 8 capability pillars to see your benchmark scores and assessment logs here.
                  </p>
                </div>
              ) : (
                ALL_PILLARS.filter((p) => {
                  const prog = pillarProgress[p.id];
                  return prog && (prog.completed || (prog.answeredCount && prog.answeredCount > 0));
                }).map((p) => {
                  const prog = pillarProgress[p.id];
                  return (
                    <div
                      key={p.id}
                      className="p-3 bg-surface-container rounded-xl flex items-center justify-between gap-3 border border-outline-variant/30"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-on-surface truncate">
                          Pillar {p.id}: {p.name}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {prog.completed
                            ? `Completed all 25 questions • Score: ${prog.score ?? 0}%`
                            : `In Progress • ${prog.answeredCount} of 25 answered (${prog.score ?? 0}%)`}
                        </p>
                        {prog.completedAt && (
                          <p className="text-[10px] text-on-surface-variant/70 mt-0.5">
                            {new Date(prog.completedAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full shrink-0 ${
                          prog.completed
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {prog.completed ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-container transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
