import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

    const status = computeOnboardingStageFromUser(user);

    return NextResponse.json({
      success: true,
      stage: status.stage,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
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
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
