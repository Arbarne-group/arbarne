"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppUser as useUser } from "@/hooks/useAppUser";
import {
  getPillarById,
} from "@/data/assessmentData";
import { getActiveUserEmail } from "@/lib/onboardingGuard";
import PageLoader from "@/components/PageLoader";

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
  const { user, isLoaded } = useUser();
  const pillar = getPillarById(pillarId);
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
    nextEligibleDate: string | null;
    daysRemaining: number;
  }>({ isCompleted: false, canReassess: true, nextEligibleDate: null, daysRemaining: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Gate the entire view behind the server response
  const [isLoading, setIsLoading] = useState(true);
  // Smooth reading progress 0..1 across the questions only.
  const [scrollFrac, setScrollFrac] = useState(0);
  const questionsRef = useRef<HTMLFormElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Always start at the top when opening (or switching) pillars: reset the
  // window and every scrollable ancestor so no retained position shows.
  // Runs again once loading finishes, since content arriving late shifts
  // the layout after the initial reset.
  useEffect(() => {
    if (isLoading) return;
    window.scrollTo(0, 0);
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }
    let el: HTMLElement | null = rootRef.current?.parentElement ?? null;
    while (el) {
      if (el.scrollHeight > el.clientHeight + 1) {
        el.scrollTop = 0;
      }
      el = el.parentElement;
    }
  }, [pillarId, isLoading]);

  // Completed pillars under the 90-day cooldown are strictly read-only
  const isReadOnly = cooldownStatus.isCompleted && !cooldownStatus.canReassess;

  const activeEmail = user?.primaryEmailAddress?.emailAddress || getActiveUserEmail();

  // Smooth progress across the questions region only (not the footer):
  // measured off the questions form itself, so it works no matter which
  // ancestor container actually scrolls. Capture phase catches scrolls
  // from nested scroll containers too.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = questionsRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const frac = (vh * 0.85 - rect.top) / Math.max(rect.height, 1);
        setScrollFrac(Math.min(1, Math.max(0, frac)));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [pillarId, isLoading]);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      // Re-arm the gate on pillar switches
      setIsLoading(true);
      try {
        const email = activeEmail;
        if (!email) {
          // No identity even after Auth settled: stop loading and render
          // whatever is cached instead of spinning forever.
          if (isLoaded && !cancelled) setIsLoading(false);
          return;
        }
        const res = await fetch(`/api/assessment/responses?email=${encodeURIComponent(email)}`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        let locked = false;
        if (data.pillarStatus && data.pillarStatus[pillarId]) {
          const pStatus = data.pillarStatus[pillarId];
          locked = Boolean(pStatus.isCompleted) && !(pStatus.canReassess ?? true);
          setCooldownStatus({
            isCompleted: Boolean(pStatus.isCompleted),
            canReassess: pStatus.canReassess ?? true,
            nextEligibleDate: pStatus.nextEligibleDate,
            daysRemaining: pStatus.daysRemaining ?? 0,
          });
        }
        if (data.answers && Object.keys(data.answers).length > 0) {
          const pillarQIds = new Set(
            pillar.capabilities.flatMap((c) => c.questions.map((q) => q.id))
          );
          setAnswers((prev) => {
            let combined: Record<string, "yes" | "no">;
            if (locked) {
              // Server answers win. Drop any stale local
              // edits for this pillar so wrong data is never displayed.
              const local = { ...prev };
              pillarQIds.forEach((id) => {
                delete local[id];
              });
              combined = { ...local, ...data.answers };
            } else {
              combined = { ...data.answers, ...prev };
            }
            try {
              localStorage.setItem(
                "future_farms_assessment_answers",
                JSON.stringify(combined)
              );
              const prevAll = JSON.parse(localStorage.getItem("future_farms_all_answers") || "{}");
              localStorage.setItem("future_farms_all_answers", JSON.stringify({ ...prevAll, ...combined }));
            } catch (err) {
              console.error(err);
            }
            return combined;
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [pillarId, activeEmail, isLoaded]);

  // All questions across all capabilities, in order, with running numbers.
  const allQuestions = pillar.capabilities.flatMap((cap) =>
    cap.questions.map((q) => ({ ...q, capabilityId: cap.id, capabilityName: cap.name }))
  );
  const totalQuestionsInPillar = allQuestions.length;

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAnswer = (questionId: string, value: "yes" | "no") => {
    if (isReadOnly) return;
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    if (validationError) {
      const remaining = allQuestions.filter((q) => !updated[q.id]);
      if (remaining.length === 0) {
        setValidationError(null);
      }
    }
    try {
      localStorage.setItem(
        "future_farms_assessment_answers",
        JSON.stringify(updated)
      );
      const prevAll = JSON.parse(localStorage.getItem("future_farms_all_answers") || "{}");
      localStorage.setItem("future_farms_all_answers", JSON.stringify({ ...prevAll, ...updated }));
    } catch (e) {
      console.error(e);
    }
  };

  const unansweredQuestions = allQuestions.filter((q) => !answers[q.id]);
  const isPillarComplete = unansweredQuestions.length === 0;
  const answeredCount = totalQuestionsInPillar - unansweredQuestions.length;

  const handleSubmit = async () => {
    if (!isPillarComplete) {
      setValidationError(
        `Please answer all questions before submitting (${unansweredQuestions.length} question${
          unansweredQuestions.length > 1 ? "s" : ""
        } remaining).`
      );
      setToastMessage(`Please answer all ${unansweredQuestions.length} remaining question(s).`);
      setTimeout(() => setToastMessage(null), 3500);
      const firstUnansweredId = unansweredQuestions[0]?.id;
      if (firstUnansweredId) {
        const el = document.getElementById(`question-${firstUnansweredId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setValidationError(null);

    // Single page: submit the whole pillar at once.
    if (cooldownStatus.isCompleted && !cooldownStatus.canReassess) {
      // In cooldown, skip API submission and view existing summary
      onComplete(pillarId, answers);
      return;
    }
    setIsSubmitting(true);
    try {
      localStorage.setItem(
        "future_farms_assessment_answers",
        JSON.stringify(answers)
      );
      const prevAll = JSON.parse(localStorage.getItem("future_farms_all_answers") || "{}");
      localStorage.setItem("future_farms_all_answers", JSON.stringify({ ...prevAll, ...answers }));
      const email = activeEmail;
      const res = await fetch("/api/assessment/submit-pillar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pillarId, answers }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.warn("[Questionnaire] Database submission notice:", errData);
      }
    } catch (e) {
      console.error("Error submitting pillar to database API:", e);
    } finally {
      setIsSubmitting(false);
    }
    onComplete(pillarId, answers);
  };

  const handleBack = () => {
    onExit();
  };

  // Locked, loading, or otherwise not ready
  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <PageLoader message="Loading pillar assessment…" />
      </div>
    );
  }

  return (
    <div ref={rootRef} className="flex flex-col flex-1 min-h-screen">
      {/* Pillar Title & Progress (sticky: touches the navbar on mobile) */}
      <div className="w-full bg-surface border-b border-outline-variant/50 sticky top-0 z-30 shadow-sm">
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
            <h1 className="font-title-md text-lg md:text-headline-lg text-on-surface font-semibold">
              Pillar {pillar.id}: {pillar.name}
            </h1>
          </div>

          <div className="flex items-center gap-4 justify-between md:justify-end">
            <div className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              {answeredCount} of {totalQuestionsInPillar} answered
            </div>
          </div>
        </div>

        {/* Cooldown Alert Banner */}
        {cooldownStatus.isCompleted && !cooldownStatus.canReassess && (
          <div className="bg-amber-50/95 border-t border-b border-amber-200/80 px-6 py-3">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs md:text-sm text-amber-900">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-lg">lock_clock</span>
                <span>
                   Completed on{" "}
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

        {/* Smooth continuous progress — fills as the view moves down */}
        <div className="w-full bg-surface-container h-1.5">
          <div
            className="h-full"
            style={{ width: `${scrollFrac * 100}%`, backgroundColor: pillar.accentColor }}
          />
        </div>
      </div>

      {/* Assessment Form Area — all capabilities on one page */}
      <div className="flex-1 overflow-y-auto p-margin-mobile md:p-8 flex justify-center pb-24 md:pb-12 bg-surface-container-low">
        <div className="w-full max-w-[800px] bg-surface-container-lowest rounded-2xl shadow-sm p-6 md:p-10 border border-outline-variant/30 h-fit">
          {validationError && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300 text-sm animate-fadeIn">
              <span className="material-symbols-outlined text-red-500 text-xl shrink-0">error</span>
              <span className="font-medium">{validationError}</span>
            </div>
          )}

          <form
            ref={questionsRef}
            className="space-y-10"
            onSubmit={(e) => e.preventDefault()}
          >
            {pillar.capabilities.map((cap, capIdx) => {
              const startNum =
                pillar.capabilities
                  .slice(0, capIdx)
                  .reduce((acc, c) => acc + c.questions.length, 0) + 1;
              return (
                <section key={cap.id} aria-label={cap.name}>
                  <div className="mb-5">
                    <p className="font-label-sm text-label-sm text-primary font-bold mb-1.5 uppercase tracking-widest">
                      Capability {cap.id.replace("P", "")} • {cap.name}
                    </p>
                    <div className="h-px bg-outline-variant/40" />
                  </div>
                  <div className="space-y-8">
                    {cap.questions.map((q, idx) => {
                      const qNum = startNum + idx;
                      const currentVal = answers[q.id];
                      const isMissing = Boolean(validationError && !currentVal);

                      return (
                        <div
                          key={q.id}
                          id={`question-${q.id}`}
                          className={`p-5 rounded-2xl transition-all duration-200 ${
                            isMissing
                              ? "bg-red-50/60 dark:bg-red-950/30 border-2 border-red-400 shadow-xs"
                              : "border-b border-outline-variant/20 pb-8"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <h3 className="font-title-md text-[15px] md:text-title-md text-on-surface font-medium">
                              {qNum}. {q.question_text}
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
                            <label className={`relative flex items-center ${isReadOnly ? "cursor-default" : "cursor-pointer group"}`}>
                              <input
                                type="radio"
                                name={q.id}
                                value="yes"
                                checked={currentVal === "yes"}
                                onChange={() => handleAnswer(q.id, "yes")}
                                disabled={isReadOnly}
                                className="w-6 h-6 text-primary border-outline-variant focus:ring-primary focus:ring-2 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 accent-[#009924]"
                              />
                              <span className={`ml-3 font-body-md text-[15px] md:text-title-md text-on-surface transition-colors ${isReadOnly ? "" : "group-hover:text-primary"}`}>
                                Yes
                              </span>
                            </label>

                            {/* No Radio Option */}
                            <label className={`relative flex items-center ${isReadOnly ? "cursor-default" : "cursor-pointer group"}`}>
                              <input
                                type="radio"
                                name={q.id}
                                value="no"
                                checked={currentVal === "no"}
                                onChange={() => handleAnswer(q.id, "no")}
                                disabled={isReadOnly}
                                className="w-6 h-6 text-primary border-outline-variant focus:ring-primary focus:ring-2 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 accent-[#009924]"
                              />
                              <span className={`ml-3 font-body-md text-[15px] md:text-title-md text-on-surface transition-colors ${isReadOnly ? "" : "group-hover:text-primary"}`}>
                                No
                              </span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
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
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 font-label-sm text-label-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer w-full sm:w-auto ${
                isSubmitting
                  ? "bg-primary/70 text-white cursor-wait opacity-80"
                  : isPillarComplete
                  ? "bg-[#009924] hover:bg-primary-container text-white hover:shadow-md"
                  : "bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80 border border-outline-variant"
              }`}
            >
              <span>
                {isSubmitting
                  ? "Submitting to Database..."
                  : isReadOnly
                  ? "View Summary"
                  : isPillarComplete
                  ? `Submit Pillar 0${pillar.id} Assessment`
                  : `Submit (${unansweredQuestions.length} remaining)`}
              </span>
              <span className={`material-symbols-outlined text-[20px] ${isSubmitting ? "animate-spin" : ""}`}>
                {isSubmitting ? "progress_activity" : "send"}
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
