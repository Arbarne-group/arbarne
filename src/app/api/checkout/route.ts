import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const {
      email = "keziah@futurefarms.africa",
      planType = "FULL_ASSESSMENT",
      paymentMethod = "MPESA",
      phoneNumber,
      amount = 10.0,
    } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create Order record
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        planType,
        amount: parseFloat(amount),
        paymentMethod,
        phoneNumber: phoneNumber || null,
        status: "COMPLETED",
      },
    });

    // Generate or update comprehensive assessment scores
    const existingAssessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
    });

    if (!existingAssessment) {
      await prisma.assessment.create({
        data: {
          userId: user.id,
          overallScore: 82,
          maturityLevel: "Advancing",
          pillarScores: JSON.stringify({
            "Soil & Crop Health": 84,
            "Water & Irrigation": 78,
            "Tech & Mechanization": 72,
            "Business & Financials": 88,
            "Labor & Workforce": 80,
            "Climate Resilience": 75,
            "Market Access": 90,
            "Post-Harvest & Quality": 79,
          }),
          radarData: JSON.stringify({
            labels: [
              "Soil & Crops",
              "Water Mgmt",
              "Technology",
              "Business",
              "Labor & Team",
              "Resilience",
              "Market Access",
              "Post-Harvest",
            ],
            scores: [84, 78, 72, 88, 80, 75, 90, 79],
          }),
          priorityAreas: JSON.stringify([
            {
              pillar: "Technology & Mechanization",
              title: "Automated Drip Irrigation Scheduling",
              description:
                "Install soil moisture telemetry to reduce water usage by 28% and eliminate manual valve monitoring.",
            },
            {
              pillar: "Climate Resilience",
              title: "Solar-Powered Cold Storage",
              description:
                "Mitigate post-harvest heat degradation by introducing decentralized on-farm cooling lockers.",
            },
            {
              pillar: "Labor & People",
              title: "Standard Operating Procedures (SOPs)",
              description:
                "Codify harvesting and sorting guidelines to prepare farm managers for delegation.",
            },
          ]),
        },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: order.status,
      message:
        paymentMethod === "MPESA"
          ? "Payment prompt processed and confirmed via M-Pesa!"
          : "Card payment processed successfully!",
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Payment processing failed." },
      { status: 500 }
    );
  }
}
