import { createClerkClient } from "@clerk/backend";
import { prisma } from "@/lib/prisma";
import { recordUserToSheet, syncUserOnboardingToSheet } from "@/lib/googleSheets";
import { generateUniqueFutureFarmId } from "@/lib/idGenerator";

/**
 * Connects directly to Clerk Backend API using CLERK_SECRET_KEY, pulls all registered users,
 * provisions them in the Prisma database if missing, and syncs them to the Google Spreadsheet.
 */
export async function syncClerkUsersToDatabaseAndSheet(): Promise<{
  clerkTotal: number;
  importedToDb: number;
  syncedToSheet: number;
  users: Array<{ email: string; name: string; futureFarmId: string }>;
  errors: string[];
}> {
  const candidateKeys = Array.from(
    new Set(
      [
        process.env.CLERK_PROD_SECRET_KEY,
        process.env.CLERK_SECRET_KEY,
        process.env.CLERK_DEV_SECRET_KEY,
      ].filter(Boolean) as string[]
    )
  );

  const errors: string[] = [];
  const syncedUsers: Array<{ email: string; name: string; futureFarmId: string }> = [];
  let importedCount = 0;

  if (candidateKeys.length === 0) {
    return {
      clerkTotal: 0,
      importedToDb: 0,
      syncedToSheet: 0,
      users: [],
      errors: ["Missing CLERK_SECRET_KEY"],
    };
  }

  try {
    const allClerkUsers: any[] = [];
    const seenClerkIds = new Set<string>();

    for (const key of candidateKeys) {
      try {
        const clerk = createClerkClient({ secretKey: key });
        const list = await clerk.users.getUserList({ limit: 500 });
        for (const user of list.data || []) {
          if (!seenClerkIds.has(user.id)) {
            seenClerkIds.add(user.id);
            allClerkUsers.push(user);
          }
        }
      } catch (keyErr: any) {
        // Silently skip invalid keys or log to errors
        console.warn(`Could not fetch users for Clerk key ${key.slice(0, 10)}...:`, keyErr.message);
      }
    }

    const clerkUsers = allClerkUsers;

    for (const cu of clerkUsers) {
      const emailObj =
        cu.emailAddresses.find((e: any) => e.id === cu.primaryEmailAddressId) ||
        cu.emailAddresses[0];
      const email = emailObj?.emailAddress?.toLowerCase().trim();
      if (!email) continue;

      const fullName =
        [cu.firstName, cu.lastName].filter(Boolean).join(" ") || "Farmer";
      const phone = cu.phoneNumbers?.[0]?.phoneNumber || null;

      try {
        let dbUser = await (prisma.user as any).findUnique({
          where: { email },
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

        if (!dbUser) {
          const assignedId = await generateUniqueFutureFarmId();
          dbUser = await (prisma.user as any).create({
            data: {
              name: fullName,
              email,
              phone,
              futureFarmId: assignedId,
              passwordHash: "CLERK_PROVISIONED",
              farmerProfile: { create: { jobTitle: "Farm Owner" } },
              farmManagement: { create: {} },
              operatingStyle: { create: {} },
              digitalPlatform: { create: {} },
              aspiration: { create: {} },
              onboardingStatus: { create: { stage: "INITIAL_IN_PROGRESS" } },
            },
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
          importedCount++;
        } else if (!dbUser.futureFarmId) {
          const assignedId = await generateUniqueFutureFarmId();
          dbUser = await (prisma.user as any).update({
            where: { id: dbUser.id },
            data: { futureFarmId: assignedId },
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
        }

        // Record and sync to Google Sheet
        const res = await recordUserToSheet(dbUser, { id: cu.id });
        if (res.success) {
          syncedUsers.push({
            email,
            name: fullName,
            futureFarmId: dbUser.futureFarmId,
          });
          await syncUserOnboardingToSheet(dbUser).catch(() => {});
        } else if (res.error) {
          errors.push(`${email}: ${res.error}`);
        }
      } catch (err: any) {
        errors.push(`${email}: ${err.message}`);
      }
    }

    return {
      clerkTotal: clerkUsers.length,
      importedToDb: importedCount,
      syncedToSheet: syncedUsers.length,
      users: syncedUsers,
      errors,
    };
  } catch (clerkErr: any) {
    console.error("Clerk user sync error:", clerkErr);
    return {
      clerkTotal: 0,
      importedToDb: 0,
      syncedToSheet: 0,
      users: [],
      errors: [clerkErr.message || String(clerkErr)],
    };
  }
}
