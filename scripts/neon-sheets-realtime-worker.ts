/**
 * Neon Lakebase Postgres -> Google Sheets Real-Time Continuous Worker
 * 
 * Usage:
 *   npx tsx scripts/neon-sheets-realtime-worker.ts
 *   npx tsx scripts/neon-sheets-realtime-worker.ts --once
 */

import { prisma } from "../src/lib/prisma";
import {
  syncNeonUsersToSheetsFast,
  syncNeonAssessmentToSheetsFast,
} from "../src/lib/neonRealtimeSync";

const POLL_INTERVAL_MS = 2000;
const isOnce = process.argv.includes("--once");

let isRunning = true;
let lastSyncTimestamp = new Date(Date.now() - 24 * 60 * 60 * 1000); // start 24h back on initial boot

async function checkAndSyncNeonChanges() {
  const checkTime = new Date();

  try {
    // 1. Check for any Users modified since last sync in Neon
    const modifiedUsers = await prisma.user.findMany({
      where: {
        updatedAt: { gte: lastSyncTimestamp },
      },
      select: { id: true, email: true, updatedAt: true },
    });

    if (modifiedUsers.length > 0) {
      console.log(
        `[NeonWorker ${checkTime.toISOString().substring(11, 19)}] Detected ${modifiedUsers.length} modified user(s) in Neon.`
      );
      const userIds = modifiedUsers.map((u) => u.id);
      const res = await syncNeonUsersToSheetsFast(userIds);
      console.log(
        `[NeonWorker] Synced ${res.totalProcessed} user(s) (${res.updatedRangesCount} ranges) in ${res.durationMs}ms.`
      );
    }

    // 2. Check for any Assessments modified since last sync in Neon
    const modifiedAssessments = await prisma.assessment.findMany({
      where: {
        updatedAt: { gte: lastSyncTimestamp },
      },
      include: {
        user: { select: { email: true } },
      },
    });

    if (modifiedAssessments.length > 0) {
      console.log(
        `[NeonWorker ${checkTime.toISOString().substring(11, 19)}] Detected ${modifiedAssessments.length} modified assessment(s) in Neon.`
      );
      for (const a of modifiedAssessments) {
        if (a.user?.email) {
          const aRes = await syncNeonAssessmentToSheetsFast(a.user.email);
          console.log(
            `[NeonWorker] Assessment for ${a.user.email} synced in ${aRes.durationMs}ms.`
          );
        }
      }
    }

    lastSyncTimestamp = checkTime;
  } catch (err: any) {
    console.error("[NeonWorker] Polling error:", err.message || err);
  }
}

async function main() {
  console.log("====================================================================");
  console.log("  NEON LAKEBASE POSTGRES -> GOOGLE SHEETS REAL-TIME SYNC WORKER");
  console.log(`  Database URL: ${process.env.DATABASE_URL ? "Connected" : "Missing"}`);
  console.log(`  Mode: ${isOnce ? "Single-Shot (--once)" : "Continuous Loop (every 2s)"}`);
  console.log("====================================================================");

  if (isOnce) {
    await checkAndSyncNeonChanges();
    console.log("[NeonWorker] Single-shot execution finished.");
    process.exit(0);
  }

  process.on("SIGINT", () => {
    console.log("\n[NeonWorker] Shutting down gracefully...");
    isRunning = false;
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\n[NeonWorker] Termination signal received. Exiting...");
    isRunning = false;
    process.exit(0);
  });

  while (isRunning) {
    await checkAndSyncNeonChanges();
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

main().catch((err) => {
  console.error("[NeonWorker] Fatal error:", err);
  process.exit(1);
});
