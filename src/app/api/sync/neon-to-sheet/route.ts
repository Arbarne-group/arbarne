import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  syncNeonUsersToSheetsFast,
  syncNeonAssessmentToSheetsFast,
  syncAllNeonAssessmentsToSheetsFast,
} from "@/lib/neonRealtimeSync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Dedicated API route for ultra-fast Neon Lakebase Postgres -> Google Sheets synchronization.
 * Supports:
 * - ?userId=...: Instant single-user fast sync (< 600ms)
 * - ?email=...: Instant single-user sync by email
 * - ?recentMinutes=5: Syncs all records modified in Neon in the last N minutes
 * - ?all=true: High-speed batch sync for all Neon records
 * - ?type=onboarding | assessment | all: Target specific spreadsheets
 */
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = req.headers.get("authorization");
      const urlSecret = req.nextUrl.searchParams.get("secret");
      if (authHeader && authHeader !== `Bearer ${cronSecret}` && urlSecret && urlSecret !== cronSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const recentMinutes = searchParams.get("recentMinutes");
    const all = searchParams.get("all") === "true";
    const type = searchParams.get("type") || "all";

    let targetUserIds: string[] | undefined = undefined;

    if (userId) {
      targetUserIds = [userId];
    } else if (email) {
      const u = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
      if (u) {
        targetUserIds = [u.id];
      } else {
        return NextResponse.json({ success: false, error: "User not found by email" }, { status: 404 });
      }
    } else if (recentMinutes) {
      const cutoff = new Date(Date.now() - Number(recentMinutes) * 60 * 1000);
      const recentUsers = await prisma.user.findMany({
        where: {
          updatedAt: { gte: cutoff },
        },
        select: { id: true },
      });
      targetUserIds = recentUsers.map((u) => u.id);
    } else if (!all) {
      // Default: if no param provided, sync users modified in the last 60 minutes or all if <= 50
      const count = await prisma.user.count();
      if (count <= 100) {
        targetUserIds = undefined; // all
      } else {
        const cutoff = new Date(Date.now() - 60 * 60 * 1000);
        const recentUsers = await prisma.user.findMany({
          where: { updatedAt: { gte: cutoff } },
          select: { id: true },
        });
        targetUserIds = recentUsers.map((u) => u.id);
      }
    }

    const results: any = {};

    // 1. Sync Onboarding Directory
    if (type === "all" || type === "onboarding") {
      results.onboarding = await syncNeonUsersToSheetsFast(targetUserIds);
    }

    // 2. Sync Assessment Overview
    if (type === "all" || type === "assessment") {
      if (email) {
        results.assessment = await syncNeonAssessmentToSheetsFast(email);
      } else if (!targetUserIds) {
        results.assessment = await syncAllNeonAssessmentsToSheetsFast();
      } else {
        // Sync assessments for the resolved users
        const assessmentsToSync = await prisma.assessment.findMany({
          where: { userId: { in: targetUserIds } },
          include: { user: { select: { email: true } } },
        });

        let assessmentCount = 0;
        for (const a of assessmentsToSync) {
          if (a.user?.email) {
            await syncNeonAssessmentToSheetsFast(a.user.email);
            assessmentCount++;
          }
        }
        results.assessment = { success: true, count: assessmentCount };
      }
    }

    return NextResponse.json({
      success: true,
      executionTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (err: any) {
    console.error("Error in /api/sync/neon-to-sheet:", err);
    return NextResponse.json(
      {
        success: false,
        executionTimeMs: Date.now() - startTime,
        error: err.message || "Failed to execute Neon to Sheets sync",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
