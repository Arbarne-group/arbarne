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
        // Farmer Profile (Q1 - Q5)
        await prisma.farmerProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            jobTitle: data.jobTitle,
            valueChain: data.valueChain,
            experienceYears: data.experienceYears,
            businessHistory: data.businessHistory,
            education: data.education,
          },
          update: {
            jobTitle: data.jobTitle,
            valueChain: data.valueChain,
            experienceYears: data.experienceYears,
            businessHistory: data.businessHistory,
            education: data.education,
          },
        });
        break;

      case 2:
        // Farm Management Experience (Q6 - Q8)
        await prisma.farmManagement.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            mgmtAbility: data.mgmtAbility,
            opsResponsibility: data.opsResponsibility,
            operators: typeof data.operators === "string" ? data.operators : JSON.stringify(data.operators || [data.opsResponsibility].filter(Boolean)),
            otherOperator: data.otherOperator || "",
            desiredInvolvement: data.desiredInvolvement,
          },
          update: {
            mgmtAbility: data.mgmtAbility,
            opsResponsibility: data.opsResponsibility,
            operators: typeof data.operators === "string" ? data.operators : JSON.stringify(data.operators || [data.opsResponsibility].filter(Boolean)),
            otherOperator: data.otherOperator || "",
            desiredInvolvement: data.desiredInvolvement,
          },
        });
        break;

      case 3:
        // Operating Style (Q9 - Q14)
        await prisma.operatingStyle.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            decisionStyle: data.decisionStyle,
            failureResponse: data.failureResponse,
            obstacles: typeof data.obstacles === "string" ? data.obstacles : JSON.stringify(data.obstacles || []),
            guidancePreference: data.guidancePreference,
            trackingFrequency: data.trackingFrequency,
            updatePreference: data.updatePreference,
            communicationChannels: typeof data.communicationChannels === "string" ? data.communicationChannels : JSON.stringify(data.communicationChannels || [data.updatePreference].filter(Boolean)),
          },
          update: {
            decisionStyle: data.decisionStyle,
            failureResponse: data.failureResponse,
            obstacles: typeof data.obstacles === "string" ? data.obstacles : JSON.stringify(data.obstacles || []),
            guidancePreference: data.guidancePreference,
            trackingFrequency: data.trackingFrequency,
            updatePreference: data.updatePreference,
            communicationChannels: typeof data.communicationChannels === "string" ? data.communicationChannels : JSON.stringify(data.communicationChannels || [data.updatePreference].filter(Boolean)),
          },
        });
        break;

      case 4:
        // Aspirations (Q15 - Q21)
        await prisma.aspiration.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            twelveMonthSuccess: data.twelveMonthSuccess,
            greatestImpactSupport: data.greatestImpactSupport,
            marketInsight: data.marketInsight,
            threeToFiveYearRole: data.threeToFiveYearRole,
            fmResponsibility: data.fmResponsibility,
            handoverResponsibilities: typeof data.handoverResponsibilities === "string" ? data.handoverResponsibilities : JSON.stringify(data.handoverResponsibilities || [data.fmResponsibility].filter(Boolean)),
            personallyApprovedDecisions: data.personallyApprovedDecisions,
            twentyFiveYearVision: data.twentyFiveYearVision,
          },
          update: {
            twelveMonthSuccess: data.twelveMonthSuccess,
            greatestImpactSupport: data.greatestImpactSupport,
            marketInsight: data.marketInsight,
            threeToFiveYearRole: data.threeToFiveYearRole,
            fmResponsibility: data.fmResponsibility,
            handoverResponsibilities: typeof data.handoverResponsibilities === "string" ? data.handoverResponsibilities : JSON.stringify(data.handoverResponsibilities || [data.fmResponsibility].filter(Boolean)),
            personallyApprovedDecisions: data.personallyApprovedDecisions,
            twentyFiveYearVision: data.twentyFiveYearVision,
          },
        });
        break;

      case 5:
        // Working With Digital Farm Management Platforms (Q22 - Q27)
        await prisma.digitalPlatform.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            supportReasons: typeof data.supportReasons === "string" ? data.supportReasons : JSON.stringify(data.supportReasons || []),
            remoteConfidence: data.remoteConfidence,
            remoteComfort: data.remoteComfort,
            recordKeeping: data.recordKeeping,
            physicalAudits: data.physicalAudits,
            additionalNotes: data.additionalNotes,
          },
          update: {
            supportReasons: typeof data.supportReasons === "string" ? data.supportReasons : JSON.stringify(data.supportReasons || []),
            remoteConfidence: data.remoteConfidence,
            remoteComfort: data.remoteComfort,
            recordKeeping: data.recordKeeping,
            physicalAudits: data.physicalAudits,
            additionalNotes: data.additionalNotes,
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
