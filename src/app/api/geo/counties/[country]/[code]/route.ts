import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/access";
import { runWithAuditContext } from "@/lib/audit";

function key(params: { country: string; code: string }) {
  return { countryCode: params.country.toUpperCase(), code: params.code };
}

/** Staff: rename a county/province. */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ country: string; code: string }> }
) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    const county = await runWithAuditContext({ actorId: gate.user.id }, async () =>
      prisma.countyOrProvince.update({ where: { countryCode_code: key(await params) }, data: { name } })
    );
    return NextResponse.json({ success: true, county });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "County/province not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not update county/province." }, { status: 500 });
  }
}

/** Staff: delete a county/province (cascades to towns). */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ country: string; code: string }> }
) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    await runWithAuditContext({ actorId: gate.user.id }, async () =>
      prisma.countyOrProvince.delete({ where: { countryCode_code: key(await params) } })
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "County/province not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not delete county/province." }, { status: 500 });
  }
}
