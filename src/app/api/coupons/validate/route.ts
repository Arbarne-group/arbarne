import { NextResponse } from "next/server";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { getProduct } from "@/lib/billingProducts";

export const dynamic = "force-dynamic";

/** Preview a coupon against a product (also used by checkout UI). */
export async function POST(request: Request) {
  try {
    const { email, code, product, pillarId } = await request.json();
    const user = await getOrCreateCurrentUser(
      String(email || "").trim() || undefined
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }
    const prod = getProduct(String(product || ""));
    if (!prod) {
      return NextResponse.json({ error: "Unknown product." }, { status: 400 });
    }
    const { priceQuote } = await import("@/lib/pricing");
    const quote = await priceQuote(
      user.id,
      prod.id,
      pillarId != null ? Number(pillarId) : null,
      code
    );
    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Invalid coupon." },
      { status: 400 }
    );
  }
}
