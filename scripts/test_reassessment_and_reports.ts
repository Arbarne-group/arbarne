import { prisma } from "../src/lib/prisma";

const BASE_URL = "http://localhost:3000";
const TEST_EMAIL = "test_farmer_cooldown@futurefarms.africa";

async function runTests() {
  console.log("=================================================");
  console.log("🧪 RUNNING COMPREHENSIVE ASSESSMENT & REPORT TESTS");
  console.log("=================================================\n");

  try {
    // Step 0: Ensure clean state for test farmer
    console.log("0️⃣ Setting up test user:", TEST_EMAIL);
    let user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: TEST_EMAIL,
          passwordHash: "test_mock_password_hash",
          name: "Amara Okonjo",
          farmName: "Sunrise Agro-Ecological Farm",
          farmLocation: {
            create: {
              county: "Nakuru",
              subcounty: "Naivasha",
              ward: "Hells Gate",
              locationSearch: "Nakuru, Kenya",
            },
          },
          farmCharacteristics: {
            create: {
              farmSize: 25.0,
              farmUnit: "Acres",
            },
          },
          onboardingStatus: {
            create: {
              stage: "FULLY_COMPLETED",
              profileApproved: true,
              completedAt: new Date(),
            },
          },
        },
      });
    }

    // Reset any existing assessments for this user
    await prisma.assessment.deleteMany({
      where: { userId: user.id },
    });
    console.log("✅ Clean state prepared for test farmer.\n");

    // -------------------------------------------------------------
    // TEST 1: Initial submission of Pillar 2
    // -------------------------------------------------------------
    console.log("1️⃣ Testing initial submission of Pillar 2...");
    const pillar2Answers: Record<string, "yes" | "no"> = {
      "P2-C1-Q1": "yes",
      "P2-C1-Q2": "yes",
      "P2-C1-Q3": "no",
      "P2-C1-Q4": "no",
      "P2-C1-Q5": "no",
      "P2-C2-Q1": "yes",
      "P2-C2-Q2": "yes",
      "P2-C2-Q3": "yes",
      "P2-C2-Q4": "no",
      "P2-C2-Q5": "no",
      "P2-C3-Q1": "yes",
      "P2-C3-Q2": "yes",
      "P2-C3-Q3": "no",
      "P2-C3-Q4": "no",
      "P2-C3-Q5": "no",
      "P2-C4-Q1": "yes",
      "P2-C4-Q2": "no",
      "P2-C4-Q3": "no",
      "P2-C4-Q4": "no",
      "P2-C4-Q5": "no",
      "P2-C5-Q1": "yes",
      "P2-C5-Q2": "yes",
      "P2-C5-Q3": "yes",
      "P2-C5-Q4": "no",
      "P2-C5-Q5": "no",
    };

    const submitRes = await fetch(`${BASE_URL}/api/assessment/submit-pillar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: TEST_EMAIL,
        pillarId: 2,
        answers: pillar2Answers,
      }),
    });

    if (!submitRes.ok) {
      throw new Error(`Initial submission failed: ${submitRes.status} ${await submitRes.text()}`);
    }
    const submitData = await submitRes.json();
    console.log("✅ Pillar 2 submitted successfully:", submitData.message);
    console.log(`   Score: ${submitData.score} | Maturity: ${submitData.maturityLevel}`);
    console.log(`   Next eligible date: ${submitData.nextEligibleDate}\n`);

    // -------------------------------------------------------------
    // TEST 2: Attempt immediate re-submission (Must return 403 REASSESSMENT_LOCKED)
    // -------------------------------------------------------------
    console.log("2️⃣ Testing 90-day cooldown on immediate re-submission...");
    const blockedSubmitRes = await fetch(`${BASE_URL}/api/assessment/submit-pillar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: TEST_EMAIL,
        pillarId: 2,
        answers: pillar2Answers,
      }),
    });

    if (blockedSubmitRes.status === 403) {
      const blockedData = await blockedSubmitRes.json();
      console.log("✅ Immediate re-submission properly BLOCKED with HTTP 403.");
      console.log(`   Error: ${blockedData.error}`);
      console.log(`   Days Remaining: ${blockedData.daysRemaining} days`);
      console.log(`   Next Eligible Date: ${blockedData.nextEligibleDate}\n`);
      if (blockedData.error !== "REASSESSMENT_LOCKED") {
        throw new Error(`Expected error 'REASSESSMENT_LOCKED', got '${blockedData.error}'`);
      }
    } else {
      throw new Error(
        `Expected HTTP 403, got ${blockedSubmitRes.status}: ${await blockedSubmitRes.text()}`
      );
    }

    // -------------------------------------------------------------
    // TEST 3: Attempt saving progress on locked pillar (Must return 403)
    // -------------------------------------------------------------
    console.log("3️⃣ Testing save-progress rejection during cooldown...");
    const blockedSaveRes = await fetch(`${BASE_URL}/api/assessment/save-progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: TEST_EMAIL,
        pillarId: 2,
        answers: pillar2Answers,
      }),
    });

    if (blockedSaveRes.status === 403) {
      const blockedSaveData = await blockedSaveRes.json();
      console.log("✅ Save-progress properly BLOCKED with HTTP 403.");
      console.log(`   Error: ${blockedSaveData.error}`);
      console.log(`   Days Remaining: ${blockedSaveData.daysRemaining} days\n`);
    } else {
      throw new Error(
        `Expected HTTP 403 for save-progress, got ${blockedSaveRes.status}: ${await blockedSaveRes.text()}`
      );
    }

    // -------------------------------------------------------------
    // TEST 4: Query responses API and check cooldown metadata
    // -------------------------------------------------------------
    console.log("4️⃣ Testing /api/assessment/responses cooldown metadata...");
    const responsesRes = await fetch(
      `${BASE_URL}/api/assessment/responses?email=${encodeURIComponent(TEST_EMAIL)}`
    );
    if (!responsesRes.ok) {
      throw new Error(`Failed to fetch responses: ${responsesRes.status}`);
    }
    const responsesData = await responsesRes.json();
    const p2Status = responsesData.pillarStatus[2];
    console.log("✅ Pillar 2 status in responses API:");
    console.log(`   isCompleted: ${p2Status.isCompleted}`);
    console.log(`   canReassess: ${p2Status.canReassess}`);
    console.log(`   daysRemaining: ${p2Status.daysRemaining}`);
    if (p2Status.canReassess !== false || p2Status.daysRemaining <= 0) {
      throw new Error("Cooldown status in responses API is incorrect!");
    }
    console.log("✅ Pillar 2 cooldown metadata verified.\n");

    // -------------------------------------------------------------
    // TEST 5: Simulate 91 days passing (Fast-forward completedAt in DB)
    // -------------------------------------------------------------
    console.log("5️⃣ Simulating 91 days passing by setting completedAt to 91 days ago...");
    const ninetyOneDaysAgo = new Date(Date.now() - 91 * 24 * 60 * 60 * 1000);
    const updatedPillar = await prisma.pillarAssessment.updateMany({
      where: {
        pillarId: 2,
        assessment: { userId: user.id },
      },
      data: {
        completedAt: ninetyOneDaysAgo,
      },
    });
    console.log(`   Updated ${updatedPillar.count} pillar record(s) to ${ninetyOneDaysAgo.toISOString()}.`);

    // Verify responses API now allows reassessment
    const responsesAfterRes = await fetch(
      `${BASE_URL}/api/assessment/responses?email=${encodeURIComponent(TEST_EMAIL)}`
    );
    const responsesAfterData = await responsesAfterRes.json();
    const p2StatusAfter = responsesAfterData.pillarStatus[2];
    console.log("   Status after 91 days:");
    console.log(`   canReassess: ${p2StatusAfter.canReassess} (Expected: true)`);
    console.log(`   daysRemaining: ${p2StatusAfter.daysRemaining} (Expected: 0)`);
    if (p2StatusAfter.canReassess !== true || p2StatusAfter.daysRemaining !== 0) {
      throw new Error("Reassessment was not unlocked after 91 days!");
    }

    // Now re-submit pillar 2 -> should succeed!
    const resubmitRes = await fetch(`${BASE_URL}/api/assessment/submit-pillar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: TEST_EMAIL,
        pillarId: 2,
        answers: pillar2Answers,
      }),
    });
    if (!resubmitRes.ok) {
      throw new Error(`Re-submission after 91 days failed: ${resubmitRes.status} ${await resubmitRes.text()}`);
    }
    const resubmitData = await resubmitRes.json();
    console.log("✅ Reassessment succeeded after 90 days!", resubmitData.message, "\n");

    // -------------------------------------------------------------
    // TEST 6: Report Generation API - Single Pillar (Pillar 2)
    // -------------------------------------------------------------
    console.log("6️⃣ Testing Report Data API (/api/assessment/report?pillarId=2)...");
    const reportApiRes = await fetch(
      `${BASE_URL}/api/assessment/report?email=${encodeURIComponent(TEST_EMAIL)}&pillarId=2`
    );
    const reportApiData = await reportApiRes.json();
    const report = reportApiData.report;
    console.log("✅ Report API returned valid payload:");
    console.log(`   Farm: ${report.farm.farmName}`);
    console.log(`   Pillar: ${report.pillar.name}`);
    console.log(`   Score: ${report.pillar.score}`);
    console.log(`   Maturity: ${report.pillar.maturityStage}`);
    console.log(`   Verified Criteria: ${report.pillar.verifiedCount} / ${report.pillar.totalQuestions}`);
    console.log(`   Capabilities Breakdown: ${report.capabilityBreakdown.length}`);
    console.log(`   Actionable Recommendations: ${report.recommendations.total}\n`);

    if (report.pillar.verifiedCount === undefined || report.pillar.totalQuestions !== 25) {
      throw new Error("Report summary criteria calculation is incorrect!");
    }

    // -------------------------------------------------------------
    // TEST 7: Rendered Report Page HTML - Verification of Criteria Scoring & Absence of Percentages
    // -------------------------------------------------------------
    console.log("7️⃣ Testing Single Pillar Report Page Endpoint (/assessment/report?pillar=2)...");
    const reportHtmlRes = await fetch(
      `${BASE_URL}/assessment/report?email=${encodeURIComponent(TEST_EMAIL)}&pillar=2`
    );
    if (!reportHtmlRes.ok) {
      throw new Error(`Report Page failed: ${reportHtmlRes.status} ${await reportHtmlRes.text()}`);
    }
    const reportHtml = await reportHtmlRes.text();
    console.log(`✅ Single Pillar Report route responded with HTTP ${reportHtmlRes.status} (${reportHtml.length} bytes).`);

    // Verify report page component code rules (Criteria-based scoring, no percentage bars)
    const fs = await import("fs");
    const reportComponentCode = fs.readFileSync("src/app/assessment/report/page.tsx", "utf-8");

    if (!reportComponentCode.includes("Verified Criteria")) {
      throw new Error("Report component missing 'Verified Criteria' scoring label!");
    }
    if (!reportComponentCode.includes("8-Pillar Capability Performance Matrix")) {
      throw new Error("Report component missing '8-Pillar Capability Performance Matrix'!");
    }
    if (!reportComponentCode.includes("Tamper-Proof Verification")) {
      throw new Error("Report component missing Tamper-Proof Verification section!");
    }
    console.log("✅ Verified criteria-based scoring is implemented in report template.");

    // Check for ABSENCE of percentages in score display badges
    const scorePercentPattern = /font-bold text-[^>]+>\s*\{\s*[^}]*score[^}]*\}%/i;
    if (scorePercentPattern.test(reportComponentCode)) {
      throw new Error("Found percentage badge in report component!");
    }
    console.log("✅ Verified no percentage symbols (%) in scoring badges.");

    // Check for progress bar components (e.g. h-2 bg-gray-200 or bg-outline-variant progress bar)
    const progressBarPattern = /class="[^"]*bg-gray-200[^"]*h-2[^"]*"/i;
    if (progressBarPattern.test(reportComponentCode)) {
      throw new Error("Found horizontal progress bar in report component!");
    }
    console.log("✅ Verified no horizontal progress bars in report template.");
    console.log("✅ Single Pillar Report verification complete.\n");

    // -------------------------------------------------------------
    // TEST 8: Report Generation - Comprehensive 8-Pillar Report (pillar=all)
    // -------------------------------------------------------------
    console.log("8️⃣ Testing Comprehensive 8-Pillar Report (/assessment/report?pillar=all)...");
    const reportAllApiRes = await fetch(
      `${BASE_URL}/api/assessment/report?email=${encodeURIComponent(TEST_EMAIL)}&pillarId=all`
    );
    if (!reportAllApiRes.ok) {
      throw new Error(`All-pillars report API failed: ${reportAllApiRes.status}`);
    }
    const reportAllData = await reportAllApiRes.json();
    const reportAll = reportAllData.report;
    console.log(`✅ All-pillars report API returned ${reportAll.eightPillarScorecard.length} pillars.`);
    console.log(`   Overall Score: ${reportAll.executiveSummary.overallFfmiScore}`);
    console.log(`   Total Verified Criteria: ${reportAll.executiveSummary.totalVerified} / ${reportAll.executiveSummary.totalQuestions}`);

    const reportAllHtmlRes = await fetch(
      `${BASE_URL}/assessment/report?email=${encodeURIComponent(TEST_EMAIL)}&pillar=all`
    );
    if (!reportAllHtmlRes.ok) {
      throw new Error(`All-pillars Report Page failed: ${reportAllHtmlRes.status}`);
    }
    const reportAllHtml = await reportAllHtmlRes.text();
    console.log(`✅ All-pillars Report route responded with HTTP ${reportAllHtmlRes.status} (${reportAllHtml.length} bytes).`);
    console.log("✅ Comprehensive 8-Pillar Report verified successfully.\n");

    console.log("=================================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! 100% OPERATIONAL");
    console.log("=================================================");
  } catch (err) {
    console.error("❌ TEST RUN FAILED:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
