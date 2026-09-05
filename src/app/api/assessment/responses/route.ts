import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "keziah@futurefarms.africa";

    const user = await prisma.user.findUnique({
      where: { email },
    });

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
    }> = {};

    assessment.pillarAssessments.forEach((pa) => {
      let parsedCapScores = {};
      try {
        parsedCapScores = JSON.parse(pa.capabilityScores);
      } catch (e) {
        parsedCapScores = {};
      }

      pillarStatus[pa.pillarId] = {
        score: pa.score,
        isCompleted: pa.isCompleted,
        yesCount: pa.yesCount,
        noCount: pa.noCount,
        maturityLevel: pa.maturityLevel,
        capabilityScores: parsedCapScores,
      };
    });

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
      overallScore: assessment.overallScore,
      maturityLevel: assessment.maturityLevel,
      status: assessment.status,
      answers,
      pillarStatus,
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
