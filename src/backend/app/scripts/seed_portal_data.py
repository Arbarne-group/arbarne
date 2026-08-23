"""Seed initial Services Portal catalogue and Learning Portal modules into the database."""

from __future__ import annotations

import logging
from sqlalchemy.orm import Session

from app.db.session import SessionLocal, engine, Base
from app.models.portal import LearningModule, ServiceItem
from app.models.framework import Capability, Pillar

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)-7s | %(message)s")
logger = logging.getLogger("seed_portal")

SERVICES_DATA = [
    {
        "title": "Comprehensive Soil Fertility & pH Testing",
        "provider": "AgroCares Kenya & Crop Nutrition Lab",
        "category": "Soil & Nutrition",
        "description": "Rapid optical and lab analysis of soil N-P-K, micro-nutrients, carbon content, and pH. Includes customized liming and fertilizer prescription for smallholders.",
        "pillar_id": 1,
        "capability_id": "P1.1",
        "cost_model": "KES 1,500 / field test (Subsidized)",
        "estimated_impact": "+1.5 Soil Health Rating",
        "contact_phone": "+254 700 112 233",
        "icon": "🧪",
    },
    {
        "title": "Smart Solar Drip Irrigation Installation",
        "provider": "SunCulture & Davis & Shirtliff",
        "category": "Water & Irrigation",
        "description": "Pay-As-You-Grow solar water pump and targeted drip emitter kit covering 0.5 to 2.0 acres. Guarantees year-round vegetable and cash-crop yields with 70% water savings.",
        "pillar_id": 2,
        "capability_id": "P2.2",
        "cost_model": "KES 3,500 / month on mobile money lease",
        "estimated_impact": "+2 Water Stewardship Tiers",
        "contact_phone": "+254 711 445 566",
        "icon": "💧",
    },
    {
        "title": "Certified Drought-Tolerant Seed & Bio-Fertilizers",
        "provider": "Kenya Seed Co & Bio-Fix East Africa",
        "category": "Agronomy & Inputs",
        "description": "Access to high-germination hybrid and indigenous seeds, mycorrhizal inoculants, and organic compost amendments delivered to farm gate.",
        "pillar_id": 3,
        "capability_id": "P3.2",
        "cost_model": "Market price with bulk group discounts",
        "estimated_impact": "+25% Harvest Yield",
        "contact_phone": "+254 722 889 900",
        "icon": "🌱",
    },
    {
        "title": "On-Demand Tractor & Minimum-Till Mechanization",
        "provider": "Hello Tractor & Farm to Market Alliance",
        "category": "Mechanization",
        "description": "Book GPS-tracked tractor ripping, disc harrowing, or mechanical planting by the acre through SMS/app with vetted local operators.",
        "pillar_id": 4,
        "capability_id": "P4.2",
        "cost_model": "KES 2,200 / acre",
        "estimated_impact": "+3 Operations Efficiency",
        "contact_phone": "+254 733 556 677",
        "icon": "🚜",
    },
    {
        "title": "Input Credit & Harvest Pre-Financing Facility",
        "provider": "Apollo Agriculture & Musoni Microfinance",
        "category": "Finance & Credit",
        "description": "Collateral-free seasonal input loan bundled with crop weather insurance and mobile repayment aligned with harvest cycles.",
        "pillar_id": 5,
        "capability_id": "P5.1",
        "cost_model": "Low-interest seasonal repayment",
        "estimated_impact": "+2 Financial Stability Tiers",
        "contact_phone": "+254 788 334 455",
        "icon": "💳",
    },
    {
        "title": "Farm Safety & PPE Gear Supply Kit",
        "provider": "AFA Kenya & SafetyAg East Africa",
        "category": "Labour, Safety & Community",
        "description": "Full ergonomic spray suit, chemical respirators, eye protection, and certified first-aid station kits for farm workers and family members.",
        "pillar_id": 6,
        "capability_id": "P6.2",
        "cost_model": "KES 2,800 full safety kit",
        "estimated_impact": "+100% Safety Compliance",
        "contact_phone": "+254 799 223 344",
        "icon": "🛡️",
    },
    {
        "title": "Farm Biogas Digester & Waste Composting Unit",
        "provider": "Sistema.bio Kenya",
        "category": "Waste, Circularity & Environmental Footprint",
        "description": "Prefabricated modular biodigester converting manure and crop residue into clean cooking biogas and nutrient-rich liquid bio-fertilizer (bio-slurry).",
        "pillar_id": 7,
        "capability_id": "P7.1",
        "cost_model": "Financed at KES 2,100 / month",
        "estimated_impact": "+2 Circular Economy Tier",
        "contact_phone": "+254 744 667 788",
        "icon": "♻️",
    },
    {
        "title": "Digital Farm Records & Compliance Mentorship",
        "provider": "Arbane Field Officer Network",
        "category": "Governance, Strategy & Continuous Improvement",
        "description": "1-on-1 field agronomist visits to configure mobile bookkeeping, yield tracking, harvest logs, and prepare for verified premium offtake audit.",
        "pillar_id": 8,
        "capability_id": "P8.1",
        "cost_model": "Free for registered pilot farms",
        "estimated_impact": "+1 Maturity Tier Advancement",
        "contact_phone": "+254 755 889 911",
        "icon": "📈",
    },
]

LEARNING_DATA = [
    {
        "title": "Building Resilient Living Soils: Cover Crops & Biochar",
        "summary": "Master soil organic matter enhancement, nitrogen fixation with legumes, and biochar preparation to retain soil moisture through dry spells.",
        "pillar_id": 1,
        "capability_id": "P1.2",
        "duration_minutes": 15,
        "level": "Beginner to Intermediate",
        "format_type": "Interactive Guide + Swahili Audio",
        "key_takeaways": "1. Never leave soil bare. 2. Plant Mucuna or Desmodium green manure. 3. Apply compost in planting basins.",
        "icon": "🌾",
    },
    {
        "title": "Micro-Catchment & Road Water Harvesting Techniques",
        "summary": "Learn step-by-step methods to construct contour bunds, zai pits, and farm ponds to trap 100% of seasonal flash rainfall.",
        "pillar_id": 2,
        "capability_id": "P2.1",
        "duration_minutes": 20,
        "level": "Beginner",
        "format_type": "Video Demonstration & Field Guide",
        "key_takeaways": "1. Measure contours with A-frame. 2. Direct roadside runoff into silt traps. 3. Mulch retention basins.",
        "icon": "🌧️",
    },
    {
        "title": "Integrated Pest Management (IPM) & Biological Control",
        "summary": "Reduce expensive chemical pesticides by 80% using push-pull technology, neem extracts, sticky traps, and beneficial insect habitats.",
        "pillar_id": 3,
        "capability_id": "P3.3",
        "duration_minutes": 15,
        "level": "Intermediate",
        "format_type": "Interactive Checklist",
        "key_takeaways": "1. Scout pests twice weekly. 2. Use trap crops on field borders. 3. Spray botanical repellents at early dawn.",
        "icon": "🐛",
    },
    {
        "title": "Solar Post-Harvest Drying & Value Addition",
        "summary": "Prevent 30% aflatoxin and spoilage losses using low-cost solar tunnel dryers and hermetic storage bags for grain and pulses.",
        "pillar_id": 4,
        "capability_id": "P4.4",
        "duration_minutes": 25,
        "level": "Intermediate",
        "format_type": "Illustrated Handbook",
        "key_takeaways": "1. Test moisture with salt jar method. 2. Dry on elevated mesh racks. 3. Seal in hermetic PICS bags.",
        "icon": "☀️",
    },
    {
        "title": "Farm Enterprise Budgeting & Direct Offtake Contracts",
        "summary": "Calculate accurate gross margins per acre, manage seasonal cashflow, and negotiate transparent forward-purchase contracts with aggregators.",
        "pillar_id": 5,
        "capability_id": "P5.2",
        "duration_minutes": 20,
        "level": "Advanced",
        "format_type": "Excel / Mobile Calculator Guide",
        "key_takeaways": "1. Separate household and farm expenses. 2. Know breakeven price per bag. 3. Sell through collective farmer hubs.",
        "icon": "📊",
    },
    {
        "title": "Safe Agrochemical Handling & First-Aid Protocols",
        "summary": "Essential safety protocols for safe storage, triple-rinsing chemical containers, emergency poison response, and proper ergonomics.",
        "pillar_id": 6,
        "capability_id": "P6.1",
        "duration_minutes": 10,
        "level": "Beginner",
        "format_type": "Visual Safety Poster & Audio",
        "key_takeaways": "1. Keep chemicals in locked shed away from children. 2. Wear respirators. 3. Wash hands immediately after handling.",
        "icon": "🚨",
    },
    {
        "title": "Closing Farm Loops: Composting Manure & Crop Residue",
        "summary": "Rapid thermal composting methods to turn kitchen waste, animal manure, and crop stubble into black gold in just 21 days.",
        "pillar_id": 7,
        "capability_id": "P7.3",
        "duration_minutes": 15,
        "level": "Beginner",
        "format_type": "Field Video & Recipe Card",
        "key_takeaways": "1. Ratio of 3 parts dry brown to 1 part green manure. 2. Turn pile on days 4, 8, and 14. 3. Keep moisture like a wrung sponge.",
        "icon": "🔄",
    },
    {
        "title": "Future Farms Maturity Self-Auditing & Annual Planning",
        "summary": "How to conduct continuous quarterly reviews using the 8-Pillar Framework, set capability targets, and build an investment pitch.",
        "pillar_id": 8,
        "capability_id": "P8.4",
        "duration_minutes": 20,
        "level": "All Levels",
        "format_type": "Strategic Planner",
        "key_takeaways": "1. Track quarterly FFMI gains. 2. Prioritize Quick Win capability gaps. 3. Maintain evidence photos for verification.",
        "icon": "🎯",
    },
]


def seed_portal_content(db: Session | None = None):
    """Seed services catalogue and learning modules."""
    close_db = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    try:
        # Seed Services
        for s_data in SERVICES_DATA:
            existing = db.query(ServiceItem).filter(ServiceItem.title == s_data["title"]).first()
            if not existing:
                service = ServiceItem(
                    title=s_data["title"],
                    provider=s_data["provider"],
                    category=s_data["category"],
                    description=s_data["description"],
                    pillar_id=s_data["pillar_id"],
                    capability_id=s_data["capability_id"],
                    cost_model=s_data["cost_model"],
                    estimated_impact=s_data["estimated_impact"],
                    contact_phone=s_data["contact_phone"],
                    icon=s_data["icon"],
                )
                db.add(service)
                logger.info("Created Service Item: %s", s_data["title"])

        # Seed Learning Modules
        for m_data in LEARNING_DATA:
            existing = db.query(LearningModule).filter(LearningModule.title == m_data["title"]).first()
            if not existing:
                module = LearningModule(
                    title=m_data["title"],
                    summary=m_data["summary"],
                    pillar_id=m_data["pillar_id"],
                    capability_id=m_data["capability_id"],
                    duration_minutes=m_data["duration_minutes"],
                    level=m_data["level"],
                    format_type=m_data["format_type"],
                    key_takeaways=m_data["key_takeaways"],
                    icon=m_data["icon"],
                )
                db.add(module)
                logger.info("Created Learning Module: %s", m_data["title"])

        db.commit()
        logger.info("Successfully seeded Services & Learning portal catalogue.")
    except Exception as exc:
        db.rollback()
        logger.error("Failed to seed portal content: %s", exc)
        raise
    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_portal_content()
