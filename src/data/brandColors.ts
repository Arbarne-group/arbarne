// Official Future Farms Framework (FFF) Branding Color System
export interface PillarBrand {
  id: number;
  name: string;
  icon: string;
  element: string; // FFF, FFV, FFMI, Recommendation Engine, FAAB
  meaning: string;
  hexPrimary: string;
  hexSecondary?: string;
  iconBg: string;
  iconColor: string;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
}

export const PILLAR_BRANDS: Record<number, PillarBrand> = {
  1: {
    id: 1,
    name: "Smart Farming & Digital Transformation",
    icon: "memory",
    element: "Future Farms Framework (FFF)",
    meaning: "Sustainability, agriculture, growth",
    hexPrimary: "#009924",
    hexSecondary: "#045d61",
    iconBg: "bg-[#009924]/15",
    iconColor: "text-[#009924]",
    borderClass: "border-[#009924]/30",
    badgeBg: "bg-[#009924]/10",
    badgeText: "text-[#009924]",
  },
  2: {
    id: 2,
    name: "Productive Use of Renewable Energy",
    icon: "solar_power",
    element: "Recommendation Engine",
    meaning: "Action, improvement",
    hexPrimary: "#EF6C00",
    iconBg: "bg-[#EF6C00]/15",
    iconColor: "text-[#EF6C00]",
    borderClass: "border-[#EF6C00]/30",
    badgeBg: "bg-[#EF6C00]/10",
    badgeText: "text-[#EF6C00]",
  },
  3: {
    id: 3,
    name: "Food Safety, Quality & Compliance",
    icon: "verified",
    element: "Future Farms Verification (FFV)",
    meaning: "Trust, verification, credibility",
    hexPrimary: "#1565C0",
    iconBg: "bg-[#1565C0]/15",
    iconColor: "text-[#1565C0]",
    borderClass: "border-[#1565C0]/30",
    badgeBg: "bg-[#1565C0]/10",
    badgeText: "text-[#1565C0]",
  },
  4: {
    id: 4,
    name: "Indigenous Knowledge & Climate Resilience",
    icon: "psychology",
    element: "Future Farms Framework (FFF)",
    meaning: "Sustainability, agriculture, growth",
    hexPrimary: "#045d61",
    hexSecondary: "#009924",
    iconBg: "bg-[#045d61]/15",
    iconColor: "text-[#045d61]",
    borderClass: "border-[#045d61]/30",
    badgeBg: "bg-[#045d61]/10",
    badgeText: "text-[#045d61]",
  },
  5: {
    id: 5,
    name: "Farm Business Performance & Growth",
    icon: "trending_up",
    element: "FAAB",
    meaning: "Business, enterprise, professionalism",
    hexPrimary: "#045D61",
    hexSecondary: "#009924",
    iconBg: "bg-[#045D61]/15",
    iconColor: "text-[#045D61]",
    borderClass: "border-[#045D61]/30",
    badgeBg: "bg-[#045D61]/10",
    badgeText: "text-[#045D61]",
  },
  6: {
    id: 6,
    name: "Human Capital, Leadership & Farm Operations",
    icon: "groups",
    element: "Future Farms Verification (FFV)",
    meaning: "Trust, verification, credibility",
    hexPrimary: "#1565C0",
    iconBg: "bg-[#1565C0]/15",
    iconColor: "text-[#1565C0]",
    borderClass: "border-[#1565C0]/30",
    badgeBg: "bg-[#1565C0]/10",
    badgeText: "text-[#1565C0]",
  },
  7: {
    id: 7,
    name: "Market Access, Customer Value & Competitiveness",
    icon: "storefront",
    element: "Recommendation Engine",
    meaning: "Action, improvement",
    hexPrimary: "#EF6C00",
    iconBg: "bg-[#EF6C00]/15",
    iconColor: "text-[#EF6C00]",
    borderClass: "border-[#EF6C00]/30",
    badgeBg: "bg-[#EF6C00]/10",
    badgeText: "text-[#EF6C00]",
  },
  8: {
    id: 8,
    name: "Investment Readiness & Enterprise Development",
    icon: "account_balance",
    element: "Future Farms Maturity Index (FFMI)",
    meaning: "Excellence, achievement, benchmarking",
    hexPrimary: "#FFD700",
    iconBg: "bg-[#FFD700]/25",
    iconColor: "text-[#9E6E00]",
    borderClass: "border-[#FFD700]/50",
    badgeBg: "bg-[#FFD700]/20",
    badgeText: "text-[#9E6E00]",
  },
};
