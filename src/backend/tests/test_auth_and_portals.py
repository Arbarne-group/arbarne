"""Tests for Authentication, Path A & Path B Assessment Pathways, History Comparison, and Portals."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.session import Base, get_db
from app.main import app
from app.models.framework import Capability, Pillar, Question
from app.scripts.seed_portal_data import seed_portal_content


@pytest.fixture
def db_session():
    """In-memory SQLite for tests."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Seed all 8 pillars
    for p_id in range(1, 9):
        p = Pillar(
            id=p_id,
            name=f"Pillar {p_id}",
            principle=f"Principle for pillar {p_id}",
            seeks_to_achieve=["Outcome A", "Outcome B"],
            examples=["Example 1"],
            guiding_question=f"Guiding question {p_id}?",
        )
        session.add(p)
        session.flush()

        # 5 capabilities per pillar
        for c_idx in range(1, 6):
            cap_id = f"P{p_id}.{c_idx}"
            cap = Capability(
                id=cap_id,
                pillar_id=p_id,
                number=c_idx,
                name=f"Capability {p_id}.{c_idx}",
            )
            session.add(cap)
            session.flush()

            # 5 questions per capability
            for q_idx in range(1, 6):
                q = Question(
                    id=f"{cap_id}.{q_idx}",
                    pillar_id=p_id,
                    capability_id=cap_id,
                    question_number=q_idx,
                    question_text=f"Question {cap_id}.{q_idx}?",
                    priority="quick_win" if q_idx == 1 else "medium_term",
                    if_no_recommendation=f"Recommended action for {cap_id}.{q_idx}",
                    why_it_matters="Improves farm maturity",
                    quick_win="Quick Win Action",
                    support_available=["FAAB Module"],
                    ffv_evidence_required="Photo / Document",
                )
                session.add(q)

    session.commit()

    # Seed portal services & learning modules
    seed_portal_content(session)

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
    return TestClient(app)


def test_auth_registration_and_login_flow(client):
    """Test farmer registration, JWT issuance, profile retrieval, and profile update."""
    reg_payload = {
        "name": "Jane Muthoni",
        "email": "jane.muthoni@example.com",
        "password": "Harvest2026!",
        "phone": "+254711998877",
        "farm_name": "Muthoni Organic Farm",
        "region": "Central Kenya",
        "crop_type": "Avocado & Coffee",
        "size_acres": 4.5,
    }
    r = client.post("/api/auth/register", json=reg_payload)
    assert r.status_code == 201
    auth_data = r.json()
    assert "access_token" in auth_data
    assert auth_data["name"] == "Jane Muthoni"
    assert auth_data["farm_name"] == "Muthoni Organic Farm"
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Retrieve profile
    r_me = client.get("/api/auth/me", headers=headers)
    assert r_me.status_code == 200
    me_data = r_me.json()
    assert me_data["name"] == "Jane Muthoni"
    assert me_data["farm_region"] == "Central Kenya"

    # Update profile
    update_payload = {"farm_name": "Muthoni Green Agro-Forestry", "size_acres": 6.0}
    r_up = client.put("/api/auth/me", json=update_payload, headers=headers)
    assert r_up.status_code == 200
    assert r_up.json()["farm_name"] == "Muthoni Green Agro-Forestry"
    assert r_up.json()["farm_size_acres"] == 6.0


def test_login_requires_valid_email_and_password(client):
    """Login must reject unknown emails and wrong passwords, and accept valid credentials."""
    client.post(
        "/api/auth/register",
        json={
            "name": "Peter Otieno",
            "email": "peter.otieno@example.com",
            "password": "StrongPass123",
            "farm_name": "Otieno Farm",
            "region": "Western Kenya",
        },
    )

    # Unknown email -> 401
    r_unknown = client.post(
        "/api/auth/login",
        json={"email": "nobody@example.com", "password": "Whatever123"},
    )
    assert r_unknown.status_code == 401

    # Wrong password -> 401
    r_wrong = client.post(
        "/api/auth/login",
        json={"email": "peter.otieno@example.com", "password": "WrongPassword"},
    )
    assert r_wrong.status_code == 401

    # Correct credentials -> token + farm context
    r_ok = client.post(
        "/api/auth/login",
        json={"email": "peter.otieno@example.com", "password": "StrongPass123"},
    )
    assert r_ok.status_code == 200
    data = r_ok.json()
    assert data["access_token"]
    assert data["email"] == "peter.otieno@example.com"
    assert data["farm_name"] == "Otieno Farm"

    # Duplicate registration -> 409
    r_dup = client.post(
        "/api/auth/register",
        json={
            "name": "Peter Otieno Duplicate",
            "email": "peter.otieno@example.com",
            "password": "AnotherPass123",
        },
    )
    assert r_dup.status_code == 409

    # Short password at registration -> 422
    r_short = client.post(
        "/api/auth/register",
        json={
            "name": "Short Password User",
            "email": "shortpw@example.com",
            "password": "short",
        },
    )
    assert r_short.status_code == 422

    # Protected endpoint rejects missing tokens
    r_no_token = client.get("/api/auth/me")
    assert r_no_token.status_code == 401


def test_path_a_single_pillar_assessment_lifecycle(client):
    """Test Path A: Starting and completing a single pillar assessment (Pillar 2: Water Stewardship)."""
    # 1. Start single pillar assessment
    start_payload = {
        "name": "Embu Pilot Farm",
        "region": "Eastern Kenya",
        "crop_type": "Macadamia & Maize",
        "scope": "pillar",
        "target_pillar_id": 2,
    }
    r_start = client.post("/api/assessments/start", json=start_payload)
    assert r_start.status_code == 200
    start_data = r_start.json()
    assessment_id = start_data["assessment_id"]
    assert start_data["scope"] == "pillar"
    assert start_data["target_pillar_id"] == 2
    assert start_data["question_count"] == 25

    # 2. Get questions for Pillar 2
    r_q = client.get("/api/questions?pillar_id=2")
    assert r_q.status_code == 200
    questions = r_q.json()
    assert len(questions) == 25
    for q in questions:
        assert q["pillar_id"] == 2

    # 3. Answer questions for Pillar 2 (all 'yes')
    answers = [{"question_id": q["id"], "value": "yes"} for q in questions]
    r_ans = client.post(f"/api/assessments/{assessment_id}/answers", json=answers)
    assert r_ans.status_code == 200
    assert r_ans.json()["saved"] == 25

    # 4. Submit assessment
    r_sub = client.post(f"/api/assessments/{assessment_id}/submit")
    assert r_sub.status_code == 200
    sub_data = r_sub.json()
    assert sub_data["pillar_scores"]["2"] == 1.0  # Perfect score for Pillar 2
    assert "P2.1" in sub_data["capability_status"]
    assert sub_data["capability_status"]["P2.1"] == "advanced"

    # 5. Section diagnostic report
    r_sec = client.get(f"/api/assessments/{assessment_id}/sections/2")
    assert r_sec.status_code == 200
    assert r_sec.json()["pillar_id"] == 2
    assert r_sec.json()["section_score"] == 1.0
    assert r_sec.json()["section_points"] == 3.0


def test_assessment_history_and_longitudinal_comparison(client):
    """Test tracking assessment history and computing score progression delta."""
    # 1. Start and complete Baseline Assessment (Path B Full, low answers)
    r1 = client.post("/api/assessments/start", json={"name": "Timeline Farm", "region": "Rift Valley"})
    id1 = r1.json()["assessment_id"]
    r_q = client.get("/api/questions")
    all_q = r_q.json()
    # Answer 50% yes, 50% no
    ans_baseline = [{"question_id": q["id"], "value": "yes" if idx % 2 == 0 else "no"} for idx, q in enumerate(all_q)]
    client.post(f"/api/assessments/{id1}/answers", json=ans_baseline)
    client.post(f"/api/assessments/{id1}/submit")

    # 2. Start and complete Follow-up Assessment (Path B Full, 100% yes)
    r2 = client.post("/api/assessments/start", json={"name": "Timeline Farm", "reassessment_of_id": id1})
    id2 = r2.json()["assessment_id"]
    ans_followup = [{"question_id": q["id"], "value": "yes"} for q in all_q]
    client.post(f"/api/assessments/{id2}/answers", json=ans_followup)
    client.post(f"/api/assessments/{id2}/submit")

    # 3. Check history endpoint
    r_hist = client.get("/api/assessments/history")
    assert r_hist.status_code == 200
    hist = r_hist.json()
    assert len(hist) >= 2

    # 4. Compare baseline vs follow-up
    r_comp = client.get(f"/api/assessments/compare?baseline_id={id1}&current_id={id2}")
    assert r_comp.status_code == 200
    comp_data = r_comp.json()
    assert comp_data["ffmi_delta"] > 0
    assert comp_data["current_ffmi"] > comp_data["baseline_ffmi"]
    assert len(comp_data["improved_capabilities"]) > 0
    assert "pillar_deltas" in comp_data


def test_services_and_learning_portals_workflow(client):
    """Test Services Portal and Learning Portal interactions."""
    # 1. Fetch services catalogue
    r_s = client.get("/api/portal/services")
    assert r_s.status_code == 200
    services = r_s.json()
    assert len(services) > 0
    service_id = services[0]["id"]

    # 2. Request a service
    r_req = client.post("/api/portal/services/request", json={"service_id": service_id, "notes": "Need soil testing ASAP"})
    assert r_req.status_code == 201
    req_data = r_req.json()
    assert req_data["status"] == "requested"
    request_id = req_data["id"]

    # 3. Deliver service (mark capability improved)
    r_del = client.post(f"/api/portal/services/{request_id}/deliver")
    assert r_del.status_code == 200
    assert r_del.json()["status"] == "delivered"

    # 4. Fetch learning modules
    r_l = client.get("/api/portal/learning")
    assert r_l.status_code == 200
    modules = r_l.json()
    assert len(modules) > 0
    module_id = modules[0]["id"]

    # 5. Complete learning module
    r_comp = client.post(f"/api/portal/learning/{module_id}/complete")
    assert r_comp.status_code == 200
    assert r_comp.json()["status"] == "completed"

    # 6. Fetch dashboard summary
    r_sum = client.get("/api/portal/dashboard-summary")
    assert r_sum.status_code == 200
    sum_data = r_sum.json()
    assert "farmer_name" in sum_data
    assert "total_assessments_count" in sum_data
