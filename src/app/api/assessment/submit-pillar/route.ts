import { NextResponse } from "next/server";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { ALL_PILLARS } from "@/data/allPillarsData";
import { computeAssessmentResults } from "@/lib/assessmentScoring";
import { getPillarScoringTier } from "@/data/pillarScoringTiers";
import { triggerNeonRealtimeAssessmentSync, syncNeonAssessmentToSheetsFast } from "@/lib/neonRealtimeSync";

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

    // 2.5 Enforce 90-day rule + paid fast-track reassessment.
    // First submission: always free. Out-of-cooldown resubmission: free
    // (mandatory 90-day cycle). In-cooldown resubmission: needs an unused
    // PILLAR_REASSESS grant (or active annual pass) which is consumed below.
    const COOLDOWN_DAYS = 90;
    const existingPillar = await prisma.pillarAssessment.findUnique({
      where: {
        assessmentId_pillarId: {
          assessmentId: assessment.id,
          pillarId: numPillarId,
        },
      },
    });

    let submitGrantId: string | null = null;
    if (existingPillar && existingPillar.isCompleted) {
      const { checkSubmitEntitlement } = await import("@/lib/entitlements");
      const ent = await checkSubmitEntitlement(user.id, numPillarId);
      if (!ent.allowed) {
        const daysRemaining =
          existingPillar.completedAt != null
            ? Math.ceil(
                (new Date(existingPillar.completedAt).getTime() +
                  COOLDOWN_DAYS * 24 * 60 * 60 * 1000 -
                  Date.now()) /
                  (24 * 60 * 60 * 1000)
              )
            : COOLDOWN_DAYS;
        return NextResponse.json(
          {
            error: "REASSESSMENT_LOCKED",
            code: "PAYMENT_REQUIRED",
            message:
              ent.reason ||
              `Pillar ${numPillarId} was already completed. Reassessment is only permitted once every 90 days.`,
            completedAt: existingPillar.completedAt,
            nextEligibleDate: new Date(
              new Date(existingPillar.completedAt || Date.now()).getTime() +
                COOLDOWN_DAYS * 24 * 60 * 60 * 1000
            ).toISOString(),
            daysRemaining: Math.max(daysRemaining, 0),
            cooldownDays: COOLDOWN_DAYS,
            upgradeUrl: ent.upgradeUrl || `/checkout?product=PILLAR_REASSESS&pillar=${numPillarId}`,
          },
          { status: 402 }
        );
      }
      if (ent.mode === "grant" && (ent as any).grantId) {
        submitGrantId = (ent as any).grantId;
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
    // Pillar status comes from the per-pillar 0-25 scoring bands (scoring.json)
    const tier = { label: getPillarScoringTier(numPillarId, pScoreResult.yesCount).status };

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

    // 8. Ultra-fast non-blocking real-time sync to Google Sheets (Assessment Overview, Pillar Submissions Log, Detailed Question Responses, and Reports Generated)
    triggerNeonRealtimeAssessmentSync(email, numPillarId);
    after(async () => {
      try {
        await syncNeonAssessmentToSheetsFast(email, numPillarId);
      } catch (syncErr: any) {
        console.error("[SubmitPillar] Sheet sync error:", syncErr.message);
      }
    });

    // Consume a paid reassessment grant if one unlocked this submit, then
    // check whether this completion qualifies a pending referral.
    try {
      const { consumeGrantById, qualifyReferralFor } = await import(
        "@/lib/entitlements"
      );
      await consumeGrantById(submitGrantId);
      await qualifyReferralFor(user.id);
    } catch (e) {
      console.error("[SubmitPillar] grant/referral notice:", (e as any)?.message || e);
    }

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
