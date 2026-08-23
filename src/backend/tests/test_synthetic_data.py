"""Unit tests for the Synthetic Data Generator module."""

import numpy as np
import pandas as pd
import pytest

from app.ml.synthetic_data import (
    ALL_QUESTION_IDS,
    ARCHETYPE_PROFILES,
    REGIONS_METADATA,
    SyntheticDataGenerator,
)
from app.ml.validation import validate_survey_payload


@pytest.fixture
def generator():
    return SyntheticDataGenerator(seed=123)


def test_generate_farm_surveys_structure(generator):
    df = generator.generate_farm_surveys(n_samples=50, validate_payloads=True)
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 50

    # Ensure metadata columns exist
    expected_meta = [
        "farm_id", "assessment_id", "farm_name", "region", "county",
        "crop_type", "acreage", "latitude", "longitude",
        "farmer_experience_years", "is_coop_member", "archetype",
        "archetype_id", "ffmi_score", "tier", "tier_classification"
    ]
    for col in expected_meta:
        assert col in df.columns, f"Missing metadata column: {col}"

    # Ensure all 8 pillar scores exist and are bounded [0.0, 1.0]
    for p in range(1, 9):
        col = f"pillar_{p}_score"
        assert col in df.columns
        assert df[col].min() >= 0.0
        assert df[col].max() <= 1.0

    # Ensure all 200 binary question columns exist
    for q_id in ALL_QUESTION_IDS:
        col = f"q_{q_id}"
        assert col in df.columns
        assert set(df[col].unique()).issubset({0, 1})

    # Ensure deterministic scoring bounds
    assert df["ffmi_score"].min() >= 0.0
    assert df["ffmi_score"].max() <= 24.0
    assert df["tier"].isin([1, 2, 3, 4, 5]).all()
    assert df["acreage"].min() > 0


def test_generate_clustering_dataset(generator):
    df = generator.generate_clustering_dataset(n_samples=40)
    assert len(df) == 40
    assert "archetype" in df.columns
    assert "archetype_id" in df.columns
    assert set(df["archetype_id"].unique()).issubset({0, 1, 2})

    # Check 8 pillar vectors
    feature_cols = [f"pillar_{p}_score" for p in range(1, 9)]
    for col in feature_cols:
        assert col in df.columns
        assert not df[col].isna().any()


def test_generate_risk_dataset(generator):
    df = generator.generate_risk_dataset(n_samples=60)
    assert len(df) == 60

    # Expected risk covariates
    expected_cols = [
        "pillar_1_smart_farming", "pillar_2_renewable_energy", "pillar_3_food_safety",
        "pillar_4_climate_resilience", "pillar_5_business_performance", "pillar_6_human_capital",
        "pillar_7_market_access", "pillar_8_investment_readiness", "priority_gap_depth",
        "pillar_variance", "climate_shock_index", "market_volatility_index",
        "historical_delta_ffmi", "previous_ffmi_score", "log_acreage",
        "vulnerability_score", "risk_label", "risk_category"
    ]
    for col in expected_cols:
        assert col in df.columns, f"Missing risk column: {col}"
        assert not df[col].isna().any(), f"NaN values found in column: {col}"

    assert set(df["risk_label"].unique()).issubset({0, 1, 2})
    assert set(df["risk_category"].unique()).issubset({"Low Risk", "Medium Risk", "High Risk"})
    assert df["vulnerability_score"].between(0.0, 1.0).all()
    assert df["priority_gap_depth"].between(0.0, 1.0).all()


def test_generate_evidence_audit_dataset(generator):
    df = generator.generate_evidence_audit_dataset(n_samples=50, anomaly_rate=0.15)
    assert len(df) == 50

    expected_cols = [
        "evidence_id", "assessment_id", "farm_id", "region",
        "farm_centroid_lat", "farm_centroid_lon", "photo_lat", "photo_lon",
        "distance_to_centroid_km", "capture_timestamp", "upload_timestamp",
        "time_delta_seconds", "perceptual_dhash", "evidence_classification",
        "is_anomaly", "anomaly_type"
    ]
    for col in expected_cols:
        assert col in df.columns

    assert set(df["is_anomaly"].unique()).issubset({0, 1})
    assert df["is_anomaly"].sum() > 0  # At least some anomalies injected

    # Verify perceptual hashes are 16-hex characters
    for h in df["perceptual_dhash"]:
        assert len(h) == 16


def test_seed_reproducibility():
    gen1 = SyntheticDataGenerator(seed=999)
    df1 = gen1.generate_clustering_dataset(n_samples=25)

    gen2 = SyntheticDataGenerator(seed=999)
    df2 = gen2.generate_clustering_dataset(n_samples=25)

    pd.testing.assert_frame_equal(df1, df2)


def test_generate_all_datasets_bundle(generator):
    bundle = generator.generate_all_datasets(n_farms=30, n_evidence=30)
    assert "surveys" in bundle
    assert "clustering" in bundle
    assert "risk" in bundle
    assert "evidence" in bundle
    assert "metadata" in bundle

    meta = bundle["metadata"]
    assert meta["generator_seed"] == 123
    assert "farm_surveys_200q" in meta["datasets"]
    assert "section_capability_analysis" in meta["datasets"]
    assert "farm_risk_training" in meta["datasets"]


def test_generate_section_capability_dataset(generator):
    df = generator.generate_section_capability_dataset(n_samples=25)
    assert len(df) == 25
    assert "section_1_score" in df.columns
    assert "cap_P1.1_score" in df.columns
    assert "cap_P8.5_score" in df.columns
    assert df["section_1_points"].between(0.0, 3.0).all()

