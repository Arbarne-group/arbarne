import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { syncUserOnboardingToSheet } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

function computeOnboardingStage(user: any) {
  const isStep1Done = Boolean(user.farmerProfile?.jobTitle);
  const isStep2Done = Boolean(user.farmManagement?.mgmtAbility);
  const isStep3Done = Boolean(user.operatingStyle?.decisionStyle);
  const isStep4Done = Boolean(user.aspiration?.fmResponsibility || user.aspiration?.twelveMonthSuccess);
  const isStep5Done = Boolean(user.digitalPlatform?.remoteComfort || user.digitalPlatform?.supportReasons);
  const initialCompleted = isStep1Done && isStep2Done && isStep3Done && isStep4Done && isStep5Done;

  const isLocDone = Boolean(user.farmLocation);
  const isCharDone = Boolean(user.farmCharacteristics);
  const isSysDone = Boolean(user.farmingSystem);
  const isBizDone = Boolean(user.businessExperience);
  const isLabDone = Boolean(user.householdLabour);
  const additionalCompleted = isLocDone && isCharDone && isSysDone && isBizDone && isLabDone;

  const profileApproved = Boolean(user.onboardingStatus?.profileApproved);

  let stage = "INITIAL_IN_PROGRESS";
  if (initialCompleted) {
    if (additionalCompleted) {
      stage = "FULLY_COMPLETED";
    } else {
      stage = "INITIAL_COMPLETED";
    }
  }

  return {
    stage,
    initialCompleted,
    additionalCompleted,
    profileApproved,
    initialCount: [isStep1Done, isStep2Done, isStep3Done, isStep4Done, isStep5Done].filter(Boolean).length,
    additionalCount: [isLocDone, isCharDone, isSysDone, isBizDone, isLabDone].filter(Boolean).length,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    const user = await getOrCreateCurrentUser(emailParam || undefined);

    if (!user) {
      return NextResponse.json({ error: "User not found or unauthenticated" }, { status: 401 });
    }

    const stageInfo = computeOnboardingStage(user);

    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      include: { pillarAssessments: true, assessmentResponses: true },
    });

    const completedFromPillars =
      assessment?.pillarAssessments?.filter((pa) => pa.isCompleted).length || 0;
    const pillarResponsesCount: Record<string, number> = {};
    assessment?.assessmentResponses?.forEach((r) => {
      const match = r.questionId.match(/^P([1-8])\./i);
      if (match) {
        pillarResponsesCount[match[1]] = (pillarResponsesCount[match[1]] || 0) + 1;
      }
    });
    const completedFromResponses = Object.values(pillarResponsesCount).filter(
      (cnt) => cnt >= 25
    ).length;
    const completedPillarsCount = Math.max(completedFromPillars, completedFromResponses);

    return NextResponse.json({
      success: true,
      user,
      ...stageInfo,
      completedPillarsCount,
      hasCompletedPillarAssessment: completedPillarsCount >= 1,
    });
  } catch (error: any) {
    console.error("Error fetching onboarding data:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email: bodyEmail, step, data } = body;

    const user = await getOrCreateCurrentUser(bodyEmail || undefined);

    if (!user) {
      return NextResponse.json({ error: "User not found or unauthenticated" }, { status: 401 });
    }

    const currentStage = computeOnboardingStage(user);
    if (currentStage.stage === "FULLY_COMPLETED" && step !== "confirm-profile") {
      return NextResponse.json(
        {
          error: "Onboarding surveys are already completed and cannot be repeated.",
          stage: "FULLY_COMPLETED",
          user,
        },
        { status: 400 }
      );
    }

    switch (step) {
      case 1:
      case "1":
      case "step-1": {
        // Section 1: Farmer Profile (Q1-Q5)
        const edu = data.educationLevel || data.education || "";
        await prisma.farmerProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            jobTitle: data.jobTitle || "",
            valueChain: data.valueChain || "",
            experienceYears: data.experienceYears || "",
            businessHistory: data.businessHistory || "",
            educationLevel: edu,
            education: edu,
            otherEducation: data.otherEducation || "",
          },
          update: {
            jobTitle: data.jobTitle || "",
            valueChain: data.valueChain || "",
            experienceYears: data.experienceYears || "",
            businessHistory: data.businessHistory || "",
            educationLevel: edu,
            education: edu,
            otherEducation: data.otherEducation || "",
          },
        });
        break;
      }

      case 2:
      case "2":
      case "step-2": {
        // Section 2: Farm Management Experience (Q6-Q8)
        const ops = data.operationsResponsible || data.opsResponsibility || "";
        const operatorsVal = typeof data.operators === "string"
          ? data.operators
          : JSON.stringify(data.operators || (ops ? [ops] : []));

        await prisma.farmManagement.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            mgmtAbility: data.mgmtAbility || "",
            operationsResponsible: ops,
            opsResponsibility: ops,
            operators: operatorsVal,
            otherOperator: data.otherOperator || "",
            desiredInvolvement: data.desiredInvolvement || "",
          },
          update: {
            mgmtAbility: data.mgmtAbility || "",
            operationsResponsible: ops,
            opsResponsibility: ops,
            operators: operatorsVal,
            otherOperator: data.otherOperator || "",
            desiredInvolvement: data.desiredInvolvement || "",
          },
        });
        break;
      }

      case 3:
      case "3":
      case "step-3": {
        // Section 3: Operating Style (Q9-Q14)
        const obstaclesVal = typeof data.obstacles === "string"
          ? data.obstacles
          : JSON.stringify(data.obstacles || []);
        const updatePref = data.updatePreferences || data.updatePreference || "";
        const commChannels = typeof data.communicationChannels === "string"
          ? data.communicationChannels
          : JSON.stringify(data.communicationChannels || (updatePref ? [updatePref] : []));

        await prisma.operatingStyle.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            decisionStyle: data.decisionStyle || "",
            failureResponse: data.failureResponse || "",
            obstacles: obstaclesVal,
            otherObstacle: data.otherObstacle || "",
            guidancePreference: data.guidancePreference || "",
            trackingFrequency: data.trackingFrequency || "",
            updatePreferences: updatePref,
            updatePreference: updatePref,
            communicationChannels: commChannels,
          },
          update: {
            decisionStyle: data.decisionStyle || "",
            failureResponse: data.failureResponse || "",
            obstacles: obstaclesVal,
            otherObstacle: data.otherObstacle || "",
            guidancePreference: data.guidancePreference || "",
            trackingFrequency: data.trackingFrequency || "",
            updatePreferences: updatePref,
            updatePreference: updatePref,
            communicationChannels: commChannels,
          },
        });
        break;
      }

      case 4:
      case "4":
      case "step-4": {
        // Section 4: Your Future Farms Aspirations (Q15-Q21)
        const fmResp = data.fmResponsibility || "";
        const managerRespVal = typeof data.managerResponsibilities === "string"
          ? data.managerResponsibilities
          : JSON.stringify(data.managerResponsibilities || (fmResp ? [fmResp] : []));
        const handoverVal = typeof data.handoverResponsibilities === "string"
          ? data.handoverResponsibilities
          : JSON.stringify(data.handoverResponsibilities || (data.managerResponsibilities || (fmResp ? [fmResp] : [])));

        await prisma.aspiration.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            twelveMonthSuccess: data.twelveMonthSuccess || "",
            greatestImpactSupport: data.greatestImpactSupport || "",
            marketInsight: data.marketInsight || "",
            threeToFiveYearRole: data.threeToFiveYearRole || "",
            managerResponsibilities: managerRespVal,
            fmResponsibility: fmResp,
            handoverResponsibilities: handoverVal,
            personallyApprovedDecisions: data.personallyApprovedDecisions || "",
            twentyFiveYearVision: data.twentyFiveYearVision || "",
          },
          update: {
            twelveMonthSuccess: data.twelveMonthSuccess || "",
            greatestImpactSupport: data.greatestImpactSupport || "",
            marketInsight: data.marketInsight || "",
            threeToFiveYearRole: data.threeToFiveYearRole || "",
            managerResponsibilities: managerRespVal,
            fmResponsibility: fmResp,
            handoverResponsibilities: handoverVal,
            personallyApprovedDecisions: data.personallyApprovedDecisions || "",
            twentyFiveYearVision: data.twentyFiveYearVision || "",
          },
        });
        break;
      }

      case 5:
      case "5":
      case "step-5": {
        // Section 5: Working With Digital Farm Management Platforms (Q22-Q27)
        const supportReasonsVal = typeof data.supportReasons === "string"
          ? data.supportReasons
          : JSON.stringify(data.supportReasons || []);

        await prisma.digitalPlatform.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            supportReasons: supportReasonsVal,
            otherSupportReason: data.otherSupportReason || "",
            remoteConfidence: data.remoteConfidence || "",
            remoteComfort: data.remoteComfort || "",
            recordKeeping: data.recordKeeping || "",
            physicalAudits: data.physicalAudits || "",
            additionalNotes: data.additionalNotes || "",
          },
          update: {
            supportReasons: supportReasonsVal,
            otherSupportReason: data.otherSupportReason || "",
            remoteConfidence: data.remoteConfidence || "",
            remoteComfort: data.remoteComfort || "",
            recordKeeping: data.recordKeeping || "",
            physicalAudits: data.physicalAudits || "",
            additionalNotes: data.additionalNotes || "",
          },
        });
        break;
      }

      case 6:
      case "location": {
        // Additional Section 1: Farm Location
        await prisma.farmLocation.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            locationSearch: data.locationSearch || "",
            county: data.county || "",
            subcounty: data.subcounty || "",
            ward: data.ward || "",
            landmark: data.landmark || "",
            latitude: data.latitude !== undefined ? Number(data.latitude) : null,
            longitude: data.longitude !== undefined ? Number(data.longitude) : null,
          },
          update: {
            locationSearch: data.locationSearch || "",
            county: data.county || "",
            subcounty: data.subcounty || "",
            ward: data.ward || "",
            landmark: data.landmark || "",
            latitude: data.latitude !== undefined ? Number(data.latitude) : null,
            longitude: data.longitude !== undefined ? Number(data.longitude) : null,
          },
        });
        break;
      }

      case 7:
      case "characteristics": {
        // Additional Section 2: Farm Characteristics
        const waterVal = typeof data.waterSources === "string"
          ? data.waterSources
          : JSON.stringify(data.waterSources || []);

        await prisma.farmCharacteristics.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            farmSize: data.farmSize !== undefined ? Number(data.farmSize) : null,
            farmUnit: data.farmUnit || "Acres",
            cultivatedAcres: data.cultivatedAcres !== undefined ? Number(data.cultivatedAcres) : null,
            grazingAcres: data.grazingAcres !== undefined ? Number(data.grazingAcres) : null,
            landTenure: data.landTenure || "",
            waterSources: waterVal,
            soilTested: data.soilTested || "",
          },
          update: {
            farmSize: data.farmSize !== undefined ? Number(data.farmSize) : null,
            farmUnit: data.farmUnit || "Acres",
            cultivatedAcres: data.cultivatedAcres !== undefined ? Number(data.cultivatedAcres) : null,
            grazingAcres: data.grazingAcres !== undefined ? Number(data.grazingAcres) : null,
            landTenure: data.landTenure || "",
            waterSources: waterVal,
            soilTested: data.soilTested || "",
          },
        });
        break;
      }

      case 8:
      case "farming-system": {
        // Additional Section 3: Farming System
        const enterpVal = typeof data.enterprises === "string"
          ? data.enterprises
          : JSON.stringify(data.enterprises || []);

        await prisma.farmingSystem.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            enterprises: enterpVal,
            cultivationMethod: data.cultivationMethod || "",
            mechanizationSetup: data.mechanizationSetup || "",
            energySource: data.energySource || "",
          },
          update: {
            enterprises: enterpVal,
            cultivationMethod: data.cultivationMethod || "",
            mechanizationSetup: data.mechanizationSetup || "",
            energySource: data.energySource || "",
          },
        });
        break;
      }

      case 9:
      case "business-experience": {
        // Additional Section 4: Business Experience
        const buyersVal = typeof data.produceBuyers === "string"
          ? data.produceBuyers
          : JSON.stringify(data.produceBuyers || []);

        await prisma.businessExperience.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            commercialYears: data.commercialYears || "",
            annualRevenueBracket: data.annualRevenueBracket || "",
            recordKeepingMethod: data.recordKeepingMethod || "",
            produceBuyers: buyersVal,
          },
          update: {
            commercialYears: data.commercialYears || "",
            annualRevenueBracket: data.annualRevenueBracket || "",
            recordKeepingMethod: data.recordKeepingMethod || "",
            produceBuyers: buyersVal,
          },
        });
        break;
      }

      case 10:
      case "goals-priorities": {
        // Additional Section 5: Goals & Priorities
        const goalsVal = typeof data.goals === "string"
          ? data.goals
          : JSON.stringify(data.goals || []);

        await prisma.goalsPriorities.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            goals: goalsVal,
            operationalBottleneck: data.operationalBottleneck || "",
            advisoryMode: data.advisoryMode || "",
          },
          update: {
            goals: goalsVal,
            operationalBottleneck: data.operationalBottleneck || "",
            advisoryMode: data.advisoryMode || "",
          },
        });
        break;
      }

      case 11:
      case "household-labour": {
        // Additional Section 6: Household & Labour
        const practicesVal = typeof data.fairEmploymentPractices === "string"
          ? data.fairEmploymentPractices
          : JSON.stringify(data.fairEmploymentPractices || []);

        await prisma.householdLabour.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            permanentWorkers: data.permanentWorkers !== undefined ? Number(data.permanentWorkers) : null,
            seasonalWorkers: data.seasonalWorkers !== undefined ? Number(data.seasonalWorkers) : null,
            managementStructure: data.managementStructure || "",
            fairEmploymentPractices: practicesVal,
          },
          update: {
            permanentWorkers: data.permanentWorkers !== undefined ? Number(data.permanentWorkers) : null,
            seasonalWorkers: data.seasonalWorkers !== undefined ? Number(data.seasonalWorkers) : null,
            managementStructure: data.managementStructure || "",
            fairEmploymentPractices: practicesVal,
          },
        });
        break;
      }

      case 12:
      case "confirm-profile": {
        // Approval of Farm Profile -> FULLY_COMPLETED
        await prisma.onboardingStatus.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            stage: "FULLY_COMPLETED",
            profileApproved: true,
            completedAt: new Date(),
          },
          update: {
            stage: "FULLY_COMPLETED",
            profileApproved: true,
            completedAt: new Date(),
          },
        });
        break;
      }
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        farmerProfile: true,
        farmManagement: true,
        operatingStyle: true,
        digitalPlatform: true,
        aspiration: true,
        farmLocation: true,
        farmCharacteristics: true,
        farmingSystem: true,
        businessExperience: true,
        goalsPriorities: true,
        householdLabour: true,
        onboardingStatus: true,
      },
    });

    if (updatedUser) {
      // Sync database entries to Google Spreadsheet in background
      syncUserOnboardingToSheet(updatedUser).catch((err) => {
        console.error("Google Sheets onboarding sync background error:", err);
      });
    }

    const stageInfo = updatedUser ? computeOnboardingStage(updatedUser) : null;

    return NextResponse.json({
      success: true,
      message: `Step ${step} saved successfully.`,
      user: updatedUser,
      ...stageInfo,
    });
  } catch (error: any) {
    console.error("Error saving step:", error);
    return NextResponse.json({ error: "Failed to save step." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    const user = await getOrCreateCurrentUser(emailParam || undefined);

    if (!user) {
      return NextResponse.json({ error: "User not found or unauthenticated" }, { status: 401 });
    }

    const currentStage = computeOnboardingStage(user);
    if (currentStage.stage === "FULLY_COMPLETED") {
      return NextResponse.json(
        { error: "Completed onboarding cannot be reset." },
        { status: 403 }
      );
    }

    await prisma.$transaction([
      prisma.farmerProfile.deleteMany({ where: { userId: user.id } }),
      prisma.farmManagement.deleteMany({ where: { userId: user.id } }),
      prisma.operatingStyle.deleteMany({ where: { userId: user.id } }),
      prisma.aspiration.deleteMany({ where: { userId: user.id } }),
      prisma.digitalPlatform.deleteMany({ where: { userId: user.id } }),
      prisma.farmLocation.deleteMany({ where: { userId: user.id } }),
      prisma.farmCharacteristics.deleteMany({ where: { userId: user.id } }),
      prisma.farmingSystem.deleteMany({ where: { userId: user.id } }),
      prisma.businessExperience.deleteMany({ where: { userId: user.id } }),
      prisma.goalsPriorities.deleteMany({ where: { userId: user.id } }),
      prisma.householdLabour.deleteMany({ where: { userId: user.id } }),
      prisma.onboardingStatus.deleteMany({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Onboarding reset successfully",
      stage: "INITIAL_IN_PROGRESS",
      initialCompleted: false,
      additionalCompleted: false,
      profileApproved: false,
    });
  } catch (error: any) {
    console.error("Error resetting onboarding:", error);
    return NextResponse.json({ error: "Failed to reset onboarding" }, { status: 500 });
  }
}
