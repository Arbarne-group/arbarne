"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default function FarmLocationPage() {
  const router = useRouter();

  // State
  const [locationSearch, setLocationSearch] = useState("Mai Mahiu, Naivasha, Nakuru County");
  const [county, setCounty] = useState("nakuru");
  const [subcounty, setSubcounty] = useState("naivasha");
  const [ward, setWard] = useState("Mai Mahiu Ward");
  const [landmark, setLandmark] = useState("Mai Mahiu Town Center (1.8 km)");
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsLocated, setGpsLocated] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.farmLocation) {
          const loc = data.user.farmLocation;
          if (loc.locationSearch) setLocationSearch(loc.locationSearch);
          if (loc.county) setCounty(loc.county);
          if (loc.subcounty) setSubcounty(loc.subcounty);
          if (loc.ward) setWard(loc.ward);
          if (loc.landmark) setLandmark(loc.landmark);
        }
      })
      .catch(console.error);
  }, []);

  const handleUseCurrentLocation = () => {
    setDetectingGps(true);
    setTimeout(() => {
      setLocationSearch("Mai Mahiu, Longonot Foot, Nakuru (Accurate to 3m)");
      setDetectingGps(false);
      setGpsLocated(true);
      setTimeout(() => setGpsLocated(false), 2500);
    }, 800);
  };

  const handleSave = async (navigateNext: boolean = true) => {
    setSaving(true);
    setSaveFeedback(null);
    try {
      const res = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "location",
          email: "keziah@futurefarms.africa",
          data: {
            locationSearch,
            county,
            subcounty,
            ward,
            landmark,
            latitude: -0.99672,
            longitude: 36.58678,
          },
        }),
      });
      const resData = await res.json();
      if (resData.user) {
        localStorage.setItem("future_farms_user", JSON.stringify(resData.user));
      }
      setSaveFeedback("Location saved!");
      setTimeout(() => setSaveFeedback(null), 2500);

      if (navigateNext) {
        router.push("/onboarding/characteristics");
      }
    } catch (e) {
      console.error(e);
      if (navigateNext) {
        router.push("/onboarding/characteristics");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell userName="Keziah Wanjiku" userRole="Farm Owner">
      <div className="w-full pt-4 pb-28 px-4 md:px-8 max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Overview
          </Link>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            Stage 1 of 5: Geographic Profile
          </span>
        </div>

        {/* Top Heroic Context Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/40 text-secondary rounded-full w-fit text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>Phase 2: Geographic &amp; Field Details</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-1">
              Farm Location
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed">
              Tell us where your farm is located so we can provide local micro-climate forecasts, soil nutrient composition, and connect you directly with regional aggregate buyers.
            </p>
          </div>

          {/* Stage Badge Indicator */}
          <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high/60 self-start lg:self-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                <circle
                  className="text-surface-container"
                  cx="24"
                  cy="24"
                  fill="transparent"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <circle
                  className="text-primary"
                  cx="24"
                  cy="24"
                  fill="transparent"
                  r="20"
                  stroke="currentColor"
                  strokeDasharray="125.6"
                  strokeDashoffset="100.5"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
              <span className="absolute text-xs font-bold text-primary">1/5</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Stage 1 of 5
              </span>
              <span className="text-xs font-bold text-on-surface">Geographic Profile</span>
              <span className="text-[11px] text-on-surface-variant">Next: Farm Characteristics</span>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-surface-container-high/60 p-6 md:p-8 flex flex-col gap-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-container-high/60 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">pin_drop</span>
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-on-surface tracking-tight">
                  FARM LOCATION &amp; DETAILS
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Georeferenced accuracy unlocks certified agronomic support
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-secondary text-xs font-semibold w-fit">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
              <span>Verified &amp; Confidential</span>
            </div>
          </div>

          {/* 1. Quick Search / Simple Location Input */}
          <div className="flex flex-col gap-3 bg-surface-container-low p-5 rounded-2xl">
            <label className="text-sm font-semibold text-on-surface" htmlFor="location-search">
              Enter your farm location, town, or nearby landmark
            </label>
            <div className="relative flex flex-col md:flex-row items-stretch gap-2.5">
              <div className="relative flex-1 flex items-center">
                <span className="material-symbols-outlined text-primary absolute left-4 pointer-events-none text-[22px]">
                  location_searching
                </span>
                <input
                  id="location-search"
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="e.g., Mai Mahiu, Naivasha or village name"
                  className={`w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest text-on-surface text-sm rounded-xl shadow-xs outline-none focus:ring-2 focus:ring-primary transition-all ${
                    gpsLocated ? "bg-primary-fixed/20" : ""
                  }`}
                />
              </div>
              <button
                id="btn-current-loc"
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={detectingGps}
                className="px-5 py-3.5 bg-primary text-white rounded-xl text-xs md:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-sm transition-all active:scale-[0.98] cursor-pointer disabled:opacity-75"
              >
                {detectingGps ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>Detecting GPS...</span>
                  </>
                ) : gpsLocated ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Located</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">my_location</span>
                    <span>Use Current Location</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs mt-1">
              <span className="material-symbols-outlined text-[16px] text-primary">info</span>
              <span>You can simply type the nearest town or trading center. We never publish your private coordinates.</span>
            </div>
          </div>

          {/* 2. Structured Location Grid */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-on-surface">Administrative Division</span>
              <span className="text-xs text-on-surface-variant">Auto-filled from map selection</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* County */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant" htmlFor="field-county">
                  County
                </label>
                <div className="relative">
                  <select
                    id="field-county"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm text-on-surface appearance-none outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer"
                  >
                    <option value="nakuru">Nakuru County</option>
                    <option value="kiambu">Kiambu County</option>
                    <option value="nyandarua">Nyandarua County</option>
                    <option value="narok">Narok County</option>
                    <option value="machakos">Machakos County</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Sub-County */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant" htmlFor="field-subcounty">
                  Sub-County / Area
                </label>
                <div className="relative">
                  <select
                    id="field-subcounty"
                    value={subcounty}
                    onChange={(e) => setSubcounty(e.target.value)}
                    className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm text-on-surface appearance-none outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer"
                  >
                    <option value="naivasha">Naivasha Sub-County</option>
                    <option value="gilgil">Gilgil Sub-County</option>
                    <option value="nakuru-east">Nakuru East</option>
                    <option value="subukia">Subukia Sub-County</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Ward */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant" htmlFor="field-ward">
                  Ward / Village
                </label>
                <input
                  id="field-ward"
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
              </div>

              {/* Landmark */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant" htmlFor="field-landmark">
                  Nearest Trading Center / Landmark
                </label>
                <input
                  id="field-landmark"
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Floating Bottom Navigation */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/onboarding"
            className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Overview</span>
          </Link>

          <div className="flex items-center gap-3">
            {saveFeedback && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1 animate-fadeIn">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                {saveFeedback}
              </span>
            )}
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-semibold text-xs md:text-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-70 bg-surface"
            >
              <span className="material-symbols-outlined text-[17px]">save</span>
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs md:text-sm btn-shadow hover-lift transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
            >
              <span>{saving ? "Saving..." : "Save & Continue"}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
