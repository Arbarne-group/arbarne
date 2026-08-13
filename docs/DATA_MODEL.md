# DATA_MODEL.md — Platform Schema

> **The data shape the platform must support.** Authoritative source for fields is `prd-refined.md` §7.7. This file is the implementation view.

---

## 1. Conceptual overview

```
┌────────────┐  5      ┌──────────────┐  5      ┌──────────────┐
│  Pillar    │ ──────► │ Capability   │ ──────► │ Question     │
│  (8 rows)  │         │ (40 rows)    │         │ (200 rows)   │
└────────────┘         └──────────────┘         └──────────────┘
                                                         │
                                                         │ 1 row per question
                                                         ▼
                                                   ┌──────────────┐
                                                   │ Question row │
                                                   │ contains     │
                                                   │ all metadata │
                                                   └──────────────┘
```

Three reference tables (pillars, capabilities, questions) — the **framework content** — seeded verbatim from the source. They are read-mostly during the pilot.

Then the **assessment data** — farms, assessments, answers, evidence, recommendations, scores — appended to over time.

---

## 2. Framework content (read-only seeded tables)

### 2.1 `pillars`

| Column | Type | Notes |
|---|---|---|
| `id` | int | PK, 1–8 |
| `name` | text | e.g. "Smart Farming and Digital Transformation" |
| `principle` | text | The pillar principle (verbatim from FFF source) |
| `seeks_to_achieve` | text[] | Outcomes the pillar seeks to achieve |
| `examples` | text[] | Illustrative examples |
| `guiding_question` | text | The pillar's guiding question |

### 2.2 `capabilities`

| Column | Type | Notes |
|---|---|---|
| `id` | text | PK, e.g. `P1.1` |
| `pillar_id` | int | FK → pillars.id |
| `name` | text | e.g. "Technology Readiness" |
| `number` | int | 1–5 within the pillar |
| `description` | text | Optional, from source |

### 2.3 `questions`

This is the **heart of the model**. Each of the 200 question rows from the source spreadsheet maps to one row here.

| Column | Type | Notes |
|---|---|---|
| `id` | text | PK, e.g. `P1.3.1` |
| `pillar_id` | int | FK → pillars.id |
| `capability_id` | text | FK → capabilities.id |
| `question_number` | int | 1–5 within the capability |
| `question_text` | text | **Farmer-facing. Verbatim from source.** Immutable at the engineering level. |
| `ffv_evidence_required` | text | What the verifier collects |
| `if_no_recommendation` | text | The recommended action when answer is "No" |
| `why_it_matters` | text | Plain-language rationale |
| `quick_win` | text | Concrete short-term step |
| `support_available` | text[] | FAAB module + partner organisations |
| `priority` | enum | `quick_win` \| `medium_term` \| `strategic` |
| `learning_resource_ref` | text | Nullable. Pointer to FAAB catalogue. |
| `service_ref` | text | Nullable. Pointer to canonical FFF Services catalogue. |

**Treat `question_text` and other farmer-facing text as immutable.** They are the canonical framework, not engineering copy. Changes must come from a source-material update, not a PR.

### 2.4 `rule_versions`

| Column | Type | Notes |
|---|---|---|
| `id` | text | PK, e.g. `v1.0.0` |
| `created_at` | timestamptz | |
| `ffmi_band_low` | numeric | Signed-off band table values |
| `ffmi_band_high` | numeric | |
| `tier` | int | 1–5 |
| `notes` | text | Why this version exists |

Every assessment row stores the `rule_version_id` that produced its score. This is how we keep historical assessments reproducible.

---

## 3. Assessment data

### 3.1 `farms`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `name` | text | Optional — farmers may remain anonymous |
| `region` | text | For aggregation |
| `crop_type` | text | Optional |
| `created_at` | timestamptz | |

### 3.2 `assessments`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `farm_id` | uuid | FK → farms.id |
| `assessor_id` | uuid | FK → users.id (nullable for self-assessment) |
| `type` | enum | `self` \| `ffv_verified` |
| `status` | enum | `draft` \| `submitted` \| `under_review` \| `verified` \| `needs_more_info` |
| `started_at` | timestamptz | |
| `submitted_at` | timestamptz | Nullable |
| `rule_version_id` | text | FK → rule_versions.id — the version that produced this score |
| `ffmi_score` | numeric | 0–24 |
| `tier` | int | 1–5 |
| `pillar_scores` | jsonb | `{"P1": 0.85, "P2": 0.62, ...}` |

### 3.3 `answers`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `assessment_id` | uuid | FK → assessments.id |
| `question_id` | text | FK → questions.id |
| `value` | enum | `yes` \| `no` |
| `answered_at` | timestamptz | |

### 3.4 `evidence`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `assessment_id` | uuid | FK → assessments.id |
| `question_id` | text | FK → questions.id |
| `evidence_class` | enum | `A` \| `B` \| `C` \| `D` |
| `type` | enum | `photo` \| `document` \| `gps` \| `observation` \| `interview` |
| `file_url` | text | For photo / document |
| `gps_lat` | numeric | For GPS |
| `gps_lng` | numeric | For GPS |
| `captured_at` | timestamptz | For GPS / photo |
| `verifier_notes` | text | |
| `verified_by` | uuid | FK → users.id |
| `verified_at` | timestamptz | |

### 3.5 `recommendations`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `assessment_id` | uuid | FK → assessments.id |
| `question_id` | text | FK → questions.id (nullable — could be rolled up to capability) |
| `capability_id` | text | FK → capabilities.id |
| `pillar_id` | int | FK → pillars.id |
| `gap` | text | The weakness surfaced |
| `capability_status` | enum | `non_existent` \| `emerging` \| `basic` \| `developing` \| `established` \| `advanced` |
| `recommended_action` | text | |
| `recommended_learning` | text | |
| `potential_service` | text | |
| `priority` | enum | `quick_win` \| `medium_term` \| `strategic` |

These are the rows used to render the Farm Transformation Report and the Personalised Farm Transformation Plan.

---

## 4. User and role data

### 4.1 `users`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `email` | text | |
| `phone` | text | For verifier login / MFA |
| `role` | enum | `farmer` \| `verifier` \| `admin` |
| `organisation` | text | For verifiers |
| `created_at` | timestamptz | |

For the pilot, farmers may be anonymous (no `users` row, just a `farms` row). Verifiers always have a `users` row.

---

## 5. LLM and ML data

### 5.1 `llm_call_log`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `assessment_id` | uuid | Nullable |
| `query_type` | text | e.g. `narrative_report`, `chatbot` |
| `input_tokens` | int | |
| `output_tokens` | int | |
| `cost_usd` | numeric | |
| `cached` | bool | Whether served from cache |
| `latency_ms` | int | |
| `created_at` | timestamptz | |

Drives cost guardrails and the post-pilot LLM-economics review.

### 5.2 `embedding_documents` (pgvector)

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `source` | text | e.g. `faab_module_1`, `recommendation_P1.3.1` |
| `text` | text | The chunk's text |
| `embedding` | vector(1536) | pgvector — dimension depends on the embedding model |

RAG over FAAB content and the recommendation library.

### 5.3 `ml_job_runs`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `job_type` | text | `segmentation` \| `risk_prediction` \| `evidence_anomaly` |
| `started_at` | timestamptz | |
| `finished_at` | timestamptz | |
| `status` | enum | `success` \| `failed` |
| `artefact_url` | text | Where results are stored |
| `notes` | text | |

---

## 6. Indexes and performance

- `questions (pillar_id, capability_id, question_number)` — primary lookup
- `answers (assessment_id, question_id)` — primary lookup
- `evidence (assessment_id, question_id)` — primary lookup
- `recommendations (assessment_id, priority)` — for the report
- `farms (region)` — for FFF Insights aggregation
- `assessments (farm_id, submitted_at)` — for progress tracking

Plus the standard pgvector index on `embedding_documents` (HNSW or IVFFlat).

---

## 7. Migration strategy

- **Alembic** for all schema changes.
- Migrations are **additive** within the pilot wherever possible.
- The first migration is the seed: pillars, capabilities, questions, rule_versions.
- Subsequent migrations add: farms, assessments, answers, evidence, recommendations, users, llm_call_log, embedding_documents, ml_job_runs.

---

## 8. Data integrity rules

- `answers.value` cannot be null once `assessments.status` is past `draft`.
- `assessments.ffmi_score` is computed only by the scoring engine; never written by hand.
- `questions.question_text` is **immutable** post-seed. Source-material updates require a migration.
- `evidence.evidence_class` must be one of `A | B | C | D`.
- Every `recommendation` row must reference a non-null `gap`, `recommended_action`, `recommended_learning`, and `potential_service`.

---

## 9. Migration to insights

When **FFF Insights** is built (fast-follow), the relevant aggregations will be views over these tables:

- Pillar-level performance distributions
- Capability-level gap concentrations
- Region vs. crop-type breakdowns
- Progress-over-time (assessments taken over time per farm)

These are views, not separate tables. The pilot keeps the data shape stable so Insights can be added without rework.
