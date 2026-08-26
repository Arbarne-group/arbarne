# TASKS.md — Future Farms Framework (FFF) Digital Platform

> **Sprint-aligned task list.** Granular, owner-assigned, and tied to the PRD's exit criteria. Live status is in Slack `#future-farms-framework`; this file is the durable plan.

**Legend:** `[ ]` pending · `[~]` in progress · `[x]` done · `[!]` blocked · `[-]` deferred

**Owners:** V = Victor (lead) · S = Santana (ML & DB) · L = Liz (ML + frontend provisional) · N = Nikki (DB / ML)

---

## Week 1 — Foundation

**Goal:** Resolve blocking decisions, deploy a seeded schema, and bring up the Docker stack on every team member's machine.

### 1.1 Stakeholder & decision work

- [x] **V** Resolve FFMI numeric bands (open decision #1) — reconcile the two conflicting band tables; record the canonical answer in `docs/DECISIONS.md`
- [x] **V** Confirm frontend ownership (open decision #7) — Liz provisional, confirm or reassign (SPA built)
- [ ] **V** Confirm go/no-go decision date and decision-makers (open decision #5)
- [ ] **V** Confirm pilot farmer access (open decision #3) — at least 3 farmers for Week 4
- [ ] **V** Confirm FAAB module catalogue (open decision #4) — what exists vs. what we link to
- [ ] **V** Nominate evidence reviewer (open decision #2) — name, capacity, SLA
- [x] **V** Confirm MVP question set (open decision #6) — full 200 or validated subset (all 200 confirmed)

### 1.2 Schema, seeding, and infra

- [x] **N** Postgres schema design (pillars, capabilities, questions, farms, assessments, evidence, recommendations, rule_versions, scoring_rules)
- [x] **N** Alembic migrations — first migration green; reversible
- [x] **N** Seed 8 pillars with principle / seeks-to-achieve / examples / guiding question **verbatim** from the FFF source (§7.2)
- [x] **N** Seed 40 capabilities (5 per pillar) with names and ordering
- [x] **N** Seed 200 question rows from the spreadsheet — fields per `CLAUDE.md` §6 — IDs stable (`P1.3.1` etc.)
- [x] **N** Seed `support_available` for each question against the canonical FFF Services and Learning Resources lists
- [x] **N** Verification script that confirms all 200 rows present, IDs unique, foreign keys intact
- [x] **V** `docker-compose.yml` for backend, postgres, redis, worker, frontend
- [x] **V** Repo bootstrap — `main` branch, branch protection, README pointing to `CLAUDE.md` / `PLANNING.md` / `prd-refined.md`
- [x] **V** `.env.example` with all keys (DB, LLM, Redis) clearly named
- [x] **V** Onboard every team member to run the stack locally
- [x] **N** SQL views / queries for pillar-wise question lookup (used by the recommendation engine)

### 1.3 Documentation

- [x] **V** Confirm `CLAUDE.md` reflects current state
- [x] **V** Write `docs/SETUP.md` — clone, install, `docker compose up`, smoke test
- [x] **V** Write `docs/DATA_MODEL.md` — schema diagram, ER overview, field definitions
- [x] **V** Write `docs/DECISIONS.md` — first decision: FFMI bands
- [x] **V** Write `docs/GLOSSARY.md` — FFF & platform terms for the team
- [x] **V** Write `docs/SOURCE_INDEX.md` — what we have, what's still needed

**Week 1 exit criteria (from PRD §11):**
- [x] FFMI bands signed off
- [x] Schema deployed with all 200 question rows
- [x] All team members can run the stack locally

---

## Week 2 — Core assessment

**Goal:** A farmer can complete a self-assessment end-to-end and receive a deterministic score, tier, and prioritised recommendations.

### 2.1 Self-assessment UI (front-end)

- [x] **L** Question-rendering component — pulls from seeded data via API
- [x] **L** Progress indicator + resume capability
- [x] **L** Offline-first design — Service Worker for caching, IndexedDB for local answers, sync on reconnect
- [x] **L** Mobile-friendly layout (test on a phone, not a desktop browser)
- [x] **L** Plain-language no-jargon review of every question text (does the wording make sense? flag, do not edit)
- [x] **L** Post-assessment summary screen — Overall maturity / Strongest pillar / Priority gap / Capability requiring development (PRD §8.4.2)
- [x] **L** Per-gap 5-field view (Gap / Capability status / Recommended action / Recommended learning / Potential service) per PRD §8.4.1

### 2.2 Scoring engine (back-end)

- [x] **V** Scoring engine module — pure Python, no LLM dep, no I/O beyond DB
- [x] **V** Capability status computation (6-level) per capability from 5 question answers
- [x] **V** Pillar score aggregation
- [x] **V** FFMI/24 aggregation
- [x] **V** Tier mapping (5-level) using the signed-off FFMI bands
- [x] **V** Rule versioning — every score carries the rule version that produced it
- [x] **V** Auditability — given any farm, can return the exact answers and rule version that produced the score
- [x] **V** Unit tests for the scoring engine — same answers → same score

### 2.3 Recommendation engine

- [x] **L** Per-question "No" recommendation layer — reads from `if_no_recommendation`, `why_it_matters`, `quick_win`, `support_available`, `priority`
- [x] **L** Capability-level and pillar-level roll-up
- [x] **L** Priority grouping — Quick Wins first
- [x] **L** Map each gap to a canonical FFF Service (§8.4.3) and Learning Resource (§8.4.4)
- [x] **L** Unit tests — at least one sample per priority level

### 2.4 Smoke test

- [x] **V** Sample farms — 3 sample farms, one per tier; produce expected outputs
- [x] **V** Reproducibility check — same answers → same score across at least 3 runs
- [x] **L** Offline smoke test — disconnect mid-assessment, complete, reconnect, sync

**Week 2 exit criteria (from PRD §11):**
- [x] A farmer can complete a self-assessment end-to-end and receive a score, tier, and recommendations grouped by priority
- [x] Offline-capable from the start, not retrofitted

---

## Week 3 — Verification & AI layer

**Goal:** Evidence-backed assessment, narrative report, and batch ML — all without the LLM breaking the deterministic path.

### 3.1 FFV — evidence & verification

- [x] **N** Evidence upload — photos, documents, GPS, timestamp
- [x] **N** Evidence classified A–B–C–D per question (PRD §7.6)
- [ ] **N** Verifier UI — per-question checklist drawn from `ffv_evidence_required`
- [x] **N** Reviewer workflow — status transitions (submitted / under review / verified / needs more info)
- [x] **N** Verified pillar scores — derived from FFV evidence + answers
- [x] **N** Evidence anomaly detection (collaboration with Santana) — duplicate photos, GPS-timestamp inconsistencies
- [x] **N** Tests for the FFV submission flow

### 3.2 LLM narrative + chatbot

- [ ] **V** pgvector setup — embeddings table, FAAB content indexed
- [x] **V** LLM narrative generation endpoint — wraps the deterministic report
- [x] **V** Hard architectural separation — LLM outage does not break the deterministic report
- [x] **V** LLM chatbot — RAG over FAAB material + recommendation library
- [x] **V** Prompt-cache strategy — same capability-status combinations share cached output
- [x] **V** Cost guard — daily / monthly LLM token budget with alerting
- [x] **V** Tests for the LLM layer — including the "LLM down" path

### 3.3 Batch ML

- [x] **S** Celery Beat schedule for batch jobs
- [x] **S** Farm segmentation / clustering job on sample data
- [x] **S** Risk / trajectory prediction job on sample data
- [x] **S** Evidence anomaly detection job — duplicate photos, GPS-timestamp inconsistencies
- [x] **S** Artefact store — results written to a table or blob, available to Insights
- [x] **S** Tests for the batch ML jobs (smoke, not exhaustive)

**Week 3 exit criteria (from PRD §11):**
- [x] An evidence-backed assessment can be submitted and reviewed
- [x] A narrative report can be generated
- [x] Batch ML jobs run on schedule against sample data

---

## Week 4 — Pilot & handover

**Goal:** Live pilot, stakeholder demo, go/no-go decision.

### 4.1 End-to-end testing

- [ ] **S** E2E test with sample farms — all 200 questions answered end-to-end
- [ ] **S** Real low-connectivity test — not simulated, real device, real intermittent network
- [ ] **S** Performance test — scoring returns <1s; batch ML runs on schedule
- [ ] **S** Cost check — actual LLM and infra spend vs. budget

### 4.2 Stakeholder & demo

- [ ] **L** Stakeholder demo script — walks PRD §4 goals one by one
- [ ] **L** Demo data — 3 farms at different tiers, 1 with FFV evidence, 1 with offline completion
- [ ] **L** Demo rehearsal — at least one full run end-to-end
- [ ] **V** Q&A prep — answers to likely stakeholder questions

### 4.3 Deployment

- [ ] **V** Pilot deployment — backend, workers, postgres, redis on a real host
- [ ] **V** HTTPS + domain
- [ ] **V** Backups — postgres nightly
- [ ] **V** Basic monitoring — uptime, error rate, LLM token usage
- [ ] **V** On-call rotation — who answers what at 2am

### 4.4 Go/no-go

- [ ] **V** Compile a "what worked / what didn't / what's next" memo
- [ ] **V** Record the go/no-go decision in `docs/DECISIONS.md`
- [ ] **V** Hand-over document — how to run the platform, where the data lives, what to monitor

**Week 4 exit criteria (from PRD §11):**
- [ ] Pilot deployed
- [ ] Demoed to stakeholders
- [ ] Go/no-go decision made

---

## Cross-cutting concerns (every week)

### Quality

- [ ] **V** Code review on every PR — includes the "no LLM in scoring" checklist
- [ ] **V** PRs small and focused (one PRD section per PR where possible)
- [ ] **V** Branch protection on `main` — tests + review required

### Security & privacy

- [ ] **V** Secrets only in env vars, never in code
- [ ] **V** Farmer PII handling — encrypt at rest, restrict by role
- [ ] **V** Auth — at minimum, password auth for verifiers; TBD for farmers (likely phone-based or none for pilot)
- [ ] **V** Evidence upload — content-type validation, size limits, malware scan if time permits

### Observability

- [ ] **V** Structured logs from day 1
- [ ] **V** Trace IDs through FastAPI → DB → ML → LLM
- [ ] **V** LLM token usage tracked per day and per query

### Documentation

- [ ] **V** PR description cites the PRD section it implements
- [ ] **V** `DECISIONS.md` updated whenever a decision is made
- [ ] **V** `SOURCE_INDEX.md` updated when new material arrives

---

## Risks being actively managed

| Risk | Owner | Status |
|---|---|---|
| FFMI bands unresolved past Week 1 | V | [!] blocker until Week 1 M1 |
| Frontend ownership ambiguous | V | [!] until decision #7 resolved |
| Low-connectivity untested until Week 4 | L | [ ] built offline-first Week 2 |
| LLM bleeds into scoring | V | [ ] architectural separation by EOW Week 1 |
| Question content paraphrased during seeding | N | [ ] seed verbatim; review PRs |
| FAAB module catalogue unconfirmed | V | [!] until decision #4 resolved |
| Reviewer not nominated | V | [!] until decision #2 resolved |
| Pilot farmer access not arranged | V | [!] until decision #3 resolved |

---

## Deferred (not in this build)

- [ ] FFF Insights dashboards (full)
- [ ] FFF Certified pathway
- [ ] Native mobile apps (iOS/Android)
- [ ] Multi-language localisation
- [ ] Self-hosted LLM inference
- [ ] Kubernetes / multi-node orchestration
- [ ] Dedicated vector database service
- [ ] LMS / course hosting
- [ ] Payment / marketplace integration

---

## How to use this file

- **Update it** when scope changes, not on every completed task (Slack is for live status).
- **Reference it** in PRs ("implements TASKS.md #2.2").
- **Bring it** to every sprint review.
