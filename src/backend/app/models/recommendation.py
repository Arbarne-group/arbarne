"""Recommendation table — Personalised Farm Transformation Plan rows."""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text, Uuid as UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.assessment import Assessment
    from app.models.framework import Capability, Pillar, Question


class Recommendation(Base):
    """One per gap surfaced in an assessment.

    The 5-field per-gap output mandated by the FFF source:
    Gap / Capability status / Recommended action / Recommended learning /
    Potential service. The LLM may rephrase but never reorder or omit.
    """

    __tablename__ = "recommendations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False
    )
    question_id: Mapped[str | None] = mapped_column(
        ForeignKey("questions.id", ondelete="SET NULL"), nullable=True
    )
    capability_id: Mapped[str | None] = mapped_column(
        ForeignKey("capabilities.id", ondelete="SET NULL"), nullable=True
    )
    pillar_id: Mapped[int | None] = mapped_column(
        ForeignKey("pillars.id", ondelete="SET NULL"), nullable=True
    )

    gap: Mapped[str] = mapped_column(Text, nullable=False)
    capability_status: Mapped[str] = mapped_column(String(20), nullable=False)
    recommended_action: Mapped[str] = mapped_column(Text, nullable=False)
    recommended_learning: Mapped[str] = mapped_column(Text, nullable=False)
    potential_service: Mapped[str] = mapped_column(Text, nullable=False)
    priority: Mapped[str] = mapped_column(String(20), nullable=False)

    assessment: Mapped["Assessment"] = relationship(back_populates="recommendations")
    question: Mapped["Question | None"] = relationship()
    capability: Mapped["Capability | None"] = relationship()
    pillar: Mapped["Pillar | None"] = relationship()
