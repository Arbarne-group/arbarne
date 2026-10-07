import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/access";

export const dynamic = "force-dynamic";

/** Staff: toggle active / update / delete a coupon. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const { id } = await params;
    const body = await request.json();
    const data: any = {};
    if (typeof body.active === "boolean") data.active = body.active;
    if (body.maxUses !== undefined)
      data.maxUses = body.maxUses == null ? null : Number(body.maxUses);
    if (body.validUntil !== undefined)
      data.validUntil = body.validUntil ? new Date(body.validUntil) : null;
    const coupon = await prisma.coupon.update({ where: { id }, data });
    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
    }
    console.error("Error updating coupon:", error);
    return NextResponse.json({ error: "Could not update coupon." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const { id } = await params;
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
    }
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ error: "Could not delete coupon." }, { status: 500 });
  }
}
