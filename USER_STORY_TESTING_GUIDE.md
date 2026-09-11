# Future Farms — End-to-End User Story Testing Guide

This document provides a step-by-step checklist to test the entire Future Farms farmer journey from initial sign-in to the final 8-Pillar Farm Assessment and Dashboard verification.

> **Key Architecture Rule**: All survey submissions and pillar audits save immediately to the local SQLite database and advance seamlessly without waiting for external Google Spreadsheet confirmations. Background cron jobs synchronize the database to the spreadsheet independently.

---

## Pre-Requisites & Test Setup

1. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Test User Account**:
   - **New Sign-Up**: Navigate to `/sign-up` and create a new account using any test email (e.g., `tester.farmer@example.com`).
   - *Or* **Direct Local Sign-In**: Navigate to `/sign-in` or `/login`.

---

## Phase 1: Welcome Hub & Survey 1 (Initial Farm Profiling: Q1 – Q27)

### Step 0: Welcome Onboarding Page
- **URL**: [`/onboarding`](http://localhost:3000/onboarding)
- **What to look for**:
  - Welcome greeting: *"Welcome to Future Farms! Your journey to a future-ready farm starts here."*
  - Progress bar showing `0%` (0 of 5 sections completed).
  - Primary CTA button: **"Start Your Onboarding Survey (Step 1/5)"**.
- **Action**: Click **"Start Your Onboarding Survey (Step 1/5)"** to begin.

---

### Step 1: Farmer Profile (Q1 – Q5)
- **URL**: [`/onboarding/step-1`](http://localhost:3000/onboarding/step-1)
- **Sample Test Inputs**:
  | Question | Field | Sample Value to Select / Enter |
  | :--- | :--- | :--- |
  | **Q1** | Primary Role / Job Title | Click **"Farm Owner"** card |
  | **Q2** | Primary Value Chain | Select **"Horticulture (Vegetables & Fruits)"** |
  | **Q3** | Years of Farming Experience | Select **"3–5 years"** |
  | **Q4** | Farming & Business Background | Select **"Commercial agribusiness focused on cash crops"** |
  | **Q5** | Highest Level of Education | Select **"Bachelor's Degree or Equivalent"** |
- **Action**: Click **"Save & Continue"** at the bottom right.
- **Expected Transition**: Automatically advances to **Step 2** (`/onboarding/step-2`) without delay.

---

### Step 2: Farm Management Experience (Q6 – Q8)
- **URL**: [`/onboarding/step-2`](http://localhost:3000/onboarding/step-2)
- **Sample Test Inputs**:
  | Question | Field | Sample Value to Select / Enter |
  | :--- | :--- | :--- |
  | **Q6** | Management Ability Rating | Click Star **4** (or **5**) |
  | **Q7** | Day-to-Day Operations | Select **"I manage day-to-day operations directly with hired hands"** |
  | **Q8** | Desired Involvement Level | Select **"Strategic oversight with a farm manager handling daily tasks"** |
- **Action**: Click **"Save & Continue"**.
- **Expected Transition**: Automatically advances to **Step 3** (`/onboarding/step-3`).

---

### Step 3: Your Operating Style (Q9 – Q14)
- **URL**: [`/onboarding/step-3`](http://localhost:3000/onboarding/step-3)
- **Sample Test Inputs**:
  | Question | Field | Sample Value to Select / Enter |
  | :--- | :--- | :--- |
  | **Q9** | Decision-Making Approach | Select **"Data-driven: I rely on records, weather, and market trends"** |
  | **Q10** | Response to Unforeseen Setbacks | Select **"Adapt quickly and pivot to alternative solutions"** |
  | **Q11** | Biggest Farm Growth Obstacles | Check **"Water supply & irrigation"** and **"Working capital"** |
  | **Q12** | Guidance & Advisory Preference | Select **"Structured digital advisory with periodic expert farm visits"** |
  | **Q13** | Performance Tracking Frequency | Select **"Weekly record keeping and review"** |
  | **Q14** | Preferred Communication Channels | Check **"WhatsApp"** and **"In-App Dashboard"** |
- **Action**: Click **"Save & Continue"**.
- **Expected Transition**: Automatically advances to **Step 4** (`/onboarding/step-4`).

---

### Step 4: Future Farms Aspirations (Q15 – Q21)
- **URL**: [`/onboarding/step-4`](http://localhost:3000/onboarding/step-4)
- **Sample Test Inputs**:
  | Question | Field | Sample Value to Select / Enter |
  | :--- | :--- | :--- |
  | **Q15** | 12-Month Definition of Success | Select **"Achieve commercial profitability and structured operations"** |
  | **Q16** | Greatest Desired Impact Support | Select **"Precision irrigation and automated agronomy scheduling"** |
  | **Q17** | Market Insight & Buyer Links | Select **"Direct supply contracts with premium grocery and export aggregators"** |
  | **Q18** | 3–5 Year Desired Farm Role | Select **"Executive owner focused on expansion while managers run operations"** |
  | **Q19** | Farm Manager Responsibilities | Check **"Daily labor management"**, **"Irrigation/chemical schedules"** |
  | **Q20** | Personally Approved Decisions | Select **"Major capital expenditures and new contract signing only"** |
  | **Q21** | 25-Year Generational Vision | Select **"A sustainable, tech-enabled generational farming enterprise"** |
- **Action**: Click **"Save & Continue"**.
- **Expected Transition**: Automatically advances to **Step 5** (`/onboarding/step-5`).

---

### Step 5: Digital Management Platforms (Q22 – Q27)
- **URL**: [`/onboarding/step-5`](http://localhost:3000/onboarding/step-5)
- **Sample Test Inputs**:
  | Question | Field | Sample Value to Select / Enter |
  | :--- | :--- | :--- |
  | **Q22** | Primary Motivation for Platform | Check **"Improve productivity and profitability"** |
  | **Q23** | Remote Management Confidence | Select **"Very Confident: with reliable telemetry and daily reports"** |
  | **Q24** | Remote Monitoring Comfort | Click Rating **5 / 5** |
  | **Q25** | Current Farm Record-Keeping | Select **"Digital Spreadsheets & Mobile Notes"** |
  | **Q26** | Openness to Physical Audits | Select **"Yes, quarterly on-site farm verifications"** |
  | **Q27** | Additional Notes / Specific Needs | Enter: *"Ready for smart water sensors and agronomy assistance."* |
- **Action**: Click **"Save & Complete Survey"**.
- **Expected Transition**: Automatically routes back to the **Welcome Onboarding Page** (`/onboarding`).

---

## Phase 2: Transition & Survey 2 (Farm Systems Deep Dive: 5 Sections)

### Step 6: Welcome Page Phase Transition Check
- **URL**: [`/onboarding`](http://localhost:3000/onboarding)
- **What to look for**:
  - Banner state: **"Survey 1 Complete (5/5) • Step 2 of 2: Second Onboarding Survey"**.
  - Title: **"Take Your Second Onboarding Survey"**.
  - Subtitle: **"Farm Systems & Operations Deep Dive"**.
  - Primary CTA button: **"Start Second Onboarding Survey"** (links to `/onboarding/location`).
- **Action**: Click **"Start Second Onboarding Survey"**.

---

### Step 7: Section 1 — Farm Location & Administrative Details
- **URL**: [`/onboarding/location`](http://localhost:3000/onboarding/location)
- **Sample Test Inputs**:
  | Field | Sample Value |
  | :--- | :--- |
  | **County** | Select **"Nakuru"** (or choose your preferred county) |
  | **Sub-County** | Select / Enter **"Naivasha"** |
  | **Ward** | Enter **"Maiella"** |
  | **Trading Center / Village** | Enter **"Kongoni Market"** |
  | **Landmark** | Enter **"Near Green Valley Primary School"** |
  | **GPS Coordinates (Optional)** | `-0.7172, 36.4310` |
- **Action**: Click **"Save & Continue"**.
- **Expected Transition**: Automatically advances to **Farm Characteristics** (`/onboarding/characteristics`).

---

### Step 8: Section 2 — Farm Characteristics & Land Tenure
- **URL**: [`/onboarding/characteristics`](http://localhost:3000/onboarding/characteristics)
- **Sample Test Inputs**:
  | Field | Sample Value |
  | :--- | :--- |
  | **Total Farm Size** | `12.5` |
  | **Unit of Measurement** | Select **"Acres"** |
  | **Cultivated Crop Land** | `8.0` |
  | **Grazing / Pasture Land** | `4.5` |
  | **Land Tenure System** | Select **"Freehold with Title Deed"** |
  | **Primary Water Source** | Select **"Solar-Powered Borehole"** |
  | **Topography / Slope** | Select **"Gentle Slope"** |
  | **Soil Type** | Select **"Volcanic Loam"** |
- **Action**: Click **"Save & Continue"**.
- **Expected Transition**: Automatically advances to **Farming System & Energy** (`/onboarding/farming-system`).

---

### Step 9: Section 3 — Farming System, Mechanization & Energy
- **URL**: [`/onboarding/farming-system`](http://localhost:3000/onboarding/farming-system)
- **Sample Test Inputs**:
  | Field | Sample Value |
  | :--- | :--- |
  | **Farming Category** | Select **"Mixed Farming (Crops & Livestock)"** |
  | **Primary Crops** | Check **"Vegetables / Horticulture"**, **"Maize"** |
  | **Livestock Present** | Check **"Dairy Cattle"**, **"Poultry"** |
  | **Irrigation Method** | Select **"Drip Irrigation & Overhead Sprinklers"** |
  | **Farm Power / Energy** | Select **"Hybrid: Solar PV & Grid Power"** |
  | **Mechanization Level** | Select **"Semi-Mechanized (Tractor service hire + hand tools)"** |
- **Action**: Click **"Save & Continue"**.
- **Expected Transition**: Automatically advances to **Business Experience** (`/onboarding/business-experience`).

---

### Step 10: Section 4 — Business & Sales Experience
- **URL**: [`/onboarding/business-experience`](http://localhost:3000/onboarding/business-experience)
- **Sample Test Inputs**:
  | Field | Sample Value |
  | :--- | :--- |
  | **Commercial Track Record** | Select **"3 to 5 years selling commercially"** |
  | **Annual Farm Revenue Bracket** | Select **"KES 500,000 – 1,500,000"** (or applicable tier) |
  | **Produce Off-takers / Buyers** | Check **"Local Wholesalers"**, **"Supermarket / Institution Contracts"** |
  | **Record-Keeping Method** | Select **"Mobile Phone App & Farm Ledgers"** |
  | **Banking & M-Pesa Integration** | Select **"Dedicated Agribusiness Bank Account & Till Number"** |
- **Action**: Click **"Save & Continue"**.
- **Expected Transition**: Automatically advances to **Household & Labour** (`/onboarding/household-labour`).

---

### Step 11: Section 5 — Household, Labour & Operational Leadership
- **URL**: [`/onboarding/household-labour`](http://localhost:3000/onboarding/household-labour)
- **Sample Test Inputs**:
  | Field | Sample Value |
  | :--- | :--- |
  | **Permanent Farm Workers** | `3` |
  | **Seasonal / Harvest Workers** | `8` |
  | **Operational Leadership Model** | Select **"Owner oversees a designated farm supervisor on site"** |
  | **Fair Employment Practices** | Check all applicable (Fair wage rates, safety gear, contracts) |
- **Action**: Click the primary CTA: **"Finish Survey & Take Assessment"**.
- **Expected Transition**:
  - Automatically saves the workforce profile.
  - Automatically sets onboarding stage to `FULLY_COMPLETED`.
  - **Takes the user directly to the Assessment Hub (`/assessment`) without waiting for Google Spreadsheet confirmations or requiring manual review hops.**

---

## Phase 3: The 8-Pillar Farm Assessment (`/assessment`)

### Step 12: Assessment Hub Overview
- **URL**: [`/assessment`](http://localhost:3000/assessment)
- **What to look for**:
  - Unlocked assessment interface displaying all 8 pillars:
    1. **Pillar 1**: Soil & Crop Health (5 Capabilities)
    2. **Pillar 2**: Water & Irrigation Management (5 Capabilities)
    3. **Pillar 3**: Farm Infrastructure & Mechanization (5 Capabilities)
    4. **Pillar 4**: Post-Harvest & Quality Management (5 Capabilities)
    5. **Pillar 5**: Business & Financial Management (5 Capabilities)
    6. **Pillar 6**: Human Resources & Social Responsibility (5 Capabilities)
    7. **Pillar 7**: Environmental Sustainability & Climate Resilience (5 Capabilities)
    8. **Pillar 8**: Digital Technology & Traceability (5 Capabilities)
  - Current FFMI Maturity Tier status.

---

### Step 13: Running a Pillar Audit (Example: Pillar 1)
- **Action**: Click **"Start Assessment"** or select **"Pillar 1: Soil & Crop Health"**.
- **URL**: `/assessment?view=focus&pillar=1`
- **Audit Questions (Answer Yes / Partial / No)**:
  - **Q1.1** (Soil Testing): Select **"Yes"** (Regular soil testing is conducted).
  - **Q1.2** (Crop Rotation): Select **"Yes"** (Structured multi-season rotation).
  - **Q1.3** (Organic Matter / Composting): Select **"Partial"** or **"Yes"**.
  - **Q1.4** (Integrated Pest Management): Select **"Yes"**.
  - **Q1.5** (Crop Scouting Records): Select **"Yes"**.
- **Action**: Click **"Submit Pillar Assessment"**.
- **Expected Behavior**:
  - Immediate submission without HTTP blocking.
  - Generates instant Pillar 1 Score (e.g. `90% • Future-Ready Level`).
  - Shows breakdown of capability gaps and verified strengths.
  - Prompts button: **"Continue to Next Pillar"** (Pillar 2) or **"Return to Assessment Hub"**.

---

### Step 14: Completing Assessment & Generating Reports
- After auditing desired pillars (or all 8 pillars):
  - Navigate to [`/assessment/summary`](http://localhost:3000/assessment/summary).
  - View the aggregate FFMI Score (out of 24 and out of 100%).
  - Click **"View Full Diagnostic Report"** to test [`/assessment/report`](http://localhost:3000/assessment/report).
  - Test the **"Download Summary (PDF)"** or **"Print Report"** button.

---

## Phase 4: Farm Dashboard & Identity Verification (`/dashboard`)

### Step 15: Farm Dashboard Verification
- **URL**: [`/dashboard`](http://localhost:3000/dashboard)
- **Verify the following dynamically loaded data**:
  1. **Top Banner**:
     - User Name (e.g. *Farmer Name*)
     - Farm Owner badge
     - Unified Farm Profile Code: `FFF-KE-PROD-XXXX`
     - Location (e.g. *Maiella, Naivasha, Nakuru County*)
  2. **8-Pillar Spider / Radar Chart**:
     - Reflects audited capability scores across the 8 pillars.
     - Interactive tooltips display individual pillar maturity percentages.
  3. **Produce & Land Summary**:
     - Displays acreage split (e.g. *8.0 Acres Cultivated*, *4.5 Acres Pasture*).
     - Water supply: *Solar-Powered Borehole*.
  4. **Opportunities Section**:
     - Displays tailored smart financing, solar pumps, and input supply opportunities.

---

## Phase 5: Database & Background Sync Verification

To verify that all submissions were stored in the database and synchronized properly:

1. **Verify SQLite Database locally**:
   ```bash
   npx prisma studio
   ```
   - Open [http://localhost:5555](http://localhost:5555).
   - Check `User`, `FarmerProfile`, `FarmLocation`, `FarmCharacteristics`, `FarmingSystem`, `HouseholdLabour`, and `AssessmentResponse` tables to verify all answered questions are stored with timestamps.

2. **Trigger Database-to-Spreadsheet Sync (Optional Manual Test)**:
   ```bash
   npm run sync:sheet
   ```
   - Verifies that the reconciliation script sweeps all users, onboarding surveys, and assessment responses to Google Sheets in the background.

---

## Summary of Seamless User Flow Checklist

- [x] **Registration/Sign-in**: Instant authentication, non-blocking registration.
- [x] **Survey 1 (Steps 1–4)**: Clicking "Save & Continue" directly advances to the next step.
- [x] **Survey 1 (Step 5)**: Clicking "Save & Complete Survey" directly returns to the `/onboarding` welcome page.
- [x] **Welcome Page**: Displays "Survey 1 Complete (5/5)" and highlights the Second Onboarding Survey.
- [x] **Survey 2 (Sections 1–4)**: Directly advances section-by-section upon saving.
- [x] **Survey 2 (Section 5 - Household & Labour)**: Clicking "Finish Survey & Take Assessment" marks stage `FULLY_COMPLETED` and routes directly to `/assessment`.
- [x] **Assessment & Dashboard**: All 8 pillars accessible; results instantly computed; dashboard displays verified farm profile.
