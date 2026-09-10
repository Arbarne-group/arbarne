import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function configurePrismaDatabaseUrl() {
  const currentUrl = process.env.DATABASE_URL;

  // If already pointing to a remote database (Postgres, MySQL, etc.), keep it
  if (currentUrl && !currentUrl.startsWith("file:")) {
    return;
  }

  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    process.env.NODE_ENV === "production";

  if (isServerless) {
    const tmpDbPath = path.join("/tmp", "dev.db");
    process.env.DATABASE_URL = `file:${tmpDbPath}`;

    if (!fs.existsSync(/*turbopackIgnore: true*/ tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(process.cwd(), "dev.db"),
      ];
      for (const candidate of candidates) {
        if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) {
          try {
            fs.copyFileSync(/*turbopackIgnore: true*/ candidate, tmpDbPath);
            console.log(`[Prisma] Successfully initialized /tmp/dev.db from ${candidate}`);
            break;
          } catch (err) {
            console.warn(`[Prisma] Could not copy ${candidate} to ${tmpDbPath}:`, err);
          }
        }
      }
    }
  } else if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "file:./dev.db";
  }
}

configurePrismaDatabaseUrl();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

