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

type Opportunity = {
  id: string;
  title: string;
  type: string;
  partner?: string | null;
  description: string;
  capabilityIds: string;
  location?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  linkUrl?: string | null;
};

const TYPES = ["All", "event", "offer", "programme", "market", "finance"];

export default function OpportunitiesPage() {
  const { user, isLoaded } = useAppUser();
  const email = user?.primaryEmailAddress?.emailAddress || user?.email || "";
  const [answers, setAnswers] = useState<Record<string, "yes" | "no"> | null>(null);
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("All");

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
        const [aRes, oRes] = await Promise.all([
          fetch(`/api/assessment/responses?email=${encodeURIComponent(em)}`, { cache: "no-store" }),
          fetch("/api/opportunities", { cache: "no-store" }),
        ]);
        const aData = await aRes.json().catch(() => ({}));
        const oData = await oRes.json().catch(() => ({}));
        if (cancelled) return;
        setAnswers(aData?.answers && typeof aData.answers === "object" ? aData.answers : {});
        setItems(oData?.opportunities || []);
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
  const weakById = useMemo(() => new Map(weak.map((w) => [w.capabilityId, w])), [weak]);

  const filtered = useMemo(
    () => (type === "All" ? items : items.filter((o) => o.type === type)),
    [items, type]
  );
  const matched = useMemo(
    () =>
      filtered.filter((o) => {
        const ids = parseCapabilityIds(o.capabilityIds);
        return ids.length > 0 && ids.some((id) => weakIds.has(id));
      }),
    [filtered, weakIds]
  );
  const general = useMemo(
    () => filtered.filter((o) => parseCapabilityIds(o.capabilityIds).length === 0),
    [filtered]
  );

  function OppCard({ o, badge }: { o: Opportunity; badge?: string }) {
    const linked = parseCapabilityIds(o.capabilityIds)
      .map((id) => weakById.get(id)?.name)
      .filter((n): n is string => Boolean(n));
    return (
      <article className="rounded-2xl border border-outline-variant/50 bg-surface shadow-level-1 hover:shadow-level-2 transition-all p-5 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
            {o.type}
          </span>
          {badge && (
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#009924]/10 text-[#009924]">
              {badge}
            </span>
          )}
        </div>
        <h3 className="font-bold text-on-surface">{o.title}</h3>
        {o.partner && <p className="text-xs font-semibold text-on-surface-variant">by {o.partner}</p>}
        <p className="text-sm text-on-surface-variant leading-relaxed">{o.description}</p>
        {linked.length > 0 && (
          <p className="text-xs text-on-surface-variant">
            Linked to your gaps: <span className="font-semibold">{linked.join(" • ")}</span>
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          {o.location && <span className="text-xs text-on-surface-variant">{o.location}</span>}
          {o.linkUrl ? (
            <a href={o.linkUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary">
              Learn more →
            </a>
          ) : (
            <span className="text-xs font-semibold text-on-surface-variant">
              Contact us to apply
            </span>
          )}
        </div>
      </article>
    );
  }

  return (
    <AppShell>
      <div className="max-w-[1024px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, #e6510014 0%, transparent 60%)" }}
          />
          <div className="relative p-6 md:p-8 flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #e6510025 0%, #e6510045 100%)" }}
            >
              <span className="material-symbols-outlined text-[30px] drop-shadow-sm" style={{ color: "#e65100" }}>
                lightbulb
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#e65100]/10 px-3 py-1 rounded-full border border-[#e65100]/20" style={{ color: "#e65100" }}>
                Opportunity — Discover What&rsquo;s Within Reach
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
                Ready to take the next step?
              </h1>
              <p className="text-sm md:text-[15px] text-on-surface-variant leading-relaxed max-w-2xl">
                Return here to discover financing, markets, programmes,
                partnerships and other opportunities aligned with your farm&rsquo;s
                profile and readiness.
              </p>
            </div>
          </div>
        </div>

        {/* {loading ? (
          <PageLoader message="Loading opportunities…" />
        ) : totalAnswered === 0 ? (
          <div className="rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1 p-8 text-center space-y-4">
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, #e6510025 0%, #e6510045 100%)" }}
            >
              <span className="material-symbols-outlined text-[34px]" style={{ color: "#e65100" }}>
                lightbulb
              </span>
            </div>
            <h2 className="text-lg font-bold text-on-surface">Complete your assessment to unlock matches</h2>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              Opportunities are matched to the capabilities your farm falls
              short of. Finish your FFMI/24 assessment and come back — your
              personalised matches will be waiting.
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
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize cursor-pointer ${
                    type === t
                      ? "bg-primary text-white"
                      : "border border-outline-variant text-on-surface-variant"
                  }`}
                >
                  {t === "All" ? "All types" : `${t}s`}
                </button>
              ))}
            </div>

            {matched.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-base font-bold text-on-surface">
                  Matched to your gaps ({matched.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {matched.map((o) => (
                    <OppCard key={o.id} o={o} badge="Matched to you" />
                  ))}
                </div>
              </div>
            )}

            {general.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-base font-bold text-on-surface">
                  Open to everyone ({general.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {general.map((o) => (
                    <OppCard key={o.id} o={o} />
                  ))}
                </div>
              </div>
            )}

            {matched.length === 0 && general.length === 0 && (
              <p className="text-sm text-on-surface-variant rounded-2xl border border-dashed border-outline-variant p-6 text-center">
                No {type === "All" ? "" : `${type} `}opportunities right now —
                new events and partner offers are added regularly.
              </p>
            )}
          </>
        )} */}
      </div>
    </AppShell>
  );
}
