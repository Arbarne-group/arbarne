/**
 * Farm Business Profile: shared option lists, hover explanations, and the
 * completeness evaluation used by /overview (ribbon vs. cards).
 */

export interface FieldOption {
  id: string;
  title: string;
  desc?: string;
  badge?: string;
}

export interface SpecField {
  key: string;
  label: string;
  explain: string;
}

export const TENURE_OPTIONS: FieldOption[] = [
  { id: "freehold", title: "Freehold (Owned with Title Deed)", desc: "Private deeded ownership" },
  { id: "leasehold", title: "Leasehold (Rented / Leased)", desc: "Long or short-term lease agreement" },
  { id: "communal_family", title: "Family / Customary Land", desc: "Ancestral or community-held land" },
];

export const WATER_OPTIONS: FieldOption[] = [
  { id: "borehole_solar", title: "Borehole / Well (with Solar Pump)", badge: "Reliable Year-round", desc: "Deep borehole with solar-powered pumping system." },
  { id: "rainwater_dam", title: "Rainwater Harvesting / Dam", badge: "Storage Basin", desc: "Earth dam and rooftop rainwater collection tanks." },
  { id: "river_stream", title: "River / Stream nearby", badge: "Seasonal", desc: "Natural flow from nearby stream or river boundary." },
  { id: "piped_municipal", title: "Piped Water / Municipal", badge: "Metered", desc: "Connected to local county or community piped supply." },
];

export const ENERGY_OPTIONS: FieldOption[] = [
  { id: "solar_pv", title: "Solar PV Water Pumping", desc: "Photovoltaic surface/borehole pump system." },
  { id: "national_grid", title: "National Grid Electricity", desc: "Mains 3-phase or single-phase utility connection." },
  { id: "generator", title: "Diesel / Petrol Generator", desc: "Portable fuel engines powering water pumps or shredders." },
  { id: "gravity", title: "Gravity / Non-powered", desc: "Highland elevation stream feeds, hand pumps, or manual carrying." },
];

export const ENTERPRISE_OPTIONS: FieldOption[] = [
  { id: "vegetables_horticulture", title: "Vegetables & Horticulture", desc: "Tomatoes, Capsicum, Leafy Greens" },
  { id: "dairy_livestock", title: "Dairy & Livestock", desc: "Dairy cows, goats, sheep" },
  { id: "cereals_staples", title: "Cereals & Staple Crops", desc: "Maize, beans, sorghum" },
  { id: "poultry_smallstock", title: "Poultry & Small Stock", desc: "Layers, broilers, apiary/bees" },
];

export const STRATEGIC_CHAIN_OPTIONS: FieldOption[] = [
  { id: "value_addition", title: "Value addition & processing", desc: "Sorting, grading, packaging and branding for premium prices." },
  { id: "seed_production", title: "Seed production & multiplication", desc: "Certified seed bulking for sale to other farmers." },
  { id: "export_horticulture", title: "Export horticulture", desc: "French beans, avocado, herbs for export contracts." },
  { id: "agro_processing", title: "Agro-processing", desc: "Milling, drying, cooling or dairy processing on-farm." },
];

export const CASHFLOW_CHAIN_OPTIONS: FieldOption[] = [
  { id: "milk_daily", title: "Milk — daily sales", desc: "Cash in hand every single day." },
  { id: "eggs", title: "Eggs", desc: "Layers start paying back within weeks." },
  { id: "leafy_vegetables", title: "Leafy vegetables", desc: "Sukuma wiki, spinach: harvest in 4–6 weeks." },
  { id: "short_vegetables", title: "Short-season vegetables", desc: "Tomatoes, capsicum: income within one season." },
  { id: "broilers", title: "Broilers", desc: "6–8 week production cycle to cash." },
];

export const IRRIGATION_OPTIONS: FieldOption[] = [
  { id: "drip", title: "Drip irrigation", desc: "Low-pressure lines delivering water straight to roots." },
  { id: "sprinkler", title: "Sprinkler", desc: "Overhead sprinklers for pastures and cereals." },
  { id: "furrow", title: "Furrow / flood", desc: "Gravity-fed channels between crop rows." },
  { id: "greenhouse_fertigation", title: "Greenhouse fertigation", desc: "Drip + fertilizer dosing inside protected structures." },
  { id: "rainfed_only", title: "Rain-fed only", desc: "Fully dependent on seasonal rainfall." },
  { id: "none_irrigation", title: "None", desc: "No irrigation infrastructure in use." },
];

export const STORAGE_OPTIONS: FieldOption[] = [
  { id: "ambient_store", title: "Ambient store", desc: "Ventilated shed for inputs and dry produce." },
  { id: "cold_room", title: "Cold room", desc: "Refrigerated storage for milk, meat and vegetables." },
  { id: "charcoal_cooler", title: "Charcoal cooler", desc: "Low-cost evaporative cooling chamber." },
  { id: "granary", title: "Granary / dry grain store", desc: "Raised, rodent-proof grain storage." },
  { id: "milk_cooler", title: "Milk cans + cooler", desc: "Aluminium cans with immersion or bulk cooler." },
  { id: "none_storage", title: "None", desc: "No dedicated storage facility." },
];

export const PROCESSING_OPTIONS: FieldOption[] = [
  { id: "none_processing", title: "None", desc: "No on-farm processing yet." },
  { id: "milling", title: "Milling / grinding", desc: "Posho mills, feed grinders." },
  { id: "cooling", title: "Cooling / chilling", desc: "Milk chillers, cold boxes." },
  { id: "packaging", title: "Packaging & branding", desc: "Sealing, labelling and branded packs." },
  { id: "seed_processing_facility", title: "Seed processing", desc: "Cleaning, sorting and dressing seed." },
  { id: "dairy_processing_facility", title: "Dairy processing", desc: "Yoghurt, mala or cheese production." },
];

export const MARKET_TYPE_OPTIONS: FieldOption[] = [
  { id: "local_open", title: "Local open-air market", desc: "Spot cash sales in nearby town markets." },
  { id: "contract", title: "Contract farming / off-takers", desc: "Pre-agreed seasonal contracts with fixed rates." },
  { id: "retail_supermarket", title: "Supermarkets & retail", desc: "Scheduled deliveries to retail chains and groceries." },
  { id: "export_market", title: "Export market", desc: "Aggregators or exporters buying to export grade." },
  { id: "farm_gate", title: "Farm-gate sales", desc: "Brokers and neighbours buying at the farm." },
  { id: "online", title: "Online / digital sales", desc: "WhatsApp, social media and e-commerce orders." },
];

export const BUYER_OPTIONS: FieldOption[] = [
  { id: "contract_buyers", title: "Contract Buyers / Off-takers", desc: "Pre-agreed seasonal contracts with fixed supply rates and quality checks" },
  { id: "wholesale_market", title: "Local Open-Air Wholesale Market", desc: "Direct sales at open markets in regional towns" },
  { id: "brokers_gate", title: "Brokers / Aggregators at Farm Gate", desc: "Direct truck collection at the farm entrance during harvesting peak weeks" },
  { id: "direct_retail", title: "Direct to Consumers & Groceries", desc: "Weekly deliveries to local retail groceries, institutions, and neighbourhood clients" },
];

export const COMMERCIAL_YEARS_OPTIONS: FieldOption[] = [
  { id: "under_1", title: "< 1 Year (Just starting)" },
  { id: "1_3", title: "1 – 3 Years" },
  { id: "3_7", title: "3 – 7 Years" },
  { id: "over_7", title: "Over 7 Years" },
];

export const REVENUE_OPTIONS: FieldOption[] = [
  { id: "under_300k", title: "Under KES 300,000", desc: "Less than KES 25,000 / month" },
  { id: "300k_1m", title: "KES 300,000 – 1,000,000", desc: "Approx. KES 25,000 – 83,000 / month" },
  { id: "1m_3m", title: "KES 1,000,000 – 3,000,000", desc: "Approx. KES 83,000 – 250,000 / month" },
  { id: "over_3m", title: "Over KES 3,000,000", desc: "More than KES 250,000 / month commercial scale" },
];

export const REGISTRATION_OPTIONS: FieldOption[] = [
  { id: "business_name", title: "Registered business name", desc: "BN registration certificate." },
  { id: "limited", title: "Limited company", desc: "Private limited (Ltd) incorporation." },
  { id: "cooperative", title: "Cooperative society", desc: "Registered cooperative membership." },
  { id: "group", title: "Self-help group", desc: "Registered community group." },
  { id: "not_registered", title: "Not registered", desc: "Operating informally for now." },
];

export const MANAGEMENT_OPTIONS: FieldOption[] = [
  { id: "owner", title: "Owner-Managed directly by me", desc: "Direct hands-on daily supervision, budgeting, and routine operational decisions." },
  { id: "manager", title: "Employed Farm Manager", desc: "A salaried professional supervisor oversees farm activities and laborers." },
  { id: "family", title: "Family Members / Relatives", desc: "Household family members collaboratively manage farm routines and tasks." },
];

export const OBJECTIVE_OPTIONS: FieldOption[] = [
  { id: "food_security", title: "Household food security", desc: "Reliable food supply for the family first." },
  { id: "income_growth", title: "Increase farm income", desc: "Grow profit season over season." },
  { id: "export_readiness", title: "Export market readiness", desc: "Meet export grade, volumes and compliance." },
  { id: "climate_resilience", title: "Climate resilience", desc: "Water security, soil health and shock-proofing." },
  { id: "mechanization", title: "Mechanization & efficiency", desc: "Do more acres with less labour and cost." },
  { id: "employment", title: "Create rural employment", desc: "Decent jobs for youth and neighbours." },
];

/* =====================================================================
   Completeness: the business profile is complete when every item below
   is answered. Used by /overview to choose cards vs. completion ribbon.
   ===================================================================== */

export interface CompletenessItem {
  key: string;
  label: string;
  done: boolean;
}

function nonEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "number") return true;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function parseArr(v: unknown): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v !== "string" || !v.trim()) return [];
  try {
    const p = JSON.parse(v);
    if (Array.isArray(p)) return p;
    return [v];
  } catch {
    return v.split(",").map((s) => s.trim()).filter(Boolean);
  }
}

export function getBusinessProfileStatus(user: any): {
  complete: boolean;
  percent: number;
  done: number;
  total: number;
  missing: { key: string; label: string }[];
} {
  const loc = user?.farmLocation ?? {};
  const ch = user?.farmCharacteristics ?? {};
  const sys = user?.farmingSystem ?? {};
  const lab = user?.householdLabour ?? {};
  const biz = user?.businessExperience ?? {};
  const asp = user?.aspiration ?? {};
  const farmer = user?.farmerProfile ?? {};
  const goals = parseArr(user?.goalsPriorities?.goals);

  const items: CompletenessItem[] = [
    { key: "businessName", label: "Business name", done: nonEmpty(user?.business?.businessName) || nonEmpty(user?.businessName) },
    { key: "farmerRole", label: "Farmer / manager role", done: nonEmpty(farmer?.jobTitle) },
    { key: "county", label: "Location (county)", done: nonEmpty(loc?.county) },
    { key: "farmSize", label: "Total farm size", done: ch?.farmSize !== null && ch?.farmSize !== undefined && Number(ch.farmSize) > 0 },
    { key: "cultivated", label: "Production area", done: ch?.cultivatedAcres !== null && ch?.cultivatedAcres !== undefined },
    { key: "landTenure", label: "Land ownership", done: nonEmpty(ch?.landTenure) },
    { key: "enterprises", label: "Enterprises", done: parseArr(sys?.enterprises).length > 0 },
    { key: "coreChain", label: "Core value chain", done: nonEmpty(sys?.enterpriseCore) },
    { key: "strategicChain", label: "Strategic value chain", done: parseArr(sys?.enterpriseStrategic).length > 0 },
    { key: "cashflowChain", label: "Cash-flow value chain", done: parseArr(sys?.enterpriseCashFlow).length > 0 },
    { key: "irrigation", label: "Irrigation system", done: nonEmpty(sys?.irrigationMethod) },
    { key: "water", label: "Water source", done: parseArr(ch?.waterSources).length > 0 },
    { key: "energy", label: "Energy source", done: nonEmpty(sys?.energySource) },
    { key: "storage", label: "Storage facility", done: parseArr(sys?.storageFacilities).length > 0 },
    { key: "processing", label: "Processing facility", done: parseArr(sys?.processingFacilities).length > 0 },
    { key: "permanent", label: "Permanent workers", done: lab?.permanentWorkers !== null && lab?.permanentWorkers !== undefined },
    { key: "seasonal", label: "Seasonal workers", done: lab?.seasonalWorkers !== null && lab?.seasonalWorkers !== undefined },
    { key: "family", label: "Family labour", done: lab?.familyLabour !== null && lab?.familyLabour !== undefined },
    { key: "marketType", label: "Primary market type", done: nonEmpty(biz?.marketType) },
    { key: "buyers", label: "Main buyers", done: parseArr(biz?.produceBuyers).length > 0 },
    { key: "registration", label: "Business registration", done: nonEmpty(biz?.registrationStatus) },
    { key: "yearsOperating", label: "Years in operation", done: nonEmpty(biz?.commercialYears) },
    { key: "revenue", label: "Revenue band", done: nonEmpty(biz?.annualRevenueBracket) },
    { key: "objectives", label: "Farm objectives", done: goals.length > 0 || nonEmpty(asp?.twelveMonthSuccess) },
    { key: "priorities", label: "Development priorities", done: nonEmpty(asp?.developmentPriorities) },
  ];

  const done = items.filter((i) => i.done).length;
  return {
    complete: done === items.length,
    percent: Math.round((done / items.length) * 100),
    done,
    total: items.length,
    missing: items.filter((i) => !i.done).map(({ key, label }) => ({ key, label })),
  };
}
