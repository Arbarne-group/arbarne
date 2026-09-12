import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";

function toDate(val: number | string | null | undefined): Date | undefined {
  if (!val) return undefined;
  if (typeof val === "number") return new Date(val);
  return new Date(val);
}

function toNullableDate(val: number | string | null | undefined): Date | null {
  if (!val) return null;
  if (typeof val === "number") return new Date(val);
  return new Date(val);
}

function toBoolean(val: any): boolean {
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val === 1;
  if (typeof val === "string") return val === "true" || val === "1";
  return false;
}

async function migrate() {
  console.log("Starting SQLite to Neon Postgres data migration...");

  const dumpPath = path.join(process.cwd(), "scratch", "sqlite_dump.json");
  if (!fs.existsSync(dumpPath)) {
    throw new Error(`Dump file not found at ${dumpPath}`);
  }

  const rawData = fs.readFileSync(dumpPath, "utf-8");
  const data = JSON.parse(rawData);

  // 1. Users
  console.log(`\nMigrating ${data.User?.length || 0} Users...`);
  for (const u of data.User || []) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        futureFarmId: u.futureFarmId,
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        phone: u.phone,
        farmName: u.farmName,
        createdAt: toDate(u.createdAt),
        updatedAt: toDate(u.updatedAt),
      },
      create: {
        id: u.id,
        futureFarmId: u.futureFarmId,
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        phone: u.phone,
        farmName: u.farmName,
        createdAt: toDate(u.createdAt),
        updatedAt: toDate(u.updatedAt),
      },
    });
    console.log(`  ✓ Migrated user: ${u.name} (${u.email}) [${u.futureFarmId}]`);
  }

  // 2. FarmerProfiles
  console.log(`\nMigrating ${data.FarmerProfile?.length || 0} FarmerProfiles...`);
  for (const fp of data.FarmerProfile || []) {
    await prisma.farmerProfile.upsert({
      where: { userId: fp.userId },
      update: {
        jobTitle: fp.jobTitle,
        valueChain: fp.valueChain,
        experienceYears: fp.experienceYears,
        businessHistory: fp.businessHistory,
        educationLevel: fp.educationLevel,
        education: fp.education,
        otherEducation: fp.otherEducation,
        updatedAt: toDate(fp.updatedAt),
      },
      create: {
        id: fp.id,
        userId: fp.userId,
        jobTitle: fp.jobTitle,
        valueChain: fp.valueChain,
        experienceYears: fp.experienceYears,
        businessHistory: fp.businessHistory,
        educationLevel: fp.educationLevel,
        education: fp.education,
        otherEducation: fp.otherEducation,
        updatedAt: toDate(fp.updatedAt),
      },
    });
  }
  console.log(`  ✓ Migrated FarmerProfiles`);

  // 3. FarmManagement
  console.log(`\nMigrating ${data.FarmManagement?.length || 0} FarmManagement records...`);
  for (const fm of data.FarmManagement || []) {
    await prisma.farmManagement.upsert({
      where: { userId: fm.userId },
      update: {
        mgmtAbility: fm.mgmtAbility,
        operationsResponsible: fm.operationsResponsible,
        opsResponsibility: fm.opsResponsibility,
        operators: fm.operators,
        otherOperator: fm.otherOperator,
        desiredInvolvement: fm.desiredInvolvement,
        updatedAt: toDate(fm.updatedAt),
      },
      create: {
        id: fm.id,
        userId: fm.userId,
        mgmtAbility: fm.mgmtAbility,
        operationsResponsible: fm.operationsResponsible,
        opsResponsibility: fm.opsResponsibility,
        operators: fm.operators,
        otherOperator: fm.otherOperator,
        desiredInvolvement: fm.desiredInvolvement,
        updatedAt: toDate(fm.updatedAt),
      },
    });
  }
  console.log(`  ✓ Migrated FarmManagement records`);

  // 4. OperatingStyle
  console.log(`\nMigrating ${data.OperatingStyle?.length || 0} OperatingStyle records...`);
  for (const os of data.OperatingStyle || []) {
    await prisma.operatingStyle.upsert({
      where: { userId: os.userId },
      update: {
        decisionStyle: os.decisionStyle,
        failureResponse: os.failureResponse,
        obstacles: os.obstacles,
        otherObstacle: os.otherObstacle,
        guidancePreference: os.guidancePreference,
        trackingFrequency: os.trackingFrequency,
        updatePreferences: os.updatePreferences,
        updatePreference: os.updatePreference,
        communicationChannels: os.communicationChannels,
        updatedAt: toDate(os.updatedAt),
      },
      create: {
        id: os.id,
        userId: os.userId,
        decisionStyle: os.decisionStyle,
        failureResponse: os.failureResponse,
        obstacles: os.obstacles,
        otherObstacle: os.otherObstacle,
        guidancePreference: os.guidancePreference,
        trackingFrequency: os.trackingFrequency,
        updatePreferences: os.updatePreferences,
        updatePreference: os.updatePreference,
        communicationChannels: os.communicationChannels,
        updatedAt: toDate(os.updatedAt),
      },
    });
  }
  console.log(`  ✓ Migrated OperatingStyle records`);

  // 5. DigitalPlatform
  console.log(`\nMigrating ${data.DigitalPlatform?.length || 0} DigitalPlatform records...`);
  for (const dp of data.DigitalPlatform || []) {
    await prisma.digitalPlatform.upsert({
      where: { userId: dp.userId },
      update: {
        supportReasons: dp.supportReasons,
        otherSupportReason: dp.otherSupportReason,
        remoteConfidence: dp.remoteConfidence,
        remoteComfort: dp.remoteComfort,
        recordKeeping: dp.recordKeeping,
        physicalAudits: dp.physicalAudits,
        additionalNotes: dp.additionalNotes,
        updatedAt: toDate(dp.updatedAt),
      },
      create: {
        id: dp.id,
        userId: dp.userId,
        supportReasons: dp.supportReasons,
        otherSupportReason: dp.otherSupportReason,
        remoteConfidence: dp.remoteConfidence,
        remoteComfort: dp.remoteComfort,
        recordKeeping: dp.recordKeeping,
        physicalAudits: dp.physicalAudits,
        additionalNotes: dp.additionalNotes,
        updatedAt: toDate(dp.updatedAt),
      },
    });
  }
  console.log(`  ✓ Migrated DigitalPlatform records`);

  // 6. Aspiration
  console.log(`\nMigrating ${data.Aspiration?.length || 0} Aspiration records...`);
  for (const asp of data.Aspiration || []) {
    await prisma.aspiration.upsert({
      where: { userId: asp.userId },
      update: {
        twelveMonthSuccess: asp.twelveMonthSuccess,
        greatestImpactSupport: asp.greatestImpactSupport,
        marketInsight: asp.marketInsight,
        threeToFiveYearRole: asp.threeToFiveYearRole,
        managerResponsibilities: asp.managerResponsibilities,
        fmResponsibility: asp.fmResponsibility,
        handoverResponsibilities: asp.handoverResponsibilities,
        personallyApprovedDecisions: asp.personallyApprovedDecisions,
        twentyFiveYearVision: asp.twentyFiveYearVision,
        updatedAt: toDate(asp.updatedAt),
      },
      create: {
        id: asp.id,
        userId: asp.userId,
        twelveMonthSuccess: asp.twelveMonthSuccess,
        greatestImpactSupport: asp.greatestImpactSupport,
        marketInsight: asp.marketInsight,
        threeToFiveYearRole: asp.threeToFiveYearRole,
        managerResponsibilities: asp.managerResponsibilities,
        fmResponsibility: asp.fmResponsibility,
        handoverResponsibilities: asp.handoverResponsibilities,
        personallyApprovedDecisions: asp.personallyApprovedDecisions,
        twentyFiveYearVision: asp.twentyFiveYearVision,
        updatedAt: toDate(asp.updatedAt),
      },
    });
  }
  console.log(`  ✓ Migrated Aspiration records`);

  // 7. OnboardingStatus
  console.log(`\nMigrating ${data.OnboardingStatus?.length || 0} OnboardingStatus records...`);
  for (const os of data.OnboardingStatus || []) {
    await prisma.onboardingStatus.upsert({
      where: { userId: os.userId },
      update: {
        stage: os.stage,
        profileApproved: toBoolean(os.profileApproved),
        completedAt: toNullableDate(os.completedAt),
        updatedAt: toDate(os.updatedAt),
      },
      create: {
        id: os.id,
        userId: os.userId,
        stage: os.stage,
        profileApproved: toBoolean(os.profileApproved),
        completedAt: toNullableDate(os.completedAt),
        updatedAt: toDate(os.updatedAt),
      },
    });
  }
  console.log(`  ✓ Migrated OnboardingStatus records`);

  console.log("\n========================================================");
  console.log("✅ SQLite to Neon Postgres migration finished successfully!");
  console.log("========================================================");
}

migrate()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
