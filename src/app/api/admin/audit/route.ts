import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/access";

/** Staff: browse the audit trail (newest first). */
export async function GET(request: Request) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  const { searchParams } = new URL(request.url);
  const model = searchParams.get("model")?.trim() || "";
  const actorId = searchParams.get("actorId")?.trim() || "";
  const action = searchParams.get("action")?.trim().toUpperCase() || "";
  const take = Math.min(Number(searchParams.get("take") || "100"), 500);

  const logs = await prisma.auditLog.findMany({
    where: {
      ...(model ? { model } : {}),
      ...(actorId ? { actorId } : {}),
      ...(action ? { action } : {}),
    },
    orderBy: { at: "desc" },
    take,
  });

  const actorIds = [...new Set(logs.map((l) => l.actorId).filter(Boolean))] as string[];
  const actors =
    actorIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: actorIds } },
          select: { id: true, name: true, email: true, role: true },
        })
      : [];
  const actorMap = Object.fromEntries(actors.map((a) => [a.id, a]));

  return NextResponse.json({
    success: true,
    logs: logs.map((l) => ({
      ...l,
      actor: l.actorId ? actorMap[l.actorId] ?? { id: l.actorId } : null,
    })),
  });
}
