"use client";

import React, { useMemo, useState } from "react";
import {
  getPillarById,
  ALL_PILLARS,
  DEFAULT_PILLAR_2_ANSWERS,
} from "@/data/assessmentData";
import {
  getCapabilityTier,
  getCapabilityFeedbackText,
  getPillarAutomaticFeedback,
} from "@/data/capabilityFeedback";

interface AssessmentSummaryViewProps {
  pillarId: number;
  answers?: Record<string, "yes" | "no">;
  onBackToHub: () => void;
  onContinueToNextPillar: (nextPillarId: number) => void;
}

export default function AssessmentSummaryView({
  pillarId,
  answers: propAnswers,
  onBackToHub,
  onContinueToNextPillar,
}: AssessmentSummaryViewProps) {
  const pillar = getPillarById(pillarId);
  const [expandedCapIds, setExpandedCapIds] = useState<Record<string, boolean>>({});

  // Load answers from prop or localStorage or fallback to mock defaults
  const answers = useMemo(() => {
    if (propAnswers && Object.keys(propAnswers).length > 0) {
      return propAnswers;
    }
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("future_farms_assessment_answers");
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Default baseline for Pillar 2 is 14/25
    return DEFAULT_PILLAR_2_ANSWERS;
  }, [propAnswers]);

  // Compute capability scores with status tiers & feedback
  const capabilityScores = useMemo(() => {
    return pillar.capabilities.map((cap) => {
      const yesCount = cap.questions.filter((q) => answers[q.id] === "yes").length;
      const total = cap.questions.length || 5;
      const percent = Math.round((yesCount / total) * 100);

      const tier = getCapabilityTier(yesCount, total);
      const statusFeedback = getCapabilityFeedbackText(cap.id, yesCount, cap.name);

      return {
        id: cap.id,
        name: cap.name,
        code: `${pillar.id}.${cap.number}`,
        yesCount,
        total,
        percent,
        color: tier.hex,
        tier,
        statusFeedback,
      };
    });
  }, [pillar, answers]);

  const totalQuestions = pillar.capabilities.flatMap((c) => c.questions).length || 25;
  const totalYes = capabilityScores.reduce((acc, c) => acc + c.yesCount, 0);

  // Gauge calculation: circumference = 125.6, offset = 125.6 * (1 - ratio)
  const clampedRatio = Math.max(0, Math.min(1, totalYes / totalQuestions));
  const dashOffset = (125.6 * (1 - clampedRatio)).toFixed(1);

  // Automatic feedback for pillar based on total score (0-25 scale)
  const pillarFeedback = getPillarAutomaticFeedback(totalYes, totalQuestions);

  const nextPillarId = pillar.id < ALL_PILLARS.length ? pillar.id + 1 : 1;

  const handleDownloadReport = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const toggleCapability = (capId: string) => {
    setExpandedCapIds((prev) => ({
      ...prev,
      [capId]: !prev[capId],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    pillar.capabilities.forEach((c) => {
      allOpen[c.id] = true;
    });
    setExpandedCapIds(allOpen);
  };

  const collapseAll = () => {
    setExpandedCapIds({});
  };

  return (
    <main className="flex-1 overflow-y-auto bg-background p-margin-mobile md:p-margin-desktop">
      <div className="max-w-[840px] mx-auto w-full flex flex-col items-center">
        {/* Download Report Top Action */}
        <div className="w-full flex justify-end mb-md">
          <button
            type="button"
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-surface-container-high bg-surface text-on-surface-variant shadow-sm hover:shadow-md hover:bg-surface-variant hover:border-outline-variant transition-all font-label-sm text-label-sm font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              file_download
            </span>
            Download Report
          </button>
        </div>

        {/* Heading */}
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xl text-center">
          Pillar {pillar.id} Complete
        </h1>

        {/* Score Section */}
        <div className="relative flex flex-col items-center mb-sm">
          {/* Semi-Circle SVG for Progress */}
          <svg className="w-56 h-32" viewBox="0 0 100 50">
            {/* Background Arch */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="transparent"
              stroke="#edeeef"
              strokeLinecap="round"
              strokeWidth="8"
            />
            {/* Progress Arch */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="transparent"
              stroke={pillarFeedback.strokeColor}
              strokeDasharray="125.6"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeWidth="8"
            />
            {/* Inner Shadow/Glow Effect */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="transparent"
              stroke={pillarFeedback.strokeColor}
              strokeDasharray="125.6"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeOpacity="0.3"
              strokeWidth="12"
              style={{ filter: "blur(2px)" }}
            />
          </svg>

          {/* Score Text */}
          <div className="absolute bottom-2 flex flex-col items-center justify-center w-full">
            <span
              className="text-[40px] font-bold leading-none tracking-tight text-on-surface"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {totalYes}
              <span className="text-[20px] text-on-surface-variant font-medium">
                /{totalQuestions}
              </span>
            </span>
          </div>
        </div>

        {/* Status Label */}
        <div
          className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full ${pillarFeedback.badgeBg} border ${pillarFeedback.badgeBorder} mb-6`}
        >
          <span
            className={`font-label-sm text-[12px] font-bold uppercase tracking-widest ${pillarFeedback.badgeText}`}
          >
            {pillarFeedback.label}
          </span>
        </div>

        {/* Feedback Card */}
        <div className="w-full bg-surface border border-surface-container-high rounded-2xl p-6 sm:p-7 shadow-sm mb-xl text-center">
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-2xl mx-auto m-0">
            {pillarFeedback.feedback}
          </p>
        </div>

        {/* Capability Section Header with Expand/Collapse All */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-title-md text-lg font-semibold text-on-surface">
              Capability Status Feedback
            </h2>
            <p className="text-xs text-on-surface-variant">
              Click any capability to view its maturity status and feedback.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={expandAll}
              className="text-xs font-semibold text-primary hover:underline px-2.5 py-1 rounded-lg hover:bg-primary-container/10 transition-colors cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-outline-variant">•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-xs font-semibold text-on-surface-variant hover:underline px-2.5 py-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Capability List with Interactive Status Feedback */}
        <div className="w-full flex flex-col gap-3.5 mb-xl">
          {capabilityScores.map((cap) => {
            const isExpanded = !!expandedCapIds[cap.id];

            return (
              <div
                key={cap.id}
                className={`group rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
                  isExpanded
                    ? "bg-surface shadow-level-2 border-outline-variant"
                    : "bg-surface rounded-xl border-surface-container-high shadow-sm hover:shadow-md hover:border-outline-variant/60"
                }`}
                onClick={() => toggleCapability(cap.id)}
              >
                {/* Header Row: Title, Status Badge, Score Progress, Chevron */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 select-none">
                  {/* Left: Capability Code, Name & Status Badge */}
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <span className="font-title-md text-[15px] sm:text-[16px] font-semibold text-on-surface">
                      Capability {cap.code}: {cap.name}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cap.tier.badgeBg} ${cap.tier.badgeBorder} ${cap.tier.badgeText}`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: cap.tier.hex }}
                      />
                      {cap.tier.status}
                    </span>
                  </div>

                  {/* Right: Score Progress Bar & Chevron */}
                  <div className="flex items-center gap-3.5 justify-between sm:justify-end shrink-0">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-24 md:w-32 h-2.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: `${cap.tier.hex}25` }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: cap.yesCount === 0 ? "8px" : `${cap.percent}%`,
                            backgroundColor: cap.tier.hex,
                          }}
                        />
                      </div>
                      <span className="font-title-md text-sm font-bold text-on-surface min-w-[34px] text-right">
                        {cap.yesCount}/{cap.total}
                      </span>
                    </div>

                    {/* Expand/Collapse Chevron Indicator */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center bg-surface-container/60 group-hover:bg-surface-container transition-colors shrink-0 ${
                        isExpanded ? "bg-surface-container-high" : ""
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-primary" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Capability Status Feedback Panel */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-outline-variant/30 flex flex-col bg-surface-container-lowest/50 animate-in fade-in duration-150">
                    <div
                      className={`p-4 rounded-xl border ${cap.tier.badgeBg} ${cap.tier.badgeBorder} flex flex-col gap-2`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${cap.tier.badgeText} flex items-center gap-1.5`}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: cap.tier.hex }}
                          />
                          {cap.tier.status}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface leading-relaxed m-0">
                        {cap.statusFeedback}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-md w-full max-w-sm">
          <button
            type="button"
            onClick={() => onContinueToNextPillar(nextPillarId)}
            className="w-full bg-primary text-on-primary font-label-sm text-label-sm py-4 rounded-xl shadow-sm hover:shadow-md hover:bg-surface-tint transition-all active:scale-[0.98] font-bold cursor-pointer"
          >
            {pillar.id === ALL_PILLARS.length
              ? "Return to Assessment Hub"
              : `Continue to Pillar ${nextPillarId}`}
          </button>
          <button
            type="button"
            onClick={onBackToHub}
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline decoration-transparent hover:decoration-primary underline-offset-4 cursor-pointer"
          >
            Back to Assessment Hub
          </button>
        </div>
      </div>
    </main>
  );
}
