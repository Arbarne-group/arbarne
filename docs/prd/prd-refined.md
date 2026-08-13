# Product Requirements Document — Future Farms Framework (FFF) Digital Platform

| | |
|---|---|
| **Status** | Draft — pending stakeholder sign-off on FFMI bands (see §12) |
| **Owner** | Victor — Team Lead |
| **Team** | Victor (Lead), Santana (ML & Database), Liz Wahome (ML), Nikki Mackenzie (Database/ML) |
| **Timeline** | 4-week build, sprint-based (see §11) |
| **Communication** | Slack — `#future-farms-framework` |
| **Source content** | *Future Farms Framework (FFF)* document (full body extracted); *FFF Assessment Model*; *FFF Structure & Characteristics*; *FFF Pillars & Questions* spreadsheet (Pillar 1 in full, Pillar 2–8 structured identically). See §17 for what was extracted and what was not. |

---

## 1. Purpose of this document

This PRD is the single reference for building the FFF digital platform from initialization through pilot completion. It exists so that any team member — or anyone joining later — can answer "what are we building, why, and how" without re-reading the original framework document or reconstructing decisions from Slack history. Where a decision is still open, this document says so explicitly rather than guessing.

Source material: the *Future Farms Framework (FFF)* document (pathway for farm systems development in Africa), the *FFF Assessment Model* document, the *FFF Structure & Characteristics* document, and the *FFF Pillars & Questions* spreadsheet (one tab per pillar, eight tabs total, each row is one assessment question with its full metadata).

### 1.1 What the FFF itself is (from the source document)

Per the FFF source, the framework is a **Farm Systems Capability and Maturity Framework** — explicitly framed as a **farm transformation architecture, not just an assessment questionnaire**. It is designed to answer three fundamental questions:

1. **Where is my farm today?**
2. **What capabilities does my farm need to develop?**
3. **What should I do to become future-ready?**

The platform's job is to make those three questions answerable for an East-African farmer in 10–15 minutes via self-assessment, and re-answerable at later intervals as the farm advances through the transformation cycle.

---

## 2. Problem statement

Farming across East Africa largely operates informally, without a structured way to measure readiness for the future. This creates six concrete gaps:

1. **No shared measure of readiness** — farms have no structured way to know how future-ready they are.
2. **No comparability** — no standardized way to compare capability and maturity across regions, crops, or farm types.
3. **No low-effort self-diagnosis** — farmers lack a simple way to see their own gaps and get a clear next step.
4. **No trustworthy evidence** — funders, NGOs, and lenders lack verified data to decide where to invest or intervene.
5. **Poorly targeted support** — development programmes can't direct help efficiently without visibility into where farms stand.
6. **No progress tracking** — improvement over time is rarely tracked, so impact is hard to prove.

## 3. Vision

Contribute to the Future Farms Initiative's goal of **100,000 future-ready farm systems across East Africa by 2035**, supporting food security, decent job creation, sustainable agricultural growth, stronger regional value chains, and resilient agricultural enterprises.

The framework's mindset shift: **farming as production → farming as a complete, future-ready business system.**

At farm level, the FFF source articulates the vision as: **a future where every farm has the capabilities, systems, people, knowledge and opportunities required to become productive, profitable, resilient, competitive and future-ready.** The platform is the means by which that farm-level vision becomes individually diagnosable and addressable, not aspirational copy.

At platform level, this PRD's job is to turn that framework into working software — not just a document.

---

## 4. Goals and objectives

The platform must:

1. Let a farmer complete a fast self-assessment (10–15 min, Yes/No, no jargon) and get an instant score and recommendations.
2. Score answers consistently against 8 pillars / 40 capabilities / 200 questions, rolling up into pillar scores and the FFMI/24 index.
3. Classify each farm into the correct maturity tier and explain why.
4. Turn every "No" answer into a concrete, prioritised action (Quick Win / Medium Term / Strategic) with a reason and available support.
5. Offer a second, evidence-based verification pass (photos, documents, GPS, timestamps) for organisations that need to validate claims, not just trust self-report.
6. Generate a readable Farm Transformation Report a farmer or funder can actually use.
7. Track a farm's progress across multiple assessments over time, not just a single snapshot.
8. Aggregate anonymised data across farms into insights useful to NGOs, funders, and government.
9. Surface personalised, natural-language guidance via an LLM layer — without letting AI override the deterministic, auditable scoring underneath.
10. Remain usable in low-connectivity, rural conditions (offline-capable).
11. Stay affordable enough to actually run at pilot and early scale, not just architecturally impressive.

---

## 5. Non-goals (out of scope for this build)

- Native mobile apps (iOS/Android) — the web frontend must work well on mobile browsers, but app-store distribution is not in scope for the pilot.
- Payment processing, financing disbursement, or marketplace transactions — FFF surfaces financing/market *opportunities*, it does not process them.
- Full FFF Digital Learning & Services platform (courses, videos, expert sessions) — the pilot links out to recommended learning, it does not host a learning management system.
- Multi-language localisation beyond English for the pilot (flagged as a fast-follow, not a blocker).
- Self-hosted LLM inference — the pilot uses a hosted LLM API; this may be revisited only if usage volume justifies dedicated GPU infrastructure (see §9.4).

---

## 6. Users

| User | Needs |
|---|---|
| **Farmer** | Fast self-assessment, plain-language results, a clear next step, ability to reassess over time |
| **Verifier** (extension officer, NGO staff, financial institution, certification body, government agency) | Evidence-based validation of a farm's claimed status, review workflow, verified reports |
| **Funder / NGO / Government (Insights consumer)** | Aggregated, anonymised, cross-farm data for targeting and benchmarking |
| **Platform team (internal)** | A working codebase, clear task ownership, an auditable scoring engine |

---

## 7. Framework domain model

This is the data the platform must faithfully represent — it is not something the engineering team invents, it comes directly from the FFF specification.

### 7.1 Structure

> Per the FFF source: *"The FFF is best understood as a farm transformation architecture, rather than simply an assessment questionnaire."* The platform must encode the **transformation architecture** in its data model and UX, not just deliver a quiz. The system answers three questions — *Where is the farm today? What capabilities does it need to develop? What should it do to become future-ready?* — and supports re-entering the cycle at any later point.

- **8 Pillars** — the major dimensions of a future-ready farm (see §7.2).
- **40 Capabilities** — 5 per pillar. A capability answers "what should this farm be able to do effectively?"
- **200 Assessment Questions** — 5 per capability. **Each question is a Yes/No self-assessment item** with full metadata (see §7.7 for the exact schema).
- **Capability Status** — each capability is rated on a 6-level scale: `Non-existent → Emerging → Basic → Developing → Established → Advanced`. Per the FFF source: *"This creates a development pathway, rather than a simple pass/fail assessment."* The scoring engine and UI must reflect this — the report is never framed as pass/fail.
- **Capability Approach** — per the FFF source: *"The FFF does not simply ask: 'Does the farmer have this?' Instead, it asks: 'How capable is the farm of consistently doing this?'"* A farmer owning a smartphone does not equal Digital Transformation capability. The platform's questions probe collect / store / analyse / interpret / decide / improve — the underlying capability chain, not asset ownership.
- **Future Farms Maturity Index (FFMI/24)** — aggregates capability assessments into an overall farm maturity score out of 24. Per the FFF source: *"The FFMI therefore should not be viewed simply as a score. It is a diagnostic and transformation tool."* Its output must establish:
  - Current farm maturity
  - Pillar-level performance
  - Capability strengths
  - Capability gaps
  - Priority areas for development
  - Potential interventions
  - Learning requirements
  - Investment opportunities
  - Progress over time

  Per the FFF source: *"The purpose is not to make farmers compete over scores. The purpose is to answer: What does this farm need to do next?"* The platform's UI and reporting must reflect this framing — score is a means to a next action, not a ranking.
- **Five-Tier Farm Maturity Model** — the FFMI places a farm into one of 5 tiers:

| Tier | Classification | Meaning |
|---|---|---|
| 1 | Informal Farm | Largely informal, limited business systems and structured management |
| 2 | Emerging Agribusiness | Beginning to operate as a structured agricultural business |
| 3 | Structured Farm | Core business, operational and management systems are established |
| 4 | Investment Ready Farm | Sufficient structure, performance and evidence to pursue investment |
| 5 | Future Ready Farm | Advanced capabilities, resilience, adaptability, competitiveness, and future readiness |

> **Capability status describes the maturity of one capability. Farm maturity (FFMI/tier) describes the overall state of the farm.** These are related but distinct — the platform must not conflate them.

### 7.2 The eight pillars

For each pillar, the platform must seed into the database **verbatim** the principle, the outcomes it seeks to achieve, the examples, and the guiding question — these are farmer-facing and stakeholder-facing text. The summaries below are the canonical content extracted from the FFF source document.

#### Pillar 1 — Smart Farming and Digital Transformation
- **Principle:** Use technology and data to farm smarter. Enable farmers to adopt appropriate technologies and digital systems that improve decision-making, efficiency, productivity and continuous innovation.
- **Seeks to achieve:** appropriate technology adoption; digital farm management; reliable farm data; data-driven decision-making; smart and precision farming; automation where appropriate; digital monitoring of farm performance; continuous technological improvement.
- **Examples:** digital farm records; sensors; weather monitoring; farm management platforms; automated irrigation; precision agriculture; mobile farm applications; farm dashboards; AI-supported decision-making.
- **Guiding question:** *Is the farm using appropriate technology and information to make better decisions?*

#### Pillar 2 — Productive Use of Renewable Energy
- **Principle:** Turn energy from an operating cost into a productive asset. Use renewable energy and energy-efficient systems to improve productivity, reduce costs and strengthen operational reliability.
- **Seeks to achieve:** reliable energy access; efficient energy use; reduced energy costs; renewable energy adoption; productive use of solar, biogas and other appropriate technologies; energy-powered irrigation and processing; improved cold storage; reduced dependence on expensive or unreliable energy.
- **Examples:** solar irrigation; solar-powered cold storage; biogas systems; solar drying; solar processing; energy-efficient equipment; energy monitoring.
- **Guiding question:** *How can energy be used to create greater productive and economic value on the farm?*

#### Pillar 3 — Food Safety and Compliance
- **Principle:** Produce food that is safe, traceable, quality-assured and compliant. Develop the systems required to produce food safely and meet regulatory, market and customer requirements.
- **Seeks to achieve:** food safety; quality assurance; traceability; responsible input use; regulatory compliance; good agricultural practices; worker and occupational safety; market and certification readiness.
- **Examples:** farm records; input and chemical records; traceability systems; harvest records; food safety procedures; GAP systems; quality-control systems; certification preparation.
- **Guiding question:** *Can the farm consistently demonstrate that its products are safe, traceable and compliant with its target markets?*

#### Pillar 4 — Indigenous Knowledge and Climate Resilience
- **Principle:** Build resilience by combining local knowledge, science and innovation. Recognises that farmers possess valuable indigenous and locally developed knowledge that can complement modern science and technology.
- **Seeks to achieve:** climate adaptation; climate risk management; sustainable resource management; integration of indigenous and scientific knowledge; preservation of valuable agricultural knowledge; stronger farm resilience; intergenerational knowledge transfer.
- **Examples:** indigenous weather indicators; traditional soil-management practices; indigenous seed knowledge; local water-management practices; traditional pest-management approaches; climate-smart agriculture; farm climate-risk planning.
- **Guiding question:** *Is the farm capable of anticipating, adapting to and recovering from climate and environmental risks?*

#### Pillar 5 — Farm Business Performance and Growth
- **Principle:** Build farms that are financially viable, sustainable and capable of growth. Production alone does not make a farm a successful business — focus on economic performance and growth potential.
- **Seeks to achieve:** profitability; strong financial management; cost control; productivity improvement; revenue growth; business planning; enterprise diversification; sustainable resource use; scalability.
- **Examples:** farm budgets; cash-flow management; cost-per-unit analysis; enterprise profitability analysis; financial records; business plans; growth strategies; value addition.
- **Guiding question:** *Is the farm performing as a viable business and creating the foundation for sustainable growth?*

#### Pillar 6 — Human Capital, Leadership and Farm Operations
- **Principle:** Build the people, leadership and systems required to operate a professional farm business. Future-ready farms cannot depend entirely on one farmer.
- **Seeks to achieve:** skilled farm teams; strong leadership; defined roles and responsibilities; standard operating procedures; workforce development; worker welfare; performance management; occupational health and safety; succession planning; efficient farm operations.
- **Examples:** organisational structures; job descriptions; farm SOPs; training programmes; performance management; staff scheduling; operations manuals; safety systems.
- **Guiding question:** *Does the farm have the people, leadership and operating systems required to run effectively beyond the individual farmer?*

#### Pillar 7 — Market Access, Customer Value and Competitiveness
- **Principle:** Build the farm around customers and markets, not production alone. Future-ready farms understand who their customers are, what they value and how to compete within increasingly integrated markets.
- **Seeks to achieve:** market intelligence; customer understanding; demand-driven production; product differentiation; strong buyer relationships; regional value-chain participation; cross-border trade readiness; competitiveness; customer value creation.
- **Examples:** customer research; buyer mapping; market analysis; contract farming; regional value chains; export readiness; branding; product differentiation; digital marketplaces.
- **Guiding question:** *Does the farm understand its customers and compete effectively in the markets it serves?*
- **Transformation embedded in this pillar:** *production-led farming → market-led farming.*

#### Pillar 8 — Investment Readiness and Enterprise Development
- **Principle:** Build farms that can attract, manage and grow capital responsibly. Investment readiness is not simply about needing financing — it is about having the systems, evidence and enterprise structure required to use capital effectively.
- **Seeks to achieve:** financial transparency; investment planning; strong business records; governance; risk management; business planning; financial projections; investor readiness; enterprise development; effective capital utilisation.
- **Examples:** financial statements; business plans; investment proposals; financial projections; asset registers; risk assessments; governance structures; investment-readiness profiles.
- **Guiding question:** *Can the farm demonstrate that it is a credible, investable and well-managed enterprise?*

### 7.3 Pillar breakdown — concrete shape

Each pillar contains **5 capabilities**, each capability contains **5 questions**, totalling **25 questions per pillar** and **200 questions across the framework**. Verified from the source spreadsheet (Pillar 1 fully extracted; Pillar 2–8 are structured identically across separate tabs).

Priority distribution per pillar, verified from Pillar 1's source rows and expected to hold for Pillar 2–8:

| Priority | Per pillar (out of 25) | Framework-wide (out of 200) |
|---|---|---|
| 🟢 Quick Win | ~10 (40%) | ~80 (40%) |
| 🟡 Medium Term | ~10 (40%) | ~80 (40%) |
| 🔵 Strategic | ~5 (20%) | ~40 (20%) |

This distribution is what gives the Farm Transformation Report its character — most actions are achievable within a year, and only a fifth require transformational, multi-year investment. The recommendation UI should default to showing Quick Wins first.

### 7.4 Pillar 1 capabilities — canonical reference example

Pillar 1 is given here as the canonical example; the same shape applies to Pillars 2–8.

| Capability ID | Capability name | Questions |
|---|---|---|
| **P1.1** | Technology Readiness | P1.1.1 – P1.1.5 |
| **P1.2** | Digital Capability | P1.2.1 – P1.2.5 |
| **P1.3** | Farm Information & Data Management | P1.3.1 – P1.3.5 |
| **P1.4** | Data-Driven Decision Making | P1.4.1 – P1.4.5 |
| **P1.5** | Continuous Improvement & Innovation | P1.5.5 – P1.5.5 |

The stable ID format `P{pillar}.{cap}.{q}` is used as the database primary key for each question row and must be referenced consistently in code, exports, and reports.

### 7.5 Sample questions — Pillar 1 (excerpt)

The full Pillar 1 question set has been extracted from the source spreadsheet. Three representative rows below show the exact metadata the platform must store and surface. The complete set is to be seeded from the spreadsheet verbatim.

| ID | Question (Yes/No) | Priority |
|---|---|---|
| P1.1.1 | Have you identified production challenges that could be solved through technology? | 🟢 Quick Win |
| P1.3.1 | Do you keep records of your farm activities (e.g., planting, feeding, spraying, harvesting)? | 🟢 Quick Win |
| P1.5.5 | Do you have a clear plan for continuously improving your farm over the next three years? | 🔵 Strategic |

Every question row carries the full schema shown in §7.7 — recommendation text, why-it-matters, quick-win, support, and evidence required.

### 7.6 Evidence Verification Protocol (A–B–C–D)

Used by the Future Farms Verification (FFV) pathway. Evidence is classified by reliability:

| Class | Type | Reliability |
|---|---|---|
| A | Documentary evidence (records, plans, budgets, certificates, receipts, contracts, business plans) | ★★★★★ |
| B | Physical observation (graded produce, packaging, storage facilities, value-added products) | ★★★★ |
| C | Digital evidence (mobile apps, GPS, digital records, payment history, photos, marketplace profiles) | ★★★ |
| D | Farmer declaration (interview/verbal confirmation where other evidence is unavailable) | ★★ |

For each question, the spreadsheet specifies the **typical evidence the verifier should collect** (e.g. for P1.3.1: "Farm record books; digital records; production logs; observation; farmer interview"). The platform must store this per question as the *evidence requirements* field, and surface it to the verifier as the checklist when an FFV assessment is opened.

### 7.7 Question row schema (authoritative)

Each of the 200 questions is one database row with the following fields. Verified against the source spreadsheet for Pillar 1; identical shape for Pillars 2–8.

| Field | Type | Purpose |
|---|---|---|
| `id` | string | Stable ID, e.g. `P1.1.1`. Primary key. |
| `pillar_id` | FK → pillars | 1–8 |
| `capability_id` | FK → capabilities | e.g. `P1.1` |
| `question_number` | int | 1–5 within capability |
| `question_text` | string (farmer-facing) | The Yes/No question, plain language, no jargon |
| `ffv_evidence_required` | string (verifier-facing) | Description of acceptable evidence (maps to A–B–C–D) |
| `if_no_recommendation` | string (farmer-facing) | What the farmer should do when the answer is "No" |
| `why_it_matters` | string (farmer-facing) | Plain-language explanation of why this question is on the framework |
| `quick_win` | string (farmer-facing) | A concrete, low-cost action the farmer can take within weeks |
| `support_available` | string[] (farmer-facing) | FAAB module references + partner organisations (see §16) |
| `priority` | enum | `quick_win` \| `medium_term` \| `strategic` |

This row must be **seeded from the source spreadsheet verbatim**, with no engineering-team rewording of farmer-facing text. The recommendation engine reads `if_no_recommendation`, `why_it_matters`, `quick_win`, `support_available`, and `priority` to construct the per-question recommendation shown after a self-assessment.

### 7.8 Recommendation priority levels

| Priority | Meaning | Timeline | Characteristics |
|---|---|---|---|
| 🟢 Quick Win | Easy to implement, immediate benefit | 0–3 months | Low cost, low complexity, high impact — shown first |
| 🟡 Medium Term | Requires planning, training, or modest investment | 3–12 months | Moderate investment/complexity, builds capability |
| 🔵 Strategic | Transformational, longer-term | 1–3 years | High investment/complexity, long-term impact, enables business transformation |

The post-assessment UI defaults to **Quick Wins first**, then Medium Term, then Strategic — matching the farmer's likely action horizon.

### 7.9 The farm transformation cycle

`Assess → Diagnose → Prioritise → Learn → Implement → Verify → Measure → Advance → Reassess`

This is a continuous loop, not a one-time test. The platform must support re-entering the cycle, not just completing it once.

### 7.10 Products (platform tiers)

1. **FFF Lite** — affordable/free self-assessment for any farmer.
2. **FFF Verified** — evidence-based assessment conducted by accredited organisations.
3. **FFF Certified** — farms that meet defined standards and undergo independent verification.
4. **FFF Insights** — aggregated, anonymised data dashboards for governments, NGOs, and development partners.

The pilot (this 4-week build) targets **FFF Lite** and the core of **FFF Verified**; **FFF Certified** and full **FFF Insights** dashboards are fast-follows once the core loop is proven.

---

## 8. Functional requirements

### 8.1 Farmer self-assessment (Part I)
- Yes/No question flow across all 200 questions (or a validated subset for MVP — see §12 open decision).
- Question text drawn from `question_text` field (§7.7); plain language, no jargon.
- Simple language, no evidence required, ~10–15 minutes to complete.
- Automatic scoring and instant recommendations on submission.
- Output: classification scores (24), pillar scores (%), overall FFMI readiness score, recommended next steps grouped by priority (Quick Wins first), suggested learning modules (drawn from `support_available` field), areas for improvement with the per-question `why_it_matters` rationale.
- Must work offline and sync when connectivity returns.

### 8.2 Future Farms Verification — FFV (Part II)
- Used by extension officers, NGOs, cooperatives, financial institutions, certification bodies, government agencies.
- Same indicators as self-assessment, plus evidence requirements pulled from `ffv_evidence_required` per question (§7.7); observation checklists, document upload, photo upload, assessor comments, GPS/location, timestamps.
- Evidence classified per the A–B–C–D protocol (§7.6).
- Output: verified pillar scores, evidence-backed Farm Assessment Report, gap analysis, recommended interventions, progress-over-time comparison, certification eligibility.

### 8.3 Scoring engine
- Deterministic, rules-based, versioned. Given a completed set of question answers, computes: capability status (6-level) per capability → pillar score → FFMI/24 → tier (5-level).
- Must be auditable: given any farm's score, the platform must be able to show exactly which answers produced it.
- Rule changes must be versioned so historical assessments remain reproducible against the rules in effect when they were taken.

### 8.4 Recommendation engine
- **Question-level logic**: for every "No" answer, generate a recommendation from the question row (§7.7) consisting of:
  - `if_no_recommendation` — the action
  - `why_it_matters` — the rationale
  - `quick_win` — a concrete short-term step
  - `support_available` — FAAB module references + partner organisations
  - `priority` — 🟢 Quick Win / 🟡 Medium Term / 🔵 Strategic
- Recommendations roll up to capability-level and pillar-level summaries, preserving the priority grouping.
- The recommendation content is **data-driven from the question rows**, not generated by the LLM — the LLM layer (§8.7) may personalise phrasing only, never alter the recommendation's substance or priority.

### 8.4.1 Personalised Farm Transformation Plan output

Beyond question-level recommendations, the platform must produce a **Personalised Farm Transformation Plan** per assessment — the action artefact a farmer actually uses. Per the FFF source, every gap surfaced in the assessment is rendered with the following five-part structure:

| Field | Source | Example (from FFF source) |
|---|---|---|
| **Gap** | the weakness surfaced by the assessment | Digital farm records |
| **Capability status** | the 6-level scale (§7.1) for the affected capability | Basic |
| **Recommended action** | concrete, doable instruction | Introduce a digital record-keeping system and establish weekly farm data collection |
| **Recommended learning** | `support_available` (FFA / FAAB module) | Digital Farm Records — Foundation Module |
| **Potential service** | mapped FFF service (§8.4.3) | Digital farm management implementation support |

This structure must be the same across (a) the in-app per-gap view, (b) the Farm Transformation Report PDF, and (c) the LLM narrative summary — the LLM may rephrase but never re-order, omit, or substitute these five fields.

### 8.4.2 Capability-level maturity assessment output

Per the FFF source, after a self-assessment the farmer must be able to read off, in plain language:

- **Overall maturity** — one of the five tiers (§7.1), e.g. *"Emerging Agribusiness"*
- **Strongest pillar** — the pillar with the highest pillar score
- **Priority gap** — the pillar with the lowest pillar score (or largest gap-to-target)
- **Capability requiring development** — the lowest-scoring capability, named explicitly (e.g. *"Financial record keeping"*)

This is the "decision-support" view — it tells the farmer what to look at next without forcing them to interpret raw scores.

### 8.4.3 Canonical FFF Services catalogue

Per the FFF source, the framework can act as a gateway to the following services. The `support_available` field on each question row must reference these by canonical name where applicable:

1. Digital farm transformation
2. Farm business advisory
3. Energy assessment
4. Food safety and compliance support
5. Climate resilience planning
6. Farm operations development
7. Market linkage
8. Investment readiness
9. Data and farm intelligence
10. Technology adoption support

The pilot surfaces these as **outbound links / referral pathways**, not as a marketplace — the platform is a gateway, not a service provider (see §5). Each question row's `support_available` should be reviewed in Week 1 against this canonical list (see §12 open decision 4).

### 8.4.4 Canonical FFF Learning Resources catalogue

Per the FFF source, every capability gap is expected to link to learning resources. The platform's per-gap "Recommended learning" field must reference one of these resource types (the actual catalogue comes from FAAB; the platform shows what is available, doesn't host it):

- Short courses
- Videos
- Guides
- Templates
- Checklists
- SOPs
- Case studies
- Expert sessions
- Demonstrations
- Farm tools
- Calculators

For the pilot, the platform stores a `learning_resource_ref` field per question (nullable) that points to the canonical FAAB catalogue. This is the seed for the FFF Digital Learning & Services fast-follow (§8.7, §5).

### 8.5 Reporting
- **Farm Transformation Report** — generated as a downloadable document (PDF), combining scores, tier classification, prioritised recommendations (Quick Wins first), per-question `why_it_matters` rationale, and (optionally) an LLM-generated narrative summary.
- Report generation must work from self-assessment data alone; verification adds an evidence-backed variant.

### 8.6 Progress tracking
- A farm can be reassessed; the platform must store and display historical FFMI/tier/pillar scores over time, not overwrite them.
- Progress comparison is a first-class report type, not an afterthought.

### 8.7 ML / LLM layer
- **Batch ML (scheduled, not real-time):** farm segmentation/clustering, risk or trajectory prediction, evidence anomaly detection (duplicate photos, GPS/timestamp inconsistency).
- **LLM (on-demand, cached):** narrative generation for the Farm Transformation Report, a farmer-facing chatbot (RAG over FAAB/training content and the recommendation library), personalised phrasing of recommendations.
- **Hard constraint:** the LLM layer never determines a score, never alters a recommendation, and never overrides a priority. It explains or personalises a result the deterministic scoring engine already computed. This must be true in the architecture, not just in documentation.

### 8.8 FFF Insights (fast-follow, not pilot-blocking)
- Aggregated, anonymised dashboards: regional gaps, pillar-level trends, correlation between capability scores and outcomes, for NGOs/funders/government.

---

## 9. Non-functional requirements

### 9.1 Affordability
The platform must run on a realistic pilot budget (~$15–25/month fixed infrastructure cost, plus metered LLM usage). This constrains architecture choices — see §10.

### 9.2 Offline capability
The farmer self-assessment must function with intermittent or no connectivity: answers cache locally and sync once a connection is available. This is a design requirement tested explicitly in Week 4, not an assumption.

### 9.3 Auditability
Every score must be traceable to the exact answers and rule version that produced it. No scoring logic may live inside a prompt to an LLM.

### 9.4 Data residency and privacy
Farmer data (including GPS location and photos) is sensitive. Hosting/storage choices should allow control over which country/region data resides in, since NGO and government partners may require this. Self-hosted LLM inference is not required for the pilot, but the architecture should not preclude it later if data-residency requirements demand it.

### 9.5 Performance
Self-assessment scoring must return instantly (sub-second) since it's synchronous and user-facing. Batch ML jobs and LLM narrative generation may run asynchronously without blocking the user.

---

## 10. System architecture

### 10.1 Confirmed stack

| Layer | Technology |
|---|---|
| Backend | **FastAPI** (Python) |
| Database | **PostgreSQL** |
| Frontend | **HTML / JavaScript** |
| Containerization | **Docker** (all services defined in `docker-compose.yml`) |
| ML | Python ML libraries as required (scikit-learn, XGBoost/LightGBM, pandas, etc.) |
| LLM | Hosted LLM API (Anthropic Claude), called from FastAPI — not self-hosted for the pilot |
| Task queue | Redis + Celery (batch ML jobs, scheduled tasks) |

### 10.2 Architectural principles

- **One backend language (Python)** for API, scoring engine, and ML/LLM orchestration — minimises integration overhead for a small team.
- **Deterministic scoring stays separate from the LLM layer** at the code level, not just conceptually — the scoring engine has no dependency on any LLM call succeeding.
- **Containerized delivery** — every service (frontend, API, workers, database, Redis) runs as a Docker container, defined in one compose file, so the environment is identical from a developer's laptop to the pilot deployment.
- **Batch over real-time for ML** — clustering, risk prediction, and evidence anomaly checks run on a schedule (Celery Beat), not per-request, to control cost and avoid blocking user-facing requests.
- **Cache LLM output** where farms are likely to share capability-status combinations, to control per-token cost.

### 10.3 Hosting (pilot)

- Backend + workers + Redis: containerized deployment on a low-cost VPS or PaaS (e.g. Render, or a self-managed Docker host).
- Database: PostgreSQL, either self-hosted alongside the backend or a managed provider — final choice depends on the data-residency decision in §12.
- Frontend: served as static HTML/JS/CSS, or via the FastAPI backend directly for the pilot's scale.

### 10.4 What is deliberately out of scope for the pilot

- Kubernetes or multi-node orchestration — a single Docker host is sufficient at pilot scale.
- Self-hosted LLM inference (GPU infrastructure) — not cost-justified until usage volume changes the economics.
- A dedicated vector database service — if RAG is needed for the chatbot, use Postgres with the `pgvector` extension rather than a separate service.

---

## 11. Delivery plan — 4-week sprint structure

Each week is a sprint. Tasks, owners, and live status are tracked in Slack (`#future-farms-framework`): the **Task Tracker canvas** (weekly checklist view) and the **Kanban Board canvas** (cross-sprint status view) are the operational source of truth — this PRD describes *what* and *why*, Slack tracks *current status*.

### Week 1 — Foundation
| Task | Owner | Notes |
|---|---|---|
| Confirm rules, tiers & FFMI bands | Victor | Blocking — see §12 |
| Seed framework content into Postgres | Nikki | **All 200 question rows from the source spreadsheet**, fields per §7.7; 8 pillars; 40 capabilities. Stable IDs (`P{p}.{c}.{q}`) preserved |
| Environment & Docker setup | Victor | `docker-compose.yml` for all services |

**Exit criteria:** rules locked and signed off; database schema deployed with all 200 question rows seeded; all team members can run the stack locally via Docker.

### Week 2 — Core assessment
| Task | Owner | Notes |
|---|---|---|
| Farmer self-assessment flow (HTML/JS) | Liz | Offline-capable from the start, not retrofitted; renders all 200 questions from seeded data |
| Scoring engine + FFMI/24 | Victor | Deterministic, versioned, auditable |
| Recommendation logic (Quick Win/Medium/Strategic) | Liz | Reads from question rows (§7.7); groups output by priority; Quick Wins first |

**Exit criteria:** a farmer can complete a self-assessment end-to-end and receive a score, tier, and recommendations grouped by priority.

### Week 3 — Verification & AI layer
| Task | Owner | Notes |
|---|---|---|
| Evidence upload & FFV flow | Nikki | Photo/document upload, GPS, timestamp, A–B–C–D classification; per-question evidence requirements drawn from `ffv_evidence_required` |
| LLM narrative reports + chatbot | Victor | RAG via pgvector; scoring engine untouched by this layer; LLM may only personalise phrasing of recommendations, never alter substance |
| Batch ML: segmentation, risk prediction | Santana | Scheduled Celery jobs, not real-time |

**Exit criteria:** an evidence-backed assessment can be submitted and reviewed; a narrative report can be generated; batch ML jobs run on schedule against sample data.

### Week 4 — Pilot & handover
| Task | Owner | Notes |
|---|---|---|
| End-to-end testing with sample farms | Santana | Include real low-connectivity testing, not just simulated |
| Stakeholder demo & feedback | Liz | Present against this PRD's goals (§4) |
| Deploy pilot, document next steps | Victor | Go/no-go checkpoint |

**Exit criteria:** the pilot is deployed, demoed to stakeholders, and a go/no-go decision is made for continued development.

---

## 12. Open decisions requiring stakeholder sign-off

These block or affect the plan above and must be resolved, ideally before or during Week 1:

1. **FFMI numeric bands** — the FFF source documents contain two different tier-boundary tables (one framed as `0–4/5–9/10–15/16–20/21–24`, another as `0–6/7–12/13–18/19–21/22–24`). **This must be reconciled and signed off before the scoring engine is built**, since the entire tier classification depends on it.
2. **Evidence review capacity** — who verifies FFV submissions, and how quickly? No reviewer is currently nominated.
3. **Pilot farmer access** — introductions to a small group of real farmers are needed for Week 4 testing.
4. **Existing learning/recommendation content** — confirm what already exists vs. what the platform needs to generate or link to. The spreadsheet already enumerates the canonical `support_available` references per question — confirm these match the live FAAB module catalogue.
5. **Go/no-go checkpoint** — confirm the decision date and decision-makers for the end of Week 2 (and Week 4).
6. **Question set for MVP** — confirm whether all 200 questions ship in the pilot, or a validated subset, to fit the 4-week timeline without compromising scoring integrity.
7. **Frontend ownership** — no team member currently has dedicated frontend (HTML/JS) experience; this task is provisionally assigned to Liz alongside her ML work. Confirm this is acceptable or reassign.

---

## 13. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| FFMI bands unresolved past Week 1 | Scoring engine can't be finalised | Escalate as the first blocking item; do not proceed to build scoring logic against an unconfirmed table |
| No dedicated frontend developer | Week 2 self-assessment flow slips | Confirmed owner (Liz) with fallback support from Victor; monitor closely in Week 2 |
| Evidence review capacity undefined | FFV submissions pile up unreviewed | Nominate a reviewer before Week 3 begins |
| Low-connectivity behaviour untested until Week 4 | Late discovery of offline-sync bugs | Build offline-first from Week 2, not as a Week 4 retrofit; smoke-test weekly |
| LLM content bleeding into scoring logic | Loses auditability, undermines trust with funders/verifiers | Enforce architectural separation (§8.7, §10.2) in code review, not just documentation |
| Team is ML/Database-heavy, thin on generalist software engineering | Backend/API surface takes longer than estimated | Victor absorbs the complex/integration tasks directly (see delivery plan); monitor Week 2 velocity closely |
| Question content paraphrased during seeding | Farmer-facing wording drifts from the canonical framework | Seed the 200 rows from the source spreadsheet **verbatim**; treat text fields as immutable; no engineering-team rewording |

---

## 14. Success metrics (post-pilot)

- A farmer can complete a self-assessment in under 15 minutes and receive a score, tier, and at least one Quick Win recommendation.
- A verifier can complete an evidence-backed assessment and produce a Farm Transformation Report.
- Scoring is reproducible: the same answers always produce the same score, and the score is traceable to specific answers.
- The platform runs within its target monthly infrastructure budget.
- Stakeholders reach a go/no-go decision at the end of Week 4 based on a working pilot, not a mockup.

---

## 15. Team

| Contributor | Role | GitHub |
|---|---|---|
| Victor | Team Lead — Full-Stack & AI Engineer; architecture, complex builds, task assignment | — |
| Santana | ML & Database | Santana-clauss |
| Liz Wahome | ML (+ frontend, provisional) | LizWahome |
| Nikki Mackenzie | Database / ML | Nikki-Mackenzie |

Communication: Slack, `#future-farms-framework`. Weekly threads per sprint; blockers flagged with 🚧 for immediate visibility; the Task Tracker and Kanban Board canvases are updated continuously, not just at week-end.

---

## 16. Glossary

| Term | Meaning |
|---|---|
| **FFF** | Future Farms Framework — a *Farm Systems Capability and Maturity Framework* and *farm transformation architecture* (per the FFF source). Not merely an assessment questionnaire. |
| **FFMI** | Future Farms Maturity Index (out of 24). Per the FFF source, it is a *"diagnostic and transformation tool,"* not a competitive score. Establishes current maturity, pillar performance, capability strengths and gaps, priority development areas, potential interventions, learning requirements, investment opportunities, and progress over time. |
| **FFV** | Future Farms Verification — the evidence-based assessment pathway |
| **FAAB** | Farm Agribusiness Advisory Bundle — a structured programme of numbered modules referenced by every question's `support_available` field. Modules referenced in the source content include: Module 1 (foundations), Module 5 (planning), Digital Skills Module, Record Keeping Module, Business Skills Module, Business Planning Module, Financial Management Module, Mentorship. The full canonical module catalogue must be confirmed against FAAB's current programme (see §12 open decision 4). |
| **Capability status** | The 6-level maturity rating of one specific capability: `Non-existent → Emerging → Basic → Developing → Established → Advanced`. Per the FFF source: a development pathway, not pass/fail. |
| **Tier** | The 5-level overall farm maturity classification derived from FFMI: `Informal Farm → Emerging Agribusiness → Structured Farm → Investment Ready Farm → Future Ready Farm` |
| **Quick Win / Medium Term / Strategic** | The three recommendation priority levels, by cost/complexity/timeline (🟢 / 🟡 / 🔵) |
| **Question ID** | Stable identifier `P{pillar}.{capability}.{q}`, e.g. `P1.3.1`. Used as primary key in the database |
| **Future Farms Network** | The supporting partner organisations surfaced in `support_available` (e.g. Future Farms Advisory, Future Farms Academy, Future Farms Innovation Hub, Future Farms Knowledge Hub, Future Farms Marketplace, Future Farms Digital Champions, Future Farms Network) |
| **Personalised Farm Transformation Plan** | The five-field per-gap output: Gap / Capability status / Recommended action / Recommended learning / Potential service. See §8.4.1. |
| **Foundation Module** | The named entry-level FAAB learning module referenced in the FFF source example (e.g. *"Digital Farm Records — Foundation Module"*). |
| **Capability Approach** | The FFF framing: *"How capable is the farm of consistently doing this?"* — capability is not asset ownership but the chain of collect / store / analyse / interpret / decide / improve. See §7.1. |
| **FFF Workstream** | One of the 8 internal development tracks that connect to the FFF. See §18. |
| **Great Transition** | The canonical 11-transition framing of FFF impact. See §19. |

---

## 17. Source-material provenance

This PRD was refined against the following stakeholder-provided material:

| Source | Type | Used for | Status |
|---|---|---|---|
| *Future Farms Framework (FFF)* document | Google Drive PDF | Three-question framing (§1.1); farm-level vision (§3); canonical pillar definitions (§7.2); capability approach (§7.1); FFMI diagnostic purpose and *"diagnostic and transformation tool"* framing (§7.1); Personalised Farm Transformation Plan structure (§8.4.1); Capability-level maturity assessment output (§8.4.2); canonical Services catalogue (§8.4.3); canonical Learning Resources catalogue (§8.4.4); transformation-cycle model (§7.9); 8 Workstreams (§18); Great Transition table (§19) | **Extracted** — full body content received via pasted Markdown |
| *FFF Assessment Model* (doc `1Pjp8VSQRmGfxliE9Bd0fnHLQZcHR7VVzHXDzkdxps_A`) | Google Doc | Scoring & verification model | **Not extractable** — link returned only the Google Docs UI shell. Re-share as PDF or Markdown, or use a `view`-only link |
| *FFF Structure & Characteristics* (doc `1AMX4HhesUidZe_E9IgASl4Sbtn-YMXdKLXC-ZrJheMU`) | Google Doc | Pillar definitions, capability taxonomy | **Not extractable** — link returned only the Google Docs UI shell. Re-share as PDF or Markdown |
| *FFF Pillars & Questions* spreadsheet (`1elEIAg0DjD5mQUcssqwCJAQMrxWvOv66OPq5S2aHv-g`) | Google Sheet | The 200 question rows (schema in §7.7); priority distribution (§7.3); sample questions (§7.5); evidence requirements per question (§7.6) | **Extracted** — Pillar 1 (25 questions) fully extracted; Pillars 2–8 confirmed to follow identical structure across separate sheet tabs |

The FFF source document now anchors §1.1, §7.1, §7.2, §8.4.1, §8.4.2, §8.4.3, §8.4.4, §18, §19. The remaining two un-extracted docs should be re-shared before Week 1 to verify:

- The evidence A–B–C–D reliability ordering in §7.6 matches the Assessment Model document.
- The full canonical FAAB module catalogue is available (§16 Glossary, FAAB entry; §12 open decision 4).
- The FFMI band tables reconcile to one canonical set (§12 open decision 1).

---

## 18. FFF Workstreams — building the platform *and* the framework

Per the FFF source, the framework itself is developed across 8 parallel workstreams. Each platform-team member should understand how their role connects to one of them. The platform is software, but the platform is also one of the eight workstreams; the others are what the platform makes *addressable* for farmers.

| # | Workstream | Core question | Where it lives in this PRD |
|---|---|---|---|
| 1 | **Concept Development** | What should the FFF mean and achieve? | §3, §7.1, §7.2 |
| 2 | **Data & Analytics** | How do we measure farm capability and maturity? | §7.7 (question schema), §8.3 (scoring engine), §8.7 (ML layer) |
| 3 | **Software / Product Development** | How do we turn the framework into digital tools? | §8 (functional requirements), §10 (architecture), §11 (delivery plan) |
| 4 | **Learning & Services** | How do farmers develop the capabilities they need? | §8.4.3 (canonical services), §8.4.4 (canonical learning resources) |
| 5 | **Marketing & Communications** | How do we explain the value of the FFF? | Out of scope for the pilot; fast-follow |
| 6 | **Go-to-Market** | How do we get farmers and institutions to adopt it? | §14 (success metrics), §3 (vision) |
| 7 | **Verification** | How do we establish credible evidence of transformation? | §7.6 (A–B–C–D protocol), §8.2 (FFV pathway) |
| 8 | **Business Development** | How does the FFF become a sustainable ecosystem? | Out of scope for the pilot; fast-follow |

The PRD's primary workstream is **#3 (Software / Product Development)**. The platform must surface the outputs of workstreams #1, #2, #4, and #7 to the farmer in language that is actionable, not jargon-heavy.

---

## 19. The Great Transition — what the platform is for

Per the FFF source, the framework is designed to facilitate 11 paired transitions. The platform's success is not measured by traffic, but by whether farmers move along these axes. Stakeholder demos, narrative-report copy, and the Insights dashboard must use these pairings as the canonical vocabulary:

| From | To |
|---|---|
| Informal farming | Structured farm businesses |
| Experience-only decisions | Data-informed decisions |
| Manual and fragmented operations | Smart farm systems |
| Energy as a cost | Energy as a productive asset |
| Unsafe / undocumented production | Safe, traceable and compliant production |
| Vulnerability to climate shocks | Climate resilience |
| Farming as an activity | Farming as a business |
| Farmer-dependent operations | Skilled teams and systems |
| Production-led farming | Customer- and market-led farming |
| Limited access to capital | Investment readiness |
| Individual enterprise | Competitive, scalable enterprise |

The Farm Transformation Report narrative may freely reference these pairings — they are the framework's own copy and well understood by stakeholders.

---

*This document should be updated as decisions in §12 are resolved and as the sprint plan in §11 evolves. Treat it as living documentation, not a one-time artifact — if Slack and this PRD disagree on current status, Slack is correct for day-to-day state, but this PRD should be corrected if the disagreement reflects a real scope or plan change.*