"""Live end-to-end integration and API verification test for FFF application."""

import sys
import json
import httpx

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"


def _auth_token():
    """Register a fresh farmer account and return a Bearer token for the live test."""
    import time

    email = f"live_smoke_{int(time.time() * 1000)}@example.com"
    r = httpx.post(
        f"{BASE_URL}/api/auth/register",
        json={
            "email": email,
            "password": "livetestpassword123",
            "name": "Live Smoke Farmer",
            "farm_name": "Live Smoke Farm",
            "region": "Western Kenya",
            "crop_type": "Mixed Crop & Livestock",
            "size_acres": 7.5,
        },
        timeout=10.0,
    )
    assert r.status_code == 201, f"register failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


def test_live_server():
    print(f"--- 0. Registering live test farmer & obtaining auth token ---")
    token = _auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] Authenticated live test farmer registered!\n")

    print(f"--- 1. Testing Health Endpoint: {BASE_URL}/health ---")
    try:
        r = httpx.get(f"{BASE_URL}/health", timeout=5.0)
        print(f"Status: {r.status_code}, Body: {r.json()}")
        assert r.status_code == 200
        assert r.json().get("status") in ("ok", "healthy")
        print("[OK] Health check passed!\n")
    except Exception as e:
        print(f"[FAILED] Health check failed: {e}")
        return False

    print(f"--- 2. Testing Pillars Endpoint: {BASE_URL}/api/pillars ---")
    r = httpx.get(f"{BASE_URL}/api/pillars", timeout=5.0)
    pillars = r.json()
    print(f"Status: {r.status_code}, Found {len(pillars)} pillars")
    assert r.status_code == 200
    assert len(pillars) == 8
    print("[OK] Seeded 8 Pillars verified!\n")

    print(f"--- 3. Testing Start Assessment: {BASE_URL}/api/assessments/start ---")
    r = httpx.post(f"{BASE_URL}/api/assessments/start", json={"name": "Live Test Farm", "region": "Western Kenya"}, headers=headers)
    assert r.status_code == 200
    data = r.json()
    assessment_id = data["assessment_id"]
    print(f"Status: {r.status_code}, Assessment ID: {assessment_id}")
    print("[OK] Assessment creation passed!\n")

    print(f"--- 4. Testing Save Answers (Valid Payload): {BASE_URL}/api/assessments/{assessment_id}/answers ---")
    valid_answers = [
        {"question_id": "P1.1.1", "value": "yes"},
        {"question_id": "P1.1.2", "value": "no"},
        {"question_id": "P1.1.3", "value": "yes"},
    ]
    r = httpx.post(f"{BASE_URL}/api/assessments/{assessment_id}/answers", json=valid_answers, headers=headers)
    print(f"Status: {r.status_code}, Response: {r.json()}")
    assert r.status_code == 200
    print("[OK] Valid answers saved successfully!\n")

    print(f"--- 5. Testing Ingestion Data Quality Guardrail (Invalid Score 99.0) ---")
    invalid_answers = [
        {"question_id": "P1.1.1", "value": "invalid_val"}
    ]
    r = httpx.post(f"{BASE_URL}/api/assessments/{assessment_id}/answers", json=invalid_answers, headers=headers)
    print(f"Status: {r.status_code}, Response: {r.text}")
    assert r.status_code == 422
    
    # Also test data quality module directly
    from app.ml.validation import validate_survey_payload
    valid, errs = validate_survey_payload({"P1.1.1": 99.0})
    assert valid is False
    assert any("out of bounds" in e for e in errs)
    print(f"[OK] Ingestion guardrails rejected invalid payload (Status 422, Direct err: {errs[0]})!\n")

    print(f"--- 6. Testing Interactive Gradio ML UI Route: {BASE_URL}/ml-demo/ ---")
    r = httpx.get(f"{BASE_URL}/ml-demo/", follow_redirects=True, timeout=10.0)
    print(f"Status: {r.status_code}")
    assert r.status_code == 200
    print("[OK] Gradio interactive UI is accessible and responding at /ml-demo/!\n")

    print(f"--- 7. Testing Batch ML Jobs with MLflow Tracking ---")
    from app.ml.jobs import farm_segmentation, risk_prediction
    seg = farm_segmentation()
    print(f"Farm Segmentation: {seg}")
    assert seg["status"] == "success"
    
    risk = risk_prediction()
    print(f"Risk Prediction: {risk}")
    assert risk["status"] == "success"
    print("[OK] Batch ML jobs executed and tracked with MLflow!\n")

    print(f"--- 8. Testing Submit Assessment & Official PDF Download: {BASE_URL}/api/assessments/{assessment_id}/pdf ---")
    sub_res = httpx.post(f"{BASE_URL}/api/assessments/{assessment_id}/submit", timeout=5.0, headers=headers)
    assert sub_res.status_code == 200
    pdf_res = httpx.get(f"{BASE_URL}/api/assessments/{assessment_id}/pdf", timeout=10.0, headers=headers)
    print(f"Status: {pdf_res.status_code}, Content-Type: {pdf_res.headers.get('content-type')}, Size: {len(pdf_res.content)} bytes")
    assert pdf_res.status_code == 200
    assert pdf_res.headers.get("content-type") == "application/pdf"
    assert pdf_res.content.startswith(b"%PDF")
    print("[OK] Official PDF Transformation Report generated & downloaded successfully!\n")

    print(f"--- 9. Testing REST Scenario Simulator: {BASE_URL}/api/ml/simulate ---")
    sim_payload = {
        "farm_name": "Live Simulator Farm",
        "region": "Western Kenya",
        "pillar_scores": {
            "1": 0.80, "2": 0.70, "3": 0.60, "4": 0.85,
            "5": 0.50, "6": 0.75, "7": 0.40, "8": 0.90
        }
    }
    sim_res = httpx.post(f"{BASE_URL}/api/ml/simulate", json=sim_payload, timeout=5.0)
    assert sim_res.status_code == 200
    sim_data = sim_res.json()
    print(f"Simulated FFMI: {sim_data['ffmi_score']}, Tier: {sim_data['tier_classification']}, Risk: {sim_data['trajectory_risk']}")
    assert sim_data["ffmi_score"] > 15.0
    assert len(sim_data["recommendations"]) > 0
    print("[OK] REST Scenario Simulator verified!\n")

    print("ALL 9 LIVE INTEGRATION TESTS PASSED SUCCESSFULLY!")
    return True

if __name__ == "__main__":
    success = test_live_server()
    sys.exit(0 if success else 1)

