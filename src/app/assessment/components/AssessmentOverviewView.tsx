"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ALL_PILLARS, AssessmentPillar } from "@/data/assessmentData";

interface AssessmentOverviewViewProps {
  onSelectPillar: (pillarId: number) => void;
}

export default function AssessmentOverviewView({
  onSelectPillar,
}: AssessmentOverviewViewProps) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [pillarProgress, setPillarProgress] = useState<
    Record<number, { completed: boolean; score?: number; answeredCount: number }>
  >({});

  // Load progress from localStorage
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem("future_farms_assessment_answers");
      if (savedAnswers) {
        const answers: Record<string, "yes" | "no"> = JSON.parse(savedAnswers);
        const progress: Record<
          number,
          { completed: boolean; score?: number; answeredCount: number }
        > = {};

        ALL_PILLARS.forEach((pillar) => {
          const allPillarQuestionIds = pillar.capabilities.flatMap((c) =>
            c.questions.map((q) => q.id)
          );
          const answered = allPillarQuestionIds.filter((id) => answers[id]);
          const yesCount = allPillarQuestionIds.filter((id) => answers[id] === "yes").length;

          progress[pillar.id] = {
            completed: answered.length === allPillarQuestionIds.length && answered.length > 0,
            score: answered.length > 0 ? Math.round((yesCount / allPillarQuestionIds.length) * 100) : undefined,
            answeredCount: answered.length,
          };
        });

        setPillarProgress(progress);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const totalAnswered = Object.values(pillarProgress).reduce(
    (acc, p) => acc + (p.answeredCount || 0),
    0
  );
  const completedPillarsCount = Object.values(pillarProgress).filter(
    (p) => p.completed
  ).length;

  const assessmentStatus =
    completedPillarsCount === 8
      ? "Completed"
      : totalAnswered > 0
      ? "In Progress"
      : "Not Started";

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface-container-low min-h-screen">
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
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="px-6 py-2 border border-outline text-primary font-label-sm text-label-sm rounded-full hover:bg-surface-variant transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">history</span>
            Assessment History
          </button>
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
              schedule
            </span>
            <span className="font-display-lg text-display-lg font-bold text-on-surface">
              ~60{" "}
              <span className="text-title-md font-normal text-on-surface-variant">
                min
              </span>
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-center">
              Estimated Time
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

        {/* The 8 Pillars Section */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-title-md text-headline-lg-mobile font-semibold text-on-surface">
              The 8 Pillars
            </h2>
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

              return (
                <div
                  key={pillar.id}
                  onClick={() => onSelectPillar(pillar.id)}
                  className="bg-surface rounded-2xl p-5 shadow-level-1 border border-outline-variant/50 hover:shadow-level-2 transition-all flex flex-col justify-between hover:-translate-y-1 cursor-pointer group h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-10 h-10 rounded-full ${pillar.iconBg} flex items-center justify-center shrink-0`}
                      style={{
                        backgroundColor: `${pillar.accentColor}1A`,
                        color: pillar.accentColor,
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{ color: pillar.accentColor }}
                      >
                        {pillar.icon}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {status?.completed && (
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          check_circle
                        </span>
                      )}
                      <span className="font-label-sm text-xs font-bold text-on-surface-variant bg-surface-variant px-2 py-1 rounded-full">
                        {pillar.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <h3 className="font-title-md text-title-md font-semibold text-on-surface leading-snug mb-3 group-hover:text-primary transition-colors min-h-[3.75rem] flex items-start">
                      {pillar.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-on-surface-variant pt-3 border-t border-outline-variant/20 mt-auto">
                      <span>5 Capabilities • 25 Questions</span>
                      {status?.score !== undefined ? (
                        <span className="font-bold text-primary">
                          {status.score}%
                        </span>
                      ) : (
                        <span className="text-outline">Ready</span>
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

            <div className="py-4 space-y-3">
              <div className="p-3 bg-surface-container rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-on-surface">
                    Pillar 2: Renewable Energy Baseline
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Completed 14 of 25 questions (56%)
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-full">
                  Progressing
                </span>
              </div>
              <div className="p-3 bg-surface-container rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-on-surface">
                    Initial Farm Self-Assessment
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Started Sept 2026 • 8 Pillars
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-full">
                  Active
                </span>
              </div>
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
    </main>
  );
}
