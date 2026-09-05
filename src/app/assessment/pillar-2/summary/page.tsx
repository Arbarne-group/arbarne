"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AssessmentNavShell from "../../components/AssessmentNavShell";
import AssessmentSummaryView from "../../components/AssessmentSummaryView";
import { getPillarById } from "@/data/assessmentData";

export default function Pillar2SummaryPage() {
  const router = useRouter();
  const pillar = getPillarById(2);

  const handleBackToHub = () => {
    router.push("/assessment");
  };

  const handleContinue = (nextPillarId: number) => {
    router.push(`/assessment?view=focus&pillar=${nextPillarId}`);
  };

  return (
    <AssessmentNavShell
      headerTitle={`Pillar ${pillar.id}: ${pillar.name}`}
      showContextualHeader={true}
    >
      <AssessmentSummaryView
        pillarId={2}
        onBackToHub={handleBackToHub}
        onContinueToNextPillar={handleContinue}
      />
    </AssessmentNavShell>
  );
}
