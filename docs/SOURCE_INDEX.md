# SOURCE_INDEX.md  --  Canonical Source Material

> **Authoritative inputs to the PRD and the build.** Each entry lists what we have, what we used it for, and any gaps.

---

## 1. Status table

| Source | Type | Status | Last verified |
|---|---|---|---|
| *Future Farms Framework (FFF)* document | Google Drive PDF | ✅ Extracted (full body) | 2026-08-13 |
| *FFF Assessment Model* | Google Doc | ❌ Re-share as PDF/Markdown |  --  |
| *FFF Structure & Characteristics* | Google Doc | ❌ Re-share as PDF/Markdown |  --  |
| *FFF Pillars & Questions* spreadsheet | Google Sheet | ✅ Extracted (Pillar 1 fully; Pillars 2-8 structurally identical) | 2026-08-13 |

---

## 2. *Future Farms Framework (FFF)* document

**Original location:** Google Drive  --  `14XTShybGi7EEqlQs_wJkqZCCTIzT6KCi`

**Status:** ✅ Full body extracted and pasted into the chat on 2026-08-13.

**Used for (cross-references in the PRD):**

| PRD section | What from the source |
|---|---|
| §1.1 | Three-question framing: *"Where is my farm today? / What capabilities does my farm need to develop? / What should I do to become future-ready?"* |
| §3 | Farm-level vision statement |
| §7.1 | "Farm transformation architecture, not just a questionnaire" framing |
| §7.1 | Capability Approach: *"How capable is the farm of consistently doing this?"* |
| §7.1 | FFMI is a *"diagnostic and transformation tool,"* not a competitive score |
| §7.2 | All 8 pillars  --  principle, seeks-to-achieve, examples, guiding question (verbatim) |
| §7.9 | The 9-step transformation cycle |
| §8.4.1 | Personalised Farm Transformation Plan  --  5-field gap output structure |
| §8.4.2 | Capability-level maturity assessment output (overall maturity / strongest pillar / priority gap / capability requiring development) |
| §8.4.3 | Canonical FFF Services catalogue (10 services) |
| §8.4.4 | Canonical Learning Resources catalogue (11 resource types) |
| §18 | The 8 FFF Workstreams |
| §19 | The Great Transition (11 paired transitions) |

**Action items from this source:** none. Everything extracted is in the PRD.

---

## 3. *FFF Assessment Model* document

**Original location:** Google Doc  --  `1Pjp8VSQRmGfxliE9Bd0fnHLQZcHR7VVzHXDzkdxps_A`

**Status:** ❌ Re-share as PDF or Markdown. The Google Docs share link returned only the UI shell, with no body content extractable.

**What we need it for:**

- The canonical scoring rules (capability  ->  pillar  ->  FFMI mapping)
- The FFMI band table  --  this is the conflict that's open decision #1
- The full A-B-C-D evidence classification scheme (we have a working version in the PRD, but it should be confirmed against this source)
- Any nuance on the 6-level capability status rating

**Action:** Re-share as PDF or Markdown, or use a `view`-only share link. Once extracted, update the PRD's §7.1, §7.6, §12.1, and `docs/DECISIONS.md`.

---

## 4. *FFF Structure & Characteristics* document

**Original location:** Google Doc  --  `1AMX4HhesUidZe_E9IgASl4Sbtn-YMXdKLXC-ZrJheMU`

**Status:** ❌ Re-share as PDF or Markdown. The Google Docs share link returned only the UI shell.

**What we need it for:**

- Any additional structure detail on the 8 pillars beyond what's in the FFF document
- Definitions of the 40 capabilities (the same names appear in the spreadsheet, but the source-of-truth definitions should be here)
- Any framework-specific terminology that we should add to `docs/GLOSSARY.md`

**Action:** Re-share as PDF or Markdown. Once extracted, update `docs/GLOSSARY.md` and `docs/DATA_MODEL.md` capability descriptions.

---

## 5. *FFF Pillars & Questions* spreadsheet

**Original location:** Google Sheet  --  `1elEIAg0DjD5mQUcssqwCJAQMrxWvOv66OPq5S2aHv-g`

**Sheets (tabs):** Pillar 1, Pillar 2, Pillar 3, Pillar 4, Pillar 5, Pillar 6, Pillar 7, Pillar 8

**Column headers (consistent across all tabs):**

| Header | Field | Notes |
|---|---|---|
| ID | `id` | e.g. `P1.1.1` |
| Farmer Self-Assessment Question | `question_text` | Farmer-facing, verbatim |
| FFV Evidence Required | `ffv_evidence_required` | Verifier-facing |
| If No (Recommendation) | `if_no_recommendation` | |
| Why It Matters | `why_it_matters` | |
| Quick Win | `quick_win` | |
| Support Available | `support_available` | |
| Priority | `priority` | 🟢 / 🟡 / 🔵 |

**Status:** ✅ Extracted for Pillar 1 (5 capabilities with Focus assessment questions and 25 questions with full metadata: questions, evidence required, if-no recommendations, why it matters, quick wins, support available, priorities). Pillars 2-8 are structured identically across separate tabs.

**Used for (cross-references in the PRD):**

| PRD section | What from the source |
|---|---|
| §7.3 | Priority distribution per pillar (10/10/5 = 40/40/20%) |
| §7.4 | Pillar 1 capability map (5 capabilities, IDs P1.1-P1.5 with authoritative Focus questions) |
| §7.5 | Sample questions (P1.1.1, P1.3.1, P1.5.5) |
| §7.6 | Per-question evidence requirements |
| §7.7 | Question row schema (the 11 fields) |
| §8.1 | Self-assessment draws `question_text` from the row |
| §8.2 | FFV draws `ffv_evidence_required` from the row |
| §8.4 | Recommendation engine reads `if_no_recommendation`, `why_it_matters`, `quick_win`, `support_available`, `priority` |

**Open tasks:**

- [ ] **Nikki**  --  Extract Pillar 2 fully (Week 1)
- [ ] **Nikki**  --  Extract Pillar 3 fully (Week 1)
- [ ] **Nikki**  --  Extract Pillar 4 fully (Week 1)
- [ ] **Nikki**  --  Extract Pillar 5 fully (Week 1)
- [ ] **Nikki**  --  Extract Pillar 6 fully (Week 1)
- [ ] **Nikki**  --  Extract Pillar 7 fully (Week 1)
- [ ] **Nikki**  --  Extract Pillar 8 fully (Week 1)

Priority: confirm all rows with the same shape; flag any rows that don't match the schema.

---

## 6. Source-handling rules

1. **Verbatim.** Question text, principle, seeks-to-achieve, examples, guiding question  --  all seeded verbatim into the database. The PR review checklist enforces this.
2. **Single source of truth.** If two sources disagree on the same fact, the FFF document is authoritative for framework content; the spreadsheet is authoritative for the 200 question rows; the Assessment Model is authoritative for scoring rules.
3. **Versioned.** When a source material is updated, we update `SOURCE_INDEX.md` with the date and the diff.
4. **Provenance preserved.** Every seeded row should ultimately carry a `source_row` or `source_id` pointer back to the spreadsheet row, so changes can be traced.

---

## 7. How to re-share a blocked source

If a source material is gated or returned only the UI shell:

1. **Export to PDF** (Google Docs: `File  ->  Download  ->  PDF`; Google Drive: right-click  ->  Download).
2. **Paste as Markdown** in the chat.
3. **Use a `view`-only link** rather than `edit`  --  these are typically more reliably extractable.

Once received, update §1 above and PRD §17.
