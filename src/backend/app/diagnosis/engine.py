"""Orchestrates the combined diagnosis report.

Combines the assessment result, the farmer profile and farm context into a single
context, then asks the LLM to populate the structured template. If the LLM is
unavailable, a deterministic rule-based diagnosis (same shape) is returned so the
report always renders. Scoring is never affected by this module.
"""

from __future__ import annotations

import datetime
import logging
from typing import Any

from sqlalchemy.orm import Session

from app.diagnosis.context import build_diagnosis_context
from app.diagnosis.prompt import build_diagnosis_prompt
from app.diagnosis.template import build_fallback_diagnosis
from app.llm.client import llm_client

logger = logging.getLogger(__name__)


def generate_diagnosis_report(
    db: Session,
    assessment,
    farmer_profile: dict | None,
    farm,
    recommendations: list,
) -> dict[str, Any]:
    """Produce a complete per-pillar + overall diagnosis for an assessment."""
    context = build_diagnosis_context(
        db=db,
        assessment=assessment,
        farmer_profile=farmer_profile,
        farm=farm,
        recommendations=recommendations,
    )

    system_prompt, user_prompt = build_diagnosis_prompt(context)

    try:
        report = llm_client.generate_diagnosis(system_prompt, user_prompt)
        report["generated_at"] = datetime.datetime.now(
            datetime.timezone.utc
        ).isoformat()
        return report
    except Exception as e:  # noqa: BLE001 - deterministic fallback is acceptable
        logger.info("Using deterministic diagnosis fallback: %s", e)
        fallback = build_fallback_diagnosis(context)
        fallback["generated_at"] = datetime.datetime.now(
            datetime.timezone.utc
        ).isoformat()
        return fallback
