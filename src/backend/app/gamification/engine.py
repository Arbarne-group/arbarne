"""Gamification Engine â€” Deterministic XP math, Level progression, Badges evaluator, Quests, and Leaderboards."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from sqlalchemy.orm import Session

from app.models.assessment import Assessment, Farm
from app.models.gamification import UserBadge, UserGamification
from app.models.portal import LearningProgress, ServiceRequest
from app.models.user import User
from app.schemas.gamification import BadgeOut, LeaderboardEntryOut, LeaderboardResponse, QuestOut

# â”€â”€â”€ Capability Status Progress Mapping â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Maps the 6-level capability status string to a 0.0â€“1.0 progress fraction.
# This enables granular badge progress tracking beyond the pillar score average.
_CAPABILITY_STATUS_PROGRESS: dict[str, float] = {
    "non_existent": 0.0,
    "emerging": 0.2,
    "basic": 0.4,
    "developing": 0.6,
    "established": 0.8,
    "advanced": 1.0,
}

# â”€â”€â”€ Level Definitions & Thresholds â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€�# ─── XP Awards ────────────────────────────────────────────────────────
XP_REWARDS = {
    "answer_question": 5,
    "complete_assessment_full": 250,
    "complete_assessment_pillar": 60,
    "complete_course": 50,
    "request_service": 30,
    "deliver_service": 75,
    "run_simulation": 15,
    "tier_advance": 150,
    "streak_activity": 20,
}

# ─── Master Badges Catalogue ─────────────────────────────────────────
MASTER_BADGES = [
    {
        "key": "soil_guardian",
        "title": "Soil Alchemist",
        "category": "Pillar 1",
        "tier": "gold",
        "icon": "🧪",
        "description": "Achieve high soil health baseline and practice proactive soil testing & composting.",
    },
    {
        "key": "water_steward",
        "title": "Water Guardian",
        "category": "Pillar 2",
        "tier": "gold",
        "icon": "💧",
        "description": "Establish water harvesting, rainwater storage, and efficient irrigation practices.",
    },
    {
        "key": "biodiversity_hero",
        "title": "Biodiversity Champion",
        "category": "Pillar 3",
        "tier": "silver",
        "icon": "🌱",
        "description": "Diversify crop varieties, adopt biological pest management, and plant ecological borders.",
    },
    {
        "key": "mechanization_pioneer",
        "title": "Mechanization Pioneer",
        "category": "Pillar 4",
        "tier": "silver",
        "icon": "🚜",
        "description": "Deploy solar or efficient mechanization to optimize field labor and post-harvest drying.",
    },
    {
        "key": "market_master",
        "title": "Commercial Leader",
        "category": "Pillar 5",
        "tier": "gold",
        "icon": "💳",
        "description": "Maintain digitized gross-margin records and establish structured buyer contracts.",
    },
    {
        "key": "safety_shield",
        "title": "Safety & Labour Shield",
        "category": "Pillar 6",
        "tier": "bronze",
        "icon": "🛡️",
        "description": "Enforce fair farm labor practices, first aid readiness, and worker PPE compliance.",
    },
    {
        "key": "circular_champion",
        "title": "Circularity Champion",
        "category": "Pillar 7",
        "tier": "silver",
        "icon": "♻️",
        "description": "Recycle 80%+ crop residues and eliminate on-farm open burning of agricultural biomass.",
    },
    {
        "key": "governance_pro",
        "title": "Governance & Audit Pro",
        "category": "Pillar 8",
        "tier": "gold",
        "icon": "📈",
        "description": "Conduct routine farm baseline audits and maintain transparent continuous digital logs.",
    },
    {
        "key": "assessment_veteran",
        "title": "Transformation Climber",
        "category": "Milestone",
        "tier": "silver",
        "icon": "🚀",
        "description": "Complete 3 or more farm maturity assessments to track verified capability evolution.",
    },
    {
        "key": "quick_learner",
        "title": "Agro-Knowledge Scholar",
        "category": "Learning",
        "tier": "bronze",
        "icon": "📚",
        "description": "Successfully complete 3 or more practical training courses in the Learning Portal.",
    },
    {
        "key": "service_implementer",
        "title": "Input & Service Adopter",
        "category": "Services",
        "tier": "silver",
        "icon": "🛠️",
        "description": "Request and implement vetted agro-services to close farm capability bottlenecks.",
    },
    {
        "key": "future_ready_100k",
        "title": "100k Future Farms Hero",
        "category": "Mastery",
        "tier": "gold",
        "icon": "🌟",
        "description": "Advance to Tier 3+ (Commercializing / Established) contributing to the 100k regional vision.",
    },
]


# XP thresholds → (level, min_xp, next_level_min_xp, level_name)
LEVEL_THRESHOLDS: list[tuple[int, int, int, str]] = [
    (1, 0, 200, "Seedling Pioneer"),
    (2, 200, 500, "Green Sprout"),
    (3, 500, 1000, "Resilient Steward"),
    (4, 1000, 2000, "Agro Vanguard"),
    (5, 2000, 5000, "Commercial Champion"),
    (6, 5000, 10000, "Lighthouse Luminary"),
]


def calculate_level(total_xp: int) -> tuple[int, str, int, int, float]:
    """Given total XP, computes (level, level_name, current_level_min_xp, next_level_xp, progress_fraction)."""
    current_lvl = 1
    lvl_name = "Seedling Farmer"
    min_xp = 0
    max_xp = 200

    for lvl, min_x, max_x, name in LEVEL_THRESHOLDS:
        if total_xp >= min_x:
            current_lvl = lvl
            lvl_name = name
            min_xp = min_x
            max_xp = max_x

    if total_xp >= 4000:
        return 7, "Agribusiness Master", 4000, 4000, 1.0

    span = max(1, max_xp - min_xp)
    progress = max(0.0, min(1.0, (total_xp - min_xp) / span))
    return current_lvl, lvl_name, min_xp, max_xp, round(progress, 3)


def get_or_create_gamification(db: Session, user: User | None) -> UserGamification:
    """Retrieve or initialize a farmer's gamification state."""
    if not user:
        # Ephemeral in-memory guest profile
        g = UserGamification(
            total_xp=620,
            level=3,
            level_name="Resilient Steward",
            streak_days=3,
            last_activity_date=datetime.now(UTC),
            completed_quest_ids=["quest_soil_baseline"],
            claimed_quest_ids=[],
        )
        return g


    g = db.query(UserGamification).filter(UserGamification.user_id == user.id).first()
    if not g:
        farm = db.query(Farm).filter(Farm.user_id == user.id).first()
        g = UserGamification(
            user_id=user.id,
            farm_id=farm.id if farm else None,
            total_xp=350,
            level=2,
            level_name="Emerging Cultivator",
            streak_days=1,
            completed_quest_ids=[],
            claimed_quest_ids=[],
        )
        db.add(g)
        db.commit()
        db.refresh(g)

    # Check and update streak
    now = datetime.now(UTC)
    if g.last_activity_date:
        diff_days = (now.date() - g.last_activity_date.date()).days
        if diff_days == 1:
            g.streak_days += 1
            g.last_activity_date = now
            db.commit()
        elif diff_days > 1:
            g.streak_days = 1
            g.last_activity_date = now
            db.commit()

    return g


def award_xp_for_action(
    db: Session,
    user: User | None,
    action_type: str,
    custom_xp: int | None = None,
    metadata: dict[str, Any] | None = None,
) -> tuple[int, int, str, bool, list[BadgeOut]]:
    """Awards XP to the user, updates their level, evaluates badges, and returns stats."""
    xp_to_add = custom_xp if custom_xp is not None else XP_REWARDS.get(action_type, 10)
    g = get_or_create_gamification(db, user)

    prev_lvl = g.level
    g.total_xp += xp_to_add
    new_lvl, new_name, _, _, _ = calculate_level(g.total_xp)
    g.level = new_lvl
    g.level_name = new_name
    g.last_activity_date = datetime.now(UTC)

    level_up = new_lvl > prev_lvl

    if user:
        db.commit()
        db.refresh(g)

    # Evaluate any unlocked badges
    unlocked_badges = evaluate_badges(db, user, g)
    return xp_to_add, g.total_xp, g.level_name, level_up, unlocked_badges


def evaluate_badges(
    db: Session, user: User | None, gamification: UserGamification
) -> list[BadgeOut]:
    """Check requirements across assessments, courses, services, and XP to unlock new badges."""
    if not user:
        # For guest/demo mode, return a curated subset
        badges_out = []
        for b in MASTER_BADGES:
            is_unlocked = b["key"] in ("soil_guardian", "quick_learner", "future_ready_100k")
            badges_out.append(
                BadgeOut(
                    badge_key=b["key"],
                    tier=b["tier"],
                    title=b["title"],
                    description=b["description"],
                    icon=b["icon"],
                    is_unlocked=is_unlocked,
                    progress_fraction=1.0 if is_unlocked else 0.45,
                    category=b["category"],
                    unlocked_at=datetime.now(UTC) if is_unlocked else None,
                )
            )
        return badges_out

    # Gather user activity stats from DB
    existing_unlocked_keys = {
        ub.badge_key
        for ub in db.query(UserBadge).filter(UserBadge.gamification_id == gamification.id).all()
    }

    assessments = (
        db.query(Assessment)
        .join(Farm, Assessment.farm_id == Farm.id)
        .filter(Farm.user_id == user.id, Assessment.status == "submitted")
        .all()
    )
    latest_assessment = assessments[-1] if assessments else None
    assessment_count = len(assessments)

    completed_courses = (
        db.query(LearningProgress)
        .filter(LearningProgress.user_id == user.id, LearningProgress.status == "completed")
        .count()
    )

    delivered_services = (
        db.query(ServiceRequest)
        .filter(ServiceRequest.user_id == user.id, ServiceRequest.status == "delivered")
        .count()
    )
    requested_services = (
    db.query(ServiceRequest).filter(ServiceRequest.user_id == user.id).count()
)

    capability_status: dict[str, str] = {}
    if latest_assessment and latest_assessment.capability_status:
        capability_status = latest_assessment.capability_status

    # Map a capability status string to a 0.0â€“1.0 progress fraction.
    def _cap_progress(status: str) -> float:
        return _CAPABILITY_STATUS_PROGRESS.get(status, 0.0)

    # Pre-compute per-capability progress for each pillar from the latest assessment.
    # Pillar 1 â†’ P1.1..P1.5, Pillar 2 â†’ P2.1..P2.5, etc.
    pillar_cap_progress: dict[int, float] = {}
    for p_id in range(1, 9):
        caps_progress = [
            _cap_progress(capability_status.get(f"P{p_id}.{c}", "non_existent"))
            for c in range(1, 6)
        ]
        pillar_cap_progress[p_id] = sum(caps_progress) / 5.0 if caps_progress else 0.0

    newly_unlocked = []

    for b in MASTER_BADGES:
        key = b["key"]
        is_already_unlocked = key in existing_unlocked_keys
        progress = 0.0
        should_unlock = False

        if key == "soil_guardian":
            progress = pillar_cap_progress.get(1, 0.0)
            should_unlock = progress > 0.0 or assessment_count >= 1
        elif key == "water_steward":
            progress = pillar_cap_progress.get(2, 0.0)
            should_unlock = progress > 0.0
        elif key == "biodiversity_hero":
            progress = pillar_cap_progress.get(3, 0.0)
            should_unlock = progress > 0.0
        elif key == "mechanization_pioneer":
            progress = pillar_cap_progress.get(4, 0.0)
            should_unlock = progress > 0.0 or delivered_services >= 1
        elif key == "market_master":
            progress = pillar_cap_progress.get(5, 0.0)
            should_unlock = progress > 0.0
        elif key == "safety_shield":
            progress = pillar_cap_progress.get(6, 0.0)
            should_unlock = progress > 0.0
        elif key == "circular_champion":
            progress = pillar_cap_progress.get(7, 0.0)
            should_unlock = progress > 0.0
        elif key == "governance_pro":
            progress = pillar_cap_progress.get(8, 0.0)
            should_unlock = progress > 0.0
        elif key == "assessment_veteran":
            progress = min(1.0, assessment_count / 3.0)
            should_unlock = assessment_count >= 3
        elif key == "quick_learner":
            progress = min(1.0, completed_courses / 3.0)
            should_unlock = completed_courses >= 3
        elif key == "service_implementer":
            progress = min(1.0, (requested_services + delivered_services) / 2.0)
            should_unlock = (requested_services + delivered_services) >= 2
        elif key == "future_ready_100k":
            tier = latest_assessment.tier if latest_assessment else 1
            progress = min(1.0, tier / 3.0)
            should_unlock = tier >= 3

        if is_already_unlocked:
            progress = 1.0
        elif should_unlock:
            progress = 1.0
            # Persist new badge
            ub = UserBadge(
                gamification_id=gamification.id,
                badge_key=key,
                tier=b["tier"],
                title=b["title"],
                description=b["description"],
                icon=b["icon"],
                unlocked_at=datetime.now(UTC),
            )
            db.add(ub)
            newly_unlocked.append(
                BadgeOut(
                    id=ub.id,
                    badge_key=key,
                    tier=b["tier"],
                    title=b["title"],
                    description=b["description"],
                    icon=b["icon"],
                    is_unlocked=True,
                    progress_fraction=1.0,
                    category=b["category"],
                    unlocked_at=ub.unlocked_at,
                )
            )

    if newly_unlocked:
        db.commit()

    # Query full badges list with unlock state
    all_unlocked = {
        ub.badge_key: ub
        for ub in db.query(UserBadge).filter(UserBadge.gamification_id == gamification.id).all()
    }
    results = []
    for b in MASTER_BADGES:
        key = b["key"]
        ub = all_unlocked.get(key)
        results.append(
            BadgeOut(
                id=ub.id if ub else None,
                badge_key=key,
                tier=b["tier"],
                title=b["title"],
                description=b["description"],
                icon=b["icon"],
                is_unlocked=ub is not None,
                progress_fraction=1.0 if ub is not None else 0.4,
                category=b["category"],
                unlocked_at=ub.unlocked_at if ub else None,
            )
        )

    return results


def generate_quests(
    db: Session, user: User | None, gamification: UserGamification
) -> list[QuestOut]:
    """Generate 4 dynamic, actionable agricultural transformation quests tailored to farmer gaps."""
    completed = set(gamification.completed_quest_ids or [])
    claimed = set(gamification.claimed_quest_ids or [])

    # Default Quests
    quests = [
        QuestOut(
            id="quest_soil_baseline",
            quest_key="soil_baseline",
            title="Evaluate Smart Farming & Digital Readiness",
            description="Take a Single-Pillar assessment or full audit to diagnose technology & data management baseline.",
            category="Assessment",
            xp_reward=60,
            target_count=1,
            current_count=1 if "quest_soil_baseline" in completed else 0,
            is_completed="quest_soil_baseline" in completed,
            is_claimed="quest_soil_baseline" in claimed,
            action_type="assessment",
            action_target="pillar-1",
            icon="📱",
        ),
        QuestOut(
            id="quest_water_service",
            quest_key="water_service",
            title="Explore Water Stewardship Services",
            description="Browse solar drip irrigation and rainwater harvesting providers in the Services Portal.",
            category="Services",
            xp_reward=40,
            target_count=1,
            current_count=1 if "quest_water_service" in completed else 0,
            is_completed="quest_water_service" in completed,
            is_claimed="quest_water_service" in claimed,
            action_type="service",
            action_target="recommended",
            icon="ðŸ’§",
        ),
        QuestOut(
            id="quest_learn_ipm",
            quest_key="learn_ipm",
            title="Master Biological Pest Management",
            description="Complete the Integrated Pest Management (IPM) audio/interactive course module.",
            category="Learning",
            xp_reward=50,
            target_count=1,
            current_count=1 if "quest_learn_ipm" in completed else 0,
            is_completed="quest_learn_ipm" in completed,
            is_claimed="quest_learn_ipm" in claimed,
            action_type="learning",
            action_target="recommended",
            icon="ðŸŒ±",
        ),
        QuestOut(
            id="quest_sim_leap",
            quest_key="sim_leap",
            title="Simulate Next Tier Roadmap",
            description="Adjust pillar maturity sliders in the Scenario Simulator to plan your Tier advancement.",
            category="Simulation",
            xp_reward=25,
            target_count=1,
            current_count=1 if "quest_sim_leap" in completed else 0,
            is_completed="quest_sim_leap" in completed,
            is_claimed="quest_sim_leap" in claimed,
            action_type="simulation",
            action_target="simulator",
            icon="ðŸ”®",
        ),
    ]

    return quests


def generate_leaderboard(
    db: Session, user: User | None, region: str | None = None
) -> LeaderboardResponse:
    """Rank real farmers across all regions by their progress.

    Every farmer with a farm profile is ranked using genuine data: their FFMI
    maturity score (computed on the fly from their assessment answers via the
    platform's own deterministic scorer) and their gamification XP. The optional
    ``region`` filter narrows the cohort (exact match or containment, so
    "Uganda" also matches "Kampala, Uganda"); ``None``/"All Regions" ranks every
    farmer regardless of location - supporting the wider East African programme.
    """
    from sqlalchemy import or_
    from sqlalchemy.orm import selectinload
    from app.scoring.engine import score_assessment, DEFAULT_FFMI_BANDS
    from app.models.framework import Capability, Question
    from app.models.assessment import Answer, Assessment

    TIER_NAMES = {
        1: "Informal Farm",
        2: "Emerging Agribusiness",
        3: "Structured Farm",
        4: "Investment Ready Farm",
        5: "Future Ready Farm",
    }

    scoped = bool(region and str(region).strip() not in ("", "All Regions"))

    # Global capability layout (identical for every assessment).
    capabilities_by_pillar: dict = {}
    caps = (
        db.query(Capability)
        .options(selectinload(Capability.questions))
        .order_by(Capability.pillar_id, Capability.number)
        .all()
    )
    for c in caps:
        capabilities_by_pillar.setdefault(c.pillar_id, []).append(
            (c.id, [q.id for q in c.questions])
        )

    q = db.query(Farm).join(User, Farm.user_id == User.id)
    if scoped:
        safe = str(region).replace("%", "").replace("_", "")
        q = q.filter(or_(Farm.region == region, Farm.region.ilike(f"%{safe}%")))
    farms = q.all()

    entries: list[LeaderboardEntryOut] = []
    for farm in farms:
        farmer = farm.user
        if not farmer:
            continue

        # Best available FFMI for this farm (stored first, else computed).
        ffmi = None
        tier = None
        a = (
            db.query(Assessment)
            .filter(Assessment.farm_id == farm.id)
            .order_by(
                Assessment.ffmi_score.desc().nullslast(),
                Assessment.submitted_at.desc().nullslast(),
            )
            .first()
        )
        if a is not None:
            ffmi = a.ffmi_score
            tier = a.tier
            if ffmi is None and a.answers:
                try:
                    answers = {ans.question_id: ans.value for ans in a.answers}
                    if a.scope == "pillar" and a.target_pillar_id:
                        cap_map = {
                            a.target_pillar_id: capabilities_by_pillar.get(
                                a.target_pillar_id, []
                            )
                        }
                    else:
                        cap_map = capabilities_by_pillar
                    res = score_assessment(answers, cap_map, DEFAULT_FFMI_BANDS)
                    ffmi = res.ffmi_score
                    tier = res.tier
                except Exception:
                    ffmi = None

        gp = (
            db.query(UserGamification)
            .filter(UserGamification.user_id == farmer.id)
            .first()
        )
        badge_count = len(gp.badges) if gp and gp.badges else 0
        tier = tier or 1

        # Privacy: only reveal the full name of the requesting farmer. For
        # everyone else, expose just the first name to limit PII disclosure.
        is_self = bool(user and farmer.id == user.id)
        if is_self:
            farmer_display = farmer.name or "Farmer"
        else:
            farmer_display = (farmer.name or "Farmer").split(" ")[0]

        entries.append(
            LeaderboardEntryOut(
                rank=0,
                farmer_name=farmer_display,
                farm_name=farm.name or "My Farm",
                region=farm.region or "Unknown",
                tier=tier,
                tier_name=TIER_NAMES.get(tier, "Informal Farm"),
                ffmi_score=float(ffmi or 0.0),
                total_xp=gp.total_xp if gp else 0,
                level=gp.level if gp else 1,
                level_name=gp.level_name if gp else "Seedling Farmer",
                weekly_xp_delta=0,
                is_current_user=bool(user and farmer.id == user.id),
                badge_count=badge_count,
            )
        )

    # Rank by XP (engagement) then FFMI (maturity).
    entries.sort(key=lambda e: (e.total_xp, e.ffmi_score), reverse=True)
    for i, e in enumerate(entries, start=1):
        e.rank = i

    current_entry = next((e for e in entries if e.is_current_user), None)

    return LeaderboardResponse(
        region=region if scoped else "All Regions",
        total_participants=len(entries),
        top_entries=entries,
        current_user_entry=current_entry,
    )
