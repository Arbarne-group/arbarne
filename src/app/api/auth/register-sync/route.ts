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

    // Asynchronously record user to Google Sheet without blocking HTTP response
    recordUserToSheet(dbUser).catch((sheetErr: any) => {
      console.warn("[GoogleSheets] Register sync background notice:", sheetErr?.message || sheetErr);
    });

    return NextResponse.json({
      success: true,
      futureFarmId: dbUser.futureFarmId,
      user: {
        id: dbUser.id,
        futureFarmId: dbUser.futureFarmId,
        email: dbUser.email,
        name: dbUser.name,
      },
      sheetSynced: true,
    });
  } catch (error: any) {
    console.error("Error in /api/auth/register-sync:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
