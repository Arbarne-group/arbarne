import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Public catalogue: active opportunities, newest first. */
export async function GET() {
  const opportunities = await prisma.opportunity.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, opportunities });
}
