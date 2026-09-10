import crypto from "crypto";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { ALL_PILLARS } from "@/data/allPillarsData";

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
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const trimmed = process.env.GOOGLE_SERVICE_ACCOUNT_KEY.trim();
      const decoded = trimmed.startsWith("{")
        ? trimmed
        : Buffer.from(trimmed, "base64").toString("utf-8");
      return JSON.parse(decoded);
    } catch (e) {
      console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY env var:", e);
    }
  }

  const credentialsPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS || "./google-service-account.json";
  const resolvedPath = path.resolve(/*turbopackIgnore: true*/ process.cwd(), credentialsPath);

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

export const DEFAULT_SPREADSHEET_ID = "1tEYJhZijyMfaZ8_btZmC9_5UJRLk4af2luL1vKixSyM";
export const DEFAULT_ASSESSMENT_SPREADSHEET_ID = "1lia89URlWwsngU0E7Kd5zyQTzm-SBWlQj2Lsu08b1wg";

/**
 * Records an authenticated user to the 'Registered Users' directory in the Google Spreadsheet
 * and ensures their assigned Future Farms Production ID is permanently registered.
 */
export async function recordUserToSheet(
  userRecord: any,
  clerkUserData?: any,
  spreadsheetId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const id = spreadsheetId || process.env.GOOGLE_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;

    const assignedId =
      userRecord.futureFarmId ||
      (userRecord.id ? `FFF-KE-PROD-${userRecord.id.slice(-4).toUpperCase()}` : "FFF-KE-PROD");

    const regDate = userRecord.createdAt
      ? new Date(userRecord.createdAt).toISOString().replace("T", " ").substring(0, 19)
      : new Date().toISOString().replace("T", " ").substring(0, 19);

    const now = new Date().toISOString().replace("T", " ").substring(0, 19);
    const county =
      userRecord.farmLocation?.county || userRecord.farmLocation?.locationSearch || "";

    const formatPhone = (p: string | null | undefined) => {
      if (!p) return "";
      const trimmed = p.trim();
      return trimmed.startsWith("+") ? `'${trimmed}` : trimmed;
    };

    const clerkId = clerkUserData?.id || "";

    const rowData = [
      regDate,
      assignedId,
      userRecord.name || "Farmer",
      userRecord.email,
      formatPhone(userRecord.phone),
      userRecord.farmName || "",
      county,
      "Clerk Authentication",
      clerkId,
      userRecord.id,
      "Active",
      userRecord.onboardingStatus?.stage || "NEW_REGISTERED",
      now,
    ];

    // Check if user's email already exists in 'Registered Users'!D3:D
    try {
      const emailRows = await getSheetValues("'Registered Users'!D3:D", id);
      let existingRowIndex = -1;
      if (emailRows && emailRows.length > 0) {
        for (let i = 0; i < emailRows.length; i++) {
          const rowEmail = emailRows[i][0];
          if (
            rowEmail &&
            rowEmail.toLowerCase().trim() === userRecord.email.toLowerCase().trim()
          ) {
            existingRowIndex = i + 3;
            break;
          }
        }
      }

      if (existingRowIndex > 0) {
        await updateSheetValues(
          `'Registered Users'!A${existingRowIndex}:M${existingRowIndex}`,
          [rowData],
          id
        );
      } else {
        await appendSheetValues("'Registered Users'!A:M", [rowData], id);
      }
    } catch (err) {
      console.warn("Could not sync to 'Registered Users' tab, attempting append:", err);
      try {
        await appendSheetValues("'Registered Users'!A:M", [rowData], id);
      } catch (appendErr) {
        console.warn("Append to 'Registered Users' also failed:", appendErr);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in recordUserToSheet:", error.message || error);
    return { success: false, error: error.message };
  }
}

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
    const futureFarmId =
      userRecord.futureFarmId ||
      (userRecord.id ? `FFF-KE-PROD-${userRecord.id.slice(-4).toUpperCase()}` : "FFF-KE-PROD");

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

/**
 * Synchronizes a user's assessment data (FFMI score, pillar scores, question responses)
 * to the dedicated Assessment Questionnaire Google Spreadsheet:
 * 1. Assessment Overview (Consolidated score card per farm)
 * 2. Pillar Submissions Log (History of completed pillars)
 * 3. Detailed Question Responses (Question-by-question responses)
 */
export async function syncUserAssessmentToSheet(
  userEmail: string,
  pillarId?: number,
  spreadsheetId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const id =
      spreadsheetId ||
      process.env.GOOGLE_ASSESSMENT_SPREADSHEET_ID ||
      DEFAULT_ASSESSMENT_SPREADSHEET_ID;

    // Fetch user and latest assessment data
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        farmerProfile: true,
        farmLocation: true,
        farmCharacteristics: true,
        assessments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            pillarAssessments: true,
            assessmentResponses: true,
          },
        },
      },
    });

    if (!user || user.assessments.length === 0) {
      return { success: true, error: "No assessment found to sync." };
    }

    const assessment = user.assessments[0];
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

    // Map pillar scores
    const pScores: Record<number, number> = {};
    assessment.pillarAssessments.forEach((pa) => {
      pScores[pa.pillarId] = pa.score;
    });

    const yesCount = assessment.assessmentResponses.filter((r) => r.answer === "yes").length;
    const noCount = assessment.assessmentResponses.filter((r) => r.answer === "no").length;

    const overviewRow = [
      timestamp,
      user.name || "Farmer",
      user.email,
      user.phone ? `'${user.phone}` : "",
      user.farmName || "Green Horizon Agri-Farm",
      user.farmLocation?.locationSearch || user.farmLocation?.county || "Nakuru County",
      user.farmCharacteristics?.farmSize ? String(user.farmCharacteristics.farmSize) : "12.5",
      `${Math.round(assessment.overallScore)}%`,
      assessment.maturityLevel || "Emerging Stage",
      assessment.status || "IN_PROGRESS",
      `${assessment.pillarAssessments.length} of 8`,
      pScores[1] !== undefined ? `${Math.round(pScores[1])}%` : "—",
      pScores[2] !== undefined ? `${Math.round(pScores[2])}%` : "—",
      pScores[3] !== undefined ? `${Math.round(pScores[3])}%` : "—",
      pScores[4] !== undefined ? `${Math.round(pScores[4])}%` : "—",
      pScores[5] !== undefined ? `${Math.round(pScores[5])}%` : "—",
      pScores[6] !== undefined ? `${Math.round(pScores[6])}%` : "—",
      pScores[7] !== undefined ? `${Math.round(pScores[7])}%` : "—",
      pScores[8] !== undefined ? `${Math.round(pScores[8])}%` : "—",
      yesCount,
      noCount,
      noCount > 0 ? `${noCount} improvement areas flagged` : "All capabilities met",
      timestamp,
    ];

    // 1. Sync to Assessment Overview Tab (match by email in Column C)
    try {
      const emailColValues = await getSheetValues("'Assessment Overview'!C3:C", id);
      let rowIndex = -1;
      if (emailColValues && emailColValues.length > 0) {
        for (let i = 0; i < emailColValues.length; i++) {
          const rowEmail = emailColValues[i][0];
          if (rowEmail && rowEmail.toLowerCase().trim() === user.email.toLowerCase().trim()) {
            rowIndex = i + 3;
            break;
          }
        }
      }

      if (rowIndex > 0) {
        await updateSheetValues(`'Assessment Overview'!A${rowIndex}:W${rowIndex}`, [overviewRow], id);
      } else {
        await appendSheetValues("'Assessment Overview'!A:W", [overviewRow], id);
      }
    } catch (err) {
      console.warn("Could not sync to Assessment Overview tab:", err);
    }

    // 2. Sync to Pillar Submissions Log Tab (if pillarId provided or from assessment)
    if (pillarId) {
      const pa = assessment.pillarAssessments.find((p) => p.pillarId === pillarId);
      if (pa) {
        const submissionRow = [
          timestamp,
          user.name || "Farmer",
          user.email,
          user.farmName || "Green Horizon Agri-Farm",
          pa.pillarId,
          pa.pillarName,
          `${Math.round(pa.score)}%`,
          pa.yesCount,
          pa.noCount,
          pa.totalQuestions,
          pa.maturityLevel,
          pa.capabilityScores || "{}",
          `${pa.noCount} gap(s) identified for action`,
        ];

        try {
          await appendSheetValues("'Pillar Submissions Log'!A:M", [submissionRow], id);
        } catch (err) {
          console.warn("Could not sync to Pillar Submissions Log tab:", err);
        }
      }
    }

    // 3. Sync to Detailed Question Responses Tab
    const responsesToSync = pillarId
      ? assessment.assessmentResponses.filter((r) => r.pillarId === pillarId)
      : assessment.assessmentResponses;

    if (responsesToSync.length > 0) {
      const questionResponseRows = responsesToSync.map((r) => {
        const qMeta = ALL_PILLARS.flatMap((p) => p.capabilities)
          .flatMap((c) => c.questions)
          .find((q) => q.id === r.questionId);

        return [
          timestamp,
          user.email,
          user.name || "Farmer",
          r.pillarId,
          `Pillar ${r.pillarId}`,
          r.capabilityId,
          r.capabilityName,
          r.questionId,
          r.questionText,
          r.answer === "yes" ? "Yes" : "No",
          qMeta?.priority || "🟢 Quick Win",
          r.recommendation || qMeta?.recommendation || "",
          r.whyItMatters || qMeta?.whyItMatters || "",
          r.quickWin || qMeta?.quickWin || "",
          r.supportAvailable || qMeta?.supportAvailable || "",
        ];
      });

      try {
        await appendSheetValues("'Detailed Question Responses'!A:O", questionResponseRows, id);
      } catch (err) {
        console.warn("Could not sync to Detailed Question Responses tab:", err);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error syncing assessment to Google Sheet:", error.message || error);
    return { success: false, error: error.message };
  }
}


