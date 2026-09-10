import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import {
  getPlanById,
  createOrSyncPaystackPlan,
  initializePaystackTransaction,
} from "@/lib/paystack";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      planId = "FULL_ASSESSMENT",
      isSubscription = true,
      channels,
      callbackUrl,
    } = body;

    const user = await getOrCreateCurrentUser(email || undefined);
    if (!user) {
      return NextResponse.json(
        { error: "User not found or unauthenticated" },
        { status: 401 }
      );
    }

    const plan = getPlanById(planId);

    // Ensure plan is registered on Paystack if subscribing
    let planCode: string | undefined = undefined;
    if (isSubscription) {
      const sync = await createOrSyncPaystackPlan(plan);
      planCode = sync.planCode;
    }

    // Determine return URL
    const origin =
      callbackUrl ||
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const finalCallbackUrl = `${origin}/checkout/verify`;

    // Initialize Paystack transaction
    const paystackRes = await initializePaystackTransaction({
      email: user.email,
      amount: plan.amount,
      planId: plan.id,
      planCode,
      callbackUrl: finalCallbackUrl,
      channels: channels || ["card", "mobile_money"],
      metadata: {
        userId: user.id,
        futureFarmId: user.futureFarmId,
        planId: plan.id,
        isSubscription,
      },
    });

    // Create a pending Order record in DB
    await prisma.order.create({
      data: {
        userId: user.id,
        planType: plan.id,
        amount: plan.amount,
        currency: "KES",
        paymentMethod: isSubscription ? "PAYSTACK_SUBSCRIPTION" : "PAYSTACK_ONEOFF",
        status: "PENDING",
        paystackReference: paystackRes.reference,
        planCode: planCode || null,
      },
    });

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackRes.authorizationUrl,
      accessCode: paystackRes.accessCode,
      reference: paystackRes.reference,
      plan: {
        id: plan.id,
        name: plan.name,
        amount: plan.amount,
        currency: plan.currency,
        planCode,
      },
      isSimulated: Boolean(paystackRes.isSimulated),
    });
  } catch (error: any) {
    console.error("[Billing Initialize Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize payment." },
      { status: 500 }
    );
  }
}
