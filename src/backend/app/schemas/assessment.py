"""Pydantic schemas for the assessment API."""

from __future__ import annotations

import uuid
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.recommendations.engine import Recommendation


class FarmCreate(BaseModel):
    """Request payload: create a farm and start an assessment."""

    name: str | None = None
    region: str | None = None
    crop_type: str | None = None


class StartAssessmentResponse(BaseModel):
    """Response: a freshly started assessment."""

    assessment_id: uuid.UUID
    farm_id: uuid.UUID
    status: str


class AnswerIn(BaseModel):
    """One Yes/No answer."""

    question_id: str = Field(..., description="Stable ID, e.g. P1.3.1")
    value: Literal["yes", "no"]


class SubmitAssessmentResponse(BaseModel):
    """The full scored assessment result.

    Skips the LLM layer. The narrative can be fetched separately via
    the report endpoint.
    """

    model_config = ConfigDict(arbitrary_types_allowed=True)

    assessment_id: uuid.UUID
    ffmi_score: float
    tier: int
    tier_classification: str
    pillar_scores: dict[int, float]
    capability_status: dict[str, str]
    strongest_pillar_id: int | None = None
    priority_gap_pillar_id: int | None = None
    recommendations: list[Recommendation] = Field(default_factory=list)


class EvidenceIn(BaseModel):
    """Payload for submitting FFV evidence."""

    question_id: str
    evidence_class: str = Field(default="A", description="A, B, C, or D per reliability ordering")
    type: str = Field(default="photo", description="photo, document, gps, or interview")
    file_url: str | None = None
    gps_lat: float | None = None
    gps_lng: float | None = None
    verifier_notes: str | None = None


class EvidenceResponse(BaseModel):
    """Response after submitting evidence."""

    evidence_id: uuid.UUID
    assessment_id: uuid.UUID
    question_id: str
    evidence_class: str
    type: str
    file_url: str | None = None


class VerifyAssessmentIn(BaseModel):
    """Request payload for verifier review workflow."""

    status: Literal["under_review", "verified", "needs_more_info"]
    verifier_notes: str | None = None


class NarrativeReportResponse(BaseModel):
    """Response containing narrative summary."""

    assessment_id: uuid.UUID
    narrative: str
    is_fallback: bool = False

