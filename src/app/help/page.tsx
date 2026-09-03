"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      q: "How is the 8-Pillar Farm Maturity Index calculated?",
      a: "The maturity index aggregates 40 sub-capabilities across Soil, Water, Technology, Business, Team, Climate Resilience, Market Access, and Post-Harvest. Your responses are weighted against regional benchmarks from thousands of commercial farming enterprises across East and Southern Africa to identify your tier (Emerging, Developing, Advancing, Leading).",
    },
    {
      q: "Can I pay for the assessment via M-Pesa STK push?",
      a: "Yes! During checkout, select the M-Pesa tab, verify your Kenyan phone number (+254), and tap 'Complete Payment'. A PIN prompt will appear instantly on your phone handset. Upon entering your Safaricom M-Pesa PIN, your assessment and dashboard will unlock automatically.",
    },
    {
      q: "Is my farm financial and yield data kept confidential?",
      a: "Absolutely. Future Farms adheres to strict data privacy standards. Your farm production numbers, revenues, and GPS coordinates are strictly anonymized and used only to benchmark your performance and suggest grant/market opportunities. We never sell or expose your operational data.",
    },
    {
      q: "What happens after I complete the Full Assessment?",
      a: "You immediately unlock the interactive 8-pillar Radar Chart, tailored action plans, high-priority intervention steps, and can export a formal PDF Transformation Plan to share with lenders, co-owners, or equity investors.",
    },
    {
      q: "Can I update my questionnaire responses as my farm improves?",
      a: "Yes. You can re-visit your onboarding steps or initiate a quarterly re-assessment from the Dashboard or Assessment Pricing page anytime to track your maturity index progress over the seasons.",
    },
    {
      q: "How do I apply for the grants listed in the Opportunity Desk?",
      a: "Each opportunity has clear eligibility requirements listed. Once your farm maturity matches the criteria (such as minimum acreage or verified cold storage needs), clicking 'Apply' automatically pre-fills your verified Future Farms audit score to accelerate sponsor review.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="max-w-[1024px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Knowledge Base &amp; Support
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface">
            How can we help your farm today?
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Explore guides, technical methodology, and payment troubleshooting.
          </p>

          <div className="relative max-w-lg mx-auto pt-2">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search questions, billing, radar scores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-outline-variant bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>
        </div>

        {/* Quick Topic Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm text-center">
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined">fact_check</span>
            </div>
            <h3 className="text-sm font-bold text-on-surface mb-1">
              Assessment Scoring
            </h3>
            <p className="text-xs text-on-surface-variant">
              Methodology, 8 pillars, and benchmark calculations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm text-center">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-secondary flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <h3 className="text-sm font-bold text-on-surface mb-1">
              M-Pesa &amp; Billing
            </h3>
            <p className="text-xs text-on-surface-variant">
              STK push, receipts, and currency conversions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm text-center">
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined">security</span>
            </div>
            <h3 className="text-sm font-bold text-on-surface mb-1">
              Data &amp; Privacy
            </h3>
            <p className="text-xs text-on-surface-variant">
              Encrypted storage, confidentiality, and farmer rights.
            </p>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
          <h2 className="text-lg font-bold text-on-surface mb-4">
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-surface-variant/40">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                  >
                    <span className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                      {faq.q}
                    </span>
                    <span
                      className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-xs md:text-sm text-on-surface-variant leading-relaxed pl-1 pr-4 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Callout */}
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-bold text-on-surface mb-1">
              Still have questions or need custom assistance?
            </h3>
            <p className="text-xs text-on-surface-variant">
              Our regional agricultural support team is available Monday through Saturday.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold btn-shadow hover:bg-primary/90 transition-all whitespace-nowrap"
          >
            Contact Our Support Desk
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
