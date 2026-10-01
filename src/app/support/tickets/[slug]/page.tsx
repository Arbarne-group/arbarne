"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageLoader from "@/components/PageLoader";
import { useAppUser } from "@/hooks/useAppUser";
import { getActiveUserEmail } from "@/lib/onboardingGuard";
import { ticketStatusLabel, ticketStatusPill, departmentIcon } from "@/lib/supportTickets";

type Ticket = {
  id: string;
  ticketNumber: string;
  slug: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function TicketDetailPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const { user, isLoaded } = useAppUser();
  const email = user?.primaryEmailAddress?.emailAddress || user?.email || "";
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    (async () => {
      const em = email || getActiveUserEmail();
      if (!em || !slug) {
        if (!cancelled) setLoading(false);
        return;
      }
    fetch(`/api/support/tickets/${encodeURIComponent(slug)}?email=${encodeURIComponent(em)}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data?.ticket) setTicket(data.ticket);
        else if (!cancelled && data) setNotFound(true);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, email, slug]);

  return (
    <AppShell>
      <div className="max-w-[800px] mx-auto w-full px-4 md:px-10 py-8 space-y-6 pb-24">
        <Link href="/support" className="inline-flex items-center gap-1 text-sm font-bold text-primary">
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          Back to Support
        </Link>

        {loading ? (
          <PageLoader message="Loading ticket…" />
        ) : notFound || !ticket ? (
          <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-8 text-center space-y-3">
            <span className="material-symbols-outlined text-on-surface-variant text-4xl">search_off</span>
            <h1 className="text-lg font-bold text-on-surface">Ticket not found</h1>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              This tracking link may be incorrect, or the ticket belongs to a
              different account. Sign in with the account that opened it.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(135deg, #045D6114 0%, transparent 60%)" }}
              />
              <div className="relative p-6 md:p-8 flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl hidden sm:flex items-center justify-center shrink-0 shadow-sm"
                  style={{ background: "linear-gradient(135deg, #045D6125 0%, #045D6145 100%)" }}
                >
                  <span className="material-symbols-outlined text-[30px] drop-shadow-sm" style={{ color: "#045D61" }}>
                    {departmentIcon(ticket.category)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">
                      {ticket.ticketNumber} • {ticket.category}
                    </p>
                    <span className={`shrink-0 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${ticketStatusPill(ticket.status)}`}>
                      {ticketStatusLabel(ticket.status)}
                    </span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-on-surface mt-1">
                    {ticket.subject}
                  </h1>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1 p-6 md:p-8 space-y-5">
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                {ticket.message}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-xl bg-surface-container px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Opened</p>
                  <p className="text-sm font-semibold text-on-surface">{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-surface-container px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Last update</p>
                  <p className="text-sm font-semibold text-on-surface">{new Date(ticket.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant rounded-xl bg-surface-container p-3 flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0">mark_email_read</span>
                Our team replies by email. Keep your tracking email safe — its link always opens this page with the latest status.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
