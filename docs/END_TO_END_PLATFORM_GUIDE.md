# 🌾 Future Farms Framework (FFF)  --  End-to-End Platform Guide

## 1. Executive Summary & Big-Picture Vision

The **Future Farms Framework (FFF / `arbane`)** is a farm diagnostic, benchmarking, and transformation platform designed for East African smallholders and agribusinesses.

The platform guides farmers through an 8-stage transformation pathway:
$$\text{Assess} \longrightarrow \text{Diagnose} \longrightarrow \text{Prioritise} \longrightarrow \text{Learn} \longrightarrow \text{Implement} \longrightarrow \text{Verify} \longrightarrow \text{Measure} \longrightarrow \text{Advance}$$

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. ONBOARDING & PROFILE                                                                     │
│    -  Farmer registers Farm Profile (Name, Region, Size in Acres, Crop / Enterprise)        │
└──────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. OFFLINE-FIRST SELF-ASSESSMENT                                                            │
│    -  Guided 200 Yes/No questions across 8 Pillars (IndexedDB caching + PWA sync)            │
│    -  Real-time progress bar + Ingestion Data Quality Guardrails                             │
└──────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. ANALYTICAL & ML SCORING ENGINE                                                           │
│    -  Deterministic Scorer computes 0-24 FFMI Score & assigns Canonical Maturity Tier        │
│    -  Rule Engine queries database to build 5-Field Prioritized Action Plan                  │
│    -  Machine Learning models predict 12-Month Trajectory Risk & Peer Benchmarking           │
└──────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 4. VISUAL ANALYTICS DASHBOARD (Results Screen)                                              │
│    -  🕸️ 8-Pillar Interactive Radar / Spider Chart                                           │
│    -  📊 Horizontal Capability Performance Progress Bars vs. Next Tier Target                 │
│    -  ⏱️ FFMI Score (0-24) & 12-Month Trajectory Risk Gauge                                  │
│    -  👥 Regional Peer Cohort Comparison (Western Kenya, Rift Valley, Central Kenya, etc.)   │
│    -  🎯 Prioritized Action Plan (Quick Wins, Medium Term, Strategic)                        │
└──────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
┌──────────────────────────────────────────────┐  ┌──────────────────────────────────────────┐
│ 5. OFFICIAL PDF TRANSFORMATION REPORT        │  │ 6. INTERACTIVE "WHAT-IF" PLANNER         │
│    -  One-click downloadable publication      │  │    -  Sliders initialized with actual     │
│      report generated via ReportLab          │  │      assessed scores                     │
│    -  Formatted for banks, verifiers & donors │  │    -  Live simulation of next tier target │
└──────────────────────────────────────────────┘  └──────────────────────────────────────────┘
```

---

## 2. Core Scoring, Tiers & Recommendation Logic

### A. The 8 Pillars
1. **Pillar 1: Governance & Strategy**
2. **Pillar 2: Soil & Land Health**
3. **Pillar 3: Water Stewardship**
4. **Pillar 4: Crop Management**
5. **Pillar 5: Livestock Management**
6. **Pillar 6: Financial Inclusion**
7. **Pillar 7: Technology & Data**
8. **Pillar 8: Market Access**

### B. Canonical FFMI Scale & Signed-off Tiers (`DEFAULT_FFMI_BANDS`)
The Future Farm Maturity Index (FFMI) is normalized on a **0.00 to 24.00 scale**:
$$\text{FFMI Score} = \left( \frac{\sum \text{Pillar Fractions}}{8} \right) \times 24.00$$

| Tier | FFMI Range | Classification | Profile Description |
| :---: | :---: | :--- | :--- |
| **1** | 0.00 - 4.99 | **Informal Farm** | Traditional smallholder; informal records; high vulnerability. |
| **2** | 5.00 - 9.99 | **Emerging Agribusiness** | Basic management practices; early adoption of GAP and digital tools. |
| **3** | 10.00 - 15.99 | **Structured Farm** | Operational consistency; formal record keeping; market linkage. |
| **4** | 16.00 - 20.99 | **Investment Ready Farm** | Strong financial and technical governance; eligible for commercial credit. |
| **5** | 21.00 - 24.00 | **Future Ready Farm** | Advanced climate resilience, precision data, regenerative agronomy. |

### C. 5-Field Recommendation Action Plan
Every capability gap identified generates a 5-field structured recommendation:
1. **Identified Gap:** The specific question answered "No".
2. **Capability Status:** Current maturity level (`Non-Existent` to `Advanced`).
3. **Recommended Action:** Step-by-step practical implementation instruction.
4. **Recommended Learning:** Direct reference to the **FAAB (Farmer Agribusiness Advisory Board)** curriculum module.
5. **Potential Service:** Advisory, soil testing, or equipment partner link.
6. **Priority Tag:** `Quick Win` (top priority), `Medium Term`, or `Strategic`.

---

## 3. Visual Analytics Dashboard Components

The Results Screen (`#screen-result`) renders:

### 1. 🕸️ 8-Pillar SVG Radar (Spider) Chart
- Scalable vector polygon illustrating the farm's capability perimeter.
- Concentric grid circles (20%, 40%, 60%, 80%, 100%) to spot dimensional imbalances at a glance.

### 2. 📊 Horizontal Pillar Performance Breakdown
- Color-coded progress bars for each of the 8 pillars:
  - 🟢 **Green ($\ge 70\%$):** Advanced / Established
  - 🟡 **Yellow ($40\% - 69\%$):** Developing
  - 🔴 **Red ($< 40\%$):** Emerging / Non-Existent

### 3. 👥 Regional Peer Cohort Benchmarking
- Compares the farm's FFMI score against localized averages across regional cohorts:
  - *Western Kenya:* 9.80 / 24
  - *Rift Valley:* 11.20 / 24
  - *Central Kenya:* 12.40 / 24
  - *Eastern Kenya:* 8.50 / 24
  - *Coast:* 8.10 / 24

---

## 4. Official PDF Report Generation Pipeline

The backend includes a ReportLab engine (`app/reporting/pdf.py`) exposed at:
```http
GET /api/assessments/{assessment_id}/pdf
```

### PDF Report Structure:
1. **Header & Metadata:** Farm name, region, crop enterprise, acreage, assessment timestamp, and unique assessment UUID.
2. **Scorecard Block:** FFMI Score / 24.00, Maturity Tier classification badge, and 12-month Trajectory Risk level.
3. **8-Pillar Breakdown Table:** Dimension name, capability score, score percentage, and status band.
4. **Actionable Roadmap Table:** Prioritized Quick Wins, learning modules, and advisory service referrals.
5. **Verification & Audit Sign-off:** Space for local Future Farms Verifier (FFV) stamp and signature.

---

## 5. Machine Learning & Interactive Simulation Workbenches

### A. Frontend "What-If" Planner
- Embedded in the web application (both standalone via the top header tab and post-assessment on the results page).
- Allows agronomists and farmers to drag sliders to see how targeted investments (e.g. improving Soil Health from 30% to 70%) shift their FFMI score and unlock the next tier.

### B. Gradio ML Sandbox (`/ml-demo/`)
- Dedicated Python interface for data scientists, donors, and technical partners.
- Mounted at `http://localhost:8000/ml-demo/`.
- Integrated with `MLflow` tracking and `Celery` batch jobs (`farm_segmentation`, `risk_prediction`).

---

## 6. How to Run & Validate Locally

```powershell
# 1. Activate backend virtual environment
cd c:\Users\user\Desktop\Projects\arbane\src\backend
& .venv\Scripts\Activate.ps1

# 2. Seed database with 8 Pillars, 40 Capabilities, 200 Questions
$env:DATABASE_URL="sqlite:///fff_dev.db"
python -m app.scripts.seed_framework

# 3. Launch application server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### URL Endpoints:
- **Main Web Application & Visual Dashboard:** [http://localhost:8000](http://localhost:8000)
- **Gradio ML Scenario Simulator:** [http://localhost:8000/ml-demo/](http://localhost:8000/ml-demo/)
- **Interactive Swagger API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

---

## 7. Running Test Suites

```powershell
# Run full Pytest test suite
pytest tests/ -v

# Run performance and latency benchmark
python test_simulation_performance.py
```
