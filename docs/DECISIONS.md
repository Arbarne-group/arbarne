# DECISIONS.md  --  Decision Log

> **Living log of decisions made on the FFF Digital Platform project.** When a decision is made  --  by the team, by stakeholders, or by force of circumstance  --  record it here. Format: `DATE | DECISION | RATIONALE | DISSENT / NOTES`.

---

## Open decisions (from PRD §12)

These are blocking Week 1 and must be resolved before the scoring engine is built.

| # | Decision | Owner | Status |
|---|---|---|---|
| 1 | **FFMI numeric bands**  --  reconcile the two conflicting band tables | Victor | 🟢 Resolved |
| 2 | **Evidence review capacity**  --  who verifies FFV submissions, and how quickly | Victor | 🟡 Open |
| 3 | **Pilot farmer access**  --  small group of real farmers for Week 4 | Victor | 🟡 Open |
| 4 | **FAAB module catalogue**  --  confirm what exists vs. what we link to | Victor | 🟡 Open |
| 5 | **Go/no-go decision date and decision-makers** | Victor | 🟡 Open |
| 6 | **MVP question set**  --  full 200 or validated subset | Victor | 🟢 Resolved (Full 200) |
| 7 | **Frontend ownership**  --  Liz provisional, confirm or reassign | Victor | 🟢 Resolved (Liz / SPA) |

---

## Resolved decisions

### 2026-08-13  --  FFMI numeric bands sign-off

**Decision:** Reconciled the FFMI 0-24 scale into five tiers:
- Tier 1 (0-4 pts): Informal Farm
- Tier 2 (5-9 pts): Emerging Agribusiness
- Tier 3 (10-15 pts): Structured Farm
- Tier 4 (16-20 pts): Investment Ready Farm
- Tier 5 (21-24 pts): Future Ready Farm

**Rationale:** Standardizes scoring across Lite and Verified assessments with a 24-point composite scale (8 pillars × 3 points max) that provides smooth tier transitions without gaps.
**Alternatives considered:** Using raw percentage (0-100%) or unweighted capability counts.
**Owner:** Victor (Team Lead)
**Affects:** `app/scoring/engine.py`, PRD §7.4, Decision #1.

### 2026-08-13  --  MVP Question Set

**Decision:** Include all 200 questions across all 8 pillars for the MVP release.
**Rationale:** The full framework is required to assess all 40 capabilities without structural gaps.
**Owner:** Victor (Team Lead)
**Affects:** `app/scripts/seed_framework.py`, PRD §7.7, Decision #6.

### Template

```
### YYYY-MM-DD  --  Short decision title

**Decision:** The exact decision taken.
**Rationale:** Why this choice.
**Alternatives considered:** What else was on the table.
**Dissent / notes:** Anyone who disagreed, or open caveats.
**Owner:** Who made the call.
**Affects:** Which PRD section / TASKS.md items this changes.
```

---

## Deferred decisions (explicit non-decisions)

These are decisions we *chose not to make* in the pilot, on purpose. Recording them so future readers don't reopen the question.

### 2026-08-13  --  No native mobile app in pilot

**Decision:** We will not build a native iOS / Android app in the 4-week pilot.
**Rationale:** A mobile-friendly web frontend covers the user need. Native apps add store-distribution, signing, and review cycles that the pilot cannot accommodate.
**Affects:** PRD §5 non-goals.

### 2026-08-13  --  No self-hosted LLM in pilot

**Decision:** The pilot uses a hosted Anthropic Claude API, not self-hosted inference.
**Rationale:** Self-hosted inference is not cost-justified at pilot volume. Architecture is built so it can be revisited without rewriting the scoring engine.
**Affects:** PRD §9.4, §10.4.

### 2026-08-13  --  No separate vector database service

**Decision:** Use Postgres `pgvector` extension, not a dedicated vector DB (Pinecone, Weaviate, etc.).
**Rationale:** One fewer service to operate; pgvector is mature enough for the chatbot's RAG use case.
**Affects:** PRD §10.4.

### 2026-08-13  --  No Kubernetes / multi-node orchestration for pilot

**Decision:** Single Docker host (compose file) is sufficient for the pilot.
**Rationale:** Pilot scale does not justify K8s complexity. Migration path is preserved if needed.
**Affects:** PRD §10.4.

---

## How to use this file

- **Add a decision** when one is made  --  by you, by the team, or by stakeholders.
- **Keep entries short**  --  the date, the decision, the rationale. The PRD is for the *what*; this is for the *why*.
- **Cross-reference** the PRD section that the decision affects.
- **Update the open decisions table** when one is resolved.
