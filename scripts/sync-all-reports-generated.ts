import { prisma } from "../src/lib/prisma";
import { syncNeonAssessmentToSheetsFast } from "../src/lib/neonRealtimeSync";
import { getSheetValues, DEFAULT_ASSESSMENT_SPREADSHEET_ID } from "../src/lib/googleSheets";

async function main() {
  console.log("=== SYNCING ALL NEON ASSESSMENTS & POPULATING REPORTS GENERATED ===");
  const assessments = await prisma.assessment.findMany({
    include: {
      user: {
        select: { email: true, name: true, farmName: true },
      },
      pillarAssessments: true,
      assessmentResponses: true,
    },
  });

  console.log(`Found ${assessments.length} assessment(s) in Neon.`);

  for (const a of assessments) {
    if (!a.user?.email) continue;
    console.log(`Syncing assessment for ${a.user.email}...`);
    const res = await syncNeonAssessmentToSheetsFast(a.user.email);
    console.log(`Result for ${a.user.email}:`, res);
  }

  // Verify Reports Generated tab contents
  console.log("\n--- Checking 'Reports Generated' Tab in Google Sheets ---");
  const rows = await getSheetValues("'Reports Generated'!A1:R20", DEFAULT_ASSESSMENT_SPREADSHEET_ID);
  console.log(`Total rows in 'Reports Generated': ${rows?.length || 0}`);
  rows?.forEach((r: any[], i: number) => {
    if (i >= 2) {
      console.log(`Row ${i + 1}: Email: ${r[3]} | Farmer: ${r[2]} | Type: ${r[7]} | Score: ${r[10]}`);
    }
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
