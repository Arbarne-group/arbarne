import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordUserToSheet } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const eventType = payload?.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const userData = payload.data;
      const primaryEmailId = userData.primary_email_address_id;
      const emailObj = userData.email_addresses?.find(
        (e: any) => e.id === primaryEmailId
      ) || userData.email_addresses?.[0];

      const email = emailObj?.email_address?.toLowerCase().trim();
      if (!email) {
        return NextResponse.json({ received: true, skipped: "No email address found" });
      }

      const fullName =
        [userData.first_name, userData.last_name].filter(Boolean).join(" ") || "Farmer";
      const phone = userData.phone_numbers?.[0]?.phone_number || null;

      let dbUser = await prisma.user.findUnique({
        where: { email },
        include: {
          farmLocation: true,
          onboardingStatus: true,
        },
      });

      if (!dbUser) {
        const userCount = await prisma.user.count();
        const assignedId = `FFF-KE-PROD-${String(userCount + 1).padStart(3, "0")}`;

        dbUser = await prisma.user.create({
          data: {
            name: fullName,
            email,
            phone,
            futureFarmId: assignedId,
            passwordHash: "CLERK_WEBHOOK_PROVISIONED",
            farmerProfile: { create: {} },
            farmManagement: { create: {} },
            operatingStyle: { create: {} },
            digitalPlatform: { create: {} },
            aspiration: { create: {} },
          },
          include: {
            farmLocation: true,
            onboardingStatus: true,
          },
        });
      } else if (!dbUser.futureFarmId) {
        const userCount = await prisma.user.count();
        const assignedId = `FFF-KE-PROD-${String(userCount).padStart(3, "0")}`;
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: { futureFarmId: assignedId },
          include: {
            farmLocation: true,
            onboardingStatus: true,
          },
        });
      }

      // Record to Google Sheet
      await recordUserToSheet(dbUser, { id: userData.id });
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error("Error processing Clerk webhook:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
