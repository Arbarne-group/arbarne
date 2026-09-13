import { syncReportGenerationToSheet } from "../src/lib/googleSheets";

async function main() {
  console.log("Calling syncReportGenerationToSheet for victorchogo37@outlook.com...");
  const res = await syncReportGenerationToSheet("victorchogo37@outlook.com", "all");
  console.log("Result:", res);
}

main();
