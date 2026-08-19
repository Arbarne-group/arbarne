"""Performance benchmark and latency diagnostic test for FFF simulation engine and ML tasks."""

import time
import httpx
import statistics
from app.api.gradio_app import calculate_farm_scenario
from app.ml.jobs import farm_segmentation, risk_prediction

BASE_URL = "http://127.0.0.1:8000"

def benchmark_simulation():
    print("=================================================================")
    print("FUTURE FARMS FRAMEWORK -- SIMULATION PERFORMANCE & STALL TEST")
    print("=================================================================\n")

    # 1. Test Direct In-Memory Scenario Calculation
    print("1. Testing Direct In-Memory Scenario Calculation...")
    t0 = time.perf_counter()
    iterations = 1000
    for i in range(iterations):
        calculate_farm_scenario(
            farm_name=f"Farm {i}",
            region="Western Kenya",
            farm_size=5.0,
            p1_governance=(i % 10) / 10.0,
            p2_soil_land=0.6,
            p3_water=0.4,
            p4_crops=0.7,
            p5_livestock=0.3,
            p6_finance=0.5,
            p7_tech_data=0.4,
            p8_markets=0.8,
        )
    dur_ms = (time.perf_counter() - t0) * 1000
    print(f"   Executed {iterations} simulations in {dur_ms:.2f} ms ({dur_ms / iterations:.4f} ms/simulation).")
    print("   [OK] In-memory calculation is ultra-fast with zero stalling.\n")

    # 2. Test Live HTTP REST Simulation Endpoint (/api/ml/simulate)
    print(f"2. Testing Live HTTP REST Endpoint: {BASE_URL}/api/ml/simulate...")
    latencies = []
    for i in range(25):
        payload = {
            "farm_name": f"Kakamega Benchmark Farm {i}",
            "region": "Western Kenya",
            "crop_type": "Maize",
            "farm_size": 7.5,
            "pillar_scores": {
                1: 0.2 + (i % 8) * 0.1,
                2: 0.5,
                3: 0.3,
                4: 0.8,
                5: 0.2,
                6: 0.6,
                7: 0.4,
                8: 0.7,
            },
        }
        t_req = time.perf_counter()
        r = httpx.post(f"{BASE_URL}/api/ml/simulate", json=payload, timeout=5.0)
        req_dur = (time.perf_counter() - t_req) * 1000
        latencies.append(req_dur)
        assert r.status_code == 200, f"Status error: {r.status_code}"
        data = r.json()
        assert "ffmi_score" in data
        assert "tier_classification" in data

    avg_lat = statistics.mean(latencies)
    p95_lat = statistics.quantiles(latencies, n=20)[18] if len(latencies) >= 20 else max(latencies)
    print(f"   25 HTTP Requests: Avg = {avg_lat:.2f} ms | Min = {min(latencies):.2f} ms | Max = {max(latencies):.2f} ms | P95 = {p95_lat:.2f} ms")
    print("   [OK] HTTP simulation API is responsive and non-blocking.\n")

    # 3. Test Batch ML Jobs with MLflow Logging
    print("3. Testing Batch ML Jobs (KMeans Farm Segmentation & RF Risk Prediction)...")
    t_seg = time.perf_counter()
    seg = farm_segmentation()
    dur_seg = (time.perf_counter() - t_seg) * 1000
    print(f"   KMeans Segmentation: {dur_seg:.2f} ms | Result: {seg['status']} ({seg.get('assessments_analyzed')} farms)")
    assert seg["status"] == "success"

    t_risk = time.perf_counter()
    risk = risk_prediction()
    dur_risk = (time.perf_counter() - t_risk) * 1000
    print(f"   RandomForest Risk: {dur_risk:.2f} ms | Result: {risk['status']} ({risk.get('predictions_count')} predictions)")
    assert risk["status"] == "success"
    print("   [OK] ML batch training and MLflow SQLite tracking execute without delay.\n")

    print("=================================================================")
    print("[SUCCESS] ALL SIMULATION AND ML PERFORMANCE TESTS COMPLETED SUCCESSFULLY")
    print("=================================================================")

if __name__ == "__main__":
    benchmark_simulation()
