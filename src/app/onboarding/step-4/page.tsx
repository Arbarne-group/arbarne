"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function DigitalPlatformsPage() {
  const router = useRouter();
  const [supportReasons, setSupportReasons] = useState<string[]>([
    "Time Constraints",
    "Scaling Operations",
  ]);
  const [remoteConfidence, setRemoteConfidence] = useState(
    "Weekly video updates, real-time sensor data, direct messaging with farm manager..."
  );
  const [remoteComfort, setRemoteComfort] = useState("Yes");
  const [recordKeeping, setRecordKeeping] = useState("Yes");
  const [physicalAudits, setPhysicalAudits] = useState("Yes");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.digitalPlatform) {
          const dp = data.user.digitalPlatform;
          if (dp.supportReasons) {
            try {
              setSupportReasons(JSON.parse(dp.supportReasons));
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

  const handleNext = async () => {
    setSaving(true);
    try {
      await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 4,
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
      router.push("/onboarding/step-5");
    } catch (e) {
      console.error(e);
      router.push("/onboarding/step-5");
    } finally {
      setSaving(false);
    }
  };

  const reasons = [
    {
      title: "Time Constraints",
      desc: "Unable to dedicate sufficient time to daily operations.",
    },
    {
      title: "Lack of Expertise",
      desc: "Need specialized knowledge in specific agricultural practices.",
    },
    {
      title: "Geographic Distance",
      desc: "Living far from the physical location of the farm.",
    },
    {
      title: "Scaling Operations",
      desc: "Looking to expand and need professional systems in place.",
    },
  ];

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto w-full pb-28">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/onboarding/step-3"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Step 3
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
            Working With Digital Platforms
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl">
            Understanding your comfort and requirements for remote farm management tools and digital integration.
          </p>
        </div>

        <div className="space-y-8">
          {/* Question 22: Support Reasons */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <h2 className="text-base font-semibold text-on-surface mb-6 flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                22
              </span>
              Main reason for considering professional farm management support?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reasons.map((r) => {
                const isChecked = supportReasons.includes(r.title);
                return (
                  <label
                    key={r.title}
                    onClick={() => toggleReason(r.title)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all hover:border-primary/50 flex items-start gap-4 ${
                      isChecked
                        ? "border-primary bg-primary-container/5 ring-1 ring-primary"
                        : "border-outline-variant"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? "border-primary bg-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isChecked && (
                        <span className="material-symbols-outlined text-white text-[14px]">
                          check
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-on-surface block mb-1">
                        {r.title}
                      </span>
                      <span className="text-xs text-on-surface-variant leading-relaxed">
                        {r.desc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Question 23: Remote Confidence */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <h2 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                23
              </span>
              What would make you feel confident when managing remotely?
            </h2>
            <textarea
              rows={4}
              value={remoteConfidence}
              onChange={(e) => setRemoteConfidence(e.target.value)}
              placeholder="E.g., Weekly video updates, real-time sensor data, direct messaging with farm manager..."
              className="w-full rounded-2xl border border-outline-variant bg-surface p-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none text-sm text-on-surface placeholder:text-on-surface-variant/40"
            />
          </section>

          {/* Questions 24, 25, 26: Segmented Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Q24 */}
            <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40 flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  24
                </span>
                <span>Comfortable with remote solutions?</span>
              </h3>
              <div className="bg-surface-container-high p-1 rounded-xl flex gap-1 mt-auto">
                {["Yes", "No", "Unsure"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setRemoteComfort(v)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      remoteComfort === v
                        ? "bg-white text-primary shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </section>

            {/* Q25 */}
            <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40 flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  25
                </span>
                <span>Willing to maintain accurate records?</span>
              </h3>
              <div className="bg-surface-container-high p-1 rounded-xl flex gap-1 mt-auto">
                {["Yes", "No", "Unsure"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setRecordKeeping(v)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      recordKeeping === v
                        ? "bg-white text-primary shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </section>

            {/* Q26 */}
            <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40 flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  26
                </span>
                <span>Comfortable with physical audits?</span>
              </h3>
              <div className="bg-surface-container-high p-1 rounded-xl flex gap-1 mt-auto">
                {["Yes", "No", "Unsure"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setPhysicalAudits(v)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      physicalAudits === v
                        ? "bg-white text-primary shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Question 27: Additional Notes */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <h2 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                27
              </span>
              Anything else we should know?
            </h2>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Please share any additional details, concerns, or specific goals you have for your farm..."
              className="w-full rounded-2xl border border-outline-variant bg-surface p-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none text-sm text-on-surface placeholder:text-on-surface-variant/40"
            />
          </section>
        </div>

        {/* Floating Bottom Nav */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/onboarding/step-3"
            className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            &larr; Back
          </Link>
          <div className="text-xs text-on-surface-variant font-medium">
            Step 4 of 5
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm btn-shadow hover-lift transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
          >
            <span>{saving ? "Saving..." : "Continue"}</span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
