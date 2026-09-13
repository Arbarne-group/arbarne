import {
  getSpreadsheetMetadata,
  getSheetValues,
  DEFAULT_ASSESSMENT_SPREADSHEET_ID,
  ensureSheetTabExists,
} from "../src/lib/googleSheets";

async function main() {
  console.log("Checking spreadsheet:", DEFAULT_ASSESSMENT_SPREADSHEET_ID);
  try {
    const meta = await getSpreadsheetMetadata(DEFAULT_ASSESSMENT_SPREADSHEET_ID);
    console.log("Spreadsheet Title:", meta.properties?.title);
    const tabs = meta.sheets?.map((s: any) => s.properties?.title) || [];
    console.log("Existing Tabs:", tabs);

    if (tabs.includes("Reports Generated")) {
      const rows = await getSheetValues("'Reports Generated'!A1:R30", DEFAULT_ASSESSMENT_SPREADSHEET_ID);
      console.log("Reports Generated row count:", rows?.length || 0);
      rows?.forEach((r: any[], i: number) => {
        console.log(`Row ${i + 1}:`, r.slice(0, 8));
      });
    } else {
      console.log("Tab 'Reports Generated' does NOT exist in the spreadsheet!");
    }
  } catch (err: any) {
    console.error("Error inspecting spreadsheet:", err.message);
  }
}

main();
