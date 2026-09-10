import { currentUser, auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { recordUserToSheet } from "@/lib/googleSheets";

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

  let dbUser = await prisma.user.findUnique({
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
    const fullName = clerkUser
      ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "Farmer"
      : "Farmer";

    const userCount = await prisma.user.count();
    const assignedId = `FFF-KE-PROD-${String(userCount + 1).padStart(3, "0")}`;

    dbUser = await prisma.user.create({
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

    // Record new user to Google Sheet in background
    recordUserToSheet(dbUser, clerkUser).catch((err) => {
      console.warn("Non-blocking Google Sheet recording warning:", err);
    });
  } else if (!dbUser.futureFarmId) {
    // If existing user has no assigned ID yet, generate and save it
    const userCount = await prisma.user.count();
    const assignedId = `FFF-KE-PROD-${String(userCount).padStart(3, "0")}`;
    try {
      dbUser = await prisma.user.update({
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
    } catch (updateErr) {
      console.warn("Could not update user futureFarmId:", updateErr);
    }

    recordUserToSheet(dbUser, clerkUser).catch((err) => {
      console.warn("Non-blocking Google Sheet recording warning:", err);
    });
  }

  return dbUser;
}

