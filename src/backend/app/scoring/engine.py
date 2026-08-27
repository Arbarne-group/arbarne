"""Deterministic scoring engine.

Given a set of Yes/No answers to one capability's 5 questions, produce:
  - capability_status: 6-level rating (1..6)
  - pillar_score: 0..1
  - ffmi_score: 0..24
  - tier: 1..5

This module is **pure Python** — no external model, no I/O beyond the database.
That property is what makes the scoring auditable.
"""

from __future__ import annotations

from dataclasses import dataclass

# ─── Capability status mapping ───────────────────────────────────────
# 5 questions per capability. Number of "yes" answers maps to a 6-level
# status. This is the development pathway, not pass/fail (see PRD §7.1).
_CAPABILITY_STATUS_BANDS: list[tuple[int, str]] = [
    (0, "non_existent"),
    (1, "emerging"),
    (2, "basic"),
    (3, "developing"),
    (4, "established"),
    (5, "advanced"),
]

# ─── FFMI band table (canonical, versioned) ──────────────────────────
# Authoritative per the Future Farms Maturity Index (FFMI/24) Scoring Model:
#   0–4  → Tier 1 Informal Farm
#   5–9  → Tier 2 Emerging Agribusiness
#   10–15 → Tier 3 Structured Farm
#   16–20 → Tier 4 Investment Ready Farm
#   21–24 → Tier 5 Future Ready Farm
# If stakeholders later amend the bands, a new rule version is created and
# historical assessments keep their original.
DEFAULT_FFMI_BANDS: list[dict] = [
    {"tier": 1, "low": 0, "high": 4, "classification": "Informal Farm"},
    {"tier": 2, "low": 5, "high": 9, "classification": "Emerging Agribusiness"},
    {"tier": 3, "low": 10, "high": 15, "classification": "Structured Farm"},
    {"tier": 4, "low": 16, "high": 20, "classification": "Investment Ready Farm"},
    {"tier": 5, "low": 21, "high": 24, "classification": "Future Ready Farm"},
]

# ─── Pillar status bands (Scoring Model, Level 4) ────────────────────
# The raw pillar score is 0..25 (5 capabilities x 5). The engine reports a
# normalised 0..1 pillar score, so these thresholds are on the 0..1 scale
# (divide the 0-25 thresholds by 25).
PILLAR_STATUS_BANDS: list[dict] = [
    {"low": 0.0, "high": 0.20, "status": "Critical Weakness",
     "interpretation": "Immediate attention required. The pillar lacks foundational systems and practices."},
    {"low": 0.21, "high": 0.40, "status": "Developing Area",
     "interpretation": "Some practices are in place, but significant improvement is needed."},
    {"low": 0.41, "high": 0.60, "status": "Progressing",
     "interpretation": "Good progress has been made, but several capabilities require strengthening."},
    {"low": 0.61, "high": 0.80, "status": "Core Strength",
     "interpretation": "The pillar is performing well with only minor improvement opportunities."},
    {"low": 0.81, "high": 1.0, "status": "Strategic Advantage",
     "interpretation": "This is a high-performing pillar and can serve as a model for continuous improvement and peer learning."},
]

# ─── Generic capability status feedback (Scoring Model, Level 2-3) ────
# Per-capability feedback (the 40 bespoke paragraphs in the Recommendation
# Library) is surfaced separately; this is the framework-wide default used
# when a capability-specific paragraph is unavailable.
CAPABILITY_STATUS_FEEDBACK: dict[str, str] = {
    "non_existent": (
        "This capability has not yet been established on your farm. Focus on implementing the "
        "foundational practices required under this capability before progressing to more advanced "
        "actions. Building these fundamentals will strengthen your farm's resilience, productivity, "
        "and readiness for future development."
    ),
    "emerging": (
        "Your farm is beginning to develop this capability, but most of the foundational practices "
        "are not yet in place. Start with the priority recommendations provided in your assessment and "
        "focus on establishing simple, practical systems that can be applied consistently."
    ),
    "basic": (
        "Your farm has established some of the foundational practices required under this capability, "
        "but important gaps remain. Build on what is already working by addressing the identified "
        "gaps, improving consistency, and strengthening the systems needed to progress to the next level."
    ),
    "developing": (
        "Your farm demonstrates good progress in this capability, with most recommended practices "
        "already in place. Focus on strengthening the remaining areas and embedding these practices "
        "consistently across your farm to achieve advanced performance."
    ),
    "established": (
        "Your farm demonstrates a well-established capability, with nearly all recommended practices "
        "in place. Address the remaining gap, strengthen consistency and documentation, and begin "
        "focusing on optimisation, measurement, innovation, and continuous improvement."
    ),
    "advanced": (
        "Congratulations! Your farm demonstrates strong performance in this capability. Continue "
        "monitoring performance, embracing innovation, and sharing good practices with others. "
        "Maintaining this level of excellence will support long-term resilience, competitiveness, and "
        "continuous improvement."
    ),
}


@dataclass(frozen=True)
class ScoringResult:
    """The output of scoring a single completed assessment."""

    ffmi_score: float
    tier: int
    tier_classification: str
    pillar_scores: dict[int, float]
    capability_status: dict[str, str]


def capability_status_from_yes_count(yes_count: int) -> str:
    """Map (0..5) yes answers to a 6-level capability status string."""
    if yes_count < 0 or yes_count > 5:
        raise ValueError(f"yes_count must be in 0..5, got {yes_count}")
    return _CAPABILITY_STATUS_BANDS[yes_count][1]


def pillar_score_from_statuses(statuses: list[str]) -> float:
    """Average capability status (1..6) expressed as a 0..1 fraction.

    A capability with all five "yes" answers (status = advanced) scores
    1.0; one with none (status = non_existent) scores 0.0.
    """
    if not statuses:
        return 0.0
    level = {"non_existent": 0, "emerging": 1, "basic": 2, "developing": 3, "established": 4, "advanced": 5}
    total = sum(level[s] for s in statuses)
    return total / (5.0 * len(statuses))


def score_assessment(
    answers: dict[str, str],
    capabilities_by_pillar: dict[int, list[tuple[str, list[str]]]],
    bands: list[dict] | None = None,
) -> ScoringResult:
    """Score an assessment given the answers and the capability layout.

    Args:
        answers: ``{question_id: 'yes'|'no'}`` for every question answered.
        capabilities_by_pillar: ``{pillar_id: [(capability_id, [question_id, ...]), ...]}``
            describing the 8 pillars and their 5 capabilities × 5 questions.
        bands: Optional FFMI band table; defaults to ``DEFAULT_FFMI_BANDS``.

    Returns:
        A ``ScoringResult`` with FFMI/24, tier, pillar scores, and
        per-capability status.
    """
    bands = bands or DEFAULT_FFMI_BANDS

    pillar_scores: dict[int, float] = {}
    capability_status: dict[str, str] = {}

    raw_ffmi = 0.0
    capability_count = 0

    for pillar_id, capabilities in capabilities_by_pillar.items():
        cap_statuses: list[str] = []
        for cap_id, question_ids in capabilities:
            yes_count = sum(1 for q in question_ids if answers.get(q) == "yes")
            status = capability_status_from_yes_count(yes_count)
            capability_status[cap_id] = status
            cap_statuses.append(status)
        pillar_scores[pillar_id] = pillar_score_from_statuses(cap_statuses)
        raw_ffmi += sum(
            {"non_existent": 0, "emerging": 1, "basic": 2, "developing": 3, "established": 4, "advanced": 5}[s]
            for s in cap_statuses
        )
        capability_count += len(cap_statuses)

    # FFMI is the sum of capability status levels across all capabilities,
    # normalized to a 0..24 scale (8 pillars × 3 points max = 24 points total).
    if capability_count > 0:
        ffmi_score = round(raw_ffmi * 24.0 / (5.0 * capability_count), 2)
    else:
        ffmi_score = 0.0

    tier, classification = _tier_for_score(ffmi_score, bands)

    return ScoringResult(
        ffmi_score=ffmi_score,
        tier=tier,
        tier_classification=classification,
        pillar_scores=pillar_scores,
        capability_status=capability_status,
    )


def _tier_for_score(score: float, bands: list[dict]) -> tuple[int, str]:
    """Find the band that contains the FFMI score."""
    for band in bands:
        if band["low"] <= score <= band["high"]:
            return band["tier"], band["classification"]
    # Out-of-range fallback: clamp to nearest tier
    if score < bands[0]["low"]:
        return bands[0]["tier"], bands[0]["classification"]
    last = bands[-1]
    return last["tier"], last["classification"]


def pillar_status_from_score(score: float) -> dict:
    """Map a normalised (0..1) pillar score to its pillar-status band.

    Bands and interpretations are taken verbatim from the FFMI/24 Scoring
    Model (Level 4: Pillar Score).
    """
    for band in PILLAR_STATUS_BANDS:
        if band["low"] <= score <= band["high"]:
            return {
                "status": band["status"],
                "interpretation": band["interpretation"],
            }
    # Clamp to nearest band
    if score <= PILLAR_STATUS_BANDS[0]["high"]:
        b = PILLAR_STATUS_BANDS[0]
    else:
        b = PILLAR_STATUS_BANDS[-1]
    return {"status": b["status"], "interpretation": b["interpretation"]}


def capability_feedback(status: str) -> str:
    """Return the framework-default feedback paragraph for a capability status."""
    return CAPABILITY_STATUS_FEEDBACK.get(
        status,
        CAPABILITY_STATUS_FEEDBACK["non_existent"],
    )
