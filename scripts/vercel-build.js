const { execSync } = require("child_process");

// Check for placeholder credentials
const isPlaceholderUrl = (url) => !url || url.includes("ep-xyz") || url.includes("password@");

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ Warning: No DATABASE_URL found in environment. Ensure DATABASE_URL is configured in Vercel Environment Variables for Neon Postgres.");
} else if (isPlaceholderUrl(process.env.DATABASE_URL) || isPlaceholderUrl(process.env.DIRECT_URL)) {
  console.error("❌ ERROR: DATABASE_URL or DIRECT_URL contains placeholder values ('ep-xyz' or 'password').");
  console.error("Please update your Vercel Project Environment Variables with your real Neon Postgres connection strings.");
  process.exit(1);
} else {
  console.log("✓ Found valid DATABASE_URL in environment (Neon Postgres).");
}

try {
  // Only attempt db push if not explicitly skipped
  if (process.env.SKIP_DB_PUSH !== "1" && process.env.SKIP_DB_PUSH !== "true") {
    console.log("\n📦 Synchronizing database schema with Prisma...");
    try {
      execSync("npx prisma db push --accept-data-loss", {
        stdio: "inherit",
        env: process.env,
      });
    } catch (dbPushError) {
      console.warn("\n⚠️ Warning: 'prisma db push' failed. If the schema is already pushed to Neon, proceeding with build...");
      console.warn("Details:", dbPushError.message);
    }
  } else {
    console.log("\n⏩ Skipping 'prisma db push' (SKIP_DB_PUSH is set).");
  }

  console.log("\n⚙️ Generating Prisma Client...");
  execSync("npx prisma generate", {
    stdio: "inherit",
    env: process.env,
  });

  console.log("\n🚀 Building Next.js application...");
  execSync("npx next build", {
    stdio: "inherit",
    env: process.env,
  });

  console.log("\n✅ Build completed successfully!");
} catch (error) {
  console.error("\n❌ Build failed:", error.message);
  process.exit(1);
}
