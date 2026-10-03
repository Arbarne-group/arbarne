import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { appBaseUrl } from "@/lib/mailer";
import { ALL_PILLARS } from "@/data/allPillarsData";
import { getPillarScoringTier } from "@/data/pillarScoringTiers";
import { getCapabilityFeedbackText, getCapabilityTier } from "@/data/capabilityFeedback";
import TransformationReportPdf from "@/lib/transformationReportPdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const BANDS = [
  {
    range: "0–4",
    name: "Informal - Farm Business",
    tagline: "Building the Foundation",
    body: "Formal business systems, records, planning, and management practices are still limited. The priority is to establish the basic foundations of a farm business.",
    min: 0,
    max: 4,
  },
  {
    range: "5–9",
    name: "Emerging - Farm business",
    tagline: "Building the Business",
    body: "The farm is beginning to operate as a business, with some systems and commercial practices in place. The next step is to strengthen consistency, financial management, productivity, and market orientation.",
    min: 5,
    max: 9,
  },
  {
    range: "10–15",
    name: "Structured - Farm Business",
    tagline: "Strengthening for Growth",
    body: "The farm has established business and operational systems and demonstrates a more consistent approach to managing production and performance. The focus is now on closing capability gaps and preparing for sustainable growth and investment.",
    min: 10,
    max: 15,
  },
  {
    range: "16–20",
    name: "Investment-Ready - Farm Business",
    tagline: "Prepared for Investment",
    body: "The farm demonstrates the business, financial, governance, operational, and market capabilities needed to prepare for external investment or strategic partnerships. The focus is on evidence, scalability, risk management, and effective capital deployment.",
    min: 16,
    max: 20,
  },
  {
    range: "21–24",
    name: "Future-Ready Farm Business",
    tagline: "Leading for the Future",
    body: "The farm demonstrates advanced and integrated capabilities across its farm system, with strong foundations for resilience, innovation, competitiveness, sustainable growth, and continued improvement.",
    min: 21,
    max: 24,
  },
];

function randomRefSegment(length = 6): string {
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (const b of bytes) out += REF_ALPHABET[b % REF_ALPHABET.length];
  return out;
}

function stamp(d = new Date()): { date: string; fileStamp: string } {
  const p = (n: number) => String(n).padStart(2, "0");
  const date = `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}`;
  return {
    date,
    fileStamp: `${date}-${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`,
  };
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function prettifyType(t?: string | null): string {
  if (!t) return "Not specified";
  const s = t.toLowerCase();
  if (s === "crop") return "Crop";
  if (s === "livestock") return "Livestock";
  if (s === "mixed") return "Mixed";
  return t;
}

/**
 * Server-rendered full Transformation Report PDF — real file download.
 * Requires all 8 pillars submitted. Every download mints a fresh unique
 * reference code and ledgers the exact snapshot for admin reprint.
 * GET /api/assessment/report/full/pdf?email=
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = await getOrCreateCurrentUser(
      searchParams.get("email") || undefined
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        pillarAssessments: true,
        assessmentResponses: { orderBy: [{ pillarId: "asc" }, { questionId: "asc" }] },
      },
    });
    if (!assessment) {
      return NextResponse.json({ error: "No assessment found." }, { status: 404 });
    }

    const submitted = assessment.pillarAssessments.filter((pa) => pa.isCompleted);
    if (submitted.length < 8) {
      return NextResponse.json(
        { error: `Full report needs all 8 pillars submitted (${submitted.length}/8).` },
        { status: 403 }
      );
    }

    const totalYes = assessment.assessmentResponses.filter((r) => r.answer === "yes").length;
    const total = assessment.assessmentResponses.length || 200;
    const overallPercent = Math.round((totalYes / total) * 100);
    const score24 = Math.round((totalYes / total) * 24);
    const bands = BANDS.map((b) => ({
      ...b,
      current: score24 >= b.min && score24 <= b.max,
    }));

    const completedTimes = submitted
      .map((pa) => (pa.completedAt ? new Date(pa.completedAt).getTime() : 0))
      .filter(Boolean);
    const lastDone = new Date(Math.max(...completedTimes, assessment.updatedAt.getTime()));
    const nextDue = new Date(lastDone.getTime() + 90 * 24 * 60 * 60 * 1000);

    const loc: any = (user as any).farmLocation || {};
    const ch: any = (user as any).farmCharacteristics || {};
    const biz: any = (user as any).business || {};
    const fp: any = (user as any).farmerProfile || {};
    const farmId = biz.businessId || user.futureFarmId || "FFF-KE-PROD";
    const place = loc.ward || loc.subcounty || loc.county || "";
    const ownerTitle = fp.jobTitle ? ` (${fp.jobTitle})` : "";

    const pillars = ALL_PILLARS.map((p) => {
      const pa = assessment.pillarAssessments.find((x) => x.pillarId === p.id);
      const pres = assessment.assessmentResponses.filter((r) => r.pillarId === p.id);
      const yes = pres.filter((r) => r.answer === "yes").length;
      const pScore = pa ? pa.score : pres.length > 0 ? Math.round((yes / 25) * 100) : 0;
      const tier = getPillarScoringTier(p.id, yes);
      return {
        id: p.id,
        name: p.name,
        score: pScore,
        yesCount: yes,
        maturityStage: tier.status,
        brief: tier.recommendation,
      };
    });

    const priorities: Array<{
      pillarId: number;
      pillarName: string;
      id: string;
      name: string;
      yes: number;
      feedback: string;
    }> = [];
    for (const p of ALL_PILLARS) {
      const pa = assessment.pillarAssessments.find((x) => x.pillarId === p.id);
      let parsed: Record<string, any> = {};
      try {
        parsed = JSON.parse(pa?.capabilityScores || "{}");
      } catch {
        parsed = {};
      }
      const pres = assessment.assessmentResponses.filter((r) => r.pillarId === p.id);
      for (const c of p.capabilities) {
        const yes =
          parsed[c.id]?.yes ??
          pres.filter((r) => r.capabilityId === c.id && r.answer === "yes").length;
        if (yes <= 3) {
          priorities.push({
            pillarId: p.id,
            pillarName: p.name,
            id: c.id,
            name: c.name,
            yes,
            feedback: getCapabilityFeedbackText(c.id, yes, c.name),
          });
        }
      }
    }
    priorities.sort((a, b) => a.pillarId - b.pillarId || a.id.localeCompare(b.id));

    const now = new Date();
    const { date: datePart, fileStamp } = stamp(now);

    let referenceCode = "";
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const candidate = `FFR-${datePart}-${randomRefSegment()}`;
      const clash = await prisma.reportDownload.findUnique({
        where: { referenceCode: candidate },
        select: { id: true },
      });
      if (!clash) {
        referenceCode = candidate;
        break;
      }
    }
    if (!referenceCode) {
      return NextResponse.json(
        { error: "Could not issue a reference code, please try again." },
        { status: 500 }
      );
    }

    const fileName = `Future-Farms-Transformation-Report-${fileStamp}.pdf`;
    const verifyUrl = `${appBaseUrl()}/verify?type=report&reportId=${encodeURIComponent(referenceCode)}&farmId=${encodeURIComponent(farmId)}`;

    let qrDataUrl: string | null = null;
    try {
      const QRCode = (await import("qrcode")).default;
      qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 240, margin: 1 });
    } catch (e) {
      console.warn("[Full PDF] QR generation failed:", (e as any)?.message || e);
    }

    let logoDataUrl: string | null = null;
    try {
      const buf = await fs.readFile(
        path.join(process.cwd(), "public", "ffi-green-horizontal-landscape.png")
      );
      logoDataUrl = `data:image/png;base64,${buf.toString("base64")}`;
    } catch {
      logoDataUrl = null;
    }

    const reportData = {
      generatedAt: fmtDate(now),
      reportId: referenceCode,
      verifyUrl,
      qrDataUrl,
      farm: {
        farmName: (user as any).farmName || user.businessName || user.name || "Farm",
        farmId,
        ownerManager: `${user.name || "Farmer"}${ownerTitle}`,
        location: place ? `${place} | ${(user as any).countryCode === "KE" || !loc.country ? "Kenya" : loc.country}` : "Kenya",
        farmType: prettifyType((user as any).farmingType),
        farmSize:
          ch.farmSize != null
            ? `${ch.farmSize} ${ch.farmUnit || "Acres"}`
            : "Not specified",
        assessmentDate: fmtDate(lastDone),
        nextAssessmentDate: fmtDate(nextDue),
      },
      ffmi: { score24, overallPercent },
      bands,
      pillars,
      priorities,
    };

    const buffer = await renderToBuffer(
      React.createElement(TransformationReportPdf, {
        data: { ...reportData, logoDataUrl },
      })
    );

    await prisma.reportDownload.create({
      data: {
        referenceCode,
        userId: user.id,
        pillarId: null,
        reportType: "FULL_TRANSFORMATION",
        fileName,
        snapshot: JSON.stringify({ kind: "full", ...reportData }),
      },
    });

    const bytes = new Uint8Array(buffer);
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(bytes.length),
        "Cache-Control": "no-store",
        "X-Report-Reference": referenceCode,
      },
    });
  } catch (error: any) {
    console.error("Error generating transformation PDF:", error);
    return NextResponse.json(
      { error: "Could not generate the PDF report." },
      { status: 500 }
    );
  }
}
