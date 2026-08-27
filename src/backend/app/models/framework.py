"""Framework content tables (pillars, capabilities, questions, rule versions).

These are the read-mostly seeded tables that hold the canonical FFF
content. The pilot seeds them from the source spreadsheet and the FFF
source document; downstream tables (assessments, evidence, etc.)
foreign-key into them.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import (
    JSON,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    Uuid as UUID,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import DateTime

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.assessment import Answer, Assessment
    from app.models.recommendation import Recommendation

ArrayText = JSON().with_variant(ARRAY(Text), "postgresql")


# ─── Pillars ─────────────────────────────────────────────────────────
class Pillar(Base):
    """The 8 FFF pillars (e.g. Smart Farming, Renewable Energy, ...)."""

    __tablename__ = "pillars"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    principle: Mapped[str] = mapped_column(Text, nullable=False)
    seeks_to_achieve: Mapped[list[str]] = mapped_column(ArrayText, nullable=False, default=list)
    examples: Mapped[list[str]] = mapped_column(ArrayText, nullable=False, default=list)
    guiding_question: Mapped[str] = mapped_column(Text, nullable=False)

    capabilities: Mapped[list["Capability"]] = relationship(
        back_populates="pillar",
        cascade="all, delete-orphan",
        order_by="Capability.number",
    )


# ─── Capabilities ────────────────────────────────────────────────────
class Capability(Base):
    """One capability per pillar (5 per pillar, 40 total).

    Stable ID is `P{pillar}.{capability}`, e.g. `P1.1`.
    """

    __tablename__ = "capabilities"

    id: Mapped[str] = mapped_column(String(8), primary_key=True)
    pillar_id: Mapped[int] = mapped_column(
        ForeignKey("pillars.id", ondelete="CASCADE"), nullable=False
    )
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    pillar: Mapped[Pillar] = relationship(back_populates="capabilities")
    questions: Mapped[list["Question"]] = relationship(
        back_populates="capability",
        cascade="all, delete-orphan",
        order_by="Question.question_number",
    )

    __table_args__ = (UniqueConstraint("pillar_id", "number", name="uq_capability_pillar_number"),)


# ─── Questions ───────────────────────────────────────────────────────
class Question(Base):
    """One of the 200 FFF self-assessment questions.

    Stable ID is `P{pillar}.{capability}.{question}`, e.g. `P1.3.1`.
    Farmer-facing text is **immutable** post-seed — see CLAUDE.md §6.
    """

    __tablename__ = "questions"

    id: Mapped[str] = mapped_column(String(8), primary_key=True)
    pillar_id: Mapped[int] = mapped_column(
        ForeignKey("pillars.id", ondelete="CASCADE"), nullable=False
    )
    capability_id: Mapped[str] = mapped_column(
        ForeignKey("capabilities.id", ondelete="CASCADE"), nullable=False
    )
    question_number: Mapped[int] = mapped_column(Integer, nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    ffv_evidence_required: Mapped[str | None] = mapped_column(Text, nullable=True)
    if_no_recommendation: Mapped[str | None] = mapped_column(Text, nullable=True)
    why_it_matters: Mapped[str | None] = mapped_column(Text, nullable=True)
    quick_win: Mapped[str | None] = mapped_column(Text, nullable=True)
    support_available: Mapped[list[str]] = mapped_column(
        ArrayText, nullable=False, default=list
    )
    priority: Mapped[str] = mapped_column(String(20), nullable=False)
    learning_resource_ref: Mapped[str | None] = mapped_column(String(255), nullable=True)
    service_ref: Mapped[str | None] = mapped_column(String(255), nullable=True)

    capability: Mapped[Capability] = relationship(back_populates="questions")
    answers: Mapped[list["Answer"]] = relationship(back_populates="question")

    __table_args__ = (
        UniqueConstraint(
            "capability_id", "question_number", name="uq_question_capability_number"
        ),
    )


# ─── Rule versions ───────────────────────────────────────────────────
class RuleVersion(Base):
    """A versioned snapshot of the scoring rules.

    Every assessment stores the rule_version_id that produced its score,
    so historical assessments remain reproducible against the rules in
    effect when they were taken.
    """

    __tablename__ = "rule_versions"

    id: Mapped[str] = mapped_column(String(16), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    bands: Mapped[dict] = mapped_column(JSON, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    assessments: Mapped[list["Assessment"]] = relationship(back_populates="rule_version")
