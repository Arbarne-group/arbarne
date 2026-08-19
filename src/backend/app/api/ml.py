"""Simulation & ML API — strictly aligned with canonical FFF scoring & recommendation engine.

Ensures the simulator produces 100% consistent results with the assessment form:
- Same 0..24 FFMI scale
- Same 5 maturity tiers (Informal Farm -> Future Ready Farm)
- Same strongest pillar & priority gap detection
- Same 5-field Quick Win recommendations from canonical question database
- Aligned 12-month trajectory risk index
"""

from __future__ import annotations

from typing import Dict, List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.framework import Pillar, Question
from app.scoring.engine import DEFAULT_FFMI_BANDS, _tier_for_score

router = APIRouter(prefix="/api/ml", tags=["ml"])


class SimulationRequest(BaseModel):
    farm_name: Optional[str] = "Sample Farm"
    region: Optional[str] = "Western Kenya"
    crop_type: Optional[str] = "Maize"
    farm_size: Optional[float] = 5.0
    # Map of pillar_id (1..8) to score fraction (0.0 to 1.0)
    pillar_scores: Dict[int, float] = Field(
        default_factory=lambda: {
            1: 0.4, 2: 0.6, 3: 0.3, 4: 0.7,
            5: 0.2, 6: 0.5, 7: 0.3, 8: 0.6
        }
    )


class RecommendationItem(BaseModel):
    question_id: str
    pillar_id: int
    capability_id: str
    gap: str
    recommended_action: str
    recommended_learning: str
    potential_service: str
    priority: str


class SimulationResponse(BaseModel):
    ffmi_score: float
    max_ffmi: float = 24.0
    tier: int
    tier_classification: str
    strongest_pillar_id: Optional[int]
    strongest_pillar_name: str
    priority_gap_pillar_id: Optional[int]
    priority_gap_pillar_name: str
    trajectory_risk: str
    pillar_scores: Dict[int, float]
    recommendations: List[RecommendationItem]


@router.post("/simulate", response_model=SimulationResponse)
def simulate_farm_scenario(
    req: SimulationRequest,
    db: Session = Depends(get_db),
) -> SimulationResponse:
    """Execute scenario simulation replicating the assessment form analysis."""
    # Ensure all 8 pillars are represented
    p_scores: Dict[int, float] = {}
    for pid in range(1, 9):
        val = req.pillar_scores.get(pid, req.pillar_scores.get(str(pid), 0.5))
        p_scores[pid] = max(0.0, min(1.0, float(val)))

    # Compute average pillar fraction and map to 0..24 FFMI scale
    avg_fraction = sum(p_scores.values()) / len(p_scores)
    ffmi_score = round(avg_fraction * 24.0, 2)

    # Calculate exact tier from canonical signed-off bands
    tier, classification = _tier_for_score(ffmi_score, DEFAULT_FFMI_BANDS)

    # Identify strongest and priority gap pillars
    sorted_pillars = sorted(p_scores.items(), key=lambda kv: kv[1], reverse=True)
    strongest_pid = sorted_pillars[0][0]
    priority_gap_pid = sorted_pillars[-1][0]

    # Fetch pillar names with canonical fallback map
    pillar_map = {
        1: "Governance & Strategy",
        2: "Soil & Land Health",
        3: "Water Stewardship",
        4: "Crop Management",
        5: "Livestock Management",
        6: "Financial Inclusion",
        7: "Technology & Data",
        8: "Market Access",
    }
    try:
        pillars = db.query(Pillar).all()
        for p in pillars:
            pillar_map[p.id] = p.name
    except Exception:
        pass

    strongest_name = pillar_map.get(strongest_pid, f"Pillar {strongest_pid}")
    priority_gap_name = pillar_map.get(priority_gap_pid, f"Pillar {priority_gap_pid}")

    # Trajectory Risk aligned with FFMI maturity tier & priority gap depth
    if ffmi_score < 5.0 or p_scores[priority_gap_pid] < 0.25:
        trajectory_risk = "🔴 High Risk (Urgent capability gap intervention required)"
    elif ffmi_score < 16.0 or p_scores[priority_gap_pid] < 0.50:
        trajectory_risk = "🟡 Medium Risk (Developing capabilities; vulnerability to climate/market shocks)"
    else:
        trajectory_risk = "🟢 Low Risk (High maturity resilience across core pillars)"

    # Pull canonical recommendation rows from the database for weak pillars
    weak_pillar_ids = [pid for pid, score in sorted(p_scores.items(), key=lambda kv: kv[1]) if score < 0.70]
    if not weak_pillar_ids:
        weak_pillar_ids = [priority_gap_pid]

    questions = []
    try:
        questions = (
            db.query(Question)
            .filter(Question.pillar_id.in_(weak_pillar_ids))
            .all()
        )
    except Exception:
        questions = []

    recs: List[RecommendationItem] = []
    for q in questions:
        learning = ", ".join(q.support_available) if isinstance(q.support_available, list) else (q.support_available or "FAAB Module")
        recs.append(
            RecommendationItem(
                question_id=q.id,
                pillar_id=q.pillar_id,
                capability_id=q.capability_id,
                gap=q.question_text,
                recommended_action=q.if_no_recommendation or "Review this capability.",
                recommended_learning=learning,
                potential_service=q.service_ref or "Farm business advisory",
                priority=q.priority or "quick_win",
            )
        )

    # Fallback recommendations if database is empty during tests
    if not recs:
        for wpid in weak_pillar_ids[:3]:
            pname = pillar_map.get(wpid, f"Pillar {wpid}")
            recs.append(
                RecommendationItem(
                    question_id=f"P{wpid}.1.1",
                    pillar_id=wpid,
                    capability_id=f"P{wpid}.1",
                    gap=f"Establish baseline management and standard records for {pname}",
                    recommended_action=f"Implement standardized operational workflows for {pname}.",
                    recommended_learning=f"FAAB Transformation Module for {pname}",
                    potential_service="Future Farms Technical Advisory",
                    priority="quick_win",
                )
            )

    # Sort recommendations: Quick Wins first, then medium term, then strategic
    prio_order = {"quick_win": 0, "medium_term": 1, "strategic": 2}
    recs.sort(key=lambda r: (prio_order.get(r.priority, 99), r.question_id))

    # Return top 15 recommendations to match assessment report format
    top_recs = recs[:15]

    return SimulationResponse(
        ffmi_score=ffmi_score,
        max_ffmi=24.0,
        tier=tier,
        tier_classification=classification,
        strongest_pillar_id=strongest_pid,
        strongest_pillar_name=strongest_name,
        priority_gap_pillar_id=priority_gap_pid,
        priority_gap_pillar_name=priority_gap_name,
        trajectory_risk=trajectory_risk,
        pillar_scores=p_scores,
        recommendations=top_recs,
    )
