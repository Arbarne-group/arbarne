import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Public catalogue: everything Future Farms offers, oldest first (stable order). */
export async function GET() {
  const solutions = await prisma.solution.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ success: true, solutions });
}
