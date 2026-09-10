import { prisma } from "../src/lib/prisma";
import { computeOnboardingStageFromUser, getRouteAccess } from "../src/lib/onboardingGuard";
const BASE_URL = "http://localhost:3000";

function logPass(msg: string) {
  console.log(`  \x1b[32m✔\x1b[0m ${msg}`);
}

function logStep(stepNum: number, title: string) {
  console.log(`\n\x1b[1m\x1b[34m[Story Step ${stepNum}]\x1b[0m \x1b[1m${title}\x1b[0m`);
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  \x1b[31m✖ ASSERTION FAILED: ${message}\x1b[0m`);
    process.exit(1);
  }
  logPass(message);
}

async function runFullUserStoryTest() {
  console.log("================================================================");
  console.log("🚀 FUTURE FARMS - COMPREHENSIVE ONBOARDING & USER STORY TEST");
  console.log("================================================================");

  const testEmail = `story.farmer.${Date.now()}@futurefarms.africa`;
  const testPassword = "Password123!";
  const testName = "Wanjiru Mwangi";
  const testPhone = "+254 701 999 888";

  // -------------------------------------------------------------
  // Step 1: User Registration
  // -------------------------------------------------------------
  logStep(1, "User Registration / Sign-Up");
  const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: testName,
      email: testEmail,
      phone: testPhone,
      password: testPassword,
      terms: true,
    }),
  });

  const signupData = await signupRes.json();
  assert(signupRes.ok, `User successfully signed up with status ${signupRes.status}`);
  assert(signupData.user.email === testEmail, `Registered user has correct email (${testEmail})`);
  assert(signupData.user.name === testName, `Registered user has correct name (${testName})`);

  // Verify DB user entry
  const dbUser = await prisma.user.findUnique({
    where: { email: testEmail },
  });
  assert(Boolean(dbUser), "User record physically exists in SQLite database");
  assert(dbUser?.phone === testPhone, "User phone matches in database");

  // -------------------------------------------------------------
  // Step 2: Verification of Stage 1 (INITIAL_IN_PROGRESS) and Route Guard
  // -------------------------------------------------------------
  logStep(2, "Stage 1 (INITIAL_IN_PROGRESS) & Navigation Guarding");
  const initialStage = computeOnboardingStageFromUser(signupData.user);
  assert(initialStage.stage === "INITIAL_IN_PROGRESS", "Calculated onboarding stage is INITIAL_IN_PROGRESS");
  assert(initialStage.initialCompleted === false, "initialCompleted is false");
  assert(initialStage.additionalCompleted === false, "additionalCompleted is false");

  // Verify route guards for all navigation menu items
  const menuRoutesToTest = [
    { route: "/dashboard", name: "Dashboard" },
    { route: "/assessment", name: "Assessment Hub" },
    { route: "/reports", name: "Reports" },
    { route: "/actions", name: "Action Plan" },
    { route: "/team", name: "Team" },
    { route: "/learning", name: "Learning" },
    { route: "/settings", name: "Settings" },
    { route: "/verification", name: "Verification" },
    { route: "/onboarding", name: "Onboarding Overview" },
  ];

  for (const { route, name } of menuRoutesToTest) {
    const access = getRouteAccess(route, initialStage.stage);
    assert(
      !access.allowed && access.redirectTo === "/onboarding/step-1",
      `Menu option '${name}' (${route}) is guarded and redirects to /onboarding/step-1`
    );
  }

  // Permitted routes during Stage 1
  for (let s = 1; s <= 5; s++) {
    const stepRoute = `/onboarding/step-${s}`;
    const access = getRouteAccess(stepRoute, initialStage.stage);
    assert(access.allowed, `Step ${s} route (${stepRoute}) is allowed to be accessed`);
  }

  // -------------------------------------------------------------
  // Step 3: Submitting Survey 1 (Steps 1 through 5)
  // -------------------------------------------------------------
  logStep(3, "Submitting First Onboarding Survey (Steps 1–5)");

  // Step 1: Farmer Profile
  const step1Data = {
    jobTitle: "Founder & Lead Agronomist",
    farmRole: "Primary Decision Maker",
    yearsFarming: "6-10 years",
    educationLevel: "Bachelor's Degree in Agribusiness",
    primaryMotivation: "Commercial Expansion & Climate Adaptation",
  };
  const postStep1 = await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "step-1", email: testEmail, data: step1Data }),
  });
  assert(postStep1.ok, "POST /api/onboarding/step (step-1) returned HTTP 200");

  // Step 2: Farm Management
  const step2Data = {
    mgmtAbility: "Advanced Systematic",
    formalPlanning: "Quarterly and Annual",
    recordFrequency: "Weekly Digital Records",
    budgetingCycle: "Annual with Monthly Reviews",
  };
  const postStep2 = await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "step-2", email: testEmail, data: step2Data }),
  });
  assert(postStep2.ok, "POST /api/onboarding/step (step-2) returned HTTP 200");

  // Step 3: Operating Style
  const step3Data = {
    decisionStyle: "Data-Driven Analytical",
    riskAppetite: "Calculated Moderate Risk",
    techAdoption: "Early Adopter of Precision AgriTech",
    changeReadiness: "Highly Adaptable",
  };
  const postStep3 = await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "step-3", email: testEmail, data: step3Data }),
  });
  assert(postStep3.ok, "POST /api/onboarding/step (step-3) returned HTTP 200");

  // Step 4: Aspiration
  const step4Data = {
    fmResponsibility: "Lead Operations & Strategic Partnerships",
    twelveMonthSuccess: "Achieve GlobalGAP and export high-value avocados",
    threeYearVision: "Top 5 certified sustainable farm in Nakuru County",
    growthPriority: "Water conservation & cold chain logistics",
  };
  const postStep4 = await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "step-4", email: testEmail, data: step4Data }),
  });
  assert(postStep4.ok, "POST /api/onboarding/step (step-4) returned HTTP 200");

  // Step 5: Digital Platform
  const step5Data = {
    remoteComfort: "Completely comfortable",
    supportReasons: ["Real-time soil metrics", "Buyer contract matching", "Credit readiness score"],
    desiredFeatures: ["Automated irrigation logs", "Direct off-taker portal"],
    deviceAccess: "Smartphone & Laptop",
  };
  const postStep5 = await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "step-5", email: testEmail, data: step5Data }),
  });
  assert(postStep5.ok, "POST /api/onboarding/step (step-5) returned HTTP 200");

  // -------------------------------------------------------------
  // Step 4: Verify Database Persistence for Survey 1 Models
  // -------------------------------------------------------------
  logStep(4, "Database Persistence Verification for Survey 1");
  const userWithSurvey1 = await prisma.user.findUnique({
    where: { email: testEmail },
    include: {
      farmerProfile: true,
      farmManagement: true,
      operatingStyle: true,
      aspiration: true,
      digitalPlatform: true,
    },
  });

  assert(Boolean(userWithSurvey1), "User found in database");
  assert(userWithSurvey1?.farmerProfile?.jobTitle === step1Data.jobTitle, "farmerProfile.jobTitle persisted accurately");
  assert(userWithSurvey1?.farmerProfile?.educationLevel === step1Data.educationLevel, "farmerProfile.educationLevel persisted");

  assert(userWithSurvey1?.farmManagement?.mgmtAbility === step2Data.mgmtAbility, "farmManagement.mgmtAbility persisted accurately");
  assert(userWithSurvey1?.operatingStyle?.decisionStyle === step3Data.decisionStyle, "operatingStyle.decisionStyle persisted accurately");
  assert(userWithSurvey1?.aspiration?.twelveMonthSuccess === step4Data.twelveMonthSuccess, "aspiration.twelveMonthSuccess persisted accurately");
  assert(userWithSurvey1?.digitalPlatform?.remoteComfort === step5Data.remoteComfort, "digitalPlatform.remoteComfort persisted accurately");
  assert(Boolean(userWithSurvey1?.digitalPlatform?.supportReasons?.includes("Buyer contract matching")), "digitalPlatform JSON array persisted");

  // -------------------------------------------------------------
  // Step 5: Verify Stage 2 Transition (INITIAL_COMPLETED) & Guard Updates
  // -------------------------------------------------------------
  logStep(5, "Stage 2 Transition (INITIAL_COMPLETED) & Overview Access");
  const getStatusRes = await fetch(`${BASE_URL}/api/onboarding/step?email=${encodeURIComponent(testEmail)}`);
  const statusData = await getStatusRes.json();
  const stage2 = computeOnboardingStageFromUser(statusData.user);

  assert(stage2.stage === "INITIAL_COMPLETED", "Stage transitioned to INITIAL_COMPLETED");
  assert(stage2.initialCompleted === true, "initialCompleted is true");
  assert(stage2.additionalCompleted === false, "additionalCompleted is false (Survey 2 pending)");

  // Check route guarding in Stage 2
  const overviewAccess = getRouteAccess("/onboarding", stage2.stage);
  assert(overviewAccess.allowed, "User is now ALLOWED on /onboarding (Overview page unlocked)");

  const survey2Routes = [
    "/onboarding/location",
    "/onboarding/characteristics",
    "/onboarding/farming-system",
    "/onboarding/business-experience",
    "/onboarding/household-labour",
    "/onboarding/farm-profile",
  ];
  for (const r of survey2Routes) {
    const acc = getRouteAccess(r, stage2.stage);
    assert(acc.allowed, `Survey 2 route (${r}) is accessible`);
  }

  // Dashboard & Assessment are still locked and redirect to /onboarding
  const dashboardBlockedStage2 = getRouteAccess("/dashboard", stage2.stage);
  assert(
    !dashboardBlockedStage2.allowed && dashboardBlockedStage2.redirectTo === "/onboarding",
    "Navigating to /dashboard is blocked and redirects to /onboarding"
  );
  const assessBlockedStage2 = getRouteAccess("/assessment", stage2.stage);
  assert(
    !assessBlockedStage2.allowed && assessBlockedStage2.redirectTo === "/onboarding",
    "Navigating to /assessment is blocked and redirects to /onboarding"
  );

  // -------------------------------------------------------------
  // Step 6: Submitting Survey 2 Sections
  // -------------------------------------------------------------
  logStep(6, "Submitting Second Onboarding Survey (Sections 1–5)");

  // 1. Location
  const locData = {
    locationSearch: "Mai Mahiu, Longonot Ridge, Naivasha",
    county: "Nakuru",
    subcounty: "Naivasha",
    ward: "Mai Mahiu Ward",
    landmark: "Old Mai Mahiu Catholic Mission (1.2 km)",
    latitude: -0.99672,
    longitude: 36.58678,
  };
  const postLoc = await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "location", email: testEmail, data: locData }),
  });
  assert(postLoc.ok, "POST /api/onboarding/step (location) returned HTTP 200");

  // 2. Characteristics
  const charData = {
    farmSize: 25.0,
    farmUnit: "Acres",
    cultivatedAcres: 18.0,
    grazingAcres: 7.0,
    landTenure: "freehold",
    waterSources: ["borehole_solar", "rainwater_dam", "stream_gravity"],
    soilTested: "yes",
  };
  const postChar = await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "characteristics", email: testEmail, data: charData }),
  });
  assert(postChar.ok, "POST /api/onboarding/step (characteristics) returned HTTP 200");

  // 3. Farming System
  const sysData = {
    enterprises: ["vegetables_horticulture", "dairy_livestock", "herbs_spices"],
    cultivationMethod: "drip_irrigation",
    mechanizationSetup: "owned_two_wheel_and_hired",
    energySource: "solar_pv",
  };
  const postSys = await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "farming-system", email: testEmail, data: sysData }),
  });
  assert(postSys.ok, "POST /api/onboarding/step (farming-system) returned HTTP 200");

  // 4. Business Experience
  const bizData = {
    commercialYears: "3_7",
    annualRevenueBracket: "1m_3m",
    recordKeepingMethod: "digital_app",
    produceBuyers: ["wholesale_market", "direct_restaurants", "export_aggregator"],
  };
  const postBiz = await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "business-experience", email: testEmail, data: bizData }),
  });
  assert(postBiz.ok, "POST /api/onboarding/step (business-experience) returned HTTP 200");

  // 5. Household Labour
  const labourData = {
    permanentWorkers: 5,
    seasonalWorkers: 20,
    managementStructure: "owner_with_supervisor",
    fairEmploymentPractices: ["equal_pay_women", "ppe_clean_water", "written_contracts"],
  };
  const postLabour = await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "household-labour", email: testEmail, data: labourData }),
  });
  assert(postLabour.ok, "POST /api/onboarding/step (household-labour) returned HTTP 200");

  // -------------------------------------------------------------
  // Step 7: Verify Database Persistence for Survey 2 Models
  // -------------------------------------------------------------
  logStep(7, "Database Persistence Verification for Survey 2");
  const userWithSurvey2 = await prisma.user.findUnique({
    where: { email: testEmail },
    include: {
      farmLocation: true,
      farmCharacteristics: true,
      farmingSystem: true,
      businessExperience: true,
      householdLabour: true,
    },
  });

  assert(Boolean(userWithSurvey2), "User found in database");
  assert(userWithSurvey2?.farmLocation?.locationSearch === locData.locationSearch, "farmLocation.locationSearch persisted accurately");
  assert(userWithSurvey2?.farmLocation?.county === locData.county, "farmLocation.county persisted");

  assert(userWithSurvey2?.farmCharacteristics?.farmSize === charData.farmSize, "farmCharacteristics.farmSize persisted accurately");
  assert(userWithSurvey2?.farmCharacteristics?.landTenure === charData.landTenure, "farmCharacteristics.landTenure persisted");

  assert(userWithSurvey2?.farmingSystem?.cultivationMethod === sysData.cultivationMethod, "farmingSystem.cultivationMethod persisted accurately");

  assert(userWithSurvey2?.businessExperience?.annualRevenueBracket === bizData.annualRevenueBracket, "businessExperience.annualRevenueBracket persisted accurately");

  assert(userWithSurvey2?.householdLabour?.permanentWorkers === labourData.permanentWorkers, "householdLabour.permanentWorkers persisted accurately");
  assert(userWithSurvey2?.householdLabour?.seasonalWorkers === labourData.seasonalWorkers, "householdLabour.seasonalWorkers persisted accurately");

  // -------------------------------------------------------------
  // Step 8: Confirm Farm Profile & Transition to FULLY_COMPLETED
  // -------------------------------------------------------------
  logStep(8, "Confirming Farm Profile & Unlocking Assessment Hub");
  const confirmRes = await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "confirm-profile", email: testEmail, data: {} }),
  });
  assert(confirmRes.ok, "POST /api/onboarding/step (confirm-profile) returned HTTP 200");

  const userWithStatus = await prisma.user.findUnique({
    where: { email: testEmail },
    include: { onboardingStatus: true },
  });
  assert(userWithStatus?.onboardingStatus?.profileApproved === true, "onboardingStatus.profileApproved is true in database");

  // Query completed user
  const fullUserRes = await fetch(`${BASE_URL}/api/onboarding/step?email=${encodeURIComponent(testEmail)}`);
  const fullUserData = await fullUserRes.json();
  const finalStage = computeOnboardingStageFromUser(fullUserData.user);

  assert(finalStage.stage === "FULLY_COMPLETED", "Final stage computed is FULLY_COMPLETED");
  assert(finalStage.initialCompleted === true, "finalStage.initialCompleted is true");
  assert(finalStage.additionalCompleted === true, "finalStage.additionalCompleted is true");

  // Verify all routes are now UNLOCKED
  const allRoutes = [
    "/assessment",
    "/dashboard",
    "/reports",
    "/actions",
    "/team",
    "/learning",
    "/settings",
    "/verification",
    "/onboarding",
  ];
  for (const r of allRoutes) {
    const access = getRouteAccess(r, finalStage.stage);
    assert(access.allowed, `Route '${r}' is fully unlocked without any redirects`);
  }

  // Verify survey steps cannot be repeated once onboarding is completed
  const blockedRetake = getRouteAccess("/onboarding/farm-profile", finalStage.stage);
  assert(!blockedRetake.allowed && blockedRetake.redirectTo === "/onboarding", "Survey retake '/onboarding/farm-profile' is blocked");
  const blockedRetakeStep1 = getRouteAccess("/onboarding/step-1", finalStage.stage);
  assert(!blockedRetakeStep1.allowed && blockedRetakeStep1.redirectTo === "/onboarding", "Survey retake '/onboarding/step-1' is blocked");

  // -------------------------------------------------------------
  // Step 9: Test Fast-Track Flow (Direct to Assessment from Household Labour)
  // -------------------------------------------------------------
  logStep(9, "Testing Fast-Track Finish from Household Labour ('Save & Start Assessment')");
  const fastTrackEmail = `fasttrack.farmer.${Date.now()}@futurefarms.africa`;
  await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Fast Track Farmer",
      email: fastTrackEmail,
      phone: "+254 700 111 222",
      password: "Password123!",
      terms: true,
    }),
  });

  // Complete Survey 1
  for (let s = 1; s <= 5; s++) {
    await fetch(`${BASE_URL}/api/onboarding/step`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        step: `step-${s}`,
        email: fastTrackEmail,
        data: s === 1 ? { jobTitle: "Owner" } : s === 2 ? { mgmtAbility: "Good" } : s === 3 ? { decisionStyle: "Agile" } : s === 4 ? { twelveMonthSuccess: "Growth" } : { remoteComfort: "High" },
      }),
    });
  }

  // Complete Survey 2 sections 1 to 4
  await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "location", email: fastTrackEmail, data: { locationSearch: "Eldoret" } }),
  });
  await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "characteristics", email: fastTrackEmail, data: { farmSize: 10 } }),
  });
  await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "farming-system", email: fastTrackEmail, data: { enterprises: ["dairy"] } }),
  });
  await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "business-experience", email: fastTrackEmail, data: { commercialYears: "3" } }),
  });

  // Execute the atomic Household Labour + confirm-profile simulation
  await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      step: "household-labour",
      email: fastTrackEmail,
      data: { permanentWorkers: 4, seasonalWorkers: 10 },
    }),
  });
  await fetch(`${BASE_URL}/api/onboarding/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: "confirm-profile", email: fastTrackEmail, data: {} }),
  });

  const fastTrackUser = await fetch(`${BASE_URL}/api/onboarding/step?email=${encodeURIComponent(fastTrackEmail)}`).then(r => r.json());
  const fastTrackStage = computeOnboardingStageFromUser(fastTrackUser.user);
  assert(fastTrackStage.stage === "FULLY_COMPLETED", "Fast-track user completed Survey 2 and reached FULLY_COMPLETED");
  assert(getRouteAccess("/assessment", fastTrackStage.stage).allowed, "Fast-track user successfully directed to unlocked /assessment");

  console.log("\n================================================================");
  console.log("🎉 ALL USER STORY TESTS PASSED WITH 100% SUCCESS!");
  console.log("================================================================\n");

  await prisma.$disconnect();
}

runFullUserStoryTest().catch((err) => {
  console.error("❌ Fatal test runner error:", err);
  prisma.$disconnect();
  process.exit(1);
});
