"""Unit tests for FFF ML subsystem model training and validation pipeline."""

from pathlib import Path
import joblib
import numpy as np
import pandas as pd
import pytest

from app.ml.synthetic_data import SyntheticDataGenerator
from app.ml.train import (
    train_all,
    train_evidence_anomaly_detector,
    train_farm_segmentation,
    train_risk_forecaster,
)


@pytest.fixture
def synthetic_data():
    gen = SyntheticDataGenerator(seed=42)
    return gen.generate_all_datasets(n_farms=150, n_evidence=150)


def test_train_farm_segmentation(synthetic_data):
    df_cluster = synthetic_data["clustering"]
    model, report = train_farm_segmentation(df_cluster, n_clusters=3, seed=42)

    assert model is not None
    metrics = report["metrics"]
    assert metrics["clusters_count"] == 3
    assert metrics["silhouette_score"] > 0.40
    assert metrics["pca_explained_variance_ratio"] > 0.60
    assert len(report["cluster_centers"]) == 3

    # Check model artifact file
    model_path = Path(report["model_path"])
    assert model_path.exists()
    loaded = joblib.load(model_path)
    assert "model" in loaded
    assert "pca" in loaded


def test_train_risk_forecaster(synthetic_data):
    df_risk = synthetic_data["risk"]
    clf, report = train_risk_forecaster(df_risk, seed=42)

    assert clf is not None
    metrics = report["metrics"]
    assert metrics["test_accuracy"] >= 0.85
    assert metrics["test_f1_macro"] >= 0.80
    assert metrics["cv_f1_macro_mean"] >= 0.80

    # Ensure feature importances exist and top features make sense
    importances = report["feature_importances"]
    assert len(importances) == 15
    assert "priority_gap_depth" in importances

    # Confusion matrix has shape 3x3
    cm = report["confusion_matrix"]
    assert len(cm) == 3
    assert all(len(row) == 3 for row in cm)

    model_path = Path(report["model_path"])
    assert model_path.exists()
    loaded = joblib.load(model_path)
    assert "model" in loaded
    assert "class_labels" in loaded


def test_train_evidence_anomaly_detector(synthetic_data):
    df_evidence = synthetic_data["evidence"]
    iso, report = train_evidence_anomaly_detector(df_evidence, seed=42)

    assert iso is not None
    metrics = report["metrics"]
    assert metrics["samples_count"] == len(df_evidence)
    assert metrics["flagged_count"] > 0

    model_path = Path(report["model_path"])
    assert model_path.exists()


def test_train_all_pipeline():
    results = train_all(num_samples=100, seed=123)
    assert "clustering" in results
    assert "risk_forecaster" in results
    assert "evidence_anomaly" in results
