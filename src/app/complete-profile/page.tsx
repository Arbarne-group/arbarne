"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface Country {
  initials: string;
  name: string;
  dialCode: string;
  flagEmoji: string | null;
}

const FARMING_OPTIONS = [
  { id: "LIVESTOCK", title: "Livestock Production", desc: "Dairy, beef, poultry, goats, sheep and more." },
  { id: "CROP", title: "Crop Production", desc: "Maize, horticulture, cereals, fruits and more." },
  { id: "MIXED", title: "Mixed Farming", desc: "Both livestock and crops on the same farm." },
];

function displayName(u: any): string {
  const parts = [u?.firstName, u?.middleName, u?.lastName].filter(Boolean);
  if (parts.length > 0) return parts.join(" ");
  return u?.name || "";
}

function DetailsForm() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loadError, setLoadError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [role, setRole] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [useNameAsBusiness, setUseNameAsBusiness] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("");
  const [phoneNational, setPhoneNational] = useState("");
  const [farmingType, setFarmingType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Resolve who is signing up: signed-in session first (Google or verified
  // email flow), so previously provided names/emails prefill as read-only.
  useEffect(() => {
    fetch("/api/auth/profile/details", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.user) {
          setLoadError("We could not find your new account. Please log in or restart signup.");
          return;
        }
        const u = data.user;
        setProfile(u);
        // Staff never fill farmer details — send them to their workspace.
        if (u.role && ["FFDeveloper", "FFAdmin", "FFStaff"].includes(u.role)) {
          router.replace("/a/dashboard");
          return;
        }
        if (u.role === "FFFarmer" || u.role === "FFFarmManager") setRole(u.role);
        if (u.businessName) {
          setBusinessName(u.businessName);
          const dn = displayName(u);
          if (dn && u.businessName === dn) setUseNameAsBusiness(true);
        }
        if (u.countryCode) setCountryCode(u.countryCode);
        if (u.phoneCountryCode) setPhoneCountryCode(u.phoneCountryCode);
        if (u.phoneNational) setPhoneNational(u.phoneNational);
        if (u.farmingType) setFarmingType(u.farmingType);
        // Already complete (e.g. returning Google user) — move along.
        if (u.countryCode && u.phone && u.farmingType && u.businessName) {
          router.replace("/overview");
        }
      })
      .catch(() => setLoadError("Could not load your account. Please try again."))
      .finally(() => setLoadingProfile(false));
  }, []);

  useEffect(() => {
    fetch("/api/geo/countries", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.countries) setCountries(data.countries);
      })
      .catch(console.error);
  }, []);

  function handleCountryChange(v: string) {
    setCountryCode(v);
    const c = countries.find((x) => x.initials === v);
    if (c && !phoneCountryCode) setPhoneCountryCode(c.dialCode);
  }

  function handleUseNameAsBusiness(checked: boolean) {
    setUseNameAsBusiness(checked);
    if (checked) {
      const dn = displayName(profile);
      if (dn) setBusinessName(dn);
    } else {
      setBusinessName("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!role) {
      setError("Choose whether you are joining as a Farmer or Farm Manager.");
      return;
    }
    if (!businessName.trim()) {
      setError("Enter your business name.");
      return;
    }
    if (!countryCode) {
      setError("Select your country.");
      return;
    }
    if (!phoneCountryCode || !phoneNational.trim()) {
      setError("Enter your phone number with a country code.");
      return;
    }
    if (!farmingType) {
      setError("Select the type of farming you engage in.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // No email in the payload: the server resolves the account from the
        // signed-in session (Clerk/Google or verified-email cookie).
        body: JSON.stringify({
          role,
          businessName: businessName.trim(),
          countryCode,
          phoneCountryCode,
          phoneNational,
          farmingType,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Could not save details.");
        return;
      }
      // Mint the browser session for password signups via the short-lived
      // relay (Google users already carry a session — skip silently).
      try {
        const raw = sessionStorage.getItem("ff_pw_tmp");
        if (raw) {
          const relay = JSON.parse(raw);
          sessionStorage.removeItem("ff_pw_tmp");
          if (relay?.email && relay?.password) {
            const second = await signIn("credentials", {
              email: relay.email,
              password: relay.password,
              redirect: false,
            });
            if (second?.error) {
              router.push("/login");
              return;
            }
          }
        }
      } catch {}
      router.push("/overview");
      router.refresh();
    } catch {
      setError("Could not save details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary bg-white";
  const readonlyBox =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700";

function SearchSelect({
  value,
  onChange,
  options,
  placeholder,
  buttonClassName,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  buttonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const selected = options.find((o) => o.value === value);
  const q = query.trim().toLowerCase();
  const filtered = q
    ? options.filter((o) => o.label.toLowerCase().includes(q))
    : options;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setQuery("");
          setOpen((v) => !v);
        }}
        className={
          buttonClassName ||
          "w-full rounded-xl border border-gray-200 px-3 py-2 text-left text-sm outline-none focus:border-primary bg-white flex items-center justify-between gap-2"
        }
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="text-gray-400 text-xs">▼</span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-100 p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to filter…"
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-400">No matches.</p>
            )}
            {filtered.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm cursor-pointer hover:bg-gray-50 ${
                  o.value === value ? "font-semibold text-primary" : "text-gray-700"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9F5] px-4 py-8">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-primary px-6 py-6 text-center">
          <Image
            src="/images/auth-logo-bdl.png"
            alt="Future Farms"
            width={160}
            height={80}
            className="mx-auto h-auto w-32 object-contain"
          />
          <h1 className="mt-3 text-2xl font-semibold text-white">Almost done</h1>
          <p className="mt-1 text-sm text-white/70">Tell us a little more about your business to finish signup.</p>
        </div>

        {loadingProfile ? (
          <p className="px-6 py-10 text-center text-sm text-gray-500">Loading your account…</p>
        ) : loadError ? (
          <div className="px-6 py-6 text-center">
            <p className="text-sm text-red-700">{loadError}</p>
            <Link href="/signup" className="mt-4 inline-block text-sm font-semibold text-primary">
              Back to signup
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
              <div className={readonlyBox}>{displayName(profile) || "—"}</div>
              <p className="mt-1 text-xs text-gray-400">
                As provided during signup contact support to change it.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email address</label>
              <div className={readonlyBox}>{profile?.email || "—"}</div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Business name *</label>
              <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={useNameAsBusiness}
                  onChange={(e) => handleUseNameAsBusiness(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-[#009924]"
                />
                Use my name as the business name
              </label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                disabled={useNameAsBusiness}
                placeholder="e.g. Highland Greens Ltd"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary bg-white disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">I am joining as *</label>              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "FFFarmer", title: "Farmer", desc: "I own / run a farm." },
                  { id: "FFFarmManager", title: "Farm Manager", desc: "I manage farms professionally." },
                ].map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setRole(o.id)}
                    className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                      role === o.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`text-sm font-semibold ${role === o.id ? "text-primary" : "text-gray-900"}`}>
                      {o.title}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">{o.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Country *</label>
              <SearchSelect
                value={countryCode}
                onChange={handleCountryChange}
                placeholder="Select country…"
                options={countries.map((c) => ({
                  value: c.initials,
                  label: `${c.flagEmoji ? `${c.flagEmoji} ` : ""}${c.name} (${c.initials})`,
                }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Phone number *</label>
              <div className="flex gap-2">
                <div className="w-[190px] shrink-0">
                  <SearchSelect
                    value={phoneCountryCode}
                    onChange={setPhoneCountryCode}
                    placeholder="Code…"
                    options={countries.map((c) => ({
                      value: c.dialCode,
                      label: `${c.flagEmoji ? `${c.flagEmoji} ` : ""}${c.name} (${c.initials}) ${c.dialCode}`,
                    }))}
                  />
                </div>
                <input
                  required
                  value={phoneNational}
                  onChange={(e) => setPhoneNational(e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="tel"
                  placeholder="712 345 678"
                  className={input}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Type of farming *</label>
              <div className="space-y-3">
                {FARMING_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setFarmingType(o.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                      farmingType === o.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`text-sm font-semibold ${farmingType === o.id ? "text-primary" : "text-gray-900"}`}>
                      {o.title}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">{o.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Complete signup"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function DetailsPage() {
  return (
    <Suspense>
      <DetailsForm />
    </Suspense>
  );
}
