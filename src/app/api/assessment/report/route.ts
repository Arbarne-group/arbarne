import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { ALL_PILLARS } from "@/data/allPillarsData";
import { PILLAR_BRANDS } from "@/data/brandColors";
import { getMaturityTier } from "@/lib/assessmentScoring";
import { syncReportGenerationToSheet } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");
    const pillarParam = searchParams.get("pillarId");

    const user = await getOrCreateCurrentUser(emailParam || undefined);

    if (!user) {
      return NextResponse.json({ error: "User not found or unauthenticated" }, { status: 401 });
    }

    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        pillarAssessments: {
          orderBy: { pillarId: "asc" },
        },
        assessmentResponses: {
          orderBy: [{ pillarId: "asc" }, { questionId: "asc" }],
        },
      },
    });

    if (!assessment || assessment.assessmentResponses.length === 0) {
      return NextResponse.json(
        { error: "No completed or in-progress assessment found for this user. Please complete an assessment before viewing the report." },
        { status: 404 }
      );
    }

    const farmMeta = {
      farmName: user.farmName || "Farm Name Not Specified",
      ownerName: user.name || "Farmer",
      email: user.email,
      officialEmail: "arbarnegroup@gmail.com",
      valueChain: user.farmerProfile?.valueChain || "Not specified",
      experienceYears: user.farmerProfile?.experienceYears || "Not specified",
      assessmentDate: assessment.createdAt.toISOString(),
      lastUpdated: assessment.updatedAt.toISOString(),
    };

    // Calculate completion status of all pillars
    const completedPillarsInfo = ALL_PILLARS.map((p) => {
      const pa = assessment.pillarAssessments.find((item) => item.pillarId === p.id);
      const pResponses = assessment.assessmentResponses.filter((r) => r.pillarId === p.id);
      const isCompleted = Boolean(pa?.isCompleted || pResponses.length >= 25);
      const yesCount = pResponses.filter((r) => r.answer === "yes").length;
      return {
        id: p.id,
        name: p.name,
        completed: isCompleted,
        answeredCount: pResponses.length,
        score: pa?.score ?? (pResponses.length > 0 ? Math.round((yesCount / 25) * 100) : 0),
      };
    });

    const completedPillars = completedPillarsInfo.filter((p) => p.completed);
    const completedPillarIds = completedPillars.map((p) => p.id);

    // -------------------------------------------------------------
    // Case 1: Single Pillar Report (pillarId: 1 - 8)
    // -------------------------------------------------------------
    if (pillarParam && pillarParam !== "all") {
      const pId = Number(pillarParam);
      const pillarMeta = ALL_PILLARS.find((p) => p.id === pId);
      const brand = PILLAR_BRANDS[pId];

      if (!pillarMeta) {
        return NextResponse.json(
          { error: "Invalid pillarId", completedPillars: completedPillarIds, completedPillarsInfo },
          { status: 400 }
        );
      }

      const pillarRecord = assessment.pillarAssessments.find((pa) => pa.pillarId === pId);
      const pillarResponses = assessment.assessmentResponses.filter((r) => r.pillarId === pId);
      const isPillarDone = Boolean(pillarRecord?.isCompleted || pillarResponses.length >= 25);

      if (!isPillarDone) {
        return NextResponse.json(
          {
            success: false,
            error: `Pillar ${pId} (${pillarMeta.name}) is incomplete (${pillarResponses.length}/25 questions answered). You must complete all questions for Pillar ${pId} before viewing or downloading its individual report.`,
            isLocked: true,
            pillarId: pId,
            pillarName: pillarMeta.name,
            answeredCount: pillarResponses.length,
            totalRequired: 25,
            completedPillars: completedPillarIds,
            completedPillarsInfo,
          },
          { status: 403 }
        );
      }

      let parsedCapScores: Record<string, any> = {};
      if (pillarRecord?.capabilityScores) {
        try {
          parsedCapScores = JSON.parse(pillarRecord.capabilityScores);
        } catch (e) {
          parsedCapScores = {};
        }
      }

      const yesResponses = pillarResponses.filter((r) => r.answer === "yes");
      const noResponses = pillarResponses.filter((r) => r.answer === "no");
      const score = pillarRecord ? pillarRecord.score : Math.round((yesResponses.length / 25) * 100);
      const tier = getMaturityTier(score);

      // Group recommendations by priority
      const quickWins = noResponses.filter((r) => r.priority?.includes("Quick Win"));
      const mediumTerm = noResponses.filter((r) => r.priority?.includes("Medium"));
      const strategic = noResponses.filter((r) => r.priority?.includes("Strategic"));

      const pillarReport = {
        reportType: "PILLAR_DIAGNOSTIC_REPORT",
        reportTitle: `Pillar 0${pId} Diagnostic & Action Report: ${pillarMeta.name}`,
        farm: farmMeta,
        pillar: {
          id: pId,
          name: pillarMeta.name,
          element: brand?.element || "FFF",
          score,
          verifiedCount: yesResponses.length,
          gapCount: noResponses.length,
          totalQuestions: pillarResponses.length || 25,
          maturityStage: tier.label,
          maturityDescription: tier.description,
          guidingQuestion: pillarMeta.guidingQuestion,
          isCompleted: true,
          capabilityScores: parsedCapScores,
        },
        capabilityBreakdown: pillarMeta.capabilities.map((c) => {
          const capScoreData = parsedCapScores[c.id] || {
            score: 0,
            yes: pillarResponses.filter((r) => r.capabilityId === c.id && r.answer === "yes").length,
            total: 5,
          };
          const capTier = getMaturityTier(capScoreData.score);
          return {
            id: c.id,
            name: c.name,
            focus: c.focus,
            score: capScoreData.score,
            verified: `${capScoreData.yes}/${capScoreData.total || 5}`,
            maturity: capTier.label,
          };
        }),
        identifiedGaps: {
          total: noResponses.length,
          quickWinsCount: quickWins.length,
          mediumTermCount: mediumTerm.length,
          strategicCount: strategic.length,
          items: noResponses.map((r) => ({
            questionId: r.questionId,
            question: r.questionText,
            recommendation: r.recommendation,
            whyItMatters: r.whyItMatters,
            quickWin: r.quickWin,
            priority: r.priority || "🟢 Quick Win",
            supportAvailable: r.supportAvailable,
          })),
        },
        allQuestionResponses: pillarResponses.map((r) => ({
          questionId: r.questionId,
          capabilityId: r.capabilityId,
          question: r.questionText,
          answer: r.answer,
        })),
      };

      // Synchronize single-pillar report generation to Google Sheets in background
      syncReportGenerationToSheet(user.email, String(pId)).catch((err) => {
        console.warn("[GoogleSheets] Single pillar report sync background error:", err?.message || err);
      });

      return NextResponse.json({
        success: true,
        report: pillarReport,
        completedPillars: completedPillarIds,
        completedPillarsInfo,
        totalCompletedPillars: completedPillars.length,
        isAllCompleted: completedPillars.length === 8,
      });
    }

    // -------------------------------------------------------------
    // Case 2: Overall Farm Transformation Report (Strictly requires all 8 pillars)
    // -------------------------------------------------------------
    if (completedPillars.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: `The comprehensive 8-pillar report requires completing all 8 framework pillars. You have currently completed ${completedPillars.length} of 8 pillars. You can download individual reports for any completed pillars below.`,
          isLocked: true,
          completedCount: completedPillars.length,
          totalRequired: 8,
          completedPillars: completedPillarIds,
          completedPillarsInfo,
        },
        { status: 403 }
      );
    }

    const allYes = assessment.assessmentResponses.filter((r) => r.answer === "yes");
    const allNo = assessment.assessmentResponses.filter((r) => r.answer === "no");

    const pillarSummaries = ALL_PILLARS.map((p) => {
      const pa = assessment.pillarAssessments.find((item) => item.pillarId === p.id);
      const pResponses = assessment.assessmentResponses.filter((r) => r.pillarId === p.id);
      const pYes = pResponses.filter((r) => r.answer === "yes").length;
      const pNo = pResponses.filter((r) => r.answer === "no").length;
      const isAssessed = pResponses.length > 0 || !!pa;
      const score = pa ? pa.score : pResponses.length > 0 ? Math.round((pYes / 25) * 100) : 0;
      const tier = isAssessed ? getMaturityTier(score) : { label: "Pending Assessment", stage: "pending", description: "Pillar not yet assessed by farmer." };
      const brand = PILLAR_BRANDS[p.id];

      return {
        pillarId: p.id,
        name: p.name,
        element: brand?.element || "FFF",
        score,
        verifiedCount: pYes,
        gapCount: pNo,
        totalQuestions: pResponses.length || 25,
        maturityStage: tier.label,
        isCompleted: true,
        isAssessed: true,
      };
    });

    const activeAssessedPillars = pillarSummaries;

    // Overall score is the average of all 8 pillars
    const computedOverallScore = Math.round(
      pillarSummaries.reduce((acc, p) => acc + p.score, 0) / 8
    );
    const overallTier = getMaturityTier(computedOverallScore);

    // Group cross-pillar gaps by priority
    const allGaps = allNo.map((r) => ({
      pillarId: r.pillarId,
      pillarName: ALL_PILLARS.find((p) => p.id === r.pillarId)?.name || `Pillar ${r.pillarId}`,
      capabilityId: r.capabilityId,
      questionId: r.questionId,
      question: r.questionText,
      recommendation: r.recommendation,
      whyItMatters: r.whyItMatters,
      quickWin: r.quickWin,
      priority: r.priority || "🟢 Quick Win",
      supportAvailable: r.supportAvailable,
    }));

    const quickWins = allGaps.filter((g) => g.priority.includes("Quick Win"));
    const mediumTerm = allGaps.filter((g) => g.priority.includes("Medium"));
    const strategic = allGaps.filter((g) => g.priority.includes("Strategic"));

    const overallReport = {
      reportType: "FULL_FARM_TRANSFORMATION_REPORT",
      reportTitle: "Future Farms Maturity Index (FFMI) Diagnostic & Strategic Roadmap",
      farm: farmMeta,
      executiveSummary: {
        overallFfmiScore: computedOverallScore,
        maturityTier: overallTier.label,
        maturityDescription: overallTier.description,
        totalAssessedPillars: 8,
        totalPillarsInFramework: 8,
        totalQuestions: 8 * 25,
        answeredCount: assessment.assessmentResponses.length,
        totalVerified: allYes.length,
        totalActionableGaps: allNo.length,
        assessmentStatus: assessment.status,
      },
      eightPillarScorecard: pillarSummaries,
      crossPillarPriorityActionPlan: {
        totalRecommendations: allGaps.length,
        quickWins: {
          count: quickWins.length,
          items: quickWins,
        },
        mediumTerm: {
          count: mediumTerm.length,
          items: mediumTerm,
        },
        strategic: {
          count: strategic.length,
          items: strategic,
        },
      },
    };

    // Synchronize comprehensive 8-pillar report generation to Google Sheets in background
    syncReportGenerationToSheet(user.email, "all").catch((err) => {
      console.warn("[GoogleSheets] Comprehensive report sync background error:", err?.message || err);
    });

    return NextResponse.json({
      success: true,
      report: overallReport,
      completedPillars: completedPillarIds,
      completedPillarsInfo,
      totalCompletedPillars: 8,
      isAllCompleted: true,
    });
  } catch (error: any) {
    console.error("Error generating assessment report:", error);
    return NextResponse.json(
      { error: "Failed to generate report", details: error.message },
      { status: 500 }
    );
  }
}
