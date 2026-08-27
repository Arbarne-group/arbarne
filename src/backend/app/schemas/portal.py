"""Services & Learning Portal Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ServiceItemOut(BaseModel):
    id: UUID
    title: str
    provider: str
    category: str
    description: str
    pillar_id: Optional[int] = None
    capability_id: Optional[str] = None
    cost_model: str
    estimated_impact: str
    contact_phone: Optional[str] = None
    icon: str
    is_recommended: bool = False


class ServiceRequestIn(BaseModel):
    service_id: UUID
    assessment_id: Optional[UUID] = None
    notes: Optional[str] = None


class ServiceRequestOut(BaseModel):
    id: UUID
    service_id: UUID
    service_title: str
    category: str
    provider: str
    status: str
    requested_at: datetime
    delivered_at: Optional[datetime] = None
    notes: Optional[str] = None


class LearningModuleOut(BaseModel):
    id: UUID
    title: str
    summary: str
    pillar_id: Optional[int] = None
    capability_id: Optional[str] = None
    duration_minutes: int
    level: str
    format_type: str
    key_takeaways: Optional[str] = None
    icon: str
    is_recommended: bool = False
    status: str = "not_started"  # "not_started", "enrolled", "completed"


class LearningProgressIn(BaseModel):
    module_id: UUID
    status: str = Field("completed", description="enrolled | in_progress | completed")


class LearningProgressOut(BaseModel):
    id: UUID
    module_id: UUID
    module_title: str
    status: str
    enrolled_at: datetime
    completed_at: Optional[datetime] = None


class DashboardSummaryOut(BaseModel):
    farmer_name: str
    farm_name: str
    region: str
    latest_assessment_id: Optional[UUID] = None
    ffmi_score: Optional[float] = None
    tier: Optional[int] = None
    tier_name: Optional[str] = None
    strongest_pillar: Optional[str] = None
    priority_gap: Optional[str] = None
    has_gaps: bool = False
    gaps_count: int = 0
    recommended_services_count: int = 0
    recommended_courses_count: int = 0
    completed_courses_count: int = 0
    delivered_services_count: int = 0
    total_assessments_count: int = 0
