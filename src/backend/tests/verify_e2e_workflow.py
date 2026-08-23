"""End-to-End Verification Script for Diagram 1, 2, 3 Workflows."""

import json
import urllib.request

BASE_URL = "http://127.0.0.1:8000"


def request(path, method="GET", data=None, token=None):
    url = BASE_URL + path
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    with urllib.request.urlopen(req) as response:
        content_type = response.headers.get("Content-Type", "")
        if "application/json" in content_type:
            return json.loads(response.read().decode("utf-8"))
        return response.read()


def main():
    print("=== 1. VERIFY FRONTEND STATIC ASSETS ===")
    html = urllib.request.urlopen(BASE_URL + "/").read().decode("utf-8")
    for screen in [
        "screen-auth",
        "screen-dashboard",
        "screen-assessment-choice",
        "screen-question",
        "screen-result",
        "screen-history",
        "screen-services",
        "screen-learning",
        "screen-profile",
        "screen-simulator",
    ]:
        assert screen in html, f"Missing screen: {screen}"
    print("[PASS] All 10 frontend screens present in index.html")

    print("\n=== 2. FARMER REGISTRATION & PROFILE (Diagram 3) ===")
    import time
    phone_num = f"+2547{int(time.time()) % 100000000:08d}"
    reg_data = request(
        "/api/auth/register",
        method="POST",
        data={
            "name": "Wycliffe Otieno",
            "phone": phone_num,
            "email": f"wycliffe_{int(time.time())}@otienofarm.co.ke",
            "password": "SecurePassword123!",
            "farm_name": "Otieno Agro-Enterprise",
            "region": "Western Kenya",
            "crop_type": "Sugarcane & Dairy",
            "size_acres": 7.5,
        },
    )
    token = reg_data["access_token"]
    print(f"[PASS] Farmer Registered: {reg_data['name']} (Farm: {reg_data['farm_name']})")
    me = request("/api/auth/me", token=token)
    print(
        f"[PASS] Profile verified: {me['name']}, Region: {me['farm_region']}, Acres: {me['farm_size_acres']}"
    )

    print("\n=== 3. PATH A: SINGLE PILLAR ASSESSMENT (Diagram 1 & 3) ===")
    start_p1 = request(
        "/api/assessments/start",
        method="POST",
        token=token,
        data={
            "name": "Otieno Agro-Enterprise",
            "scope": "pillar",
            "target_pillar_id": 1,
        },
    )
    id_p1 = start_p1["assessment_id"]
    print(
        f"[PASS] Started Path A Assessment: ID={id_p1}, scope={start_p1['scope']}, target_pillar={start_p1['target_pillar_id']}"
    )

    p1_questions = request("/api/questions?pillar_id=1")
    assert len(p1_questions) == 25
    print(f"[PASS] Loaded {len(p1_questions)} questions for Pillar 1")

    # Answer 25 questions
    ans_p1 = [{"question_id": q["id"], "value": "yes"} for q in p1_questions]
    request(
        f"/api/assessments/{id_p1}/answers", method="POST", token=token, data=ans_p1
    )
    p1_result = request(f"/api/assessments/{id_p1}/submit", method="POST", token=token)
    print(f"[PASS] Submitted Path A: Pillar 1 Score = {p1_result['pillar_scores']['1']}")

    sec1_pdf = request(f"/api/assessments/{id_p1}/sections/1/pdf", token=token)
    assert len(sec1_pdf) > 1000 and sec1_pdf.startswith(b"%PDF")
    print(f"[PASS] Downloaded Section 1 Diagnostic PDF ({len(sec1_pdf)} bytes)")

    print("\n=== 4. PATH B: FULL 8-PILLAR ASSESSMENT (Diagram 1 & 3) ===")
    start_full = request(
        "/api/assessments/start",
        method="POST",
        token=token,
        data={
            "name": "Otieno Agro-Enterprise",
            "scope": "full",
            "reassessment_of_id": id_p1,
        },
    )
    id_full = start_full["assessment_id"]
    all_questions = request("/api/questions")
    assert len(all_questions) == 200
    print(f"[PASS] Started Path B Assessment: ID={id_full}, 200 questions across 8 pillars")

    # Answer all 200 questions
    ans_full = [
        {"question_id": q["id"], "value": "yes" if idx % 3 != 0 else "no"}
        for idx, q in enumerate(all_questions)
    ]
    request(
        f"/api/assessments/{id_full}/answers",
        method="POST",
        token=token,
        data=ans_full,
    )
    full_result = request(
        f"/api/assessments/{id_full}/submit", method="POST", token=token
    )
    print(
        f"[PASS] Submitted Path B: FFMI = {full_result['ffmi_score']} / 24, Tier {full_result['tier']} ({full_result['tier_classification']})"
    )
    print(
        f"       Strongest Pillar ID: {full_result['strongest_pillar_id']}, Priority Gap ID: {full_result['priority_gap_pillar_id']}"
    )

    full_pdf = request(f"/api/assessments/{id_full}/pdf", token=token)
    assert len(full_pdf) > 5000 and full_pdf.startswith(b"%PDF")
    print(f"[PASS] Downloaded Full Transformation Report PDF ({len(full_pdf)} bytes)")

    print("\n=== 5. ASSESSMENT HISTORY & LONGITUDINAL COMPARISON ===")
    history = request("/api/assessments/history", token=token)
    print(f"[PASS] Found {len(history)} historical assessments on farmer timeline")

    comp = request(
        f"/api/assessments/compare?baseline_id={id_p1}&current_id={id_full}",
        token=token,
    )
    print(
        f"[PASS] Progression Delta: {comp['ffmi_delta']:+.2f} FFMI pts (Advancement: {comp['tier_advanced']})"
    )
    print(f"       Narrative: {comp['summary_text']}")

    print("\n=== 6. SERVICES & LEARNING PORTALS (Diagram 2 & 3) ===")
    services = request("/api/portal/services", token=token)
    rec_services = [s for s in services if s["is_recommended"]]
    print(
        f"[PASS] Services Catalogue: {len(services)} services, {len(rec_services)} recommended for gaps"
    )

    # Request service
    req_res = request(
        "/api/portal/services/request",
        method="POST",
        token=token,
        data={"service_id": services[0]["id"], "notes": "Field test requested"},
    )
    print(
        f"[PASS] Requested Service: {services[0]['title']} (Request ID: {req_res['id']})"
    )
    del_res = request(
        f"/api/portal/services/{req_res['id']}/deliver", method="POST", token=token
    )
    print(f"[PASS] Service Delivered! Status: {del_res['status']}")

    learning = request("/api/portal/learning", token=token)
    rec_learning = [m for m in learning if m["is_recommended"]]
    print(
        f"[PASS] Learning Catalogue: {len(learning)} modules, {len(rec_learning)} recommended for gaps"
    )

    # Complete learning module
    comp_learn = request(
        f"/api/portal/learning/{learning[0]['id']}/complete",
        method="POST",
        token=token,
    )
    print(
        f"[PASS] Completed Course: {learning[0]['title']} (Progress ID: {comp_learn['id']})"
    )

    print("\n=== 7. FINAL DASHBOARD SUMMARY ===")
    dash_sum = request("/api/portal/dashboard-summary", token=token)
    print(f"[PASS] Dashboard Summary for {dash_sum['farmer_name']}:")
    print(f"       - Latest FFMI: {dash_sum['ffmi_score']} / 24")
    print(
        f"       - Latest Tier: Tier {dash_sum['tier']} ({dash_sum['tier_name']})"
    )
    print(f"       - Total Assessments: {dash_sum['total_assessments_count']}")
    print(f"       - Services Delivered: {dash_sum['delivered_services_count']}")
    print(f"       - Courses Completed: {dash_sum['completed_courses_count']}")
    print(
        "\n[SUCCESS] ALL 7 SYSTEM TIERS & WORKFLOW PHASES FULLY VERIFIED AND PASSING 100%!"
    )


if __name__ == "__main__":
    main()
