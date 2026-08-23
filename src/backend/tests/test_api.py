"""End-to-end smoke test against an in-memory SQLite + FastAPI tests client.

Verifies the API surfaces work as expected without Docker.
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api import assessments as assessments_router
from app.api import pillars as pillars_router
from app.db.session import Base, get_db
from app.main import app
from app.models.framework import Capability, Pillar, Question


# ─── Fixtures ────────────────────────────────────────────────────────
@pytest.fixture
def db_session(monkeypatch):
    """In-memory SQLite for tests."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Seed minimal pillars + capabilities + questions
    p1 = Pillar(
        id=1,
        name="Smart Farming",
        principle="Use technology.",
        seeks_to_achieve=["Adoption"],
        examples=["Records"],
        guiding_question="Is tech used?",
    )
    p2 = Pillar(
        id=2,
        name="Renewable Energy",
        principle="Use energy productively.",
        seeks_to_achieve=["Reliable access"],
        examples=["Solar"],
        guiding_question="How is energy used?",
    )
    session.add_all([p1, p2])
    session.flush()

    cap = Capability(id="P1.1", pillar_id=1, number=1, name="Technology Readiness")
    cap2 = Capability(id="P2.1", pillar_id=2, number=1, name="Energy access")
    session.add_all([cap, cap2])
    session.flush()

    for i in range(1, 6):
        session.add(
            Question(
                id=f"P1.1.{i}",
                pillar_id=1,
                capability_id="P1.1",
                question_number=i,
                question_text=f"Q P1.1.{i}?",
                priority="quick_win",
                if_no_recommendation=f"Do #{i}.",
                why_it_matters="Because.",
                quick_win="Quick win.",
                support_available=["FAAB Module 1"],
                ffv_evidence_required="Interview.",
            )
        )
    for i in range(1, 6):
        session.add(
            Question(
                id=f"P2.1.{i}",
                pillar_id=2,
                capability_id="P2.1",
                question_number=i,
                question_text=f"Q P2.1.{i}?",
                priority="medium_term",
                if_no_recommendation=f"Energy action #{i}.",
                why_it_matters="Because.",
                quick_win="Quick win.",
                support_available=["FAAB Module 2"],
                ffv_evidence_required="Plan.",
            )
        )
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
    return TestClient(app)


# ─── Tests ───────────────────────────────────────────────────────────
def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_list_pillars(client):
    r = client.get("/api/pillars")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 2
    assert data[0]["name"] == "Smart Farming"
    assert data[0]["principle"] == "Use technology."


def test_list_capabilities_for_pillar(client):
    r = client.get("/api/pillars/1/capabilities")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 1
    assert data[0]["id"] == "P1.1"


def test_list_questions(client):
    r = client.get("/api/questions")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 10
    assert data[0]["id"] == "P1.1.1"


def test_assessment_end_to_end(client):
    """Start → answer → submit → see score and recommendations."""
    # Start
    r = client.post("/api/assessments/start", json={"name": "Test Farm"})
    assert r.status_code == 200
    assessment_id = r.json()["assessment_id"]

    # Answer all 5 questions in P1.1 with yes, all 5 in P2.1 with no
    answers = [{"question_id": f"P1.1.{i}", "value": "yes"} for i in range(1, 6)]
    answers += [{"question_id": f"P2.1.{i}", "value": "no"} for i in range(1, 6)]
    r = client.post(f"/api/assessments/{assessment_id}/answers", json=answers)
    assert r.status_code == 200
    assert r.json()["saved"] == 10

    # Submit
    r = client.post(f"/api/assessments/{assessment_id}/submit")
    assert r.status_code == 200
    data = r.json()
    assert "ffmi_score" in data
    assert 0 <= data["ffmi_score"] <= 24
    assert data["tier"] in {1, 2, 3, 4, 5}
    assert data["tier_classification"] in {
        "Informal Farm",
        "Emerging Agribusiness",
        "Structured Farm",
        "Investment Ready Farm",
        "Future Ready Farm",
    }
    # P1.1 was all yes → advanced; P2.1 was all no → non_existent
    assert data["capability_status"]["P1.1"] == "advanced"
    assert data["capability_status"]["P2.1"] == "non_existent"
    # 5 recommendations — one per "No" answer in P2.1
    assert len(data["recommendations"]) == 5
    for rec in data["recommendations"]:
        assert rec["question_id"].startswith("P2.1.")
        assert rec["gap"]
        assert rec["recommended_action"]
        assert rec["potential_service"]


def test_assessment_uniqueness_per_question(client):
    """Submitting the same question twice should not duplicate answers."""
    r = client.post("/api/assessments/start", json={})
    assert r.status_code == 200
    aid = r.json()["assessment_id"]

    # Send P1.1.1 = yes, then P1.1.1 = no
    client.post(f"/api/assessments/{aid}/answers", json=[{"question_id": "P1.1.1", "value": "yes"}])
    client.post(f"/api/assessments/{aid}/answers", json=[{"question_id": "P1.1.1", "value": "no"}])

    r = client.post(f"/api/assessments/{aid}/submit")
    assert r.status_code == 200
    data = r.json()
    # Latest answer wins → P1.1.1 is "no" → P1.1 is non_existent
    assert data["capability_status"]["P1.1"] == "non_existent"


def test_assessment_not_found(client):
    r = client.post("/api/assessments/00000000-0000-0000-0000-000000000000/submit")
    assert r.status_code == 404


def test_evidence_submission_and_verification(client):
    """Test submitting evidence for FFV and running verifier review."""
    r = client.post("/api/assessments/start", json={"name": "FFV Evidence Farm"})
    aid = r.json()["assessment_id"]

    # Submit evidence
    ev_res = client.post(
        f"/api/assessments/{aid}/evidence",
        json={
            "question_id": "P1.1.1",
            "evidence_class": "A",
            "type": "photo",
            "file_url": "https://example.com/farm_photo.jpg",
            "verifier_notes": "Solar panel inspection photo",
        },
    )
    assert ev_res.status_code == 200
    assert ev_res.json()["evidence_class"] == "A"

    # Verifier review workflow
    v_res = client.post(
        f"/api/assessments/{aid}/verify",
        json={"status": "verified", "verifier_notes": "Approved by senior auditor"},
    )
    assert v_res.status_code == 200
    assert v_res.json()["status"] == "verified"


def test_narrative_report_endpoint(client):
    """Test narrative generation endpoint with graceful fallback."""
    r = client.post("/api/assessments/start", json={"name": "Narrative Test Farm"})
    aid = r.json()["assessment_id"]

    # Answer & submit
    client.post(f"/api/assessments/{aid}/answers", json=[{"question_id": "P1.1.1", "value": "yes"}])
    client.post(f"/api/assessments/{aid}/submit")

    # Fetch narrative
    n_res = client.get(f"/api/assessments/{aid}/narrative")
    assert n_res.status_code == 200
    data = n_res.json()
    assert "narrative" in data
    assert len(data["narrative"]) > 0


def test_batch_ml_jobs():
    """Test execution of farm_segmentation, risk_prediction, and evidence_anomaly_scan ML jobs."""
    from app.ml.jobs import evidence_anomaly_scan, farm_segmentation, risk_prediction

    seg = farm_segmentation()
    assert seg["status"] == "success"
    assert seg["clusters"] == 3

    risk = risk_prediction()
    assert risk["status"] == "success"

    anomaly = evidence_anomaly_scan()
    assert anomaly["status"] in ("clean", "anomalies_detected")


def test_pdf_report_generation_and_download(client):
    """Test PDF generation engine and HTTP download endpoint."""
    r = client.post("/api/assessments/start", json={"name": "PDF Test Farm", "region": "Western Kenya"})
    aid = r.json()["assessment_id"]

    # Submit answers
    client.post(f"/api/assessments/{aid}/answers", json=[
        {"question_id": "P1.1.1", "value": "yes"},
        {"question_id": "P1.1.2", "value": "no"},
    ])
    client.post(f"/api/assessments/{aid}/submit")

    # Download PDF
    pdf_res = client.get(f"/api/assessments/{aid}/pdf")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 1000  # Valid PDF binary
    assert pdf_res.content.startswith(b"%PDF")


def test_section_report_and_chart_analysis_endpoint(client):
    """Test generating detailed diagnostic report and chart dataset for an individual section."""
    r = client.post("/api/assessments/start", json={"name": "Section Report Test Farm", "region": "Rift Valley"})
    aid = r.json()["assessment_id"]

    # Submit answers for section 1
    client.post(f"/api/assessments/{aid}/answers", json=[
        {"question_id": "P1.1.1", "value": "yes"},
        {"question_id": "P1.1.2", "value": "yes"},
        {"question_id": "P1.1.3", "value": "yes"},
        {"question_id": "P1.1.4", "value": "no"},
        {"question_id": "P1.1.5", "value": "no"},
    ])
    client.post(f"/api/assessments/{aid}/submit")

    # Fetch Section 1 Report
    sec_res = client.get(f"/api/assessments/{aid}/sections/1")
    assert sec_res.status_code == 200
    data = sec_res.json()

    assert data["pillar_id"] == 1
    assert "Smart Farming" in data["pillar_name"]
    assert "capabilities" in data
    assert len(data["capabilities"]) == 5
    assert data["capabilities"][0]["capability_id"] == "P1.1"
    assert data["capabilities"][0]["yes_count"] == 3
    assert data["capabilities"][0]["status"] == "developing"
    assert data["capabilities"][0]["status_level"] == 3

    # Verify chart data
    assert "chart_data" in data
    assert len(data["chart_data"]["labels"]) == 5
    assert len(data["chart_data"]["scores"]) == 5
    assert len(data["chart_data"]["peer_benchmark"]) == 5

    # Verify narrative and points
    assert data["section_points"] >= 0.0
    assert "Section 1" in data["section_narrative"]
    assert data["strongest_capability"] is not None
    assert data["priority_gap_capability"] is not None


def test_all_sections_report_endpoint(client):
    """Test generating diagnostic analysis across all 8 assessment sections."""
    r = client.post("/api/assessments/start", json={"name": "All Sections Test Farm"})
    aid = r.json()["assessment_id"]
    client.post(f"/api/assessments/{aid}/submit")

    all_res = client.get(f"/api/assessments/{aid}/sections")
    assert all_res.status_code == 200
    data = all_res.json()

    assert data["assessment_id"] == aid
    assert len(data["sections"]) == 8
    for idx, sec in enumerate(data["sections"], start=1):
        assert sec["pillar_id"] == idx
        assert len(sec["capabilities"]) == 5
        assert len(sec["chart_data"]["scores"]) == 5


def test_section_pdf_report_download(client):
    """Test 1-page Section Diagnostic PDF generation and download."""
    r = client.post("/api/assessments/start", json={"name": "Section PDF Farm", "region": "Central Kenya"})
    aid = r.json()["assessment_id"]

    client.post(f"/api/assessments/{aid}/answers", json=[
        {"question_id": "P1.1.1", "value": "yes"},
        {"question_id": "P1.1.2", "value": "no"},
    ])
    client.post(f"/api/assessments/{aid}/submit")

    # Download Section 1 PDF
    pdf_res = client.get(f"/api/assessments/{aid}/sections/1/pdf")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 1000
    assert pdf_res.content.startswith(b"%PDF")



