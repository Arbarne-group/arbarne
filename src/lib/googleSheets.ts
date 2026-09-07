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
 * Synchronizes a user's database onboarding responses to the Google Spreadsheet.
 * If the user already exists in the sheet (matched by email), updates their row.
 * Otherwise, appends a new row.
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

    const isComplete = Boolean(fp && fm && os && asp && dp);
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

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

    const rowData = [
      timestamp,
      userRecord.name || "Farmer",
      userRecord.email,
      formatPhone(userRecord.phone),
      userRecord.farmName || "",
      isComplete ? "Completed" : "In Progress",
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

    // Check if user email is already in the sheet to avoid duplicates
    const emailValues = await getSheetValues("Onboarding Responses!C3:C", id);
    let existingRowIndex = -1;

    if (emailValues && emailValues.length > 0) {
      for (let i = 0; i < emailValues.length; i++) {
        const rowEmail = emailValues[i][0];
        if (rowEmail && rowEmail.toLowerCase().trim() === userRecord.email.toLowerCase().trim()) {
          existingRowIndex = i + 3; // 1-indexed, starting from row 3
          break;
        }
      }
    }

    if (existingRowIndex > 0) {
      // Update existing row
      await updateSheetValues(
        `Onboarding Responses!A${existingRowIndex}:AG${existingRowIndex}`,
        [rowData],
        id
      );
      console.log(`Updated user ${userRecord.email} in Google Sheet at row ${existingRowIndex}`);
    } else {
      // Append as new row
      await appendSheetValues(
        "Onboarding Responses!A:AG",
        [rowData],
        id
      );
      console.log(`Appended user ${userRecord.email} to Google Sheet`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error syncing onboarding to Google Sheet:", error.message || error);
    return { success: false, error: error.message };
  }
}

