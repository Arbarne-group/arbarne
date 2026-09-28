import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/access";
import { runWithAuditContext } from "@/lib/audit";

/** Public: list towns, optionally filtered by ?country=KE&county=NAIVASHA. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.toUpperCase();
  const county = searchParams.get("county") || undefined;
  const towns = await prisma.town.findMany({
    where: {
      ...(country ? { countryCode: country } : {}),
      ...(county ? { countyCode: county } : {}),
    },
    orderBy: { name: "asc" },
    take: 500,
  });
  return NextResponse.json({ success: true, towns });
}

/** Staff: create a town. */
export async function POST(request: Request) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const body = await request.json();
    const countryCode = String(body.countryCode || "").toUpperCase().trim();
    const countyCode = String(body.countyCode || "").trim();
    const code = String(body.code || "").trim();
    const name = String(body.name || "").trim();
    if (!countryCode || !countyCode || !code || !name) {
      return NextResponse.json(
        { error: "countryCode, countyCode, code and name are required." },
        { status: 400 }
      );
    }
    const county = await prisma.countyOrProvince.findUnique({
      where: { countryCode_code: { countryCode, code: countyCode } },
    });
    if (!county) {
      return NextResponse.json({ error: "County/province not found." }, { status: 404 });
    }
    const town = await runWithAuditContext({ actorId: gate.user.id }, async () =>
      prisma.town.create({ data: { countryCode, countyCode, code, name } })
    );
    return NextResponse.json({ success: true, town }, { status: 201 });
  } catch (error: any) {
    if (String(error?.code) === "P2002") {
      return NextResponse.json(
        { error: "That town code already exists in this county/province." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Could not create town." }, { status: 500 });
  }
}
