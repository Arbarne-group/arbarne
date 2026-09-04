// Capability Status Feedback Data and Utilities
// Based on the Future Farms Framework (FFF) Capability Status Guidance

export interface CapabilityStatusTier {
  level: number; // 0 to 5
  status: string; // 'Non-Existent' | 'Emerging' | 'Basic' | 'Developing' | 'Established' | 'Advanced'
  hex: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

// Brand guide Section 3: Capability Status Colors
export const CAPABILITY_STATUS_TIERS: Record<number, CapabilityStatusTier> = {
  0: {
    level: 0,
    status: "Non-Existent",
    hex: "#D32F2F",
    badgeBg: "bg-red-50",
    badgeBorder: "border-red-200",
    badgeText: "text-red-700",
  },
  1: {
    level: 1,
    status: "Emerging",
    hex: "#F57C00",
    badgeBg: "bg-orange-50",
    badgeBorder: "border-orange-200",
    badgeText: "text-orange-700",
  },
  2: {
    level: 2,
    status: "Basic",
    hex: "#FBC02D",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
    badgeText: "text-amber-800",
  },
  3: {
    level: 3,
    status: "Developing",
    hex: "#7CB342",
    badgeBg: "bg-lime-50",
    badgeBorder: "border-lime-200",
    badgeText: "text-lime-800",
  },
  4: {
    level: 4,
    status: "Established",
    hex: "#388E3C",
    badgeBg: "bg-green-50",
    badgeBorder: "border-green-200",
    badgeText: "text-green-800",
  },
  5: {
    level: 5,
    status: "Advanced",
    hex: "#1B5E20",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    badgeText: "text-emerald-900",
  },
};

export function getCapabilityTier(yesCount: number, total: number = 5): CapabilityStatusTier {
  const ratio = total > 0 ? yesCount / total : 0;
  let level = Math.round(ratio * 5);
  level = Math.max(0, Math.min(5, level));
  return CAPABILITY_STATUS_TIERS[level] || CAPABILITY_STATUS_TIERS[0];
}

// Pillar Automatic Feedback (5 Tiers based on 0-25 score scale)
export interface PillarAutomaticFeedbackTier {
  minScore: number;
  maxScore: number;
  rangeLabel: string;
  label: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  strokeColor: string;
  feedback: string;
}

export const PILLAR_AUTOMATIC_FEEDBACK_TIERS: PillarAutomaticFeedbackTier[] = [
  {
    minScore: 0,
    maxScore: 5,
    rangeLabel: "0–5",
    label: "Critical Weakness",
    badgeBg: "bg-rose-50",
    badgeBorder: "border-rose-200",
    badgeText: "text-rose-700",
    strokeColor: "#D32F2F",
    feedback:
      "This pillar requires immediate attention. Focus on establishing the foundational systems, knowledge, and practices needed to strengthen performance. Prioritize support in the lowest-scoring capabilities before progressing to more advanced interventions.",
  },
  {
    minScore: 6,
    maxScore: 10,
    rangeLabel: "6–10",
    label: "Developing Area",
    badgeBg: "bg-orange-50",
    badgeBorder: "border-orange-200",
    badgeText: "text-orange-700",
    strokeColor: "#FB8C00",
    feedback:
      "Your farm has begun developing this pillar, but important gaps remain. Continue implementing recommended practices and seek targeted support to strengthen weaker capabilities.",
  },
  {
    minScore: 11,
    maxScore: 15,
    rangeLabel: "11–15",
    label: "Progressing",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
    badgeText: "text-amber-800",
    strokeColor: "#FDD835",
    feedback:
      "Your farm is making good progress in this pillar. Focus on improving consistency across all capabilities and addressing remaining weaknesses to achieve stronger overall performance.",
  },
  {
    minScore: 16,
    maxScore: 20,
    rangeLabel: "16–20",
    label: "Core Strength",
    badgeBg: "bg-green-50",
    badgeBorder: "border-green-200",
    badgeText: "text-green-700",
    strokeColor: "#43A047",
    feedback:
      "This pillar is performing well and contributes positively to your farm's overall development. Maintain existing good practices while focusing on continuous improvement and innovation.",
  },
  {
    minScore: 21,
    maxScore: 25,
    rangeLabel: "21–25",
    label: "Strategic Advantage",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    badgeText: "text-emerald-800",
    strokeColor: "#009924",
    feedback:
      "Congratulations! This pillar is a major strength of your farm. Continue maintaining high standards, embrace innovation, and consider sharing your experience to support other farmers and demonstrate future-ready practices.",
  },
];

export function getPillarAutomaticFeedback(
  totalScore: number,
  totalQuestions: number = 25
): PillarAutomaticFeedbackTier {
  const normalized =
    totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 25) : totalScore;
  const clamped = Math.max(0, Math.min(25, normalized));

  const tier = PILLAR_AUTOMATIC_FEEDBACK_TIERS.find(
    (t) => clamped >= t.minScore && clamped <= t.maxScore
  );

  return tier || PILLAR_AUTOMATIC_FEEDBACK_TIERS[0];
}

// Exact verbatim Capability Status Feedback for Pillar 5
export const PILLAR_5_CAPABILITY_FEEDBACK: Record<string, Record<number, string>> = {
  "P5.1": {
    0: "Your farm has not yet established the basic financial knowledge and record-management practices needed to manage it as a business. Begin by understanding key financial concepts and consistently recording farm income, expenses, production, sales and other important business information.",
    1: "Your farm is beginning to develop financial literacy and record-keeping practices, but significant gaps remain. Strengthen your understanding of basic farm finances and make recording transactions and farm activities a regular part of your management routine.",
    2: "Your farm has established some financial and record-management foundations. Build on these by improving the completeness, accuracy and organisation of your records and strengthening your understanding of how financial information reflects farm performance.",
    3: "Your farm demonstrates good progress in financial literacy and record management. Continue improving record consistency, separating farm and personal finances, and regularly reviewing financial and operational records to support business decisions.",
    4: "Your farm demonstrates strong financial literacy and maintains reliable records across most important business activities. Address remaining gaps and strengthen record accuracy, organisation, review and appropriate use of digital systems.",
    5: "Congratulations! Your farm demonstrates advanced financial literacy and farm record management. Continue maintaining high-quality records and using reliable financial and operational information to strengthen planning, accountability and long-term business performance.",
  },
  "P5.2": {
    0: "Your farm does not yet systematically determine its costs, revenues or profitability. Begin by identifying what it costs to operate and produce your major farm products and comparing these costs with the income generated.",
    1: "Your farm is beginning to understand costs and revenues, but profitability management remains limited. Strengthen your ability to track production costs and sales income so you can determine whether your farm enterprises are generating a profit.",
    2: "Your farm has established some understanding of costs, revenue and profitability. Build on this by calculating profitability for individual enterprises, understanding cost per unit and identifying the main factors affecting your margins.",
    3: "Your farm demonstrates good progress in managing costs, revenue and profitability. Continue using profitability information to guide production, pricing and investment decisions and identify opportunities to improve margins.",
    4: "Your farm demonstrates strong profitability management, with most major costs, revenues and margins understood and actively managed. Address remaining gaps and strengthen cost control, enterprise comparison and profitability optimisation.",
    5: "Congratulations! Your farm demonstrates advanced cost, revenue and profitability management. Continue monitoring margins, identifying efficiency opportunities and using profitability analysis strategically to guide enterprise, pricing and investment decisions.",
  },
  "P5.3": {
    0: "Your farm does not yet systematically measure productivity or business performance. Begin by identifying a few important indicators that show how effectively your farm is using land, labour, inputs and other resources to generate results.",
    1: "Your farm has started monitoring some aspects of performance, but measurement remains limited. Strengthen this capability by consistently tracking key production and business indicators relevant to your farm enterprises.",
    2: "Your farm monitors some productivity and performance indicators. Build on this by establishing clear targets, comparing actual results with previous production cycles and identifying areas where resources are not being used efficiently.",
    3: "Your farm demonstrates good progress in productivity and performance management. Continue strengthening performance monitoring, comparing results against targets and using the information to address inefficiencies and operational bottlenecks.",
    4: "Your farm demonstrates strong productivity and performance management across most important areas. Address remaining gaps and strengthen benchmarking, performance analysis and regular management reviews to drive further improvement.",
    5: "Congratulations! Your farm demonstrates advanced productivity and performance management. Continue monitoring key indicators, benchmarking results, refining targets and using performance information to continuously improve efficiency, productivity and overall business performance.",
  },
  "P5.4": {
    0: "Your farm has not yet established financial planning, cash-flow management or business-risk practices. Begin by preparing simple budgets, understanding when money enters and leaves the farm, and identifying the major risks that could disrupt operations.",
    1: "Your farm is beginning to plan its finances and recognise business risks, but significant gaps remain. Strengthen budgeting, monitor cash inflows and outflows and identify periods when the farm may experience financial pressure.",
    2: "Your farm has established some budgeting, cash-flow and risk-management practices. Build on these by forecasting future cash needs, identifying seasonal financing gaps and developing practical responses to major production, financial, market and operational risks.",
    3: "Your farm demonstrates good progress in financial planning and risk management. Continue strengthening cash-flow forecasting, contingency planning and measures that help the business prepare for and respond to disruptions.",
    4: "Your farm demonstrates strong cash-flow, planning and risk-management capability. Address remaining gaps and strengthen financial reserves, risk-mitigation measures, scenario planning and business-continuity arrangements where appropriate.",
    5: "Congratulations! Your farm demonstrates advanced cash-flow, planning and risk management. Continue reviewing financial forecasts, monitoring emerging risks and strengthening the farm's ability to maintain operations and financial stability under changing conditions.",
  },
  "P5.5": {
    0: "Your farm has not yet established a clear strategy for business growth and improvement. Begin by defining where you want the farm business to be in the future and identifying realistic opportunities for improving or expanding its operations.",
    1: "Your farm is beginning to consider growth opportunities, but growth planning remains limited. Develop clearer business goals and identify the main opportunities, resources and constraints that could influence future growth.",
    2: "Your farm has established some growth goals and improvement activities. Build on these by assessing whether your people, finances, markets, infrastructure, technology and operational systems can support the growth you are considering.",
    3: "Your farm demonstrates good progress in planning for growth and continuous improvement. Continue strengthening your growth strategy, addressing operational constraints and ensuring expansion does not undermine profitability, quality, resilience or efficiency.",
    4: "Your farm demonstrates strong growth and scalability capability, with most of the systems required for sustainable expansion in place. Address remaining constraints and strengthen strategic reviews, standardised systems and performance monitoring as the enterprise grows.",
    5: "Congratulations! Your farm demonstrates advanced growth strategy, scalability and continuous improvement. Continue identifying strategic opportunities, strengthening systems and reviewing performance to ensure that growth remains profitable, efficient, resilient and sustainable.",
  },
};

/**
 * Retrieves the tailored status feedback guidance for a capability and score.
 * Falls back dynamically to a high-quality contextual response if not explicitly in the dataset.
 */
export function getCapabilityFeedbackText(
  capabilityId: string,
  yesCount: number,
  capabilityName: string
): string {
  const level = Math.max(0, Math.min(5, yesCount));

  if (PILLAR_5_CAPABILITY_FEEDBACK[capabilityId]?.[level]) {
    return PILLAR_5_CAPABILITY_FEEDBACK[capabilityId][level];
  }

  // Dynamic contextual fallback for capabilities across all pillars
  switch (level) {
    case 0:
      return `Your farm has not yet established foundational practices in ${capabilityName.toLowerCase()}. Begin by identifying baseline operational requirements and introducing simple, consistent initial routines.`;
    case 1:
      return `Your farm is beginning to develop practices in ${capabilityName.toLowerCase()}, but significant operational gaps remain. Focus on creating structured management habits and addressing high-impact quick wins.`;
    case 2:
      return `Your farm has established basic foundations in ${capabilityName.toLowerCase()}. Build on these by strengthening record accuracy, process consistency, and awareness of key performance factors.`;
    case 3:
      return `Your farm demonstrates good developing progress in ${capabilityName.toLowerCase()}. Continue standardizing workflows, reviewing operational indicators, and using data to guide farm decisions.`;
    case 4:
      return `Your farm demonstrates strong, established capabilities in ${capabilityName.toLowerCase()} across most core areas. Address remaining gaps and integrate digital verification where appropriate.`;
    case 5:
    default:
      return `Congratulations! Your farm demonstrates advanced, exemplary maturity in ${capabilityName.toLowerCase()}. Continue maintaining high operational standards, benchmarking performance, and driving continuous improvement.`;
  }
}
