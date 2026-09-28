import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/access";

export const ONLINE_WINDOW_MIN = 3;

export function isOnline(lastSeenAt: Date | string | null | undefined): boolean {
  if (!lastSeenAt) return false;
  return Date.now() - new Date(lastSeenAt).getTime() < ONLINE_WINDOW_MIN * 60 * 1000;
}

/** Staff: list users with presence + role + status. */
export async function GET(request: Request) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const role = searchParams.get("role")?.trim() || "";

  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      name: true,
      firstName: true,
      middleName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      otherRoleLabel: true,
      accountStatus: true,
      authProvider: true,
      farmingType: true,
      countryCode: true,
      lastSeenAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    success: true,
    onlineWindowMin: ONLINE_WINDOW_MIN,
    users: users.map((u) => ({ ...u, online: isOnline(u.lastSeenAt) })),
  });
}
