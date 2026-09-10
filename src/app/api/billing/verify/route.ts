import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystackTransaction, getPlanById } from "@/lib/paystack";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json({ error: "Transaction reference is required" }, { status: 400 });
    }

    // 1. Verify with Paystack
    const verification = await verifyPaystackTransaction(reference);

    if (!verification.success || verification.status !== "success") {
      return NextResponse.json(
        {
          error: "Payment verification failed or transaction not completed.",
          details: verification,
        },
        { status: 400 }
      );
    }

    // 2. Find matching order or create if missing
    let order = await prisma.order.findFirst({
      where: { paystackReference: reference },
      include: { user: true },
    });

    // If order was created without reference match, find by customer email
    if (!order && verification.customer?.email) {
      const user = await prisma.user.findUnique({
        where: { email: verification.customer.email },
      });
      if (user) {
        order = await prisma.order.create({
          data: {
            userId: user.id,
            planType: "FULL_ASSESSMENT",
            amount: verification.amount || 1000,
            currency: verification.currency || "KES",
            paymentMethod: "PAYSTACK",
            status: "COMPLETED",
            paystackReference: reference,
          },
          include: { user: true },
        });
      }
    }

    if (!order) {
      return NextResponse.json(
        { error: "No matching order found for this transaction." },
        { status: 404 }
      );
    }

    const userId = order.userId;
    const plan = getPlanById(order.planType);

    // 3. Update Order status
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "COMPLETED",
        amount: verification.amount || order.amount,
        currency: verification.currency || "KES",
        paystackTransactionId: verification.data?.id ? String(verification.data.id) : null,
        updatedAt: new Date(),
      },
    });

    // 4. Create or update Subscription record
    const now = new Date();
    const oneMonthAhead = new Date(now);
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);

    const subscriptionCode =
      verification.subscriptionCode ||
      `SUB_${order.id.slice(-6)}_${Date.now().toString().slice(-4)}`;

    const existingSub = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    let subscription;
    if (existingSub) {
      subscription = await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          planId: plan.id,
          planCode: order.planCode || existingSub.planCode,
          subscriptionCode: verification.subscriptionCode || existingSub.subscriptionCode,
          status: "ACTIVE",
          amount: plan.amount,
          currency: "KES",
          interval: plan.interval,
          currentPeriodStart: now,
          currentPeriodEnd: oneMonthAhead,
          nextPaymentDate: oneMonthAhead,
          authorizationCode: verification.authorization?.authorization_code || existingSub.authorizationCode,
          cardLast4: verification.authorization?.last4 || existingSub.cardLast4,
          cardBrand: verification.authorization?.brand || existingSub.cardBrand,
          cardExpMonth: verification.authorization?.exp_month || existingSub.cardExpMonth,
          cardExpYear: verification.authorization?.exp_year || existingSub.cardExpYear,
        },
      });
    } else {
      subscription = await prisma.subscription.create({
        data: {
          userId,
          planId: plan.id,
          planCode: order.planCode || plan.defaultPlanCode,
          subscriptionCode,
          customerCode: verification.customerCode || verification.customer?.customer_code,
          status: "ACTIVE",
          amount: plan.amount,
          currency: "KES",
          interval: plan.interval,
          currentPeriodStart: now,
          currentPeriodEnd: oneMonthAhead,
          nextPaymentDate: oneMonthAhead,
          authorizationCode: verification.authorization?.authorization_code,
          cardLast4: verification.authorization?.last4,
          cardBrand: verification.authorization?.brand,
          cardExpMonth: verification.authorization?.exp_month,
          cardExpYear: verification.authorization?.exp_year,
        },
      });
    }

    // Link Order to Subscription
    await prisma.order.update({
      where: { id: order.id },
      data: { subscriptionId: subscription.id },
    });

    // 5. Ensure baseline Assessment record exists for the user
    const existingAssessment = await prisma.assessment.findFirst({
      where: { userId },
    });

    if (!existingAssessment) {
      await prisma.assessment.create({
        data: {
          userId,
          overallScore: 82,
          maturityLevel: "Advancing",
          pillarScores: JSON.stringify({
            "Soil & Crop Health": 84,
            "Water & Irrigation": 78,
            "Tech & Mechanization": 72,
            "Business & Financials": 88,
            "Labor & Workforce": 80,
            "Climate Resilience": 75,
            "Market Access": 90,
            "Post-Harvest & Quality": 79,
          }),
          radarData: JSON.stringify({
            labels: [
              "Soil & Crops",
              "Water Mgmt",
              "Technology",
              "Business",
              "Labor & Team",
              "Resilience",
              "Market Access",
              "Post-Harvest",
            ],
            scores: [84, 78, 72, 88, 80, 75, 90, 79],
          }),
          priorityAreas: JSON.stringify([
            {
              pillar: "Technology & Mechanization",
              title: "Automated Drip Irrigation Scheduling",
              description:
                "Install soil moisture telemetry to reduce water usage by 28% and eliminate manual valve monitoring.",
            },
            {
              pillar: "Climate Resilience",
              title: "Solar-Powered Cold Storage",
              description:
                "Mitigate post-harvest heat degradation by introducing decentralized on-farm cooling lockers.",
            },
          ]),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and subscription activated successfully!",
      order: updatedOrder,
      subscription,
      plan,
    });
  } catch (error: any) {
    console.error("[Billing Verify Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify transaction." },
      { status: 500 }
    );
  }
}
