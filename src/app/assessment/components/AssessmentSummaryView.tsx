"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  getPillarById,
  ALL_PILLARS,
  DEFAULT_PILLAR_2_ANSWERS,
} from "@/data/assessmentData";
import { ALL_PILLARS as CANONICAL_PILLARS } from "@/data/allPillarsData";
import {
  getCapabilityTier,
  getCapabilityFeedbackText,
  getPillarAutomaticFeedback,
} from "@/data/capabilityFeedback";

interface AssessmentSummaryViewProps {
  pillarId: number;
  answers?: Record<string, "yes" | "no">;
  onBackToHub: () => void;
  onContinueToNextPillar: (nextPillarId: number) => void;
}

type FFVClaimStatus = "not_submitted" | "submitted" | "verified" | "needs_review";

interface FFVClaimItem {
  id: string;
  questionNumber: number;
  questionText: string;
  capCode: string;
  acceptableEvidence: string;
  technicalCode: string;
  farmerAction: string;
  status: FFVClaimStatus;
  evidenceNotes?: string;
  evidenceType?: "digital" | "demonstration" | "visit";
  verifierNotes?: string;
}

export default function AssessmentSummaryView({
  pillarId,
  answers: propAnswers,
  onBackToHub,
  onContinueToNextPillar,
}: AssessmentSummaryViewProps) {
  const pillar = getPillarById(pillarId);
  const [mounted, setMounted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [expandedCapIds, setExpandedCapIds] = useState<Record<string, boolean>>({});

  // Modals and drawers
  const [isFFVOpen, setIsFFVOpen] = useState(false);
  const [activeFfvCapIndex, setActiveFfvCapIndex] = useState(0);
  const [ffvViewMode, setFfvViewMode] = useState<"farmer" | "verifier">("farmer");
  const [submittingClaim, setSubmittingClaim] = useState<FFVClaimItem | null>(null);
  const [submissionType, setSubmissionType] = useState<"digital" | "demonstration" | "visit">("digital");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCapForDetail, setSelectedCapForDetail] = useState<{
    id: string;
    code: string;
    name: string;
    yesCount: number;
    total: number;
    tier: any;
    statusFeedback: string;
  } | null>(null);

  // FFV claim statuses state (initialized per "yes" answer)
  const [claimStatuses, setClaimStatuses] = useState<Record<string, FFVClaimStatus>>({});
  const [verifierEvMethods, setVerifierEvMethods] = useState<Record<string, string>>({});

  // Safely load answers after client-side mount
  useEffect(() => {
    setMounted(true);
    let loadedAnswers: Record<string, "yes" | "no"> = {};

    if (propAnswers && Object.keys(propAnswers).length > 0) {
      loadedAnswers = propAnswers;
    } else {
      try {
        const saved = localStorage.getItem("future_farms_assessment_answers");
        if (saved) {
          loadedAnswers = JSON.parse(saved);
        }
      } catch (e) {
        console.error(e);
      }
      if (Object.keys(loadedAnswers).length === 0 && pillarId === 2) {
        loadedAnswers = DEFAULT_PILLAR_2_ANSWERS;
      }
    }
    setAnswers(loadedAnswers);

    // Initial mock claim statuses for demo
    const initialStatuses: Record<string, FFVClaimStatus> = {};
    const initialMethods: Record<string, string> = {};
    let count = 0;
    pillar.capabilities.forEach((c) => {
      c.questions.forEach((q) => {
        if (loadedAnswers[q.id] === "yes") {
          count++;
          if (count === 1) {
            initialStatuses[q.id] = "verified";
            initialMethods[q.id] = "DIG";
          } else if (count === 2) {
            initialStatuses[q.id] = "submitted";
            initialMethods[q.id] = "DEM";
          } else if (count === 3) {
            initialStatuses[q.id] = "needs_review";
            initialMethods[q.id] = "DOC";
          } else {
            initialStatuses[q.id] = "not_submitted";
            initialMethods[q.id] = "DIG";
          }
        }
      });
    });
    setClaimStatuses(initialStatuses);
    setVerifierEvMethods(initialMethods);
  }, [propAnswers, pillarId, pillar]);

  // Compute capability scores with status tiers & feedback
  const capabilityScores = useMemo(() => {
    return pillar.capabilities.map((cap) => {
      const yesCount = cap.questions.filter((q) => answers[q.id] === "yes").length;
      const total = cap.questions.length || 5;
      const percent = Math.round((yesCount / total) * 100);

      const tier = getCapabilityTier(yesCount, total);
      const statusFeedback = getCapabilityFeedbackText(cap.id, yesCount, cap.name);

      return {
        id: cap.id,
        name: cap.name,
        code: `${pillar.id}.${cap.number}`,
        yesCount,
        total,
        percent,
        color: tier.hex,
        tier,
        statusFeedback,
      };
    });
  }, [pillar, answers]);

  const totalQuestions = pillar.capabilities.flatMap((c) => c.questions).length || 25;
  const totalYes = capabilityScores.reduce((acc, c) => acc + c.yesCount, 0);

  // Canonical Pillar with rich recommendations for gaps
  const canonicalPillar = useMemo(() => {
    return CANONICAL_PILLARS.find((p) => p.id === pillarId);
  }, [pillarId]);

  const pillarGaps = useMemo(() => {
    if (!canonicalPillar) return [];
    return canonicalPillar.capabilities
      .flatMap((c) => c.questions)
      .filter((q) => answers[q.id] === "no");
  }, [canonicalPillar, answers]);

  // Gauge calculation
  const clampedRatio = Math.max(0, Math.min(1, totalYes / totalQuestions));
  const dashOffset = (125.6 * (1 - clampedRatio)).toFixed(1);

  // Automatic feedback for pillar based on total score
  const pillarFeedback = getPillarAutomaticFeedback(totalYes, totalQuestions);
  const nextPillarId = pillar.id < ALL_PILLARS.length ? pillar.id + 1 : 1;

  // FFV Claims compilation for "Yes" answers
  const ffvCapabilityClaims = useMemo(() => {
    return pillar.capabilities.map((cap) => {
      const yesQuestions = cap.questions.filter((q) => answers[q.id] === "yes");
      const claims: FFVClaimItem[] = yesQuestions.map((q, idx) => {
        const evidenceTypes = [
          { text: "Upload a screenshot / digital record", code: "DIG / DEM", action: "Upload screenshot or demonstrate use" },
          { text: "Verification interview - online or visit", code: "DIG / DEM / INT", action: "Upload evidence or verify during call" },
          { text: "Demonstrate the activity", code: "DEM", action: "Practical demonstration" },
          { text: "Upload a document or record", code: "DOC / EXT", action: "Upload certificate or register" },
        ];
        const assigned = evidenceTypes[idx % evidenceTypes.length];
        return {
          id: q.id,
          questionNumber: q.question_number,
          questionText: q.question_text,
          capCode: `${pillar.id}.${cap.number}`,
          acceptableEvidence: assigned.text,
          technicalCode: assigned.code,
          farmerAction: assigned.action,
          status: claimStatuses[q.id] || "not_submitted",
          evidenceNotes: "",
          evidenceType: "digital",
        };
      });

      const verifiedCount = claims.filter((c) => c.status === "verified").length;
      return {
        capId: cap.id,
        capCode: `${pillar.id}.${cap.number}`,
        capName: cap.name,
        totalClaims: claims.length,
        verifiedCount,
        claims,
      };
    });
  }, [pillar, answers, claimStatuses]);

  const totalFFVClaims = ffvCapabilityClaims.reduce((acc, c) => acc + c.totalClaims, 0);
  const totalFFVVerified = ffvCapabilityClaims.reduce((acc, c) => acc + c.verifiedCount, 0);
  const ffvOverallStatus =
    totalFFVVerified === totalFFVClaims && totalFFVClaims > 0
      ? "Verified"
      : totalFFVVerified > 0
      ? "In Review"
      : "Not Started";

  // Verified score approximation based on verified claims
  const verifiedPillarScore = useMemo(() => {
    if (totalFFVVerified === 0) return Math.max(0, totalYes - 3);
    return Math.min(totalYes, Math.max(totalFFVVerified, Math.round(totalYes * 0.85)));
  }, [totalFFVVerified, totalYes]);

  const toggleCapability = (capId: string) => {
    setExpandedCapIds((prev) => ({
      ...prev,
      [capId]: !prev[capId],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    pillar.capabilities.forEach((c) => {
      allOpen[c.id] = true;
    });
    setExpandedCapIds(allOpen);
  };

  const collapseAll = () => {
    setExpandedCapIds({});
  };

  const handleOpenProvideEvidence = (claim: FFVClaimItem) => {
    setSubmittingClaim(claim);
    setSubmissionType("digital");
    setSubmissionNotes("");
  };

  const handleSubmitEvidence = () => {
    if (!submittingClaim) return;
    setClaimStatuses((prev) => ({
      ...prev,
      [submittingClaim.id]: "submitted",
    }));
    setSubmittingClaim(null);
  };

  const handleVerifierDecision = (claimId: string, decision: FFVClaimStatus) => {
    setClaimStatuses((prev) => ({
      ...prev,
      [claimId]: decision,
    }));
  };

  if (!mounted) {
    return (
      <div className="flex-1 overflow-y-auto bg-background p-margin-mobile md:p-margin-desktop flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">
            progress_activity
          </span>
          <span className="font-label-sm text-sm text-on-surface-variant font-medium">
            Loading assessment summary...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-margin-mobile md:p-margin-desktop">
      <div className="max-w-[880px] mx-auto w-full flex flex-col items-center">
        {/* Top Actions: Reassessment Cycle Banner & Download Action */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          {/* 90-Day Reassessment Cycle Notice */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/80 border border-outline-variant/60 text-xs font-semibold text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-amber-600">event_repeat</span>
            <span>Pillar reassessment can only be repeated after <strong>90 days (3 months)</strong></span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-surface-container-high bg-surface text-on-surface-variant shadow-xs hover:bg-surface-variant hover:border-outline-variant transition-all text-xs font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              Transformation Report
            </button>
            <button
              type="button"
              onClick={() => setShowCertificateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all text-xs font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              FFV Certificate
            </button>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            Pillar Assessment Complete
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface m-0">
            Pillar {pillar.id}: {pillar.name}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Review your diagnostic score, capability recommendations, and start Future Farms Verification (FFV).
          </p>
        </div>

        {/* Score Section */}
        <div className="relative flex flex-col items-center mb-2">
          <svg className="w-56 h-32" viewBox="0 0 100 50">
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="transparent"
              stroke="#edeeef"
              strokeLinecap="round"
              strokeWidth="8"
            />
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="transparent"
              stroke={pillarFeedback.strokeColor}
              strokeDasharray="125.6"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeWidth="8"
            />
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="transparent"
              stroke={pillarFeedback.strokeColor}
              strokeDasharray="125.6"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeWidth="12"
              strokeOpacity="0.3"
              style={{ filter: "blur(2px)" }}
            />
          </svg>

          <div className="absolute bottom-2 flex flex-col items-center justify-center w-full">
            <span
              className="text-[40px] font-bold leading-none tracking-tight text-on-surface"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {totalYes}
              <span className="text-[20px] text-on-surface-variant font-medium">
                /{totalQuestions}
              </span>
            </span>
          </div>
        </div>

        {/* Status Label */}
        <div
          className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full ${pillarFeedback.badgeBg} border ${pillarFeedback.badgeBorder} mb-4`}
        >
          <span
            className={`font-label-sm text-[12px] font-bold uppercase tracking-widest ${pillarFeedback.badgeText}`}
          >
            {pillarFeedback.label}
          </span>
        </div>

        {/* Automatic Pillar Feedback Card */}
        <div className="w-full bg-surface border border-surface-container-high rounded-2xl p-5 sm:p-6 shadow-sm mb-6 text-center">
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed max-w-2xl mx-auto m-0">
            {pillarFeedback.feedback}
          </p>
        </div>

        {/* 1. FFV ENTRY POINT INSIDE EACH PILLAR */}
        <div className="w-full bg-gradient-to-br from-emerald-900/10 via-emerald-800/5 to-surface rounded-2xl border border-emerald-600/30 p-5 sm:p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[14px]">verified_user</span>
                  Future Farms Verification (FFV)
                </span>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  Refers to &ldquo;Yes&rdquo; questions
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-on-surface m-0">
                Pillar {pillar.id}: {pillar.name}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                <span>Assessment Score: <strong className="text-on-surface">{totalYes}/{totalQuestions}</strong></span>
                <span>•</span>
                <span>Verification Status: <strong className="text-emerald-700">{ffvOverallStatus}</strong></span>
                <span>•</span>
                <span>Verified Claims: <strong className="text-on-surface">{totalFFVVerified} of {totalFFVClaims}</strong></span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed m-0 pt-1">
                FFV verifies the evidence behind your assessment responses and strengthens the credibility of your Future Farm Profile for financiers and buyers.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsFFVOpen(true)}
                className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Start Pillar Verification</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="px-4 py-2 rounded-xl bg-surface border border-emerald-600/30 hover:bg-emerald-50/50 text-emerald-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                <span>View FFV Certificate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Capability Section Header with Expand/Collapse All */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-title-md text-lg font-semibold text-on-surface m-0">
              Capability Status Feedback
            </h2>
            <p className="text-xs text-on-surface-variant m-0 mt-0.5">
              Click any capability to view specific development actions and maturity status.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={expandAll}
              className="text-xs font-semibold text-primary hover:underline px-2.5 py-1 rounded-lg hover:bg-primary-container/10 transition-colors cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-outline-variant">•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-xs font-semibold text-on-surface-variant hover:underline px-2.5 py-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Capability List with Interactive Status Feedback & Clickable Actions */}
        <div className="w-full flex flex-col gap-3.5 mb-8">
          {capabilityScores.map((cap) => {
            const isExpanded = !!expandedCapIds[cap.id];

            return (
              <div
                key={cap.id}
                className={`group rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
                  isExpanded
                    ? "bg-surface shadow-level-2 border-outline-variant"
                    : "bg-surface rounded-xl border-surface-container-high shadow-sm hover:shadow-md hover:border-outline-variant/60"
                }`}
                onClick={() => toggleCapability(cap.id)}
              >
                {/* Header Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 select-none">
                  {/* Left: Code, Name & Status Badge */}
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <span className="font-title-md text-[15px] sm:text-[16px] font-semibold text-on-surface">
                      Capability {cap.code}: {cap.name}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cap.tier.badgeBg} ${cap.tier.badgeBorder} ${cap.tier.badgeText}`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: cap.tier.hex }}
                      />
                      {cap.tier.status}
                    </span>
                  </div>

                  {/* Right: Score Progress Bar & Chevron */}
                  <div className="flex items-center gap-3.5 justify-between sm:justify-end shrink-0">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-24 md:w-32 h-2.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: `${cap.tier.hex}25` }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: cap.yesCount === 0 ? "8px" : `${cap.percent}%`,
                            backgroundColor: cap.tier.hex,
                          }}
                        />
                      </div>
                      <span className="font-title-md text-sm font-bold text-on-surface min-w-[34px] text-right">
                        {cap.yesCount}/{cap.total}
                      </span>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center bg-surface-container/60 group-hover:bg-surface-container transition-colors shrink-0 ${
                        isExpanded ? "bg-surface-container-high" : ""
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-primary" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Capability Status Feedback Panel */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-outline-variant/30 flex flex-col bg-surface-container-lowest/50 animate-in fade-in duration-150">
                    <div
                      className={`p-4 rounded-xl border ${cap.tier.badgeBg} ${cap.tier.badgeBorder} flex flex-col gap-3`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${cap.tier.badgeText} flex items-center gap-1.5`}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: cap.tier.hex }}
                          />
                          Maturity: {cap.tier.status}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCapForDetail(cap);
                          }}
                          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-lg border border-primary/20 shadow-xs cursor-pointer"
                        >
                          <span>View Action Plan</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                      <p className="text-sm text-on-surface leading-relaxed m-0">
                        {cap.statusFeedback}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Targeted Recommendations Section for Questions Answered "No" */}
        <div className="w-full space-y-4 mb-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-title-md text-lg font-semibold text-on-surface flex items-center gap-2 m-0">
                <span className="material-symbols-outlined text-amber-600">lightbulb</span>
                <span>Recommended Actions (Question-Level Tasks)</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5 m-0">
                Auto-recommended tasks tailored specifically to your operational gaps. These tasks also sync with your My Future Farm page.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 self-start sm:self-auto">
              {pillarGaps.length} Actionable Tasks
            </span>
          </div>

          {pillarGaps.length === 0 ? (
            <div className="bg-surface rounded-2xl p-8 border border-primary/20 text-center space-y-2">
              <span className="material-symbols-outlined text-primary text-4xl">verified</span>
              <h4 className="text-base font-bold text-on-surface">
                Outstanding! Zero Operational Gaps
              </h4>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                You have verified all 25 diagnostic capabilities for this pillar. Your farm demonstrates advanced operating maturity in this area.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pillarGaps.map((q) => (
                <div
                  key={q.id}
                  className="bg-surface rounded-2xl p-5 md:p-6 border border-amber-200/80 shadow-level-1 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-surface-variant pb-3">
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg shrink-0 mt-0.5">
                        {q.id}
                      </span>
                      <div>
                        <h4 className="text-sm md:text-base font-bold text-on-surface leading-snug m-0">
                          {q.question}
                        </h4>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant/60 shrink-0 self-start">
                      Priority: {q.priority}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h5 className="text-xs font-bold text-on-surface mb-1 flex items-center gap-1.5 m-0">
                        <span className="material-symbols-outlined text-[16px] text-primary">task_alt</span>
                        <span>Recommended Action Task</span>
                      </h5>
                      <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low p-3 rounded-xl border border-outline-variant/40 m-0">
                        {q.recommendation}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-surface-container-high border border-outline-variant/40">
                        <h6 className="text-[11px] font-bold text-on-surface mb-1 m-0">
                          Why It Matters
                        </h6>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed m-0">
                          {q.whyItMatters}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                        <h6 className="text-[11px] font-bold text-primary mb-1 flex items-center gap-1 m-0">
                          <span className="material-symbols-outlined text-[14px]">bolt</span>
                          <span>Immediate Quick Win</span>
                        </h6>
                        <p className="text-[11px] text-on-surface leading-relaxed m-0">
                          {q.quickWin}
                        </p>
                      </div>
                    </div>

                    {q.supportAvailable && (
                      <div className="pt-2 border-t border-surface-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                        <span className="text-on-surface-variant">
                          <strong>Support Available:</strong> {q.supportAvailable}
                        </span>
                        <Link
                          href="/service-desk"
                          className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <span>Request Advisory Support</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Actions */}
        <div className="flex flex-col items-center gap-md w-full max-w-sm mb-12">
          <button
            type="button"
            onClick={() => onContinueToNextPillar(nextPillarId)}
            className="w-full bg-primary text-on-primary font-label-sm text-label-sm py-4 rounded-xl shadow-sm hover:shadow-md hover:bg-surface-tint transition-all active:scale-[0.98] font-bold cursor-pointer"
          >
            {pillar.id === ALL_PILLARS.length
              ? "Return to Assessment Hub"
              : `Continue to Pillar ${nextPillarId}`}
          </button>
          <button
            type="button"
            onClick={onBackToHub}
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline decoration-transparent hover:decoration-primary underline-offset-4 cursor-pointer"
          >
            Back to Assessment Hub
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: 2. CAPABILITY-BY-CAPABILITY VERIFICATION (FFV)                   */}
      {/* ========================================================================= */}
      {isFFVOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-surface rounded-3xl max-w-4xl w-full border border-surface-container-high shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-surface-container-high bg-surface-container-lowest flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                    FFV Verification Studio
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Pillar {pillar.id}: {pillar.name}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-on-surface m-0">
                  Capability-by-Capability Verification
                </h2>
                <p className="text-xs text-on-surface-variant mt-1 m-0">
                  Provide evidence for practices answered &ldquo;Yes&rdquo; to build credibility for lenders and investors.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* View Mode Toggle: Farmer vs Verifier */}
                <div className="hidden sm:flex items-center bg-surface-container rounded-xl p-1 border border-outline-variant/60 text-xs">
                  <button
                    type="button"
                    onClick={() => setFfvViewMode("farmer")}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      ffvViewMode === "farmer"
                        ? "bg-surface text-primary shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Farmer View
                  </button>
                  <button
                    type="button"
                    onClick={() => setFfvViewMode("verifier")}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      ffvViewMode === "verifier"
                        ? "bg-surface text-emerald-800 shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Verifier Audit View
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFFVOpen(false)}
                  className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Capability Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {ffvCapabilityClaims.map((cap, idx) => {
                  const isActive = idx === activeFfvCapIndex;
                  return (
                    <button
                      key={cap.capId}
                      type="button"
                      onClick={() => setActiveFfvCapIndex(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-surface-container-lowest text-on-surface-variant border-surface-container-high hover:bg-surface-container hover:text-on-surface"
                      }`}
                    >
                      <span>Capability {cap.capCode}</span>
                      <span className="ml-1.5 opacity-80">
                        ({cap.verifiedCount}/{cap.totalClaims})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Capability Verification Panel */}
              {(() => {
                const currentCap = ffvCapabilityClaims[activeFfvCapIndex];
                const matchingScore = capabilityScores.find((c) => c.id === currentCap.capId);
                if (!currentCap) return null;

                return (
                  <div className="space-y-6">
                    {/* Capability Overview Banner */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-primary">
                          Capability {currentCap.capCode}
                        </span>
                        <h3 className="text-base font-bold text-on-surface m-0">
                          {currentCap.capName}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1">
                          <span>
                            Self-Assessment: <strong>{matchingScore?.yesCount}/{matchingScore?.total} ({matchingScore?.tier.status})</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Verified: <strong className="text-emerald-700">{currentCap.verifiedCount} of {currentCap.totalClaims} claims verified</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant">
                          Verified Score: {Math.min(currentCap.verifiedCount, matchingScore?.yesCount || 0)}/{matchingScore?.total}
                        </span>
                      </div>
                    </div>

                    {/* Claims List / Table */}
                    {currentCap.claims.length === 0 ? (
                      <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-surface-container-high space-y-2">
                        <span className="material-symbols-outlined text-3xl text-on-surface-variant">info</span>
                        <p className="text-sm font-semibold text-on-surface m-0">
                          No &ldquo;Yes&rdquo; claims for this capability.
                        </p>
                        <p className="text-xs text-on-surface-variant m-0 max-w-sm mx-auto">
                          Verification is only required for practices you confirmed you are currently implementing.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant m-0">
                            Assessment Claims Requiring Evidence
                          </h4>
                          <span className="text-[11px] text-on-surface-variant">
                            Plain-language verification requirements
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {currentCap.claims.map((claim) => {
                            const isNeedsReview = claim.status === "needs_review";
                            const isVerified = claim.status === "verified";
                            const isSubmitted = claim.status === "submitted";

                            return (
                              <div
                                key={claim.id}
                                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                                  isNeedsReview
                                    ? "bg-amber-50/40 border-amber-300"
                                    : isVerified
                                    ? "bg-emerald-50/30 border-emerald-300"
                                    : isSubmitted
                                    ? "bg-blue-50/30 border-blue-200"
                                    : "bg-surface-container-lowest border-surface-container-high"
                                }`}
                              >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                  <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                                        P{claim.capCode}.{claim.questionNumber}
                                      </span>
                                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                        Assessment: YES
                                      </span>
                                      {ffvViewMode === "verifier" && (
                                        <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                          Pref: {claim.technicalCode}
                                        </span>
                                      )}
                                    </div>

                                    <h5 className="text-sm font-bold text-on-surface leading-snug m-0">
                                      &ldquo;{claim.questionText}&rdquo;
                                    </h5>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                                      <div className="p-2.5 rounded-xl bg-surface/80 border border-outline-variant/40">
                                        <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-0.5">
                                          Acceptable Evidence
                                        </span>
                                        <span className="text-on-surface font-medium">
                                          {claim.acceptableEvidence}
                                        </span>
                                      </div>
                                      <div className="p-2.5 rounded-xl bg-surface/80 border border-outline-variant/40">
                                        <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-0.5">
                                          Farmer Action
                                        </span>
                                        <span className="text-on-surface font-medium">
                                          {claim.farmerAction}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right side: Status Indicator & Action */}
                                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0">
                                    {/* 4 Instant Status Indicators */}
                                    {claim.status === "not_submitted" && (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-300 text-xs font-bold">
                                        <span>○</span> Not Submitted
                                      </span>
                                    )}
                                    {claim.status === "submitted" && (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold">
                                        <span>◐</span> Submitted
                                      </span>
                                    )}
                                    {claim.status === "verified" && (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                                        <span>✓</span> Verified
                                      </span>
                                    )}
                                    {claim.status === "needs_review" && (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
                                        <span>!</span> Needs Review
                                      </span>
                                    )}

                                    {/* Action button */}
                                    {ffvViewMode === "farmer" ? (
                                      <button
                                        type="button"
                                        onClick={() => handleOpenProvideEvidence(claim)}
                                        className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                                      >
                                        {claim.status === "not_submitted"
                                          ? "Provide Evidence"
                                          : "Update Evidence"}
                                      </button>
                                    ) : (
                                      /* Verifier quick decision dropdown */
                                      <div className="flex flex-col gap-1 items-end">
                                        <div className="flex items-center gap-1 text-[11px]">
                                          <button
                                            type="button"
                                            onClick={() => handleVerifierDecision(claim.id, "verified")}
                                            className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer"
                                            title="Mark Verified"
                                          >
                                            ✓
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleVerifierDecision(claim.id, "submitted")}
                                            className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer"
                                            title="Partially Verified / Submitted"
                                          >
                                            ◐
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleVerifierDecision(claim.id, "needs_review")}
                                            className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold hover:bg-amber-700 cursor-pointer"
                                            title="Needs Review"
                                          >
                                            ?
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleVerifierDecision(claim.id, "not_submitted")}
                                            className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold hover:bg-rose-700 cursor-pointer"
                                            title="Not Verified"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                        <span className="text-[10px] text-on-surface-variant font-mono">
                                          Method: {verifierEvMethods[claim.id] || "DIG"}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* 4. Developmental Guidance if Needs Review */}
                                {isNeedsReview && (
                                  <div className="mt-3 p-3.5 rounded-xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 space-y-1">
                                    <div className="font-bold flex items-center gap-1 text-amber-900">
                                      <span className="material-symbols-outlined text-[16px]">info</span>
                                      <span>Developmental Feedback — What you can do:</span>
                                    </div>
                                    <p className="m-0 text-amber-900 leading-relaxed">
                                      The evidence submitted does not clearly demonstrate regular use of the practice.
                                      Upload a recent digital record, or demonstrate the activity during your scheduled FFV verification visit.
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 6. Capability Verification Result Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          Capability Verification Outcome
                        </span>
                        <span className="text-xs font-bold text-emerald-800">
                          {currentCap.verifiedCount} of {currentCap.totalClaims} verified
                        </span>
                      </div>
                      <p className="text-xs text-on-surface leading-relaxed m-0">
                        {currentCap.verifiedCount === currentCap.totalClaims && currentCap.totalClaims > 0
                          ? "All claimed practices under this capability have been evidence-verified. Your verified score reflects full alignment with operational standards."
                          : currentCap.verifiedCount > 0
                          ? `${currentCap.verifiedCount} of the ${currentCap.totalClaims} claimed practices were successfully verified. Remaining gap: Independent performance of advanced tasks requires practical demonstration during the on-farm visit.`
                          : "Verification not yet completed for this capability. Submit evidence to unlock an accredited verified rating."}
                      </p>
                      <div className="pt-2 text-[11px] text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-primary">school</span>
                        <span><strong>Next action:</strong> Complete the capability development roadmap and submit updated evidence when ready.</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 7. Pillar-Level FFV Summary */}
              <div className="p-5 rounded-2xl bg-emerald-950 text-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Pillar {pillar.id} Verification Summary
                    </span>
                    <h4 className="text-lg font-bold text-white m-0">
                      Self-Assessment: {totalYes}/25 • Verified Pillar Score: {verifiedPillarScore}/25
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-emerald-950 text-xs font-bold uppercase tracking-widest self-start sm:self-auto">
                    {ffvOverallStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {ffvCapabilityClaims.map((c) => (
                    <div key={c.capId} className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-800">
                      <span className="text-[10px] text-emerald-300 block font-mono">Cap {c.capCode}</span>
                      <span className="font-bold text-white block truncate">{c.capName}</span>
                      <span className="text-[11px] text-emerald-200 mt-0.5 block">
                        {c.verifiedCount}/{c.totalClaims} verified
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-emerald-200">
                    Distinction: Self-assessed score reflects farmer reporting; Verified score reflects audited evidence.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFFVOpen(false);
                        setShowCertificateModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Download FFV Certificate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-surface-container-high bg-surface-container-lowest flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">
                Future Farms Framework • Accreditation Protocol
              </span>
              <button
                type="button"
                onClick={() => setIsFFVOpen(false)}
                className="px-5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors cursor-pointer"
              >
                Close Studio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: 3. SIMPLE EVIDENCE SUBMISSION PANEL                              */}
      {/* ========================================================================= */}
      {submittingClaim && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-surface rounded-3xl max-w-lg w-full border border-surface-container-high shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Verify This Claim
                </span>
                <h3 className="text-base font-bold text-on-surface m-0 mt-0.5">
                  &ldquo;{submittingClaim.questionText}&rdquo;
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSubmittingClaim(null)}
                className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-on-surface-variant block">
                Choose how you want to verify it:
              </label>

              <div className="space-y-2">
                <label
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    submissionType === "digital"
                      ? "bg-primary/5 border-primary text-on-surface"
                      : "bg-surface-container-lowest border-surface-container-high hover:bg-surface-container"
                  }`}
                >
                  <input
                    type="radio"
                    name="evidenceType"
                    checked={submissionType === "digital"}
                    onChange={() => setSubmissionType("digital")}
                    className="mt-0.5 text-primary"
                  />
                  <div>
                    <strong className="text-xs font-bold text-on-surface block">
                      Upload Digital Evidence
                    </strong>
                    <span className="text-[11px] text-on-surface-variant">
                      Screenshot, digital record, application screenshot or farm register
                    </span>
                  </div>
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    submissionType === "demonstration"
                      ? "bg-primary/5 border-primary text-on-surface"
                      : "bg-surface-container-lowest border-surface-container-high hover:bg-surface-container"
                  }`}
                >
                  <input
                    type="radio"
                    name="evidenceType"
                    checked={submissionType === "demonstration"}
                    onChange={() => setSubmissionType("demonstration")}
                    className="mt-0.5 text-primary"
                  />
                  <div>
                    <strong className="text-xs font-bold text-on-surface block">
                      Practical Demonstration
                    </strong>
                    <span className="text-[11px] text-on-surface-variant">
                      Demonstrate during remote video call or verification visit
                    </span>
                  </div>
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    submissionType === "visit"
                      ? "bg-primary/5 border-primary text-on-surface"
                      : "bg-surface-container-lowest border-surface-container-high hover:bg-surface-container"
                  }`}
                >
                  <input
                    type="radio"
                    name="evidenceType"
                    checked={submissionType === "visit"}
                    onChange={() => setSubmissionType("visit")}
                    className="mt-0.5 text-primary"
                  />
                  <div>
                    <strong className="text-xs font-bold text-on-surface block">
                      Save for Verification Visit
                    </strong>
                    <span className="text-[11px] text-on-surface-variant">
                      Include in the scheduled on-farm verifier inspection
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {submissionType === "digital" && (
              <div className="p-4 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest text-center space-y-1">
                <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
                <p className="text-xs font-semibold text-on-surface m-0">
                  Click to select screenshot or digital record file
                </p>
                <p className="text-[10px] text-on-surface-variant m-0">
                  PNG, JPG, PDF up to 10MB
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant block">
                Add Note (Optional):
              </label>
              <textarea
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                placeholder="E.g., screenshot from FarmDrive mobile app showing monthly records..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface focus:outline-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSubmittingClaim(null)}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitEvidence}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
              >
                Submit Evidence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: FUTURE FARMS TRANSFORMATION REPORT (ASSESSMENT-BASED)            */}
      {/* ========================================================================= */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-surface rounded-3xl max-w-3xl w-full border border-surface-container-high shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-surface-container-high bg-surface-container-lowest flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Assessment-Based
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-on-surface m-0">
                  Future Farms Transformation Report
                </h2>
                <p className="text-xs text-on-surface-variant m-0 mt-0.5">
                  Report ID: FFF-REP-2026-0881 • Farm ID: FFF-KE-000-001
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs text-on-surface">
              {/* Farm Profile Summary */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Farm Name</span>
                  <span className="font-bold text-on-surface">Tumaini Progressive Farm</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Future Farm ID</span>
                  <span className="font-bold text-primary">FFF-KE-000-001</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Location</span>
                  <span className="font-bold text-on-surface">Nakuru, Kenya</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">FFMI Index</span>
                  <span className="font-bold text-emerald-800">74/100 (Structured)</span>
                </div>
              </div>

              {/* Pillar Score Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant m-0">
                  Full Pillar Assessment Results
                </h4>
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold border-b border-surface-variant pb-2">
                    <span>Pillar {pillar.id}: {pillar.name}</span>
                    <span className="text-primary">{totalYes}/{totalQuestions} ({pillarFeedback.label})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {capabilityScores.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-surface border border-outline-variant/40">
                        <span className="truncate pr-2">{c.code}: {c.name}</span>
                        <span className="font-bold shrink-0">{c.yesCount}/{c.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Priority Development Areas */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant m-0">
                  Priority Development Areas (Lowest Capabilities)
                </h4>
                <div className="space-y-2">
                  {capabilityScores
                    .sort((a, b) => a.percent - b.percent)
                    .slice(0, 3)
                    .map((c, i) => (
                      <div key={c.id} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div>
                          <strong className="text-xs font-bold text-on-surface block">
                            Capability {c.code}: {c.name} ({c.yesCount}/{c.total} - {c.tier.status})
                          </strong>
                          <p className="text-[11px] text-on-surface-variant m-0 mt-0.5 leading-relaxed">
                            {c.statusFeedback}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Report Notice */}
              <div className="p-3.5 rounded-xl bg-surface-container-high text-[11px] text-on-surface-variant">
                <strong>Progress Benchmark Notice:</strong> Reassessment eligible in 90 days. To convert this self-assessment report into an accredited <strong>Future Farms Verified Certification</strong>, complete the FFV verification protocol.
              </div>
            </div>

            <div className="p-4 border-t border-surface-container-high bg-surface-container-lowest flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Print Report
              </button>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: FUTURE FARMS VERIFIED CERTIFICATE (EVIDENCE-VERIFIED)             */}
      {/* ========================================================================= */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-surface rounded-3xl max-w-2xl w-full border-2 border-emerald-600/40 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Certificate Header Banner */}
            <div className="p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white text-center relative">
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-400 text-3xl">workspace_premium</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                Official Certification of Capability
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white m-0 mt-1">
                Future Farm Verification (FFV) Certificate
              </h2>
              <p className="text-xs text-emerald-200 mt-1 m-0">
                Certificate Ref: <strong>FFF-CERT-2026-0042</strong>
              </p>
            </div>

            {/* Certificate Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-on-surface bg-surface-container-lowest/40">
              {/* Certification Statement */}
              <div className="text-center max-w-lg mx-auto py-1">
                <p className="text-xs text-on-surface-variant leading-relaxed m-0 italic">
                  This formally certifies that the agricultural enterprise identified below has undergone structured evidence verification under the Future Farms Systems Capability and Maturity Framework.
                </p>
              </div>

              {/* Certificate Details Table */}
              <div className="p-5 rounded-2xl bg-surface border border-emerald-200/80 shadow-xs space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-surface-variant pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Farm Name</span>
                    <strong className="text-sm text-on-surface">Tumaini Progressive Farm</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Future Farm ID</span>
                    <strong className="text-sm text-emerald-700 font-mono">FFF-KE-000-001</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Owner / Manager</span>
                    <strong className="text-sm text-on-surface">David Mwangi</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-surface-variant pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Farm Location</span>
                    <span className="font-semibold text-on-surface">Nakuru County, Kenya</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">FFMI Index</span>
                    <span className="font-semibold text-emerald-800">74/100 (Structured Farm)</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Verification Scope</span>
                    <span className="font-semibold text-on-surface">Pillar {pillar.id} Focused FFV</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-surface-variant pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Verified Pillar</span>
                    <strong className="text-on-surface">{pillar.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Verified Pillar Score</span>
                    <strong className="text-emerald-700">{verifiedPillarScore}/25 ({pillarFeedback.label})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Evidence Basis</span>
                    <span className="text-on-surface">Digital records, DEM, Visit</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Verification Method</span>
                    <span className="text-on-surface">Digital &amp; On-Farm Hybrid</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Issue Date</span>
                    <span className="text-on-surface">September 7, 2026</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Validity / Cycle</span>
                    <span className="font-bold text-amber-800">90 Days (Reassessment due)</span>
                  </div>
                </div>
              </div>

              {/* QR Verification Code & Signatory */}
              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-white border border-outline-variant flex items-center justify-center p-1 shrink-0">
                    <span className="material-symbols-outlined text-4xl text-neutral-800">qr_code_2</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-on-surface block">
                      Scan QR to Authenticate Certificate
                    </span>
                    <span className="text-[10px] text-on-surface-variant leading-tight block">
                      Enables financiers, buyers, and partners to verify farm credentials online.
                    </span>
                  </div>
                </div>

                <div className="text-right sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Authorized Signatory</span>
                  <strong className="text-xs text-on-surface block">Dr. Angela Kamau</strong>
                  <span className="text-[10px] text-on-surface-variant">Future Farms Verification Board</span>
                </div>
              </div>

              {/* Statutory Disclaimer */}
              <div className="p-3 rounded-xl bg-surface-container-high/60 text-[10px] text-on-surface-variant leading-relaxed">
                <strong>Disclaimer / Scope Statement:</strong> FFV verifies capabilities under the Future Farms Framework and does not replace statutory, regulatory or sector-specific certifications.
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="p-4 border-t border-surface-container-high bg-surface flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Print Official Certificate
              </button>
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CAPABILITY DETAIL ACTION PLAN                                    */}
      {/* ========================================================================= */}
      {selectedCapForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-surface rounded-3xl max-w-lg w-full border border-surface-container-high shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-primary">
                  Capability {selectedCapForDetail.code}
                </span>
                <h3 className="text-base font-bold text-on-surface m-0 mt-0.5">
                  {selectedCapForDetail.name}
                </h3>
                <span className="text-xs font-bold text-on-surface-variant">
                  Score: {selectedCapForDetail.yesCount}/{selectedCapForDetail.total} ({selectedCapForDetail.tier.status})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCapForDetail(null)}
                className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high space-y-2">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                Maturity Feedback &amp; Development Action
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed m-0">
                {selectedCapForDetail.statusFeedback}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <strong className="text-on-surface block">Next Recommended Steps:</strong>
              <ul className="list-disc pl-4 space-y-1 text-on-surface-variant">
                <li>Log completed farm practices into the My Future Farm task manager.</li>
                <li>Submit evidence in the FFV studio to unlock an accredited verified rating.</li>
                <li>Schedule your 90-day reassessment to measure operational growth.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCapForDetail(null);
                  setIsFFVOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer"
              >
                Verify In FFV Studio
              </button>
              <button
                type="button"
                onClick={() => setSelectedCapForDetail(null)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
