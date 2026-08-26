import urllib.request
import json
import uuid

BASE_URL = "http://127.0.0.1:8000"

def run_test():
    print("=== Testing Authentication & Session Management End-to-End ===")
    
    unique_suffix = uuid.uuid4().hex[:6]
    test_email = f"farmer_{unique_suffix}@example.com"
    test_password = "SecurePassword123!"
    test_name = f"Farmer {unique_suffix}"
    test_farm = f"Kilimo Bora Enterprise {unique_suffix}"
    
    # 1. Test Registration
    print(f"\n1. Registering user: {test_email} ...")
    reg_payload = json.dumps({
        "name": test_name,
        "email": test_email,
        "phone": f"+2547{unique_suffix[:7].ljust(8, '0')}",
        "password": test_password,
        "farm_name": test_farm,
        "region": "Western Kenya",
        "size_acres": 12.5,
        "crop_type": "Maize, Beans & Dairy"
    }).encode("utf-8")
    
    req = urllib.request.Request(
        f"{BASE_URL}/api/auth/register",
        data=reg_payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 201, f"Expected 201 Created, got {resp.status}"
        data = json.loads(resp.read().decode("utf-8"))
        token = data["access_token"]
        print(" -> Registration Successful! Access Token issued.")
        print(f" -> User ID: {data['user_id']}, Farm ID: {data['farm_id']}")
    
    # 2. Test Login with credentials
    print(f"\n2. Logging in with credentials ...")
    login_payload = json.dumps({
        "email": test_email,
        "password": test_password
    }).encode("utf-8")
    
    req = urllib.request.Request(
        f"{BASE_URL}/api/auth/login",
        data=login_payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200 OK, got {resp.status}"
        login_data = json.loads(resp.read().decode("utf-8"))
        login_token = login_data["access_token"]
        print(" -> Login Successful! Bearer Token received.")
        print(f" -> Farm Name: {login_data['farm_name']}, Region: {login_data['region']}")
    
    # 3. Test Protected /api/auth/me with Bearer Token
    print(f"\n3. Fetching authenticated profile from /api/auth/me ...")
    req = urllib.request.Request(
        f"{BASE_URL}/api/auth/me",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {login_token}"
        }
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200 OK, got {resp.status}"
        profile = json.loads(resp.read().decode("utf-8"))
        print(f" -> Profile verified: {profile['name']} ({profile['email']})")
        print(f" -> Farm: {profile['farm_name']}, Size: {profile['farm_size_acres']} acres")
    
    # 4. Test Updating Profile
    print(f"\n4. Updating farm metadata via PUT /api/auth/me ...")
    update_payload = json.dumps({
        "farm_name": f"{test_farm} - Certified",
        "size_acres": 15.0
    }).encode("utf-8")
    
    req = urllib.request.Request(
        f"{BASE_URL}/api/auth/me",
        data=update_payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {login_token}"
        },
        method="PUT"
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200 OK, got {resp.status}"
        updated_profile = json.loads(resp.read().decode("utf-8"))
        assert updated_profile["farm_name"] == f"{test_farm} - Certified"
        assert updated_profile["farm_size_acres"] == 15.0
        print(f" -> Profile Update verified: {updated_profile['farm_name']} ({updated_profile['farm_size_acres']} acres)")
    
    # 5. Test Invalid Token / Session Expiration Rejection
    print(f"\n5. Testing 401 Unauthorized handling for invalid token ...")
    req = urllib.request.Request(
        f"{BASE_URL}/api/auth/me",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer invalid_expired_jwt_token_123"
        }
    )
    try:
        urllib.request.urlopen(req)
        print(" -> ERROR: Invalid token was accepted unexpectedly!")
        sys.exit(1)
    except urllib.error.HTTPError as e:
        assert e.code == 401, f"Expected 401 Unauthorized, got {e.code}"
        print(f" -> Correctly rejected with HTTP {e.code} Unauthorized: {e.reason}")

    print("\n>>> ALL AUTHENTICATION & SESSION MANAGEMENT TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    run_test()
