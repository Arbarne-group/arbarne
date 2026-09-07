import { getGoogleSheetsAccessToken, getSpreadsheetMetadata } from "../src/lib/googleSheets";
import { ONBOARDING_SECTIONS } from "../src/data/onboardingData";
import { prisma } from "../src/lib/prisma";

const SPREADSHEET_ID = "1tEYJhZijyMfaZ8_btZmC9_5UJRLk4af2luL1vKixSyM";

// Clean field values for spreadsheet display
function cleanField(val: any): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") {
    if (val.startsWith("[") && val.endsWith("]")) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.join(", ");
      } catch {
        return val;
      }
    }
    return val;
  }
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}

function formatPhone(p: string | null | undefined): string {
  if (!p) return "";
  const trimmed = p.trim();
  return trimmed.startsWith("+") ? `'${trimmed}` : trimmed;
}

function formatCoordinates(lat: number | null | undefined, lng: number | null | undefined): string {
  if (lat === null || lat === undefined || lng === null || lng === undefined) return "";
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

async function main() {
  try {
    console.log("=== Future Farms: Setting Up Google Spreadsheet for Both Onboardings ===");
    console.log("Fetching spreadsheet metadata...");
    const meta = await getSpreadsheetMetadata(SPREADSHEET_ID);
    const token = await getGoogleSheetsAccessToken();

    const existingSheets = meta.sheets || [];
    console.log("Current sheets:", existingSheets.map((s: any) => `${s.properties.title} (ID: ${s.properties.sheetId})`));

    // Desired Sheets:
    // 1. "Master Consolidated" (Combines identifiers + Survey 1 + Survey 2)
    // 2. "Survey 1 - Farmer (Shambany)" (Steps 1-5)
    // 3. "Survey 2 - Farm Profile" (Deep Dive & Metadata)
    // 4. "Question Dictionary" (Reference dictionary for both surveys)

    const requests: any[] = [];

    // Ensure we have sheet IDs
    // We will rename existing sheet 0 to "Master Consolidated"
    // We will ensure "Survey 1 - Farmer (Shambany)" exists (ID 102)
    // We will ensure "Survey 2 - Farm Profile" exists (ID 103)
    // We will ensure "Question Dictionary" exists (ID 101)

    const masterSheet = existingSheets.find((s: any) => s.properties.sheetId === 0) || existingSheets[0];
    const masterSheetId = masterSheet.properties.sheetId;

    // 1. Rename and format Master Sheet
    requests.push({
      updateSheetProperties: {
        properties: {
          sheetId: masterSheetId,
          title: "Master Consolidated",
          gridProperties: {
            frozenRowCount: 2,
            rowCount: 500,
            columnCount: 65,
          },
          tabColor: { red: 0.0, green: 0.28, blue: 0.14 }, // Deep Forest Green
        },
        fields: "title,gridProperties.frozenRowCount,gridProperties.rowCount,gridProperties.columnCount,tabColor",
      },
    });

    // Check / Add "Survey 1 - Farmer (Shambany)"
    let s1Sheet = existingSheets.find((s: any) => s.properties.title === "Survey 1 - Farmer (Shambany)");
    let s1SheetId = s1Sheet ? s1Sheet.properties.sheetId : 102;
    if (!s1Sheet) {
      requests.push({
        addSheet: {
          properties: {
            sheetId: s1SheetId,
            title: "Survey 1 - Farmer (Shambany)",
            gridProperties: {
              frozenRowCount: 2,
              rowCount: 500,
              columnCount: 36,
            },
            tabColor: { red: 0.08, green: 0.4, blue: 0.75 }, // Brand Navy Blue
          },
        },
      });
    }

    // Check / Add "Survey 2 - Farm Profile"
    let s2Sheet = existingSheets.find((s: any) => s.properties.title === "Survey 2 - Farm Profile");
    let s2SheetId = s2Sheet ? s2Sheet.properties.sheetId : 103;
    if (!s2Sheet) {
      requests.push({
        addSheet: {
          properties: {
            sheetId: s2SheetId,
            title: "Survey 2 - Farm Profile",
            gridProperties: {
              frozenRowCount: 2,
              rowCount: 500,
              columnCount: 38,
            },
            tabColor: { red: 0.18, green: 0.49, blue: 0.2 }, // Forest Green
          },
        },
      });
    }

    // Check / Add "Question Dictionary"
    let dictSheet = existingSheets.find((s: any) => s.properties.title === "Question Dictionary");
    let dictSheetId = dictSheet ? dictSheet.properties.sheetId : 101;
    if (!dictSheet) {
      requests.push({
        addSheet: {
          properties: {
            sheetId: dictSheetId,
            title: "Question Dictionary",
            gridProperties: {
              frozenRowCount: 1,
              rowCount: 80,
              columnCount: 8,
            },
            tabColor: { red: 0.42, green: 0.22, blue: 0.61 }, // Purple
          },
        },
      });
    }

    console.log("Sending sheet setup and tab configuration batchUpdate...");
    const initRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requests }),
      }
    );
    const initData = await initRes.json();
    if (!initRes.ok) {
      console.warn("Initial sheet configuration note:", initData.error?.message || initData);
    } else {
      console.log("Sheet tabs verified/created successfully!");
    }

    // =========================================================================
    // 2. BUILD HEADER DEFINITIONS FOR EACH SHEET
    // =========================================================================

    // --- SHEET 1: MASTER CONSOLIDATED ---
    // Section Merges (Row 1):
    // Cols 0-7 (A-H): "FARM & SUBMITTER IDENTIFIERS" (8 cols)
    // Cols 8-34 (I-AI): "SURVEY 1: FARMER ONBOARDING (SHAMBANY STEPS 1-5)" (27 cols)
    // Cols 35-60 (AJ-BI): "SURVEY 2: FARM PROFILE (DEEP DIVE & METADATA)" (26 cols)

    const masterRow1 = [
      "FARM & SUBMITTER IDENTIFIERS", "", "", "", "", "", "", "",
      "SURVEY 1: FARMER ONBOARDING (SHAMBANY STEPS 1-5)", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "SURVEY 2: FARM PROFILE (DEEP DIVE & METADATA)", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    ];

    const masterRow2 = [
      // Identifiers
      "Timestamp",
      "Future Farms ID",
      "Farmer Full Name",
      "Email Address",
      "Phone Number",
      "Farm Name",
      "Onboarding Stage",
      "Profile Approved",
      // Survey 1 (Steps 1-5)
      "S1.Q1 Current Job Title / Occupation",
      "S1.Q2 Agricultural Value Chain(s)",
      "S1.Q3 Years of Agricultural Experience",
      "S1.Q4 Business History",
      "S1.Q5 Highest Education Level",
      "S1.Q6 Farm Management Ability",
      "S1.Q7 Operations Responsibility",
      "S1.Q8 Desired Involvement Level",
      "S1.Q9 Decision-Making Style",
      "S1.Q10 Response to Setbacks",
      "S1.Q11 Top Obstacles to Growth",
      "S1.Q12 Guidance & Feedback Preference",
      "S1.Q13 Review Frequency",
      "S1.Q14 Preferred Farm Updates",
      "S1.Q15 12-Month Success Vision",
      "S1.Q16 Greatest Impact Support Needed",
      "S1.Q17 Unique Market Insight",
      "S1.Q18 3-5 Year Role in Farm",
      "S1.Q19 Farm Manager Responsibilities",
      "S1.Q20 Personally Approved Decisions",
      "S1.Q21 25-Year African Agriculture Vision",
      "S1.Q22 Reasons for Management Support",
      "S1.Q23 Remote Confidence Drivers",
      "S1.Q24 Remote Solutions Comfort",
      "S1.Q25 Willingness to Maintain Records",
      "S1.Q26 Periodic Physical Audits Comfort",
      "S1.Q27 Additional Notes & Requirements",
      // Survey 2 (Farm Profile)
      "S2.Location Address / Search",
      "S2.County / Region",
      "S2.Sub-County / District",
      "S2.Ward / Locality",
      "S2.Nearest Landmark",
      "S2.GPS Coordinates",
      "S2.Total Farm Size",
      "S2.Area Unit",
      "S2.Cultivated Land Area",
      "S2.Grazing / Fallow Area",
      "S2.Land Tenure Type",
      "S2.Water Sources & Irrigation",
      "S2.Soil Testing Status",
      "S2.Primary Enterprises",
      "S2.Cultivation / Production System",
      "S2.Mechanization Setup",
      "S2.Energy / Electricity Source",
      "S2.Permanent Workers",
      "S2.Seasonal Workers",
      "S2.Labour & Safety Practices",
      "S2.Commercial Farming Years",
      "S2.Annual Revenue Bracket",
      "S2.Record Keeping Method",
      "S2.Primary Produce Buyers / Markets",
      "S2.Primary 12-Month Farm Goals",
      "S2.Key Operational Bottleneck",
    ];

    // --- SHEET 2: SURVEY 1 - FARMER (SHAMBANY) ---
    const s1Row1 = [
      "SUBMITTER DETAILS", "", "", "", "", "",
      "SECTION 1: FARMER PROFILE", "", "", "", "",
      "SECTION 2: FARM MANAGEMENT", "", "",
      "SECTION 3: OPERATING STYLE", "", "", "", "", "",
      "SECTION 4: ASPIRATIONS & VISION", "", "", "", "", "", "",
      "SECTION 5: DIGITAL PLATFORM & AUDITS", "", "", "", "", "",
    ];

    const s1Row2 = [
      "Timestamp",
      "Farmer Full Name",
      "Email Address",
      "Phone Number",
      "Farm Name",
      "Survey Status",
      "Q1. Primary Occupation / Job Title",
      "Q2. Agricultural Value Chain(s)",
      "Q3. Years of Experience",
      "Q4. Business History",
      "Q5. Highest Education Level",
      "Q6. Farm Management Ability",
      "Q7. Operations Responsibility",
      "Q8. Desired Involvement Level",
      "Q9. Decision-Making Style",
      "Q10. Response to Setbacks",
      "Q11. Top Obstacles to Growth",
      "Q12. Guidance & Feedback Preference",
      "Q13. Performance Review Frequency",
      "Q14. Preferred Farm Updates",
      "Q15. 12-Month Success Vision",
      "Q16. Greatest Impact Support Needed",
      "Q17. Unique Market Insight",
      "Q18. 3-5 Year Role in Farm",
      "Q19. Farm Manager Responsibilities",
      "Q20. Personally Approved Decisions",
      "Q21. 25-Year African Agriculture Vision",
      "Q22. Main Reasons for Management Support",
      "Q23. Remote Management Confidence Drivers",
      "Q24. Remote Solutions Comfort",
      "Q25. Willingness to Maintain Records",
      "Q26. Periodic Physical Audits Comfort",
      "Q27. Additional Notes & Requirements",
    ];

    // --- SHEET 3: SURVEY 2 - FARM PROFILE ---
    const s2Row1 = [
      "FARM IDENTIFIERS", "", "", "", "", "",
      "SECTION 1: LOCATION & COORDINATES", "", "", "", "", "",
      "SECTION 2: FARM SIZE & LAND CHARACTERISTICS", "", "", "", "", "", "",
      "SECTION 3: FARMING SYSTEM & PRODUCTION", "", "", "",
      "SECTION 4: HOUSEHOLD & LABOUR", "", "", "",
      "SECTION 5: BUSINESS & MARKETS", "", "", "",
      "SECTION 6: GOALS & PRIORITIES", "", "",
    ];

    const s2Row2 = [
      "Timestamp",
      "Future Farms ID",
      "Farmer Full Name",
      "Email Address",
      "Phone Number",
      "Farm Name",
      "Location Address / Search",
      "County / Region",
      "Sub-County / District",
      "Ward / Locality",
      "Nearest Landmark",
      "GPS Coordinates",
      "Total Farm Size",
      "Area Unit",
      "Cultivated Land Area",
      "Grazing / Fallow Area",
      "Land Tenure Type",
      "Water Sources & Irrigation",
      "Soil Testing Status",
      "Primary Enterprises",
      "Cultivation / Production System",
      "Mechanization Setup",
      "Energy / Electricity Source",
      "Permanent Workers",
      "Seasonal Workers",
      "Management Structure",
      "Labour & Safety Practices",
      "Commercial Farming Years",
      "Annual Revenue Bracket",
      "Record Keeping Method",
      "Primary Produce Buyers / Markets",
      "Primary 12-Month Farm Goals",
      "Key Operational Bottleneck",
      "Preferred Advisory Mode",
    ];

    // --- SHEET 4: QUESTION DICTIONARY ---
    const dictHeader = [
      "Survey Name",
      "Section / Category",
      "Q #",
      "Field ID / DB Key",
      "Question Prompt / Parameter",
      "Input Type",
      "Accepted Options / Format Description",
    ];

    const dictRows: any[] = [dictHeader];

    // Survey 1 Questions
    ONBOARDING_SECTIONS.forEach((sec) => {
      sec.questions.forEach((q) => {
        const optionsStr = q.options ? q.options.map((o) => o.label).join(" | ") : (q.placeholder || "Free text");
        dictRows.push([
          "Survey 1 (Shambany Steps 1-5)",
          sec.title,
          `S1.Q${q.number}`,
          q.id,
          q.question,
          q.type.toUpperCase(),
          optionsStr,
        ]);
      });
    });

    // Survey 2 Questions (Farm Profile Deep Dive)
    const s2Questions = [
      { sec: "Location & Coordinates", qNum: "S2.Q1", id: "locationSearch", prompt: "Farm Address / Location Search", type: "TEXT", desc: "Descriptive location / village / town" },
      { sec: "Location & Coordinates", qNum: "S2.Q2", id: "county", prompt: "County / Region", type: "SINGLE", desc: "Nakuru | Kiambu | Uasin Gishu | Narok | Machakos | etc." },
      { sec: "Location & Coordinates", qNum: "S2.Q3", id: "subcounty", prompt: "Sub-County / District", type: "TEXT", desc: "Sub-county administrative area" },
      { sec: "Location & Coordinates", qNum: "S2.Q4", id: "ward", prompt: "Ward / Locality", type: "TEXT", desc: "Ward administrative area" },
      { sec: "Location & Coordinates", qNum: "S2.Q5", id: "landmark", prompt: "Nearest Landmark", type: "TEXT", desc: "Town center, school, road junction & distance" },
      { sec: "Location & Coordinates", qNum: "S2.Q6", id: "latitude, longitude", prompt: "GPS Coordinates", type: "COORDINATES", desc: "Latitude and Longitude decimal format" },

      { sec: "Farm Characteristics", qNum: "S2.Q7", id: "farmSize", prompt: "Total Farm Size", type: "NUMERIC", desc: "Total acreage or hectares" },
      { sec: "Farm Characteristics", qNum: "S2.Q8", id: "farmUnit", prompt: "Area Measurement Unit", type: "SINGLE", desc: "Acres | Hectares" },
      { sec: "Farm Characteristics", qNum: "S2.Q9", id: "cultivatedAcres", prompt: "Area Under Cultivation", type: "NUMERIC", desc: "Acres actively cultivated with crops" },
      { sec: "Farm Characteristics", qNum: "S2.Q10", id: "grazingAcres", prompt: "Grazing / Fallow Area", type: "NUMERIC", desc: "Acres for pasture, grazing or fallow" },
      { sec: "Farm Characteristics", qNum: "S2.Q11", id: "landTenure", prompt: "Land Tenure / Ownership", type: "SINGLE", desc: "Freehold (Owned) | Leasehold | Family / Communal" },
      { sec: "Farm Characteristics", qNum: "S2.Q12", id: "waterSources", prompt: "Water Sources & Irrigation", type: "MULTI", desc: "Borehole Solar | River / Stream | Rainwater Dam | Municipal Water" },
      { sec: "Farm Characteristics", qNum: "S2.Q13", id: "soilTested", prompt: "Soil Testing Status", type: "SINGLE", desc: "Yes, in last 2 years | Yes, >2 years ago | Never tested | Planned" },

      { sec: "Farming System", qNum: "S2.Q14", id: "enterprises", prompt: "Primary Farm Enterprises", type: "MULTI", desc: "Vegetables & Horticulture | Dairy Livestock | Poultry | Maize / Cereals | Avocado & Fruits | Aquaculture" },
      { sec: "Farming System", qNum: "S2.Q15", id: "cultivationMethod", prompt: "Cultivation / Production System", type: "SINGLE", desc: "Drip Irrigation | Rainfed Open Field | Greenhouses / Shade Nets | Overhead Sprinklers" },
      { sec: "Farming System", qNum: "S2.Q16", id: "mechanizationSetup", prompt: "Mechanization Setup", type: "SINGLE", desc: "Owned Tractor | Hired Tractor Services | Walking Tractor / Tiller | Manual" },
      { sec: "Farming System", qNum: "S2.Q17", id: "energySource", prompt: "Energy / Electricity Source", type: "SINGLE", desc: "Solar PV | National Grid (KPLC) | Diesel Generator | Hybrid Solar-Grid" },

      { sec: "Household & Labour", qNum: "S2.Q18", id: "permanentWorkers", prompt: "Permanent Full-time Workers", type: "NUMERIC", desc: "Number of full-time employees on farm" },
      { sec: "Household & Labour", qNum: "S2.Q19", id: "seasonalWorkers", prompt: "Seasonal / Casual Workers", type: "NUMERIC", desc: "Peak seasonal casual labour force" },
      { sec: "Household & Labour", qNum: "S2.Q20", id: "managementStructure", prompt: "Management Structure", type: "SINGLE", desc: "Owner Managed | Resident Farm Manager | Family Cooperative | Agronomist Supervised" },
      { sec: "Household & Labour", qNum: "S2.Q21", id: "fairEmploymentPractices", prompt: "Labour & Safety Practices", type: "MULTI", desc: "Equal pay for women | PPE & clean water | Youth opportunities | Safe chemical handling" },

      { sec: "Business Experience", qNum: "S2.Q22", id: "commercialYears", prompt: "Commercial Farming Experience", type: "SINGLE", desc: "Less than 1 year | 1–3 years | 3–7 years | Over 7 years" },
      { sec: "Business Experience", qNum: "S2.Q23", id: "annualRevenueBracket", prompt: "Annual Farm Revenue Band", type: "SINGLE", desc: "Under KES 300,000 | KES 300k–1M | KES 1M–5M | Over KES 5M" },
      { sec: "Business Experience", qNum: "S2.Q24", id: "recordKeepingMethod", prompt: "Farm Accounting & Record Keeping", type: "SINGLE", desc: "Physical Book / Ledger | Mobile App | Spreadsheet | Formal Accountant" },
      { sec: "Business Experience", qNum: "S2.Q25", id: "produceBuyers", prompt: "Primary Produce Buyers & Markets", type: "MULTI", desc: "Farm-Gate Brokers | Wholesale Markets | Supermarkets | Direct Supply | Export" },

      { sec: "Goals & Priorities", qNum: "S2.Q26", id: "goals", prompt: "Primary 12-Month Farm Goals", type: "TEXTAREA", desc: "Operational, yield, and financial goals" },
      { sec: "Goals & Priorities", qNum: "S2.Q27", id: "operationalBottleneck", prompt: "Key Operational Bottleneck", type: "SINGLE", desc: "Water reliability | Capital & cashflow | Inputs | Skilled labour | Market pricing" },
      { sec: "Goals & Priorities", qNum: "S2.Q28", id: "advisoryMode", prompt: "Preferred Advisory Mode", type: "SINGLE", desc: "On-farm technical visits | Digital & remote advisory | Hybrid on-farm + digital" },
    ];

    s2Questions.forEach((q) => {
      dictRows.push([
        "Survey 2 (Farm Profile Deep Dive)",
        q.sec,
        q.qNum,
        q.id,
        q.prompt,
        q.type,
        q.desc,
      ]);
    });

    // =========================================================================
    // 3. PUSH HEADERS TO GOOGLE SHEETS
    // =========================================================================
    console.log("Pushing headers to all 4 tabs...");

    // Master Consolidated
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Master%20Consolidated!A1:BI2?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [masterRow1, masterRow2] }),
      }
    );

    // Survey 1
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Survey%201%20-%20Farmer%20(Shambany)!A1:AG2?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [s1Row1, s1Row2] }),
      }
    );

    // Survey 2
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Survey%202%20-%20Farm%20Profile!A1:AH2?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [s2Row1, s2Row2] }),
      }
    );

    // Question Dictionary
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Question%20Dictionary!A1:G${dictRows.length}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: dictRows }),
      }
    );

    console.log("Headers successfully written to all sheets!");

    // =========================================================================
    // 4. FETCH EXISTING USERS & POPULATE BOTH ONBOARDINGS INTO ALL SHEETS
    // =========================================================================
    console.log("Querying database users with both onboarding models...");
    const users = await prisma.user.findMany({
      include: {
        farmerProfile: true,
        farmManagement: true,
        operatingStyle: true,
        aspiration: true,
        digitalPlatform: true,
        farmLocation: true,
        farmCharacteristics: true,
        farmingSystem: true,
        businessExperience: true,
        goalsPriorities: true,
        householdLabour: true,
        onboardingStatus: true,
      },
    });

    console.log(`Found ${users.length} users in database.`);

    const masterRows: any[] = [];
    const s1Rows: any[] = [];
    const s2Rows: any[] = [];

    for (const u of users) {
      const fp = u.farmerProfile;
      const fm = u.farmManagement;
      const os = u.operatingStyle;
      const asp = u.aspiration;
      const dp = u.digitalPlatform;

      const loc = u.farmLocation;
      const char = u.farmCharacteristics;
      const sys = u.farmingSystem;
      const lab = u.householdLabour;
      const biz = u.businessExperience;
      const goals = u.goalsPriorities;
      const status = u.onboardingStatus;

      const hasS1 = Boolean(fp || fm || os || asp || dp);
      const hasS2 = Boolean(loc || char || sys || lab || biz || goals);

      const timestamp = new Date(u.updatedAt || u.createdAt).toISOString().replace("T", " ").substring(0, 19);
      const phoneVal = formatPhone(u.phone);
      const futureFarmId = "FFF-KE-000-001"; // Standardized system ID

      // --- ROW FOR SURVEY 1 ---
      if (hasS1) {
        s1Rows.push([
          timestamp,
          u.name,
          u.email,
          phoneVal,
          u.farmName || "",
          (fp && fm && os && asp && dp) ? "Completed" : "In Progress",
          cleanField(fp?.jobTitle),
          cleanField(fp?.valueChain),
          cleanField(fp?.experienceYears),
          cleanField(fp?.businessHistory),
          cleanField(fp?.educationLevel || fp?.education),
          cleanField(fm?.mgmtAbility),
          cleanField(fm?.opsResponsibility || fm?.operationsResponsible),
          cleanField(fm?.desiredInvolvement),
          cleanField(os?.decisionStyle),
          cleanField(os?.failureResponse),
          cleanField(os?.obstacles),
          cleanField(os?.guidancePreference),
          cleanField(os?.trackingFrequency),
          cleanField(os?.updatePreference || os?.updatePreferences),
          cleanField(asp?.twelveMonthSuccess),
          cleanField(asp?.greatestImpactSupport),
          cleanField(asp?.marketInsight),
          cleanField(asp?.threeToFiveYearRole),
          cleanField(asp?.fmResponsibility || asp?.managerResponsibilities),
          cleanField(asp?.personallyApprovedDecisions),
          cleanField(asp?.twentyFiveYearVision),
          cleanField(dp?.supportReasons),
          cleanField(dp?.remoteConfidence),
          cleanField(dp?.remoteComfort),
          cleanField(dp?.recordKeeping),
          cleanField(dp?.physicalAudits),
          cleanField(dp?.additionalNotes),
        ]);
      }

      // --- ROW FOR SURVEY 2 ---
      if (hasS2 || hasS1) {
        s2Rows.push([
          timestamp,
          futureFarmId,
          u.name,
          u.email,
          phoneVal,
          u.farmName || "",
          cleanField(loc?.locationSearch),
          cleanField(loc?.county),
          cleanField(loc?.subcounty),
          cleanField(loc?.ward),
          cleanField(loc?.landmark),
          formatCoordinates(loc?.latitude, loc?.longitude),
          cleanField(char?.farmSize),
          cleanField(char?.farmUnit || "Acres"),
          cleanField(char?.cultivatedAcres),
          cleanField(char?.grazingAcres),
          cleanField(char?.landTenure),
          cleanField(char?.waterSources),
          cleanField(char?.soilTested),
          cleanField(sys?.enterprises),
          cleanField(sys?.cultivationMethod),
          cleanField(sys?.mechanizationSetup),
          cleanField(sys?.energySource),
          cleanField(lab?.permanentWorkers),
          cleanField(lab?.seasonalWorkers),
          cleanField(lab?.managementStructure),
          cleanField(lab?.fairEmploymentPractices),
          cleanField(biz?.commercialYears),
          cleanField(biz?.annualRevenueBracket),
          cleanField(biz?.recordKeepingMethod),
          cleanField(biz?.produceBuyers),
          cleanField(goals?.goals),
          cleanField(goals?.operationalBottleneck),
          cleanField(goals?.advisoryMode),
        ]);
      }

      // --- ROW FOR MASTER CONSOLIDATED ---
      if (hasS1 || hasS2) {
        masterRows.push([
          timestamp,
          futureFarmId,
          u.name,
          u.email,
          phoneVal,
          u.farmName || "",
          status?.stage || "INITIAL_COMPLETED",
          status?.profileApproved ? "Yes" : "No",

          // S1 fields
          cleanField(fp?.jobTitle),
          cleanField(fp?.valueChain),
          cleanField(fp?.experienceYears),
          cleanField(fp?.businessHistory),
          cleanField(fp?.educationLevel || fp?.education),
          cleanField(fm?.mgmtAbility),
          cleanField(fm?.opsResponsibility || fm?.operationsResponsible),
          cleanField(fm?.desiredInvolvement),
          cleanField(os?.decisionStyle),
          cleanField(os?.failureResponse),
          cleanField(os?.obstacles),
          cleanField(os?.guidancePreference),
          cleanField(os?.trackingFrequency),
          cleanField(os?.updatePreference || os?.updatePreferences),
          cleanField(asp?.twelveMonthSuccess),
          cleanField(asp?.greatestImpactSupport),
          cleanField(asp?.marketInsight),
          cleanField(asp?.threeToFiveYearRole),
          cleanField(asp?.fmResponsibility || asp?.managerResponsibilities),
          cleanField(asp?.personallyApprovedDecisions),
          cleanField(asp?.twentyFiveYearVision),
          cleanField(dp?.supportReasons),
          cleanField(dp?.remoteConfidence),
          cleanField(dp?.remoteComfort),
          cleanField(dp?.recordKeeping),
          cleanField(dp?.physicalAudits),
          cleanField(dp?.additionalNotes),

          // S2 fields
          cleanField(loc?.locationSearch),
          cleanField(loc?.county),
          cleanField(loc?.subcounty),
          cleanField(loc?.ward),
          cleanField(loc?.landmark),
          formatCoordinates(loc?.latitude, loc?.longitude),
          cleanField(char?.farmSize),
          cleanField(char?.farmUnit || "Acres"),
          cleanField(char?.cultivatedAcres),
          cleanField(char?.grazingAcres),
          cleanField(char?.landTenure),
          cleanField(char?.waterSources),
          cleanField(char?.soilTested),
          cleanField(sys?.enterprises),
          cleanField(sys?.cultivationMethod),
          cleanField(sys?.mechanizationSetup),
          cleanField(sys?.energySource),
          cleanField(lab?.permanentWorkers),
          cleanField(lab?.seasonalWorkers),
          cleanField(lab?.fairEmploymentPractices),
          cleanField(biz?.commercialYears),
          cleanField(biz?.annualRevenueBracket),
          cleanField(biz?.recordKeepingMethod),
          cleanField(biz?.produceBuyers),
          cleanField(goals?.goals),
          cleanField(goals?.operationalBottleneck),
        ]);
      }
    }

    // Write Master Rows
    if (masterRows.length > 0) {
      console.log(`Writing ${masterRows.length} entries to 'Master Consolidated'...`);
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Master%20Consolidated!A3:BI${2 + masterRows.length}?valueInputOption=USER_ENTERED`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ values: masterRows }),
        }
      );
    }

    // Write Survey 1 Rows
    if (s1Rows.length > 0) {
      console.log(`Writing ${s1Rows.length} entries to 'Survey 1 - Farmer (Shambany)'...`);
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Survey%201%20-%20Farmer%20(Shambany)!A3:AG${2 + s1Rows.length}?valueInputOption=USER_ENTERED`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ values: s1Rows }),
        }
      );
    }

    // Write Survey 2 Rows
    if (s2Rows.length > 0) {
      console.log(`Writing ${s2Rows.length} entries to 'Survey 2 - Farm Profile'...`);
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Survey%202%20-%20Farm%20Profile!A3:AH${2 + s2Rows.length}?valueInputOption=USER_ENTERED`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ values: s2Rows }),
        }
      );
    }

    // =========================================================================
    // 5. STYLING & FORMATTING (MERGE CELLS, FREEZE ROWS, HEADER COLORS)
    // =========================================================================
    console.log("Applying cell styling, colors, and borders...");
    const formatRequests: any[] = [];

    // Master Consolidated Formatting
    // Merges:
    // 0-8: Identifiers
    // 8-35: Survey 1
    // 35-61: Survey 2
    formatRequests.push(
      {
        mergeCells: {
          range: { sheetId: masterSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
          mergeType: "MERGE_ALL",
        },
      },
      {
        mergeCells: {
          range: { sheetId: masterSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 8, endColumnIndex: 35 },
          mergeType: "MERGE_ALL",
        },
      },
      {
        mergeCells: {
          range: { sheetId: masterSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 35, endColumnIndex: 61 },
          mergeType: "MERGE_ALL",
        },
      },
      // Row 1 Background & Text Styling for Master
      {
        repeatCell: {
          range: { sheetId: masterSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.0, green: 0.28, blue: 0.14 },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE",
              textFormat: { foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 }, bold: true, fontSize: 11 },
            },
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
        },
      },
      {
        repeatCell: {
          range: { sheetId: masterSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 8, endColumnIndex: 35 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.08, green: 0.35, blue: 0.65 },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE",
              textFormat: { foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 }, bold: true, fontSize: 11 },
            },
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
        },
      },
      {
        repeatCell: {
          range: { sheetId: masterSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 35, endColumnIndex: 61 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.16, green: 0.45, blue: 0.2 },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE",
              textFormat: { foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 }, bold: true, fontSize: 11 },
            },
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
        },
      },
      // Row 2 Header Styling
      {
        repeatCell: {
          range: { sheetId: masterSheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 61 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.94, green: 0.96, blue: 0.95 },
              textFormat: { foregroundColor: { red: 0.1, green: 0.15, blue: 0.1 }, bold: true, fontSize: 10 },
              horizontalAlignment: "LEFT",
              verticalAlignment: "MIDDLE",
            },
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
        },
      }
    );

    // Apply format requests
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ requests: formatRequests }),
    });

    console.log("\n=========================================================================");
    console.log("GOOGLE SPREADSHEET SUCCESSFULLY UPDATED TO INCLUDE BOTH ONBOARDINGS!");
    console.log("Sheets Created / Synchronized:");
    console.log("  1. Master Consolidated (Combined Profile + Survey 1 + Survey 2)");
    console.log("  2. Survey 1 - Farmer (Shambany) (Steps 1 to 5)");
    console.log("  3. Survey 2 - Farm Profile (Location, Land, Systems, Labour, Business & Goals)");
    console.log("  4. Question Dictionary (Complete question & field metadata for both surveys)");
    console.log(`URL: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
    console.log("=========================================================================");
  } catch (err: any) {
    console.error("Error updating spreadsheet:", err.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
