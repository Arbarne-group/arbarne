
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
  },
): {
  allowed: boolean;
  redirectTo?: string;
  message?: string;
} {
  /* ============================================================
     PUBLIC / AUTH / API ROUTES
     ============================================================ */

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
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

  const completedPillars =
    options?.completedPillarsCount ?? 0;
  const hasAssessmentHistory =
    options?.hasAssessmentHistory ?? completedPillars > 0;

  /* ============================================================
     ROUTE IDENTIFICATION
     ============================================================ */

  const isSurvey1Step =
    /^\/onboarding\/step-[1-5](?:\/|$)/.test(
      pathname,
    );

  const isSurvey2Step =
    /^\/onboarding\/(location|characteristics|farming-system|business-experience|household-labour)(?:\/|$)/.test(
      pathname,
    );

  const isFarmProfile =
    pathname === "/onboarding/farm-profile" ||
    pathname.startsWith(
      "/onboarding/farm-profile/",
    );

  const isAssessment =
    pathname === "/assessment" ||
    pathname.startsWith("/assessment/");

  const isDashboard =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  const isOnboarding =
    pathname === "/onboarding";

 
  if (
    stage === "INITIAL_IN_PROGRESS"
  ) {
    
    if (
      isOnboarding ||
      isSurvey1Step
    ) {
      return {
        allowed: true,
      };
    }

    

    return {
      allowed: false,
      redirectTo: "/onboarding",
      message:
        "Please complete the Shambany onboarding survey before accessing the platform.",
    };
  }

  /* ============================================================
     SURVEY 1 COMPLETE
     ============================================================ */

  if (
    stage === "INITIAL_COMPLETED" ||
    stage === "ADDITIONAL_COMPLETED" ||
    stage === "FULLY_COMPLETED"
  ) {
    /*
     * Survey 1 can still be revisited.
     */

    if (isSurvey1Step) {
      return {
        allowed: true,
      };
    }

    /*
     * Survey 2 is optional.
     */

    if (isSurvey2Step) {
      return {
        allowed: true,
      };
    }

    /*
     * Farm Profile is available after Survey 1.
     */

    if (isFarmProfile) {
      return {
        allowed: true,
      };
    }

    /*
     * Onboarding overview.
     */

    if (isOnboarding) {
      return {
        allowed: true,
      };
    }

    /*
     * Assessment is available immediately after
     * Survey 1.
     */

    if (isAssessment) {
      return {
        allowed: true,
      };
    }

    /*
     * Dashboard has its own assessment requirement.
     */

    if (isDashboard) {
      if (!hasAssessmentHistory) {
        return {
          allowed: false,
          redirectTo: "/assessment",
          message: "Take an assessment to unlock My Farm.",
        };
      }

      return {
        allowed: true,
      };
    }

    /*
     * All other platform routes are available.
     */

    return {
      allowed: true,
    };
  }

  return {
    allowed: true,
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