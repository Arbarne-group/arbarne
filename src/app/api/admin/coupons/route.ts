import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/access";

export const dynamic = "force-dynamic";

const TYPES = ["PERCENT", "FIXED", "FREE"];

/** Staff: list coupons with usage. */
export async function GET() {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { redemptions: true } } },
  });
  return NextResponse.json({ success: true, coupons });
}

/** Staff: create a coupon. */
export async function POST(request: Request) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const body = await request.json();
    const code = String(body.code || "").toUpperCase().trim();
    const type = String(body.type || "").toUpperCase().trim();
    const value = Number(body.value || 0);
    if (!code || !TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Code and valid type (PERCENT, FIXED, FREE) are required." },
        { status: 400 }
      );
    }
    if (type === "PERCENT" && (value <= 0 || value > 100)) {
      return NextResponse.json(
        { error: "Percent must be 1–100." },
        { status: 400 }
      );
    }
    if (type === "FIXED" && value <= 0) {
      return NextResponse.json(
        { error: "Fixed amount must be positive." },
        { status: 400 }
      );
    }
    let scope = "ALL";
    if (Array.isArray(body.scope) && body.scope.length > 0) {
      scope = JSON.stringify(body.scope.map(String));
    }
    const coupon = await prisma.coupon.create({
      data: {
        code,
        type,
        value: type === "FREE" ? 0 : value,
        maxUses: body.maxUses != null ? Number(body.maxUses) : null,
        active: body.active !== false,
        validFrom: body.validFrom ? new Date(body.validFrom) : null,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        scope,
      },
    });
    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error: any) {
    if (String(error?.code) === "P2002") {
      return NextResponse.json(
        { error: "That code already exists." },
        { status: 409 }
      );
    }
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: "Could not create coupon." },
      { status: 500 }
    );
  }
}
