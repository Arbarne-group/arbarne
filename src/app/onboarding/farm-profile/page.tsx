"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default function FarmProfileReviewPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(console.error);
  }, []);

  const handleApprove = async () => {
    setApproving(true);
    try {
      await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "confirm-profile",
          email: "keziah@futurefarms.africa",
          data: {},
        }),
      });
      router.push("/onboarding");
    } catch (e) {
      console.error(e);
      router.push("/onboarding");
    } finally {
      setApproving(false);
    }
  };

  const name = user?.name || "Keziah W. Kariuki";
  const phone = user?.phone || "+254 712 345 678";
  const farmSize = user?.farmCharacteristics?.farmSize || 12.5;
  const farmUnit = user?.farmCharacteristics?.farmUnit || "Acres";
  const cultivatedAcres = user?.farmCharacteristics?.cultivatedAcres || 8.0;
  const grazingAcres = user?.farmCharacteristics?.grazingAcres || 4.5;
  const locationText = user?.farmLocation?.locationSearch || "Naivasha, Nakuru County";

  return (
    <AppShell userName={name} userRole="Farm Owner">
      <div className="w-full pt-4 pb-28 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/onboarding/household-labour"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Household &amp; Labour
          </Link>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            Farm Profile Verification
          </span>
        </div>

        {/* Header Section (Title size reduced cleanly) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-surface-container-high">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl md:text-2xl text-on-surface tracking-tight font-bold">
              My Farm Profile
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant">
              Overview of your verified farm details, crops, and support.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => alert("Summary PDF downloaded!")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:bg-surface-container text-xs font-semibold text-on-surface transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download Summary (PDF)</span>
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={approving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-sm hover:shadow-md text-xs font-semibold disabled:opacity-75"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{approving ? "Approving..." : "Approve & Complete Onboarding"}</span>
            </button>
          </div>
        </div>

        {/* Top Farmer Identity Banner */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-surface-container-high/60">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-container/15 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[32px]">person</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl text-on-surface font-bold">{name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container/10 text-primary text-xs font-semibold">
                  Farm Owner
                </span>
              </div>
              <span className="text-on-surface-variant text-xs md:text-sm mt-0.5">{locationText}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-on-surface">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">phone_iphone</span>
              <div>
                <span className="text-[11px] text-on-surface-variant block">Phone Number</span>
                <span className="font-semibold">{phone}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">landscape</span>
              <div>
                <span className="text-[11px] text-on-surface-variant block">Total Land Size</span>
                <span className="font-semibold">{farmSize} {farmUnit}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">water_drop</span>
              <div>
                <span className="text-[11px] text-on-surface-variant block">Water Supply</span>
                <span className="font-semibold text-primary">Reliable Solar Borehole</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Left Column: Land, Crops, Markets (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Card 1: What You Grow & Produce */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/60">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">agriculture</span>
                </div>
                <div>
                  <h3 className="text-sm md:text-base text-on-surface font-semibold">What You Grow &amp; Produce</h3>
                  <p className="text-xs text-on-surface-variant">Your ongoing crop farming and dairy livestock</p>
                </div>
              </div>
              <div className="flex flex-col gap-3.5">
                {/* Produce Item 1 */}
                <div className="p-4 rounded-xl bg-surface-container-low flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">spa</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm text-on-surface font-semibold">Vegetables &amp; Horticulture</span>
                      <span className="text-xs text-on-surface-variant mt-0.5">Export French Beans &amp; determinate field tomatoes</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container-highest text-on-surface text-xs font-bold shrink-0">
                    5.5 Acres
                  </span>
                </div>
                {/* Produce Item 2 */}
                <div className="p-4 rounded-xl bg-surface-container-low flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">grain</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm text-on-surface font-semibold">Maize &amp; Rhodes Grass</span>
                      <span className="text-xs text-on-surface-variant mt-0.5">Dual-season grain and dairy animal fodder</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container-highest text-on-surface text-xs font-bold shrink-0">
                    2.5 Acres
                  </span>
                </div>
                {/* Produce Item 3 */}
                <div className="p-4 rounded-xl bg-surface-container-low flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">pets</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm text-on-surface font-semibold">Dairy Cows</span>
                      <span className="text-xs text-on-surface-variant mt-0.5">4 Friesian cows producing an average of ~62 Litres/day</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-bold shrink-0">
                    4 Head
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Land & Water Setup */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/60">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">water_drop</span>
                </div>
                <div>
                  <h3 className="text-sm md:text-base text-on-surface font-semibold">Land &amp; Water</h3>
                  <p className="text-xs text-on-surface-variant">Total acreage and irrigation status</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1">
                  <span className="text-xs text-on-surface-variant uppercase font-semibold">Total Land Use</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-on-surface">{farmSize}</span>
                    <span className="text-xs text-on-surface-variant">Gross {farmUnit}</span>
                  </div>
                  <div className="mt-3 pt-2 flex flex-col gap-1.5 text-xs text-on-surface-variant border-t border-surface-container-high/60">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                        Cultivated Crops
                      </span>
                      <span className="font-semibold text-on-surface">{cultivatedAcres} {farmUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                        Pasture &amp; Resting
                      </span>
                      <span className="font-semibold text-on-surface">{grazingAcres} {farmUnit}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-on-surface-variant uppercase font-semibold">Water Source</span>
                    <span className="text-sm md:text-base text-on-surface font-bold mt-1">Solar Borehole &amp; Rain Dam</span>
                    <p className="text-xs text-on-surface-variant mt-1">
                      15,000 Litres storage tank with pressurized drip lines installed across crop fields.
                    </p>
                  </div>
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-container/15 text-primary text-xs font-semibold">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Reliable Year-Round
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Location & Support (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Farm Location & Map */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high/60 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">distance</span>
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base text-on-surface font-semibold">Farm Location &amp; Map</h3>
                    <p className="text-xs text-on-surface-variant">Naivasha, Nakuru County • Longonot Foothills</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container/10 text-primary text-xs font-semibold shrink-0">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Boundary Verified
                </span>
              </div>

              {/* Styled Vector Map Preview */}
              <div className="relative w-full h-56 rounded-xl overflow-hidden border border-surface-container-high/60 bg-[#f4f3f0] shadow-inner select-none">
                <svg className="w-full h-full object-cover" viewBox="0 0 460 224" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="pin-shadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.35" />
                    </filter>
                    <filter id="pill-shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.2" />
                    </filter>
                  </defs>
                  <rect width="100%" height="100%" fill="#f5f4f0" />
                  <path d="M-20 40 C60 20, 110 50, 180 30 C250 10, 320 40, 480 15 L480 0 L-20 0 Z" fill="#e8ece5" />
                  <polygon points="-20,130 90,120 140,210 20,240" fill="#e5edd9" fillOpacity="0.8" />
                  <polygon points="120,-10 280,-10 320,80 160,75" fill="#ebf3e2" fillOpacity="0.7" />
                  <polygon points="320,60 480,40 480,190 310,170" fill="#d9ecc8" fillOpacity="0.75" />
                  <polygon points="130,224 230,170 330,224" fill="#f0eee6" />
                  <path d="M -20 170 Q 140 160 240 115 T 480 85" stroke="#ffffff" strokeWidth="16" strokeLinecap="square" />
                  <path d="M -20 170 Q 140 160 240 115 T 480 85" stroke="#fce588" strokeWidth="10" strokeLinecap="square" />
                  <path d="M 160 230 L 195 145 L 260 -10" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
                  <path d="M 160 230 L 195 145 L 260 -10" stroke="#fdfcf7" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 195 145 L 360 175 L 430 200" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 195 145 L 360 175 L 430 200" stroke="#fdfcf7" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 20 -10 L 45 75 L 140 100" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
                  <path d="M 20 -10 L 45 75 L 140 100" stroke="#f5f4ef" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 330 65 L 400 -10" stroke="#ffffff" strokeWidth="5" />
                  <polygon points="165,55 310,48 335,138 235,152 152,118" fill="#16a34a" fillOpacity="0.24" stroke="#15803d" strokeWidth="2.5" strokeLinejoin="round" />
                  <polygon points="170,59 248,53 242,108 175,104" fill="#15803d" fillOpacity="0.12" stroke="#15803d" strokeWidth="1" strokeDasharray="3 3" />
                  <g opacity="0.75" transform="translate(50, 153) rotate(-6)">
                    <text x="0" y="0" fill="#8c8475" fontSize="8.5" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.05em">OLD NAIVASHA RD</text>
                  </g>
                  <g opacity="0.8" transform="translate(310, 102) rotate(-13)">
                    <text x="0" y="0" fill="#837c6d" fontSize="8.5" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.05em">MAI MAHIU HWY</text>
                  </g>
                  <g filter="url(#pin-shadow)">
                    <g transform="translate(232, 70)">
                      <path d="M12 0C5.37 0 0 5.37 0 12C0 20.25 10.5 30.75 11.05 31.3C11.55 31.8 12.45 31.8 12.95 31.3C13.5 30.75 24 20.25 24 12C24 5.37 18.63 0 12 0Z" fill="#ea4335" />
                      <circle cx="12" cy="11" r="5.5" fill="#ffffff" />
                      <circle cx="12" cy="11" r="3.5" fill="#b31412" />
                    </g>
                  </g>
                  <g filter="url(#pill-shadow)" transform="translate(182, 40)">
                    <rect x="0" y="0" width="124" height="22" rx="11" fill="#ffffff" stroke="#dadce0" strokeWidth="0.8" />
                    <circle cx="11" cy="11" r="4" fill="#16a34a" />
                    <text x="20" y="14.5" fill="#202124" fontSize="9.5" fontWeight="600" fontFamily="sans-serif">Kariuki Farm • {farmSize} Ac</text>
                  </g>
                </svg>

                {/* Map/Satellite toggle */}
                <div className="absolute top-2.5 left-2.5 flex items-center bg-white/95 backdrop-blur-md rounded-md shadow-xs border border-[#dadce0] overflow-hidden text-[11px] font-medium font-sans">
                  <span className="px-2.5 py-1 bg-white text-[#1a73e8] font-semibold border-r border-[#e8eaed]">Map</span>
                  <span className="px-2.5 py-1 text-[#5f6368]">Satellite</span>
                </div>

                <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md border border-[#dadce0] shadow-xs text-[10px] font-semibold text-[#5f6368] tracking-wider">
                  ZONE: UM4 RIFT VALLEY
                </div>

                <div className="absolute bottom-1 right-2.5 text-[9px] text-[#70757a] flex items-center gap-2 select-none pointer-events-none">
                  <span className="font-sans">Map data ©2025</span>
                  <div className="flex items-center gap-1 pl-1 border-l border-[#dadce0]">
                    <span className="font-mono text-[8.5px]">200 m</span>
                    <div className="w-8 h-[2px] bg-[#5f6368]" />
                  </div>
                </div>

                <div className="absolute bottom-1.5 left-2 flex items-center gap-1.5 pointer-events-none">
                  <span className="font-bold text-[12px] tracking-tight text-[#4285f4]" style={{ fontFamily: "Arial, sans-serif" }}>Google</span>
                  <span className="text-[9px] font-mono text-[#5f6368] bg-white/80 px-1 py-0.5 rounded border border-[#e0e0e0] leading-none">
                    0°59&apos;48&quot;S 36°35&apos;12&quot;E
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => window.open("https://maps.google.com/?q=-0.99672,36.58678", "_blank")}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-semibold transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  <span>Open in Google Maps</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.open("https://maps.google.com/?q=-0.99672,36.58678", "_blank")}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">directions</span>
                  <span>Get Directions</span>
                </button>
              </div>
            </div>

            {/* Quick Help & Support Link */}
            <div className="p-4 rounded-2xl bg-surface-container flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">support_agent</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-semibold text-on-surface">Need help with your farm profile?</span>
                  <span className="text-xs text-on-surface-variant">Our agritech support team is available Mon–Sat.</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push("/contact")}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors shadow-xs shrink-0 cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Floating Bottom Confirmation */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/onboarding/household-labour"
            className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Edit Previous Sections</span>
          </Link>

          <button
            type="button"
            onClick={handleApprove}
            disabled={approving}
            className="px-6 md:px-8 py-2.5 md:py-3 rounded-xl bg-primary text-white font-bold text-xs md:text-sm shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>{approving ? "Approving Profile..." : "Approve & Complete Onboarding"}</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
