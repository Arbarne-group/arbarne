# Product Requirements Document — Future Farms Framework (FFF) Digital Platform

| | |
|---|---|
| **Status** | Draft — pending stakeholder sign-off on FFMI bands (see §12) |
| **Owner** | Victor — Team Lead |
| **Team** | Victor (Lead), Santana (ML & Database), Liz Wahome (ML), Nikki Mackenzie (Database/ML) |
| **Timeline** | 4-week build, sprint-based (see §11) |
| **Communication** | Slack — `#future-farms-framework` |

---

## 1. Purpose of this document

This PRD is the single reference for building the FFF digital platform from initialization through pilot completion. It exists so that any team member — or anyone joining later — can answer "what are we building, why, and how" without re-reading the original framework document or reconstructing decisions from Slack history. Where a decision is still open, this document says so explicitly rather than guessing.

Source material: the *Future Farms Framework (FFF)* document (pathway for farm systems development in Africa) and the *FFF Assessment Model* document, both provided by stakeholders.

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

- **8 Pillars** — the major dimensions of a future-ready farm (see §7.2).
- **40 Capabilities** — 5 per pillar. A capability answers "what should this farm be able to do effectively?"
- **200 Assessment Questions** — 5 per capability.
- **Capability Status** — each capability is rated on a 6-level scale: `Non-existent → Emerging → Basic → Developing → Established → Advanced`. This is a development pathway, not pass/fail.
- **Future Farms Maturity Index (FFMI/24)** — aggregates capability assessments into an overall farm maturity score out of 24.
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

1. **Smart Farming and Digital Transformation** — use technology and data to farm smarter.
2. **Productive Use of Renewable Energy** — turn energy from a cost into a productive asset.
3. **Food Safety and Compliance** — produce food that is safe, traceable, quality-assured, and compliant.
4. **Indigenous Knowledge and Climate Resilience** — build resilience by combining local knowledge, science and innovation.
5. **Farm Business Performance and Growth** — build farms that are financially viable, sustainable, and capable of growth.
6. **Human Capital, Leadership and Farm Operations** — build the people, leadership, and systems required to run a professional farm business.
7. **Market Access, Customer Value and Competitiveness** — build the farm around customers and markets, not production alone.
8. **Investment Readiness and Enterprise Development** — build farms that can attract, manage, and grow capital responsibly.

Each pillar has a defined principle, a set of outcomes it seeks to achieve, illustrative examples, and a guiding question (see the source FFF document for full text per pillar — this should be seeded into the database verbatim, not paraphrased, since it is farmer-facing content).

### 7.3 Evidence Verification Protocol (A–B–C–D)

Used by the Future Farms Verification (FFV) pathway. Evidence is classified by reliability:

| Class | Type | Reliability |
|---|---|---|
| A | Documentary evidence (records, plans, budgets, certificates, receipts, contracts, business plans) | ★★★★★ |
| B | Physical observation (graded produce, packaging, storage facilities, value-added products) | ★★★★ |
| C | Digital evidence (mobile apps, GPS, digital records, payment history, photos, marketplace profiles) | ★★★ |
| D | Farmer declaration (interview/verbal confirmation where other evidence is unavailable) | ★★ |

### 7.4 Recommendation priority levels

| Priority | Meaning | Timeline | Characteristics |
|---|---|---|---|
| 🟢 Quick Win | Easy to implement, immediate benefit | 0–3 months | Low cost, low complexity, high impact — shown first |
| 🟡 Medium Term | Requires planning, training, or modest investment | 3–12 months | Moderate investment/complexity, builds capability |
| 🔵 Strategic | Transformational, longer-term | 1–3 years | High investment/complexity, long-term impact, enables business transformation |

### 7.5 The farm transformation cycle

`Assess → Diagnose → Prioritise → Learn → Implement → Verify → Measure → Advance → Reassess`

This is a continuous loop, not a one-time test. The platform must support re-entering the cycle, not just completing it once.

### 7.6 Products (platform tiers)

1. **FFF Lite** — affordable/free self-assessment for any farmer.
2. **FFF Verified** — evidence-based assessment conducted by accredited organisations.
3. **FFF Certified** — farms that meet defined standards and undergo independent verification.
4. **FFF Insights** — aggregated, anonymised data dashboards for governments, NGOs, and development partners.

The pilot (this 4-week build) targets **FFF Lite** and the core of **FFF Verified**; **FFF Certified** and full **FFF Insights** dashboards are fast-follows once the core loop is proven.

---

## 8. Functional requirements

### 8.1 Farmer self-assessment (Part I)
- Yes/No question flow across all 200 questions (or a validated subset for MVP — see §12 open decision).
- Simple language, no evidence required, ~10–15 minutes to complete.
- Automatic scoring and instant recommendations on submission.
- Output: classification scores (24), pillar scores (%), overall FFMI readiness score, recommended next steps, suggested learning modules, areas for improvement.
- Must work offline and sync when connectivity returns.

### 8.2 Future Farms Verification — FFV (Part II)
- Used by extension officers, NGOs, cooperatives, financial institutions, certification bodies, government agencies.
- Same indicators as self-assessment, plus evidence requirements: observation checklists, document upload, photo upload, assessor comments, GPS/location, timestamps.
- Evidence classified per the A–B–C–D protocol (§7.3).
- Output: verified pillar scores, evidence-backed Farm Assessment Report, gap analysis, recommended interventions, progress-over-time comparison, certification eligibility.

### 8.3 Scoring engine
- Deterministic, rules-based, versioned. Given a completed set of question answers, computes: capability status (6-level) per capability → pillar score → FFMI/24 → tier (5-level).
- Must be auditable: given any farm's score, the platform must be able to show exactly which answers produced it.
- Rule changes must be versioned so historical assessments remain reproducible against the rules in effect when they were taken.

### 8.4 Recommendation engine
- Question-level logic: for every "No" answer, generate a recommendation, why-it-matters explanation, quick-win suggestion, available support, and priority level (Quick Win / Medium Term / Strategic).
- Recommendations roll up to capability-level and pillar-level summaries.

### 8.5 Reporting
- **Farm Transformation Report** — generated as a downloadable document (PDF), combining scores, tier classification, prioritised recommendations, and (optionally) an LLM-generated narrative summary.
- Report generation must work from self-assessment data alone; verification adds an evidence-backed variant.

### 8.6 Progress tracking
- A farm can be reassessed; the platform must store and display historical FFMI/tier/pillar scores over time, not overwrite them.
- Progress comparison is a first-class report type, not an afterthought.

### 8.7 ML / LLM layer
- **Batch ML (scheduled, not real-time):** farm segmentation/clustering, risk or trajectory prediction, evidence anomaly detection (duplicate photos, GPS/timestamp inconsistency).
- **LLM (on-demand, cached):** narrative generation for the Farm Transformation Report, a farmer-facing chatbot (RAG over FAAB/training content and the recommendation library), personalised phrasing of recommendations.
- **Hard constraint:** the LLM layer never determines a score. It explains or personalises a result the deterministic scoring engine already computed. This must be true in the architecture, not just in documentation.

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
| Data model: pillars → capabilities → questions | Nikki | Seed 8/40/200 structure into Postgres |
| Environment & Docker setup | Victor | `docker-compose.yml` for all services |

**Exit criteria:** rules locked and signed off; database schema deployed; all team members can run the stack locally via Docker.

### Week 2 — Core assessment
| Task | Owner | Notes |
|---|---|---|
| Farmer self-assessment flow (HTML/JS) | Liz | Offline-capable from the start, not retrofitted |
| Scoring engine + FFMI/24 | Victor | Deterministic, versioned, auditable |
| Recommendation logic (Quick Win/Medium/Strategic) | Liz | Question-level rules per §8.4 |

**Exit criteria:** a farmer can complete a self-assessment end-to-end and receive a score, tier, and recommendations.

### Week 3 — Verification & AI layer
| Task | Owner | Notes |
|---|---|---|
| Evidence upload & FFV flow | Nikki | Photo/document upload, GPS, timestamp, A–B–C–D classification |
| LLM narrative reports + chatbot | Victor | RAG via pgvector; scoring engine untouched by this layer |
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
4. **Existing learning/recommendation content** — confirm what already exists vs. what the platform needs to generate or link to.
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
| **FFF** | Future Farms Framework |
| **FFMI** | Future Farms Maturity Index (out of 24) |
| **FFV** | Future Farms Verification — the evidence-based assessment pathway |
| **FAAB** | Referenced in the source framework as a linked module/support-service category for recommendations |
| **Capability status** | The 6-level maturity rating of one specific capability |
| **Tier** | The 5-level overall farm maturity classification derived from FFMI |
| **Quick Win / Medium Term / Strategic** | The three recommendation priority levels, by cost/complexity/timeline |

---

*This document should be updated as decisions in §12 are resolved and as the sprint plan in §11 evolves. Treat it as living documentation, not a one-time artifact — if Slack and this PRD disagree on current status, Slack is correct for day-to-day state, but this PRD should be corrected if the disagreement reflects a real scope or plan change.*
