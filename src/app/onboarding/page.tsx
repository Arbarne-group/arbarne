import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/access";
import SurveyClient from "./SurveyClient";

/**
 * Server gate: profiles missing account details bounce to /complete-profile
 * BEFORE anything paints. Everyone else roams freely.
 */
export default async function OnboardingPage() {
  const { user } = await getSessionUser();
  if (user) {
    // Staff roam freely (no farmer details or survey funnel for them).
    if (user.role && ["FFDeveloper", "FFAdmin", "FFStaff"].includes(user.role)) {
      return <SurveyClient />;
    }
    if (!user.countryCode || !user.phone || !user.farmingType || !user.businessName) {
      redirect("/complete-profile");
    }
  }
  return <SurveyClient />;
}
