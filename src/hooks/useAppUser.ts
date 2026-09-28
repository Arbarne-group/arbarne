"use client";

import { useSession, signOut as authSignOut } from "next-auth/react";
import { useMemo } from "react";
import { clearLocalAppData } from "@/lib/onboardingGuard";

export interface AppUser {
  id?: string;
  email?: string;
  primaryEmailAddress?: { emailAddress?: string };
  emailAddresses?: Array<{ emailAddress?: string }>;
  phoneNumbers?: Array<{ phoneNumber?: string }>;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string;
}

/**
 * Drop-in replacement for Clerk's useUser(): exposes the signed-in user in
 * a Clerk-compatible shape backed by the Auth.js session.
 *
 * The returned user object is referentially stable across renders (memoized
 * on the session) — effects depending on it must NOT refetch in a loop.
 */
export function useAppUser(): { user: AppUser | null; isLoaded: boolean } {
  const { data: session, status } = useSession();
  return useMemo(() => {
    if (status === "loading") return { user: null, isLoaded: false };
    const su: any = (session as any)?.user;
    if (!su?.email) return { user: null, isLoaded: true };
    const email: string = su.email;
    const fullName: string | null = su.name ?? null;
    const parts = (fullName || "").split(/\s+/).filter(Boolean);
    return {
      user: {
        id: su.id,
        email,
        primaryEmailAddress: { emailAddress: email },
        emailAddresses: [{ emailAddress: email }],
        phoneNumbers: [],
        fullName,
        firstName: parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] ?? null,
        lastName: parts.length > 1 ? parts[parts.length - 1] : null,
        role: su.role,
      },
      isLoaded: true,
    };
  }, [session, status]);
}

/** Sign out of the Auth.js session, wipe local data, and go home. */
export async function appSignOut(returnTo = "/") {
  clearLocalAppData();
  await authSignOut({ callbackUrl: returnTo });
}
