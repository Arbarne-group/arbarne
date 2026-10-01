import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Public catalogue: active learning materials, newest first. */
export async function GET() {
  const materials = await prisma.learningMaterial.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, materials });
}
