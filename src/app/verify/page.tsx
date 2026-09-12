"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ALL_PILLARS } from "@/data/allPillarsData";

function VerifyContent() {
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "certificate";
  const certId = searchParams.get("certId") || searchParams.get("id") || "";
  const reportId = searchParams.get("reportId") || "";
  const pillarParam = searchParams.get("pillar") || "";
  const farmId = searchParams.get("farmId") || "FFF-KE-PROD";
  const farmName = searchParams.get("farmName") || searchParams.get("farm") || "Verified Agricultural Enterprise";
  const farmerName = searchParams.get("farmerName") || searchParams.get("farmer") || "Farm Manager";
  const location = searchParams.get("location") || "Kenya";
  const scoreParam = searchParams.get("score") || "";
  const tierParam = searchParams.get("tier") || "";
  const issueDate = searchParams.get("date") || new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const pillarId = Number(pillarParam) || null;
  const pillar = pillarId ? ALL_PILLARS.find((p) => p.id === pillarId) : null;
  const isCertificate = type === "certificate";
  const docReference = isCertificate
    ? certId || `FFF-CERT-${pillarId ? `P${pillarId}` : "CORE"}-${farmId}`
    : reportId || `FFF-REP-${farmId}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-between p-4 sm:p-6 md:p-10 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <header className="max-w-2xl w-full flex items-center justify-between pb-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.webp"
            alt="Future Farms"
            width={160}
            height={40}
            priority
            unoptimized
            className="h-9 w-auto object-contain"
          />
        </Link>
        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          Official Verification Portal
        </span>
      </header>

      {/* Main Verification Card */}
      <main className="max-w-2xl w-full my-8 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-200">
        {/* Verification Status Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
                <span className="material-symbols-outlined text-3xl font-bold">verified</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 block">
                  Document Authentication Successful
                </span>
                <h1 className="text-xl sm:text-2xl font-black m-0 mt-0.5 tracking-tight">
                  ACTIVE &amp; ACCREDITED
                </h1>
              </div>
            </div>

            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 text-xs font-mono font-bold shrink-0 self-start sm:self-auto">
              ID: {docReference}
            </span>
          </div>

          <p className="text-xs text-emerald-100/90 mt-4 m-0 leading-relaxed max-w-xl">
            This certifies that the digital credential identified below has been formally validated by the{" "}
            <strong>Future Farms Verification Board (Arbarne Group)</strong>.
          </p>
        </div>

        {/* Credential Data Summary */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-700">
          {/* Farm Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Farm Enterprise
              </span>
              <strong className="text-sm text-slate-900 block mt-0.5">{farmName}</strong>
              <span className="text-slate-500 text-[11px] block mt-0.5">
                Owner / Manager: <strong>{farmerName}</strong>
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Future Farm ID &amp; Location
              </span>
              <strong className="text-sm font-mono text-emerald-700 block mt-0.5">{farmId}</strong>
              <span className="text-slate-500 text-[11px] block mt-0.5">
                Location: <strong>{location}</strong>
              </span>
            </div>
          </div>

          {/* Scope & Assessment Metrics */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Credential Type
                </span>
                <h3 className="text-sm font-bold text-slate-900 m-0 mt-0.5">
                  {isCertificate
                    ? "Future Farm Verification (FFV) Certificate"
                    : "Assessment Diagnostic & Transformation Report"}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                {pillar ? `Pillar 0${pillar.id}` : "Core Assessment"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pillar Name</span>
                <span className="font-semibold text-slate-900 block mt-0.5">
                  {pillar?.name || "System Diagnostic"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Score</span>
                <span className="font-bold text-emerald-700 block mt-0.5">
                  {scoreParam ? `${scoreParam}` : isCertificate ? "Evidence Verified" : "Assessment Complete"}
                  {tierParam ? ` (${tierParam})` : ""}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Audit Standard</span>
                <span className="font-semibold text-slate-900 block mt-0.5">
                  FFF v2.4 Standard
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Issue Date</span>
                <span className="font-medium text-slate-800 block mt-0.5">{issueDate}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Validity Status</span>
                <span className="font-bold text-emerald-800 block mt-0.5">Valid (Active Cycle)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Reassessment Cycle</span>
                <span className="font-medium text-amber-800 block mt-0.5">90 Days</span>
              </div>
            </div>
          </div>

          {/* Verification Protocol & Evidence Basis */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-900 block tracking-wider">
              Verification Protocol &amp; Evidence Evidence
            </span>
            <p className="text-[11px] text-slate-600 m-0 leading-relaxed">
              This document reflects verified agricultural capabilities established through diagnostic survey data,
              digital records, practice demonstrations, and remote or on-farm verifications.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-emerald-800 font-semibold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                Digital Evidence Audited
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                Cryptographic Reference Hash
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                Accreditation Board Endorsement
              </span>
            </div>
          </div>

          {/* Issuing Authority & Official Contact */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Accredited Issuing Authority
              </span>
              <strong className="text-xs text-slate-900 block mt-0.5">Arbarne Group Ltd</strong>
              <span className="text-[11px] text-slate-500">Future Farms Verification &amp; Advisory Board</span>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Official Verification Inquiries
              </span>
              <a
                href="mailto:arbarnegroup@gmail.com"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline block mt-0.5"
              >
                arbarnegroup@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Verification Proof</span>
          </button>

          <Link
            href={`mailto:arbarnegroup@gmail.com?subject=Verification%20Inquiry%20${encodeURIComponent(docReference)}`}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            <span>Contact Verifier</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 pt-4">
        Future Farms Verification (FFV) • An Arbarne Group Agricultural Intelligence Platform • Contact:{" "}
        <a href="mailto:arbarnegroup@gmail.com" className="text-emerald-700 font-semibold hover:underline">
          arbarnegroup@gmail.com
        </a>
      </footer>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-600 space-y-4">
          <Image
            src="/logo.webp"
            alt="Future Farms"
            width={160}
            height={40}
            priority
            unoptimized
            className="h-10 w-auto object-contain"
          />
          <div className="flex items-center space-x-3 text-emerald-700">
            <span className="material-symbols-outlined text-3xl animate-spin">
              progress_activity
            </span>
            <span className="text-sm font-bold text-slate-800">
              Validating Accreditation Records with Arbarne Group Registry...
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Registry Desk: arbarnegroup@gmail.com
          </p>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
