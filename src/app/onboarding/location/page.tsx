"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

interface OnboardingUser {
  name?: string;
  farmerProfile?: {
    jobTitle?: string;
  };
  farmLocation?: {
    locationSearch?: string;
    county?: string;
    subcounty?: string;
    ward?: string;
    landmark?: string;
  };
}

// List of all 47 Kenyan Counties for comprehensive coverage
const KENYAN_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
  "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa",
  "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi",
  "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

// Sample sub-counties for common agricultural regions
const COMMON_SUBCOUNTIES: Record<string, string[]> = {
  nakuru: ["Naivasha", "Gilgil", "Nakuru East", "Nakuru West", "Rongai", "Subukia", "Molo", "Njoro", "Kuresoi North", "Kuresoi South", "Bahati"],
  kiambu: ["Gatundu South", "Gatundu North", "Juja", "Thika Town", "Ruiru", "Githunguri", "Kiambu", "Kiambaa", "Kabete", "Kikuyu", "Limuru", "Lari"],
  nyandarua: ["Kinangop", "Kipipiri", "Ol Kalou", "Ol Joro Orok", "Ndaragwa"],
  narok: ["Narok North", "Narok South", "Narok East", "Narok West", "Kilgoris", "Emurua Dikirr"],
  machakos: ["Machakos Town", "Mavoko", "Mwala", "Yatta", "Kangundo", "Matungulu", "Kathiani"],
  "uasin gishu": ["Ainabkoi", "Kapseret", "Kesses", "Moiben", "Soy", "Turbo"],
  nyeri: ["Tetu", "Kieni East", "Kieni West", "Mathira East", "Mathira West", "Othaya", "Mukurweini", "Nyeri Town"],
  "murang'a": ["Kangema", "Mathioya", "Kiharu", "Kigumo", "Maragua", "Kandara", "Gatanga"],
  kirinyaga: ["Mwea East", "Mwea West", "Gichugu", "Ndia", "Kirinyaga Central"],
  meru: ["Imenti North", "Imenti South", "Central Imenti", "Buuri", "Tigania East", "Tigania West", "Igembe North", "Igembe Central", "Igembe South"],
  "trans nzoia": ["Cherangany", "Kiminini", "Kwanza", "Endebess", "Saboti"],
  kericho: ["Ainamoi", "Belgut", "Bureti", "Kipkelion East", "Kipkelion West", "Soin Sigowet"],
  bomet: ["Bomet Central", "Bomet East", "Chepalungu", "Sotik", "Konoin"],
};

export default function FarmLocationPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<OnboardingUser | null>(null);

  // State
  const [locationSearch, setLocationSearch] = useState("Mai Mahiu, Naivasha, Nakuru County");
  const [county, setCounty] = useState("nakuru");
  const [subcounty, setSubcounty] = useState("naivasha");
  const [ward, setWard] = useState("Mai Mahiu Ward");
  const [landmark, setLandmark] = useState("Mai Mahiu Town Center (1.8 km)");
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsLocated, setGpsLocated] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const email = getActiveUserEmail();
    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
        if (data.user?.farmLocation) {
          const loc = data.user.farmLocation;
          if (loc.locationSearch) setLocationSearch(loc.locationSearch);
          if (loc.county) setCounty(loc.county);
          if (loc.subcounty) setSubcounty(loc.subcounty);
          if (loc.ward) setWard(loc.ward);
          if (loc.landmark) setLandmark(loc.landmark);
          if (loc.latitude && loc.longitude) {
            setCoordinates({ latitude: Number(loc.latitude), longitude: Number(loc.longitude) });
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleUseCurrentLocation = () => {
    setGpsError(null);

    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser. Please type your location manually.");
      return;
    }

    setDetectingGps(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoordinates({ latitude, longitude });
        setGpsAccuracy(Math.round(accuracy));
        setValidationErrors((prev) => prev.filter((f) => f !== "locationSearch"));

        try {
          // Reverse geocode via OpenStreetMap Nominatim with timeout
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`,
            {
              headers: { "Accept-Language": "en" },
              signal: AbortSignal.timeout(5000),
            }
          );

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};

            const placeName =
              addr.village ||
              addr.suburb ||
              addr.town ||
              addr.city ||
              addr.neighbourhood ||
              addr.county ||
              "Detected Farm Location";

            const countyName = addr.county || addr.state || "";

            const formattedLoc = countyName
              ? `${placeName}, ${countyName} (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°)`
              : `${placeName} (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°)`;

            setLocationSearch(formattedLoc);

            // Match county in lowercase
            if (countyName) {
              const matchedCounty = countyName.toLowerCase().replace(" county", "").trim();
              setCounty(matchedCounty);
              setValidationErrors((prev) => prev.filter((f) => f !== "county"));
            }

            // Subcounty or Town
            const subcountyFound =
              addr.city_district || addr.suburb || addr.municipality || addr.town;
            if (subcountyFound) {
              setSubcounty(subcountyFound.toLowerCase());
              setValidationErrors((prev) => prev.filter((f) => f !== "subcounty"));
            }

            // Ward / Village
            const wardFound = addr.village || addr.suburb || addr.quarter || addr.neighbourhood;
            if (wardFound) {
              setWard(`${wardFound} Ward`);
              setValidationErrors((prev) => prev.filter((f) => f !== "ward"));
            }

            // Landmark
            const roadOrAmenity = addr.road || addr.amenity || addr.shop;
            if (roadOrAmenity) {
              setLandmark(`Near ${roadOrAmenity} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
              setValidationErrors((prev) => prev.filter((f) => f !== "landmark"));
            } else {
              setLandmark(`GPS Coordinates: ${latitude.toFixed(5)}°, ${longitude.toFixed(5)}°`);
              setValidationErrors((prev) => prev.filter((f) => f !== "landmark"));
            }
          } else {
            // Reverse geocoding service returned non-200
            setLocationSearch(`GPS Location: ${latitude.toFixed(5)}°, ${longitude.toFixed(5)}° (±${Math.round(accuracy)}m)`);
            setLandmark(`Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          }
        } catch (err) {
          // Network timeout or offline fallback
          setLocationSearch(`GPS Location: ${latitude.toFixed(5)}°, ${longitude.toFixed(5)}° (±${Math.round(accuracy)}m)`);
          setLandmark(`Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        } finally {
          setDetectingGps(false);
          setGpsLocated(true);
          setTimeout(() => setGpsLocated(false), 4000);
        }
      },
      (err) => {
        setDetectingGps(false);
        console.warn("Geolocation error:", err);
        if (err.code === 1) {
          setGpsError("Location permission was denied. Please allow location permissions in your browser or enter your farm location manually.");
        } else if (err.code === 2) {
          setGpsError("GPS position unavailable. Please check device location settings or enter location manually.");
        } else if (err.code === 3) {
          setGpsError("Location request timed out. Please try again or type your location manually.");
        } else {
          setGpsError(err.message || "Failed to retrieve current location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSave = async (navigateNext: boolean = true) => {
    if (navigateNext) {
      const missing: string[] = [];
      if (!locationSearch.trim()) missing.push("locationSearch");
      if (!county.trim()) missing.push("county");
      if (!subcounty.trim()) missing.push("subcounty");
      if (!ward.trim()) missing.push("ward");
      if (!landmark.trim()) missing.push("landmark");

      if (missing.length > 0) {
        setValidationErrors(missing);
        const firstMissing = missing[0];
        const el = document.getElementById(`q-${firstMissing}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }

    setSaving(true);
    setSaveFeedback(null);
    try {
      const email = getActiveUserEmail();
      const res = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "location",
          email,
          data: {
            locationSearch,
            county,
            subcounty,
            ward,
            landmark,
            latitude: coordinates ? coordinates.latitude : -0.99672,
            longitude: coordinates ? coordinates.longitude : 36.58678,
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
    <AppShell userName={currentUser?.name || "Keziah Wanjiku"} userRole={currentUser?.farmerProfile?.jobTitle || "Farm Owner"}>
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

        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-900/60 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-300 text-sm animate-fadeIn shadow-xs">
            <span className="material-symbols-outlined text-red-500 text-xl shrink-0">error</span>
            <span className="font-semibold">
              Please complete all fields on this page before continuing ({validationErrors.length} required field{validationErrors.length > 1 ? "s" : ""} remaining).
            </span>
          </div>
        )}

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
          <div
            id="q-locationSearch"
            className={`flex flex-col gap-3 bg-surface-container-low p-5 rounded-2xl border transition-all ${
              validationErrors.includes("locationSearch")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-transparent"
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-on-surface" htmlFor="location-search">
                Enter your farm location, town, or nearby landmark
              </label>
              {validationErrors.includes("locationSearch") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <div className="relative flex flex-col md:flex-row items-stretch gap-2.5">
              <div className="relative flex-1 flex items-center">
                <span className="material-symbols-outlined text-primary absolute left-4 pointer-events-none text-[22px]">
                  location_searching
                </span>
                <input
                  id="location-search"
                  type="text"
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    if (e.target.value.trim()) {
                      setValidationErrors((prev) => prev.filter((f) => f !== "locationSearch"));
                    }
                  }}
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

            {gpsError && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs rounded-xl border border-amber-300 dark:border-amber-800 animate-fadeIn">
                <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0 mt-0.5">warning</span>
                <span className="flex-1 leading-relaxed">{gpsError}</span>
              </div>
            )}

            {coordinates && (
              <div className="flex flex-wrap items-center gap-2 py-1 text-xs text-primary font-medium animate-fadeIn">
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20">
                  <span className="material-symbols-outlined text-[16px] text-primary">gps_fixed</span>
                  <span>
                    Lat: {coordinates.latitude.toFixed(5)}°, Lng: {coordinates.longitude.toFixed(5)}°
                  </span>
                  {gpsAccuracy && <span className="text-on-surface-variant text-[11px]">(±{gpsAccuracy}m)</span>}
                </span>
                <span className="text-secondary text-[11px] inline-flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  Coordinates verified
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-on-surface-variant text-xs mt-1">
              <span className="material-symbols-outlined text-[16px] text-primary">info</span>
              <span>You can simply type the nearest town or trading center. We never publish your private coordinates.</span>
            </div>
          </div>

          {/* 2. Structured Location Grid */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-on-surface">Administrative Division</span>
              <span className="text-xs text-on-surface-variant">Auto-filled from map &amp; GPS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* County */}
              <div id="q-county" className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="field-county">
                    County
                  </label>
                  {validationErrors.includes("county") && (
                    <span className="text-xs font-semibold text-red-600">Required</span>
                  )}
                </div>
                <div className="relative">
                  <select
                    id="field-county"
                    value={county.toLowerCase()}
                    onChange={(e) => {
                      setCounty(e.target.value);
                      if (e.target.value.trim()) {
                        setValidationErrors((prev) => prev.filter((f) => f !== "county"));
                      }
                      // Reset subcounty to first available for county if available
                      const subs = COMMON_SUBCOUNTIES[e.target.value.toLowerCase()];
                      if (subs && subs.length > 0) {
                        setSubcounty(subs[0]);
                      }
                    }}
                    className={`w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm text-on-surface appearance-none outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer border ${
                      validationErrors.includes("county") ? "border-red-400 ring-1 ring-red-300" : "border-transparent"
                    }`}
                  >
                    {/* Render detected county if not in standard list */}
                    {county && !KENYAN_COUNTIES.some((c) => c.toLowerCase() === county.toLowerCase()) && (
                      <option value={county.toLowerCase()}>
                        {county.charAt(0).toUpperCase() + county.slice(1)} County (Detected)
                      </option>
                    )}
                    {KENYAN_COUNTIES.map((c) => (
                      <option key={c} value={c.toLowerCase()}>
                        {c} County
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Sub-County */}
              <div id="q-subcounty" className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="field-subcounty">
                    Sub-County / Area
                  </label>
                  {validationErrors.includes("subcounty") && (
                    <span className="text-xs font-semibold text-red-600">Required</span>
                  )}
                </div>
                <div className="relative">
                  {COMMON_SUBCOUNTIES[county.toLowerCase()] ? (
                    <>
                      <select
                        id="field-subcounty"
                        value={subcounty}
                        onChange={(e) => {
                          setSubcounty(e.target.value);
                          if (e.target.value.trim()) {
                            setValidationErrors((prev) => prev.filter((f) => f !== "subcounty"));
                          }
                        }}
                        className={`w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm text-on-surface appearance-none outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer border ${
                          validationErrors.includes("subcounty") ? "border-red-400 ring-1 ring-red-300" : "border-transparent"
                        }`}
                      >
                        {/* If detected subcounty is not in the list, provide it as first option */}
                        {subcounty &&
                          !COMMON_SUBCOUNTIES[county.toLowerCase()].some(
                            (s) => s.toLowerCase() === subcounty.toLowerCase()
                          ) && (
                            <option value={subcounty}>
                              {subcounty.charAt(0).toUpperCase() + subcounty.slice(1)} (Detected)
                            </option>
                          )}
                        {COMMON_SUBCOUNTIES[county.toLowerCase()].map((sub) => (
                          <option key={sub} value={sub.toLowerCase()}>
                            {sub} Sub-County
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                        expand_more
                      </span>
                    </>
                  ) : (
                    <input
                      id="field-subcounty"
                      type="text"
                      value={subcounty}
                      onChange={(e) => {
                        setSubcounty(e.target.value);
                        if (e.target.value.trim()) {
                          setValidationErrors((prev) => prev.filter((f) => f !== "subcounty"));
                        }
                      }}
                      placeholder="Enter sub-county or division"
                      className={`w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary transition-colors border ${
                        validationErrors.includes("subcounty") ? "border-red-400 ring-1 ring-red-300" : "border-transparent"
                      }`}
                    />
                  )}
                </div>
              </div>

              {/* Ward */}
              <div id="q-ward" className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="field-ward">
                    Ward / Village
                  </label>
                  {validationErrors.includes("ward") && (
                    <span className="text-xs font-semibold text-red-600">Required</span>
                  )}
                </div>
                <input
                  id="field-ward"
                  type="text"
                  value={ward}
                  onChange={(e) => {
                    setWard(e.target.value);
                    if (e.target.value.trim()) {
                      setValidationErrors((prev) => prev.filter((f) => f !== "ward"));
                    }
                  }}
                  className={`w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary transition-colors border ${
                    validationErrors.includes("ward") ? "border-red-400 ring-1 ring-red-300" : "border-transparent"
                  }`}
                />
              </div>

              {/* Landmark */}
              <div id="q-landmark" className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="field-landmark">
                    Nearest Trading Center / Landmark
                  </label>
                  {validationErrors.includes("landmark") && (
                    <span className="text-xs font-semibold text-red-600">Required</span>
                  )}
                </div>
                <input
                  id="field-landmark"
                  type="text"
                  value={landmark}
                  onChange={(e) => {
                    setLandmark(e.target.value);
                    if (e.target.value.trim()) {
                      setValidationErrors((prev) => prev.filter((f) => f !== "landmark"));
                    }
                  }}
                  className={`w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary transition-colors border ${
                    validationErrors.includes("landmark") ? "border-red-400 ring-1 ring-red-300" : "border-transparent"
                  }`}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Floating Bottom Navigation */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] pb-safe">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link
              href="/onboarding"
              className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>&larr;</span>
              <span>Back to Overview</span>
            </Link>

            {saveFeedback && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full inline-flex items-center gap-1 animate-fadeIn sm:hidden">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                {saveFeedback}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {saveFeedback && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full hidden sm:inline-flex items-center gap-1 animate-fadeIn">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                {saveFeedback}
              </span>
            )}
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 rounded-xl border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-semibold text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70 bg-surface"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs md:text-sm btn-shadow hover-lift transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
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
