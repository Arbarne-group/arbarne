"""Celery worker entry point.

Run with:
    celery -A app.worker.celery_app worker --loglevel=INFO

Tasks are scheduled by Celery Beat (configured in app.worker.beat_schedule)
or invoked manually from the FastAPI backend.
"""

from __future__ import annotations

import logging
from datetime import datetime
from uuid import uuid4

from celery import Celery

from app.core.config import settings
from app.ml import jobs as ml_jobs

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)-7s | %(message)s")
log = logging.getLogger("worker")


# ─── App instance ────────────────────────────────────────────────────
celery_app = Celery(
    "fff",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)

# ─── Periodic schedule (Celery Beat) ─────────────────────────────────
celery_app.conf.beat_schedule = {
    "run-segmentation-daily": {
        "task": "app.worker.run_segmentation",
        "schedule": 60 * 60 * 24,  # every 24h
    },
    "run-risk-prediction-daily": {
        "task": "app.worker.run_risk_prediction",
        "schedule": 60 * 60 * 24,
    },
    "run-evidence-anomaly-daily": {
        "task": "app.worker.run_evidence_anomaly",
        "schedule": 60 * 60 * 24,
    },
}


# ─── Tasks ───────────────────────────────────────────────────────────
@celery_app.task(name="app.worker.run_segmentation")
def run_segmentation() -> dict:
    """Cluster farms into segments for Insights."""
    run_id = str(uuid4())
    log.info("Starting segmentation job %s at %s", run_id, datetime.utcnow())
    result = ml_jobs.farm_segmentation()
    log.info("Segmentation job %s done: %s", run_id, result)
    return {"run_id": run_id, "result": result}


@celery_app.task(name="app.worker.run_risk_prediction")
def run_risk_prediction() -> dict:
    """Predictive model of farm trajectory / risk score."""
    run_id = str(uuid4())
    log.info("Starting risk prediction job %s at %s", run_id, datetime.utcnow())
    result = ml_jobs.risk_prediction()
    log.info("Risk prediction job %s done: %s", run_id, result)
    return {"run_id": run_id, "result": result}


@celery_app.task(name="app.worker.run_evidence_anomaly")
def run_evidence_anomaly() -> dict:
    """Detect photos / GPS anomalies in FFV evidence."""
    run_id = str(uuid4())
    log.info("Starting evidence anomaly job %s at %s", run_id, datetime.utcnow())
    result = ml_jobs.evidence_anomaly_scan()
    log.info("Evidence anomaly job %s done: %s", run_id, result)
    return {"run_id": run_id, "result": result}
