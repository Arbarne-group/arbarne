import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { newReferralCode } from "@/lib/referralCode";
import {
  qualifiedReferralCount,
  referralSavings,
  referralCreditEarned,
  referralCreditAvailable,
} from "@/lib/pricing";
import {
  PILLAR_STANDARD_PRICE,
  PILLAR_REWARD_PRICE,
  REFERRAL_CREDIT_PER_QUALIFIED,
  MAX_REFERRAL_DISCOUNT_PER_ORDER,
} from "@/lib/billingProducts";
import { appBaseUrl } from "@/lib/mailer";

export const dynamic = "force-dynamic";

/** My referral code, link, stats, savings and history. ?email= */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let user = await getOrCreateCurrentUser(
      searchParams.get("email") || undefined
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }
    if (!user.referralCode) {
      let code = newReferralCode();
      for (let i = 0; i < 5; i++) {
        const clash = await prisma.user.findUnique({
          where: { referralCode: code },
        });
        if (!clash) break;
        code = newReferralCode();
      }
      user = await prisma.user.update({
        where: { id: user.id },
        data: { referralCode: code },
      });
    }
    const [qualified, total, savings, visits, earned, available, invitedBy] =
      await Promise.all([
        qualifiedReferralCount(user.id),
        prisma.referral.count({ where: { referrerId: user.id } }),
        referralSavings(user.id),
        prisma.referralClick.count({ where: { referrerId: user.id } }),
        referralCreditEarned(user.id),
        referralCreditAvailable(user.id),
        prisma.referral.findUnique({
          where: { referredId: user.id },
          select: {
            status: true,
            createdAt: true,
            referrer: { select: { name: true } },
          },
        }),
      ]);
    const history = await prisma.referral.findMany({
      where: { referrerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        referred: { select: { email: true, name: true, createdAt: true } },
      },
    });
    return NextResponse.json({
      success: true,
      code: user.referralCode,
      shareLink: `${appBaseUrl()}/r/${user.referralCode}`,
      stats: {
        visits,
        referred: total,
        qualified,
        creditEarned: earned,
        creditAvailable: available,
        saved: savings,
        standardPrice: PILLAR_STANDARD_PRICE,
        rewardPrice: PILLAR_REWARD_PRICE,
        creditPerReferral: REFERRAL_CREDIT_PER_QUALIFIED,
        maxDiscountPerOrder: MAX_REFERRAL_DISCOUNT_PER_ORDER,
      },
      invitedBy: invitedBy
        ? {
            name: invitedBy.referrer?.name || null,
            status: invitedBy.status,
            linkedAt: invitedBy.createdAt,
          }
        : null,
      history: history.map((r) => ({
        email: r.referred.email.replace(/(^.).*(@.*$)/, "$1•••$2"),
        name: r.referred.name,
        status: r.status,
        createdAt: r.createdAt,
        qualifiedAt: r.qualifiedAt,
      })),
    });
  } catch (error: any) {
    console.error("Error loading referrals:", error);
    return NextResponse.json(
      { error: "Could not load referrals." },
      { status: 500 }
    );
  }
}
