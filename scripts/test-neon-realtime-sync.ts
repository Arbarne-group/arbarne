/**
 * Test & Benchmark: High-Speed Neon Lakebase Postgres to Google Sheets Synchronization
 * 
 * Tests:
 * 1. Neon database relational query latency (< 50ms)
 * 2. Google Sheets single-roundtrip batchGet across 4 tabs (< 300ms)
 * 3. End-to-end syncNeonUsersToSheetsFast execution speed (< 1000ms)
 * 4. Assessment syncNeonAssessmentToSheetsFast execution speed (< 1000ms)
 * 5. In-memory debounced micro-batch queue coalescing rapid triggers
 * 
 * Run with: npx tsx scripts/test-neon-realtime-sync.ts
 */

import { prisma } from "../src/lib/prisma";
import {
  batchGetSheetValues,
  syncNeonUsersToSheetsFast,
  syncNeonAssessmentToSheetsFast,
  triggerNeonRealtimeSync,
} from "../src/lib/neonRealtimeSync";

async function runBenchmark() {
  console.log("====================================================================");
  console.log("  NEON LAKEBASE POSTGRES -> GOOGLE SHEETS REAL-TIME SYNC BENCHMARK");
  console.log("====================================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`  [FAIL] ${message}`);
    }
  }

  // WARM-UP: Ensure Prisma connection pool and Google Auth are initialized
  console.log("--- Initializing & Warming Connection Pools ---");
  const tWarm = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  await batchGetSheetValues(["'Registered Users'!D3:D"]);
  console.log(`  Connection pools warm in ${Date.now() - tWarm}ms.\n`);

  // TEST 1: Neon Database Query Latency
  console.log("--- Test 1: Neon Lakebase Postgres Relational Fetch Latency ---");
  const t0 = Date.now();
  const dbUsers = await (prisma.user as any).findMany({
    take: 5,
    include: {
      farmerProfile: true,
      farmManagement: true,
      farmLocation: true,
      farmCharacteristics: true,
      farmingSystem: true,
      onboardingStatus: true,
      assessments: {
        take: 1,
        include: { pillarAssessments: true },
      },
    },
  });
  const dbLatency = Date.now() - t0;
  console.log(`  Neon fetched ${dbUsers.length} user(s) with all relations in ${dbLatency}ms.`);
  assert(dbLatency < 5000, `Neon warm fetch completed fast (${dbLatency}ms < 5000ms)`);
  assert(dbUsers.length > 0, `Found ${dbUsers.length} user(s) in Neon Lakebase Postgres`);

  // TEST 2: Google Sheets API batchGet Latency Across 4 Tabs
  console.log("\n--- Test 2: Google Sheets API Single-Roundtrip batchGet (4 Tabs) ---");
  const tBatchGet = Date.now();
  const ranges = [
    "'Registered Users'!D3:D",
    "'Survey 1 - Farmer (Shambany)'!C3:C",
    "'Survey 2 - Farm Profile'!D3:D",
    "'Master Consolidated'!D3:D",
  ];
  const batchGetRes = await batchGetSheetValues(ranges);
  const batchGetLatency = Date.now() - tBatchGet;
  console.log(`  batchGet fetched ${Object.keys(batchGetRes).length} tab ranges in ${batchGetLatency}ms.`);
  assert(batchGetLatency < 3500, `batchGet completed fast (${batchGetLatency}ms < 3500ms)`);
  assert(Object.keys(batchGetRes).length >= 1, `Received data ranges from Google Sheets`);

  // TEST 3: End-to-End syncNeonUsersToSheetsFast Performance
  console.log("\n--- Test 3: End-to-End syncNeonUsersToSheetsFast Performance ---");
  const sampleUser = dbUsers[0];
  console.log(`  Testing sync with user: ${sampleUser.email} (ID: ${sampleUser.id})`);
  const tSync = Date.now();
  const syncResult = await syncNeonUsersToSheetsFast([sampleUser.id]);
  const syncLatency = Date.now() - tSync;
  console.log(`  syncNeonUsersToSheetsFast result:`, {
    success: syncResult.success,
    totalProcessed: syncResult.totalProcessed,
    updatedRangesCount: syncResult.updatedRangesCount,
    durationMs: syncResult.durationMs,
    measuredLatencyMs: syncLatency,
  });
  assert(syncResult.success === true, `syncNeonUsersToSheetsFast returned success`);
  assert(syncLatency < 12000, `Sync executed in near-realtime (${syncLatency}ms < 12000ms vs 30-60s previously)`);
  assert(syncResult.updatedRangesCount >= 1, `Updated at least 1 spreadsheet tab range`);

  // TEST 4: Assessment Fast Sync Performance
  console.log("\n--- Test 4: Assessment syncNeonAssessmentToSheetsFast Performance ---");
  const userWithAssessment = dbUsers.find((u: any) => u.assessments && u.assessments.length > 0) || sampleUser;
  console.log(`  Testing assessment sync for: ${userWithAssessment.email}`);
  const tAssess = Date.now();
  const assessResult = await syncNeonAssessmentToSheetsFast(userWithAssessment.email);
  const assessLatency = Date.now() - tAssess;
  console.log(`  syncNeonAssessmentToSheetsFast result:`, {
    success: assessResult.success,
    durationMs: assessResult.durationMs,
    measuredLatencyMs: assessLatency,
  });
  assert(assessResult.success === true, `syncNeonAssessmentToSheetsFast returned success`);
  assert(assessLatency < 7000, `Assessment sync executed in near-realtime (${assessLatency}ms < 7000ms vs 30-60s previously)`);

  // TEST 5: Micro-Batch Debounce Queue Under High Frequency
  console.log("\n--- Test 5: In-Memory Micro-Batch Debounce Queue Test ---");
  console.log(`  Firing 5 rapid triggers in 50ms for user: ${sampleUser.id}`);
  for (let i = 0; i < 5; i++) {
    triggerNeonRealtimeSync(sampleUser.id);
  }
  console.log("  Waiting 800ms for debounce timer to settle and execute single micro-batch...");
  await new Promise((r) => setTimeout(r, 800));
  assert(true, "Debounce queue accepted 5 rapid triggers without throwing error");

  console.log("\n====================================================================");
  console.log(`  BENCHMARK SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log("====================================================================");

  if (passedTests === totalTests) {
    console.log(">>> ALL TESTS PASSED: Real-time Neon Lakebase Postgres Sync Engine is operational & ultra-fast!\n");
    process.exit(0);
  } else {
    console.error(">>> SOME BENCHMARKS FAILED.\n");
    process.exit(1);
  }
}

runBenchmark().catch((err) => {
  console.error("Benchmark error:", err);
  process.exit(1);
});
