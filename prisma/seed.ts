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
          valueChain: "Horticulture & Specialty Vegetables",
          experienceYears: "4–6 years",
          businessHistory: "Yes, I currently run a business",
          educationLevel: "Undergraduate degree",
          education: "Undergraduate degree",
          otherEducation: "",
        },
      },
      farmManagement: {
        create: {
          mgmtAbility: "I direct farm operations confidently and delegate execution to my team.",
          operationsResponsible: "A Farm Manager",
          opsResponsibility: "A Farm Manager",
          operators: JSON.stringify(["I am", "A Farm Manager"]),
          otherOperator: "",
          desiredInvolvement: "Strategically involved — I want to focus on business direction while the Farm Manager handles operations.",
        },
      },
      operatingStyle: {
        create: {
          decisionStyle: "Gather data and analyse the situation before acting.",
          failureResponse: "I first investigate the problem before changing course.",
          obstacles: JSON.stringify(["Finance", "Time", "Access to markets"]),
          otherObstacle: "",
          guidancePreference: "Structured — give me clear plans, actions, and deadlines.",
          trackingFrequency: "Weekly",
          updatePreferences: "Weekly operational updates",
          updatePreference: "Weekly operational updates",
          communicationChannels: JSON.stringify(["Weekly operational updates", "Monthly performance reports"]),
        },
      },
      digitalPlatform: {
        create: {
          supportReasons: "I want better visibility into what is happening on the farm.",
          otherSupportReason: "",
          remoteConfidence: "Weekly video updates, real-time sensor data, and verified inventory logs.",
          remoteComfort: "Yes",
          recordKeeping: "Yes",
          physicalAudits: "Yes, with prior scheduling",
          additionalNotes: "Looking to expand cold-chain storage and export organic produce.",
        },
      },
      aspiration: {
        create: {
          twelveMonthSuccess: "Achieve 30% yield increase and certify for regional export markets.",
          greatestImpactSupport: "Precision irrigation automation and cold storage financing.",
          marketInsight: "Direct-to-supermarket contracts pay 40% higher margins than open market brokers.",
          threeToFiveYearRole: "Strategic direction, investor relations, and regional farm network expansion.",
          managerResponsibilities: JSON.stringify(["Production planning", "Day-to-day operations", "Worker supervision", "Cost control", "Reporting"]),
          fmResponsibility: "Production planning, Day-to-day operations, Worker supervision, Cost control, Reporting",
          handoverResponsibilities: JSON.stringify(["Production planning", "Day-to-day operations", "Worker supervision", "Cost control", "Reporting"]),
          personallyApprovedDecisions: "Capital expenditures above $5,000 and major commercial contract agreements.",
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
