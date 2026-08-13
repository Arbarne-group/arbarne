# CLAUDE.md — Future Farms Framework (FFF) Digital Platform

> **Read this first.** This is the project-level context for any Claude session working on this codebase. The detailed PRD is `prd-refined.md`; this file is the fast-orientation index that points to it.

---

## 1. What this project is

We are building a **digital platform that turns the Future Farms Framework (FFF) into working software**. The FFF is a *Farm Systems Capability and Maturity Framework* — explicitly a **farm transformation architecture, not just an assessment questionnaire** — designed to help East African farms answer:

1. Where is my farm today?
2. What capabilities does my farm need to develop?
3. What should I do to become future-ready?

The platform's first deliverables are **FFF Lite** (farmer self-assessment) and the core of **FFF Verified** (evidence-based assessment). Ultimately, the platform should house all four FFF products: Lite, Verified, Certified, Insights.

The long-term program ambition: **100,000 future-ready farm systems across East Africa by 2035**.

---

## 2. Project layout

```
arbarne/
├── CLAUDE.md            ← this file (start here)
├── PLANNING.md          ← master plan, milestones, architecture
├── TASKS.md             ← granular task list, sprint-aligned, owner-assigned
├── PROGRESS_TRACKER.md  ← live progress tracker & component status matrix
├── prd-refined.md       ← full PRD (the single source of truth for what we build)
├── prd-4.md             ← earlier PRD draft (reference only; do not edit)
├── docs/
│   ├── DECISIONS.md     ← log of resolved and open decisions
│   ├── DATA_MODEL.md    ← pillars / capabilities / questions schema
│   ├── GLOSSARY.md      ← FFF & platform terms
│   ├── SETUP.md         ← local dev environment
│   └── SOURCE_INDEX.md  ← canonical source-material index
└── (code will live under src/, infra under deploy/, etc. as added)
```

**Authoritative spec:** `prd-refined.md`. If this file and the PRD disagree, the PRD wins; flag the discrepancy rather than acting on CLAUDE.md alone.

---

## 3. Team

| Contributor | Role | GitHub |
|---|---|---|
| Victor | Team Lead — Full-Stack & AI Engineer; architecture, complex builds, task assignment | — |
| Santana | ML & Database | Santana-clauss |
| Liz Wahome | ML (+ frontend, provisional) | LizWahome |
| Nikki Mackenzie | Database / ML | Nikki-Mackenzie |

**Communication:** Slack, `#future-farms-framework`. Weekly sprint threads; blockers flagged with 🚧 for immediate visibility.

**Frontend ownership** is *provisionally* Liz alongside her ML work. This is one of the open decisions in the PRD (§12.7) and may be reassigned.

---

## 4. Stack (locked)

| Layer | Technology |
|---|---|
| Backend | **FastAPI** (Python) |
| Database | **PostgreSQL** |
| Frontend | **HTML / JavaScript** |
| Containerization | **Docker** (`docker-compose.yml` for all services) |
| ML | Python (scikit-learn, XGBoost/LightGBM, pandas) |
| LLM | Hosted Anthropic Claude API via FastAPI — not self-hosted for pilot |
| Task queue | Redis + Celery (batch ML, scheduled tasks) |
| Vector store (if needed) | Postgres `pgvector` extension — **no** separate vector DB |

**One backend language** (Python) for API, scoring engine, and ML/LLM orchestration. **Deterministic scoring stays separate from the LLM layer at the code level** (see §8.7 and §10.2 of the PRD).

---

## 5. The three non-negotiable architectural rules

1. **Deterministic scoring must never depend on an LLM call.** The scoring engine has no LLM dependency. If the LLM is down, scoring still works, reports still generate, and the system is still auditable.
2. **Farmer-facing wording is seeded verbatim from the source spreadsheet.** No engineering-team rewording. No "while we're here" improvements to the question text.
3. **Offline-first for the farmer self-assessment.** Built in from Week 2, not retrofitted in Week 4. Answers cache locally, sync on reconnect.

---

## 6. The 200-question domain model (the heart of the build)

- **8 Pillars** → each has a principle, outcomes it seeks to achieve, examples, guiding question (see PRD §7.2).
- **40 Capabilities** (5 per pillar) → each rated on a 6-level scale: `Non-existent → Emerging → Basic → Developing → Established → Advanced`.
- **200 Assessment Questions** (5 per capability) → each is a Yes/No item with full metadata.

Each question row carries exactly these fields (see PRD §7.7):

| Field | Purpose |
|---|---|
| `id` | Stable ID, e.g. `P1.3.1`. Primary key. |
| `pillar_id` | FK → pillars (1–8) |
| `capability_id` | FK → capabilities (e.g. `P1.1`) |
| `question_number` | 1–5 within capability |
| `question_text` | The Yes/No question (farmer-facing, verbatim) |
| `ffv_evidence_required` | What the verifier collects (maps to A–B–C–D) |
| `if_no_recommendation` | What to do when the answer is "No" |
| `why_it_matters` | Plain-language rationale |
| `quick_win` | Concrete short-term step |
| `support_available` | FAAB module + partner organisations |
| `priority` | `quick_win` \| `medium_term` \| `strategic` |

Priority distribution: ~40% Quick Wins / ~40% Medium Term / ~20% Strategic. The UI shows Quick Wins first.

Verified from the source spreadsheet (Pillar 1 fully extracted; Pillars 2–8 follow identical structure across separate sheet tabs).

---

## 7. The five-tier model

The FFMI maps a farm to one of five tiers:

| Tier | Classification |
|---|---|
| 1 | Informal Farm |
| 2 | Emerging Agribusiness |
| 3 | Structured Farm |
| 4 | Investment Ready Farm |
| 5 | Future Ready Farm |

**The score is a means to a next action, not a ranking.** UI and reports must reflect this framing.

---

## 8. Products (target tiers)

1. **FFF Lite** — affordable/free self-assessment for any farmer. *(Pilot scope.)*
2. **FFF Verified** — evidence-based assessment by accredited organisations. *(Pilot scope.)*
3. **FFF Certified** — farms meeting defined standards with independent verification. *(Fast-follow.)*
4. **FFF Insights** — anonymised dashboards for NGOs/governments. *(Fast-follow.)*

---

## 9. The transformation cycle

`Assess → Diagnose → Prioritise → Learn → Implement → Verify → Measure → Advance → Reassess`

This is a **continuous loop**, not a one-time test. The platform must support re-entering the cycle, not just completing it once.

---

## 10. Out of scope for the pilot (do not build in Week 1–4)

- Native mobile apps (iOS/Android) — web frontend must work on mobile browsers
- Payment processing or marketplace transactions
- FFF Digital Learning & Services hosting (courses, videos) — pilot only links out
- Multi-language localisation beyond English
- Self-hosted LLM inference
- Kubernetes / multi-node orchestration
- A dedicated vector database service

Full list in PRD §5 and §10.4.

---

## 11. Sprint structure (4 weeks)

Detailed tasks in `TASKS.md`. Summary:

| Week | Focus | Owner load |
|---|---|---|
| **1 — Foundation** | FFMI band sign-off, schema with all 200 rows seeded, Docker stack | Victor + Nikki |
| **2 — Core assessment** | Self-assessment UI, scoring engine, recommendation logic | Liz + Victor |
| **3 — Verification & AI** | FFV evidence flow, LLM narrative + chatbot, batch ML | Nikki + Victor + Santana |
| **4 — Pilot & handover** | E2E test, demo, deploy, go/no-go | Santana + Liz + Victor |

Each week has explicit exit criteria in the PRD §11.

---

## 12. Open decisions blocking Week 1

Full list in PRD §12. Top blockers:

1. **FFMI numeric bands** — two conflicting tables in source docs; must be reconciled before scoring engine.
2. **Evidence review capacity** — who verifies FFV submissions, and how quickly?
3. **Pilot farmer access** — need a small group of real farmers for Week 4.
4. **FAAB module catalogue** — confirm what exists vs. what we link to.
5. **Go/no-go decision date and decision-makers.**
6. **Question set for MVP** — full 200 or validated subset?
7. **Frontend ownership** — Liz provisional; confirm or reassign.

---

## 13. The Great Transition (canonical platform vocabulary)

The framework tracks 11 transitions. The narrative report, demo copy, and Insights dashboard must use these pairings:

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

---

## 14. The 8 FFF Workstreams — and where the platform fits

| # | Workstream | Where it lives in this PRD |
|---|---|---|
| 1 | Concept Development | §3, §7.1, §7.2 |
| 2 | Data & Analytics | §7.7, §8.3, §8.7 |
| 3 | **Software / Product Development** | **§8, §10, §11 — this is us** |
| 4 | Learning & Services | §8.4.3, §8.4.4 |
| 5 | Marketing & Communications | Out of scope for pilot |
| 6 | Go-to-Market | §14, §3 |
| 7 | Verification | §7.6, §8.2 |
| 8 | Business Development | Out of scope for pilot |

---

## 15. Conventions for working in this repo

- **Markdown editing:** use the Edit / Write tools, not PowerShell/Set-Content. The harness tracks file state.
- **PowerShell is Windows PowerShell 5.1.** No `&&`/`||`, no `??`, no inline `VAR=val cmd`. Use semicolons and `if ($?)`.
- **Code style:** Python (PEP 8), SQLAlchemy 2.x for ORM, Pydantic for request/response models, Alembic for migrations.
- **Branch naming:** `feat/...`, `fix/...`, `chore/...`, `docs/...`.
- **Commit messages:** imperative present (`Add scoring engine`, not `Added scoring engine`).
- **PRs:** small, focused, with a clear description of which PRD section they implement.

---

## 16. Source-material provenance

Authoritative inputs and what we have vs. need:

| Source | Status |
|---|---|
| *Future Farms Framework (FFF)* document | ✅ Extracted (full body) |
| *FFF Assessment Model* | ❌ Re-share as PDF/Markdown |
| *FFF Structure & Characteristics* | ❌ Re-share as PDF/Markdown |
| *FFF Pillars & Questions* spreadsheet | ✅ Extracted (Pillar 1 fully; Pillar 2–8 structured identically) |

Detail in `docs/SOURCE_INDEX.md`.

---

## 17. When in doubt

Read the PRD (`prd-refined.md`). If it's silent, ask. The platform is small enough that we can afford to consult, and consequential enough that we should.
