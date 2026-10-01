import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import assessmentData from "@/data/assessmentData.json";

export const dynamic = "force-dynamic";

export const FFV_STATUS = {
  NOT_SUBMITTED: "not_submitted",
  SUBMITTED: "submitted",
  VERIFIED: "verified",
  NEEDS_REVIEW: "needs_review",
} as const;

/**
 * FFV roll-up for the latest assessment.
 * Every YES answer needs verification media; the badge counts what still
 * needs the farmer's attention (nothing uploaded, or sent back for review).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = await getOrCreateCurrentUser(
      searchParams.get("email") || undefined
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }
    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    if (!assessment) {
      return NextResponse.json({
        success: true,
        hasAssessment: false,
        requiredTotal: 0,
        byStatus: {},
        attentionCount: 0,
      });
    }
    const [responses, evidences] = await Promise.all([
      prisma.assessmentResponse.findMany({
        where: { assessmentId: assessment.id },
        select: { questionId: true, answer: true },
      }),
      prisma.ffvEvidence.findMany({
        where: { assessmentId: assessment.id },
        select: { questionId: true, status: true },
      }),
    ]);
    const yesIds = responses
      .filter((r) => String(r.answer).toLowerCase() === "yes")
      .map((r) => r.questionId)
      // Only questions flagged as needing verification count. Awareness
      // questions are verified by interview during the FFV session.
      .filter((qid) => {
        const q: any = (assessmentData.questions as any[]).find(
          (item) => item.id === qid
        );
        return q && q.requiresVerification !== false;
      });
    const statusByQuestion: Record<string, string> = {};
    for (const e of evidences) statusByQuestion[e.questionId] = e.status;
    const byStatus: Record<string, number> = {
      [FFV_STATUS.NOT_SUBMITTED]: 0,
      [FFV_STATUS.SUBMITTED]: 0,
      [FFV_STATUS.VERIFIED]: 0,
      [FFV_STATUS.NEEDS_REVIEW]: 0,
    };
    for (const qid of yesIds) {
      const st = (statusByQuestion[qid] || FFV_STATUS.NOT_SUBMITTED).toLowerCase();
      const key =
        st === "verified"
          ? FFV_STATUS.VERIFIED
          : st === "needs_review" || st === "need_review" || st === "needs review"
            ? FFV_STATUS.NEEDS_REVIEW
            : st === "submitted"
              ? FFV_STATUS.SUBMITTED
              : FFV_STATUS.NOT_SUBMITTED;
      byStatus[key] += 1;
    }
    return NextResponse.json({
      success: true,
      hasAssessment: true,
      requiredTotal: yesIds.length,
      byStatus,
      attentionCount:
        byStatus[FFV_STATUS.NOT_SUBMITTED] + byStatus[FFV_STATUS.NEEDS_REVIEW],
    });
  } catch (error: any) {
    console.error("Error building FFV summary:", error);
    return NextResponse.json(
      { error: "Could not load verification status." },
      { status: 500 }
    );
  }
}
