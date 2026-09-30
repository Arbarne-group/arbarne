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

/** Staff: rename a sub-county. */
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
    const subCounty = await runWithAuditContext({ actorId: gate.user.id }, async () =>
      prisma.subCounty.update({
        where: { countryCode_countyCode_code: await key(params) },
        data: { name },
      })
    );
    return NextResponse.json({ success: true, subCounty });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "Sub-county not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not update sub-county." }, { status: 500 });
  }
}

/** Staff: delete a sub-county. */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ country: string; county: string; code: string }> }
) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    await runWithAuditContext({ actorId: gate.user.id }, async () =>
      prisma.subCounty.delete({ where: { countryCode_countyCode_code: await key(params) } })
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "Sub-county not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not delete sub-county." }, { status: 500 });
  }
}
