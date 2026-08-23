"""Assessment API — start, answer, submit, score, report."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.core.auth import get_optional_user
from app.db.session import get_db
from app.models.assessment import Answer, Assessment, Farm
from app.models.framework import Capability, Pillar, Question, RuleVersion
from app.models.recommendation import Recommendation
from app.models.user import User
from app.recommendations.engine import build_recommendations, strongest_and_priority_pillars
from app.scoring.engine import DEFAULT_FFMI_BANDS, score_assessment
from app.schemas.assessment import (
    AllSectionsReportResponse,
    AnswerIn,
    AssessmentComparisonResponse,
    AssessmentHistoryItem,
    CapabilityAnalysisItem,
    EvidenceIn,
    EvidenceResponse,
    FarmCreate,
    NarrativeReportResponse,
    SectionChartData,
    SectionReportResponse,
    StartAssessmentResponse,
    SubmitAssessmentResponse,
    VerifyAssessmentIn,
)

router = APIRouter(prefix="/api/assessments", tags=["assessments"])


@router.post("/start", response_model=StartAssessmentResponse)
def start_assessment(
    farm: FarmCreate,
    current_user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> StartAssessmentResponse:
    """Start a new assessment for a farm. Supports Path A (pillar) and Path B (full)."""
    user_id = current_user.id if current_user else None
    new_farm = None
    if user_id:
        new_farm = db.query(Farm).filter(Farm.user_id == user_id).first()

    if not new_farm:
        new_farm = Farm(
            user_id=user_id,
            name=farm.name,
            region=farm.region or "Western Kenya",
            crop_type=farm.crop_type or "Mixed Crop & Livestock",
            size_acres=farm.size_acres or 5.0,
        )
        db.add(new_farm)
        db.flush()
    else:
        if farm.name:
            new_farm.name = farm.name
        if farm.region:
            new_farm.region = farm.region
        if farm.crop_type:
            new_farm.crop_type = farm.crop_type
        if farm.size_acres:
            new_farm.size_acres = farm.size_acres

    scope = farm.scope if farm.scope in ("full", "pillar") else "full"
    target_pillar_id = farm.target_pillar_id if scope == "pillar" else None
    q_count = 25 if scope == "pillar" else 200

    assessment = Assessment(
        farm_id=new_farm.id,
        assessor_id=user_id,
        type="self",
        scope=scope,
        target_pillar_id=target_pillar_id,
        reassessment_of_id=farm.reassessment_of_id,
        status="draft",
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return StartAssessmentResponse(
        assessment_id=assessment.id,
        farm_id=new_farm.id,
        status=assessment.status,
        scope=assessment.scope,
        target_pillar_id=assessment.target_pillar_id,
        question_count=q_count,
    )


@router.get("/history", response_model=list[AssessmentHistoryItem])
def list_assessment_history(
    current_user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> list[AssessmentHistoryItem]:
    """Retrieve historical assessment timeline and scores."""
    query = db.query(Assessment).options(selectinload(Assessment.target_pillar))
    if current_user:
        query = query.join(Farm, Assessment.farm_id == Farm.id).filter(Farm.user_id == current_user.id)

    assessments = query.order_by(Assessment.started_at.desc()).all()
    history = []
    for a in assessments:
        tier_name = None
        if a.tier:
            for b in DEFAULT_FFMI_BANDS:
                if b["tier"] == a.tier:
                    tier_name = b["classification"]
                    break
        history.append(
            AssessmentHistoryItem(
                id=a.id,
                started_at=a.started_at.strftime("%d %b %Y, %H:%M") if a.started_at else "",
                submitted_at=a.submitted_at.strftime("%d %b %Y, %H:%M") if a.submitted_at else None,
                status=a.status,
                scope=a.scope or "full",
                target_pillar_id=a.target_pillar_id,
                target_pillar_name=a.target_pillar.name if a.target_pillar else None,
                ffmi_score=a.ffmi_score,
                tier=a.tier,
                tier_classification=tier_name,
                pillar_scores={str(k): float(v) for k, v in (a.pillar_scores or {}).items()},
            )
        )
    return history


@router.get("/compare", response_model=AssessmentComparisonResponse)
def compare_assessments(
    baseline_id: uuid.UUID,
    current_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> AssessmentComparisonResponse:
    """Compare baseline assessment with a follow-up assessment."""
    baseline = db.get(Assessment, baseline_id)
    current = db.get(Assessment, current_id)
    if not baseline or not current:
        raise HTTPException(status_code=404, detail="One or both assessments not found")

    base_ffmi = baseline.ffmi_score or 0.0
    curr_ffmi = current.ffmi_score or 0.0
    delta_ffmi = round(curr_ffmi - base_ffmi, 2)
    tier_adv = (current.tier or 1) > (baseline.tier or 1)

    pillar_deltas = {}
    for p_id in range(1, 9):
        p_str = str(p_id)
        b_score = float((baseline.pillar_scores or {}).get(p_str, 0.0))
        c_score = float((current.pillar_scores or {}).get(p_str, 0.0))
        pillar_deltas[p_str] = {
            "baseline": round(b_score, 2),
            "current": round(c_score, 2),
            "delta": round(c_score - b_score, 2),
            "delta_pct": round((c_score - b_score) * 100, 1),
        }

    status_ranks = {"non_existent": 0, "emerging": 1, "basic": 2, "developing": 3, "established": 4, "advanced": 5}
    improved = []
    new_gaps = []
    for cap_id, curr_stat in (current.capability_status or {}).items():
        base_stat = (baseline.capability_status or {}).get(cap_id, "non_existent")
        if status_ranks.get(curr_stat, 0) > status_ranks.get(base_stat, 0):
            improved.append(f"{cap_id}: {base_stat.replace('_', ' ').title()} ➔ {curr_stat.replace('_', ' ').title()}")
        elif status_ranks.get(curr_stat, 0) < status_ranks.get(base_stat, 0):
            new_gaps.append(f"{cap_id}: {curr_stat.replace('_', ' ').title()}")

    summary = (
        f"Farm progressed from FFMI {base_ffmi:.2f} (Tier {baseline.tier or 1}) to {curr_ffmi:.2f} (Tier {current.tier or 1}), "
        f"a net change of {delta_ffmi:+.2f} points with {len(improved)} improved capabilities."
    )

    return AssessmentComparisonResponse(
        baseline_id=baseline.id,
        current_id=current.id,
        baseline_date=baseline.submitted_at.strftime("%d %b %Y") if baseline.submitted_at else "Baseline",
        current_date=current.submitted_at.strftime("%d %b %Y") if current.submitted_at else "Follow-up",
        baseline_ffmi=baseline.ffmi_score,
        current_ffmi=current.ffmi_score,
        ffmi_delta=delta_ffmi,
        baseline_tier=baseline.tier,
        current_tier=current.tier,
        tier_advanced=tier_adv,
        pillar_deltas=pillar_deltas,
        improved_capabilities=improved,
        new_gaps_identified=new_gaps,
        summary_text=summary,
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
        # Run Data Quality Guardrail Validation
        from app.ml.validation import validate_survey_payload
        valid, errs = validate_survey_payload({a.question_id: a.value})
        if not valid:
            raise HTTPException(status_code=422, detail=f"Data validation failed: {'; '.join(errs)}")
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
            existing.answered_at = datetime.now(timezone.utc)
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
    caps_query = db.query(Capability).options(selectinload(Capability.questions))
    if assessment.scope == "pillar" and assessment.target_pillar_id:
        caps_query = caps_query.filter(Capability.pillar_id == assessment.target_pillar_id)
    caps = caps_query.order_by(Capability.pillar_id, Capability.number).all()

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
    assessment.submitted_at = datetime.now(timezone.utc)

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
        captured_at=datetime.now(timezone.utc),
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


@router.get("/{assessment_id}/pdf")
def get_assessment_pdf(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    """Generate and download the official PDF Farm Transformation Report."""
    from fastapi.responses import Response
    from app.models.assessment import Farm
    from app.reporting.pdf import generate_transformation_pdf

    assessment = (
        db.query(Assessment)
        .options(selectinload(Assessment.recommendations))
        .filter(Assessment.id == assessment_id)
        .one_or_none()
    )
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    farm = db.query(Farm).filter(Farm.id == assessment.farm_id).one_or_none() if assessment.farm_id else None

    # Determine risk label
    ffmi = assessment.ffmi_score or 0.0
    if ffmi < 5.0:
        trajectory_risk = "🔴 High Risk"
    elif ffmi < 16.0:
        trajectory_risk = "🟡 Medium Risk"
    else:
        trajectory_risk = "🟢 Low Risk"

    recs_data = [
        {
            "priority": r.priority,
            "gap": r.gap,
            "recommended_action": r.recommended_action,
            "recommended_learning": r.recommended_learning,
            "potential_service": r.potential_service,
        }
        for r in assessment.recommendations
    ]

    pdf_bytes = generate_transformation_pdf(
        assessment_id=str(assessment.id),
        farm_name=farm.name if farm else "Independent Smallholder",
        region=farm.region if farm else "Eastern Africa",
        crop_type=farm.crop_type if farm else "Mixed Farming",
        farm_size=5.0,
        ffmi_score=ffmi,
        tier=assessment.tier or 1,
        tier_classification=_tier_name(assessment.tier),
        pillar_scores=assessment.pillar_scores or {},
        recommendations=recs_data,
        trajectory_risk=trajectory_risk,
        assessed_at=assessment.submitted_at or assessment.started_at,
    )

    filename = f"fff_transformation_report_{str(assessment_id)[:8]}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
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


PILLAR_DEFAULTS = {
    1: ("Smart Farming and Digital Transformation", "Use technology and data to farm smarter.", "Is the farm using appropriate technology and information to make better decisions?"),
    2: ("Productive Use of Renewable Energy", "Turn energy from an operating cost into a productive asset.", "How can energy be used to create greater productive and economic value on the farm?"),
    3: ("Food Safety and Compliance", "Produce food that is safe, traceable, quality-assured and compliant.", "Can the farm consistently demonstrate that its products are safe, traceable and compliant with its target markets?"),
    4: ("Indigenous Knowledge and Climate Resilience", "Build resilience by combining local knowledge, science and innovation.", "Is the farm capable of anticipating, adapting to and recovering from climate and environmental risks?"),
    5: ("Farm Business Performance and Growth", "Build farms that are financially viable, sustainable and capable of growth.", "Is the farm performing as a viable business and creating the foundation for sustainable growth?"),
    6: ("Human Capital, Leadership and Farm Operations", "Build the people, leadership and systems required to operate a professional farm business.", "Does the farm have the people, leadership and operating systems required to run effectively beyond the individual farmer?"),
    7: ("Market Access, Customer Value and Competitiveness", "Build the farm around customers and markets, not production alone.", "Does the farm understand its customers and compete effectively in the markets it serves?"),
    8: ("Investment Readiness and Enterprise Development", "Build farms that can attract, manage and grow capital responsibly.", "Can the farm demonstrate that it is a credible, investable and well-managed enterprise?"),
}

CAPABILITY_DEFAULTS = {
    "P1.1": "Technology Readiness", "P1.2": "Digital Capability", "P1.3": "Farm Information & Data Management", "P1.4": "Data-Driven Decision Making", "P1.5": "Continuous Improvement & Innovation",
    "P2.1": "Energy Assessment & Audit", "P2.2": "Solar & Renewable Adoption", "P2.3": "Productive Energy Applications", "P2.4": "Energy Efficiency & Storage", "P2.5": "Sustainable Energy Management",
    "P3.1": "Good Agricultural Practices (GAP)", "P3.2": "Traceability & Record Keeping", "P3.3": "Chemical & Input Safety", "P3.4": "Post-Harvest Hygiene & Quality Control", "P3.5": "Regulatory & Standards Compliance",
    "P4.1": "Traditional & Indigenous Knowledge Integration", "P4.2": "Climate Risk Identification & Planning", "P4.3": "Soil & Water Conservation", "P4.4": "Biodiversity & Ecosystem Health", "P4.5": "Adaptive Farming & Climate Smart Practices",
    "P5.1": "Farm Financial Record Keeping", "P5.2": "Cost Control & Profitability Analysis", "P5.3": "Enterprise Planning & Budgeting", "P5.4": "Business Diversification", "P5.5": "Strategic Growth & Investment Scaling",
    "P6.1": "Leadership & Governance Structure", "P6.2": "Workforce Skill & Development", "P6.3": "Standard Operating Procedures (SOPs)", "P6.4": "Worker Health, Safety & Welfare", "P6.5": "Operations & Succession Management",
    "P7.1": "Market Intelligence & Customer Needs", "P7.2": "Demand-Driven Production & Quality", "P7.3": "Buyer Relationships & Contract Farming", "P7.4": "Product Differentiation & Value Addition", "P7.5": "Cross-Border & Regional Trade Readiness",
    "P8.1": "Financial Transparency & Governance", "P8.2": "Investment & Business Planning", "P8.3": "Asset Register & Valuation", "P8.4": "Capital Structure & Investor Pitching", "P8.5": "Risk Management & Institutional Governance",
}


def _build_section_analysis(assessment: Assessment, pillar_id: int, db: Session) -> SectionReportResponse:
    """Compute detailed capability breakdown, scores, chart data, and recommendations for a section."""
    if pillar_id < 1 or pillar_id > 8:
        raise HTTPException(status_code=400, detail="Invalid pillar ID. Must be between 1 and 8.")

    # Pillar Metadata
    pillar_obj = db.get(Pillar, pillar_id)
    if pillar_obj:
        p_name = pillar_obj.name
        p_principle = pillar_obj.principle or PILLAR_DEFAULTS[pillar_id][1]
        p_question = pillar_obj.guiding_question or PILLAR_DEFAULTS[pillar_id][2]
    else:
        p_name, p_principle, p_question = PILLAR_DEFAULTS[pillar_id]

    answers_map = {a.question_id: a.value for a in assessment.answers}
    cap_status_map = assessment.capability_status or {}

    status_level_map = {
        "non_existent": 0, "emerging": 1, "basic": 2,
        "developing": 3, "established": 4, "advanced": 5
    }

    # Build 5 capabilities analysis
    capabilities_items: list[CapabilityAnalysisItem] = []
    labels: list[str] = []
    scores: list[float] = []
    peer_benchmarks: list[float] = []

    # Peer benchmarks based on regional transition averages
    regional_benchmarks = [0.45, 0.40, 0.50, 0.42, 0.38]

    for c_num in range(1, 6):
        cap_id = f"P{pillar_id}.{c_num}"
        cap_obj = db.get(Capability, cap_id)
        cap_name = cap_obj.name if cap_obj else CAPABILITY_DEFAULTS.get(cap_id, f"Capability {c_num}")

        # Compute Yes count from answers
        q_ids = [f"{cap_id}.{q}" for q in range(1, 6)]
        yes_count = sum(1 for q in q_ids if answers_map.get(q) == "yes")

        # Status
        status = cap_status_map.get(cap_id)
        if not status:
            from app.scoring.engine import capability_status_from_yes_count
            status = capability_status_from_yes_count(yes_count)

        status_lvl = status_level_map.get(status, 0)
        frac = status_lvl / 5.0

        capabilities_items.append(
            CapabilityAnalysisItem(
                capability_id=cap_id,
                capability_name=cap_name,
                capability_number=c_num,
                status=status,
                status_level=status_lvl,
                score_fraction=round(frac, 4),
                yes_count=yes_count,
                total_questions=5,
            )
        )
        labels.append(cap_name)
        scores.append(round(frac, 4))
        peer_benchmarks.append(regional_benchmarks[c_num - 1])

    # Section overall score
    p_score_raw = (assessment.pillar_scores or {}).get(str(pillar_id), (assessment.pillar_scores or {}).get(pillar_id))
    if p_score_raw is not None:
        section_score = float(p_score_raw)
    else:
        section_score = sum(scores) / len(scores) if scores else 0.0

    section_score_pct = round(section_score * 100, 1)
    section_points = round(section_score * 3.0, 2)

    # Status band for section
    if section_score_pct >= 80:
        status_band = "Advanced (Level 5/5)"
    elif section_score_pct >= 60:
        status_band = "Established (Level 4/5)"
    elif section_score_pct >= 40:
        status_band = "Developing (Level 3/5)"
    elif section_score_pct >= 20:
        status_band = "Emerging (Level 2/5)"
    else:
        status_band = "Non-Existent (Level 0-1/5)"

    # Identify strongest and priority gap capability
    sorted_caps = sorted(capabilities_items, key=lambda c: c.score_fraction, reverse=True)
    strongest_cap = {
        "id": sorted_caps[0].capability_id,
        "name": sorted_caps[0].capability_name,
        "score_pct": round(sorted_caps[0].score_fraction * 100, 1),
        "status": sorted_caps[0].status,
    }
    priority_gap_cap = {
        "id": sorted_caps[-1].capability_id,
        "name": sorted_caps[-1].capability_name,
        "score_pct": round(sorted_caps[-1].score_fraction * 100, 1),
        "status": sorted_caps[-1].status,
    }

    # Section Recommendations
    recs = [
        {
            "question_id": r.question_id,
            "gap": r.gap,
            "priority": r.priority,
            "recommended_action": r.recommended_action,
            "recommended_learning": r.recommended_learning,
            "potential_service": r.potential_service,
        }
        for r in assessment.recommendations
        if getattr(r, "question_id", "").startswith(f"P{pillar_id}.")
    ]

    # Section narrative diagnostic
    section_narrative = (
        f"In Section {pillar_id} ({p_name}), the farm scored {section_score_pct}% ({status_band}), "
        f"contributing {section_points:.2f} of 3.00 available points toward overall FFMI maturity. "
        f"The strongest area is '{strongest_cap['name']}' ({strongest_cap['score_pct']}%), while the principal "
        f"transformation opportunity lies in addressing capability gaps in '{priority_gap_cap['name']}' ({priority_gap_cap['score_pct']}%)."
    )

    return SectionReportResponse(
        assessment_id=assessment.id,
        pillar_id=pillar_id,
        pillar_name=p_name,
        pillar_principle=p_principle,
        pillar_guiding_question=p_question,
        section_score=round(section_score, 4),
        section_score_pct=section_score_pct,
        section_points=section_points,
        status_band=status_band,
        capabilities=capabilities_items,
        chart_data=SectionChartData(labels=labels, scores=scores, peer_benchmark=peer_benchmarks),
        strongest_capability=strongest_cap,
        priority_gap_capability=priority_gap_cap,
        recommendations=recs,
        section_narrative=section_narrative,
    )


@router.get("/{assessment_id}/sections/{pillar_id}", response_model=SectionReportResponse)
def get_assessment_section_report(
    assessment_id: uuid.UUID,
    pillar_id: int,
    db: Session = Depends(get_db),
) -> SectionReportResponse:
    """Generate detailed diagnostic report and chart analysis for an individual assessment section."""
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

    return _build_section_analysis(assessment, pillar_id, db)


@router.get("/{assessment_id}/sections", response_model=AllSectionsReportResponse)
def get_all_assessment_sections_report(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> AllSectionsReportResponse:
    """Generate diagnostic reports and chart analysis across all 8 assessment sections."""
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

    sections = [_build_section_analysis(assessment, pid, db) for pid in range(1, 9)]

    return AllSectionsReportResponse(
        assessment_id=assessment.id,
        ffmi_score=assessment.ffmi_score or 0.0,
        tier=assessment.tier or 1,
        tier_classification=_tier_name(assessment.tier),
        sections=sections,
    )


@router.get("/{assessment_id}/sections/{pillar_id}/pdf")
def get_assessment_section_pdf(
    assessment_id: uuid.UUID,
    pillar_id: int,
    db: Session = Depends(get_db),
):
    """Generate and download the official 1-page Section Diagnostic PDF Report."""
    from fastapi.responses import Response
    from app.models.assessment import Farm
    from app.reporting.pdf import generate_section_pdf

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

    farm = db.query(Farm).filter(Farm.id == assessment.farm_id).one_or_none() if assessment.farm_id else None
    section_data = _build_section_analysis(assessment, pillar_id, db)

    caps_data = [
        {
            "capability_id": c.capability_id,
            "capability_name": c.capability_name,
            "score_fraction": c.score_fraction,
            "status": c.status,
            "status_level": c.status_level,
            "yes_count": c.yes_count,
            "total_questions": c.total_questions,
        }
        for c in section_data.capabilities
    ]

    pdf_bytes = generate_section_pdf(
        assessment_id=str(assessment.id),
        farm_name=farm.name if farm else "Independent Smallholder",
        region=farm.region if farm else "Eastern Africa",
        crop_type=farm.crop_type if farm else "Mixed Farming",
        farm_size=5.0,
        pillar_id=pillar_id,
        pillar_name=section_data.pillar_name,
        pillar_principle=section_data.pillar_principle,
        pillar_guiding_question=section_data.pillar_guiding_question,
        section_score=section_data.section_score,
        section_points=section_data.section_points,
        status_band=section_data.status_band,
        capabilities=caps_data,
        recommendations=section_data.recommendations,
        assessed_at=assessment.submitted_at or assessment.started_at,
    )

    filename = f"fff_section_{pillar_id}_report_{str(assessment_id)[:8]}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )



