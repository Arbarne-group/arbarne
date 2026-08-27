import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_static_assets_and_html_served():
    """Verify that index.html and chart containers are served properly."""
    res = client.get("/")
    assert res.status_code == 200
    html = res.text
    
    # Check Arbarne branding and logo
    assert "Arbarne Agriculture Group" in html
    assert "arbarne-logo-horizontal-teal.png" in html
    
    # Check Dashboard chart containers
    assert 'id="dash-radar-chart"' in html
    assert 'id="dash-risk-gauge"' in html
    assert 'id="dash-risk-drivers"' in html
    assert 'id="dash-tier-ladder"' in html
    assert 'id="dash-economic-dividend"' in html
    
    # Check Results chart containers
    assert 'id="result-radar-chart"' in html
    assert 'id="result-risk-gauge"' in html
    assert 'id="result-risk-drivers"' in html
    assert 'id="result-tier-ladder"' in html
    assert 'id="result-pillar-bars"' in html
    
    # Check History & Simulator containers
    assert 'id="history-trajectory-chart"' in html
    assert 'id="sim-radar-chart"' in html
    assert 'id="sim-economic-dividend"' in html
    assert 'id="sim-tier-ladder"' in html

def test_styles_contains_chart_classes():
    """Verify that CSS contains all chart styling and animations."""
    res = client.get("/styles.css")
    assert res.status_code == 200
    css = res.text
    assert ".chart-card" in css
    assert ".radar-tooltip-popover" in css
    assert ".risk-gauge-container" in css
    assert ".risk-drivers-panel" in css
    assert ".tier-ladder-track" in css
    assert ".next-tier-goal-banner" in css
    assert ".economic-dividend-grid" in css
    assert ".trajectory-chart-wrap" in css

def test_app_js_contains_visualization_engines():
    """Verify that app.js contains the SVG chart renderers and peer benchmarks."""
    res = client.get("/app.js")
    assert res.status_code == 200
    js = res.text
    assert "REGIONAL_PEER_BENCHMARKS" in js
    assert "renderInteractiveRadarChart" in js
    assert "renderTrajectoryRiskGauge" in js
    assert "renderTierMilestoneLadder" in js
    assert "renderEconomicDividendChart" in js
    assert "renderHistoricalTrendChart" in js
