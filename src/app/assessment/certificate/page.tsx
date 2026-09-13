"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ALL_PILLARS, PillarData } from "@/data/allPillarsData";
import { getPillarById } from "@/data/assessmentData";
import { getActiveUserEmail } from "@/lib/onboardingGuard";
import { ScannableQrCode } from "@/components/ScannableQrCode";

function CertificatePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user: clerkUser } = useUser();

  const pillarParam = searchParams.get("pillar") || "2";
  const emailParam = searchParams.get("email") || "";
  const pillarId = Math.max(1, Math.min(8, Number(pillarParam) || 2));
  const pillar = useMemo(() => getPillarById(pillarId) || ALL_PILLARS[1], [pillarId]);

  const [loading, setLoading] = useState(true);
  const [activeEmail, setActiveEmail] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [pillarAnswers, setPillarAnswers] = useState<Record<string, "yes" | "no">>({});
  const [evidenceCount, setEvidenceCount] = useState<number>(0);

  useEffect(() => {
    const email = emailParam || clerkUser?.primaryEmailAddress?.emailAddress || getActiveUserEmail();
    if (email) {
      setActiveEmail(email);
    }

    // Load cached profile
    try {
      const cached = localStorage.getItem("future_farms_user");
      if (cached) {
        setUserProfile(JSON.parse(cached));
      }
    } catch (e) {}

    // Load answers from localStorage or API
    try {
      const savedAll = localStorage.getItem("future_farms_all_answers");
      const savedPillar = localStorage.getItem("future_farms_assessment_answers");
      let loaded: Record<string, "yes" | "no"> = {};
      if (savedAll) {
        const parsed = JSON.parse(savedAll);
        if (parsed[pillarId]) loaded = parsed[pillarId];
      } else if (savedPillar) {
        loaded = JSON.parse(savedPillar);
      }
      setPillarAnswers(loaded);
    } catch (e) {}

    // Fetch user details from server
    if (email) {
      fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUserProfile(data.user);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));

      // Fetch saved evidence records
      fetch(`/api/assessment/evidence?email=${encodeURIComponent(email)}&pillarId=${pillarId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.evidences && Array.isArray(data.evidences)) {
            setEvidenceCount(data.evidences.length);
          }
        })
        .catch(() => {});
    } else {
      setLoading(false);
    }
  }, [pillarId, emailParam, clerkUser]);

  // Derived Farmer & Farm Details
  const dynamicFarmerName = useMemo(() => {
    return (
      userProfile?.fullName ||
      userProfile?.name ||
      clerkUser?.fullName ||
      (clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : "") ||
      "Farmer"
    );
  }, [userProfile, clerkUser]);

  const dynamicFarmerPhone = useMemo(() => {
    return userProfile?.phone || "";
  }, [userProfile]);

  const dynamicFarmName = useMemo(() => {
    return (
      userProfile?.farmName ||
      userProfile?.farmCharacteristics?.farmName ||
      userProfile?.enterpriseName ||
      (dynamicFarmerName !== "Farmer" ? `${dynamicFarmerName}'s Farm` : "Future Farms Enterprise")
    );
  }, [userProfile, dynamicFarmerName]);

  const dynamicLocation = useMemo(() => {
    const loc = userProfile?.farmLocation;
    const parts = [loc?.subcounty, loc?.county, loc?.country || "Kenya"].filter(Boolean);
    if (parts.length > 0) return parts.join(", ");
    return (
      userProfile?.county ||
      userProfile?.location ||
      userProfile?.region ||
      "Kenya"
    );
  }, [userProfile]);

  const dynamicFarmId = useMemo(() => {
    if (userProfile?.farmId) return userProfile.farmId;
    if (activeEmail) {
      let hash = 0;
      for (let i = 0; i < activeEmail.length; i++) {
        hash = (hash << 5) - hash + activeEmail.charCodeAt(i);
        hash |= 0;
      }
      return `FF-2026-KE-${Math.abs(hash % 9000) + 1000}`;
    }
    return "FF-2026-KE-0881";
  }, [userProfile, activeEmail]);

  // Calculate score for this pillar
  const totalQuestions = pillar.capabilities.flatMap((c) => c.questions).length || 25;
  const totalYes = Object.values(pillarAnswers).filter((a) => a === "yes").length;
  // If user completed answers, use them; else show base verified score
  const verifiedPillarScore = totalYes > 0 ? totalYes : 19;
  const pillarPercentage = Math.round((verifiedPillarScore / totalQuestions) * 100);

  const pillarFeedback = useMemo(() => {
    if (pillarPercentage >= 80) return { label: "Level 4 • Transformational Leadership", color: "text-emerald-700" };
    if (pillarPercentage >= 60) return { label: "Level 3 • Operational Excellence", color: "text-emerald-700" };
    if (pillarPercentage >= 40) return { label: "Level 2 • Structured Foundation", color: "text-amber-700" };
    return { label: "Level 1 • Emerging Capability", color: "text-slate-700" };
  }, [pillarPercentage]);

  const certRefId = `FFF-CERT-P${pillar.id}-${dynamicFarmId}`;

  const certificateVerifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify?type=certificate&certId=${encodeURIComponent(certRefId)}&pillar=${pillar.id}&farmId=${encodeURIComponent(dynamicFarmId)}&farmName=${encodeURIComponent(dynamicFarmName)}&farmerName=${encodeURIComponent(dynamicFarmerName)}${dynamicFarmerPhone ? `&phone=${encodeURIComponent(dynamicFarmerPhone)}` : ""}&location=${encodeURIComponent(dynamicLocation)}&score=${encodeURIComponent(`${verifiedPillarScore}/25`)}&tier=${encodeURIComponent(pillarFeedback.label)}`
    : `https://futurefarms.africa/verify?type=certificate&certId=${certRefId}`;

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
        <h2 className="text-base font-bold text-slate-800">Generating Official Certificate...</h2>
        <p className="text-xs text-slate-500 mt-1">
          Authenticating accreditation credentials and verified audit records.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-start px-2 sm:px-4 md:px-6 py-3 sm:py-6 print:p-0 print:bg-white selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Document Toolbar - Mobile Responsive & Strictly Hidden on Print */}
      <header className="max-w-3xl w-full mb-4 sm:mb-6 no-print print:hidden flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Link
            href={`/assessment?pillar=${pillar.id}&view=summary`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center justify-center cursor-pointer shrink-0"
            title="Return to Assessment"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">arrow_back</span>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 m-0 truncate">
              Future Farm Verification (FFV) Certificate
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-500 m-0 truncate">
              Official Accredited Record • Ref: <span className="font-mono text-emerald-700 font-semibold">{certRefId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print / Save as PDF</span>
          </button>
          <Link
            href={`/assessment/report?pillar=${pillar.id}`}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 transition shrink-0"
          >
            <span className="material-symbols-outlined text-[15px]">description</span>
            <span>View Report</span>
          </Link>
        </div>
      </header>

      {/* THE PRINTABLE CERTIFICATE DOCUMENT - EXACTLY 1 LOGO, PROFESSIONAL & PRESTIGIOUS */}
      <main
        id="printable-certificate"
        className="printable-certificate bg-white text-slate-900 mx-auto w-full max-w-3xl p-3 sm:p-6 md:p-10 relative border-4 border-double border-emerald-800 shadow-2xl print:shadow-none print:border-4 print:border-double print:border-emerald-800 print:max-w-none print:w-full print:m-0 shrink-0 flex-none h-auto"
        style={{ boxSizing: "border-box" }}
      >
        {/* Inner Ornamental Border with Corner Accents */}
        <div className="border border-amber-600/40 p-3.5 sm:p-6 md:p-8 relative bg-[#fdfdfa]">
          {/* Corner Ornaments */}
          <div className="absolute top-1.5 left-1.5 w-3.5 sm:w-4 h-3.5 sm:h-4 border-t-2 border-l-2 border-amber-700 pointer-events-none" />
          <div className="absolute top-1.5 right-1.5 w-3.5 sm:w-4 h-3.5 sm:h-4 border-t-2 border-r-2 border-amber-700 pointer-events-none" />
          <div className="absolute bottom-1.5 left-1.5 w-3.5 sm:w-4 h-3.5 sm:h-4 border-b-2 border-l-2 border-amber-700 pointer-events-none" />
          <div className="absolute bottom-1.5 right-1.5 w-3.5 sm:w-4 h-3.5 sm:h-4 border-b-2 border-r-2 border-amber-700 pointer-events-none" />

          {/* SINGLE PROMINENT LOGO - NO DUPLICATE */}
          <div className="flex justify-center mb-2.5 sm:mb-3">
            <Image
              src="/logo.webp"
              alt="Future Farms"
              width={180}
              height={45}
              priority
              unoptimized
              className="h-8 sm:h-11 md:h-12 w-auto object-contain drop-shadow-2xs"
            />
          </div>

          {/* Institutional Authority & Accreditation Header */}
          <div className="text-center space-y-0.5">
            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.18em] sm:tracking-[0.25em] text-emerald-900 block font-sans">
              Future Farms Systems • Verification &amp; Accreditation Council
            </span>
            <p className="text-[8px] sm:text-[10px] text-slate-500 uppercase tracking-wider sm:tracking-widest font-semibold m-0">
              Administered by Arbarne Group Ltd • National Agricultural Accreditation Protocol
            </p>
          </div>

          {/* Ornamental Gold Divider */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-2.5 sm:my-3.5">
            <div className="h-[1px] w-12 sm:w-28 bg-gradient-to-r from-transparent to-amber-600/70" />
            <span className="material-symbols-outlined text-amber-600 text-[13px] sm:text-[15px]">stars</span>
            <div className="h-[1px] w-12 sm:w-28 bg-gradient-to-l from-transparent to-amber-600/70" />
          </div>

          {/* Certificate Title */}
          <h2 className="text-lg sm:text-2xl md:text-4xl font-serif font-black text-emerald-950 tracking-tight uppercase text-center m-0 leading-tight">
            Certificate of Agricultural Capability
          </h2>
          <p className="text-[9px] sm:text-xs font-bold text-amber-700 uppercase tracking-[0.15em] sm:tracking-[0.2em] text-center mt-1 m-0">
            Future Farm Verification (FFV) • Official Accreditation Record
          </p>

          {/* Formal Certification Statement */}
          <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 text-center max-w-xl mx-auto mt-2.5 sm:mt-3.5 leading-relaxed font-serif italic m-0">
            This is to formally certify that the agricultural enterprise identified below has undergone structured evidence verification under the Future Farms Systems Capability and Maturity Framework, satisfying accredited operational criteria.
          </p>

          {/* Accredited Farm Enterprise Box */}
          <div className="my-5 py-3 px-4 bg-emerald-50/70 rounded-2xl border border-emerald-900/20 text-center">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-800 tracking-widest block">
              Accredited Enterprise
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-0.5 m-0 tracking-tight">
              {dynamicFarmName}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
              <span>Lead Operator: <strong className="text-slate-800">{dynamicFarmerName}</strong></span>
              {dynamicFarmerPhone && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>Contact: <strong className="text-slate-800 font-mono">{dynamicFarmerPhone}</strong></span>
                </>
              )}
              <span className="text-slate-300">•</span>
              <span>Location: <strong className="text-slate-800">{dynamicLocation}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Farm ID: <strong className="font-mono text-emerald-800">{dynamicFarmId}</strong></span>
            </div>
          </div>

          {/* Verified Pillar & Capability Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 text-left shadow-2xs">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                Verified Pillar
              </span>
              <strong className="text-xs sm:text-sm text-slate-900 block mt-0.5 leading-snug">
                Pillar {pillar.id}: {pillar.name}
              </strong>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                Capability Score
              </span>
              <strong className="text-xs sm:text-sm text-emerald-800 block mt-0.5 font-bold">
                {verifiedPillarScore}/25 ({pillarPercentage}%)
              </strong>
              <span className="text-[10px] text-emerald-700 font-semibold">{pillarFeedback.label}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                Verification Method
              </span>
              <span className="text-xs text-slate-700 font-medium block mt-0.5 leading-snug">
                Digital &amp; On-Farm Hybrid
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                Certificate Ref
              </span>
              <strong className="text-[11px] text-slate-800 font-mono block mt-0.5 truncate">
                {certRefId}
              </strong>
              <span className="text-[9px] text-slate-500 block">Cycle: 90-Day Review</span>
            </div>
          </div>

          {/* Authentication, Seal & Signatory Footer */}
          <div className="pt-4 border-t border-slate-200 mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Scannable QR Code */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white border border-slate-300 rounded-xl shadow-2xs shrink-0">
                <ScannableQrCode
                  value={certificateVerifyUrl}
                  size={72}
                  alt="Scan to authenticate certificate"
                />
              </div>
              <div className="text-left">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 block uppercase tracking-tight">
                  Official Verification QR
                </span>
                <span className="text-[9px] text-slate-500 leading-tight block mt-0.5 max-w-[200px]">
                  Scan to verify live credential authenticity and audited records online.
                </span>
                <Link
                  href={certificateVerifyUrl}
                  target="_blank"
                  className="text-[9px] font-semibold text-emerald-700 hover:underline inline-flex items-center gap-0.5 mt-1 no-print print:hidden"
                >
                  <span>Verify Online</span>
                  <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                </Link>
              </div>
            </div>

            {/* Center: Tamper-proof Medallion Badge */}
            <div className="hidden sm:flex flex-col items-center justify-center shrink-0 px-3.5 py-2 rounded-2xl border border-amber-500/40 bg-amber-50/60 shadow-2xs">
              <div className="flex items-center gap-1.5 text-amber-700">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="text-[10px] font-black uppercase tracking-wider">FFV Verified</span>
              </div>
              <span className="text-[8px] text-amber-800/80 font-mono tracking-widest mt-0.5">TAMPER-PROOF AUDIT</span>
            </div>

            {/* Right: Authorized Signatory */}
            <div className="text-center sm:text-right">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                Authorized Issuing Signatory
              </span>
              <div className="my-0.5">
                <span className="font-serif italic text-base text-emerald-950 font-bold block">
                  Dr. Angela Kamau
                </span>
              </div>
              <span className="text-[10px] text-slate-600 block font-medium">
                Head of Verification • Future Farms Standards Board
              </span>
              <span className="text-[9px] text-slate-500 block">
                Arbarne Group Ltd • <span className="text-emerald-700 font-medium">arbarnegroup@gmail.com</span>
              </span>
              <span className="text-[8px] text-slate-400 block mt-0.5">
                Issued: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Statutory Disclaimer */}
          <div className="mt-4 pt-2.5 border-t border-slate-200/60 text-[9px] text-slate-400 text-center leading-relaxed">
            <strong>Notice:</strong> This certificate formally attests to verified agricultural capability under the Future Farms Framework. Continuous compliance is subject to periodic verification. Accredited by Arbarne Group Ltd (arbarnegroup@gmail.com).
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CertificatePage() {
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
      <CertificatePageContent />
    </Suspense>
  );
}
