"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AssessmentNavShell from "./components/AssessmentNavShell";
import AssessmentOverviewView from "./components/AssessmentOverviewView";
import AssessmentStandardQuestionnaireView from "./components/AssessmentStandardQuestionnaireView";
import AssessmentSummaryView from "./components/AssessmentSummaryView";
import { getPillarById } from "@/data/assessmentData";

function AssessmentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialView = searchParams.get("view") || "overview";
  const initialPillar = Number(searchParams.get("pillar")) || 2; // Default to Pillar 2 as highlighted in mockups

  const [currentView, setCurrentView] = useState<"overview" | "focus" | "summary">(
    initialView === "focus" || initialView === "summary" ? initialView : "overview"
  );
  const [selectedPillarId, setSelectedPillarId] = useState<number>(initialPillar);
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, "yes" | "no">>({});

  const [onboardingLoaded, setOnboardingLoaded] = useState(false);
  const [onboardingStage, setOnboardingStage] = useState<string>("FULLY_COMPLETED");

  useEffect(() => {
    let email = "keziah@futurefarms.africa";
    const cached = localStorage.getItem("future_farms_user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        if (u.email) email = u.email;
        if (u.stage) {
          setOnboardingStage(u.stage);
          if (u.stage === "INITIAL_IN_PROGRESS") {
            router.replace("/onboarding/step-1");
            return;
          } else if (u.stage === "INITIAL_COMPLETED" || u.stage === "ADDITIONAL_COMPLETED") {
            router.replace("/onboarding");
            return;
          }
        }
      } catch (e) {}
    }

    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.stage) {
          setOnboardingStage(data.stage);
          if (data.stage === "INITIAL_IN_PROGRESS") {
            router.replace("/onboarding/step-1");
          } else if (data.stage === "INITIAL_COMPLETED" || data.stage === "ADDITIONAL_COMPLETED") {
            router.replace("/onboarding");
          }
        }
      })
      .catch(console.error)
      .finally(() => setOnboardingLoaded(true));
  }, [router]);

  // Sync state with URL search params
  useEffect(() => {
    const viewParam = searchParams.get("view");
    const pillarParam = searchParams.get("pillar");

    if (viewParam === "focus" || viewParam === "summary" || viewParam === "overview") {
      setCurrentView(viewParam);
    }
    if (pillarParam) {
      const pid = Number(pillarParam);
      if (!isNaN(pid) && pid >= 1 && pid <= 8) {
        setSelectedPillarId(pid);
      }
    }
  }, [searchParams]);

  const activePillar = getPillarById(selectedPillarId);

  // Navigate to Questionnaire or Summary
  const handleSelectPillar = (pillarId: number, isLockedByCooldown?: boolean) => {
    setSelectedPillarId(pillarId);
    if (isLockedByCooldown) {
      setCurrentView("summary");
      router.push(`/assessment?view=summary&pillar=${pillarId}`);
    } else {
      setCurrentView("focus");
      router.push(`/assessment?view=focus&pillar=${pillarId}`);
    }
  };

  // Exit Questionnaire back to Hub
  const handleExitToHub = () => {
    setCurrentView("overview");
    router.push("/assessment");
  };

  // Complete Questionnaire and show Summary
  const handleCompleteQuestionnaire = (
    pillarId: number,
    answers: Record<string, "yes" | "no">
  ) => {
    setCurrentAnswers(answers);
    setCurrentView("summary");
    router.push(`/assessment?view=summary&pillar=${pillarId}`);
  };

  // From Summary to Next Pillar
  const handleContinueToNextPillar = (nextPillarId: number) => {
    if (nextPillarId === selectedPillarId) {
      setCurrentView("overview");
      router.push("/assessment");
    } else {
      setSelectedPillarId(nextPillarId);
      setCurrentView("focus");
      router.push(`/assessment?view=focus&pillar=${nextPillarId}`);
    }
  };

  // If onboarding is loaded and not yet completed, show onboarding lock screen
  if (onboardingLoaded && onboardingStage !== "FULLY_COMPLETED") {
    return (
      <AssessmentNavShell headerTitle="Assessment Hub (Locked)">
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="max-w-lg w-full bg-surface-container-lowest rounded-3xl p-8 md:p-10 text-center shadow-sm border border-surface-container-high/60 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-[32px]">lock</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Onboarding Incomplete
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface">
                Complete Onboarding to Access Your Assessment
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                To generate an accurate maturity rating and unlock personalized recommendations, you must first complete all onboarding questionnaire sections and verify your Farm Profile.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/onboarding"
                className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md btn-shadow hover-lift transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Return to Onboarding Overview</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </AssessmentNavShell>
    );
  }

  return (
    <AssessmentNavShell
      headerTitle={`Pillar ${activePillar.id}: ${activePillar.name}`}
      showContextualHeader={currentView === "summary"}
    >
      {currentView === "overview" && (
        <AssessmentOverviewView onSelectPillar={handleSelectPillar} />
      )}

      {currentView === "focus" && (
        <AssessmentStandardQuestionnaireView
          pillarId={selectedPillarId}
          onExit={handleExitToHub}
          onComplete={handleCompleteQuestionnaire}
        />
      )}

      {currentView === "summary" && (
        <AssessmentSummaryView
          pillarId={selectedPillarId}
          answers={currentAnswers}
          onBackToHub={handleExitToHub}
          onContinueToNextPillar={handleContinueToNextPillar}
        />
      )}
    </AssessmentNavShell>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-primary text-4xl animate-spin">
              progress_activity
            </span>
            <span className="font-label-sm text-sm text-on-surface-variant font-medium">
              Loading Future Farms Assessment...
            </span>
          </div>
        </div>
      }
    >
      <AssessmentPageContent />
    </Suspense>
  );
}
