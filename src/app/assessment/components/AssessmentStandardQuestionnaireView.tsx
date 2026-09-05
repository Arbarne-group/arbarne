"use client";

import React, { useState, useEffect } from "react";
import {
  getPillarById,
  AssessmentPillar,
  AssessmentCapability,
  DEFAULT_PILLAR_2_ANSWERS,
} from "@/data/assessmentData";

interface AssessmentStandardQuestionnaireViewProps {
  pillarId: number;
  onExit: () => void;
  onComplete: (pillarId: number, answers: Record<string, "yes" | "no">) => void;
}

export default function AssessmentStandardQuestionnaireView({
  pillarId,
  onExit,
  onComplete,
}: AssessmentStandardQuestionnaireViewProps) {
  const pillar = getPillarById(pillarId);
  const [currentCapIndex, setCurrentCapIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load existing answers on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("future_farms_assessment_answers");
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
      } else if (pillarId === 2) {
        // Seed default baseline for Pillar 2 to match mockup (14/25)
        setAnswers(DEFAULT_PILLAR_2_ANSWERS);
        localStorage.setItem(
          "future_farms_assessment_answers",
          JSON.stringify(DEFAULT_PILLAR_2_ANSWERS)
        );
      }
    } catch (e) {
      console.error(e);
    }
  }, [pillarId]);

  const currentCapability: AssessmentCapability =
    pillar.capabilities[currentCapIndex] || pillar.capabilities[0];

  const handleAnswer = (questionId: string, value: "yes" | "no") => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    try {
      localStorage.setItem(
        "future_farms_assessment_answers",
        JSON.stringify(updated)
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveAndExit = () => {
    try {
      localStorage.setItem(
        "future_farms_assessment_answers",
        JSON.stringify(answers)
      );
      setToastMessage("Progress saved successfully!");
      setTimeout(() => {
        onExit();
      }, 500);
    } catch (e) {
      console.error(e);
      onExit();
    }
  };

  const handleNext = () => {
    if (currentCapIndex < pillar.capabilities.length - 1) {
      setCurrentCapIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Completed all 5 capabilities in this pillar
      onComplete(pillarId, answers);
    }
  };

  const handleBack = () => {
    if (currentCapIndex > 0) {
      setCurrentCapIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onExit();
    }
  };

  const totalQuestionsInPillar = pillar.capabilities.flatMap((c) => c.questions).length;
  // Calculate question range for current capability
  const startQuestionNum =
    pillar.capabilities
      .slice(0, currentCapIndex)
      .reduce((acc, c) => acc + c.questions.length, 0) + 1;
  const endQuestionNum = startQuestionNum + currentCapability.questions.length - 1;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Pillar Title & Progress (Sticky below top nav) */}
      <div className="w-full bg-surface border-b border-outline-variant/50 sticky top-16 md:top-0 z-30 shadow-sm">
        <div className="px-6 md:px-12 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${pillar.iconBg} flex items-center justify-center shrink-0`}
              style={{
                backgroundColor: `${pillar.accentColor}1A`,
                color: pillar.accentColor,
              }}
            >
              <span
                className={`material-symbols-outlined ${pillar.iconColor} text-[24px]`}
                style={{ color: pillar.accentColor }}
              >
                {pillar.icon}
              </span>
            </div>
            <h1 className="font-title-md text-headline-lg-mobile md:text-headline-lg text-on-surface font-semibold">
              Pillar {pillar.id}: {pillar.name}
            </h1>
          </div>

          <div className="flex items-center gap-6 justify-between md:justify-end">
            <div className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Questions {startQuestionNum}-{endQuestionNum} of {totalQuestionsInPillar}
            </div>
            <button
              type="button"
              onClick={handleSaveAndExit}
              className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm flex items-center gap-1 border border-outline-variant rounded-lg px-3 py-1.5 hover:bg-surface-container-low cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>{" "}
              Save &amp; Exit
            </button>
          </div>
        </div>

        {/* 5-Segment Progress Track for the 5 capabilities */}
        <div className="w-full bg-surface-container h-1.5 flex">
          {pillar.capabilities.map((cap, idx) => {
            const isCompleted = idx < currentCapIndex;
            const isCurrent = idx === currentCapIndex;

            return (
              <div
                key={cap.id}
                className={`h-full transition-colors duration-300 ${
                  idx > 0 ? "border-l border-surface" : ""
                } ${
                  isCurrent || isCompleted
                    ? ""
                    : "bg-surface-container"
                }`}
                style={{
                  width: `${100 / pillar.capabilities.length}%`,
                  backgroundColor: isCurrent || isCompleted ? pillar.accentColor : undefined,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Assessment Form Area */}
      <div className="flex-1 overflow-y-auto p-margin-mobile md:p-8 flex justify-center pb-24 md:pb-12 bg-surface-container-low">
        <div className="w-full max-w-[800px] bg-surface-container-lowest rounded-2xl shadow-sm p-6 md:p-10 border border-outline-variant/30 h-fit">
          <div className="mb-10">
            <p className="font-label-sm text-label-sm text-primary font-bold mb-2 uppercase tracking-widest">
              Capability {currentCapability.id.replace("P", "")}
            </p>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              {currentCapability.name}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              {currentCapability.description ||
                `Please answer the following questions to help us assess your farm's current ${currentCapability.name.toLowerCase()}.`}
            </p>
          </div>

          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            {currentCapability.questions.map((q, idx) => {
              const currentVal = answers[q.id];

              return (
                <div
                  key={q.id}
                  className={`pb-8 ${
                    idx < currentCapability.questions.length - 1
                      ? "border-b border-outline-variant/20"
                      : ""
                  }`}
                >
                  <h3 className="font-title-md text-title-md text-on-surface font-medium mb-5">
                    {idx + 1}. {q.question_text}
                  </h3>

                  <div className="flex gap-6">
                    {/* Yes Radio Option */}
                    <label className="relative flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name={q.id}
                        value="yes"
                        checked={currentVal === "yes"}
                        onChange={() => handleAnswer(q.id, "yes")}
                        className="w-6 h-6 text-primary border-outline-variant focus:ring-primary focus:ring-2 transition-colors cursor-pointer accent-[#009924]"
                      />
                      <span className="ml-3 font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                        Yes
                      </span>
                    </label>

                    {/* No Radio Option */}
                    <label className="relative flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name={q.id}
                        value="no"
                        checked={currentVal === "no"}
                        onChange={() => handleAnswer(q.id, "no")}
                        className="w-6 h-6 text-primary border-outline-variant focus:ring-primary focus:ring-2 transition-colors cursor-pointer accent-[#009924]"
                      />
                      <span className="ml-3 font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                        No
                      </span>
                    </label>
                  </div>
                </div>
              );
            })}
          </form>

          {/* Footer Actions */}
          <div className="mt-10 flex items-center justify-between pt-6 border-t border-outline-variant/40">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_left
              </span>
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-[#009924] hover:bg-primary-container text-white font-label-sm text-label-sm font-medium rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {currentCapIndex === pillar.capabilities.length - 1
                ? `Complete Pillar ${pillar.id}`
                : "Next"}
              <span className="material-symbols-outlined text-[20px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-primary-fixed">
            check_circle
          </span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
