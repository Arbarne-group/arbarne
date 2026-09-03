"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function DigitalPlatformsPage() {
  const router = useRouter();
  const [supportReasons, setSupportReasons] = useState<string[]>([
    "I do not have enough time to manage the farm myself.",
    "I want to professionalize the farm as a business.",
  ]);
  const [remoteConfidence, setRemoteConfidence] = useState("");
  const [remoteComfort, setRemoteComfort] = useState("Yes");
  const [recordKeeping, setRecordKeeping] = useState("Yes");
  const [physicalAudits, setPhysicalAudits] = useState("Yes, with prior scheduling");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let email = "keziah@futurefarms.africa";
    const cached = localStorage.getItem("future_farms_user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        if (u.email) email = u.email;
      } catch (e) {}
    }

    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.digitalPlatform) {
          const dp = data.user.digitalPlatform;
          if (dp.supportReasons) {
            try {
              const parsed = JSON.parse(dp.supportReasons);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setSupportReasons(parsed);
              }
            } catch (e) {}
          }
          if (dp.remoteConfidence) setRemoteConfidence(dp.remoteConfidence);
          if (dp.remoteComfort) setRemoteComfort(dp.remoteComfort);
          if (dp.recordKeeping) setRecordKeeping(dp.recordKeeping);
          if (dp.physicalAudits) setPhysicalAudits(dp.physicalAudits);
          if (dp.additionalNotes) setAdditionalNotes(dp.additionalNotes);
        }
      })
      .catch(console.error);
  }, []);

  const toggleReason = (reason: string) => {
    if (supportReasons.includes(reason)) {
      setSupportReasons(supportReasons.filter((r) => r !== reason));
    } else {
      setSupportReasons([...supportReasons, reason]);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 5,
          email: "keziah@futurefarms.africa",
          data: {
            supportReasons,
            remoteConfidence,
            remoteComfort,
            recordKeeping,
            physicalAudits,
            additionalNotes,
          },
        }),
      });
      router.push("/pricing");
    } catch (e) {
      console.error(e);
      router.push("/pricing");
    } finally {
      setSaving(false);
    }
  };

  const reasonsOptions = [
    "I do not have enough time to manage the farm myself.",
    "I need stronger technical and operational expertise.",
    "I want better visibility into what is happening on the farm.",
    "I want to improve productivity and profitability.",
    "I want stronger accountability from workers and service providers.",
    "I want more reliable farm records and reporting.",
    "I want to manage the farm remotely.",
    "I want to professionalize the farm as a business.",
    "Other",
  ];

  const remoteComfortOptions = [
    "Yes",
    "Yes, but I would like guidance on how it works",
    "Unsure",
    "No",
  ];

  const recordKeepingOptions = [
    "Yes",
    "Mostly, but I will need support",
    "Unsure",
    "No",
  ];

  const physicalAuditOptions = [
    "Yes",
    "Yes, with prior scheduling",
    "Unsure",
    "No",
  ];

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Overview
          </Link>
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-primary uppercase tracking-wider">
            <span>Section 5 of 5</span>
            <span>•</span>
            <span>Questions 22–27</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
            Working With digital farm management platforms
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            How you feel about professional, digitally-enabled farm management.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 md:p-10 border border-surface-variant/40">
          <form className="space-y-10">
            {/* Question 22 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                22. What could be your main reason for considering professional farm management support?
              </label>
              <p className="text-xs text-on-surface-variant font-medium">
                Select all reasons that apply to your situation.
              </p>

              <div className="space-y-2.5">
                {reasonsOptions.map((opt) => {
                  const isChecked = supportReasons.includes(opt);
                  return (
                    <div
                      key={opt}
                      onClick={() => toggleReason(opt)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex items-center justify-between ${
                        isChecked
                          ? "border-primary bg-primary-container/15 ring-1 ring-primary text-primary font-semibold shadow-xs"
                          : "border-outline-variant hover:bg-surface-container-low text-on-surface"
                      }`}
                    >
                      <span className="text-sm">{opt}</span>
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? "bg-primary border-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isChecked && (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question 23 */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-on-surface">
                23. What would make you feel confident that your farm is being managed well even when you are not physically present?
              </label>
              <textarea
                rows={3}
                value={remoteConfidence}
                onChange={(e) => setRemoteConfidence(e.target.value)}
                placeholder="Describe what builds your confidence when managing remotely..."
                className="w-full rounded-xl border border-outline-variant p-4 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/40 bg-surface-bright transition-all"
              />
            </div>

            {/* Question 24 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                24. Are you comfortable with your Farm Manager using remote solutions to digitally plan, monitor, verify, and report farm operations?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {remoteComfortOptions.map((opt) => {
                  const isSelected = remoteComfort === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setRemoteComfort(opt)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary-container/10 ring-1 ring-primary text-primary font-semibold"
                          : "border-outline-variant hover:bg-surface-container-low text-on-surface"
                      }`}
                    >
                      <span className="text-sm">{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Question 25 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                25. Are you willing to maintain accurate farm, financial, production, and operational records as part of the management service?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recordKeepingOptions.map((opt) => {
                  const isSelected = recordKeeping === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setRecordKeeping(opt)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary-container/10 ring-1 ring-primary text-primary font-semibold"
                          : "border-outline-variant hover:bg-surface-container-low text-on-surface"
                      }`}
                    >
                      <span className="text-sm">{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Question 26 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                26. Are you comfortable with a Farm Manager conducting periodic physical operational audits to verify farm records and performance?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {physicalAuditOptions.map((opt) => {
                  const isSelected = physicalAudits === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setPhysicalAudits(opt)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary-container/10 ring-1 ring-primary text-primary font-semibold"
                          : "border-outline-variant hover:bg-surface-container-low text-on-surface"
                      }`}
                    >
                      <span className="text-sm">{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Question 27 */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-on-surface">
                27. Is there anything else we should understand about you, your farm, or the kind of support you are looking for?
              </label>
              <textarea
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Anything else you would like to share with our agronomy and farm management advisory team..."
                className="w-full rounded-xl border border-outline-variant p-4 text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/40 bg-surface-bright transition-all"
              />
            </div>

            {/* Footer Navigation */}
            <div className="pt-8 border-t border-surface-variant/50 flex items-center justify-between">
              <Link
                href="/onboarding/step-4"
                className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Previous Section
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-xs text-on-surface-variant font-medium">
                  Section 5 of 5
                </span>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-on-primary text-sm font-semibold px-8 py-3.5 rounded-xl shadow-md btn-shadow hover-lift transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  <span>{saving ? "Saving..." : "Finish Onboarding"}</span>
                  <span className="material-symbols-outlined text-sm">
                    check_circle
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
