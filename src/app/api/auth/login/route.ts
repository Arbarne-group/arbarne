import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signSession, sessionCookieHeader } from "@/lib/session";
import { runWithAuditContext } from "@/lib/audit";

import { computeOnboardingStageFromUser } from "@/lib/onboardingGuard";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        farmerProfile: true,
        farmManagement: true,
        operatingStyle: true,
        digitalPlatform: true,
        aspiration: true,
        farmLocation: true,
        farmCharacteristics: true,
        farmingSystem: true,
        businessExperience: true,
        goalsPriorities: true,
        householdLabour: true,
        onboardingStatus: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (user.accountStatus !== "VERIFIED") {
      return NextResponse.json(
        { error: "Please verify your email address first.", code: "UNVERIFIED" },
        { status: 403 }
      );
    }

    const status = computeOnboardingStageFromUser(user);

    const res = await runWithAuditContext({ actorId: user.id }, async () => {
      // Touch last-seen on successful password login.
      await prisma.user.update({
        where: { id: user.id },
        data: { lastSeenAt: new Date() },
      });
      return NextResponse.json({
        success: true,
        stage: status.stage,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          phoneCountryCode: user.phoneCountryCode,
          phoneNational: user.phoneNational,
          countryCode: user.countryCode,
          role: user.role,
          otherRoleLabel: user.otherRoleLabel,
          accountStatus: user.accountStatus,
          farmingType: user.farmingType,
          businessName: user.businessName,
          futureFarmId: user.futureFarmId,
          farmName: user.farmName,
          farmerProfile: user.farmerProfile,
          farmManagement: user.farmManagement,
          operatingStyle: user.operatingStyle,
          digitalPlatform: user.digitalPlatform,
          aspiration: user.aspiration,
          farmLocation: user.farmLocation,
          farmCharacteristics: user.farmCharacteristics,
          farmingSystem: user.farmingSystem,
          businessExperience: user.businessExperience,
          householdLabour: user.householdLabour,
          onboardingStatus: user.onboardingStatus,
          stage: status.stage,
        },
      });
    });
    const token = await signSession({ userId: user.id, email: user.email });
    res.headers.append("Set-Cookie", sessionCookieHeader(token));
    return res;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
