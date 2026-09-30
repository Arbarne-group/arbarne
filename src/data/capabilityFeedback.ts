// Capability Status Feedback Data and Utilities
// Based on the Future Farms Framework (FFF) Capability Status Guidance

import { getPillarScoringTier } from "@/data/pillarScoringTiers";
import { getCapabilityRecommendationText } from "@/data/farmingRecommendationLibrary";

export interface CapabilityStatusTier {
  level: number; // 0 to 5
  status: string; // 'Non-Existent' | 'Emerging' | 'Basic' | 'Developing' | 'Established' | 'Advanced'
  hex: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

// Brand guide Section 3: Capability Status Colors
export const CAPABILITY_STATUS_TIERS: Record<number, CapabilityStatusTier> = {
  0: {
    level: 0,
    status: "Non-Existent",
    hex: "#D32F2F",
    badgeBg: "bg-red-50",
    badgeBorder: "border-red-200",
    badgeText: "text-red-700",
  },
  1: {
    level: 1,
    status: "Emerging",
    hex: "#F57C00",
    badgeBg: "bg-orange-50",
    badgeBorder: "border-orange-200",
    badgeText: "text-orange-700",
  },
  2: {
    level: 2,
    status: "Basic",
    hex: "#FBC02D",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
    badgeText: "text-amber-800",
  },
  3: {
    level: 3,
    status: "Developing",
    hex: "#7CB342",
    badgeBg: "bg-lime-50",
    badgeBorder: "border-lime-200",
    badgeText: "text-lime-800",
  },
  4: {
    level: 4,
    status: "Established",
    hex: "#388E3C",
    badgeBg: "bg-green-50",
    badgeBorder: "border-green-200",
    badgeText: "text-green-800",
  },
  5: {
    level: 5,
    status: "Advanced",
    hex: "#1B5E20",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    badgeText: "text-emerald-900",
  },
};

export function getCapabilityTier(yesCount: number, total: number = 5): CapabilityStatusTier {
  const ratio = total > 0 ? yesCount / total : 0;
  let level = Math.round(ratio * 5);
  level = Math.max(0, Math.min(5, level));
  return CAPABILITY_STATUS_TIERS[level] || CAPABILITY_STATUS_TIERS[0];
}

export function getCapabilityColor(yesCount: number, total: number = 5): string {
  return getCapabilityTier(yesCount, total).hex;
}

// Pillar Automatic Feedback (5 Tiers based on 0-25 score scale)
export interface PillarAutomaticFeedbackTier {
  minScore: number;
  maxScore: number;
  rangeLabel: string;
  label: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  strokeColor: string;
  feedback: string;
}

export const PILLAR_AUTOMATIC_FEEDBACK_TIERS: PillarAutomaticFeedbackTier[] = [
  {
    minScore: 0,
    maxScore: 5,
    rangeLabel: "0–5",
    label: "Critical Weakness",
    badgeBg: "bg-rose-50",
    badgeBorder: "border-rose-200",
    badgeText: "text-rose-700",
    strokeColor: "#D32F2F",
    feedback:
      "This pillar requires immediate attention. Focus on establishing the foundational systems, knowledge, and practices needed to strengthen performance. Prioritize support in the lowest-scoring capabilities before progressing to more advanced interventions.",
  },
  {
    minScore: 6,
    maxScore: 10,
    rangeLabel: "6–10",
    label: "Developing Area",
    badgeBg: "bg-orange-50",
    badgeBorder: "border-orange-200",
    badgeText: "text-orange-700",
    strokeColor: "#FB8C00",
    feedback:
      "Your farm has begun developing this pillar, but important gaps remain. Continue implementing recommended practices and seek targeted support to strengthen weaker capabilities.",
  },
  {
    minScore: 11,
    maxScore: 15,
    rangeLabel: "11–15",
    label: "Progressing",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
    badgeText: "text-amber-800",
    strokeColor: "#FDD835",
    feedback:
      "Your farm is making good progress in this pillar. Focus on improving consistency across all capabilities and addressing remaining weaknesses to achieve stronger overall performance.",
  },
  {
    minScore: 16,
    maxScore: 20,
    rangeLabel: "16–20",
    label: "Core Strength",
    badgeBg: "bg-green-50",
    badgeBorder: "border-green-200",
    badgeText: "text-green-700",
    strokeColor: "#43A047",
    feedback:
      "This pillar is performing well and contributes positively to your farm's overall development. Maintain existing good practices while focusing on continuous improvement and innovation.",
  },
  {
    minScore: 21,
    maxScore: 25,
    rangeLabel: "21–25",
    label: "Strategic Advantage",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    badgeText: "text-emerald-800",
    strokeColor: "#009924",
    feedback:
      "Congratulations! This pillar is a major strength of your farm. Continue maintaining high standards, embrace innovation, and consider sharing your experience to support other farmers and demonstrate future-ready practices.",
  },
];

export function getPillarAutomaticFeedback(
  pillarId: number,
  totalScore: number,
  totalQuestions: number = 25
): PillarAutomaticFeedbackTier {
  const normalized =
    totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 25) : totalScore;
  const clamped = Math.max(0, Math.min(25, normalized));

  const visualTier = PILLAR_AUTOMATIC_FEEDBACK_TIERS.find(
    (t) => clamped >= t.minScore && clamped <= t.maxScore
  );
  const base = visualTier || PILLAR_AUTOMATIC_FEEDBACK_TIERS[0];

  // Status wording and recommendation are pillar-specific (see scoring.json)
  const { status, recommendation } = getPillarScoringTier(pillarId, clamped);

  return { ...base, label: status, feedback: recommendation };
}

/**
 * Retrieves the tailored status feedback guidance for a capability and score.
 * Falls back dynamically to a high-quality contextual response if the capability is not in the library.
 */
export function getCapabilityFeedbackText(
  capabilityId: string,
  yesCount: number,
  capabilityName: string
): string {
  const level = Math.max(0, Math.min(5, Math.round(yesCount)));

  const libraryText = getCapabilityRecommendationText(capabilityId, level);
  if (libraryText) {
    return libraryText;
  }

  // Dynamic contextual fallback for capabilities outside the library
  switch (level) {
    case 0:
      return `Your farm has not yet established foundational practices in ${capabilityName.toLowerCase()}. Begin by identifying baseline operational requirements and introducing simple, consistent initial routines.`;
    case 1:
      return `Your farm is beginning to develop practices in ${capabilityName.toLowerCase()}, but significant operational gaps remain. Focus on creating structured management habits and addressing high-impact quick wins.`;
    case 2:
      return `Your farm has established basic foundations in ${capabilityName.toLowerCase()}. Build on these by strengthening record accuracy, process consistency, and awareness of key performance factors.`;
    case 3:
      return `Your farm demonstrates good developing progress in ${capabilityName.toLowerCase()}. Continue standardizing workflows, reviewing operational indicators, and using data to guide farm decisions.`;
    case 4:
      return `Your farm demonstrates strong, established capabilities in ${capabilityName.toLowerCase()} across most core areas. Address remaining gaps and integrate digital verification where appropriate.`;
    case 5:
    default:
      return `Congratulations! Your farm demonstrates advanced, exemplary maturity in ${capabilityName.toLowerCase()}. Continue maintaining high operational standards, benchmarking performance, and driving continuous improvement.`;
  }
}
