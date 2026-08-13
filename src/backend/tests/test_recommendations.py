"""Tests for the recommendation engine."""

from __future__ import annotations

from dataclasses import dataclass

from app.recommendations.engine import (
    Recommendation,
    build_recommendations,
    strongest_and_priority_pillars,
)


@dataclass
class FakeQuestion:
    """Minimal stand-in for a Question ORM row."""

    id: str
    pillar_id: int
    capability_id: str
    question_text: str
    if_no_recommendation: str
    why_it_matters: str
    quick_win: str
    support_available: list[str]
    priority: str
    service_ref: str = ""


def _q(
    qid: str,
    pillar: int,
    cap: str,
    priority: str = "quick_win",
    text: str = "Q?",
    action: str = "Do X.",
    learning: str = "FAAB Module 1",
    service: str = "Advisory",
    why: str = "Because.",
) -> FakeQuestion:
    return FakeQuestion(
        id=qid,
        pillar_id=pillar,
        capability_id=cap,
        question_text=text,
        if_no_recommendation=action,
        why_it_matters=why,
        quick_win="Quick win",
        support_available=[learning],
        priority=priority,
        service_ref=service,
    )


def test_no_recommendations_when_all_yes():
    questions = {
        "P1.1.1": _q("P1.1.1", 1, "P1.1"),
    }
    answers = {"P1.1.1": "yes"}
    recs = build_recommendations(answers, questions, {})
    assert recs == []


def test_recommendation_for_single_no():
    questions = {
        "P1.1.1": _q("P1.1.1", 1, "P1.1", action="Do X."),
    }
    answers = {"P1.1.1": "no"}
    recs = build_recommendations(answers, questions, {"P1.1": "non_existent"})
    assert len(recs) == 1
    r = recs[0]
    assert r.question_id == "P1.1.1"
    assert r.gap == "Q?"
    assert r.recommended_action == "Do X."
    assert r.priority == "quick_win"


def test_priority_ordering_quick_wins_first():
    """Quick Wins must come before Medium Term, which come before Strategic."""
    questions = {
        "P1.1.1": _q("P1.1.1", 1, "P1.1", priority="strategic"),
        "P1.1.2": _q("P1.1.2", 1, "P1.1", priority="quick_win"),
        "P1.1.3": _q("P1.1.3", 1, "P1.1", priority="medium_term"),
    }
    answers = {"P1.1.1": "no", "P1.1.2": "no", "P1.1.3": "no"}
    recs = build_recommendations(answers, questions, {})
    assert [r.priority for r in recs] == ["quick_win", "medium_term", "strategic"]


def test_strongest_and_priority_pillars():
    scores = {1: 0.9, 2: 0.2, 3: 0.5}
    assert strongest_and_priority_pillars(scores) == (1, 2)


def test_strongest_and_priority_pillars_empty():
    assert strongest_and_priority_pillars({}) == (None, None)


def test_recommendation_uses_question_priority():
    """The recommendation's priority must come from the question row, not the LLM."""
    q = _q("P1.1.1", 1, "P1.1", priority="strategic")
    questions = {"P1.1.1": q}
    recs = build_recommendations({"P1.1.1": "no"}, questions, {"P1.1": "non_existent"})
    assert recs[0].priority == "strategic"
