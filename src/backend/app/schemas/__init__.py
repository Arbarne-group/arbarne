"""Pydantic schemas — request/response models for the API."""

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
    SectionReportResponse,
    StartAssessmentResponse,
    SubmitAssessmentResponse,
)
from app.schemas.auth import (
    AuthResponse,
    LoginIn,
    RegisterIn,
    RequestOtpIn,
    UpdateProfileIn,
    UserProfileOut,
)
from app.schemas.framework import (
    CapabilityOut,
    PillarOut,
    QuestionOut,
)
from app.schemas.portal import (
    DashboardSummaryOut,
    LearningModuleOut,
    LearningProgressIn,
    LearningProgressOut,
    ServiceItemOut,
    ServiceRequestIn,
    ServiceRequestOut,
)

__all__ = [
    "AllSectionsReportResponse",
    "AnswerIn",
    "AssessmentComparisonResponse",
    "AssessmentHistoryItem",
    "AuthResponse",
    "CapabilityAnalysisItem",
    "CapabilityOut",
    "DashboardSummaryOut",
    "EvidenceIn",
    "EvidenceResponse",
    "FarmCreate",
    "LearningModuleOut",
    "LearningProgressIn",
    "LearningProgressOut",
    "LoginIn",
    "NarrativeReportResponse",
    "PillarOut",
    "QuestionOut",
    "RegisterIn",
    "RequestOtpIn",
    "SectionReportResponse",
    "ServiceItemOut",
    "ServiceRequestIn",
    "ServiceRequestOut",
    "StartAssessmentResponse",
    "SubmitAssessmentResponse",
    "UpdateProfileIn",
    "UserProfileOut",
]
