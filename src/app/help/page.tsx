"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

const SECTIONS: Array<{ title: string; href: string; body: string[] }> = [
  {
    title: "Business Profile (Overview)",
    href: "/overview",
    body: [
      "Your farm's home page. It shows your profile summary, farm details and quick actions.",
      "How to use it: review your details after signup, tap Edit Profile to update anything (size, enterprises, water, markets), and use the action cards to jump into your assessment or complete your Farm Business Profile.",
    ],
  },
  {
    title: "My Future Farm (Dashboard)",
    href: "/dashboard",
    body: [
      "Your progress headquarters: maturity index, pillar radar chart and next steps.",
      "How to use it: if your Farm Business Profile is incomplete, the dashboard blurs and asks you to finish it first — the numbers are computed from it. Once complete, track your maturity here after every assessment.",
    ],
  },
  {
    title: "FFMI/24 Assessment",
    href: "/assessment",
    body: [
      "The 8-pillar farm maturity assessment — 25 questions per pillar. Answer YES or NO honestly for each question; the questionnaire autosaves as you go.",
      "How to use it: work pillar by pillar from the assessment home. Submit a pillar to unlock its summary and report. Completed pillars lock for 90 days, then you may reassess to track improvement.",
    ],
  },
  {
    title: "FFV — Verify Your Progress",
    href: "/ffv",
    body: [
      "Future Farms Verification. Every question you answered YES to appears here with guidance on what proves it.",
      "How to use it: upload a photo, scan or PDF per question plus an optional note. Each item carries a badge — Not Submitted, Submitted, Verified or Needs Review. If an item comes back as Needs Review, read the reviewer's note and upload clearer evidence; it is a chance to improve, not a penalty. Finish all uploads to clear the attention mark in the sidebar.",
    ],
  },
  {
    title: "Digital Learning",
    href: "/learning",
    body: [
      "Blogs, documents, videos and audio matched to your weakest capabilities.",
      "How to use it: complete your assessment first — materials unlock from capabilities where you scored under 60% (less than 3 out of 5). Filter by type (blog, document, video, audio). General materials stay open to everyone.",
    ],
  },
  {
    title: "Opportunity Desk",
    href: "/opportunities",
    body: [
      "Events, partner offers, programmes, markets and financing matched to your farm.",
      "How to use it: items flagged “Matched to you” target capabilities you scored under 60% — including field days and cooperative offers. Filter by type. Anything without capability links is open to everyone.",
    ],
  },
  {
    title: "Solutions Hub",
    href: "/service-desk",
    body: [
      "Everything Future Farms offers directly: farmer training, soil and water lab testing, irrigation design, cold-chain, market linkage and business setup.",
      "How to use it: browse the full catalogue and open any card for details, pricing guidance and contact information.",
    ],
  },
  {
    title: "Support tickets",
    href: "/support",
    body: [
      "Raise issues with the right team: Pillar Support, FFMI/24 Assessment, Learning, FFV, Opportunity Desk, Services Desk or a General Inquiry.",
      "How to use it: open the New ticket tab, pick a department, describe the issue and submit. You receive an email with your ticket number and a tracking link. The My tickets tab lists everything with status filters (Open, In Progress, Resolved, Closed) — open any ticket to see its live status.",
    ],
  },
  {
    title: "Account basics",
    href: "/login",
    body: [
      "Sign up with email and password or with Google. New Google accounts are verified instantly; password accounts confirm via email code.",
      "Forgot your password? Use Forgot password on the login page. To change an existing password, use Settings. Keep your profile email current — tickets, verification and assessment reports all go there.",
    ],
  },
];

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.body.join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="max-w-[1024px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface shadow-level-1">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, #045D6114 0%, transparent 60%)" }}
          />
          <div className="relative text-center max-w-2xl mx-auto space-y-4 p-6 md:p-8">
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, #045D6125 0%, #045D6145 100%)" }}
            >
              <span className="material-symbols-outlined text-[30px] drop-shadow-sm" style={{ color: "#045D61" }}>
                help
              </span>
            </div>
            <span className="inline-block text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Help Center — System Navigation
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
              How to use Future Farms
            </h1>
            <p className="text-sm md:text-[15px] text-on-surface-variant">
              What each page contains and how to navigate the system, section by
              section. Search or open a guide below — every card links straight
              to its page.
            </p>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the guide…"
              className="w-full max-w-md mx-auto rounded-xl border border-outline-variant px-4 py-2.5 text-sm bg-surface-container-lowest outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {filtered.length === 0 && (
            <p className="text-sm text-on-surface-variant text-center rounded-2xl border border-dashed border-outline-variant p-6">
              Nothing matches “{searchQuery}”. Try “assessment”, “ticket” or “verification”.
            </p>
          )}
          {filtered.map((s) => {
            const idx = SECTIONS.indexOf(s);
            const open = openIndex === idx;
            return (
              <div
                key={s.title}
                className="rounded-2xl border border-outline-variant/50 bg-surface shadow-level-1 hover:shadow-level-2 transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : idx)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer"
                >
                  <span className="font-bold text-on-surface">{s.title}</span>
                  <span className="material-symbols-outlined text-on-surface-variant shrink-0">
                    {open ? "expand_less" : "expand_more"}
                  </span>
                </button>
                {open && (
                  <div className="px-5 pb-5 space-y-2.5">
                    {s.body.map((p, i) => (
                      <p key={i} className="text-sm text-on-surface-variant leading-relaxed">
                        {p}
                      </p>
                    ))}
                    <Link
                      href={s.href}
                      className="inline-flex items-center gap-1 text-sm font-bold text-primary"
                    >
                      Open {s.title.split("(")[0].trim()}
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-on-surface-variant">
          Still stuck?{" "}
          <Link href="/support" className="font-bold text-primary">
            Open a support ticket
          </Link>{" "}
          and the team will help.
        </p>
      </div>
    </AppShell>
  );
}
