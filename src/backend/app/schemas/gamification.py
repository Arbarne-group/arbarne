"""Gamification Pydantic schemas — User XP, levels, badges, quests, and leaderboards."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class BadgeOut(BaseModel):
    id: Optional[UUID] = None
    badge_key: str
    tier: str = "bronze"  # bronze, silver, gold
    title: str
    description: str
    icon: str
    unlocked_at: Optional[datetime] = None
    is_unlocked: bool = False
    progress_fraction: float = Field(0.0, ge=0.0, le=1.0)
    category: str = "Pillar"


class QuestOut(BaseModel):
    id: str
    quest_key: str
    title: str
    description: str
    category: str
    xp_reward: int
    target_count: int = 1
    current_count: int = 0
    is_completed: bool = False
    is_claimed: bool = False
    action_type: str  # e.g., "assessment", "learning", "service", "simulation"
    action_target: Optional[str] = None
    icon: str = "🎯"


class LeaderboardEntryOut(BaseModel):
    rank: int
    farmer_name: str
    farm_name: str
    region: str
    tier: int
    tier_name: str
    ffmi_score: float
    total_xp: int
    level: int
    level_name: str
    weekly_xp_delta: int = 0
    is_current_user: bool = False
    badge_count: int = 0


class LeaderboardResponse(BaseModel):
    region: str
    total_participants: int
    top_entries: List[LeaderboardEntryOut]
    current_user_entry: Optional[LeaderboardEntryOut] = None


class GamificationStatusOut(BaseModel):
    total_xp: int
    level: int
    level_name: str
    current_level_min_xp: int
    next_level_xp: int
    level_progress_fraction: float = Field(0.0, ge=0.0, le=1.0)
    streak_days: int
    last_activity_date: datetime
    badges: List[BadgeOut]
    active_quests: List[QuestOut]
    unlocked_badges_count: int
    total_badges_count: int


class ClaimQuestIn(BaseModel):
    quest_id: str


class ClaimQuestOut(BaseModel):
    quest_id: str
    xp_awarded: int
    new_total_xp: int
    new_level: int
    new_level_name: str
    level_up: bool = False


class RecordActionIn(BaseModel):
    action_type: str  # "answer_question", "complete_assessment", "complete_course", "request_service", "run_simulation"
    details: Optional[Dict[str, Any]] = None


class RecordActionOut(BaseModel):
    action_type: str
    xp_earned: int
    total_xp: int
    level: int
    level_name: str
    level_up: bool = False
    newly_unlocked_badges: List[BadgeOut] = Field(default_factory=list)
    streak_days: int
