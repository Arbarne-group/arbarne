import { prisma } from "../src/lib/prisma";
import {
  getGoogleSheetsAccessToken,
  getSpreadsheetMetadata,
  recordUserToSheet,
  syncUserOnboardingToSheet,
  syncUserAssessmentToSheet,
  syncReportGenerationToSheet,
  DEFAULT_SPREADSHEET_ID,
  DEFAULT_ASSESSMENT_SPREADSHEET_ID,
} from "../src/lib/googleSheets";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runComprehensiveVerification() {
  console.log("===============================================================================");
  console.log("🚀 COMPREHENSIVE VERIFICATION: NEON DATABASE UPDATES & GOOGLE SPREADSHEETS SYNC");
  console.log("===============================================================================\n");

  const testClerkId = "clerk_test_neon_audit_" + Date.now();
  const testEmail = `farmer.audit.${Date.now()}@futurefarms.africa`;
  const testName = "Wanjiku Kiprop";
  const testPhone = "+254712345678";
  const testFarmName = "Highland Solai Agribusiness";

  // --------------------------------------------------------------------------
  // TEST 1: Verify Google Sheets API Connectivity & Metadata
  // --------------------------------------------------------------------------
  console.log("📋 [TEST 1/6] Testing Google Sheets Service Account & API Access...");
  const token = await getGoogleSheetsAccessToken();
  assert(Boolean(token && token.length > 50), `Google Sheets OAuth2 token acquired (${token.substring(0, 15)}...)`);

  const onboardingMeta = await getSpreadsheetMetadata(DEFAULT_SPREADSHEET_ID);
  assert(Boolean(onboardingMeta?.properties?.title), `Onboarding Sheet accessible: "${onboardingMeta.properties?.title}"`);
  const onboardingTabs = onboardingMeta.sheets?.map((s: any) => s.properties?.title) || [];
  console.log(`     Available tabs in Onboarding Sheet: ${onboardingTabs.join(", ")}`);

  const assessmentMeta = await getSpreadsheetMetadata(DEFAULT_ASSESSMENT_SPREADSHEET_ID);
  assert(Boolean(assessmentMeta?.properties?.title), `Assessment Sheet accessible: "${assessmentMeta.properties?.title}"`);
  const assessmentTabs = assessmentMeta.sheets?.map((s: any) => s.properties?.title) || [];
  console.log(`     Available tabs in Assessment Sheet: ${assessmentTabs.join(", ")}`);

  // --------------------------------------------------------------------------
  // TEST 2: User Registration in Neon Postgres
  // --------------------------------------------------------------------------
  console.log("\n👤 [TEST 2/6] User Registration & Initial State in Neon Postgres...");
  const user = await prisma.user.create({
    data: {
      id: testClerkId,
      email: testEmail,
      name: testName,
      phone: testPhone,
      farmName: testFarmName,
      futureFarmId: `FFF-KE-AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      passwordHash: "clerk_managed_auth",
      onboardingStatus: {
        create: {
          stage: "INITIAL_IN_PROGRESS",
          profileApproved: false,
        },
      },
    },
    include: { onboardingStatus: true },
  });

  assert(Boolean(user.id), `User record created in Neon Postgres (ID: ${user.id})`);
  assert(user.email === testEmail, `Email correctly stored: ${user.email}`);
  assert(user.onboardingStatus?.stage === "INITIAL_IN_PROGRESS", "OnboardingStatus initialized with stage: INITIAL_IN_PROGRESS");

  // --------------------------------------------------------------------------
  // TEST 3: Survey 1 & Survey 2 Progression (Inspecting Neon Tables)
  // --------------------------------------------------------------------------
  console.log("\n🌾 [TEST 3/6] Stepping Through Survey Forms & Inspecting Neon Tables...");

  // Survey 1: Farmer Profile & Management
  console.log("   --> Submitting Survey 1 (Farmer Profile, Farm Management, Operating Style)...");
  await prisma.farmerProfile.create({
    data: {
      userId: user.id,
      jobTitle: "Lead Farm Director",
      valueChain: "Horticulture & Dairy",
      experienceYears: "8-10 years",
      businessHistory: "Commercial expansion over 6 years",
      educationLevel: "Bachelor's Degree in Agribusiness",
    },
  });

  await prisma.farmManagement.create({
    data: {
      userId: user.id,
      mgmtAbility: "Advanced",
      operationsResponsible: "Dedicated Farm Manager",
      opsResponsibility: "Daily operational decisions & crop protection",
      operators: "Owner & Professional Staff",
      desiredInvolvement: "Strategic Growth & Financing",
    },
  });

  await prisma.operatingStyle.create({
    data: {
      userId: user.id,
      decisionStyle: "Data-Driven / Analytical",
      failureResponse: "Root Cause Analysis & Corrective Action",
      obstacles: "Working Capital & Certified Seedlings",
      guidancePreference: "Structured KPI Dashboard & Remote Advisory",
      trackingFrequency: "Daily / Weekly Logs",
      updatePreferences: "Email & WhatsApp Alerts",
      updatePreference: "WhatsApp Summaries",
    },
  });

  await prisma.digitalPlatform.create({
    data: {
      userId: user.id,
      supportReasons: JSON.stringify(["Access to premium export markets", "Agronomic advisory"]),
      remoteConfidence: "High (Comfortable with digital tools)",
      remoteComfort: "Comfortable with smartphone dashboards & WhatsApp advisory",
      recordKeeping: "Digital Spreadsheets & Mobile Notes",
      physicalAudits: "Willing to host verification audits bi-annually",
    },
  });

  await prisma.aspiration.create({
    data: {
      userId: user.id,
      twelveMonthSuccess: "Achieve GlobalGAP accreditation and double solar irrigation capacity",
      greatestImpactSupport: "Direct contracts with European supermarket off-takers",
      marketInsight: "Real-time market price benchmarks and traceability support",
      threeToFiveYearRole: "Strategic Agribusiness Owner & Investor",
      personallyApprovedDecisions: "Capital expenditures > KES 100,000",
      twentyFiveYearVision: "A 100-acre climate-resilient organic fruit export estate",
    },
  });

  await prisma.onboardingStatus.update({
    where: { userId: user.id },
    data: { stage: "SURVEY1_COMPLETED" },
  });

  // Verify Survey 1 Neon records
  const checkProfile = await prisma.farmerProfile.findUnique({ where: { userId: user.id } });
  const checkMgmt = await prisma.farmManagement.findUnique({ where: { userId: user.id } });
  const checkStyle = await prisma.operatingStyle.findUnique({ where: { userId: user.id } });
  const checkDigital = await prisma.digitalPlatform.findUnique({ where: { userId: user.id } });
  const checkStatus1 = await prisma.onboardingStatus.findUnique({ where: { userId: user.id } });

  assert(checkProfile?.valueChain === "Horticulture & Dairy", "Neon table 'FarmerProfile' saved successfully");
  assert(checkMgmt?.mgmtAbility === "Advanced", "Neon table 'FarmManagement' saved successfully");
  assert(checkStyle?.decisionStyle === "Data-Driven / Analytical", "Neon table 'OperatingStyle' saved successfully");
  assert(checkDigital?.recordKeeping === "Digital Spreadsheets & Mobile Notes", "Neon table 'DigitalPlatform' saved successfully");
  assert(checkStatus1?.stage === "SURVEY1_COMPLETED", "Neon table 'OnboardingStatus' advanced to SURVEY1_COMPLETED");

  // Survey 2: Farm Location, Characteristics, Farming System, Business, Labour
  console.log("   --> Submitting Survey 2 (Location, Characteristics, System, Business, Labour)...");
  await prisma.farmLocation.create({
    data: {
      userId: user.id,
      locationSearch: "Nakuru County, Kenya",
      county: "Nakuru",
      subcounty: "Rongai",
      ward: "Solai",
      landmark: "Near Solai Trading Centre",
      latitude: -0.05,
      longitude: 36.15,
    },
  });

  await prisma.farmCharacteristics.create({
    data: {
      userId: user.id,
      farmSize: 15.5,
      farmUnit: "Acres",
      cultivatedAcres: 12.0,
      grazingAcres: 3.5,
      landTenure: "Freehold Title Deed",
      waterSources: JSON.stringify(["Solar Borehole", "Seasonal Stream"]),
      soilTested: "Yes (Last 12 Months)",
    },
  });

  await prisma.farmingSystem.create({
    data: {
      userId: user.id,
      enterprises: JSON.stringify(["Hass Avocado", "French Beans", "Dairy Cows"]),
      cultivationMethod: "Drip Irrigation & Raised Beds",
      mechanizationSetup: "Tractor Hire & Power Tillers",
      energySource: "Solar Hybrid System (5 kW)",
    },
  });

  await prisma.businessExperience.create({
    data: {
      userId: user.id,
      commercialYears: "8-10 years",
      annualRevenueBracket: "KES 2,500,000 - 5,000,000",
      recordKeepingMethod: "Digital Spreadsheets & Accounting Software",
      produceBuyers: JSON.stringify(["Export Packers", "Supermarket Off-takers"]),
    },
  });

  await prisma.householdLabour.create({
    data: {
      userId: user.id,
      permanentWorkers: 4,
      seasonalWorkers: 12,
      managementStructure: "Owner with dedicated Field Supervisors",
      fairEmploymentPractices: JSON.stringify(["Living Wage", "PPE Provided", "Social Security (NSSF)"]),
    },
  });

  await prisma.goalsPriorities.create({
    data: {
      userId: user.id,
      goals: "Commercial Export Expansion & Sustainability Certification",
      operationalBottleneck: "Cold chain logistics and working capital timing",
      advisoryMode: "Hybrid (Digital Dashboard + Seasonal Field Visits)",
    },
  });

  // Finalize Onboarding Status
  await prisma.onboardingStatus.update({
    where: { userId: user.id },
    data: {
      stage: "FULLY_COMPLETED",
      profileApproved: true,
      completedAt: new Date(),
    },
  });

  // Verify Survey 2 Neon records
  const checkLoc = await prisma.farmLocation.findUnique({ where: { userId: user.id } });
  const checkChar = await prisma.farmCharacteristics.findUnique({ where: { userId: user.id } });
  const checkSys = await prisma.farmingSystem.findUnique({ where: { userId: user.id } });
  const checkBiz = await prisma.businessExperience.findUnique({ where: { userId: user.id } });
  const checkLabour = await prisma.householdLabour.findUnique({ where: { userId: user.id } });
  const checkGoals = await prisma.goalsPriorities.findUnique({ where: { userId: user.id } });
  const checkStatusFinal = await prisma.onboardingStatus.findUnique({ where: { userId: user.id } });

  assert(checkLoc?.county === "Nakuru", "Neon table 'FarmLocation' saved successfully");
  assert(checkChar?.farmSize === 15.5, "Neon table 'FarmCharacteristics' saved successfully");
  assert(checkSys?.energySource === "Solar Hybrid System (5 kW)", "Neon table 'FarmingSystem' saved successfully");
  assert(checkBiz?.commercialYears === "8-10 years", "Neon table 'BusinessExperience' saved successfully");
  assert(checkLabour?.permanentWorkers === 4, "Neon table 'HouseholdLabour' saved successfully");
  assert(checkGoals?.goals?.includes("Export Expansion") === true, "Neon table 'GoalsPriorities' saved successfully");
  assert(checkStatusFinal?.stage === "FULLY_COMPLETED" && checkStatusFinal.profileApproved === true, "Neon table 'OnboardingStatus' finalized to FULLY_COMPLETED");

  // --------------------------------------------------------------------------
  // TEST 4: Google Sheets Onboarding Synchronization
  // --------------------------------------------------------------------------
  console.log("\n📊 [TEST 4/6] Synchronizing Onboarding Survey Data to Google Sheets...");
  const fullUserRecord = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      farmerProfile: true,
      farmManagement: true,
      operatingStyle: true,
      digitalPlatform: true,
      aspiration: true,
      farmLocation: true,
      farmCharacteristics: true,
      farmingSystem: true,
      businessExperience: true,
      goalsPriorities: true,
      householdLabour: true,
      onboardingStatus: true,
    },
  });

  // Test 4a: Registered Users Tab
  const regUserSync = await recordUserToSheet(testEmail, {
    assignedId: user.futureFarmId || "FFF-KE-001",
    fullName: testName,
    email: testEmail,
    phone: testPhone,
    farmName: testFarmName,
    county: "Nakuru",
    acres: "15.5",
    productionSystem: "Horticulture & Dairy",
    onboardingStage: "FULLY_COMPLETED",
  });
  assert(regUserSync.success, "Google Sheet 'Registered Users' tab updated successfully");

  // Test 4b: Master Consolidated & Survey 1 / 2 Tabs
  const surveyTabsSync = await syncUserOnboardingToSheet(fullUserRecord);
  assert(surveyTabsSync.success, "Google Sheet 'Master Consolidated', 'Survey 1', and 'Survey 2' tabs updated successfully");

  // --------------------------------------------------------------------------
  // TEST 5: Assessment Progression (Neon Tables)
  // --------------------------------------------------------------------------
  console.log("\n📝 [TEST 5/6] Submitting Pillar 1 Assessment & Inspecting Neon Tables...");
  const assessment = await prisma.assessment.create({
    data: {
      userId: user.id,
      overallScore: 0,
      maturityLevel: "Emerging",
      status: "IN_PROGRESS",
    },
  });
  assert(Boolean(assessment.id), `Assessment record created in Neon (ID: ${assessment.id})`);

  // Insert 25 assessment question responses for Pillar 1
  for (let q = 1; q <= 25; q++) {
    const isYes = q <= 18; // 18 Yes, 7 No = 72%
    await prisma.assessmentResponse.create({
      data: {
        assessmentId: assessment.id,
        questionId: `P1.${Math.ceil(q / 5)}.${((q - 1) % 5) + 1}`,
        questionText: `Test Assessment Question ${q} regarding farm operational practices`,
        pillarId: 1,
        capabilityId: `C1.${Math.ceil(q / 5)}`,
        capabilityName: "Core Farm Operations",
        answer: isYes ? "yes" : "no",
      },
    });
  }

  const responseCount = await prisma.assessmentResponse.count({
    where: { assessmentId: assessment.id, pillarId: 1 },
  });
  assert(responseCount === 25, "Neon table 'AssessmentResponse' stored all 25 individual question answers");

  // Insert Pillar Assessment
  await prisma.pillarAssessment.create({
    data: {
      assessmentId: assessment.id,
      pillarId: 1,
      pillarName: "Production & Agronomy",
      score: 72,
      yesCount: 18,
      noCount: 7,
      totalQuestions: 25,
      maturityLevel: "Maturing",
      isCompleted: true,
      completedAt: new Date(),
    },
  });

  await prisma.assessment.update({
    where: { id: assessment.id },
    data: {
      overallScore: 72,
      maturityLevel: "Maturing",
      status: "IN_PROGRESS",
    },
  });

  const checkPillar = await prisma.pillarAssessment.findUnique({
    where: {
      assessmentId_pillarId: {
        assessmentId: assessment.id,
        pillarId: 1,
      },
    },
  });
  const checkAssessment = await prisma.assessment.findUnique({ where: { id: assessment.id } });
  assert(checkPillar?.score === 72, "Neon table 'PillarAssessment' saved with score: 72%");
  assert(checkAssessment?.overallScore === 72, "Neon table 'Assessment' updated with overallScore: 72%");

  // --------------------------------------------------------------------------
  // TEST 6: Google Sheets Assessment & Report Synchronization
  // --------------------------------------------------------------------------
  console.log("\n📈 [TEST 6/6] Synchronizing Assessment Results & Diagnostic Report to Google Sheets...");
  const assessmentSync = await syncUserAssessmentToSheet(testEmail, 1);
  assert(assessmentSync.success, "Google Sheet 'Assessment Overview' & 'Pillar Submissions Log' populated successfully");

  const reportSync = await syncReportGenerationToSheet(testEmail, "1");
  assert(reportSync.success, "Google Sheet 'Reports Generated' tab populated with diagnostic report");

  // --------------------------------------------------------------------------
  // CLEANUP: Clean up test user records from Neon
  // --------------------------------------------------------------------------
  console.log("\n🧹 Cleaning up test user records from Neon Postgres...");
  await prisma.assessmentResponse.deleteMany({ where: { assessmentId: assessment.id } });
  await prisma.pillarAssessment.deleteMany({ where: { assessmentId: assessment.id } });
  await prisma.assessment.delete({ where: { id: assessment.id } });
  await prisma.farmerProfile.deleteMany({ where: { userId: user.id } });
  await prisma.farmManagement.deleteMany({ where: { userId: user.id } });
  await prisma.operatingStyle.deleteMany({ where: { userId: user.id } });
  await prisma.digitalPlatform.deleteMany({ where: { userId: user.id } });
  await prisma.aspiration.deleteMany({ where: { userId: user.id } });
  await prisma.farmLocation.deleteMany({ where: { userId: user.id } });
  await prisma.farmCharacteristics.deleteMany({ where: { userId: user.id } });
  await prisma.farmingSystem.deleteMany({ where: { userId: user.id } });
  await prisma.businessExperience.deleteMany({ where: { userId: user.id } });
  await prisma.householdLabour.deleteMany({ where: { userId: user.id } });
  await prisma.goalsPriorities.deleteMany({ where: { userId: user.id } });
  await prisma.onboardingStatus.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
  console.log("  ✓ Cleaned up test records from Neon.");

  console.log("\n===============================================================================");
  console.log("🎉 ALL TESTS PASSED (100%): Neon Database Updates & Google Sheets Sync are ROBUST!");
  console.log("===============================================================================");
}

runComprehensiveVerification()
  .catch((e) => {
    console.error("FATAL ERROR in test execution:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
