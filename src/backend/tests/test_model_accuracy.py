"""Comprehensive Model Accuracy and Statistical Benchmark Test Suite.

Validates:
1. Trajectory Default Risk Forecaster (Accuracy >= 95%, Macro F1 >= 0.95, 5-Fold CV >= 0.95)
2. Farm Segmentation K-Means (Silhouette >= 0.55, PCA Variance >= 85%)
3. Field Evidence Anomaly Scanner (Anomaly identification performance)
4. Section-level 40-capability dataset integrity and deterministic consistency
"""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    silhouette_score,
)
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split

from app.ml.synthetic_data import SyntheticDataGenerator


@pytest.fixture(scope="module")
def synthetic_generator() -> SyntheticDataGenerator:
    return SyntheticDataGenerator(seed=42)


@pytest.fixture(scope="module")
def synthetic_datasets(synthetic_generator: SyntheticDataGenerator) -> dict:
    return synthetic_generator.generate_all_datasets(n_farms=1000, n_evidence=1000)


def test_section_capability_dataset_integrity(synthetic_datasets: dict):
    """Test 40-capability breakdown dataset schema, level bounds, and deterministic consistency."""
    df_sec = synthetic_datasets["sections"]
    assert len(df_sec) == 1000

    # 40 Capabilities check
    for p in range(1, 9):
        assert f"section_{p}_score" in df_sec.columns
        assert f"section_{p}_points" in df_sec.columns
        assert f"section_{p}_strongest_cap" in df_sec.columns
        assert f"section_{p}_gap_cap" in df_sec.columns

        # Verify section score bounds [0.0, 1.0] and points [0.0, 3.0]
        assert df_sec[f"section_{p}_score"].between(0.0, 1.0).all()
        assert df_sec[f"section_{p}_points"].between(0.0, 3.0).all()

        for c in range(1, 6):
            cap_id = f"P{p}.{c}"
            assert f"cap_{cap_id}_score" in df_sec.columns
            assert f"cap_{cap_id}_yes_count" in df_sec.columns
            assert f"cap_{cap_id}_level" in df_sec.columns
            assert f"cap_{cap_id}_status" in df_sec.columns

            # Bounds
            assert df_sec[f"cap_{cap_id}_score"].between(0.0, 1.0).all()
            assert df_sec[f"cap_{cap_id}_yes_count"].between(0, 5).all()
            assert df_sec[f"cap_{cap_id}_level"].between(0, 5).all()
            assert set(df_sec[f"cap_{cap_id}_status"].unique()).issubset({
                "non_existent", "emerging", "basic", "developing", "established", "advanced"
            })

    # Verify that average of capability scores perfectly aligns with section score
    for p in range(1, 9):
        cap_cols = [f"cap_P{p}.{c}_score" for c in range(1, 6)]
        computed_sec_score = df_sec[cap_cols].mean(axis=1)
        np.testing.assert_allclose(computed_sec_score, df_sec[f"section_{p}_score"], atol=1e-3)


def test_trajectory_risk_forecaster_accuracy(synthetic_datasets: dict):
    """Test that Random Forest Risk Forecaster achieves >95% accuracy and >0.95 F1."""
    df_risk = synthetic_datasets["risk"]

    feature_cols = [
        "pillar_1_smart_farming",
        "pillar_2_renewable_energy",
        "pillar_3_food_safety",
        "pillar_4_climate_resilience",
        "pillar_5_business_performance",
        "pillar_6_human_capital",
        "pillar_7_market_access",
        "pillar_8_investment_readiness",
        "priority_gap_depth",
        "pillar_variance",
        "log_acreage",
        "climate_shock_index",
        "market_volatility_index",
        "historical_delta_ffmi",
    ]

    X = df_risk[feature_cols].values
    y = df_risk["risk_label"].values

    # Train / Test split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        min_samples_split=4,
        random_state=42,
    )
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)

    # Benchmark metrics
    acc = accuracy_score(y_test, y_pred)
    macro_f1 = f1_score(y_test, y_pred, average="macro")
    weighted_f1 = f1_score(y_test, y_pred, average="weighted")
    macro_precision = precision_score(y_test, y_pred, average="macro")
    macro_recall = recall_score(y_test, y_pred, average="macro")

    # 5-Fold Stratified Cross-Validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(clf, X, y, cv=cv, scoring="f1_macro")
    cv_mean = float(np.mean(cv_scores))
    cv_std = float(np.std(cv_scores))

    # Assert rigorous accuracy thresholds
    assert acc >= 0.95, f"Test Accuracy {acc:.4f} is below 95% threshold"
    assert macro_f1 >= 0.95, f"Macro F1 {macro_f1:.4f} is below 0.95 threshold"
    assert weighted_f1 >= 0.95, f"Weighted F1 {weighted_f1:.4f} is below 0.95 threshold"
    assert macro_precision >= 0.90, f"Macro Precision {macro_precision:.4f} is below 0.90"
    assert macro_recall >= 0.90, f"Macro Recall {macro_recall:.4f} is below 0.90"
    assert cv_mean >= 0.95, f"5-Fold CV Mean F1 {cv_mean:.4f} is below 0.95"
    assert cv_std <= 0.03, f"CV Standard Deviation {cv_std:.4f} indicates instability"

    # Verify confusion matrix has strong diagonal
    cm = confusion_matrix(y_test, y_pred)
    diag_pct = np.diag(cm).sum() / cm.sum()
    assert diag_pct >= 0.95


def test_farm_segmentation_kmeans_accuracy(synthetic_datasets: dict):
    """Test that K-Means clustering achieves >0.55 silhouette score and >85% PCA variance."""
    df_cluster = synthetic_datasets["clustering"]
    feature_cols = [f"pillar_{p}_score" for p in range(1, 9)]
    X = df_cluster[feature_cols].values

    kmeans = KMeans(n_clusters=3, random_state=42, n_init=15)
    labels = kmeans.fit_predict(X)

    sil = float(silhouette_score(X, labels))
    assert sil >= 0.55, f"Silhouette score {sil:.4f} is below 0.55 threshold"

    # PCA 2D Explained Variance
    pca = PCA(n_components=2, random_state=42)
    pca.fit(X)
    explained_var = float(np.sum(pca.explained_variance_ratio_))
    assert explained_var >= 0.85, f"PCA explained variance {explained_var:.4f} is below 85%"

    # Cluster balance
    unique, counts = np.unique(labels, return_counts=True)
    assert len(unique) == 3
    assert all(c >= 100 for c in counts), "Clusters are severely imbalanced"


def test_evidence_anomaly_scanner_accuracy(synthetic_datasets: dict):
    """Test that Isolation Forest and multi-modal checks effectively separate telemetry anomalies from clean audits."""
    df_ev = synthetic_datasets["evidence"]

    feature_cols = ["distance_to_centroid_km", "time_delta_seconds"]
    X = df_ev[feature_cols].values
    y_true_anomaly = df_ev["is_anomaly"].values

    iso = IsolationForest(contamination=0.10, random_state=42)
    pred = iso.fit_predict(X)
    # Map -1 (anomaly) -> 1, 1 (normal) -> 0
    y_pred_anomaly = np.where(pred == -1, 1, 0)

    # Anomaly detection rate for numerical outliers (geofence & timestamp breaches)
    geo_or_time_anoms = df_ev["anomaly_type"].isin(["gps_geofence_breach", "timestamp_monotonicity_violation"])
    tp_geo_time = np.sum((y_pred_anomaly == 1) & (geo_or_time_anoms.values == True))
    total_geo_time = np.sum(geo_or_time_anoms.values == True)

    if total_geo_time > 0:
        recall_geo_time = tp_geo_time / total_geo_time
        assert recall_geo_time >= 0.70, f"Telemetry outlier recall {recall_geo_time:.4f} is below 70%"

    # Overall precision on flagged telemetry anomalies
    precision = precision_score(y_true_anomaly, y_pred_anomaly, zero_division=0)
    assert precision >= 0.40, f"Anomaly precision {precision:.4f} is below 40%"

