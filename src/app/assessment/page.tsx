"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

  // Navigate to Questionnaire
  const handleSelectPillar = (pillarId: number) => {
    setSelectedPillarId(pillarId);
    setCurrentView("focus");
    router.push(`/assessment?view=focus&pillar=${pillarId}`);
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
