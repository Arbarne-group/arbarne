import { prisma } from "@/lib/prisma";

export interface Entitlement {
  allowed: boolean;
  mode?: "free-first" | "free-90day" | "grant" | "annual";
  reason?: string;
  upgradeUrl?: string;
}

function upgradeUrl(product: string, pillarId?: number | null): string {
  const q = new URLSearchParams({ product });
  if (pillarId) q.set("pillar", String(pillarId));
  return `/checkout?${q.toString()}`;
}

/** Latest assessment with pillar records for a user. */
async function latestAssessment(userId: string) {
  return prisma.assessment.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { pillarAssessments: true },
  });
}

/** An unused, completed grant order for a product (+pillar). */
async function findGrant(userId: string, planType: string, pillarId?: number | null) {
  return prisma.order.findFirst({
    where: {
      userId,
      planType,
      status: "COMPLETED",
      consumedAt: null,
      ...(pillarId ? { pillarId } : {}),
    },
    orderBy: { createdAt: "asc" },
  });
}

async function consumeGrant(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { consumedAt: new Date() },
  });
}

/** Consume a known grant id (no-op for null). Exported for route use. */
export async function consumeGrantById(orderId: string | null | undefined): Promise<void> {
  if (!orderId) return;
  await consumeGrant(orderId);
}

/** Active annual pass (1 year from purchase). */
async function activeAnnualPass(userId: string) {
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  return prisma.order.findFirst({
    where: {
      userId,
      planType: "ANNUAL_ASSESSMENT",
      status: "COMPLETED",
      createdAt: { gt: yearAgo },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * May this user submit this pillar?
 * - First submission: always free.
 * - In-cooldown resubmission: needs an unused PILLAR_REASSESS grant (paid
 *   fast-track) or an active annual pass; otherwise the 90-day lock stands.
 * - Out-of-cooldown resubmission: free (mandatory 90-day cycle).
 */
export async function checkSubmitEntitlement(
  userId: string,
  pillarId: number
): Promise<Entitlement & { grantId?: string | null; annual?: boolean }> {
  const assessment = await latestAssessment(userId);
  const existing = assessment?.pillarAssessments.find((p) => p.pillarId === pillarId);
  if (!existing?.isCompleted) {
    return { allowed: true, mode: "free-first" };
  }
  const COOLDOWN = 90 * 24 * 60 * 60 * 1000;
  const locked =
    existing.completedAt != null && Date.now() - new Date(existing.completedAt).getTime() < COOLDOWN;
  if (!locked) {
    return { allowed: true, mode: "free-90day" };
  }
  const [grant, annual] = await Promise.all([
    findGrant(userId, "PILLAR_REASSESS", pillarId),
    activeAnnualPass(userId),
  ]);
  if (grant) return { allowed: true, mode: "grant", grantId: grant.id };
  if (annual) return { allowed: true, mode: "annual" };
  const daysLeft = Math.ceil(
    (new Date(existing.completedAt!).getTime() + COOLDOWN - Date.now()) /
      (24 * 60 * 60 * 1000)
  );
  return {
    allowed: false,
    reason: `Pillar ${pillarId} is in its 90-day cooldown (${daysLeft} days left). Pay to reassess now, or wait for the free mandatory reassessment.`,
    upgradeUrl: upgradeUrl("PILLAR_REASSESS", pillarId),
  };
}

export async function consumeSubmitGrant(
  info: Awaited<ReturnType<typeof checkSubmitEntitlement>>
): Promise<void> {
  if (info.allowed && info.mode === "grant" && info.grantId) {
    await consumeGrant(info.grantId);
  }
}

/** Pillar report PDF: one unused PILLAR_REPORT grant per download. */
export async function checkReportEntitlement(
  userId: string,
  pillarId: number
): Promise<Entitlement & { grantId?: string | null; annual?: boolean }> {
  const [grant, annual] = await Promise.all([
    findGrant(userId, "PILLAR_REPORT", pillarId),
    activeAnnualPass(userId),
  ]);
  if (grant) return { allowed: true, mode: "grant", grantId: grant.id };
  if (annual) return { allowed: true, mode: "annual" };
  return {
    allowed: false,
    reason: `Pillar ${pillarId} report needs a report credit (KES 1,500, less any referral credit).`,
    upgradeUrl: upgradeUrl("PILLAR_REPORT", pillarId),
  };
}

export async function consumeReportGrant(
  info: Awaited<ReturnType<typeof checkReportEntitlement>>
): Promise<void> {
  if (info.allowed && info.mode === "grant" && info.grantId) {
    await consumeGrant(info.grantId);
  }
}

/**
 * FFV uploads for a pillar: free once any evidence already exists for the
 * pillar (grandfathered); otherwise needs an unused FFV_VERIFY grant,
 * consumed on the first upload.
 */
export async function checkFfvEntitlement(
  userId: string,
  pillarId: number,
  hasEvidence: boolean
): Promise<Entitlement & { grantId?: string | null }> {
  if (hasEvidence) return { allowed: true, mode: "grant" };
  const grant = await findGrant(userId, "FFV_VERIFY", pillarId);
  if (grant) return { allowed: true, mode: "grant", grantId: grant.id };
  return {
    allowed: false,
    reason: `Verification for pillar ${pillarId} needs an FFV credit (KES 2,500).`,
    upgradeUrl: upgradeUrl("FFV_VERIFY", pillarId),
  };
}

export async function consumeFfvGrant(
  info: Awaited<ReturnType<typeof checkFfvEntitlement>>
): Promise<void> {
  if (info.allowed && info.mode === "grant" && info.grantId) {
    await consumeGrant(info.grantId);
  }
}

/** Mark a pending referral qualified once the referred farmer's first pillar lands. */
export async function qualifyReferralFor(userId: string): Promise<void> {
  const pending = await prisma.referral.findUnique({
    where: { referredId: userId },
  });
  if (!pending || pending.status === "qualified") return;
  const done = await prisma.pillarAssessment.count({
    where: { assessment: { userId }, isCompleted: true },
  });
  if (done >= 1) {
    await prisma.referral.update({
      where: { id: pending.id },
      data: { status: "qualified", qualifiedAt: new Date() },
    });
  }
}
