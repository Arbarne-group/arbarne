"""Interactive Gradio Scenario & Inference UI for Future Farms Framework (FFF).

Allows agronomists, verifiers, and stakeholders to simulate farm parameters,
visualize deterministic FFMI maturity scoring, and test trajectory risk predictions.
"""

from __future__ import annotations

import logging
from typing import Tuple

log = logging.getLogger(__name__)

def calculate_farm_scenario(
    farm_name: str,
    region: str,
    farm_size: float,
    p1_governance: float,
    p2_soil_land: float,
    p3_water: float,
    p4_crops: float,
    p5_livestock: float,
    p6_finance: float,
    p7_tech_data: float,
    p8_markets: float,
) -> Tuple[str, str, str, str]:
    """Simulate farm scoring strictly replicating the assessment form analysis."""
    from app.scoring.engine import DEFAULT_FFMI_BANDS, _tier_for_score

    pillar_scores = [
        p1_governance, p2_soil_land, p3_water, p4_crops,
        p5_livestock, p6_finance, p7_tech_data, p8_markets
    ]
    avg_score = sum(pillar_scores) / len(pillar_scores)
    # Canonical 0..24 FFMI scale
    ffmi_score = round(avg_score * 24.0, 2)

    # Canonical 5-tier classification
    tier_num, classification = _tier_for_score(ffmi_score, DEFAULT_FFMI_BANDS)
    tier = f"Tier {tier_num}: {classification}"

    pillar_names = [
        "Governance & Strategy", "Soil & Land Health", "Water Stewardship",
        "Crop Management", "Livestock Management", "Financial Inclusion",
        "Technology & Data", "Market Access"
    ]
    sorted_pillars = sorted(zip(pillar_names, pillar_scores), key=lambda x: x[1], reverse=True)
    strongest_pillar = sorted_pillars[0]
    priority_gap_pillar = sorted_pillars[-1]

    # Trajectory Risk calculation
    if ffmi_score < 5.0 or priority_gap_pillar[1] < 0.25:
        risk = "🔴 High Risk (Urgent gap intervention required)"
    elif ffmi_score < 16.0 or priority_gap_pillar[1] < 0.50:
        risk = "🟡 Medium Risk (Developing capabilities; vulnerability to climate/market shocks)"
    else:
        risk = "🟢 Low Risk (High resilience across core pillars)"
    quick_wins = f"1. Prioritize quick-win action plan for **{priority_gap_pillar[0]}** (Score: {priority_gap_pillar[1]*100:.0f}%)\n" \
                 f"2. Build upon existing strength in **{strongest_pillar[0]}** (Score: {strongest_pillar[1]*100:.0f}%)\n" \
                 f"3. Schedule verifier evidence audit for farm location in {region}."

    summary = f"### Farm Transformation Report for {farm_name or 'Sample Farm'}\n" \
              f"- **Region:** {region} ({farm_size} acres)\n" \
              f"- **FFMI Score Index:** **{ffmi_score:.2f} / 24.00**\n" \
              f"- **Overall Maturity:** **{tier}**\n" \
              f"- **Strongest Pillar:** {strongest_pillar[0]} ({strongest_pillar[1]*100:.0f}%)\n" \
              f"- **Priority Gap Pillar:** {priority_gap_pillar[0]} ({priority_gap_pillar[1]*100:.0f}%)\n" \
              f"- **Trajectory Risk Level:** {risk}"

    return summary, tier, risk, quick_wins


def create_gradio_app():
    """Create and return Gradio Interface."""
    try:
        import gradio as gr
    except ImportError:
        log.warning("Gradio not installed. Gradio UI will not be mounted.")
        return None

    with gr.Blocks(title="Future Farms Framework — Scenario Simulator") as demo:
        gr.Markdown(
            """
            # 🌾 Future Farms Framework (FFF) — Interactive ML & Risk Simulator
            Simulate farm pillar capability scores to evaluate real-time **FFMI Maturity Tiers**, **Trajectory Risk Predictions**, and **Prioritized Quick Wins**.
            """
        )

        with gr.Row():
            with gr.Column():
                farm_name = gr.Textbox(label="Farm Name", value="Kakamega Pilot Farm A")
                region = gr.Dropdown(
                    label="Region",
                    choices=["Rift Valley", "Central Kenya", "Western Kenya", "Eastern Kenya", "Coast"],
                    value="Western Kenya"
                )
                farm_size = gr.Number(label="Farm Size (Acres)", value=5.5)

                gr.Markdown("### Pillar Capability Scores (0.0 = Non-Existent, 1.0 = Advanced)")
                p1 = gr.Slider(0, 1, value=0.4, label="Pillar 1: Governance & Strategy")
                p2 = gr.Slider(0, 1, value=0.6, label="Pillar 2: Soil & Land Health")
                p3 = gr.Slider(0, 1, value=0.3, label="Pillar 3: Water Stewardship")
                p4 = gr.Slider(0, 1, value=0.7, label="Pillar 4: Crop Management")
                p5 = gr.Slider(0, 1, value=0.2, label="Pillar 5: Livestock Management")
                p6 = gr.Slider(0, 1, value=0.5, label="Pillar 6: Financial Inclusion")
                p7 = gr.Slider(0, 1, value=0.3, label="Pillar 7: Technology & Data")
                p8 = gr.Slider(0, 1, value=0.6, label="Pillar 8: Market Access")

                btn = gr.Button("Calculate Farm Maturity & Risk", variant="primary")

            with gr.Column():
                summary_output = gr.Markdown(label="Farm Summary")
                tier_output = gr.Textbox(label="Calculated Maturity Tier")
                risk_output = gr.Textbox(label="Predicted Trajectory Risk Level")
                quick_wins_output = gr.Markdown(label="Recommended Quick Wins")

        btn.click(
            fn=calculate_farm_scenario,
            inputs=[farm_name, region, farm_size, p1, p2, p3, p4, p5, p6, p7, p8],
            outputs=[summary_output, tier_output, risk_output, quick_wins_output],
            api_name="predict",
        )

    demo.queue(default_concurrency_limit=20)
    return demo
