"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageLoader from "@/components/PageLoader";
import { useAppUser } from "@/hooks/useAppUser";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

interface ReferralInfo {
  code: string;
  shareLink: string;
  stats: {
    visits: number;
    referred: number;
    qualified: number;
    creditEarned: number;
    creditAvailable: number;
    standardPrice: number;
    rewardPrice: number;
    saved: number;
  };
  invitedBy: {
    name: string | null;
    status: string;
    linkedAt: string;
  } | null;
  history: Array<{
    email: string;
    name: string;
    status: string;
    createdAt: string;
    qualifiedAt: string | null;
  }>;
}

export default function ReferralsPage() {
  const { user, isLoaded } = useAppUser();
  const email = user?.primaryEmailAddress?.emailAddress || user?.email || "";
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [claimCode, setClaimCode] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimMsg, setClaimMsg] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const reload = (em: string) => {
    fetch(`/api/referrals?email=${encodeURIComponent(em)}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) setInfo(data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!isLoaded) return;
    const em = email || getActiveUserEmail();
    if (!em) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetch(`/api/referrals?email=${encodeURIComponent(em)}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.success) setInfo(data);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, email]);

  const copyLink = async () => {
    if (!info?.shareLink) return;
    try {
      await navigator.clipboard.writeText(info.shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const claimInvite = async () => {
    const em = email || getActiveUserEmail();
    const code = claimCode.toUpperCase().trim();
    if (!code) {
      setClaimMsg({ ok: false, text: "Enter the invite code you were given." });
      return;
    }
    setClaiming(true);
    setClaimMsg(null);
    try {
      const res = await fetch("/api/referrals/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setClaimMsg({
          ok: false,
          text: data?.error || "Could not link that code.",
        });
        return;
      }
      setClaimMsg({ ok: true, text: data?.message || "Invite linked." });
      setClaimCode("");
      if (em) reload(em);
    } catch {
      setClaimMsg({ ok: false, text: "Could not link that code. Try again." });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-[1024px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, #00992414 0%, transparent 60%)" }}
          />
          <div className="relative p-6 md:p-8 flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #00992425 0%, #00992445 100%)" }}
            >
              <span className="material-symbols-outlined text-[30px] drop-shadow-sm" style={{ color: "#009924" }}>
                group_add
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#009924]/10 px-3 py-1 rounded-full border border-[#009924]/20" style={{ color: "#009924" }}>
                Referrals
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
                Invite farmers, earn assessment credit
              </h1>
              <p className="text-sm md:text-[15px] text-on-surface-variant leading-relaxed max-w-2xl">
                Share your link. Each invited farmer who completes an assessment earns you <strong>KES 500 credit</strong> up to{" "}
                <strong>KES 1,000 off every pillar assessment or report</strong>{" "}.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <PageLoader message="Loading your referrals…" />
        ) : !info ? (
          <p className="text-sm text-on-surface-variant rounded-2xl border border-dashed border-outline-variant p-6 text-center">
            Sign in to see your referral code and history.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {[
                { label: "Link visits", value: String(info.stats.visits ?? 0) },
                { label: "Farmers referred", value: String(info.stats.referred) },
                { label: "Qualified", value: String(info.stats.qualified) },
                {
                  label: "Credit available",
                  value: `KES ${(info.stats.creditAvailable ?? 0).toLocaleString()}`,
                },
                { label: "You have saved", value: `KES ${info.stats.saved.toLocaleString()}` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-outline-variant/50 bg-surface shadow-level-1 p-4 text-center"
                >
                  <div className="text-2xl font-black text-on-surface">{s.value}</div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1 p-6 md:p-8 space-y-3">
              <h2 className="font-bold text-on-surface">Your invite link</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  readOnly
                  value={info.shareLink}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 rounded-xl border border-outline-variant px-4 py-2.5 text-sm bg-surface-container-low outline-none"
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold cursor-pointer shrink-0"
                >
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>
              <p className="text-xs text-on-surface-variant">
                Code <span className="font-bold text-on-surface">{info.code}</span> •
                Qualified referrals earn KES 500 credit each; up to KES 1,000 of
                credit applies to every pillar assessment or report.
              </p>
              <p className="text-xs text-on-surface-variant">
                Link visits counts everyone who opened your link even if they
                haven&apos;t signed up yet. Signups appear below as
                &ldquo;Invited&rdquo; and turn &ldquo;Qualified&rdquo; once they
                complete an assessment. &ldquo;You have saved&rdquo; only counts
                discounts already used on paid assessments.
              </p>
            </div>

            {!info.invitedBy && (
              <div className="rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1 p-6 md:p-8 space-y-3">
                <h2 className="font-bold text-on-surface">Were you invited?</h2>
                <p className="text-sm text-on-surface-variant">
                  Joined by word of mouth and received someone&apos;s invite
                  code later? Enter it here to give them credit.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={claimCode}
                    onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FF-8F3K2A"
                    className="flex-1 rounded-xl border border-outline-variant px-4 py-2.5 text-sm bg-surface-container-low outline-none uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={claimInvite}
                    disabled={claiming}
                    className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold cursor-pointer shrink-0 disabled:opacity-60"
                  >
                    {claiming ? "Linking…" : "Link invite"}
                  </button>
                </div>
                {claimMsg && (
                  <p
                    className={`text-sm font-medium ${
                      claimMsg.ok ? "text-[#009924]" : "text-red-600"
                    }`}
                  >
                    {claimMsg.text}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-base font-bold text-on-surface">
                Referral history ({info.history.length})
              </h2>
              {info.history.length === 0 ? (
                <p className="text-sm text-on-surface-variant rounded-2xl border border-dashed border-outline-variant p-6 text-center">
                  No referrals yet. Share your link to get started.
                </p>
              ) : (
                <div className="space-y-2">
                  {info.history.map((h, i) => (
                    <div
                      key={`${h.email}-${i}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-outline-variant/50 bg-surface shadow-level-1 p-4"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-on-surface truncate">
                          {h.name || h.email}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          Joined {new Date(h.createdAt).toLocaleDateString()}
                          {h.qualifiedAt
                            ? ` • Qualified ${new Date(h.qualifiedAt).toLocaleDateString()}`
                            : ""}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          h.status === "qualified"
                            ? "bg-[#009924]/10 text-[#009924] border border-[#009924]/25"
                            : "bg-surface-variant text-on-surface-variant border border-outline-variant"
                        }`}
                      >
                        {h.status === "qualified" ? "Qualified" : "Invited"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
