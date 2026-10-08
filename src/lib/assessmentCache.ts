import { getActiveUserEmail } from "@/lib/onboardingGuard";

const OWNER_KEY = "future_farms_answers_owner";
const PILLAR_KEY = "future_farms_assessment_answers";
const ALL_KEY = "future_farms_all_answers";

export type CachedAnswers = Record<string, "yes" | "no">;

/**
 * The draft assessment answers in localStorage are shared per browser, not
 * per account. Without ownership, a new farmer on the same device inherits
 * the previous user's answers (pre-answered questions, phantom 1/8
 * progress). Every read/write here is gated on the cache owner matching the
 * active user; foreign caches are treated as empty so every farmer starts
 * on a clean sheet.
 */

export function answerCacheOwner(): string {
  try {
    if (typeof window === "undefined") return "";
    return (localStorage.getItem(OWNER_KEY) || "").toLowerCase();
  } catch {
    return "";
  }
}

function activeOwner(email?: string | null): string {
  const who = email ?? getActiveUserEmail() ?? "";
  return who.toLowerCase().trim();
}

function readKey(key: string, email?: string | null): CachedAnswers {
  try {
    if (typeof window === "undefined") return {};
    const who = activeOwner(email);
    if (who && answerCacheOwner() !== who) return {};
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as CachedAnswers) : {};
  } catch {
    return {};
  }
}

export function readPillarCache(email?: string | null): CachedAnswers {
  return readKey(PILLAR_KEY, email);
}

export function readAllCache(email?: string | null): CachedAnswers {
  return readKey(ALL_KEY, email);
}

export function readMergedCache(email?: string | null): CachedAnswers {
  return { ...readAllCache(email), ...readPillarCache(email) };
}

/**
 * Persist the working-set answers and merge them into the cross-pillar pool.
 * The pool restarts when the previous owner differs, so answers never leak
 * across accounts. Stamps the active user as the cache owner.
 */
export function writeAnswerCache(
  pillarAnswers: CachedAnswers,
  email?: string | null
): void {
  try {
    if (typeof window === "undefined") return;
    const who = activeOwner(email);
    localStorage.setItem(PILLAR_KEY, JSON.stringify(pillarAnswers));
    let prevAll: CachedAnswers = {};
    try {
      prevAll = JSON.parse(localStorage.getItem(ALL_KEY) || "{}");
    } catch {
      prevAll = {};
    }
    const base = !who || answerCacheOwner() === who ? prevAll : {};
    localStorage.setItem(ALL_KEY, JSON.stringify({ ...base, ...pillarAnswers }));
    if (who) localStorage.setItem(OWNER_KEY, who);
  } catch (e) {
    console.error(e);
  }
}

/** Drop all draft answers (e.g. on explicit logout). */
export function clearAnswerCache(): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(PILLAR_KEY);
    localStorage.removeItem(ALL_KEY);
    localStorage.removeItem(OWNER_KEY);
  } catch {
    // ignore restricted environments
  }
}
