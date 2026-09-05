"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AssessmentNavShell from "../components/AssessmentNavShell";
import AssessmentStandardQuestionnaireView from "../components/AssessmentStandardQuestionnaireView";
import { getPillarById } from "@/data/assessmentData";

export default function Pillar2FocusPage() {
  const router = useRouter();
  const pillar = getPillarById(2);

  const handleExit = () => {
    router.push("/assessment");
  };

  const handleComplete = () => {
    router.push("/assessment/pillar-2/summary");
  };

  return (
    <AssessmentNavShell
      headerTitle={`Pillar ${pillar.id}: ${pillar.name}`}
      showContextualHeader={false}
    >
      <AssessmentStandardQuestionnaireView
        pillarId={2}
        onExit={handleExit}
        onComplete={handleComplete}
      />
    </AssessmentNavShell>
  );
}
