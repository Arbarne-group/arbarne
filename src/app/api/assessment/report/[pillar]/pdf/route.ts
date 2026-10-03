import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { appBaseUrl } from "@/lib/mailer";
import { ALL_PILLARS } from "@/data/allPillarsData";
import { getPillarById } from "@/data/assessmentData";
import { getMaturityTier } from "@/lib/assessmentScoring";
import { getPillarScoringTier } from "@/data/pillarScoringTiers";
import { getCapabilityFeedbackText, getCapabilityTier } from "@/data/capabilityFeedback";
import PillarReportPdf from "@/lib/pillarReportPdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

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

async function logoDataUrl(): Promise<string | null> {
  try {
    const buf = await fs.readFile(
      path.join(process.cwd(), "public", "ffi-green-horizontal-landscape.png")
    );
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Server-rendered Pillar Diagnostic PDF — real file download, no print dialog.
 * Every download mints a fresh unique reference code and ledgers the exact
 * snapshot, so staff can reprint the identical document later.
 * GET /api/assessment/report/[pillar]/pdf?email=
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ pillar: string }> }
) {
  try {
    const { pillar: pillarParam } = await params;
    const pId = Number(pillarParam);
    const { searchParams } = new URL(request.url);
    const user = await getOrCreateCurrentUser(
      searchParams.get("email") || undefined
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }
    if (!Number.isInteger(pId) || pId < 1 || pId > 8) {
      return NextResponse.json({ error: "Invalid pillar." }, { status: 400 });
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

    const pillarMeta = ALL_PILLARS.find((p) => p.id === pId);
    if (!pillarMeta) {
      return NextResponse.json({ error: "Invalid pillar." }, { status: 400 });
    }
    const pillarRecord = assessment.pillarAssessments.find((pa) => pa.pillarId === pId);
    const pillarResponses = assessment.assessmentResponses.filter((r) => r.pillarId === pId);
    if (!(pillarRecord?.isCompleted || pillarResponses.length >= 25)) {
      return NextResponse.json(
        { error: `Pillar ${pId} is incomplete (${pillarResponses.length}/25). Complete it before downloading.` },
        { status: 403 }
      );
    }

    let parsedCapScores: Record<string, any> = {};
    try {
      parsedCapScores = JSON.parse(pillarRecord?.capabilityScores || "{}");
    } catch {
      parsedCapScores = {};
    }

    const yesResponses = pillarResponses.filter((r) => r.answer === "yes");
    const noResponses = pillarResponses.filter((r) => r.answer === "no");
    const score = pillarRecord
      ? pillarRecord.score
      : Math.round((yesResponses.length / 25) * 100);
    const scoringTier = getPillarScoringTier(pId, yesResponses.length);
    const tier = getMaturityTier(score);
    const accent = getPillarById(pId).accentColor || "#045d61";

    const now = new Date();
    const { date: datePart, fileStamp } = stamp(now);

    // Unique reference per download (never reused, even for re-downloads).
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

    const fileName = `Future-Farms-Pillar-${pId}-Report-${fileStamp}.pdf`;
    const loc: any = (user as any).farmLocation || {};
    const ch: any = (user as any).farmCharacteristics || {};
    const biz: any = (user as any).business || {};
    const fp: any = (user as any).farmerProfile || {};
    const farmId = biz.businessId || user.futureFarmId || "FFF-KE-PROD";
    const verifyUrl = `${appBaseUrl()}/verify?type=report&reportId=${encodeURIComponent(referenceCode)}&pillar=${pId}&farmId=${encodeURIComponent(farmId)}`;

    let qrDataUrl: string | null = null;
    try {
      const QRCode = (await import("qrcode")).default;
      qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 240, margin: 1 });
    } catch (e) {
      console.warn("[Pillar PDF] QR generation failed:", (e as any)?.message || e);
    }
    const doneAt = pillarRecord?.completedAt
      ? new Date(pillarRecord.completedAt)
      : new Date(assessment.updatedAt);
    const nextDue = new Date(doneAt.getTime() + 90 * 24 * 60 * 60 * 1000);
    const fmtDay = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const place = loc.ward || loc.subcounty || loc.county || "";
    const ftype = String((user as any).farmingType || "").toLowerCase();

    const reportData = {
      generatedAt: now.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      reportId: referenceCode,
      verifyUrl,
      qrDataUrl,
      farm: {
        farmName:
          (user as any).farmName ||
          user.businessName ||
          (user.name ? `${user.name}'s Farm` : "Farm Name Not Specified"),
        farmId,
        ownerManager: `${user.name || "Farmer"}${fp.jobTitle ? ` (${fp.jobTitle})` : ""}`,
        location: place ? `${place} | ${loc.country || "Kenya"}` : "Kenya",
        farmType:
          ftype === "crop"
            ? "Crop"
            : ftype === "livestock"
              ? "Livestock"
              : ftype === "mixed"
                ? "Mixed"
                : "Not specified",
        farmSize:
          ch.farmSize != null ? `${ch.farmSize} ${ch.farmUnit || "Acres"}` : "Not specified",
        assessmentDate: fmtDay(doneAt),
        nextAssessmentDate: fmtDay(nextDue),
      },
      pillar: {
        id: pId,
        name: pillarMeta.name,
        score,
        gapCount: noResponses.length,
        maturityStage: scoringTier.status,
        recommendation: scoringTier.recommendation,
        maturityDescription: tier.description,
        guidingQuestion: pillarMeta.guidingQuestion,
        accentColor: accent,
      },
      capabilities: pillarMeta.capabilities.map((c) => {
        const capScoreData = parsedCapScores[c.id] || {
          score: 0,
          yes: pillarResponses.filter(
            (r) => r.capabilityId === c.id && r.answer === "yes"
          ).length,
          total: 5,
        };
        const capTier = getCapabilityTier(capScoreData.yes ?? 0, capScoreData.total || 5);
        return {
          id: c.id,
          name: c.name,
          focus: c.focus,
          maturity: capTier.status,
          statusFeedback: getCapabilityFeedbackText(c.id, capScoreData.yes ?? 0, c.name),
        };
      }),
      gaps: noResponses.map((r) => ({
        questionId: r.questionId,
        question: r.questionText,
        recommendation: r.recommendation,
        whyItMatters: r.whyItMatters,
        quickWin: r.quickWin,
        priority: r.priority,
      })),
    };

    const buffer = await renderToBuffer(
      React.createElement(PillarReportPdf, {
        data: { ...reportData, logoDataUrl: await logoDataUrl() },
      })
    );

    await prisma.reportDownload.create({
      data: {
        referenceCode,
        userId: user.id,
        pillarId: pId,
        reportType: "PILLAR_DIAGNOSTIC",
        fileName,
        snapshot: JSON.stringify(reportData),
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
    console.error("Error generating pillar PDF:", error);
    return NextResponse.json(
      { error: "Could not generate the PDF report." },
      { status: 500 }
    );
  }
}
