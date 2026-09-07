import { getSheetValues } from "../src/lib/googleSheets";

const ASSESSMENT_SPREADSHEET_ID = "1lia89URlWwsngU0E7Kd5zyQTzm-SBWlQj2Lsu08b1wg";
const BASE_URL = "http://localhost:3000";

function logPass(msg: string) {
  console.log(`  \x1b[32m✔\x1b[0m ${msg}`);
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  \x1b[31m✖ ASSERTION FAILED: ${message}\x1b[0m`);
    process.exit(1);
  }
  logPass(message);
}

async function testAssessmentSync() {
  console.log("==========================================================================");
  console.log("🧪 TESTING LIVE ASSESSMENT SYNC TO GOOGLE SPREADSHEET");
  console.log(`Target Spreadsheet ID: ${ASSESSMENT_SPREADSHEET_ID}`);
  console.log("==========================================================================\n");

  const testEmail = "keziah@futurefarms.africa";
  const pillarId = 2; // Sustainable Agriculture & Production

  // Generate 25 answers for Pillar 2
  const mockAnswers: Record<string, "yes" | "no"> = {};
  for (let c = 1; c <= 5; c++) {
    for (let q = 1; q <= 5; q++) {
      const qId = `P2.${c}.${q}`;
      // Give alternating yes and no answers (approx 60% yes)
      mockAnswers[qId] = (c + q) % 2 === 0 ? "yes" : "no";
    }
  }

  console.log(`[Step 1] Submitting Pillar ${pillarId} assessment via POST /api/assessment/submit-pillar...`);
  const res = await fetch(`${BASE_URL}/api/assessment/submit-pillar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      pillarId,
      answers: mockAnswers,
    }),
  });

  const resData = await res.json();
  assert(res.ok, `Pillar ${pillarId} submitted successfully with status ${res.status}`);
  assert(resData.success === true, "API response indicates success");
  assert(typeof resData.score === "number", `Calculated Pillar score: ${resData.score}%`);
  assert(resData.isCompleted === true, "Pillar marked as completed");

  console.log("\n[Step 2] Waiting 2.5 seconds for background Google Sheets sync...");
  await new Promise((resolve) => setTimeout(resolve, 2500));

  console.log("\n[Step 3] Verifying records in Google Spreadsheet from live API...");

  // 1. Verify Assessment Overview
  console.log("Checking Tab 1: 'Assessment Overview'...");
  const overviewRows = await getSheetValues(
    "'Assessment Overview'!A3:W10",
    ASSESSMENT_SPREADSHEET_ID
  );
  assert(overviewRows.length > 0, "Found rows in 'Assessment Overview'");
  const userRow = overviewRows.find((r: any[]) => r[2]?.toLowerCase() === testEmail.toLowerCase());
  assert(Boolean(userRow), `Found user row for ${testEmail} in 'Assessment Overview'`);
  console.log(`   Farmer: ${userRow[1]} | Score: ${userRow[7]} | Maturity: ${userRow[8]} | Pillars Done: ${userRow[10]}`);
  assert(userRow[10]?.includes("of 8"), "Pillars completed metric tracked");

  // 2. Verify Pillar Submissions Log
  console.log("\nChecking Tab 2: 'Pillar Submissions Log'...");
  const submissionRows = await getSheetValues(
    "'Pillar Submissions Log'!A3:M20",
    ASSESSMENT_SPREADSHEET_ID
  );
  assert(submissionRows.length > 0, "Found rows in 'Pillar Submissions Log'");
  const p2Submission = submissionRows.find(
    (r: any[]) => r[2]?.toLowerCase() === testEmail.toLowerCase() && Number(r[4]) === pillarId
  );
  assert(Boolean(p2Submission), `Found submission for Pillar ${pillarId} in 'Pillar Submissions Log'`);
  console.log(`   Pillar: ${p2Submission[5]} | Score: ${p2Submission[6]} | Yes: ${p2Submission[7]} | No: ${p2Submission[8]}`);

  // 3. Verify Detailed Question Responses
  console.log("\nChecking Tab 3: 'Detailed Question Responses'...");
  const questionRows = await getSheetValues(
    "'Detailed Question Responses'!A3:J30",
    ASSESSMENT_SPREADSHEET_ID
  );
  assert(questionRows.length > 0, "Found rows in 'Detailed Question Responses'");
  const sampleQ = questionRows.find((r: any[]) => r[1]?.toLowerCase() === testEmail.toLowerCase() && r[3] == pillarId);
  assert(Boolean(sampleQ), `Found question responses logged for Pillar ${pillarId}`);
  console.log(`   Question: ${sampleQ[7]} | Answer: ${sampleQ[9]}`);

  console.log("\n==========================================================================");
  console.log("🎉 GOOGLE SPREADSHEET ASSESSMENT SYNC VERIFIED WITH 100% SUCCESS!");
  console.log(`🔗 Verified Live at: https://docs.google.com/spreadsheets/d/${ASSESSMENT_SPREADSHEET_ID}/edit`);
  console.log("==========================================================================\n");
}

testAssessmentSync().catch((err) => {
  console.error("❌ Fatal test error:", err);
  process.exit(1);
});
