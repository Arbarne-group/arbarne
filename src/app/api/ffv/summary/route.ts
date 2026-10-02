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
        pillars: [],
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
    const pillarOf = (qid: string): number => {
      const m = String(qid).match(/^P([1-8])\./i);
      return m ? Number(m[1]) : 0;
    };
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
      pillars: [1, 2, 3, 4, 5, 6, 7, 8].map((pillarId) => {
        const ids = yesIds.filter((qid) => pillarOf(qid) === pillarId);
        if (ids.length === 0) return { pillarId, status: "none", required: 0 };
        const states = ids.map((qid) => {
          const st = (statusByQuestion[qid] || FFV_STATUS.NOT_SUBMITTED).toLowerCase();
          if (st === "verified") return FFV_STATUS.VERIFIED;
          if (st === "needs_review" || st === "need_review" || st === "needs review")
            return FFV_STATUS.NEEDS_REVIEW;
          if (st === "submitted") return FFV_STATUS.SUBMITTED;
          return FFV_STATUS.NOT_SUBMITTED;
        });
        const status = states.includes(FFV_STATUS.NEEDS_REVIEW)
          ? FFV_STATUS.NEEDS_REVIEW
          : states.every((s) => s === FFV_STATUS.VERIFIED)
            ? FFV_STATUS.VERIFIED
            : states.some((s) => s !== FFV_STATUS.NOT_SUBMITTED)
              ? FFV_STATUS.SUBMITTED
              : FFV_STATUS.NOT_SUBMITTED;
        return { pillarId, status, required: ids.length };
      }),
    });
  } catch (error: any) {
    console.error("Error building FFV summary:", error);
    return NextResponse.json(
      { error: "Could not load verification status." },
      { status: 500 }
    );
  }
}
