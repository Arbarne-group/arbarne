"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import SearchSelect from "@/components/SearchSelect";
import { getActiveUserEmail, setActiveUserSession } from "@/lib/onboardingGuard";
import {
  TENURE_OPTIONS,
  WATER_OPTIONS,
  ENERGY_OPTIONS,
  IRRIGATION_OPTIONS,
  STORAGE_OPTIONS,
  PROCESSING_OPTIONS,
  MARKET_TYPE_OPTIONS,
  BUYER_OPTIONS,
  COMMERCIAL_YEARS_OPTIONS,
  REVENUE_OPTIONS,
  REGISTRATION_OPTIONS,
  MANAGEMENT_OPTIONS,
  OBJECTIVE_OPTIONS,
  getBusinessProfileStatus,
  type FieldOption,
} from "@/lib/businessProfile";
import { ArrowLeft, ChevronLeft } from "lucide-react";

/* ---------- small primitives ---------- */

function Explain({ text }: { text: string }) {
  return (
    <span className="group/q relative inline-flex align-middle ml-1.5 cursor-help">
      <span className="material-symbols-outlined text-[16px] text-secondary">
        help
      </span>
      <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-1 hidden w-56 -translate-x-1/2 rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-[12px] font-normal leading-relaxed text-on-surface shadow-xl group-hover/q:block">
        {text}
      </span>
    </span>
  );
}

function Section({
  index,
  title,
  desc,
  children,
}: {
  index: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
      <div className="flex items-center gap-3 mb-1.5">
        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold tracking-wide uppercase">
          {index}
        </span>
      </div>
      <h2 className="text-lg md:text-xl font-bold text-on-surface">{title}</h2>
      <p className="text-sm md:text-md text-on-surface-variant mt-1 mb-5">{desc}</p>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  explain,
  error,
  children,
}: {
  label: string;
  explain?: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div id={`q-${label}`}>
      <span className="block text-[15px] font-semibold text-on-surface mb-2">
        {label}
        {explain && <Explain text={explain} />}
        {error && (
          <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
            Required
          </span>
        )}
      </span>
      {children}
    </div>
  );
}

function Single({
  options,
  value,
  onChange,
  cols = 1,
}: {
  options: FieldOption[];
  value: string;
  onChange: (v: string) => void;
  cols?: 1 | 2;
}) {
  return (
    <div className={`grid grid-cols-1 ${cols === 2 ? "sm:grid-cols-2" : ""} gap-2.5`}>
      {options.map((o) => {
        const s = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
              s
                ? "border-secondary bg-secondary-container/10 ring-1 ring-secondary shadow-sm"
                : "border-outline-variant hover:bg-surface-container-low"
            }`}
          >
            <span className={`text-[14px] font-semibold ${s ? "text-secondary" : "text-on-surface"}`}>
              {o.title}
            </span>
            {o.desc && <span className="block text-sm text-on-surface-variant mt-0.5">{o.desc}</span>}
          </button>
        );
      })}
    </div>
  );
}

function Multi({
  options,
  values,
  onChange,
  cols = 1,
}: {
  options: FieldOption[];
  values: string[];
  onChange: (v: string[]) => void;
  cols?: 1 | 2;
}) {
  const exclusiveIds = options.filter((o) => o.exclusive).map((o) => o.id);
  const toggle = (id: string) => {
    // An "exclusive" option (e.g. None) stands alone. Picking it drops every
    // other selection, and picking anything else drops it.
    if (exclusiveIds.includes(id)) {
      onChange(values.includes(id) ? [] : [id]);
      return;
    }
    const next = values.includes(id) ? values.filter((v) => v !== id) : [...values, id];
    onChange(next.filter((v) => !exclusiveIds.includes(v)));
  };
  return (
    <div className={`grid grid-cols-1 ${cols === 2 ? "sm:grid-cols-2" : ""} gap-2.5`}>
      {options.map((o) => {
        const c = values.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => toggle(o.id)}
            className={`rounded-2xl border p-4 flex items-start justify-between gap-3 text-left transition-all cursor-pointer ${
              c
                ? "border-secondary bg-secondary-container/10 ring-1 ring-secondary shadow-sm"
                : "border-outline-variant hover:bg-surface-container-low"
            }`}
          >
            <span>
              <span className={`text-[14px] font-semibold ${c ? "text-secondary" : "text-on-surface"}`}>
                {o.title}
              </span>
              {o.desc && <span className="block text-sm text-on-surface-variant mt-0.5">{o.desc}</span>}
              {o.badge && (
                <span className="inline-block mt-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {o.badge}
                </span>
              )}
            </span>
            <span
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                c ? "bg-secondary border-secondary text-white" : "border-outline-variant"
              }`}
            >
              {c && <span className="material-symbols-outlined text-[15px]">check</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function parseList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v !== "string" || !v.trim()) return [];
  try {
    const p = JSON.parse(v);
    if (Array.isArray(p)) return p.map(String);
  } catch {}
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

/* The enterprise fields are open-ended: the farmer writes their own answers,
   one per line. The database still stores them as JSON string arrays, so the
   same columns keep working for anything that already reads them. */

function joined(values: string[]): string {
  return values.join("\n");
}

function lines(text: string): string[] {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}


/* ---------- page ---------- */

export default function FarmBusinessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loadError, setLoadError] = useState("");

  const [businessId, setBusinessId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [managerRole, setManagerRole] = useState("");
  const [country, setCountry] = useState("");
  const [geoCountry, setGeoCountry] = useState("");
  const [countries, setCountries] = useState<{ initials: string; name: string; dialCode: string; flagEmoji: string | null }[]>([]);
  const [countriesError, setCountriesError] = useState("");
  const [counties, setCounties] = useState<{ code: string; name: string }[]>([]);
  const [county, setCounty] = useState("");
  const [subcounty, setSubcounty] = useState("");
  const [subcounties, setSubcounties] = useState<{ code: string; name: string }[]>([]);
  const [ward, setWard] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [farmUnit, setFarmUnit] = useState("Acres");
  const [cultivatedAcres, setCultivatedAcres] = useState("");
  const [grazingAcres, setGrazingAcres] = useState("");
  const [landTenure, setLandTenure] = useState("");
  const [enterprisesText, setEnterprisesText] = useState("");
  const [enterpriseCore, setEnterpriseCore] = useState("");
  const [enterpriseStrategicText, setEnterpriseStrategicText] = useState("");
  const [enterpriseCashFlowText, setEnterpriseCashFlowText] = useState("");
  const [irrigationMethod, setIrrigationMethod] = useState("");
  const [irrigationOther, setIrrigationOther] = useState("");
  const [waterSources, setWaterSources] = useState<string[]>([]);
  const [energySource, setEnergySource] = useState("");
  const [storageFacilities, setStorageFacilities] = useState<string[]>([]);
  const [processingFacilities, setProcessingFacilities] = useState<string[]>([]);
  const [processingOther, setProcessingOther] = useState("");
  const [permanentWorkers, setPermanentWorkers] = useState("");
  const [seasonalWorkers, setSeasonalWorkers] = useState("");
  const [familyLabour, setFamilyLabour] = useState("");
  const [marketType, setMarketType] = useState("");
  const [produceBuyers, setProduceBuyers] = useState<string[]>([]);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [commercialYears, setCommercialYears] = useState("");
  const [annualRevenueBracket, setAnnualRevenueBracket] = useState("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [twelveMonthSuccess, setTwelveMonthSuccess] = useState("");
  const [developmentPriorities, setDevelopmentPriorities] = useState("");

  useEffect(() => {
    const email = getActiveUserEmail();
    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const u = data?.user;
        if (!u) {
          setLoadError("Could not load your farm profile.");
          return;
        }
        // Submitted profiles belong on /overview — this form is for
        // completing. ?edit=1 keeps an explicit edit path open.
        try {
          const params = new URLSearchParams(window.location.search);
          if (params.get("edit") !== "1" && getBusinessProfileStatus(u).complete) {
            router.replace("/overview");
            return;
          }
        } catch {}
        if (u.businessId) setBusinessId(u.businessId);
        if (u.businessName) setBusinessName(u.businessName);

        /* Carry over what the user already told us in /complete-profile so the
           same facts are not asked for twice. complete-profile only writes to
           the User row, never to the farm tables this page reads. */
        const fromDetailsStep = !!(u.countryCode || u.farmingType);
        if (u.farmerProfile?.jobTitle) setManagerRole(u.farmerProfile.jobTitle);
        else if (fromDetailsStep && u.role === "FFFarmManager") setManagerRole("manager");
        else if (fromDetailsStep && u.role === "FFFarmer") setManagerRole("owner");

        const loc = u.farmLocation ?? {};
        if (loc.country) setGeoCountry(loc.country);
        else if (u.countryCode) setCountry(u.countryCode);
        if (loc.county) setCounty(loc.county);
        if (loc.subcounty) setSubcounty(loc.subcounty);
        if (loc.ward) setWard(loc.ward);
        if (loc.latitude !== null && loc.latitude !== undefined) setLatitude(String(loc.latitude));
        if (loc.longitude !== null && loc.longitude !== undefined) setLongitude(String(loc.longitude));
        const ch = u.farmCharacteristics ?? {};
        if (ch.farmSize !== null && ch.farmSize !== undefined) setFarmSize(String(ch.farmSize));
        if (ch.farmUnit) setFarmUnit(ch.farmUnit);
        if (ch.cultivatedAcres !== null && ch.cultivatedAcres !== undefined) setCultivatedAcres(String(ch.cultivatedAcres));
        if (ch.grazingAcres !== null && ch.grazingAcres !== undefined) setGrazingAcres(String(ch.grazingAcres));
        if (ch.landTenure) setLandTenure(ch.landTenure);
        setWaterSources(parseList(ch.waterSources));
        const sys = u.farmingSystem ?? {};
        setEnterprisesText(joined(parseList(sys.enterprises)));
        if (sys.enterpriseCore) setEnterpriseCore(sys.enterpriseCore);
        setEnterpriseStrategicText(joined(parseList(sys.enterpriseStrategic)));
        setEnterpriseCashFlowText(joined(parseList(sys.enterpriseCashFlow)));
        if (sys.irrigationMethod) setIrrigationMethod(sys.irrigationMethod);
        if (sys.irrigationOther) setIrrigationOther(sys.irrigationOther);
        if (sys.energySource) setEnergySource(sys.energySource);
        setStorageFacilities(parseList(sys.storageFacilities));
        setProcessingFacilities(parseList(sys.processingFacilities));
        if (sys.processingOther) setProcessingOther(sys.processingOther);
        const lab = u.householdLabour ?? {};
        if (lab.permanentWorkers !== null && lab.permanentWorkers !== undefined) setPermanentWorkers(String(lab.permanentWorkers));
        if (lab.seasonalWorkers !== null && lab.seasonalWorkers !== undefined) setSeasonalWorkers(String(lab.seasonalWorkers));
        if (lab.familyLabour !== null && lab.familyLabour !== undefined) setFamilyLabour(String(lab.familyLabour));
        const biz = u.businessExperience ?? {};
        if (biz.marketType) setMarketType(biz.marketType);
        setProduceBuyers(parseList(biz.produceBuyers));
        if (biz.registrationStatus) setRegistrationStatus(biz.registrationStatus);
        if (biz.commercialYears) setCommercialYears(biz.commercialYears);
        if (biz.annualRevenueBracket) setAnnualRevenueBracket(biz.annualRevenueBracket);
        setObjectives(parseList(u.goalsPriorities?.goals));
        if (u.aspiration?.twelveMonthSuccess) setTwelveMonthSuccess(u.aspiration.twelveMonthSuccess);
        if (u.aspiration?.developmentPriorities) setDevelopmentPriorities(u.aspiration.developmentPriorities);
      })
      .catch(() => setLoadError("Could not load your farm profile."))
      .finally(() => setLoading(false));
  }, []);

  /* Geo lists: countries once, counties per selected country */
  useEffect(() => {
    fetch("/api/geo/countries", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.countries) {
          setCountries(data.countries);
          setCountriesError("");
        } else {
          setCountriesError(data?.error || "Could not load countries.");
        }
      })
      .catch(() => setCountriesError("Could not load countries."));
  }, []);

  useEffect(() => {
    if (countries.length === 0 || !geoCountry || country) return;
    const needle = geoCountry.trim().toLowerCase();
    const match = countries.find(
      (c) => c.initials.toLowerCase() === needle || c.name.toLowerCase() === needle
    );
    if (match) {
      setCountry(match.initials);
      setGeoCountry("");
    }
  }, [countries, geoCountry, country]);

  useEffect(() => {
    if (!country) {
      setCounties([]);
      return;
    }
    fetch(`/api/geo/counties?country=${encodeURIComponent(country)}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.counties) setCounties(data.counties);
      })
      .catch(console.error);
  }, [country]);

  /* Sub-counties are fetched by county CODE, but the county state holds the
     name (that is what FarmLocation stores), so resolve the code first.
     The list is cleared in the country/county handlers rather than here, so
     this effect only ever writes state asynchronously. */
  useEffect(() => {
    if (!country || !county) return;
    const match = counties.find((c) => c.name.toLowerCase() === county.trim().toLowerCase());
    if (!match) return;
    let cancelled = false;
    fetch(
      `/api/geo/subcounties?country=${encodeURIComponent(country)}&county=${encodeURIComponent(match.code)}`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.subCounties) setSubcounties(data.subCounties);
      })
      .catch(() => {
        if (!cancelled) setSubcounties([]);
      });
    return () => {
      cancelled = true;
    };
  }, [country, county, counties]);

  const num = (v: string) => (v.trim() === "" ? "" : v);
  const clearError = (key: string) =>
    setErrors((prev) => prev.filter((e) => e !== key));
  const completeness = useMemo(() => {
    const checks = [
      !!businessName.trim(), !!managerRole, !!county.trim(),
      farmSize.trim() !== "" && Number(farmSize) > 0,
      cultivatedAcres.trim() !== "", !!landTenure,
      lines(enterprisesText).length > 0, !!enterpriseCore.trim(),
      lines(enterpriseStrategicText).length > 0, lines(enterpriseCashFlowText).length > 0,
      irrigationMethod === "other_irrigation" ? !!irrigationOther.trim() : !!irrigationMethod,
      waterSources.length > 0, !!energySource,
      storageFacilities.length > 0,
      processingFacilities.length > 0 &&
        (!processingFacilities.includes("other_processing") || !!processingOther.trim()),
      permanentWorkers.trim() !== "", seasonalWorkers.trim() !== "", familyLabour.trim() !== "",
      !!marketType, produceBuyers.length > 0,
      !!registrationStatus, !!commercialYears, !!annualRevenueBracket,
      objectives.length > 0 || !!twelveMonthSuccess.trim(), !!developmentPriorities.trim(),
    ];
    const done = checks.filter(Boolean).length;
    return { done, total: checks.length, percent: Math.round((done / checks.length) * 100) };
  }, [
    businessName, managerRole, county, farmSize, cultivatedAcres, landTenure,
    enterprisesText, enterpriseCore, enterpriseStrategicText, enterpriseCashFlowText,
    irrigationMethod, irrigationOther, waterSources, energySource,
    storageFacilities, processingFacilities, processingOther,
    permanentWorkers, seasonalWorkers, familyLabour, marketType, produceBuyers,
    registrationStatus, commercialYears, annualRevenueBracket, objectives,
    twelveMonthSuccess, developmentPriorities,
  ]);

  async function handleSave(goOverview: boolean) {
    setErrors([]);
    setSaveOk(false);
    const missing: string[] = [];
    if (!businessName.trim()) missing.push("businessName");
    if (!managerRole) missing.push("managerRole");
    if (!country) missing.push("country");
    if (!county.trim()) missing.push("county");
    if (farmSize.trim() === "" || Number(farmSize) <= 0) missing.push("farmSize");
    if (cultivatedAcres.trim() === "") missing.push("cultivatedAcres");
    if (!landTenure) missing.push("landTenure");
    if (lines(enterprisesText).length === 0) missing.push("enterprises");
    if (!enterpriseCore.trim()) missing.push("enterpriseCore");
    if (lines(enterpriseStrategicText).length === 0) missing.push("enterpriseStrategic");
    if (lines(enterpriseCashFlowText).length === 0) missing.push("enterpriseCashFlow");
    if (!irrigationMethod) missing.push("irrigationMethod");
    else if (irrigationMethod === "other_irrigation" && !irrigationOther.trim())
      missing.push("irrigationMethod");
    if (waterSources.length === 0) missing.push("waterSources");
    if (!energySource) missing.push("energySource");
    if (storageFacilities.length === 0) missing.push("storageFacilities");
    if (processingFacilities.length === 0) missing.push("processingFacilities");
    else if (
      processingFacilities.includes("other_processing") &&
      !processingOther.trim()
    )
      missing.push("processingFacilities");
    if (permanentWorkers.trim() === "") missing.push("permanentWorkers");
    if (seasonalWorkers.trim() === "") missing.push("seasonalWorkers");
    if (familyLabour.trim() === "") missing.push("familyLabour");
    if (!marketType) missing.push("marketType");
    if (produceBuyers.length === 0) missing.push("produceBuyers");
    if (!registrationStatus) missing.push("registrationStatus");
    if (!commercialYears) missing.push("commercialYears");
    if (!annualRevenueBracket) missing.push("annualRevenueBracket");
    if (objectives.length === 0 && !twelveMonthSuccess.trim()) missing.push("objectives");
    if (!developmentPriorities.trim()) missing.push("developmentPriorities");
    if (missing.length > 0) {
      setErrors(missing);
      const el = document.getElementById(`q-${missing[0]}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSaving(true);
    const email = getActiveUserEmail();
    try {
      const res = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "farm-profile",
          email,
          data: {
            businessName: businessName.trim(),
            managerRole,
            country: countries.find((c) => c.initials === country)?.name || country,
            county: county.trim(),
            subCounty: subcounty.trim(),
            locality: ward.trim(),
            latitude: latitude.trim(),
            longitude: longitude.trim(),
            farmName: businessName.trim(),
            farmSize: farmSize.trim(),
            farmUnit,
            cultivatedAcres: cultivatedAcres.trim(),
            grazingAcres: grazingAcres.trim(),
            landTenure,
            enterprises: lines(enterprisesText),
            enterpriseCore: enterpriseCore.trim(),
            enterpriseStrategic: lines(enterpriseStrategicText),
            // the old "specs" boxes are gone; clear the legacy columns
            enterpriseStrategicOther: "",
            enterpriseCashFlow: lines(enterpriseCashFlowText),
            enterpriseCashFlowOther: "",
            irrigationMethod,
            irrigationOther: irrigationOther.trim(),
            waterSource: JSON.stringify(waterSources),
            energySource,
            storageFacilities,
            processingFacilities,
            processingOther: processingOther.trim(),
            permanentWorkers: permanentWorkers.trim(),
            seasonalWorkers: seasonalWorkers.trim(),
            familyLabour: familyLabour.trim(),
            marketType,
            produceBuyers,
            registrationStatus,
            commercialYears,
            annualRevenueBracket,
            objectives,
            twelveMonthSuccess: twelveMonthSuccess.trim(),
            developmentPriorities: developmentPriorities.trim(),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed.");
      if (data.user) {
        if (data.user.businessId) setBusinessId(data.user.businessId);
        try {
          localStorage.setItem("future_farms_user", JSON.stringify(data.user));
          setActiveUserSession(data.user);
        } catch {}
      }
      if (goOverview) {
        router.push("/overview");
      } else {
        setSaveOk(true);
        setTimeout(() => setSaveOk(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const err = (key: string) => errors.includes(key);
  const numInput =
    "w-full rounded-xl border border-outline-variant px-4 py-2.5 text-sm focus:border-secondary focus:outline-none bg-surface";
  const textInput =
    "w-full rounded-xl border border-outline-variant px-4 py-2.5 text-sm focus:border-secondary focus:outline-none bg-surface placeholder:text-on-surface-variant/40";
  const textArea =
    "w-full rounded-xl border border-outline-variant px-4 py-2.5 text-sm focus:border-secondary focus:outline-none bg-surface placeholder:text-on-surface-variant/40 resize-y leading-relaxed";

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-secondary/30 border-t-secondary animate-spin" />
            <p className="text-sm text-on-surface-variant">Loading farm business profile...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto w-full pb-40">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="px-3 py-1 bg-secondary text-white rounded-full text-xs font-bold tracking-wide uppercase">
              Farm Business Profile
            </span>
            {businessId ? (
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-xs font-mono font-bold">
                {businessId}
              </span>
            ) : (
              <span className="text-xs text-on-surface-variant">Business ID assigned on first save</span>
            )}
            <span className="text-xs text-on-surface-variant font-medium ml-auto">
              {completeness.done} of {completeness.total} • {completeness.percent}%
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2 tracking-tight">
            Complete your farm business profile
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Help us understand your business more.
          </p>
          <div className="w-full bg-surface-container-highest rounded-full h-2.5 mt-4 overflow-hidden">
            <div
              className="bg-secondary h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${completeness.percent}%` }}
            />
          </div>
        </div>

        {loadError && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-2xl text-red-700 text-sm font-semibold">
            {loadError}
          </div>
        )}

        <div className="space-y-8">
          <Section index="Identity" title="Business identity" desc="How your farm business is known on the platform.">
            <div id="q-businessName">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Business name
                {err("businessName") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Highland Greens Ltd"
                className={textInput}
              />
            </div>
            <div id="q-managerRole">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Farmer / Manager
                <Explain text="Who runs the farm day to day?" />
                {err("managerRole") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Single
                options={[
                  { id: "owner", title: "Owner-Managed directly by me" },
                  { id: "manager", title: "Employed Farm Manager" },
                  { id: "family", title: "Family Members / Relatives" },
                ]}
                value={managerRole}
                onChange={setManagerRole}
              />
            </div>
          </Section>

          <Section index="Location" title="Location" desc="Where the farm business sits and operates.">
            <div id="q-country">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Country
                <Explain text="Start typing to filter, then pick your country." />
                {err("country") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              {countriesError ? (
                <div className="w-full rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] text-red-800">
                  {countriesError}
                </div>
              ) : (
                <SearchSelect
                  value={country}
                  onChange={(v) => {
                    setCountry(v);
                    // A new country invalidates the county and sub-county below it.
                    if (v !== country) {
                      setCounty("");
                      setSubcounty("");
                      setSubcounties([]);
                    }
                    clearError("country");
                  }}
                  placeholder="Select country…"
                  options={countries.map((c) => ({
                    value: c.initials,
                    label: `${c.flagEmoji ? `${c.flagEmoji} ` : ""}${c.name} (${c.initials})`,
                  }))}
                />
              )}
            </div>
            <div id="q-county">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                County / Province
                <Explain text="Start typing to filter, then pick your county or province." />
                {err("county") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <SearchSelect
                value={county}
                onChange={(v) => {
                  setCounty(v);
                  // Sub-counties belong to a county, so a new county invalidates it.
                  if (v !== county) {
                    setSubcounty("");
                    setSubcounties([]);
                  }
                  clearError("county");
                }}
                placeholder={country ? "Select county / province…" : "Select a country first…"}
                disabled={!country}
                options={counties.map((c) => ({ value: c.name, label: c.name }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-[15px] font-semibold text-on-surface mb-2">
                  Sub-county / Area
                  <Explain text="Start typing to filter, then pick your sub-county." />
                </span>
                <SearchSelect
                  value={subcounty}
                  onChange={setSubcounty}
                  placeholder={county ? "Select sub-county…" : "Select a county first…"}
                  disabled={!county}
                  options={subcounties.map((s) => ({ value: s.name, label: s.name }))}
                  onClear={subcounty ? () => setSubcounty("") : undefined}
                />
              </div>
              <div>
                <span className="block text-[15px] font-semibold text-on-surface mb-2">Ward / Village</span>
                <input value={ward} onChange={(e) => setWard(e.target.value)} placeholder="e.g. Ol Karia" className={textInput} />
              </div>
              <div>
                <span className="block text-[15px] font-semibold text-on-surface mb-2">Latitude</span>
                <input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g. -0.72" className={textInput} />
              </div>
              <div>
                <span className="block text-[15px] font-semibold text-on-surface mb-2">Longitude</span>
                <input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g. 36.43" className={textInput} />
              </div>
            </div>
          </Section>

          <Section index="Land" title="Farm size" desc="Total holding, production area and land ownership.">
            <div id="q-farmSize">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Total farm size
                <Explain text="The entire holding in acres or hectares, including homestead, grazing and resting land." />
                {err("farmSize") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <div className="flex gap-2">
                <input type="number" step="0.1" min="0" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} placeholder="e.g. 10.0" className={textInput} />
                <div className="flex gap-1.5 shrink-0">
                  {(["Acres", "Hectares"] as const).map((u) => (
                    <button key={u} type="button" onClick={() => setFarmUnit(u)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${farmUnit === u ? "bg-secondary text-white border-secondary" : "border-outline-variant hover:bg-surface-container-low"}`}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div id="q-cultivatedAcres">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Total area used for production
                <Explain text="Land actively under crops, pasture or livestock in a typical season. Must be provided even if zero." />
                {err("cultivatedAcres") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="number" step="0.1" min="0" value={cultivatedAcres} onChange={(e) => setCultivatedAcres(e.target.value)} placeholder={`Cultivated (${farmUnit})`} className={textInput} />
                <input type="number" step="0.1" min="0" value={grazingAcres} onChange={(e) => setGrazingAcres(e.target.value)} placeholder={`Grazing / resting (${farmUnit})`} className={textInput} />
              </div>
            </div>
            <div id="q-landTenure">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Ownership of the land
                <Explain text="Your legal tenure. Lenders and partners use this to judge collateral and security." />
                {err("landTenure") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Single options={TENURE_OPTIONS} value={landTenure} onChange={setLandTenure} />
            </div>
          </Section>

          <Section index="Enterprise" title="Value-chain enterprises" desc="What the business grows and sells, split by commercial role. Write your own answers — one item per line.">
            <div id="q-enterprises">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Enterprises on the farm
                <Explain text="Write every enterprise you run, one per line — there is no fixed list." />
                {err("enterprises") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <textarea
                value={enterprisesText}
                onChange={(e) => setEnterprisesText(e.target.value)}
                onBlur={() => clearError("enterprises")}
                rows={4}
                placeholder={"Tomatoes\nDairy goats\nPoultry (layers)"}
                className={textArea}
              />
            </div>
            <div id="q-enterpriseCore">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Core value chain — primary commercial crop
                <Explain text="The single crop or product that brings in most of the farm's income today. Type it exactly as buyers know it." />
                {err("enterpriseCore") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <input
                value={enterpriseCore}
                onChange={(e) => setEnterpriseCore(e.target.value)}
                onBlur={() => clearError("enterpriseCore")}
                placeholder="e.g. French beans for export"
                className={textInput}
              />
            </div>
            <div id="q-enterpriseStrategic">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Strategic value chain
                <Explain text="Crops or ventures with long-term value and higher income potential. Value-added products, processing, seed production and similar. One per line." />
                {err("enterpriseStrategic") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <textarea
                value={enterpriseStrategicText}
                onChange={(e) => setEnterpriseStrategicText(e.target.value)}
                onBlur={() => clearError("enterpriseStrategic")}
                rows={4}
                placeholder={"Value addition and packaging\nSeed multiplication"}
                className={textArea}
              />
            </div>
            <div id="q-enterpriseCashFlow">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Cash-flow value chain
                <Explain text="Short production-to-income cycle enterprises that keep cash flowing e.g. milk, eggs, leafy vegetables and similar. One per line." />
                {err("enterpriseCashFlow") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <textarea
                value={enterpriseCashFlowText}
                onChange={(e) => setEnterpriseCashFlowText(e.target.value)}
                onBlur={() => clearError("enterpriseCashFlow")}
                rows={4}
                placeholder={"Milk — 10 Friesians averaging 60L/day\nEggs — 500 layers"}
                className={textArea}
              />
            </div>
          </Section>

          <Section index="Infrastructure" title="Infrastructure" desc="Water, power, storage and processing assets.">
            <div id="q-irrigationMethod">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Irrigation system
                <Explain text="How water reaches the crop. Pick the system covering most of the irrigated area." />
                {err("irrigationMethod") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Single options={IRRIGATION_OPTIONS} value={irrigationMethod} onChange={setIrrigationMethod} cols={2} />
              {irrigationMethod === "other_irrigation" && (
                <div className="mt-2.5">
                  <input
                    value={irrigationOther}
                    onChange={(e) => setIrrigationOther(e.target.value)}
                    onBlur={() => clearError("irrigationMethod")}
                    placeholder="Describe your irrigation system — e.g. sand-drip borehole, solar borehole"
                    className={textInput}
                  />
                </div>
              )}
            </div>
            <div id="q-waterSources">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Water source
                <Explain text="Tick every source the farm draws from across the year." />
                {err("waterSources") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Multi options={WATER_OPTIONS} values={waterSources} onChange={setWaterSources} cols={2} />
            </div>
            <div id="q-energySource">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Energy source
                <Explain text="The main power behind pumping, cooling and machinery." />
                {err("energySource") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Single options={ENERGY_OPTIONS} value={energySource} onChange={setEnergySource} cols={2} />
            </div>
            <div id="q-storageFacilities">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Storage facility
                <Explain text="Where harvested produce and inputs are kept. Reduces post-harvest losses." />
                {err("storageFacilities") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Multi options={STORAGE_OPTIONS} values={storageFacilities} onChange={setStorageFacilities} cols={2} />
            </div>
            <div id="q-processingFacilities">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Processing facilities
                <Explain text="Any on-farm value addition equipment e.g. milling, cooling, packaging, seed or dairy processing." />
                {err("processingFacilities") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Multi options={PROCESSING_OPTIONS} values={processingFacilities} onChange={setProcessingFacilities} cols={2} />
              {processingFacilities.includes("other_processing") && (
                <div className="mt-2.5">
                  <input
                    value={processingOther}
                    onChange={(e) => setProcessingOther(e.target.value)}
                    onBlur={() => clearError("processingFacilities")}
                    placeholder="Describe your processing facility — e.g. solar dryer, honey extractor"
                    className={textInput}
                  />
                </div>
              )}
            </div>
          </Section>

          <Section index="Labour" title="Labour" desc="Everyone who works the farm, all year and in season.">
            <div id="q-permanentWorkers">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Workforce numbers
                <Explain text="Headcounts, not names. Enter 0 where a category does not apply." />
                {(err("permanentWorkers") || err("seasonalWorkers") || err("familyLabour")) && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="block text-xs font-bold text-on-surface mb-1.5">Permanent workers</span>
                  <input type="number" min="0" value={permanentWorkers} onChange={(e) => setPermanentWorkers(e.target.value)} placeholder="0" className={textInput} />
                </div>
                <div>
                  <span className="block text-xs font-bold text-on-surface mb-1.5">Seasonal workers</span>
                  <input type="number" min="0" value={seasonalWorkers} onChange={(e) => setSeasonalWorkers(e.target.value)} placeholder="0" className={textInput} />
                </div>
                <div>
                  <span className="block text-xs font-bold text-on-surface mb-1.5">Household / family labour</span>
                  <input type="number" min="0" value={familyLabour} onChange={(e) => setFamilyLabour(e.target.value)} placeholder="0" className={textInput} />
                </div>
              </div>
            </div>
          </Section>

          <Section index="Markets" title="Markets" desc="Where the harvest goes and who pays for it.">
            <div id="q-marketType">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Primary market type
                <Explain text="The channel moving most of your volume. Main buyer or customer categories sit below." />
                {err("marketType") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Single options={MARKET_TYPE_OPTIONS} value={marketType} onChange={setMarketType} cols={2} />
            </div>
            <div id="q-produceBuyers">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Main buyer / customer categories
                <Explain text="Tick every buyer type you sold to in the last 12 months." />
                {err("produceBuyers") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Multi options={BUYER_OPTIONS} values={produceBuyers} onChange={setProduceBuyers} cols={2} />
            </div>
          </Section>

          <Section index="About Business" title="" desc="">
            <div id="q-registrationStatus">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Business registration status
                <Explain text="Formal registration unlocks financing, contracts and export paperwork." />
                {err("registrationStatus") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Single options={REGISTRATION_OPTIONS} value={registrationStatus} onChange={setRegistrationStatus} />
            </div>
            <div id="q-commercialYears">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Years in operation
                <Explain text="How long the business has been selling commercially." />
                {err("commercialYears") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Single
                options={COMMERCIAL_YEARS_OPTIONS}
                value={commercialYears}
                onChange={setCommercialYears}
                cols={2}
              />
            </div>
            <div id="q-annualRevenueBracket">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Approximate production scale / revenue band
                <Explain text="Best estimate of annual farm sales. Used to match financing and buyers." />
                {err("annualRevenueBracket") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Single options={REVENUE_OPTIONS} value={annualRevenueBracket} onChange={setAnnualRevenueBracket} />
            </div>
          </Section>

          <Section index="Goals" title="Farm goals" desc="What the business is chasing, and what it needs first.">
            <div id="q-objectives">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Primary farm objectives
                <Explain text="Tick the outcomes that matter most over the next 1–3 years." />
                {err("objectives") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <Multi options={OBJECTIVE_OPTIONS} values={objectives} onChange={setObjectives} cols={2} />
            </div>
            <div id="q-twelveMonthSuccess">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                12-month success picture
                <Explain text="What does a successful next 12 months look like for this business?" />
              </span>
              <textarea
                rows={3}
                value={twelveMonthSuccess}
                onChange={(e) => setTwelveMonthSuccess(e.target.value)}
                placeholder="e.g. Double milk output with the new cooler running daily..."
                className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:outline-none bg-surface placeholder:text-on-surface-variant/40"
              />
            </div>
            <div id="q-developmentPriorities">
              <span className="block text-[15px] font-semibold text-on-surface mb-2">
                Development priorities
                <Explain text="The 2–3 improvements or investments the business needs first." />
                {err("developmentPriorities") && (
                  <span className="ml-2 text-[12px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Required</span>
                )}
              </span>
              <textarea
                rows={3}
                value={developmentPriorities}
                onChange={(e) => setDevelopmentPriorities(e.target.value)}
                placeholder="e.g. Solar borehole, certified seed potato, milk transport..."
                className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:outline-none bg-surface placeholder:text-on-surface-variant/40"
              />
            </div>
          </Section>
        </div>

        {errors.length > 0 && (
          <div className="mt-8 p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center gap-3 text-red-700 text-sm shadow-xs">
            <span className="material-symbols-outlined text-red-500 text-xl shrink-0">error</span>
            <span className="font-semibold">
              Please complete all required fields ({errors.length} remaining).
            </span>
          </div>
        )}

        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/overview"
            className=" text-xs flex flex-row gap-1 justify-center items-center p-1 md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4"/> Back to Overview
          </Link>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {saveOk && (
              <span className="text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                Saved
              </span>
            )}
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-outline-variant hover:border-secondary text-on-surface hover:text-secondary font-semibold text-xs md:text-sm transition-all cursor-pointer disabled:opacity-70 bg-surface"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs md:text-sm btn-shadow hover-lift transition-all cursor-pointer disabled:opacity-70"
            >
              Save & View Profile
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
