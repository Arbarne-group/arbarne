import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALL_PILLARS } from "@/data/allPillarsData";
import { PILLAR_BRANDS } from "@/data/brandColors";
import { getMaturityTier } from "@/lib/assessmentScoring";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "keziah@futurefarms.africa";
    const pillarParam = searchParams.get("pillarId");

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        farmerProfile: true,
        farmManagement: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

    if (!assessment) {
      return NextResponse.json(
        { error: "No assessment found for this user" },
        { status: 404 }
      );
    }

    const farmMeta = {
      farmName: user.farmName || "Green Horizon Agri-Farm",
      ownerName: user.name || "Keziah Mwangi",
      email: user.email,
      valueChain: user.farmerProfile?.valueChain || "Horticulture & Crops",
      experienceYears: user.farmerProfile?.experienceYears || "3-5 years",
      assessmentDate: assessment.createdAt.toISOString(),
      lastUpdated: assessment.updatedAt.toISOString(),
    };

    // -------------------------------------------------------------
    // Case 1: Single Pillar Report (pillarId: 1 - 8)
    // -------------------------------------------------------------
    if (pillarParam && pillarParam !== "all") {
      const pId = Number(pillarParam);
      const pillarMeta = ALL_PILLARS.find((p) => p.id === pId);
      const brand = PILLAR_BRANDS[pId];

      if (!pillarMeta) {
        return NextResponse.json({ error: "Invalid pillarId" }, { status: 400 });
      }

      const pillarRecord = assessment.pillarAssessments.find((pa) => pa.pillarId === pId);
      const pillarResponses = assessment.assessmentResponses.filter((r) => r.pillarId === pId);

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
          principle: pillarMeta.principle,
          guidingQuestion: pillarMeta.guidingQuestion,
          element: brand?.element || "FFF",
          score,
          verifiedCount: yesResponses.length,
          gapCount: noResponses.length,
          totalQuestions: 25,
          maturityStage: tier.label,
          maturityDescription: tier.description,
          isCompleted: pillarRecord?.isCompleted || false,
          completedAt: pillarRecord?.completedAt || null,
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
        recommendations: {
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

      return NextResponse.json({ success: true, report: pillarReport });
    }

    // -------------------------------------------------------------
    // Case 2: Overall 8-Pillar Farm Transformation Report
    // -------------------------------------------------------------
    const allYes = assessment.assessmentResponses.filter((r) => r.answer === "yes");
    const allNo = assessment.assessmentResponses.filter((r) => r.answer === "no");
    const overallScore = assessment.overallScore;
    const overallTier = getMaturityTier(overallScore);

    const pillarSummaries = ALL_PILLARS.map((p) => {
      const pa = assessment.pillarAssessments.find((item) => item.pillarId === p.id);
      const pYes = assessment.assessmentResponses.filter((r) => r.pillarId === p.id && r.answer === "yes").length;
      const pNo = assessment.assessmentResponses.filter((r) => r.pillarId === p.id && r.answer === "no").length;
      const score = pa ? pa.score : Math.round((pYes / 25) * 100);
      const tier = getMaturityTier(score);
      const brand = PILLAR_BRANDS[p.id];

      return {
        pillarId: p.id,
        name: p.name,
        element: brand?.element || "FFF",
        score,
        verifiedCount: pYes,
        gapCount: pNo,
        maturityStage: tier.label,
        isCompleted: pa?.isCompleted || false,
      };
    });

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
        overallFfmiScore: overallScore,
        maturityTier: overallTier.label,
        maturityDescription: overallTier.description,
        totalQuestions: 200,
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

    return NextResponse.json({ success: true, report: overallReport });
  } catch (error: any) {
    console.error("Error generating assessment report:", error);
    return NextResponse.json(
      { error: "Failed to generate report", details: error.message },
      { status: 500 }
    );
  }
}
