"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageLoader from "@/components/PageLoader";
import { useAppUser } from "@/hooks/useAppUser";
import { getActiveUserEmail } from "@/lib/onboardingGuard";
import {
  TICKET_CATEGORIES,
  TICKET_STATUSES,
  ticketStatusLabel,
  ticketStatusPill,
  departmentIcon,
  DEPARTMENT_BLURBS,
} from "@/lib/supportTickets";

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

function StepRow({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, #045D6114 0%, #045D6130 100%)" }}
      >
        <span className="material-symbols-outlined text-[20px]" style={{ color: "#045D61" }}>
          {icon}
        </span>
      </span>
      <span>
        <span className="block text-sm font-bold text-on-surface">{title}</span>
        <span className="block text-xs text-on-surface-variant leading-relaxed">{desc}</span>
      </span>
    </li>
  );
}

const NEXT_STEPS = [
  { icon: "confirmation_number", title: "Ticket number issued", desc: "Instantly, on this screen and by email." },
  { icon: "mark_email_read", title: "Team replies by email", desc: "The right department picks it up." },
  { icon: "timeline", title: "Track it here", desc: "Watch the status move to Resolved." },
];

const TABS = [
  { key: "new", label: "New ticket", icon: "add_circle" },
  { key: "mine", label: "My tickets", icon: "confirmation_number" },
] as const;

export default function SupportPage() {
  const { user, isLoaded } = useAppUser();
  const email = user?.primaryEmailAddress?.emailAddress || user?.email || "";
  const [tab, setTab] = useState<"new" | "mine">("new");

  const [category, setCategory] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [created, setCreated] = useState<Ticket | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [fStatus, setFStatus] = useState("");
  const [fCategory, setFCategory] = useState("");
  const [fQuery, setFQuery] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (tab !== "mine") return;
    let cancelled = false;
    (async () => {
      const em = email || getActiveUserEmail();
      if (!em) return;
      if (!cancelled) setListLoading(true);
      try {
        const q = new URLSearchParams({ email: em });
        if (fStatus) q.set("status", fStatus);
        if (fCategory) q.set("category", fCategory);
        if (fQuery.trim()) q.set("q", fQuery.trim());
        const res = await fetch(`/api/support/tickets?${q.toString()}`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!cancelled) setTickets(data?.tickets || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, tab, email, fStatus, fCategory, fQuery]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setCreated(null);
    const em = email || getActiveUserEmail();
    if (!em) {
      setFormError("You must be signed in to open a ticket.");
      return;
    }
    if (!category) {
      setFormError("Please choose a department.");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setFormError("Subject and message are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em, category, subject: subject.trim(), message: message.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Could not submit your ticket.");
      setCreated(data.ticket);
      setCategory("");
      setSubject("");
      setMessage("");
    } catch (e: any) {
      setFormError(e?.message || "Could not submit your ticket.");
    } finally {
      setSubmitting(false);
    }
  }

  const input =
    "w-full rounded-xl border border-outline-variant px-4 py-2.5 text-sm bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition";

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
                support_agent
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Support — We&rsquo;re Here to Help
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
                Looking for help to improve your farm?
              </h1>
              <p className="text-sm md:text-[15px] text-on-surface-variant leading-relaxed max-w-2xl">
                Open a ticket and our team will respond by email. Track every
                ticket and its status here — each one carries a tracking link you
                can bookmark or share.
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex rounded-full border border-outline-variant/60 bg-surface p-1 gap-1 shadow-level-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold cursor-pointer transition-all ${
                tab === t.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "new" ? (
          created ? (
            <div className="rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1 p-6 md:p-8 max-w-2xl">
              <div className="space-y-4 text-center py-4">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-sm"
                  style={{ background: "linear-gradient(135deg, #00992425 0%, #00992445 100%)" }}
                >
                  <span className="material-symbols-outlined text-[34px]" style={{ color: "#009924" }}>
                    mark_email_read
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-on-surface">Ticket received</h2>
                  <span className="inline-block mt-2 text-sm font-bold text-primary bg-primary/10 border border-primary/25 px-3 py-1 rounded-full">
                    {created.ticketNumber}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                  Your ticket is logged. We emailed you a tracking link — it opens this ticket&rsquo;s live status.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link
                    href={`/support/tickets/${created.slug}`}
                    className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold"
                  >
                    View ticket {created.ticketNumber}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setCreated(null);
                      setTab("mine");
                    }}
                    className="px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-bold text-on-surface cursor-pointer"
                  >
                    See all my tickets
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_300px] gap-4 items-start">
              <div className="rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1 p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div>
                    <div className="flex items-baseline gap-2.5 mb-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                        1
                      </span>
                      <h3 className="font-bold text-on-surface">Which team should handle this?</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Department">
                      {TICKET_CATEGORIES.map((c) => {
                        const active = category === c;
                        return (
                          <label
                            key={c}
                            className={`flex items-center gap-3 rounded-2xl border p-3.5 cursor-pointer transition-all ${
                              active
                                ? "border-primary bg-primary/5 shadow-level-1 ring-1 ring-primary/30"
                                : "border-outline-variant/60 bg-surface hover:border-primary/40 hover:shadow-level-1"
                            }`}
                          >
                            <input
                              type="radio"
                              name="ticket-department"
                              value={c}
                              checked={active}
                              onChange={() => setCategory(c)}
                              className="sr-only"
                            />
                            <span
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{
                                background: active
                                  ? "linear-gradient(135deg, #045D6130 0%, #045D6150 100%)"
                                  : "linear-gradient(135deg, #045D6114 0%, #045D6130 100%)",
                              }}
                            >
                              <span className="material-symbols-outlined text-[22px]" style={{ color: "#045D61" }}>
                                {departmentIcon(c)}
                              </span>
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-on-surface">{c}</span>
                              <span className="block text-xs text-on-surface-variant truncate">
                                {DEPARTMENT_BLURBS[c]}
                              </span>
                            </span>
                            <span
                              className={`material-symbols-outlined text-[20px] shrink-0 transition-all ${
                                active ? "text-primary" : "text-outline-variant"
                              }`}
                            >
                              {active ? "check_circle" : "circle"}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2.5 mb-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                        2
                      </span>
                      <h3 className="font-bold text-on-surface">Describe the issue</h3>
                    </div>
                    <div className="rounded-2xl border border-outline-variant/60 bg-surface p-4 md:p-5 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-sm font-bold text-on-surface">Subject</label>
                          <span className="text-[11px] text-on-surface-variant tabular-nums">
                            {subject.length}/140
                          </span>
                        </div>
                        <input
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="e.g. Soil test results not showing"
                          maxLength={140}
                          className={input}
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-sm font-bold text-on-surface">Message</label>
                          <span className="text-[11px] text-on-surface-variant tabular-nums">
                            {message.length}/5000
                          </span>
                        </div>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="What were you doing when it happened? What did you expect? Include dates, pillar or capability names — detail gets you unstuck faster."
                          rows={6}
                          maxLength={5000}
                          className={`${input} resize-y leading-relaxed`}
                        />
                      </div>
                    </div>
                  </div>

                  {formError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
                      <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                      {formError}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-secondary text-white text-sm font-bold shadow-level-1 hover:shadow-level-2 transition-all disabled:opacity-60 cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-[18px] ${submitting ? "animate-spin" : ""}`}>
                        {submitting ? "progress_activity" : "send"}
                      </span>
                      {submitting ? "Submitting…" : "Submit ticket"}
                    </button>
                    <p className="text-xs text-on-surface-variant">
                      You&rsquo;ll get an email with your ticket number and tracking link.
                    </p>
                  </div>
                </form>
              </div>
              <aside className="rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1 p-6 space-y-4 lg:sticky lg:top-4">
                <h3 className="font-bold text-on-surface">What happens next</h3>
                <ol className="space-y-3.5">
                  {NEXT_STEPS.map((step) => (
                    <StepRow key={step.title} icon={step.icon} title={step.title} desc={step.desc} />
                  ))}
                </ol>
                <div className="h-px bg-outline-variant/40" />
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Urgent and blocking your farm work? Mention it first in your message so it gets triaged faster.
                </p>
              </aside>
            </div>
          )
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className={input}>
                <option value="">All statuses</option>
                {TICKET_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select value={fCategory} onChange={(e) => setFCategory(e.target.value)} className={input}>
                <option value="">All departments</option>
                {TICKET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                value={fQuery}
                onChange={(e) => setFQuery(e.target.value)}
                placeholder="Search number, subject…"
                className={input}
              />
            </div>
            {!isLoaded || listLoading ? (
              <PageLoader message="Loading your tickets…" />
            ) : tickets.length === 0 ? (
              <p className="text-sm text-on-surface-variant rounded-2xl border border-dashed border-outline-variant p-6 text-center">
                No tickets match. Open your first ticket from the New ticket tab.
              </p>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <Link
                    key={t.id}
                    href={`/support/tickets/${t.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-outline-variant/50 bg-surface shadow-level-1 hover:shadow-level-2 hover:-translate-y-0.5 transition-all p-4"
                  >
                    <span
                      className="w-11 h-11 rounded-xl hidden sm:flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #045D6114 0%, #045D6130 100%)" }}
                    >
                      <span className="material-symbols-outlined text-[22px]" style={{ color: "#045D61" }}>
                        {departmentIcon(t.category)}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-primary">
                        {t.ticketNumber} • {t.category}
                      </span>
                      <span className="block font-bold text-on-surface truncate">{t.subject}</span>
                      <span className="block text-xs text-on-surface-variant truncate">
                        {t.message} • Opened {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </span>
                    <span className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${ticketStatusPill(t.status)}`}>
                        {ticketStatusLabel(t.status)}
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                        chevron_right
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
