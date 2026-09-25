"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getActiveUserEmail } from "@/lib/onboardingGuard";

/* =====================================================================
   Complete Farm Profile Survey — every onboarding question on one page.
   Sections mirror the individual step pages exactly (same questions,
   same options, same API payloads), submitted as sequential step POSTs.
   ===================================================================== */

// ---------- Survey 1 options (verbatim from step pages) ----------

const JOB_OPTIONS = [
  { title: "Farm Owner", icon: "agriculture" },
  { title: "Farm Manager", icon: "manage_accounts" },
  { title: "Farm Consultant | Specialist", icon: "support_agent" },
  { title: "Farm Assistant", icon: "engineering" },
  { title: "Farm Supervisor", icon: "supervisor_account" },
];

const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1–3 years",
  "4–6 years",
  "7–10 years",
  "More than 10 years",
];

const BUSINESS_HISTORY_OPTIONS = [
  "Yes, I currently run a business",
  "Yes, I have run a business before",
  "No, this is my first business venture",
];

const EDUCATION_OPTIONS = [
  "No formal qualification",
  "secondary school",
  "Secondary school",
  "Vocational or trade certificate",
  "Undergraduate degree",
  "Postgraduate degree",
  "Other",
];

const VALUE_CHAIN_SUGGESTIONS = [
  "Horticulture & Specialty Vegetables",
  "Dairy Production",
  "Poultry & Eggs",
  "Cereals & Grains (Maize, Wheat, Rice)",
  "Coffee & Tea",
  "Livestock & Beef",
  "Aquaculture & Fish Farming",
  "Fruits & Tree Crops (Avocado, Macadamia)",
];

const ABILITY_OPTIONS = [
  "I manage most farm operations myself.",
  "I direct farm operations confidently and delegate execution to my team.",
  "I understand farm management, but I rely on a Farm Manager or technical professional for significant support.",
  "I have limited farm management experience and rely heavily on a Farm Manager or other professionals.",
  "I am new to farm management and would like structured professional support.",
];

const OPERATOR_OPTIONS = [
  "I am",
  "A Farm Manager",
  "A Farm Supervisor",
  "A family member",
  "Farm workers",
  "Operations are shared between several people",
  "No one has a clearly defined responsibility",
];

const INVOLVEMENT_OPTIONS = [
  "Very involved — I want to participate in most operational decisions.",
  "Moderately involved — I want regular updates and to approve major decisions.",
  "Strategically involved — I want to focus on business direction while the Farm Manager handles operations.",
  "Minimally involved — I prefer the Farm Manager to handle most operations and report performance to me.",
];

const DECISION_OPTIONS = [
  "Gather data and analyse the situation before acting.",
  "Talk the decision through with someone I trust.",
  "Trust my instincts and act quickly.",
  "Look for a framework, process, or expert guidance to follow.",
  "I sometimes delay decisions because I am unsure what to do.",
];

const FAILURE_OPTIONS = [
  "I change direction quickly and try a different approach.",
  "I first investigate the problem before changing course.",
  "I keep pushing the existing plan for longer.",
  "I seek an outside perspective before deciding.",
  "I sometimes struggle to decide what to do next.",
];

const OBSTACLE_LIST = [
  "Time",
  "Finance",
  "Farm management knowledge",
  "Technical knowledge",
  "Access to markets",
  "Networks and partnerships",
  "Reliable workers or management team",
  "Confidence in decision-making",
  "Clarity on what to do next",
  "Access to technology",
  "Infrastructure",
  "Other",
];

const GUIDANCE_OPTIONS = [
  "Direct — tell me clearly what is working and what needs to change.",
  "Structured — give me clear plans, actions, and deadlines.",
  "Encouraging — help me improve through supportive guidance.",
  "Consultative — discuss the options with me before making decisions.",
  "A combination of the above",
];

const FREQUENCY_OPTIONS = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Once or twice a year",
  "Rarely",
  "I do not currently track business performance",
];

const UPDATE_OPTIONS = [
  "Real-time alerts for important issues",
  "Weekly operational updates",
  "Monthly performance reports",
  "Scheduled calls or meetings with the Farm Manager",
  "A combination of digital reports and manager discussions",
];

const MANAGER_RESPONSIBILITY_ITEMS = [
  "Production planning",
  "Day-to-day operations",
  "Worker supervision",
  "Input management",
  "Cost control",
  "Farm records",
  "Production monitoring",
  "Risk management",
  "Reporting",
  "Market preparation",
];

const SUPPORT_REASON_OPTIONS = [
  "I do not have enough time to manage the farm myself.",
  "I need stronger technical and operational expertise.",
  "I want better visibility into what is happening on the farm.",
  "I want to improve productivity and profitability.",
  "I want stronger accountability from workers and service providers.",
  "I want more reliable farm records and reporting.",
  "I want to manage the farm remotely.",
  "I want to professionalize the farm as a business.",
  "Other",
];

const REMOTE_COMFORT_OPTIONS = [
  "Yes",
  "Yes, but I would like guidance on how it works",
  "Unsure",
  "No",
];

const RECORD_COMFORT_OPTIONS = [
  "Yes",
  "Mostly, but I will need support",
  "Unsure",
  "No",
];

const AUDIT_OPTIONS = [
  "Yes",
  "Yes, with prior scheduling",
  "Unsure",
  "No",
];

// ---------- Survey 2 options (verbatim from section pages) ----------

const KENYAN_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu",
  "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho",
  "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale",
  "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi",
  "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya",
  "Taita Taveta", "Tana River", "Tharaka Nithi", "Trans Nzoia", "Turkana",
  "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
];

const COMMON_SUBCOUNTIES: Record<string, string[]> = {
  nakuru: ["Naivasha", "Gilgil", "Nakuru East", "Nakuru West", "Rongai", "Subukia", "Molo", "Njoro", "Kuresoi North", "Kuresoi South", "Bahati"],
  kiambu: ["Gatundu South", "Gatundu North", "Juja", "Thika Town", "Ruiru", "Githunguri", "Kiambu", "Kiambaa", "Kabete", "Kikuyu", "Limuru", "Lari"],
  nyandarua: ["Kinangop", "Kipipiri", "Ol Kalou", "Ol Joro Orok", "Ndaragwa"],
  narok: ["Narok North", "Narok South", "Narok East", "Narok West", "Kilgoris", "Emurua Dikirr"],
  machakos: ["Machakos Town", "Mavoko", "Mwala", "Yatta", "Kangundo", "Matungulu", "Kathiani"],
  "uasin gishu": ["Ainabkoi", "Kapseret", "Kesses", "Moiben", "Soy", "Turbo"],
  nyeri: ["Tetu", "Kieni East", "Kieni West", "Mathira East", "Mathira West", "Othaya", "Mukurweini", "Nyeri Town"],
  "murang'a": ["Kangema", "Mathioya", "Kiharu", "Kigumo", "Maragua", "Kandara", "Gatanga"],
  kirinyaga: ["Mwea East", "Mwea West", "Gichugu", "Ndia", "Kirinyaga Central"],
  meru: ["Imenti North", "Imenti South", "Central Imenti", "Buuri", "Tigania East", "Tigania West", "Igembe North", "Igembe Central", "Igembe South"],
  "trans nzoia": ["Cherangany", "Kiminini", "Kwanza", "Endebess", "Saboti"],
  kericho: ["Ainamoi", "Belgut", "Bureti", "Kipkelion East", "Kipkelion West", "Soin Sigowet"],
  bomet: ["Bomet Central", "Bomet East", "Chepalungu", "Sotik", "Konoin"],
};

const LAND_TENURE_OPTIONS = [
  { id: "freehold", title: "Freehold (Owned with Title Deed)", desc: "Private deeded ownership" },
  { id: "leasehold", title: "Leasehold (Rented / Leased)", desc: "Long or short-term lease agreement" },
  { id: "communal_family", title: "Family / Customary Land", desc: "Ancestral or community-held land" },
];

const WATER_SOURCE_OPTIONS = [
  { id: "borehole_solar", title: "Borehole / Well (with Solar Pump)", badge: "Reliable Year-round", desc: "Deep borehole with solar-powered pumping system." },
  { id: "rainwater_dam", title: "Rainwater Harvesting / Dam", badge: "Storage Basin", desc: "Earth dam and rooftop rainwater collection tanks." },
  { id: "river_stream", title: "River / Stream nearby", badge: "Seasonal", desc: "Natural flow from nearby stream or river boundary." },
  { id: "piped_municipal", title: "Piped Water / Municipal", badge: "Metered", desc: "Connected to local county or community piped supply." },
];

const ENTERPRISE_OPTIONS = [
  { id: "vegetables_horticulture", title: "Vegetables & Horticulture", sub: "Tomatoes, Capsicum, Leafy Greens" },
  { id: "dairy_livestock", title: "Dairy & Livestock", sub: "Dairy cows, goats, sheep" },
  { id: "cereals_staples", title: "Cereals & Staple Crops", sub: "Maize, beans, sorghum" },
  { id: "poultry_smallstock", title: "Poultry & Small Stock", sub: "Layers, broilers, apiary/bees" },
];

const CULTIVATION_OPTIONS = [
  { id: "drip_irrigation", title: "Open-Field with Drip Irrigation", sub: "Automated precision lines installed" },
  { id: "greenhouse", title: "Greenhouse / Shade Netting", sub: "Polyhouse & controlled environment" },
  { id: "rainfed", title: "Rain-Fed Open Field", sub: "Seasonal rainfall dependent" },
  { id: "hydroponics", title: "Hydroponics / Controlled Agriculture", sub: "Soilless substrate or vertical bays" },
];

const MECHANIZATION_OPTIONS = [
  { id: "manual", title: "Manual / Hand Tools", desc: "Jembes, hoes, knapsack backpack manual sprayers." },
  { id: "walking_tiller", title: "Walking Two-Wheel Power Tiller", desc: "Single-axle rotavator walking tiller for furrow beds." },
  { id: "hired_tractor", title: "Hired Tractor & Implements", desc: "Contractor disc plowing, harrowing, and trailer transport." },
  { id: "owned_tractor", title: "Owned Tractor & Mechanized Fleet", desc: "Dedicated 4WD tractors, boom sprayers, or combine units." },
];

const ENERGY_OPTIONS = [
  { id: "solar_pv", title: "Solar PV Water Pumping", desc: "Photovoltaic surface/borehole pump system." },
  { id: "national_grid", title: "National Grid Electricity", desc: "Mains 3-phase or single-phase utility connection." },
  { id: "generator", title: "Diesel / Petrol Generator", desc: "Portable fuel engines powering water pumps or shredders." },
  { id: "gravity", title: "Gravity / Non-powered", desc: "Highland elevation stream feeds, hand pumps, or manual carrying." },
];

const COMMERCIAL_YEARS_OPTIONS = [
  { id: "under_1", label: "< 1 Year (Just starting)" },
  { id: "1_3", label: "1 – 3 Years" },
  { id: "3_7", label: "3 – 7 Years" },
  { id: "over_7", label: "Over 7 Years" },
];

const REVENUE_OPTIONS = [
  { id: "under_300k", title: "Under KES 300,000", sub: "Less than KES 25,000 / month" },
  { id: "300k_1m", title: "KES 300,000 – 1,000,000", sub: "Approx. KES 25,000 – 83,000 / month" },
  { id: "1m_3m", title: "KES 1,000,000 – 3,000,000", sub: "Approx. KES 83,000 – 250,000 / month" },
  { id: "over_3m", title: "Over KES 3,000,000", sub: "More than KES 250,000 / month commercial scale" },
];

const RECORD_KEEPING_OPTIONS = [
  { id: "physical_book", title: "Physical Record Book / Notebook", desc: "Daily farm record book, harvest ledgers, and receipt stubs" },
  { id: "mobile_excel", title: "Mobile App or Excel Spreadsheets", desc: "Excel, Google Sheets, WhatsApp notes, or agritech apps" },
  { id: "bank_mpesa", title: "Bank & M-Pesa Statements", desc: "Till numbers, mobile money SMS confirmations, and bank statements" },
  { id: "mental", title: "Informal / Mental Tracking", desc: "Personal memory and informal daily estimates without paper trail" },
];

const BUYER_OPTIONS = [
  { id: "contract_buyers", title: "Contract Buyers / Off-takers", desc: "Pre-agreed seasonal contracts with fixed supply rates and quality checks" },
  { id: "wholesale_market", title: "Local Open-Air Wholesale Market", desc: "Direct sales at open markets in regional towns" },
  { id: "brokers_gate", title: "Brokers / Aggregators at Farm Gate", desc: "Direct truck collection at the farm entrance during harvesting peak weeks" },
  { id: "direct_retail", title: "Direct to Consumers & Groceries", desc: "Weekly deliveries to local retail groceries, institutions, and neighbourhood clients" },
];

const MANAGEMENT_STRUCTURE_OPTIONS = [
  { id: "owner", title: "Owner-Managed directly by me", desc: "Direct hands-on daily supervision, budgeting, and routine operational decisions." },
  { id: "manager", title: "Employed Farm Manager", desc: "A salaried professional supervisor oversees farm activities and laborers." },
  { id: "family", title: "Family Members / Relatives", desc: "Household family members collaboratively manage farm routines and tasks." },
];

const FAIR_PRACTICE_OPTIONS = [
  { id: "equal_pay_women", title: "Equal pay and opportunities for women workers", desc: "Fair wages and leadership roles in harvest and operations." },
  { id: "ppe_clean_water", title: "Protective gear (PPE) and clean drinking water provided", desc: "Safe conditions and standard protective equipment for all hands." },
  { id: "youth_opportunities", title: "Opportunities for youth workers", desc: "Involvement in modern agritech tools, telemetry, and training." },
];

/* =====================================================================
   Shared primitives
   ===================================================================== */

function RequiredBadge() {
  return (
    <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-100 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
      <span className="material-symbols-outlined text-[14px]">warning</span>
      Required
    </span>
  );
}

function QCard({
  id,
  title,
  error,
  children,
}: {
  id: string;
  title: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className={`bg-surface-container-lowest rounded-[26px] p-6 md:p-8 border transition-all duration-200 scroll-mt-28 ${
        error
          ? "border-2 border-red-400 bg-red-50/20 shadow-[0_8px_30px_rgba(220,38,38,0.08)]"
          : "border-outline-variant/40 shadow-[0_2px_6px_rgba(25,28,29,0.04),0_12px_32px_rgba(25,28,29,0.06)] hover:shadow-[0_4px_10px_rgba(25,28,29,0.05),0_16px_40px_rgba(25,28,29,0.08)]"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <label className="block text-[15px] md:text-base font-semibold text-on-surface leading-snug">{title}</label>
        {error && <RequiredBadge />}
      </div>
      {children}
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  sub,
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  sub?: string;
  icon?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ${
        selected
          ? "border-secondary bg-secondary-container/10 ring-2 ring-secondary/40 shadow-[0_4px_14px_rgba(0,153,36,0.12)]"
          : "border-outline-variant hover:border-secondary/40 hover:bg-surface-container-low"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              selected ? "bg-secondary text-white" : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        )}
        <div>
          <div className={`text-sm font-semibold ${selected ? "text-secondary" : "text-on-surface"}`}>
            {title}
          </div>
          {sub && <div className="text-xs text-on-surface-variant mt-0.5">{sub}</div>}
        </div>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
          selected ? "border-secondary bg-secondary text-white" : "border-outline-variant"
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </button>
  );
}

function CheckCard({
  checked,
  onClick,
  title,
  sub,
  disabled,
}: {
  checked: boolean;
  onClick: () => void;
  title: string;
  sub?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border rounded-2xl p-4 flex items-center justify-between text-left transition-all ${
        checked
          ? "border-secondary bg-secondary-container/10 ring-1 ring-secondary shadow-sm cursor-pointer"
          : disabled
          ? "border-outline-variant/40 opacity-40 cursor-not-allowed bg-surface-container-lowest"
          : "border-outline-variant hover:bg-surface-container-low cursor-pointer"
      }`}
    >
      <div>
        <div className={`text-xs sm:text-sm font-medium ${checked ? "text-secondary font-semibold" : "text-on-surface"}`}>
          {title}
        </div>
        {sub && <div className="text-xs text-on-surface-variant mt-0.5">{sub}</div>}
      </div>
      <div
        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ml-2 transition-colors ${
          checked ? "bg-secondary border-secondary text-white" : "border-outline-variant"
        }`}
      >
        {checked && <span className="material-symbols-outlined text-[15px]">check</span>}
      </div>
    </button>
  );
}

function SectionHeader({
  index,
  title,
  desc,
}: {
  index: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="pt-6">
      <div className="flex items-center gap-4 mb-3">
        <span className="px-3.5 py-1.5 bg-primary text-white rounded-full text-xs font-bold tracking-widest uppercase shadow-sm whitespace-nowrap">
          {index}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-outline-variant via-outline-variant/40 to-transparent" />
      </div>
      <h2 className="text-xl md:text-[26px] font-bold text-on-surface mb-1.5 tracking-tight">{title}</h2>
      <p className="text-sm md:text-[15px] text-on-surface-variant leading-relaxed max-w-2xl">{desc}</p>
    </div>
  );
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none bg-surface transition-all placeholder:text-on-surface-variant/40 ${
        error
          ? "border-red-400 ring-2 ring-red-300"
          : "border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary"
      }`}
    />
  );
}

/* =====================================================================
   Page
   ===================================================================== */

export default function CompleteSurveyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ---- Shared identity ----
  const [farmName, setFarmName] = useState("");
  const [phone, setPhone] = useState("");

  // ---- Step 1: Farmer profile ----
  const [jobTitle, setJobTitle] = useState("");
  const [valueChain, setValueChain] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [businessHistory, setBusinessHistory] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [otherEducation, setOtherEducation] = useState("");

  // ---- Step 2: Management ----
  const [mgmtAbility, setMgmtAbility] = useState("");
  const [operationsResponsible, setOperationsResponsible] = useState("");
  const [otherOperator, setOtherOperator] = useState("");
  const [desiredInvolvement, setDesiredInvolvement] = useState("");

  // ---- Step 3: Operating style ----
  const [decisionStyle, setDecisionStyle] = useState("");
  const [failureResponse, setFailureResponse] = useState("");
  const [obstacles, setObstacles] = useState<string[]>([]);
  const [otherObstacle, setOtherObstacle] = useState("");
  const [guidancePreference, setGuidancePreference] = useState("");
  const [trackingFrequency, setTrackingFrequency] = useState("");
  const [updatePreferences, setUpdatePreferences] = useState("");

  // ---- Step 4: Aspirations ----
  const [twelveMonthSuccess, setTwelveMonthSuccess] = useState("");
  const [greatestImpactSupport, setGreatestImpactSupport] = useState("");
  const [marketInsight, setMarketInsight] = useState("");
  const [threeToFiveYearRole, setThreeToFiveYearRole] = useState("");
  const [managerResponsibilities, setManagerResponsibilities] = useState<string[]>([]);
  const [personallyApprovedDecisions, setPersonallyApprovedDecisions] = useState("");
  const [twentyFiveYearVision, setTwentyFiveYearVision] = useState("");

  // ---- Step 5: Digital platforms ----
  const [supportReasons, setSupportReasons] = useState("");
  const [otherSupportReason, setOtherSupportReason] = useState("");
  const [remoteConfidence, setRemoteConfidence] = useState("");
  const [remoteComfort, setRemoteComfort] = useState("");
  const [recordKeeping, setRecordKeeping] = useState("");
  const [physicalAudits, setPhysicalAudits] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // ---- Survey 2: Location ----
  const [locationSearch, setLocationSearch] = useState("");
  const [county, setCounty] = useState("");
  const [subcounty, setSubcounty] = useState("");
  const [ward, setWard] = useState("");
  const [landmark, setLandmark] = useState("");
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsLocated, setGpsLocated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  /* Scroll progress for the fixed topbar hairline (mobile + desktop) */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const total = el.scrollHeight - el.clientHeight;
        setScrollProgress(
          total > 0 ? Math.min(100, Math.max(0, (el.scrollTop / total) * 100)) : 100
        );
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // ---- Survey 2: Characteristics ----
  const [farmSize, setFarmSize] = useState<number | "">("");
  const [farmUnit, setFarmUnit] = useState("Acres");
  const [cultivatedAcres, setCultivatedAcres] = useState<number | "">("");
  const [grazingAcres, setGrazingAcres] = useState<number | "">("");
  const [landTenure, setLandTenure] = useState("");
  const [waterSources, setWaterSources] = useState<string[]>([]);
  const [soilTested, setSoilTested] = useState("");

  // ---- Survey 2: Farming system ----
  const [enterprises, setEnterprises] = useState<string[]>([]);
  const [cultivationMethod, setCultivationMethod] = useState("");
  const [mechanizationSetup, setMechanizationSetup] = useState("");
  const [energySource, setEnergySource] = useState("");

  // ---- Survey 2: Business experience ----
  const [commercialYears, setCommercialYears] = useState("");
  const [annualRevenueBracket, setAnnualRevenueBracket] = useState("");
  const [recordKeepingMethod, setRecordKeepingMethod] = useState("");
  const [produceBuyers, setProduceBuyers] = useState<string[]>([]);

  // ---- Survey 2: Household & labour ----
  const [permanentWorkers, setPermanentWorkers] = useState<number | "">("");
  const [seasonalWorkers, setSeasonalWorkers] = useState<number | "">("");
  const [managementStructure, setManagementStructure] = useState("");
  const [fairEmploymentPractices, setFairEmploymentPractices] = useState<string[]>([]);

  /* ---------------- Prefill from server ---------------- */
  useEffect(() => {
    const email = getActiveUserEmail();
    fetch(`/api/onboarding/step?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.stage === "FULLY_COMPLETED") {
          router.replace("/assessment");
          return;
        }
        const u = data?.user;
        if (!u) return;
        if (u.farmName) setFarmName(u.farmName);
        if (u.phone) setPhone(u.phone);

        const fp = u.farmerProfile;
        if (fp) {
          if (fp.jobTitle) setJobTitle(fp.jobTitle);
          if (fp.valueChain) setValueChain(fp.valueChain);
          if (fp.experienceYears) setExperienceYears(fp.experienceYears);
          if (fp.businessHistory) setBusinessHistory(fp.businessHistory);
          if (fp.educationLevel || fp.education) setEducationLevel(fp.educationLevel || fp.education);
          if (fp.otherEducation) setOtherEducation(fp.otherEducation);
        }

        const fm = u.farmManagement;
        if (fm) {
          if (fm.mgmtAbility) setMgmtAbility(fm.mgmtAbility);
          if (fm.operationsResponsible || fm.opsResponsibility) {
            setOperationsResponsible(fm.operationsResponsible || fm.opsResponsibility);
          } else if (fm.operators) {
            try {
              const parsed = JSON.parse(fm.operators);
              if (Array.isArray(parsed) && parsed.length > 0) setOperationsResponsible(parsed[0]);
            } catch {}
          }
          if (fm.otherOperator) setOtherOperator(fm.otherOperator);
          if (fm.desiredInvolvement) setDesiredInvolvement(fm.desiredInvolvement);
        }

        const os = u.operatingStyle;
        if (os) {
          if (os.decisionStyle) {
            if (os.decisionStyle === "data") setDecisionStyle("Gather data and analyse the situation before acting.");
            else if (os.decisionStyle === "trust") setDecisionStyle("Talk the decision through with someone I trust.");
            else if (os.decisionStyle === "instinct") setDecisionStyle("Trust my instincts and act quickly.");
            else setDecisionStyle(os.decisionStyle);
          }
          if (os.failureResponse) {
            if (os.failureResponse === "adjust" || os.failureResponse === "investigate")
              setFailureResponse("I first investigate the problem before changing course.");
            else if (os.failureResponse === "change")
              setFailureResponse("I change direction quickly and try a different approach.");
            else setFailureResponse(os.failureResponse);
          }
          if (os.obstacles) {
            try {
              const parsed = JSON.parse(os.obstacles);
              if (Array.isArray(parsed) && parsed.length > 0) setObstacles(parsed);
            } catch {}
          }
          if (os.otherObstacle) setOtherObstacle(os.otherObstacle);
          if (os.guidancePreference) setGuidancePreference(os.guidancePreference);
          if (os.trackingFrequency) setTrackingFrequency(os.trackingFrequency);
          if (os.updatePreferences || os.updatePreference)
            setUpdatePreferences(os.updatePreferences || os.updatePreference);
        }

        const asp = u.aspiration;
        if (asp) {
          if (asp.twelveMonthSuccess) setTwelveMonthSuccess(asp.twelveMonthSuccess);
          if (asp.greatestImpactSupport) setGreatestImpactSupport(asp.greatestImpactSupport);
          if (asp.marketInsight) setMarketInsight(asp.marketInsight);
          if (asp.threeToFiveYearRole) setThreeToFiveYearRole(asp.threeToFiveYearRole);
          if (asp.managerResponsibilities) {
            try {
              const parsed = JSON.parse(asp.managerResponsibilities);
              if (Array.isArray(parsed)) setManagerResponsibilities(parsed);
            } catch {
              if (typeof asp.managerResponsibilities === "string")
                setManagerResponsibilities([asp.managerResponsibilities]);
            }
          } else if (asp.handoverResponsibilities) {
            try {
              const parsed = JSON.parse(asp.handoverResponsibilities);
              if (Array.isArray(parsed)) setManagerResponsibilities(parsed);
            } catch {}
          } else if (asp.fmResponsibility) {
            setManagerResponsibilities([asp.fmResponsibility]);
          }
          if (asp.personallyApprovedDecisions) setPersonallyApprovedDecisions(asp.personallyApprovedDecisions);
          if (asp.twentyFiveYearVision) setTwentyFiveYearVision(asp.twentyFiveYearVision);
        }

        const dp = u.digitalPlatform;
        if (dp) {
          if (dp.supportReasons) {
            try {
              const parsed = JSON.parse(dp.supportReasons);
              if (Array.isArray(parsed) && parsed.length > 0) setSupportReasons(parsed[0]);
              else setSupportReasons(dp.supportReasons);
            } catch {
              setSupportReasons(dp.supportReasons);
            }
          }
          if (dp.otherSupportReason) setOtherSupportReason(dp.otherSupportReason);
          if (dp.remoteConfidence) setRemoteConfidence(dp.remoteConfidence);
          if (dp.remoteComfort) setRemoteComfort(dp.remoteComfort);
          if (dp.recordKeeping) setRecordKeeping(dp.recordKeeping);
          if (dp.physicalAudits) setPhysicalAudits(dp.physicalAudits);
          if (dp.additionalNotes) setAdditionalNotes(dp.additionalNotes);
        }

        const loc = u.farmLocation;
        if (loc) {
          if (loc.locationSearch) setLocationSearch(loc.locationSearch);
          if (loc.county) setCounty(loc.county);
          if (loc.subcounty) setSubcounty(loc.subcounty);
          if (loc.ward) setWard(loc.ward);
          if (loc.landmark) setLandmark(loc.landmark);
          if (loc.latitude && loc.longitude)
            setCoordinates({ latitude: Number(loc.latitude), longitude: Number(loc.longitude) });
        }

        const ch = u.farmCharacteristics;
        if (ch) {
          if (ch.farmSize !== null && ch.farmSize !== undefined) setFarmSize(ch.farmSize);
          if (ch.farmUnit === "Acres" || ch.farmUnit === "Hectares") setFarmUnit(ch.farmUnit);
          if (ch.cultivatedAcres !== null && ch.cultivatedAcres !== undefined) setCultivatedAcres(ch.cultivatedAcres);
          if (ch.grazingAcres !== null && ch.grazingAcres !== undefined) setGrazingAcres(ch.grazingAcres);
          if (ch.landTenure) setLandTenure(ch.landTenure);
          if (ch.soilTested) setSoilTested(ch.soilTested);
          if (ch.waterSources) {
            try {
              setWaterSources(JSON.parse(ch.waterSources));
            } catch {}
          }
        }

        const sys = u.farmingSystem;
        if (sys) {
          if (sys.cultivationMethod) setCultivationMethod(sys.cultivationMethod);
          if (sys.mechanizationSetup) setMechanizationSetup(sys.mechanizationSetup);
          if (sys.energySource) setEnergySource(sys.energySource);
          if (sys.enterprises) {
            try {
              setEnterprises(JSON.parse(sys.enterprises));
            } catch {}
          }
        }

        const biz = u.businessExperience;
        if (biz) {
          if (biz.commercialYears) setCommercialYears(biz.commercialYears);
          if (biz.annualRevenueBracket) setAnnualRevenueBracket(biz.annualRevenueBracket);
          if (biz.recordKeepingMethod) setRecordKeepingMethod(biz.recordKeepingMethod);
          if (biz.produceBuyers) {
            try {
              setProduceBuyers(JSON.parse(biz.produceBuyers));
            } catch {}
          }
        }

        const hl = u.householdLabour;
        if (hl) {
          if (hl.permanentWorkers !== null && hl.permanentWorkers !== undefined)
            setPermanentWorkers(hl.permanentWorkers);
          if (hl.seasonalWorkers !== null && hl.seasonalWorkers !== undefined)
            setSeasonalWorkers(hl.seasonalWorkers);
          if (hl.managementStructure) setManagementStructure(hl.managementStructure);
          if (hl.fairEmploymentPractices) {
            try {
              setFairEmploymentPractices(JSON.parse(hl.fairEmploymentPractices));
            } catch {}
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  /* ---------------- helpers ---------------- */
  const clearError = (key: string) =>
    setValidationErrors((prev) => prev.filter((e) => e !== key));

  const toggleInList = (
    list: string[],
    setList: (v: string[]) => void,
    item: string,
    max?: number,
    clearKey?: string
  ) => {
    let next: string[];
    if (list.includes(item)) next = list.filter((o) => o !== item);
    else if (max !== undefined && list.length >= max) return;
    else next = [...list, item];
    setList(next);
    if (clearKey && next.length > 0) clearError(clearKey);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setCoordinates(coords);
        setGpsLocated(true);
        setDetectingGps(false);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const geo = await res.json();
          if (geo?.display_name && !locationSearch) setLocationSearch(geo.display_name);
        } catch {}
      },
      () => setDetectingGps(false),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  /* ---------------- validation (mirrors each step page) ---------------- */
  const checks: { key: string; done: boolean }[] = [
    { key: "farmName", done: !!farmName.trim() },
    { key: "phone", done: !!phone.trim() },
    { key: "jobTitle", done: !!jobTitle },
    { key: "valueChain", done: !!valueChain.trim() },
    { key: "experienceYears", done: !!experienceYears },
    { key: "businessHistory", done: !!businessHistory },
    {
      key: "educationLevel",
      done: !!educationLevel && (educationLevel !== "Other" || !!otherEducation.trim()),
    },
    { key: "mgmtAbility", done: !!mgmtAbility },
    {
      key: "operationsResponsible",
      done: !!operationsResponsible || !!otherOperator.trim(),
    },
    { key: "desiredInvolvement", done: !!desiredInvolvement },
    { key: "decisionStyle", done: !!decisionStyle },
    { key: "failureResponse", done: !!failureResponse },
    { key: "obstacles", done: obstacles.length > 0 },
    {
      key: "otherObstacle",
      done: !obstacles.includes("Other") || !!otherObstacle.trim(),
    },
    { key: "guidancePreference", done: !!guidancePreference },
    { key: "trackingFrequency", done: !!trackingFrequency },
    { key: "updatePreferences", done: !!updatePreferences },
    { key: "twelveMonthSuccess", done: !!twelveMonthSuccess.trim() },
    { key: "greatestImpactSupport", done: !!greatestImpactSupport.trim() },
    { key: "marketInsight", done: !!marketInsight.trim() },
    { key: "threeToFiveYearRole", done: !!threeToFiveYearRole.trim() },
    { key: "managerResponsibilities", done: managerResponsibilities.length > 0 },
    { key: "personallyApprovedDecisions", done: !!personallyApprovedDecisions.trim() },
    { key: "twentyFiveYearVision", done: !!twentyFiveYearVision.trim() },
    { key: "supportReasons", done: !!supportReasons },
    {
      key: "otherSupportReason",
      done: supportReasons !== "Other" || !!otherSupportReason.trim(),
    },
    { key: "remoteConfidence", done: !!remoteConfidence.trim() },
    { key: "remoteComfort", done: !!remoteComfort },
    { key: "recordKeeping", done: !!recordKeeping },
    { key: "physicalAudits", done: !!physicalAudits },
    { key: "locationSearch", done: !!locationSearch.trim() },
    { key: "county", done: !!county.trim() },
    { key: "subcounty", done: !!subcounty.trim() },
    { key: "ward", done: !!ward.trim() },
    { key: "landmark", done: !!landmark.trim() },
    { key: "farmSize", done: farmSize !== "" && Number(farmSize) > 0 },
    {
      key: "landUse",
      done:
        cultivatedAcres !== "" &&
        !isNaN(Number(cultivatedAcres)) &&
        Number(cultivatedAcres) >= 0 &&
        grazingAcres !== "" &&
        !isNaN(Number(grazingAcres)) &&
        Number(grazingAcres) >= 0,
    },
    { key: "landTenure", done: !!landTenure },
    { key: "waterSources", done: waterSources.length > 0 },
    { key: "soilTested", done: !!soilTested },
    { key: "enterprises", done: enterprises.length > 0 },
    { key: "cultivationMethod", done: !!cultivationMethod },
    { key: "mechanizationSetup", done: !!mechanizationSetup },
    { key: "energySource", done: !!energySource },
    { key: "commercialYears", done: !!commercialYears.trim() },
    { key: "annualRevenueBracket", done: !!annualRevenueBracket.trim() },
    { key: "recordKeepingMethod", done: !!recordKeepingMethod.trim() },
    { key: "produceBuyers", done: produceBuyers.length > 0 },
    {
      key: "workforce",
      done:
        permanentWorkers !== "" &&
        permanentWorkers !== null &&
        !isNaN(Number(permanentWorkers)) &&
        seasonalWorkers !== "" &&
        seasonalWorkers !== null &&
        !isNaN(Number(seasonalWorkers)),
    },
    { key: "managementStructure", done: !!managementStructure.trim() },
    { key: "fairEmploymentPractices", done: fairEmploymentPractices.length > 0 },
  ];

  const missingKeys = useMemo(() => checks.filter((c) => !c.done).map((c) => c.key), [checks]);
  const answeredCount = checks.length - missingKeys.length;
  const progressPercent = Math.round((answeredCount / checks.length) * 100);
  const err = (key: string) => validationErrors.includes(key);

  /* ---------------- submit: all steps in order, then approve ---------------- */
  const handleSubmitAll = async () => {
    setSaveError(null);
    if (missingKeys.length > 0) {
      setValidationErrors(missingKeys);
      const el = document.getElementById(`q-${missingKeys[0]}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setValidationErrors([]);
    setSaving(true);
    const email = getActiveUserEmail();
    try {
      const posts: { step: string | number; data: Record<string, unknown> }[] = [
        {
          step: 1,
          data: { jobTitle, valueChain, experienceYears, businessHistory, educationLevel, otherEducation },
        },
        {
          step: 2,
          data: {
            farmName: farmName.trim(),
            phone: phone.trim(),
            mgmtAbility,
            operationsResponsible,
            opsResponsibility: operationsResponsible,
            operators: [operationsResponsible],
            otherOperator,
            desiredInvolvement,
          },
        },
        {
          step: 3,
          data: {
            decisionStyle,
            failureResponse,
            obstacles,
            otherObstacle,
            guidancePreference,
            trackingFrequency,
            updatePreferences,
            updatePreference: updatePreferences,
            communicationChannels: [updatePreferences],
          },
        },
        {
          step: 4,
          data: {
            twelveMonthSuccess,
            greatestImpactSupport,
            marketInsight,
            threeToFiveYearRole,
            managerResponsibilities,
            fmResponsibility: managerResponsibilities[0] || "",
            handoverResponsibilities: managerResponsibilities,
            personallyApprovedDecisions,
            twentyFiveYearVision,
          },
        },
        {
          step: 5,
          data: {
            supportReasons,
            otherSupportReason,
            remoteConfidence,
            remoteComfort,
            recordKeeping,
            physicalAudits,
            additionalNotes,
          },
        },
        {
          step: "location",
          data: {
            farmName: farmName.trim(),
            phone: phone.trim(),
            locationSearch,
            county,
            subcounty,
            ward,
            landmark,
            latitude: coordinates ? coordinates.latitude : -0.99672,
            longitude: coordinates ? coordinates.longitude : 36.58678,
          },
        },
        {
          step: "characteristics",
          data: {
            farmName: farmName.trim(),
            phone: phone.trim(),
            farmSize: typeof farmSize === "number" ? farmSize : 0,
            farmUnit,
            cultivatedAcres: typeof cultivatedAcres === "number" ? cultivatedAcres : 0,
            grazingAcres: typeof grazingAcres === "number" ? grazingAcres : 0,
            landTenure,
            waterSources,
            soilTested,
          },
        },
        {
          step: "farming-system",
          data: { enterprises, cultivationMethod, mechanizationSetup, energySource },
        },
        {
          step: "business-experience",
          data: { commercialYears, annualRevenueBracket, recordKeepingMethod, produceBuyers },
        },
        {
          step: "household-labour",
          data: {
            permanentWorkers: permanentWorkers === "" ? 0 : Number(permanentWorkers),
            seasonalWorkers: seasonalWorkers === "" ? 0 : Number(seasonalWorkers),
            managementStructure,
            fairEmploymentPractices,
          },
        },
      ];

      let lastUser: unknown = null;
      for (const p of posts) {
        const res = await fetch("/api/onboarding/step", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: p.step, email, data: p.data }),
        });
        const j = await res.json();
        if (!res.ok || !j.success) {
          throw new Error(j?.error || `Failed to save section (${String(p.step)}).`);
        }
        lastUser = j.user;
      }

      const confirmRes = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "confirm-profile", email, data: {} }),
      });
      const confirmData = await confirmRes.json();
      if (confirmData.user) {
        localStorage.setItem(
          "future_farms_user",
          JSON.stringify({ ...confirmData.user, stage: "FULLY_COMPLETED" })
        );
      } else if (lastUser) {
        localStorage.setItem("future_farms_user", JSON.stringify(lastUser));
      }
      router.push("/assessment");
    } catch (e) {
      console.error(e);
      setSaveError(e instanceof Error ? e.message : "Failed to save your profile. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const subcountyList = county ? COMMON_SUBCOUNTIES[county.toLowerCase()] : undefined;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-secondary/30 border-t-secondary animate-spin" />
          <p className="text-sm text-on-surface-variant">Loading your farm profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Fixed standalone header — no sidebar on this focused input page */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-b border-surface-variant">
        <div className="px-4 md:px-10 py-3 max-w-4xl mx-auto w-full flex items-center justify-between gap-3">
          <Image
            src="/logo.webp"
            alt="Future Farms"
            width={140}
            height={34}
            className="h-8 w-auto object-contain"
            priority
          />
        </div>
        <div className="h-0.5 w-full bg-surface-container-high" title="Scroll progress">
          <div
            className="h-full bg-gradient-to-r from-secondary to-primary will-change-[width]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>
      <div className="px-4 md:px-10 pt-[84px] pb-40 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3.5 py-1.5 bg-primary text-white rounded-full text-[11px] font-bold tracking-[0.14em] uppercase shadow-sm">
              Complete Farm Profile
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              {answeredCount} of {checks.length} answered • {progressPercent}%
            </span>
          </div>
          <h1 className="text-[26px] md:text-4xl font-bold text-on-surface mb-2.5 tracking-tight leading-tight">
            Tell us about yourself &amp; your farm
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-2xl">
            Answer every question below to build your farm profile and enter the platform.
          </p>
          <div className="w-full bg-surface-container-high rounded-full h-2 mt-5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center gap-3 text-red-700 text-sm animate-fadeIn shadow-xs">
            <span className="material-symbols-outlined text-red-500 text-xl shrink-0">error</span>
            <span className="font-semibold">
              Please complete all questions before continuing ({validationErrors.length} required question{validationErrors.length > 1 ? "s" : ""} remaining).
            </span>
          </div>
        )}

        {saveError && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center gap-3 text-red-700 text-sm shadow-xs">
            <span className="material-symbols-outlined text-red-500 text-xl shrink-0">error</span>
            <span className="font-semibold">{saveError}</span>
          </div>
        )}

        <div className="space-y-8">
          {/* ============ Farm identity ============ */}
          <div>
            <SectionHeader index="Farm Identity" title="Farm Identity & Contact" desc="Your farm name and phone number." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div id="q-farmName" className={`scroll-mt-28 p-4 rounded-2xl border ${err("farmName") ? "border-2 border-red-400" : "border-surface-variant/40 bg-surface-container-lowest"} shadow-[0_2px_6px_rgba(25,28,29,0.04)]`}>
                <label className="text-xs font-bold text-on-surface block mb-2">Farm / Agribusiness Name *</label>
                <TextInput value={farmName} onChange={(v) => { setFarmName(v); if (v.trim()) clearError("farmName"); }} placeholder="e.g. Simba Ridge Demonstration Farm" error={err("farmName")} />
              </div>
              <div id="q-phone" className={`scroll-mt-28 p-4 rounded-2xl border ${err("phone") ? "border-2 border-red-400" : "border-surface-variant/40 bg-surface-container-lowest"} shadow-[0_2px_6px_rgba(25,28,29,0.04)]`}>
                <label className="text-xs font-bold text-on-surface block mb-2">Farmer Contact / Phone Number *</label>
                <TextInput type="tel" value={phone} onChange={(v) => { setPhone(v); if (v.trim()) clearError("phone"); }} placeholder="e.g. +254 712 345 678" error={err("phone")} />
              </div>
            </div>
          </div>

          {/* ============ Section 1: Farmer profile (Q1-5) ============ */}
          <div>
            <SectionHeader index="Section 1 of 10" title="Farmer Profile" desc="Tell us about the person building the future-ready farm." />
            <div className="space-y-8 mt-4">
              <QCard id="q-jobTitle" title="1. What is your current job title or secondary occupation?" error={err("jobTitle")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {JOB_OPTIONS.map((opt) => (
                    <OptionCard key={opt.title} title={opt.title} icon={opt.icon} selected={jobTitle === opt.title}
                      onClick={() => { setJobTitle(opt.title); clearError("jobTitle"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-valueChain" title="2. Which agricultural value chain(s) are you involved in?" error={err("valueChain")}>
                <TextInput value={valueChain}
                  onChange={(v) => { setValueChain(v); if (v.trim()) clearError("valueChain"); }}
                  placeholder="e.g., Horticulture & Vegetables, Dairy, Poultry, Cereals..." error={err("valueChain")} />
                <span className="text-xs font-semibold text-on-surface-variant block mt-3 mb-2">Quick Suggestions (click to append):</span>
                <div className="flex flex-wrap gap-2">
                  {VALUE_CHAIN_SUGGESTIONS.map((sug) => (
                    <button key={sug} type="button"
                      onClick={() => {
                        if (!valueChain) setValueChain(sug);
                        else if (!valueChain.includes(sug)) setValueChain(`${valueChain}, ${sug}`);
                        clearError("valueChain");
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-outline-variant/70 bg-surface-container-low hover:bg-secondary/10 hover:border-secondary/50 text-on-surface transition-colors cursor-pointer">
                      + {sug}
                    </button>
                  ))}
                </div>
              </QCard>

              <QCard id="q-experienceYears" title="3. How many years of professional or business experience do you have?" error={err("experienceYears")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={experienceYears === opt}
                      onClick={() => { setExperienceYears(opt); clearError("experienceYears"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-businessHistory" title="4. Have you previously started, owned, or managed a business?" error={err("businessHistory")}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {BUSINESS_HISTORY_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={businessHistory === opt}
                      onClick={() => { setBusinessHistory(opt); clearError("businessHistory"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-educationLevel" title="5. What is your highest level of education?" error={err("educationLevel")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {EDUCATION_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={educationLevel === opt}
                      onClick={() => { setEducationLevel(opt); if (opt !== "Other") clearError("educationLevel"); }} />
                  ))}
                </div>
                {educationLevel === "Other" && (
                  <TextInput value={otherEducation}
                    onChange={(v) => { setOtherEducation(v); if (v.trim()) clearError("educationLevel"); }}
                    placeholder="Please specify your educational background..." />
                )}
              </QCard>
            </div>
          </div>

          {/* ============ Section 2: Management (Q6-8) ============ */}
          <div>
            <SectionHeader index="Section 2 of 10" title="Farm Management Experience" desc="Help us understand how you currently manage your farm." />
            <div className="space-y-8 mt-4">
              <QCard id="q-mgmtAbility" title="6. Which statement best describes your current farm management ability?" error={err("mgmtAbility")}>
                <div className="space-y-3">
                  {ABILITY_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={mgmtAbility === opt}
                      onClick={() => { setMgmtAbility(opt); clearError("mgmtAbility"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-operationsResponsible" title="7. Who is currently responsible for day-to-day farm operations?" error={err("operationsResponsible")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {OPERATOR_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={operationsResponsible === opt}
                      onClick={() => { setOperationsResponsible(opt); clearError("operationsResponsible"); }} />
                  ))}
                </div>
                <TextInput value={otherOperator}
                  onChange={(v) => { setOtherOperator(v); if (v.trim()) clearError("operationsResponsible"); }}
                  placeholder="Other arrangement (Please specify)..." />
              </QCard>

              <QCard id="q-desiredInvolvement" title="8. How involved would you like to be in the day-to-day management of your farm?" error={err("desiredInvolvement")}>
                <div className="flex flex-col gap-3">
                  {INVOLVEMENT_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={desiredInvolvement === opt}
                      onClick={() => { setDesiredInvolvement(opt); clearError("desiredInvolvement"); }} />
                  ))}
                </div>
              </QCard>
            </div>
          </div>

          {/* ============ Section 3: Operating style (Q9-14) ============ */}
          <div>
            <SectionHeader index="Section 3 of 10" title="Your Operating Style" desc="Help us understand how you make decisions, navigate challenges, and measure progress." />
            <div className="space-y-8 mt-4">
              <QCard id="q-decisionStyle" title="9. When facing an important business decision, what do you typically do first?" error={err("decisionStyle")}>
                <div className="space-y-3">
                  {DECISION_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={decisionStyle === opt}
                      onClick={() => { setDecisionStyle(opt); clearError("decisionStyle"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-failureResponse" title="10. How do you usually respond when a plan is not working?" error={err("failureResponse")}>
                <div className="space-y-3">
                  {FAILURE_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={failureResponse === opt}
                      onClick={() => { setFailureResponse(opt); clearError("failureResponse"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-obstacles" title="11. What is currently the biggest obstacle to growing your farm business?" error={err("obstacles") || err("otherObstacle")}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                    Select up to three ({obstacles.length}/3)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  {OBSTACLE_LIST.map((item) => (
                    <CheckCard key={item} title={item} checked={obstacles.includes(item)}
                      disabled={obstacles.length >= 3 && !obstacles.includes(item)}
                      onClick={() => toggleInList(obstacles, setObstacles, item, 3, "obstacles")} />
                  ))}
                </div>
                {obstacles.includes("Other") && (
                  <div id="q-otherObstacle">
                    <TextInput value={otherObstacle}
                      onChange={(v) => { setOtherObstacle(v); if (v.trim()) clearError("otherObstacle"); }}
                      placeholder="Please specify your other obstacle..." error={err("otherObstacle")} />
                  </div>
                )}
              </QCard>

              <QCard id="q-guidancePreference" title="12. How do you prefer to receive professional guidance and feedback?" error={err("guidancePreference")}>
                <div className="space-y-3">
                  {GUIDANCE_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={guidancePreference === opt}
                      onClick={() => { setGuidancePreference(opt); clearError("guidancePreference"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-trackingFrequency" title="13. How often do you currently review or track your farm's business performance?" error={err("trackingFrequency")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={trackingFrequency === opt}
                      onClick={() => { setTrackingFrequency(opt); clearError("trackingFrequency"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-updatePreferences" title="14. How would you prefer to receive updates about your farm?" error={err("updatePreferences")}>
                <div className="space-y-3">
                  {UPDATE_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={updatePreferences === opt}
                      onClick={() => { setUpdatePreferences(opt); clearError("updatePreferences"); }} />
                  ))}
                </div>
              </QCard>
            </div>
          </div>

          {/* ============ Section 4: Aspirations (Q15-21) ============ */}
          <div>
            <SectionHeader index="Section 4 of 10" title="Your Future Farms Aspirations" desc="Tell us where you want your farm to go over the next 1 to 25 years." />
            <div className="space-y-8 mt-4">
              <QCard id="q-twelveMonthSuccess" title="15. What would success look like for your farm over the next 12 months?" error={err("twelveMonthSuccess")}>
                <textarea rows={3} value={twelveMonthSuccess}
                  onChange={(e) => { setTwelveMonthSuccess(e.target.value); if (e.target.value.trim()) clearError("twelveMonthSuccess"); }}
                  placeholder="Describe your 12-month goals and operational milestones..."
                  className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none bg-surface placeholder:text-on-surface-variant/40" />
              </QCard>

              <QCard id="q-greatestImpactSupport" title="16. What kind of support would have the greatest impact on your farm business right now?" error={err("greatestImpactSupport")}>
                <textarea rows={3} value={greatestImpactSupport}
                  onChange={(e) => { setGreatestImpactSupport(e.target.value); if (e.target.value.trim()) clearError("greatestImpactSupport"); }}
                  placeholder="E.g., Automated irrigation scheduling, expert agronomist advisory, working capital financing..."
                  className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none bg-surface placeholder:text-on-surface-variant/40" />
              </QCard>

              <QCard id="q-marketInsight" title="17. What is one thing you understand about your market or customers that you believe many other farmers may not yet have recognized?" error={err("marketInsight")}>
                <textarea rows={3} value={marketInsight}
                  onChange={(e) => { setMarketInsight(e.target.value); if (e.target.value.trim()) clearError("marketInsight"); }}
                  placeholder="Share your unique market understanding or customer preference observation..."
                  className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none bg-surface placeholder:text-on-surface-variant/40" />
              </QCard>

              <QCard id="q-threeToFiveYearRole" title="18. What do you want your role in the farm business to look like over the next three to five years?" error={err("threeToFiveYearRole")}>
                <textarea rows={3} value={threeToFiveYearRole}
                  onChange={(e) => { setThreeToFiveYearRole(e.target.value); if (e.target.value.trim()) clearError("threeToFiveYearRole"); }}
                  placeholder="E.g., Strategic oversight, investor relations, multi-site expansion..."
                  className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none bg-surface placeholder:text-on-surface-variant/40" />
              </QCard>

              <QCard id="q-managerResponsibilities" title="19. What would you like a professional Farm Manager to take responsibility for on your behalf?" error={err("managerResponsibilities")}>
                <div className="flex items-center justify-between mb-3">
                  <button type="button"
                    onClick={() => {
                      if (managerResponsibilities.length === MANAGER_RESPONSIBILITY_ITEMS.length) setManagerResponsibilities([]);
                      else setManagerResponsibilities([...MANAGER_RESPONSIBILITY_ITEMS]);
                      clearError("managerResponsibilities");
                    }}
                    className="text-xs font-bold text-secondary hover:underline cursor-pointer">
                    {managerResponsibilities.length === MANAGER_RESPONSIBILITY_ITEMS.length ? "Deselect All" : "All of the above"}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MANAGER_RESPONSIBILITY_ITEMS.map((item) => (
                    <CheckCard key={item} title={item} checked={managerResponsibilities.includes(item)}
                      onClick={() => toggleInList(managerResponsibilities, setManagerResponsibilities, item, undefined, "managerResponsibilities")} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-personallyApprovedDecisions" title="20. What decisions would you always want to personally approve before they are made?" error={err("personallyApprovedDecisions")}>
                <textarea rows={3} value={personallyApprovedDecisions}
                  onChange={(e) => { setPersonallyApprovedDecisions(e.target.value); if (e.target.value.trim()) clearError("personallyApprovedDecisions"); }}
                  placeholder="E.g., Equipment purchases exceeding $2,000, land leasing, annual budget sign-off..."
                  className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none bg-surface placeholder:text-on-surface-variant/40" />
              </QCard>

              <QCard id="q-twentyFiveYearVision" title="21. Describe your vision for African farms 25 years from now. How do you want your farm or agricultural business to contribute to that future?" error={err("twentyFiveYearVision")}>
                <textarea rows={4} value={twentyFiveYearVision}
                  onChange={(e) => { setTwentyFiveYearVision(e.target.value); if (e.target.value.trim()) clearError("twentyFiveYearVision"); }}
                  placeholder="Paint a vivid picture of the long-term future and your farm's lasting legacy..."
                  className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none bg-surface placeholder:text-on-surface-variant/40" />
              </QCard>
            </div>
          </div>

          {/* ============ Section 5: Digital platforms (Q22-27) ============ */}
          <div>
            <SectionHeader index="Section 5 of 10" title="Working With Digital Farm Management Platforms" desc="Understanding your readiness and requirements for digital management, transparency, and operational verification." />
            <div className="space-y-8 mt-4">
              <QCard id="q-supportReasons" title="22. What could be your main reason for considering professional farm management support?" error={err("supportReasons")}>
                <div className="space-y-3">
                  {SUPPORT_REASON_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={supportReasons === opt}
                      onClick={() => { setSupportReasons(opt); clearError("supportReasons"); }} />
                  ))}
                </div>
                {supportReasons === "Other" && (
                  <div id="q-otherSupportReason" className="pt-3">
                    <TextInput value={otherSupportReason}
                      onChange={(v) => { setOtherSupportReason(v); if (v.trim()) clearError("otherSupportReason"); }}
                      placeholder="Please specify your reason for considering support..." error={err("otherSupportReason")} />
                  </div>
                )}
              </QCard>

              <QCard id="q-remoteConfidence" title="23. What would make you feel confident that your farm is being managed well even when you are not physically present?" error={err("remoteConfidence")}>
                <textarea rows={3} value={remoteConfidence}
                  onChange={(e) => { setRemoteConfidence(e.target.value); if (e.target.value.trim()) clearError("remoteConfidence"); }}
                  placeholder="E.g., Weekly video walkthroughs, geotagged photo proof of work, digital inventory reconciliations..."
                  className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none bg-surface placeholder:text-on-surface-variant/40" />
              </QCard>

              <QCard id="q-remoteComfort" title="24. Are you comfortable with your Farm Manager using remote solutions to digitally plan, monitor, verify, and report farm operations?" error={err("remoteComfort")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REMOTE_COMFORT_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={remoteComfort === opt}
                      onClick={() => { setRemoteComfort(opt); clearError("remoteComfort"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-recordKeeping" title="25. Are you willing to maintain accurate farm, financial, production, and operational records as part of the management service?" error={err("recordKeeping")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {RECORD_COMFORT_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={recordKeeping === opt}
                      onClick={() => { setRecordKeeping(opt); clearError("recordKeeping"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-physicalAudits" title="26. Are you comfortable with a Farm Manager conducting periodic physical operational audits to verify farm records and performance?" error={err("physicalAudits")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AUDIT_OPTIONS.map((opt) => (
                    <OptionCard key={opt} title={opt} selected={physicalAudits === opt}
                      onClick={() => { setPhysicalAudits(opt); clearError("physicalAudits"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-additionalNotes" title="27. Is there anything else we should understand about you, your farm, or the kind of support you are looking for? (Optional)">
                <textarea rows={3} value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Please share any additional details, concerns, or specific aspirations for your farm..."
                  className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none bg-surface placeholder:text-on-surface-variant/40" />
              </QCard>
            </div>
          </div>

          {/* ============ Section 6: Location ============ */}
          <div>
            <SectionHeader index="Section 6 of 10" title="Farm Location" desc="Tell us where your farm is located so we can provide local micro-climate forecasts, soil nutrient composition, and connect you directly with regional aggregate buyers." />
            <div className="space-y-8 mt-4">
              <QCard id="q-locationSearch" title="Enter your farm location, town, or nearby landmark" error={err("locationSearch")}>
                <TextInput value={locationSearch}
                  onChange={(v) => { setLocationSearch(v); if (v.trim()) clearError("locationSearch"); }}
                  placeholder="e.g., Mai Mahiu, Naivasha or village name" error={err("locationSearch")} />
                <button type="button" onClick={useCurrentLocation} disabled={detectingGps}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-secondary text-secondary text-xs font-bold hover:bg-secondary/10 transition-colors cursor-pointer disabled:opacity-60">
                  <span className="material-symbols-outlined text-[16px]">my_location</span>
                  {detectingGps ? "Detecting GPS..." : gpsLocated ? "Located" : "Use Current Location"}
                </button>
              </QCard>

              <QCard id="q-county" title="Administrative Division" error={err("county") || err("subcounty")}>
                <label className="text-xs font-bold text-on-surface block mb-2">County *</label>
                <select value={county}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCounty(v);
                    if (v.trim()) clearError("county");
                    const subs = COMMON_SUBCOUNTIES[v.toLowerCase()];
                    if (subs && subs.length > 0) setSubcounty(subs[0].toLowerCase());
                    else setSubcounty("");
                  }}
                  className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm bg-surface focus:border-secondary focus:outline-none mb-4">
                  <option value="">-- Select County --</option>
                  {KENYAN_COUNTIES.map((c) => (
                    <option key={c} value={c.toLowerCase()}>{c} County</option>
                  ))}
                </select>
                <div id="q-subcounty">
                  <label className="text-xs font-bold text-on-surface block mb-2">Sub-County / Area *</label>
                  {subcountyList ? (
                    <select value={subcounty}
                      onChange={(e) => { setSubcounty(e.target.value); if (e.target.value.trim()) clearError("subcounty"); }}
                      className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm bg-surface focus:border-secondary focus:outline-none">
                      <option value="">-- Select Sub-County --</option>
                      {subcountyList.map((s) => (
                        <option key={s} value={s.toLowerCase()}>{s} Sub-County</option>
                      ))}
                    </select>
                  ) : (
                    <TextInput value={subcounty}
                      onChange={(v) => { setSubcounty(v); if (v.trim()) clearError("subcounty"); }}
                      placeholder="Enter sub-county or division" error={err("subcounty")} />
                  )}
                </div>
              </QCard>

              <QCard id="q-ward" title="Ward / Village" error={err("ward")}>
                <TextInput value={ward}
                  onChange={(v) => { setWard(v); if (v.trim()) clearError("ward"); }}
                  placeholder="Enter ward or village" error={err("ward")} />
              </QCard>

              <QCard id="q-landmark" title="Nearest Trading Center / Landmark" error={err("landmark")}>
                <TextInput value={landmark}
                  onChange={(v) => { setLandmark(v); if (v.trim()) clearError("landmark"); }}
                  placeholder="e.g., Near Mai Mahiu town" error={err("landmark")} />
              </QCard>
            </div>
          </div>

          {/* ============ Section 7: Characteristics ============ */}
          <div>
            <SectionHeader index="Section 7 of 10" title="Farm Characteristics" desc="Tell us about your land size, ownership, water source, and soil so we can give you relevant farming recommendations." />
            <div className="space-y-8 mt-4">
              <QCard id="q-farmSize" title="How big is your farm?" error={err("farmSize")}>
                <div className="flex gap-2 mb-3">
                  {(["Acres", "Hectares"] as const).map((u) => (
                    <button key={u} type="button" onClick={() => setFarmUnit(u)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        farmUnit === u ? "bg-secondary text-white border-secondary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                      }`}>
                      {u}
                    </button>
                  ))}
                </div>
                <input type="number" step="0.1" min="0" value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 10.0"
                  className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:outline-none bg-surface" />
              </QCard>

              <QCard id="q-landUse" title="How is your land currently used?" error={err("landUse")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-2">Cultivated / Farming (Active crop land)</label>
                    <input type="number" step="0.1" min="0" value={cultivatedAcres} placeholder="0.0"
                      onChange={(e) => { setCultivatedAcres(e.target.value === "" ? "" : Number(e.target.value)); clearError("landUse"); }}
                      className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:outline-none bg-surface" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-2">Grazing / Resting (Pasture &amp; other)</label>
                    <input type="number" step="0.1" min="0" value={grazingAcres} placeholder="0.0"
                      onChange={(e) => { setGrazingAcres(e.target.value === "" ? "" : Number(e.target.value)); clearError("landUse"); }}
                      className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm focus:border-secondary focus:outline-none bg-surface" />
                  </div>
                </div>
              </QCard>

              <QCard id="q-landTenure" title="What is your land ownership or tenure status?" error={err("landTenure")}>
                <p className="text-xs text-on-surface-variant mb-3">Select your legal tenure arrangement for the farmland.</p>
                <div className="space-y-3">
                  {LAND_TENURE_OPTIONS.map((opt) => (
                    <OptionCard key={opt.id} title={opt.title} sub={opt.desc} selected={landTenure === opt.id}
                      onClick={() => { setLandTenure(opt.id); clearError("landTenure"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-waterSources" title="Where do you get water for your farm?" error={err("waterSources")}>
                <p className="text-xs text-on-surface-variant mb-3">Select all water sources you currently use.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WATER_SOURCE_OPTIONS.map((opt) => (
                    <CheckCard key={opt.id} title={opt.title} sub={`${opt.badge} • ${opt.desc}`}
                      checked={waterSources.includes(opt.id)}
                      onClick={() => toggleInList(waterSources, setWaterSources, opt.id, undefined, "waterSources")} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-soilTested" title="Have you tested your soil recently?" error={err("soilTested")}>
                <p className="text-xs text-on-surface-variant mb-3">Soil testing helps recommend the right fertilizers and crops.</p>
                <div className="flex gap-2">
                  {[{ v: "yes", label: "Yes, Tested" }, { v: "no", label: "No" }].map((o) => (
                    <button key={o.v} type="button" onClick={() => { setSoilTested(o.v); clearError("soilTested"); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        soilTested === o.v ? "bg-secondary text-white border-secondary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                      }`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </QCard>
            </div>
          </div>

          {/* ============ Section 8: Farming system ============ */}
          <div>
            <SectionHeader index="Section 8 of 10" title="Farming System" desc="Tell us about your crops, livestock, farming practices, and power sources so we can customize agronomy advice, equipment rebates, and supplier connections." />
            <div className="space-y-8 mt-4">
              <QCard id="q-enterprises" title="1. What do you grow and raise on your farm?" error={err("enterprises")}>
                <p className="text-xs text-on-surface-variant mb-3">Select all that apply</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ENTERPRISE_OPTIONS.map((opt) => (
                    <CheckCard key={opt.id} title={opt.title} sub={opt.sub} checked={enterprises.includes(opt.id)}
                      onClick={() => toggleInList(enterprises, setEnterprises, opt.id, undefined, "enterprises")} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-cultivationMethod" title="2. Secondary Cultivation & Production Methods" error={err("cultivationMethod")}>
                <div className="space-y-3">
                  {CULTIVATION_OPTIONS.map((opt) => (
                    <OptionCard key={opt.id} title={opt.title} sub={opt.sub} selected={cultivationMethod === opt.id}
                      onClick={() => { setCultivationMethod(opt.id); clearError("cultivationMethod"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-mechanizationSetup" title="3. Farm Mechanization & Tools" error={err("mechanizationSetup")}>
                <div className="space-y-3">
                  {MECHANIZATION_OPTIONS.map((opt) => (
                    <OptionCard key={opt.id} title={opt.title} sub={opt.desc} selected={mechanizationSetup === opt.id}
                      onClick={() => { setMechanizationSetup(opt.id); clearError("mechanizationSetup"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-energySource" title="4. Energy & Pumping Source for Farm Operations" error={err("energySource")}>
                <div className="space-y-3">
                  {ENERGY_OPTIONS.map((opt) => (
                    <OptionCard key={opt.id} title={opt.title} sub={opt.desc} selected={energySource === opt.id}
                      onClick={() => { setEnergySource(opt.id); clearError("energySource"); }} />
                  ))}
                </div>
              </QCard>
            </div>
          </div>

          {/* ============ Section 9: Business experience ============ */}
          <div>
            <SectionHeader index="Section 9 of 10" title="Business Experience" desc="Help us understand your commercial track record, market outlets, and bookkeeping to match you with appropriate financing and buyers." />
            <div className="space-y-8 mt-4">
              <QCard id="q-commercialYears" title="1. How long have you been farming commercially?" error={err("commercialYears")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COMMERCIAL_YEARS_OPTIONS.map((opt) => (
                    <OptionCard key={opt.id} title={opt.label} selected={commercialYears === opt.id}
                      onClick={() => { setCommercialYears(opt.id); clearError("commercialYears"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-annualRevenueBracket" title="2. What is your estimated annual farm sales / revenue?" error={err("annualRevenueBracket")}>
                <div className="space-y-3">
                  {REVENUE_OPTIONS.map((opt) => (
                    <OptionCard key={opt.id} title={opt.title} sub={opt.sub} selected={annualRevenueBracket === opt.id}
                      onClick={() => { setAnnualRevenueBracket(opt.id); clearError("annualRevenueBracket"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-recordKeepingMethod" title="3. How do you currently keep farm records?" error={err("recordKeepingMethod")}>
                <div className="space-y-3">
                  {RECORD_KEEPING_OPTIONS.map((opt) => (
                    <OptionCard key={opt.id} title={opt.title} sub={opt.desc} selected={recordKeepingMethod === opt.id}
                      onClick={() => { setRecordKeepingMethod(opt.id); clearError("recordKeepingMethod"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-produceBuyers" title="4. Secondary Produce Buyers & Sales Channels" error={err("produceBuyers")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BUYER_OPTIONS.map((opt) => (
                    <CheckCard key={opt.id} title={opt.title} sub={opt.desc} checked={produceBuyers.includes(opt.id)}
                      onClick={() => toggleInList(produceBuyers, setProduceBuyers, opt.id, undefined, "produceBuyers")} />
                  ))}
                </div>
              </QCard>
            </div>
          </div>

          {/* ============ Section 10: Household & labour ============ */}
          <div>
            <SectionHeader index="Section 10 of 10" title="Household & Labour" desc="Detail your farm's workforce structure, seasonal labor reliance, and household management to assess human capital readiness and ethical workforce standards." />
            <div className="space-y-8 mt-4">
              <QCard id="q-workforce" title="1. Farm Workforce & Labour Size" error={err("workforce")}>
                <p className="text-xs text-on-surface-variant mb-4">Detail full-time permanent personnel and seasonal hands hired during peak activities.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">Permanent / Full-Time Workers <span className="font-normal text-on-surface-variant">(Full-time)</span></label>
                    <p className="text-xs text-on-surface-variant mb-2">Permanent year-round team managing daily farm tasks, irrigation, and security.</p>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setPermanentWorkers((v) => Math.max(0, (typeof v === "number" ? v : 0) - 1))}
                        className="w-9 h-9 shrink-0 rounded-xl border border-outline-variant font-bold hover:bg-surface-container-low cursor-pointer">−</button>
                      <input type="number" min="0" value={permanentWorkers} placeholder="0"
                        onChange={(e) => setPermanentWorkers(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                        className="flex-1 min-w-0 rounded-xl border border-outline-variant px-4 py-2.5 text-sm text-center focus:border-secondary focus:outline-none bg-surface" />
                      <button type="button" onClick={() => setPermanentWorkers((v) => (typeof v === "number" ? v : 0) + 1)}
                        className="w-9 h-9 shrink-0 rounded-xl border border-outline-variant font-bold hover:bg-surface-container-low cursor-pointer">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">Seasonal / Casual Workers during harvest <span className="font-normal text-on-surface-variant">(Peak Season)</span></label>
                    <p className="text-xs text-on-surface-variant mb-2">Short-term hands recruited during harvesting, weeding, and packing periods.</p>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setSeasonalWorkers((v) => Math.max(0, (typeof v === "number" ? v : 0) - 1))}
                        className="w-9 h-9 shrink-0 rounded-xl border border-outline-variant font-bold hover:bg-surface-container-low cursor-pointer">−</button>
                      <input type="number" min="0" value={seasonalWorkers} placeholder="0"
                        onChange={(e) => setSeasonalWorkers(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                        className="flex-1 min-w-0 rounded-xl border border-outline-variant px-4 py-2.5 text-sm text-center focus:border-secondary focus:outline-none bg-surface" />
                      <button type="button" onClick={() => setSeasonalWorkers((v) => (typeof v === "number" ? v : 0) + 1)}
                        className="w-9 h-9 shrink-0 rounded-xl border border-outline-variant font-bold hover:bg-surface-container-low cursor-pointer">+</button>
                    </div>
                  </div>
                </div>
              </QCard>

              <QCard id="q-managementStructure" title="2. Day-to-Day Farm Management" error={err("managementStructure")}>
                <p className="text-xs text-on-surface-variant mb-3">Select the secondary operational decision maker and leadership model on your farm.</p>
                <div className="space-y-3">
                  {MANAGEMENT_STRUCTURE_OPTIONS.map((opt) => (
                    <OptionCard key={opt.id} title={opt.title} sub={opt.desc} selected={managementStructure === opt.id}
                      onClick={() => { setManagementStructure(opt.id); clearError("managementStructure"); }} />
                  ))}
                </div>
              </QCard>

              <QCard id="q-fairEmploymentPractices" title="3. Fair Employment & Inclusion Practices" error={err("fairEmploymentPractices")}>
                <p className="text-xs text-on-surface-variant mb-3">Ethical workforce standards, worker well-being, and social sustainability measures.</p>
                <div className="space-y-3">
                  {FAIR_PRACTICE_OPTIONS.map((opt) => (
                    <CheckCard key={opt.id} title={opt.title} sub={opt.desc} checked={fairEmploymentPractices.includes(opt.id)}
                      onClick={() => toggleInList(fairEmploymentPractices, setFairEmploymentPractices, opt.id, undefined, "fairEmploymentPractices")} />
                  ))}
                </div>
              </QCard>
            </div>
          </div>
        </div>

        {/* Sticky bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-variant px-4 sm:px-6 py-3 sm:py-4 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs md:text-sm font-semibold text-on-surface-variant">
              {answeredCount} of {checks.length} answered • {progressPercent}% complete
            </div>
            <button
              type="button"
              onClick={handleSubmitAll}
              disabled={saving}
              className="w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-3 rounded-xl bg-secondary text-white font-bold text-xs md:text-sm shadow-md hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <span>{saving ? "Saving your profile..." : "Complete Profile & Enter"}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
          <div className="max-w-4xl mx-auto w-full bg-surface-container-high rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-secondary to-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>
    </main>
  );
}
