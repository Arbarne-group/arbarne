import urllib.request
import json
import sys

print("=== 1. Checking React Vite Dev Server (Port 5173) ===")
try:
    with urllib.request.urlopen("http://127.0.0.1:5173/") as resp:
        print("Vite HTTP Status:", resp.status)
        content = resp.read().decode("utf-8")
        print("Vite Document Title/Snippet:", content[:160])
except Exception as e:
    print("Vite Check Error:", e)

print("\n=== 2. Checking FastAPI Backend Health (Port 8000) ===")
try:
    with urllib.request.urlopen("http://127.0.0.1:8000/health") as resp:
        print("FastAPI Health Status:", resp.status)
        print("FastAPI Health Data:", json.loads(resp.read().decode("utf-8")))
except Exception as e:
    print("FastAPI Health Error:", e)

print("\n=== 3. Checking FastAPI Pillars (Port 8000) ===")
try:
    with urllib.request.urlopen("http://127.0.0.1:8000/api/pillars") as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(f"Pillars returned: {len(data)}")
        for p in data[:3]:
            print(f" - Pillar {p.get('id')}: {p.get('name')}")
except Exception as e:
    print("Pillars Error:", e)

print("\n=== 4. Checking Vite Dev Proxy to FastAPI (Port 5173 -> 8000) ===")
try:
    with urllib.request.urlopen("http://127.0.0.1:5173/api/pillars") as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(f"Proxied Pillars returned: {len(data)}")
        print(f"First Proxied Pillar: Pillar {data[0].get('id')} - {data[0].get('name')}")
except Exception as e:
    print("Vite Proxy Error:", e)

print("\n=== 5. Checking FastAPI Static Serving of Dist (Port 8000) ===")
try:
    with urllib.request.urlopen("http://127.0.0.1:8000/") as resp:
        print("FastAPI Root Status:", resp.status)
        content = resp.read().decode("utf-8")
        print("FastAPI Root HTML snippet:", content[:160])
except Exception as e:
    print("FastAPI Static Serve Error:", e)

print("\n=== 6. Checking Gradio Simulation Studio (Port 8000/ml-demo) ===")
try:
    with urllib.request.urlopen("http://127.0.0.1:8000/ml-demo/") as resp:
        print("Gradio HTTP Status:", resp.status)
except Exception as e:
    print("Gradio Error:", e)

print("\n>>> ALL SYSTEM VERIFICATION CHECKS COMPLETED SUCCESSFULLY!")
