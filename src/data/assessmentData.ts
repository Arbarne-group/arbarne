import rawData from "./assessmentData.json";

export interface AssessmentQuestion {
  id: string; // e.g. "P2.1.1"
  pillar_id: number;
  capability_id: string;
  question_number: number;
  question_text: string;
  ffv_evidence_required?: string;
  if_no_recommendation?: string;
  priority?: string;
  quick_win?: string;
  why_it_matters?: string;
  support_available?: string[];
}

export interface AssessmentCapability {
  id: string; // e.g. "P2.1"
  pillar_id: number;
  number: number;
  name: string;
  description: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentPillar {
  id: number;
  name: string;
  principle: string;
  guiding_question: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  badgeBg: string;
  seeks_to_achieve: string[];
  examples: string[];
  capabilities: AssessmentCapability[];
  feedback: {
    progressing: string;
    advanced: string;
    emerging: string;
  };
}

// Pillar Metadata & Custom Styling matching the design specification
const PILLAR_METADATA: Record<
  number,
  {
    icon: string;
    iconBg: string;
    iconColor: string;
    accentColor: string;
    badgeBg: string;
    feedback: { progressing: string; advanced: string; emerging: string };
  }
> = {
  1: {
    icon: "memory",
    iconBg: "bg-[#1E88E5]/15",
    iconColor: "text-[#1E88E5]",
    accentColor: "#1E88E5",
    badgeBg: "bg-surface-variant",
    feedback: {
      progressing:
        "Your farm demonstrates emerging smart farming systems with notable strengths in operational data logging. Expanding sensor deployment and precision irrigation control will accelerate your digital transformation.",
      advanced:
        "Exemplary digital operations with automated real-time monitoring and high technological integration across your entire farm ecosystem.",
      emerging:
        "Early awareness of digital farming potential. Initial focus should be on simple smartphone record keeping and baseline sensor metrics.",
    },
  },
  2: {
    icon: "solar_power",
    iconBg: "bg-[#FDD835]/20",
    iconColor: "text-[#FDD835]",
    accentColor: "#FDD835",
    badgeBg: "bg-surface-variant",
    feedback: {
      progressing:
        "Your farm shows a foundational understanding of energy needs but has significant opportunities to integrate more sustainable and cost-effective renewable solutions. Focusing on energy efficiency and targeted solar adoption could reduce long-term operating costs.",
      advanced:
        "Outstanding renewable energy utilization with robust solar-powered irrigation and off-grid resilience driving maximum farm productivity.",
      emerging:
        "High reliance on grid or generator fuels. Quick wins include conducting an energy audit and piloting solar pumping for core irrigation.",
    },
  },
  3: {
    icon: "verified",
    iconBg: "bg-[#43A047]/15",
    iconColor: "text-[#43A047]",
    accentColor: "#43A047",
    badgeBg: "bg-surface-variant",
    feedback: {
      progressing:
        "Good adherence to standard food hygiene and handling protocols with opportunities to strengthen post-harvest cold chains and formal certification audit trails.",
      advanced:
        "Global GAP and rigorous compliance certification ready. Impeccable traceability and chemical safety management.",
      emerging:
        "Foundational safety practices needed. Priority should be given to chemical storage protocols and structured harvesting hygiene.",
    },
  },
  4: {
    icon: "psychology",
    iconBg: "bg-[#2E7D32]/15",
    iconColor: "text-[#2E7D32]",
    accentColor: "#2E7D32",
    badgeBg: "bg-surface-variant",
    feedback: {
      progressing:
        "Active blending of traditional agroecological knowledge with modern climate adaptation methods. Expanding water retention swales and indigenous crop varieties is advised.",
      advanced:
        "Pioneering climate-resilient farm ecosystem with superior soil biodiversity, water conservation, and heritage drought-resistant crops.",
      emerging:
        "Vulnerable to extreme weather shocks. Implement agroforestry shelterbelts and soil mulching as immediate resilience quick wins.",
    },
  },
  5: {
    icon: "trending_up",
    iconBg: "bg-[#8E24AA]/15",
    iconColor: "text-[#8E24AA]",
    accentColor: "#8E24AA",
    badgeBg: "bg-surface-variant",
    feedback: {
      progressing:
        "Clear financial accounting and gross-margin tracking in place. Further profitability gains can be achieved through crop diversification and automated cash flow forecasting.",
      advanced:
        "Institutional-grade agribusiness financial performance with dependable unit economics and enterprise margin management.",
      emerging:
        "Cash flow tracking is informal. Immediate priority is separating personal from farm finances and instituting regular P&L reviews.",
    },
  },
  6: {
    icon: "groups",
    iconBg: "bg-[#3949AB]/15",
    iconColor: "text-[#3949AB]",
    accentColor: "#3949AB",
    badgeBg: "bg-surface-variant",
    feedback: {
      progressing:
        "Well-structured worker responsibilities and active talent retention. Enhancing occupational safety training and standard operating procedures will solidify team capacity.",
      advanced:
        "High-performance workforce culture with clear career paths, fair wage compliance, and continuous agricultural skill development.",
      emerging:
        "Labor operations rely primarily on informal arrangements. Establish basic written task allocations and worker safety gear.",
    },
  },
  7: {
    icon: "storefront",
    iconBg: "bg-[#FB8C00]/15",
    iconColor: "text-[#FB8C00]",
    accentColor: "#FB8C00",
    badgeBg: "bg-surface-variant",
    feedback: {
      progressing:
        "Reliable relationships with wholesale buyers and local aggregators. Direct-to-retail and contractual supply agreements represent high-growth next steps.",
      advanced:
        "Established premium market access, value-add branding, and secured multi-year purchase agreements with commercial off-takers.",
      emerging:
        "Dependence on spot-market commodity pricing. Organize collective marketing or smallholder aggregator contracts to stabilize margins.",
    },
  },
  8: {
    icon: "account_balance",
    iconBg: "bg-[#683C21]/15",
    iconColor: "text-[#683C21]",
    accentColor: "#683C21",
    badgeBg: "bg-surface-variant",
    feedback: {
      progressing:
        "Solid governance and verifiable asset registers in place. Preparing investor-ready pitch decks and debt repayment collateral plans will unlock expansion funding.",
      advanced:
        "Prime candidate for equity and blended concessionary finance with comprehensive audited books and clear enterprise governance.",
      emerging:
        "Early investment readiness stage. Build formal farm asset registers and maintain consistent banking transaction histories.",
    },
  },
};

// Assemble fully populated pillars data
export const ALL_PILLARS: AssessmentPillar[] = rawData.pillars.map(
  (p: any) => {
    const meta = PILLAR_METADATA[p.id] || {
      icon: "assignment",
      iconBg: "bg-[#1E88E5]/15",
      iconColor: "text-[#1E88E5]",
      accentColor: "#1E88E5",
      badgeBg: "bg-surface-variant",
      feedback: {
        progressing: "Solid progress with strategic opportunities to enhance capability maturity.",
        advanced: "Exemplary performance across this operational pillar.",
        emerging: "Foundational capabilities needed to establish stability.",
      },
    };

    const pillarCaps: AssessmentCapability[] = rawData.capabilities
      .filter((c: any) => c.pillar_id === p.id)
      .sort((a: any, b: any) => a.number - b.number)
      .map((c: any) => {
        const questions: AssessmentQuestion[] = rawData.questions
          .filter((q: any) => q.capability_id === c.id)
          .sort((a: any, b: any) => a.question_number - b.question_number);

        return {
          id: c.id,
          pillar_id: c.pillar_id,
          number: c.number,
          name: c.name,
          description: c.description,
          questions,
        };
      });

    return {
      id: p.id,
      name: p.name,
      principle: p.principle,
      guiding_question: p.guiding_question,
      icon: meta.icon,
      iconBg: meta.iconBg,
      iconColor: meta.iconColor,
      accentColor: meta.accentColor,
      badgeBg: meta.badgeBg,
      seeks_to_achieve: p.seeks_to_achieve || [],
      examples: p.examples || [],
      capabilities: pillarCaps,
      feedback: meta.feedback,
    };
  }
);

// Helper function to get pillar by ID (1-8)
export function getPillarById(pillarId: number): AssessmentPillar {
  const found = ALL_PILLARS.find((p) => p.id === Number(pillarId));
  return found || ALL_PILLARS[1]; // default to Pillar 2 if not found
}

// Pre-seeded answers for Pillar 2 to match the exact design mockup (14/25 = 56%)
// Capability 2.1: 3/5 Yes (60%) -> P2.1.1: yes, P2.1.2: yes, P2.1.3: no, P2.1.4: no, P2.1.5: yes
// Capability 2.2: 2/5 Yes (40%) -> P2.2.1: yes, P2.2.2: yes, P2.2.3: no, P2.2.4: no, P2.2.5: no
// Capability 2.3: 4/5 Yes (80%) -> P2.3.1: yes, P2.3.2: yes, P2.3.3: yes, P2.3.4: yes, P2.3.5: no
// Capability 2.4: 3/5 Yes (60%) -> P2.4.1: yes, P2.4.2: yes, P2.4.3: yes, P2.4.4: no, P2.4.5: no
// Capability 2.5: 2/5 Yes (40%) -> P2.5.1: yes, P2.5.2: yes, P2.5.3: no, P2.5.4: no, P2.5.5: no
// Total Yes: 3 + 2 + 4 + 3 + 2 = 14 out of 25!
export const DEFAULT_PILLAR_2_ANSWERS: Record<string, "yes" | "no"> = {
  "P2.1.1": "yes",
  "P2.1.2": "yes",
  "P2.1.3": "no",
  "P2.1.4": "no",
  "P2.1.5": "yes", // 3/5
  "P2.2.1": "yes",
  "P2.2.2": "yes",
  "P2.2.3": "no",
  "P2.2.4": "no",
  "P2.2.5": "no", // 2/5
  "P2.3.1": "yes",
  "P2.3.2": "yes",
  "P2.3.3": "yes",
  "P2.3.4": "yes",
  "P2.3.5": "no", // 4/5
  "P2.4.1": "yes",
  "P2.4.2": "yes",
  "P2.4.3": "yes",
  "P2.4.4": "no",
  "P2.4.5": "no", // 3/5
  "P2.5.1": "yes",
  "P2.5.2": "yes",
  "P2.5.3": "no",
  "P2.5.4": "no",
  "P2.5.5": "no", // 2/5
};
