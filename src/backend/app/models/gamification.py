"""Gamification database models — User XP, level, activity streaks, quests, and earned badges."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text, Uuid as UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.assessment import Farm
    from app.models.user import User


class UserGamification(Base):
    """Tracks a farmer's gamification profile, XP, level, active streak, and completed quests."""

    __tablename__ = "user_gamification"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=True
    )
    farm_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("farms.id", ondelete="CASCADE"), nullable=True
    )
    total_xp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    level: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    level_name: Mapped[str] = mapped_column(
        String(64), default="Seedling Farmer", nullable=False
    )
    streak_days: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    last_activity_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    completed_quest_ids: Mapped[list[str]] = mapped_column(
        JSON, default=list, nullable=False
    )
    claimed_quest_ids: Mapped[list[str]] = mapped_column(
        JSON, default=list, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user: Mapped["User | None"] = relationship()
    farm: Mapped["Farm | None"] = relationship()
    badges: Mapped[List["UserBadge"]] = relationship(
        back_populates="gamification", cascade="all, delete-orphan"
    )


class UserBadge(Base):
    """An individual agricultural badge unlocked by a farmer."""

    __tablename__ = "user_badges"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    gamification_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user_gamification.id", ondelete="CASCADE"), nullable=False
    )
    badge_key: Mapped[str] = mapped_column(String(64), nullable=False)  # e.g., "soil_guardian"
    tier: Mapped[str] = mapped_column(String(32), default="bronze")  # bronze, silver, gold
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    icon: Mapped[str] = mapped_column(String(32), default="🏅")
    unlocked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    gamification: Mapped[UserGamification] = relationship(back_populates="badges")
