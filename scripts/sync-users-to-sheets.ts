import { prisma } from "../src/lib/prisma";
import { recordUserToSheet } from "../src/lib/googleSheets";

async function main() {
  console.log("🌱 Syncing all Future Farms registered users to Google Spreadsheet...");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      farmLocation: true,
      onboardingStatus: true,
    },
  });

  console.log(`Found ${users.length} users in database.`);

  for (let i = 0; i < users.length; i++) {
    let u = users[i];
    if (!u.futureFarmId) {
      const assignedId = `FFF-KE-PROD-${String(i + 1).padStart(3, "0")}`;
      u = await prisma.user.update({
        where: { id: u.id },
        data: { futureFarmId: assignedId },
        include: {
          farmLocation: true,
          onboardingStatus: true,
        },
      });
      console.log(`Assigned ${assignedId} to ${u.email}`);
    }

    const res = await recordUserToSheet(u);
    if (res.success) {
      console.log(`✓ Synced ${u.futureFarmId} (${u.email}) to Google Sheet`);
    } else {
      console.warn(`⚠️ Failed to sync ${u.email}:`, res.error);
    }
  }

  console.log("✅ All users successfully synchronized to Google Sheet!");
}

main()
  .catch((err) => {
    console.error("❌ Sync failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
