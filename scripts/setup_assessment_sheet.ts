import { getGoogleSheetsAccessToken, getSpreadsheetMetadata, updateSheetValues } from "../src/lib/googleSheets";
import { ALL_PILLARS } from "../src/data/allPillarsData";
import { prisma } from "../src/lib/prisma";

export const ASSESSMENT_SPREADSHEET_ID = "1lia89URlWwsngU0E7Kd5zyQTzm-SBWlQj2Lsu08b1wg";

async function main() {
  try {
    console.log("==========================================================================");
    console.log("🌱 FUTURE FARMS: INITIALIZING ASSESSMENT QUESTIONNAIRE SPREADSHEET");
    console.log(`Target Spreadsheet ID: ${ASSESSMENT_SPREADSHEET_ID}`);
    console.log("==========================================================================");

    const meta = await getSpreadsheetMetadata(ASSESSMENT_SPREADSHEET_ID);
    const token = await getGoogleSheetsAccessToken();

    const existingSheets = meta.sheets || [];
    console.log(
      "Current sheets in spreadsheet:",
      existingSheets.map((s: any) => `${s.properties.title} (ID: ${s.properties.sheetId})`)
    );

    // 1. Rename and configure Assessment Overview
    const overviewSheet = existingSheets.find((s: any) => s.properties.title === "Assessment Overview") || existingSheets[0];
    const overviewSheetId = overviewSheet.properties.sheetId;
    const requests: any[] = [];

    if (overviewSheet.properties.title !== "Assessment Overview") {
      requests.push({
        updateSheetProperties: {
          properties: {
            sheetId: overviewSheetId,
            title: "Assessment Overview",
            gridProperties: {
              frozenRowCount: 2,
              rowCount: 500,
              columnCount: 25,
            },
            tabColor: { red: 0.05, green: 0.28, blue: 0.16 }, // Deep Forest Green
          },
          fields: "title,gridProperties.frozenRowCount,gridProperties.rowCount,gridProperties.columnCount,tabColor",
        },
      });
    }

    // Check & Add Tab 2: "Pillar Submissions Log"
    let submissionsSheet = existingSheets.find((s: any) => s.properties.title === "Pillar Submissions Log");
    let submissionsSheetId = submissionsSheet ? submissionsSheet.properties.sheetId : 201;
    if (!submissionsSheet) {
      requests.push({
        addSheet: {
          properties: {
            sheetId: submissionsSheetId,
            title: "Pillar Submissions Log",
            gridProperties: {
              frozenRowCount: 2,
              rowCount: 1000,
              columnCount: 15,
            },
            tabColor: { red: 0.08, green: 0.35, blue: 0.65 }, // Ocean Blue
          },
        },
      });
    }

    // Check & Add Tab 3: "Detailed Question Responses"
    let responsesSheet = existingSheets.find((s: any) => s.properties.title === "Detailed Question Responses");
    let responsesSheetId = responsesSheet ? responsesSheet.properties.sheetId : 202;
    if (!responsesSheet) {
      requests.push({
        addSheet: {
          properties: {
            sheetId: responsesSheetId,
            title: "Detailed Question Responses",
            gridProperties: {
              frozenRowCount: 2,
              rowCount: 3000,
              columnCount: 16,
            },
            tabColor: { red: 0.72, green: 0.45, blue: 0.08 }, // Warm Amber / Bronze
          },
        },
      });
    }

    // Check & Add Tab 4: "Questionnaire Reference (200 Qs)"
    let refSheet = existingSheets.find((s: any) => s.properties.title === "Questionnaire Reference (200 Qs)");
    let refSheetId = refSheet ? refSheet.properties.sheetId : 203;
    if (!refSheet) {
      requests.push({
        addSheet: {
          properties: {
            sheetId: refSheetId,
            title: "Questionnaire Reference (200 Qs)",
            gridProperties: {
              frozenRowCount: 2,
              rowCount: 250,
              columnCount: 12,
            },
            tabColor: { red: 0.38, green: 0.18, blue: 0.55 }, // Regal Purple
          },
        },
      });
    }

    console.log("Applying sheet tab structural updates via batchUpdate...");
    const tabRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${ASSESSMENT_SPREADSHEET_ID}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requests }),
      }
    );
    const tabData = await tabRes.json();
    if (!tabRes.ok) {
      console.warn("Notice during sheet tab creation:", tabData.error?.message || tabData);
    } else {
      console.log("✔ Tabs successfully created and structured!");
    }

    // =========================================================================
    // 2. CONSTRUCT HEADERS AND VALUES FOR EACH TAB
    // =========================================================================

    // --- Tab 1: Assessment Overview Headers ---
    const overviewRow1 = [
      "FARM & SUBMITTER PROFILE", "", "", "", "", "", "",
      "FFMI OVERALL MATURITY & STATUS", "", "", "",
      "PILLAR CAPABILITY SCORES (0% – 100%)", "", "", "", "", "", "", "",
      "DIAGNOSTIC METRICS & PRIORITIES", "", "", "",
    ];
    const overviewRow2 = [
      "Timestamp",
      "Farmer Name",
      "Email Address",
      "Phone Number",
      "Farm Name",
      "Location / County",
      "Farm Size (Acres)",
      "Overall FFMI Score",
      "Maturity Tier",
      "Assessment Status",
      "Pillars Done",
      "P1: Smart Farming",
      "P2: Sustainable Agri",
      "P3: Market & Off-Take",
      "P4: Infrastructure",
      "P5: Leadership & Strategy",
      "P6: People & Labour",
      "P7: Finance & Risk",
      "P8: Climate & Eco",
      "Yes Answers (Capabilities)",
      "No Answers (Gaps)",
      "Top Development Priorities",
      "Last Evaluated",
    ];

    // --- Tab 2: Pillar Submissions Log Headers ---
    const submissionsRow1 = [
      "EVALUATION METADATA", "", "", "",
      "PILLAR DIAGNOSTIC RESULTS", "", "", "", "", "", "",
      "KEY RECOMMENDATIONS & NEXT STEPS", "",
    ];
    const submissionsRow2 = [
      "Submission Time",
      "Farmer Name",
      "Farmer Email",
      "Farm Name",
      "Pillar ID",
      "Pillar Name",
      "Score (%)",
      "Yes Count",
      "No Count",
      "Total Questions",
      "Maturity Tier",
      "Capability Scores Breakdown",
      "Identified Quick Wins & Priorities",
    ];

    // --- Tab 3: Detailed Question Responses Headers ---
    const responsesRow1 = [
      "PARTICIPANT DETAILS", "", "",
      "FRAMEWORK TAXONOMY", "", "", "",
      "QUESTION & RESPONSE", "", "",
      "CANONICAL GUIDANCE & SUPPORT", "", "", "", "",
    ];
    const responsesRow2 = [
      "Response Timestamp",
      "Farmer Email",
      "Farmer Name",
      "Pillar ID",
      "Pillar Name",
      "Capability ID",
      "Capability Name",
      "Question ID",
      "Question Text",
      "Farmer Answer",
      "Priority Level",
      "Canonical Recommendation",
      "Why It Matters",
      "Immediate Quick Win",
      "Technical Support Available",
    ];

    // --- Tab 4: Questionnaire Reference (200 Qs) Headers ---
    const refRow1 = [
      "FRAMEWORK STRUCTURE", "", "", "", "",
      "QUESTION DEFINITION & DIAGNOSTIC STANDARDS", "", "",
      "DEVELOPMENT RECOMMENDATIONS & INTERVENTIONS", "", "", "",
    ];
    const refRow2 = [
      "Pillar #",
      "Pillar Name",
      "Capability #",
      "Capability ID",
      "Capability Name",
      "Question ID",
      "Question Text",
      "Evidence Required",
      "Priority Level",
      "Standard Recommendation",
      "Why It Matters",
      "Quick Win Action",
    ];

    // Upload header rows
    console.log("Writing formatted headers to all 4 tabs...");
    await updateSheetValues(
      "'Assessment Overview'!A1:W2",
      [overviewRow1, overviewRow2],
      ASSESSMENT_SPREADSHEET_ID
    );
    await updateSheetValues(
      "'Pillar Submissions Log'!A1:M2",
      [submissionsRow1, submissionsRow2],
      ASSESSMENT_SPREADSHEET_ID
    );
    await updateSheetValues(
      "'Detailed Question Responses'!A1:O2",
      [responsesRow1, responsesRow2],
      ASSESSMENT_SPREADSHEET_ID
    );
    await updateSheetValues(
      "'Questionnaire Reference (200 Qs)'!A1:L2",
      [refRow1, refRow2],
      ASSESSMENT_SPREADSHEET_ID
    );
    console.log("✔ Headers written successfully!");

    // Populate Tab 4: Questionnaire Reference with all 200 questions
    console.log("Populating Questionnaire Reference (200 Canonical Questions)...");
    const refRows: any[][] = [];
    ALL_PILLARS.forEach((p) => {
      p.capabilities.forEach((c) => {
        c.questions.forEach((q) => {
          refRows.push([
            p.id,
            p.name,
            c.number,
            c.id,
            c.name,
            q.id,
            q.question,
            q.evidenceRequired || "",
            q.priority || "🟢 Quick Win",
            q.recommendation || "",
            q.whyItMatters || "",
            q.quickWin || "",
          ]);
        });
      });
    });

    await updateSheetValues(
      `'Questionnaire Reference (200 Qs)'!A3:L${refRows.length + 2}`,
      refRows,
      ASSESSMENT_SPREADSHEET_ID
    );
    console.log(`✔ Populated ${refRows.length} questions into Questionnaire Reference!`);

    // =========================================================================
    // 3. APPLY PROFESSIONAL VISUAL STYLING & FORMATTING VIA BATCHUPDATE
    // =========================================================================
    console.log("Applying visual styling, mergers, colors, borders and column widths...");
    const formatRequests: any[] = [];

    // Helper: Header row 1 background and text style
    const setHeaderRow1 = (sheetId: number, startCol: number, endCol: number, red: number, green: number, blue: number) => {
      formatRequests.push({
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: startCol,
            endColumnIndex: endCol,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red, green, blue },
              textFormat: {
                foregroundColor: { red: 1, green: 1, blue: 1 },
                fontSize: 10,
                bold: true,
              },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE",
            },
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
        },
      });
    };

    // Helper: Header row 2 background and text style
    const setHeaderRow2 = (sheetId: number, endCol: number, red: number, green: number, blue: number) => {
      formatRequests.push({
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: 2,
            startColumnIndex: 0,
            endColumnIndex: endCol,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red, green, blue },
              textFormat: {
                foregroundColor: { red: 1, green: 1, blue: 1 },
                fontSize: 10,
                bold: true,
              },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE",
              wrapStrategy: "WRAP",
            },
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
        },
      });
    };

    // Helper: Merge cells
    const mergeRange = (sheetId: number, startRow: number, endRow: number, startCol: number, endCol: number) => {
      formatRequests.push({
        mergeCells: {
          range: {
            sheetId,
            startRowIndex: startRow,
            endRowIndex: endRow,
            startColumnIndex: startCol,
            endColumnIndex: endCol,
          },
          mergeType: "MERGE_ALL",
        },
      });
    };

    // Helper: Auto-resize / set column width
    const setColWidth = (sheetId: number, startCol: number, endCol: number, pixelSize: number) => {
      formatRequests.push({
        updateDimensionProperties: {
          range: {
            sheetId,
            dimension: "COLUMNS",
            startIndex: startCol,
            endIndex: endCol,
          },
          properties: {
            pixelSize,
          },
          fields: "pixelSize",
        },
      });
    };

    // --- Style Tab 1: Assessment Overview ---
    mergeRange(overviewSheetId, 0, 1, 0, 7);   // Farm Profile (A-G)
    mergeRange(overviewSheetId, 0, 1, 7, 11);  // Overall FFMI (H-K)
    mergeRange(overviewSheetId, 0, 1, 11, 19); // Pillar Scores (L-S)
    mergeRange(overviewSheetId, 0, 1, 19, 23); // Diagnostics & Priorities (T-W)

    setHeaderRow1(overviewSheetId, 0, 7, 0.08, 0.22, 0.14);   // Deep Green
    setHeaderRow1(overviewSheetId, 7, 11, 0.72, 0.52, 0.04);  // Warm Gold/Amber
    setHeaderRow1(overviewSheetId, 11, 19, 0.09, 0.27, 0.52); // Marine Navy
    setHeaderRow1(overviewSheetId, 19, 23, 0.35, 0.16, 0.48); // Deep Purple

    setHeaderRow2(overviewSheetId, 23, 0.12, 0.15, 0.18); // Charcoal header line 2

    // Set nice column widths for Overview
    setColWidth(overviewSheetId, 0, 1, 150); // Timestamp
    setColWidth(overviewSheetId, 1, 2, 160); // Farmer Name
    setColWidth(overviewSheetId, 2, 3, 210); // Email
    setColWidth(overviewSheetId, 3, 4, 130); // Phone
    setColWidth(overviewSheetId, 4, 5, 180); // Farm Name
    setColWidth(overviewSheetId, 5, 6, 140); // County
    setColWidth(overviewSheetId, 6, 7, 110); // Farm Size
    setColWidth(overviewSheetId, 7, 8, 110); // FFMI Score
    setColWidth(overviewSheetId, 8, 9, 110); // Maturity Tier
    setColWidth(overviewSheetId, 9, 10, 115); // Status
    setColWidth(overviewSheetId, 10, 11, 100); // Pillars Done
    setColWidth(overviewSheetId, 11, 19, 95);  // P1 to P8 Scores
    setColWidth(overviewSheetId, 19, 21, 90);  // Yes/No Counts
    setColWidth(overviewSheetId, 21, 22, 260); // Priorities
    setColWidth(overviewSheetId, 22, 23, 140); // Last Evaluated

    // --- Style Tab 2: Pillar Submissions Log ---
    mergeRange(submissionsSheetId, 0, 1, 0, 4);   // Metadata (A-D)
    mergeRange(submissionsSheetId, 0, 1, 4, 11);  // Diagnostic Results (E-K)
    mergeRange(submissionsSheetId, 0, 1, 11, 13); // Recommendations (L-M)

    setHeaderRow1(submissionsSheetId, 0, 4, 0.08, 0.22, 0.14);
    setHeaderRow1(submissionsSheetId, 4, 11, 0.09, 0.27, 0.52);
    setHeaderRow1(submissionsSheetId, 11, 13, 0.72, 0.52, 0.04);
    setHeaderRow2(submissionsSheetId, 13, 0.12, 0.15, 0.18);

    setColWidth(submissionsSheetId, 0, 1, 150);
    setColWidth(submissionsSheetId, 1, 2, 160);
    setColWidth(submissionsSheetId, 2, 3, 210);
    setColWidth(submissionsSheetId, 3, 4, 180);
    setColWidth(submissionsSheetId, 4, 5, 80);
    setColWidth(submissionsSheetId, 5, 6, 220);
    setColWidth(submissionsSheetId, 6, 7, 90);
    setColWidth(submissionsSheetId, 7, 10, 80);
    setColWidth(submissionsSheetId, 10, 11, 110);
    setColWidth(submissionsSheetId, 11, 12, 250);
    setColWidth(submissionsSheetId, 12, 13, 300);

    // --- Style Tab 3: Detailed Question Responses ---
    mergeRange(responsesSheetId, 0, 1, 0, 3);   // Participant
    mergeRange(responsesSheetId, 0, 1, 3, 7);   // Taxonomy
    mergeRange(responsesSheetId, 0, 1, 7, 10);  // Question & Response
    mergeRange(responsesSheetId, 0, 1, 10, 15); // Canonical Guidance

    setHeaderRow1(responsesSheetId, 0, 3, 0.08, 0.22, 0.14);
    setHeaderRow1(responsesSheetId, 3, 7, 0.09, 0.27, 0.52);
    setHeaderRow1(responsesSheetId, 7, 10, 0.72, 0.52, 0.04);
    setHeaderRow1(responsesSheetId, 10, 15, 0.35, 0.16, 0.48);
    setHeaderRow2(responsesSheetId, 15, 0.12, 0.15, 0.18);

    setColWidth(responsesSheetId, 0, 1, 140);
    setColWidth(responsesSheetId, 1, 2, 200);
    setColWidth(responsesSheetId, 2, 3, 150);
    setColWidth(responsesSheetId, 3, 4, 75);
    setColWidth(responsesSheetId, 4, 5, 180);
    setColWidth(responsesSheetId, 5, 6, 110);
    setColWidth(responsesSheetId, 6, 7, 190);
    setColWidth(responsesSheetId, 7, 8, 85);
    setColWidth(responsesSheetId, 8, 9, 320); // Question text
    setColWidth(responsesSheetId, 9, 10, 95);  // Answer
    setColWidth(responsesSheetId, 10, 11, 110); // Priority
    setColWidth(responsesSheetId, 11, 12, 260); // Recommendation
    setColWidth(responsesSheetId, 12, 13, 240); // Why It Matters
    setColWidth(responsesSheetId, 13, 14, 240); // Quick Win
    setColWidth(responsesSheetId, 14, 15, 200); // Support Available

    // --- Style Tab 4: Questionnaire Reference (200 Qs) ---
    mergeRange(refSheetId, 0, 1, 0, 5);  // Framework Structure
    mergeRange(refSheetId, 0, 1, 5, 8);  // Question Definition
    mergeRange(refSheetId, 0, 1, 8, 12); // Guidance & Quick Wins

    setHeaderRow1(refSheetId, 0, 5, 0.08, 0.22, 0.14);
    setHeaderRow1(refSheetId, 5, 8, 0.09, 0.27, 0.52);
    setHeaderRow1(refSheetId, 8, 12, 0.35, 0.16, 0.48);
    setHeaderRow2(refSheetId, 12, 0.12, 0.15, 0.18);

    setColWidth(refSheetId, 0, 1, 65);
    setColWidth(refSheetId, 1, 2, 200);
    setColWidth(refSheetId, 2, 3, 85);
    setColWidth(refSheetId, 3, 4, 110);
    setColWidth(refSheetId, 4, 5, 180);
    setColWidth(refSheetId, 5, 6, 85);
    setColWidth(refSheetId, 6, 7, 320);
    setColWidth(refSheetId, 7, 8, 220);
    setColWidth(refSheetId, 8, 9, 115);
    setColWidth(refSheetId, 9, 10, 260);
    setColWidth(refSheetId, 10, 11, 240);
    setColWidth(refSheetId, 11, 12, 240);

    const styleRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${ASSESSMENT_SPREADSHEET_ID}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requests: formatRequests }),
      }
    );
    const styleData = await styleRes.json();
    if (!styleRes.ok) {
      console.warn("Notice during styling batchUpdate:", styleData.error?.message || styleData);
    } else {
      console.log("✔ Professional design & layout formatting applied successfully!");
    }

    // =========================================================================
    // 4. SYNC EXISTING ASSESSMENTS FROM DATABASE
    // =========================================================================
    console.log("Checking for existing assessments in database to sync...");
    const existingAssessments = await prisma.assessment.findMany({
      include: {
        user: {
          include: {
            farmerProfile: true,
            farmLocation: true,
            farmCharacteristics: true,
          },
        },
        pillarAssessments: true,
        assessmentResponses: true,
      },
    });

    console.log(`Found ${existingAssessments.length} assessment record(s) in local SQLite database.`);

    for (const a of existingAssessments) {
      if (!a.user) continue;

      console.log(`Syncing assessment for ${a.user.name} (${a.user.email})...`);
      const timestamp = (a.updatedAt || new Date()).toISOString().replace("T", " ").substring(0, 19);

      // Parse pillar scores
      const pScores: Record<number, number> = {};
      a.pillarAssessments.forEach((pa) => {
        pScores[pa.pillarId] = pa.score;
      });

      const yesCount = a.assessmentResponses.filter((r) => r.answer === "yes").length;
      const noCount = a.assessmentResponses.filter((r) => r.answer === "no").length;

      const overviewRow = [
        timestamp,
        a.user.name,
        a.user.email,
        a.user.phone ? `'${a.user.phone}` : "",
        a.user.farmName || "Green Horizon Agri-Farm",
        a.user.farmLocation?.locationSearch || a.user.farmLocation?.county || "Nakuru County",
        a.user.farmCharacteristics?.farmSize ? String(a.user.farmCharacteristics.farmSize) : "12.5",
        `${Math.round(a.overallScore)}%`,
        a.maturityLevel,
        a.status,
        `${a.pillarAssessments.length} of 8`,
        pScores[1] !== undefined ? `${Math.round(pScores[1])}%` : "—",
        pScores[2] !== undefined ? `${Math.round(pScores[2])}%` : "—",
        pScores[3] !== undefined ? `${Math.round(pScores[3])}%` : "—",
        pScores[4] !== undefined ? `${Math.round(pScores[4])}%` : "—",
        pScores[5] !== undefined ? `${Math.round(pScores[5])}%` : "—",
        pScores[6] !== undefined ? `${Math.round(pScores[6])}%` : "—",
        pScores[7] !== undefined ? `${Math.round(pScores[7])}%` : "—",
        pScores[8] !== undefined ? `${Math.round(pScores[8])}%` : "—",
        yesCount,
        noCount,
        noCount > 0 ? `${noCount} improvement areas flagged` : "All capabilities met",
        timestamp,
      ];

      // Upsert into Assessment Overview row
      await updateSheetValues(
        `'Assessment Overview'!A3:W3`,
        [overviewRow],
        ASSESSMENT_SPREADSHEET_ID
      );

      // Add to Pillar Submissions Log
      if (a.pillarAssessments.length > 0) {
        const submissionRows = a.pillarAssessments.map((pa) => [
          (pa.completedAt || pa.updatedAt || new Date()).toISOString().replace("T", " ").substring(0, 19),
          a.user.name,
          a.user.email,
          a.user.farmName || "Green Horizon Agri-Farm",
          pa.pillarId,
          pa.pillarName,
          `${Math.round(pa.score)}%`,
          pa.yesCount,
          pa.noCount,
          pa.totalQuestions,
          pa.maturityLevel,
          pa.capabilityScores || "{}",
          `${pa.noCount} gap(s) identified for action`,
        ]);

        await updateSheetValues(
          `'Pillar Submissions Log'!A3:M${submissionRows.length + 2}`,
          submissionRows,
          ASSESSMENT_SPREADSHEET_ID
        );
      }

      // Add to Detailed Question Responses
      if (a.assessmentResponses.length > 0) {
        const questionResponseRows = a.assessmentResponses.slice(0, 50).map((r) => {
          const qMeta = ALL_PILLARS.flatMap((p) => p.capabilities).flatMap((c) => c.questions).find((q) => q.id === r.questionId);
          return [
            timestamp,
            a.user.email,
            a.user.name,
            r.pillarId,
            `Pillar ${r.pillarId}`,
            r.capabilityId,
            r.capabilityName,
            r.questionId,
            r.questionText,
            r.answer === "yes" ? "Yes" : "No",
            qMeta?.priority || "🟢 Quick Win",
            r.recommendation || qMeta?.recommendation || "",
            r.whyItMatters || qMeta?.whyItMatters || "",
            r.quickWin || qMeta?.quickWin || "",
            r.supportAvailable || qMeta?.supportAvailable || "",
          ];
        });

        await updateSheetValues(
          `'Detailed Question Responses'!A3:O${questionResponseRows.length + 2}`,
          questionResponseRows,
          ASSESSMENT_SPREADSHEET_ID
        );
      }
    }

    console.log("\n==========================================================================");
    console.log("🎉 ASSESSMENT SPREADSHEET SETUP COMPLETE!");
    console.log(`🔗 Link: https://docs.google.com/spreadsheets/d/${ASSESSMENT_SPREADSHEET_ID}/edit`);
    console.log("==========================================================================\n");
  } catch (error: any) {
    console.error("❌ Fatal error setting up assessment sheet:", error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
