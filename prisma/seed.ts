import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // Demo user: Keziah
  const user = await prisma.user.upsert({
    where: { email: "keziah@futurefarms.africa" },
    update: {},
    create: {
      email: "keziah@futurefarms.africa",
      name: "Keziah Wanjiku",
      passwordHash,
      phone: "+254 712 345 678",
      farmName: "Highland Greens Organic Farm",
      farmerProfile: {
        create: {
          jobTitle: "owner",
          valueChain: "Horticulture & Specialty Vegetables",
        },
      },
      farmManagement: {
        create: {
          mgmtAbility: "Experienced",
          operators: JSON.stringify(["Myself (Owner/Operator)", "Hired Farm Manager"]),
          otherOperator: "",
          desiredInvolvement: "Moderately involved",
        },
      },
      operatingStyle: {
        create: {
          decisionStyle: "data",
          failureResponse: "adjust",
          obstacles: JSON.stringify(["Access to Finance & Capital", "Time Management & Labor", "Market Access & Pricing"]),
          guidancePreference: "structured",
          trackingFrequency: "weekly",
          communicationChannels: JSON.stringify(["whatsapp", "sms"]),
        },
      },
      digitalPlatform: {
        create: {
          supportReasons: JSON.stringify(["Time Constraints", "Scaling Operations"]),
          remoteConfidence: "Weekly video updates, real-time sensor data, and clear inventory reports.",
          remoteComfort: "Yes",
          recordKeeping: "Yes",
          physicalAudits: "Yes",
          additionalNotes: "Looking to expand cold-chain storage and export organic produce.",
        },
      },
      aspiration: {
        create: {
          twelveMonthSuccess: "Achieve 30% yield increase and certify for global export.",
          greatestImpactSupport: "Precision irrigation tech and capital financing.",
          marketInsight: "Direct-to-supermarket contracts pay 40% higher margins than open market brokers.",
          threeToFiveYearRole: "Strategic direction and regional partnerships.",
          handoverResponsibilities: JSON.stringify(["Daily Operations Management", "Staff Hiring & Management"]),
          personallyApprovedDecisions: "Capital expenditures above $5,000 and new enterprise partnerships.",
          twentyFiveYearVision: "Fully tech-enabled, climate-resilient African agriculture feeding global cities sustainably.",
        },
      },
      orders: {
        create: [
          {
            planType: "FULL_ASSESSMENT",
            amount: 10.0,
            paymentMethod: "MPESA",
            phoneNumber: "+254 712 345 678",
            status: "COMPLETED",
          },
        ],
      },
      assessments: {
        create: [
          {
            overallScore: 78,
            maturityLevel: "Advancing",
            pillarScores: JSON.stringify({
              "Soil & Crop Health": 82,
              "Water & Irrigation": 75,
              "Tech & Mechanization": 68,
              "Business & Financials": 85,
              "Labor & Workforce": 79,
              "Climate Resilience": 72,
              "Market Access": 88,
              "Post-Harvest & Quality": 76,
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
              scores: [82, 75, 68, 85, 79, 72, 88, 76],
            }),
            priorityAreas: JSON.stringify([
              {
                pillar: "Technology & Mechanization",
                title: "Automated Drip Irrigation Scheduling",
                description: "Install soil moisture telemetry to reduce water usage by 28% and eliminate manual valve monitoring.",
              },
              {
                pillar: "Climate Resilience",
                title: "Solar-Powered Cold Storage",
                description: "Mitigate post-harvest heat degradation by introducing decentralized on-farm cooling lockers.",
              },
              {
                pillar: "Labor & People",
                title: "Standard Operating Procedures (SOPs)",
                description: "Codify harvesting and sorting guidelines to prepare farm managers for delegation.",
              },
            ]),
          },
        ],
      },
    },
  });

  console.log(`Seeded user: ${user.name} (${user.email})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
