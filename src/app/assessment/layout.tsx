import { redirect } from "next/navigation";
import { getProfileGate } from "@/lib/profileGate";

/**
 * Guarding in a layout covers /assessment, /focus, /summary, /report and
 * /certificate in one place. The public QR verification page lives at
 * /verify and is unaffected.
 */
export default async function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gate = await getProfileGate();

  if (gate.locked) {
    redirect(
      `/farm-business?callbackUrl=${encodeURIComponent("/assessment")}&reason=profile-incomplete`
    );
  }

  return <>{children}</>;
}
