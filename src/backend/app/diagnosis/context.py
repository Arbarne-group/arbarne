"""Build the combined diagnosis context from assessment + farmer profile + farm.

This is the single source of truth that feeds both the LLM prompt and the
deterministic fallback. Scoring is *never* recomputed here — we only read the
deterministic results already stored on the assessment and merge them with the
farmer's self-described profile so the subsequent analysis can be personalised.
"""

from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.models.framework import Capability, Pillar
from app.diagnosis.template import pillar_level_from_score


def _safe(v: Any, default: Any = "") -> Any:
    return v if v not in (None, "", []) else default


def build_diagnosis_context(
    db: Session,
    assessment,
    farmer_profile: dict | None,
    farm,
    recommendations: list,
) -> dict[str, Any]:
    """Assemble a serialisable context dict for diagnosis generation."""
    farmer_profile = farmer_profile or {}

    # Framework metadata
    pillars_meta = (
        db.query(Pillar).order_by(Pillar.id).all()
    )
    pillar_meta_by_id = {p.id: p for p in pillars_meta}
    cap_meta = db.query(Capability).all()
    cap_by_id: dict[str, Capability] = {c.id: c for c in cap_meta}

    pillar_scores: dict[str, float] = assessment.pillar_scores or {}
    capability_status: dict[str, str] = assessment.capability_status or {}

    # Group recommendations by pillar
    recs_by_pillar: dict[int, list] = {}
    for r in recommendations:
        pid = getattr(r, "pillar_id", None)
        if pid is None:
            continue
        recs_by_pillar.setdefault(int(pid), []).append(r)

    pillar_ctx: list[dict[str, Any]] = []
    for pid_str, score in pillar_scores.items():
        try:
            pid = int(pid_str)
        except (TypeError, ValueError):
            continue
        meta = pillar_meta_by_id.get(pid)
        pname = meta.name if meta else f"Pillar {pid}"
        status = pillar_level_from_score(float(score))

        # Capabilities belonging to this pillar
        caps = []
        for cap in cap_meta:
            if getattr(cap, "pillar_id", None) != pid:
                continue
            caps.append(
                {
                    "id": cap.id,
                    "name": cap.name,
                    "status": capability_status.get(cap.id, "non_existent"),
                }
            )

        # Gap recommendations for this pillar
        gap_recs = []
        for r in recs_by_pillar.get(pid, []):
            gap_recs.append(
                {
                    "capability_id": getattr(r, "capability_id", None),
                    "capability_name": (
                        cap_by_id.get(getattr(r, "capability_id", ""), None).name
                        if getattr(r, "capability_id", None) in cap_by_id
                        else getattr(r, "capability_id", "")
                    ),
                    "recommended_action": _safe(getattr(r, "recommended_action", "")),
                    "recommended_learning": _safe(getattr(r, "recommended_learning", "")),
                    "potential_service": _safe(getattr(r, "potential_service", "")),
                    "priority": _safe(getattr(r, "priority", "medium_term")),
                    "why_it_matters": _safe(getattr(r, "why_it_matters", "")),
                    "gap": _safe(getattr(r, "gap", "")),
                }
            )

        pillar_ctx.append(
            {
                "pillar_id": pid,
                "pillar_name": pname,
                "score": float(score),
                "status": status,
                "principle": getattr(meta, "principle", "") if meta else "",
                "guiding_question": getattr(meta, "guiding_question", "") if meta else "",
                "capabilities": caps,
                "gap_recommendations": gap_recs,
            }
        )

    # Order pillars by id for stable output
    pillar_ctx.sort(key=lambda p: p["pillar_id"])

    farm_ctx = {}
    if farm:
        farm_ctx = {
            "name": getattr(farm, "name", None),
            "region": getattr(farm, "region", None),
            "crop_type": getattr(farm, "crop_type", None),
            "size_acres": getattr(farm, "size_acres", None),
        }

    return {
        "farm": farm_ctx,
        "farmer_profile": farmer_profile,
        "assessment": {
            "ffmi_score": assessment.ffmi_score,
            "tier": assessment.tier,
            "tier_classification": _tier_classification(assessment.tier),
            "pillars": pillar_ctx,
        },
        "framework": {
            "pillar_names": {str(p.id): p.name for p in pillars_meta},
            "transitions": [
                f"{t['from']} → {t['to']}" for t in _transitions()
            ],
        },
    }


def _transitions() -> list[dict[str, str]]:
    # Imported lazily to avoid a circular import with template.
    from app.diagnosis.template import TRANSITIONS

    return TRANSITIONS


def _tier_classification(tier: int | None) -> str:
    labels = {
        1: "Informal Farm",
        2: "Emerging Agribusiness",
        3: "Structured Farm",
        4: "Investment Ready Farm",
        5: "Future Ready Farm",
    }
    return labels.get(int(tier) if tier is not None else 3, "Structured Farm")
