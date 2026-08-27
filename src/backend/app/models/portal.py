"""Portal models — Services Portal catalogue & requests, Learning Portal modules & progress."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text, Uuid as UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.framework import Capability, Pillar
    from app.models.user import User
    from app.models.assessment import Farm, Assessment


class ServiceItem(Base):
    """A service available in the Services Portal catalogue (inputs, mechanization, micro-finance, soil tests)."""

    __tablename__ = "services_catalogue"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    provider: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(
        String(64), nullable=False
    )  # "Soil & Nutrition", "Water & Irrigation", "Agronomy & Inputs", "Mechanization", "Finance & Credit", "Certification"
    description: Mapped[str] = mapped_column(Text, nullable=False)
    pillar_id: Mapped[int | None] = mapped_column(
        ForeignKey("pillars.id", ondelete="SET NULL"), nullable=True
    )
    capability_id: Mapped[str | None] = mapped_column(
        ForeignKey("capabilities.id", ondelete="SET NULL"), nullable=True
    )
    cost_model: Mapped[str] = mapped_column(
        String(128), default="Subsidized / Pay-per-use"
    )
    estimated_impact: Mapped[str] = mapped_column(
        String(255), default="+1 Capability Tier Advancement"
    )
    contact_phone: Mapped[str | None] = mapped_column(String(64), nullable=True)
    icon: Mapped[str] = mapped_column(String(32), default="🌱")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    pillar: Mapped["Pillar | None"] = relationship()
    capability: Mapped["Capability | None"] = relationship()
    requests: Mapped[list["ServiceRequest"]] = relationship(
        back_populates="service", cascade="all, delete-orphan"
    )


class ServiceRequest(Base):
    """Tracks a farmer's request for a specific service and its delivery lifecycle."""

    __tablename__ = "service_requests"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    service_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("services_catalogue.id", ondelete="CASCADE"), nullable=False
    )
    farm_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("farms.id", ondelete="CASCADE"), nullable=True
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=True
    )
    assessment_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("assessments.id", ondelete="SET NULL"), nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(32), default="requested"
    )  # "requested", "in_progress", "delivered", "cancelled"
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    requested_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    delivered_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    service: Mapped[ServiceItem] = relationship(back_populates="requests")
    farm: Mapped["Farm | None"] = relationship()
    user: Mapped["User | None"] = relationship()


class LearningModule(Base):
    """An educational training module / best-practice course in the Learning Portal."""

    __tablename__ = "learning_modules"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    pillar_id: Mapped[int | None] = mapped_column(
        ForeignKey("pillars.id", ondelete="SET NULL"), nullable=True
    )
    capability_id: Mapped[str | None] = mapped_column(
        ForeignKey("capabilities.id", ondelete="SET NULL"), nullable=True
    )
    duration_minutes: Mapped[int] = mapped_column(default=15)
    level: Mapped[str] = mapped_column(String(32), default="Beginner")
    format_type: Mapped[str] = mapped_column(
        String(32), default="Interactive Guide"
    )  # "Audio / Swahili", "Video", "Interactive Guide", "Field Checklist"
    key_takeaways: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str] = mapped_column(String(32), default="📖")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    pillar: Mapped["Pillar | None"] = relationship()
    capability: Mapped["Capability | None"] = relationship()
    progress_records: Mapped[list["LearningProgress"]] = relationship(
        back_populates="module", cascade="all, delete-orphan"
    )


class LearningProgress(Base):
    """Tracks a farmer's progress through a learning module."""

    __tablename__ = "learning_progress"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    module_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("learning_modules.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=True
    )
    farm_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("farms.id", ondelete="CASCADE"), nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(32), default="enrolled"
    )  # "enrolled", "in_progress", "completed"
    enrolled_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    module: Mapped[LearningModule] = relationship(back_populates="progress_records")
    user: Mapped["User | None"] = relationship()
    farm: Mapped["Farm | None"] = relationship()
