import { prisma } from "@/lib/prisma";
import {
  getProduct,
  PILLAR_REWARD_PRICE,
  REFERRAL_CREDIT_PER_QUALIFIED,
  MAX_REFERRAL_DISCOUNT_PER_ORDER,
} from "@/lib/billingProducts";

export interface CouponCheck {
  ok: boolean;
  coupon?: { id: string; code: string; type: string; value: number };
  discount?: number;
  error?: string;
}

/** Qualified referrals: invited farmers with ≥1 completed pillar. */
export async function qualifiedReferralCount(userId: string): Promise<number> {
  return prisma.referral.count({
    where: { referrerId: userId, status: "qualified" },
  });
}

/**
 * Consumable referral credit ledger (all KES):
 * - earned   = qualified referrals × 500
 * - consumed = referral discounts on COMPLETED pillar orders only
 * - available = earned − consumed (never negative)
 */
export async function referralCreditEarned(userId: string): Promise<number> {
  return (
    (await qualifiedReferralCount(userId)) * REFERRAL_CREDIT_PER_QUALIFIED
  );
}

export async function referralCreditConsumed(userId: string): Promise<number> {
  const orders = await prisma.order.findMany({
    where: {
      userId,
      status: "COMPLETED",
      planType: { in: ["PILLAR_REASSESS", "PILLAR_REPORT"] },
    },
    select: { referralDiscount: true },
  });
  return orders.reduce((sum, o) => sum + Math.max(0, o.referralDiscount || 0), 0);
}

export async function referralCreditAvailable(userId: string): Promise<number> {
  const [earned, consumed] = await Promise.all([
    referralCreditEarned(userId),
    referralCreditConsumed(userId),
  ]);
  return Math.max(0, earned - consumed);
}

function scopeCovers(scope: string, productId: string): boolean {
  if (scope === "ALL") return true;
  try {
    const list = JSON.parse(scope);
    return Array.isArray(list) && list.includes(productId);
  } catch {
    return false;
  }
}

/** Validate a coupon for a user + product. No side effects. */
export async function validateCoupon(
  code: string,
  userId: string,
  productId: string
): Promise<CouponCheck> {
  const normalized = String(code || "").toUpperCase().trim();
  if (!normalized) return { ok: false, error: "Enter a coupon code." };
  const coupon = await prisma.coupon.findUnique({
    where: { code: normalized },
  });
  if (!coupon || !coupon.active) {
    return { ok: false, error: "Coupon not found or inactive." };
  }
  const now = new Date();
  if (coupon.validFrom && coupon.validFrom > now) {
    return { ok: false, error: "Coupon is not active yet." };
  }
  if (coupon.validUntil && coupon.validUntil < now) {
    return { ok: false, error: "Coupon has expired." };
  }
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return { ok: false, error: "Coupon usage limit reached." };
  }
  if (!scopeCovers(coupon.scope, productId)) {
    return { ok: false, error: "Coupon does not apply to this product." };
  }
  const redeemed = await prisma.couponRedemption.findUnique({
    where: { couponId_userId: { couponId: coupon.id, userId } },
  });
  if (redeemed) {
    return { ok: false, error: "You have already used this coupon." };
  }
  return {
    ok: true,
    coupon: { id: coupon.id, code: coupon.code, type: coupon.type, value: coupon.value },
  };
}

export interface Quote {
  productId: string;
  pillarId: number | null;
  base: number;
  referralPrice: number;
  referralDiscount: number;
  referralsConsumed: number;
  referralCredit: number;
  couponCode: string | null;
  couponDiscount: number;
  final: number;
  free: boolean;
  rewardApplied: boolean;
}

/** Server-side price computation. Never trust client amounts. */
export async function priceQuote(
  userId: string,
  productId: string,
  pillarId: number | null,
  couponCode?: string | null
): Promise<Quote> {
  const product = getProduct(productId);
  if (!product) throw new Error("Unknown product.");
  if (product.pillarScoped && (!pillarId || pillarId < 1 || pillarId > 8)) {
    throw new Error("A pillar is required for this product.");
  }
  // Referral credit: at most 2 referrals' worth per order, never below
  // the KES 500 floor. Credit is only consumed when the order completes.
  let referralDiscount = 0;
  let referralCredit = 0;
  if (product.id.startsWith("PILLAR_")) {
    referralCredit = await referralCreditAvailable(userId);
    referralDiscount = Math.min(
      referralCredit,
      MAX_REFERRAL_DISCOUNT_PER_ORDER,
      Math.max(0, product.amount - PILLAR_REWARD_PRICE)
    );
  }
  const referralPrice = product.amount - referralDiscount;

  let couponDiscount = 0;
  let appliedCode: string | null = null;
  if (couponCode) {
    const check = await validateCoupon(couponCode, userId, productId);
    if (!check.ok) throw new Error(check.error || "Invalid coupon.");
    appliedCode = check.coupon!.code;
    if (check.coupon!.type === "FREE") {
      couponDiscount = referralPrice;
    } else if (check.coupon!.type === "PERCENT") {
      couponDiscount = Math.round(
        (referralPrice * Math.min(Math.max(check.coupon!.value, 0), 100)) / 100
      );
    } else {
      couponDiscount = Math.min(Math.max(check.coupon!.value, 0), referralPrice);
    }
  }
  const final = Math.max(0, referralPrice - couponDiscount);
  return {
    productId,
    pillarId,
    base: product.amount,
    referralPrice,
    referralDiscount,
    referralsConsumed:
      Math.round(referralDiscount / REFERRAL_CREDIT_PER_QUALIFIED),
    referralCredit,
    couponCode: appliedCode,
    couponDiscount,
    final,
    free: final === 0,
    rewardApplied: referralDiscount > 0,
  };
}

/**
 * KES actually saved through referral credit on COMPLETED pillar orders.
 * Only consumed discounts count — never projected or pending credit.
 */
export async function referralSavings(userId: string): Promise<number> {
  return referralCreditConsumed(userId);
}

/**
 * Clamp a completed order's referral discount to the credit actually
 * available (excluding the order itself) and persist it. Call AFTER the
 * order flips to COMPLETED. Safe to call from both verify and webhook:
 * it only ever writes the clamped value, never increments.
 */
export async function finalizeReferralDiscount(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== "COMPLETED" || !order.referralDiscount) return;
  const [earned, consumedOthers] = await Promise.all([
    referralCreditEarned(order.userId),
    prisma.order
      .findMany({
        where: {
          userId: order.userId,
          status: "COMPLETED",
          id: { not: order.id },
          planType: { in: ["PILLAR_REASSESS", "PILLAR_REPORT"] },
        },
        select: { referralDiscount: true },
      })
      .then((rows) =>
        rows.reduce((sum, o) => sum + Math.max(0, o.referralDiscount || 0), 0)
      ),
  ]);
  const clamped = Math.min(
    order.referralDiscount,
    Math.max(0, earned - consumedOthers)
  );
  if (clamped !== order.referralDiscount) {
    await prisma.order.update({
      where: { id: order.id },
      data: { referralDiscount: clamped },
    });
  }
}

/**
 * Record a coupon redemption once its order completes. Idempotent —
 * safe to call from both the verify route and the webhook.
 */
export async function recordCouponRedemption(
  userId: string,
  couponCode: string | null | undefined,
  orderId?: string
): Promise<void> {
  if (!couponCode) return;
  const coupon = await prisma.coupon.findUnique({
    where: { code: couponCode },
  });
  if (!coupon) return;
  try {
    await prisma.couponRedemption.create({
      data: { couponId: coupon.id, userId, orderId: orderId || null },
    });
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: { increment: 1 } },
    });
  } catch (e: any) {
    // P2002 = already recorded; anything else is real.
    if (String(e?.code) !== "P2002") throw e;
  }
}
