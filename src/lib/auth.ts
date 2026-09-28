import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { recordUserToSheet, syncAllUnsentUsersToSheet } from "@/lib/googleSheets";
import { generateUniqueFutureFarmId } from "@/lib/idGenerator";

let lastBackgroundSync = 0;
const BACKGROUND_SYNC_COOLDOWN = 5 * 60 * 1000; // 5 minutes

export { generateUniqueFutureFarmId };

/**
 * Retrieves the currently authenticated session user (Auth.js: Google or
 * Credentials) in the legacy Clerk-compatible shape.
 */
export async function getAuthenticatedClerkUser() {
  try {
    const session = await auth().catch(() => null);
    const su: any = (session as any)?.user;
    if (!su?.email) return null;
    return {
      id: su.id,
      primaryEmailAddressId: "primary",
      emailAddresses: [{ id: "primary", emailAddress: su.email }],
      firstName: null,
      lastName: null,
    };
  } catch (err) {
    console.error("Error retrieving session user:", err);
    return null;
  }
}

/**
 * Returns the primary email of the authenticated session user, or null.
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
 * Finds or creates the matching database user record in Prisma for the
 * authenticated session user, assigns their unique Future Farms Production
 * ID (e.g. FFF-KE-PROD-001), and registers them in the Google Spreadsheet.
 */
export async function getOrCreateCurrentUser(fallbackEmail?: string) {
  const session = await auth().catch(() => null);
  const sessionUser: any = (session as any)?.user;
  let email: string | null = null;

  if (sessionUser?.email) {
    email = String(sessionUser.email).toLowerCase().trim();
  }

  if (!email) {
    try {
      const { getPasswordSession } = await import("@/lib/session");
      const s = await getPasswordSession();
      if (s?.email) {
        email = s.email.toLowerCase().trim();
      }
    } catch {
      // No password session — fall through to fallbackEmail.
    }
  }

  if (!email && fallbackEmail) {
    email = fallbackEmail.toLowerCase().trim();
  }

  if (!email) {
    return null;
  }

  const fullName =
    (typeof sessionUser?.name === "string" && sessionUser.name.trim()) || "Farmer";

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
        business: true,
      },
    });
  } catch (findErr: any) {
    console.warn("[Auth] prisma.user.findUnique notice:", findErr.message);
  }

  if (!dbUser) {
    const assignedId = await generateUniqueFutureFarmId();

    try {
      dbUser = await (prisma.user as any).create({
        data: {
          name: fullName,
          email,
          futureFarmId: assignedId,
          passwordHash: "SOCIAL_AUTHENTICATED",
          authProvider: sessionUser ? "google" : "password",
          accountStatus: "VERIFIED",
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
          business: true,
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
          business: true,
        },
      });
    } catch (updateErr: any) {
      console.warn("Could not update user futureFarmId:", updateErr.message);
    }
  }

  // Backfill split names + provider for accounts created before they existed.
  // Only runs for session-backed calls; name parts come from the session
  // display name when the DB row lacks them.
  if (dbUser?.id && !String(dbUser.id).startsWith("usr_") && sessionUser) {
    try {
      const patch: Record<string, string> = {};
      if (dbUser.passwordHash === "CLERK_AUTHENTICATED" && dbUser.authProvider !== "google") {
        patch.authProvider = "google";
      }
      if (dbUser.accountStatus !== "VERIFIED") patch.accountStatus = "VERIFIED";
      if (Object.keys(patch).length > 0) {
        dbUser = await (prisma.user as any).update({
          where: { id: dbUser.id },
          data: patch,
        });
      }
    } catch (backfillErr: any) {
      console.warn("[Auth] backfill notice:", backfillErr.message);
    }
  }

  // Record user to Google Sheet asynchronously (background cron job scans db to update spreadsheet)
  recordUserToSheet(dbUser, sessionUser).catch((err: any) => {
    console.warn("[GoogleSheets] Asynchronous Google Sheet recording notice:", err?.message || err);
  });

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

