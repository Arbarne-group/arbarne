"""Structured diagnosis template + deterministic fallback builder.

The diagnosis report has two levels:

* ``overall`` — a holistic, cross-pillar professional analysis.
* ``pillars`` — one structured diagnosis per pillar (status, strengths,
  gaps, root causes, personalised recommendations, coaching approach and
  alignment with the farmer's stated aspirations).

The fallback builder produces the *same shape* from deterministic rules so
the report always renders even when the LLM is unavailable. The LLM prompt
(see :mod:`app.diagnosis.prompt`) asks the model to populate this exact
shape.
"""

from __future__ import annotations

from typing import Any

# The 11 canonical FFF transitions (CLAUDE.md §13). Used to frame the
# transformation trajectory in the overall diagnosis.
TRANSITIONS: list[dict[str, str]] = [
    {"from": "Informal farming", "to": "Structured farm businesses"},
    {"from": "Experience-only decisions", "to": "Data-informed decisions"},
    {"from": "Manual and fragmented operations", "to": "Smart farm systems"},
    {"from": "Energy as a cost", "to": "Energy as a productive asset"},
    {"from": "Unsafe / undocumented production", "to": "Safe, traceable and compliant production"},
    {"from": "Vulnerability to climate shocks", "to": "Climate resilience"},
    {"from": "Farming as an activity", "to": "Farming as a business"},
    {"from": "Farmer-dependent operations", "to": "Skilled teams and systems"},
    {"from": "Production-led farming", "to": "Customer- and market-led farming"},
    {"from": "Limited access to capital", "to": "Investment readiness"},
    {"from": "Individual enterprise", "to": "Competitive, scalable enterprise"},
]

# Capability status -> maturity rank (higher = more mature)
_STATUS_RANK: dict[str, int] = {
    "non_existent": 0,
    "emerging": 1,
    "basic": 2,
    "developing": 3,
    "established": 4,
    "advanced": 5,
}

_TIER_LABELS: dict[int, str] = {
    1: "Informal Farm",
    2: "Emerging Agribusiness",
    3: "Structured Farm",
    4: "Investment Ready Farm",
    5: "Future Ready Farm",
}

# JSON schema (human-readable) embedded in the LLM prompt so the model
# returns strictly valid, parseable JSON matching our response model.
DIAGNOSIS_TEMPLATE_SCHEMA = """{
  "overall": {
    "executive_summary": "string — 3-5 sentence professional summary of where the farm is today and the single most important next move",
    "transformation_trajectory": "string — which of the 11 FFF transitions the farm is on and how far along",
    "holistic_strengths": ["string", ...],
    "priority_roadmap": ["string", ...],   // ordered cross-pillar actions, quick wins first
    "key_risks": ["string", ...],
    "vision_alignment": "string — how the plan connects to the farmer's stated 12-month, 3-5 year and 25-year aspirations"
  },
  "pillars": [
    {
      "pillar_id": integer,
      "pillar_name": "string",
      "status_level": "string — one of non_existent|emerging|basic|developing|established|advanced",
      "pillar_score": number,               // 0..1, do not change the provided score
      "strengths": ["string", ...],
      "key_gaps": ["string", ...],
      "root_causes": ["string", ...],        // link gaps to the farmer's profile (role, experience, decision style, obstacles)
      "personalised_recommendations": [
        {"action": "string", "priority": "quick_win|medium_term|strategic", "rationale": "string", "linked_to_profile": "string"}
      ],
      "coaching_approach": "string — how to best engage THIS farmer given their operating/learning/decision style",
      "aspiration_alignment": "string — how progress here serves their stated goals"
    }
  ]
}"""


def _label(status: str) -> str:
    return status.replace("_", " ").title()


def pillar_level_from_score(score: float) -> str:
    """Map a normalised (0..1) pillar score to the 6-level capability scale.

    The diagnosis template's ``status_level`` uses the same vocabulary as
    capability statuses (non_existent … advanced), not the pillar band labels
    (e.g. "Strategic Advantage").
    """
    score = float(score or 0.0)
    if score >= 0.833:
        return "advanced"
    if score >= 0.667:
        return "established"
    if score >= 0.5:
        return "developing"
    if score >= 0.333:
        return "basic"
    if score >= 0.167:
        return "emerging"
    return "non_existent"


def _coaching_approach(fp: dict[str, Any]) -> str:
    """Derive an engagement style from the farmer profile (deterministic)."""
    guidance = (fp.get("guidance_style") or "").lower()
    review = (fp.get("review_frequency") or "").lower()
    learning = (fp.get("update_preference") or "").lower()
    if "hands" in guidance or "practical" in guidance:
        return (
            "Engage through hands-on, on-farm demonstrations and short coaching "
            "visits rather than written material."
        )
    if "digital" in guidance or "app" in learning or "video" in learning:
        return (
            "Deliver via digital tools, short video and mobile reminders that fit "
            "a remote, low-touch engagement model."
        )
    if "peer" in guidance or "group" in guidance:
        return (
            "Use peer-learning groups and farmer field schools so the farmer learns "
            "from counterparts with similar contexts."
        )
    if "month" in review or "week" in review:
        return (
            "Maintain a regular review cadence (the farmer prefers frequent check-ins) "
            "with concise progress tracking."
        )
    return (
        "Blend practical demonstrations with simple written/visual summaries and a "
        "light-touch quarterly review."
    )


def _root_causes(fp: dict[str, Any], pillar_name: str) -> list[str]:
    """Heuristic root-cause hypotheses drawn from the farmer profile."""
    causes: list[str] = []
    mgmt = (fp.get("management_ability") or "").lower()
    if "limited" in mgmt:
        causes.append(
            "Limited management capacity constrains structured planning and follow-through in this area."
        )
    decision = (fp.get("decision_style") or "").lower()
    if decision == "experience" or "experience" in decision:
        causes.append(
            "Decisions here are experience-led rather than data-informed, limiting optimisation."
        )
    edu = (fp.get("education") or "").lower()
    if edu in ("none", "primary", "some primary"):
        causes.append(
            "Limited formal education reduces access to and uptake of technical training."
        )
    obstacles = fp.get("obstacles") or []
    if isinstance(obstacles, str):
        obstacles = [obstacles]
    if any("capital" in str(o).lower() for o in obstacles):
        causes.append(
            "Limited access to capital slows investment in the inputs and equipment this pillar needs."
        )
    ops = (fp.get("ops_responsibility") or "").lower()
    if "partial" in ops or "delegated" in ops:
        causes.append(
            "Day-to-day operations are only partly under the farmer's direct control, weakening accountability."
        )
    if not causes:
        causes.append(
            f"Foundational capability gaps remain across {pillar_name}; build the base before scaling."
        )
    return causes


def _aspiration_alignment(fp: dict[str, Any], pillar_name: str) -> str:
    goals = []
    for key in ("success_12m", "role_3_5y", "vision_25y"):
        val = fp.get(key)
        if val:
            goals.append(str(val))
    if not goals:
        return (
            f"Strengthening {pillar_name} contributes directly to becoming a future-ready, "
            "investment-ready farm business."
        )
    joined = " ".join(f"({i+1}) {g}" for i, g in enumerate(goals))
    return (
        f"Progress in {pillar_name} directly serves the farmer's stated aspirations: {joined}."
    )


def build_fallback_diagnosis(context: dict[str, Any]) -> dict[str, Any]:
    """Deterministic rule-based diagnosis matching the LLM template shape."""
    farm = context.get("farm") or {}
    fp = context.get("farmer_profile") or {}
    assessment = context.get("assessment") or {}
    pillars_ctx = assessment.get("pillars") or []

    pillar_reports: list[dict[str, Any]] = []

    for p in pillars_ctx:
        pid = p.get("pillar_id")
        pname = p.get("pillar_name", f"Pillar {pid}")
        score = float(p.get("score", 0.0))
        status = p.get("status", "developing")
        caps = p.get("capabilities") or []
        gaps = p.get("gap_recommendations") or []

        strong = [c["name"] for c in caps if _STATUS_RANK.get(c.get("status", ""), 0) >= 4]
        weak = [c["name"] for c in caps if _STATUS_RANK.get(c.get("status", ""), 0) <= 2]

        recs = []
        for g in gaps:
            recs.append(
                {
                    "action": g.get("recommended_action", ""),
                    "priority": g.get("priority", "medium_term"),
                    "rationale": g.get("why_it_matters")
                    or g.get("recommended_learning")
                    or "Addresses a diagnosed capability gap.",
                    "linked_to_profile": _aspiration_alignment(fp, pname),
                }
            )
        # De-duplicate linked_to_profile noise: keep a single concise profile link.
        for r in recs:
            r["linked_to_profile"] = _aspiration_alignment(fp, pname)

        report = {
            "pillar_id": pid,
            "pillar_name": pname,
            "status_level": status,
            "pillar_score": round(score, 3),
            "strengths": strong or [f"Baseline capability exists in {pname}."],
            "key_gaps": weak or [f"Several {pname} capabilities are below established level."],
            "root_causes": _root_causes(fp, pname),
            "personalised_recommendations": recs,
            "coaching_approach": _coaching_approach(fp),
            "aspiration_alignment": _aspiration_alignment(fp, pname),
        }
        pillar_reports.append(report)

    tier = assessment.get("tier") or 3
    ffmi = assessment.get("ffmi_score") or 0.0
    tier_name = _TIER_LABELS.get(int(tier), "Structured Farm")

    # Rank pillars for the overall narrative
    ranked = sorted(
        pillar_reports,
        key=lambda p: _STATUS_RANK.get(p["status_level"], 0),
    )
    strengths_overall = [p["pillar_name"] for p in ranked if _STATUS_RANK.get(p["status_level"], 0) >= 4]
    gap_pillars = [p for p in ranked if _STATUS_RANK.get(p["status_level"], 0) <= 2]
    top_gaps = [p["pillar_name"] for p in gap_pillars[:3]]

    executive_summary = f"The farm is currently classified as a {tier_name} (FFMI {ffmi}/24). "
    if strengths_overall:
        executive_summary += f"Relative strengths sit in {', '.join(strengths_overall)}. "
    if top_gaps:
        executive_summary += (
            f"Priority gaps are concentrated in {', '.join(top_gaps)}"
            + (" and others" if len(gap_pillars) > 3 else "")
            + "; closing these unlocks the fastest maturity gains."
        )
    elif not strengths_overall:
        executive_summary += (
            "Capabilities are broadly at a developing level across the framework; "
            "closing foundational gaps will lift the whole farm."
        )
    else:
        executive_summary += "Maintain momentum on the established pillars while closing residual gaps."

    # Priority roadmap = quick wins first, then other actions, capped for readability
    roadmap: list[str] = []
    for pr in pillar_reports:
        for r in pr["personalised_recommendations"]:
            if r["priority"] == "quick_win":
                roadmap.append(f"[{pr['pillar_name']}] {r['action']}")
    for pr in pillar_reports:
        for r in pr["personalised_recommendations"]:
            if r["priority"] != "quick_win":
                roadmap.append(f"[{pr['pillar_name']}] {r['action']}")
    total_actions = len(roadmap)
    roadmap = roadmap[:10]
    if total_actions > len(roadmap):
        roadmap.append(
            f"...and {total_actions - len(roadmap)} further actions in the detailed recommendations."
        )

    overall = {
        "executive_summary": executive_summary,
        "transformation_trajectory": (
            f"The farm is on the transition from informal/emerging practice toward a "
            f"structured, future-ready business (Tier {tier}). The near-term focus is "
            "moving experience-led, manual operations toward data-informed, systematised ones."
        ),
        "holistic_strengths": strengths_overall or ["Foundational capacity exists to build from."],
        "priority_roadmap": roadmap or ["Complete a baseline capability-building plan with a verified advisor."],
        "key_risks": [f"Unaddressed gaps in {g['pillar_name']}" for g in gap_pillars]
        or ["Maintain momentum to avoid regression."],
        "vision_alignment": _aspiration_alignment(fp, "the whole farm"),
    }

    return {
        "overall": overall,
        "pillars": pillar_reports,
        "is_fallback": True,
    }
