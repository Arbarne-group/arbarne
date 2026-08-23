"""PDF Report Generation Engine for Future Farms Framework (FFF).

Generates official, audit-ready Farm Transformation Reports using ReportLab.
"""

from __future__ import annotations

import io
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, Image as RLImage, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def _get_logo_flowable(width_inch: float = 2.1, height_inch: float = 0.91) -> Optional[RLImage]:
    base_dir = os.path.dirname(__file__)
    candidate_paths = [
        os.path.abspath(os.path.join(base_dir, "../../../frontend/public/assets/arbarne-logo-horizontal-teal.png")),
        os.path.abspath(os.path.join(base_dir, "../../../frontend/public/assets/logo.png")),
    ]
    for path in candidate_paths:
        if os.path.exists(path):
            try:
                return RLImage(path, width=width_inch * inch, height=height_inch * inch)
            except Exception:
                pass
    return None



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

    # ─── Header with Arbarne Agriculture Group Logo ───────────────────────
    logo_img = _get_logo_flowable(width_inch=2.2, height_inch=0.96)
    header_titles = [
        Paragraph("ARBARNE AGRICULTURE GROUP", subtitle_style),
        Paragraph("Future Farms Transformation Report", title_style),
    ]

    if logo_img:
        t_header = Table([[header_titles, logo_img]], colWidths=[360, 180])
        t_header.setStyle(
            TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ])
        )
        elements.append(t_header)
    else:
        elements.extend(header_titles)

    elements.append(Spacer(1, 4))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#1f6f43"), spaceAfter=10))

    # ─── Farm Metadata Table ──────────────────────────────────────────────
    date_str = assessed_at.strftime("%d %B %Y") if assessed_at else datetime.now(timezone.utc).strftime("%d %B %Y")
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


def generate_section_pdf(
    assessment_id: str,
    farm_name: str,
    region: str,
    crop_type: Optional[str],
    farm_size: Optional[float],
    pillar_id: int,
    pillar_name: str,
    pillar_principle: str,
    pillar_guiding_question: str,
    section_score: float,
    section_points: float,
    status_band: str,
    capabilities: List[Dict[str, Any]],
    recommendations: List[Dict[str, Any]],
    assessed_at: Optional[datetime] = None,
) -> bytes:
    """Generate an official Section Diagnostic Report & Chart Breakdown for an individual Pillar."""
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
        "SectionTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#1f6f43"),
    )
    subtitle_style = ParagraphStyle(
        "SectionSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#155031"),
    )
    h2_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1f6f43"),
        spaceBefore=8,
        spaceAfter=4,
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

    # ─── Header with Arbarne Agriculture Group Logo ───────────────────────
    logo_img = _get_logo_flowable(width_inch=2.0, height_inch=0.87)
    sec_titles = [
        Paragraph("ARBARNE AGRICULTURE GROUP — FUTURE FARMS", subtitle_style),
        Paragraph(f"Pillar {pillar_id}: {pillar_name} Report", title_style),
    ]

    if logo_img:
        t_header = Table([[sec_titles, logo_img]], colWidths=[360, 180])
        t_header.setStyle(
            TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ])
        )
        elements.append(t_header)
    else:
        elements.extend(sec_titles)

    elements.append(Spacer(1, 4))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#1f6f43"), spaceAfter=8))

    # ─── Pillar Principle & Guiding Question ──────────────────────────────
    p_meta = [
        [
            Paragraph(f"<b>Principle:</b> {pillar_principle}", body_style),
            Paragraph(f"<b>Guiding Question:</b> {pillar_guiding_question}", body_style),
        ]
    ]
    t_pmeta = Table(p_meta, colWidths=[270, 270])
    t_pmeta.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f0fdf4")),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#bbf7d0")),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ])
    )
    elements.append(t_pmeta)
    elements.append(Spacer(1, 8))

    # ─── Section Scorecard ────────────────────────────────────────────────
    date_str = assessed_at.strftime("%d %B %Y") if assessed_at else datetime.now(timezone.utc).strftime("%d %B %Y")
    score_pct = round(section_score * 100)
    score_data = [
        [
            Paragraph(f"<b>Farm Name:</b> {farm_name or 'Sample Farm'}<br/><b>Region:</b> {region or 'East Africa'}", body_style),
            Paragraph(f"<b>Section Score:</b><br/><font size='15' color='#1f6f43'><b>{score_pct}% ({section_score:.2f}/1.00)</b></font>", body_style),
            Paragraph(f"<b>FFMI Contribution:</b><br/><font size='14' color='#1f6f43'><b>{section_points:.2f} / 3.00 pts</b></font>", body_style),
            Paragraph(f"<b>Maturity Band:</b><br/><b>{status_band}</b>", body_style),
        ]
    ]
    t_score = Table(score_data, colWidths=[150, 130, 130, 130])
    t_score.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#eef8f2")),
            ("BOX", (0, 0), (-1, -1), 1.2, colors.HexColor("#1f6f43")),
            ("ALIGN", (1, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ])
    )
    elements.append(t_score)
    elements.append(Spacer(1, 8))

    # ─── Capability Breakdown Scorecard & Chart ───────────────────────────
    elements.append(Paragraph("5-Capability Scorecard & Diagnostic Breakdown", h2_style))
    cap_table_data = [["Capability", "Score Fraction", "Yes / Total", "Status Rating", "Capability Level"]]
    for c in capabilities:
        cid = c.get("capability_id", "")
        cname = c.get("capability_name", "")
        frac = c.get("score_fraction", 0.0)
        yes = c.get("yes_count", 0)
        tot = c.get("total_questions", 5)
        stat = str(c.get("status", "non_existent")).replace("_", " ").title()
        lvl = c.get("status_level", 0)

        # Visual star/bar indicator
        bar_rep = f"Level {lvl}/5"
        cap_table_data.append([
            Paragraph(f"<b>{cid}: {cname}</b>", body_style),
            f"{frac*100:.0f}%",
            f"{yes} / {tot}",
            stat,
            bar_rep,
        ])

    t_caps = Table(cap_table_data, colWidths=[200, 80, 80, 100, 80])
    t_caps.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f6f43")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 8.5),
            ("ALIGN", (1, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f9fafb")]),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ])
    )
    elements.append(t_caps)
    elements.append(Spacer(1, 8))

    # ─── Section Recommendations & Quick Wins ─────────────────────────────
    elements.append(Paragraph(f"Section Action Plan — Recommended Next Steps for {pillar_name}", h2_style))
    if recommendations:
        rec_table_data = [["Priority", "Identified Capability Gap & Recommended Action", "Learning & Advisory Service"]]
        for r in recommendations[:5]:
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
                ("FONTSIZE", (0, 0), (-1, 0), 8.5),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ])
        )
        elements.append(t_recs)
    else:
        elements.append(Paragraph("<b>No capability gaps identified in this section!</b> All assessment questions scored 'Yes'.", body_style))

    elements.append(Spacer(1, 10))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e5e7eb"), spaceAfter=6))
    elements.append(Paragraph(f"Future Farms Framework (FFF) Diagnostic Section Report for Pillar {pillar_id}. Assessment ID: {assessment_id[:18]}...", small_style))

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

