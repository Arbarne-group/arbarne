"""Services Portal & Learning Portal API endpoints."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.core.auth import get_optional_user
from app.db.session import get_db
from app.models.assessment import Assessment, Farm
from app.models.portal import (
    LearningModule,
    LearningProgress,
    ServiceItem,
    ServiceRequest,
)
from app.models.recommendation import Recommendation
from app.models.user import User
from app.schemas.portal import (
    DashboardSummaryOut,
    LearningModuleOut,
    LearningProgressIn,
    LearningProgressOut,
    ServiceItemOut,
    ServiceRequestIn,
    ServiceRequestOut,
)

router = APIRouter(prefix="/portal", tags=["portal"])


@router.get("/services", response_model=List[ServiceItemOut])
def list_services(
    pillar_id: Optional[int] = None,
    recommended_only: bool = False,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> List[ServiceItemOut]:
    """Retrieve services catalogue with gap-based recommendation tags."""
    # Find gaps from user's latest assessment
    user_gaps = set()
    if current_user:
        latest_assessment = (
            db.query(Assessment)
            .join(Farm, Assessment.farm_id == Farm.id)
            .filter(Farm.user_id == current_user.id, Assessment.status == "submitted")
            .order_by(Assessment.submitted_at.desc())
            .first()
        )
        if latest_assessment:
            recs = db.query(Recommendation).filter(Recommendation.assessment_id == latest_assessment.id).all()
            for r in recs:
                if r.capability_id:
                    user_gaps.add(r.capability_id)
                if r.pillar_id:
                    user_gaps.add(f"P{r.pillar_id}")

    query = db.query(ServiceItem)
    if pillar_id is not None:
        query = query.filter(ServiceItem.pillar_id == pillar_id)

    services = query.order_by(ServiceItem.title).all()
    results = []
    for s in services:
        is_rec = False
        if s.capability_id and s.capability_id in user_gaps:
            is_rec = True
        elif s.pillar_id and f"P{s.pillar_id}" in user_gaps:
            is_rec = True

        if recommended_only and not is_rec:
            continue

        results.append(
            ServiceItemOut(
                id=s.id,
                title=s.title,
                provider=s.provider,
                category=s.category,
                description=s.description,
                pillar_id=s.pillar_id,
                capability_id=s.capability_id,
                cost_model=s.cost_model,
                estimated_impact=s.estimated_impact,
                contact_phone=s.contact_phone,
                icon=s.icon,
                is_recommended=is_rec,
            )
        )
    return results


@router.post("/services/request", response_model=ServiceRequestOut, status_code=status.HTTP_201_CREATED)
def request_service(
    payload: ServiceRequestIn,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> ServiceRequestOut:
    """Farmer requests an agro-service from the catalogue."""
    service = db.get(ServiceItem, payload.service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service item not found")

    farm = None
    if current_user:
        farm = db.query(Farm).filter(Farm.user_id == current_user.id).first()

    req = ServiceRequest(
        service_id=service.id,
        user_id=current_user.id if current_user else None,
        farm_id=farm.id if farm else None,
        assessment_id=payload.assessment_id,
        status="requested",
        notes=payload.notes,
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    return ServiceRequestOut(
        id=req.id,
        service_id=service.id,
        service_title=service.title,
        category=service.category,
        provider=service.provider,
        status=req.status,
        requested_at=req.requested_at,
        delivered_at=req.delivered_at,
        notes=req.notes,
    )


@router.post("/services/{request_id}/deliver", response_model=ServiceRequestOut)
def deliver_service(
    request_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> ServiceRequestOut:
    """Mark a requested service as delivered, recording capability improvement."""
    req = db.query(ServiceRequest).options(selectinload(ServiceRequest.service)).filter(ServiceRequest.id == request_id).one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Service request not found")

    req.status = "delivered"
    req.delivered_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(req)

    return ServiceRequestOut(
        id=req.id,
        service_id=req.service.id,
        service_title=req.service.title,
        category=req.service.category,
        provider=req.service.provider,
        status=req.status,
        requested_at=req.requested_at,
        delivered_at=req.delivered_at,
        notes=req.notes,
    )


@router.get("/learning", response_model=List[LearningModuleOut])
def list_learning_modules(
    pillar_id: Optional[int] = None,
    recommended_only: bool = False,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> List[LearningModuleOut]:
    """Retrieve educational learning modules with gap-based recommendation tags and completion statuses."""
    user_gaps = set()
    user_progress: dict[uuid.UUID, str] = {}

    if current_user:
        latest_assessment = (
            db.query(Assessment)
            .join(Farm, Assessment.farm_id == Farm.id)
            .filter(Farm.user_id == current_user.id, Assessment.status == "submitted")
            .order_by(Assessment.submitted_at.desc())
            .first()
        )
        if latest_assessment:
            recs = db.query(Recommendation).filter(Recommendation.assessment_id == latest_assessment.id).all()
            for r in recs:
                if r.capability_id:
                    user_gaps.add(r.capability_id)
                if r.pillar_id:
                    user_gaps.add(f"P{r.pillar_id}")

        records = db.query(LearningProgress).filter(LearningProgress.user_id == current_user.id).all()
        for rec in records:
            user_progress[rec.module_id] = rec.status

    query = db.query(LearningModule)
    if pillar_id is not None:
        query = query.filter(LearningModule.pillar_id == pillar_id)

    modules = query.order_by(LearningModule.title).all()
    results = []
    for m in modules:
        is_rec = False
        if m.capability_id and m.capability_id in user_gaps:
            is_rec = True
        elif m.pillar_id and f"P{m.pillar_id}" in user_gaps:
            is_rec = True

        if recommended_only and not is_rec:
            continue

        mod_status = user_progress.get(m.id, "not_started")
        results.append(
            LearningModuleOut(
                id=m.id,
                title=m.title,
                summary=m.summary,
                pillar_id=m.pillar_id,
                capability_id=m.capability_id,
                duration_minutes=m.duration_minutes,
                level=m.level,
                format_type=m.format_type,
                key_takeaways=m.key_takeaways,
                icon=m.icon,
                is_recommended=is_rec,
                status=mod_status,
            )
        )
    return results


@router.post("/learning/{module_id}/complete", response_model=LearningProgressOut)
def complete_learning_module(
    module_id: uuid.UUID,
    payload: Optional[LearningProgressIn] = None,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> LearningProgressOut:
    """Mark an educational learning module as completed."""
    module = db.get(LearningModule, module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Learning module not found")

    user_id = current_user.id if current_user else None
    farm = db.query(Farm).filter(Farm.user_id == user_id).first() if user_id else None

    progress = (
        db.query(LearningProgress)
        .filter(LearningProgress.module_id == module_id, LearningProgress.user_id == user_id)
        .first()
    )
    if not progress:
        progress = LearningProgress(
            module_id=module_id,
            user_id=user_id,
            farm_id=farm.id if farm else None,
            status="completed",
            completed_at=datetime.now(timezone.utc),
        )
        db.add(progress)
    else:
        progress.status = payload.status if payload else "completed"
        if progress.status == "completed":
            progress.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(progress)

    return LearningProgressOut(
        id=progress.id,
        module_id=module.id,
        module_title=module.title,
        status=progress.status,
        enrolled_at=progress.enrolled_at,
        completed_at=progress.completed_at,
    )


@router.get("/dashboard-summary", response_model=DashboardSummaryOut)
def get_dashboard_summary(
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> DashboardSummaryOut:
    """Aggregates farmer profile, latest assessment FFMI, tier, strengths vs gaps count, and portal statistics."""
    farmer_name = current_user.name if current_user and current_user.name else "Farmer"
    farm = db.query(Farm).filter(Farm.user_id == current_user.id).first() if current_user else None
    farm_name = farm.name if farm and farm.name else "My Demonstration Farm"
    region = farm.region if farm and farm.region else "Western Kenya"

    latest_assessment_query = db.query(Assessment).filter(Assessment.status == "submitted")
    if farm:
        latest_assessment_query = latest_assessment_query.filter(Assessment.farm_id == farm.id)
    latest_assessment = latest_assessment_query.order_by(Assessment.submitted_at.desc()).first()

    total_assessments = (
        db.query(Assessment)
        .filter(Assessment.farm_id == farm.id)
        .count() if farm else db.query(Assessment).count()
    )

    ffmi_score = latest_assessment.ffmi_score if latest_assessment else None
    tier = latest_assessment.tier if latest_assessment else None
    tier_name = None
    strongest_pillar = None
    priority_gap = None
    gaps_count = 0

    if latest_assessment:
        from app.recommendations.engine import strongest_and_priority_pillars
        p_scores = {int(k): float(v) for k, v in (latest_assessment.pillar_scores or {}).items()}
        s_id, p_id = strongest_and_priority_pillars(p_scores)
        if s_id:
            from app.models.framework import Pillar
            s_p = db.get(Pillar, s_id)
            strongest_pillar = s_p.name if s_p else f"Pillar {s_id}"
        if p_id:
            from app.models.framework import Pillar
            p_p = db.get(Pillar, p_id)
            priority_gap = p_p.name if p_p else f"Pillar {p_id}"

        gaps_count = db.query(Recommendation).filter(Recommendation.assessment_id == latest_assessment.id).count()

        from app.scoring.engine import DEFAULT_FFMI_BANDS
        if tier:
            for b in DEFAULT_FFMI_BANDS:
                if b["tier"] == tier:
                    tier_name = b["classification"]
                    break

    delivered_services = (
        db.query(ServiceRequest)
        .filter(ServiceRequest.user_id == current_user.id, ServiceRequest.status == "delivered")
        .count() if current_user else 0
    )
    completed_courses = (
        db.query(LearningProgress)
        .filter(LearningProgress.user_id == current_user.id, LearningProgress.status == "completed")
        .count() if current_user else 0
    )

    return DashboardSummaryOut(
        farmer_name=farmer_name,
        farm_name=farm_name,
        region=region,
        latest_assessment_id=latest_assessment.id if latest_assessment else None,
        ffmi_score=ffmi_score,
        tier=tier,
        tier_name=tier_name,
        strongest_pillar=strongest_pillar,
        priority_gap=priority_gap,
        has_gaps=gaps_count > 0,
        gaps_count=gaps_count,
        recommended_services_count=min(gaps_count, 6),
        recommended_courses_count=min(gaps_count, 8),
        completed_courses_count=completed_courses,
        delivered_services_count=delivered_services,
        total_assessments_count=total_assessments,
    )
