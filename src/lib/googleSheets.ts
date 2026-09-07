import crypto from "crypto";
import fs from "fs";
import path from "path";

interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getServiceAccount(): ServiceAccountCredentials {
  const credentialsPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS || "./google-service-account.json";
  const resolvedPath = path.resolve(process.cwd(), credentialsPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Google service account credentials not found at ${resolvedPath}`);
  }

  const raw = fs.readFileSync(resolvedPath, "utf-8");
  return JSON.parse(raw);
}

export async function getGoogleSheetsAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && tokenExpiresAt > now + 60) {
    return cachedAccessToken;
  }

  const sa = getServiceAccount();

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const claimSet = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const signingInput = `${encodedHeader}.${encodedClaimSet}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(sa.private_key);
  const encodedSignature = signature
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${signingInput}.${encodedSignature}`;

  const params = new URLSearchParams();
  params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  params.append("assertion", jwt);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`OAuth2 token error (${res.status}): ${JSON.stringify(data)}`);
  }

  cachedAccessToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 3600);
  return data.access_token;
}

const DEFAULT_SPREADSHEET_ID = "1tEYJhZijyMfaZ8_btZmC9_5UJRLk4af2luL1vKixSyM";

export async function getSpreadsheetMetadata(spreadsheetId?: string) {
  const id = spreadsheetId || process.env.GOOGLE_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
  const token = await getGoogleSheetsAccessToken();
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to fetch spreadsheet (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

export async function getSheetValues(range: string, spreadsheetId?: string) {
  const id = spreadsheetId || process.env.GOOGLE_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
  const token = await getGoogleSheetsAccessToken();
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(range)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to fetch sheet values (${res.status}): ${JSON.stringify(data)}`);
  }
  return data.values || [];
}

export async function updateSheetValues(range: string, values: any[][], spreadsheetId?: string) {
  const id = spreadsheetId || process.env.GOOGLE_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
  const token = await getGoogleSheetsAccessToken();
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(
      range
    )}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to update sheet values (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

export async function appendSheetValues(range: string, values: any[][], spreadsheetId?: string) {
  const id = spreadsheetId || process.env.GOOGLE_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
  const token = await getGoogleSheetsAccessToken();
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to append sheet values (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

/**
 * Synchronizes a user's database onboarding responses (both Survey 1 and Survey 2)
 * to the Google Spreadsheet across:
 * 1. Master Consolidated (Combined profile)
 * 2. Survey 1 - Farmer (Shambany) (Steps 1-5)
 * 3. Survey 2 - Farm Profile (Location, Land, Systems, Labour, Business & Goals)
 */
export async function syncUserOnboardingToSheet(
  userRecord: any,
  spreadsheetId?: string
) {
  try {
    const id = spreadsheetId || process.env.GOOGLE_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
    const fp = userRecord.farmerProfile;
    const fm = userRecord.farmManagement;
    const os = userRecord.operatingStyle;
    const asp = userRecord.aspiration;
    const dp = userRecord.digitalPlatform;

    const loc = userRecord.farmLocation;
    const char = userRecord.farmCharacteristics;
    const sys = userRecord.farmingSystem;
    const lab = userRecord.householdLabour;
    const biz = userRecord.businessExperience;
    const goals = userRecord.goalsPriorities;
    const status = userRecord.onboardingStatus;

    const hasS1 = Boolean(fp || fm || os || asp || dp);
    const hasS2 = Boolean(loc || char || sys || lab || biz || goals);

    if (!hasS1 && !hasS2) {
      return { success: true, message: "No onboarding data to sync." };
    }

    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
    const futureFarmId = "FFF-KE-000-001";

    const cleanField = (val: any) => {
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
    };

    const formatPhone = (p: string | null | undefined) => {
      if (!p) return "";
      const trimmed = p.trim();
      return trimmed.startsWith("+") ? `'${trimmed}` : trimmed;
    };

    const formatCoordinates = (lat: number | null | undefined, lng: number | null | undefined) => {
      if (lat === null || lat === undefined || lng === null || lng === undefined) return "";
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    };

    // --- 1. SYNC SURVEY 1 - FARMER (SHAMBANY) ---
    if (hasS1) {
      const s1RowData = [
        timestamp,
        userRecord.name || "Farmer",
        userRecord.email,
        formatPhone(userRecord.phone),
        userRecord.farmName || "",
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
      ];

      try {
        const s1EmailValues = await getSheetValues("'Survey 1 - Farmer (Shambany)'!C3:C", id);
        let s1RowIndex = -1;
        if (s1EmailValues && s1EmailValues.length > 0) {
          for (let i = 0; i < s1EmailValues.length; i++) {
            const rowEmail = s1EmailValues[i][0];
            if (rowEmail && rowEmail.toLowerCase().trim() === userRecord.email.toLowerCase().trim()) {
              s1RowIndex = i + 3;
              break;
            }
          }
        }

        if (s1RowIndex > 0) {
          await updateSheetValues(
            `'Survey 1 - Farmer (Shambany)'!A${s1RowIndex}:AG${s1RowIndex}`,
            [s1RowData],
            id
          );
        } else {
          await appendSheetValues(
            "'Survey 1 - Farmer (Shambany)'!A:AG",
            [s1RowData],
            id
          );
        }
      } catch (err) {
        console.warn("Could not sync to Survey 1 tab:", err);
      }
    }

    // --- 2. SYNC SURVEY 2 - FARM PROFILE ---
    if (hasS2 || hasS1) {
      const s2RowData = [
        timestamp,
        futureFarmId,
        userRecord.name || "Farmer",
        userRecord.email,
        formatPhone(userRecord.phone),
        userRecord.farmName || "",
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
      ];

      try {
        const s2EmailValues = await getSheetValues("'Survey 2 - Farm Profile'!D3:D", id);
        let s2RowIndex = -1;
        if (s2EmailValues && s2EmailValues.length > 0) {
          for (let i = 0; i < s2EmailValues.length; i++) {
            const rowEmail = s2EmailValues[i][0];
            if (rowEmail && rowEmail.toLowerCase().trim() === userRecord.email.toLowerCase().trim()) {
              s2RowIndex = i + 3;
              break;
            }
          }
        }

        if (s2RowIndex > 0) {
          await updateSheetValues(
            `'Survey 2 - Farm Profile'!A${s2RowIndex}:AH${s2RowIndex}`,
            [s2RowData],
            id
          );
        } else {
          await appendSheetValues(
            "'Survey 2 - Farm Profile'!A:AH",
            [s2RowData],
            id
          );
        }
      } catch (err) {
        console.warn("Could not sync to Survey 2 tab:", err);
      }
    }

    // --- 3. SYNC MASTER CONSOLIDATED ---
    const masterRowData = [
      timestamp,
      futureFarmId,
      userRecord.name || "Farmer",
      userRecord.email,
      formatPhone(userRecord.phone),
      userRecord.farmName || "",
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
    ];

    try {
      const masterEmailValues = await getSheetValues("'Master Consolidated'!D3:D", id);
      let masterRowIndex = -1;
      if (masterEmailValues && masterEmailValues.length > 0) {
        for (let i = 0; i < masterEmailValues.length; i++) {
          const rowEmail = masterEmailValues[i][0];
          if (rowEmail && rowEmail.toLowerCase().trim() === userRecord.email.toLowerCase().trim()) {
            masterRowIndex = i + 3;
            break;
          }
        }
      }

      if (masterRowIndex > 0) {
        await updateSheetValues(
          `'Master Consolidated'!A${masterRowIndex}:BI${masterRowIndex}`,
          [masterRowData],
          id
        );
      } else {
        await appendSheetValues(
          "'Master Consolidated'!A:BI",
          [masterRowData],
          id
        );
      }
    } catch (err) {
      console.warn("Could not sync to Master Consolidated tab:", err);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error syncing onboarding to Google Sheet:", error.message || error);
    return { success: false, error: error.message };
  }
}

