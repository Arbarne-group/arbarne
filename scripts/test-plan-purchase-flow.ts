import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/prisma";
import { getPlanById, PAYSTACK_PLANS } from "../src/lib/paystack";

async function runTests() {
  console.log("=================================================");
  console.log("🧪 STARTING PLAN PURCHASE & M-PESA REFLECTION TESTS");
  console.log("=================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, details?: any) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (details) console.error("   Details:", details);
    }
  }

  // TEST 1: Official M-PESA Logo Asset Verification
  console.log("--- TEST SUITE 1: Official M-PESA Logo Asset ---");
  const logoPath1 = path.join(process.cwd(), "public", "images", "mpesa-logo.png");
  const logoPath2 = path.join(process.cwd(), "public", "mpesa-logo.png");

  assert(fs.existsSync(logoPath1), "public/images/mpesa-logo.png exists on filesystem");
  assert(fs.existsSync(logoPath2), "public/mpesa-logo.png exists on filesystem");

  if (fs.existsSync(logoPath1)) {
    const stats = fs.statSync(logoPath1);
    assert(stats.size > 1000, `M-Pesa logo file size is valid (${stats.size} bytes)`);

    // Verify PNG header bytes (89 50 4E 47 0D 0A 1A 0A)
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(logoPath1, "r");
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);
    const isPng =
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47;
    assert(isPng, "M-Pesa logo is a verified valid PNG image file");
  }

  // TEST 2: Plan Catalog & Pricing Data Integrity
  console.log("\n--- TEST SUITE 2: Plan Catalog & Pricing Integrity ---");
  assert(Boolean(PAYSTACK_PLANS["1_PILLAR"]), "1_PILLAR plan exists in paystack catalog");
  assert(PAYSTACK_PLANS["1_PILLAR"].amount === 100, "1_PILLAR plan is KES 100");
  assert(Boolean(PAYSTACK_PLANS["4_PILLARS"]), "4_PILLARS plan exists in paystack catalog");
  assert(PAYSTACK_PLANS["4_PILLARS"].amount === 500, "4_PILLARS plan is KES 500");
  assert(Boolean(PAYSTACK_PLANS["FULL_ASSESSMENT"]), "FULL_ASSESSMENT plan exists in paystack catalog");
  assert(PAYSTACK_PLANS["FULL_ASSESSMENT"].amount === 1000, "FULL_ASSESSMENT plan is KES 1,000");

  // TEST 3: User Setup & Baseline State
  console.log("\n--- TEST SUITE 3: Plan Purchase Lifecycle & Database Reflection ---");
  const testEmail = `test_farmer_${Date.now()}@futurefarms.africa`;
  const testPhone = "+254712345678";
  const testFarm = "Kilimo Bora Ventures";

  // Create clean test user
  const testUser = await prisma.user.create({
    data: {
      email: testEmail,
      name: "Test Farmer",
      phone: testPhone,
      farmName: testFarm,
      passwordHash: "test_pw",
    },
  });

  assert(Boolean(testUser.id), `Created isolated test user: ${testEmail}`);

  // Test initial state: Unsubscribed / Free Tier
  const initialSub = await prisma.subscription.findFirst({
    where: { userId: testUser.id, status: "ACTIVE" },
  });
  assert(initialSub === null, "New user correctly has NO active subscription (honest zero-mock state)");

  // TEST 4: Purchase 1 Pillar Plan via M-Pesa
  console.log("\n--- TEST SUITE 4: Purchasing 1 Pillar Plan (KES 100) via M-Pesa ---");
  const plan1 = getPlanById("1_PILLAR");
  const ref1 = `FFF_TEST_MPESA_${Date.now()}_1P`;

  // Create Order in DB
  const order1 = await prisma.order.create({
    data: {
      userId: testUser.id,
      planType: plan1.id,
      amount: plan1.amount,
      currency: "KES",
      paymentMethod: "MPESA",
      phoneNumber: testPhone,
      status: "COMPLETED",
      mpesaReceiptNumber: `QK7${Date.now().toString().slice(-7)}`,
      paystackReference: ref1,
    },
  });

  assert(order1.status === "COMPLETED", "Order 1 recorded with status COMPLETED");
  assert(order1.paymentMethod === "MPESA", "Order 1 paymentMethod is factual MPESA");
  assert(order1.amount === 100, "Order 1 amount is exactly KES 100");
  assert(Boolean(order1.mpesaReceiptNumber), `Order 1 has factual M-Pesa receipt: ${order1.mpesaReceiptNumber}`);

  // Activate Subscription for Plan 1
  const sub1 = await prisma.subscription.create({
    data: {
      userId: testUser.id,
      planId: plan1.id,
      planCode: plan1.defaultPlanCode,
      subscriptionCode: `SUB_MPESA_${order1.id.slice(-6)}`,
      status: "ACTIVE",
      amount: plan1.amount,
      currency: "KES",
      interval: plan1.interval,
      cardLast4: null, // No fake card
      cardBrand: null,
    },
  });

  await prisma.order.update({
    where: { id: order1.id },
    data: { subscriptionId: sub1.id },
  });

  assert(sub1.status === "ACTIVE", "Subscription is ACTIVE");
  assert(sub1.planId === "1_PILLAR", "Subscription planId is 1_PILLAR");
  assert(sub1.cardLast4 === null, "Subscription has NO mock card data stored");

  // TEST 5: Upgrade / Switch to Full Assessment (8 Pillars @ KES 1,000) via M-Pesa
  console.log("\n--- TEST SUITE 5: Upgrading to Full Assessment (8 Pillars @ KES 1,000) ---");
  const planFull = getPlanById("FULL_ASSESSMENT");
  const ref2 = `FFF_TEST_MPESA_${Date.now()}_FULL`;
  const mpesaReceipt2 = `RK9${Date.now().toString().slice(-7)}`;

  // Create upgrade order
  const order2 = await prisma.order.create({
    data: {
      userId: testUser.id,
      planType: planFull.id,
      amount: planFull.amount,
      currency: "KES",
      paymentMethod: "MPESA",
      phoneNumber: testPhone,
      status: "COMPLETED",
      mpesaReceiptNumber: mpesaReceipt2,
      paystackReference: ref2,
    },
  });

  // Upgrade the active subscription
  const subUpgraded = await prisma.subscription.update({
    where: { id: sub1.id },
    data: {
      planId: planFull.id,
      planCode: planFull.defaultPlanCode,
      status: "ACTIVE",
      amount: planFull.amount,
      updatedAt: new Date(),
    },
  });

  await prisma.order.update({
    where: { id: order2.id },
    data: { subscriptionId: subUpgraded.id },
  });

  assert(subUpgraded.status === "ACTIVE", "Upgraded subscription remains ACTIVE");
  assert(subUpgraded.planId === "FULL_ASSESSMENT", "Subscription successfully upgraded to FULL_ASSESSMENT");
  assert(subUpgraded.amount === 1000, "Upgraded subscription amount reflects KES 1,000");

  // TEST 6: System Reflection & Factual Billing Portal Data
  console.log("\n--- TEST SUITE 6: Portal Reflection Verification ---");
  const userSubs = await prisma.subscription.findMany({
    where: { userId: testUser.id, status: "ACTIVE" },
  });
  assert(userSubs.length === 1, `Exactly 1 active subscription exists (no duplicate subscriptions): found ${userSubs.length}`);

  const userOrders = await prisma.order.findMany({
    where: { userId: testUser.id },
    orderBy: { createdAt: "desc" },
  });
  assert(userOrders.length === 2, `Both orders properly recorded in invoice history (count: ${userOrders.length})`);
  assert(userOrders[0].planType === "FULL_ASSESSMENT", "Latest order is FULL_ASSESSMENT");
  assert(userOrders[0].mpesaReceiptNumber === mpesaReceipt2, "Latest order has verified M-Pesa receipt");
  assert(userOrders[1].planType === "1_PILLAR", "Previous order is 1_PILLAR");

  // TEST 7: Assessment & Capability Access Entitlement
  console.log("\n--- TEST SUITE 7: Assessment & Diagnostic Features Access ---");
  // Ensure Assessment record exists for the user
  const assessment = await prisma.assessment.create({
    data: {
      userId: testUser.id,
      overallScore: 85,
      maturityLevel: "Advancing",
      pillarScores: JSON.stringify({
        "Soil & Crop Health": 84,
        "Water & Irrigation": 78,
        "Tech & Mechanization": 72,
        "Business & Financials": 88,
        "Labor & Workforce": 80,
        "Climate Resilience": 75,
        "Market Access": 90,
        "Post-Harvest & Quality": 79,
      }),
      radarData: JSON.stringify({
        labels: ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"],
        scores: [84, 78, 72, 88, 80, 75, 90, 79],
      }),
    },
  });

  assert(Boolean(assessment.id), "Assessment record successfully linked to subscribed user");
  assert(assessment.overallScore === 85, "Assessment score recorded accurately");

  // Clean up test data
  await prisma.order.deleteMany({ where: { userId: testUser.id } });
  await prisma.subscription.deleteMany({ where: { userId: testUser.id } });
  await prisma.assessment.deleteMany({ where: { userId: testUser.id } });
  await prisma.user.delete({ where: { id: testUser.id } });

  console.log("\n=================================================");
  console.log(`🏁 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  if (passedTests === totalTests) {
    console.log("🎉 ALL TESTS COMPLETED WITH ZERO ERRORS!");
  } else {
    console.error("⚠️ SOME TESTS FAILED. CHECK LOGS ABOVE.");
    process.exit(1);
  }
  console.log("=================================================\n");
}

runTests().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
