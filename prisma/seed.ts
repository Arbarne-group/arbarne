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

  // Demo user: Keziah (Fresh / Incomplete onboarding to test and view questions)
  const user = await prisma.user.create({
    data: {
      email: "keziah@futurefarms.africa",
      name: "Keziah Wanjiku",
      passwordHash,
      phone: "+254 712 345 678",
      farmName: "Highland Greens Organic Farm",
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
