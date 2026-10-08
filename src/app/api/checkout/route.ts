import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { getProduct } from "@/lib/billingProducts";
import { priceQuote, recordCouponRedemption, finalizeReferralDiscount } from "@/lib/pricing";
import {
  initializePaystackTransaction,
  getPaystackConfig,
} from "@/lib/paystack";

export const dynamic = "force-dynamic";

/**
 * New-model checkout. Price is ALWAYS computed server-side:
 * base → referral reward → coupon → final. Zero-final orders complete
 * immediately (grant minted); otherwise a PENDING order is created and a
 * Paystack transaction initialized (verify/webhook flips it to COMPLETED).
 *
 * Body: { email, product, pillarId?, couponCode?, paymentMethod, phoneNumber }
 */
export async function POST(request: Request) {
  try {
    const {
      email,
      product: productId,
      pillarId,
      couponCode,
      paymentMethod = "MPESA",
      phoneNumber,
    } = await request.json();

    const user = await getOrCreateCurrentUser(
      String(email || "").trim() || undefined
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    const product = getProduct(String(productId || ""));
    if (!product) {
      return NextResponse.json({ error: "Unknown product." }, { status: 400 });
    }
    const pillar =
      product.pillarScoped && pillarId != null ? Number(pillarId) : null;
    if (product.pillarScoped && (!pillar || pillar < 1 || pillar > 8)) {
      return NextResponse.json(
        { error: "A pillar (1–8) is required for this product." },
        { status: 400 }
      );
    }

    const quote = await priceQuote(user.id, product.id, pillar, couponCode);

    if (phoneNumber && !user.phone) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { phone: String(phoneNumber).trim() },
        });
      } catch {}
    }

    // Free (first assessment, 100% coupon, reward-covered): complete at once.
    if (quote.free) {
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          planType: product.id,
          amount: 0,
          currency: "KES",
          paymentMethod: quote.couponCode ? "COUPON" : "FREE",
          phoneNumber: phoneNumber || (user as any).phone || null,
          status: "COMPLETED",
          pillarId: pillar,
          couponCode: quote.couponCode,
          referralDiscount: quote.referralDiscount,
        },
      });
      await recordCouponRedemption(user.id, quote.couponCode, order.id);
      await finalizeReferralDiscount(order.id);
      return NextResponse.json({
        success: true,
        free: true,
        orderId: order.id,
        product: product.id,
        pillarId: pillar,
        message:
          quote.couponCode
            ? "Coupon applied — no payment needed."
            : "No payment needed.",
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        planType: product.id,
        amount: quote.final,
        currency: "KES",
        paymentMethod: String(paymentMethod || "MPESA")
          .toUpperCase()
          .includes("MPESA")
          ? "MPESA"
          : String(paymentMethod || "CARD").toUpperCase(),
        phoneNumber: phoneNumber || (user as any).phone || null,
        status: "PENDING",
        pillarId: pillar,
        couponCode: quote.couponCode,
        referralDiscount: quote.referralDiscount,
      },
    });

    const config = getPaystackConfig();
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const paystackRes = await initializePaystackTransaction({
      email: user.email,
      amount: quote.final,
      planId: product.id,
      callbackUrl: `${origin}/checkout/verify`,
      channels: ["mobile_money", "card"],
      metadata: {
        userId: user.id,
        orderId: order.id,
        product: product.id,
        pillarId: pillar,
        couponCode: quote.couponCode,
        phone: phoneNumber || (user as any).phone || undefined,
      },
    });

    if (paystackRes.reference) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paystackReference: paystackRes.reference },
      });
    }

    return NextResponse.json({
      success: true,
      free: false,
      orderId: order.id,
      quote: {
        base: quote.base,
        referralPrice: quote.referralPrice,
        referralDiscount: quote.referralDiscount,
        referralsConsumed: quote.referralsConsumed,
        referralCredit: quote.referralCredit,
        couponDiscount: quote.couponDiscount,
        final: quote.final,
        rewardApplied: quote.rewardApplied,
      },
      authorizationUrl: (paystackRes as any).authorizationUrl,
      accessCode: (paystackRes as any).accessCode,
      reference: paystackRes.reference,
      paystackPublicKey: config.publicKey,
      isSimulated: Boolean((paystackRes as any).isSimulated),
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "Checkout failed." },
      { status: 400 }
    );
  }
}
