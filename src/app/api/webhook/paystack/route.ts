import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystackWebhookSignature } from "@/lib/paystack";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Verify signature if Paystack secret key is configured
    const isValid = verifyPaystackWebhookSignature(rawBody, signature);
    const isConfigured = Boolean(process.env.PAYSTACK_SECRET_KEY);

    if (isConfigured && !isValid) {
      console.warn("[Paystack Webhook] Invalid signature rejected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const data = event.data;

    console.log(`[Paystack Webhook Received]: ${eventType}`);

    switch (eventType) {
      case "charge.success": {
        const reference = data.reference;
        if (reference) {
          await prisma.order.updateMany({
            where: { paystackReference: reference },
            data: {
              status: "COMPLETED",
              paystackTransactionId: String(data.id || ""),
              amount: (data.amount || 0) / 100,
              currency: data.currency || "KES",
              updatedAt: new Date(),
            },
          });
        }
        break;
      }

      case "subscription.create": {
        const subCode = data.subscription_code;
        const customerEmail = data.customer?.email;
        const planCode = data.plan?.plan_code;

        if (customerEmail) {
          const user = await prisma.user.findUnique({
            where: { email: customerEmail },
          });

          if (user) {
            const now = new Date();
            const nextPayment = data.next_payment_date ? new Date(data.next_payment_date) : null;

            await prisma.subscription.upsert({
              where: { subscriptionCode: subCode },
              create: {
                userId: user.id,
                planId: data.plan?.name?.includes("1")
                  ? "1_PILLAR"
                  : data.plan?.name?.includes("4")
                  ? "4_PILLARS"
                  : "FULL_ASSESSMENT",
                planCode,
                subscriptionCode: subCode,
                emailToken: data.email_token,
                customerCode: data.customer?.customer_code,
                status: "ACTIVE",
                amount: (data.amount || 100000) / 100,
                currency: "KES",
                interval: "monthly",
                currentPeriodStart: now,
                nextPaymentDate: nextPayment,
                authorizationCode: data.authorization?.authorization_code,
                cardLast4: data.authorization?.last4,
                cardBrand: data.authorization?.brand,
                cardExpMonth: data.authorization?.exp_month,
                cardExpYear: data.authorization?.exp_year,
              },
              update: {
                status: "ACTIVE",
                emailToken: data.email_token,
                nextPaymentDate: nextPayment,
                authorizationCode: data.authorization?.authorization_code,
                cardLast4: data.authorization?.last4,
                cardBrand: data.authorization?.brand,
              },
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const subCode = data.subscription?.subscription_code;
        if (subCode) {
          await prisma.subscription.updateMany({
            where: { subscriptionCode: subCode },
            data: { status: "PAYMENT_FAILED" },
          });
        }
        break;
      }

      case "subscription.disable": {
        const subCode = data.subscription_code;
        if (subCode) {
          await prisma.subscription.updateMany({
            where: { subscriptionCode: subCode },
            data: { status: "CANCELLED" },
          });
        }
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[Paystack Webhook Handler Error]:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
