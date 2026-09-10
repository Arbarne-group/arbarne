"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

export default function OperatingStylePage() {
  const router = useRouter();
  const [decisionStyle, setDecisionStyle] = useState("");
  const [failureResponse, setFailureResponse] = useState("");
  const [obstacles, setObstacles] = useState<string[]>([]);
  const [otherObstacle, setOtherObstacle] = useState("");
  const [guidancePreference, setGuidancePreference] = useState("");
  const [trackingFrequency, setTrackingFrequency] = useState("");
  const [updatePreferences, setUpdatePreferences] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const email = getActiveUserEmail();

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
              if (Array.isArray(parsed) && parsed.length > 0) setObstacles(parsed);
            } catch {}
          }
          if (os.otherObstacle) setOtherObstacle(os.otherObstacle);
          if (os.guidancePreference) setGuidancePreference(os.guidancePreference);
          if (os.trackingFrequency) setTrackingFrequency(os.trackingFrequency);
          if (os.updatePreferences || os.updatePreference) {
            setUpdatePreferences(os.updatePreferences || os.updatePreference);
          }
        }
      })
      .catch(console.error);
  }, []);

  const toggleObstacle = (item: string) => {
    let next: string[];
    if (obstacles.includes(item)) {
      next = obstacles.filter((o) => o !== item);
    } else if (obstacles.length < 3) {
      next = [...obstacles, item];
    } else {
      return;
    }
    setObstacles(next);
    if (next.length > 0) {
      setValidationErrors((prev) => prev.filter((f) => f !== "obstacles"));
    }
  };

  const handleSave = async (navigateNext = true) => {
    if (navigateNext) {
      const missing: string[] = [];
      if (!decisionStyle) missing.push("decisionStyle");
      if (!failureResponse) missing.push("failureResponse");
      if (obstacles.length === 0) missing.push("obstacles");
      if (obstacles.includes("Other") && !otherObstacle.trim()) missing.push("otherObstacle");
      if (!guidancePreference) missing.push("guidancePreference");
      if (!trackingFrequency) missing.push("trackingFrequency");
      if (!updatePreferences) missing.push("updatePreferences");

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
          step: 3,
          email,
          data: {
            decisionStyle,
            failureResponse,
            obstacles,
            otherObstacle,
            guidancePreference,
            trackingFrequency,
            updatePreferences,
            updatePreference: updatePreferences,
            communicationChannels: [updatePreferences],
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
        router.push("/onboarding/step-4");
      }
    } catch (e) {
      console.error(e);
      if (navigateNext) {
        router.push("/onboarding/step-4");
      }
    } finally {
      setSaving(false);
    }
  };

  const decisionOptions = [
    {
      title: "Gather data and analyse the situation before acting.",
      icon: "analytics",
    },
    {
      title: "Talk the decision through with someone I trust.",
      icon: "groups",
    },
    {
      title: "Trust my instincts and act quickly.",
      icon: "bolt",
    },
    {
      title: "Look for a framework, process, or expert guidance to follow.",
      icon: "menu_book",
    },
    {
      title: "I sometimes delay decisions because I am unsure what to do.",
      icon: "hourglass_top",
    },
  ];

  const failureOptions = [
    {
      title: "I change direction quickly and try a different approach.",
      icon: "alt_route",
    },
    {
      title: "I first investigate the problem before changing course.",
      icon: "search",
    },
    {
      title: "I keep pushing the existing plan for longer.",
      icon: "repeat",
    },
    {
      title: "I seek an outside perspective before deciding.",
      icon: "support_agent",
    },
    {
      title: "I sometimes struggle to decide what to do next.",
      icon: "help_outline",
    },
  ];

  const obstacleList = [
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

  const updateOptions = [
    "Real-time alerts for important issues",
    "Weekly operational updates",
    "Monthly performance reports",
    "Scheduled calls or meetings with the Farm Manager",
    "A combination of digital reports and manager discussions",
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
              Section 3 of 5
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Questions 9 – 14</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2 tracking-tight">
            Your Operating Style
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl">
            Help us understand how you make decisions, navigate challenges, and measure progress.
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
          {/* Question 9: Decision Making */}
          <section
            id="q-decisionStyle"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border transition-all ${
              validationErrors.includes("decisionStyle")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-on-surface">
                9. When facing an important business decision, what do you typically do first?
              </h3>
              {validationErrors.includes("decisionStyle") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-5">
              Select the option that best reflects your initial approach.
            </p>

            <div className="space-y-3">
              {decisionOptions.map((opt) => {
                const isSelected = decisionStyle === opt.title;
                return (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => {
                      setDecisionStyle(opt.title);
                      setValidationErrors((prev) => prev.filter((f) => f !== "decisionStyle"));
                    }}
                    className={`w-full text-left rounded-2xl border p-4 sm:p-5 flex items-center justify-between gap-4 transition-all hover:bg-surface-container-low cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {opt.icon}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        {opt.title}
                      </span>
                    </div>
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

          {/* Question 10: Response to Failure */}
          <section
            id="q-failureResponse"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border transition-all ${
              validationErrors.includes("failureResponse")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-on-surface">
                10. How do you usually respond when a plan is not working?
              </h3>
              {validationErrors.includes("failureResponse") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-5">
              Choose the response that best describes your reaction to setbacks.
            </p>

            <div className="space-y-3">
              {failureOptions.map((opt) => {
                const isSelected = failureResponse === opt.title;
                return (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => {
                      setFailureResponse(opt.title);
                      setValidationErrors((prev) => prev.filter((f) => f !== "failureResponse"));
                    }}
                    className={`w-full text-left rounded-2xl border p-4 sm:p-5 flex items-center justify-between gap-4 transition-all hover:bg-surface-container-low cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {opt.icon}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        {opt.title}
                      </span>
                    </div>
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

          {/* Question 11: Obstacles (Select up to three) */}
          <section
            id="q-obstacles"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border transition-all ${
              validationErrors.includes("obstacles") || validationErrors.includes("otherObstacle")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-on-surface">
                  11. What is currently the biggest obstacle to growing your farm business?
                </h3>
                {(validationErrors.includes("obstacles") || validationErrors.includes("otherObstacle")) && (
                  <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Required
                  </span>
                )}
              </div>
              <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
                Select up to three ({obstacles.length}/3)
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mb-5">
              Highlight the primary bottlenecks hindering your enterprise expansion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              {obstacleList.map((item) => {
                const isChecked = obstacles.includes(item);
                const isMaxed = obstacles.length >= 3 && !isChecked;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => !isMaxed && toggleObstacle(item)}
                    className={`border rounded-2xl p-4 flex items-center justify-between text-left transition-all ${
                      isChecked
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary shadow-sm cursor-pointer"
                        : isMaxed
                        ? "border-outline-variant/40 opacity-40 cursor-not-allowed bg-surface-container-lowest"
                        : "border-outline-variant hover:bg-surface-container-low cursor-pointer"
                    }`}
                  >
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        isChecked ? "text-primary font-semibold" : "text-on-surface"
                      }`}
                    >
                      {item}
                    </span>
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                        isChecked
                          ? "bg-primary border-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isChecked && (
                        <span className="material-symbols-outlined text-[15px]">check</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {obstacles.includes("Other") && (
              <div id="q-otherObstacle" className="pt-2">
                <input
                  type="text"
                  placeholder="Please specify your other obstacle..."
                  value={otherObstacle}
                  onChange={(e) => {
                    setOtherObstacle(e.target.value);
                    if (e.target.value.trim()) {
                      setValidationErrors((prev) => prev.filter((f) => f !== "otherObstacle"));
                    }
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-surface ${
                    validationErrors.includes("otherObstacle")
                      ? "border-red-400 ring-2 ring-red-300"
                      : "border-outline-variant"
                  }`}
                />
              </div>
            )}
          </section>

          {/* Question 12: Guidance Preference */}
          <section
            id="q-guidancePreference"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border transition-all ${
              validationErrors.includes("guidancePreference")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-on-surface">
                12. How do you prefer to receive professional guidance and feedback?
              </h3>
              {validationErrors.includes("guidancePreference") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-5">
              Tell us how our agronomists and platform advisors should communicate with you.
            </p>

            <div className="space-y-3">
              {guidanceOptions.map((opt) => {
                const isSelected = guidancePreference === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setGuidancePreference(opt);
                      setValidationErrors((prev) => prev.filter((f) => f !== "guidancePreference"));
                    }}
                    className={`w-full text-left rounded-2xl border p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer transition-all ${
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

          {/* Question 13: Performance Tracking Frequency */}
          <section
            id="q-trackingFrequency"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border transition-all ${
              validationErrors.includes("trackingFrequency")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-on-surface">
                13. How often do you currently review or track your farm&apos;s business performance?
              </h3>
              {validationErrors.includes("trackingFrequency") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-5">
              Select your typical cadence for reviewing farm metrics, costs, and revenues.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {frequencyOptions.map((opt) => {
                const isSelected = trackingFrequency === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setTrackingFrequency(opt);
                      setValidationErrors((prev) => prev.filter((f) => f !== "trackingFrequency"));
                    }}
                    className={`border rounded-2xl p-4 flex items-center justify-between text-left cursor-pointer transition-all ${
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

          {/* Question 14: Preferred Update Format */}
          <section
            id="q-updatePreferences"
            className={`bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border transition-all ${
              validationErrors.includes("updatePreferences")
                ? "border-2 border-red-400 bg-red-50/20 ring-2 ring-red-300"
                : "border-surface-variant/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-on-surface">
                14. How would you prefer to receive updates about your farm?
              </h3>
              {validationErrors.includes("updatePreferences") && (
                <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mb-5">
              Select your preferred channel and format for routine farm operations digests.
            </p>

            <div className="space-y-3">
              {updateOptions.map((opt) => {
                const isSelected = updatePreferences === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setUpdatePreferences(opt);
                      setValidationErrors((prev) => prev.filter((f) => f !== "updatePreferences"));
                    }}
                    className={`w-full text-left rounded-2xl border p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer transition-all ${
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
        </div>

        {/* Floating Bottom Nav */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-6 py-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <Link
            href="/onboarding/step-2"
            className="text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            &larr; Back to Step 2
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
              <span>{saving ? "Saving..." : "Save & Continue"}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
