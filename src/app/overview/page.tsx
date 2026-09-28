"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppUser as useUser } from "@/hooks/useAppUser";
import AppShell from "@/components/layout/AppShell";
import FarmProfileMetadata from "@/components/FarmProfile";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

const PROMO_CARDS = [
  {
    image: "/photo8.png",
    eyebrow: "8-Pillar Diagnostic",
    title: "Know exactly where your farm stands",
    desc: "Answer guided questions across all 8 capability pillars and get a verified maturity score with tailored recommendations.",
    cta: "Start assessment",
  },
  {
    image: "/images/hero-farm-drone.jpg",
    eyebrow: "My Farm Radar",
    title: "See your farm on one living radar",
    desc: "Watch every pillar light up as you answer, benchmarked against the average Future Farm, with weak spots flagged in amber.",
    cta: "Continue assessment",
  },
  {
    image: "/photo3.png",
    eyebrow: "Transformation Roadmap",
    title: "Turn gaps into a funded action plan",
    desc: "Priority gaps become quick wins and strategic moves — matched to services, learning, grants, and buyers.",
    cta: "Take assessment",
  },
];

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
      {/* Promo: sells the assessment until it is fully complete */}
      {statusLoaded && !assessmentComplete && (
        <div className="px-4 sm:px-6 lg:px-10 pb-2 max-w-[1440px] mx-auto w-full">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
                Why assess?
              </p>
              <h2 className="mt-1 text-lg md:text-xl font-bold text-on-surface tracking-tight">
                Your farm, future-ready in three moves
              </h2>
            </div>
            <Link
              href="/assessment"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:underline shrink-0"
            >
              Open Assessment Hub
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {PROMO_CARDS.map((card) => (
              <Link
                key={card.title}
                href="/assessment"
                className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[240px] md:min-h-[260px] flex"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
                <div className="relative z-10 mt-auto p-5 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                    {card.eyebrow}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-white/80">
                    {card.desc}
                  </p>
                  <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 px-3.5 py-1.5 text-xs font-bold text-white group-hover:bg-secondary group-hover:border-secondary transition-colors">
                    {hasAnswers ? "Continue assessment" : card.cta}
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <FarmProfileMetadata />
    </AppShell>
  );
}
