import { getSheetValues, DEFAULT_SPREADSHEET_ID } from "../src/lib/googleSheets";

async function main() {
  const tabs = [
    "Registered Users",
    "Master Consolidated",
    "Survey 1 - Farmer (Shambany)",
    "Survey 2 - Farm Profile"
  ];

  for (const tab of tabs) {
    const rows = await getSheetValues(`'${tab}'!A1:ZZ2`, DEFAULT_SPREADSHEET_ID);
    console.log(`\n================== TAB: [${tab}] ==================`);
    if (rows.length >= 2) {
      console.log(`Total columns: ${rows[1].length}`);
      rows[1].forEach((col: string, idx: number) => {
        console.log(`  Col ${idx + 1}: "${col}"`);
      });
    }
  }
}

main().catch(console.error);
