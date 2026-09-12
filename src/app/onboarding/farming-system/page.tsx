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
  farmingSystem?: {
    enterprises?: string;
    cultivationMethod?: string;
    mechanizationSetup?: string;
    energySource?: string;
  };
}

export default function FarmingSystemPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<OnboardingUser | null>(null);

  // State
  const [enterprises, setEnterprises] = useState<string[]>([]);
  const [cultivationMethod, setCultivationMethod] = useState<string>("");
  const [mechanizationSetup, setMechanizationSetup] = useState<string>("");
  const [energySource, setEnergySource] = useState<string>("");

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
        if (data.user?.farmingSystem) {
          const sys = data.user.farmingSystem;
          if (sys.cultivationMethod) setCultivationMethod(sys.cultivationMethod);
          if (sys.mechanizationSetup) setMechanizationSetup(sys.mechanizationSetup);
          if (sys.energySource) setEnergySource(sys.energySource);
          if (sys.enterprises) {
            try {
              setEnterprises(JSON.parse(sys.enterprises));
            } catch {
              // ignore
            }
          }
        }
      })
      .catch(console.error);
  }, []);

  const toggleEnterprise = (id: string) => {
    setEnterprises((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length > 0) {
        setValidationErrors((v) => v.filter((f) => f !== "enterprises"));
      }
      return next;
    });
  };

  const handleSave = async (navigateNext: boolean = true) => {
    if (navigateNext) {
      const missing: string[] = [];
      if (enterprises.length === 0) missing.push("enterprises");
      if (!cultivationMethod) missing.push("cultivationMethod");
      if (!mechanizationSetup) missing.push("mechanizationSetup");
      if (!energySource) missing.push("energySource");

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
          step: "farming-system",
          email,
          data: {
            enterprises,
            cultivationMethod,
            mechanizationSetup,
            energySource,
          },
        }),
      });
      const resData = await res.json();
      if (resData.user) {
        localStorage.setItem("future_farms_user", JSON.stringify(resData.user));
      }
      setSaveFeedback("Farming system saved!");
      setTimeout(() => setSaveFeedback(null), 2500);

      if (navigateNext) {
        router.push("/onboarding/business-experience");
      }
    } catch (e) {
      console.error(e);
      if (navigateNext) {
        router.push("/onboarding/business-experience");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell userName={currentUser?.name || "Farmer"} userRole={currentUser?.farmerProfile?.jobTitle || "Farm Owner"}>
      <div className="w-full pt-4 pb-28 px-4 md:px-8 max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/onboarding/characteristics"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Farm Characteristics
          </Link>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            Stage 3 of 5: Production Profile
          </span>
        </div>

        {/* Title Banner with Stage Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="space-y-1.5 max-w-xl">
            <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight mt-1">
              Farming System
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              Tell us about your crops, livestock, farming practices, and power sources so we can customize agronomy advice, equipment rebates, and supplier connections.
            </p>
          </div>

          {/* Circular 3/5 stage badge */}
          <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high/60 shrink-0 self-start md:self-auto">
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
                  strokeDashoffset="50.2"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
              <span className="absolute text-xs font-bold text-primary">3/5</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Stage 3 of 5
              </span>
              <span className="text-xs font-bold text-on-surface">Production Profile</span>
              <span className="text-[11px] text-on-surface-variant">Next: Business Experience</span>
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

        {/* Section 1: What do you grow and raise on your farm? */}
        <div
          id="q-enterprises"
          className={`bg-surface-container-lowest rounded-3xl border shadow-sm p-6 md:p-8 space-y-4 transition-all ${
            validationErrors.includes("enterprises")
              ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
              : "border-surface-container-high/60"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <div className="flex items-center gap-2">
              <div>
                <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
                  1. What do you grow and raise on your farm?
                  <span className="text-error text-sm">*</span>
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Choose all crops and animals raised for market or household consumption.
                </p>
              </div>
              {validationErrors.includes("enterprises") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full w-fit">
              Select all that apply
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {[
              {
                id: "vegetables_horticulture",
                title: "Vegetables & Horticulture",
                sub: "Tomatoes, Capsicum, Leafy Greens",
                desc: "High-yield market produce with continuous harvest cycles.",
                icon: "nutrition",
              },
              {
                id: "dairy_livestock",
                title: "Dairy & Livestock",
                sub: "Dairy cows, goats, sheep",
                desc: "Milk aggregation, pasture or zero-grazing paddock setup.",
                icon: "cruelty_free",
              },
              {
                id: "cereals_staples",
                title: "Cereals & Staple Crops",
                sub: "Maize, beans, sorghum",
                desc: "Seasonal rain-fed acreage with post-harvest dry grain storage.",
                icon: "grain",
              },
              {
                id: "poultry_smallstock",
                title: "Poultry & Small Stock",
                sub: "Layers, broilers, apiary/bees",
                desc: "Enclosed poultry coops, egg crates, or honey apiaries.",
                icon: "egg",
              },
            ].map((item) => {
              const isSelected = enterprises.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleEnterprise(item.id)}
                  className={`p-4 rounded-2xl cursor-pointer shadow-xs transition-all hover:shadow-md flex items-start justify-between gap-4 border ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-surface-container-high bg-surface-container-lowest hover:bg-surface-container-low/50"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        isSelected ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface leading-snug">{item.title}</h4>
                      <p className={`text-xs font-semibold mt-0.5 ${isSelected ? "text-primary" : "text-on-surface-variant"}`}>
                        {item.sub}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">{item.desc}</p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? "bg-primary text-white" : "border border-outline-variant"
                    }`}
                  >
                    {isSelected && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Primary Cultivation & Production Methods */}
        <div
          id="q-cultivationMethod"
          className={`bg-surface-container-lowest rounded-3xl border shadow-sm p-6 md:p-8 space-y-4 transition-all ${
            validationErrors.includes("cultivationMethod")
              ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
              : "border-surface-container-high/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
                2. Primary Cultivation &amp; Production Methods
                <span className="text-error text-sm">*</span>
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Select the primary method used to cultivate your plots.
              </p>
            </div>
            {validationErrors.includes("cultivationMethod") && (
              <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                Required
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              {
                id: "drip_irrigation",
                title: "Open-Field with Drip Irrigation",
                sub: "Automated precision lines installed",
                icon: "water_drop",
              },
              {
                id: "greenhouse",
                title: "Greenhouse / Shade Netting",
                sub: "Polyhouse & controlled environment",
                icon: "grid_view",
              },
              {
                id: "rainfed",
                title: "Rain-Fed Open Field",
                sub: "Seasonal rainfall dependent",
                icon: "rainy",
              },
              {
                id: "hydroponics",
                title: "Hydroponics / Controlled Agriculture",
                sub: "Soilless substrate or vertical bays",
                icon: "science",
              },
            ].map((item) => {
              const isSelected = cultivationMethod === item.id;
              return (
                <label
                  key={item.id}
                  onClick={() => {
                    setCultivationMethod(item.id);
                    setValidationErrors((prev) => prev.filter((f) => f !== "cultivationMethod"));
                  }}
                  className={`p-4 rounded-2xl cursor-pointer shadow-xs transition-all flex items-center justify-between border ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-surface-container-high bg-surface-container-lowest hover:bg-surface-container-low/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-on-surface block leading-tight">{item.title}</span>
                      <span className={`text-xs ${isSelected ? "text-primary font-semibold" : "text-on-surface-variant"}`}>
                        {item.sub}
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="cultivation_method"
                    checked={isSelected}
                    onChange={() => {
                      setCultivationMethod(item.id);
                      setValidationErrors((prev) => prev.filter((f) => f !== "cultivationMethod"));
                    }}
                    className="w-4 h-4 text-primary accent-primary cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 3: Farm Mechanization & Tools */}
        <div
          id="q-mechanizationSetup"
          className={`bg-surface-container-lowest rounded-3xl border shadow-sm p-6 md:p-8 space-y-4 transition-all ${
            validationErrors.includes("mechanizationSetup")
              ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
              : "border-surface-container-high/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
                3. Farm Mechanization &amp; Tools
                <span className="text-error text-sm">*</span>
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Indicate your predominant equipment setup for tillage, planting, and harvesting.
              </p>
            </div>
            {validationErrors.includes("mechanizationSetup") && (
              <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                Required
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              {
                id: "manual",
                title: "Manual / Hand Tools",
                desc: "Jembes, hoes, knapsack backpack manual sprayers.",
                icon: "pan_tool",
              },
              {
                id: "walking_tiller",
                title: "Walking Two-Wheel Power Tiller",
                desc: "Single-axle rotavator walking tiller for furrow beds.",
                icon: "moped",
              },
              {
                id: "hired_tractor",
                title: "Hired Tractor & Implements",
                desc: "Contractor disc plowing, harrowing, and trailer transport.",
                icon: "agriculture",
              },
              {
                id: "owned_tractor",
                title: "Owned Tractor & Mechanized Fleet",
                desc: "Dedicated 4WD tractors, boom sprayers, or combine units.",
                icon: "precision_manufacturing",
              },
            ].map((item) => {
              const isSelected = mechanizationSetup === item.id;
              return (
                <label
                  key={item.id}
                  onClick={() => {
                    setMechanizationSetup(item.id);
                    setValidationErrors((prev) => prev.filter((f) => f !== "mechanizationSetup"));
                  }}
                  className={`p-4 rounded-2xl cursor-pointer transition-all flex items-start gap-3.5 border ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-surface-container-high bg-surface-container-lowest hover:bg-surface-container-low/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="mechanization_setup"
                    checked={isSelected}
                    onChange={() => {
                      setMechanizationSetup(item.id);
                      setValidationErrors((prev) => prev.filter((f) => f !== "mechanizationSetup"));
                    }}
                    className="mt-1 w-4 h-4 text-primary accent-primary cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[20px] ${isSelected ? "text-primary" : "text-on-surface-variant"}`}>
                          {item.icon}
                        </span>
                        <span className="text-sm font-bold text-on-surface leading-snug">{item.title}</span>
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">{item.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 4: Energy & Pumping Source */}
        <div
          id="q-energySource"
          className={`bg-surface-container-lowest rounded-3xl border shadow-sm p-6 md:p-8 space-y-4 transition-all ${
            validationErrors.includes("energySource")
              ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
              : "border-surface-container-high/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
                4. Energy &amp; Pumping Source for Farm Operations
                <span className="text-error text-sm">*</span>
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Determine operational costs and evaluate renewable energy subsidy grants.
              </p>
            </div>
            {validationErrors.includes("energySource") && (
              <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                Required
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              {
                id: "solar_pv",
                title: "Solar PV Water Pumping",
                desc: "Photovoltaic surface/borehole pump system.",
                icon: "solar_power",
                rebatePill: "Eligible for 30% Green Rebate",
              },
              {
                id: "national_grid",
                title: "National Grid Electricity",
                desc: "Mains 3-phase or single-phase utility connection.",
                icon: "bolt",
              },
              {
                id: "generator",
                title: "Diesel / Petrol Generator",
                desc: "Portable fuel engines powering water pumps or shredders.",
                icon: "local_gas_station",
              },
              {
                id: "gravity",
                title: "Gravity / Non-powered",
                desc: "Highland elevation stream feeds, hand pumps, or manual carrying.",
                icon: "water",
              },
            ].map((item) => {
              const isSelected = energySource === item.id;
              return (
                <label
                  key={item.id}
                  onClick={() => {
                    setEnergySource(item.id);
                    setValidationErrors((prev) => prev.filter((f) => f !== "energySource"));
                  }}
                  className={`p-4 rounded-2xl cursor-pointer shadow-xs transition-all flex items-start justify-between gap-3 border ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-surface-container-high bg-surface-container-lowest hover:bg-surface-container-low/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-on-surface leading-snug">{item.title}</span>
                      {item.rebatePill && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-primary-container text-[11px] font-bold">
                          <span className="material-symbols-outlined text-[13px]">eco</span>
                          {item.rebatePill}
                        </span>
                      )}
                      <p className="text-xs text-on-surface-variant">{item.desc}</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="energy_source"
                    checked={isSelected}
                    onChange={() => {
                      setEnergySource(item.id);
                      setValidationErrors((prev) => prev.filter((f) => f !== "energySource"));
                    }}
                    className="mt-1 w-4 h-4 text-primary accent-primary cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Floating Bottom Navigation */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] pb-safe">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link
              href="/onboarding/characteristics"
              className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>&larr;</span>
              <span>Back to Characteristics</span>
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
