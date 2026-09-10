import { NextResponse } from "next/server";
import { PAYSTACK_PLANS, createOrSyncPaystackPlan, getPaystackConfig } from "@/lib/paystack";

export async function GET() {
  try {
    const config = getPaystackConfig();
    const plansList = Object.values(PAYSTACK_PLANS).map((p) => ({
      ...p,
      formattedPrice: `KES ${p.amount.toLocaleString()}`,
    }));

    return NextResponse.json({
      success: true,
      currency: "KES",
      paystackPublicKey: config.publicKey,
      isPaystackConfigured: config.isConfigured,
      plans: plansList,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const results: Record<string, any> = {};

    for (const plan of Object.values(PAYSTACK_PLANS)) {
      const syncResult = await createOrSyncPaystackPlan(plan);
      results[plan.id] = syncResult;
    }

    return NextResponse.json({
      success: true,
      message: "Plans successfully synchronized with Paystack",
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync plans with Paystack" },
      { status: 500 }
    );
  }
}
