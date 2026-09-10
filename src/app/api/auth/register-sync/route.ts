import { NextResponse } from "next/server";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { recordUserToSheet } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body may be empty
    }

    const fallbackEmail = typeof body?.email === "string" ? body.email.trim() : undefined;
    const dbUser = await getOrCreateCurrentUser(fallbackEmail);

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "Unauthenticated or user not found" },
        { status: 401 }
      );
    }

    // Explicitly sync to Google Sheet
    const sheetResult = await recordUserToSheet(dbUser);

    return NextResponse.json({
      success: true,
      futureFarmId: dbUser.futureFarmId,
      user: {
        id: dbUser.id,
        futureFarmId: dbUser.futureFarmId,
        email: dbUser.email,
        name: dbUser.name,
      },
      sheetSynced: sheetResult.success,
    });
  } catch (error: any) {
    console.error("Error in /api/auth/register-sync:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
