"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AssessmentNavShell from "../components/AssessmentNavShell";
import AssessmentStandardQuestionnaireView from "../components/AssessmentStandardQuestionnaireView";
import { getPillarById } from "@/data/assessmentData";

function FocusPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pillarId = Number(searchParams.get("pillar")) || 1;
  const pillar = getPillarById(pillarId);

  const handleExit = () => {
    router.push("/assessment");
  };

  const handleComplete = (completedPillarId: number, answers?: Record<string, "yes" | "no">) => {
    if (answers && typeof window !== "undefined") {
      try {
        localStorage.setItem("future_farms_assessment_answers", JSON.stringify(answers));
        const prevAll = JSON.parse(localStorage.getItem("future_farms_all_answers") || "{}");
        localStorage.setItem("future_farms_all_answers", JSON.stringify({ ...prevAll, ...answers }));
      } catch (e) {
        console.error(e);
      }
    }
    router.push(`/assessment/summary?pillar=${completedPillarId}`);
  };

  return (
    <AssessmentNavShell
      headerTitle={`Pillar ${pillar.id}: ${pillar.name}`}
      showContextualHeader={false}
    >
      <AssessmentStandardQuestionnaireView
        pillarId={pillarId}
        onExit={handleExit}
        onComplete={handleComplete}
      />
    </AssessmentNavShell>
  );
}

export default function AssessmentFocusPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">
            progress_activity
          </span>
        </div>
      }
    >
      <FocusPageContent />
    </Suspense>
  );
}
