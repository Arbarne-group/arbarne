import { PrismaClient } from "@prisma/client";
import { installAuditMiddleware } from "./audit";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

installAuditMiddleware(prisma);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

