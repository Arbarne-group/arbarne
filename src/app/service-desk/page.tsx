"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageLoader from "@/components/PageLoader";

type Solution = {
  id: string;
  name: string;
  tagline?: string | null;
  description: string;
  category?: string | null;
  contact?: string | null;
  linkUrl?: string | null;
};

export default function SolutionsHubPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/solutions", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSolutions(data?.solutions || []);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  const open = solutions.find((s) => s.id === openId) || null;

  return (
    <AppShell>
      <div className="max-w-[1024px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, #045D6114 0%, transparent 60%)" }}
          />
          <div className="relative p-6 md:p-8 flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #045D6125 0%, #045D6145 100%)" }}
            >
              <span className="material-symbols-outlined text-[30px] drop-shadow-sm" style={{ color: "#045D61" }}>
                handyman
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Service — Find the Right Support
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
                Looking for help to improve your farm?
              </h1>
              <p className="text-sm md:text-[15px] text-on-surface-variant leading-relaxed max-w-2xl">
                Come back to connect with services and providers that can help you
                address your farm&rsquo;s development needs.
              </p>
            </div>
          </div>
        </div>

        {/* {loading ? (
          <PageLoader message="Loading solutions…" />
        ) : solutions.length === 0 ? (
          <p className="text-sm text-on-surface-variant rounded-2xl border border-dashed border-outline-variant p-6 text-center">
            Our solutions catalogue is being prepared — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {solutions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setOpenId(s.id)}
                className="text-left rounded-2xl border border-outline-variant/50 bg-surface shadow-level-1 hover:shadow-level-2 hover:-translate-y-1 transition-all p-5 space-y-2 cursor-pointer"
              >
                {s.category && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                    {s.category}
                  </span>
                )}
                <h3 className="font-bold text-on-surface">{s.name}</h3>
                {s.tagline && (
                  <p className="text-sm text-on-surface-variant">{s.tagline}</p>
                )}
                <span className="inline-block text-sm font-bold text-primary">
                  View details →
                </span>
              </button>
            ))}
          </div>
        )} */}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
          onClick={() => setOpenId(null)}
          role="dialog"
          aria-modal="true"
          aria-label={open.name}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-surface border border-outline-variant/30 p-6 md:p-8 space-y-4 shadow-level-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                {open.category && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                    {open.category}
                  </span>
                )}
                <h2 className="text-xl font-bold text-on-surface">{open.name}</h2>
                {open.tagline && (
                  <p className="text-sm text-on-surface-variant">{open.tagline}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="Close"
                className="shrink-0 w-9 h-9 rounded-full border border-outline-variant text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
              {open.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {open.contact && (
                <a
                  href={`mailto:${open.contact}`}
                  className="flex-1 text-center px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold"
                >
                  Contact us
                </a>
              )}
              {open.linkUrl && (
                <a
                  href={open.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-bold text-on-surface"
                >
                  Learn more →
                </a>
              )}
            </div>
            {open.contact && (
              <p className="text-xs text-on-surface-variant text-center">{open.contact}</p>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
