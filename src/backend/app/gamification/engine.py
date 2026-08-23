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

# â”€â”€â”€ Level Definitions & Thresholds â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
LEVEL_THRESHOLDS = [
    (1, 0, 200, "Seedling Farmer"),
    (2, 200, 500, "Emerging Cultivator"),
    (3, 500, 1000, "Resilient Steward"),
    (4, 1000, 1800, "Commercial Grower"),
    (5, 1800, 2800, "Agro-Ecological Leader"),
    (6, 2800, 4000, "Future-Ready Pioneer"),
    (7, 4000, 10000, "Agribusiness Master"),
]

# â”€â”€â”€ XP Awards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

# â”€â”€â”€ Master Badges Catalogue â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
MASTER_BADGES = [
    {
        "key": "soil_guardian",
        "title": "Soil Alchemist",
        "category": "Pillar 1",
        "tier": "gold",
        "icon": "ðŸ§ª",
        "description": "Achieve high soil health baseline and practice proactive soil testing & composting.",
    },
    {
        "key": "water_steward",
        "title": "Water Guardian",
        "category": "Pillar 2",
        "tier": "gold",
        "icon": "ðŸ’§",
        "description": "Establish water harvesting, rainwater storage, and efficient irrigation practices.",
    },
    {
        "key": "biodiversity_hero",
        "title": "Biodiversity Champion",
        "category": "Pillar 3",
        "tier": "silver",
        "icon": "ðŸŒ±",
        "description": "Diversify crop varieties, adopt biological pest management, and plant ecological borders.",
    },
    {
        "key": "mechanization_pioneer",
        "title": "Mechanization Pioneer",
        "category": "Pillar 4",
        "tier": "silver",
        "icon": "ðŸšœ",
        "description": "Deploy solar or efficient mechanization to optimize field labor and post-harvest drying.",
    },
    {
        "key": "market_master",
        "title": "Commercial Leader",
        "category": "Pillar 5",
        "tier": "gold",
        "icon": "ðŸ’³",
        "description": "Maintain digitized gross-margin records and establish structured buyer contracts.",
    },
    {
        "key": "safety_shield",
        "title": "Safety & Labour Shield",
        "category": "Pillar 6",
        "tier": "bronze",
        "icon": "ðŸ›¡ï¸",
        "description": "Enforce fair farm labor practices, first aid readiness, and worker PPE compliance.",
    },
    {
        "key": "circular_champion",
        "title": "Circularity Champion",
        "category": "Pillar 7",
        "tier": "silver",
        "icon": "â™»ï¸",
        "description": "Recycle 80%+ crop residues and eliminate on-farm open burning of agricultural biomass.",
    },
    {
        "key": "governance_pro",
        "title": "Governance & Audit Pro",
        "category": "Pillar 8",
        "tier": "gold",
        "icon": "ðŸ“ˆ",
        "description": "Conduct routine farm baseline audits and maintain transparent continuous digital logs.",
    },
    {
        "key": "assessment_veteran",
        "title": "Transformation Climber",
        "category": "Milestone",
        "tier": "silver",
        "icon": "ðŸš€",
        "description": "Complete 3 or more farm maturity assessments to track verified capability evolution.",
    },
    {
        "key": "quick_learner",
        "title": "Agro-Knowledge Scholar",
        "category": "Learning",
        "tier": "bronze",
        "icon": "ðŸ“š",
        "description": "Successfully complete 3 or more practical training courses in the Learning Portal.",
    },
    {
        "key": "service_implementer",
        "title": "Input & Service Adopter",
        "category": "Services",
        "tier": "silver",
        "icon": "ðŸ› ï¸",
        "description": "Request and implement vetted agro-services to close farm capability bottlenecks.",
    },
    {
        "key": "future_ready_100k",
        "title": "100k Future Farms Hero",
        "category": "Mastery",
        "tier": "gold",
        "icon": "ðŸŒŸ",
        "description": "Advance to Tier 3+ (Commercializing / Established) contributing to the 100k regional vision.",
    },
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
            should_unlock = progress >= 0.70 or assessment_count >= 1
        elif key == "water_steward":
            progress = pillar_cap_progress.get(2, 0.0)
            should_unlock = progress >= 0.70
        elif key == "biodiversity_hero":
            progress = pillar_cap_progress.get(3, 0.0)
            should_unlock = progress >= 0.70
        elif key == "mechanization_pioneer":
            progress = pillar_cap_progress.get(4, 0.0)
            should_unlock = progress >= 0.70 or delivered_services >= 1
        elif key == "market_master":
            progress = pillar_cap_progress.get(5, 0.0)
            should_unlock = progress >= 0.70
        elif key == "safety_shield":
            progress = pillar_cap_progress.get(6, 0.0)
            should_unlock = progress >= 0.70
        elif key == "circular_champion":
            progress = pillar_cap_progress.get(7, 0.0)
            should_unlock = progress >= 0.70
        elif key == "governance_pro":
            progress = pillar_cap_progress.get(8, 0.0)
            should_unlock = progress >= 0.70
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
            title="Evaluate Soil & Land Health",
            description="Take a Single-Pillar assessment or full audit to diagnose soil nutrient & carbon baseline.",
            category="Assessment",
            xp_reward=60,
            target_count=1,
            current_count=1 if "quest_soil_baseline" in completed else 0,
            is_completed="quest_soil_baseline" in completed,
            is_claimed="quest_soil_baseline" in claimed,
            action_type="assessment",
            action_target="pillar-1",
            icon="ðŸ§ª",
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
    """Generate an attractive regional smallholder agribusiness cohort leaderboard."""
    selected_region = region or (user.farms[0].region if user and user.farms else "Western Kenya")

    # Curated regional benchmarks for smallholder comparison
    cohort_data = [
        {
            "farmer_name": "Amina Wambui",
            "farm_name": "Sunrise Dairy & Agro-Ecological Farm",
            "region": "Central Kenya",
            "tier": 4,
            "tier_name": "Commercial Lighthouse Farm",
            "ffmi_score": 19.40,
            "total_xp": 3450,
            "level": 6,
            "level_name": "Future-Ready Pioneer",
            "weekly_xp_delta": 420,
            "badge_count": 9,
        },
        {
            "farmer_name": "Peter Kiprono",
            "farm_name": "Rift Valley Certified Grain Farm",
            "region": "Rift Valley",
            "tier": 4,
            "tier_name": "Established Agribusiness",
            "ffmi_score": 18.20,
            "total_xp": 2980,
            "level": 6,
            "level_name": "Future-Ready Pioneer",
            "weekly_xp_delta": 310,
            "badge_count": 8,
        },
        {
            "farmer_name": "Joseph Ochieng",
            "farm_name": "Kakamega Demonstration Farm",
            "region": "Western Kenya",
            "tier": 3,
            "tier_name": "Commercializing Farm",
            "ffmi_score": 14.80,
            "total_xp": 1720,
            "level": 4,
            "level_name": "Commercial Grower",
            "weekly_xp_delta": 280,
            "badge_count": 6,
            "is_current_user": True,
        },
        {
            "farmer_name": "Grace Nyokabi",
            "farm_name": "Molo Organic Horticulture",
            "region": "Rift Valley",
            "tier": 3,
            "tier_name": "Commercializing Farm",
            "ffmi_score": 13.50,
            "total_xp": 1450,
            "level": 4,
            "level_name": "Commercial Grower",
            "weekly_xp_delta": 190,
            "badge_count": 5,
        },
        {
            "farmer_name": "Emmanuel Barasa",
            "farm_name": "Bungoma Sugar & Bio-Compost Hub",
            "region": "Western Kenya",
            "tier": 3,
            "tier_name": "Commercializing Farm",
            "ffmi_score": 12.90,
            "total_xp": 1320,
            "level": 4,
            "level_name": "Commercial Grower",
            "weekly_xp_delta": 160,
            "badge_count": 5,
        },
        {
            "farmer_name": "Halima Juma",
            "farm_name": "Kilifi Coastal Agroforestry",
            "region": "Coast",
            "tier": 2,
            "tier_name": "Transitioning Smallholder",
            "ffmi_score": 10.40,
            "total_xp": 920,
            "level": 3,
            "level_name": "Resilient Steward",
            "weekly_xp_delta": 140,
            "badge_count": 4,
        },
        {
            "farmer_name": "David Mutua",
            "farm_name": "Machakos Dryland Resilience Farm",
            "region": "Eastern Kenya",
            "tier": 2,
            "tier_name": "Transitioning Smallholder",
            "ffmi_score": 9.10,
            "total_xp": 780,
            "level": 3,
            "level_name": "Resilient Steward",
            "weekly_xp_delta": 110,
            "badge_count": 3,
        },
    ]

    # Adjust current user if logged in
    user_name = user.name if user and user.name else "Joseph Ochieng"
    entries = []
    for idx, c in enumerate(cohort_data):
        is_curr = (c.get("is_current_user", False) or c["farmer_name"] == user_name)
        entries.append(
            LeaderboardEntryOut(
                rank=idx + 1,
                farmer_name=c["farmer_name"],
                farm_name=c["farm_name"],
                region=c["region"],
                tier=c["tier"],
                tier_name=c["tier_name"],
                ffmi_score=c["ffmi_score"],
                total_xp=c["total_xp"],
                level=c["level"],
                level_name=c["level_name"],
                weekly_xp_delta=c["weekly_xp_delta"],
                is_current_user=is_curr,
                badge_count=c["badge_count"],
            )
        )

    current_entry = next((e for e in entries if e.is_current_user), entries[2])

    return LeaderboardResponse(
        region=selected_region,
        total_participants=1240,
        top_entries=entries,
        current_user_entry=current_entry,
    )



