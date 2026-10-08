"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppUser } from "@/hooks/useAppUser";
import { getActiveUserEmail } from "@/lib/onboardingGuard";
import {
  getBusinessProfileStatus,
  TENURE_OPTIONS,
  WATER_OPTIONS,
  ENERGY_OPTIONS,
  IRRIGATION_OPTIONS,
  STORAGE_OPTIONS,
  type FieldOption,
} from "@/lib/businessProfile";
import SearchSelect from "@/components/SearchSelect";

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
  storageFacilities: string[];

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
  businessId?: string;
  businessName?: string;
  business?: {
    businessName?: string | null;
    businessId?: string | null;
  };

  farmLocation?: any;
  farmCharacteristics?: any;
  farmingSystem?: any;
  householdLabour?: any;
  farmerProfile?: any;
  businessExperience?: any;
  aspiration?: any;
};

type GeoCountry = {
  id: string;
  name: string;
  initials: string;
  flagEmoji?: string | null;
};

type GeoCounty = {
  id: string;
  name: string;
  code: string;
  countryCode: string;
};

type GeoTown = {
  id: string;
  name: string;
  code: string;
  countryCode: string;
  countyCode: string;
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

type SelectOption = { value: string; label: string; aliases?: string[] };

/** Canonical form of a stored value: "Communal Family" -> "communalfamily". */
function optionKey(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Resolve whatever is in the database (a canonical id, a display string like
 * "Communal Family", or a legacy hand-picked label) onto one of `options`.
 * Without this every select in the modal fell back to "Select option…"
 * because `display()` title-cases ids such as `communal_family`.
 */
function resolveOption(
  options: SelectOption[],
  stored: string
): SelectOption | undefined {
  const key = optionKey(stored);
  if (!key) return undefined;
  return options.find(
    (o) =>
      optionKey(o.value) === key ||
      optionKey(o.label) === key ||
      (o.aliases ?? []).some((a) => optionKey(a) === key)
  );
}

/** Keeps an unrecognised stored value visible instead of silently dropping it. */
function withCurrent(options: SelectOption[], stored: string): SelectOption[] {
  if (!stored || resolveOption(options, stored)) return options;
  return [...options, { value: stored, label: `${stored} (not in list)` }];
}

/** Change detection for the save diff, tolerant of id vs. display formatting. */
function valuesEqual(next: unknown, prev: unknown): boolean {
  if (Array.isArray(next) || Array.isArray(prev)) {
    const a = (Array.isArray(next) ? next : []).map(optionKey);
    const b = (Array.isArray(prev) ? prev : []).map(optionKey);
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  if (typeof next === "string" || typeof prev === "string") {
    return optionKey(next) === optionKey(prev);
  }
  return next === prev;
}

// Ownership has no canonical model in the onboarding schema, so keep the modal's
// original labels but give them stable ids and match the legacy free-text values.
// `initialData` falls back to the land-tenure value when ownership is empty, so
// the canonical tenure ids have to resolve here too.
const OWNERSHIP_OPTIONS: SelectOption[] = [
  {
    value: "owned",
    label: "Owned",
    aliases: ["owner", "private", "self owned"],
  },
  { value: "leased", label: "Leased", aliases: ["rented", "rent"] },
  {
    value: "family_land",
    label: "Family land",
    aliases: ["customary", "communal_family", "family"],
  },
  {
    value: "community_land",
    label: "Community land",
    aliases: ["communal", "public"],
  },
  { value: "other", label: "Other" },
];

/** Canonical options, extended with legacy free-text values that map onto them. */
function withAliases(
  list: FieldOption[],
  legacy: Record<string, string[]> = {}
): SelectOption[] {
  return list.map((o) => ({ value: o.id, label: o.title, aliases: legacy[o.id] }));
}

const TENURE_SELECT_OPTIONS: SelectOption[] = [
  ...withAliases(TENURE_OPTIONS, { communal_family: ["customary", "communal"] }),
  { value: "public", label: "Public", aliases: [] },
];

const FARM_UNIT_OPTIONS: SelectOption[] = [
  { value: "Acres", label: "Acres" },
  { value: "Hectares", label: "Hectares" },
  { value: "Plots", label: "Plots" },
];

const WATER_SELECT_OPTIONS: SelectOption[] = withAliases(WATER_OPTIONS, {
  borehole_solar: ["borehole", "well"],
  rainwater_dam: ["dam", "pan", "dam / pan", "rainwater harvesting"],
  river_stream: ["river", "stream"],
  piped_municipal: ["municipal", "piped"],
});

const ENERGY_SELECT_OPTIONS: SelectOption[] = [
  ...withAliases(ENERGY_OPTIONS, {
    national_grid: ["grid electricity", "grid", "electricity"],
    solar_pv: ["solar power", "solar"],
    generator: ["generator"],
  }),
  { value: "none_energy", label: "None", aliases: ["none"] },
];

const IRRIGATION_SELECT_OPTIONS: SelectOption[] = withAliases(
  IRRIGATION_OPTIONS,
  { none_irrigation: ["none"] }
);

const STORAGE_SELECT_OPTIONS: SelectOption[] = withAliases(STORAGE_OPTIONS, {
  none_storage: ["none"],
});

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
    farmName: display(user?.business?.businessName || user?.businessName || user?.farmName),
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
    storageFacilities: parseList(farming?.storageFacilities),

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



function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
  step?: number;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[12.5px] font-semibold text-on-surface-variant">
        {label}
      </span>
      <input
        type={type}
        value={value}
        min={min}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 text-[14px] text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition duration-150"
      />
    </label>
  );
}

function SearchSelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  hint,
  onClear,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
  hint?: string;
  onClear?: () => void;
}) {
  return (
    <div className="block space-y-1.5">
      <span className="block text-[12.5px] font-semibold text-on-surface-variant">
        {label}
      </span>
      <SearchSelect
        value={value}
        onChange={onChange}
        onClear={onClear}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
      />
      {hint && (
        <p className="text-[11px] text-on-surface-variant/70">{hint}</p>
      )}
    </div>
  );
}

/**
 * Sub-county is restricted to predefined values: users cannot type a free-text
 * value that would be saved, so an entered location can never be spam.
 */
function SubCountyInput({
  label,
  value,
  onChange,
  options,
  disabled,
  loading,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  loading?: boolean;
  hint?: string;
}) {
  return (
    <div className="block space-y-1.5">
      <span className="block text-[12.5px] font-semibold text-on-surface-variant">
        {label}
      </span>
      <SearchSelect
        value={value}
        onChange={onChange}
        onClear={() => onChange("")}
        options={options}
        disabled={disabled || loading}
        placeholder={
          loading
            ? "Loading sub-counties…"
            : options.length
              ? "Select a sub-county…"
              : "No sub-counties available"
        }
      />
      <p className="text-[11px] text-on-surface-variant/70">
        {hint ??
          (options.length
            ? "Choose from the official sub-counties for this county."
            : "No sub-counties have been set up for this county yet.")}
      </p>
    </div>
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
  options: SelectOption[];
}) {
  // Show the matched option, and keep any unrecognised legacy value selectable.
  const list = withCurrent(options, value);
  const current = resolveOption(options, value)?.value ?? value;

  return (
    <label className="block space-y-1.5">
      <span className="block text-[12.5px] font-semibold text-on-surface-variant">
        {label}
      </span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-[14px] text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition duration-150 cursor-pointer"
      >
        <option value="">Select option…</option>
        {list.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxGroupInput({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: SelectOption[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  // Match each stored value back to its option so legacy display strings
  // ("Cold Room") tick the right box ("cold_room").
  const selected = useMemo(
    () =>
      values
        .map((v) => resolveOption(options, v)?.value ?? v)
        .filter(Boolean),
    [options, values]
  );

  const toggle = (id: string) =>
    onChange(
      selected.includes(id)
        ? selected.filter((v) => v !== id)
        : [...selected, id]
    );

  return (
    <fieldset className="space-y-1.5">
      <legend className="mb-1.5 block text-[12.5px] font-semibold text-on-surface-variant">
        {label}
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(o.value)}
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition duration-150 cursor-pointer ${
                on
                  ? "border-secondary bg-secondary-container/20 ring-1 ring-secondary"
                  : "border-outline-variant hover:bg-surface-container-low"
              }`}
            >
              <span
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition-colors ${
                  on
                    ? "border-secondary bg-secondary text-white"
                    : "border-outline-variant"
                }`}
              >
                {on && (
                  <span className="material-symbols-outlined text-[13px]">check</span>
                )}
              </span>
              <span
                className={`text-[13px] font-medium ${on ? "text-secondary" : "text-on-surface"}`}
              >
                {o.label}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
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


/* =====================================================================
   MAIN COMPONENT
===================================================================== */

export default function FarmProfileMetadata() {
  const { user: sessionUser, isLoaded: sessionLoaded } = useAppUser();
  const sessionEmail =
    sessionUser?.primaryEmailAddress?.emailAddress ||
    sessionUser?.email ||
    "";
  const [user, setUser] = useState<OnboardingUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FarmProfileData | null>(null);

  const [countries, setCountries] = useState<GeoCountry[]>([]);
  const [counties, setCounties] = useState<GeoCounty[]>([]);
  const [subCounties, setSubCounties] = useState<GeoTown[]>([]);
  const [geoError, setGeoError] = useState("");
  // Which request the loaded lists belong to, so a stale list is never shown
  // and "loading" can be derived instead of stored.
  const [countiesFor, setCountiesFor] = useState("");
  const [subCountiesFor, setSubCountiesFor] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        // Right after an OAuth redirect the local cache may not exist yet
        // wait for the live session instead of failing on first paint.
        if (!sessionLoaded) return;
        setLoading(true);
        setError("");

        const email = sessionEmail || getActiveUserEmail();
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
    // Re-run once the session resolves: on a fresh OAuth login the cached
    // email does not exist on first paint.
  }, [sessionLoaded, sessionEmail]);

  const profile = useMemo(
    () => (user ? initialData(user, user.futureFarmId) : null),
    [user],
  );

  const countryOptions = useMemo<SelectOption[]>(
    () =>
      countries.map((c) => ({
        value: c.name,
        label: `${c.flagEmoji ? `${c.flagEmoji} ` : ""}${c.name} (${c.initials})`,
        aliases: [c.initials],
      })),
    [countries],
  );

  const countyOptions = useMemo<SelectOption[]>(
    () => counties.map((c) => ({ value: c.name, label: c.name, aliases: [c.code] })),
    [counties],
  );

  // Sub-counties come from the curated geography data, so only predefined
  // values can be selected.
  const subCountyOptions = useMemo<SelectOption[]>(
    () => subCounties.map((s) => ({ value: s.name, label: s.name, aliases: [s.code] })),
    [subCounties],
  );

  // Stored country may be the full name or the ISO initials.
  const countryCode = form?.country
    ? (countries.find(
        (c) =>
          optionKey(c.name) === optionKey(form.country) ||
          optionKey(c.initials) === optionKey(form.country),
      )?.initials ?? "")
    : "";

  const countyCode = form?.county
    ? (counties.find(
        (c) =>
          optionKey(c.name) === optionKey(form.county) ||
          optionKey(c.code) === optionKey(form.county),
      )?.code ?? "")
    : "";

  useEffect(() => {
    if (!editing || countries.length > 0) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/geo/countries", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data?.countries?.length) {
          setGeoError("Could not load the country list. You can still type a country.");
          return;
        }
        setCountries(data.countries);
      } catch {
        if (!cancelled)
          setGeoError("Could not load the country list. You can still type a country.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [editing, countries.length]);

  const loadingCounties = Boolean(countryCode) && countiesFor !== countryCode;
  const subCountyKey = countyCode ? `${countryCode}/${countyCode}` : "";
  const loadingSubCounties =
    Boolean(subCountyKey) && subCountiesFor !== subCountyKey;

  useEffect(() => {
    if (!editing) return;
    if (!countryCode) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/geo/counties?country=${encodeURIComponent(countryCode)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (cancelled) return;
        setCounties(data?.counties ?? []);
      } catch {
        if (cancelled) return;
        setCounties([]);
      } finally {
        if (!cancelled) setCountiesFor(countryCode);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [editing, countryCode]);

  useEffect(() => {
    if (!editing) return;
    if (!countryCode || !countyCode) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/geo/subcounties?country=${encodeURIComponent(countryCode)}&county=${encodeURIComponent(countyCode)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (cancelled) return;
        setSubCounties(data?.subCounties ?? []);
      } catch {
        if (cancelled) return;
        setSubCounties([]);
      } finally {
        if (!cancelled) setSubCountiesFor(`${countryCode}/${countyCode}`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [editing, countryCode, countyCode]);

  const bizStatus = useMemo(() => getBusinessProfileStatus(user), [user]);

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
    setError("");
    setEditing(true);
  }

  function updateField(field: keyof FarmProfileData, value: any) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  // Changing country or county invalidates everything below it.
  function setCountry(next: string) {
    setCounties([]);
    setSubCounties([]);
    setCountiesFor("");
    setSubCountiesFor("");
    setForm((prev) =>
      prev ? { ...prev, country: next, county: "", subCounty: "" } : prev,
    );
  }

  function setCounty(next: string) {
    setSubCounties([]);
    setSubCountiesFor("");
    setForm((prev) =>
      prev ? { ...prev, county: next, subCounty: "" } : prev,
    );
  }

  function setSubCounty(next: string) {
    setForm((prev) => (prev ? { ...prev, subCounty: next } : prev));
  }

  async function save() {
    if (!user || !form) return;
    try {
      setSaving(true);
      setError("");

      const email = getActiveUserEmail();

     
      const baseline = initialData(user, user.futureFarmId);
      const changed: Record<string, unknown> = {};
      (Object.keys(form) as (keyof FarmProfileData)[]).forEach((key) => {
        const next = form[key];
        const prev = baseline[key];
        // Compare loosely: a canonical id (`national_grid`) and its display
        // string ("National Grid") are the same value, so an untouched select
        // is not resent as a change.
        if (!valuesEqual(next, prev)) changed[key] = next;
      });

      // Identity fields are never editable
      delete changed.email;
      delete changed.futureFarmId;

      const response = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "farm-profile", email, data: changed }),
      });
      const result = await response.json();
      if (!response.ok || !result?.success || !result?.user) {
        throw new Error(
          result?.error || `Failed to save farm profile (${response.status})`,
        );
      }

      // Render what the database now holds
      setUser(result.user);
      try {
        localStorage.setItem(
          "future_farms_user",
          JSON.stringify(result.user),
        );
      } catch {
        // In-memory state is already correct (not fatal)
      }
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't save your changes. Please try again.",
      );
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
        <div className="max-w-[1440px] mx-auto space-y-6">
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
                  
                  {(user?.business?.businessId || user?.businessId) && (
                    <span className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-lg font-mono">
                      <Icon name="badge" className="text-[17px]" />
                      Business ID:
                      {user.business?.businessId || user.businessId}
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

              {!isEmpty && (
                <button
                  type="button"
                  onClick={openEdit}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-on-primary text-primary hover:bg-on-primary/90 px-5 py-3 text-[14px] font-bold transition-all duration-150 shadow-md shrink-0 self-start md:self-auto active:scale-[0.98]"
                >
                  <Icon name="edit" className="text-[18px]" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* ── COMPLETION RIBBON (partial business data) ─────────── */}
          {!bizStatus.complete && (
            <div className="rounded-2xl border border-amber-300/70 bg-amber-50 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                    <Icon name="pending_actions" className="text-[22px]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] md:text-[20px] font-bold text-amber-900">
                      Farm Business Profile {bizStatus.percent}% complete
                    </h3>
                    <p className="text-sm max-w-xl md:text-[18px] text-amber-800/90 mt-0.5">
                      {bizStatus.missing.length > 0 ? (
                        <>
                          Still needed:{" "}
                          {bizStatus.missing.slice(0, 4).map((m) => m.label).join(" • ")}
                          {bizStatus.missing.length > 4 &&
                            ` +${bizStatus.missing.length - 4} more`}
                        </>
                      ) : (
                        "Almost there — finish the last details."
                      )}
                    </p>
                    <div className="w-full sm:w-64 bg-amber-200/60 rounded-full h-1.5 mt-2.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${bizStatus.percent}%` }}
                      />
                    </div>
                  </div>
                </div>
                <Link
                  href="/farm-business"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-[13.5px] font-bold hover:opacity-90 transition shadow-sm shrink-0"
                >
                  <Icon name="edit" className="text-[18px]" />
                  Complete Farm Business Profile
                </Link>
              </div>
            </div>
          )}

          {/* ── METRICS DASHBOARD ─────────────────────────────────── */}
          {highlights.length > 0 && bizStatus.complete && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {highlights.map((h) => (
                <KPICard key={h.label} {...h} />
              ))}
            </div>
          )}

          {/* ── MASONRY-STYLE DETAILS GRID ───────────────────────── */}
          {bizStatus.complete && (
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
                profile.storageFacilities.length > 0,
              )}
            >
              <DataRow label="Water Source" value={profile.waterSource} />
              <DataRow
                label="Irrigation System"
                value={profile.irrigationMethod}
              />
              <DataRow label="Energy Access" value={profile.energyAccess} />
              <TagList
                label="Storage Infrastructure"
                items={profile.storageFacilities}
              />
            </SectionCard>
          </div>
          )}

          {isEmpty && (
            <div className="text-center py-16 px-4 bg-surface-container-lowest border border-dashed border-outline-variant/80 rounded-3xl">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Icon name="agriculture" className="text-[32px]" />
              </div>
              <h3 className="text-[18px] font-bold text-on-surface">
                No Farm Information Available
              </h3>
              <p className="text-[16px] text-on-surface-variant max-w-md mx-auto mt-1 mb-6">
                Your farm profile metadata hasn't been configured yet. Populate
                your details to start managing operations.
              </p>
              {/* <Link
                href="/farm-business"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-[14px] font-bold hover:opacity-90 transition shadow-sm"
              >
                <Icon name="add" />
                Fill Out Profile
              </Link> */}
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
                  <p className="text-[14px] text-on-primary/70">
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
              <form
                id="farm-profile-edit-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!saving) save();
                }}
                className="space-y-8"
              >

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
                      options={OWNERSHIP_OPTIONS}
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
                    <div className="block space-y-1.5">
                      <span className="block text-[12.5px] font-semibold text-on-surface-variant">
                        Email Address
                      </span>
                      <div className="w-full rounded-xl border border-outline-variant/60 bg-surface-container px-3.5 py-2.5 text-[14px] text-on-surface-variant">
                        {form.email || "Not set"}
                      </div>
                      <p className="text-[11px] text-on-surface-variant/70">
                        Managed via sign-in. Contact support to change it.
                      </p>
                    </div>
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
                    <SearchSelectInput
                      label="Country"
                      value={form.country}
                      onChange={setCountry}
                      onClear={() => setCountry("")}
                      options={countryOptions}
                      placeholder="Select country…"
                    />
                    <SearchSelectInput
                      label="County"
                      value={form.county}
                      onChange={setCounty}
                      onClear={() => setCounty("")}
                      options={countyOptions}
                      placeholder={
                        countryCode
                          ? loadingCounties
                            ? "Loading counties…"
                            : "Select county…"
                          : "Select a country first…"
                      }
                      disabled={!countryCode || loadingCounties}
                      hint={
                        countyOptions.length === 0 && countryCode && !loadingCounties
                          ? "No counties have been set up for this country yet."
                          : undefined
                      }
                    />
                    <SubCountyInput
                      label="Sub-County"
                      value={form.subCounty}
                      onChange={setSubCounty}
                      options={subCountyOptions}
                      loading={loadingSubCounties}
                      disabled={!countyCode || loadingSubCounties}
                      hint={
                        !countyCode
                          ? "Select a county first."
                          : undefined
                      }
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
                      placeholder="-1.286389"
                      type="number"
                      step={0.000001}
                    />
                    <TextInput
                      label="Longitude"
                      value={form.longitude}
                      onChange={(v) => updateField("longitude", v)}
                      placeholder="36.883893"
                      type="number"
                      step={0.000001}
                    />
                  </div>
                  {geoError && (
                    <p className="text-[12px] font-medium text-red-600">
                      {geoError}
                    </p>
                  )}
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
                      placeholder="e.g. 10.5"
                      type="number"
                      min={0}
                      step={0.01}
                    />
                    <SelectInput
                      label="Size Unit"
                      value={form.farmUnit}
                      onChange={(v) => updateField("farmUnit", v)}
                      options={FARM_UNIT_OPTIONS}
                    />
                    <TextInput
                      label="Cultivated Area"
                      value={form.cultivatedAcres}
                      onChange={(v) => updateField("cultivatedAcres", v)}
                      placeholder="e.g. 6.25"
                      type="number"
                      min={0}
                      step={0.01}
                    />
                    <SelectInput
                      label="Land Tenure"
                      value={form.landTenure}
                      onChange={(v) => updateField("landTenure", v)}
                      options={TENURE_SELECT_OPTIONS}
                    />
                  </div>
                </div>

                {/* Section 5: Infrastructure & Utilities */}
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
                      options={WATER_SELECT_OPTIONS}
                    />

                    <SelectInput
                      label="Irrigation System"
                      value={form.irrigationMethod}
                      onChange={(v) => updateField("irrigationMethod", v)}
                      options={IRRIGATION_SELECT_OPTIONS}
                    />

                    <SelectInput
                      label="Energy Access"
                      value={form.energyAccess}
                      onChange={(v) => updateField("energyAccess", v)}
                      options={ENERGY_SELECT_OPTIONS}
                    />
                  </div>
                  <CheckboxGroupInput
                    label="Storage Infrastructure"
                    options={STORAGE_SELECT_OPTIONS}
                    values={form.storageFacilities}
                    onChange={(v) => updateField("storageFacilities", v)}
                  />
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
                type="submit"
                form="farm-profile-edit-form"
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
