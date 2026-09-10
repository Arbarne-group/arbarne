"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  getPillarById,
  AssessmentCapability,
} from "@/data/assessmentData";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

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
  const { user } = useUser();
  const pillar = getPillarById(pillarId);
  const [currentCapIndex, setCurrentCapIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("future_farms_assessment_answers");
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // ignore
      }
    }
    return {};
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cooldownStatus, setCooldownStatus] = useState<{
    isCompleted: boolean;
    canReassess: boolean;
    nextEligibleDate?: string | null;
    daysRemaining?: number;
  }>({
    isCompleted: false,
    canReassess: true,
    nextEligibleDate: null,
    daysRemaining: 0,
  });

  const activeEmail = user?.primaryEmailAddress?.emailAddress || getActiveUserEmail();

  // Load existing answers and cooldown status on mount
  useEffect(() => {
    try {
      const email = activeEmail;
      if (!email) return;

      fetch(`/api/assessment/responses?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.pillarStatus && data.pillarStatus[pillarId]) {
            const pStatus = data.pillarStatus[pillarId];
            setCooldownStatus({
              isCompleted: Boolean(pStatus.isCompleted),
              canReassess: pStatus.canReassess ?? true,
              nextEligibleDate: pStatus.nextEligibleDate,
              daysRemaining: pStatus.daysRemaining ?? 0,
            });
          }
          if (data.answers && Object.keys(data.answers).length > 0) {
            setAnswers((prev) => ({ ...data.answers, ...prev }));
          }
        })
        .catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }, [pillarId, activeEmail]);

  const currentCapability: AssessmentCapability =
    pillar.capabilities[currentCapIndex] || pillar.capabilities[0];

  const unansweredQuestions = currentCapability.questions.filter((q) => !answers[q.id]);
  const isCurrentPageComplete = unansweredQuestions.length === 0;
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAnswer = (questionId: string, value: "yes" | "no") => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    if (validationError) {
      const remaining = currentCapability.questions.filter((q) => !updated[q.id]);
      if (remaining.length === 0) {
        setValidationError(null);
      }
    }
    try {
      localStorage.setItem(
        "future_farms_assessment_answers",
        JSON.stringify(updated)
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProgress = () => {
    if (cooldownStatus.isCompleted && !cooldownStatus.canReassess) {
      setToastMessage(
        `Reassessment locked: 90-day cooldown active (${cooldownStatus.daysRemaining} days remaining). Responses cannot be altered.`
      );
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    try {
      localStorage.setItem(
        "future_farms_assessment_answers",
        JSON.stringify(answers)
      );
      const email = activeEmail;
      fetch("/api/assessment/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pillarId, answers }),
      }).catch((e) => console.error("Error saving progress to API:", e));

      setToastMessage("Progress saved successfully!");
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNext = () => {
    if (!isCurrentPageComplete) {
      setValidationError(
        `Please answer all questions on this page before proceeding (${unansweredQuestions.length} question${
          unansweredQuestions.length > 1 ? "s" : ""
        } remaining).`
      );
      setToastMessage(`Please answer all ${unansweredQuestions.length} remaining question(s) on this page.`);
      setTimeout(() => setToastMessage(null), 3500);
      const firstUnansweredId = unansweredQuestions[0]?.id;
      if (firstUnansweredId) {
        const el = document.getElementById(`question-${firstUnansweredId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setValidationError(null);

    if (currentCapIndex < pillar.capabilities.length - 1) {
      setCurrentCapIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Completed all 5 capabilities in this pillar
      if (cooldownStatus.isCompleted && !cooldownStatus.canReassess) {
        // In cooldown, skip API submission and view existing summary
        onComplete(pillarId, answers);
        return;
      }
      try {
        localStorage.setItem(
          "future_farms_assessment_answers",
          JSON.stringify(answers)
        );
        const email = activeEmail;
        fetch("/api/assessment/submit-pillar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, pillarId, answers }),
        }).catch((e) => console.error("Error submitting pillar to API:", e));
      } catch (e) {
        console.error(e);
      }
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
        <div className="px-4 sm:px-6 md:px-12 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 max-w-5xl mx-auto w-full">
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

          <div className="flex items-center gap-4 justify-between md:justify-end">
            <div className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Questions {startQuestionNum}-{endQuestionNum} of {totalQuestionsInPillar}
            </div>
            <button
              type="button"
              onClick={handleSaveProgress}
              className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm flex items-center gap-1 border border-outline-variant rounded-lg px-3 py-1.5 hover:bg-surface-container-low cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>{" "}
              Save Progress
            </button>
          </div>
        </div>

        {/* Cooldown Alert Banner */}
        {cooldownStatus.isCompleted && !cooldownStatus.canReassess && (
          <div className="bg-amber-50/95 border-t border-b border-amber-200/80 px-6 py-3">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs md:text-sm text-amber-900">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-lg">lock_clock</span>
                <span>
                  <strong>3-Month Cooldown Active:</strong> Completed on{" "}
                  {cooldownStatus.nextEligibleDate
                    ? new Date(
                        new Date(cooldownStatus.nextEligibleDate).getTime() -
                          90 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()
                    : "previous date"}
                  . Reassessment unlocks in <strong>{cooldownStatus.daysRemaining} days</strong> (
                  {cooldownStatus.nextEligibleDate
                    ? new Date(cooldownStatus.nextEligibleDate).toLocaleDateString()
                    : "in 3 months"}
                  ). Questions are displayed in read-only mode.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onComplete(pillarId, answers)}
                className="px-3.5 py-1.5 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors shrink-0 text-xs flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <span>View Summary & Report</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

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

          {validationError && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300 text-sm animate-fadeIn">
              <span className="material-symbols-outlined text-red-500 text-xl shrink-0">error</span>
              <span className="font-medium">{validationError}</span>
            </div>
          )}

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {currentCapability.questions.map((q, idx) => {
              const currentVal = answers[q.id];
              const isMissing = Boolean(validationError && !currentVal);

              return (
                <div
                  key={q.id}
                  id={`question-${q.id}`}
                  className={`p-5 rounded-2xl transition-all duration-200 ${
                    isMissing
                      ? "bg-red-50/60 dark:bg-red-950/30 border-2 border-red-400 shadow-xs"
                      : idx < currentCapability.questions.length - 1
                      ? "border-b border-outline-variant/20 pb-8"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="font-title-md text-title-md text-on-surface font-medium">
                      {idx + 1}. {q.question_text}
                    </h3>
                    {isMissing && (
                      <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        Required
                      </span>
                    )}
                  </div>

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
          <div className="mt-10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-outline-variant/40">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_left
              </span>
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 font-label-sm text-label-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer w-full sm:w-auto ${
                isCurrentPageComplete
                  ? "bg-[#009924] hover:bg-primary-container text-white hover:shadow-md"
                  : "bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80 border border-outline-variant"
              }`}
            >
              <span>
                {currentCapIndex === pillar.capabilities.length - 1
                  ? `Submit Pillar 0${pillar.id} Assessment`
                  : isCurrentPageComplete
                  ? "Next"
                  : `Next (${unansweredQuestions.length} remaining)`}
              </span>
              <span className="material-symbols-outlined text-[20px]">
                {currentCapIndex === pillar.capabilities.length - 1 ? "send" : "chevron_right"}
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
