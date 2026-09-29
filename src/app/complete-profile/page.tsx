

"use client";

import { useState, useEffect, Suspense } from "react";
import SharedSearchSelect from "@/components/SearchSelect";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Check,
  ChevronDown,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Country {
  initials: string;
  name: string;
  dialCode: string;
  flagEmoji: string | null;
}

const FARMING_OPTIONS = [
  {
    id: "LIVESTOCK",
    title: "Livestock Production",
    desc: "Dairy, beef, poultry, goats, sheep and more.",
  },
  {
    id: "CROP",
    title: "Crop Production",
    desc: "Maize, horticulture, cereals, fruits and more.",
  },
  {
    id: "MIXED",
    title: "Mixed Farming",
    desc: "Both livestock and crops on the same farm.",
  },
];

function displayName(u: any): string {
  const parts = [u?.firstName, u?.middleName, u?.lastName].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(" ");
  }

  return u?.name || "";
}

// This page uses a lighter palette than the rest of the app, so the shared
// SearchSelect is themed here rather than forked.
function SearchSelect(props: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  buttonClassName?: string;
}) {
  return (
    <SharedSearchSelect
      {...props}
      buttonClassName={
        props.buttonClassName ||
        "w-full rounded-xl border border-gray-200 px-3 py-2 text-left text-sm outline-none focus:border-primary bg-white flex items-center justify-between gap-2"
      }
      panelClassName="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
      inputClassName="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-primary"
    />
  );
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

  return (
    <main className="min-h-screen bg-[#F5F8F3] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-4xl">

        {/* =====================================================
            MAIN CARD
        ===================================================== */}
        <div className="overflow-hidden rounded-[26px] border border-gray-100 bg-white shadow-[0_20px_70px_rgba(4,93,97,0.10)]">

          {/* ===================================================
              BANNER
          =================================================== */}
          <div className="relative overflow-hidden bg-[#045d61] px-6 py-9 text-center sm:px-10 sm:py-11">

            {/* Very subtle decoration */}
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/[0.04]" />

            <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#009924]/10" />

            <div className="relative">

              {/* Logo */}
              <div className="mx-auto flex items-center justify-center">
                <Image
                  src="/images/auth-logo-bdl.png"
                  alt="Future Farms"
                  width={260}
                  height={100}
                  priority
                  className="h-auto w-[190px] object-contain sm:w-[220px]"
                />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                Almost there
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Complete your profile
              </h1>

              <p className="mx-auto mt-2 max-w-xl text-md leading-6 text-white/70 sm:text-base">
                Tell us a little more about yourself and your business.
              </p>

              
            </div>
          </div>

          {/* ===================================================
              CONTENT
          =================================================== */}

          {loadingProfile ? (
            <div className="flex flex-col items-center justify-center px-6 py-20">
              <Loader2
                size={25}
                className="animate-spin text-[#045d61]"
              />

              <p className="mt-4 text-lg font-medium text-gray-700">
                Preparing your profile...
              </p>

              <p className="mt-1 text-md text-gray-400">
                This should only take a moment
              </p>
            </div>
          ) : loadError ? (
            <div className="px-6 py-14 text-center sm:px-10">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertCircle
                  size={22}
                  className="text-red-500"
                />
              </div>

              <p className="mx-auto mt-4 max-w-md text-md leading-6 text-red-700">
                {loadError}
              </p>

              <Link
                href="/signup"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#045d61] px-5 py-3 text-md font-semibold text-white transition hover:bg-[#045d61]/90"
              >
                Back to signup
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="px-5 py-7 sm:px-10 sm:py-10"
            >

              {/* =================================================
                  ERROR
              ================================================= */}
              {error && (
                <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-md text-red-700">
                  <AlertCircle
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>
                </div>
              )}

              {/* =================================================
                  SECTION 1 — YOUR DETAILS
              ================================================= */}
              <section>
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#009924]">
                    Your details
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-[#045d61]">
                    Account information
                  </h2>

                  <p className="mt-1 text-md text-gray-500">
                    These details come from the account you created.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Full name */}
                  <div>
                    <label className="mb-2 block text-md font-medium text-gray-700">
                      Full name
                    </label>

                    <div className={readonlyBox}>
                      {displayName(profile) || "—"}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-md font-medium text-gray-700">
                      Email address
                    </label>

                    <div className={readonlyBox}>
                      <span className="truncate">
                        {profile?.email || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="my-9 h-px bg-gray-100" />

              {/* =================================================
                  SECTION 2 — BUSINESS
              ================================================= */}
              <section>
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#009924]">
                    Your business
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-[#045d61]">
                    Business information
                  </h2>

                 
                </div>

                <label className="mb-2 block text-md font-medium text-gray-700">
                  Business name{" "}
                  <span className="text-[#009924]">*</span>
                </label>

                <label className="mb-3 flex cursor-pointer items-center gap-2.5 text-md text-gray-600">
                  <input
                    type="checkbox"
                    checked={useNameAsBusiness}
                    onChange={(e) =>
                      handleUseNameAsBusiness(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300 accent-[#009924]"
                  />

                  <span>
                    Use my name as the business name
                  </span>
                </label>

                <input
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(e.target.value)
                  }
                  disabled={useNameAsBusiness}
                  placeholder="e.g. Highland Greens Ltd"
                  className={`${input} disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500`}
                />
              </section>

              <div className="my-9 h-px bg-gray-100" />

              {/* =================================================
                  SECTION 3 — ROLE
              ================================================= */}
              <section>
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#009924]">
                    Your role
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-[#045d61]">
                    How are you joining Future Farms?
                  </h2>

                  <p className="mt-1 text-md text-gray-500">
                    Select the option that best describes your role.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    {
                      id: "FFFarmer",
                      title: "Farmer",
                      desc: "I own or run a farm.",
                    },
                    {
                      id: "FFFarmManager",
                      title: "Farm Manager",
                      desc: "I manage farms professionally.",
                    },
                  ].map((o) => {
                    const selected = role === o.id;

                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setRole(o.id)}
                        className={`relative rounded-2xl border p-5 text-left transition-all ${
                          selected
                            ? "border-[#009924] bg-[#009924]/5 ring-1 ring-[#009924]"
                            : "border-gray-200 bg-white hover:border-[#009924]/50 hover:bg-gray-50"
                        }`}
                      >
                        {selected && (
                          <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#009924] text-white">
                            <Check
                              size={14}
                              strokeWidth={3}
                            />
                          </span>
                        )}

                        <div
                          className={`text-md font-semibold ${
                            selected
                              ? "text-[#045d61]"
                              : "text-gray-900"
                          }`}
                        >
                          {o.title}
                        </div>

                        <div className="mt-1 text-md leading-5 text-gray-500">
                          {o.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <div className="my-9 h-px bg-gray-100" />

              {/* =================================================
                  SECTION 4 — CONTACT
              ================================================= */}
              <section>
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#009924]">
                    Contact
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-[#045d61]">
                    Where are you based?
                  </h2>

                  <p className="mt-1 text-md text-gray-500">
                    This helps us provide a more relevant Future Farms experience.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Country */}
                  <div>
                    <label className="mb-2 block text-md font-medium text-gray-700">
                      Country{" "}
                      <span className="text-[#009924]">*</span>
                    </label>

                    <SearchSelect
                      value={countryCode}
                      onChange={handleCountryChange}
                      placeholder="Select country..."
                      options={countries.map((c) => ({
                        value: c.initials,
                        label: `${
                          c.flagEmoji
                            ? `${c.flagEmoji} `
                            : ""
                        }${c.name} (${c.initials})`,
                      }))}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-md font-medium text-gray-700">
                      Phone number{" "}
                      <span className="text-[#009924]">*</span>
                    </label>

                    <div className="flex gap-2">
                      <div className="w-[145px] shrink-0 sm:w-[160px]">
                        <SearchSelect
                          value={phoneCountryCode}
                          onChange={setPhoneCountryCode}
                          placeholder="Code..."
                          options={countries.map((c) => ({
                            value: c.dialCode,
                            label: `${
                              c.flagEmoji
                                ? `${c.flagEmoji} `
                                : ""
                            }${c.initials} ${c.dialCode}`,
                          }))}
                        />
                      </div>

                      <input
                        required
                        value={phoneNational}
                        onChange={(e) =>
                          setPhoneNational(
                            e.target.value.replace(
                              /[^\d]/g,
                              ""
                            )
                          )
                        }
                        inputMode="tel"
                        placeholder="712 345 678"
                        className={input}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="my-9 h-px bg-gray-100" />

              {/* =================================================
                  SECTION 5 — FARMING
              ================================================= */}
              <section>
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#009924]">
                    Your farm
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-[#045d61]">
                    Type of farming
                  </h2>

                  <p className="mt-1 text-md text-gray-500">
                    Select the type of farming you primarily engage in.
                  </p>
                </div>

                <div className="space-y-3">
                  {FARMING_OPTIONS.map((o) => {
                    const selected =
                      farmingType === o.id;

                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() =>
                          setFarmingType(o.id)
                        }
                        className={`relative flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                          selected
                            ? "border-[#009924] bg-[#009924]/5 ring-1 ring-[#009924]"
                            : "border-gray-200 bg-white hover:border-[#009924]/50 hover:bg-gray-50"
                        }`}
                      >
                        <div className="min-w-0">
                          <div
                            className={`text-md font-semibold ${
                              selected
                                ? "text-[#045d61]"
                                : "text-gray-900"
                            }`}
                          >
                            {o.title}
                          </div>

                          <div className="mt-1 text-md leading-5 text-gray-500">
                            {o.desc}
                          </div>
                        </div>

                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                            selected
                              ? "border-[#009924] bg-[#009924] text-white"
                              : "border-gray-200 text-transparent"
                          }`}
                        >
                          <Check
                            size={13}
                            strokeWidth={3}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* =================================================
                  SUBMIT
              ================================================= */}
              <div className="mt-10 border-t border-gray-100 pt-7">

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#045d61] px-5 text-md font-semibold text-white shadow-sm transition-all hover:bg-[#045d61]/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      Complete signup

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-sm leading-5 text-gray-400">
                  You can update some of these details later from
                  your Future Farms profile.
                </p>
              </div>
            </form>
          )}
        </div>

        
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
