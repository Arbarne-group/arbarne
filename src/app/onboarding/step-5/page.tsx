"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

export default function DigitalPlatformsPage() {
  const router = useRouter();
  const [supportReasons, setSupportReasons] = useState("");
  const [otherSupportReason, setOtherSupportReason] = useState("");
  const [remoteConfidence, setRemoteConfidence] = useState("");
  const [remoteComfort, setRemoteComfort] = useState("");
  const [recordKeeping, setRecordKeeping] = useState("");
  const [physicalAudits, setPhysicalAudits] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const email = getActiveUserEmail();

    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.digitalPlatform) {
          const dp = data.user.digitalPlatform;
          if (dp.supportReasons) {
            try {
              const parsed = JSON.parse(dp.supportReasons);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setSupportReasons(parsed[0]);
              } else {
                setSupportReasons(dp.supportReasons);
              }
            } catch {
              setSupportReasons(dp.supportReasons);
            }
          }
          if (dp.otherSupportReason) setOtherSupportReason(dp.otherSupportReason);
          if (dp.remoteConfidence) setRemoteConfidence(dp.remoteConfidence);
          if (dp.remoteComfort) setRemoteComfort(dp.remoteComfort);
          if (dp.recordKeeping) setRecordKeeping(dp.recordKeeping);
          if (dp.physicalAudits) setPhysicalAudits(dp.physicalAudits);
          if (dp.additionalNotes) setAdditionalNotes(dp.additionalNotes);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (navigateNext = true) => {
    if (navigateNext) {
      const missing: string[] = [];
      if (!supportReasons) missing.push("supportReasons");
      if (supportReasons === "Other" && !otherSupportReason.trim()) missing.push("otherSupportReason");
      if (!remoteConfidence.trim()) missing.push("remoteConfidence");
      if (!remoteComfort) missing.push("remoteComfort");
      if (!recordKeeping) missing.push("recordKeeping");
      if (!physicalAudits) missing.push("physicalAudits");

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
    const email = getActiveUserEmail();
    try {
      const res = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 5,
          email,
          data: {
            supportReasons,
            otherSupportReason,
            remoteConfidence,
            remoteComfort,
            recordKeeping,
            physicalAudits,
            additionalNotes,
          },
        }),
      });
      const data = await res.json();
      if (data.user) {
        localStorage.setItem("future_farms_user", JSON.stringify(data.user));
      }
      setSaveFeedback("Progress saved successfully!");
      setTimeout(() => setSaveFeedback(null), 3000);

      if (navigateNext) {
        router.push("/onboarding");
      }
    } catch (e) {
      console.error(e);
      if (navigateNext) {
        router.push("/onboarding");
      }
    } finally {
      setSaving(false);
    }
  };

  const supportReasonOptions = [
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

  const auditOptions = [
    "Yes",
    "Yes, with prior scheduling",
    "Unsure",
    "No",
  ];

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto w-full pb-28">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Overview
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wide uppercase">
              Section 5 of 5
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Questions 22 – 27</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2 tracking-tight">
            Working With Digital Farm Management Platforms
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Understanding your readiness and requirements for digital management, transparency, and operational verification.
          </p>
        </div>

        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-900/60 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-300 text-sm animate-fadeIn shadow-xs">
            <span className="material-symbols-outlined text-red-500 text-xl shrink-0">error</span>
            <span className="font-semibold">
              Please complete all questions on this page before continuing ({validationErrors.length} required question{validationErrors.length > 1 ? "s" : ""} remaining).
            </span>
          </div>
        )}

        <div className="space-y-8">
          {/* Question 22: Support Reasons */}
          <section
            id="q-supportReasons"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border transition-all ${
              validationErrors.includes("supportReasons") || validationErrors.includes("otherSupportReason")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-on-surface">
                22. What could be your main reason for considering professional farm management support?
              </h2>
              {(validationErrors.includes("supportReasons") || validationErrors.includes("otherSupportReason")) && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-5">
              Select the primary catalyst driving your interest in professionalized management.
            </p>

            <div className="space-y-2.5 mb-3">
              {supportReasonOptions.map((opt) => {
                const isSelected = supportReasons === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSupportReasons(opt);
                      setValidationErrors((prev) => prev.filter((f) => f !== "supportReasons"));
                    }}
                    className={`w-full text-left rounded-2xl border p-4 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        isSelected ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {opt}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {supportReasons === "Other" && (
              <div id="q-otherSupportReason" className="pt-2">
                <input
                  type="text"
                  placeholder="Please specify your reason for considering support..."
                  value={otherSupportReason}
                  onChange={(e) => {
                    setOtherSupportReason(e.target.value);
                    if (e.target.value.trim()) {
                      setValidationErrors((prev) => prev.filter((f) => f !== "otherSupportReason"));
                    }
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-surface ${
                    validationErrors.includes("otherSupportReason")
                      ? "border-red-400 ring-2 ring-red-300"
                      : "border-outline-variant"
                  }`}
                />
              </div>
            )}
          </section>

          {/* Question 23: Remote Confidence */}
          <section
            id="q-remoteConfidence"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border transition-all ${
              validationErrors.includes("remoteConfidence")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-on-surface">
                23. What would make you feel confident that your farm is being managed well even when you are not physically present?
              </h2>
              {validationErrors.includes("remoteConfidence") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Describe the visibility, alerts, or reports that give you complete peace of mind.
            </p>
            <textarea
              rows={3}
              value={remoteConfidence}
              onChange={(e) => {
                setRemoteConfidence(e.target.value);
                if (e.target.value.trim()) {
                  setValidationErrors((prev) => prev.filter((f) => f !== "remoteConfidence"));
                }
              }}
              placeholder="E.g., Weekly video walkthroughs, geotagged photo proof of work, digital inventory reconciliations..."
              className={`w-full rounded-2xl border bg-surface p-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none text-sm text-on-surface placeholder:text-on-surface-variant/40 ${
                validationErrors.includes("remoteConfidence") ? "border-red-400 ring-2 ring-red-300" : "border-outline-variant"
              }`}
            />
          </section>

          {/* Question 24 */}
          <section
            id="q-remoteComfort"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border transition-all ${
              validationErrors.includes("remoteComfort")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-on-surface">
                24. Are you comfortable with your Farm Manager using remote solutions to digitally plan, monitor, verify, and report farm operations?
              </h3>
              {validationErrors.includes("remoteComfort") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Our framework uses cloud-connected task dispatch and telemetry.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {remoteComfortOptions.map((opt) => {
                const isSelected = remoteComfort === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setRemoteComfort(opt);
                      setValidationErrors((prev) => prev.filter((f) => f !== "remoteComfort"));
                    }}
                    className={`text-left rounded-2xl border p-4 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        isSelected ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {opt}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Question 25 */}
          <section
            id="q-recordKeeping"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border transition-all ${
              validationErrors.includes("recordKeeping")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-on-surface">
                25. Are you willing to maintain accurate farm, financial, production, and operational records as part of the management service?
              </h3>
              {validationErrors.includes("recordKeeping") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Record-keeping accuracy is required for benchmarking and index scoring.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recordKeepingOptions.map((opt) => {
                const isSelected = recordKeeping === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setRecordKeeping(opt);
                      setValidationErrors((prev) => prev.filter((f) => f !== "recordKeeping"));
                    }}
                    className={`text-left rounded-2xl border p-4 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        isSelected ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {opt}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Question 26 */}
          <section
            id="q-physicalAudits"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border transition-all ${
              validationErrors.includes("physicalAudits")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-on-surface">
                26. Are you comfortable with a Farm Manager conducting periodic physical operational audits to verify farm records and performance?
              </h3>
              {validationErrors.includes("physicalAudits") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Physical ground audits ensure verification integrity across all 8 pillars.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {auditOptions.map((opt) => {
                const isSelected = physicalAudits === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setPhysicalAudits(opt);
                      setValidationErrors((prev) => prev.filter((f) => f !== "physicalAudits"));
                    }}
                    className={`text-left rounded-2xl border p-4 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        isSelected ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {opt}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Question 27: Additional Notes */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <h2 className="text-base font-semibold text-on-surface mb-1">
              27. Is there anything else we should understand about you, your farm, or the kind of support you are looking for?
            </h2>
            <p className="text-xs text-on-surface-variant mb-4">
              Share any additional context, specialized crops, unique constraints, or personal goals.
            </p>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Please share any additional details, concerns, or specific aspirations for your farm..."
              className="w-full rounded-2xl border border-outline-variant bg-surface p-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none text-sm text-on-surface placeholder:text-on-surface-variant/40"
            />
          </section>
        </div>

        {/* Floating Bottom Nav */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/onboarding/step-4"
            className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            &larr; Back to Step 4
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
              <span>{saving ? "Saving..." : "Save & Return to Overview"}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
