"""Pydantic schemas for the assessment API."""

from __future__ import annotations

import uuid
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.recommendations.engine import Recommendation
from app.schemas.framework import QuestionOut


class FarmCreate(BaseModel):
    """Request payload: create a farm and start an assessment."""

    name: str | None = None
    region: str | None = "Western Kenya"
    crop_type: str | None = "Mixed Crop & Livestock"
    size_acres: float | None = 5.0
    scope: str = Field("full", description="'full' for 8 pillars or 'pillar' for single pillar")
    target_pillar_id: int | None = Field(None, description="1..8 if scope is 'pillar'")
    reassessment_of_id: uuid.UUID | None = Field(None, description="Parent assessment ID if reassessment")


class StartAssessmentResponse(BaseModel):
    """Response: a freshly started assessment."""

    assessment_id: uuid.UUID
    farm_id: uuid.UUID
    status: str
    scope: str = "full"
    target_pillar_id: int | None = None
    question_count: int = 200
    questions: list[QuestionOut] = Field(default_factory=list)


class AssessmentHistoryItem(BaseModel):
    """A summary item in the farm's historical assessment timeline."""

    id: uuid.UUID
    started_at: str
    submitted_at: str | None
    status: str
    scope: str
    target_pillar_id: int | None = None
    target_pillar_name: str | None = None
    ffmi_score: float | None = None
    tier: int | None = None
    tier_classification: str | None = None
    pillar_scores: dict[str, float] = Field(default_factory=dict)


class AssessmentComparisonResponse(BaseModel):
    """Detailed longitudinal comparison between a baseline and a follow-up assessment."""

    baseline_id: uuid.UUID
    current_id: uuid.UUID
    baseline_date: str
    current_date: str
    baseline_ffmi: float | None
    current_ffmi: float | None
    ffmi_delta: float
    baseline_tier: int | None
    current_tier: int | None
    tier_advanced: bool
    pillar_deltas: dict[str, dict[str, float]]
    improved_capabilities: list[str]
    new_gaps_identified: list[str]
    summary_text: str


class AnswerIn(BaseModel):
    """One Yes/No answer."""

    question_id: str = Field(..., description="Stable ID, e.g. P1.3.1")
    value: Literal["yes", "no"]


class RecommendationOut(BaseModel):
    """Per-gap transformation recommendation surfaced for a "No" answer.

    Content is read verbatim from the question row (the FFF 5-field model):
    Gap / Capability status / Recommended action / Recommended learning /
    Potential service.
    """

    question_id: str | None = None
    pillar_id: int | None = None
    capability_id: str | None = None
    capability_status: str | None = None
    gap: str = ""
    pillar_name: str = ""
    capability_name: str = ""
    recommended_action: str
    recommended_learning: str
    potential_service: str
    priority: str
    why_it_matters: str | None = None


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
    recommendations: list[RecommendationOut] = Field(default_factory=list)
    capability_feedback: dict[str, str] = Field(default_factory=dict)
    capability_names: dict[str, str] = Field(default_factory=dict)
    pillar_status: dict[int, str] = Field(default_factory=dict)


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


class CapabilityAnalysisItem(BaseModel):
    """Detailed status and score for a single capability within a section."""

    capability_id: str
    capability_name: str
    capability_number: int
    status: str
    status_level: int
    score_fraction: float
    yes_count: int
    total_questions: int = 5
    feedback: str | None = None


class SectionChartData(BaseModel):
    """Chart dataset for plotting capability distributions and peer benchmarks."""

    labels: list[str]
    scores: list[float]
    peer_benchmark: list[float]


class SectionReportResponse(BaseModel):
    """Diagnostic report and chart analysis for an individual assessment section (Pillar)."""

    assessment_id: uuid.UUID
    pillar_id: int
    pillar_name: str
    pillar_principle: str
    pillar_guiding_question: str
    section_score: float
    section_score_pct: float
    section_points: float
    status_band: str
    capabilities: list[CapabilityAnalysisItem]
    chart_data: SectionChartData
    strongest_capability: dict[str, str | float] | None = None
    priority_gap_capability: dict[str, str | float] | None = None
    recommendations: list[dict[str, str]] = Field(default_factory=list)
    section_narrative: str


class AllSectionsReportResponse(BaseModel):
    """Diagnostic report and chart analysis across all 8 assessment sections."""

    assessment_id: uuid.UUID
    ffmi_score: float
    tier: int
    tier_classification: str
    sections: list[SectionReportResponse]


class DiagnosisPillarReport(BaseModel):
    """Structured, personalised diagnosis for a single pillar."""

    pillar_id: int
    pillar_name: str
    status_level: str
    pillar_score: float
    strengths: list[str] = Field(default_factory=list)
    key_gaps: list[str] = Field(default_factory=list)
    root_causes: list[str] = Field(default_factory=list)
    personalised_recommendations: list[dict] = Field(default_factory=list)
    coaching_approach: str = ""
    aspiration_alignment: str = ""


class DiagnosisOverallReport(BaseModel):
    """Holistic, cross-pillar diagnosis."""

    executive_summary: str = ""
    transformation_trajectory: str = ""
    holistic_strengths: list[str] = Field(default_factory=list)
    priority_roadmap: list[str] = Field(default_factory=list)
    key_risks: list[str] = Field(default_factory=list)
    vision_alignment: str = ""


class DiagnosisReport(BaseModel):
    """Combined professional diagnosis (per-pillar + overall).

    Built from the assessment result AND the farmer profile. Populated by the
    LLM when available, otherwise by a deterministic fallback (``is_fallback``).
    """

    overall: DiagnosisOverallReport
    pillars: list[DiagnosisPillarReport] = Field(default_factory=list)
    is_fallback: bool = False
    generated_at: str | None = None


class DiagnosisReportResponse(BaseModel):
    """Response wrapper for the diagnosis endpoint."""

    assessment_id: uuid.UUID
    diagnosis: DiagnosisReport | None = None
    is_fallback: bool = False


