import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "keziah@futurefarms.africa";

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        farmerProfile: true,
        farmManagement: true,
        operatingStyle: true,
        digitalPlatform: true,
        aspiration: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Error fetching onboarding data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email = "keziah@futurefarms.africa", step, data } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    switch (step) {
      case 1:
        // Section 1: Farmer Profile (Q1-Q5)
        await prisma.farmerProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            jobTitle: data.jobTitle,
            valueChain: data.valueChain,
            experienceYears: data.experienceYears,
            businessHistory: data.businessHistory,
            educationLevel: data.educationLevel,
            otherEducation: data.otherEducation || "",
          },
          update: {
            jobTitle: data.jobTitle,
            valueChain: data.valueChain,
            experienceYears: data.experienceYears,
            businessHistory: data.businessHistory,
            educationLevel: data.educationLevel,
            otherEducation: data.otherEducation || "",
          },
        });
        break;

      case 2:
        // Section 2: Farm Management Experience (Q6-Q8)
        await prisma.farmManagement.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            mgmtAbility: data.mgmtAbility,
            operationsResponsible: data.operationsResponsible || "",
            operators: JSON.stringify(data.operators || [data.operationsResponsible]),
            otherOperator: data.otherOperator || "",
            desiredInvolvement: data.desiredInvolvement,
          },
          update: {
            mgmtAbility: data.mgmtAbility,
            operationsResponsible: data.operationsResponsible || "",
            operators: JSON.stringify(data.operators || [data.operationsResponsible]),
            otherOperator: data.otherOperator || "",
            desiredInvolvement: data.desiredInvolvement,
          },
        });
        break;

      case 3:
        // Section 3: Operating Style (Q9-Q14)
        await prisma.operatingStyle.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            decisionStyle: data.decisionStyle,
            failureResponse: data.failureResponse,
            obstacles: Array.isArray(data.obstacles) ? JSON.stringify(data.obstacles) : data.obstacles,
            otherObstacle: data.otherObstacle || "",
            guidancePreference: data.guidancePreference,
            trackingFrequency: data.trackingFrequency,
            updatePreferences: data.updatePreferences || "",
            communicationChannels: JSON.stringify(data.communicationChannels || [data.updatePreferences]),
          },
          update: {
            decisionStyle: data.decisionStyle,
            failureResponse: data.failureResponse,
            obstacles: Array.isArray(data.obstacles) ? JSON.stringify(data.obstacles) : data.obstacles,
            otherObstacle: data.otherObstacle || "",
            guidancePreference: data.guidancePreference,
            trackingFrequency: data.trackingFrequency,
            updatePreferences: data.updatePreferences || "",
            communicationChannels: JSON.stringify(data.communicationChannels || [data.updatePreferences]),
          },
        });
        break;

      case 4:
        // Section 4: Your Future Farms Aspirations (Q15-Q21)
        await prisma.aspiration.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            twelveMonthSuccess: data.twelveMonthSuccess,
            greatestImpactSupport: data.greatestImpactSupport,
            marketInsight: data.marketInsight,
            threeToFiveYearRole: data.threeToFiveYearRole,
            managerResponsibilities: Array.isArray(data.managerResponsibilities)
              ? JSON.stringify(data.managerResponsibilities)
              : data.managerResponsibilities || "",
            handoverResponsibilities: Array.isArray(data.managerResponsibilities)
              ? JSON.stringify(data.managerResponsibilities)
              : data.managerResponsibilities || "",
            personallyApprovedDecisions: data.personallyApprovedDecisions,
            twentyFiveYearVision: data.twentyFiveYearVision,
          },
          update: {
            twelveMonthSuccess: data.twelveMonthSuccess,
            greatestImpactSupport: data.greatestImpactSupport,
            marketInsight: data.marketInsight,
            threeToFiveYearRole: data.threeToFiveYearRole,
            managerResponsibilities: Array.isArray(data.managerResponsibilities)
              ? JSON.stringify(data.managerResponsibilities)
              : data.managerResponsibilities || "",
            handoverResponsibilities: Array.isArray(data.managerResponsibilities)
              ? JSON.stringify(data.managerResponsibilities)
              : data.managerResponsibilities || "",
            personallyApprovedDecisions: data.personallyApprovedDecisions,
            twentyFiveYearVision: data.twentyFiveYearVision,
          },
        });
        break;

      case 5:
        // Section 5: Working With Digital Farm Management Platforms (Q22-Q27)
        await prisma.digitalPlatform.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            supportReasons: data.supportReasons,
            otherSupportReason: data.otherSupportReason || "",
            remoteConfidence: data.remoteConfidence,
            remoteComfort: data.remoteComfort,
            recordKeeping: data.recordKeeping,
            physicalAudits: data.physicalAudits,
            additionalNotes: data.additionalNotes || "",
          },
          update: {
            supportReasons: data.supportReasons,
            otherSupportReason: data.otherSupportReason || "",
            remoteConfidence: data.remoteConfidence,
            remoteComfort: data.remoteComfort,
            recordKeeping: data.recordKeeping,
            physicalAudits: data.physicalAudits,
            additionalNotes: data.additionalNotes || "",
          },
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid step number" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Step ${step} saved successfully.` });
  } catch (error: any) {
    console.error("Error saving step:", error);
    return NextResponse.json({ error: "Failed to save step." }, { status: 500 });
  }
}
