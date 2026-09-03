import { ALL_PILLARS, PillarData, AssessmentQuestion } from "@/data/allPillarsData";

export interface PillarScoreResult {
  pillarId: number;
  pillarName: string;
  score: number; // 0 - 100
  totalQuestions: number;
  answeredCount: number;
  yesCount: number;
  noCount: number;
  capabilityScores: Record<string, { name: string; score: number; yes: number; total: number }>;
}

export interface OverallAssessmentResult {
  overallFfmiScore: number; // 0 - 100
  totalAnswered: number;
  totalQuestions: number;
  totalYes: number;
  totalNo: number;
  pillarScores: PillarScoreResult[];
  tier: {
    label: string;
    description: string;
    badgeColor: string;
    textColor: string;
    color: string;
  };
}

export function getMaturityTier(score: number) {
  if (score >= 80) {
    return {
      label: "Leading Stage",
      description: "Exemplary operations, robust institutional systems, and future-ready benchmarks.",
      badgeColor: "bg-primary text-white",
      textColor: "text-primary",
      color: "border-primary bg-primary/10",
    };
  }
  if (score >= 60) {
    return {
      label: "Advancing Stage",
      description: "Robust capability foundation with systematic operations and targeted growth priorities.",
      badgeColor: "bg-primary text-white",
      textColor: "text-primary",
      color: "border-primary bg-primary-container/20",
    };
  }
  if (score >= 40) {
    return {
      label: "Developing Stage",
      description: "Foundational adoption taking shape with notable operational and data gaps.",
      badgeColor: "bg-amber-600 text-white",
      textColor: "text-amber-800",
      color: "border-amber-300 bg-amber-50",
    };
  }
  return {
    label: "Emerging Stage",
    description: "Early-stage operational awareness; immediate quick-win interventions required.",
    badgeColor: "bg-rose-600 text-white",
    textColor: "text-rose-800",
    color: "border-rose-300 bg-rose-50",
  };
}

export function computeAssessmentResults(
  answers: Record<string, "yes" | "no">
): OverallAssessmentResult {
  const pillarResults: PillarScoreResult[] = [];
  let totalYes = 0;
  let totalNo = 0;
  let totalAnswered = 0;
  let totalQuestionsCount = 0;

  ALL_PILLARS.forEach((pillar) => {
    let pYes = 0;
    let pNo = 0;
    let pAnswered = 0;
    const pTotal = 25;
    totalQuestionsCount += pTotal;

    const capScores: Record<
      string,
      { name: string; score: number; yes: number; total: number }
    > = {};

    pillar.capabilities.forEach((cap) => {
      let cYes = 0;
      cap.questions.forEach((q) => {
        const val = answers[q.id];
        if (val === "yes") {
          cYes++;
          pYes++;
          totalYes++;
          pAnswered++;
          totalAnswered++;
        } else if (val === "no") {
          pNo++;
          totalNo++;
          pAnswered++;
          totalAnswered++;
        }
      });

      capScores[cap.id] = {
        name: cap.name,
        score: Math.round((cYes / cap.questions.length) * 100),
        yes: cYes,
        total: cap.questions.length,
      };
    });

    const pScore = Math.round((pYes / pTotal) * 100);

    pillarResults.push({
      pillarId: pillar.id,
      pillarName: pillar.name,
      score: pScore,
      totalQuestions: pTotal,
      answeredCount: pAnswered,
      yesCount: pYes,
      noCount: pNo,
      capabilityScores: capScores,
    });
  });

  const overallScore =
    pillarResults.length > 0
      ? Math.round(
          pillarResults.reduce((acc, p) => acc + p.score, 0) /
            pillarResults.length
        )
      : 0;

  return {
    overallFfmiScore: overallScore,
    totalAnswered,
    totalQuestions: totalQuestionsCount,
    totalYes,
    totalNo,
    pillarScores: pillarResults,
    tier: getMaturityTier(overallScore),
  };
}
