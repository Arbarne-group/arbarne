import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    const user = await getOrCreateCurrentUser(emailParam || undefined);

    if (!user) {
      return NextResponse.json({
        success: true,
        answers: {},
        pillarStatus: {},
        assessment: null,
      });
    }

    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        pillarAssessments: true,
        assessmentResponses: true,
      },
    });

    if (!assessment) {
      return NextResponse.json({
        success: true,
        answers: {},
        pillarStatus: {},
        assessment: null,
      });
    }

    const answers: Record<string, "yes" | "no"> = {};
    assessment.assessmentResponses.forEach((r) => {
      answers[r.questionId] = r.answer as "yes" | "no";
    });

    const pillarStatus: Record<number, {
      score: number;
      isCompleted: boolean;
      yesCount: number;
      noCount: number;
      maturityLevel: string;
      capabilityScores: any;
      completedAt: Date | null;
      canReassess: boolean;
      nextEligibleDate: string | null;
      daysRemaining: number;
    }> = {};

    const COOLDOWN_DAYS = 90;
    const now = Date.now();

    assessment.pillarAssessments.forEach((pa) => {
      let parsedCapScores = {};
      try {
        parsedCapScores = JSON.parse(pa.capabilityScores);
      } catch (e) {
        parsedCapScores = {};
      }

      let canReassess = true;
      let nextEligibleDate: string | null = null;
      let daysRemaining = 0;

      if (pa.isCompleted && pa.completedAt) {
        const completedTime = new Date(pa.completedAt).getTime();
        const eligibleTime = completedTime + COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
        canReassess = now >= eligibleTime;
        nextEligibleDate = new Date(eligibleTime).toISOString();
        daysRemaining = canReassess ? 0 : Math.ceil((eligibleTime - now) / (24 * 60 * 60 * 1000));
      }

      pillarStatus[pa.pillarId] = {
        score: pa.score,
        isCompleted: pa.isCompleted,
        yesCount: pa.yesCount,
        noCount: pa.noCount,
        maturityLevel: pa.maturityLevel,
        capabilityScores: parsedCapScores,
        completedAt: pa.completedAt,
        canReassess,
        nextEligibleDate,
        daysRemaining,
      };
    });

    // Overall assessment 90-day cooldown
    const completedPillars = assessment.pillarAssessments.filter((pa) => pa.isCompleted);
    const isFullAssessmentComplete = completedPillars.length === 8 || assessment.status === "COMPLETED";

    let canReassessFull = true;
    let nextEligibleDateFull: string | null = null;
    let daysRemainingFull = 0;

    if (isFullAssessmentComplete) {
      const latestTime = Math.max(
        ...completedPillars.map((p) => (p.completedAt ? new Date(p.completedAt).getTime() : 0)),
        new Date(assessment.updatedAt).getTime()
      );
      const eligibleFullTime = latestTime + COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
      canReassessFull = now >= eligibleFullTime;
      nextEligibleDateFull = new Date(eligibleFullTime).toISOString();
      daysRemainingFull = canReassessFull ? 0 : Math.ceil((eligibleFullTime - now) / (24 * 60 * 60 * 1000));
    }

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
      overallScore: assessment.overallScore,
      maturityLevel: assessment.maturityLevel,
      status: assessment.status,
      answers,
      pillarStatus,
      isFullAssessmentComplete,
      canReassessFull,
      nextEligibleDateFull,
      daysRemainingFull,
      cooldownDays: COOLDOWN_DAYS,
      totalResponsesCount: assessment.assessmentResponses.length,
    });
  } catch (error: any) {
    console.error("Error fetching assessment responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessment responses", details: error.message },
      { status: 500 }
    );
  }
}
