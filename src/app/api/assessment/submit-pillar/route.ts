import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { ALL_PILLARS } from "@/data/allPillarsData";
import { computeAssessmentResults, getMaturityTier } from "@/lib/assessmentScoring";
import { syncUserAssessmentToSheet, syncReportGenerationToSheet } from "@/lib/googleSheets";

const QUESTION_MAP = new Map<string, {
  pillarId: number;
  capabilityId: string;
  capabilityName: string;
  question: string;
  recommendation: string;
  whyItMatters: string;
  quickWin: string;
  priority: string;
  supportAvailable: string;
}>();

ALL_PILLARS.forEach((p) => {
  p.capabilities.forEach((c) => {
    c.questions.forEach((q) => {
      QUESTION_MAP.set(q.id, {
        pillarId: p.id,
        capabilityId: c.id,
        capabilityName: c.name,
        question: q.question,
        recommendation: q.recommendation,
        whyItMatters: q.whyItMatters,
        quickWin: q.quickWin,
        priority: q.priority,
        supportAvailable: q.supportAvailable,
      });
    });
  });
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, pillarId, answers = {} } = body;

    const numPillarId = Number(pillarId);
    const pillarMeta = ALL_PILLARS.find((p) => p.id === numPillarId);

    if (!pillarMeta) {
      return NextResponse.json({ error: "Invalid pillar ID" }, { status: 400 });
    }

    // 1. Get or create authenticated user
    const user = await getOrCreateCurrentUser(email || undefined);

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated or not found." },
        { status: 401 }
      );
    }

    // 2. Get or create assessment
    let assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!assessment) {
      assessment = await prisma.assessment.create({
        data: {
          userId: user.id,
          overallScore: 0,
          maturityLevel: "Emerging",
          pillarScores: "[]",
          radarData: "[]",
          priorityAreas: "[]",
          status: "IN_PROGRESS",
        },
      });
    }

    // 2.5 Enforce 90-Day (3-Month) Reassessment Rule
    const COOLDOWN_DAYS = 90;
    const existingPillar = await prisma.pillarAssessment.findUnique({
      where: {
        assessmentId_pillarId: {
          assessmentId: assessment.id,
          pillarId: numPillarId,
        },
      },
    });

    if (existingPillar && existingPillar.isCompleted && existingPillar.completedAt) {
      const completedTime = new Date(existingPillar.completedAt).getTime();
      const nextEligibleTime = completedTime + COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
      const now = Date.now();

      if (now < nextEligibleTime && !body.forceReassess) {
        const daysRemaining = Math.ceil((nextEligibleTime - now) / (24 * 60 * 60 * 1000));
        const nextEligibleDate = new Date(nextEligibleTime);
        return NextResponse.json(
          {
            error: "REASSESSMENT_LOCKED",
            message: `Pillar ${numPillarId} assessment was already completed on ${new Date(existingPillar.completedAt).toLocaleDateString("en-GB")}. Reassessment is only permitted once every 90 days (3 months). Next reassessment eligible in ${daysRemaining} days (on ${nextEligibleDate.toLocaleDateString("en-GB")}).`,
            completedAt: existingPillar.completedAt,
            nextEligibleDate: nextEligibleDate.toISOString(),
            daysRemaining,
            cooldownDays: COOLDOWN_DAYS,
          },
          { status: 403 }
        );
      }
    }

    // 3. Upsert responses for all 25 questions of this pillar
    const pillarQuestions = pillarMeta.capabilities.flatMap((c) => c.questions);
    const responseUpsertPromises = pillarQuestions.map((q) => {
      const answer = (answers[q.id] as "yes" | "no") || "no";

      return prisma.assessmentResponse.upsert({
        where: {
          assessmentId_questionId: {
            assessmentId: assessment.id,
            questionId: q.id,
          },
        },
        create: {
          assessmentId: assessment.id,
          pillarId: numPillarId,
          capabilityId: q.capabilityId,
          capabilityName: q.capabilityName,
          questionId: q.id,
          questionText: q.question,
          answer,
          recommendation: q.recommendation,
          whyItMatters: q.whyItMatters,
          quickWin: q.quickWin,
          supportAvailable: q.supportAvailable,
          priority: q.priority,
        },
        update: {
          answer,
          recommendation: q.recommendation,
          whyItMatters: q.whyItMatters,
          quickWin: q.quickWin,
          supportAvailable: q.supportAvailable,
          priority: q.priority,
        },
      });
    });

    await Promise.all(responseUpsertPromises);

    // 4. Recalculate full scoring
    const allDbResponses = await prisma.assessmentResponse.findMany({
      where: { assessmentId: assessment.id },
    });

    const fullAnswerMap: Record<string, "yes" | "no"> = {};
    allDbResponses.forEach((r) => {
      fullAnswerMap[r.questionId] = r.answer as "yes" | "no";
    });
    Object.assign(fullAnswerMap, answers);

    const scoring = computeAssessmentResults(fullAnswerMap);
    const pScoreResult = scoring.pillarScores.find((p) => p.pillarId === numPillarId)!;
    const tier = getMaturityTier(pScoreResult.score);

    // 5. Update / finalize PillarAssessment
    const pillarRecord = await prisma.pillarAssessment.upsert({
      where: {
        assessmentId_pillarId: {
          assessmentId: assessment.id,
          pillarId: numPillarId,
        },
      },
      create: {
        assessmentId: assessment.id,
        pillarId: numPillarId,
        pillarName: pillarMeta.name,
        score: pScoreResult.score,
        yesCount: pScoreResult.yesCount,
        noCount: pScoreResult.noCount,
        totalQuestions: 25,
        maturityLevel: tier.label,
        capabilityScores: JSON.stringify(pScoreResult.capabilityScores),
        isCompleted: true,
        completedAt: new Date(),
      },
      update: {
        score: pScoreResult.score,
        yesCount: pScoreResult.yesCount,
        noCount: pScoreResult.noCount,
        maturityLevel: tier.label,
        capabilityScores: JSON.stringify(pScoreResult.capabilityScores),
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // 6. Update overall assessment
    const completedPillarsCount = await prisma.pillarAssessment.count({
      where: { assessmentId: assessment.id, isCompleted: true },
    });

    await prisma.assessment.update({
      where: { id: assessment.id },
      data: {
        overallScore: scoring.overallFfmiScore,
        maturityLevel: scoring.tier.label,
        pillarScores: JSON.stringify(scoring.pillarScores),
        status: completedPillarsCount === 8 ? "COMPLETED" : "IN_PROGRESS",
      },
    });

    // 7. Get gaps (questions answered "no")
    const gaps = await prisma.assessmentResponse.findMany({
      where: {
        assessmentId: assessment.id,
        pillarId: numPillarId,
        answer: "no",
      },
    });

    // 8. Asynchronously sync to Google Spreadsheet (Assessment Overview, Pillar Submissions Log, Detailed Question Responses, and Reports Generated)
    syncUserAssessmentToSheet(email, numPillarId).catch((err) => {
      console.warn("[GoogleSheets] Assessment sync warning:", err?.message || err);
    });

    syncReportGenerationToSheet(email, String(numPillarId)).catch((err) => {
      console.warn("[GoogleSheets] Pillar completion report sync warning:", err?.message || err);
    });

    return NextResponse.json({
      success: true,
      pillarId: numPillarId,
      pillarName: pillarMeta.name,
      score: pScoreResult.score,
      yesCount: pScoreResult.yesCount,
      noCount: pScoreResult.noCount,
      maturityLevel: tier.label,
      capabilityScores: pScoreResult.capabilityScores,
      recommendationsCount: gaps.length,
      isCompleted: true,
      completedAt: pillarRecord.completedAt,
    });
  } catch (error: any) {
    console.error("Error submitting pillar assessment:", error);
    return NextResponse.json(
      { error: "Failed to submit pillar assessment", details: error.message },
      { status: 500 }
    );
  }
}
