"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AssessmentNavShell from "../components/AssessmentNavShell";
import AssessmentStandardQuestionnaireView from "../components/AssessmentStandardQuestionnaireView";
import { getPillarById } from "@/data/assessmentData";

function FocusPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pillarId = Number(searchParams.get("pillar")) || 2;
  const pillar = getPillarById(pillarId);

  const handleExit = () => {
    router.push("/assessment");
  };

  const handleComplete = (completedPillarId: number) => {
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
