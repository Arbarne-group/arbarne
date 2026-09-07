"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

interface OpportunityItem {
  id: string;
  title: string;
  tag: string;
  category: string; // "Funding" | "Financing" | "Insurance" | "Training" | "Markets" | "Programs"
  icon: string;
  iconBg: string;
  iconColor: string;
  description: string;
  deadline: string;
  matchScore: string;
  requirements: string[];
  sponsor: string;
  fundingAmount?: string;
  ffvRequirement?: "FFV Required" | "FFV Verified";
  ffvStatusText?: string;
}

export default function OpportunityDeskPage() {
  const [activeFilter, setActiveFilter] = useState("All Opportunities");
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);
  const [showAppliedToast, setShowAppliedToast] = useState<string | null>(null);

  const filterTabs = [
    "All Opportunities",
    "Funding",
    "Financing",
    "Insurance",
    "Training",
    "Markets",
    "Programs",
  ];

  const opportunities: OpportunityItem[] = [
    {
      id: "solar-irrigation-financing",
      title: "Solar Irrigation Financing Programme",
      tag: "Financing",
      category: "Financing",
      icon: "solar_power",
      iconBg: "bg-[#FDD835]/20",
      iconColor: "text-[#FDD835]",
      description:
        "Concessional equipment financing for high-efficiency solar borehole and drip irrigation systems to eliminate generator fuel dependency and build drought resilience.",
      deadline: "31 Aug 2025",
      matchScore: "95% Match",
      sponsor: "Renewable Energy Transition Facility",
      fundingAmount: "Up to $35,000 Asset Finance",
      ffvRequirement: "FFV Required",
      ffvStatusText: "Your status: Eligible after verification",
      requirements: [
        "✓ Pillar 2 assessment completed",
        "✓ Energy Awareness ≥ Developing",
        "✓ Farm records available",
        "FFV Required",
      ],
    },
    {
      id: "premium-horticulture-buyer",
      title: "Premium Horticulture Buyer",
      tag: "Markets",
      category: "Markets",
      icon: "storefront",
      iconBg: "bg-[#43A047]/20",
      iconColor: "text-[#43A047]",
      description:
        "Contractual commercial supply partnership with premium supermarket chains and direct exporters for certified French beans and high-grade tomatoes.",
      deadline: "Rolling Intake",
      matchScore: "98% Match",
      sponsor: "East Africa Fresh Produce Aggregators",
      fundingAmount: "Guaranteed Off-take Contract",
      ffvRequirement: "FFV Verified",
      ffvStatusText: "Your farm matches this opportunity.",
      requirements: [
        "✓ Pillar 3 verified",
        "✓ Product Quality Management ≥ Established",
        "✓ Traceability ≥ Developing",
      ],
    },
    {
      id: "agri-equipment-grant",
      title: "Agri-Equipment Grant Program",
      tag: "Grant",
      category: "Funding",
      icon: "agriculture",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary",
      description:
        "Secure funding for high-efficiency irrigation systems, solar-powered processing units, and precision planting technology to maximize yield and reduce labor costs.",
      deadline: "30 Jun 2025",
      matchScore: "92% Match",
      sponsor: "African Climate Agriculture Facility",
      fundingAmount: "Up to $25,000 Grant",
      requirements: [
        "Commercial farm operating minimum 2 hectares",
        "Documented energy or water efficiency improvement plan",
        "Willingness to share operational telemetry data",
      ],
    },
    {
      id: "women-agribusiness-loan",
      title: "Women in Agribusiness Loan Scheme",
      tag: "Financing",
      category: "Financing",
      icon: "groups",
      iconBg: "bg-tertiary-container/10",
      iconColor: "text-tertiary",
      description:
        "Low-interest capital designed for female-led agricultural enterprises, featuring flexible repayment schedules aligned with seasonal harvest cycles and market fluctuations.",
      deadline: "Ongoing",
      matchScore: "88% Match",
      sponsor: "Agri-Growth Development Bank",
      fundingAmount: "$5,000 - $50,000 Loan (4.5% APR)",
      requirements: [
        "Female-led farm or minimum 50% women operational workforce",
        "Valid farm registration and bank account history for 12+ months",
        "Harvest-linked seasonal amortization schedule",
      ],
    },
    {
      id: "weather-index-insurance",
      title: "Weather Index Crop Insurance",
      tag: "Insurance",
      category: "Insurance",
      icon: "shield_with_heart",
      iconBg: "bg-secondary-container/30",
      iconColor: "text-secondary",
      description:
        "Data-driven insurance coverage that triggers automatic payouts based on local rainfall and temperature indices, protecting your investment against climate volatility.",
      deadline: "Ongoing",
      matchScore: "85% Match",
      sponsor: "Pan-African Agri-Reinsurance Consortium",
      fundingAmount: "Full Yield Coverage (Automated Satellite Payouts)",
      requirements: [
        "GPS mapped farm acreage coordinates",
        "Eligible cash crop varieties (maize, horticulture, coffee, tea)",
        "Premium subsidy eligible through FFF verification status",
      ],
    },
    {
      id: "export-readiness-training",
      title: "Export Readiness Training Program",
      tag: "Training",
      category: "Training",
      icon: "school",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary",
      description:
        "Comprehensive certification training covering GlobalGAP standards, phytosanitary requirements, and logistics management for entering high-value European and Asian markets.",
      deadline: "15 Jun 2025",
      matchScore: "80% Match",
      sponsor: "Horticultural Crops Directorate & Trade Hub",
      fundingAmount: "100% Sponsored Certification Training",
      requirements: [
        "Active production of export-suitable crop lines",
        "Completed Pillar 3 (Food Safety & Compliance) assessment",
        "Commitment to 4-week hybrid masterclass series",
      ],
    },
    {
      id: "organic-certification-support",
      title: "Organic Certification Support Program",
      tag: "Program",
      category: "Programs",
      icon: "verified",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary",
      description:
        "Technical assistance and financial subsidies to transition your farm to certified organic status, including soil testing, documentation support, and buyer matchmaking.",
      deadline: "30 Sep 2025",
      matchScore: "78% Match",
      sponsor: "East African Organic Farming Network",
      fundingAmount: "Subsidized Soil Audits & Verification",
      requirements: [
        "Elimination of synthetic pesticides for minimum 12 months",
        "Documented compost and bio-fertilizer usage logs",
        "Participation in group organic grower scheme",
      ],
    },
  ];

  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeFilter === "All Opportunities") return true;
    if (activeFilter === "Funding") return opp.category === "Funding";
    if (activeFilter === "Financing") return opp.category === "Financing";
    if (activeFilter === "Insurance") return opp.category === "Insurance";
    if (activeFilter === "Training") return opp.category === "Training";
    if (activeFilter === "Markets") return opp.category === "Markets" || opp.category === "Funding";
    if (activeFilter === "Programs") return opp.category === "Programs";
    return true;
  });

  const handleApply = (opp: OpportunityItem) => {
    setShowAppliedToast(`Application submitted for ${opp.title}! Our advisory team will follow up within 24 hours.`);
    setSelectedOpp(null);
    setTimeout(() => setShowAppliedToast(null), 5000);
  };

  return (
    <AppShell>
      <div className="flex-1 p-margin-mobile md:p-margin-desktop bg-background overflow-y-auto max-w-[1280px] mx-auto w-full pb-24">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-xl">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-background mb-1">
              Opportunities Matched For You
            </h2>
            <p className="text-on-surface-variant">
              Access a curated selection of financial and educational resources specifically matched to your farm&apos;s operational profile and growth objectives.
            </p>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-lg pb-4 border-b border-outline-variant">
          <div className="flex overflow-x-auto pb-2 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0 md:pb-0 hide-scrollbar gap-2 w-full md:w-auto">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab;
              const isPrograms = tab === "Programs";

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full font-label-sm text-label-sm transition-all cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? "bg-primary text-on-primary shadow-sm hover:shadow-md"
                      : "bg-surface border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                  }`}
                >
                  <span>{tab}</span>
                  {isPrograms && (
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setActiveFilter("All Opportunities")}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors flex-shrink-0 shadow-sm self-end md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span className="font-label-sm text-label-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Opportunity Cards Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md hover:border-primary/30 transition-all group flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`w-12 h-12 rounded-full ${opp.iconBg} flex items-center justify-center flex-shrink-0 ${opp.iconColor}`}
                >
                  <span className="material-symbols-outlined fill text-2xl">
                    {opp.icon}
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-title-md text-title-md font-bold text-on-background group-hover:text-primary transition-colors">
                      {opp.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20">
                      {opp.tag}
                    </span>
                    {opp.ffvRequirement && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        opp.ffvRequirement === "FFV Verified"
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "bg-[#d97706]/15 text-[#d97706] border border-[#d97706]/30"
                      }`}>
                        <span className="material-symbols-outlined text-[13px]">
                          {opp.ffvRequirement === "FFV Verified" ? "verified" : "pending_actions"}
                        </span>
                        {opp.ffvRequirement}
                      </span>
                    )}
                  </div>
                  {opp.ffvStatusText && (
                    <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">info</span>
                      <span>{opp.ffvStatusText}</span>
                    </p>
                  )}
                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-2 md:mb-0">
                    {opp.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 border-t border-outline-variant/30 md:border-none pt-4 md:pt-0 w-full md:w-auto">
                <div className="text-left md:text-right">
                  <p className="font-label-sm text-label-sm text-on-surface-variant/70 mb-0.5">
                    Deadline
                  </p>
                  <p className="font-body-md text-body-md font-medium text-on-background">
                    {opp.deadline}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-label-sm text-label-sm text-on-surface-variant/70 mb-0.5">
                    Match
                  </p>
                  <p className="font-title-md text-title-md font-bold text-primary">
                    {opp.matchScore}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOpp(opp)}
                  className="px-4 py-2 rounded-lg border border-primary text-primary font-label-sm text-label-sm font-semibold hover:bg-primary hover:text-on-primary transition-colors bg-surface whitespace-nowrap cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Opportunities Action */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setActiveFilter("All Opportunities")}
            className="px-6 py-3 rounded-xl border-2 border-outline-variant text-on-surface-variant font-label-sm text-label-sm font-semibold hover:border-primary hover:text-primary transition-colors bg-transparent shadow-sm cursor-pointer"
          >
            View All Opportunities
          </button>
        </div>

        {/* Opportunity Details & Application Modal */}
        {selectedOpp && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-outline-variant animate-fade-in-up">
              <div className="flex justify-between items-start mb-4 border-b border-surface-variant pb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-full ${selectedOpp.iconBg} ${selectedOpp.iconColor} flex items-center justify-center shrink-0`}
                  >
                    <span className="material-symbols-outlined fill text-2xl">
                      {selectedOpp.icon}
                    </span>
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20">
                      {selectedOpp.tag}
                    </span>
                    <h3 className="text-xl font-bold text-on-surface mt-1">
                      {selectedOpp.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Offered by: <strong>{selectedOpp.sponsor}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOpp(null)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {selectedOpp.fundingAmount && (
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 mb-3 flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant font-medium">
                    Opportunity Scope / Value
                  </span>
                  <span className="text-sm font-extrabold text-primary">
                    {selectedOpp.fundingAmount}
                  </span>
                </div>
              )}

              {selectedOpp.ffvStatusText && (
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                    <span className="text-xs font-bold text-on-surface">{selectedOpp.ffvStatusText}</span>
                  </div>
                  {selectedOpp.ffvRequirement && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                      {selectedOpp.ffvRequirement}
                    </span>
                  )}
                </div>
              )}

              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mb-5 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40">
                {selectedOpp.description}
              </p>

              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Eligibility &amp; Qualification Criteria:
                </h4>
                <ul className="space-y-2">
                  {selectedOpp.requirements.map((req, i) => (
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

              <div className="flex gap-3 pt-3 border-t border-surface-variant">
                <button
                  type="button"
                  onClick={() => setSelectedOpp(null)}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApply(selectedOpp)}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all btn-shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Apply Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast feedback */}
        {showAppliedToast && (
          <div className="fixed bottom-8 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-fade-in border border-surface-variant">
            <span className="material-symbols-outlined text-primary-fixed fill text-xl">
              check_circle
            </span>
            <span className="text-xs font-medium">{showAppliedToast}</span>
          </div>
        )}
      </div>
    </AppShell>
  );
}
