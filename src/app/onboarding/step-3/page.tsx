"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function OperatingStylePage() {
  const router = useRouter();
  const [decisionStyle, setDecisionStyle] = useState("data");
  const [failureResponse, setFailureResponse] = useState("adjust");
  const [obstacles, setObstacles] = useState<string[]>([
    "Access to Finance & Capital",
    "Time Management & Labor",
  ]);
  const [guidancePreference, setGuidancePreference] = useState("structured");
  const [trackingFrequency, setTrackingFrequency] = useState("weekly");
  const [communicationChannels, setCommunicationChannels] = useState<string[]>([
    "whatsapp",
    "sms",
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/onboarding/step?email=keziah@futurefarms.africa")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.operatingStyle) {
          const os = data.user.operatingStyle;
          if (os.decisionStyle) setDecisionStyle(os.decisionStyle);
          if (os.failureResponse) setFailureResponse(os.failureResponse);
          if (os.obstacles) {
            try {
              setObstacles(JSON.parse(os.obstacles));
            } catch (e) {}
          }
          if (os.guidancePreference) setGuidancePreference(os.guidancePreference);
          if (os.trackingFrequency) setTrackingFrequency(os.trackingFrequency);
          if (os.communicationChannels) {
            try {
              setCommunicationChannels(JSON.parse(os.communicationChannels));
            } catch (e) {}
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

  const toggleChannel = (item: string) => {
    if (communicationChannels.includes(item)) {
      setCommunicationChannels(communicationChannels.filter((c) => c !== item));
    } else {
      setCommunicationChannels([...communicationChannels, item]);
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
            communicationChannels,
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
    {
      id: "data",
      title: "Analyze Data & Records",
      desc: "I review past performance, financial logs, or market reports before acting.",
      icon: "query_stats",
    },
    {
      id: "consult",
      title: "Consult Peers & Experts",
      desc: "I discuss options with other farmers, agronomists, or trusted advisors.",
      icon: "groups",
    },
    {
      id: "instinct",
      title: "Trust My Experience",
      desc: "I rely on my gut feeling and years of practical on-farm experience.",
      icon: "psychology",
    },
    {
      id: "test",
      title: "Run a Small Trial",
      desc: "I test the idea on a small scale before fully committing resources.",
      icon: "science",
    },
  ];

  const failureOptions = [
    {
      id: "pivot",
      title: "Pivot Quickly",
      desc: "I abandon the failing plan immediately and try an entirely different approach.",
    },
    {
      id: "adjust",
      title: "Incremental Adjustments",
      desc: "I tweak variables one at a time to see if the original plan can be salvaged.",
    },
    {
      id: "seek_help",
      title: "Seek External Input",
      desc: "I stop and look for outside expertise to diagnose what went wrong before moving forward.",
    },
    {
      id: "persist",
      title: "Stay the Course",
      desc: "I stick with the plan longer, believing external factors (like weather) will eventually turn around.",
    },
  ];

  const obstacleList = [
    "Time Management & Labor",
    "Access to Finance & Capital",
    "Unpredictable Weather/Climate",
    "Market Access & Pricing",
    "Lack of Modern Technology",
    "Specific Technical Knowledge",
  ];

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto w-full pb-28">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/onboarding/step-2"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Step 2
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
            Your Operating Style
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl">
            Help us understand how you make decisions, overcome challenges, and prefer to interact with guidance to tailor our support.
          </p>
        </div>

        <div className="space-y-10">
          {/* Question 9: Decision Making */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <h3 className="text-base font-semibold text-on-surface mb-1 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                9
              </span>
              When facing an important business decision, what do you typically do first?
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 ml-8">
              Select the option that best describes your initial reflex.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decisionOptions.map((opt) => {
                const isSelected = decisionStyle === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => setDecisionStyle(opt.id)}
                    className={`cursor-pointer rounded-2xl border p-5 flex flex-col items-center text-center gap-3 transition-all hover:bg-surface-container-low relative ${
                      isSelected
                        ? "border-primary bg-primary-container/5 ring-1 ring-primary shadow-sm"
                        : "border-outline-variant"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-primary text-white shadow-sm"
                          : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {opt.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-on-surface mb-1">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                    <div
                      className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Question 10: Response to Failure */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <h3 className="text-base font-semibold text-on-surface mb-1 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                10
              </span>
              How do you usually respond when a plan is not working?
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 ml-8">
              Choose the statement that most closely matches your reaction.
            </p>

            <div className="space-y-3">
              {failureOptions.map((opt) => {
                const isSelected = failureResponse === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => setFailureResponse(opt.id)}
                    className={`cursor-pointer rounded-xl border p-4 flex items-center gap-4 transition-all hover:bg-surface-container-low ${
                      isSelected
                        ? "border-primary bg-primary-container/5 ring-1 ring-primary"
                        : "border-outline-variant"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-on-surface">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant">
                        {opt.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Question 11: Obstacles (Select up to 3) */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-base font-semibold text-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  11
                </span>
                What is currently the biggest obstacle to growing your farm business?
              </h3>
              <span className="text-xs font-semibold bg-surface-container-highest px-2.5 py-1 rounded text-on-surface-variant">
                Select up to 3 ({obstacles.length}/3)
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mb-6 ml-8">
              This helps us prioritize the tools and advice we offer you first.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {obstacleList.map((item) => {
                const isChecked = obstacles.includes(item);
                return (
                  <label
                    key={item}
                    onClick={() => toggleObstacle(item)}
                    className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                      isChecked
                        ? "border-primary bg-primary-container/10 ring-1 ring-primary"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? "bg-primary border-primary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {isChecked && (
                        <span className="material-symbols-outlined text-[14px]">
                          check
                        </span>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-on-surface">
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Grouped: Question 12 Guidance & Question 13 Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
              <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  12
                </span>
                Guidance Preference
              </h3>
              <div className="space-y-2">
                {[
                  { id: "direct", label: "Direct & To-the-point" },
                  { id: "structured", label: "Structured & Detailed steps" },
                  { id: "encouraging", label: "Supportive & Encouraging" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setGuidancePreference(opt.id)}
                    className={`border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                      guidancePreference === opt.id
                        ? "border-primary bg-primary-container/5"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        guidancePreference === opt.id
                          ? "border-primary bg-primary"
                          : "border-outline-variant"
                      }`}
                    >
                      {guidancePreference === opt.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm text-on-surface font-medium">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
              <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  13
                </span>
                Performance Tracking
              </h3>
              <div className="space-y-2">
                {[
                  { id: "daily", label: "Daily / Constantly" },
                  { id: "weekly", label: "Weekly routines" },
                  { id: "monthly", label: "Monthly / Quarterly" },
                  { id: "seasonally", label: "End of season only" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setTrackingFrequency(opt.id)}
                    className={`border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                      trackingFrequency === opt.id
                        ? "border-primary bg-primary-container/5"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        trackingFrequency === opt.id
                          ? "border-primary bg-primary"
                          : "border-outline-variant"
                      }`}
                    >
                      {trackingFrequency === opt.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm text-on-surface font-medium">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Question 14: Communication Channels */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-surface-variant/40">
            <h3 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                14
              </span>
              How would you prefer to receive updates about your farm?
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { id: "sms", label: "SMS Alerts", icon: "sms" },
                { id: "email", label: "Email Summaries", icon: "mail" },
                { id: "app", label: "App Push Notifications", icon: "notifications_active" },
                { id: "whatsapp", label: "WhatsApp Messages", icon: "chat" },
              ].map((ch) => {
                const isSelected = communicationChannels.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => toggleChannel(ch.id)}
                    className={`border rounded-full px-5 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary text-white shadow-sm"
                        : "border-outline-variant bg-surface hover:bg-surface-container-low text-on-surface"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        isSelected ? "text-white" : "text-on-surface-variant"
                      }`}
                    >
                      {ch.icon}
                    </span>
                    <span>{ch.label}</span>
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
            &larr; Previous Section
          </Link>
          <div className="text-xs text-on-surface-variant font-medium">
            Step 3 of 5
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
