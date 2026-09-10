"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ComingSoonConfig {
  title: string;
  badge: string;
  icon: string;
  themeColor: string;
  gradientHeader: string;
  badgeStyle: string;
  iconBoxStyle: string;
  tagline: string;
  description: string;
  features: {
    icon: string;
    label: string;
    detail: string;
  }[];
}

const MODULE_CONFIGS: Record<string, ComingSoonConfig> = {
  "/learning": {
    title: "Digital Learning & Masterclasses",
    badge: "Feature Coming Soon",
    icon: "school",
    themeColor: "#1b5e20",
    gradientHeader: "from-emerald-500/20 via-primary/10 to-transparent",
    badgeStyle: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    iconBoxStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    tagline: "Curated Agronomy & Water Engineering Courses",
    description:
      "We are finalizing interactive video masterclasses, precision fertigation toolkits, and GlobalGAP export certification modules for the upcoming platform release.",
    features: [
      {
        icon: "play_lesson",
        label: "Expert Video Curricula",
        detail: "Step-by-step masterclasses on solar drip telemetry and fertigation cycles.",
      },
      {
        icon: "verified",
        label: "Verified Credentials",
        detail: "Digital certificates recognized by commercial off-takers and financial institutions.",
      },
      {
        icon: "download",
        label: "Field-Ready Toolkits",
        detail: "Downloadable spray calendars, audit prep checklists, and soil sensor guides.",
      },
    ],
  },
  "/opportunities": {
    title: "Opportunity Desk & Ag-Financing",
    badge: "Feature Coming Soon",
    icon: "lightbulb",
    themeColor: "#e65100",
    gradientHeader: "from-amber-500/20 via-yellow-500/10 to-transparent",
    badgeStyle: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    iconBoxStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    tagline: "Concessional Grants & Equipment Financing",
    description:
      "We are completing agreements with development finance partners, climate funds, and commercial off-takers to bring low-interest asset financing and export contracts directly to your farm.",
    features: [
      {
        icon: "solar_power",
        label: "Solar Irrigation Matching Grants",
        detail: "Up to $35,000 in concessional asset financing for borehole and drip installations.",
      },
      {
        icon: "handshake",
        label: "Guaranteed Off-Take Contracts",
        detail: "Direct connection to institutional European and regional supermarket off-takers.",
      },
      {
        icon: "security",
        label: "Indexed Crop Insurance",
        detail: "Satellite-monitored drought and rainfall protection policies for smallholders.",
      },
    ],
  },
  "/service-desk": {
    title: "Service Desk & Field Support",
    badge: "Feature Coming Soon",
    icon: "support_agent",
    themeColor: "#0277bd",
    gradientHeader: "from-blue-500/20 via-cyan-500/10 to-transparent",
    badgeStyle: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
    iconBoxStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    tagline: "Rapid Dispatch Agronomists & Lab Testing",
    description:
      "Our verified regional provider network of certified field agronomists, soil chemistry laboratories, and cold-chain transport providers is currently being onboarded.",
    features: [
      {
        icon: "nature_people",
        label: "24-48hr Agronomist Scouting",
        detail: "In-field disease scouting, canopy health evaluation, and prescription spray schedules.",
      },
      {
        icon: "biotech",
        label: "Certified Soil & Water Labs",
        detail: "Fast-turnaround NPK assays, micronutrient balances, and water pathogen testing.",
      },
      {
        icon: "ac_unit",
        label: "Cold Storage Logistics",
        detail: "Packhouse pre-cooling, solar cold hub bookings, and refrigerated transit dispatch.",
      },
    ],
  },
};

interface ComingSoonModalProps {
  pathname: string;
}

export default function ComingSoonModal({ pathname }: ComingSoonModalProps) {
  const router = useRouter();
  const [minimized, setMinimized] = useState(false);

  const config = MODULE_CONFIGS[pathname];
  if (!config) return null;

  return (
    <>
      {/* If minimized to banner, keep persistent top notification while still completely blocking page interaction */}
      {minimized ? (
        <div className="fixed top-20 left-0 right-0 z-50 px-4 md:px-8 py-3 bg-surface-container-highest/95 backdrop-blur-md border-b border-outline-variant/30 shadow-md flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-on-surface">
            <span className="material-symbols-outlined text-primary text-[20px]">
              lock
            </span>
            <span className="font-semibold">{config.title} is Coming Soon.</span>
            <span className="hidden sm:inline text-on-surface-variant">
              Page elements are locked to prevent incomplete submissions.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMinimized(false)}
              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors cursor-pointer"
            >
              View Details
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-variant text-on-surface-variant transition-colors cursor-pointer"
            >
              Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* Full Backdrop Modal Window Blocking All Page Interaction */
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-fadeIn select-none"
        >
          <div className="relative w-full max-w-xl max-h-[90dvh] bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-2xl overflow-y-auto flex flex-col animate-scaleUp">
            {/* Top Glowing Header Strip */}
            <div className={`h-28 bg-gradient-to-b ${config.gradientHeader} relative flex items-center px-6 border-b border-outline-variant/20`}>
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-xs ${config.iconBoxStyle}`}
                >
                  <span className="material-symbols-outlined text-[32px]">
                    {config.icon}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${config.badgeStyle}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {config.badge}
                    </span>
                  </div>
                  <h2
                    id="coming-soon-title"
                    className="text-xl sm:text-2xl font-bold text-on-surface mt-1 tracking-tight"
                  >
                    {config.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-7 space-y-5">
              <div>
                <p className="text-sm font-semibold text-primary mb-1">
                  {config.tagline}
                </p>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {config.description}
                </p>
              </div>

              {/* What to Expect Features List */}
              <div className="bg-surface-container-low/60 rounded-2xl border border-outline-variant/20 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    auto_awesome
                  </span>
                  What&apos;s Arriving in this Module
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {config.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 mt-0.5 text-primary">
                        <span className="material-symbols-outlined text-[16px]">
                          {feat.icon}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-on-surface">
                          {feat.label}
                        </div>
                        <div className="text-[11px] text-on-surface-variant leading-normal">
                          {feat.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blocking Notice */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-high/60 border border-outline-variant/20 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                  info
                </span>
                <span>
                  Interactive elements and forms on this page are currently blocked while this module is under final preparation.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setMinimized(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface text-xs font-semibold hover:bg-surface-variant transition-colors cursor-pointer text-center"
                >
                  Preview Layout (Locked)
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/assessment")}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-highest hover:bg-surface-variant border border-outline-variant/40 text-on-surface text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    fact_check
                  </span>
                  Take Assessment
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    agriculture
                  </span>
                  Go to Farm Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
