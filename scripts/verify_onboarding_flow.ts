import { computeOnboardingStageFromUser, getRouteAccess } from "../src/lib/onboardingGuard";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("❌ ASSERTION FAILED:", message);
    process.exit(1);
  }
  console.log("✅ PASSED:", message);
}

console.log("\n=== 1. Testing New User (INITIAL_IN_PROGRESS) ===");
const newUser = {
  id: "test-user-1",
  name: "New Farmer",
  email: "new@futurefarms.africa",
};
const newStage = computeOnboardingStageFromUser(newUser);
assert(newStage.stage === "INITIAL_IN_PROGRESS", "New user stage is INITIAL_IN_PROGRESS");
assert(!newStage.initialCompleted, "Initial not completed");
assert(!newStage.additionalCompleted, "Additional not completed");

// Route access check for INITIAL_IN_PROGRESS
assert(getRouteAccess("/onboarding/step-1", newStage.stage).allowed === true, "Allowed on /onboarding/step-1");
assert(getRouteAccess("/onboarding/step-2", newStage.stage).allowed === true, "Allowed on /onboarding/step-2");
assert(getRouteAccess("/onboarding/step-5", newStage.stage).allowed === true, "Allowed on /onboarding/step-5");

const blockedDashboard = getRouteAccess("/dashboard", newStage.stage);
assert(!blockedDashboard.allowed && blockedDashboard.redirectTo === "/onboarding/step-1", "Blocked on /dashboard, redirects to /onboarding/step-1");

const blockedOverview = getRouteAccess("/onboarding", newStage.stage);
assert(!blockedOverview.allowed && blockedOverview.redirectTo === "/onboarding/step-1", "Blocked on /onboarding overview, redirects to /onboarding/step-1");

const blockedAssessment = getRouteAccess("/assessment", newStage.stage);
assert(!blockedAssessment.allowed && blockedAssessment.redirectTo === "/onboarding/step-1", "Blocked on /assessment, redirects to /onboarding/step-1");

const blockedLearning = getRouteAccess("/learning", newStage.stage);
assert(!blockedLearning.allowed && blockedLearning.redirectTo === "/onboarding/step-1", "Blocked on /learning, redirects to /onboarding/step-1");

console.log("\n=== 2. Testing Stage 2: Survey 1 Complete (INITIAL_COMPLETED) ===");
const survey1DoneUser = {
  id: "test-user-2",
  name: "Keziah Wanjiku",
  email: "keziah@futurefarms.africa",
  farmerProfile: { jobTitle: "Farm Owner" },
  farmManagement: { mgmtAbility: "Experienced" },
  operatingStyle: { decisionStyle: "Data-driven" },
  aspiration: { twelveMonthSuccess: "Expand irrigation" },
  digitalPlatform: { remoteComfort: "Very comfortable" },
};
const stage2 = computeOnboardingStageFromUser(survey1DoneUser);
assert(stage2.stage === "INITIAL_COMPLETED", "User with Survey 1 done is in INITIAL_COMPLETED");
assert(stage2.initialCompleted === true, "Survey 1 initialCompleted is true");
assert(stage2.additionalCompleted === false, "Survey 2 additionalCompleted is false");

// Route access check for INITIAL_COMPLETED
assert(getRouteAccess("/onboarding", stage2.stage).allowed === true, "Allowed on /onboarding overview");
assert(getRouteAccess("/onboarding/location", stage2.stage).allowed === true, "Allowed on /onboarding/location");
assert(getRouteAccess("/onboarding/characteristics", stage2.stage).allowed === true, "Allowed on /onboarding/characteristics");
assert(getRouteAccess("/onboarding/farming-system", stage2.stage).allowed === true, "Allowed on /onboarding/farming-system");
assert(getRouteAccess("/onboarding/business-experience", stage2.stage).allowed === true, "Allowed on /onboarding/business-experience");
assert(getRouteAccess("/onboarding/household-labour", stage2.stage).allowed === true, "Allowed on /onboarding/household-labour");
assert(getRouteAccess("/onboarding/farm-profile", stage2.stage).allowed === true, "Allowed on /onboarding/farm-profile");

const blockedDashboardStage2 = getRouteAccess("/dashboard", stage2.stage);
assert(!blockedDashboardStage2.allowed && blockedDashboardStage2.redirectTo === "/onboarding", "Blocked on /dashboard, redirects to /onboarding");

const blockedAssessStage2 = getRouteAccess("/assessment", stage2.stage);
assert(!blockedAssessStage2.allowed && blockedAssessStage2.redirectTo === "/onboarding", "Blocked on /assessment, redirects to /onboarding");

const blockedLearnStage2 = getRouteAccess("/learning", stage2.stage);
assert(!blockedLearnStage2.allowed && blockedLearnStage2.redirectTo === "/onboarding", "Blocked on /learning, redirects to /onboarding");

console.log("\n=== 3. Testing Stage 3: Survey 2 Answered (ADDITIONAL_COMPLETED) ===");
const survey2AnsweredUser = {
  ...survey1DoneUser,
  farmLocation: { county: "Nakuru" },
  farmCharacteristics: { farmSize: 10 },
  farmingSystem: { enterprises: ["Vegetables"] },
  businessExperience: { commercialYears: "3-5 years" },
  householdLabour: { permanentWorkers: 4 },
};
const stage3 = computeOnboardingStageFromUser(survey2AnsweredUser);
assert(stage3.stage === "ADDITIONAL_COMPLETED", "All questions answered is in ADDITIONAL_COMPLETED");
assert(stage3.initialCompleted === true, "Initial completed");
assert(stage3.additionalCompleted === true, "Additional completed");
assert(stage3.profileApproved === false, "Profile not yet approved");

assert(getRouteAccess("/onboarding", stage3.stage).allowed === true, "Allowed on /onboarding overview");
assert(getRouteAccess("/onboarding/farm-profile", stage3.stage).allowed === true, "Allowed on /onboarding/farm-profile");
assert(!getRouteAccess("/assessment", stage3.stage).allowed, "Assessment locked until approved");

console.log("\n=== 4. Testing Stage 4: Profile Approved (FULLY_COMPLETED) ===");
const fullyDoneUser = {
  ...survey2AnsweredUser,
  onboardingStatus: { profileApproved: true, stage: "FULLY_COMPLETED" },
};
const stage4 = computeOnboardingStageFromUser(fullyDoneUser);
assert(stage4.stage === "FULLY_COMPLETED", "Stage is FULLY_COMPLETED");
assert(stage4.profileApproved === true, "Profile approved");

assert(getRouteAccess("/onboarding", stage4.stage).allowed === true, "Allowed on /onboarding");
assert(getRouteAccess("/dashboard", stage4.stage).allowed === true, "Allowed on /dashboard");
assert(getRouteAccess("/assessment", stage4.stage).allowed === true, "Allowed on /assessment");
assert(getRouteAccess("/learning", stage4.stage).allowed === true, "Allowed on /learning");
assert(getRouteAccess("/opportunities", stage4.stage).allowed === true, "Allowed on /opportunities");
assert(getRouteAccess("/service-desk", stage4.stage).allowed === true, "Allowed on /service-desk");

console.log("\n🎉 ALL ONBOARDING GUARDRAIL TESTS PASSED SUCCESSFULLY!");
