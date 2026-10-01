import { ALL_PILLARS } from "@/data/assessmentData";

export interface CapabilityGap {
  pillarId: number;
  pillarName: string;
  capabilityId: string; // e.g. "P1.1"
  name: string;
  description: string;
  yes: number;
  answered: number;
  total: number;
  /** 0–100 over answered questions. */
  score: number;
}

/**
 * "Falling short" = scoring less than 3/5 (< 60%) on a capability, per the
 * FFMI/24 rule. Only capabilities with at least one answer are scored.
 */
export const GAP_SCORE_CUTOFF = 60;

export function computeCapabilityGaps(
  answers: Record<string, "yes" | "no"> | null | undefined
): { totalAnswered: number; weak: CapabilityGap[]; unassessedCount: number } {
  const weak: CapabilityGap[] = [];
  let totalAnswered = 0;
  let unassessedCount = 0;
  if (!answers) return { totalAnswered: 0, weak, unassessedCount: 40 };

  for (const pillar of ALL_PILLARS) {
    for (const cap of pillar.capabilities) {
      let yes = 0;
      let answered = 0;
      for (const q of cap.questions) {
        const a = (answers as Record<string, string>)[q.id];
        if (a === "yes" || a === "no") {
          answered += 1;
          totalAnswered += 1;
          if (a === "yes") yes += 1;
        }
      }
      if (answered === 0) {
        unassessedCount += 1;
        continue;
      }
      const score = Math.round((yes / answered) * 100);
      if (score < GAP_SCORE_CUTOFF) {
        weak.push({
          pillarId: pillar.id,
          pillarName: pillar.name,
          capabilityId: cap.id,
          name: cap.name,
          description: cap.description || "",
          yes,
          answered,
          total: cap.questions.length,
          score,
        });
      }
    }
  }
  // Weakest first.
  weak.sort((a, b) => a.score - b.score);
  return { totalAnswered, weak, unassessedCount };
}

/** "P1.1"-style ids from a list of items carrying JSON capabilityIds. */
export function parseCapabilityIds(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return [];
    }
  }
  return [];
}
