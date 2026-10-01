/**
 * Content seed (idempotent — safe to re-run).
 *
 *  - Opportunity Desk entries (events, partner offers, programmes…)
 *  - Digital Learning materials (blogs, documents, videos…)
 *  - Solutions Hub catalogue (everything Future Farms offers directly)
 *
 * Capability links use "P1.1"-style ids from src/data/assessmentData.json.
 * An empty capabilityIds list means "general" (shown to everyone).
 *
 * Run: npx tsx prisma/seed-content.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const OPPORTUNITIES = [
  {
    key: "nakuru-dairy-field-day",
    title: "Dairy Field Day & Breed Improvement Clinic — Nakuru",
    type: "event",
    partner: "Rongai Dairy Farmers Cooperative",
    description:
      "A full-day, on-farm clinic covering heat detection, AI calendars, fodder budgeting and milk hygiene. Bring your breeding records; vets on site.",
    capabilityIds: ["P5.3", "P6.3"],
    location: "Rongai, Nakuru County",
    linkUrl: null as string | null,
  },
  {
    key: "soil-testing-camp-njoro",
    title: "Discounted Soil Testing Camp",
    type: "offer",
    partner: "Accredited soil laboratory network",
    description:
      "Subsidised soil sampling and lab analysis with plain-language fertiliser recommendations. Limited slots per camp; results in 10 working days.",
    capabilityIds: ["P4.4", "P3.2"],
    location: "Njoro, Nakuru County",
    linkUrl: null,
  },
  {
    key: "solar-irrigation-demo-day",
    title: "Solar Irrigation Demo Day",
    type: "event",
    partner: "Solar irrigation providers",
    description:
      "See solar pumps, drip kits and pay-as-you-pump models running on a working farm. Size a system for your acreage with an engineer.",
    capabilityIds: ["P2.2", "P2.4"],
    location: "Naivasha, Nakuru County",
    linkUrl: null,
  },
  {
    key: "export-market-linkage-programme",
    title: "Horticulture Export Linkage Programme",
    type: "programme",
    partner: "Horticulture exporters association",
    description:
      "A 6-week readiness track for GlobalGAP basics, traceability and buyer introductions for beans, avocado and herbs growers.",
    capabilityIds: ["P7.2", "P7.4", "P3.5"],
    location: "Nairobi & online",
    linkUrl: null,
  },
  {
    key: "milk-supply-offer-rongai",
    title: "Daily Milk Supply Contract — 200L+ Producers",
    type: "offer",
    partner: "Rongai Dairy Farmers Cooperative",
    description:
      "Guaranteed daily pickup at a negotiated base price plus quality bonuses for producers delivering 200 litres or more per day.",
    capabilityIds: ["P5.2", "P7.2"],
    location: "Nakuru County",
    linkUrl: null,
  },
  {
    key: "agri-finance-info-session",
    title: "Agri-Finance Information Session",
    type: "finance",
    partner: "Agricultural lenders forum",
    description:
      "What lenders look for: records, cash flow statements and collateral options. Includes a checklist to prepare a loan-ready file.",
    capabilityIds: ["P8.1", "P5.4"],
    location: "Online",
    linkUrl: null,
  },
  {
    key: "cold-storage-access-licenses",
    title: "Cold-Room Access Licences for Vegetable Groups",
    type: "offer",
    partner: "Cold-chain hub operator",
    description:
      "Weekly cold-room slots for farmer groups moving leafy vegetables and herbs. Cuts overnight losses before market day.",
    capabilityIds: ["P7.4", "P3.3"],
    location: "Nairobi metropolitan",
    linkUrl: null,
  },
  {
    key: "youth-agribusiness-grant-call",
    title: "Youth in Agribusiness Grant Call",
    type: "programme",
    partner: "County enterprise fund",
    description:
      "Open call for farmers aged 18–35: matching grants for equipment and inputs. Open to all, no capability prerequisites.",
    capabilityIds: [] as string[],
    location: "Nationwide",
    linkUrl: null,
  },
];

const MATERIALS = [
  {
    key: "blog-farm-records-notebook",
    title: "Farm Records That Fit in a Notebook",
    kind: "blog",
    capabilityIds: ["P5.1", "P1.3"],
    summary: "A one-page daily record layout that takes five minutes and answers the questions lenders always ask.",
    url: null as string | null,
    duration: "6 min read",
  },
  {
    key: "doc-soil-sampling-guide",
    title: "Soil Sampling: How to Take a Lab-Ready Sample",
    kind: "document",
    capabilityIds: ["P4.4", "P3.2"],
    summary: "Step-by-step: where to dig, how deep, how to mix and label so your lab results are worth acting on.",
    url: null,
    duration: "PDF • 8 pages",
  },
  {
    key: "video-reading-soil-report",
    title: "Reading Your Soil Test Report Without a Chemistry Degree",
    kind: "video",
    capabilityIds: ["P4.4"],
    summary: "pH, NPK and organic matter explained with a real Kenyan report on screen.",
    url: null,
    duration: "12 min watch",
  },
  {
    key: "doc-solar-pump-sizing",
    title: "Solar Pump Sizing Basics for 1–5 Acres",
    kind: "document",
    capabilityIds: ["P2.2"],
    summary: "Match panels, pump and tank to your head height and daily water need — with worked examples.",
    url: null,
    duration: "PDF • 10 pages",
  },
  {
    key: "video-harvest-hygiene",
    title: "Hygiene for Harvest Crews",
    kind: "video",
    capabilityIds: ["P3.2"],
    summary: "Crates, hands, blades and shade: the four contamination points buyers check first.",
    url: null,
    duration: "9 min watch",
  },
  {
    key: "blog-pricing-produce",
    title: "Pricing Your Produce: Cost-Plus in Practice",
    kind: "blog",
    capabilityIds: ["P7.1", "P5.2"],
    summary: "Work out your true cost per kilo, then set prices that survive broker negotiations.",
    url: null,
    duration: "7 min read",
  },
  {
    key: "blog-whatsapp-marketing",
    title: "Using WhatsApp to Sell Before Harvest Day",
    kind: "blog",
    capabilityIds: ["P1.2", "P7.2"],
    summary: "Broadcast lists, simple photos and mobile-money etiquette that turn followers into buyers.",
    url: null,
    duration: "5 min read",
  },
  {
    key: "doc-cash-flow-calendar",
    title: "Twelve-Month Cash Flow Calendar (Template)",
    kind: "document",
    capabilityIds: ["P5.4"],
    summary: "A printable calendar that maps planting, costs and expected income so lean months never surprise you.",
    url: null,
    duration: "PDF • template",
  },
  {
    key: "doc-pesticide-safety-phi",
    title: "Pesticide Safety & Pre-Harvest Intervals",
    kind: "document",
    capabilityIds: ["P3.2", "P3.4"],
    summary: "Which products need how many days before harvest, protective gear checklists and spray records.",
    url: null,
    duration: "PDF • 6 pages",
  },
  {
    key: "blog-welcome-digital-learning",
    title: "Welcome to Digital Learning",
    kind: "blog",
    capabilityIds: [] as string[],
    summary: "How learning materials unlock from your assessment results, and what to expect as new content lands.",
    url: null,
    duration: "3 min read",
  },
];

const SOLUTIONS = [
  {
    key: "farmer-training-extension",
    name: "Farmer Training & Extension",
    tagline: "Practical courses on your farm or at our demo sites",
    description:
      "Short, hands-on courses for you and your workers: crop and livestock production, safe chemical use, farm records, business skills and digital tools. Delivered on-farm, at demo sites or online, with certificates on completion.",
    category: "education",
    contact: "training@futurefarms.africa",
    linkUrl: null as string | null,
  },
  {
    key: "soil-water-lab-testing",
    name: "Soil & Water Laboratory Testing",
    tagline: "Accredited analysis with plain-language recommendations",
    description:
      "We collect soil and irrigation-water samples, run them through accredited laboratories, and return results with clear fertiliser and amendment guidance — plus a walkthrough of what changed on your farm.",
    category: "lab-testing",
    contact: "lab@futurefarms.africa",
    linkUrl: null,
  },
  {
    key: "irrigation-design-installation",
    name: "Irrigation Design & Installation",
    tagline: "Right-sized drip and solar pumping for 1–50 acres",
    description:
      "Survey, design, supply and installation of drip, sprinkler and solar-pumped systems, with maintenance plans and operator training included.",
    category: "infrastructure",
    contact: "irrigation@futurefarms.africa",
    linkUrl: null,
  },
  {
    key: "cold-chain-storage",
    name: "Cold-Chain & Storage Services",
    tagline: "Keep harvest fresh from field to buyer",
    description:
      "Access to shared cold rooms, charcoal coolers and hermetic storage, plus guidance on harvest timing and handling that cut post-harvest losses.",
    category: "post-harvest",
    contact: "coldchain@futurefarms.africa",
    linkUrl: null,
  },
  {
    key: "market-linkage-desk",
    name: "Market Linkage Desk",
    tagline: "Meet buyers matched to your volume and quality",
    description:
      "We profile your production and introduce you to cooperatives, aggregators, processors and exporters buying what you grow — and help you prepare for their requirements.",
    category: "markets",
    contact: "markets@futurefarms.africa",
    linkUrl: null,
  },
  {
    key: "farm-business-setup",
    name: "Farm Business Setup",
    tagline: "Registration, records and compliance, sorted",
    description:
      "Business registration support, simple bookkeeping setup, KEBS/GlobalGAP readiness guidance and loan-file preparation so your farm reads as investment-ready.",
    category: "business",
    contact: "business@futurefarms.africa",
    linkUrl: null,
  },
];

async function main() {
  for (const o of OPPORTUNITIES) {
    await prisma.opportunity.upsert({
      where: { key: o.key },
      create: { ...o, capabilityIds: JSON.stringify(o.capabilityIds) },
      update: { ...o, capabilityIds: JSON.stringify(o.capabilityIds) },
    });
  }
  console.log(`  ${OPPORTUNITIES.length} opportunities upserted.`);

  for (const m of MATERIALS) {
    await prisma.learningMaterial.upsert({
      where: { key: m.key },
      create: { ...m, capabilityIds: JSON.stringify(m.capabilityIds) },
      update: { ...m, capabilityIds: JSON.stringify(m.capabilityIds) },
    });
  }
  console.log(`  ${MATERIALS.length} learning materials upserted.`);

  for (const s of SOLUTIONS) {
    await prisma.solution.upsert({
      where: { key: s.key },
      create: s,
      update: s,
    });
  }
  console.log(`  ${SOLUTIONS.length} solutions upserted.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
