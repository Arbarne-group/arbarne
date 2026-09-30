import { unstable_rethrow } from "next/navigation";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { getBusinessProfileStatus } from "@/lib/businessProfile";
import { STAFF_ROLES } from "@/lib/access";

export interface ProfileGate {
  locked: boolean;
  percent: number;
  missing: { key: string; label: string }[];
}

const OPEN: ProfileGate = { locked: false, percent: 100, missing: [] };

/**
 * Server-side check for the "finish your Farm Business Profile" lock.
 *
 * The assessment is scored against the profile, so an incomplete profile
 * makes the results meaningless, that is why /assessment is closed off
 * until it is done.
 *
 * This deliberately FAILS OPEN: only a profile we positively know is
 * incomplete locks the route. A database hiccup must never lock every
 * farmer out of the product.
 */
export async function getProfileGate(): Promise<ProfileGate> {
  try {
    const user = await getOrCreateCurrentUser();
    if (!user) return OPEN;

    const role = String((user as { role?: unknown })?.role || "");
    if (STAFF_ROLES.includes(role)) return OPEN;

    const status = getBusinessProfileStatus(user);
    if (status.complete) return OPEN;

    return { locked: true, percent: status.percent, missing: status.missing };
  } catch (err) {
    // Never swallow the framework's own control-flow errors (the dynamic-API
    // marker auth() triggers, redirect(), notFound()). Only genuine
    // application failures fall open.
    unstable_rethrow(err);
    console.warn("[profileGate] check failed, allowing access:", err);
    return OPEN;
  }
}
