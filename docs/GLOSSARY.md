# GLOSSARY.md — FFF & Platform Terms

> **For the team.** All FFF terms used in the codebase, in detail, with their operational consequences.

---

## Framework terms

### FFF — Future Farms Framework
A *Farm Systems Capability and Maturity Framework*. Per the FFF source: a *farm transformation architecture*, not just an assessment questionnaire. The platform's job is to make the framework answerable, year after year, for individual farms.

### FFMI — Future Farms Maturity Index (out of 24)
The aggregate score from the assessment. Per the FFF source: *"a diagnostic and transformation tool."* It is **not** a competitive score. The platform UI must reflect this framing.

### FFV — Future Farms Verification
The evidence-based assessment pathway. Uses the same 200 questions as the self-assessment, but adds an evidence collection step per question. Evidence is classified by reliability (A–B–C–D).

### FAAB — Farm Agribusiness Advisory Bundle
A structured programme of numbered modules. The platform's `support_available` field references FAAB modules. The full canonical module catalogue is one of the open decisions (PRD §12.4).

### Tier
The 5-level overall farm maturity classification derived from FFMI:

| Tier | Classification |
|---|---|
| 1 | Informal Farm |
| 2 | Emerging Agribusiness |
| 3 | Structured Farm |
| 4 | Investment Ready Farm |
| 5 | Future Ready Farm |

### Capability status
The 6-level maturity rating of one specific capability:

| Level | Meaning |
|---|---|
| 1 | Non-existent |
| 2 | Emerging |
| 3 | Basic |
| 4 | Developing |
| 5 | Established |
| 6 | Advanced |

Per the FFF source: *"a development pathway, rather than a simple pass/fail assessment."*

### Capability Approach
The FFF framing: *"How capable is the farm of consistently doing this?"* — capability is not asset ownership. The underlying capability chain is `collect → store → analyse → interpret → decide → improve`. The platform's questions probe this chain, not the presence of assets.

### Question ID
Stable identifier `P{pillar}.{capability}.{q}`, e.g. `P1.3.1`. Primary key in the `questions` table. Used as a foreign key in every other table that references a question.

### Quick Win / Medium Term / Strategic
The three recommendation priority levels:

| Priority | Timeline | Examples |
|---|---|---|
| 🟢 Quick Win | 0–3 months | Low cost, low complexity, high impact |
| 🟡 Medium Term | 3–12 months | Moderate investment/complexity |
| 🔵 Strategic | 1–3 years | Transformational, long-term |

UI shows Quick Wins first.

---

## Product types

### FFF Lite
Free / affordable self-assessment for any farmer. **Pilot scope.**

### FFF Verified
Evidence-based assessment conducted by accredited organisations. **Pilot scope.**

### FFF Certified
Farms meeting defined standards with independent verification. **Fast-follow.**

### FFF Insights
Aggregated, anonymised dashboards for NGOs, funders, government. **Fast-follow.**

### FFF Digital Learning & Services
The broader platform extension that hosts learning resources and services. **Out of scope for pilot.** The pilot only links out to FAAB material.

---

## Personalised Farm Transformation Plan

The per-gap output structure mandated by the FFF source (§8.4.1 of the PRD). Every surfaced gap has exactly five fields:

1. **Gap** — the weakness
2. **Capability status** — the 6-level rating of the affected capability
3. **Recommended action** — concrete, doable instruction
4. **Recommended learning** — FAAB module reference
5. **Potential service** — mapped FFF service

The LLM may rephrase these fields but must never reorder, omit, or substitute them.

---

## The transformation cycle

`Assess → Diagnose → Prioritise → Learn → Implement → Verify → Measure → Advance → Reassess`

A continuous loop, not a one-time test. The platform must support re-entering at any point.

---

## Evidence classification (A–B–C–D)

| Class | Type | Reliability |
|---|---|---|
| A | Documentary (records, plans, budgets, certificates, receipts, contracts, business plans) | ★★★★★ |
| B | Physical observation (graded produce, packaging, storage, value-added products) | ★★★★ |
| C | Digital (apps, GPS, digital records, payment history, photos, marketplace profiles) | ★★★ |
| D | Farmer declaration (interview/verbal confirmation) | ★★ |

The ordering is the canonical reliability ordering. Verifiers prefer A over B over C over D, but pragmatically use whatever is available for the farm's context.

---

## The Great Transition (canonical platform vocabulary)

The framework facilitates 11 paired transitions. Use these in narrative copy:

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

## FFF Workstreams

The 8 internal workstreams of the framework. Our platform is workstream #3:

1. Concept Development
2. Data & Analytics
3. **Software / Product Development** ← this is us
4. Learning & Services
5. Marketing & Communications
6. Go-to-Market
7. Verification
8. Business Development

---

## Platform terms

### Rule version
A specific version of the scoring rules (capability → pillar → FFMI → tier mapping). Every assessment is tagged with the rule version that produced its score. Historical assessments remain reproducible against the rules in effect when they were taken.

### Auditability
The property that any score can be traced back to the exact answers and rule version that produced it. The scoring engine has no LLM dependency because auditability is non-negotiable.

### Offline-first
A design principle: the farmer self-assessment works without connectivity. Answers cache locally (IndexedDB, Service Worker), sync on reconnect. Built in Week 2, not retrofitted.

### pgvector
Postgres extension for vector similarity search. Used for the LLM chatbot's RAG; eliminates the need for a separate vector database service.

### LLM layer
The hosted Claude API integration. Only invokable for narrative generation and the chatbot. The scoring engine must remain functional when the LLM is unavailable.

### Batch ML
Scheduled (Celery Beat) jobs that run against anonymised data. Outputs feed Insights and the evidence anomaly detector. Not real-time, not per-request.

---

## Acronyms

| Acronym | Meaning |
|---|---|
| FFF | Future Farms Framework |
| FFMI | Future Farms Maturity Index |
| FFV | Future Farms Verification |
| FAAB | Farm Agribusiness Advisory Bundle |
| RAG | Retrieval-Augmented Generation (LLM pattern) |
| SOP | Standard Operating Procedure |
| GAP | Good Agricultural Practices |
| ML | Machine Learning |
| LLM | Large Language Model |
| MVP | Minimum Viable Product |
| PRD | Product Requirements Document |
| SLA | Service Level Agreement |
| VPS | Virtual Private Server |
| PaaS | Platform as a Service |
| K8s | Kubernetes |
