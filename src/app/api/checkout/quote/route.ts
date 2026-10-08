import { NextResponse } from "next/server";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { priceQuote } from "@/lib/pricing";

export const dynamic = "force-dynamic";

/** Public price preview (never trusted for charging — checkout recomputes). */
export async function POST(request: Request) {
  try {
    const { email, product, pillarId, couponCode } = await request.json();
    const user = await getOrCreateCurrentUser(
      String(email || "").trim() || undefined
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }
    const quote = await priceQuote(
      user.id,
      String(product || ""),
      pillarId != null ? Number(pillarId) : null,
      couponCode
    );
    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Could not price this product." },
      { status: 400 }
    );
  }
}
