"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageLoader from "@/components/PageLoader";
import { useAppUser } from "@/hooks/useAppUser";
import { getActiveUserEmail } from "@/lib/onboardingGuard";
import {
  computeCapabilityGaps,
  parseCapabilityIds,
  GAP_SCORE_CUTOFF,
} from "@/lib/capabilityGaps";

type Material = {
  id: string;
  title: string;
  kind: string;
  capabilityIds: string;
  summary?: string | null;
  url?: string | null;
  duration?: string | null;
};

const KINDS = ["All", "blog", "document", "video", "audio"];

export default function LearningPage() {
  const { user, isLoaded } = useAppUser();
  const email = user?.primaryEmailAddress?.emailAddress || user?.email || "";
  const [answers, setAnswers] = useState<Record<string, "yes" | "no"> | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState("All");

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    (async () => {
      const em = email || getActiveUserEmail();
      if (!em) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const [aRes, mRes] = await Promise.all([
          fetch(`/api/assessment/responses?email=${encodeURIComponent(em)}`, { cache: "no-store" }),
          fetch("/api/learning/materials", { cache: "no-store" }),
        ]);
        const aData = await aRes.json().catch(() => ({}));
        const mData = await mRes.json().catch(() => ({}));
        if (cancelled) return;
        setAnswers(aData?.answers && typeof aData.answers === "object" ? aData.answers : {});
        setMaterials(mData?.materials || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, email]);

  const { totalAnswered, weak } = useMemo(
    () => computeCapabilityGaps(answers),
    [answers]
  );
  const weakIds = useMemo(() => new Set(weak.map((w) => w.capabilityId)), [weak]);

  const matched = useMemo(
    () =>
      materials.filter((m) => {
        if (kind !== "All" && m.kind !== kind) return false;
        const ids = parseCapabilityIds(m.capabilityIds);
        return ids.length > 0 && ids.some((id) => weakIds.has(id));
      }),
    [materials, kind, weakIds]
  );
  const general = useMemo(
    () =>
      materials.filter((m) => {
        if (kind !== "All" && m.kind !== kind) return false;
        return parseCapabilityIds(m.capabilityIds).length === 0;
      }),
    [materials, kind]
  );

  function capNames(ids: string[]): string[] {
    return ids
      .map((id) => weak.find((w) => w.capabilityId === id)?.name)
      .filter((n): n is string => Boolean(n));
  }

  return (
    <AppShell>
      <div className="max-w-[1024px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, #1b5e2014 0%, transparent 60%)" }}
          />
          <div className="relative p-6 md:p-8 flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #1b5e2025 0%, #1b5e2045 100%)" }}
            >
              <span className="material-symbols-outlined text-[30px] drop-shadow-sm" style={{ color: "#1b5e20" }}>
                school
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#1b5e20]/10 px-3 py-1 rounded-full border border-[#1b5e20]/20" style={{ color: "#1b5e20" }}>
                Learning — Build Your Capabilities
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
                Know what you need to improve?
              </h1>
              <p className="text-sm md:text-[15px] text-on-surface-variant leading-relaxed max-w-2xl">
                Come back to access learning resources designed to help you
                strengthen the capabilities identified through your FFMI/24
                assessment.
              </p>
            </div>
          </div>
        </div>

        {/* {loading ? (
          <PageLoader message="Loading your learning path…" />
        ) : totalAnswered === 0 ? (
          <div className="rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1 p-8 text-center space-y-4">
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, #1b5e2025 0%, #1b5e2045 100%)" }}
            >
              <span className="material-symbols-outlined text-[34px]" style={{ color: "#1b5e20" }}>
                school
              </span>
            </div>
            <h2 className="text-lg font-bold text-on-surface">Unlock your learning materials</h2>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              Complete your FFMI/24 assessment first. We will then unlock
              blogs, documents and media matched to the exact capabilities
              your farm falls short of.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold"
            >
              Start the assessment
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize cursor-pointer ${
                    kind === k
                      ? "bg-primary text-white"
                      : "border border-outline-variant text-on-surface-variant"
                  }`}
                >
                  {k === "All" ? "All types" : `${k}s`}
                </button>
              ))}
            </div>

            {weak.length === 0 ? (
              <div className="rounded-2xl border border-primary/25 bg-primary/5 p-8 text-center space-y-3">
                <span className="material-symbols-outlined text-primary text-4xl">verified</span>
                <h2 className="text-lg font-bold text-on-surface">Strong across the board</h2>
                <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                  No capability currently scores under {GAP_SCORE_CUTOFF}%. General
                  materials below remain open to everyone.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-base font-bold text-on-surface">
                  Your focus capabilities ({weak.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {weak.map((w) => (
                    <Link
                      key={w.capabilityId}
                      href={`/assessment/focus?pillar=${w.pillarId}`}
                      className="rounded-2xl border border-outline-variant/50 bg-surface shadow-level-1 hover:shadow-level-2 hover:-translate-y-1 transition-all p-4"
                    >
                      <p className="text-[11px] font-bold text-primary uppercase tracking-widest">
                        Pillar {w.pillarId} • {w.pillarName}
                      </p>
                      <p className="font-bold text-on-surface mt-0.5">{w.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-base font-bold text-on-surface">
                Matched to your gaps ({matched.length})
              </h2>
              {matched.length === 0 ? (
                <p className="text-sm text-on-surface-variant rounded-2xl border border-dashed border-outline-variant p-6 text-center">
                  No {kind === "All" ? "" : `${kind} `}materials matched to your gaps yet. Check back soon.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {matched.map((m) => (
                    <article
                      key={m.id}
                      className="rounded-2xl border border-outline-variant/50 bg-surface shadow-level-1 hover:shadow-level-2 transition-all p-5 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                          {m.kind}
                        </span>
                        {capNames(parseCapabilityIds(m.capabilityIds)).slice(0, 1).map((n) => (
                          <span key={n} className="text-[11px] text-on-surface-variant truncate">
                            For: {n}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-bold text-on-surface">{m.title}</h3>
                      {m.summary && (
                        <p className="text-sm text-on-surface-variant leading-relaxed">{m.summary}</p>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        {m.duration && (
                          <span className="text-xs text-on-surface-variant">{m.duration}</span>
                        )}
                        {m.url ? (
                          <a href={m.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary">
                            Open →
                          </a>
                        ) : (
                          <span className="text-xs font-semibold text-on-surface-variant">
                            Full content coming soon
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {general.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-base font-bold text-on-surface">
                  Open to everyone ({general.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {general.map((m) => (
                    <article
                      key={m.id}
                      className="rounded-2xl border border-outline-variant/50 bg-surface shadow-level-1 hover:shadow-level-2 transition-all p-5 space-y-2"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant capitalize">
                        {m.kind}
                      </span>
                      <h3 className="font-bold text-on-surface">{m.title}</h3>
                      {m.summary && (
                        <p className="text-sm text-on-surface-variant leading-relaxed">{m.summary}</p>
                      )}
                      {m.url ? (
                        <a href={m.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary">
                          Open →
                        </a>
                      ) : (
                        <span className="text-xs font-semibold text-on-surface-variant">
                          Full content coming soon
                        </span>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )} */}
      </div>
    </AppShell>
  );
}
