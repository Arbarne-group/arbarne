"""Pydantic schemas for framework content (pillars, capabilities, questions)."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class PillarOut(BaseModel):
    """API representation of a Pillar."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    principle: str
    seeks_to_achieve: list[str] = Field(default_factory=list)
    examples: list[str] = Field(default_factory=list)
    guiding_question: str


class CapabilityOut(BaseModel):
    """API representation of a Capability."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    pillar_id: int
    number: int
    name: str
    description: str | None = None


class QuestionOut(BaseModel):
    """API representation of a Question."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    pillar_id: int
    capability_id: str
    question_number: int
    question_text: str
    ffv_evidence_required: str | None = None
    if_no_recommendation: str | None = None
    why_it_matters: str | None = None
    quick_win: str | None = None
    support_available: list[str] = Field(default_factory=list)
    priority: str
    learning_resource_ref: str | None = None
    service_ref: str | None = None
