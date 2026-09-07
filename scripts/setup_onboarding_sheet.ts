import { getGoogleSheetsAccessToken, getSpreadsheetMetadata } from "../src/lib/googleSheets";
import { ONBOARDING_SECTIONS } from "../src/data/onboardingData";
import { prisma } from "../src/lib/prisma";

const SPREADSHEET_ID = "1tEYJhZijyMfaZ8_btZmC9_5UJRLk4af2luL1vKixSyM";

async function main() {
  try {
    console.log("Fetching spreadsheet metadata...");
    const meta = await getSpreadsheetMetadata(SPREADSHEET_ID);
    const token = await getGoogleSheetsAccessToken();

    const existingSheets = meta.sheets || [];
    const firstSheet = existingSheets[0];
    const firstSheetId = firstSheet.properties.sheetId;

    console.log(`Found first sheet "${firstSheet.properties.title}" (ID: ${firstSheetId})`);

    const hasDictSheet = existingSheets.some((s: any) => s.properties.title === "Question Dictionary");

    // 1. Prepare batchUpdate requests
    const requests: any[] = [];

    // Rename first sheet to "Onboarding Responses" and set grid properties (freeze rows/cols)
    requests.push({
      updateSheetProperties: {
        properties: {
          sheetId: firstSheetId,
          title: "Onboarding Responses",
          gridProperties: {
            frozenRowCount: 2,
            frozenColumnCount: 0,
            rowCount: 500,
            columnCount: 35,
          },
          tabColor: {
            red: 0.0,
            green: 0.42,
            blue: 0.1, // Future Farms brand green
          },
        },
        fields: "title,gridProperties.frozenRowCount,gridProperties.frozenColumnCount,gridProperties.rowCount,gridProperties.columnCount,tabColor",
      },
    });

    // Add "Question Dictionary" sheet if it doesn't exist
    let dictSheetId = 101;
    if (!hasDictSheet) {
      requests.push({
        addSheet: {
          properties: {
            sheetId: dictSheetId,
            title: "Question Dictionary",
            gridProperties: {
              frozenRowCount: 1,
              rowCount: 50,
              columnCount: 8,
            },
            tabColor: {
              red: 0.08,
              green: 0.35,
              blue: 0.65, // Blue tab
            },
          },
        },
      });
    } else {
      dictSheetId = existingSheets.find((s: any) => s.properties.title === "Question Dictionary")?.properties.sheetId || 101;
    }

    // Merge ranges in Row 1 for section categories
    // Columns:
    // A-F (0-6): Submitter Information (6 cols)
    // G-K (6-11): Section 1: Farmer Profile (5 cols)
    // L-N (11-14): Section 2: Farm Management (3 cols)
    // O-T (14-20): Section 3: Operating Style (6 cols)
    // U-AA (20-27): Section 4: Aspirations & Vision (7 cols)
    // AB-AG (27-33): Section 5: Digital Platform & Verification (6 cols)
    const mergeRanges = [
      { startCol: 0, endCol: 6, title: "SUBMITTER DETAILS", color: { r: 0.0, g: 0.29, b: 0.14 } }, // Deep Forest Green
      { startCol: 6, endCol: 11, title: "SECTION 1: FARMER PROFILE", color: { r: 0.08, g: 0.35, b: 0.65 } }, // Brand Navy
      { startCol: 11, endCol: 14, title: "SECTION 2: FARM MANAGEMENT", color: { r: 0.01, g: 0.52, b: 0.49 } }, // Deep Teal
      { startCol: 14, endCol: 20, title: "SECTION 3: OPERATING STYLE", color: { r: 0.42, g: 0.22, b: 0.61 } }, // Deep Purple
      { startCol: 20, endCol: 27, title: "SECTION 4: ASPIRATIONS & VISION", color: { r: 0.82, g: 0.41, b: 0.05 } }, // Warm Amber
      { startCol: 27, endCol: 33, title: "SECTION 5: DIGITAL PLATFORM & AUDITS", color: { r: 0.16, g: 0.55, b: 0.22 } }, // Bright Forest Green
    ];

    // Merge cells for Row 1
    mergeRanges.forEach((m) => {
      requests.push({
        mergeCells: {
          range: {
            sheetId: firstSheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: m.startCol,
            endColumnIndex: m.endCol,
          },
          mergeType: "MERGE_ALL",
        },
      });

      // Style Row 1 merged headers
      requests.push({
        repeatCell: {
          range: {
            sheetId: firstSheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: m.startCol,
            endColumnIndex: m.endCol,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: m.color.r, green: m.color.g, blue: m.color.b },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE",
              textFormat: {
                foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                fontSize: 11,
                bold: true,
              },
            },
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
        },
      });
    });

    // Style Row 2 question headers
    requests.push({
      repeatCell: {
        range: {
          sheetId: firstSheetId,
          startRowIndex: 1,
          endRowIndex: 2,
          startColumnIndex: 0,
          endColumnIndex: 33,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.94, green: 0.96, blue: 0.95 },
            horizontalAlignment: "LEFT",
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
            textFormat: {
              foregroundColor: { red: 0.1, green: 0.15, blue: 0.12 },
              fontSize: 10,
              bold: true,
            },
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
      },
    });

    // Adjust column widths for readability
    // Submitter columns
    for (let c = 0; c < 6; c++) {
      requests.push({
        updateDimensionProperties: {
          range: {
            sheetId: firstSheetId,
            dimension: "COLUMNS",
            startIndex: c,
            endIndex: c + 1,
          },
          properties: {
            pixelSize: c === 0 ? 160 : c === 2 ? 220 : 180,
          },
          fields: "pixelSize",
        },
      });
    }

    // Question columns
    for (let c = 6; c < 33; c++) {
      requests.push({
        updateDimensionProperties: {
          range: {
            sheetId: firstSheetId,
            dimension: "COLUMNS",
            startIndex: c,
            endIndex: c + 1,
          },
          properties: {
            pixelSize: 250, // Comfortable width for question answers
          },
          fields: "pixelSize",
        },
      });
    }

    // Row heights for header rows
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId: firstSheetId,
          dimension: "ROWS",
          startIndex: 0,
          endIndex: 1,
        },
        properties: { pixelSize: 40 },
        fields: "pixelSize",
      },
    });
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId: firstSheetId,
          dimension: "ROWS",
          startIndex: 1,
          endIndex: 2,
        },
        properties: { pixelSize: 48 },
        fields: "pixelSize",
      },
    });

    // Style "Question Dictionary" Header Row
    requests.push({
      repeatCell: {
        range: {
          sheetId: dictSheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: 7,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.08, green: 0.35, blue: 0.65 },
            horizontalAlignment: "LEFT",
            verticalAlignment: "MIDDLE",
            textFormat: {
              foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
              fontSize: 10,
              bold: true,
            },
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
      },
    });

    console.log(`Executing ${requests.length} format and styling operations via batchUpdate...`);
    const batchRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requests }),
      }
    );

    const batchData = await batchRes.json();
    if (!batchRes.ok) {
      throw new Error(`batchUpdate failed (${batchRes.status}): ${JSON.stringify(batchData)}`);
    }
    console.log("Formatting and structural setup completed!");

    // 2. Insert Header Values for "Onboarding Responses"
    const row1 = [
      "SUBMITTER DETAILS", "", "", "", "", "",
      "SECTION 1: FARMER PROFILE", "", "", "", "",
      "SECTION 2: FARM MANAGEMENT", "", "",
      "SECTION 3: OPERATING STYLE", "", "", "", "", "",
      "SECTION 4: ASPIRATIONS & VISION", "", "", "", "", "", "",
      "SECTION 5: DIGITAL PLATFORM & AUDITS", "", "", "", "", "",
    ];

    const row2 = [
      "Timestamp",
      "Farmer Full Name",
      "Email Address",
      "Phone Number",
      "Farm Name",
      "Onboarding Status",
      "Q1. Primary Occupation / Job Title",
      "Q2. Agricultural Value Chain(s)",
      "Q3. Years of Experience",
      "Q4. Business History",
      "Q5. Highest Education Level",
      "Q6. Farm Management Ability",
      "Q7. Operations Responsibility",
      "Q8. Desired Involvement Level",
      "Q9. Decision-Making Style",
      "Q10. Response to Setbacks",
      "Q11. Top Obstacles to Growth",
      "Q12. Guidance & Feedback Preference",
      "Q13. Performance Review Frequency",
      "Q14. Preferred Farm Updates",
      "Q15. 12-Month Success Vision",
      "Q16. Greatest Impact Support Needed",
      "Q17. Unique Market Insight",
      "Q18. 3-5 Year Role in Farm",
      "Q19. Farm Manager Responsibilities",
      "Q20. Personally Approved Decisions",
      "Q21. 25-Year African Agriculture Vision",
      "Q22. Main Reasons for Management Support",
      "Q23. Remote Management Confidence Drivers",
      "Q24. Remote Solutions Comfort",
      "Q25. Willingness to Maintain Records",
      "Q26. Periodic Physical Audits Comfort",
      "Q27. Additional Notes & Requirements",
    ];

    console.log("Writing Row 1 and Row 2 headers to 'Onboarding Responses'...");
    const headersRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Onboarding%20Responses!A1:AG2?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [row1, row2],
        }),
      }
    );
    const headersData = await headersRes.json();
    if (!headersRes.ok) {
      throw new Error(`Failed to write headers: ${JSON.stringify(headersData)}`);
    }
    console.log("Headers populated successfully!");

    // 3. Populate "Question Dictionary" tab
    const dictHeader = [
      "Section #",
      "Section Title",
      "Q #",
      "Field ID",
      "Question Prompt",
      "Input Type",
      "Available Options / Description",
    ];

    const dictRows: any[] = [dictHeader];
    ONBOARDING_SECTIONS.forEach((sec) => {
      sec.questions.forEach((q) => {
        const optionsStr = q.options ? q.options.map((o) => o.label).join(" | ") : (q.placeholder || "Free text");
        dictRows.push([
          `Step ${sec.step}`,
          sec.title,
          `Q${q.number}`,
          q.id,
          q.question,
          q.type.toUpperCase(),
          optionsStr,
        ]);
      });
    });

    console.log(`Writing ${dictRows.length} rows to 'Question Dictionary'...`);
    const dictRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Question%20Dictionary!A1:G${dictRows.length}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: dictRows,
        }),
      }
    );
    const dictData = await dictRes.json();
    if (!dictRes.ok) {
      throw new Error(`Failed to populate dictionary: ${JSON.stringify(dictData)}`);
    }
    console.log("Question Dictionary populated successfully!");

    // 4. Also fetch existing onboarding submissions from SQLite database and append to Sheet!
    console.log("Checking SQLite database for existing user onboarding submissions...");
    const users = await prisma.user.findMany({
      include: {
        farmerProfile: true,
        farmManagement: true,
        operatingStyle: true,
        aspiration: true,
        digitalPlatform: true,
      },
    });

    console.log(`Found ${users.length} users in database.`);
    const dataRowsToAppend: any[] = [];

    for (const u of users) {
      const fp = u.farmerProfile;
      const fm = u.farmManagement;
      const os = u.operatingStyle;
      const asp = u.aspiration;
      const dp = u.digitalPlatform;

      // Only include if user has answered at least some onboarding
      if (fp || fm || os || asp || dp) {
        const phoneVal = u.phone ? (u.phone.startsWith("+") ? `'${u.phone}` : u.phone) : "";
        const row = [
          new Date(u.updatedAt || u.createdAt).toISOString().replace("T", " ").substring(0, 19),
          u.name,
          u.email,
          phoneVal,
          u.farmName || "",
          (fp && fm && os && asp && dp) ? "Completed" : "In Progress",
          fp?.jobTitle || "",
          fp?.valueChain || "",
          fp?.experienceYears || "",
          fp?.businessHistory || "",
          fp?.educationLevel || fp?.education || "",
          fm?.mgmtAbility || "",
          fm?.opsResponsibility || fm?.operationsResponsible || "",
          fm?.desiredInvolvement || "",
          os?.decisionStyle || "",
          os?.failureResponse || "",
          os?.obstacles || "",
          os?.guidancePreference || "",
          os?.trackingFrequency || "",
          os?.updatePreference || os?.updatePreferences || "",
          asp?.twelveMonthSuccess || "",
          asp?.greatestImpactSupport || "",
          asp?.marketInsight || "",
          asp?.threeToFiveYearRole || "",
          asp?.fmResponsibility || "",
          asp?.personallyApprovedDecisions || "",
          asp?.twentyFiveYearVision || "",
          dp?.supportReasons || "",
          dp?.remoteConfidence || "",
          dp?.remoteComfort || "",
          dp?.recordKeeping || "",
          dp?.physicalAudits || "",
          dp?.additionalNotes || "",
        ];
        dataRowsToAppend.push(row);
      }
    }

    if (dataRowsToAppend.length > 0) {
      console.log(`Writing ${dataRowsToAppend.length} existing submission(s) to 'Onboarding Responses'...`);
      const appendRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Onboarding%20Responses!A3:AG${2 + dataRowsToAppend.length}?valueInputOption=USER_ENTERED`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: dataRowsToAppend,
          }),
        }
      );
      const appendData = await appendRes.json();
      if (!appendRes.ok) {
        console.error("Failed to write existing submissions:", appendData);
      } else {
        console.log("Existing submissions written to Google Sheet successfully!");
      }
    }

    console.log("\n========================================================");
    console.log("SPREADSHEET STRUCTURED AND SYNCHRONIZED SUCCESSFULLY!");
    console.log(`URL: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
    console.log("========================================================");
  } catch (err: any) {
    console.error("Error setting up spreadsheet:", err.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
