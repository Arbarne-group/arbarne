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
 * Checks if a given pathname is permitted for the current onboarding stage.
 */
export function getRouteAccess(
  pathname: string,
  stage: OnboardingStage
): { allowed: boolean; redirectTo?: string; message?: string } {
  // Public auth paths always allowed
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/api")
  ) {
    return { allowed: true };
  }

  // 1. Stage 1: Initial Survey 1 In Progress
  if (stage === "INITIAL_IN_PROGRESS") {
    // Only survey 1 steps allowed: /onboarding/step-1 through /onboarding/step-5
    const isSurvey1Step = /^\/onboarding\/step-[1-5]/.test(pathname);
    if (isSurvey1Step) {
      return { allowed: true };
    }
    // Any other page (including /onboarding overview, /dashboard, /assessment, etc.) is blocked
    return {
      allowed: false,
      redirectTo: "/onboarding/step-1",
      message: "Please complete the first onboarding survey to continue.",
    };
  }

  // 2. Stage 2: Survey 1 Done, Survey 2 In Progress
  if (stage === "INITIAL_COMPLETED" || stage === "ADDITIONAL_COMPLETED") {
    // Cannot repeat Survey 1 steps once completed
    const isSurvey1Step = /^\/onboarding\/step-[1-5]/.test(pathname);
    if (isSurvey1Step) {
      return {
        allowed: false,
        redirectTo: "/onboarding",
        message: "You have already completed the first survey.",
      };
    }
    // /onboarding overview, /onboarding/* (location, characteristics, farming-system, business-experience, household-labour, farm-profile) allowed
    if (pathname.startsWith("/onboarding")) {
      return { allowed: true };
    }
    // Any outside page (e.g. /dashboard, /assessment, /learning, /opportunities, /service-desk) is blocked
    return {
      allowed: false,
      redirectTo: "/onboarding",
      message: "Please complete your Farm Profile survey to access other sections.",
    };
  }

  // 3. Stage 4: Fully completed -> All main routes unlocked, BUT survey steps cannot be repeated
  if (stage === "FULLY_COMPLETED") {
    const isSurveyStep = /^\/onboarding\/(step-[1-5]|location|characteristics|farming-system|business-experience|household-labour|farm-profile)/.test(pathname);
    if (isSurveyStep) {
      return {
        allowed: false,
        redirectTo: "/onboarding",
        message: "Onboarding completed. You cannot repeat the onboarding surveys.",
      };
    }
    return { allowed: true };
  }

  return { allowed: true };
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

