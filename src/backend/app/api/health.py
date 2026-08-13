"""Healthcheck endpoint."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter(tags=["health"])


@router.get("/health")
def health(db: Session = Depends(get_db)) -> dict:
    """Lightweight health probe used by container healthcheck and smoke tests."""
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


@router.get("/healthz")
def healthz() -> dict:
    """Process-only health check — works even when DB is down."""
    return {"status": "ok"}
