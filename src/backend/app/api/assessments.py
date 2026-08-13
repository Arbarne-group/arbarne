"""Assessment API — start, answer, submit, score, report."""

from __future__ import annotations

import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.assessment import Answer, Assessment, Farm
from app.models.framework import Capability, Pillar, Question, RuleVersion
from app.models.recommendation import Recommendation
from app.recommendations.engine import build_recommendations, strongest_and_priority_pillars
from app.scoring.engine import DEFAULT_FFMI_BANDS, score_assessment
from app.schemas.assessment import (
    AnswerIn,
    EvidenceIn,
    EvidenceResponse,
    FarmCreate,
    NarrativeReportResponse,
    StartAssessmentResponse,
    SubmitAssessmentResponse,
    VerifyAssessmentIn,
)

router = APIRouter(prefix="/api/assessments", tags=["assessments"])


@router.post("/start", response_model=StartAssessmentResponse)
def start_assessment(
    farm: FarmCreate,
    db: Session = Depends(get_db),
) -> StartAssessmentResponse:
    """Start a new assessment for a farm. Returns the assessment ID."""
    new_farm = Farm(
        name=farm.name,
        region=farm.region,
        crop_type=farm.crop_type,
    )
    db.add(new_farm)
    db.flush()

    assessment = Assessment(
        farm_id=new_farm.id,
        type="self",
        status="draft",
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return StartAssessmentResponse(
        assessment_id=assessment.id,
        farm_id=new_farm.id,
        status=assessment.status,
    )


@router.post("/{assessment_id}/answers")
def save_answers(
    assessment_id: uuid.UUID,
    answers: list[AnswerIn],
    db: Session = Depends(get_db),
) -> dict:
    """Save (or upsert) answers for an assessment. Idempotent per question."""
    assessment = db.get(Assessment, assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    if assessment.status not in ("draft", "submitted"):
        raise HTTPException(
            status_code=409,
            detail=f"Cannot edit answers in status {assessment.status!r}",
        )

    for a in answers:
        question = db.get(Question, a.question_id)
        if not question:
            raise HTTPException(
                status_code=400, detail=f"Unknown question id: {a.question_id}"
            )

        existing = (
            db.query(Answer)
            .filter(Answer.assessment_id == assessment_id, Answer.question_id == a.question_id)
            .one_or_none()
        )
        if existing:
            existing.value = a.value
            existing.answered_at = datetime.utcnow()
        else:
            db.add(
                Answer(
                    assessment_id=assessment_id,
                    question_id=a.question_id,
                    value=a.value,
                )
            )

    db.commit()
    return {"assessment_id": str(assessment_id), "saved": len(answers)}


@router.post("/{assessment_id}/submit", response_model=SubmitAssessmentResponse)
def submit_assessment(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> SubmitAssessmentResponse:
    """Submit the assessment, compute the score, and persist recommendations.

    Uses the deterministic scoring engine. Does not depend on the LLM.
    """
    assessment = (
        db.query(Assessment)
        .options(selectinload(Assessment.answers))
        .filter(Assessment.id == assessment_id)
        .one_or_none()
    )
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    if assessment.status not in ("draft", "submitted"):
        raise HTTPException(
            status_code=409,
            detail=f"Cannot submit assessment in status {assessment.status!r}",
        )

    # Build the answers and question lookup
    answers: dict[str, str] = {a.question_id: a.value for a in assessment.answers}
    questions_by_id: dict[str, Question] = {
        q.id: q
        for q in db.query(Question)
        .options(selectinload(Question.capability))
        .all()
        if q.id in answers
    }

    # Build the capability layout: { pillar_id: [(cap_id, [q_id, ...]), ...] }
    capabilities_by_pillar: dict[int, list[tuple[str, list[str]]]] = {}
    caps = (
        db.query(Capability)
        .options(selectinload(Capability.questions))
        .order_by(Capability.pillar_id, Capability.number)
        .all()
    )
    for c in caps:
        capabilities_by_pillar.setdefault(c.pillar_id, []).append(
            (c.id, [q.id for q in c.questions])
        )

    # ─── Score (deterministic, no LLM) ─────────────────────────────
    result = score_assessment(answers, capabilities_by_pillar, DEFAULT_FFMI_BANDS)

    # ─── Persist a rule version if none exists yet ──────────────────
    rule_version = (
        db.query(RuleVersion).filter(RuleVersion.id == "v1.0.0").one_or_none()
    )
    if rule_version is None:
        rule_version = RuleVersion(
            id="v1.0.0",
            bands=DEFAULT_FFMI_BANDS,
            notes="Initial pilot bands per PRD §12 open decision #1.",
        )
        db.add(rule_version)
        db.flush()

    # ─── Update assessment with scoring outputs ────────────────────
    assessment.ffmi_score = result.ffmi_score
    assessment.tier = result.tier
    assessment.pillar_scores = {str(k): v for k, v in result.pillar_scores.items()}
    assessment.capability_status = result.capability_status
    assessment.rule_version_id = rule_version.id
    assessment.status = "submitted"
    assessment.submitted_at = datetime.utcnow()

    # ─── Build recommendations ─────────────────────────────────────
    strongest_pillar, priority_gap_pillar = strongest_and_priority_pillars(
        result.pillar_scores
    )
    recs = build_recommendations(answers, questions_by_id, result.capability_status)

    # Wipe and re-insert recommendations for this assessment
    db.query(Recommendation).filter(
        Recommendation.assessment_id == assessment_id
    ).delete()
    for r in recs:
        db.add(
            Recommendation(
                assessment_id=assessment_id,
                question_id=r.question_id,
                capability_id=r.capability_id,
                pillar_id=r.pillar_id,
                gap=r.gap,
                capability_status=r.capability_status,
                recommended_action=r.recommended_action,
                recommended_learning=r.recommended_learning,
                potential_service=r.potential_service,
                priority=r.priority,
            )
        )

    db.commit()
    db.refresh(assessment)

    return SubmitAssessmentResponse(
        assessment_id=assessment.id,
        ffmi_score=assessment.ffmi_score,
        tier=assessment.tier,
        tier_classification=result.tier_classification,
        pillar_scores=result.pillar_scores,
        capability_status=result.capability_status,
        strongest_pillar_id=strongest_pillar,
        priority_gap_pillar_id=priority_gap_pillar,
        recommendations=recs,
    )


@router.get("/{assessment_id}")
def get_assessment(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> dict:
    """Read-only view of an assessment, including its score and recommendations."""
    assessment = (
        db.query(Assessment)
        .options(
            selectinload(Assessment.answers),
            selectinload(Assessment.recommendations),
        )
        .filter(Assessment.id == assessment_id)
        .one_or_none()
    )
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    return {
        "assessment_id": str(assessment.id),
        "farm_id": str(assessment.farm_id),
        "type": assessment.type,
        "status": assessment.status,
        "started_at": assessment.started_at.isoformat(),
        "submitted_at": assessment.submitted_at.isoformat() if assessment.submitted_at else None,
        "ffmi_score": assessment.ffmi_score,
        "tier": assessment.tier,
        "pillar_scores": assessment.pillar_scores,
        "capability_status": assessment.capability_status,
        "rule_version_id": assessment.rule_version_id,
        "answers": [
            {"question_id": a.question_id, "value": a.value} for a in assessment.answers
        ],
        "recommendations": [
            {
                "question_id": r.question_id,
                "gap": r.gap,
                "capability_status": r.capability_status,
                "recommended_action": r.recommended_action,
                "recommended_learning": r.recommended_learning,
                "potential_service": r.potential_service,
                "priority": r.priority,
            }
            for r in assessment.recommendations
        ],
    }


@router.post("/{assessment_id}/evidence", response_model=EvidenceResponse)
def submit_evidence(
    assessment_id: uuid.UUID,
    evidence_in: EvidenceIn,
    db: Session = Depends(get_db),
) -> EvidenceResponse:
    """Submit evidence for an assessment question (FFV pathway)."""
    from app.models.evidence import Evidence

    assessment = db.get(Assessment, assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    question = db.get(Question, evidence_in.question_id)
    if not question:
        raise HTTPException(status_code=400, detail="Unknown question ID")

    evidence = Evidence(
        assessment_id=assessment_id,
        question_id=evidence_in.question_id,
        evidence_class=evidence_in.evidence_class,
        type=evidence_in.type,
        file_url=evidence_in.file_url,
        gps_lat=evidence_in.gps_lat,
        gps_lng=evidence_in.gps_lng,
        verifier_notes=evidence_in.verifier_notes,
        captured_at=datetime.utcnow(),
    )
    db.add(evidence)
    assessment.type = "verified"
    db.commit()
    db.refresh(evidence)

    return EvidenceResponse(
        evidence_id=evidence.id,
        assessment_id=evidence.assessment_id,
        question_id=evidence.question_id,
        evidence_class=evidence.evidence_class,
        type=evidence.type,
        file_url=evidence.file_url,
    )


@router.post("/{assessment_id}/verify")
def verify_assessment(
    assessment_id: uuid.UUID,
    verify_in: VerifyAssessmentIn,
    db: Session = Depends(get_db),
) -> dict:
    """Verifier review workflow endpoint."""
    assessment = db.get(Assessment, assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    assessment.status = verify_in.status
    db.commit()
    return {
        "assessment_id": str(assessment_id),
        "status": assessment.status,
        "notes": verify_in.verifier_notes,
    }


@router.get("/{assessment_id}/narrative", response_model=NarrativeReportResponse)
def get_assessment_narrative(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> NarrativeReportResponse:
    """Get executive narrative report summary for an assessment using Anthropic Claude."""
    from app.llm.client import llm_client

    assessment = (
        db.query(Assessment)
        .options(selectinload(Assessment.recommendations))
        .filter(Assessment.id == assessment_id)
        .one_or_none()
    )
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    if assessment.status != "submitted" or assessment.ffmi_score is None:
        raise HTTPException(
            status_code=400,
            detail="Assessment must be submitted before narrative can be generated",
        )

    # Build payload for LLM (strictly narrative, no score mutation)
    payload = {
        "assessment_id": str(assessment.id),
        "ffmi_score": assessment.ffmi_score,
        "tier": assessment.tier,
        "tier_classification": _tier_name(assessment.tier),
        "pillar_scores": assessment.pillar_scores,
        "recommendation_count": len(assessment.recommendations),
    }

    narrative = llm_client.generate_narrative(payload)
    is_fallback = "Your farm is currently classified" in narrative

    return NarrativeReportResponse(
        assessment_id=assessment.id,
        narrative=narrative,
        is_fallback=is_fallback,
    )


def _tier_name(tier: int | None) -> str:
    names = {
        1: "Informal Farm",
        2: "Emerging Agribusiness",
        3: "Structured Farm",
        4: "Investment Ready Farm",
        5: "Future Ready Farm",
    }
    return names.get(tier or 1, "Informal Farm")

