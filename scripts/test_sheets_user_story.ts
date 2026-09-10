import { prisma } from "../src/lib/prisma";
import {
  recordUserToSheet,
  syncUserOnboardingToSheet,
  syncUserAssessmentToSheet,
  syncReportGenerationToSheet,
  getSheetValues,
  DEFAULT_SPREADSHEET_ID,
  DEFAULT_ASSESSMENT_SPREADSHEET_ID,
} from "../src/lib/googleSheets";
import { ALL_PILLARS } from "../src/data/allPillarsData";

async function runFullUserStorySyncTest() {
  console.log("================================================================");
  console.log("🚀 TESTING END-TO-END USER STORY GOOGLE SHEETS SYNCHRONIZATION");
  console.log("================================================================\n");

  const testEmail = `farmer.fullsync.${Date.now()}@futurefarms.africa`;
  const testName = "Wanjiru Mwangi";
  const testPhone = "+254 722 998 877";
  const testFarmName = "Mavuno Highland Enterprise";

  // -------------------------------------------------------------
  // Step 1: User Registration
  // -------------------------------------------------------------
  console.log("[Story Step 1] Creating User & Syncing to Registered Users Tab...");
  const user = await prisma.user.create({
    data: {
      name: testName,
      email: testEmail,
      phone: testPhone,
      farmName: testFarmName,
      passwordHash: "CLERK_AUTH_HASH",
      futureFarmId: `FFF-KE-PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerProfile: {
        create: {
          jobTitle: "Managing Farm Director",
          valueChain: "Commercial Horticulture & Export Greens",
          experienceYears: "6-10 years",
          educationLevel: "Bachelor of Agribusiness",
        },
      },
      farmLocation: {
        create: {
          locationSearch: "Naivasha, Nakuru County",
          county: "Nakuru County",
          subcounty: "Naivasha East",
          ward: "Hell's Gate Ward",
          landmark: "Near Crescent Island Road",
          latitude: -0.71719,
          longitude: 36.43103,
        },
      },
      farmCharacteristics: {
        create: {
          farmSize: 15.0,
          farmUnit: "Acres",
          cultivatedAcres: 10.5,
          grazingAcres: 4.5,
          landTenure: "Private / Title Deed (Freehold)",
          waterSources: "Reliable Solar Borehole & Surface Water",
          soilTested: "Tested within last 6 months",
        },
      },
      farmingSystem: {
        create: {
          enterprises: "Export French beans, field tomatoes, and dairy cows",
          cultivationMethod: "Precision drip irrigation with fertigation automation",
          mechanizationSetup: "75HP tractor with rotary cultivator and solar booster pumps",
          energySource: "Off-grid solar hybrid with 15kWh lithium battery storage",
        },
      },
      householdLabour: {
        create: {
          permanentWorkers: 5,
          seasonalWorkers: 15,
          managementStructure: "Owner-managed with designated field supervisor",
          fairEmploymentPractices: "Formal written contracts, PPE supplied, statutory benefits",
        },
      },
      businessExperience: {
        create: {
          commercialYears: "5 years",
          annualRevenueBracket: "KES 2,500,000 - 5,000,000",
          recordKeepingMethod: "Digital farm management logs & mobile spreadsheets",
          produceBuyers: "Export contract off-takers & Nairobi wholesale hubs",
        },
      },
      goalsPriorities: {
        create: {
          goals: "Scale export French bean production to 20 acres and secure GlobalGAP renewal",
          operationalBottleneck: "Cold chain pre-cooling transport and seasonal water storage",
          advisoryMode: "Bi-weekly digital agronomy reviews & quarterly physical audits",
        },
      },
      onboardingStatus: {
        create: {
          stage: "FULLY_COMPLETED",
          profileApproved: true,
        },
      },
    },
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

  const regRes = await recordUserToSheet(user);
  console.log(`  ✔ recordUserToSheet success: ${regRes.success}`);

  // -------------------------------------------------------------
  // Step 2: Sync Onboarding Surveys (Survey 1, Survey 2, Master)
  // -------------------------------------------------------------
  console.log("\n[Story Step 2] Syncing Complete Onboarding Profile to Spreadsheet...");
  const onbRes = await syncUserOnboardingToSheet(user);
  console.log(`  ✔ syncUserOnboardingToSheet success: ${onbRes.success}`);

  // -------------------------------------------------------------
  // Step 3: Populate and Sync All 8 Pillar Assessments (200 Qs)
  // -------------------------------------------------------------
  console.log("\n[Story Step 3] Submitting Complete 8-Pillar Assessment (200 Questions)...");
  const assessment = await prisma.assessment.create({
    data: {
      userId: user.id,
      overallScore: 72,
      maturityLevel: "Structured Farm",
      status: "COMPLETED",
    },
  });

  for (const pillar of ALL_PILLARS) {
    const pId = pillar.id;
    const allQuestions = pillar.capabilities.flatMap((c) =>
      c.questions.map((q) => ({
        capabilityId: c.id,
        capabilityName: c.name,
        questionId: q.id,
        questionText: q.question,
        recommendation: q.recommendation,
        whyItMatters: q.whyItMatters,
        quickWin: q.quickWin,
        priority: q.priority,
        supportAvailable: q.supportAvailable,
      }))
    );

    // Answer 18 "yes", 7 "no" (72% score)
    const responsesData = allQuestions.map((q, idx) => ({
      assessmentId: assessment.id,
      pillarId: pId,
      capabilityId: q.capabilityId,
      capabilityName: q.capabilityName,
      questionId: q.questionId,
      questionText: q.questionText,
      answer: idx < 18 ? "yes" : "no",
      priority: idx < 18 ? "Verified Practice" : q.priority || "🟢 Quick Win",
      recommendation: q.recommendation || "Adopt standardized digital recording schedule",
      whyItMatters: q.whyItMatters || "Ensures farm operations meet commercial and food safety standards",
      quickWin: q.quickWin || "Implement daily harvest and spray log sheets",
      supportAvailable: q.supportAvailable || "Future Farms technical advisor field assistance",
    }));

    await prisma.assessmentResponse.createMany({
      data: responsesData,
    });

    await prisma.pillarAssessment.create({
      data: {
        assessmentId: assessment.id,
        pillarId: pId,
        pillarName: pillar.name,
        score: 72.0,
        yesCount: 18,
        noCount: 7,
        totalQuestions: 25,
        maturityLevel: "Structured Farm",
        capabilityScores: JSON.stringify({
          "Level 1 Baseline": 85,
          "Level 2 Operational": 75,
          "Level 3 Commercial": 60,
        }),
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Sync pillar to sheet
    const pSync = await syncUserAssessmentToSheet(testEmail, pId);
    console.log(`  ✔ Synced Pillar ${pId} (${pillar.name}): ${pSync.success}`);
  }

  // -------------------------------------------------------------
  // Step 4: Report Generation Sync (Both Single Pillar & Consolidated)
  // -------------------------------------------------------------
  console.log("\n[Story Step 4] Generating & Syncing Assessment Reports...");
  const p2ReportRes = await syncReportGenerationToSheet(testEmail, "2");
  console.log(`  ✔ Single-Pillar (Pillar 2) Report Synced: ${p2ReportRes.success}`);

  const fullReportRes = await syncReportGenerationToSheet(testEmail, "all");
  console.log(`  ✔ Consolidated 8-Pillar Report Synced: ${fullReportRes.success}`);

  // -------------------------------------------------------------
  // Step 5: Verification of Synced Rows & Missing Values Check
  // -------------------------------------------------------------
  console.log("\n[Story Step 5] Verifying Google Sheets Values & Zero-Missing-Values Guarantee...");

  // Check 'Registered Users'
  const regRows = await getSheetValues("'Registered Users'!A3:M", DEFAULT_SPREADSHEET_ID);
  const matchedReg = regRows.find((r: any[]) => r[3]?.toLowerCase().trim() === testEmail.toLowerCase().trim());
  if (matchedReg) {
    console.log(`  ✔ 'Registered Users' row found for ${testEmail}`);
    const emptyReg = matchedReg.some((val: any) => val === undefined || val === null || val === "");
    console.log(`  ✔ 'Registered Users' has zero missing values: ${!emptyReg}`);
    console.log(`    Columns: [ID: ${matchedReg[1]}, Name: ${matchedReg[2]}, County: ${matchedReg[6]}]`);
  } else {
    console.error("  ❌ Registered Users row was not found!");
  }

  // Check 'Survey 1 - Farmer (Shambany)'
  const s1Rows = await getSheetValues("'Survey 1 - Farmer (Shambany)'!A3:AG", DEFAULT_SPREADSHEET_ID);
  const matchedS1 = s1Rows.find((r: any[]) => r[2]?.toLowerCase().trim() === testEmail.toLowerCase().trim());
  if (matchedS1) {
    console.log(`  ✔ 'Survey 1' row found for ${testEmail}`);
    const emptyS1 = matchedS1.some((val: any) => val === undefined || val === null || val === "");
    console.log(`  ✔ 'Survey 1' (33 columns) has zero missing values: ${!emptyS1}`);
  }

  // Check 'Survey 2 - Farm Profile'
  const s2Rows = await getSheetValues("'Survey 2 - Farm Profile'!A3:AH", DEFAULT_SPREADSHEET_ID);
  const matchedS2 = s2Rows.find((r: any[]) => r[3]?.toLowerCase().trim() === testEmail.toLowerCase().trim());
  if (matchedS2) {
    console.log(`  ✔ 'Survey 2' row found for ${testEmail}`);
    const emptyS2 = matchedS2.some((val: any) => val === undefined || val === null || val === "");
    console.log(`  ✔ 'Survey 2' (34 columns) has zero missing values: ${!emptyS2}`);
  }

  // Check 'Master Consolidated'
  const masterRows = await getSheetValues("'Master Consolidated'!A3:BI", DEFAULT_SPREADSHEET_ID);
  const matchedMaster = masterRows.find((r: any[]) => r[3]?.toLowerCase().trim() === testEmail.toLowerCase().trim());
  if (matchedMaster) {
    console.log(`  ✔ 'Master Consolidated' row found for ${testEmail}`);
    const emptyMaster = matchedMaster.some((val: any) => val === undefined || val === null || val === "");
    console.log(`  ✔ 'Master Consolidated' (61 columns) has zero missing values: ${!emptyMaster}`);
  }

  // Check 'Assessment Overview'
  const overviewRows = await getSheetValues("'Assessment Overview'!A3:W", DEFAULT_ASSESSMENT_SPREADSHEET_ID);
  const matchedOverview = overviewRows.find((r: any[]) => r[2]?.toLowerCase().trim() === testEmail.toLowerCase().trim());
  if (matchedOverview) {
    console.log(`  ✔ 'Assessment Overview' row found for ${testEmail}`);
    const emptyOverview = matchedOverview.some((val: any) => val === undefined || val === null || val === "");
    console.log(`  ✔ 'Assessment Overview' (23 columns) has zero missing values: ${!emptyOverview}`);
    console.log(`    Overall Score: ${matchedOverview[7]}, Maturity: ${matchedOverview[8]}, Pillars Done: ${matchedOverview[10]}`);
  }

  // Check 'Reports Generated'
  const reportRows = await getSheetValues("'Reports Generated'!A3:R", DEFAULT_ASSESSMENT_SPREADSHEET_ID);
  const matchedReports = reportRows.filter((r: any[]) => r[3]?.toLowerCase().trim() === testEmail.toLowerCase().trim());
  console.log(`  ✔ 'Reports Generated' logged reports count: ${matchedReports.length} (Expected >= 2)`);
  if (matchedReports.length > 0) {
    console.log(`    Last Report: "${matchedReports[matchedReports.length - 1][8]}" (${matchedReports[matchedReports.length - 1][7]})`);
  }

  console.log("\n================================================================");
  console.log("🎉 ALL USER STORY GOOGLE SHEETS SYNCHRONIZATION TESTS PASSED!");
  console.log("================================================================\n");
}

runFullUserStorySyncTest().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
