"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import AppShell from "@/components/layout/AppShell";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

export default function SettingsPage() {
  const { user: clerkUser } = useUser();
  const [fullName, setFullName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [gender, setGender] = useState("female");
  const [ageBracket, setAgeBracket] = useState("30-45");
  const [advisoryLanguage, setAdvisoryLanguage] = useState("english");

  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    const email = clerkUser?.primaryEmailAddress?.emailAddress || getActiveUserEmail();
    if (clerkUser) {
      if (clerkUser.fullName) setFullName(clerkUser.fullName);
      if (clerkUser.firstName) setPreferredName(clerkUser.firstName);
      if (clerkUser.primaryEmailAddress?.emailAddress) {
        setEmailInput(clerkUser.primaryEmailAddress.emailAddress);
      }
    }

    if (email) {
      fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            if (data.user.name && !clerkUser?.fullName) setFullName(data.user.name);
            if (data.user.phone) setPhoneNumber(data.user.phone.replace("+254", "").trim());
            if (data.user.email && !clerkUser?.primaryEmailAddress?.emailAddress) {
              setEmailInput(data.user.email);
            }
          }
        })
        .catch(console.error);
    }
  }, [clerkUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }, 600);
  };

  return (
    <AppShell userName={preferredName || fullName} userRole="Farm Owner">
      <div className="w-full pt-4 pb-20 px-4 md:px-8 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-4xl font-bold text-on-surface tracking-tight">
              Personal Information &amp; Settings
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant max-w-2xl">
              Manage your personal identity, contact details, advisory language, and account preferences.
            </p>
          </div>

          {saveToast && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-md animate-fadeIn">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Settings updated successfully!</span>
            </div>
          )}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="space-y-8">
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-surface-container-high/60 relative overflow-hidden">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-surface-container-high/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container/15 text-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">person</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-outline font-semibold block">
                    Farmer Profile
                  </span>
                  <h2 className="text-base md:text-lg font-bold text-on-surface">
                    Personal Details &amp; Contact Information
                  </h2>
                </div>
              </div>

              <span className="text-xs text-primary font-semibold flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Secure &amp; Confidential</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Legal Name */}
              <div className="md:col-span-6 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface" htmlFor="fullName">
                  Full Legal Name (as per ID) <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    badge
                  </span>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Keziah Wanjiku Kariuki"
                    className="w-full bg-surface-container-low pl-11 pr-4 py-3 rounded-xl text-on-surface text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Please provide your official legal name as shown on your National ID or Passport.
                </p>
              </div>

              {/* Preferred Name */}
              <div className="md:col-span-6 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface" htmlFor="preferredName">
                  Preferred Name / Nickname
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    face
                  </span>
                  <input
                    id="preferredName"
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="e.g. Mama Wanjiku"
                    className="w-full bg-surface-container-low pl-11 pr-4 py-3 rounded-xl text-on-surface text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  How our field officers and extension team should address you warmly.
                </p>
              </div>

              {/* Phone Number */}
              <div className="md:col-span-6 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface flex items-center justify-between" htmlFor="phoneNumber">
                  <span>Phone Number <span className="text-error">*</span></span>
                  <span className="text-primary text-[11px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span> M-Pesa registered
                  </span>
                </label>
                <div className="flex rounded-xl overflow-hidden bg-surface-container-low border border-surface-container-high/60">
                  <div className="flex items-center gap-2 px-3.5 bg-surface-container-high text-on-surface text-xs font-semibold select-none">
                    <span>+254</span>
                  </div>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 bg-transparent px-4 py-3 text-on-surface text-sm outline-none"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Ensures you receive instant weather alerts and harvest advisory via SMS/WhatsApp.
                </p>
              </div>

              {/* Email Address */}
              <div className="md:col-span-6 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface" htmlFor="emailInput">
                  Email Address <span className="text-outline font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    alternate_email
                  </span>
                  <input
                    id="emailInput"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. keziah.wanjiku@example.com"
                    className="w-full bg-surface-container-low pl-11 pr-4 py-3 rounded-xl text-on-surface text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Receive detailed harvest statements, soil diagnostic copies, and receipts.
                </p>
              </div>

              {/* Gender */}
              <div className="md:col-span-6 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Gender <span className="text-error">*</span></label>
                <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-1.5 rounded-xl">
                  {[
                    { id: "female", label: "Female" },
                    { id: "male", label: "Male" },
                    { id: "undisclosed", label: "Prefer not to say" },
                  ].map((g) => {
                    const isSelected = gender === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGender(g.id)}
                        className={`py-2 px-3 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-surface-container-lowest text-primary shadow-xs"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Age Group */}
              <div className="md:col-span-6 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Age Group <span className="text-error">*</span></label>
                <div className="grid grid-cols-4 gap-2 bg-surface-container-low p-1.5 rounded-xl">
                  {["18-29", "30-45", "46-60", "60+"].map((age) => {
                    const isSelected = ageBracket === age;
                    return (
                      <button
                        key={age}
                        type="button"
                        onClick={() => setAgeBracket(age)}
                        className={`py-2 px-2 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-surface-container-lowest text-primary shadow-xs"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        {age}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Advisory Language */}
              <div className="md:col-span-12 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface" htmlFor="advisoryLanguage">
                  Preferred Advisory Language <span className="text-error">*</span>
                </label>
                <div className="relative max-w-md">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    translate
                  </span>
                  <select
                    id="advisoryLanguage"
                    value={advisoryLanguage}
                    onChange={(e) => setAdvisoryLanguage(e.target.value)}
                    className="w-full bg-surface-container-low pl-11 pr-10 py-3 rounded-xl text-on-surface text-sm appearance-none outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="kiswahili">Kiswahili</option>
                    <option value="english">English</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">
                    expand_more
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Language choice applies to audio guides, SMS agronomy advisories, and direct support calls.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-container-high/60 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm btn-shadow hover-lift transition-all cursor-pointer disabled:opacity-75 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>{saving ? "Saving Changes..." : "Save Personal Details"}</span>
              </button>
            </div>
          </section>
        </form>
      </div>
    </AppShell>
  );
}
