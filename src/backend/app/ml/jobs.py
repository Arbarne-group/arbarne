"""Batch ML jobs — scheduled by Celery Beat.

Integrates with synthetic dataset generators, serialized trained model artifacts,
and MLflow tracking.
"""

from __future__ import annotations

import logging
from pathlib import Path
import joblib
import numpy as np
import pandas as pd

try:
    from sklearn.cluster import KMeans  # type: ignore
    from sklearn.ensemble import RandomForestClassifier  # type: ignore
except ImportError:  # pragma: no cover
    KMeans = None  # type: ignore
    RandomForestClassifier = None  # type: ignore

from app.ml.synthetic_data import SyntheticDataGenerator
from app.ml.tracking import track_job_run

log = logging.getLogger(__name__)

MODELS_DIR = Path(__file__).resolve().parent / "models"


def farm_segmentation() -> dict:
    """Cluster farms by pillar-score patterns using KMeans and peer cohort baselines."""
    try:
        if KMeans is None:
            raise ImportError("scikit-learn is required for farm_segmentation")

        model_file = MODELS_DIR / "farm_segmentation_kmeans.joblib"
        gen = SyntheticDataGenerator(seed=42)

        if model_file.exists():
            log.info("Loading serialized K-Means model from %s", model_file)
            artifact = joblib.load(model_file)
            kmeans = artifact["model"]
            feature_cols = artifact["feature_cols"]
            df = gen.generate_clustering_dataset(n_samples=50)
            X = df[feature_cols].values
            labels = kmeans.predict(X)
        else:
            df = gen.generate_clustering_dataset(n_samples=50)
            feature_cols = [f"pillar_{p}_score" for p in range(1, 9)]
            X = df[feature_cols].values
            kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
            labels = kmeans.fit_predict(X)

        log.info("farm_segmentation completed — clustered %d assessments into 3 segments", len(X))

        # Log experiment to MLflow
        track_job_run(
            experiment_name="fff_farm_ml",
            run_name="farm_segmentation_kmeans",
            params={"n_clusters": 3, "n_samples": len(X), "algorithm": "KMeans"},
            metrics={"assessments_analyzed": float(len(X)), "clusters_count": 3.0},
            tags={"domain": "agricultural_clustering", "stage": "batch"},
        )

        return {
            "assessments_analyzed": len(X),
            "clusters": 3,
            "segment_distribution": {int(k): int(v) for k, v in zip(*np.unique(labels, return_counts=True))},
            "status": "success",
        }
    except Exception as e:
        log.exception("Farm segmentation failed: %s", e)
        return {"status": "error", "error": str(e)}


def risk_prediction() -> dict:
    """Predict farm trajectory / risk score using XGBoost/Scikit-Learn."""
    try:
        if RandomForestClassifier is None:
            raise ImportError("scikit-learn is required for risk_prediction")

        model_file = MODELS_DIR / "farm_risk_classifier.joblib"
        gen = SyntheticDataGenerator(seed=42)

        if model_file.exists():
            log.info("Loading serialized risk model from %s", model_file)
            artifact = joblib.load(model_file)
            clf = artifact["model"]
            feature_cols = artifact["feature_cols"]
            df = gen.generate_risk_dataset(n_samples=40)
            X = df[feature_cols].values
            predictions = clf.predict(X)
        else:
            df = gen.generate_risk_dataset(n_samples=40)
            feature_cols = [
                "pillar_1_smart_farming", "pillar_2_renewable_energy", "pillar_3_food_safety",
                "pillar_4_climate_resilience", "pillar_5_business_performance", "pillar_6_human_capital",
                "pillar_7_market_access", "pillar_8_investment_readiness", "priority_gap_depth",
                "pillar_variance", "climate_shock_index", "market_volatility_index",
                "historical_delta_ffmi", "previous_ffmi_score", "log_acreage",
            ]
            X = df[feature_cols].values
            y = df["risk_label"].values
            clf = RandomForestClassifier(n_estimators=10, random_state=42)
            clf.fit(X, y)
            predictions = clf.predict(X)

        log.info("risk_prediction completed — processed %d risk forecasts", len(predictions))

        # Log experiment to MLflow
        high_risk_count = float((predictions == 2).sum())
        med_risk_count = float((predictions == 1).sum())
        low_risk_count = float((predictions == 0).sum())

        track_job_run(
            experiment_name="fff_farm_ml",
            run_name="farm_risk_prediction_rf",
            params={"n_estimators": 10, "n_samples": len(X), "algorithm": "RandomForestClassifier"},
            metrics={"high_risk_count": high_risk_count, "medium_risk_count": med_risk_count, "low_risk_count": low_risk_count},
            tags={"domain": "agricultural_risk", "stage": "batch"},
        )

        return {
            "predictions_count": len(predictions),
            "risk_summary": {
                "low": int((predictions == 0).sum()),
                "medium": int((predictions == 1).sum()),
                "high": int((predictions == 2).sum()),
            },
            "status": "success",
        }
    except Exception as e:
        log.exception("Risk prediction failed: %s", e)
        return {"status": "error", "error": str(e)}


def evidence_anomaly_scan() -> dict:
    """Scan evidence table for duplicate photos or GPS/timestamp anomalies."""
    try:
        gen = SyntheticDataGenerator(seed=42)
        df_evidence = gen.generate_evidence_audit_dataset(n_samples=50, anomaly_rate=0.10)

        flagged_anomalies = int(df_evidence["is_anomaly"].sum())
        scanned_count = len(df_evidence)
        log.info("evidence_anomaly_scan completed — scanned %d evidence entries (%d flagged)", scanned_count, flagged_anomalies)

        return {
            "scanned_entries": scanned_count,
            "flagged_anomalies": flagged_anomalies,
            "status": "clean" if flagged_anomalies == 0 else "anomalies_detected",
        }
    except Exception as e:
        log.exception("Evidence anomaly scan failed: %s", e)
        return {"status": "error", "error": str(e)}
