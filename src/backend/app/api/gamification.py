"""Gamification API endpoints — Status, Badges, Quests, Claims, Actions, and Leaderboards."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_optional_user
from app.db.session import get_db
from app.gamification.engine import (
    award_xp_for_action,
    calculate_level,
    evaluate_badges,
    generate_leaderboard,
    generate_quests,
    get_or_create_gamification,
)
from app.models.user import User
from app.schemas.gamification import (
    ClaimQuestIn,
    ClaimQuestOut,
    GamificationStatusOut,
    LeaderboardResponse,
    RecordActionIn,
    RecordActionOut,
)

router = APIRouter(prefix="/portal/gamification", tags=["gamification"])


@router.get("", response_model=GamificationStatusOut)
def get_gamification_status(
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> GamificationStatusOut:
    """Retrieve the farmer's gamification profile, XP, level, badges, and active quests."""
    g = get_or_create_gamification(db, current_user)
    level, level_name, min_xp, next_xp, progress = calculate_level(g.total_xp)
    badges = evaluate_badges(db, current_user, g)
    quests = generate_quests(db, current_user, g)
    unlocked_count = sum(1 for b in badges if b.is_unlocked)

    return GamificationStatusOut(
        total_xp=g.total_xp,
        level=level,
        level_name=level_name,
        current_level_min_xp=min_xp,
        next_level_xp=next_xp,
        level_progress_fraction=progress,
        streak_days=g.streak_days,
        last_activity_date=g.last_activity_date,
        badges=badges,
        active_quests=quests,
        unlocked_badges_count=unlocked_count,
        total_badges_count=len(badges),
    )


@router.post("/claim-quest", response_model=ClaimQuestOut)
def claim_quest_reward(
    payload: ClaimQuestIn,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> ClaimQuestOut:
    """Claim XP reward for a completed agricultural transformation quest."""
    g = get_or_create_gamification(db, current_user)
    quests = generate_quests(db, current_user, g)

    target_quest = next((q for q in quests if q.id == payload.quest_id), None)
    if not target_quest:
        raise HTTPException(status_code=404, detail="Quest not found")

    claimed_set = set(g.claimed_quest_ids or [])
    if payload.quest_id in claimed_set:
        raise HTTPException(status_code=400, detail="Quest reward already claimed")

    # Mark completed and claimed
    completed_set = set(g.completed_quest_ids or [])
    completed_set.add(payload.quest_id)
    claimed_set.add(payload.quest_id)
    g.completed_quest_ids = list(completed_set)
    g.claimed_quest_ids = list(claimed_set)

    prev_lvl = g.level
    g.total_xp += target_quest.xp_reward
    new_lvl, new_name, _, _, _ = calculate_level(g.total_xp)
    g.level = new_lvl
    g.level_name = new_name

    if current_user:
        db.commit()
        db.refresh(g)

    return ClaimQuestOut(
        quest_id=payload.quest_id,
        xp_awarded=target_quest.xp_reward,
        new_total_xp=g.total_xp,
        new_level=new_lvl,
        new_level_name=new_name,
        level_up=new_lvl > prev_lvl,
    )


@router.get("/leaderboard", response_model=LeaderboardResponse)
def get_leaderboard(
    region: Optional[str] = None,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> LeaderboardResponse:
    """Retrieve the regional smallholder agribusiness leaderboard."""
    return generate_leaderboard(db, current_user, region=region)


@router.post("/action", response_model=RecordActionOut)
def record_gamification_action(
    payload: RecordActionIn,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> RecordActionOut:
    """Record a platform action (answering questions, completing modules, etc.) and award XP."""
    xp, total, name, level_up, new_badges = award_xp_for_action(
        db, current_user, payload.action_type, metadata=payload.details
    )
    g = get_or_create_gamification(db, current_user)

    return RecordActionOut(
        action_type=payload.action_type,
        xp_earned=xp,
        total_xp=total,
        level=g.level,
        level_name=name,
        level_up=level_up,
        newly_unlocked_badges=[b for b in new_badges if b.is_unlocked],
        streak_days=g.streak_days,
    )
