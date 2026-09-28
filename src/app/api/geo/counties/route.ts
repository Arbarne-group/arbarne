import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/access";
import { runWithAuditContext } from "@/lib/audit";

/** Public: list counties/provinces, optionally filtered by ?country=KE. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.toUpperCase();
  const counties = await prisma.countyOrProvince.findMany({
    where: country ? { countryCode: country } : undefined,
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ success: true, counties });
}

/** Staff: create a county/province. */
export async function POST(request: Request) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const body = await request.json();
    const countryCode = String(body.countryCode || "").toUpperCase().trim();
    const code = String(body.code || "").trim();
    const name = String(body.name || "").trim();
    if (!countryCode || !code || !name) {
      return NextResponse.json(
        { error: "countryCode, code and name are required." },
        { status: 400 }
      );
    }
    const country = await prisma.country.findUnique({ where: { initials: countryCode } });
    if (!country) {
      return NextResponse.json({ error: "Country not found." }, { status: 404 });
    }
    const county = await runWithAuditContext({ actorId: gate.user.id }, async () =>
      prisma.countyOrProvince.create({ data: { countryCode, code, name } })
    );
    return NextResponse.json({ success: true, county }, { status: 201 });
  } catch (error: any) {
    if (String(error?.code) === "P2002") {
      return NextResponse.json(
        { error: "That county/province code already exists in this country." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Could not create county/province." }, { status: 500 });
  }
}
