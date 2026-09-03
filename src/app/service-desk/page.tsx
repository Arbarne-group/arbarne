"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

export default function ServiceDeskPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    farmLocation: "Kiambu / Highlands Zone",
    preferredDate: "2026-09-12",
    details: "",
    urgency: "Normal (3-5 Days)",
  });

  const services = [
    {
      id: "agronomy-consult",
      title: "On-Farm Agronomist Inspection",
      icon: "biotech",
      category: "Agronomy & Crop Health",
      turnaround: "24-48 Hours",
      price: "$60 / Visit",
      desc: "Licensed agronomist conducts physical scouting for pests, fungal blights, nutrient deficiencies, and provides tailored chemical/organic prescriptions.",
    },
    {
      id: "soil-testing",
      title: "Lab Soil & Irrigation Water Analysis",
      icon: "science",
      category: "Laboratory Diagnostics",
      turnaround: "3 Days",
      price: "$45 / Sample",
      desc: "Full lab breakdown of N-P-K, organic carbon, pH, electrical conductivity, heavy metals, and tailor-made fertilizer blending recommendations.",
    },
    {
      id: "cold-transport",
      title: "Refrigerated Transport Dispatch",
      icon: "local_shipping",
      category: "Post-Harvest Logistics",
      turnaround: "Same-Day Booking",
      price: "From $1.20 / Km",
      desc: "3-ton to 10-ton reefer trucks maintaining continuous 4°C to 8°C cold chains from farm gate directly to airport or regional wholesale markets.",
    },
    {
      id: "recruitment",
      title: "Farm Manager & Supervisor Placement",
      icon: "person_search",
      category: "Talent & Staffing",
      turnaround: "1-2 Weeks",
      price: "Retained Search",
      desc: "Source, screen, and vet experienced farm managers, irrigation technicians, and post-harvest quality controllers tailored to your crop enterprise.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setSelectedService(null);
      alert("Service request logged! Our dispatcher will contact your registered phone number via WhatsApp / Call.");
    }, 1500);
  };

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-variant pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-sm fill">support_agent</span>
              <span>On-Demand Agricultural Services</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface">
              Service Desk &amp; Field Support
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mt-1">
              Book verified agronomy specialists, certified laboratory testing, cold logistics, and talent directly to your farm gate.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              <span>Response Time: &lt; 2 Hours</span>
            </span>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">
                      {svc.icon}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-primary block">
                      {svc.price}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Turnaround: {svc.turnaround}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                  {svc.category}
                </span>

                <h3 className="text-lg font-bold text-on-surface mb-2">
                  {svc.title}
                </h3>

                <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                  {svc.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedService(svc.title)}
                className="w-full py-3 px-4 rounded-xl bg-surface-container-high hover:bg-primary hover:text-white text-on-surface font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request This Service</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>

        {/* Recent Service History / In-Flight Requests */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <h3 className="text-base font-bold text-on-surface mb-4">
            Recent Farm Service Logs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-surface-variant/60 text-on-surface-variant font-semibold">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Requested For</th>
                  <th className="py-3 px-4">Assigned Expert</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/30 text-on-surface font-medium">
                <tr>
                  <td className="py-3.5 px-4 font-mono text-primary">#SRV-8821</td>
                  <td className="py-3.5 px-4">Soil &amp; Micronutrient Test</td>
                  <td className="py-3.5 px-4">Aug 28, 2026</td>
                  <td className="py-3.5 px-4">CropLab East Africa</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      Report Delivered
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono text-primary">#SRV-8104</td>
                  <td className="py-3.5 px-4">Drip Telemetry Calibration</td>
                  <td className="py-3.5 px-4">Aug 14, 2026</td>
                  <td className="py-3.5 px-4">SmartWater Solutions</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Booking Form */}
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-surface-variant animate-fade-in-up">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-primary uppercase">
                    Dispatch Request
                  </span>
                  <h3 className="text-xl font-bold text-on-surface mt-0.5">
                    {selectedService}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Farm Location / Nearest Landmark
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.farmLocation}
                    onChange={(e) =>
                      setFormData({ ...formData, farmLocation: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.preferredDate}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredDate: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">
                      Urgency
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) =>
                        setFormData({ ...formData, urgency: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option>Normal (3-5 Days)</option>
                      <option>Urgent (Within 48h)</option>
                      <option>Emergency (Today)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Specific Farm Issues or Instructions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe crop symptoms, hectares to inspect, or sample quantity..."
                    value={formData.details}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface bg-surface focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="flex-1 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requestSubmitted}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all btn-shadow flex items-center justify-center gap-1.5"
                  >
                    {requestSubmitted ? (
                      <span>Dispatching Request...</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">send</span>
                        <span>Confirm Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
