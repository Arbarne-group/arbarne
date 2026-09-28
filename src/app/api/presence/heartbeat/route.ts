import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/access";

/** Frontend heartbeat: marks the caller online (lastSeenAt = now). */
export async function POST() {
  const { user } = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { lastSeenAt: new Date() },
  });
  return NextResponse.json({ success: true, online: true });
}
