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

/**
 * Compute the user's current onboarding stage based on their saved data.
 */
export function computeOnboardingStageFromUser(user: any): OnboardingStatus {
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

  // Initial Survey 1 steps (5 steps)
  const isStep1Done = Boolean(user.farmerProfile?.jobTitle);
  const isStep2Done = Boolean(user.farmManagement?.mgmtAbility);
  const isStep3Done = Boolean(user.operatingStyle?.decisionStyle);
  const isStep4Done = Boolean(user.aspiration?.fmResponsibility || user.aspiration?.twelveMonthSuccess);
  const isStep5Done = Boolean(user.digitalPlatform?.remoteComfort || user.digitalPlatform?.supportReasons);
  const initialDoneCount = [isStep1Done, isStep2Done, isStep3Done, isStep4Done, isStep5Done].filter(Boolean).length;
  const initialCompleted = initialDoneCount === 5;

  // Additional Survey 2 sections (5 sections)
  const isLocDone = Boolean(user.farmLocation);
  const isCharDone = Boolean(user.farmCharacteristics);
  const isSysDone = Boolean(user.farmingSystem);
  const isBizDone = Boolean(user.businessExperience);
  const isLabDone = Boolean(user.householdLabour);
  const additionalDoneCount = [isLocDone, isCharDone, isSysDone, isBizDone, isLabDone].filter(Boolean).length;
  const additionalCompleted = additionalDoneCount === 5;

  const profileApproved = Boolean(
    user.onboardingStatus?.profileApproved || user.onboardingStatus?.stage === "FULLY_COMPLETED" || (initialCompleted && additionalCompleted)
  );

  let stage: OnboardingStage = "INITIAL_IN_PROGRESS";
  if (initialCompleted) {
    if (additionalCompleted) {
      stage = "FULLY_COMPLETED";
    } else {
      stage = "INITIAL_COMPLETED";
    }
  }

  return {
    stage,
    initialCompleted,
    additionalCompleted,
    profileApproved: stage === "FULLY_COMPLETED",
    initialCount: initialDoneCount,
    additionalCount: additionalDoneCount,
  };
}

/**
 * Checks if a given pathname is permitted for the current onboarding stage and assessment completion.
 */
export function getRouteAccess(
  pathname: string,
  stage: OnboardingStage,
  options?: {
    completedPillarsCount?: number;
  }
): { allowed: boolean; redirectTo?: string; message?: string } {
  // Public auth & webhook paths always allowed
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/api") ||
    pathname === "/pricing" ||
    pathname.startsWith("/checkout")
  ) {
    return { allowed: true };
  }

  const completedPillars = options?.completedPillarsCount ?? 0;

  // 1. Stage 1: Initial Survey 1 In Progress
  if (stage === "INITIAL_IN_PROGRESS") {
    // Both the welcome onboarding hub (/onboarding) and Survey 1 steps (/onboarding/step-1..5) are allowed
    const isSurvey1Step = /^\/onboarding\/step-[1-5]/.test(pathname);
    if (pathname === "/onboarding" || isSurvey1Step) {
      return { allowed: true };
    }
    return {
      allowed: false,
      redirectTo: "/onboarding",
      message: "Please complete your initial farm profile survey to access the platform.",
    };
  }

  // 2. Stage 2: Survey 1 Done, Survey 2 In Progress
  if (stage === "INITIAL_COMPLETED" || stage === "ADDITIONAL_COMPLETED") {
    // Cannot repeat Survey 1 steps
    const isSurvey1Step = /^\/onboarding\/step-[1-5]/.test(pathname);
    if (isSurvey1Step) {
      return {
        allowed: false,
        redirectTo: "/onboarding",
        message: "You have already completed the first survey.",
      };
    }
    // Survey 2 paths allowed
    if (pathname.startsWith("/onboarding")) {
      return { allowed: true };
    }
    // Access to /assessment and /dashboard is strictly BLOCKED until onboarding is completed!
    return {
      allowed: false,
      redirectTo: "/onboarding",
      message: "Please complete your onboarding surveys before accessing the assessment or dashboard.",
    };
  }

  // 3. Stage 3: Fully completed onboarding
  if (stage === "FULLY_COMPLETED") {
    // Survey steps cannot be repeated once onboarding is complete -> redirect to assessment
    const isSurveyStep = /^\/onboarding\/(step-[1-5]|location|characteristics|farming-system|business-experience|household-labour|farm-profile)/.test(pathname);
    if (isSurveyStep) {
      return {
        allowed: false,
        redirectTo: "/assessment",
        message: "Onboarding completed. Please continue with your farm assessment.",
      };
    }

    // A user cannot access the dashboard without completing at least 1 pillar assessment!
    if (pathname === "/dashboard" || pathname.startsWith("/dashboard")) {
      if (completedPillars < 1) {
        return {
          allowed: false,
          redirectTo: "/assessment",
          message: "Please complete at least 1 pillar assessment to unlock your farm dashboard.",
        };
      }
    }

    return { allowed: true };
  }

  return { allowed: true };
}

/**
 * Counts how many pillars have at least 25 answered questions from user's answers dictionary.
 */
export function countCompletedPillarsFromAnswers(answers: Record<string, "yes" | "no"> | null | undefined): number {
  if (!answers) return 0;
  const pillarCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
  Object.keys(answers).forEach((qId) => {
    const match = qId.match(/^P([1-8])\./i);
    if (match) {
      const pid = parseInt(match[1], 10);
      pillarCounts[pid] = (pillarCounts[pid] || 0) + 1;
    }
  });
  return Object.values(pillarCounts).filter((cnt) => cnt >= 25).length;
}

/**
 * Returns the currently active logged in user's email from localStorage, or empty string if not found.
 */
export function getActiveUserEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    const cached = localStorage.getItem("future_farms_user");
    if (cached) {
      const u = JSON.parse(cached);
      if (u?.email) return u.email;
    }
  } catch (e) {}
  return "";
}

/**
 * Saves active user info into client-side cache.
 */
export function setActiveUserSession(user: any) {
  if (typeof window === "undefined" || !user) return;
  try {
    localStorage.setItem("future_farms_user", JSON.stringify(user));
  } catch (e) {
    console.error("Error saving active user session:", e);
  }
}

