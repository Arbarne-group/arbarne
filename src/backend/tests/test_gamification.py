"""Tests for the gamification engine, levels, badges, quests, leaderboards, and API endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.session import Base, get_db
from app.gamification.engine import (
    award_xp_for_action,
    calculate_level,
    evaluate_badges,
    generate_leaderboard,
    generate_quests,
    get_or_create_gamification,
)
from app.main import app
from app.models.assessment import Farm
from app.models.gamification import UserGamification
from app.models.user import User


@pytest.fixture
def db_session():
    """In-memory SQLite for tests."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()

    # Seed sample farmers for leaderboard testing
    for i in range(1, 6):
        u = User(name=f"Farmer {i}", email=f"farmer{i}@test.com", phone=f"+25470000000{i}")
        session.add(u)
        session.flush()
        f = Farm(user_id=u.id, name=f"Farm {i}", region="Western Kenya", size_acres=5.0)
        session.add(f)
        g = UserGamification(user_id=u.id, total_xp=i * 200, level=i, level_name=f"Level {i}")
        session.add(g)
    session.commit()

    yield session
    session.close()


def test_calculate_level_thresholds():
    """Verify deterministic level calculation math across all XP milestones."""
    lvl, name, min_xp, next_xp, prog = calculate_level(0)
    assert lvl == 1
    assert name == "Seedling Pioneer"
    assert min_xp == 0
    assert next_xp == 200
    assert prog == 0.0

    lvl, name, min_xp, next_xp, prog = calculate_level(250)
    assert lvl == 2
    assert name == "Green Sprout"
    assert min_xp == 200
    assert next_xp == 500
    assert 0.16 <= prog <= 0.17

    lvl, name, min_xp, next_xp, prog = calculate_level(750)
    assert lvl == 3
    assert name == "Resilient Steward"
    assert min_xp == 500
    assert next_xp == 1000
    assert prog == 0.50

    lvl, name, min_xp, next_xp, prog = calculate_level(1400)
    assert lvl == 4
    assert name == "Agro Vanguard"
    assert min_xp == 1000
    assert next_xp == 2000
    assert prog == 0.40

    lvl, name, min_xp, next_xp, prog = calculate_level(4500)
    assert lvl == 7
    assert name == "Agribusiness Master"
    assert prog == 1.0


def test_award_xp_and_level_up(db_session: Session):
    """Test awarding XP to a user and checking for level-up transitions."""
    user = User(name="Test Gamified Farmer", phone="+254799000111", email="game@example.com")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    g = get_or_create_gamification(db_session, user)
    initial_xp = g.total_xp

    # Award question XP (+5)
    xp_added, total_xp, lvl_name, level_up, badges = award_xp_for_action(db_session, user, "answer_question")
    assert xp_added == 5
    assert total_xp == initial_xp + 5

    # Award full assessment XP (+250)
    xp_added, total_xp, lvl_name, level_up, badges = award_xp_for_action(db_session, user, "complete_assessment_full")
    assert xp_added == 250
    assert total_xp == initial_xp + 255


def test_badges_catalogue_and_evaluation(db_session: Session):
    """Test that all 12 master badges are evaluated and correct progress fractions returned."""
    user = User(name="Badge Master", phone="+254799000222")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    g = get_or_create_gamification(db_session, user)
    badges = evaluate_badges(db_session, user, g)
    assert len(badges) >= 12
    badge_keys = {b.badge_key for b in badges}
    assert "soil_guardian" in badge_keys
    assert "water_steward" in badge_keys
    assert "biodiversity_hero" in badge_keys
    assert "future_ready_100k" in badge_keys


def test_generate_quests(db_session: Session):
    """Test generating 4 active transformation quests."""
    user = User(name="Quest Hero", phone="+254799000333")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    g = get_or_create_gamification(db_session, user)
    quests = generate_quests(db_session, user, g)
    assert len(quests) == 4
    q_keys = [q.quest_key for q in quests]
    assert "soil_baseline" in q_keys
    assert "water_service" in q_keys
    assert "learn_ipm" in q_keys
    assert "sim_leap" in q_keys


def test_generate_leaderboard(db_session: Session):
    """Test generating the national (all-region) smallholder leaderboard with podium entries."""
    res = generate_leaderboard(db_session, None, region="All Regions")
    assert res.region == "All Regions"
    assert res.total_participants > 0
    assert len(res.top_entries) >= 5
    # Ensure ranked in descending order by rank
    ranks = [e.rank for e in res.top_entries]
    assert ranks == sorted(ranks)
    # Check top podium entry
    top1 = res.top_entries[0]
    assert top1.rank == 1
    assert top1.total_xp >= res.top_entries[1].total_xp


def test_gamification_api_endpoints(db_session: Session):
    """Test FastAPI endpoints for gamification status, actions, quests, and leaderboard."""
    app.dependency_overrides[get_db] = lambda: db_session
    client = TestClient(app)

    try:
        # 1. GET Gamification Status
        res = client.get("/api/portal/gamification")
        assert res.status_code == 200
        data = res.json()
        assert "total_xp" in data
        assert "level" in data
        assert "level_name" in data
        assert "badges" in data
        assert "active_quests" in data
        assert len(data["badges"]) >= 12
        assert len(data["active_quests"]) == 4

        # 2. POST Action (e.g. simulation run)
        action_res = client.post("/api/portal/gamification/action", json={"action_type": "run_simulation"})
        assert action_res.status_code == 200
        action_data = action_res.json()
        assert action_data["action_type"] == "run_simulation"
        assert action_data["xp_earned"] == 15

        # 3. GET Leaderboard
        lb_res = client.get("/api/portal/gamification/leaderboard?region=All+Regions")
        assert lb_res.status_code == 200
        lb_data = lb_res.json()
        assert lb_data["region"] == "All Regions"
        assert len(lb_data["top_entries"]) >= 5

        # 4. POST Claim Quest
        claim_res = client.post("/api/portal/gamification/claim-quest", json={"quest_id": "quest_soil_baseline"})
        assert claim_res.status_code == 200
        claim_data = claim_res.json()
        assert claim_data["quest_id"] == "quest_soil_baseline"
        assert claim_data["xp_awarded"] == 60
    finally:
        app.dependency_overrides.clear()
