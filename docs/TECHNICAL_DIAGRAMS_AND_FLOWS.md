# Future Farms Framework (FFF)  --  Technical Diagrams & Architecture

This document provides a comprehensive technical overview of each diagram created for the **Future Farms Framework (FFF)** digital platform using the editorial **diagram-design** standard.

All interactive HTML diagrams are located in [`docs/diagrams/`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/). You can open [`docs/diagrams/index.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/index.html) in any web browser to view the complete diagram suite.

---

## 📑 Diagram Inventory

| # | Diagram Name | File | Primary Focus |
|---|---|---|---|
| **01** | **End-to-End System Architecture** | [`01-system-architecture.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/01-system-architecture.html) | High-level system topology, trust boundaries, scoring runtime, async workers, persistence |
| **02** | **Deterministic Scoring Pipeline** | [`02-assessment-scoring-pipeline.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/02-assessment-scoring-pipeline.html) | 200 Questions  ->  40 Capabilities  ->  8 Pillars  ->  0..24 FFMI  ->  5 Tiers  ->  Quick Wins |
| **03** | **Offline PWA & Verification Workflow** | [`03-offline-pwa-verification-flow.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/03-offline-pwa-verification-flow.html) | Zero-connectivity field capture, IndexedDB store, sync queue, on-site audit & anomaly scan |
| **04** | **Farm Transformation Flywheel** | [`04-transformation-flywheel.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/04-transformation-flywheel.html) | 8-stage transformation loop writing durable state back to the Farm Capability Ledger |
| **05** | **Development Lifecycle & CI/CD** | [`05-development-process-lifecycle.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/05-development-process-lifecycle.html) | 4-week milestone sprint plan, quality gates (36/36 unit tests), GitHub Actions & AWS ECS |
| **06** | **ML Subsystem Architecture & Purpose** | [`06-ml-model-architecture-and-purpose.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/06-ml-model-architecture-and-purpose.html) | K-Means clustering, Random Forest risk forecasting, evidence anomaly scan & MLflow |
| **07** | **ML Data Processing & Feature Pipeline** | [`07-ml-data-preprocessing-pipeline.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/07-ml-data-preprocessing-pipeline.html) | Data ingestion guardrails, imputation, outlier clipping, feature scaling, encoding & SMOTE |
| **Portal** | **Master Showcase Hub** | [`index.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/index.html) | Central portal linking and presenting all 7 technical diagrams |

---

## 🏛️ 1. End-to-End System & Capability Architecture
*File:* [`01-system-architecture.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/01-system-architecture.html)

### Technical Components:
1. **Client & Field Tier:**
   - **Farmer PWA (FFF Lite):** Zero-build HTML5/CSS/JS frontend powered by a cache-first Service Worker (`service-worker.js`) and IndexedDB storage for offline operation.
   - **FFF Verified Portal:** Specialized field verification UI supporting EXIF photo metadata extraction, GPS geostamping, and chronological audit trails.
   - **Partner & What-If UI:** Interactive parameter planner (`/ml-demo` via Gradio and `/api/ml/simulate`) for agronomists, banks, and donors.
2. **FastAPI Gateway & Scoring Core:**
   - **API Endpoints:** `/api/assessments` (lifecycle CRUD & submission), `/api/pillars` (framework hierarchy), `/api/ml/simulate` (scenario planner), `/health` (load balancer health check).
   - **Deterministic Scoring Engine:** Isolated pure Python module calculating 6-level capability statuses, 8 pillar fractions, composite 0..24 FFMI score, and 5 signed-off maturity tiers.
   - **Recommendation Engine:** Generates a 5-field action plan with Quick Wins first, mapped directly to FAAB learning modules and partner services.
   - **ReportLab PDF Generator:** Generates official institutional reports for bank underwriting and agricultural extension.
   - **Claude LLM Narrative Synthesizer:** Generates executive summaries using Anthropic Claude API with prompt caching and safe fallback during outages.
3. **Async ML & Worker Tier:**
   - **Redis Broker & Celery Queue:** Celery Beat schedules background batch jobs.
   - **Batch ML Algorithms:** K-Means population segmentation and Random Forest risk forecasting.
   - **Great Expectations Guardrails:** Ingestion validation enforcing range constraints and integrity.
4. **Data & Registry Tier:**
   - **PostgreSQL Database:** Stores Framework, Assessments, Answers, Evidence, Recommendations, and FAAB embeddings (`pgvector`).
   - **MLflow Model Registry:** Tracks experiment hyperparameters, silhouette scores, AUC metrics, and serialized `.pkl`/`.xgb` model binaries.

---

## ⚙️ 2. Deterministic Scoring & Maturity Classification Pipeline
*File:* [`02-assessment-scoring-pipeline.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/02-assessment-scoring-pipeline.html)

### Mathematical Calculation Flow:
1. **Raw Inputs:** 200 binary / Likert responses across 8 Pillars and 40 Capabilities (5 Qs per capability).
2. **Capability Status Logic:**
   $$\text{Capability Score} = \frac{\sum \text{Questions Answered Positively}}{5} \in [0.0, 1.0]$$
   - `0.00`: Non-Existent
   - `0.20`: Emerging
   - `0.40`: Developing
   - `0.60`: Established
   - `0.80`: Advanced
   - `1.00`: Benchmark Leader
3. **Pillar Fraction Aggregation:**
   $$P_i = \frac{\sum_{k=1}^5 \text{Capability Score}_k}{5} \in [0.0, 1.0] \quad \text{for } i \in \{1, \dots, 8\}$$
4. **Canonical FFMI Composite Index:**
   $$\text{FFMI} = \left( \frac{\sum_{i=1}^8 P_i}{8} \right) \times 24.00 \in [0.00, 24.00]$$
5. **Signed-Off Maturity Tiers (`DEFAULT_FFMI_BANDS`):**
   - **Tier 1 (0.00 - 4.99):** Informal Farm (Informal records, high vulnerability)
   - **Tier 2 (5.00 - 9.99):** Emerging Agribusiness (Early GAP adoption, basic records)
   - **Tier 3 (10.00 - 15.99):** Structured Farm (Operational consistency, commercial links)
   - **Tier 4 (16.00 - 20.99):** Investment Ready Farm (Bankable profile, strong governance)
   - **Tier 5 (21.00 - 24.00):** Future Ready Farm (Regenerative agronomy, precision data)
6. **5-Field Action Plan:**
   - Identified Gap $\rightarrow$ Capability Status $\rightarrow$ Recommended Action $\rightarrow$ FAAB Learning Module $\rightarrow$ Partner Service Link (Sorted: Quick Wins $\rightarrow$ Medium Term $\rightarrow$ Strategic).

---

## 🔄 3. Offline-First PWA & Verification Workflow
*File:* [`03-offline-pwa-verification-flow.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/03-offline-pwa-verification-flow.html)

### Sequence & Trust Boundaries:
1. **Disconnected Field Capture:** Farmer completes self-assessment in remote area. PWA Service Worker serves cached application shell.
2. **IndexedDB Local Store:** Responses saved to local IndexedDB key-value store. Client-side JS scoring engine calculates instant local score and radar chart without internet.
3. **Background Sync on Reconnect:** Service Worker listens for `navigator.onLine` event, batches pending payloads, and flushes them to the backend API via HTTPS.
4. **Ingestion Guardrails:** Backend applies Great Expectations suites (validating $[0, 1]$ bounds and question IDs) before writing to PostgreSQL.
5. **On-Site Field Verification:** Accredited auditor visits farm, captures geo-tagged photos and sensor readings.
6. **ML Anomaly Detection Worker:** Asynchronously validates EXIF timestamp monotonicity, checks GPS coordinates against farm geofence, and computes image hashes to detect duplicates.
7. **Accredited Badge:** Clean audits receive official "FFF Verified" status and verification watermark on institutional PDF reports.

---

## 🔁 4. The 8-Stage Farm Transformation Flywheel
*File:* [`04-transformation-flywheel.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/04-transformation-flywheel.html)

### Operating Loop with Shared Memory Hub:
- **Central Hub (Farm Capability Ledger):** Longitudinal storage of assessment history, 8-pillar vector snapshots, verified audit proof, and peer benchmarking.
- **8 Sequential Stations:**
  1. **Assess:** Capture 200 canonical capability indicators (Self or Verified).
  2. **Diagnose:** Calculate FFMI 0..24 score, 8-pillar fractions, and radar chart perimeter.
  3. **Prioritise (Decision Gate):** Identify strongest capability vs critical priority gaps; generate Quick Wins.
  4. **Learn:** Dispatch targeted FAAB (Farmer Agribusiness Advisory Board) training modules.
  5. **Implement:** Execute operational SOPs, soil regeneration, and financial record keeping.
  6. **Verify:** On-site evidence verification with photo and GPS proof.
  7. **Measure:** Compare progress against regional peer cohorts (Western Kenya, Rift Valley, Central).
  8. **Advance:** Upgrade farm to next maturity tier (e.g. Tier 1 Informal $\rightarrow$ Tier 2 Emerging).

---

## 🚀 5. Engineering Development Lifecycle & CI/CD Pipeline
*File:* [`05-development-process-lifecycle.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/05-development-process-lifecycle.html)

### 4-Week Milestone Roadmap:
- **Week 1 (M1 Foundation):** Database schemas, framework seed scripts, canonical decision sign-offs, deterministic scoring engine.
- **Week 2 (M2 Lite Beta):** Offline-first PWA, Service Worker caching, IndexedDB integration, frontend visual radar dashboard.
- **Week 3 (M3 Full FFF & ML):** FFF Verified evidence flow, Celery/Redis batch ML workers, MLflow experiment tracking, ReportLab PDF generator.
- **Week 4 (M4 Pilot Deployed):** Deployment to staging, low-connectivity field trials, stakeholder sign-off, production launch.

### Continuous Integration & Cloud Deployment:
1. **Developer Action:** Commit to `main` branch or merge Pull Request.
2. **GitHub Actions CI Runner:**
    - Pytest execution: **75 / 75 unit, integration, and ML accuracy tests passing (100% pass rate)**.
   - Ruff linting and formatting.
   - Alembic database migration idempotency validation.
   - ML data validation via Great Expectations.
3. **Docker Multi-Stage Build:** Packages `backend`, `worker`, and `frontend` images.
4. **Amazon ECR:** Pushes immutable SHA-tagged Docker images.
5. **AWS ECS Fargate:** Triggers rolling zero-downtime service deployment behind Application Load Balancer with health checks on `/health`.

---

## 🤖 6. Machine Learning Subsystem: Architecture, Purpose & Mechanics
*File:* [`06-ml-model-architecture-and-purpose.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/06-ml-model-architecture-and-purpose.html)

### Core Purpose of the ML Subsystem:
1. **Population-Scale Farm Segmentation:** Group 100,000 East African farm systems into meaningful capability clusters to tailor regional extension programs and benchmark peer cohorts.
2. **12-Month Trajectory & Default Risk Forecasting:** Predict farm vulnerability and credit default risk using multi-dimensional capability indicators, enabling financial institutions to underwrite smallholder loans safely.
3. **Evidence Fraud & Anomaly Detection:** Detect fraudulent or duplicate photographic and GPS evidence submitted by field verifiers, preserving the integrity of FFF Verified certifications.
4. **Interactive "What-If" Scenario Simulation:** Empower farmers and advisors to simulate capability improvements and observe instant maturity tier gains and Quick Win action plans.

### Architectural Principle  --  Code Isolation:
> **Zero LLM / Zero ML in Core Scoring:** The deterministic 0..24 FFMI scoring engine is completely isolated from the ML subsystem. ML models consume scored vectors asynchronously in batch mode; they never modify or calculate the core score.

### Algorithmic Breakdown:

#### 1. Farm Cluster Segmentation (K-Means & PCA)
- **Inputs:** 8-dimensional pillar vectors $\mathbf{X} \in [0.0, 1.0]^8$.
- **Algorithm:** Unsupervised K-Means clustering with $k=3$ clusters:
  - *Cluster 0:* Informal Subsistence Smallholders (Low finance, traditional agronomy).
  - *Cluster 1:* Transitioning Agribusinesses (Emerging record keeping, basic GAP).
  - *Cluster 2:* Diversified Commercial Leaders (High technology, strong market linkage).
- **Optimization:** Silhouette score maximization and PCA dimensional reduction.
- **Output:** Regional peer cohort baselines (Western Kenya, Rift Valley, Central Highlands).

#### 2. 12-Month Trajectory & Vulnerability Risk Forecaster (Random Forest / XGBoost)
- **Inputs:** Historical score deltas, priority gap depth ($P_{\text{gap}} < 0.25$), farm acreage, primary crop type, regional climate shock indices.
- **Algorithm:** Supervised ensemble classifier (`RandomForestClassifier` / `XGBClassifier`) with $n_{\text{estimators}}=10 \dots 100$ and `max_depth=5`.
- **Output:** Multi-class probability distribution:
  $$P(\text{Risk}) = [P(\text{Low}), P(\text{Medium}), P(\text{High})]$$
  - *High Risk:* $P_{\text{gap}} < 0.25$ or $\text{FFMI} < 5.0$ $\rightarrow$ Urgent capability gap intervention required.
  - *Medium Risk:* $P_{\text{gap}} < 0.50$ or $\text{FFMI} < 16.0$ $\rightarrow$ Developing capabilities; shock vulnerable.
  - *Low Risk:* $P_{\text{gap}} \ge 0.50$ and $\text{FFMI} \ge 16.0$ $\rightarrow$ High resilience across core pillars.

#### 3. Evidence Anomaly & Fraud Scanner
- **Inputs:** Uploaded JPG/PNG image files, EXIF metadata, GPS coordinates $(lat, lon)$, upload timestamps.
- **Algorithm:**
  - *Perceptual Image Hash (dHash/pHash):* Detects identical or reused photos across multiple farms.
  - *GPS Geofence Validation:* Verifies photo coordinates sit within a realistic radius of the farm centroid.
  - *Timestamp Monotonicity:* Validates chronological order to prevent bulk spoofing.
- **Output:** Automated anomaly score and verification flag (`clean` vs `review_required`).

#### 4. Interactive Scenario Simulator (`/api/ml/simulate` + Gradio `/ml-demo`)
- **Execution:** Real-time parameter tweaking via sliders for all 8 pillars $\rightarrow$ Instant FFMI recalculation $\rightarrow$ Live risk forecast $\rightarrow$ Top 15 prioritized Quick Win recommendations.

#### 5. MLOps & MLflow Experiment Tracking Lifecycle:
- **Celery Beat Schedule:** Periodic cron triggers batch runs.
- **MLflow Tracking Server (`http://localhost:5000`):** Logs experiment runs under `fff_farm_ml`:
  - *Parameters:* `n_clusters`, `n_estimators`, `algorithm`, `n_samples`.
  - *Metrics:* `silhouette_score`, `auc_roc`, `high_risk_count`, `med_risk_count`, `low_risk_count`.
  - *Artifacts:* Serialized models (`.pkl` / `.xgb`), confusion matrices, feature importance plots.

---

## 🧹 7. ML Data Processing, Cleaning & Feature Engineering Pipeline
*File:* [`07-ml-data-preprocessing-pipeline.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/07-ml-data-preprocessing-pipeline.html)

### End-to-End Data Preparation Workflow:

```
[Raw Ingestion] -> [Great Expectations Guardrails] -> [Sanitization & Clipping] -> [Feature Engineering] -> [Encoding & Scaling] -> [Model Training / Inference]
```

### Detailed Pipeline Stages:

#### 1. Multi-Source Ingestion Tier
- **200 Survey Questions:** Boolean/Likert inputs ($y_{ij} \in \{0, 1\}$) across 40 capabilities and 8 pillars.
- **Demographic Farm Metadata:** Continuous acreage ($A \in \mathbb{R}^+$), primary crop category ($C \in \text{CropTaxonomy}$), and agro-ecological zone ($R \in \text{RegionalTaxonomy}$).
- **Audit Telemetry & Sensor Ground Proof:** EXIF metadata containing GPS $(lat, lon)$, timestamp sequence $t_i$, and raw JPEG/PNG image buffers.

#### 2. Data Quality & Schema Guardrails (Great Expectations)
- **Range & Deterministic Rules:** Enforces that all responses adhere strictly to $\{0, 1\}$ domain, rejecting truncated question subsets.
- **Acreage & Biological Consistency:** Rejects non-positive farm sizes ($A \le 0$) and asserts valid crop-region co-occurrences.
- **Geo-Spatial Boundary Checks:** Bounding box validation restricting coordinates to East African operational corridors ($lat \in [-4.7, 5.5]$, $lon \in [29.0, 42.0]$) and asserting chronological timestamp monotonicity ($\Delta t \ge 0$).

#### 3. Data Cleaning & Outlier Sanitization Tier
- **Missing Value Imputation:** 
  - Survey answers: Imputed to $0$ (Conservative non-adoption baseline; zero hallucinations).
  - Categoricals: Mapped to `"Unknown"` sentinel class.
- **Robust Outlier Treatment:**
  - $99^{\text{th}}$ percentile Winsorization on farm acreage to prevent extreme landholder skew.
  - Natural logarithmic transformation ($\log(1 + A)$) to stabilize variance.
- **Perceptual Image Hash (dHash):**
  - Generates 64-bit difference hashes for all ground-truth photos.
  - Flags duplicate/recycled evidence across farm IDs using Hamming distance threshold ($D_H \le 5$).

#### 4. Feature Engineering Tier (Focal Vectors)
- **8 Normalized Pillar Fractions:**
  $$P_i = \frac{1}{5} \sum_{k=1}^5 \text{CapScore}_{i,k} \in [0.0, 1.0] \quad \forall i \in \{1 \dots 8\}$$
- **Priority Gap Depth ($P_{\text{gap}}$):**
  $$P_{\text{gap}} = \min(P_1, P_2, \dots, P_8)$$
- **Pillar Imbalance / Variance:**
  $$\sigma_P = \sqrt{\frac{1}{8} \sum_{i=1}^8 (P_i - \bar{P})^2}$$
- **Longitudinal Momentum ($\Delta \text{FFMI}$):**
  $$\Delta \text{FFMI} = \text{FFMI}_t - \text{FFMI}_{t-1}$$
- **Geo-Spatial Dispersion:** Euclidean distance from photo capture location to farm registered centroid ($d_{\text{centroid}} \le 1.5\text{ km}$).

#### 5. Categorical Encoding, Scaling & Class Balancing
- **MinMax Feature Scaling:** Rescales all continuous covariates to $[0.0, 1.0]$, preserving Euclidean distances for distance-based clustering (K-Means).
- **One-Hot Encoding:** Dummifies categorical predictors (Region $\to 4$ binary columns, Primary Crop $\to 6$ binary columns).
- **Imbalance Handling (SMOTE):** Synthetic Minority Over-sampling Technique applied exclusively to training folds to prevent under-representation of rare High-Risk trajectories.

#### 6. Model Ingestion & Feature Registry
- **Matrix A $\mathbf{X}_{\text{cluster}} \in \mathbb{R}^{N \times 8}$:** Ingested into K-Means ($k=3$) for regional peer benchmarking.
- **Matrix B $\mathbf{X}_{\text{risk}} \in \mathbb{R}^{N \times 14}$:** Ingested into Random Forest / XGBoost ensemble for 12-month trajectory default risk prediction.
- **Matrix C $\mathbf{X}_{\text{anomaly}} \in \mathbb{R}^{N \times 6}$:** Ingested into Celery batch worker for evidence fraud scoring and FFF Verified accreditation.

---

## 💻 How to View & Present the Diagrams

1. **Open Master Showcase in Browser:**
   ```powershell
   # Windows PowerShell
   Start-Process "c:\Users\user\Desktop\Projects\arbane\docs\diagrams\index.html"
   ```
2. **Open Individual Diagrams:**
   - System Architecture: [`docs/diagrams/01-system-architecture.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/01-system-architecture.html)
   - Scoring Pipeline: [`docs/diagrams/02-assessment-scoring-pipeline.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/02-assessment-scoring-pipeline.html)
   - Offline PWA & Verification: [`docs/diagrams/03-offline-pwa-verification-flow.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/03-offline-pwa-verification-flow.html)
   - Transformation Flywheel: [`docs/diagrams/04-transformation-flywheel.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/04-transformation-flywheel.html)
   - Development Lifecycle: [`docs/diagrams/05-development-process-lifecycle.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/05-development-process-lifecycle.html)
   - Machine Learning Deep-Dive: [`docs/diagrams/06-ml-model-architecture-and-purpose.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/06-ml-model-architecture-and-purpose.html)
   - ML Data Preprocessing Pipeline: [`docs/diagrams/07-ml-data-preprocessing-pipeline.html`](file:///c:/Users/user/Desktop/Projects/arbane/docs/diagrams/07-ml-data-preprocessing-pipeline.html)

3. **Validate Compliance:**
   To verify that all diagrams comply with the `diagram-design` specification:
   ```powershell
   Get-ChildItem -Path "c:\Users\user\Desktop\Projects\arbane\docs\diagrams\0*.html" | ForEach-Object { python "C:\Users\user\DevApps\diagram-design\skills\diagram-design\scripts\self_check.py" $_.FullName }
   ```

