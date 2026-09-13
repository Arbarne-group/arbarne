import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import {
  getPlanById,
  disablePaystackSubscription,
  generatePaystackManageLink,
} from "@/lib/paystack";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const user = await getOrCreateCurrentUser(email || undefined);
    if (!user) {
      return NextResponse.json({ error: "User unauthenticated" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const plan = subscription ? getPlanById(subscription.planId) : null;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        farmName: user.farmName,
        futureFarmId: user.futureFarmId,
      },
      subscription: subscription
        ? {
            ...subscription,
            planName: plan?.name || "Active Assessment",
            planFeatures: plan?.features || [],
            formattedAmount: `KES ${subscription.amount.toLocaleString()}`,
          }
        : null,
      orders: orders.map((o) => ({
        id: o.id,
        planType: o.planType,
        amount: o.amount,
        formattedAmount: `KES ${o.amount.toLocaleString()}`,
        currency: o.currency,
        status: o.status,
        paymentMethod: o.paymentMethod,
        phoneNumber: o.phoneNumber,
        mpesaReceiptNumber: o.mpesaReceiptNumber,
        date: o.createdAt,
        reference: o.paystackReference,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch subscription data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email } = body; // action: "cancel" | "manage_card" | "update_phone"

    const user = await getOrCreateCurrentUser(email || undefined);
    if (!user) {
      return NextResponse.json({ error: "User unauthenticated" }, { status: 401 });
    }

    if (action === "update_phone") {
      const { phone } = body;
      if (!phone) {
        return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
      }
      const cleanPhone = String(phone).trim();
      await prisma.user.update({
        where: { id: user.id },
        data: { phone: cleanPhone },
      });
      return NextResponse.json({
        success: true,
        message: "M-Pesa phone number updated successfully.",
        phone: cleanPhone,
      });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    if (action === "cancel") {
      if (subscription.subscriptionCode && subscription.emailToken) {
        await disablePaystackSubscription(
          subscription.subscriptionCode,
          subscription.emailToken
        );
      }

      const updated = await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json({
        success: true,
        message: "Subscription successfully cancelled.",
        subscription: updated,
      });
    }

    if (action === "manage_card") {
      if (subscription.subscriptionCode) {
        const link = await generatePaystackManageLink(subscription.subscriptionCode);
        return NextResponse.json({
          success: true,
          manageUrl: link,
        });
      }
      return NextResponse.json({
        success: true,
        manageUrl: null,
        message: "No card update link available for current payment profile.",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update subscription" },
      { status: 500 }
    );
  }
}
