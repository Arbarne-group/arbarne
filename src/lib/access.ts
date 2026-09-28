import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedClerkUser } from "@/lib/auth";
import { getPasswordSession } from "@/lib/session";

export const STAFF_ROLES = ["FFDeveloper", "FFAdmin", "FFStaff"];
export const SIGNUP_ROLES = ["FFFarmer", "FFFarmManager"];
export const ALL_ROLES = [...STAFF_ROLES, "FFFarmer", "FFFarmManager", "Other"];
export const FARMING_TYPES = ["LIVESTOCK", "CROP", "MIXED"];

/** Resolve the caller's DB user via Clerk session OR password session cookie. */
export async function getSessionUser() {
  try {
    const clerkUser = await getAuthenticatedClerkUser();
    if (clerkUser) {
      const primary =
        clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)
          ?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
      if (primary) {
        const dbUser = await prisma.user.findUnique({
          where: { email: primary.toLowerCase().trim() },
          include: { business: true },
        });
        if (dbUser) return { user: dbUser, method: "clerk" as const };
      }
      return { user: null, method: "clerk" as const };
    }
  } catch {}
  try {
    const session = await getPasswordSession();
    if (session) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { business: true },
      });
      if (dbUser) return { user: dbUser, method: "password" as const };
    }
  } catch {}
  return { user: null, method: null };
}

/** Require a staff role (FFDeveloper / FFAdmin / FFStaff). Returns user or an error response. */
export async function requireStaff(): Promise<{ user: any } | { response: NextResponse }> {
  const { user } = await getSessionUser();
  if (!user) {
    return { response: NextResponse.json({ error: "Unauthenticated." }, { status: 401 }) };
  }
  if (!STAFF_ROLES.includes(user.role)) {
    return { response: NextResponse.json({ error: "Forbidden: staff role required." }, { status: 403 }) };
  }
  return { user };
}

/** A profile is complete once role details + country + phone + farming type are set. Staff are exempt. */
export function needsDetails(user: any): boolean {
  if (!user) return true;
  if (user.role && ["FFDeveloper", "FFAdmin", "FFStaff"].includes(user.role)) return false;
  return !user.countryCode || !user.phone || !user.farmingType || !user.businessName;
}

export function publicUser(user: any) {
  if (!user) return null;
  const { passwordHash: _ph, ...rest } = user;
  return rest;
}
