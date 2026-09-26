"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import AppShell from "@/components/layout/AppShell";
import FarmProfileMetadata from "@/components/FarmProfile";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

export default function OverviewPage() {
  const { user: clerkUser } = useUser();
  const [hasAnswers, setHasAnswers] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [coolingDown, setCoolingDown] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  // Gate the action area until the assessment status is known
  const [statusLoaded, setStatusLoaded] = useState(false);

  useEffect(() => {
    const email =
      clerkUser?.primaryEmailAddress?.emailAddress || getActiveUserEmail();
    if (!email) return;
    fetch(`/api/assessment/responses?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        const answered =
          (data?.totalResponsesCount ?? 0) > 0 ||
          Object.keys(data?.answers || {}).length > 0;
        setHasAnswers(answered);
        setAssessmentComplete(Boolean(data?.isFullAssessmentComplete));
        const locked =
          Boolean(data?.isFullAssessmentComplete) && !data?.canReassessFull;
        setCoolingDown(locked);
        setDaysRemaining(data?.daysRemainingFull ?? 0);
      })
      .catch(console.error)
      .finally(() => setStatusLoaded(true));
  }, [clerkUser]);

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 pt-6 md:pt-8 pb-4 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-surface-container-high">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              My Farm Profile
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Overview of your farm details.
            </p>
          </div>
          {!statusLoaded ? (
            <div
              aria-hidden
              className="h-[46px] w-full sm:w-56 rounded-xl bg-surface-container-high animate-pulse"
            />
          ) : coolingDown ? (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs md:text-sm">
              <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
              <span>
                <span className="font-bold">Assessment complete.</span>{" "}
                Next assessment available
                {daysRemaining > 0
                  ? ` in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`
                  : " soon"}
                .
              </span>
            </div>
          ) : (
            <Link
              href="/assessment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-on-secondary hover:bg-primary-fixed transition-all shadow-sm hover:shadow-md font-label-sm text-label-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">
                fact_check
              </span>

              <span>{hasAnswers && !assessmentComplete ? "Continue Assessment" : "Take Farm Assessment"}</span>

              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>
          )}
        </div>
      </div>
      <FarmProfileMetadata />
    </AppShell>
  );
}
