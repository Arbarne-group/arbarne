"""Synthetic Dataset Generator for Future Farms Framework (FFF) ML Subsystem.

Generates statistically sound, domain-grounded synthetic datasets aligned with:
- Canonical 200-question FFF assessment structure (P1.1.1 through P8.5.5)
- East African agro-ecological corridors & crop taxonomy
- Deterministic FFMI scoring & 5-tier maturity classification
- 3 population-scale farm archetypes (Informal, Transitioning, Commercial Leader)
- Multi-class 12-month trajectory default risk prediction (Low, Medium, High)
- Verifier evidence audit telemetry & fraud anomaly detection
"""

from __future__ import annotations

import hashlib
import logging
import random
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

from app.ml.validation import validate_evidence_metadata, validate_survey_payload
from app.scoring.engine import (
    DEFAULT_FFMI_BANDS,
    ScoringResult,
    score_assessment,
)

log = logging.getLogger(__name__)

# ─── CANONICAL FFF ONTOLOGY STRUCTURE ────────────────────────────────────────

# 8 Pillars and their 5 capabilities each
PILLAR_METADATA = {
    1: {"name": "Smart Farming and Digital Transformation", "code": "P1", "weight": 3.0},
    2: {"name": "Productive Use of Renewable Energy", "code": "P2", "weight": 3.0},
    3: {"name": "Food Safety and Compliance", "code": "P3", "weight": 3.0},
    4: {"name": "Indigenous Knowledge and Climate Resilience", "code": "P4", "weight": 3.0},
    5: {"name": "Farm Business Performance and Growth", "code": "P5", "weight": 3.0},
    6: {"name": "Human Capital, Leadership and Farm Operations", "code": "P6", "weight": 3.0},
    7: {"name": "Market Access, Customer Value and Competitiveness", "code": "P7", "weight": 3.0},
    8: {"name": "Investment Readiness and Enterprise Development", "code": "P8", "weight": 3.0},
}

# Build full mapping of 8 pillars × 5 capabilities × 5 questions = 200 questions
def build_canonical_capability_structure() -> Dict[int, List[Tuple[str, List[str]]]]:
    structure: Dict[int, List[Tuple[str, List[str]]]] = {}
    for p in range(1, 9):
        capabilities: List[Tuple[str, List[str]]] = []
        for c in range(1, 6):
            cap_id = f"P{p}.{c}"
            question_ids = [f"P{p}.{c}.{q}" for q in range(1, 6)]
            capabilities.append((cap_id, question_ids))
        structure[p] = capabilities
    return structure


CANONICAL_CAPABILITIES = build_canonical_capability_structure()
ALL_QUESTION_IDS = [
    f"P{p}.{c}.{q}"
    for p in range(1, 9)
    for c in range(1, 6)
    for q in range(1, 6)
]

# ─── EAST AFRICAN AGRO-ECOLOGICAL TAXONOMY ───────────────────────────────────

REGIONS_METADATA = {
    "Western Kenya": {
        "counties": ["Kakamega", "Bungoma", "Busia", "Vihiga", "Kisumu", "Siaya"],
        "bounds": {"lat_min": -0.5, "lat_max": 1.2, "lon_min": 34.0, "lon_max": 35.2},
        "crops": ["Maize", "Sugarcane", "Cassava", "Dairy", "Horticulture", "Poultry"],
        "climate_risk_baseline": 0.35,
        "market_volatility": 0.40,
    },
    "Rift Valley": {
        "counties": ["Nakuru", "Uasin Gishu", "Trans Nzoia", "Bomet", "Kericho", "Nandi"],
        "bounds": {"lat_min": -1.2, "lat_max": 1.4, "lon_min": 35.0, "lon_max": 36.5},
        "crops": ["Maize", "Wheat", "Dairy", "Tea", "Potatoes", "Horticulture"],
        "climate_risk_baseline": 0.30,
        "market_volatility": 0.35,
    },
    "Central Highlands": {
        "counties": ["Nyeri", "Kiambu", "Murang'a", "Kirinyaga", "Embu", "Meru"],
        "bounds": {"lat_min": -1.4, "lat_max": 0.3, "lon_min": 36.6, "lon_max": 37.8},
        "crops": ["Coffee", "Tea", "Avocado", "Dairy", "Horticulture", "Macadamia"],
        "climate_risk_baseline": 0.25,
        "market_volatility": 0.30,
    },
    "Eastern Semi-Arid": {
        "counties": ["Machakos", "Makueni", "Kitui", "Tharaka Nithi"],
        "bounds": {"lat_min": -2.5, "lat_max": 0.0, "lon_min": 37.2, "lon_max": 38.8},
        "crops": ["Mangoes", "Sorghum", "Cowpeas", "Pigeon Peas", "Livestock", "Green Grams"],
        "climate_risk_baseline": 0.65,
        "market_volatility": 0.50,
    },
    "Coastal Lowlands": {
        "counties": ["Kilifi", "Kwale", "Taita Taveta", "Lamu"],
        "bounds": {"lat_min": -4.6, "lat_max": -2.0, "lon_min": 38.5, "lon_max": 40.5},
        "crops": ["Cashew", "Coconut", "Cassava", "Vegetables", "Fish Farming"],
        "climate_risk_baseline": 0.55,
        "market_volatility": 0.45,
    },
}

# ─── POPULATION ARCHETYPES PROBABILITIES ─────────────────────────────────────

ARCHETYPE_PROFILES = {
    "Informal Smallholder": {
        "id": 0,
        "population_share": 0.50,
        "acreage_params": {"mean": 2.2, "std": 1.2, "min": 0.5, "max": 8.0},
        # Likelihood of answering "Yes" to questions in each pillar (1..8)
        # Level 1 (Q1-2: Basic) vs Level 2 (Q3-4: Developing) vs Level 3 (Q5: Strategic)
        "pillar_adoption_rates": {
            1: [0.35, 0.25, 0.15, 0.08, 0.03],  # Smart Farming
            2: [0.40, 0.30, 0.18, 0.10, 0.04],  # Renewable Energy
            3: [0.45, 0.35, 0.20, 0.12, 0.05],  # Food Safety
            4: [0.75, 0.70, 0.55, 0.45, 0.25],  # Indigenous Resilience (Strong)
            5: [0.30, 0.22, 0.12, 0.06, 0.02],  # Financial Performance
            6: [0.50, 0.40, 0.25, 0.15, 0.05],  # Human Capital
            7: [0.35, 0.25, 0.15, 0.08, 0.03],  # Market Access
            8: [0.20, 0.12, 0.06, 0.03, 0.01],  # Investment Readiness
        },
        "historical_delta_range": (-1.5, 2.0),
    },
    "Transitioning Agribusiness": {
        "id": 1,
        "population_share": 0.35,
        "acreage_params": {"mean": 6.5, "std": 3.5, "min": 1.5, "max": 25.0},
        "pillar_adoption_rates": {
            1: [0.75, 0.65, 0.50, 0.35, 0.18],  # Smart Farming
            2: [0.70, 0.60, 0.48, 0.32, 0.16],  # Renewable Energy
            3: [0.80, 0.72, 0.60, 0.45, 0.25],  # Food Safety
            4: [0.85, 0.80, 0.70, 0.58, 0.40],  # Indigenous Resilience
            5: [0.72, 0.62, 0.48, 0.35, 0.18],  # Financial Performance
            6: [0.80, 0.70, 0.58, 0.42, 0.22],  # Human Capital
            7: [0.75, 0.65, 0.52, 0.38, 0.20],  # Market Access
            8: [0.60, 0.50, 0.35, 0.22, 0.10],  # Investment Readiness
        },
        "historical_delta_range": (0.5, 4.5),
    },
    "Commercial Market Leader": {
        "id": 2,
        "population_share": 0.15,
        "acreage_params": {"mean": 24.0, "std": 15.0, "min": 5.0, "max": 120.0},
        "pillar_adoption_rates": {
            1: [0.95, 0.90, 0.85, 0.78, 0.65],  # Smart Farming
            2: [0.92, 0.88, 0.82, 0.75, 0.60],  # Renewable Energy
            3: [0.98, 0.95, 0.90, 0.85, 0.72],  # Food Safety
            4: [0.90, 0.88, 0.82, 0.76, 0.62],  # Indigenous Resilience
            5: [0.96, 0.92, 0.88, 0.82, 0.70],  # Financial Performance
            6: [0.95, 0.92, 0.86, 0.80, 0.68],  # Human Capital
            7: [0.96, 0.94, 0.90, 0.85, 0.75],  # Market Access
            8: [0.92, 0.88, 0.80, 0.72, 0.58],  # Investment Readiness
        },
        "historical_delta_range": (1.0, 5.0),
    },
}


class SyntheticDataGenerator:
    """Configurable synthetic data generator for FFF models and pipelines."""

    def __init__(self, seed: Optional[int] = 42) -> None:
        self.seed = seed
        self.rng = np.random.default_rng(seed)
        random.seed(seed)

    def generate_farm_surveys(
        self,
        n_samples: int = 1000,
        validate_payloads: bool = True,
    ) -> pd.DataFrame:
        """Generate comprehensive 200-question assessment survey responses.

        Includes farm demographics, binary responses, deterministic scores,
        pillar fractions, and maturity tiers.
        """
        records: List[Dict[str, Any]] = []

        archetype_names = list(ARCHETYPE_PROFILES.keys())
        archetype_probs = [ARCHETYPE_PROFILES[k]["population_share"] for k in archetype_names]
        chosen_archetypes = self.rng.choice(archetype_names, size=n_samples, p=archetype_probs)

        regions = list(REGIONS_METADATA.keys())

        for i in range(n_samples):
            arch_name = chosen_archetypes[i]
            arch_cfg = ARCHETYPE_PROFILES[arch_name]

            # Farm demographics
            region_name = str(self.rng.choice(regions))
            reg_info = REGIONS_METADATA[region_name]
            county = str(self.rng.choice(reg_info["counties"]))
            crop_type = str(self.rng.choice(reg_info["crops"]))

            # Farm Acreage
            ac_cfg = arch_cfg["acreage_params"]
            raw_acreage = self.rng.normal(ac_cfg["mean"], ac_cfg["std"])
            acreage = float(np.clip(raw_acreage, ac_cfg["min"], ac_cfg["max"]))

            # Centroid Coordinates
            b = reg_info["bounds"]
            farm_lat = float(self.rng.uniform(b["lat_min"], b["lat_max"]))
            farm_lon = float(self.rng.uniform(b["lon_min"], b["lon_max"]))

            # Farm Metadata
            farm_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"fff-farm-{self.seed}-{i}"))
            assessment_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"fff-assess-{self.seed}-{i}"))
            farm_name = f"{county} {crop_type} Farm #{i+1:04d}"
            farmer_exp = int(np.clip(self.rng.normal(12, 6), 1, 45))
            coop_member = bool(self.rng.random() < (0.4 if arch_name == "Informal Smallholder" else 0.85))

            # Generate 200 question responses
            answers_dict: Dict[str, str] = {}
            for p in range(1, 9):
                p_rates = arch_cfg["pillar_adoption_rates"][p]
                for c in range(1, 6):
                    for q in range(1, 6):
                        q_id = f"P{p}.{c}.{q}"
                        # Probability based on question level within capability (1..5)
                        prob_yes = p_rates[q - 1]
                        # Slight random variance per farm
                        farm_prob = np.clip(prob_yes + self.rng.normal(0, 0.06), 0.02, 0.98)
                        val = "yes" if self.rng.random() < farm_prob else "no"
                        answers_dict[q_id] = val

            if validate_payloads and i < 20:
                is_valid, errs = validate_survey_payload(answers_dict)
                if not is_valid:
                    log.warning("Validation issue in synthetic sample %d: %s", i, errs)

            # Score through deterministic engine
            scoring_res: ScoringResult = score_assessment(
                answers=answers_dict,
                capabilities_by_pillar=CANONICAL_CAPABILITIES,
                bands=DEFAULT_FFMI_BANDS,
            )

            # Build flat record
            rec: Dict[str, Any] = {
                "farm_id": farm_id,
                "assessment_id": assessment_id,
                "farm_name": farm_name,
                "region": region_name,
                "county": county,
                "crop_type": crop_type,
                "acreage": round(acreage, 2),
                "latitude": round(farm_lat, 6),
                "longitude": round(farm_lon, 6),
                "farmer_experience_years": farmer_exp,
                "is_coop_member": coop_member,
                "archetype": arch_name,
                "archetype_id": arch_cfg["id"],
                "ffmi_score": scoring_res.ffmi_score,
                "tier": scoring_res.tier,
                "tier_classification": scoring_res.tier_classification,
            }

            # Add pillar scores (P1..P8)
            for p in range(1, 9):
                rec[f"pillar_{p}_score"] = round(scoring_res.pillar_scores.get(p, 0.0), 4)

            # Add binary question answers (0 or 1)
            for q_id, ans in answers_dict.items():
                rec[f"q_{q_id}"] = 1 if ans == "yes" else 0

            records.append(rec)

        df = pd.DataFrame(records)
        log.info("Generated %d synthetic farm survey records.", len(df))
        return df

    def generate_clustering_dataset(
        self,
        n_samples: int = 1000,
        df_surveys: Optional[pd.DataFrame] = None,
    ) -> pd.DataFrame:
        """Generate 8-pillar feature dataset (X_cluster in R^[N x 8]) for K-Means."""
        if df_surveys is None:
            df_surveys = self.generate_farm_surveys(n_samples=n_samples, validate_payloads=False)

        cols = [
            "farm_id",
            "farm_name",
            "region",
            "county",
            "crop_type",
            "acreage",
            "archetype",
            "archetype_id",
            "ffmi_score",
            "tier",
            "tier_classification",
        ] + [f"pillar_{p}_score" for p in range(1, 9)]

        df_cluster = df_surveys[cols].copy()
        log.info("Generated %d clustering feature records.", len(df_cluster))
        return df_cluster

    def generate_section_capability_dataset(
        self,
        n_samples: int = 1000,
        df_surveys: Optional[pd.DataFrame] = None,
    ) -> pd.DataFrame:
        """Generate full 40-capability breakdown dataset across the 8 assessment sections.

        Features:
        - Demographics & archetype metadata
        - 40 capability scores (P1.1 .. P8.5), yes/no counts, and maturity level ratings (0..5)
        - 8 section score fractions and section FFMI contribution points
        - Section diagnostic indicators (strongest capability, priority gap capability per section)
        """
        if df_surveys is None:
            df_surveys = self.generate_farm_surveys(n_samples=n_samples, validate_payloads=False)

        records: List[Dict[str, Any]] = []
        status_levels = {0: "non_existent", 1: "emerging", 2: "basic", 3: "developing", 4: "established", 5: "advanced"}

        for _, row in df_surveys.iterrows():
            rec: Dict[str, Any] = {
                "farm_id": row["farm_id"],
                "assessment_id": row["assessment_id"],
                "farm_name": row["farm_name"],
                "region": row["region"],
                "county": row["county"],
                "crop_type": row["crop_type"],
                "acreage": row["acreage"],
                "archetype": row["archetype"],
                "archetype_id": row["archetype_id"],
                "ffmi_score": row["ffmi_score"],
                "tier": row["tier"],
                "tier_classification": row["tier_classification"],
            }

            for p in range(1, 9):
                p_score = float(row[f"pillar_{p}_score"])
                rec[f"section_{p}_score"] = p_score
                rec[f"section_{p}_points"] = round(p_score * 3.0, 2)

                cap_scores = []
                for c in range(1, 6):
                    cap_id = f"P{p}.{c}"
                    # Count yes answers for this capability
                    q_cols = [f"q_{cap_id}.{q}" for q in range(1, 6)]
                    yes_count = int(sum(row[q_col] for q_col in q_cols if q_col in row))
                    level = yes_count  # 0 to 5
                    status = status_levels.get(level, "non_existent")
                    frac = round(level / 5.0, 4)

                    rec[f"cap_{cap_id}_score"] = frac
                    rec[f"cap_{cap_id}_yes_count"] = yes_count
                    rec[f"cap_{cap_id}_level"] = level
                    rec[f"cap_{cap_id}_status"] = status
                    cap_scores.append((cap_id, frac))

                # Strongest & Priority Gap for this section
                cap_scores.sort(key=lambda x: x[1], reverse=True)
                rec[f"section_{p}_strongest_cap"] = cap_scores[0][0]
                rec[f"section_{p}_gap_cap"] = cap_scores[-1][0]

            records.append(rec)

        df_sec = pd.DataFrame(records)
        log.info("Generated %d section capability analysis records.", len(df_sec))
        return df_sec


    def generate_risk_dataset(
        self,
        n_samples: int = 1000,
        df_surveys: Optional[pd.DataFrame] = None,
    ) -> pd.DataFrame:
        """Generate 14-dimensional feature matrix for 12-month trajectory default risk classifier.

        Features:
        - 8 Pillar score fractions (P1..P8)
        - Priority Gap Depth (P_gap = min(P1..P8))
        - Pillar Standard Deviation (sigma_P)
        - Log Acreage (log(1 + Acreage))
        - Climate Shock Index [0.0..1.0]
        - Market Price Volatility [0.0..1.0]
        - Longitudinal Momentum (delta_FFMI)

        Target:
        - risk_label: 0 (Low), 1 (Medium), 2 (High)
        - risk_category: String description
        - vulnerability_score: Continuous [0.0, 1.0]
        """
        if df_surveys is None:
            df_surveys = self.generate_farm_surveys(n_samples=n_samples, validate_payloads=False)
        records: List[Dict[str, Any]] = []

        for _, row in df_surveys.iterrows():
            p_scores = [float(row[f"pillar_{p}_score"]) for p in range(1, 9)]
            p_gap = float(min(p_scores))
            p_variance = float(np.std(p_scores))
            ffmi = float(row["ffmi_score"])
            acreage = float(row["acreage"])
            log_acreage = float(np.log1p(acreage))

            reg_info = REGIONS_METADATA[row["region"]]
            climate_base = reg_info["climate_risk_baseline"]
            market_base = reg_info["market_volatility"]

            # Add stochastic environmental shock perturbations
            climate_shock = float(np.clip(self.rng.normal(climate_base, 0.12), 0.05, 0.95))
            market_volatility = float(np.clip(self.rng.normal(market_base, 0.10), 0.05, 0.95))

            # Longitudinal momentum (change from prior year)
            arch_cfg = ARCHETYPE_PROFILES[row["archetype"]]
            d_min, d_max = arch_cfg["historical_delta_range"]
            delta_ffmi = float(self.rng.uniform(d_min, d_max))
            prev_ffmi = float(np.clip(ffmi - delta_ffmi, 0.0, 24.0))

            # Domain Ground-Truth Risk Modeling
            # Vulnerability increases with: low FFMI, deep priority gap (P_gap < 0.25),
            # high climate shock without P4/P2 resilience, high pillar imbalance, small acreage.
            # Resilience increases with: high FFMI, balanced pillars, high P1/P5/P8, positive delta.
            resilience_factor = (
                0.35 * (ffmi / 24.0)
                + 0.20 * p_gap
                + 0.15 * p_scores[3]  # P4: Indigenous/Climate
                + 0.10 * p_scores[1]  # P2: Renewable Energy
                + 0.10 * p_scores[4]  # P5: Business Performance
                + 0.10 * np.clip(delta_ffmi / 5.0, -1.0, 1.0)
            )

            threat_factor = (
                0.50 * climate_shock
                + 0.30 * market_volatility
                + 0.20 * p_variance
            )

            # Continuous vulnerability index in [0.0, 1.0]
            raw_vuln = (1.0 - resilience_factor) * 0.65 + threat_factor * 0.35
            vulnerability_score = float(np.clip(raw_vuln + self.rng.normal(0, 0.04), 0.01, 0.99))

            # Discretize into canonical 3-tier risk labels
            if ffmi < 5.0 or p_gap < 0.25 or vulnerability_score > 0.62:
                risk_label = 2  # High Risk
                risk_category = "High Risk"
            elif ffmi >= 16.0 and p_gap >= 0.45 and vulnerability_score < 0.38:
                risk_label = 0  # Low Risk
                risk_category = "Low Risk"
            else:
                risk_label = 1  # Medium Risk
                risk_category = "Medium Risk"

            rec: Dict[str, Any] = {
                "farm_id": row["farm_id"],
                "farm_name": row["farm_name"],
                "region": row["region"],
                "crop_type": row["crop_type"],
                "acreage": acreage,
                "log_acreage": round(log_acreage, 4),
                "ffmi_score": ffmi,
                "tier": int(row["tier"]),
                "tier_classification": row["tier_classification"],
                "pillar_1_smart_farming": p_scores[0],
                "pillar_2_renewable_energy": p_scores[1],
                "pillar_3_food_safety": p_scores[2],
                "pillar_4_climate_resilience": p_scores[3],
                "pillar_5_business_performance": p_scores[4],
                "pillar_6_human_capital": p_scores[5],
                "pillar_7_market_access": p_scores[6],
                "pillar_8_investment_readiness": p_scores[7],
                "priority_gap_depth": round(p_gap, 4),
                "pillar_variance": round(p_variance, 4),
                "climate_shock_index": round(climate_shock, 4),
                "market_volatility_index": round(market_volatility, 4),
                "historical_delta_ffmi": round(delta_ffmi, 4),
                "previous_ffmi_score": round(prev_ffmi, 4),
                "vulnerability_score": round(vulnerability_score, 4),
                "risk_label": risk_label,
                "risk_category": risk_category,
            }
            records.append(rec)

        df = pd.DataFrame(records)
        log.info("Generated %d risk training records.", len(df))
        return df

    def generate_evidence_audit_dataset(
        self,
        n_samples: int = 1000,
        anomaly_rate: float = 0.08,
    ) -> pd.DataFrame:
        """Generate field audit evidence telemetry dataset with synthetic anomaly injections.

        Features:
        - Assessment & farm IDs
        - Farm Centroid vs Photo GPS coordinates
        - Distance to centroid (km)
        - Timestamp intervals (delta_t)
        - Perceptual image hashes (dHash 64-bit hex strings)
        - Verification classification levels (A, B, C, D)
        - Ground truth anomaly flag & anomaly type
        """
        records: List[Dict[str, Any]] = []
        now = datetime.now(timezone.utc)

        # Pre-generate a bank of perceptual hashes to simulate photo recycling fraud
        shared_hashes = [
            hashlib.sha256(f"shared_img_evidence_{h}".encode()).hexdigest()[:16]
            for h in range(15)
        ]

        regions = list(REGIONS_METADATA.keys())

        for i in range(n_samples):
            evidence_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"fff-evidence-{self.seed}-{i}"))
            farm_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"fff-farm-{self.seed}-{i}"))
            assessment_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"fff-assess-{self.seed}-{i}"))

            region_name = str(self.rng.choice(regions))
            reg_info = REGIONS_METADATA[region_name]
            b = reg_info["bounds"]

            centroid_lat = float(self.rng.uniform(b["lat_min"], b["lat_max"]))
            centroid_lon = float(self.rng.uniform(b["lon_min"], b["lon_max"]))

            # Normal photo location within 0.001 to 0.8 km of centroid
            normal_offset_lat = float(self.rng.normal(0, 0.003))
            normal_offset_lon = float(self.rng.normal(0, 0.003))
            photo_lat = centroid_lat + normal_offset_lat
            photo_lon = centroid_lon + normal_offset_lon

            # Timestamp sequence
            capture_dt = now - timedelta(days=int(self.rng.integers(1, 60)), hours=int(self.rng.integers(0, 23)))
            upload_dt = capture_dt + timedelta(minutes=int(self.rng.integers(5, 120)))
            time_delta_sec = (upload_dt - capture_dt).total_seconds()

            # Unique image dHash
            img_hash = hashlib.sha256(f"unique_photo_{i}_{self.seed}".encode()).hexdigest()[:16]
            classification = str(self.rng.choice(["A", "B", "C", "D"], p=[0.25, 0.35, 0.30, 0.10]))

            is_anomaly = 0
            anomaly_type = "clean"

            # Inject controlled anomalies
            if self.rng.random() < anomaly_rate:
                is_anomaly = 1
                anom_kind = str(self.rng.choice(["duplicate_hash", "gps_geofence_breach", "timestamp_retrograde", "bad_classification"]))

                if anom_kind == "duplicate_hash":
                    img_hash = str(self.rng.choice(shared_hashes))
                    anomaly_type = "duplicate_image_hash"
                elif anom_kind == "gps_geofence_breach":
                    # Teleported location (> 50 km away or out of East Africa)
                    photo_lat = centroid_lat + float(self.rng.choice([-1.5, 1.5]))
                    photo_lon = centroid_lon + float(self.rng.choice([-2.0, 2.0]))
                    anomaly_type = "gps_geofence_breach"
                elif anom_kind == "timestamp_retrograde":
                    # Retrograde timestamp (upload occurred before capture)
                    upload_dt = capture_dt - timedelta(minutes=int(self.rng.integers(10, 300)))
                    time_delta_sec = (upload_dt - capture_dt).total_seconds()
                    anomaly_type = "timestamp_monotonicity_violation"
                elif anom_kind == "bad_classification":
                    classification = str(self.rng.choice(["Z", "X", "INVALID", "E"]))
                    anomaly_type = "invalid_classification_tier"

            # Approximate Euclidean distance in km (1 deg lat ~ 111 km, 1 deg lon ~ 111 km at equator)
            dist_km = float(
                np.sqrt(((photo_lat - centroid_lat) * 111.0) ** 2 + ((photo_lon - centroid_lon) * 111.0) ** 2)
            )

            # Validate against evidence guardrails
            if i < 20 and is_anomaly == 0:
                ev_dict = {"latitude": photo_lat, "longitude": photo_lon, "classification": classification}
                validate_evidence_metadata(ev_dict)

            rec: Dict[str, Any] = {
                "evidence_id": evidence_id,
                "assessment_id": assessment_id,
                "farm_id": farm_id,
                "region": region_name,
                "farm_centroid_lat": round(centroid_lat, 6),
                "farm_centroid_lon": round(centroid_lon, 6),
                "photo_lat": round(photo_lat, 6),
                "photo_lon": round(photo_lon, 6),
                "distance_to_centroid_km": round(dist_km, 4),
                "capture_timestamp": capture_dt.isoformat(),
                "upload_timestamp": upload_dt.isoformat(),
                "time_delta_seconds": round(time_delta_sec, 1),
                "perceptual_dhash": img_hash,
                "evidence_classification": classification,
                "is_anomaly": is_anomaly,
                "anomaly_type": anomaly_type,
            }
            records.append(rec)

        df = pd.DataFrame(records)
        log.info("Generated %d evidence audit records (%d anomalies).", len(df), int(df["is_anomaly"].sum()))
        return df

    def generate_all_datasets(
        self,
        n_farms: int = 1000,
        n_evidence: int = 1000,
    ) -> Dict[str, Any]:
        """Generate complete suite of synthetic datasets and metadata profiles."""
        df_surveys = self.generate_farm_surveys(n_samples=n_farms)
        df_sections = self.generate_section_capability_dataset(n_samples=n_farms, df_surveys=df_surveys)
        df_cluster = self.generate_clustering_dataset(n_samples=n_farms, df_surveys=df_surveys)
        df_risk = self.generate_risk_dataset(n_samples=n_farms, df_surveys=df_surveys)
        df_evidence = self.generate_evidence_audit_dataset(n_samples=n_evidence)

        metadata = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "generator_seed": self.seed,
            "datasets": {
                "farm_surveys_200q": {
                    "rows": len(df_surveys),
                    "columns": len(df_surveys.columns),
                    "ffmi_mean": round(float(df_surveys["ffmi_score"].mean()), 2),
                    "tier_distribution": {int(k): int(v) for k, v in df_surveys["tier"].value_counts().to_dict().items()},
                },
                "section_capability_analysis": {
                    "rows": len(df_sections),
                    "columns": len(df_sections.columns),
                    "capabilities_count": 40,
                    "sections_count": 8,
                },
                "farm_clustering_features": {
                    "rows": len(df_cluster),
                    "columns": len(df_cluster.columns),
                    "archetype_distribution": {str(k): int(v) for k, v in df_cluster["archetype"].value_counts().to_dict().items()},
                },
                "farm_risk_training": {
                    "rows": len(df_risk),
                    "columns": len(df_risk.columns),
                    "risk_distribution": {str(k): int(v) for k, v in df_risk["risk_category"].value_counts().to_dict().items()},
                },
                "evidence_anomaly_audit": {
                    "rows": len(df_evidence),
                    "columns": len(df_evidence.columns),
                    "anomaly_rate": round(float(df_evidence["is_anomaly"].mean()), 4),
                    "anomaly_type_counts": {str(k): int(v) for k, v in df_evidence["anomaly_type"].value_counts().to_dict().items()},
                },
            },
        }

        return {
            "surveys": df_surveys,
            "sections": df_sections,
            "clustering": df_cluster,
            "risk": df_risk,
            "evidence": df_evidence,
            "metadata": metadata,
        }

