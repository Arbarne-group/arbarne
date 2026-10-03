import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/access";
import PillarReportPdf from "@/lib/pillarReportPdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Staff: reprint the byte-identical-content document for a download
 * reference code, rendered from its stored snapshot (current logo applied).
 * GET /api/admin/reports/reprint/[ref]
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const { ref } = await params;
    const row = await prisma.reportDownload.findUnique({
      where: { referenceCode: String(ref || "").trim() },
    });
    if (!row) {
      return NextResponse.json({ error: "Report reference not found." }, { status: 404 });
    }
    let snapshot: any;
    try {
      snapshot = JSON.parse(row.snapshot);
    } catch {
      return NextResponse.json({ error: "Stored snapshot is corrupt." }, { status: 500 });
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
    const buffer = await renderToBuffer(
      React.createElement(PillarReportPdf, {
        data: { ...snapshot, logoDataUrl },
      })
    );
    const bytes = new Uint8Array(buffer);
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${row.fileName}"`,
        "Content-Length": String(bytes.length),
        "Cache-Control": "no-store",
        "X-Report-Reference": row.referenceCode,
      },
    });
  } catch (error: any) {
    console.error("Error reprinting report:", error);
    return NextResponse.json({ error: "Could not reprint the report." }, { status: 500 });
  }
}
