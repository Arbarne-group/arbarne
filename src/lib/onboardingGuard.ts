
export type OnboardingStage =
  | "INITIAL_IN_PROGRESS"
  | "INITIAL_COMPLETED"
  | "ADDITIONAL_COMPLETED"
  | "FULLY_COMPLETED";

export interface OnboardingStatus {
  stage: OnboardingStage;

  
  initialCompleted: boolean;

  
  additionalCompleted: boolean;

  profileApproved: boolean;

  initialCount: number;
  additionalCount: number;
}



function hasValue(value: any): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return Boolean(value);
}



function getInitialSurveyCompletion(user: any) {
  const isStep1Done = hasValue(
    user?.farmerProfile?.jobTitle,
  );

  const isStep2Done = hasValue(
    user?.farmManagement?.mgmtAbility,
  );

  const isStep3Done = hasValue(
    user?.operatingStyle?.decisionStyle,
  );

  const isStep4Done =
    hasValue(user?.aspiration?.fmResponsibility) ||
    hasValue(user?.aspiration?.twelveMonthSuccess);

  const isStep5Done =
    hasValue(user?.digitalPlatform?.remoteComfort) ||
    hasValue(user?.digitalPlatform?.supportReasons);

  const steps = [
    isStep1Done,
    isStep2Done,
    isStep3Done,
    isStep4Done,
    isStep5Done,
  ];

  const completedCount =
    steps.filter(Boolean).length;

  return {
    isStep1Done,
    isStep2Done,
    isStep3Done,
    isStep4Done,
    isStep5Done,
    completedCount,
    completed: completedCount === 5,
  };
}

/* ================================================================
   SURVEY 2
   OPTIONAL FARM PROFILE
   ================================================================ */

function getAdditionalSurveyCompletion(user: any) {
  const isLocationDone = hasValue(
    user?.farmLocation,
  );

  const isCharacteristicsDone = hasValue(
    user?.farmCharacteristics,
  );

  const isFarmingSystemDone = hasValue(
    user?.farmingSystem,
  );

  const isBusinessExperienceDone = hasValue(
    user?.businessExperience,
  );

  const isHouseholdLabourDone = hasValue(
    user?.householdLabour,
  );

  const sections = [
    isLocationDone,
    isCharacteristicsDone,
    isFarmingSystemDone,
    isBusinessExperienceDone,
    isHouseholdLabourDone,
  ];

  const completedCount =
    sections.filter(Boolean).length;

  return {
    isLocationDone,
    isCharacteristicsDone,
    isFarmingSystemDone,
    isBusinessExperienceDone,
    isHouseholdLabourDone,
    completedCount,
    completed: completedCount === 5,
  };
}

/* ================================================================
   ONBOARDING STATUS
   ================================================================ */

export function computeOnboardingStageFromUser(
  user: any,
): OnboardingStatus {
  if (!user) {
    return {
      stage: "INITIAL_IN_PROGRESS",
      initialCompleted: false,
      additionalCompleted: false,
      profileApproved: false,
      initialCount: 0,
      additionalCount: 0,
    };
  }

  const initial =
    getInitialSurveyCompletion(user);

  const additional =
    getAdditionalSurveyCompletion(user);

  const initialCompleted =
    initial.completed;

  const additionalCompleted =
    additional.completed;

  let stage: OnboardingStage;

  /*
   * Survey 1 is the mandatory gate.
   */

  if (!initialCompleted) {
    stage = "INITIAL_IN_PROGRESS";
  }

  /*
   * Survey 1 complete + Survey 2 incomplete.
   *
   * Platform is unlocked.
   */

  else if (!additionalCompleted) {
    stage = "INITIAL_COMPLETED";
  }

  /*
   * Both surveys complete.
   */

  else {
    stage = "FULLY_COMPLETED";
  }

  const profileApproved =
    Boolean(
      user?.onboardingStatus?.profileApproved,
    ) || additionalCompleted;

  return {
    stage,
    initialCompleted,
    additionalCompleted,
    profileApproved,
    initialCount: initial.completedCount,
    additionalCount:
      additional.completedCount,
  };
}

/* ================================================================
   ROUTE ACCESS
   ================================================================ */

export function getRouteAccess(
  pathname: string,
  stage: OnboardingStage,
  options?: {
    completedPillarsCount?: number;
    hasAssessmentHistory?: boolean;
    isStaff?: boolean;
  },
): {
  allowed: boolean;
  redirectTo?: string;
  message?: string;
  reason?: string;
} {
  /* ============================================================
     PUBLIC / AUTH / API ROUTES
     ============================================================ */

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/complete-profile" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/api") ||
    pathname === "/pricing" ||
    pathname.startsWith("/checkout")
  ) {
    return {
      allowed: true,
    };
  }

  // Staff roam freely: the farmer onboarding funnel never gates them.
  if (options?.isStaff) {
    return {
      allowed: true,
      reason: "isStaff=true → bypass",
    };
  }

  const completedPillars =
    options?.completedPillarsCount ?? 0;
  const hasAssessmentHistory =
    options?.hasAssessmentHistory ?? completedPillars > 0;

  // (Assessment-history context retained for callers; no gating uses it.)

  // No gates: farmers roam freely with or without onboarding answers or
  // assessment history. Pages render their own empty states.
  return {
    allowed: true,
    reason: "open roam",
  };
}

/* ================================================================
   ASSESSMENT PROGRESS
   ================================================================ */

export function countCompletedPillarsFromAnswers(
  answers:
    | Record<string, "yes" | "no">
    | null
    | undefined,
): number {
  if (!answers) {
    return 0;
  }

  const pillarCounts: Record<
    number,
    number
  > = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };

  Object.keys(answers).forEach((qId) => {
    const match = qId.match(
      /^P([1-8])\./i,
    );

    if (!match) {
      return;
    }

    const pillarId = parseInt(
      match[1],
      10,
    );

    pillarCounts[pillarId] =
      (pillarCounts[pillarId] || 0) + 1;
  });

  return Object.values(
    pillarCounts,
  ).filter(
    (count) => count >= 25,
  ).length;
}



export function getActiveUserEmail(): string {
  if (
    typeof window === "undefined"
  ) {
    return "";
  }

  try {
    const cached =
      localStorage.getItem(
        "future_farms_user",
      );

    if (cached) {
      const user =
        JSON.parse(cached);

      if (user?.email) {
        return user.email;
      }
    }
  } catch (error) {
    console.error(
      "Error reading active user session:",
      error,
    );
  }

  return "";
}

/**
 * Wipes all browser-stored app data (local + session storage)
 */
export function clearLocalAppData() {
  farmUnlockedCache = false;
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing local storage:", error);
  }

  try {
    sessionStorage.clear();
  } catch (error) {
    console.error("Error clearing session storage:", error);
  }
}

/* ================================================================
   FARM ACCESS FLAG (persisted unlock state)
   ================================================================ */

const FARM_UNLOCKED_KEY = "ff_farm_unlocked";

// Module-level cache so the very first paint (before any fetch) already
// knows whether My Farm was unlocked. Assessment history never disappears
// for an account, so only the unlocked state is ever persisted; logout
// resets both layers via clearLocalAppData().
let farmUnlockedCache: boolean | null = null;

/** Synchronous first-paint check: was My Farm unlocked? */
export function isFarmUnlockedCached(): boolean {
  if (farmUnlockedCache !== null) return farmUnlockedCache;
  if (typeof window === "undefined") return false;
  try {
    farmUnlockedCache = localStorage.getItem(FARM_UNLOCKED_KEY) === "1";
  } catch {
    farmUnlockedCache = false;
  }
  return farmUnlockedCache;
}

/** Persist the unlocked state once the server confirms it. */
export function setFarmUnlockedCached(unlocked: boolean) {
  farmUnlockedCache = unlocked;
  if (typeof window === "undefined") return;
  try {
    if (unlocked) localStorage.setItem(FARM_UNLOCKED_KEY, "1");
    else localStorage.removeItem(FARM_UNLOCKED_KEY);
  } catch {
    // Ignore restricted environments.
  }
}

/* ================================================================
   SAVE ACTIVE USER SESSION
   ================================================================ */

export function setActiveUserSession(
  user: any,
) {
  if (
    typeof window === "undefined" ||
    !user
  ) {
    return;
  }

  try {
    localStorage.setItem(
      "future_farms_user",
      JSON.stringify(user),
    );
  } catch (error) {
    console.error(
      "Error saving active user session:",
      error,
    );
  }
}
