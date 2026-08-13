# PLANNING.md — Future Farms Framework (FFF) Digital Platform

> **Companion to `prd-refined.md`.** The PRD defines *what*; this file defines *how we plan to get there*. Tasks live in `TASKS.md`; living status in Slack `#future-farms-framework`.

---

## 1. At-a-glance

| | |
|---|---|
| **Project** | FFF Digital Platform — pilot |
| **Horizon** | 4-week sprint build, then go/no-go |
| **Pilot scope** | FFF Lite (self-assessment) + core of FFF Verified (evidence-based) |
| **Pilot non-scope** | FFF Certified, FFF Insights dashboards, native apps, full LMS |
| **Long-term ambition** | 100,000 future-ready farm systems across East Africa by 2035 |
| **Team** | Victor (lead), Santana, Liz Wahome, Nikki Mackenzie |
| **Budget envelope** | ~$15–25/month infra + metered LLM |

---

## 2. The plan in one sentence

> Build a working pilot in 4 weeks that lets a farmer self-assess, get a deterministic FFMI score with prioritised recommendations, optionally submit evidence for verification, and walk away with a printable Farm Transformation Report — all while running lean enough that the economics still work at 100,000 farms.

---

## 3. Milestones

| # | Milestone | Target | Exit criteria |
|---|---|---|---|
| **M0** | Project kickoff | Day 1 | PRD reviewed; open decisions assigned owners; Slack channel live |
| **M1** | Foundation ready | End of Week 1 | FFMI bands signed off; schema deployed with all 200 question rows seeded; Docker stack runs locally on every team member's machine |
| **M2** | Core assessment live | End of Week 2 | A farmer can complete a self-assessment end-to-end and receive a deterministic score, tier, and per-priority recommendations — works offline |
| **M3** | Verification + AI live | End of Week 3 | An evidence-backed assessment can be submitted and reviewed; a narrative report can be generated; batch ML jobs run on a schedule against sample data |
| **M4** | Pilot deployed | End of Week 4 | Pilot deployed to a real environment; demoed to stakeholders; real low-connectivity tests passed; go/no-go decision recorded |

---

## 4. Architectural plan

### 4.1 Stack (locked)

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Frontend | HTML / JavaScript |
| Containerization | Docker (one `docker-compose.yml`) |
| ML | Python (scikit-learn, XGBoost/LightGBM, pandas) |
| LLM | Hosted Anthropic Claude API, called from FastAPI |
| Task queue | Redis + Celery |
| Vector store (if needed) | Postgres `pgvector` extension |

### 4.2 Architectural principles

1. **One backend language** (Python) for API, scoring, ML, LLM orchestration.
2. **Deterministic scoring is code-isolated from LLM.** Scoring engine has zero LLM dependency.
3. **Containerised everything** — every service in one compose file; identical dev to prod.
4. **Batch over real-time for ML** — Celery Beat, not per-request.
5. **Cache LLM output** to control per-token cost.
6. **Offline-first farmer UI** — designed in from Week 2.

### 4.3 Service topology (pilot)

```
┌─────────────────────────────────────────────────────────────┐
│                        Farmer Browser                       │
│                  (HTML/JS, mobile-friendly,                 │
│                  offline-capable, syncs on reconnect)       │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Backend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Self-         │  │ Scoring      │  │ Recommendation   │   │
│  │ assessment   │  │ engine       │  │ engine           │   │
│  │ (FFV/Lite)   │  │ (deterministic│  │ (data-driven)    │   │
│  │              │  │  versioned)  │  │                  │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ FFV          │  │ Reporting    │  │ LLM layer        │   │
│  │ verification │  │ (PDF gen)    │  │ (narrative only) │   │
│  │              │  │              │  │ via pgvector RAG │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└────────────┬────────────────────────────┬──────────────────┘
             │                            │
             ▼                            ▼
      ┌──────────────┐            ┌──────────────┐
      │ PostgreSQL   │            │ Redis +      │
      │ (+pgvector)  │            │ Celery       │
      └──────────────┘            └──────────────┘
```

The scoring engine is a pure module — no LLM, no ML, no I/O beyond the database. Same for the recommendation engine. The LLM layer sits behind its own service and is only invoked for narrative generation and the chatbot.

### 4.4 Hosting (pilot)

- **Backend + workers + Redis:** containerised on a low-cost VPS or PaaS (Render or self-hosted Docker).
- **PostgreSQL:** self-hosted alongside the backend, or a managed provider — final choice depends on data-residency decision (PRD §12).
- **Frontend:** static HTML/JS, served by FastAPI directly at pilot scale.

### 4.5 What we are deliberately not building

- Kubernetes / multi-node orchestration
- Self-hosted LLM inference (GPU)
- A separate vector database service
- A native mobile app
- A full LMS / course platform
- A payment / marketplace system

---

## 5. Sprint plan (4 weeks)

### Week 1 — Foundation

| Task | Owner | Done when |
|---|---|---|
| Resolve FFMI bands (open decision #1) | Victor | Single signed-off band table in `docs/DECISIONS.md` |
| Postgres schema + Alembic migrations | Nikki | Schema deployed; tables for pillars, capabilities, questions, farms, assessments, evidence, recommendations, rule_versions |
| Seed 200 question rows from spreadsheet | Nikki | All 200 rows present, verdicts match spreadsheet sample, IDs stable |
| Seed 8 pillars + 40 capabilities | Nikki | Pillars carry principle / seeks-to-achieve / examples / guiding question verbatim |
| Docker compose for backend, db, redis, worker | Victor | `docker compose up` brings up the full stack; another team member can clone-and-run |
| Source-control repository bootstrap | Victor | Repo with `main` branch, branch protection rules, README pointing to these docs |

### Week 2 — Core assessment

| Task | Owner | Done when |
|---|---|---|
| Self-assessment UI (offline-first) | Liz | 200 questions render; answers persist locally; sync on reconnect |
| Scoring engine (Python, deterministic) | Victor | Given a completed assessment, produces capability status (6-level) + pillar score + FFMI/24 + tier; auditable; rule-versioned |
| Recommendation engine | Liz | Every "No" produces the 5-field per-gap output (Gap / Capability status / Recommended action / Recommended learning / Potential service); grouped by priority |
| Plain-language capability output (§8.4.2) | Victor | Post-assessment screen shows Overall maturity / Strongest pillar / Priority gap / Capability requiring development |
| Smoke test against sample data | Victor | At least 3 sample farms (one per tier) produce the expected outputs |

### Week 3 — Verification & AI

| Task | Owner | Done when |
|---|---|---|
| Evidence upload + FFV submission | Nikki | Verifier can upload photos, documents, GPS, timestamp; evidence classified A–B–C–D |
| Per-question evidence checklist | Nikki | When an FFV opens, the verifier sees `ffv_evidence_required` for each question as a checklist |
| LLM narrative report generation | Victor | A Farm Transformation Report can be generated end-to-end; scoring is untouched if LLM is down |
| LLM chatbot (RAG over FAAB content) | Victor | pgvector indexed; chatbot responds using FAAB material + recommendation library |
| Batch ML: segmentation, risk prediction | Santana | Two Celery Beat jobs scheduled; produce artefacts on sample data |
| Evidence anomaly detection | Santana | Detects duplicate photos / GPS-timestamp inconsistencies |

### Week 4 — Pilot & handover

| Task | Owner | Done when |
|---|---|---|
| End-to-end test with sample farms | Santana | All 200 questions answered end-to-end; report generated; offline behaviour exercised |
| Real low-connectivity testing | Santana | Not simulated — actual intermittent connectivity from a real device |
| Stakeholder demo | Liz | Demo walks the PRD §4 goals item-by-item |
| Deploy pilot | Victor | Pilot URL live; backups configured; basic monitoring |
| Go/no-go decision | Victor | Documented in `docs/DECISIONS.md` |

---

## 6. Dependencies & sequencing

The plan only works if these dependencies hold:

1. **M1 → M2:** signing off FFMI bands *before* the scoring engine is built. Without signed-off bands, no scoring code can be written.
2. **M2 → M3:** the recommendation engine is data-driven from the schema. AI work in Week 3 is gated by having a working recommendation engine in Week 2.
3. **M3 → M4:** FFV depends on the same schema and scoring engine. Adding LLM narratives requires the deterministic path to already work.
4. **External dependency:** Anthropic Claude API availability for Week 3 (L3 LLM narrative). Mitigate by having the deterministic report path work without LLM.
5. **External dependency:** real farmer access for Week 4. Mitigate by escalating early (open decision #3).

Visual:

```
M1 ──► M2 ──► M3 ──► M4
 │      │      │      │
 │      │      │      └─► go/no-go
 │      │      └─► FFV + LLM + ML
 │      └─► self-assessment + scoring + recommendations
 └─► schema + seed + Docker
```

---

## 7. Risks (top 5)

| Risk | Impact | Mitigation |
|---|---|---|
| **FFMI bands unresolved past Week 1** | Scoring engine blocked | Treat as the first blocking item; weekly PM check |
| **No dedicated frontend engineer** | Week 2 UI slips | Liz confirmed with Victor fallback; monitor velocity mid-Week 2 |
| **LLM bleeds into scoring** | Loss of auditability | Combine architectural separation (no LLM dep in scoring module) + code review checklist |
| **Stakeholder farmer access not arranged** | Week 4 "pilot" is actually still synthetic | Begin outreach Week 1; PRD §12 #3 |
| **Question content paraphrased during seeding** | Farmer-facing wording drifts from canonical | Seed verbatim; treat text fields as immutable; PR review checks |

Full risk table in PRD §13.

---

## 8. Cost & resourcing

### 8.1 Infrastructure budget (pilot)

| Item | Cost |
|---|---|
| VPS / PaaS (backend + workers + Redis) | $10–15/month |
| Postgres (self-hosted or managed) | $5–10/month |
| Domain + TLS | ~$1/month |
| Anthropic Claude API (metered) | Variable — budget ~$20–50/month for pilot |
| **Total** | **~$35–75/month** |

Tracking target: PRD §9.1 says $15–25/month *fixed* infra. LLM is metered and separate. As we approach the upper end, we revisit caching strategy.

### 8.2 People

- 1 team lead (architecture, complex integration, full-stack)
- 1 ML/database engineer
- 1 ML engineer (+ frontend provisional)
- 1 database/ML engineer

No external contractors budgeted for the pilot.

---

## 9. Quality gates

Each sprint ends with a quality gate. A sprint is not "done" until:

**Week 1**
- [ ] `docker compose up` works on a fresh clone
- [ ] All 200 question rows are present with stable IDs
- [ ] Open decisions #1 (FFMI bands) is resolved

**Week 2**
- [ ] A farmer can complete a self-assessment in <15 minutes
- [ ] The same answers always produce the same score
- [ ] Recommendations are grouped Quick Wins → Medium Term → Strategic
- [ ] Offline mode works (test: lost connectivity during assessment, came back, sync succeeded)

**Week 3**
- [ ] An FFV submission can be created, evidence uploaded, and a verifier can review it
- [ ] A Farm Transformation Report can be generated end-to-end
- [ ] LLM outage does not break the deterministic report
- [ ] Batch ML jobs run on schedule and produce artefacts

**Week 4**
- [ ] End-to-end test with at least 3 real farmers on real devices
- [ ] Real low-connectivity test passed
- [ ] Stakeholder demo completed
- [ ] Go/no-go decision documented

---

## 10. Post-pilot roadmap (not in this 4-week build)

Once the pilot is approved, the natural next order is:

1. **Insights dashboards** (aggregate, anonymised) — NGOs, funders, government.
2. **Certified pathway** — independent verification, certification eligibility.
3. **Digital Learning & Services** — host learning resources rather than link out.
4. **Multi-language localisation** — Swahili, Amharic, French.
5. **Self-hosted LLM** if data residency or volume demands it.
6. **Mobile-native apps** if pilot usage proves it necessary.

---

## 11. Decision-making protocol

- **Within sprint scope:** team lead (Victor) decides.
- **Across-sprint scope:** recorded in `docs/DECISIONS.md` with date, decision, rationale, dissenters.
- **Stakeholder-required:** the seven open decisions in PRD §12.
- **On any disagreement between CLAUDE.md, PLANNING.md, TASKS.md, and prd-refined.md:** `prd-refined.md` wins. Update the others to match.

---

## 12. Living this document

`PLANNING.md` is updated when:
- A milestone is hit (mark it, link to evidence)
- A sprint plan changes meaningfully
- A risk materialises or is retired
- A new open decision is added

Slack is the day-to-day state. This document is the durable state.
