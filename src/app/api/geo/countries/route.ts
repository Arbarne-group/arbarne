import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/access";
import { runWithAuditContext } from "@/lib/audit";

/** Public: list countries (used by signup phone + country pickers). */
export async function GET() {
  try {
    const countries = await prisma.country.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ success: true, countries });
  } catch (error) {
    console.error("[GET /api/geo/countries]", error);
    return NextResponse.json(
      { success: false, error: "Could not load countries." },
      { status: 503 }
    );
  }
}

/** Staff: create a country. */
export async function POST(request: Request) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const body = await request.json();
    const initials = String(body.initials || "").toUpperCase().trim();
    const name = String(body.name || "").trim();
    const dialCode = String(body.dialCode || "").trim();
    const flagEmoji = String(body.flagEmoji || "").trim() || null;
    if (!/^[A-Z]{2,3}$/.test(initials)) {
      return NextResponse.json({ error: "Initials must be 2–3 letters (e.g. KE)." }, { status: 400 });
    }
    if (!name || !/^\+\d{1,4}$/.test(dialCode)) {
      return NextResponse.json({ error: "Name and dial code (e.g. +254) are required." }, { status: 400 });
    }
    const country = await runWithAuditContext({ actorId: gate.user.id }, async () =>
      prisma.country.create({ data: { initials, name, dialCode, flagEmoji } })
    );
    return NextResponse.json({ success: true, country }, { status: 201 });
  } catch (error: any) {
    if (String(error?.code) === "P2002") {
      return NextResponse.json({ error: "That country already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not create country." }, { status: 500 });
  }
}
