/**
 * Current product catalogue (replaces the retired 1/4/FULL pillar plans).
 * Amounts in KES. Pillar-scoped products carry a pillarId at purchase.
 */
export interface Product {
  id: string;
  name: string;
  subheading: string;
  amount: number;
  pillarScoped: boolean;
}

export const PRODUCTS: Record<string, Product> = {
  FIRST_ASSESSMENT: {
    id: "FIRST_ASSESSMENT",
    name: "First FFMI/24 Assessment",
    subheading: "Your first full assessment, free",
    amount: 0,
    pillarScoped: false,
  },
  PILLAR_REASSESS: {
    id: "PILLAR_REASSESS",
    name: "Individual Pillar Assessment",
    subheading: "Reassess one pillar",
    amount: 1500,
    pillarScoped: true,
  },
  PILLAR_REPORT: {
    id: "PILLAR_REPORT",
    name: "Individual Pillar Report",
    subheading: "Generate one pillar report",
    amount: 1500,
    pillarScoped: true,
  },
  FFV_VERIFY: {
    id: "FFV_VERIFY",
    name: "Pillar Verification (FFV)",
    subheading: "Verify one pillar",
    amount: 2500,
    pillarScoped: true,
  },
  ANNUAL_ASSESSMENT: {
    id: "ANNUAL_ASSESSMENT",
    name: "Annual FFMI/24 Assessment",
    subheading: "Full yearly review",
    amount: 5600,
    pillarScoped: false,
  },
};

export const PILLAR_REWARD_PRICE = 500;
export const PILLAR_STANDARD_PRICE = 1500;
export const REFERRALS_FOR_REWARD = 2;
// Consumable referral credit: each qualified referral is worth KES 500,
// and at most 2 referrals' worth (KES 1,000) can be consumed per order.
export const REFERRAL_CREDIT_PER_QUALIFIED = 500;
export const MAX_REFERRAL_DISCOUNT_PER_ORDER = 1000;

export function getProduct(id: string): Product | null {
  return PRODUCTS[id] || null;
}

export function isPillarProduct(id: string): boolean {
  return getProduct(id)?.pillarScoped ?? false;
}
