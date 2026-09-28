import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/access";
import { runWithAuditContext } from "@/lib/audit";

/** Staff: update a country. */
export async function PUT(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const { code } = await params;
    const body = await request.json();
    const data: Record<string, string> = {};
    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.dialCode !== undefined) data.dialCode = String(body.dialCode).trim();
    if (body.flagEmoji !== undefined) data.flagEmoji = String(body.flagEmoji).trim() || "";
    if (data.dialCode && !/^\+\d{1,4}$/.test(data.dialCode)) {
      return NextResponse.json({ error: "Dial code must look like +254." }, { status: 400 });
    }
    const country = await runWithAuditContext({ actorId: gate.user.id }, async () =>
      prisma.country.update({ where: { initials: code.toUpperCase() }, data })
    );
    return NextResponse.json({ success: true, country });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "Country not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not update country." }, { status: 500 });
  }
}

/** Staff: delete a country (cascades to counties, towns). */
export async function DELETE(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const { code } = await params;
    await runWithAuditContext({ actorId: gate.user.id }, async () =>
      prisma.country.delete({ where: { initials: code.toUpperCase() } })
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "Country not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not delete country." }, { status: 500 });
  }
}
