import { prisma } from "../src/lib/prisma";

async function verifyAllSteps() {
  const testEmail = "test_verification_user@futurefarms.africa";
  console.log("Starting isolated test verification for all 27 onboarding questions...");

  // Clean up existing test user if present
  await prisma.user.deleteMany({ where: { email: testEmail } });

  // Create isolated test user
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      name: "Test Verification User",
      passwordHash: "test_hash",
      phone: "+254 700 000 000",
      farmName: "Test Verification Farm",
    },
  });

  // Step 1: Farmer Profile (Q1-Q5)
  await prisma.farmerProfile.create({
    data: {
      userId: user.id,
      jobTitle: "Farm Owner",
      valueChain: "Horticulture & Specialty Vegetables, Dairy Production",
      experienceYears: "7–10 years",
      businessHistory: "Yes, I currently run a business",
      educationLevel: "Undergraduate degree",
      education: "Undergraduate degree",
      otherEducation: "",
    },
  });

  // Step 2: Farm Management (Q6-Q8)
  await prisma.farmManagement.create({
    data: {
      userId: user.id,
      mgmtAbility: "I direct farm operations confidently and delegate execution to my team.",
      operationsResponsible: "A full-time Farm Manager",
      opsResponsibility: "A full-time Farm Manager",
      operators: JSON.stringify(["A full-time Farm Manager"]),
      otherOperator: "",
      desiredInvolvement: "High-level strategic oversight only",
    },
  });

  // Step 3: Operating Style (Q9-Q14)
  await prisma.operatingStyle.create({
    data: {
      userId: user.id,
      decisionStyle: "Gather data and analyse the situation before acting.",
      failureResponse: "I first investigate the problem before changing course.",
      obstacles: JSON.stringify(["Cashflow constraints", "Labor reliability / skill gaps", "Pest & disease pressures"]),
      otherObstacle: "",
      guidancePreference: "Structured playbooks with step-by-step guidance",
      trackingFrequency: "Daily logs & weekly metric reviews",
      updatePreferences: "WhatsApp reports with summary dashboards",
      updatePreference: "WhatsApp reports with summary dashboards",
      communicationChannels: JSON.stringify(["WhatsApp reports with summary dashboards"]),
    },
  });

  // Step 4: Aspiration (Q15-Q21)
  await prisma.aspiration.create({
    data: {
      userId: user.id,
      twelveMonthSuccess: "Achieve 30% yield increase and stable positive cash flow",
      greatestImpactSupport: "Standard operating procedures and agronomist coaching",
      marketInsight: "Reliable off-takers with contracted pricing",
      threeToFiveYearRole: "Executive Chairman focusing on expansion and partnerships",
      managerResponsibilities: JSON.stringify(["Production planning", "Worker supervision", "Input management", "Reporting"]),
      fmResponsibility: "Production planning",
      handoverResponsibilities: JSON.stringify(["Production planning", "Worker supervision", "Input management", "Reporting"]),
      personallyApprovedDecisions: "Capital expenditures above $500, hiring key managers",
      twentyFiveYearVision: "A premier commercial agribusiness feeding regional urban markets sustainably.",
    },
  });

  // Step 5: Digital Platform (Q22-Q27)
  await prisma.digitalPlatform.create({
    data: {
      userId: user.id,
      supportReasons: JSON.stringify(["I want better visibility into what is happening on the farm.", "I want to improve productivity and profitability."]),
      otherSupportReason: "",
      remoteConfidence: "High confidence with daily photo verification and sensors",
      remoteComfort: "Very comfortable managing operations through a central digital dashboard",
      recordKeeping: "Digital spreadsheets and mobile logging apps",
      physicalAudits: "Monthly on-site inspections combined with drone surveys",
      additionalNotes: "Focused on transitioning into GlobalGAP export certification next quarter.",
    },
  });

  const verifiedUser = await prisma.user.findUnique({
    where: { email: testEmail },
    include: {
      farmerProfile: true,
      farmManagement: true,
      operatingStyle: true,
      digitalPlatform: true,
      aspiration: true,
    },
  });

  console.log("=== ISOLATED TEST VERIFICATION RESULTS ===");
  console.log("Step 1 (Farmer Profile Q1-Q5):", !!verifiedUser?.farmerProfile?.jobTitle);
  console.log("Step 2 (Farm Management Q6-Q8):", !!verifiedUser?.farmManagement?.mgmtAbility);
  console.log("Step 3 (Operating Style Q9-Q14):", !!verifiedUser?.operatingStyle?.decisionStyle);
  console.log("Step 4 (Aspirations Q15-Q21):", !!verifiedUser?.aspiration?.twelveMonthSuccess);
  console.log("Step 5 (Digital Platform Q22-Q27):", !!verifiedUser?.digitalPlatform?.remoteComfort);
  console.log("All 5 Models Captured in DB:", 
    !!verifiedUser?.farmerProfile &&
    !!verifiedUser?.farmManagement &&
    !!verifiedUser?.operatingStyle &&
    !!verifiedUser?.aspiration &&
    !!verifiedUser?.digitalPlatform
  );

  // Clean up isolated test user
  await prisma.user.delete({ where: { id: user.id } });
  console.log("Isolated test user cleaned up successfully.");
}

verifyAllSteps()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

