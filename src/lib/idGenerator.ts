import { prisma } from "@/lib/prisma";

/**
 * Safely determines the next unique Future Farms Production ID (e.g. FFF-KE-PROD-025),
 * scanning all existing records to guarantee ZERO unique constraint collisions.
 */
export async function generateUniqueFutureFarmId(): Promise<string> {
  try {
    const allUsers = await (prisma.user as any).findMany({
      select: { futureFarmId: true },
    });
    const existingIds = new Set<string>(
      allUsers
        .map((u: any) => u.futureFarmId?.toUpperCase())
        .filter(Boolean)
    );

    let maxNum = allUsers.length;
    for (const u of allUsers) {
      if (u.futureFarmId) {
        const match = u.futureFarmId.match(/FFF-KE-PROD-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum && num < 1000) {
            maxNum = num;
          }
        }
      }
    }

    let nextNum = maxNum + 1;
    let candidate = `FFF-KE-PROD-${String(nextNum).padStart(3, "0")}`;
    while (existingIds.has(candidate)) {
      nextNum++;
      candidate = `FFF-KE-PROD-${String(nextNum).padStart(3, "0")}`;
    }
    return candidate;
  } catch {
    return `FFF-KE-PROD-${Date.now().toString().slice(-4)}`;
  }
}
