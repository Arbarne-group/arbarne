"""Seed the canonical FFF framework content into the database.

Run with:
    python -m app.scripts.seed_framework

Idempotent: re-running with the same content does not duplicate rows.
"""

from __future__ import annotations

import logging
import sys

from sqlalchemy import select

import app.models  # noqa: F401 - ensure all ORM models are registered
from app.db.session import Base, SessionLocal, engine
from app.models.framework import Capability, Pillar, Question
from app.scripts.seed_data import PILLARS, CAPABILITIES, QUESTIONS

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)-7s | %(message)s")
log = logging.getLogger("seed")


def main() -> int:
    """Seed pillars, capabilities, and questions. Returns 0 on success."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        _seed_pillars(db)
        _seed_capabilities(db)
        _seed_questions(db)
        _verify(db)
        db.commit()
    except Exception:
        db.rollback()
        log.exception("Seed failed")
        return 1
    finally:
        db.close()
    log.info("Seed complete.")
    return 0


def _seed_pillars(db) -> None:
    for p in PILLARS:
        db.merge(Pillar(**p))
        log.info("Upserted pillar %s: %s", p["id"], p["name"])


def _seed_capabilities(db) -> None:
    for c in CAPABILITIES:
        db.merge(Capability(**c))
        log.info("Upserted capability %s: %s", c["id"], c["name"])


def _seed_questions(db) -> None:
    for q in QUESTIONS:
        db.merge(Question(**q))
        log.info("Upserted question %s", q["id"])
    db.flush()


def _verify(db) -> None:
    """Sanity-check that the canonical counts are present."""
    pillar_count = db.execute(select(Pillar)).scalars().all()
    cap_count = db.execute(select(Capability)).scalars().all()
    q_count = db.execute(select(Question)).scalars().all()

    log.info("Verification: %d pillars, %d capabilities, %d questions", len(pillar_count), len(cap_count), len(q_count))

    if len(pillar_count) != 8:
        log.warning("Expected 8 pillars, got %d", len(pillar_count))
    if len(cap_count) != 40:
        log.warning("Expected 40 capabilities, got %d", len(cap_count))
    if len(q_count) != 200:
        log.warning("Expected 200 questions, got %d", len(q_count))


if __name__ == "__main__":
    sys.exit(main())
