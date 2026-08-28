"""Populate the database with comprehensive sample data for live platform demonstration.

Creates realistic accounts across all 5 FFF maturity tiers with completed assessments,
service requests, and learning progress.
"""

from __future__ import annotations

import datetime
from datetime import timezone
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import hash_password
from app.db.session import Base, get_engine, get_session_factory
from app.models.assessment import Answer, Assessment, Farm
from app.models.framework import Capability, Pillar, Question, RuleVersion
from app.models.gamification import UserGamification
from app.models.portal import LearningModule, LearningProgress, ServiceItem, ServiceRequest
from app.models.recommendation import Recommendation
from app.models.user import User
from app.recommendations.engine import build_recommendations
from app.scoring.engine import score_assessment
from app.scripts.seed_data import CAPABILITIES, PILLARS, QUESTIONS


def seed_canonical_framework(db: Session) -> dict[str, Question]:
    """Ensure all pillars, capabilities, questions, and rule versions exist."""
    # 1. Rule Version
    rule_ver = db.scalar(select(RuleVersion).where(RuleVersion.id == "v1.0"))
    if not rule_ver:
        rule_ver = RuleVersion(
            id="v1.0",
            bands={"tier1": [0, 4.99], "tier2": [5.0, 9.99], "tier3": [10.0, 15.99], "tier4": [16.0, 20.99], "tier5": [21.0, 24.0]},
            notes="Canonical Future Farms Framework v1.0 Rules",
        )
        db.add(rule_ver)
        db.flush()

    # 2. Pillars
    for p_data in PILLARS:
        pillar = db.scalar(select(Pillar).where(Pillar.id == p_data["id"]))
        if not pillar:
            pillar = Pillar(
                id=p_data["id"],
                name=p_data["name"],
                principle=p_data.get("principle", ""),
                guiding_question=p_data.get("guiding_question", ""),
                examples=p_data.get("examples", []),
                seeks_to_achieve=p_data.get("seeks_to_achieve", []),
            )
            db.add(pillar)
    db.flush()

    # 3. Capabilities
    for c_data in CAPABILITIES:
        cap = db.scalar(select(Capability).where(Capability.id == c_data["id"]))
        if not cap:
            cap_num = int(c_data["id"].split(".")[1]) if "." in c_data["id"] else 1
            cap = Capability(
                id=c_data["id"],
                pillar_id=c_data["pillar_id"],
                number=c_data.get("number", cap_num),
                name=c_data["name"],
                description=c_data.get("description", ""),
            )
            db.add(cap)
    db.flush()

    # 4. Questions
    questions_by_id: dict[str, Question] = {}
    for q_data in QUESTIONS:
        q = db.scalar(select(Question).where(Question.id == q_data["id"]))
        if not q:
            q = Question(
                id=q_data["id"],
                capability_id=q_data["capability_id"],
                pillar_id=q_data["pillar_id"],
                question_number=q_data.get("question_number", 1),
                question_text=q_data["question_text"],
                why_it_matters=q_data.get("why_it_matters", ""),
                quick_win=q_data.get("quick_win", ""),
                ffv_evidence_required=q_data.get("ffv_evidence_required", ""),
                if_no_recommendation=q_data.get("if_no_recommendation", ""),
                support_available=q_data.get("support_available", []),
                priority=q_data.get("priority", "medium_term"),
            )
            db.add(q)
        questions_by_id[q_data["id"]] = q
    db.flush()

    # 5. Canonical Services
    sample_services = [
        {
            "title": "Solar Drip Irrigation & Smart Fertigation",
            "provider": "SunCulture Kenya",
            "category": "Water & Irrigation",
            "description": "High-efficiency solar submersible pump system with pressure-compensating drip lines and mobile telemetry.",
            "pillar_id": 2,
            "cost_model": "KES 48,000 / installation",
            "icon": "☀️",
        },
        {
            "title": "Comprehensive Soil Health Macronutrient Audit",
            "provider": "AgriLab Western",
            "category": "Soil & Nutrition",
            "description": "Detailed soil chemical and biological testing for nitrogen, phosphorus, potassium, organic matter, and pH.",
            "pillar_id": 1,
            "cost_model": "KES 3,500 / acre sample",
            "icon": "🧪",
        },
        {
            "title": "Biochar Pyrolysis Kiln & Soil Amendment",
            "provider": "Biochar Innovations EA",
            "category": "Soil & Nutrition",
            "description": "On-farm conversion of crop residues into high-carbon biochar inoculated with indigenous micro-organisms.",
            "pillar_id": 4,
            "cost_model": "KES 12,000 / unit",
            "icon": "🌱",
        },
        {
            "title": "Smallholder Gross Margin Accounting Tool",
            "provider": "AgriFinance Solutions",
            "category": "Finance & Credit",
            "description": "Digital financial recordkeeping system with unit-economic reporting and bankable cash flow statements.",
            "pillar_id": 5,
            "cost_model": "KES 1,500 / month",
            "icon": "📊",
        },
        {
            "title": "GlobalGAP & Food Safety Certification Prep",
            "provider": "AfriCert Kenya",
            "category": "Certification",
            "description": "Audit readiness support, chemical residue tracking logs, and compliance documentation for export markets.",
            "pillar_id": 3,
            "cost_model": "KES 25,000 / audit",
            "icon": "🛡️",
        },
        {
            "title": "Mechanized Conservation Tillage & Direct Seeder",
            "provider": "Hello Tractor Hub",
            "category": "Mechanization",
            "description": "On-demand tractor hiring for minimum-tillage ripping and precision seed-fertilizer placement.",
            "pillar_id": 6,
            "cost_model": "KES 4,000 / acre",
            "icon": "🚜",
        },
        {
            "title": "Direct Aggregation & High-Value Offtake",
            "provider": "Twiga Foods Marketplace",
            "category": "Market Access",
            "description": "Guaranteed minimum pricing and scheduled farm-gate collection for Grade-A vegetables and cereals.",
            "pillar_id": 7,
            "cost_model": "Commission-based",
            "icon": "🏪",
        },
        {
            "title": "Agribusiness Working Capital Credit Facility",
            "provider": "Equity Bank Agri-Desk",
            "category": "Finance & Credit",
            "description": "Seasonal input financing and revolving credit facility tailored for structured commercial farms.",
            "pillar_id": 8,
            "cost_model": "Interest from 9.5% p.a.",
            "icon": "💳",
        },
    ]

    for s_item in sample_services:
        existing_srv = db.scalar(select(ServiceItem).where(ServiceItem.title == s_item["title"]))
        if not existing_srv:
            srv = ServiceItem(
                title=s_item["title"],
                provider=s_item["provider"],
                category=s_item["category"],
                description=s_item["description"],
                pillar_id=s_item["pillar_id"],
                cost_model=s_item["cost_model"],
                icon=s_item.get("icon", "🌱"),
            )
            db.add(srv)
    db.flush()

    # 6. Canonical Learning Modules
    sample_modules = [
        {
            "title": "Solar Drip Scheduling & PV Array Maintenance",
            "pillar_id": 2,
            "duration_minutes": 12,
            "level": "Beginner",
            "summary": "Step-by-step cleaning of solar photovoltaic panels, pressure valve regulation, and automated fertigation scheduling to maximize crop yield per kilowatt.",
        },
        {
            "title": "Regenerative Soil Conditioning & Biochar Pyrolysis",
            "pillar_id": 4,
            "duration_minutes": 15,
            "level": "Beginner",
            "summary": "Practical on-farm pyrolytic biomass kiln construction, inoculation with worm tea, and soil biological carbon enhancement for dryland water retention.",
        },
        {
            "title": "Farm Gross Margin Ledger & Unit Cost Bookkeeping",
            "pillar_id": 5,
            "duration_minutes": 20,
            "level": "Intermediate",
            "summary": "Practical financial recording to calculate unit production costs per kilogram, operational margins, and achieve bankable enterprise credibility.",
        },
        {
            "title": "Pre-Harvest Chemical Intervals & GlobalGAP Traceability",
            "pillar_id": 3,
            "duration_minutes": 18,
            "level": "Intermediate",
            "summary": "Understanding maximum residue limits (MRLs), spray withholding periods, harvest sanitation, and digital lot-tracking to access export markets.",
        },
        {
            "title": "Indigenous Weather Indicators & Contour Swale Catchments",
            "pillar_id": 4,
            "duration_minutes": 14,
            "level": "Beginner",
            "summary": "Harmonizing elder bio-indicator observations with modern weather forecasts, building zai pits, and constructing contour swales for zero runoff.",
        },
        {
            "title": "Smartphone Sensor Moisture Probes & Precision Irrigation",
            "pillar_id": 1,
            "duration_minutes": 16,
            "level": "Advanced",
            "summary": "Deploying low-cost LoRa soil matric potential sensors to schedule deficit irrigation and reduce pumping energy consumption by 40%.",
        },
        {
            "title": "Offtake Contract Negotiation & Value-Addition Packing",
            "pillar_id": 7,
            "duration_minutes": 22,
            "level": "Intermediate",
            "summary": "Commercial grading standards, cold-chain pre-cooling, aggregation logistics, and structured commodity supply agreement negotiation.",
        },
        {
            "title": "Biogas Slurry Nutrient Recycling & Soil Biology",
            "pillar_id": 2,
            "duration_minutes": 14,
            "level": "Intermediate",
            "summary": "Utilizing nitrogen-rich anaerobic digestate effluent as a foliar liquid bio-fertilizer for greenhouse tomato and horticulture production.",
        },
    ]

    for m_data in sample_modules:
        existing_m = db.scalar(select(LearningModule).where(LearningModule.title == m_data["title"]))
        if not existing_m:
            mod = LearningModule(
                title=m_data["title"],
                pillar_id=m_data["pillar_id"],
                duration_minutes=m_data["duration_minutes"],
                level=m_data["level"],
                summary=m_data["summary"],
            )
            db.add(mod)
    db.flush()

    return questions_by_id


def create_or_update_user(
    db: Session,
    email: str,
    name: str,
    phone: str,
    farm_name: str,
    region: str,
    crop_type: str,
    size_acres: float,
    password: str = "password123",
) -> tuple[User, Farm]:
    """Create or update a demo user and their farm."""
    user = db.scalar(select(User).where(User.email == email))
    if not user:
        user = User(
            email=email,
            name=name,
            phone=phone,
            role="farmer",
            password_hash=hash_password(password),
            is_verified=True,
        )
        db.add(user)
        db.flush()
    else:
        user.name = name
        user.phone = phone
        user.password_hash = hash_password(password)
        db.flush()

    farm = db.scalar(select(Farm).where(Farm.user_id == user.id))
    if not farm:
        farm = Farm(
            user_id=user.id,
            name=farm_name,
            region=region,
            crop_type=crop_type,
            size_acres=size_acres,
        )
        db.add(farm)
        db.flush()
    else:
        farm.name = farm_name
        farm.region = region
        farm.crop_type = crop_type
        farm.size_acres = size_acres
        db.flush()

    return user, farm


def create_assessment_with_answers(
    db: Session,
    farm: Farm,
    user: User,
    questions_by_id: dict[str, Question],
    yes_probability: float,
    completed_days_ago: int = 0,
    scope: str = "full",
    target_pillar_id: int | None = None,
    reassessment_of_id: uuid.UUID | None = None,
) -> Assessment:
    """Create, score, and persist an assessment with realistic answers."""
    started_time = datetime.datetime.now(timezone.utc) - datetime.timedelta(days=completed_days_ago, minutes=45)
    submitted_time = datetime.datetime.now(timezone.utc) - datetime.timedelta(days=completed_days_ago)

    assessment = Assessment(
        farm_id=farm.id,
        assessor_id=user.id,
        scope=scope,
        target_pillar_id=target_pillar_id,
        reassessment_of_id=reassessment_of_id,
        status="submitted",
        started_at=started_time,
        submitted_at=submitted_time,
        rule_version_id="v1.0",
    )
    db.add(assessment)
    db.flush()

    # Determine which questions to answer
    q_list = list(questions_by_id.values())
    if scope == "pillar" and target_pillar_id:
        q_list = [q for q in q_list if q.pillar_id == target_pillar_id]

    answers_dict: dict[str, str] = {}
    for idx, q in enumerate(q_list):
        # Deterministic variation based on index so scores are reproducible
        mod_val = (idx * 7 + q.pillar_id * 13) % 100
        val = "yes" if (mod_val / 100.0) < yes_probability else "no"
        answers_dict[q.id] = val

        ans = Answer(
            assessment_id=assessment.id,
            question_id=q.id,
            value=val,
            answered_at=started_time + datetime.timedelta(seconds=idx * 10),
        )
        db.add(ans)
    db.flush()

    # Build capability hierarchy for scoring
    capabilities_by_pillar: dict[int, list[tuple[str, list[str]]]] = {}
    caps = db.scalars(select(Capability).order_by(Capability.pillar_id, Capability.number)).all()
    for c in caps:
        c_qids = [q.id for q in q_list if q.capability_id == c.id]
        if c_qids:
            capabilities_by_pillar.setdefault(c.pillar_id, []).append((c.id, c_qids))

    # Score using canonical scoring engine
    score_result = score_assessment(answers_dict, capabilities_by_pillar)

    assessment.ffmi_score = score_result.ffmi_score
    assessment.tier = score_result.tier
    assessment.pillar_scores = {str(k): v for k, v in score_result.pillar_scores.items()}
    assessment.capability_status = score_result.capability_status

    # Generate recommendations
    recs = build_recommendations(answers_dict, questions_by_id, score_result.capability_status)
    for r_data in recs:
        rec = Recommendation(
            assessment_id=assessment.id,
            question_id=r_data.question_id,
            pillar_id=r_data.pillar_id,
            capability_id=r_data.capability_id,
            gap=r_data.gap,
            capability_status=r_data.capability_status,
            priority=r_data.priority,
            recommended_action=r_data.recommended_action,
            recommended_learning=r_data.recommended_learning,
            potential_service=r_data.potential_service,
        )
        db.add(rec)

    db.flush()
    return assessment


def seed_sample_data() -> None:
    """Main execution function to seed all sample data."""
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    SessionLocal = get_session_factory()

    with SessionLocal() as db:
        print("[*] Seeding canonical FFF framework (pillars, capabilities, questions, services, modules)...")
        questions_by_id = seed_canonical_framework(db)

        # ─── 1. Grace Wanjiru (farmer@arbarne.org) - Tier 4 Investment Ready ───
        print("[*] Seeding demo farmer Grace Wanjiru (farmer@arbarne.org)...")
        user_grace, farm_grace = create_or_update_user(
            db,
            email="farmer@arbarne.org",
            name="Grace Wanjiru",
            phone="+254 700 123 456",
            farm_name="Kakamega Demofarm",
            region="Western Kenya",
            crop_type="Maize, Dairy & Vegetables",
            size_acres=5.0,
            password="password123",
        )

        # Delete any past assessments for clean re-seed
        old_ass = db.scalars(select(Assessment).where(Assessment.farm_id == farm_grace.id)).all()
        for oa in old_ass:
            db.delete(oa)
        db.flush()

        # Completed baseline assessment (Tier 4, ~18.24 FFMI)
        ass_grace = create_assessment_with_answers(
            db,
            farm_grace,
            user_grace,
            questions_by_id,
            yes_probability=0.78,
            completed_days_ago=5,
        )

        # ─── 2. Joseph Ochieng (demo@arbarne.org / farmer@example.com) - Progression Demo ───
        print("[*] Seeding demo farmer Joseph Ochieng (demo@arbarne.org & farmer@example.com)...")
        for idx, email in enumerate(["demo@arbarne.org", "farmer@example.com"]):
            user_demo, farm_demo = create_or_update_user(
                db,
                email=email,
                name="Joseph Ochieng",
                phone=f"+254 712 345 67{8 + idx}",
                farm_name="Green Valley Demofarm",
                region="Rift Valley",
                crop_type="Maize, Dairy & Vegetables",
                size_acres=7.5,
                password="password123",
            )

            old_ass_demo = db.scalars(select(Assessment).where(Assessment.farm_id == farm_demo.id)).all()
            for oa in old_ass_demo:
                db.delete(oa)
            db.flush()

            # Baseline 6 months ago (Tier 2, ~11.20 FFMI)
            base_demo = create_assessment_with_answers(
                db,
                farm_demo,
                user_demo,
                questions_by_id,
                yes_probability=0.48,
                completed_days_ago=180,
            )

            # Follow-up assessment 10 days ago (Tier 3, ~14.40 FFMI)
            follow_demo = create_assessment_with_answers(
                db,
                farm_demo,
                user_demo,
                questions_by_id,
                yes_probability=0.62,
                completed_days_ago=10,
                reassessment_of_id=base_demo.id,
            )

        # ─── 3. Wycliffe Otieno (wycliffe@otienofarm.co.ke) - Tier 5 Future Ready ───
        print("[*] Seeding future-ready pioneer Wycliffe Otieno (wycliffe@otienofarm.co.ke)...")
        user_wyc, farm_wyc = create_or_update_user(
            db,
            email="wycliffe@otienofarm.co.ke",
            name="Wycliffe Otieno",
            phone="+254 733 987 654",
            farm_name="Otieno Model Enterprise",
            region="Nyanza",
            crop_type="Horticulture, Poultry & Agroforestry",
            size_acres=12.0,
            password="password123",
        )

        old_ass_wyc = db.scalars(select(Assessment).where(Assessment.farm_id == farm_wyc.id)).all()
        for oa in old_ass_wyc:
            db.delete(oa)
        db.flush()

        create_assessment_with_answers(
            db,
            farm_wyc,
            user_wyc,
            questions_by_id,
            yes_probability=0.92,
            completed_days_ago=3,
        )

        # ─── 4. Portal Activity (Service Requests & Learning Progress) ───
        print("[*] Seeding service requests and learning progress...")
        services = db.scalars(select(ServiceItem)).all()
        modules = db.scalars(select(LearningModule)).all()

        for user, farm, latest_ass in [
            (user_grace, farm_grace, ass_grace),
            (user_demo, farm_demo, follow_demo),
            (user_wyc, farm_wyc, None),
        ]:
            # Delete old requests/progress
            old_reqs = db.scalars(select(ServiceRequest).where(ServiceRequest.user_id == user.id)).all()
            for r in old_reqs:
                db.delete(r)
            old_progs = db.scalars(select(LearningProgress).where(LearningProgress.user_id == user.id)).all()
            for p in old_progs:
                db.delete(p)
            db.flush()

            # Seed 2 service requests (1 delivered, 1 in-progress)
            if len(services) >= 2:
                req1 = ServiceRequest(
                    service_id=services[0].id,
                    farm_id=farm.id,
                    user_id=user.id,
                    assessment_id=latest_ass.id if latest_ass else None,
                    status="delivered",
                    notes="Installed solar pump system and trained farm operators.",
                    requested_at=datetime.datetime.now(timezone.utc) - datetime.timedelta(days=40),
                    delivered_at=datetime.datetime.now(timezone.utc) - datetime.timedelta(days=25),
                )
                req2 = ServiceRequest(
                    service_id=services[1].id,
                    farm_id=farm.id,
                    user_id=user.id,
                    assessment_id=latest_ass.id if latest_ass else None,
                    status="in_progress",
                    notes="Soil samples collected; awaiting laboratory assay results.",
                    requested_at=datetime.datetime.now(timezone.utc) - datetime.timedelta(days=4),
                )
                db.add_all([req1, req2])

            # Seed 2 completed courses + 1 in-progress
            if len(modules) >= 3:
                prog1 = LearningProgress(
                    user_id=user.id,
                    module_id=modules[0].id,
                    status="completed",
                    completed_at=datetime.datetime.now(timezone.utc) - datetime.timedelta(days=20),
                )
                prog2 = LearningProgress(
                    user_id=user.id,
                    module_id=modules[1].id,
                    status="completed",
                    completed_at=datetime.datetime.now(timezone.utc) - datetime.timedelta(days=12),
                )
                prog3 = LearningProgress(
                    user_id=user.id,
                    module_id=modules[2].id,
                    status="in_progress",
                )
                db.add_all([prog1, prog2, prog3])

            # Seed Gamification record
            old_gam = db.scalar(select(UserGamification).where(UserGamification.user_id == user.id))
            if not old_gam:
                gam = UserGamification(
                    user_id=user.id,
                    farm_id=farm.id,
                    total_xp=620 if user.email != "wycliffe@otienofarm.co.ke" else 1450,
                    level=3 if user.email != "wycliffe@otienofarm.co.ke" else 5,
                    level_name="Resilient Steward" if user.email != "wycliffe@otienofarm.co.ke" else "Future-Ready Sovereign",
                    streak_days=4,
                    completed_quest_ids=["quest_soil_baseline", "quest_solar_check"],
                )
                db.add(gam)

        db.commit()
        print("[SUCCESS] Sample data population complete! Demo farmers, assessments, services, and courses ready.")


if __name__ == "__main__":
    seed_sample_data()
