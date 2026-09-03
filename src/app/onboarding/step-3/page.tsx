"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function OperatingStylePage() {
  const router = useRouter();
  const [decisionStyle, setDecisionStyle] = useState(
    "Gather data and analyse the situation before acting."
  );
  const [failureResponse, setFailureResponse] = useState(
    "I first investigate the problem before changing course."
  );
  const [obstacles, setObstacles] = useState<string[]>([
    "Finance",
    "Time",
    "Access to markets",
  ]);
  const [guidancePreference, setGuidancePreference] = useState(
    "Structured — give me clear plans, actions, and deadlines."
  );
  const [trackingFrequency, setTrackingFrequency] = useState("Weekly");
  const [updatePreference, setUpdatePreference] = useState(
    "A combination of digital reports and manager discussions"
  );
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
        if (data.user?.operatingStyle) {
          const os = data.user.operatingStyle;
          if (os.decisionStyle) {
            if (os.decisionStyle === "data") {
              setDecisionStyle("Gather data and analyse the situation before acting.");
            } else if (os.decisionStyle === "trust") {
              setDecisionStyle("Talk the decision through with someone I trust.");
            } else if (os.decisionStyle === "instinct") {
              setDecisionStyle("Trust my instincts and act quickly.");
            } else {
              setDecisionStyle(os.decisionStyle);
            }
          }
          if (os.failureResponse) {
            if (os.failureResponse === "adjust" || os.failureResponse === "investigate") {
              setFailureResponse("I first investigate the problem before changing course.");
            } else if (os.failureResponse === "change") {
              setFailureResponse("I change direction quickly and try a different approach.");
            } else {
              setFailureResponse(os.failureResponse);
            }
          }
          if (os.obstacles) {
            try {
              const parsed = JSON.parse(os.obstacles);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setObstacles(parsed);
              }
            } catch (e) {}
          }
          if (os.guidancePreference) {
            if (os.guidancePreference === "structured") {
              setGuidancePreference("Structured — give me clear plans, actions, and deadlines.");
            } else if (os.guidancePreference === "direct") {
              setGuidancePreference("Direct — tell me clearly what is working and what needs to change.");
            } else {
              setGuidancePreference(os.guidancePreference);
            }
          }
          if (os.trackingFrequency) {
            const formatted = os.trackingFrequency.charAt(0).toUpperCase() + os.trackingFrequency.slice(1);
            setTrackingFrequency(formatted);
          }
          if (os.updatePreference) {
            setUpdatePreference(os.updatePreference);
          }
        }
      })
      .catch(console.error);
  }, []);

  const toggleObstacle = (item: string) => {
    if (obstacles.includes(item)) {
      setObstacles(obstacles.filter((o) => o !== item));
    } else if (obstacles.length < 3) {
      setObstacles([...obstacles, item]);
    }
  };

  const handleNext = async () => {
    setSaving(true);
    try {
      await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 3,
          email: "keziah@futurefarms.africa",
          data: {
            decisionStyle,
            failureResponse,
            obstacles,
            guidancePreference,
            trackingFrequency,
            updatePreference,
          },
        }),
      });
      router.push("/onboarding/step-4");
    } catch (e) {
      console.error(e);
      router.push("/onboarding/step-4");
    } finally {
      setSaving(false);
    }
  };

  const decisionOptions = [
    "Gather data and analyse the situation before acting.",
    "Talk the decision through with someone I trust.",
    "Trust my instincts and act quickly.",
    "Look for a framework, process, or expert guidance to follow.",
    "I sometimes delay decisions because I am unsure what to do.",
  ];

  const failureOptions = [
    "I change direction quickly and try a different approach.",
    "I first investigate the problem before changing course.",
    "I keep pushing the existing plan for longer.",
    "I seek an outside perspective before deciding.",
    "I sometimes struggle to decide what to do next.",
  ];

  const obstacleOptions = [
    "Time",
    "Finance",
    "Farm management knowledge",
    "Technical knowledge",
    "Access to markets",
    "Networks and partnerships",
    "Reliable workers or management team",
    "Confidence in decision-making",
    "Clarity on what to do next",
    "Access to technology",
    "Infrastructure",
    "Other",
  ];

  const guidanceOptions = [
    "Direct — tell me clearly what is working and what needs to change.",
    "Structured — give me clear plans, actions, and deadlines.",
    "Encouraging — help me improve through supportive guidance.",
    "Consultative — discuss the options with me before making decisions.",
    "A combination of the above",
  ];

  const frequencyOptions = [
    "Weekly",
    "Monthly",
    "Quarterly",
    "Once or twice a year",
    "Rarely",
    "I do not currently track business performance",
  ];

  const updatePreferenceOptions = [
    "Real-time alerts for important issues",
    "Weekly operational updates",
    "Monthly performance reports",
    "Scheduled calls or meetings with the Farm Manager",
    "A combination of digital reports and manager discussions",
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
            <span>Section 3 of 5</span>
            <span>•</span>
            <span>Questions 9–14</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
            Your Operating Style
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Help us understand how you make decisions
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 md:p-10 border border-surface-variant/40">
          <form className="space-y-10">
            {/* Question 9 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                9. When facing an important business decision, what do you typically do first?
              </label>

              <div className="space-y-3">
                {decisionOptions.map((opt) => {
                  const isSelected = decisionStyle === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setDecisionStyle(opt)}
                      className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex items-start gap-4 ${
                        isSelected
                          ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                          : "border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span
                        className={`text-sm leading-relaxed ${
                          isSelected ? "text-primary font-semibold" : "text-on-surface"
                        }`}
                      >
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Question 10 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                10. How do you usually respond when a plan is not working?
              </label>

              <div className="space-y-3">
                {failureOptions.map((opt) => {
                  const isSelected = failureResponse === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setFailureResponse(opt)}
                      className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex items-start gap-4 ${
                        isSelected
                          ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                          : "border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span
                        className={`text-sm leading-relaxed ${
                          isSelected ? "text-primary font-semibold" : "text-on-surface"
                        }`}
                      >
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Question 11 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-base font-semibold text-on-surface">
                  11. What is currently the biggest obstacle to growing your farm business?
                </label>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {obstacles.length}/3 selected
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium">
                Select up to three obstacles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {obstacleOptions.map((opt) => {
                  const isChecked = obstacles.includes(opt);
                  const isMaxed = obstacles.length >= 3 && !isChecked;

                  return (
                    <div
                      key={opt}
                      onClick={() => !isMaxed && toggleObstacle(opt)}
                      className={`rounded-xl border p-4 transition-all duration-200 flex items-center justify-between ${
                        isChecked
                          ? "border-primary bg-primary-container/15 ring-1 ring-primary text-primary font-semibold shadow-xs cursor-pointer"
                          : isMaxed
                          ? "border-outline-variant/50 opacity-40 cursor-not-allowed bg-surface-container-lowest"
                          : "border-outline-variant hover:bg-surface-container-low cursor-pointer text-on-surface"
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

            {/* Question 12 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                12. How do you prefer to receive professional guidance and feedback?
              </label>

              <div className="space-y-3">
                {guidanceOptions.map((opt) => {
                  const isSelected = guidancePreference === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setGuidancePreference(opt)}
                      className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex items-start gap-4 ${
                        isSelected
                          ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                          : "border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span
                        className={`text-sm leading-relaxed ${
                          isSelected ? "text-primary font-semibold" : "text-on-surface"
                        }`}
                      >
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Question 13 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                13. How often do you currently review or track your farm&apos;s business performance?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {frequencyOptions.map((opt) => {
                  const isSelected = trackingFrequency === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setTrackingFrequency(opt)}
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

            {/* Question 14 */}
            <div className="space-y-4">
              <label className="block text-base font-semibold text-on-surface">
                14. How would you prefer to receive updates about your farm?
              </label>

              <div className="space-y-3">
                {updatePreferenceOptions.map((opt) => {
                  const isSelected = updatePreference === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setUpdatePreference(opt)}
                      className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex items-start gap-4 ${
                        isSelected
                          ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                          : "border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span
                        className={`text-sm leading-relaxed ${
                          isSelected ? "text-primary font-semibold" : "text-on-surface"
                        }`}
                      >
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="pt-8 border-t border-surface-variant/50 flex items-center justify-between">
              <Link
                href="/onboarding/step-2"
                className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Previous Section
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-xs text-on-surface-variant font-medium">
                  Section 3 of 5
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-on-primary text-sm font-semibold px-8 py-3.5 rounded-xl shadow-md btn-shadow hover-lift transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  <span>{saving ? "Saving..." : "Save & Continue"}</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
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
