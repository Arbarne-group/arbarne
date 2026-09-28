import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/access";
import { runWithAuditContext } from "@/lib/audit";

async function key(params: Promise<{ country: string; county: string; code: string }>) {
  const p = await params;
  return {
    countryCode: p.country.toUpperCase(),
    countyCode: p.county,
    code: p.code,
  };
}

/** Staff: rename a town. */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ country: string; county: string; code: string }> }
) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    const town = await runWithAuditContext({ actorId: gate.user.id }, async () =>
      prisma.town.update({
        where: { countryCode_countyCode_code: await key(params) },
        data: { name },
      })
    );
    return NextResponse.json({ success: true, town });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "Town not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not update town." }, { status: 500 });
  }
}

/** Staff: delete a town. */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ country: string; county: string; code: string }> }
) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    await runWithAuditContext({ actorId: gate.user.id }, async () =>
      prisma.town.delete({ where: { countryCode_countyCode_code: await key(params) } })
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "Town not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not delete town." }, { status: 500 });
  }
}
