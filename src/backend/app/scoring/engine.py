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
# Per PRD §12 open decision #1, the source contains two conflicting
# tables. Until reconciled, we use a defensible default:
#   0-4 → Tier 1, 5-9 → Tier 2, 10-15 → Tier 3, 16-20 → Tier 4, 21-24 → Tier 5
# Once stakeholders sign off, the bands are updated and a new rule
# version is created — historical assessments keep their original.
DEFAULT_FFMI_BANDS: list[dict] = [
    {"tier": 1, "low": 0, "high": 4, "classification": "Informal Farm"},
    {"tier": 2, "low": 5, "high": 9, "classification": "Emerging Agribusiness"},
    {"tier": 3, "low": 10, "high": 15, "classification": "Structured Farm"},
    {"tier": 4, "low": 16, "high": 20, "classification": "Investment Ready Farm"},
    {"tier": 5, "low": 21, "high": 24, "classification": "Future Ready Farm"},
]


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
