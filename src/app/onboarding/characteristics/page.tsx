"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default function FarmCharacteristicsPage() {
  const router = useRouter();

  // State
  const [farmSize, setFarmSize] = useState<number>(12.5);
  const [farmUnit, setFarmUnit] = useState<"Acres" | "Hectares">("Acres");
  const [cultivatedAcres, setCultivatedAcres] = useState<number>(8.0);
  const [grazingAcres, setGrazingAcres] = useState<number>(4.5);
  const [landTenure, setLandTenure] = useState<string>("freehold");
  const [waterSources, setWaterSources] = useState<string[]>([
    "borehole_solar",
    "rainwater_dam",
  ]);
  const [soilTested, setSoilTested] = useState<string>("yes");

  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.farmCharacteristics) {
          const char = data.user.farmCharacteristics;
          if (char.farmSize) setFarmSize(char.farmSize);
          if (char.farmUnit) setFarmUnit(char.farmUnit as any);
          if (char.cultivatedAcres) setCultivatedAcres(char.cultivatedAcres);
          if (char.grazingAcres) setGrazingAcres(char.grazingAcres);
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
    setWaterSources((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async (navigateNext: boolean = true) => {
    setSaving(true);
    setSaveFeedback(null);
    try {
      const res = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "characteristics",
          email: "keziah@futurefarms.africa",
          data: {
            farmSize,
            farmUnit,
            cultivatedAcres,
            grazingAcres,
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
  const hectaresEquiv = farmUnit === "Acres"
    ? (farmSize * 0.404686).toFixed(2)
    : farmSize.toFixed(2);
  const sqmEquiv = farmUnit === "Acres"
    ? Math.round(farmSize * 4046.86).toLocaleString()
    : Math.round(farmSize * 10000).toLocaleString();

  const cultivatedPercent = farmSize > 0 ? Math.round((cultivatedAcres / farmSize) * 100) : 64;
  const grazingPercent = Math.max(0, 100 - cultivatedPercent);

  return (
    <AppShell userName="Keziah Wanjiku" userRole="Farm Owner">
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

        {/* Main Form Container */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-surface-container-high/60 p-6 md:p-8 space-y-8">
          {/* Farm Size & Land Use */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Farm Size Input */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span>How big is your farm?</span>
                </label>
                <span className="text-xs text-primary font-semibold">Total Farm Size</span>
              </div>

              <div className="flex items-stretch gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]">crop_free</span>
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    value={farmSize}
                    onChange={(e) => setFarmSize(parseFloat(e.target.value) || 0)}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-xl text-on-surface text-xl font-bold outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all"
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
            <div className="lg:col-span-7 bg-surface-container-low p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">pie_chart</span>
                  <span className="text-sm font-semibold text-on-surface">
                    How is your land currently used?
                  </span>
                </div>
                <span className="text-xs font-medium text-on-surface-variant">
                  {farmSize} {farmUnit} Total
                </span>
              </div>

              <div className="w-full h-4 bg-surface-variant rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="bg-primary h-full transition-all duration-300 relative group cursor-pointer"
                  style={{ width: `${cultivatedPercent}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] font-semibold py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap">
                    {cultivatedAcres} {farmUnit} Cultivated
                  </div>
                </div>
                <div
                  className="bg-outline-variant h-full transition-all duration-300 relative group cursor-pointer"
                  style={{ width: `${grazingPercent}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] font-semibold py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap">
                    {grazingAcres} {farmUnit} Pasture
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-surface-container-lowest p-3 rounded-xl flex items-center justify-between border border-surface-container-high/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-primary shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-on-surface">Cultivated / Farming</div>
                      <div className="text-[11px] text-on-surface-variant">Active crop land</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-primary">{cultivatedAcres} {farmUnit}</div>
                    <div className="text-[11px] text-on-surface-variant">{cultivatedPercent}%</div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-xl flex items-center justify-between border border-surface-container-high/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-outline-variant shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-on-surface">Grazing / Resting / Other</div>
                      <div className="text-[11px] text-on-surface-variant">Pasture and unplanted</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-on-surface">{grazingAcres} {farmUnit}</div>
                    <div className="text-[11px] text-on-surface-variant">{grazingPercent}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Water Sources */}
          <div className="space-y-4 pt-4 border-t border-surface-container-high/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <label className="text-base font-bold text-on-surface block">
                  Where do you get water for your farm?
                </label>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Select all water sources you currently use.
                </p>
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
          <div className="space-y-4 pt-4 border-t border-surface-container-high/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-base font-bold text-on-surface block">
                  Have you tested your soil recently?
                </label>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Soil testing helps recommend the right fertilizers and crops.
                </p>
              </div>

              <div className="bg-surface-container-low p-1 rounded-xl flex items-center self-start sm:self-auto shadow-inner">
                <button
                  type="button"
                  onClick={() => setSoilTested("yes")}
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
                  onClick={() => setSoilTested("no")}
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
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/onboarding/location"
            className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Farm Location</span>
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
