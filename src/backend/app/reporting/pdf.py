"""PDF Report Generation Engine for Future Farms Framework (FFF).

Generates official, audit-ready Farm Transformation Reports using ReportLab.
"""

from __future__ import annotations

import io
from datetime import datetime
from typing import Any, Dict, List, Optional

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def generate_transformation_pdf(
    assessment_id: str,
    farm_name: str,
    region: str,
    crop_type: Optional[str],
    farm_size: Optional[float],
    ffmi_score: float,
    tier: int,
    tier_classification: str,
    pillar_scores: Dict[str, float],
    recommendations: List[Dict[str, Any]],
    trajectory_risk: str = "Medium Risk",
    assessed_at: Optional[datetime] = None,
) -> bytes:
    """Generate a high-quality PDF report and return as bytes."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#1f6f43"),
    )
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#155031"),
    )
    h2_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#1f6f43"),
        spaceBefore=10,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#1a1a1a"),
    )
    small_style = ParagraphStyle(
        "Small",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#6b7280"),
    )
    bold_style = ParagraphStyle(
        "Bold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#1a1a1a"),
    )

    elements = []

    # ─── Header ───────────────────────────────────────────────────────────
    elements.append(Paragraph("FUTURE FARMS FRAMEWORK", subtitle_style))
    elements.append(Paragraph("Official Farm Transformation Report", title_style))
    elements.append(Spacer(1, 4))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#1f6f43"), spaceAfter=10))

    # ─── Farm Metadata Table ──────────────────────────────────────────────
    date_str = assessed_at.strftime("%d %B %Y") if assessed_at else datetime.utcnow().strftime("%d %B %Y")
    meta_data = [
        [
            Paragraph(f"<b>Farm Name:</b> {farm_name or 'Independent Smallholder'}", body_style),
            Paragraph(f"<b>Region:</b> {region or 'Eastern Africa'}", body_style),
        ],
        [
            Paragraph(f"<b>Primary Enterprise:</b> {crop_type or 'Mixed Farming'}", body_style),
            Paragraph(f"<b>Farm Size:</b> {farm_size or 5.0} Acres", body_style),
        ],
        [
            Paragraph(f"<b>Assessment ID:</b> {assessment_id[:18]}...", small_style),
            Paragraph(f"<b>Assessment Date:</b> {date_str}", small_style),
        ],
    ]
    t_meta = Table(meta_data, colWidths=[270, 270])
    t_meta.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f7f8f4")),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#e5e7eb")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ])
    )
    elements.append(t_meta)
    elements.append(Spacer(1, 10))

    # ─── Executive Summary & Score Card ───────────────────────────────────
    elements.append(Paragraph("Executive Diagnostic Summary", h2_style))
    summary_data = [
        [
            Paragraph(f"<b>Overall Maturity Tier:</b><br/><font size='14' color='#1f6f43'><b>Tier {tier}: {tier_classification}</b></font>", body_style),
            Paragraph(f"<b>Future Farm Maturity Index (FFMI):</b><br/><font size='16' color='#1f6f43'><b>{ffmi_score:.2f} / 24.00</b></font>", body_style),
            Paragraph(f"<b>12-Month Trajectory Risk:</b><br/><b>{trajectory_risk}</b>", body_style),
        ]
    ]
    t_summary = Table(summary_data, colWidths=[200, 180, 160])
    t_summary.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#eef8f2")),
            ("BOX", (0, 0), (-1, -1), 1.5, colors.HexColor("#1f6f43")),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ])
    )
    elements.append(t_summary)
    elements.append(Spacer(1, 10))

    # ─── 8-Pillar Score Breakdown Table ───────────────────────────────────
    elements.append(Paragraph("8-Pillar Capability Score Breakdown", h2_style))
    pillar_names = {
        "1": "Pillar 1: Governance & Strategy",
        "2": "Pillar 2: Soil & Land Health",
        "3": "Pillar 3: Water Stewardship",
        "4": "Pillar 4: Crop Management",
        "5": "Pillar 5: Livestock Management",
        "6": "Pillar 6: Financial Inclusion",
        "7": "Pillar 7: Technology & Data",
        "8": "Pillar 8: Market Access",
    }

    p_table_data = [["Pillar Dimension", "Capability Score", "Score (%)", "Status Band"]]
    for pid in sorted(pillar_names.keys(), key=lambda x: int(x)):
        val = pillar_scores.get(pid, pillar_scores.get(int(pid), 0.0))
        pct = round(val * 100)
        status = "Advanced (5/5)" if pct >= 80 else ("Established (4/5)" if pct >= 60 else ("Developing (3/5)" if pct >= 40 else ("Emerging (2/5)" if pct >= 20 else "Non-Existent (0/5)")))
        p_table_data.append([
            pillar_names[pid],
            f"{val:.2f} / 1.00",
            f"{pct}%",
            status,
        ])

    t_pillars = Table(p_table_data, colWidths=[240, 100, 80, 120])
    t_pillars.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f6f43")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 9),
            ("ALIGN", (1, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f9fafb")]),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ])
    )
    elements.append(t_pillars)
    elements.append(Spacer(1, 10))

    # ─── Action Plan / Prioritized Recommendations ────────────────────────
    elements.append(Paragraph("Prioritized Transformation Action Plan", h2_style))
    elements.append(Paragraph("Actionable steps to resolve capability gaps, unlock financing, and advance to the next maturity tier:", small_style))
    elements.append(Spacer(1, 4))

    rec_table_data = [["Priority", "Identified Gap & Recommended Action", "Learning & Advisory Service"]]
    for r in recommendations[:8]:
        prio = (r.get("priority") or "quick_win").replace("_", " ").upper()
        gap = r.get("gap") or "Capability gap"
        action = r.get("recommended_action") or "Implement standardized practices."
        learning = r.get("recommended_learning") or "FAAB Transformation Module"
        service = r.get("potential_service") or "Future Farms Advisory"

        prio_color = "#15803d" if "QUICK" in prio else ("#ca8a04" if "MEDIUM" in prio else "#1d4ed8")
        rec_table_data.append([
            Paragraph(f"<font color='{prio_color}'><b>{prio}</b></font>", bold_style),
            Paragraph(f"<b>{gap}</b><br/>{action}", body_style),
            Paragraph(f"<b>Learn:</b> {learning}<br/><b>Service:</b> {service}", small_style),
        ])

    t_recs = Table(rec_table_data, colWidths=[80, 270, 190])
    t_recs.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#155031")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 9),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ])
    )
    elements.append(t_recs)
    elements.append(Spacer(1, 12))

    # ─── Footer Sign-off Note ─────────────────────────────────────────────
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e5e7eb"), spaceAfter=6))
    elements.append(Paragraph("This transformation report is an official diagnostic output of the Future Farms Framework (FFF). To schedule verifier evidence validation or unlock capital partnerships, contact advisory@futurefarms.africa.", small_style))

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
