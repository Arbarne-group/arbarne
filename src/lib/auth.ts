import { currentUser, auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { recordUserToSheet, syncAllUnsentUsersToSheet } from "@/lib/googleSheets";

let lastBackgroundSync = 0;
const BACKGROUND_SYNC_COOLDOWN = 5 * 60 * 1000; // 5 minutes

/**
 * Retrieves the currently authenticated Clerk user on the server.
 */
export async function getAuthenticatedClerkUser() {
  try {
    const user = await currentUser();
    return user;
  } catch (err) {
    console.error("Error retrieving Clerk user:", err);
    return null;
  }
}

/**
 * Returns the primary email of the authenticated Clerk user, or null if unauthenticated.
 */
export async function getAuthenticatedUserEmail(): Promise<string | null> {
  const clerkUser = await getAuthenticatedClerkUser();
  if (!clerkUser) return null;
  const primaryEmail = clerkUser.emailAddresses?.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
  return primaryEmail ? primaryEmail.toLowerCase().trim() : null;
}

/**
 * Finds or creates the matching database user record in Prisma for the authenticated Clerk user,
 * assigns their unique Future Farms Production ID (e.g. FFF-KE-PROD-001), and registers them
 * in the Google Spreadsheet.
 */
export async function getOrCreateCurrentUser(fallbackEmail?: string) {
  const clerkUser = await getAuthenticatedClerkUser();
  let email: string | null = null;

  if (clerkUser) {
    const primary = clerkUser.emailAddresses?.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
    if (primary) {
      email = primary.toLowerCase().trim();
    }
  }

  if (!email && fallbackEmail) {
    email = fallbackEmail.toLowerCase().trim();
  }

  if (!email) {
    return null;
  }

  const fullName = clerkUser
    ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "Farmer"
    : "Farmer";

  let dbUser: any = null;
  try {
    dbUser = await (prisma.user as any).findUnique({
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
  } catch (findErr: any) {
    console.warn("[Auth] prisma.user.findUnique notice:", findErr.message);
  }

  if (!dbUser) {
    let assignedId = `FFF-KE-PROD-${Date.now().toString().slice(-3)}`;
    try {
      const userCount = await prisma.user.count();
      assignedId = `FFF-KE-PROD-${String(userCount + 1).padStart(3, "0")}`;
    } catch {}

    try {
      dbUser = await (prisma.user as any).create({
        data: {
          name: fullName,
          email,
          futureFarmId: assignedId,
          passwordHash: "CLERK_AUTHENTICATED",
          farmerProfile: { create: {} },
          farmManagement: { create: {} },
          operatingStyle: { create: {} },
          digitalPlatform: { create: {} },
          aspiration: { create: {} },
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
    } catch (createErr: any) {
      console.warn("[Auth] prisma.user.create notice (using in-memory user):", createErr.message);
      dbUser = {
        id: `usr_${Date.now()}`,
        name: fullName,
        email,
        futureFarmId: assignedId,
        farmerProfile: {},
        farmManagement: {},
        operatingStyle: {},
        digitalPlatform: {},
        aspiration: {},
        onboardingStatus: { stage: "INITIAL_IN_PROGRESS" },
      };
    }
  } else if (!dbUser.futureFarmId) {
    try {
      const userCount = await prisma.user.count();
      const assignedId = `FFF-KE-PROD-${String(userCount).padStart(3, "0")}`;
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
    } catch (updateErr: any) {
      console.warn("Could not update user futureFarmId:", updateErr.message);
    }
  }

  // Record user to Google Sheet (must await in serverless environments)
  try {
    await recordUserToSheet(dbUser, clerkUser);
  } catch (err: any) {
    console.warn("[GoogleSheets] Google Sheet recording notice:", err.message);
  }

  // Sweep and reconcile any unsent database users to the sheet (throttled)
  const now = Date.now();
  if (now - lastBackgroundSync > BACKGROUND_SYNC_COOLDOWN) {
    lastBackgroundSync = now;
    syncAllUnsentUsersToSheet().catch((syncErr: any) => {
      console.warn("[GoogleSheets] Background reconciliation notice:", syncErr.message);
    });
  }

  return dbUser;
}

