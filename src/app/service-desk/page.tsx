"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

interface ServiceItem {
  id: string;
  title: string;
  tag: string;
  category: string; // "Agronomy & Audits" | "Lab Testing" | "Cold Logistics" | "Farm Engineering" | "Certification Support" | "Staffing & Talent"
  icon: string;
  iconBg: string;
  iconColor: string;
  description: string;
  turnaround: string;
  rate: string;
  badge: string;
  scope: string[];
}

export default function ServiceDeskPage() {
  const [activeFilter, setActiveFilter] = useState("All Services");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    farmLocation: "Kiambu / Central Highlands",
    preferredDate: "2026-09-15",
    urgency: "Normal (3-5 Days)",
    notes: "",
  });

  const filterTabs = [
    "All Services",
    "Agronomy & Audits",
    "Lab Testing",
    "Cold Logistics",
    "Farm Engineering",
    "Certification Support",
    "Staffing & Talent",
  ];

  const services: ServiceItem[] = [
    {
      id: "agronomy-inspection",
      title: "On-Farm Agronomist Inspection",
      tag: "Agronomy",
      category: "Agronomy & Audits",
      icon: "agriculture",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary",
      description:
        "Licensed agronomist conducts physical scouting for pests, fungal blights, nutrient deficiencies, and provides tailored chemical and organic prescriptions.",
      turnaround: "24-48 Hours",
      rate: "$60 / Visit",
      badge: "High Demand",
      scope: [
        "In-field disease and pest diagnostic scouting",
        "Soil moisture and canopy health physical audit",
        "Prescription schedule for biological/chemical controls",
        "Actionable field report delivered within 24 hours",
      ],
    },
    {
      id: "soil-water-analysis",
      title: "Lab Soil & Irrigation Water Analysis",
      tag: "Lab Testing",
      category: "Lab Testing",
      icon: "science",
      iconBg: "bg-tertiary-container/10",
      iconColor: "text-tertiary",
      description:
        "Full laboratory breakdown of N-P-K, organic carbon, pH, electrical conductivity, micro-nutrients, and tailor-made fertilizer blending recommendations.",
      turnaround: "3-5 Days",
      rate: "$45 / Sample",
      badge: "Verified Lab",
      scope: [
        "Complete 14-parameter soil fertility analysis",
        "Irrigation salinity and heavy metal toxicity screen",
        "Crop-specific fertilizer formulation schedule",
        "Direct agronomist consultation call included",
      ],
    },
    {
      id: "cold-transport",
      title: "Refrigerated Cold Chain Transport",
      tag: "Logistics",
      category: "Cold Logistics",
      icon: "local_shipping",
      iconBg: "bg-secondary-container/30",
      iconColor: "text-secondary",
      description:
        "3-ton to 10-ton reefer trucks maintaining continuous 4°C to 8°C cold chains from farm gate directly to airport terminals or regional wholesale packhouses.",
      turnaround: "Same-Day Booking",
      rate: "From $1.20 / Km",
      badge: "GPS Monitored",
      scope: [
        "Continuous 4°C-8°C temperature logging",
        "Sanitized food-grade stainless steel cargo bays",
        "Direct airport clearance and packhouse handover",
        "Real-time GPS dispatch tracking link",
      ],
    },
    {
      id: "solar-irrigation-audit",
      title: "Renewable Energy & Irrigation Diagnostic",
      tag: "Engineering",
      category: "Farm Engineering",
      icon: "solar_power",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary",
      description:
        "Field engineering assessment to size off-grid solar pumping, calculate hydraulic water pressure curves, and design telemetry-enabled drip systems.",
      turnaround: "48 Hours",
      rate: "$80 / Farm Audit",
      badge: "Efficiency Focus",
      scope: [
        "Solar irradiance and pump power load calculation",
        "Drip zone hydraulic pressure loss testing",
        "Payback period & ROI comparison vs diesel generator",
        "Supplier bill of quantities (BOQ) review",
      ],
    },
    {
      id: "globalgap-mock-audit",
      title: "GlobalGAP & Compliance Mock Audit",
      tag: "Certification",
      category: "Certification Support",
      icon: "verified",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary",
      description:
        "Pre-assessment field audit by certified compliance inspectors to review chemical storage, worker safety protocols, and hygiene records ahead of official export audits.",
      turnaround: "1 Week",
      rate: "$120 / Audit",
      badge: "Audit Ready",
      scope: [
        "Mock inspection matching official GlobalGAP IFA standards",
        "Spray logbook, chemical store & PPE compliance check",
        "Traceability system and harvest hygiene review",
        "Actionable non-conformance correction list",
      ],
    },
    {
      id: "farm-talent-sourcing",
      title: "Farm Manager & Technical Talent Sourcing",
      tag: "Staffing",
      category: "Staffing & Talent",
      icon: "groups",
      iconBg: "bg-tertiary-container/10",
      iconColor: "text-tertiary",
      description:
        "Source, screen, and vet qualified farm managers, greenhouse supervisors, and irrigation technicians specialized in your crop enterprise.",
      turnaround: "1-2 Weeks",
      rate: "Custom Retainer",
      badge: "Vetted Talent",
      scope: [
        "Candidate background and practical skill verification",
        "Crop-specific experience matching",
        "Structured interview screening and references",
        "90-day placement performance guarantee",
      ],
    },
  ];

  const filteredServices = services.filter((svc) => {
    if (activeFilter === "All Services") return true;
    return svc.category === activeFilter;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    setShowToast(`Service request booked for "${selectedService.title}"! A dispatch officer will contact you within 2 hours.`);
    setSelectedService(null);
    setTimeout(() => setShowToast(null), 5000);
  };

  return (
    <AppShell>
      <div className="flex-1 p-margin-mobile md:p-margin-desktop bg-background overflow-y-auto max-w-[1280px] mx-auto w-full pb-24">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-xl">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-background mb-1">
              Service Desk &amp; Field Support
            </h2>
            <p className="text-on-surface-variant">
              Access verified agronomists, certified soil and water laboratory diagnostics, cold-chain logistics, and specialized field engineering matched to your farm.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse" />
              <span>Response Time: &lt; 2 Hours</span>
            </span>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-lg pb-4 border-b border-outline-variant">
          <div className="flex overflow-x-auto pb-2 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0 md:pb-0 hide-scrollbar gap-2 w-full md:w-auto">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab;

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
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setActiveFilter("All Services")}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors flex-shrink-0 shadow-sm self-end md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span className="font-label-sm text-label-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredServices.map((svc) => (
            <div
              key={svc.id}
              className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/50 hover:shadow-md hover:border-primary/30 transition-all group flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`w-12 h-12 rounded-full ${svc.iconBg} flex items-center justify-center flex-shrink-0 ${svc.iconColor}`}
                >
                  <span className="material-symbols-outlined fill text-2xl">
                    {svc.icon}
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-title-md text-title-md font-bold text-on-background group-hover:text-primary transition-colors">
                      {svc.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20">
                      {svc.tag}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-2 md:mb-0">
                    {svc.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 border-t border-outline-variant/30 md:border-none pt-4 md:pt-0 w-full md:w-auto">
                <div className="text-left md:text-right">
                  <p className="font-label-sm text-label-sm text-on-surface-variant/70 mb-0.5">
                    Turnaround
                  </p>
                  <p className="font-body-md text-body-md font-medium text-on-background">
                    {svc.turnaround}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-label-sm text-label-sm text-on-surface-variant/70 mb-0.5">
                    Standard Rate
                  </p>
                  <p className="font-title-md text-title-md font-bold text-primary">
                    {svc.rate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedService(svc)}
                  className="px-4 py-2 rounded-lg border border-primary text-primary font-label-sm text-label-sm font-semibold hover:bg-primary hover:text-on-primary transition-colors bg-surface whitespace-nowrap cursor-pointer"
                >
                  Request Service
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Services Action */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setActiveFilter("All Services")}
            className="px-6 py-3 rounded-xl border-2 border-outline-variant text-on-surface-variant font-label-sm text-label-sm font-semibold hover:border-primary hover:text-primary transition-colors bg-transparent shadow-sm cursor-pointer"
          >
            View All Services
          </button>
        </div>

        {/* Recent Farm Service Logs */}
        <div className="mt-12 bg-surface rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-title-md text-base md:text-lg font-bold text-on-surface">
                Recent Farm Service Tickets
              </h3>
              <p className="text-xs text-on-surface-variant">
                Track status and dispatched officers for your farm&apos;s active service orders.
              </p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              2 Active Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-surface-variant text-on-surface-variant font-bold">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Service Name</th>
                  <th className="py-3 px-4">Requested Date</th>
                  <th className="py-3 px-4">Assigned Specialist</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/40">
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-primary">#SRV-2026-089</td>
                  <td className="py-3 px-4 font-semibold text-on-surface">Lab Soil &amp; Irrigation Water Analysis</td>
                  <td className="py-3 px-4 text-on-surface-variant">04 Sep 2026</td>
                  <td className="py-3 px-4 text-on-surface-variant">Dr. E. Muthoni (Agronomist)</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Sample in Testing
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-primary">#SRV-2026-074</td>
                  <td className="py-3 px-4 font-semibold text-on-surface">Renewable Energy &amp; Irrigation Diagnostic</td>
                  <td className="py-3 px-4 text-on-surface-variant">28 Aug 2026</td>
                  <td className="py-3 px-4 text-on-surface-variant">Eng. J. Otieno (Field Engineer)</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      Completed &amp; Report Sent
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Booking Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-outline-variant animate-fade-in-up">
              <div className="flex justify-between items-start mb-4 border-b border-surface-variant pb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-full ${selectedService.iconBg} ${selectedService.iconColor} flex items-center justify-center shrink-0`}
                  >
                    <span className="material-symbols-outlined fill text-2xl">
                      {selectedService.icon}
                    </span>
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20">
                      {selectedService.tag}
                    </span>
                    <h3 className="text-xl font-bold text-on-surface mt-1">
                      {selectedService.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Standard Rate: <strong className="text-primary">{selectedService.rate}</strong> • Turnaround: {selectedService.turnaround}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4 mb-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-2">
                    Included Service Deliverables:
                  </h4>
                  <ul className="space-y-1.5 mb-4">
                    {selectedService.scope.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined text-primary text-[15px] shrink-0 fill mt-0.5">
                          check_circle
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">
                      Farm Location / Zone
                    </label>
                    <input
                      type="text"
                      value={formData.farmLocation}
                      onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                      required
                      className="w-full text-xs p-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      required
                      className="w-full text-xs p-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Special Instructions / Symptoms
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe crop symptoms, acreage size, sample counts, or specific challenges..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-primary"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-surface-variant">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="flex-1 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all btn-shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Confirm &amp; Book Service</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-8 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-fade-in border border-surface-variant">
            <span className="material-symbols-outlined text-primary-fixed fill text-xl">
              check_circle
            </span>
            <span className="text-xs font-medium">{showToast}</span>
          </div>
        )}
      </div>
    </AppShell>
  );
}
