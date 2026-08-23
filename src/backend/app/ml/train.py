"""End-to-end model training pipeline for Future Farms Framework (FFF) ML subsystem.

Trains and validates:
1. Farm Peer Cohort Segmentation (K-Means Clustering, k=3)
2. 12-Month Trajectory Default Risk Forecaster (Random Forest / XGBoost Multi-Class)
3. Field Evidence Anomaly Scanner (Rule-based & Isolation)

Tracks all metrics, hyperparameters, and artifacts to MLflow (`fff_farm_ml`).
Serializes trained models to `src/backend/app/ml/models/`.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
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

# Add backend directory to sys.path
CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_ROOT = CURRENT_DIR.parent.parent
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.ml.synthetic_data import SyntheticDataGenerator
from app.ml.tracking import track_job_run

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
log = logging.getLogger("train_fff_models")

MODELS_DIR = CURRENT_DIR / "models"


def ensure_directories() -> None:
    """Ensure models directory exists."""
    MODELS_DIR.mkdir(parents=True, exist_ok=True)


def train_farm_segmentation(
    df_clustering: pd.DataFrame,
    n_clusters: int = 3,
    seed: int = 42,
) -> Tuple[KMeans, Dict[str, Any]]:
    """Train K-Means clustering on 8-pillar normalized score vectors."""
    log.info("--- Training Farm Segmentation Model (K-Means, k=%d) ---", n_clusters)
    feature_cols = [f"pillar_{p}_score" for p in range(1, 9)]
    X = df_clustering[feature_cols].values

    # Fit K-Means
    kmeans = KMeans(n_clusters=n_clusters, random_state=seed, n_init=15, max_iter=300)
    cluster_labels = kmeans.fit_predict(X)

    # Evaluate
    sil_score = float(silhouette_score(X, cluster_labels))
    inertia = float(kmeans.inertia_)

    # Cluster distribution
    unique, counts = np.unique(cluster_labels, return_counts=True)
    dist = {int(k): int(v) for k, v in zip(unique, counts)}

    # PCA 2D coordinates for visual mapping
    pca = PCA(n_components=2, random_state=seed)
    pca.fit(X)
    explained_var = float(np.sum(pca.explained_variance_ratio_))

    metrics = {
        "silhouette_score": round(sil_score, 4),
        "inertia": round(inertia, 2),
        "samples_count": len(X),
        "clusters_count": n_clusters,
        "pca_explained_variance_ratio": round(explained_var, 4),
    }

    params = {
        "n_clusters": n_clusters,
        "n_init": 15,
        "max_iter": 300,
        "algorithm": "KMeans",
        "features_dim": len(feature_cols),
    }

    log.info("Segmentation Metrics: Silhouette=%.4f, Inertia=%.2f, Cluster Dist=%s", sil_score, inertia, dist)

    # Log to MLflow
    track_job_run(
        experiment_name="fff_farm_ml",
        run_name="farm_segmentation_kmeans_training",
        params=params,
        metrics={"silhouette_score": sil_score, "inertia": inertia, "pca_var": explained_var},
        tags={"stage": "training", "model_type": "KMeans", "dataset": "synthetic_clustering"},
    )

    # Save serialized model artifact
    ensure_directories()
    model_path = MODELS_DIR / "farm_segmentation_kmeans.joblib"
    artifact_payload = {
        "model": kmeans,
        "pca": pca,
        "feature_cols": feature_cols,
        "cluster_centers": kmeans.cluster_centers_.tolist(),
        "metrics": metrics,
    }
    joblib.dump(artifact_payload, model_path)
    log.info("Saved clustering model artifact to %s", model_path)

    return kmeans, {
        "metrics": metrics,
        "distribution": dist,
        "cluster_centers": kmeans.cluster_centers_.tolist(),
        "model_path": str(model_path),
    }


def train_risk_forecaster(
    df_risk: pd.DataFrame,
    seed: int = 42,
) -> Tuple[RandomForestClassifier, Dict[str, Any]]:
    """Train supervised 12-month trajectory vulnerability and default risk classifier."""
    log.info("--- Training 12-Month Trajectory Risk Forecaster (Random Forest) ---")

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
        "climate_shock_index",
        "market_volatility_index",
        "historical_delta_ffmi",
        "previous_ffmi_score",
        "log_acreage",
    ]

    X = df_risk[feature_cols].values
    y = df_risk["risk_label"].values

    # Train / Test split (80/20 stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=seed, stratify=y
    )

    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=seed,
        n_jobs=-1,
    )
    clf.fit(X_train, y_train)

    # Predictions & metrics
    y_pred = clf.predict(X_test)
    y_proba = clf.predict_proba(X_test)

    acc = float(accuracy_score(y_test, y_pred))
    f1_macro = float(f1_score(y_test, y_pred, average="macro"))
    f1_weighted = float(f1_score(y_test, y_pred, average="weighted"))
    prec_macro = float(precision_score(y_test, y_pred, average="macro"))
    rec_macro = float(recall_score(y_test, y_pred, average="macro"))

    # Cross-validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=seed)
    cv_scores = cross_val_score(clf, X, y, cv=cv, scoring="f1_macro")
    cv_mean = float(np.mean(cv_scores))
    cv_std = float(np.std(cv_scores))

    # Feature importances
    importances = {
        col: round(float(imp), 4)
        for col, imp in sorted(zip(feature_cols, clf.feature_importances_), key=lambda x: x[1], reverse=True)
    }

    cm = confusion_matrix(y_test, y_pred).tolist()

    metrics = {
        "test_accuracy": round(acc, 4),
        "test_f1_macro": round(f1_macro, 4),
        "test_f1_weighted": round(f1_weighted, 4),
        "test_precision_macro": round(prec_macro, 4),
        "test_recall_macro": round(rec_macro, 4),
        "cv_f1_macro_mean": round(cv_mean, 4),
        "cv_f1_macro_std": round(cv_std, 4),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
    }

    params = {
        "n_estimators": 100,
        "max_depth": 6,
        "class_weight": "balanced",
        "algorithm": "RandomForestClassifier",
        "features_dim": len(feature_cols),
    }

    log.info("Risk Model Metrics: Accuracy=%.4f, F1-Macro=%.4f (CV: %.4f ± %.4f)", acc, f1_macro, cv_mean, cv_std)
    log.info("Top 3 Risk Drivers: %s", list(importances.items())[:3])

    # Log to MLflow
    track_job_run(
        experiment_name="fff_farm_ml",
        run_name="farm_risk_prediction_rf_training",
        params=params,
        metrics={
            "accuracy": acc,
            "f1_macro": f1_macro,
            "f1_weighted": f1_weighted,
            "cv_f1_mean": cv_mean,
        },
        tags={"stage": "training", "model_type": "RandomForest", "dataset": "synthetic_risk"},
    )

    # Save serialized model artifact
    ensure_directories()
    model_path = MODELS_DIR / "farm_risk_classifier.joblib"
    artifact_payload = {
        "model": clf,
        "feature_cols": feature_cols,
        "classes": [0, 1, 2],
        "class_labels": ["Low Risk", "Medium Risk", "High Risk"],
        "feature_importances": importances,
        "confusion_matrix": cm,
        "metrics": metrics,
    }
    joblib.dump(artifact_payload, model_path)
    log.info("Saved risk model artifact to %s", model_path)

    return clf, {
        "metrics": metrics,
        "feature_importances": importances,
        "confusion_matrix": cm,
        "model_path": str(model_path),
    }


def train_evidence_anomaly_detector(
    df_evidence: pd.DataFrame,
    seed: int = 42,
) -> Tuple[IsolationForest, Dict[str, Any]]:
    """Train unsupervised telemetry anomaly detector and validate against ground truth flags."""
    log.info("--- Training Evidence Audit Anomaly Detector ---")

    feature_cols = ["distance_to_centroid_km", "time_delta_seconds", "photo_lat", "photo_lon"]
    X = df_evidence[feature_cols].values
    y_true = df_evidence["is_anomaly"].values

    iso = IsolationForest(
        n_estimators=100,
        contamination=0.08,
        random_state=seed,
        n_jobs=-1,
    )
    iso.fit(X)

    # Anomaly predictions: -1 (anomaly), 1 (normal) -> convert to 1 (anomaly), 0 (normal)
    raw_preds = iso.predict(X)
    y_pred = np.where(raw_preds == -1, 1, 0)

    acc = float(accuracy_score(y_true, y_pred))
    prec = float(precision_score(y_true, y_pred, zero_division=0))
    rec = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))

    metrics = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1": round(f1, 4),
        "samples_count": len(X),
        "flagged_count": int(np.sum(y_pred)),
        "true_anomaly_count": int(np.sum(y_true)),
    }

    log.info("Evidence Anomaly Detector: Prec=%.4f, Recall=%.4f, F1=%.4f", prec, rec, f1)

    # Log to MLflow
    track_job_run(
        experiment_name="fff_farm_ml",
        run_name="evidence_anomaly_scanner_training",
        params={"contamination": 0.08, "n_estimators": 100, "algorithm": "IsolationForest"},
        metrics={"accuracy": acc, "precision": prec, "recall": rec, "f1": f1},
        tags={"stage": "training", "model_type": "IsolationForest", "dataset": "synthetic_evidence"},
    )

    # Save model artifact
    ensure_directories()
    model_path = MODELS_DIR / "evidence_anomaly_detector.joblib"
    artifact_payload = {
        "model": iso,
        "feature_cols": feature_cols,
        "metrics": metrics,
    }
    joblib.dump(artifact_payload, model_path)
    log.info("Saved evidence detector artifact to %s", model_path)

    return iso, {
        "metrics": metrics,
        "model_path": str(model_path),
    }


def train_all(
    data_dir: Optional[str] = None,
    num_samples: int = 1000,
    seed: int = 42,
) -> Dict[str, Any]:
    """Train full suite of ML models using synthetic datasets."""
    log.info("Starting FFF ML Subsystem Model Training Pipeline (seed=%d)...", seed)

    # Load from data directory if exists, otherwise generate on-the-fly
    if data_dir and (Path(data_dir) / "farm_clustering_features.csv").exists():
        log.info("Loading pre-generated synthetic datasets from %s...", data_dir)
        p = Path(data_dir)
        df_cluster = pd.read_csv(p / "farm_clustering_features.csv")
        df_risk = pd.read_csv(p / "farm_risk_training.csv")
        df_evidence = pd.read_csv(p / "evidence_anomaly_audit.csv")
    else:
        log.info("Generating synthetic datasets in memory (n=%d)...", num_samples)
        gen = SyntheticDataGenerator(seed=seed)
        all_data = gen.generate_all_datasets(n_farms=num_samples, n_evidence=num_samples)
        df_cluster = all_data["clustering"]
        df_risk = all_data["risk"]
        df_evidence = all_data["evidence"]

    # 1. Farm Segmentation
    _, cluster_res = train_farm_segmentation(df_cluster, n_clusters=3, seed=seed)

    # 2. Risk Forecaster
    _, risk_res = train_risk_forecaster(df_risk, seed=seed)

    # 3. Evidence Anomaly Scanner
    _, evidence_res = train_evidence_anomaly_detector(df_evidence, seed=seed)

    results = {
        "clustering": cluster_res,
        "risk_forecaster": risk_res,
        "evidence_anomaly": evidence_res,
    }

    print("\n" + "=" * 80)
    print("=== FFF MACHINE LEARNING MODEL TRAINING PIPELINE RESULTS ===")
    print("=" * 80)
    print(f"1. Farm Segmentation (K-Means):")
    print(f"   - Silhouette Score: {cluster_res['metrics']['silhouette_score']:.4f}")
    print(f"   - PCA Variance:     {cluster_res['metrics']['pca_explained_variance_ratio']:.4f}")
    print(f"   - Artifact:         {cluster_res['model_path']}")
    print(f"2. 12-Month Trajectory Risk Forecaster (RandomForest):")
    print(f"   - Test Accuracy:    {risk_res['metrics']['test_accuracy']*100:.2f}%")
    print(f"   - Test F1-Macro:    {risk_res['metrics']['test_f1_macro']:.4f}")
    print(f"   - 5-Fold CV F1:     {risk_res['metrics']['cv_f1_macro_mean']:.4f} +/- {risk_res['metrics']['cv_f1_macro_std']:.4f}")
    print(f"   - Artifact:         {risk_res['model_path']}")
    print(f"3. Field Evidence Anomaly Scanner (IsolationForest):")
    print(f"   - Detection F1:     {evidence_res['metrics']['f1']:.4f}")
    print(f"   - Artifact:         {evidence_res['model_path']}")
    print("=" * 80 + "\n")

    return results


def main():
    parser = argparse.ArgumentParser(description="Train Future Farms Framework ML models on synthetic data.")
    parser.add_argument("--data-dir", type=str, default="data/synthetic", help="Path to synthetic datasets directory")
    parser.add_argument("--num-samples", type=int, default=1000, help="Number of samples to generate if data_dir missing")
    parser.add_argument("--seed", type=int, default=42, help="Random seed (default: 42)")

    args = parser.parse_args()
    train_all(data_dir=args.data_dir, num_samples=args.num_samples, seed=args.seed)


if __name__ == "__main__":
    main()
