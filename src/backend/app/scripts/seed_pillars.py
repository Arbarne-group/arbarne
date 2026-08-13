"""Seed only the 8 pillars with their full canonical content.

Useful for incrementally adding pillars before the full 200-question
spreadsheet is loaded. Pulls the canonical pillar definitions from the
FFF source document (see prd-refined.md §7.2).
"""

from __future__ import annotations

import logging
import sys

from app.db.session import Base, SessionLocal, engine
from app.models.framework import Pillar

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
log = logging.getLogger("seed_pillars")


PILLARS = [
    {
        "id": 1,
        "name": "Smart Farming and Digital Transformation",
        "principle": "Use technology and data to farm smarter.",
        "seeks_to_achieve": [
            "Appropriate technology adoption.",
            "Digital farm management.",
            "Reliable farm data.",
            "Data-driven decision-making.",
            "Smart and precision farming.",
            "Automation where appropriate.",
            "Digital monitoring of farm performance.",
            "Continuous technological improvement.",
        ],
        "examples": [
            "Digital farm records",
            "Sensors",
            "Weather monitoring",
            "Farm management platforms",
            "Automated irrigation",
            "Precision agriculture",
            "Mobile farm applications",
            "Farm dashboards",
            "AI-supported decision-making",
        ],
        "guiding_question": "Is the farm using appropriate technology and information to make better decisions?",
    },
    {
        "id": 2,
        "name": "Productive Use of Renewable Energy",
        "principle": "Turn energy from an operating cost into a productive asset.",
        "seeks_to_achieve": [
            "Reliable energy access.",
            "Efficient energy use.",
            "Reduced energy costs.",
            "Renewable energy adoption.",
            "Productive use of solar, biogas and other appropriate technologies.",
            "Energy-powered irrigation and processing.",
            "Improved cold storage.",
            "Reduced dependence on expensive or unreliable energy.",
        ],
        "examples": [
            "Solar irrigation",
            "Solar-powered cold storage",
            "Biogas systems",
            "Solar drying",
            "Solar processing",
            "Energy-efficient equipment",
            "Energy monitoring",
        ],
        "guiding_question": "How can energy be used to create greater productive and economic value on the farm?",
    },
    {
        "id": 3,
        "name": "Food Safety and Compliance",
        "principle": "Produce food that is safe, traceable, quality-assured and compliant.",
        "seeks_to_achieve": [
            "Food safety.",
            "Quality assurance.",
            "Traceability.",
            "Responsible input use.",
            "Regulatory compliance.",
            "Good agricultural practices.",
            "Worker and occupational safety.",
            "Market and certification readiness.",
        ],
        "examples": [
            "Farm records",
            "Input and chemical records",
            "Traceability systems",
            "Harvest records",
            "Food safety procedures",
            "GAP systems",
            "Quality-control systems",
            "Certification preparation",
        ],
        "guiding_question": "Can the farm consistently demonstrate that its products are safe, traceable and compliant with its target markets?",
    },
    {
        "id": 4,
        "name": "Indigenous Knowledge and Climate Resilience",
        "principle": "Build resilience by combining local knowledge, science and innovation.",
        "seeks_to_achieve": [
            "Climate adaptation.",
            "Climate risk management.",
            "Sustainable resource management.",
            "Integration of indigenous and scientific knowledge.",
            "Preservation of valuable agricultural knowledge.",
            "Stronger farm resilience.",
            "Intergenerational knowledge transfer.",
        ],
        "examples": [
            "Indigenous weather indicators",
            "Traditional soil-management practices",
            "Indigenous seed knowledge",
            "Local water-management practices",
            "Traditional pest-management approaches",
            "Climate-smart agriculture",
            "Farm climate-risk planning",
        ],
        "guiding_question": "Is the farm capable of anticipating, adapting to and recovering from climate and environmental risks?",
    },
    {
        "id": 5,
        "name": "Farm Business Performance and Growth",
        "principle": "Build farms that are financially viable, sustainable and capable of growth.",
        "seeks_to_achieve": [
            "Profitability.",
            "Strong financial management.",
            "Cost control.",
            "Productivity improvement.",
            "Revenue growth.",
            "Business planning.",
            "Enterprise diversification.",
            "Sustainable resource use.",
            "Scalability.",
        ],
        "examples": [
            "Farm budgets",
            "Cash-flow management",
            "Cost-per-unit analysis",
            "Enterprise profitability analysis",
            "Financial records",
            "Business plans",
            "Growth strategies",
            "Value addition",
        ],
        "guiding_question": "Is the farm performing as a viable business and creating the foundation for sustainable growth?",
    },
    {
        "id": 6,
        "name": "Human Capital, Leadership and Farm Operations",
        "principle": "Build the people, leadership and systems required to operate a professional farm business.",
        "seeks_to_achieve": [
            "Skilled farm teams.",
            "Strong leadership.",
            "Defined roles and responsibilities.",
            "Standard operating procedures.",
            "Workforce development.",
            "Worker welfare.",
            "Performance management.",
            "Occupational health and safety.",
            "Succession planning.",
            "Efficient farm operations.",
        ],
        "examples": [
            "Organisational structures",
            "Job descriptions",
            "Farm SOPs",
            "Training programmes",
            "Performance management",
            "Staff scheduling",
            "Operations manuals",
            "Safety systems",
        ],
        "guiding_question": "Does the farm have the people, leadership and operating systems required to run effectively beyond the individual farmer?",
    },
    {
        "id": 7,
        "name": "Market Access, Customer Value and Competitiveness",
        "principle": "Build the farm around customers and markets, not production alone.",
        "seeks_to_achieve": [
            "Market intelligence.",
            "Customer understanding.",
            "Demand-driven production.",
            "Product differentiation.",
            "Strong buyer relationships.",
            "Regional value-chain participation.",
            "Cross-border trade readiness.",
            "Competitiveness.",
            "Customer value creation.",
        ],
        "examples": [
            "Customer research",
            "Buyer mapping",
            "Market analysis",
            "Contract farming",
            "Regional value chains",
            "Export readiness",
            "Branding",
            "Product differentiation",
            "Digital marketplaces",
        ],
        "guiding_question": "Does the farm understand its customers and compete effectively in the markets it serves?",
    },
    {
        "id": 8,
        "name": "Investment Readiness and Enterprise Development",
        "principle": "Build farms that can attract, manage and grow capital responsibly.",
        "seeks_to_achieve": [
            "Financial transparency.",
            "Investment planning.",
            "Strong business records.",
            "Governance.",
            "Risk management.",
            "Business planning.",
            "Financial projections.",
            "Investor readiness.",
            "Enterprise development.",
            "Effective capital utilisation.",
        ],
        "examples": [
            "Financial statements",
            "Business plans",
            "Investment proposals",
            "Financial projections",
            "Asset registers",
            "Risk assessments",
            "Governance structures",
            "Investment-readiness profiles",
        ],
        "guiding_question": "Can the farm demonstrate that it is a credible, investable and well-managed enterprise?",
    },
]


def main() -> int:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for p in PILLARS:
            existing = db.get(Pillar, p["id"])
            if existing:
                log.info("Pillar %d already present — skipping", p["id"])
                continue
            db.add(Pillar(**p))
            log.info("Inserted pillar %d: %s", p["id"], p["name"])
        db.commit()
    except Exception:
        db.rollback()
        log.exception("Failed to seed pillars")
        return 1
    finally:
        db.close()
    log.info("Pillar seed complete.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
