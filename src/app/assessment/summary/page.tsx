"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AssessmentNavShell from "../components/AssessmentNavShell";
import AssessmentSummaryView from "../components/AssessmentSummaryView";
import { getPillarById } from "@/data/assessmentData";

function SummaryPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pillarId = Number(searchParams.get("pillar")) || 2;
  const pillar = getPillarById(pillarId);

  const handleBackToHub = () => {
    router.push("/assessment");
  };

  const handleContinue = (nextPillarId: number) => {
    router.push(`/assessment/focus?pillar=${nextPillarId}`);
  };

  return (
    <AssessmentNavShell
      headerTitle={`Pillar ${pillar.id}: ${pillar.name}`}
      showContextualHeader={true}
    >
      <AssessmentSummaryView
        pillarId={pillarId}
        onBackToHub={handleBackToHub}
        onContinueToNextPillar={handleContinue}
      />
    </AssessmentNavShell>
  );
}

export default function AssessmentSummaryPage() {
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
      <SummaryPageContent />
    </Suspense>
  );
}
