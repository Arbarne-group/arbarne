import { currentUser, auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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
 * Finds or creates the matching database user record in Prisma for the authenticated Clerk user.
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

    dbUser = await prisma.user.create({
      data: {
        name: fullName,
        email,
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
  }

  return dbUser;
}
