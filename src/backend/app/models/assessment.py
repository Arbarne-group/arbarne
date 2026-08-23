"""Assessment tables — farms, assessments, answers."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import JSON, DateTime, ForeignKey, String, UniqueConstraint, Uuid as UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.framework import Pillar, Question, RuleVersion
    from app.models.evidence import Evidence
    from app.models.recommendation import Recommendation
    from app.models.user import User


class Farm(Base):
    """A farm record. Connected to a farmer/user."""

    __tablename__ = "farms"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    region: Mapped[str | None] = mapped_column(String(128), nullable=True)
    crop_type: Mapped[str | None] = mapped_column(String(128), nullable=True)
    size_acres: Mapped[float | None] = mapped_column(nullable=True, default=5.0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User | None"] = relationship(back_populates="farms")
    assessments: Mapped[list["Assessment"]] = relationship(
        back_populates="farm", cascade="all, delete-orphan"
    )


class Assessment(Base):
    """A single assessment of a farm. Supports Full Assessment (Path B) and Single Pillar (Path A)."""

    __tablename__ = "assessments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    farm_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("farms.id", ondelete="CASCADE"), nullable=False
    )
    assessor_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    type: Mapped[str] = mapped_column(String(32), nullable=False, default="self")
    scope: Mapped[str] = mapped_column(
        String(32), nullable=False, default="full"
    )  # "full" (8 pillars) or "pillar" (single pillar)
    target_pillar_id: Mapped[int | None] = mapped_column(
        ForeignKey("pillars.id", ondelete="SET NULL"), nullable=True
    )
    reassessment_of_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("assessments.id", ondelete="SET NULL"), nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(32), nullable=False, default="draft"
    )  # draft / submitted / under_review / verified / needs_more_info
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    submitted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # ─── Scoring outputs (computed by the scoring engine) ──────────
    rule_version_id: Mapped[str | None] = mapped_column(
        ForeignKey("rule_versions.id", ondelete="SET NULL"), nullable=True
    )
    ffmi_score: Mapped[float | None] = mapped_column(nullable=True)
    tier: Mapped[int | None] = mapped_column(nullable=True)
    pillar_scores: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    capability_status: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)

    farm: Mapped[Farm] = relationship(back_populates="assessments")
    rule_version: Mapped["RuleVersion | None"] = relationship(back_populates="assessments")
    target_pillar: Mapped["Pillar | None"] = relationship()
    reassessment_of: Mapped["Assessment | None"] = relationship(remote_side=[id])
    answers: Mapped[list["Answer"]] = relationship(
        back_populates="assessment", cascade="all, delete-orphan"
    )
    evidence: Mapped[list["Evidence"]] = relationship(
        back_populates="assessment", cascade="all, delete-orphan"
    )
    recommendations: Mapped[list["Recommendation"]] = relationship(
        back_populates="assessment", cascade="all, delete-orphan"
    )


class Answer(Base):
    """A single Yes/No answer to a single question within an assessment."""

    __tablename__ = "answers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False
    )
    question_id: Mapped[str] = mapped_column(
        ForeignKey("questions.id", ondelete="RESTRICT"), nullable=False
    )
    value: Mapped[str] = mapped_column(String(8), nullable=False)  # 'yes' / 'no'
    answered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    assessment: Mapped[Assessment] = relationship(back_populates="answers")
    question: Mapped["Question"] = relationship(back_populates="answers")

    __table_args__ = (
        UniqueConstraint("assessment_id", "question_id", name="uq_answer_assessment_question"),
    )
