import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // Delete existing demo user if exists to ensure clean re-seed
  await prisma.user.deleteMany({
    where: { email: "keziah@futurefarms.africa" },
  });

  // Demo user: Keziah
  const user = await prisma.user.create({
    data: {
      email: "keziah@futurefarms.africa",
      name: "Keziah Wanjiku",
      passwordHash,
      phone: "+254 712 345 678",
      farmName: "Highland Greens Organic Farm",
      farmerProfile: {
        create: {
          jobTitle: "Farm Owner",
          valueChain: "",
          experienceYears: "4–6 years",
          businessHistory: "Yes, I currently run a business",
          education: "Undergraduate degree",
        },
      },
      farmManagement: {
        create: {
          mgmtAbility: "I direct farm operations confidently and delegate execution to my team.",
          opsResponsibility: "I am",
          operators: JSON.stringify(["I am"]),
          otherOperator: "",
          desiredInvolvement: "Moderately involved — I want regular updates and to approve major decisions.",
        },
      },
      operatingStyle: {
        create: {
          decisionStyle: "Gather data and analyse the situation before acting.",
          failureResponse: "I first investigate the problem before changing course.",
          obstacles: JSON.stringify(["Finance", "Time", "Access to markets"]),
          guidancePreference: "Structured — give me clear plans, actions, and deadlines.",
          trackingFrequency: "Weekly",
          updatePreference: "A combination of digital reports and manager discussions",
          communicationChannels: JSON.stringify(["whatsapp", "sms"]),
        },
      },
      digitalPlatform: {
        create: {
          supportReasons: JSON.stringify([
            "I do not have enough time to manage the farm myself.",
            "I want to professionalize the farm as a business.",
          ]),
          remoteConfidence: "",
          remoteComfort: "Yes",
          recordKeeping: "Yes",
          physicalAudits: "Yes, with prior scheduling",
          additionalNotes: "",
        },
      },
      aspiration: {
        create: {
          twelveMonthSuccess: "",
          greatestImpactSupport: "",
          marketInsight: "",
          threeToFiveYearRole: "",
          fmResponsibility: "All of the above",
          handoverResponsibilities: JSON.stringify(["All of the above"]),
          personallyApprovedDecisions: "",
          twentyFiveYearVision: "",
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
