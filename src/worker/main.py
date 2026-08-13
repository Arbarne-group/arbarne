"""Worker entry point — re-export the Celery app from the backend package."""

from app.worker import celery_app  # noqa: F401

__all__ = ["celery_app"]
