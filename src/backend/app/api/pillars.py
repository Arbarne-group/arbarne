"""Framework content API — pillars, capabilities, questions."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.framework import Capability, Pillar, Question
from app.schemas.framework import (
    CapabilityOut,
    PillarOut,
    QuestionOut,
)
from app.schemas.assessment import StartAssessmentResponse, AnswerIn, SubmitAssessmentResponse

router = APIRouter(prefix="/api", tags=["framework"])


@router.get("/pillars", response_model=list[PillarOut])
def list_pillars(db: Session = Depends(get_db)) -> list[PillarOut]:
    """GET /api/pillars — return all 8 pillars."""
    pillars = db.query(Pillar).order_by(Pillar.id).all()
    return [PillarOut.model_validate(p) for p in pillars]


@router.get("/pillars/{pillar_id}/capabilities", response_model=list[CapabilityOut])
def list_capabilities(pillar_id: int, db: Session = Depends(get_db)) -> list[CapabilityOut]:
    """GET /api/pillars/{id}/capabilities — return 5 capabilities for a pillar."""
    if not db.get(Pillar, pillar_id):
        raise HTTPException(status_code=404, detail=f"Pillar {pillar_id} not found")
    caps = (
        db.query(Capability)
        .filter(Capability.pillar_id == pillar_id)
        .order_by(Capability.number)
        .all()
    )
    return [CapabilityOut.model_validate(c) for c in caps]


@router.get("/questions", response_model=list[QuestionOut])
def list_questions(db: Session = Depends(get_db)) -> list[QuestionOut]:
    """GET /api/questions — return all 200 questions.

    Frontend caches this in IndexedDB on first load so the offline
    self-assessment works.
    """
    questions = (
        db.query(Question)
        .options(selectinload(Question.capability))
        .order_by(Question.id)
        .all()
    )
    return [QuestionOut.model_validate(q) for q in questions]
