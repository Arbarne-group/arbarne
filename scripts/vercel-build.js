const { execSync } = require("child_process");

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ Warning: No DATABASE_URL found in environment. Ensure DATABASE_URL is configured in Vercel Environment Variables for Neon Postgres.");
} else {
  console.log("✓ Found DATABASE_URL in environment (Neon Postgres).");
}

try {
  console.log("\n📦 Synchronizing database schema with Prisma...");
  execSync("npx prisma db push --accept-data-loss", {
    stdio: "inherit",
    env: process.env,
  });

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
