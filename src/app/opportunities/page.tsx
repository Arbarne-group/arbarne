"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

export default function OpportunityDeskPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOpp, setSelectedOpp] = useState<any>(null);

  const tabs = [
    "All",
    "Grants & Subsidies",
    "Buyer Off-Take Contracts",
    "Carbon Credits",
    "Equipment Finance",
  ];

  const opportunities = [
    {
      id: "cold-chain-grant",
      title: "Clean Energy Cold Storage Matching Grant",
      type: "Grants & Subsidies",
      sponsor: "African Climate Agriculture Facility",
      deadline: "Oct 15, 2026",
      value: "Up to $25,000",
      location: "Kenya, Uganda, Tanzania",
      matchScore: "98% Match",
      badge: "High Eligibility",
      summary:
        "Co-financing for horticultural farms installing off-grid solar cold rooms to prevent perishability in leafy greens and avocados.",
      requirements: [
        "Commercial farm operating minimum 2 hectares",
        "Documented post-harvest losses above 15%",
        "Willingness to share temperature telemetry data",
      ],
    },
    {
      id: "supermarket-contract",
      title: "Contract Farming: Year-Round Fine Beans & Herbs",
      type: "Buyer Off-Take Contracts",
      sponsor: "Kilimo Direct Supermarket Network",
      deadline: "Rolling Intake",
      value: "$4,200 / Month Guaranteed",
      location: "East Africa Hub",
      matchScore: "94% Match",
      badge: "Guaranteed Off-Take",
      summary:
        "Long-term guaranteed purchase contract paying 35% above spot market rates for GlobalGAP-compliant export grade French beans and rosemary.",
      requirements: [
        "Traceability records for pesticide and fertilizer applications",
        "Cold chain or shaded collection point at harvest",
        "Minimum bi-weekly delivery of 800 kg",
      ],
    },
    {
      id: "carbon-sequestration",
      title: "Agroforestry & Soil Carbon Credit Pilot",
      type: "Carbon Credits",
      sponsor: "Global Carbon Agri-Trust",
      deadline: "Nov 30, 2026",
      value: "$45 / Hectare / Year",
      location: "Sub-Saharan Africa",
      matchScore: "89% Match",
      badge: "Passive Revenue",
      summary:
        "Earn verified carbon credits by adopting cover crops, minimum tillage, and boundary tree planting alongside main cash crops.",
      requirements: [
        "Zero open burning of crop residues",
        "Baseline soil organic matter test (sponsored by program)",
        "Minimum 3-year commitment to regenerative practices",
      ],
    },
    {
      id: "drip-loan",
      title: "Concessional Solar Drip Irrigation Facility",
      type: "Equipment Finance",
      sponsor: "Agri-Growth Development Bank",
      deadline: "Open All Year",
      value: "4.5% Fixed APR",
      location: "Kenya (All Counties)",
      matchScore: "91% Match",
      badge: "Low Interest",
      summary:
        "Asset-backed financing for smart drip irrigation systems, pumps, and telemetry probes with grace periods matching crop harvest cycles.",
      requirements: [
        "Farm ownership deed or minimum 3-year lease contract",
        "Access to perennial borehole or water pan",
        "Repayments timed to harvest sales cycles",
      ],
    },
  ];

  const filteredOpps = opportunities.filter((o) => {
    if (activeTab === "All") return true;
    return o.type === activeTab;
  });

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-variant pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-sm fill">lightbulb</span>
              <span>Commercial Catalysts</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface">
              Opportunity Desk
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mt-1">
              Exclusive agri-grants, buyer off-take agreements, and concessionary equipment finance matched to your maturity level.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/20">
              4 Matched to Highland Greens
            </span>
          </div>
        </div>

        {/* Quick Stats Metric Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm">
            <span className="text-xs text-on-surface-variant font-medium block mb-1">
              Total Active Capital Pool
            </span>
            <span className="text-2xl font-bold text-primary">$185,000 USD</span>
          </div>
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm">
            <span className="text-xs text-on-surface-variant font-medium block mb-1">
              Off-Take Purchase Demand
            </span>
            <span className="text-2xl font-bold text-secondary">120 Metric Tons / Mo</span>
          </div>
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-variant/40 shadow-sm">
            <span className="text-xs text-on-surface-variant font-medium block mb-1">
              Your Qualification Rating
            </span>
            <span className="text-2xl font-bold text-on-surface">High (Tier 1 Verified)</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-surface-variant/40 pb-4">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === t
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {filteredOpps.map((opp) => (
            <div
              key={opp.id}
              className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    {opp.type}
                  </span>
                  <span className="text-[11px] font-bold bg-primary-container/20 text-primary-container px-2.5 py-0.5 rounded-full">
                    {opp.matchScore}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Deadline: {opp.deadline}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-on-surface mb-2">
                  {opp.title}
                </h3>

                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mb-4 max-w-3xl">
                  {opp.summary}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      business
                    </span>
                    <span>{opp.sponsor}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      public
                    </span>
                    <span>{opp.location}</span>
                  </span>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-surface-variant/40">
                <div className="text-left md:text-right mb-0 md:mb-3">
                  <span className="text-xs text-on-surface-variant block">Value</span>
                  <span className="text-xl md:text-2xl font-bold text-primary">
                    {opp.value}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOpp(opp)}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs btn-shadow hover-lift transition-all cursor-pointer"
                >
                  View Details &amp; Apply
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Details & Application */}
        {selectedOpp && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-surface-variant animate-fade-in-up">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-primary uppercase">
                    {selectedOpp.type}
                  </span>
                  <h3 className="text-xl font-bold text-on-surface mt-1">
                    {selectedOpp.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Offered by: {selectedOpp.sponsor}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOpp(null)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant">Funding / Contract Value</span>
                  <span className="text-lg font-bold text-primary">{selectedOpp.value}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Qualification Criteria:
                </h4>
                <ul className="space-y-2">
                  {selectedOpp.requirements.map((req: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed"
                    >
                      <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5 fill">
                        check_circle
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOpp(null)}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`Application initiated for ${selectedOpp.title}! Our team will review your farm assessment and contact you within 48 hours.`);
                    setSelectedOpp(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all btn-shadow flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Submit Farm Application</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
