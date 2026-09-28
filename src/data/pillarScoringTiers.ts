// Pillar scoring tiers: status bands and recommendations per pillar (0-25 scale).
// From: scoring.json

export interface PillarScoringTier {
  status: string;
  minScore: number;
  maxScore: number;
  recommendation: string;
}

export interface PillarScoringDefinition {
  pillarId: number;
  name: string;
  tiers: PillarScoringTier[];
}

export const PILLAR_SCORING_DEFINITIONS: Record<number, PillarScoringDefinition> = {
  1: {
    pillarId: 1,
    name: "Pillar 1 — Smart Farming & Digital Transformation",
    tiers: [
      {
        status: "Critical Weakness",
        minScore: 0,
        maxScore: 5,
        recommendation: "Establish the foundations for technology-enabled farming. Identify priority farm challenges that could be addressed through technology, strengthen basic digital skills, and begin keeping essential farm information and records. Seek practical support before making significant technology investments.",
      },
      {
        status: "Developing Area",
        minScore: 6,
        maxScore: 10,
        recommendation: "Build confidence in using appropriate technologies and digital tools across your farm. Strengthen farm record management, improve digital skills, and begin using farm information such as production, weather, financial, and market data to support decisions.",
      },
      {
        status: "Progressing",
        minScore: 11,
        maxScore: 15,
        recommendation: "Expand and integrate technology and data into routine farm management. Focus on improving the consistency and quality of farm records, using data more regularly in decision-making, and evaluating whether adopted technologies are improving farm performance.",
      },
      {
        status: "Core Strength",
        minScore: 16,
        maxScore: 20,
        recommendation: "Your farm has established strong digital and technology capabilities. Continue integrating your systems, improving data quality, adopting technologies with demonstrated value, and using farm information to optimize productivity, efficiency, and profitability.",
      },
      {
        status: "Strategic Advantage",
        minScore: 21,
        maxScore: 25,
        recommendation: "Technology and data are strategic strengths of your farm. Continue exploring emerging technologies, advanced analytics, automation, and integrated farm systems. Document successful innovations and consider demonstrating effective technology adoption to other farmers.",
      },
    ],
  },
  2: {
    pillarId: 2,
    name: "Pillar 2 — Productive Use of Renewable Energy (P.U.R.E.)",
    tiers: [
      {
        status: "Critical Weakness",
        minScore: 0,
        maxScore: 5,
        recommendation: "Establish a clear understanding of your farm's energy needs, sources, costs, and constraints. Identify activities where unreliable or expensive energy limits productivity and explore appropriate renewable energy options before investing.",
      },
      {
        status: "Developing Area",
        minScore: 6,
        maxScore: 10,
        recommendation: "Strengthen energy planning and begin adopting practical energy-efficiency and renewable-energy solutions. Prioritize technologies that address important production constraints and have a clear operational or financial benefit.",
      },
      {
        status: "Progressing",
        minScore: 11,
        maxScore: 15,
        recommendation: "Improve the productive use of energy across farm operations. Monitor energy consumption and costs, strengthen maintenance and management practices, and expand energy use into productive activities such as irrigation, cooling, mechanisation, storage, or processing where viable.",
      },
      {
        status: "Core Strength",
        minScore: 16,
        maxScore: 20,
        recommendation: "Your farm is using energy effectively to support production and business performance. Continue improving efficiency, reliability, maintenance, productive applications, and resilience while assessing opportunities to reduce energy costs further.",
      },
      {
        status: "Strategic Advantage",
        minScore: 21,
        maxScore: 25,
        recommendation: "Productive and renewable energy use is a strategic strength of your farm. Continue optimizing energy systems, exploring innovative productive-use technologies and strengthening energy resilience. Document performance and demonstrate viable productive-energy models where appropriate.",
      },
    ],
  },
  3: {
    pillarId: 3,
    name: "Pillar 3 — Food Safety, Quality & Compliance",
    tiers: [
      {
        status: "Critical Weakness",
        minScore: 0,
        maxScore: 5,
        recommendation: "Prioritize basic food safety and quality practices immediately. Strengthen farm hygiene, safe input use, handling practices, record keeping, and awareness of the standards applicable to your products and target markets.",
      },
      {
        status: "Developing Area",
        minScore: 6,
        maxScore: 10,
        recommendation: "Formalize safe production and handling practices across the farm. Improve product quality management, traceability, documentation, hygiene procedures, and understanding of regulatory and buyer requirements.",
      },
      {
        status: "Progressing",
        minScore: 11,
        maxScore: 15,
        recommendation: "Strengthen consistency in food safety, quality, traceability, and compliance. Identify remaining weaknesses, improve documentation and internal controls, and begin preparing for relevant certification or higher-standard markets where commercially appropriate.",
      },
      {
        status: "Core Strength",
        minScore: 16,
        maxScore: 20,
        recommendation: "Your farm demonstrates strong food safety and quality management. Maintain compliance, strengthen traceability and documentation, monitor changing market requirements, and pursue relevant certifications that could improve market access.",
      },
      {
        status: "Strategic Advantage",
        minScore: 21,
        maxScore: 25,
        recommendation: "Food safety, quality, and compliance are strategic strengths of your farm. Maintain rigorous standards, pursue advanced certifications or premium markets where valuable, strengthen traceability systems, and demonstrate good practices to buyers and other farmers.",
      },
    ],
  },
  4: {
    pillarId: 4,
    name: "Pillar 4 — Indigenous Knowledge & Climate Resilience",
    tiers: [
      {
        status: "Critical Weakness",
        minScore: 0,
        maxScore: 5,
        recommendation: "Identify the major climate and environmental risks affecting your farm and begin establishing basic resilience practices. Document useful local knowledge and prioritize measures that protect soil, water, crops, livestock, and other critical farm resources.",
      },
      {
        status: "Developing Area",
        minScore: 6,
        maxScore: 10,
        recommendation: "Strengthen climate-risk management by combining proven local knowledge with climate information and appropriate climate-smart practices. Improve soil and water conservation, production planning, diversification, and preparedness for climate shocks.",
      },
      {
        status: "Progressing",
        minScore: 11,
        maxScore: 15,
        recommendation: "Integrate climate resilience more consistently into farm planning and operations. Monitor climate risks, evaluate adaptation practices, strengthen resource conservation, and test innovations that improve the farm's ability to withstand and recover from shocks.",
      },
      {
        status: "Core Strength",
        minScore: 16,
        maxScore: 20,
        recommendation: "Your farm demonstrates strong resilience capabilities. Continue integrating local knowledge, scientific information, conservation, adaptation, and innovation while monitoring how well these practices protect productivity and farm resources.",
      },
      {
        status: "Strategic Advantage",
        minScore: 21,
        maxScore: 25,
        recommendation: "Climate resilience is a strategic strength of your farm. Continue developing adaptive practices, documenting effective indigenous and climate-smart approaches, experimenting responsibly with new solutions, and sharing successful resilience practices.",
      },
    ],
  },
  5: {
    pillarId: 5,
    name: "Pillar 5 — Farm Business Performance & Growth",
    tiers: [
      {
        status: "Critical Weakness",
        minScore: 0,
        maxScore: 5,
        recommendation: "Establish basic farm business management systems. Prioritize financial records, separation of farm and household finances, understanding production costs and revenues, and basic budgeting before pursuing significant expansion.",
      },
      {
        status: "Developing Area",
        minScore: 6,
        maxScore: 10,
        recommendation: "Strengthen financial management and begin regularly measuring farm performance. Improve record keeping, cost control, cash-flow planning, budgeting, profitability analysis, and understanding of which farm enterprises generate or lose value.",
      },
      {
        status: "Progressing",
        minScore: 11,
        maxScore: 15,
        recommendation: "Use financial and production information more consistently to improve performance. Strengthen enterprise profitability analysis, productivity monitoring, cash-flow management, risk planning, and evidence-based growth decisions.",
      },
      {
        status: "Core Strength",
        minScore: 16,
        maxScore: 20,
        recommendation: "Your farm demonstrates strong business management capabilities. Continue optimizing costs, productivity, profitability, cash flow, and resource allocation while developing a disciplined strategy for sustainable growth and scalability.",
      },
      {
        status: "Strategic Advantage",
        minScore: 21,
        maxScore: 25,
        recommendation: "Business performance is a strategic strength of your farm. Continue pursuing efficiency, diversification and scalable growth opportunities supported by strong financial analysis. Benchmark performance and document the business systems contributing to your success.",
      },
    ],
  },
  6: {
    pillarId: 6,
    name: "Pillar 6 — Human Capital, Leadership & Farm Operations",
    tiers: [
      {
        status: "Critical Weakness",
        minScore: 0,
        maxScore: 5,
        recommendation: "Establish clear roles, responsibilities, basic work procedures, and workforce requirements. Address critical skills gaps and ensure workers understand their responsibilities, safe working practices, and expected standards.",
      },
      {
        status: "Developing Area",
        minScore: 6,
        maxScore: 10,
        recommendation: "Strengthen workforce planning, recruitment, training, supervision, and day-to-day farm operations. Introduce clearer work schedules, responsibilities, standard procedures, performance expectations, and basic worker wellbeing practices.",
      },
      {
        status: "Progressing",
        minScore: 11,
        maxScore: 15,
        recommendation: "Improve consistency and coordination across farm operations. Strengthen SOPs, skills development, productivity management, communication, delegation, workplace safety, and leadership practices.",
      },
      {
        status: "Core Strength",
        minScore: 16,
        maxScore: 20,
        recommendation: "Your farm has strong people and operational management systems. Continue developing staff capabilities, improving operational efficiency, strengthening leadership and culture, and creating systems that reduce dependence on individual people.",
      },
      {
        status: "Strategic Advantage",
        minScore: 21,
        maxScore: 25,
        recommendation: "Human capital and farm operations are strategic strengths. Continue developing leadership, succession, workforce wellbeing, advanced skills, accountability, and operational excellence. Document effective systems that can support expansion and replication.",
      },
    ],
  },
  7: {
    pillarId: 7,
    name: "Pillar 7 — Market Access, Customer Value & Competitiveness",
    tiers: [
      {
        status: "Critical Weakness",
        minScore: 0,
        maxScore: 5,
        recommendation: "Develop a basic understanding of who your customers are, what they require, and where viable markets exist. Avoid expanding production without clear market information and begin building relationships with potential buyers.",
      },
      {
        status: "Developing Area",
        minScore: 6,
        maxScore: 10,
        recommendation: "Strengthen market access by gathering market information, understanding customer requirements, improving buyer relationships, and aligning production decisions with realistic demand and quality expectations.",
      },
      {
        status: "Progressing",
        minScore: 11,
        maxScore: 15,
        recommendation: "Strengthen your competitive position through regular market intelligence, stronger customer relationships, improved product quality and differentiation, value addition, and diversification into appropriate market channels.",
      },
      {
        status: "Core Strength",
        minScore: 16,
        maxScore: 20,
        recommendation: "Your farm has strong market capabilities. Continue strengthening buyer relationships, monitoring competitors and market trends, diversifying channels, improving customer value, and exploring higher-value market opportunities.",
      },
      {
        status: "Strategic Advantage",
        minScore: 21,
        maxScore: 25,
        recommendation: "Market access and competitiveness are strategic strengths. Continue building your market position, brand and customer relationships while exploring premium, institutional, regional or export opportunities and strategic value-chain partnerships.",
      },
    ],
  },
  8: {
    pillarId: 8,
    name: "Pillar 8 — Investment Readiness & Enterprise Development",
    tiers: [
      {
        status: "Critical Weakness",
        minScore: 0,
        maxScore: 5,
        recommendation: "Establish the foundations required for external financing or investment. Prioritize business registration and governance where applicable, reliable financial and production records, basic business planning, and understanding your farm's financing needs.",
      },
      {
        status: "Developing Area",
        minScore: 6,
        maxScore: 10,
        recommendation: "Strengthen your farm's credibility with potential financiers and partners. Improve legal and governance documentation, financial records, business plans, financing requirements, and understanding of appropriate funding options.",
      },
      {
        status: "Progressing",
        minScore: 11,
        maxScore: 15,
        recommendation: "Prepare the farm more systematically for financing and investment opportunities. Strengthen financial statements, forecasts, business documentation, governance, risk management, growth plans, and evidence demonstrating the farm's ability to use and repay or generate returns on capital.",
      },
      {
        status: "Core Strength",
        minScore: 16,
        maxScore: 20,
        recommendation: "Your farm demonstrates strong investment-readiness capabilities. Maintain accurate documentation, strengthen governance and financial planning, develop credible investment proposals, and pursue financing and strategic partnerships aligned with your growth strategy.",
      },
      {
        status: "Strategic Advantage",
        minScore: 21,
        maxScore: 25,
        recommendation: "Investment readiness is a strategic strength of your farm. Maintain due-diligence-ready records and governance, pursue appropriate capital strategically, strengthen investor and partner relationships, and demonstrate your ability to deploy capital effectively for sustainable growth.",
      },
    ],
  },
};

export function getPillarScoringTier(
  pillarId: number,
  score: number
): PillarScoringTier {
  const definition = PILLAR_SCORING_DEFINITIONS[pillarId];
  const fallback = PILLAR_SCORING_DEFINITIONS[1];
  const clamped = Math.max(0, Math.min(25, Math.round(score)));
  const match = (definition || fallback).tiers.find(
    (t) => clamped >= t.minScore && clamped <= t.maxScore
  );
  return match || (definition || fallback).tiers[0];
}
