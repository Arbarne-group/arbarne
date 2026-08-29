"""Prompt construction for the personalised diagnosis LLM call.

The prompt is deliberately strict: the model receives a *fixed* deterministic
result (scores are not to be changed), the farmer's self-described profile,
and the FFF framework context, and is asked to return ONLY valid JSON matching
the documented template. Personalisation must be drawn from the farmer profile
(role, experience, management ability, operating/decision/learning style,
stated obstacles, and 12-month / 3-5-year / 25-year aspirations).
"""

from __future__ import annotations

import json
from typing import Any

from app.diagnosis.template import DIAGNOSIS_TEMPLATE_SCHEMA, TRANSITIONS


SYSTEM_PROMPT = """You are a senior farm-transformation advisor for the Future Farms Framework (FFF), \
working with smallholder and emerging agribusinesses in East Africa.

You are given:
1. A DETERMINISTIC assessment result. The scores, tiers, capability statuses and \
recommendations are already computed by a rules engine — NEVER alter, recompute, \
renormalise or second-guess any score. Treat them as ground truth.
2. The farmer's self-described profile (27 attributes) including their role, years \
of experience, management ability, operating/decision/learning style, the obstacles \
they face, and their stated 12-month, 3-5 year and 25-year aspirations.
3. The FFF framework context (the 8 pillars and the 11 Great Transitions).

Your job is to produce a professional, personalised DIAGNOSIS that explains WHAT the \
scores mean for THIS farmer and WHAT to do next, tailored to who they are. Use the \
farmer profile to:
- attribute ROOT CAUSES of gaps to the farmer's context (e.g. limited management \
capacity, experience-led decisions, capital constraints, delegated operations),
- choose a COACHING APPROACH that fits their operating/learning/decision style,
- tie every pillar and the overall plan to their STATED ASPIRATIONS.

Write in clear, professional, plain language appropriate for an advisor presenting to \
a farmer and a verification partner. Be specific and concrete; avoid generic filler. \
Reference the farmer's actual profile values where relevant.

Return ONLY a single valid JSON object matching the schema below. Do not wrap it in \
markdown, do not add commentary. Every field in the schema must be present.
"""


def build_diagnosis_prompt(context: dict[str, Any]) -> tuple[str, str]:
    """Return (system_prompt, user_prompt) for the diagnosis call."""
    farmer = context.get("farmer_profile") or {}
    assessment = context.get("assessment") or {}
    framework = context.get("framework") or {}

    # Human-readable farmer profile summary for the model's reasoning.
    fp_lines = []
    for k, v in farmer.items():
        if k in ("completed", "updated_at"):
            continue
        if isinstance(v, list):
            v = ", ".join(str(x) for x in v) if v else "—"
        if v in (None, ""):
            continue
        fp_lines.append(f"- {k}: {v}")
    farmer_summary = "\n".join(fp_lines) if fp_lines else "(no profile provided)"

    transitions_text = "\n".join(
        f"{i+1}. {t['from']} → {t['to']}" for i, t in enumerate(TRANSITIONS)
    )

    user_prompt = f"""# FFF Farm Diagnosis Request

## Farmer profile (self-described)
{farmer_summary}

## Farm context
{json.dumps(context.get("farm") or {}, indent=2)}

## Deterministic assessment result (DO NOT change scores)
{json.dumps(assessment, indent=2, default=str)}

## FFF framework context
Pillars: {json.dumps(framework.get("pillar_names", {}), indent=2)}
The 11 Great Transitions the framework drives:
{transitions_text}

## Required output schema (return ONLY JSON in this exact shape)
{DIAGNOSIS_TEMPLATE_SCHEMA}

Populate every field. For each pillar, derive root_causes and coaching_approach and \
aspiration_alignment specifically from the farmer profile above. For personalised_recommendations, \
build on the provided gap_recommendations and add a "linked_to_profile" note connecting the action \
to the farmer's context or aspirations. The overall.executive_summary must open with the farm's tier \
and FFMI and name the single most important next move.
"""
    return SYSTEM_PROMPT, user_prompt
