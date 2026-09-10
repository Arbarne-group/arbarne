import { syncAllUnsentUsersToSheet } from "../src/lib/googleSheets";
import { syncClerkUsersToDatabaseAndSheet } from "../src/lib/clerkSync";

async function main() {
  console.log("=================================================");
  console.log("Future Farms - Clerk & Database to Sheet Sync");
  console.log("=================================================");
  console.log(`Starting scan at: ${new Date().toISOString()}`);

  console.log("\n1. Syncing users from Clerk Production...");
  const clerkResult = await syncClerkUsersToDatabaseAndSheet();
  console.log(`- Total users in Clerk:        ${clerkResult.clerkTotal}`);
  console.log(`- New users imported to DB:    ${clerkResult.importedToDb}`);
  console.log(`- Clerk users synced to Sheet: ${clerkResult.syncedToSheet}`);

  console.log("\n2. Scanning Database for any unsent records...");
  const result = await syncAllUnsentUsersToSheet();

  console.log("\nDatabase Sync Summary:");
  console.log(`- Total users in database:     ${result.totalInDb}`);
  console.log(`- Users already in sheet:      ${result.alreadyInSheet}`);
  console.log(`- Unsent users synchronized:   ${result.syncedCount}`);

  if (result.syncedEmails.length > 0) {
    console.log("\nSynchronized Users:");
    result.syncedEmails.forEach((email, i) => {
      console.log(`  ${i + 1}. ${email}`);
    });
  }

  if (result.errors.length > 0) {
    console.log("\nErrors encountered:");
    result.errors.forEach((err, i) => {
      console.error(`  ${i + 1}. ${err}`);
    });
  }

  console.log("\n=================================================");
  console.log("Database to Sheet Sync complete!");
  console.log("=================================================");
}

main().catch((err) => {
  console.error("Fatal error during sync:", err);
  process.exit(1);
});
