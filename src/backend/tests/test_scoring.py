"""Tests for the deterministic scoring engine.

The scoring engine must:
  - produce the same score for the same inputs
  - produce a different score for different inputs
  - never depend on the LLM
  - respect the 6-level capability status pathway
  - respect the band table for tier mapping
"""

from __future__ import annotations

from app.scoring.engine import (
    DEFAULT_FFMI_BANDS,
    capability_status_from_yes_count,
    pillar_score_from_statuses,
    score_assessment,
)


# ─── Capability status mapping ───────────────────────────────────────
def test_capability_status_all_no():
    assert capability_status_from_yes_count(0) == "non_existent"


def test_capability_status_all_yes():
    assert capability_status_from_yes_count(5) == "advanced"


def test_capability_status_pathway_in_order():
    """The pathway must progress through the 6 levels in semantic order."""
    expected = ["non_existent", "emerging", "basic", "developing", "established", "advanced"]
    actual = [capability_status_from_yes_count(i) for i in range(6)]
    assert actual == expected


def test_capability_status_invalid_input():
    import pytest
    with pytest.raises(ValueError):
        capability_status_from_yes_count(6)
    with pytest.raises(ValueError):
        capability_status_from_yes_count(-1)


# ─── Pillar score ────────────────────────────────────────────────────
def test_pillar_score_all_advanced():
    assert pillar_score_from_statuses(["advanced"] * 5) == 1.0


def test_pillar_score_all_nonexistent():
    assert pillar_score_from_statuses(["non_existent"] * 5) == 0.0


def test_pillar_score_empty():
    assert pillar_score_from_statuses([]) == 0.0


def test_pillar_score_midpoint():
    """Average of mixed statuses lands somewhere between 0 and 1."""
    s = pillar_score_from_statuses(["developing", "basic", "emerging", "established", "advanced"])
    assert 0.0 < s < 1.0


# ─── FFMI score overall ──────────────────────────────────────────────
def _all_yes_capabilities():
    """Build a capabilities layout with 5 capabilities per pillar."""
    return {
        i: [(f"P{i}.{j}", [f"P{i}.{j}.{k}" for k in range(1, 6)]) for j in range(1, 6)]
        for i in range(1, 9)
    }


def _all_no_answers():
    return {}


def _all_yes_answers():
    answers = {}
    for i in range(1, 9):
        for j in range(1, 6):
            for k in range(1, 6):
                answers[f"P{i}.{j}.{k}"] = "yes"
    return answers


def test_score_all_yes_yields_top_tier():
    """All 200 yes answers → FFMI 24, tier 5."""
    caps = _all_yes_capabilities()
    answers = _all_yes_answers()
    result = score_assessment(answers, caps)
    assert result.ffmi_score == 24.0
    assert result.tier == 5
    assert result.tier_classification == "Future Ready Farm"
    for i in range(1, 9):
        assert result.pillar_scores[i] == 1.0


def test_score_all_no_yields_bottom_tier():
    """All 200 no answers → FFMI 0, tier 1."""
    caps = _all_yes_capabilities()
    answers = _all_no_answers()
    result = score_assessment(answers, caps)
    assert result.ffmi_score == 0.0
    assert result.tier == 1
    assert result.tier_classification == "Informal Farm"
    for i in range(1, 9):
        assert result.pillar_scores[i] == 0.0


def test_score_is_deterministic():
    """Same inputs → same outputs (auditable)."""
    caps = _all_yes_capabilities()
    answers = {f"P1.1.{k}": "yes" for k in range(1, 6)}
    answers.update({f"P1.2.{k}": "no" for k in range(1, 6)})
    answers.update({f"P2.1.{k}": "yes" for k in range(1, 6)})
    results = [score_assessment(answers, caps) for _ in range(5)]
    first = results[0]
    for r in results[1:]:
        assert r.ffmi_score == first.ffmi_score
        assert r.tier == first.tier
        assert r.pillar_scores == first.pillar_scores
        assert r.capability_status == first.capability_status


def test_score_uses_provided_bands():
    """Custom bands should override the default."""
    caps = _all_yes_capabilities()
    answers = _all_yes_answers()
    custom_bands = [
        {"tier": 1, "low": 0, "high": 11, "classification": "All Tier 1"},
        {"tier": 5, "low": 12, "high": 24, "classification": "All Tier 5"},
    ]
    result = score_assessment(answers, caps, bands=custom_bands)
    assert result.tier == 5
    assert result.tier_classification == "All Tier 5"


def test_score_no_llm_dependency():
    """The scoring engine module must not import anything from the LLM layer."""
    import app.scoring.engine as engine
    import inspect
    source = inspect.getsource(engine)
    assert "anthropic" not in source.lower()
    assert "llm" not in source.lower()
    assert "claude" not in source.lower()


def test_default_bands_has_five_tiers():
    """The default band table must have exactly 5 tiers, 1-5."""
    assert len(DEFAULT_FFMI_BANDS) == 5
    assert [b["tier"] for b in DEFAULT_FFMI_BANDS] == [1, 2, 3, 4, 5]


def test_default_bands_cover_full_range():
    """The bands must cover the full 0..24 range."""
    low = min(b["low"] for b in DEFAULT_FFMI_BANDS)
    high = max(b["high"] for b in DEFAULT_FFMI_BANDS)
    assert low == 0
    assert high == 24
