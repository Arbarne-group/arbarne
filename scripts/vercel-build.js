const { execSync } = require("child_process");

// Fallback to local SQLite database if DATABASE_URL is not set in the environment
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
  console.log("ℹ️ No DATABASE_URL found. Defaulting to local SQLite (file:./dev.db)");
} else {
  console.log("✓ Found DATABASE_URL in environment.");
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
