import { NextResponse } from "next/server";
import { syncAllUnsentUsersToSheet } from "@/lib/googleSheets";
import { syncClerkUsersToDatabaseAndSheet } from "@/lib/clerkSync";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clerkResult = await syncClerkUsersToDatabaseAndSheet();
    const dbResult = await syncAllUnsentUsersToSheet();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      clerk: clerkResult,
      database: dbResult,
    });
  } catch (err: any) {
    console.error("Error in /api/sync/users-to-sheet:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to sync unsent users" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
