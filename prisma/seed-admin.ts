/**
 * Admin + geo seed (idempotent — safe to re-run).
 *
 *  - 54 African countries (initials, name, dial code, computed flag emoji)
 *  - Kenya's 47 counties (official KNBS numeric codes)
 *  - Kenya's 290 sub-counties (constituencies) for every county
 *  - A small sample of Kenyan towns (add the rest in /admin → Geography)
 *  - The seeded staff account from SEED_ADMIN_* env vars. Its password is
 *    RANDOM and printed once — the admin then uses "Forgot password" to set
 *    their own strong password. Re-runs never reset an existing password.
 *
 * Run: npm run db:seed:admin
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import kenyaSubCounties from "./data/kenya-subcounties.json";
import crypto from "crypto";

const prisma = new PrismaClient();

function flag(initials: string): string {
  return String.fromCodePoint(
    ...[...initials.toUpperCase()].map((c) => 127397 + c.charCodeAt(0))
  );
}

// [initials, name, dialCode] — 54 African states
const COUNTRIES: Array<[string, string, string]> = [
  ["DZ", "Algeria", "+213"],
  ["AO", "Angola", "+244"],
  ["BJ", "Benin", "+229"],
  ["BW", "Botswana", "+267"],
  ["BF", "Burkina Faso", "+226"],
  ["BI", "Burundi", "+257"],
  ["CM", "Cameroon", "+237"],
  ["CV", "Cabo Verde", "+238"],
  ["CF", "Central African Republic", "+236"],
  ["TD", "Chad", "+235"],
  ["KM", "Comoros", "+269"],
  ["CG", "Congo (Republic)", "+242"],
  ["CD", "Congo (DRC)", "+243"],
  ["CI", "Côte d'Ivoire", "+225"],
  ["DJ", "Djibouti", "+253"],
  ["EG", "Egypt", "+20"],
  ["GQ", "Equatorial Guinea", "+240"],
  ["ER", "Eritrea", "+291"],
  ["SZ", "Eswatini", "+268"],
  ["ET", "Ethiopia", "+251"],
  ["GA", "Gabon", "+241"],
  ["GM", "Gambia", "+220"],
  ["GH", "Ghana", "+233"],
  ["GN", "Guinea", "+224"],
  ["GW", "Guinea-Bissau", "+245"],
  ["KE", "Kenya", "+254"],
  ["LS", "Lesotho", "+266"],
  ["LR", "Liberia", "+231"],
  ["LY", "Libya", "+218"],
  ["MG", "Madagascar", "+261"],
  ["MW", "Malawi", "+265"],
  ["ML", "Mali", "+223"],
  ["MR", "Mauritania", "+222"],
  ["MU", "Mauritius", "+230"],
  ["MA", "Morocco", "+212"],
  ["MZ", "Mozambique", "+258"],
  ["NA", "Namibia", "+264"],
  ["NE", "Niger", "+227"],
  ["NG", "Nigeria", "+234"],
  ["RW", "Rwanda", "+250"],
  ["ST", "São Tomé and Príncipe", "+239"],
  ["SN", "Senegal", "+221"],
  ["SC", "Seychelles", "+248"],
  ["SL", "Sierra Leone", "+232"],
  ["SO", "Somalia", "+252"],
  ["ZA", "South Africa", "+27"],
  ["SS", "South Sudan", "+211"],
  ["SD", "Sudan", "+249"],
  ["TZ", "Tanzania", "+255"],
  ["TG", "Togo", "+228"],
  ["TN", "Tunisia", "+216"],
  ["UG", "Uganda", "+256"],
  ["ZM", "Zambia", "+260"],
  ["ZW", "Zimbabwe", "+263"],
];

// [code, name] — Kenya's 47 counties (official KNBS codes)
const KENYA_COUNTIES: Array<[string, string]> = [
  ["001", "Mombasa"], ["002", "Kwale"], ["003", "Kilifi"], ["004", "Tana River"],
  ["005", "Lamu"], ["006", "Taita Taveta"], ["007", "Garissa"], ["008", "Wajir"],
  ["009", "Mandera"], ["010", "Marsabit"], ["011", "Isiolo"], ["012", "Meru"],
  ["013", "Tharaka Nithi"], ["014", "Embu"], ["015", "Kitui"], ["016", "Machakos"],
  ["017", "Makueni"], ["018", "Nyandarua"], ["019", "Nyeri"], ["020", "Kirinyaga"],
  ["021", "Murang'a"], ["022", "Kiambu"], ["023", "Turkana"], ["024", "West Pokot"],
  ["025", "Samburu"], ["026", "Trans Nzoia"], ["027", "Uasin Gishu"],
  ["028", "Elgeyo Marakwet"], ["029", "Nandi"], ["030", "Baringo"],
  ["031", "Laikipia"], ["032", "Nakuru"], ["033", "Narok"], ["034", "Kajiado"],
  ["035", "Kericho"], ["036", "Bomet"], ["037", "Kakamega"], ["038", "Vihiga"],
  ["039", "Bungoma"], ["040", "Busia"], ["041", "Siaya"], ["042", "Kisumu"],
  ["043", "Homa Bay"], ["044", "Migori"], ["045", "Kisii"], ["046", "Nyamira"],
  ["047", "Nairobi"],
];

// [countyCode, townCode, townName] — samples only; extend in /admin
const SAMPLE_TOWNS: Array<[string, string, string]> = [
  ["047", "WESTLANDS", "Westlands"],
  ["047", "KIBRA", "Kibra"],
  ["047", "EMBAKASI", "Embakasi"],
  ["047", "KASARANI", "Kasarani"],
  ["047", "DAGORETTI", "Dagoretti"],
  ["032", "NAKURU_TOWN", "Nakuru Town"],
  ["032", "NAIVASHA", "Naivasha"],
  ["032", "MOLO", "Molo"],
  ["032", "GILGIL", "Gilgil"],
  ["001", "NYALI", "Nyali"],
  ["001", "LIKONI", "Likoni"],
  ["001", "KISAUNI", "Kisauni"],
  ["042", "KISUMU_CENTRAL", "Kisumu Central"],
  ["042", "AHERO", "Ahero"],
  ["027", "ELDORET_TOWN", "Eldoret Town"],
  ["027", "TURBO", "Turbo"],
  ["022", "THIKA", "Thika"],
  ["022", "RUIRU", "Ruiru"],
  ["022", "KIKUYU", "Kikuyu"],
];

function randomPassword(length = 16): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

async function main() {
  console.log("Seeding countries...");
  for (const [initials, name, dialCode] of COUNTRIES) {
    await prisma.country.upsert({
      where: { initials },
      create: { initials, name, dialCode, flagEmoji: flag(initials) },
      update: { name, dialCode, flagEmoji: flag(initials) },
    });
  }
  console.log(`  ${COUNTRIES.length} countries upserted.`);

  console.log("Seeding Kenya counties...");
  for (const [code, name] of KENYA_COUNTIES) {
    await prisma.countyOrProvince.upsert({
      where: { countryCode_code: { countryCode: "KE", code } },
      create: { countryCode: "KE", code, name },
      update: { name },
    });
  }
  console.log(`  ${KENYA_COUNTIES.length} counties upserted.`);

  console.log("Seeding Kenya sub-counties...");
  for (const row of kenyaSubCounties.subCounties) {
    await prisma.countyOrProvince.upsert({
      where: { countryCode_code: { countryCode: "KE", code: row.county } },
      create: { countryCode: "KE", code: row.county, name: row.county },
      update: {},
    });
    await prisma.subCounty.upsert({
      where: {
        countryCode_countyCode_code: {
          countryCode: "KE",
          countyCode: row.county,
          code: row.code,
        },
      },
      create: { countryCode: "KE", countyCode: row.county, code: row.code, name: row.name },
      update: { name: row.name },
    });
  }
  console.log(`  ${kenyaSubCounties.subCounties.length} sub-counties upserted.`);

  console.log("Seeding sample towns...");
  for (const [countyCode, code, name] of SAMPLE_TOWNS) {
    await prisma.countyOrProvince.upsert({
      where: { countryCode_code: { countryCode: "KE", code: countyCode } },
      create: { countryCode: "KE", code: countyCode, name: countyCode },
      update: {},
    });
    await prisma.town.upsert({
      where: { countryCode_countyCode_code: { countryCode: "KE", countyCode, code } },
      create: { countryCode: "KE", countyCode, code, name },
      update: { name },
    });
  }
  console.log(`  ${SAMPLE_TOWNS.length} sample towns upserted.`);

  // ---- Seeded staff account (env-driven, random password) ----
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "").toLowerCase().trim();
  if (!adminEmail) {
    console.log("SEED_ADMIN_EMAIL not set — skipping staff seed.");
    return;
  }
  const firstName = process.env.SEED_ADMIN_FIRST_NAME?.trim() || "Admin";
  const middleName = process.env.SEED_ADMIN_MIDDLE_NAME?.trim() || null;
  const lastName = process.env.SEED_ADMIN_LAST_NAME?.trim() || "User";
  const role = process.env.SEED_ADMIN_ROLE?.trim() || "FFAdmin";
  const countryCode = (process.env.SEED_ADMIN_COUNTRY || "KE").toUpperCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        firstName,
        middleName,
        lastName,
        name: [firstName, middleName, lastName].filter(Boolean).join(" "),
        role,
        countryCode,
        accountStatus: "VERIFIED",
        authProvider: "password",
      },
    });
    console.log(`Staff account ${adminEmail} already exists — details refreshed, password UNCHANGED.`);
    console.log("Use /forgot-password to set a new password if needed.");
    return;
  }

  const tempPassword = randomPassword(16);
  const passwordHash = await bcrypt.hash(tempPassword, 10);
  await prisma.user.create({
    data: {
      firstName,
      middleName,
      lastName,
      name: [firstName, middleName, lastName].filter(Boolean).join(" "),
      email: adminEmail,
      passwordHash,
      authProvider: "password",
      accountStatus: "VERIFIED",
      role,
      countryCode,
    },
  });

  console.log("");
  console.log("================================================================");
  console.log(`Seeded staff account: ${adminEmail}  (role: ${role})`);
  console.log(`ONE-TIME temporary password: ${tempPassword}`);
  console.log("This password is random and will NOT be shown again.");
  console.log("Go to /forgot-password to set your own strong password.");
  console.log("================================================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
