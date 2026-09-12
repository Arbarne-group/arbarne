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
  farmCharacteristics?: {
    farmSize?: number;
    farmUnit?: "Acres" | "Hectares";
    cultivatedAcres?: number;
    grazingAcres?: number;
    landTenure?: string;
    waterSources?: string;
    soilTested?: string;
  };
}

export default function FarmCharacteristicsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<OnboardingUser | null>(null);

  // State
  const [farmSize, setFarmSize] = useState<number | "">("");
  const [farmUnit, setFarmUnit] = useState<"Acres" | "Hectares">("Acres");
  const [cultivatedAcres, setCultivatedAcres] = useState<number | "">("");
  const [grazingAcres, setGrazingAcres] = useState<number | "">("");
  const [landTenure, setLandTenure] = useState<string>("");
  const [waterSources, setWaterSources] = useState<string[]>([]);
  const [soilTested, setSoilTested] = useState<string>("");

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
        if (data.user?.farmCharacteristics) {
          const char = data.user.farmCharacteristics;
          if (char.farmSize !== null && char.farmSize !== undefined) setFarmSize(char.farmSize);
          if (char.farmUnit === "Acres" || char.farmUnit === "Hectares") setFarmUnit(char.farmUnit);
          if (char.cultivatedAcres !== null && char.cultivatedAcres !== undefined) setCultivatedAcres(char.cultivatedAcres);
          if (char.grazingAcres !== null && char.grazingAcres !== undefined) setGrazingAcres(char.grazingAcres);
          if (char.landTenure) setLandTenure(char.landTenure);
          if (char.soilTested) setSoilTested(char.soilTested);
          if (char.waterSources) {
            try {
              setWaterSources(JSON.parse(char.waterSources));
            } catch {
              // ignore
            }
          }
        }
      })
      .catch(console.error);
  }, []);

  const toggleWaterSource = (id: string) => {
    setWaterSources((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length > 0) {
        setValidationErrors((v) => v.filter((f) => f !== "waterSources"));
      }
      return next;
    });
  };

  const handleSave = async (navigateNext: boolean = true) => {
    if (navigateNext) {
      const missing: string[] = [];
      if (farmSize === "" || Number(farmSize) <= 0) missing.push("farmSize");
      if (cultivatedAcres === "" || isNaN(Number(cultivatedAcres)) || Number(cultivatedAcres) < 0) missing.push("landUse");
      if (grazingAcres === "" || isNaN(Number(grazingAcres)) || Number(grazingAcres) < 0) {
        if (!missing.includes("landUse")) missing.push("landUse");
      }
      if (!landTenure) missing.push("landTenure");
      if (waterSources.length === 0) missing.push("waterSources");
      if (!soilTested) missing.push("soilTested");

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
      const numFarmSize = typeof farmSize === "number" ? farmSize : 0;
      const numCultivated = typeof cultivatedAcres === "number" ? cultivatedAcres : 0;
      const numGrazing = typeof grazingAcres === "number" ? grazingAcres : 0;

      const res = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "characteristics",
          email,
          data: {
            farmSize: numFarmSize,
            farmUnit,
            cultivatedAcres: numCultivated,
            grazingAcres: numGrazing,
            landTenure,
            waterSources,
            soilTested,
          },
        }),
      });
      const resData = await res.json();
      if (resData.user) {
        localStorage.setItem("future_farms_user", JSON.stringify(resData.user));
      }
      setSaveFeedback("Characteristics saved!");
      setTimeout(() => setSaveFeedback(null), 2500);

      if (navigateNext) {
        router.push("/onboarding/farming-system");
      }
    } catch (e) {
      console.error(e);
      if (navigateNext) {
        router.push("/onboarding/farming-system");
      }
    } finally {
      setSaving(false);
    }
  };

  // Conversions
  const numFarmSize = typeof farmSize === "number" ? farmSize : 0;
  const numCultivated = typeof cultivatedAcres === "number" ? cultivatedAcres : 0;
  const numGrazing = typeof grazingAcres === "number" ? grazingAcres : 0;

  const hectaresEquiv = numFarmSize > 0
    ? (farmUnit === "Acres" ? (numFarmSize * 0.404686).toFixed(2) : numFarmSize.toFixed(2))
    : "0.00";
  const sqmEquiv = numFarmSize > 0
    ? (farmUnit === "Acres" ? Math.round(numFarmSize * 4046.86).toLocaleString() : Math.round(numFarmSize * 10000).toLocaleString())
    : "0";

  const cultivatedPercent = numFarmSize > 0 ? Math.min(100, Math.round((numCultivated / numFarmSize) * 100)) : 0;
  const grazingPercent = numFarmSize > 0 ? Math.min(100 - cultivatedPercent, Math.round((numGrazing / numFarmSize) * 100)) : 0;

  return (
    <AppShell userName={currentUser?.name || "Farmer"} userRole={currentUser?.farmerProfile?.jobTitle || "Farm Owner"}>
      <div className="w-full pt-4 pb-28 px-4 md:px-8 max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/onboarding/location"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Farm Location
          </Link>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            Stage 2 of 5: Land &amp; Resources
          </span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-1">
              Farm Characteristics
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed">
              Tell us about your land size, ownership, water source, and soil so we can give you relevant farming recommendations.
            </p>
          </div>

          {/* Stage Indicator */}
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
                  strokeDashoffset="75.4"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
              <span className="absolute text-xs font-bold text-primary">2/5</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Stage 2 of 5
              </span>
              <span className="text-xs font-bold text-on-surface">Land &amp; Water</span>
              <span className="text-[11px] text-on-surface-variant">Next: Farming System</span>
            </div>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-900/60 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-300 text-sm animate-fadeIn shadow-xs">
            <span className="material-symbols-outlined text-red-500 text-xl shrink-0">error</span>
            <span className="font-semibold">
              Please complete all required fields on this page before continuing ({validationErrors.length} required field{validationErrors.length > 1 ? "s" : ""} remaining).
            </span>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-surface-container-high/60 p-6 md:p-8 space-y-8">
          {/* Farm Size & Land Use */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Farm Size Input */}
            <div
              id="q-farmSize"
              className={`lg:col-span-5 space-y-4 p-4 rounded-2xl border transition-all ${
                validationErrors.includes("farmSize")
                  ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                  : "border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span>How big is your farm?</span>
                </label>
                {validationErrors.includes("farmSize") ? (
                  <span className="text-xs font-semibold text-red-600">Enter valid size &gt; 0</span>
                ) : (
                  <span className="text-xs text-primary font-semibold">Total Farm Size</span>
                )}
              </div>

              <div className="flex items-stretch gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]">crop_free</span>
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 10.0"
                    value={farmSize}
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                      setFarmSize(val);
                      if (typeof val === "number" && val > 0) {
                        setValidationErrors((prev) => prev.filter((f) => f !== "farmSize"));
                      }
                    }}
                    className={`w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-xl text-on-surface text-xl font-bold outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all border ${
                      validationErrors.includes("farmSize") ? "border-red-400" : "border-transparent"
                    }`}
                  />
                </div>

                <div className="bg-surface-container-low p-1 rounded-xl flex items-center shadow-inner">
                  <button
                    type="button"
                    onClick={() => setFarmUnit("Acres")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      farmUnit === "Acres"
                        ? "bg-surface-container-lowest shadow-xs text-primary"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Acres
                  </button>
                  <button
                    type="button"
                    onClick={() => setFarmUnit("Hectares")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      farmUnit === "Hectares"
                        ? "bg-surface-container-lowest shadow-xs text-primary"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Hectares
                  </button>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                <span>
                  Approx. equivalent to {hectaresEquiv} Hectares ({sqmEquiv} m²)
                </span>
              </p>
            </div>

            {/* Land Use Split */}
            <div
              id="q-landUse"
              className={`lg:col-span-7 bg-surface-container-low p-5 rounded-2xl space-y-4 border transition-all ${
                validationErrors.includes("landUse")
                  ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                  : "border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">pie_chart</span>
                  <span className="text-sm font-semibold text-on-surface">
                    How is your land currently used?
                  </span>
                  {validationErrors.includes("landUse") && (
                    <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <span className="material-symbols-outlined text-[12px]">warning</span>
                      Required
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-on-surface-variant">
                  {numFarmSize > 0 ? `${numFarmSize} ${farmUnit} Total` : `— ${farmUnit} Total`}
                </span>
              </div>

              <div className="w-full h-4 bg-surface-variant rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="bg-primary h-full transition-all duration-300 relative group cursor-pointer"
                  style={{ width: `${cultivatedPercent}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] font-semibold py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap">
                    {numCultivated} {farmUnit} Cultivated
                  </div>
                </div>
                <div
                  className="bg-outline-variant h-full transition-all duration-300 relative group cursor-pointer"
                  style={{ width: `${grazingPercent}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] font-semibold py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap">
                    {numGrazing} {farmUnit} Pasture
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-surface-container-lowest p-3 rounded-xl flex items-center justify-between border border-surface-container-high/60 gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-3 h-3 rounded-full bg-primary shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-on-surface truncate">Cultivated / Farming</div>
                      <div className="text-[11px] text-on-surface-variant">Active crop land</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={cultivatedAcres}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                        setCultivatedAcres(val);
                        setValidationErrors((prev) => prev.filter((f) => f !== "landUse"));
                      }}
                      className="w-16 px-2 py-1 text-right text-xs font-bold text-primary bg-surface-container-low rounded-lg border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-[11px] font-semibold text-on-surface-variant">{farmUnit}</span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-xl flex items-center justify-between border border-surface-container-high/60 gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-3 h-3 rounded-full bg-outline-variant shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-on-surface truncate">Grazing / Resting</div>
                      <div className="text-[11px] text-on-surface-variant">Pasture &amp; other</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={grazingAcres}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                        setGrazingAcres(val);
                        setValidationErrors((prev) => prev.filter((f) => f !== "landUse"));
                      }}
                      className="w-16 px-2 py-1 text-right text-xs font-bold text-on-surface bg-surface-container-low rounded-lg border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-[11px] font-semibold text-on-surface-variant">{farmUnit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Land Ownership / Tenure */}
          <div
            id="q-landTenure"
            className={`space-y-4 pt-4 border-t p-4 rounded-2xl transition-all ${
              validationErrors.includes("landTenure")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-container-high/60"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <label className="text-base font-bold text-on-surface block">
                  What is your land ownership or tenure status?
                </label>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Select your legal tenure arrangement for the farmland.
                </p>
              </div>
              {validationErrors.includes("landTenure") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "freehold", title: "Freehold (Owned with Title Deed)", desc: "Private deeded ownership" },
                { id: "leasehold", title: "Leasehold (Rented / Leased)", desc: "Long or short-term lease agreement" },
                { id: "communal_family", title: "Family / Customary Land", desc: "Ancestral or community-held land" },
              ].map((item) => {
                const isSelected = landTenure === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setLandTenure(item.id);
                      setValidationErrors((prev) => prev.filter((f) => f !== "landTenure"));
                    }}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary"
                        : "bg-surface-container-low border-transparent hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isSelected ? "text-primary" : "text-on-surface"}`}>
                        {item.title}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                      )}
                    </div>
                    <span className="text-[11px] text-on-surface-variant block">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Water Sources */}
          <div
            id="q-waterSources"
            className={`space-y-4 pt-4 border-t p-4 rounded-2xl transition-all ${
              validationErrors.includes("waterSources")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-container-high/60"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <div>
                  <label className="text-base font-bold text-on-surface block">
                    Where do you get water for your farm?
                  </label>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Select all water sources you currently use.
                  </p>
                </div>
                {validationErrors.includes("waterSources") && (
                  <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Required
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full self-start sm:self-auto">
                {waterSources.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: "borehole_solar",
                  title: "Borehole / Well (with Solar Pump)",
                  badge: "Reliable Year-round",
                  badgeColor: "bg-primary-fixed text-on-primary-fixed",
                  desc: "Deep borehole with solar-powered pumping system.",
                  icon: "solar_power",
                },
                {
                  id: "rainwater_dam",
                  title: "Rainwater Harvesting / Dam",
                  badge: "Storage Basin",
                  badgeColor: "bg-secondary-container text-on-secondary-container",
                  desc: "Earth dam and rooftop rainwater collection tanks.",
                  icon: "water_drop",
                },
                {
                  id: "river_stream",
                  title: "River / Stream nearby",
                  badge: "Seasonal",
                  badgeColor: "bg-surface-variant text-on-surface-variant",
                  desc: "Natural flow from nearby stream or river boundary.",
                  icon: "water",
                },
                {
                  id: "piped_municipal",
                  title: "Piped Water / Municipal",
                  badge: "Metered",
                  badgeColor: "bg-surface-variant text-on-surface-variant",
                  desc: "Connected to local county or community piped supply.",
                  icon: "faucet",
                },
              ].map((item) => {
                const isSelected = waterSources.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleWaterSource(item.id)}
                    className={`flex items-start gap-3.5 p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden ${
                      isSelected
                        ? "bg-surface-container-lowest border-primary shadow-sm"
                        : "bg-surface-container-low border-transparent hover:bg-surface-container"
                    }`}
                  >
                    {isSelected && <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary" />}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                        isSelected ? "bg-primary text-white" : "bg-surface-variant text-outline"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${isSelected ? "text-on-surface" : "text-on-surface-variant"}`}>
                          <span className="material-symbols-outlined text-primary text-[18px]">{item.icon}</span>
                          {item.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[12px] text-on-surface-variant">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Soil Testing */}
          <div
            id="q-soilTested"
            className={`space-y-4 pt-4 border-t p-4 rounded-2xl transition-all ${
              validationErrors.includes("soilTested")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-container-high/60"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-base font-bold text-on-surface block">
                    Have you tested your soil recently?
                  </label>
                  {validationErrors.includes("soilTested") && (
                    <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      Required
                    </span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Soil testing helps recommend the right fertilizers and crops.
                </p>
              </div>

              <div className="bg-surface-container-low p-1 rounded-xl flex items-center self-start sm:self-auto shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setSoilTested("yes");
                    setValidationErrors((prev) => prev.filter((f) => f !== "soilTested"));
                  }}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    soilTested === "yes"
                      ? "bg-primary text-white shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                  <span>Yes, Tested</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSoilTested("no");
                    setValidationErrors((prev) => prev.filter((f) => f !== "soilTested"));
                  }}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    soilTested === "no"
                      ? "bg-primary text-white shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bottom Navigation */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] pb-safe">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link
              href="/onboarding/location"
              className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>&larr;</span>
              <span>Back to Location</span>
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
