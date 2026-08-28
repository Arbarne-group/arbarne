"""End-to-end integration test suite verifying live frontend-backend contract.

Validates the full user journey:
1. Authentication & Profile Retrieval
2. Starting Path A (25Q Single Pillar) and Path B (200Q Full Assessment)
3. Answering, submitting, and deterministic scoring (FFMI/24.00 and Tier 1-5)
4. PDF report generation and download endpoint
5. Historical assessment comparison (Baseline vs Current Delta)
6. Services Portal request & delivery lifecycle
7. Learning Portal course progress and completion
8. Live Dashboard summary aggregation & gamification stats
"""

from __future__ import annotations

import datetime
from datetime import timezone
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.auth import hash_password
from app.db.session import Base, get_db
from app.main import app
from app.models.assessment import Answer, Assessment, Farm
from app.models.framework import Capability, Pillar, Question, RuleVersion
from app.models.gamification import UserGamification
from app.models.portal import LearningModule, LearningProgress, ServiceItem, ServiceRequest
from app.models.recommendation import Recommendation
from app.models.user import User
from app.recommendations.engine import build_recommendations
from app.scoring.engine import DEFAULT_FFMI_BANDS, score_assessment
from app.scripts.seed_data import CAPABILITIES, PILLARS, QUESTIONS


@pytest.fixture(scope="module")
def db_engine():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    return engine


@pytest.fixture(scope="module")
def db_session(db_engine):
    Session = sessionmaker(bind=db_engine)
    session = Session()

    # 1. Canonical Rule Version
    rule_ver = RuleVersion(
        id="v1.0",
        bands={"tier1": [0, 4.99], "tier2": [5.0, 9.99], "tier3": [10.0, 15.99], "tier4": [16.0, 20.99], "tier5": [21.0, 24.0]},
        notes="Canonical Future Farms Framework v1.0 Rules",
    )
    session.add(rule_ver)
    session.flush()

    # 2. Pillars
    for p_data in PILLARS:
        pillar = Pillar(
            id=p_data["id"],
            name=p_data["name"],
            principle=p_data.get("principle", ""),
            guiding_question=p_data.get("guiding_question", ""),
            examples=p_data.get("examples", []),
            seeks_to_achieve=p_data.get("seeks_to_achieve", []),
        )
        session.add(pillar)
    session.flush()

    # 3. Capabilities
    for c_data in CAPABILITIES:
        cap_num = int(c_data["id"].split(".")[1]) if "." in c_data["id"] else 1
        cap = Capability(
            id=c_data["id"],
            pillar_id=c_data["pillar_id"],
            number=c_data.get("number", cap_num),
            name=c_data["name"],
            description=c_data.get("description", ""),
        )
        session.add(cap)
    session.flush()

    # 4. Questions
    questions_by_id: dict[str, Question] = {}
    for q_data in QUESTIONS:
        q = Question(
            id=q_data["id"],
            capability_id=q_data["capability_id"],
            pillar_id=q_data["pillar_id"],
            question_number=q_data.get("question_number", 1),
            question_text=q_data["question_text"],
            why_it_matters=q_data.get("why_it_matters", ""),
            quick_win=q_data.get("quick_win", ""),
            ffv_evidence_required=q_data.get("ffv_evidence_required", ""),
            if_no_recommendation=q_data.get("if_no_recommendation", ""),
            support_available=q_data.get("support_available", []),
            priority=q_data.get("priority", "medium_term"),
        )
        session.add(q)
        questions_by_id[q_data["id"]] = q
    session.flush()

    # 5. Services Catalogue
    sample_services = [
        {"title": "Solar Drip Irrigation & Smart Fertigation", "provider": "SunCulture Kenya", "category": "Water & Irrigation", "description": "High-efficiency solar pump system.", "pillar_id": 2, "cost_model": "KES 48,000"},
        {"title": "Comprehensive Soil Health Macronutrient Audit", "provider": "AgriLab Western", "category": "Soil & Nutrition", "description": "Soil testing for NPK and pH.", "pillar_id": 1, "cost_model": "KES 3,500"},
    ]
    for s_data in sample_services:
        session.add(ServiceItem(**s_data))
    session.flush()

    # 6. Learning Modules
    sample_modules = [
        {"title": "Solar Drip Scheduling & PV Array Maintenance", "pillar_id": 2, "duration_minutes": 12, "level": "Beginner", "summary": "Solar irrigation scheduling."},
        {"title": "Regenerative Soil Conditioning & Biochar Pyrolysis", "pillar_id": 4, "duration_minutes": 15, "level": "Beginner", "summary": "On-farm biochar soil conditioning."},
    ]
    for m_data in sample_modules:
        session.add(LearningModule(**m_data))
    session.flush()

    # 7. Demo Users & Farms
    # Farmer Grace
    user_grace = User(
        email="farmer@arbarne.org",
        name="Grace Wanjiru",
        phone="+254 700 123 456",
        role="farmer",
        password_hash=hash_password("password123"),
        is_verified=True,
    )
    session.add(user_grace)
    session.flush()

    farm_grace = Farm(
        user_id=user_grace.id,
        name="Kakamega Demofarm",
        region="Western Kenya",
        crop_type="Maize, Dairy & Vegetables",
        size_acres=5.0,
    )
    session.add(farm_grace)
    session.flush()

    # Demo Farmer Joseph
    user_demo = User(
        email="demo@arbarne.org",
        name="Joseph Ochieng",
        phone="+254 712 345 678",
        role="farmer",
        password_hash=hash_password("password123"),
        is_verified=True,
    )
    session.add(user_demo)
    session.flush()

    farm_demo = Farm(
        user_id=user_demo.id,
        name="Green Valley Demofarm",
        region="Rift Valley",
        crop_type="Maize, Dairy & Vegetables",
        size_acres=7.5,
    )
    session.add(farm_demo)
    session.flush()

    # 8. Completed Assessments for Demo Users
    capabilities_by_pillar: dict[int, list[tuple[str, list[str]]]] = {}
    caps = session.scalars(select(Capability).order_by(Capability.pillar_id, Capability.number)).all()
    for c in caps:
        c_qids = [q.id for q in questions_by_id.values() if q.capability_id == c.id]
        if c_qids:
            capabilities_by_pillar.setdefault(c.pillar_id, []).append((c.id, c_qids))

    def create_seeded_assessment(user, farm, yes_prob, days_ago, reassessment_of=None):
        started_time = datetime.datetime.now(timezone.utc) - datetime.timedelta(days=days_ago, minutes=45)
        submitted_time = datetime.datetime.now(timezone.utc) - datetime.timedelta(days=days_ago)
        ass = Assessment(
            farm_id=farm.id,
            assessor_id=user.id,
            scope="full",
            status="submitted",
            started_at=started_time,
            submitted_at=submitted_time,
            rule_version_id="v1.0",
            reassessment_of_id=reassessment_of,
        )
        session.add(ass)
        session.flush()

        answers_dict = {}
        for idx, q in enumerate(questions_by_id.values()):
            val = "yes" if ((idx * 7 + q.pillar_id * 13) % 100) / 100.0 < yes_prob else "no"
            answers_dict[q.id] = val
            session.add(Answer(assessment_id=ass.id, question_id=q.id, value=val, answered_at=started_time))
        session.flush()

        score_res = score_assessment(answers_dict, capabilities_by_pillar)
        ass.ffmi_score = score_res.ffmi_score
        ass.tier = score_res.tier
        ass.pillar_scores = {str(k): v for k, v in score_res.pillar_scores.items()}
        ass.capability_status = score_res.capability_status

        recs = build_recommendations(answers_dict, questions_by_id, score_res.capability_status)
        for r in recs:
            session.add(
                Recommendation(
                    assessment_id=ass.id,
                    question_id=r.question_id,
                    pillar_id=r.pillar_id,
                    capability_id=r.capability_id,
                    gap=r.gap,
                    capability_status=r.capability_status,
                    priority=r.priority,
                    recommended_action=r.recommended_action,
                    recommended_learning=r.recommended_learning,
                    potential_service=r.potential_service,
                )
            )
        session.flush()
        return ass

    create_seeded_assessment(user_grace, farm_grace, 0.78, 5)
    base_demo = create_seeded_assessment(user_demo, farm_demo, 0.48, 180)
    create_seeded_assessment(user_demo, farm_demo, 0.65, 10, reassessment_of=base_demo.id)

    # 9. Gamification for users
    for user, farm in [(user_grace, farm_grace), (user_demo, farm_demo)]:
        gam = UserGamification(
            user_id=user.id,
            farm_id=farm.id,
            total_xp=620,
            level=3,
            level_name="Resilient Steward",
            streak_days=4,
            completed_quest_ids=["quest_soil_baseline", "quest_solar_check"],
        )
        session.add(gam)

    session.commit()

    def override_get_db():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield session
    session.close()


@pytest.fixture
def client(db_session):
    """FastAPI test client with database session override."""
    return TestClient(app)


def get_auth_headers(client: TestClient, email: str = "farmer@arbarne.org", password: str = "password123") -> dict[str, str]:
    """Helper to authenticate and return bearer headers."""
    resp = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert resp.status_code == 200, f"Login failed for {email}: {resp.text}"
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


class TestLiveIntegrationSuite:
    """Comprehensive test suite testing all live APIs."""

    def test_01_auth_and_profile(self, client: TestClient):
        """Test authentication and user profile loading."""
        headers = get_auth_headers(client, "farmer@arbarne.org")
        resp = client.get("/api/auth/me", headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == "farmer@arbarne.org"
        assert data["name"] == "Grace Wanjiru"
        assert data["farm_region"] == "Western Kenya"

    def test_02_dashboard_summary(self, client: TestClient):
        """Test live dashboard summary aggregation."""
        headers = get_auth_headers(client, "farmer@arbarne.org")
        resp = client.get("/api/portal/dashboard-summary", headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["latest_assessment_id"] is not None
        assert data["ffmi_score"] is not None and data["ffmi_score"] > 0
        assert data["tier"] in [1, 2, 3, 4, 5]
        assert data["total_assessments_count"] >= 1
        assert "recommended_services_count" in data
        assert "recommended_courses_count" in data

    def test_03_gamification_profile(self, client: TestClient):
        """Test gamification XP, level, and badge endpoints."""
        headers = get_auth_headers(client, "farmer@arbarne.org")
        resp = client.get("/api/portal/gamification", headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_xp"] > 0
        assert data["level"] >= 1

    def test_04_full_assessment_flow(self, client: TestClient):
        """Test starting a full assessment, submitting answers, and getting scored result."""
        headers = get_auth_headers(client, "farmer@arbarne.org")
        
        # 1. Start assessment
        start_payload = {
            "farm": {
                "name": "Kakamega Demofarm",
                "region": "Western Kenya",
                "crop_type": "Maize & Beans",
                "size_acres": 5.0,
            },
            "scope": "full",
        }
        start_resp = client.post("/api/assessments/start", json=start_payload, headers=headers)
        assert start_resp.status_code == 200
        start_data = start_resp.json()
        assessment_id = start_data["assessment_id"]
        assert start_data["question_count"] == 200

        # 2. Save answers
        questions = start_data["questions"]
        answers_batch = [{"question_id": q["id"], "value": "yes" if i % 3 != 0 else "no"} for i, q in enumerate(questions)]
        ans_resp = client.post(f"/api/assessments/{assessment_id}/answers", json=answers_batch, headers=headers)
        assert ans_resp.status_code == 200
        assert ans_resp.json()["saved"] == 200

        # 3. Submit assessment
        sub_resp = client.post(f"/api/assessments/{assessment_id}/submit", headers=headers)
        assert sub_resp.status_code == 200
        sub_data = sub_resp.json()
        assert sub_data["ffmi_score"] > 0
        assert sub_data["tier"] in [1, 2, 3, 4, 5]
        assert len(sub_data["pillar_scores"]) == 8
        assert len(sub_data["recommendations"]) > 0

        # 4. Get full scorecard
        card_resp = client.get(f"/api/assessments/{assessment_id}", headers=headers)
        assert card_resp.status_code == 200
        card_data = card_resp.json()
        assert card_data["assessment_id"] == assessment_id
        assert card_data["ffmi_score"] == sub_data["ffmi_score"]

        # 5. PDF generation check
        pdf_resp = client.get(f"/api/assessments/{assessment_id}/pdf", headers=headers)
        assert pdf_resp.status_code == 200
        assert pdf_resp.headers["content-type"] == "application/pdf"
        assert len(pdf_resp.content) > 100

    def test_05_pillar_assessment_flow(self, client: TestClient):
        """Test starting a single pillar Path A assessment."""
        headers = get_auth_headers(client, "farmer@arbarne.org")
        start_payload = {
            "farm": {
                "name": "Kakamega Demofarm",
                "region": "Western Kenya",
                "crop_type": "Maize & Beans",
                "size_acres": 5.0,
            },
            "scope": "pillar",
            "target_pillar_id": 2,
        }
        start_resp = client.post("/api/assessments/start", json=start_payload, headers=headers)
        assert start_resp.status_code == 200
        start_data = start_resp.json()
        assert start_data["question_count"] == 25
        assert start_data["target_pillar_id"] == 2

    def test_06_assessment_history_and_comparison(self, client: TestClient):
        """Test assessment history retrieval and comparison endpoint."""
        headers = get_auth_headers(client, "demo@arbarne.org")
        hist_resp = client.get("/api/assessments/history", headers=headers)
        assert hist_resp.status_code == 200
        history = hist_resp.json()
        assert len(history) >= 2

        # Compare baseline vs follow-up
        baseline_id = history[-1]["id"]
        current_id = history[0]["id"]
        comp_resp = client.get(f"/api/assessments/compare?baseline_id={baseline_id}&current_id={current_id}", headers=headers)
        assert comp_resp.status_code == 200
        comp_data = comp_resp.json()
        assert "ffmi_delta" in comp_data
        assert "pillar_deltas" in comp_data

    def test_07_services_portal_workflow(self, client: TestClient):
        """Test listing catalogue, requesting a service, and marking delivered."""
        headers = get_auth_headers(client, "farmer@arbarne.org")
        
        # 1. Catalogue
        cat_resp = client.get("/api/portal/services", headers=headers)
        assert cat_resp.status_code == 200
        services = cat_resp.json()
        assert len(services) > 0
        target_service = services[0]

        # 2. Request service
        req_payload = {
            "service_id": target_service["id"],
            "notes": "Testing service dispatch integration.",
        }
        req_resp = client.post("/api/portal/services/request", json=req_payload, headers=headers)
        assert req_resp.status_code == 201
        req_data = req_resp.json()
        assert req_data["status"] == "requested"

        # 3. Deliver service
        srv_req_id = req_data["id"]
        del_resp = client.post(f"/api/portal/services/{srv_req_id}/deliver", headers=headers)
        assert del_resp.status_code == 200
        assert del_resp.json()["status"] == "delivered"

    def test_08_learning_portal_workflow(self, client: TestClient):
        """Test listing modules, enrolling, and completing course."""
        headers = get_auth_headers(client, "farmer@arbarne.org")
        
        # 1. Catalogue
        mod_resp = client.get("/api/portal/learning", headers=headers)
        assert mod_resp.status_code == 200
        modules = mod_resp.json()
        assert len(modules) > 0
        target_mod = modules[0]

        # 2. Complete course
        comp_resp = client.post(f"/api/portal/learning/{target_mod['id']}/complete", headers=headers)
        assert comp_resp.status_code == 200
        assert comp_resp.json()["status"] == "completed"
