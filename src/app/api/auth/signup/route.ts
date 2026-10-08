import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, farmName, referralCode } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { newReferralCode } = await import("@/lib/referralCode");
    let ownCode = newReferralCode();
    for (let i = 0; i < 5; i++) {
      const clash = await prisma.user.findUnique({ where: { referralCode: ownCode } });
      if (!clash) break;
      ownCode = newReferralCode();
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        referralCode: ownCode,
        phone: phone ? `+254 ${phone.replace(/^\+?254\s*/, "")}` : null,
        farmName: farmName || null,
        farmerProfile: {
          create: {},
        },
        farmManagement: {
          create: {},
        },
        operatingStyle: {
          create: {},
        },
        digitalPlatform: {
          create: {},
        },
        aspiration: {
          create: {},
        },
      },
    });

    await attributeReferral(user.id, referralCode);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        farmName: user.farmName,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}

async function attributeReferral(referredId: string, code: string) {
  try {
    const normalized = String(code || "").toUpperCase().trim();
    if (!normalized) return;
    const referrer = await prisma.user.findUnique({
      where: { referralCode: normalized },
      select: { id: true },
    });
    if (!referrer || referrer.id === referredId) return;
    await prisma.referral.create({
      data: { referrerId: referrer.id, referredId },
    });
  } catch (e: any) {
    // P2002 = already attributed; anything else is non-fatal.
    if (String(e?.code) !== "P2002") {
      console.error("[Signup] referral attribution notice:", e?.message || e);
    }
  }
}
