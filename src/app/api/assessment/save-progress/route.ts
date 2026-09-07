import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALL_PILLARS } from "@/data/allPillarsData";
import { computeAssessmentResults, getMaturityTier } from "@/lib/assessmentScoring";
import { syncUserAssessmentToSheet } from "@/lib/googleSheets";

// Map question ID to its canonical question metadata for fast lookup
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
    const { email = "keziah@futurefarms.africa", answers = {}, pillarId } = body;

    // 1. Get or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: "Keziah Mwangi",
          passwordHash: "demo_hash",
          farmName: "Green Horizon Agri-Farm",
        },
      });
    }

    // 2. Get or create active Assessment record
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

    // 3. Upsert individual AssessmentResponse records for provided answers
    const questionEntries = Object.entries(answers as Record<string, "yes" | "no">);
    
    // Filter by pillarId if provided, or process all provided answers
    const entriesToSave = pillarId
      ? questionEntries.filter(([qId]) => {
          const meta = QUESTION_MAP.get(qId);
          return meta && meta.pillarId === Number(pillarId);
        })
      : questionEntries;

    const responseUpsertPromises = entriesToSave.map(([qId, answer]) => {
      const meta = QUESTION_MAP.get(qId);
      if (!meta) return null;

      return prisma.assessmentResponse.upsert({
        where: {
          assessmentId_questionId: {
            assessmentId: assessment.id,
            questionId: qId,
          },
        },
        create: {
          assessmentId: assessment.id,
          pillarId: meta.pillarId,
          capabilityId: meta.capabilityId,
          capabilityName: meta.capabilityName,
          questionId: qId,
          questionText: meta.question,
          answer,
          recommendation: meta.recommendation,
          whyItMatters: meta.whyItMatters,
          quickWin: meta.quickWin,
          supportAvailable: meta.supportAvailable,
          priority: meta.priority,
        },
        update: {
          answer,
          recommendation: meta.recommendation,
          whyItMatters: meta.whyItMatters,
          quickWin: meta.quickWin,
          supportAvailable: meta.supportAvailable,
          priority: meta.priority,
        },
      });
    });

    await Promise.all(responseUpsertPromises.filter(Boolean));

    // 4. Fetch all current responses for this assessment to calculate accurate scores
    const allDbResponses = await prisma.assessmentResponse.findMany({
      where: { assessmentId: assessment.id },
    });

    const fullAnswerMap: Record<string, "yes" | "no"> = {};
    allDbResponses.forEach((r) => {
      fullAnswerMap[r.questionId] = r.answer as "yes" | "no";
    });

    // Also overlay any answers sent in payload
    Object.assign(fullAnswerMap, answers);

    const scoring = computeAssessmentResults(fullAnswerMap);

    // 5. Upsert PillarAssessment for affected pillars
    const pillarsToUpdate = pillarId ? [Number(pillarId)] : ALL_PILLARS.map((p) => p.id);

    const pillarUpserts = pillarsToUpdate.map((pId) => {
      const pScoreResult = scoring.pillarScores.find((p) => p.pillarId === pId);
      const pillarMeta = ALL_PILLARS.find((p) => p.id === pId);
      if (!pScoreResult || !pillarMeta) return null;

      const tier = getMaturityTier(pScoreResult.score);

      return prisma.pillarAssessment.upsert({
        where: {
          assessmentId_pillarId: {
            assessmentId: assessment.id,
            pillarId: pId,
          },
        },
        create: {
          assessmentId: assessment.id,
          pillarId: pId,
          pillarName: pillarMeta.name,
          score: pScoreResult.score,
          yesCount: pScoreResult.yesCount,
          noCount: pScoreResult.noCount,
          totalQuestions: pScoreResult.totalQuestions,
          maturityLevel: tier.label,
          capabilityScores: JSON.stringify(pScoreResult.capabilityScores),
          isCompleted: pScoreResult.answeredCount === pScoreResult.totalQuestions,
        },
        update: {
          score: pScoreResult.score,
          yesCount: pScoreResult.yesCount,
          noCount: pScoreResult.noCount,
          maturityLevel: tier.label,
          capabilityScores: JSON.stringify(pScoreResult.capabilityScores),
          isCompleted: pScoreResult.answeredCount === pScoreResult.totalQuestions,
        },
      });
    });

    await Promise.all(pillarUpserts.filter(Boolean));

    // 6. Update overall assessment scoring
    const radarData = scoring.pillarScores.map((p) => ({
      pillarId: p.pillarId,
      name: p.pillarName,
      score: p.score,
    }));

    await prisma.assessment.update({
      where: { id: assessment.id },
      data: {
        overallScore: scoring.overallFfmiScore,
        maturityLevel: scoring.tier.label,
        pillarScores: JSON.stringify(scoring.pillarScores),
        radarData: JSON.stringify(radarData),
        status: scoring.totalAnswered === 200 ? "COMPLETED" : "IN_PROGRESS",
      },
    });

    // 7. Asynchronously sync to Google Spreadsheet (1lia89URlWwsngU0E7Kd5zyQTzm-SBWlQj2Lsu08b1wg)
    syncUserAssessmentToSheet(email, pillarId ? Number(pillarId) : undefined).catch((err) => {
      console.warn("Google Sheets assessment sync warning:", err?.message || err);
    });

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
      savedResponsesCount: entriesToSave.length,
      overallScore: scoring.overallFfmiScore,
      maturityLevel: scoring.tier.label,
    });
  } catch (error: any) {
    console.error("Error saving assessment progress:", error);
    return NextResponse.json(
      { error: "Failed to save assessment progress", details: error.message },
      { status: 500 }
    );
  }
}
