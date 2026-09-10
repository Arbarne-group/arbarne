import { NextRequest, NextResponse } from "next/server";
import { syncAllUnsentUsersToSheet, syncAllUnsentAssessmentsToSheet } from "@/lib/googleSheets";
import { syncClerkUsersToDatabaseAndSheet } from "@/lib/clerkSync";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow sufficient time for sheets batching

export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = req.headers.get("authorization");
      const urlSecret = req.nextUrl.searchParams.get("secret");
      if (authHeader !== `Bearer ${cronSecret}` && urlSecret !== cronSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const clerkResult = await syncClerkUsersToDatabaseAndSheet();
    const onboardingResult = await syncAllUnsentUsersToSheet();
    const assessmentResult = await syncAllUnsentAssessmentsToSheet();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      clerk: clerkResult,
      onboarding: onboardingResult,
      assessment: assessmentResult,
    });
  } catch (err: any) {
    console.error("Error in /api/sync/users-to-sheet:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to sync unsent users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}

