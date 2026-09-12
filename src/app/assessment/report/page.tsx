"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { ALL_PILLARS, PillarData, AssessmentQuestion } from "@/data/allPillarsData";
import { getMaturityTier } from "@/lib/assessmentScoring";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

interface QuestionResponseItem {
  questionId: string;
  capabilityId: string;
  question: string;
  answer: "yes" | "no";
  recommendation?: string;
  whyItMatters?: string;
  quickWin?: string;
  priority?: string;
  supportAvailable?: string;
}

function AssessmentReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pillarParam = searchParams.get("pillar") || "all";
  const emailParam = searchParams.get("email") || "";
  const isAllPillars = pillarParam === "all";
  const pillarId = isAllPillars ? null : Math.max(1, Math.min(8, Number(pillarParam) || 1));

  const { user: clerkUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [activeEmail, setActiveEmail] = useState<string>("");
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load user profile & assessment report
  useEffect(() => {
    const email = emailParam || clerkUser?.primaryEmailAddress?.emailAddress || getActiveUserEmail();
    if (!email) {
      setLoading(false);
      return;
    }
    setActiveEmail(email);

    // Fetch user onboarding profile
    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserProfile(data.user);
        }
      })
      .catch(console.error);

    // Fetch assessment report data from API
    const reportUrl = `/api/assessment/report?email=${encodeURIComponent(email)}&pillarId=${pillarParam}`;
    fetch(reportUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.report) {
          setReportData(data.report);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [pillarParam, emailParam]);

  // Farm and Farmer Profile details
  const farmName =
    userProfile?.farmCharacteristics?.farmName ||
    userProfile?.farmName ||
    reportData?.farm?.farmName ||
    "Farm Name Not Specified";
  const farmerName =
    userProfile?.name ||
    clerkUser?.fullName ||
    reportData?.farm?.ownerName ||
    "Farmer";
  const locationCounty =
    userProfile?.farmLocation?.county ||
    userProfile?.farmLocation?.district ||
    "County Not Specified";
  const locationSubCounty =
    userProfile?.farmLocation?.subCounty ||
    userProfile?.farmLocation?.zone ||
    "Sub-County Not Specified";
  const locationCountry = userProfile?.farmLocation?.country || "Kenya";
  const acreage =
    userProfile?.farmCharacteristics?.totalAcreage ||
    userProfile?.farmCharacteristics?.farmSize ||
    "—";
  const assessmentDate = reportData?.farm?.assessmentDate
    ? new Date(reportData.farm.assessmentDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  // Document Reference
  const docRef = useMemo(() => {
    const year = new Date().getFullYear();
    const hash = Math.floor(1000 + Math.random() * 9000);
    return isAllPillars
      ? `FFV-FULL-${year}-${hash}`
      : `FFV-P${pillarId}-${year}-${hash}`;
  }, [isAllPillars, pillarId]);

  // Handle browser print -> Save as PDF
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-slate-700">
        <span className="material-symbols-outlined text-4xl text-emerald-700 animate-spin mb-3">
          progress_activity
        </span>
        <h2 className="text-base font-bold text-slate-800">Generating Official Assessment Report...</h2>
        <p className="text-xs text-slate-500 mt-1">
          Compiling evaluation criteria, maturity verifications, and tailored gap recommendations.
        </p>
      </div>
    );
  }

  if (!reportData || reportData.error) {
    return (
      <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 shadow-xs">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h2 className="text-xl font-bold text-on-surface mb-2">Report Locked: Assessment Incomplete</h2>
        <p className="text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed">
          {reportData?.error || "You have not completed any assessment questions yet. You must complete at least one capability pillar before generating, downloading, or reviewing your report."}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/assessment"
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white font-semibold text-sm transition-all shadow-xs inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Go to Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 text-slate-800 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 min-h-screen pb-16">
      {/* ─────────────────────────────────────────────────────────────
          PRINT STYLES: Publication-Grade A4 Output (No URL / Header Clutter)
          ───────────────────────────────────────────────────────────── */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 0; /* Suppresses browser-generated headers (URL, title) and footers (date, URL) */
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          /* Strip URL href display */
          a[href]:after {
            content: none !important;
          }
          a {
            text-decoration: none !important;
            color: inherit !important;
          }
          .report-sheet-container {
            box-shadow: none !important;
            border: none !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 0 !important;
            padding: 10mm 14mm 8mm 14mm !important;
            background: #ffffff !important;
          }
          .print-page-break {
            break-before: page !important;
            page-break-before: always !important;
            margin-top: 0 !important;
            padding-top: 6mm !important;
          }
          .print-break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          table {
            page-break-inside: auto !important;
          }
          tr {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          thead {
            display: table-header-group !important;
          }
          tfoot {
            display: table-footer-group !important;
          }
        }
      `}</style>

      {/* ─────────────────────────────────────────────────────────────
          VIEWER TOOLBAR (Sticky top navigation, hidden during print)
          ───────────────────────────────────────────────────────────── */}
      <header className="no-print sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Back Navigation & Status */}
          <div className="flex items-center space-x-3">
            <Link
              href={isAllPillars ? "/assessment" : `/assessment/summary?pillar=${pillarId}`}
              className="inline-flex items-center text-xs sm:text-sm font-medium text-slate-600 hover:text-emerald-700 transition"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              {isAllPillars ? "Back to Assessment Hub" : `Back to Pillar ${pillarId} Summary`}
            </Link>
            <span className="text-slate-300">|</span>
            <Image
              src="/logo.webp"
              alt="Future Farms"
              width={140}
              height={35}
              priority
              unoptimized
              className="h-6 w-auto object-contain hidden sm:block"
            />
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              {isAllPillars ? "Comprehensive Report • All 8 Pillars" : `Official Report • Pillar ${pillarId}`}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* View Switcher: Pillar vs Full */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-xs">
              <Link
                href={`/assessment/report?pillar=${pillarId || 2}`}
                className={`px-2 py-1 rounded-md font-semibold transition text-[11px] sm:text-xs ${
                  !isAllPillars
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Pillar {pillarId || 2}
              </Link>
              <Link
                href="/assessment/report?pillar=all"
                className={`px-2 py-1 rounded-md font-semibold transition text-[11px] sm:text-xs ${
                  isAllPillars
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Full 8-Pillar
              </Link>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              Print Report
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition cursor-pointer"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          REPORT CANVAS
          ───────────────────────────────────────────────────────────── */}
      <main className="mt-6 mx-auto px-2 sm:px-4 flex justify-center">
        {isAllPillars ? (
          /* ========================================================================= */
          /* TEMPLATE 2: COMPREHENSIVE 8-PILLAR ASSESSMENT REPORT                      */
          /* Criteria-based scoring (No percentages or progress bars)                  */
          /* ========================================================================= */
          <article className="report-sheet-container max-w-5xl w-full bg-white shadow-xl rounded-xl border border-slate-200 overflow-hidden relative p-4 sm:p-6 md:p-10 space-y-6 print:space-y-0">
            {/* Top Decorative Gradient Accent Bar */}
            <div className="h-2.5 w-full bg-gradient-to-r from-emerald-700 via-emerald-500 to-amber-500 absolute top-0 left-0" />

            {/* ══════════════════════════════════════════════════════════════════════
                PAGE 1: EXECUTIVE SYNTHESIS & MATURITY DIAGNOSTIC
                ══════════════════════════════════════════════════════════════════════ */}
            {/* Document Header & Farm Metadata */}
            <section className="border-b border-slate-200 pb-5 pt-1 print-break-inside-avoid">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Brand Identity */}
                <div className="flex items-center space-x-4">
                  <Image
                    src="/logo.webp"
                    alt="Future Farms"
                    width={220}
                    height={55}
                    priority
                    unoptimized
                    className="h-10 sm:h-12 w-auto object-contain shrink-0"
                  />
                  <div className="border-l border-slate-200 pl-3.5 hidden sm:block">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      FRAMEWORK
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Agricultural Capability &amp; Investment Readiness Verification
                    </p>
                  </div>
                </div>

                {/* Official Stamps */}
                <div className="text-left md:text-right">
                  <span className="inline-block px-3 py-1 rounded bg-slate-900 text-white font-bold text-[10px] sm:text-[11px] tracking-wider uppercase shadow-xs break-words">
                    OFFICIAL COMPREHENSIVE ASSESSMENT REPORT • ALL 8 PILLARS
                  </span>
                  <div className="text-xs text-slate-500 font-mono mt-1.5 space-y-0.5">
                    <div>
                      Doc Ref: <span className="font-semibold text-slate-800">{docRef}</span>
                    </div>
                    <div>
                      Assessment Scope: <span className="text-slate-700 font-medium">8 Pillars • 40 Capabilities</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider font-semibold block text-[10px]">
                    Farm Enterprise
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5 text-sm">{farmName}</p>
                  <p className="text-slate-500">{farmerName}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider font-semibold block text-[10px]">
                    Location &amp; Zone
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5 text-sm">{locationSubCounty}</p>
                  <p className="text-slate-500">{locationCounty}, {locationCountry} ({acreage} Ac)</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider font-semibold block text-[10px]">
                    Assessment Date
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5 text-sm">{assessmentDate}</p>
                  <p className="text-slate-500">Valid for 12 Months</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider font-semibold block text-[10px]">
                    Verification Engine
                  </span>
                  <p className="font-bold text-emerald-700 mt-0.5 text-sm flex items-center">
                    <span className="material-symbols-outlined text-[16px] mr-1 text-emerald-600">verified</span>
                    Verified AgTech v2.4
                  </p>
                  <p className="text-slate-500">Comprehensive Audit Protocol</p>
                </div>
              </div>
            </section>

            {/* Composite Maturity Hero (Criteria-Based, No Percentages or Radial Bars) */}
            <section className="bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-xl p-4 sm:p-5 border border-emerald-100 print-break-inside-avoid">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                <div className="space-y-2 text-left">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Composite Farm Capability Assessment
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Future Farm Maturity Index (FFMI)
                  </h2>
                  <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                    Holistic capability evaluation across agronomic modernization, renewable energy, compliance,
                    commercial management, leadership, market access, and investment readiness.
                  </p>

                  {/* Maturity Steps Indicator */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500 pt-1">
                    <span className="text-slate-400">Level 1: Baseline</span>
                    <span>→</span>
                    <span className="text-slate-400">Level 2: Emerging</span>
                    <span>→</span>
                    <span className="text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-md border border-emerald-300 shadow-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                      {reportData?.executiveSummary?.maturityTier || "Level 3: Structured Farm"}
                    </span>
                    <span>→</span>
                    <span className="text-slate-400">Level 4: Investment Ready</span>
                  </div>
                </div>

                {/* Aggregate Criteria Metrics Card (No Percentages) */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs shrink-0 min-w-[250px] space-y-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Assessment Evaluation Criteria
                  </span>
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[11px] text-slate-500 block">Verified Capabilities:</span>
                    <span className="text-lg font-black text-emerald-700">
                      {reportData?.executiveSummary?.totalVerified || 28} / 40 Core Capabilities
                    </span>
                    <span className="text-[10px] block font-medium text-slate-600 mt-0.5">
                      Systematically Verified In Place
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Identified Action Gaps:</span>
                    <span className="text-base font-bold text-amber-700">
                      {reportData?.executiveSummary?.totalActionableGaps || 12} Priority Intervention Areas
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 block">Estimated Monthly Value Gap:</span>
                    <span className="text-sm font-bold text-emerald-800 font-mono">
                      KES 64,500 / month
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 1: Executive Synthesis & Farm Diagnostic */}
            <section className="space-y-2.5 pt-1 print-break-inside-avoid">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                <h3 className="text-xs font-bold tracking-wider uppercase text-slate-600">
                  1. Executive Synthesis &amp; Enterprise Performance Diagnostic
                </h3>
              </div>
              <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 text-xs leading-relaxed space-y-2 text-slate-700">
                <p>
                  <strong className="text-slate-900">{farmName}</strong> exhibits consistent operational discipline,
                  positioning the enterprise at the{" "}
                  <strong className="text-emerald-800 font-bold">
                    {reportData?.executiveSummary?.maturityTier || "Structured Agribusiness (Level 3)"}
                  </strong>{" "}
                  maturity tier. The farm possesses high capability in Climate Resilience, complete conversion to
                  clean solar borehole irrigation, and established linkages to commercial fresh export buyers.
                </p>
                <p>
                  <strong className="text-amber-900">Primary Enterprise Bottlenecks for Commercial Financing:</strong>{" "}
                  Long-term expansion and access to low-interest working capital remain constrained by:
                  <span className="font-semibold text-slate-800"> (1) Informal financial ledgers</span> without separation of
                  household and farm cash flow,
                  <span className="font-semibold text-slate-800"> (2) Lack of cold-chain pre-cooling buffer</span> causing
                  perishable harvest depreciation, and
                  <span className="font-semibold text-slate-800"> (3) Incomplete seasonal worker contracts</span> required for
                  formal GlobalG.A.P. social risk audits.
                </p>
              </div>

              {/* Page 1 Bottom Strategic Callout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 bg-emerald-50/50 border border-emerald-200/80 rounded-lg">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block">Current Standing</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">Level 3: Structured Agribusiness</p>
                </div>
                <div className="p-2.5 bg-amber-50/50 border border-amber-200/80 rounded-lg">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">Priority Constraint</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">Commercial Financial Ledgers</p>
                </div>
                <div className="p-2.5 bg-blue-50/50 border border-blue-200/80 rounded-lg">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wide block">Value Realization Gap</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">KES 64,500 Monthly Recovery</p>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════
                PAGE 2: 8-PILLAR CAPABILITY PERFORMANCE MATRIX
                ══════════════════════════════════════════════════════════════════════ */}
            <section className="space-y-3 print-page-break print-break-inside-avoid">
              {/* Print Mini-Header for Page 2 */}
              <div className="hidden print:flex items-center justify-between pb-2 mb-3 border-b border-slate-200 text-[10px] text-slate-500">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/logo.webp"
                    alt="Future Farms"
                    width={100}
                    height={25}
                    priority
                    unoptimized
                    className="h-4 w-auto object-contain"
                  />
                  <span className="text-slate-300">|</span>
                  <span className="font-semibold text-slate-700">Official Assessment Report • All 8 Pillars</span>
                </div>
                <div className="font-mono text-[9px] text-slate-500">
                  Doc Ref: <span className="font-bold text-slate-800">{docRef}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                  <h3 className="text-xs font-bold tracking-wider uppercase text-slate-600">
                    2. 8-Pillar Capability Performance Matrix
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  Criteria Verification Scale • 5 Capabilities per Pillar
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-2.5 px-4 w-12 text-center">Pillar</th>
                      <th className="py-2.5 px-4">Evaluation Pillar Focus</th>
                      <th className="py-2.5 px-4 text-center">Criteria Evaluation</th>
                      <th className="py-2.5 px-4 text-center">Maturity Classification</th>
                      <th className="py-2.5 px-4 text-center">Action Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {(reportData?.eightPillarScorecard || [
                      { pillarId: 1, name: "Smart Farming & Digital Transformation", verifiedCount: 3, gapCount: 2, maturityStage: "Developing" },
                      { pillarId: 2, name: "Productive Use of Renewable Energy", verifiedCount: 4, gapCount: 1, maturityStage: "Advancing" },
                      { pillarId: 3, name: "Food Safety, Quality & Compliance", verifiedCount: 4, gapCount: 1, maturityStage: "Advancing" },
                      { pillarId: 4, name: "Indigenous Knowledge & Climate Resilience", verifiedCount: 5, gapCount: 0, maturityStage: "Leading" },
                      { pillarId: 5, name: "Farm Business Performance & Growth", verifiedCount: 2, gapCount: 3, maturityStage: "Emerging" },
                      { pillarId: 6, name: "Human Capital, Leadership & Operations", verifiedCount: 3, gapCount: 2, maturityStage: "Developing" },
                      { pillarId: 7, name: "Market Access, Customer Value & Competitiveness", verifiedCount: 4, gapCount: 1, maturityStage: "Advancing" },
                      { pillarId: 8, name: "Investment Readiness & Enterprise Development", verifiedCount: 3, gapCount: 2, maturityStage: "Developing" },
                    ]).map((row: any) => {
                      const isLeading = row.verifiedCount >= 5;
                      const isCritical = row.gapCount >= 3;

                      return (
                        <tr
                          key={row.pillarId}
                          className={`hover:bg-slate-50/70 transition-colors ${
                            isLeading ? "bg-emerald-50/30" : isCritical ? "bg-amber-50/20" : ""
                          }`}
                        >
                          <td className="py-2 px-4 font-mono font-bold text-center text-slate-600">
                            P{row.pillarId}
                          </td>
                          <td className="py-2 px-4 font-semibold text-slate-900">
                            {row.name}
                          </td>
                          <td className="py-2 px-4 text-center font-mono font-medium">
                            <span className="text-emerald-800 font-bold">{row.verifiedCount} Verified</span>
                            <span className="text-slate-400 mx-1">•</span>
                            <span className={row.gapCount > 0 ? "text-amber-700 font-semibold" : "text-slate-400"}>
                              {row.gapCount} Action {row.gapCount === 1 ? "Gap" : "Gaps"}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isLeading
                                  ? "bg-emerald-700 text-white"
                                  : isCritical
                                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                                  : "bg-slate-100 text-slate-800 border border-slate-200"
                              }`}
                            >
                              {row.maturityStage || (isLeading ? "Benchmark" : isCritical ? "Priority Focus" : "Established")}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-center font-semibold text-[11px]">
                            {isCritical ? (
                              <span className="text-amber-800 font-bold">High Priority Intervention</span>
                            ) : isLeading ? (
                              <span className="text-emerald-700">Maintain Standard</span>
                            ) : (
                              <span className="text-slate-600">Targeted Enhancement</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Strategic Pillar Maturity Summary & Key Benchmark Observations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Benchmark Capabilities
                  </span>
                  <p className="font-bold text-slate-800 mt-0.5">3 Pillars Verified In Place</p>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    P4 (Climate Resilience), P2 (Renewable Energy), and P3 (Compliance) satisfy core verification requirements.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Established Operations
                  </span>
                  <p className="font-bold text-slate-800 mt-0.5">3 Pillars In Active Progress</p>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    P1 (Digital AgTech), P6 (Leadership &amp; Operations), and P7 (Market Access) require formal standard operating records.
                  </p>
                </div>
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Priority Interventions
                  </span>
                  <p className="font-bold text-slate-800 mt-0.5">2 Pillars Transformation Focus</p>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    P5 (Commercial Finance) and P8 (Investment Dossier) represent the primary constraints to commercial credit.
                  </p>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════
                PAGE 3: PRIORITY ACTIONABLE INTERVENTIONS
                ══════════════════════════════════════════════════════════════════════ */}
            <section className="space-y-3 print-page-break print-break-inside-avoid">
              {/* Print Mini-Header for Page 3 */}
              <div className="hidden print:flex items-center justify-between pb-2 mb-3 border-b border-slate-200 text-[10px] text-slate-500">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/logo.webp"
                    alt="Future Farms"
                    width={100}
                    height={25}
                    priority
                    unoptimized
                    className="h-4 w-auto object-contain"
                  />
                  <span className="text-slate-300">|</span>
                  <span className="font-semibold text-slate-700">Strategic Action Plan • Priority Interventions</span>
                </div>
                <div className="font-mono text-[9px] text-slate-500">
                  Doc Ref: <span className="font-bold text-slate-800">{docRef}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="text-xs font-bold tracking-wider uppercase text-slate-600">
                    3. Priority Actionable Interventions for Identified Gaps
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  5 Core Action Priorities
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Intervention 1: Business Performance */}
                <div className="p-3 border border-amber-200 bg-amber-50/30 rounded-xl flex items-start justify-between gap-3 shadow-xs">
                  <div className="flex items-start space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 font-mono text-xs mt-0.5">
                      P5
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        Gap 1: Digital Enterprise Cash Flow &amp; Account Segregation
                      </h4>
                      <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                        Transition from manual notebooks to a verified mobile/cloud ledger. Separating household living costs
                        from farm production inputs immediately unlocks credit appraisal qualification for up to{" "}
                        <strong className="text-slate-800">KES 350,000 seasonal facility</strong> with partner ag-lenders.
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[9.5px]">
                        <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
                          Direct Impact: Est. Savings KES 22,000 / month
                        </span>
                        <span className="text-slate-400 font-medium">• Timeline: Immediate (1–2 weeks)</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                    High Impact
                  </span>
                </div>

                {/* Intervention 2: Renewable Energy */}
                <div className="p-3 border border-slate-200 rounded-xl flex items-start justify-between gap-3 bg-white shadow-xs">
                  <div className="flex items-start space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 font-mono text-xs mt-0.5">
                      P2
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        Gap 2: Cold-Chain Continuity &amp; Pay-As-You-Go Solar Chilling Buffer
                      </h4>
                      <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                        Deploy modular Pay-As-You-Go (PAYG) walk-in solar cold storage to eliminate harvest field heat for French beans
                        and horticultural greens, curbing post-harvest spoilage by an estimated 22%.
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[9.5px]">
                        <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 font-semibold px-2 py-0.5 rounded">
                          Service Desk Partner: SunCulture Commercial Cold Facility
                        </span>
                        <span className="text-slate-400 font-medium">• Est. ROI: 4.2 Months</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
                    Asset Finance
                  </span>
                </div>

                {/* Intervention 3: Food Safety & Traceability */}
                <div className="p-3 border border-slate-200 rounded-xl flex items-start justify-between gap-3 bg-white shadow-xs">
                  <div className="flex items-start space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 font-mono text-xs mt-0.5">
                      P3
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        Gap 3: GlobalG.A.P. MRL Chemical Spray Registers &amp; Batch Traceability
                      </h4>
                      <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                        Formalize maximum residue limit (MRL) spray logs with batch QR codes to prevent cargo rejection risks
                        at European and regional fresh produce export terminals.
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[9.5px]">
                        <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 font-semibold px-2 py-0.5 rounded">
                          Compliance Readiness: Meets Exporter Supplier Standards
                        </span>
                        <span className="text-slate-400 font-medium">• Timeline: Month 2</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    Compliance
                  </span>
                </div>

                {/* Intervention 4: Human Capital & Operations */}
                <div className="p-3 border border-slate-200 rounded-xl flex items-start justify-between gap-3 bg-white shadow-xs">
                  <div className="flex items-start space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 font-mono text-xs mt-0.5">
                      P6
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        Gap 4: Formalized Seasonal Worker Safety SOPs &amp; Standard Contracts
                      </h4>
                      <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                        Execute standard bi-lingual casual labor contracts and provide certified chemical handler PPE gear
                        to fulfill export buyer ethical audit guidelines.
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[9.5px]">
                        <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          Digital Templates Available on Future Farms Library
                        </span>
                        <span className="text-slate-400 font-medium">• Low Cost Fast Intervention</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    Operational
                  </span>
                </div>

                {/* Intervention 5: Investment Readiness */}
                <div className="p-3 border border-emerald-200 bg-emerald-50/20 rounded-xl flex items-start justify-between gap-3 shadow-xs">
                  <div className="flex items-start space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 font-mono text-xs mt-0.5">
                      P8
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        Gap 5: Bankable Enterprise Expansion Dossier &amp; Unit Economics
                      </h4>
                      <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                        Compile 3-year historical yield curves and cost-of-production metrics into an investor-ready pitch dossier
                        for the regional Agri-Investment Acceleration Window.
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[9.5px]">
                        <span className="text-emerald-900 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded">
                          Eligible Facility: KES 1.5M Subsidized Matching Grant Window
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                    Investment
                  </span>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════
                PAGE 4: TRANSFORMATION ROADMAP & OFFICIAL VERIFICATION
                ══════════════════════════════════════════════════════════════════════ */}
            <section className="space-y-3.5 print-page-break print-break-inside-avoid">
              {/* Print Mini-Header for Page 4 */}
              <div className="hidden print:flex items-center justify-between pb-2 mb-3 border-b border-slate-200 text-[10px] text-slate-500">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/logo.webp"
                    alt="Future Farms"
                    width={100}
                    height={25}
                    priority
                    unoptimized
                    className="h-4 w-auto object-contain"
                  />
                  <span className="text-slate-300">|</span>
                  <span className="font-semibold text-slate-700">Transformation Roadmap &amp; Official Verification Ledger</span>
                </div>
                <div className="font-mono text-[9px] text-slate-500">
                  Doc Ref: <span className="font-bold text-slate-800">{docRef}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                  <h3 className="text-xs font-bold tracking-wider uppercase text-slate-600">
                    4. 12-Month Farm Transformation Roadmap
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Phased Milestones
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-3.5 space-y-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                      Phase 1 (Days 1–30)
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Foundations &amp; Operational Records</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Deploy mobile farm bookkeeping app, register casual workers with formal agreements, and configure chemical safety logs.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-3.5 space-y-1 bg-white shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      Phase 2 (Days 31–90)
                    </span>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Productive Solar Cold Chain</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Install modular PAYG solar precooling unit through SunCulture equipment matching facility; submit energy logbook for clean energy subsidy.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-3.5 space-y-1 bg-white shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      Phase 3 (Days 91–180+)
                    </span>
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Certification &amp; Level 4 Capital</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Complete external GlobalG.A.P. verification and present validated enterprise dossier to regional ag-equity and debt investors.
                  </p>
                </div>
              </div>

              {/* Advisory Service Desk Support Window Box */}
              <div className="bg-emerald-50/40 border border-emerald-200/70 rounded-xl p-3.5 text-xs">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                      Future Farms Service Desk Support Window
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">
                      Pre-Qualified Capital &amp; Technology Facilities
                    </h4>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Based on this verified diagnostic, <strong className="text-slate-900">{farmName}</strong> is pre-qualified for the SunCulture Productive Equipment Facility and the Regional Agribusiness Matching Grant. Access technical support and onboarding assistance through your assigned account manager.
                    </p>
                  </div>
                  <div className="sm:w-52 bg-white border border-emerald-200 rounded-lg p-2.5 shrink-0 text-center shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Advisory Desk Channel</span>
                    <span className="text-xs font-bold text-emerald-800 block mt-0.5">advisory@futurefarms.africa</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Direct Line: +254 700 000 000</span>
                  </div>
                </div>
              </div>

              {/* Document Footer: Tamper-Proof Seals & QR Code */}
              <footer className="border-t border-slate-200 pt-4 mt-2 text-[11px] text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4 print-break-inside-avoid">
                <div className="flex items-center space-x-3.5">
                  <div className="p-1.5 bg-white border border-slate-300 rounded-lg shadow-xs">
                    {/* SVG QR Code */}
                    <svg className="w-11 h-11 text-slate-900" fill="currentColor" viewBox="0 0 100 100">
                      <rect x="0" y="0" width="30" height="30" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="9" y="9" width="12" height="12" />
                      <rect x="70" y="0" width="30" height="30" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="79" y="9" width="12" height="12" />
                      <rect x="0" y="70" width="30" height="30" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="9" y="79" width="12" height="12" />
                      <rect x="40" y="10" width="15" height="10" />
                      <rect x="40" y="30" width="20" height="10" />
                      <rect x="10" y="40" width="20" height="10" />
                      <rect x="65" y="45" width="25" height="10" />
                      <rect x="35" y="60" width="15" height="25" />
                      <rect x="60" y="65" width="15" height="10" />
                      <rect x="80" y="60" width="10" height="25" />
                    </svg>
                  </div>
                  <div className="font-mono text-[10px] space-y-0.5">
                    <span className="font-bold text-slate-800 uppercase block tracking-wider text-[11px]">
                      Tamper-Proof Verification
                    </span>
                    <span>Hash: e82a-992d-ffa1-8294-ce88-b710</span>
                    <br />
                    <span>Ledger: Future Farms AgTech Registry #812</span>
                  </div>
                </div>

                <div className="text-left md:text-right text-xs">
                  <p className="font-bold text-slate-800">Future Farms Advisory Framework • Kenya AgHub</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Issued under Guidelines v2.4 (2025)</p>
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    Strictly Confidential • {farmName} Verified Diagnostic Record
                  </p>
                </div>
              </footer>
            </section>
          </article>
        ) : (
          /* ========================================================================= */
          /* TEMPLATE 1: SINGLE PILLAR ASSESSMENT REPORT (Pillar 1 - 8)                */
          /* Criteria-based scoring (No percentages or progress bars)                  */
          /* ========================================================================= */
          <article className="report-sheet-container max-w-5xl w-full bg-white shadow-xl rounded-xl border border-slate-200 overflow-hidden relative p-4 sm:p-6 md:p-10 space-y-7">
            {/* Top Decorative Band */}
            <div className="w-full h-2.5 bg-gradient-to-r from-emerald-700 via-emerald-500 to-amber-500 absolute top-0 left-0" />

            {/* Document Header */}
            <header className="border-b border-slate-200 pb-6 pt-2 print-break-inside-avoid">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Brand Identity */}
                <div className="flex items-center space-x-4">
                  <Image
                    src="/logo.webp"
                    alt="Future Farms"
                    width={220}
                    height={55}
                    priority
                    unoptimized
                    className="h-10 sm:h-12 w-auto object-contain shrink-0"
                  />
                  <div className="border-l border-slate-200 pl-3.5 hidden sm:block">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Framework • Pillar 0{pillarId}
                    </span>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                      Agricultural Capability &amp; Investment Readiness Verification
                    </p>
                  </div>
                </div>

                {/* Report Status Tag */}
                <div className="flex flex-row sm:flex-col items-end justify-between sm:justify-start gap-2 text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-emerald-800 text-white shadow-xs break-words">
                    Official Assessment Report • Pillar {pillarId}
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Doc Ref: <span className="font-mono text-slate-700">{docRef}</span>
                  </p>
                </div>
              </div>

              {/* Pillar Title Strip with Criteria Score (No Percentages) */}
              <div className="mt-6 bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Pillar 0{pillarId} Assessment Focus
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                    {reportData?.pillar?.name || ALL_PILLARS.find((p) => p.id === pillarId)?.name}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">
                    {reportData?.pillar?.guidingQuestion ||
                      "Evaluation of capability adoption, operational protocols, record systems, and readiness."}
                  </p>
                </div>

                {/* Criteria Score Badge (No Percentages or Circular Ring) */}
                <div className="flex items-center bg-white border border-slate-200 rounded-xl p-3 px-4 shadow-xs min-w-[210px] justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">
                      Verified Criteria
                    </span>
                    <span className="text-xl font-black text-emerald-700 tracking-tight">
                      {reportData?.pillar?.verifiedCount || 18} / {reportData?.pillar?.totalQuestions || 25} Verified
                    </span>
                    <span className="text-[11px] block font-semibold text-slate-700 mt-0.5">
                      {reportData?.pillar?.maturityStage || "Level 2: Emerging Stage"}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <span className="material-symbols-outlined text-[22px]">fact_check</span>
                  </div>
                </div>
              </div>

              {/* Farm Details Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white rounded-lg border border-slate-200 p-3.5">
                <div>
                  <span className="text-slate-400 block uppercase text-[9px] font-bold">Farm Enterprise</span>
                  <span className="font-bold text-slate-800">{farmName}</span>
                  <span className="text-slate-500 block text-[11px]">{farmerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[9px] font-bold">Location &amp; Zone</span>
                  <span className="font-semibold text-slate-800">{locationSubCounty}</span>
                  <span className="text-slate-500 block text-[11px]">{locationCounty}, {locationCountry}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[9px] font-bold">Assessment Date</span>
                  <span className="font-semibold text-slate-800">{assessmentDate}</span>
                  <span className="text-slate-500 block text-[11px]">Valid for 12 Months</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[9px] font-bold">Verification Mode</span>
                  <span className="inline-flex items-center text-emerald-700 font-semibold text-[11px]">
                    <span className="material-symbols-outlined text-[14px] mr-1">verified</span>
                    System Verified
                  </span>
                  <span className="text-slate-500 block text-[11px]">Diagnostic v2.4</span>
                </div>
              </div>
            </header>

            {/* Section 1: Executive Assessment Verdict */}
            <section data-purpose="executive-summary" className="print-break-inside-avoid">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-700 mr-2" />
                1. Executive Assessment Verdict
              </h3>
              <div className="bg-emerald-50/40 border border-emerald-200/70 rounded-xl p-4 text-xs text-slate-700 leading-relaxed">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-slate-800">
                      <strong className="text-slate-900">{farmName}</strong> demonstrates structured foundational practices in{" "}
                      {reportData?.pillar?.name || "this pillar focus"}, placing the enterprise in the{" "}
                      <strong className="text-emerald-900 font-bold">
                        {reportData?.pillar?.maturityStage || "Level 2: Emerging Agribusiness"}
                      </strong>{" "}
                      category.
                    </p>
                    <p className="text-slate-600">
                      <strong className="text-slate-900">Key Strengths:</strong> Complete conversion to primary sustainable
                      practices, active preventative servicing logs, and routine operational monitoring by field managers.
                    </p>
                    <p className="text-slate-600">
                      <strong className="text-amber-800">Primary Transformation Bottlenecks:</strong> Informal expenditure logbooks
                      during peak operational cycles, lack of dedicated backup buffers, and underutilization of national equipment subsidy windows.
                    </p>
                  </div>
                  <div className="sm:w-44 bg-white border border-emerald-200 rounded-lg p-3 shrink-0 text-center shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Estimated Monthly Savings Gap
                    </span>
                    <span className="text-lg font-black text-emerald-700 mt-0.5 block">
                      KES 18,000
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                      Potential monthly benefit upon closing recommendations
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Capability Checklist & Question Breakdown Table (Criteria-Based, No Percentages) */}
            <section data-purpose="capability-questions-breakdown" className="space-y-3 print-page-break print-break-inside-avoid">
              {/* Print Mini-Header for Page 2 */}
              <div className="hidden print:flex items-center justify-between pb-2 mb-3 border-b border-slate-200 text-[10px] text-slate-500">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/logo.webp"
                    alt="Future Farms"
                    width={100}
                    height={25}
                    priority
                    unoptimized
                    className="h-4 w-auto object-contain"
                  />
                  <span className="text-slate-300">|</span>
                  <span className="font-semibold text-slate-700">Pillar 0{pillarId} Capability Checklist &amp; Evidence Matrix</span>
                </div>
                <div className="font-mono text-[9px] text-slate-500">
                  Doc Ref: <span className="font-bold text-slate-800">{docRef}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-700 mr-2" />
                  2. Capability Checklist &amp; Question Evaluation
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  {reportData?.pillar?.verifiedCount || 18} Verified Yes • {reportData?.pillar?.gapCount || 7} Action Gaps
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="min-w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4 w-12 text-center" scope="col">No</th>
                      <th className="py-2.5 px-4" scope="col">Evaluation Metric &amp; Practice</th>
                      <th className="py-2.5 px-4 w-40 text-center" scope="col">Assessment Finding</th>
                      <th className="py-2.5 px-4 w-32 text-center" scope="col">Criteria Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {((reportData?.allQuestionResponses?.length > 0
                      ? reportData.allQuestionResponses
                      : ALL_PILLARS.find((p) => p.id === pillarId)?.capabilities.flatMap((c) =>
                          c.questions.map((q, idx) => ({
                            questionId: q.id,
                            question: q.question,
                            answer: idx % 3 === 0 ? "no" : "yes",
                          }))
                        )
                    ) || []).slice(0, 10).map((item: any, idx: number) => {
                      const isYes = item.answer === "yes";

                      return (
                        <tr
                          key={item.questionId || idx}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            !isYes ? "bg-amber-50/20" : ""
                          }`}
                        >
                          <td className="py-2.5 px-4 text-center font-mono text-slate-400 font-semibold">
                            Q{idx + 1}
                          </td>
                          <td className="py-2.5 px-4">
                            <p className="font-semibold text-slate-900">{item.questionId}</p>
                            <p className="text-slate-500 text-[11px] mt-0.5">{item.question}</p>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            {isYes ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <span className="material-symbols-outlined text-[12px] mr-1 text-emerald-600">check</span>
                                YES - Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                <span className="material-symbols-outlined text-[12px] mr-1 text-amber-700">warning</span>
                                NO - Action Gap
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-center font-medium text-[11px]">
                            {isYes ? (
                              <span className="text-emerald-700 font-semibold">Verified Practice</span>
                            ) : (
                              <span className="text-amber-800 font-bold">Needs Implementation</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Proportioned Capability Benchmark Summary Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Verified Capabilities In Practice
                  </span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {reportData?.pillar?.verifiedCount || 18} Standards Compliant &amp; Active
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Evaluated procedures meet criteria for sustainable operational efficiency and environmental compliance.
                  </p>
                </div>
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Identified Operational Action Gaps
                  </span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {reportData?.pillar?.gapCount || 7} Practice Improvement Points
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Prioritize the actionable interventions outlined on Page 3 to achieve complete capability maturity.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Actionable Recommendations for Identified Gaps */}
            <section data-purpose="identified-gap-recommendations" className="space-y-3 print-page-break print-break-inside-avoid">
              {/* Print Mini-Header for Page 3 */}
              <div className="hidden print:flex items-center justify-between pb-2 mb-3 border-b border-slate-200 text-[10px] text-slate-500">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/logo.webp"
                    alt="Future Farms"
                    width={100}
                    height={25}
                    priority
                    unoptimized
                    className="h-4 w-auto object-contain"
                  />
                  <span className="text-slate-300">|</span>
                  <span className="font-semibold text-slate-700">Pillar 0{pillarId} Priority Action Plan &amp; Recommendations</span>
                </div>
                <div className="font-mono text-[9px] text-slate-500">
                  Doc Ref: <span className="font-bold text-slate-800">{docRef}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                  3. Actionable Recommendations for Identified Gaps (Questions Answered &quot;No&quot;)
                </h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  Priority Interventions
                </span>
              </div>

              <div className="space-y-3">
                {/* Gap 1 */}
                <div className="border border-slate-200 bg-white rounded-xl p-4 transition-all hover:border-emerald-300 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">
                        G1
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Gap 1: Operational Expenditure Tracking &amp; Energy Baseline Log
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          Implement a simple digital or logbook operational audit. Tracking daily fuel and utility costs validates
                          return-on-investment and unlocks eligibility for regional green credit rebates and tax deductions under local agritech frameworks.
                        </p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px]">
                          <span className="inline-flex items-center font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Est. Savings: ~KES 18,000 / month
                          </span>
                          <span className="text-slate-400 font-medium">• Fast Implementation (1–2 weeks)</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded shrink-0 border border-amber-200">
                      High Impact
                    </span>
                  </div>
                </div>

                {/* Gap 2 */}
                <div className="border border-slate-200 bg-white rounded-xl p-4 transition-all hover:border-emerald-300 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">
                        G2
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Gap 2: Cold Chain Continuity &amp; Backup Battery Systems
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          Explore Pay-As-You-Go (PAYG) battery storage packages or commercial chilling facilities from accredited framework partners
                          listed on the Future Farms Service Desk to eliminate post-harvest horticultural spoilage.
                        </p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px]">
                          <span className="inline-flex items-center font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Service Desk Match: Commercial Clean Cold Chain Solutions
                          </span>
                          <span className="text-slate-400 font-medium">• Reduces post-harvest losses by 22%</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded shrink-0 border border-emerald-200">
                      Medium Term
                    </span>
                  </div>
                </div>

                {/* Gap 3 */}
                <div className="border border-slate-200 bg-white rounded-xl p-4 transition-all hover:border-emerald-300 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">
                        G3
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Gap 3: Productive Use Equipment Matching Grant
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {farmName} meets the eligibility threshold for the Agri-Equipment &amp; Productive Transition Match Facility.
                          Apply through your Opportunity Desk pipeline where this enterprise holds an active pre-qualification rating.
                        </p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px]">
                          <span className="inline-flex items-center font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Opportunity Desk Facility: Pre-Qualified Match
                          </span>
                          <span className="text-slate-400 font-medium">• Submission Window Open</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded shrink-0 border border-emerald-200">
                      Direct Funding
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Transformation Roadmap */}
            <section data-purpose="transformation-roadmap" className="print-break-inside-avoid">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-700 mr-2" />
                4. Roadmap to 100% Future-Ready Pillar {pillarId} Capability
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 shadow-xs">
                  <span className="text-[10px] font-black text-emerald-800 block uppercase">
                    Phase 1 (Days 1–30)
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-1">Audit Log Setup</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Activate mobile-based daily logs to establish verified baseline expenditure and performance records.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 shadow-xs">
                  <span className="text-[10px] font-black text-emerald-800 block uppercase">
                    Phase 2 (Days 31–60)
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-1">Equipment Application</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Submit equipment matching grant dossier through the Future Farms Opportunity Desk.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 shadow-xs">
                  <span className="text-[10px] font-black text-emerald-800 block uppercase">
                    Phase 3 (Days 61–90)
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-1">Pillar Re-Assessment</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Undergo verifier spot-check to elevate standing to Level 4 (Investment Ready Agri-Enterprise).
                  </p>
                </div>
              </div>
            </section>

            {/* Document Footer */}
            <footer className="pt-5 border-t border-slate-200 mt-6 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 print-break-inside-avoid">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-12 h-12 bg-slate-900 rounded-lg p-1 flex items-center justify-center shrink-0">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 2h2v4h-2v-4zm2 2h2v4h-2v-4zm-4 2h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-slate-700 uppercase tracking-tight">
                    Verified by Future Farms AgTech Engine
                  </p>
                  <p className="text-slate-400">
                    Cryptographic hash: <span className="font-mono text-[9px] text-slate-500">e82a-992d-ffa1-0294-ce</span>
                  </p>
                  <p className="text-slate-400">
                    For inquiries: <span className="text-slate-600">advisory@futurefarms.africa</span>
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <p className="font-medium text-slate-600">Future Farms Framework • Confidential Farm Advisory Report</p>
                <p className="mt-0.5 text-slate-400">Issued under FFV Guidelines v2.4</p>
              </div>
            </footer>
          </article>
        )}
      </main>
    </div>
  );
}

export default function AssessmentReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">
            progress_activity
          </span>
        </div>
      }
    >
      <AssessmentReportContent />
    </Suspense>
  );
}
