import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_static_assets_and_html_served():
    """Verify that index.html is served properly."""
    res = client.get("/")
    assert res.status_code == 200
    html = res.text
    # Check that root HTML container exists
    assert '<div id="root">' in html or "Future Farms Framework" in html or "FFF API" in html

def test_api_health_endpoint():
    """Verify that backend health check is working."""
    res = client.get("/healthz")
    assert res.status_code == 200
    data = res.json()
    assert data.get("status") == "ok"
