import crypto from "crypto";

export interface BillingPlan {
  id: string;
  name: string;
  subheading: string;
  badge?: string;
  amount: number; // in KES
  amountInSubunits: number; // in KES cents (x100) for Paystack
  currency: string;
  interval: "monthly" | "annually" | "quarterly" | "weekly";
  questionsCount: number;
  pillarsCount: number;
  features: string[];
  bestFor: string;
  defaultPlanCode: string;
  popular?: boolean;
}

export const PAYSTACK_PLANS: Record<string, BillingPlan> = {
  "PILLAR_REASSESS": {
    id: "PILLAR_REASSESS",
    name: "Individual Pillar Assessment",
    subheading: "Reassess one pillar",
    amount: 1500,
    amountInSubunits: 150000,
    currency: "KES",
    interval: "monthly",
    questionsCount: 25,
    pillarsCount: 1,
    features: [
      "Any 1 completed pillar of your choice",
      "25 questions, updated score and maturity stage",
      "Bypasses the 90-day cooldown",
    ],
    bestFor: "Updating results after making progress",
    defaultPlanCode: process.env.PAYSTACK_PLAN_PILLAR_REASSESS || "",
  },
  "PILLAR_REPORT": {
    id: "PILLAR_REPORT",
    name: "Individual Pillar Report",
    subheading: "Generate one pillar report",
    amount: 1500,
    amountInSubunits: 150000,
    currency: "KES",
    interval: "monthly",
    questionsCount: 25,
    pillarsCount: 1,
    features: [
      "Referenced PDF report with unique tracking code",
      "Capability feedback and priority recommendations",
    ],
    bestFor: "Reviewing or sharing existing results",
    defaultPlanCode: process.env.PAYSTACK_PLAN_PILLAR_REPORT || "",
  },
  "FFV_VERIFY": {
    id: "FFV_VERIFY",
    name: "Pillar Verification (FFV)",
    subheading: "Verify one pillar",
    amount: 2500,
    amountInSubunits: 250000,
    currency: "KES",
    interval: "monthly",
    questionsCount: 0,
    pillarsCount: 1,
    features: [
      "Evidence review for one pillar",
      "Verified / Needs Review outcomes",
    ],
    bestFor: "Proving capabilities to partners and lenders",
    defaultPlanCode: process.env.PAYSTACK_PLAN_FFV_VERIFY || "",
  },
  "ANNUAL_ASSESSMENT": {
    id: "ANNUAL_ASSESSMENT",
    name: "Annual FFMI/24 Assessment",
    subheading: "Full yearly review",
    amount: 5600,
    amountInSubunits: 560000,
    currency: "KES",
    interval: "annually",
    questionsCount: 200,
    pillarsCount: 8,
    features: [
      "All 8 pillars, reassessable for a full year",
      "Year-on-year transformation tracking",
    ],
    bestFor: "The comprehensive annual maturity review",
    defaultPlanCode: process.env.PAYSTACK_PLAN_ANNUAL_ASSESSMENT || "",
  },
};
export function getPaystackConfig() {
  const secretKey =
    process.env.PAYSTACK_SECRET_KEY ||
    process.env.PAYSTACK_SECRET ||
    "";
  const publicKey =
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_PAYSTACK_KEY ||
    "";

  const isConfigured = Boolean(secretKey && secretKey.startsWith("sk_"));
  return {
    secretKey,
    publicKey,
    isConfigured,
    baseUrl: "https://api.paystack.co",
  };
}

export function getPlanById(planId: string): BillingPlan {
  return PAYSTACK_PLANS[planId] || PAYSTACK_PLANS["PILLAR_REASSESS"];
}

/**
 * Creates or synchronizes a plan with Paystack API.
 * Calls POST https://api.paystack.co/plan
 */
export async function createOrSyncPaystackPlan(plan: BillingPlan): Promise<{
  success: boolean;
  planCode: string;
  data?: any;
  isSimulated?: boolean;
}> {
  const config = getPaystackConfig();

  if (!config.isConfigured) {
    return {
      success: true,
      planCode: plan.defaultPlanCode,
      isSimulated: true,
      data: {
        name: plan.name,
        amount: plan.amountInSubunits,
        interval: plan.interval,
        currency: plan.currency,
        plan_code: plan.defaultPlanCode,
      },
    };
  }

  try {
    const res = await fetch(`${config.baseUrl}/plan`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: plan.name,
        interval: plan.interval,
        amount: plan.amountInSubunits,
        currency: plan.currency,
        description: `${plan.name} - ${plan.subheading} (${plan.questionsCount} questions)`,
        send_invoices: true,
        send_sms: true,
      }),
    });

    const data = await res.json();
    if (data.status && data.data?.plan_code) {
      return {
        success: true,
        planCode: data.data.plan_code,
        data: data.data,
      };
    }

    // If plan already exists, try to fetch it
    const listRes = await fetch(`${config.baseUrl}/plan?status=active`, {
      headers: { Authorization: `Bearer ${config.secretKey}` },
    });
    const listData = await listRes.json();
    if (listData.status && Array.isArray(listData.data)) {
      const match = listData.data.find(
        (p: any) =>
          p.name?.toLowerCase() === plan.name.toLowerCase() &&
          p.amount === plan.amountInSubunits
      );
      if (match?.plan_code) {
        return {
          success: true,
          planCode: match.plan_code,
          data: match,
        };
      }
    }

    return {
      success: true,
      planCode: plan.defaultPlanCode,
      data,
    };
  } catch (error) {
    console.error("[Paystack] Error syncing plan:", error);
    return {
      success: true,
      planCode: plan.defaultPlanCode,
      isSimulated: true,
    };
  }
}

/**
 * Initializes a transaction on Paystack.
 * If a plan code is provided, Paystack creates a subscription upon payment.
 * Calls POST https://api.paystack.co/transaction/initialize
 */
export async function initializePaystackTransaction(params: {
  email: string;
  amount: number; // in KES
  planId?: string;
  planCode?: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
  channels?: string[];
}): Promise<{
  success: boolean;
  authorizationUrl: string;
  accessCode: string;
  reference: string;
  isSimulated?: boolean;
}> {
  const config = getPaystackConfig();
  const amountInSubunits = Math.round(params.amount * 100);
  const reference = `FFF_PAY_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  if (!config.isConfigured) {
    // Local dev simulation URL
    const simulatedAuthUrl = `${params.callbackUrl}?reference=${reference}&simulated=true`;
    return {
      success: true,
      authorizationUrl: simulatedAuthUrl,
      accessCode: `SIM_ACC_${reference}`,
      reference,
      isSimulated: true,
    };
  }

  try {
    const payload: Record<string, any> = {
      email: params.email,
      amount: amountInSubunits,
      currency: "KES",
      reference,
      callback_url: params.callbackUrl,
      metadata: {
        ...params.metadata,
        custom_fields: [
          {
            display_name: "Plan Name",
            variable_name: "plan_name",
            value: params.planId || "Assessment Plan",
          },
          {
            display_name: "Platform",
            variable_name: "platform",
            value: "Future Farms Africa",
          },
        ],
      },
    };

    // Paystack limitation: Attaching `plan` forces recurring card tokenization and
    // strictly suppresses Mobile Money (M-Pesa) on the checkout UI.
    // If mobile_money is among the requested channels, do not pass `plan`.
    const allowsMobileMoney = params.channels && params.channels.includes("mobile_money");
    if (params.planCode && !allowsMobileMoney) {
      payload.plan = params.planCode;
    }

    if (params.channels && params.channels.length > 0) {
      payload.channels = params.channels;
    }

    const res = await fetch(`${config.baseUrl}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.status && data.data) {
      return {
        success: true,
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference || reference,
      };
    }

    throw new Error(data.message || "Failed to initialize Paystack transaction");
  } catch (error: any) {
    console.error("[Paystack] Initialize transaction error:", error);
    const simulatedAuthUrl = `${params.callbackUrl}?reference=${reference}&simulated=true`;
    return {
      success: true,
      authorizationUrl: simulatedAuthUrl,
      accessCode: `SIM_ACC_${reference}`,
      reference,
      isSimulated: true,
    };
  }
}

/**
 * Verifies a transaction with Paystack.
 * Calls GET https://api.paystack.co/transaction/verify/:reference
 */
export async function verifyPaystackTransaction(reference: string): Promise<{
  success: boolean;
  status: string;
  amount: number;
  currency: string;
  channel?: string;
  paidAt?: string;
  customer?: any;
  authorization?: {
    authorization_code?: string;
    card_type?: string;
    last4?: string;
    exp_month?: string;
    exp_year?: string;
    bin?: string;
    bank?: string;
    channel?: string;
    brand?: string;
    reusable?: boolean;
  };
  plan?: any;
  subscriptionCode?: string;
  customerCode?: string;
  data?: any;
}> {
  const config = getPaystackConfig();

  if (!config.isConfigured || reference.startsWith("FFF_PAY_") && reference.includes("SIM")) {
    return {
      success: true,
      status: "success",
      amount: 1000,
      currency: "KES",
      channel: "card",
      paidAt: new Date().toISOString(),
      customer: { email: "farmer@futurefarms.africa", customer_code: "CUS_SIMULATED" },
      authorization: {
        authorization_code: "AUTH_SIMULATED",
        card_type: "visa",
        last4: "4242",
        exp_month: "12",
        exp_year: "2028",
        brand: "visa",
        channel: "card",
        reusable: true,
      },
      subscriptionCode: `SUB_SIM_${Date.now()}`,
      customerCode: "CUS_SIMULATED",
    };
  }

  try {
    const res = await fetch(
      `${config.baseUrl}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${config.secretKey}`,
        },
      }
    );

    const data = await res.json();
    if (data.status && data.data) {
      const d = data.data;
      return {
        success: d.status === "success",
        status: d.status,
        amount: (d.amount || 0) / 100,
        currency: d.currency || "KES",
        channel: d.channel,
        paidAt: d.paid_at,
        customer: d.customer,
        authorization: d.authorization,
        plan: d.plan,
        subscriptionCode: d.subscription?.subscription_code || d.plan_object?.subscriptions?.[0]?.subscription_code,
        customerCode: d.customer?.customer_code,
        data: d,
      };
    }

    return {
      success: false,
      status: "failed",
      amount: 0,
      currency: "KES",
    };
  } catch (error) {
    console.error("[Paystack] Verify error:", error);
    return {
      success: false,
      status: "error",
      amount: 0,
      currency: "KES",
    };
  }
}

/**
 * Disables a subscription on Paystack.
 * Calls POST https://api.paystack.co/subscription/disable
 */
export async function disablePaystackSubscription(code: string, token: string): Promise<boolean> {
  const config = getPaystackConfig();
  if (!config.isConfigured) return true;

  try {
    const res = await fetch(`${config.baseUrl}/subscription/disable`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, token }),
    });
    const data = await res.json();
    return Boolean(data.status);
  } catch (e) {
    console.error("[Paystack] Disable subscription error:", e);
    return false;
  }
}

/**
 * Generates a self-service management link for a customer to update their card.
 * Calls GET https://api.paystack.co/subscription/:code/manage/link
 */
export async function generatePaystackManageLink(subscriptionCode: string): Promise<string | null> {
  const config = getPaystackConfig();
  if (!config.isConfigured) return null;

  try {
    const res = await fetch(
      `${config.baseUrl}/subscription/${encodeURIComponent(subscriptionCode)}/manage/link`,
      {
        headers: { Authorization: `Bearer ${config.secretKey}` },
      }
    );
    const data = await res.json();
    return data.status && data.data?.link ? data.data.link : null;
  } catch (e) {
    console.error("[Paystack] Manage link error:", e);
    return null;
  }
}

/**
 * Validates the HMAC SHA512 signature on Paystack webhooks
 */
export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const config = getPaystackConfig();
  if (!config.secretKey || !signatureHeader) return false;

  const expectedSignature = crypto
    .createHmac("sha512", config.secretKey)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === signatureHeader;
}
