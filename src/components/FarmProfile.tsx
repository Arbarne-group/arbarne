"use client";

import { useEffect, useMemo, useState } from "react";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

type FarmProfileData = {
  farmName: string;
  futureFarmId: string;
  yearEstablished: string;
  ownershipType: string;

  managerName: string;
  managerRole: string;
  phone: string;
  email: string;

  country: string;
  county: string;
  subCounty: string;
  locality: string;
  latitude: string;
  longitude: string;

  farmSize: string;
  farmUnit: string;
  cultivatedAcres: string;
  landTenure: string;

  enterpriseType: string;
  crops: string[];
  livestock: string[];
  productionSystem: string;

  irrigationMethod: string;
  waterSource: string;
  energyAccess: string;
  storageFacilities: string;

  permanentWorkers: string;
  seasonalWorkers: string;
  familyLabour: string;

  marketType: string;
  buyers: string[];
  registrationStatus: string;
  yearsOperating: string;
  revenueBracket: string;

  twelveMonthSuccess: string;
  developmentPriorities: string;
};

type OnboardingUser = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  farmName?: string;
  futureFarmId?: string;

  farmLocation?: any;
  farmCharacteristics?: any;
  farmingSystem?: any;
  householdLabour?: any;
  farmerProfile?: any;
  businessExperience?: any;
  aspiration?: any;
};

function display(value: unknown): string {
  if (value === null || value === undefined) return "";

  if (typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    const rawVal = obj.label || obj.name || obj.value || Object.values(obj)[0];
    return display(rawVal);
  }

  const str = String(value).trim();
  if (!str) return "";

  let formatted = str
    .split(/[-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  if (/^\d+\s+\d+(\s+Years?)?$/i.test(formatted)) {
    const parts = formatted.split(/\s+/);
    return `${parts[0]}-${parts[1]} `;
  }

  if (/^\d+(-\d+)?\+?$/.test(str)) {
    return `${str} `;
  }

  return formatted;
}

function parseList(value: unknown): string[] {
  if (value === null || value === undefined) return [];

  // Parse strings or arrays, cleaning up snake_case tags
  let rawItems: unknown[] = [];
  if (Array.isArray(value)) {
    rawItems = value;
  } else if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) rawItems = parsed;
      else rawItems = trimmed.split(",");
    } catch {
      rawItems = trimmed.split(",");
    }
  }

  return rawItems.map((v) => display(v)).filter(Boolean);
}

function initialData(user: OnboardingUser, farmId?: string): FarmProfileData {
  const location = user?.farmLocation ?? {};
  const characteristics = user?.farmCharacteristics ?? {};
  const farming = user?.farmingSystem ?? {};
  const labour = user?.householdLabour ?? {};
  const farmer = user?.farmerProfile ?? {};
  const business = user?.businessExperience ?? {};
  const aspiration = user?.aspiration ?? {};

  const crops = parseList(farming?.crops);
  const enterprises = parseList(farming?.enterprises);
  const livestock = parseList(farming?.livestock);
  const buyers = parseList(business?.produceBuyers);
  const waterSources = parseList(characteristics?.waterSources);

  return {
    farmName: display(user?.farmName),
    futureFarmId: display(
      farmId ||
        user?.futureFarmId ||
        (user?.id ? `FFF-KE-PROD-${user.id.slice(-4).toUpperCase()}` : ""),
    ),
    yearEstablished: display(characteristics?.yearEstablished),
    ownershipType: display(
      characteristics?.ownershipType || characteristics?.landTenure,
    ),

    managerName: display(user?.name),
    managerRole: display(
      farmer?.jobTitle || farmer?.role || farmer?.occupation,
    ),
    phone: display(user?.phone),
    email: display(user?.email),

    country: display(location?.country || "Kenya"),
    county: display(location?.county),
    subCounty: display(location?.subCounty || location?.subcounty),
    locality: display(
      location?.locality || location?.village || location?.ward,
    ),
    latitude: display(location?.latitude),
    longitude: display(location?.longitude),

    farmSize: display(characteristics?.farmSize),
    farmUnit: display(
      characteristics?.farmUnit || characteristics?.farmSizeUnit || "acres",
    ),
    cultivatedAcres: display(characteristics?.cultivatedAcres),
    landTenure: display(
      characteristics?.landTenure || characteristics?.ownershipType,
    ),

    enterpriseType: display(farming?.enterpriseType),
    crops: crops.length > 0 ? crops : enterprises,
    livestock,
    productionSystem: display(
      farming?.productionSystem || farming?.cultivationMethod,
    ),

    irrigationMethod: display(farming?.irrigationMethod),
    waterSource: display(
      farming?.waterSource ||
        (waterSources.length ? waterSources.join(", ") : ""),
    ),
    energyAccess: display(farming?.energyAccess || farming?.energySource),
    storageFacilities: display(farming?.storageFacilities),

    permanentWorkers: display(labour?.permanentWorkers),
    seasonalWorkers: display(labour?.seasonalWorkers),
    familyLabour: display(labour?.familyLabour),

    marketType: display(business?.marketType),
    buyers,
    registrationStatus: display(business?.registrationStatus),
    yearsOperating: display(
      business?.yearsOperating || business?.commercialYears,
    ),
    revenueBracket: display(
      business?.revenueBracket || business?.annualRevenueBracket,
    ),

    twelveMonthSuccess: display(aspiration?.twelveMonthSuccess),
    developmentPriorities: display(
      aspiration?.developmentPriorities || aspiration?.fmResponsibility,
    ),
  };
}

/* =====================================================================
   VISUAL & UI PRIMITIVES
===================================================================== */

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined select-none ${className}`}>
      {name}
    </span>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 px-2 rounded-lg hover:bg-surface-container-low transition-colors duration-150 gap-1 sm:gap-4">
      <span className="text-[13px] font-medium text-on-surface-variant shrink-0">
        {label}
      </span>
      <span className="text-[14px] text-on-surface font-semibold text-left sm:text-right break-words">
        {value}
      </span>
    </div>
  );
}

function TagList({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="py-3.5 px-2">
      <span className="text-[13px] font-medium text-on-surface-variant block mb-2.5">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary-container/60 border border-outline-variant/30 text-on-secondary-container text-[12.5px] font-medium transition-transform hover:scale-[1.02]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  subtitle,
  hasContent,
  children,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  hasContent: boolean;
  children: React.ReactNode;
}) {
  if (!hasContent) return null;
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-outline-variant/40">
        <div className="w-9 h-9 rounded-xl bg-secondary/10 text-primary flex items-center justify-center shrink-0">
          <Icon name={icon} className="text-[20px]" />
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-on-surface leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[12px] text-on-surface-variant mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="divide-y divide-outline-variant/30">{children}</div>
    </div>
  );
}

function KPICard({
  icon,
  label,
  value,
  unit,
}: {
  icon: string;
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm">
      <div className="w-11 h-11 rounded-xl bg-secondary/10 text-primary flex items-center justify-center shrink-0">
        <Icon name={icon} className="text-[22px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11.5px] font-semibold text-on-surface-variant uppercase tracking-wider truncate mb-0.5">
          {label}
        </p>
        <p className="text-xl text-on-surface ">
          {value}
          {unit && (
            <span className="text-[13px] font-medium text-on-surface-variant ml-1.5">
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

/* =====================================================================
   EDIT-MODAL FORM PRIMITIVES
===================================================================== */

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[12.5px] font-semibold text-on-surface-variant">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 text-[14px] text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition duration-150"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[12.5px] font-semibold text-on-surface-variant">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 text-[14px] text-on-surface outline-none resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition duration-150"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[12.5px] font-semibold text-on-surface-variant">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-[14px] text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition duration-150 cursor-pointer"
      >
        <option value="">Select option…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function MultiItemInput({
  label,
  items,
  onChange,
  placeholder = "Add item...",
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !items.includes(trimmed)) {
        onChange([...items, trimmed]);
        setInputValue("");
      }
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <span className="block text-[12.5px] font-semibold text-on-surface-variant">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5 p-2 bg-surface-container-lowest border border-outline-variant rounded-xl min-h-[46px] items-center focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container text-[12px] font-semibold"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-on-secondary-container/70 hover:text-on-secondary-container rounded-full"
            >
              <Icon name="close" className="text-[14px]" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={items.length === 0 ? placeholder : "Add more..."}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-[13.5px] px-1 py-0.5 text-on-surface"
        />
      </div>
      <p className="text-[11px] text-on-surface-variant/70">
        Press Enter or comma to add values
      </p>
    </div>
  );
}

function EditTab({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold transition text-left ${
        active
          ? "bg-primary text-on-primary shadow-sm"
          : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
      }`}
    >
      <Icon name={icon} className="text-[18px]" />
      <span>{label}</span>
    </button>
  );
}

const EDIT_SECTIONS = [
  { key: "farm", icon: "home_work", label: "Farm Overview" },
  { key: "farmer", icon: "person", label: "Farmer Details" },
  { key: "location", icon: "location_on", label: "Location" },
  { key: "land", icon: "landscape", label: "Land & Tenure" },
  { key: "production", icon: "agriculture", label: "Production System" },
  { key: "infrastructure", icon: "water_drop", label: "Infrastructure" },
  { key: "labour", icon: "groups", label: "Labour & Capacity" },
  { key: "markets", icon: "storefront", label: "Markets & Sales" },
  { key: "business", icon: "business", label: "Business & Revenue" },
  { key: "goals", icon: "flag", label: "Aspirations" },
] as const;

/* =====================================================================
   MAIN COMPONENT
===================================================================== */

export default function FarmProfileMetadata() {
  const [user, setUser] = useState<OnboardingUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeEditSection, setActiveEditSection] =
    useState<(typeof EDIT_SECTIONS)[number]["key"]>("farm");
  const [form, setForm] = useState<FarmProfileData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const email = getActiveUserEmail();
        if (!email) throw new Error("No active user email found.");

        const response = await fetch(
          `/api/onboarding/step?email=${encodeURIComponent(email)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );
        if (!response.ok)
          throw new Error(`Failed to load farm profile (${response.status})`);

        const data = await response.json();
        if (!data?.user) throw new Error("Farm profile data was not found.");

        if (!cancelled) setUser(data.user);
      } catch (err) {
        console.error("Farm profile fetch error:", err);
        if (!cancelled)
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your farm profile.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const profile = useMemo(
    () => (user ? initialData(user, user.futureFarmId) : null),
    [user],
  );

  useEffect(() => {
    if (!editing) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [editing]);

  function openEdit() {
    if (!user) return;
    setForm(initialData(user, user.futureFarmId));
    setActiveEditSection("farm");
    setError("");
    setEditing(true);
  }

  function updateField(field: keyof FarmProfileData, value: any) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function save() {
    if (!user || !form) return;
    try {
      setSaving(true);
      setError("");

      const updatedUser: OnboardingUser = {
        ...user,
        farmName: form.farmName,
        futureFarmId: form.futureFarmId,
        farmLocation: {
          ...(user.farmLocation ?? {}),
          country: form.country,
          county: form.county,
          subCounty: form.subCounty,
          locality: form.locality,
          latitude: form.latitude,
          longitude: form.longitude,
        },
        farmCharacteristics: {
          ...(user.farmCharacteristics ?? {}),
          yearEstablished: form.yearEstablished,
          ownershipType: form.ownershipType,
          farmSize: form.farmSize,
          farmUnit: form.farmUnit,
          cultivatedAcres: form.cultivatedAcres,
          landTenure: form.landTenure,
        },
        farmingSystem: {
          ...(user.farmingSystem ?? {}),
          enterpriseType: form.enterpriseType,
          crops: form.crops,
          livestock: form.livestock,
          productionSystem: form.productionSystem,
          cultivationMethod: form.productionSystem,
          irrigationMethod: form.irrigationMethod,
          waterSource: form.waterSource,
          energyAccess: form.energyAccess,
          energySource: form.energyAccess,
          storageFacilities: form.storageFacilities,
        },
        householdLabour: {
          ...(user.householdLabour ?? {}),
          permanentWorkers: form.permanentWorkers,
          seasonalWorkers: form.seasonalWorkers,
          familyLabour: form.familyLabour,
        },
        businessExperience: {
          ...(user.businessExperience ?? {}),
          marketType: form.marketType,
          produceBuyers: form.buyers,
          registrationStatus: form.registrationStatus,
          yearsOperating: form.yearsOperating,
          commercialYears: form.yearsOperating,
          revenueBracket: form.revenueBracket,
          annualRevenueBracket: form.revenueBracket,
        },
        aspiration: {
          ...(user.aspiration ?? {}),
          twelveMonthSuccess: form.twelveMonthSuccess,
          developmentPriorities: form.developmentPriorities,
        },
      };

      setUser(updatedUser);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("We couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background p-6">
        <div className="w-10 h-10 border-3 border-outline-variant/40 border-t-primary rounded-full animate-spin" />
        <p className="text-[13.5px] font-medium text-on-surface-variant mt-4 animate-pulse">
          Retrieving farm profile details…
        </p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <div className="rounded-2xl border border-error/20 bg-error-container/30 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-error/10 text-error rounded-xl">
              <Icon name="error" />
            </div>
            <div>
              <h3 className="font-bold text-on-error-container text-[16px]">
                Unable to load profile
              </h3>
              <p className="text-[13.5px] text-on-error-container/80 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  const labour = user.householdLabour ?? {};
  const totalWorkers =
    (Number(labour?.permanentWorkers) || 0) +
    (Number(labour?.seasonalWorkers) || 0) +
    (Number(labour?.familyLabour) || 0);

  const highlights = [
    profile.farmSize && {
      icon: "landscape",
      label: "Total Area",
      value: profile.farmSize,
      unit: profile.farmUnit,
    },
    profile.county && {
      icon: "location_on",
      label: "County",
      value: profile.county,
    },
    totalWorkers > 0 && {
      icon: "groups",
      label: "Workforce",
      value: String(totalWorkers),
    },
    profile.yearsOperating && {
      icon: "history",
      label: "Experience",
      value: `${profile.yearsOperating} yrs`,
    },
  ].filter(Boolean) as {
    icon: string;
    label: string;
    value: string;
    unit?: string;
  }[];

  const isEmpty = !(
    profile.yearEstablished ||
    profile.managerRole ||
    profile.county ||
    profile.crops.length ||
    profile.waterSource ||
    profile.permanentWorkers ||
    profile.marketType ||
    profile.twelveMonthSuccess
  );

  return (
    <>
      <div className="bg-background min-h-screen px-4 sm:px-6 lg:px-10 py-8 pb-20 text-on-surface">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* ── HERO BANNER ───────────────────────────────────────── */}
          <div className="bg-primary rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-lg">
            <div className="absolute -right-12 -top-20 w-80 h-80 rounded-full bg-on-primary/[0.06] pointer-events-none" />
            <div className="absolute right-24 -bottom-24 w-60 h-60 rounded-full bg-on-primary/[0.04] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-3 min-w-0 max-w-2xl">
                <h1 className="text-[28px] sm:text-[36px] font-black text-on-primary leading-tight tracking-tight truncate">
                  {profile.farmName || "Unnamed Enterprise"}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-[13px] text-on-primary/80 font-medium">
                  {profile.futureFarmId && (
                    <span className="flex items-center gap-1.5 bg-secondary/80 px-2.5 py-1 rounded-lg">
                      <Icon name="fingerprint" className="text-[16px]" />
                      Farm ID:
                      {profile.futureFarmId}
                    </span>
                  )}
                  {profile.locality && (
                    <span className="flex items-center gap-1.5">
                      <Icon name="place" className="text-[16px]" />
                      {profile.locality}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={openEdit}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-on-primary text-primary hover:bg-on-primary/90 px-5 py-3 text-[14px] font-bold transition-all duration-150 shadow-md shrink-0 self-start md:self-auto active:scale-[0.98]"
              >
                <Icon name="edit" className="text-[18px]" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* ── METRICS DASHBOARD ─────────────────────────────────── */}
          {highlights.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {highlights.map((h) => (
                <KPICard key={h.label} {...h} />
              ))}
            </div>
          )}

          {/* ── MASONRY-STYLE DETAILS GRID ───────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard
              icon="home_work"
              title="Farm Overview"
              subtitle="Basic identification and tenure info"
              hasContent={Boolean(
                profile.yearEstablished ||
                profile.ownershipType ||
                profile.landTenure,
              )}
            >
              <DataRow
                label="Year Established"
                value={profile.yearEstablished}
              />
              <DataRow label="Ownership Type" value={profile.ownershipType} />
              <DataRow label="Land Tenure Status" value={profile.landTenure} />
            </SectionCard>

            <SectionCard
              icon="person"
              title="Management & Contacts"
              subtitle="Primary operational contacts"
              hasContent={Boolean(
                profile.managerRole || profile.phone || profile.email,
              )}
            >
              <DataRow label="Manager Role" value={profile.managerRole} />
              <DataRow label="Contact Phone" value={profile.phone} />
              <DataRow label="Contact Email" value={profile.email} />
            </SectionCard>

            <SectionCard
              icon="location_on"
              title="Location Details"
              subtitle="Geographic boundaries & coordinates"
              hasContent={Boolean(
                profile.subCounty ||
                profile.latitude ||
                profile.longitude ||
                profile.country,
              )}
            >
              <DataRow label="Country" value={profile.country} />
              <DataRow label="Sub-County" value={profile.subCounty} />
              <DataRow
                label="GPS Coordinates"
                value={
                  profile.latitude && profile.longitude
                    ? `${profile.latitude}, ${profile.longitude}`
                    : ""
                }
              />
            </SectionCard>

            <SectionCard
              icon="water_drop"
              title="Infrastructure & Resources"
              subtitle="Utilities and storage assets"
              hasContent={Boolean(
                profile.waterSource ||
                profile.irrigationMethod ||
                profile.energyAccess ||
                profile.storageFacilities,
              )}
            >
              <DataRow label="Water Source" value={profile.waterSource} />
              <DataRow
                label="Irrigation System"
                value={profile.irrigationMethod}
              />
              <DataRow label="Energy Access" value={profile.energyAccess} />
              <DataRow
                label="Storage Infrastructure"
                value={profile.storageFacilities}
              />
            </SectionCard>
          </div>

          {isEmpty && (
            <div className="text-center py-16 px-4 bg-surface-container-lowest border border-dashed border-outline-variant/80 rounded-3xl">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Icon name="agriculture" className="text-[32px]" />
              </div>
              <h3 className="text-[18px] font-bold text-on-surface">
                No Farm Information Available
              </h3>
              <p className="text-[14px] text-on-surface-variant max-w-md mx-auto mt-1 mb-6">
                Your farm profile metadata hasn't been configured yet. Populate
                your details to start managing operations.
              </p>
              <button
                type="button"
                onClick={openEdit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-[14px] font-bold hover:opacity-90 transition shadow-sm"
              >
                <Icon name="add" />
                Fill Out Profile
              </button>
            </div>
          )}

          {error && user && (
            <div className="rounded-xl border border-error/30 bg-error-container/30 p-4 flex items-center gap-3">
              <Icon name="warning" className="text-error shrink-0" />
              <p className="text-[13.5px] font-medium text-on-error-container">
                {error}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          EDIT MODAL
      ═══════════════════════════════════════════════════════════ */}

      {editing && form && (
        <div className="fixed inset-0 z-100 bg-on-surface/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[90vh] bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/40">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-outline-variant/40 flex items-center justify-between bg-primary text-on-primary">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-on-secondary/10 flex items-center justify-center">
                  <Icon name="edit" className="text-[20px]" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold leading-tight">
                    Edit Farm Profile
                  </h2>
                  <p className="text-[12px] text-on-primary/70">
                    Update enterprise details and metrics
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !saving && setEditing(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-on-primary/80 hover:bg-on-primary/15 transition"
              >
                <Icon name="close" />
              </button>
            </div>

            {/* Modal Content - Single Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-surface-container-lowest">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                {/* Section 1: Farm Overview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-2">
                    <Icon
                      name="home_work"
                      className="text-primary text-[20px]"
                    />
                    <h3 className="text-[15px] font-bold text-on-surface">
                      Farm Overview
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput
                      label="Farm Name"
                      value={form.farmName}
                      onChange={(v) => updateField("farmName", v)}
                    />

                    <SelectInput
                      label="Ownership Type"
                      value={form.ownershipType}
                      onChange={(v) => updateField("ownershipType", v)}
                      options={[
                        "Owned",
                        "Leased",
                        "Family land",
                        "Community land",
                        "Other",
                      ]}
                    />
                  </div>
                </div>

                {/* Section 2: Farmer / Manager Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-2">
                    <Icon name="person" className="text-primary text-[20px]" />
                    <h3 className="text-[15px] font-bold text-on-surface">
                      Farmer / Manager Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput
                      label="Full Name"
                      value={form.managerName}
                      onChange={(v) => updateField("managerName", v)}
                    />
                    <TextInput
                      label="Role / Title"
                      value={form.managerRole}
                      onChange={(v) => updateField("managerRole", v)}
                    />
                    <TextInput
                      label="Phone Number"
                      value={form.phone}
                      onChange={(v) => updateField("phone", v)}
                      type="tel"
                    />
                    <TextInput
                      label="Email Address"
                      value={form.email}
                      onChange={(v) => updateField("email", v)}
                      type="email"
                    />
                  </div>
                </div>

                {/* Section 3: Location */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-2">
                    <Icon
                      name="location_on"
                      className="text-primary text-[20px]"
                    />
                    <h3 className="text-[15px] font-bold text-on-surface">
                      Location Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput
                      label="Country"
                      value={form.country}
                      onChange={(v) => updateField("country", v)}
                    />
                    <TextInput
                      label="County"
                      value={form.county}
                      onChange={(v) => updateField("county", v)}
                    />
                    <TextInput
                      label="Sub-County"
                      value={form.subCounty}
                      onChange={(v) => updateField("subCounty", v)}
                    />
                    <TextInput
                      label="Locality / Village"
                      value={form.locality}
                      onChange={(v) => updateField("locality", v)}
                    />
                    <TextInput
                      label="Latitude"
                      value={form.latitude}
                      onChange={(v) => updateField("latitude", v)}
                    />
                    <TextInput
                      label="Longitude"
                      value={form.longitude}
                      onChange={(v) => updateField("longitude", v)}
                    />
                  </div>
                </div>

                {/* Section 4: Land & Tenure */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-2">
                    <Icon
                      name="landscape"
                      className="text-primary text-[20px]"
                    />
                    <h3 className="text-[15px] font-bold text-on-surface">
                      Land & Tenure
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput
                      label="Total Farm Size"
                      value={form.farmSize}
                      onChange={(v) => updateField("farmSize", v)}
                    />
                    <SelectInput
                      label="Size Unit"
                      value={form.farmUnit}
                      onChange={(v) => updateField("farmUnit", v)}
                      options={["acres", "hectares", "plots"]}
                    />
                    <TextInput
                      label="Cultivated Area"
                      value={form.cultivatedAcres}
                      onChange={(v) => updateField("cultivatedAcres", v)}
                    />
                    <SelectInput
                      label="Land Tenure"
                      value={form.landTenure}
                      onChange={(v) => updateField("landTenure", v)}
                      options={["Freehold", "Leasehold", "Customary", "Public"]}
                    />
                  </div>
                </div>

                {/* Section 6: Infrastructure & Utilities */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-2">
                    <Icon
                      name="water_drop"
                      className="text-primary text-[20px]"
                    />
                    <h3 className="text-[15px] font-bold text-on-surface">
                      Infrastructure & Utilities
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectInput
                      label="Water Source"
                      value={form.waterSource}
                      onChange={(v) => updateField("waterSource", v)}
                      options={[
                        "Borehole",
                        "River / Stream",
                        "Rainwater Harvesting",
                        "Municipal",
                        "Dam / Pan",
                      ]}
                    />

                    <SelectInput
                      label="Energy Access"
                      value={form.energyAccess}
                      onChange={(v) => updateField("energyAccess", v)}
                      options={[
                        "Grid Electricity",
                        "Solar Power",
                        "Generator",
                        "None",
                      ]}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/40 flex items-center justify-end gap-3 bg-surface-container-low/50">
              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={saving}
                className="px-4 py-2.5 rounded-xl text-[13.5px] font-semibold text-on-surface-variant hover:bg-surface-container-high transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary text-[13.5px] font-bold hover:opacity-90 transition shadow-sm disabled:opacity-50"
              >
                {saving && (
                  <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                )}
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
