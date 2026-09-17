"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ALL_PILLARS, AssessmentPillar } from "@/data/assessmentData";
import { getActiveUserEmail } from "@/lib/onboardingGuard";
import { ArrowRight } from "lucide-react";

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
        const savedAll = localStorage.getItem("future_farms_all_answers");
        const savedAnswers = localStorage.getItem("future_farms_assessment_answers");
        const parsedAll = savedAll ? JSON.parse(savedAll) : {};
        const parsedPillar = savedAnswers ? JSON.parse(savedAnswers) : {};
        answers = { ...parsedAll, ...parsedPillar, ...answers };
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
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8 ">
        {/* Page Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 ">
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
            {completedPillarsCount === 8 ? (
              <Link
                href="/assessment/report?pillar=all"
                className="px-5 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-label-md text-sm font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                Download 8-Pillar Report (PDF)
              </Link>
            ) : (
              <Link
                href="/assessment/report?pillar=all"
                title={`All 8 pillars required for full report (${completedPillarsCount}/8 completed). Click to view progress and available individual reports.`}
                className="px-5 py-2 rounded-full bg-surface-variant/70 hover:bg-surface-variant text-on-surface-variant font-label-md text-sm font-bold flex items-center gap-1.5 border border-outline-variant/40 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-amber-700">lock</span>
                <span>8-Pillar Report</span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono border border-amber-300">
                  {completedPillarsCount}/8 Done
                </span>
              </Link>
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
            <span className="font-label-md text-label-md text-on-surface-variant text-center">
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
            <span className="font-label-md text-label-md text-on-surface-variant text-center">
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
            <span className="font-label-md text-label-md text-on-surface-variant text-center">
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
            <span className="font-label-md text-label-md text-on-surface-variant text-center">
              Status
            </span>
          </div>
        </div>

       
        {/* The 8 Pillars Section */}
        <div className="mt-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-title-md text-headline-lg-mobile font-semibold text-on-surface">
                The 8 Pillars
              </h2>
              <p className="text-sm text-on-surface-variant">
                Progression across 8 pillars (P1–P8) and 40 capabilities (1.1–8.5).
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectPillar(1)}
              className="text-secondary font-label-md text-label-md hover:underline flex items-center gap-1 cursor-pointer"
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
                  onClick={() => onSelectPillar(pillar.id)}
                  className="bg-surface rounded-2xl p-5 shadow-level-1 border border-outline-variant/50 hover:shadow-level-2 transition-all flex flex-col justify-between hover:-translate-y-1 cursor-pointer group h-full relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3">
                    {/* Enhanced Interesting Pillar Icon */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${pillar.accentColor}25 0%, ${pillar.accentColor}45 100%)`,
                        border: `1.5px solid ${pillar.accentColor}66`,
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[28px] drop-shadow-sm"
                        style={{ color: pillar.accentColor }}
                      >
                        {pillar.icon}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-label-md text-sm font-bold text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded-full">
                        P{pillar.id}
                      </span>
                      {isLockedCooldown && status?.completed ? (
                        <span className="material-symbols-outlined text-secondary text-[18px]">
                          check_circle
                        </span>
                      ) : null}
                      
                    </div>
                  </div>

                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-title-md text-title-md font-semibold text-on-surface leading-snug mb-1 group-hover:text-primary transition-colors">
                        {pillar.name}
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2 mb-3">
                        {pillar.principle}
                      </p>

                     
                    </div>

                    <div className="flex items-center justify-between text-sm text-on-surface-variant pt-2.5 border-t border-outline-variant/20 mt-auto">
                      <span className="font-mono text-[12px]">Cap. {pillar.id}.1–{pillar.id}.5</span>
                      {status?.completed ? (
                        <div className="flex items-center gap-2">
                          
                          {isLockedCooldown ? (
                            <span className="font-semibold text-amber-800 text-[12px] flex items-center gap-0.5">
                              <span>Summary</span>
                              <ArrowRight size={14} className="text-amber-800" />
                            </span>
                          ) : isReassessReady ? (
                            <span className="font-semibold text-emerald-700 text-[12px] group-hover:underline">
                              Start Assessment
                            </span>
                          ) : (
                            <span className="font-semibold text-primary text-[12px]">Summary </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-primary font-semibold text-[12px] group-hover:underline">Start Pillar </span>
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
            onClick={() => {
              const nextPillar = ALL_PILLARS.find((p) => !pillarProgress[p.id]?.completed)?.id || 1;
              onSelectPillar(nextPillar);
            }}
            className="bg-[#009924] text-on-primary font-label-md text-label-md px-10 py-4 rounded-xl shadow-level-1 hover:shadow-level-2 transition-all duration-200 flex items-center gap-3 w-full md:w-auto justify-center font-semibold group cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
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
                  <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
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
                        <p className="text-sm text-on-surface-variant">
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
                        className={`px-2.5 py-1 text-sm font-bold rounded-full shrink-0 ${
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
