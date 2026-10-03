import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/access";

export const dynamic = "force-dynamic";

/** Staff: list generated report downloads, newest first. ?email=&pillar=&take= */
export async function GET(request: Request) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  try {
    const { searchParams } = new URL(request.url);
    const email = (searchParams.get("email") || "").toLowerCase().trim();
    const pillar = Number(searchParams.get("pillar") || "");
    const take = Math.min(Number(searchParams.get("take") || "50") || 50, 200);
    const rows = await prisma.reportDownload.findMany({
      where: {
        ...(email ? { user: { email } } : {}),
        ...(Number.isInteger(pillar) && pillar >= 1 && pillar <= 8 ? { pillarId: pillar } : {}),
      },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        referenceCode: true,
        pillarId: true,
        reportType: true,
        fileName: true,
        createdAt: true,
        user: { select: { email: true, name: true } },
      },
    });
    return NextResponse.json({ success: true, reports: rows });
  } catch (error: any) {
    console.error("Error listing report downloads:", error);
    return NextResponse.json({ error: "Could not load reports." }, { status: 500 });
  }
}
