"""MLflow experiment tracking helper for Future Farms Framework (FFF)."""

from __future__ import annotations

import os
import logging
from typing import Any, Dict, Optional

os.environ.setdefault("GIT_PYTHON_REFRESH", "quiet")

log = logging.getLogger(__name__)

def init_mlflow() -> bool:
    """Initialize MLflow tracking URI and experiment setting safely."""
    try:
        import mlflow
        tracking_uri = os.getenv("MLFLOW_TRACKING_URI", "sqlite:///mlflow.db")
        mlflow.set_tracking_uri(tracking_uri)
        log.info("MLflow tracking initialized at %s", tracking_uri)
        return True
    except Exception as e:
        log.warning("Could not initialize MLflow: %s", e)
        return False

def track_job_run(
    experiment_name: str,
    run_name: str,
    params: Dict[str, Any],
    metrics: Dict[str, float],
    tags: Optional[Dict[str, str]] = None,
) -> Optional[str]:
    """Track an ML batch job run in MLflow."""
    if not init_mlflow():
        return None

    try:
        import mlflow
        mlflow.set_experiment(experiment_name)

        with mlflow.start_run(run_name=run_name) as run:
            if tags:
                mlflow.set_tags(tags)

            for key, val in params.items():
                mlflow.log_param(key, val)

            for key, val in metrics.items():
                mlflow.log_metric(key, val)

            log.info("Logged MLflow run '%s' (ID: %s)", run_name, run.info.run_id)
            return run.info.run_id
    except Exception as e:
        log.error("Failed to log MLflow run '%s': %s", run_name, e)
        return None
