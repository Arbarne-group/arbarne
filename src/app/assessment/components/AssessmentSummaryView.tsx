"use client";

import React, { useMemo } from "react";
import {
  getPillarById,
  ALL_PILLARS,
  DEFAULT_PILLAR_2_ANSWERS,
} from "@/data/assessmentData";

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

  // Compute capability scores
  const capabilityScores = useMemo(() => {
    return pillar.capabilities.map((cap) => {
      const yesCount = cap.questions.filter((q) => answers[q.id] === "yes").length;
      const total = cap.questions.length || 5;
      const percent = Math.round((yesCount / total) * 100);

      // Color coding per mockup: #4CAF50 (green), #FDD835 (yellow), #EF5350 (red)
      let color = "#EF5350";
      if (percent >= 70) {
        color = "#4CAF50";
      } else if (percent >= 50) {
        color = "#FDD835";
      }

      return {
        id: cap.id,
        name: cap.name,
        code: `${pillar.id}.${cap.number}`,
        yesCount,
        total,
        percent,
        color,
      };
    });
  }, [pillar, answers]);

  const totalQuestions = pillar.capabilities.flatMap((c) => c.questions).length || 25;
  const totalYes = capabilityScores.reduce((acc, c) => acc + c.yesCount, 0);
  const scorePercent = Math.round((totalYes / totalQuestions) * 100);

  // Gauge calculation: circumference = 125.6, offset = 125.6 * (1 - ratio)
  const clampedRatio = Math.max(0, Math.min(1, totalYes / totalQuestions));
  const dashOffset = (125.6 * (1 - clampedRatio)).toFixed(1);

  // Status tier configuration
  const getTier = (scorePct: number) => {
    if (scorePct >= 80) {
      return {
        label: "Leading",
        badgeBg: "bg-emerald-50",
        badgeBorder: "border-emerald-200",
        badgeText: "text-emerald-700",
        strokeColor: "#4CAF50",
      };
    }
    if (scorePct >= 60) {
      return {
        label: "Advancing",
        badgeBg: "bg-green-50",
        badgeBorder: "border-green-200",
        badgeText: "text-green-700",
        strokeColor: "#63e062",
      };
    }
    if (scorePct >= 40) {
      return {
        label: "Progressing",
        badgeBg: "bg-amber-50",
        badgeBorder: "border-amber-200",
        badgeText: "text-amber-700",
        strokeColor: "#FDD835",
      };
    }
    return {
      label: "Emerging",
      badgeBg: "bg-rose-50",
      badgeBorder: "border-rose-200",
      badgeText: "text-rose-700",
      strokeColor: "#EF5350",
    };
  };

  const tier = getTier(scorePercent);
  const feedbackText =
    scorePercent >= 70
      ? pillar.feedback.advanced
      : scorePercent >= 40
      ? pillar.feedback.progressing
      : pillar.feedback.emerging;

  const nextPillarId = pillar.id < ALL_PILLARS.length ? pillar.id + 1 : 1;

  const handleDownloadReport = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-background p-margin-mobile md:p-margin-desktop">
      <div className="max-w-[800px] mx-auto w-full flex flex-col items-center">
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
              stroke={tier.strokeColor}
              strokeDasharray="125.6"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeWidth="8"
            />
            {/* Inner Shadow/Glow Effect */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="transparent"
              stroke={tier.strokeColor}
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
          className={`inline-flex items-center justify-center px-3 py-1 rounded-full ${tier.badgeBg} border ${tier.badgeBorder} mb-xl`}
        >
          <span
            className={`font-label-sm text-[12px] font-bold uppercase tracking-widest ${tier.badgeText}`}
          >
            {tier.label}
          </span>
        </div>

        {/* Feedback Card */}
        <div className="w-full bg-surface border border-surface-container-high rounded-2xl p-lg shadow-sm mb-xl">
          <p className="font-body-md text-body-md text-on-surface-variant text-center leading-relaxed m-0">
            {feedbackText}
          </p>
        </div>

        {/* Capability List */}
        <div className="w-full flex flex-col gap-5 mb-xl">
          {capabilityScores.map((cap) => (
            <div
              key={cap.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 bg-surface rounded-xl border border-surface-container-high shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col">
                <span className="font-title-md text-[16px] font-semibold text-on-surface">
                  Capability {cap.code}: {cap.name}
                </span>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex-1 md:w-32 h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cap.percent}%`,
                      backgroundColor: cap.color,
                    }}
                  />
                </div>
                <span className="font-title-md text-title-md font-bold text-on-surface min-w-[36px] text-right">
                  {cap.yesCount}/{cap.total}
                </span>
              </div>
            </div>
          ))}
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
