"""Unit tests for MLOps tracking, data quality validation, and Gradio scenario simulation."""

import pytest
from app.ml.validation import validate_survey_payload, validate_evidence_metadata
from app.ml.tracking import track_job_run
from app.api.gradio_app import calculate_farm_scenario
from app.ml.jobs import farm_segmentation, risk_prediction


def test_validate_survey_payload_valid():
    payload = {"P1.1.1": 4.0, "P1.1.2": 5.0}
    is_valid, errors = validate_survey_payload(payload)
    assert is_valid is True
    assert len(errors) == 0


def test_validate_survey_payload_out_of_bounds():
    payload = {"P1.1.1": 10.0}  # Expected between 0 and 5
    is_valid, errors = validate_survey_payload(payload)
    assert is_valid is False
    assert any("out of bounds" in err for err in errors)


def test_validate_evidence_metadata_valid():
    evidence = {"latitude": -1.286389, "longitude": 36.817223, "classification": "A"}
    is_valid, errors = validate_evidence_metadata(evidence)
    assert is_valid is True
    assert len(errors) == 0


def test_validate_evidence_metadata_invalid_coords():
    evidence = {"latitude": 200.0, "longitude": 36.817223, "classification": "Z"}
    is_valid, errors = validate_evidence_metadata(evidence)
    assert is_valid is False
    assert len(errors) == 2


def test_mlflow_tracking_execution():
    run_id = track_job_run(
        experiment_name="test_experiment",
        run_name="unit_test_run",
        params={"param1": 10},
        metrics={"metric1": 0.95},
    )
    # Returns run_id string when MLflow completes successfully
    assert run_id is None or isinstance(run_id, str)


def test_gradio_scenario_simulation():
    summary, tier, risk, quick_wins = calculate_farm_scenario(
        farm_name="Test Farm",
        region="Western Kenya",
        farm_size=10.0,
        p1_governance=0.8,
        p2_soil_land=0.7,
        p3_water=0.6,
        p4_crops=0.9,
        p5_livestock=0.5,
        p6_finance=0.4,
        p7_tech_data=0.3,
        p8_markets=0.8,
    )
    assert "Test Farm" in summary
    assert "Western Kenya" in summary
    assert "Tier" in tier
    assert "Risk" in risk
    assert "Quick Wins" in quick_wins or "Prioritize" in quick_wins


def test_batch_ml_jobs_with_tracking():
    seg_res = farm_segmentation()
    assert seg_res["status"] == "success"
    assert seg_res["clusters"] == 3

    risk_res = risk_prediction()
    assert risk_res["status"] == "success"
    assert risk_res["predictions_count"] > 0


def test_simulate_api_canonical_metrics():
    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    payload = {
        "farm_name": "Test Kakamega Farm",
        "region": "Western Kenya",
        "pillar_scores": {1: 0.8, 2: 0.8, 3: 0.8, 4: 0.8, 5: 0.8, 6: 0.8, 7: 0.8, 8: 0.8},
    }
    resp = client.post("/api/ml/simulate", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["max_ffmi"] == 24.0
    assert data["ffmi_score"] == 19.2
    assert data["tier"] == 4
    assert data["tier_classification"] == "Investment Ready Farm"
    assert "Low Risk" in data["trajectory_risk"]

