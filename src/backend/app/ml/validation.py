"""Data quality validation guardrails for Future Farms Framework (FFF).

Uses Great Expectations / rule-based validation to ensure survey payloads
and verifier evidence metadata meet domain constraints before persistence or scoring.
"""

from __future__ import annotations

import logging
import re
from typing import Any, Dict, List, Tuple

log = logging.getLogger(__name__)

# Valid FFF Question ID pattern: e.g. P1.1.1 through P8.5.5
QUESTION_ID_PATTERN = re.compile(r"^P[1-8]\.[1-5]\.[1-5]$")


def validate_survey_payload(answers: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Validate survey response payload against structural & range constraints.

    Returns:
        (is_valid, list_of_validation_errors)
    """
    errors: List[str] = []

    if not isinstance(answers, dict):
        return False, ["Payload answers must be a key-value dictionary."]

    if not answers:
        return False, ["Survey payload cannot be empty."]

    for q_id, val in answers.items():
        # Validate question ID format if standardized
        if isinstance(q_id, str) and q_id.startswith("P"):
            if not QUESTION_ID_PATTERN.match(q_id):
                errors.append(f"Invalid question ID format: '{q_id}'. Must match 'P[1-8].[1-5].[1-5]'.")

        # Validate score values (must be float/int in range 0 to 5 or valid response string)
        if isinstance(val, (int, float)):
            if val < 0 or val > 5:
                errors.append(f"Score for '{q_id}' out of bounds ({val}). Expected between 0 and 5.")
        elif isinstance(val, str):
            # Accept standard categorical responses or valid numeric string
            val_clean = val.strip().lower()
            allowed_cats = {"yes", "no", "partial", "na", "n/a", "non_existent", "initial", "developing", "defined", "managed", "advanced"}
            if val_clean not in allowed_cats:
                try:
                    num_val = float(val)
                    if num_val < 0 or num_val > 5:
                        errors.append(f"Numeric string for '{q_id}' out of bounds ({num_val}).")
                except ValueError:
                    errors.append(f"Unrecognized answer value '{val}' for '{q_id}'.")
        elif isinstance(val, dict):
            # Complex response dict validation
            if "score" in val:
                score = val["score"]
                if isinstance(score, (int, float)) and (score < 0 or score > 5):
                    errors.append(f"Score for '{q_id}' out of bounds ({score}).")
        elif val is None:
            continue
        else:
            errors.append(f"Invalid score data type for '{q_id}': {type(val).__name__}.")

    is_valid = len(errors) == 0
    if not is_valid:
        log.warning("Survey payload validation failed with %d error(s)", len(errors))
    else:
        log.info("Survey payload data validation passed successfully.")

    return is_valid, errors


def validate_evidence_metadata(evidence: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Validate verifier evidence payload (GPS coordinates, timestamp, classification).

    Returns:
        (is_valid, list_of_validation_errors)
    """
    errors: List[str] = []

    if not isinstance(evidence, dict):
        return False, ["Evidence payload must be a dictionary."]

    # GPS Validation (latitude: -90 to 90, longitude: -180 to 180)
    if "latitude" in evidence and evidence["latitude"] is not None:
        lat = evidence["latitude"]
        if not isinstance(lat, (int, float)) or not (-90 <= lat <= 90):
            errors.append(f"Latitude out of bounds: {lat}.")

    if "longitude" in evidence and evidence["longitude"] is not None:
        lon = evidence["longitude"]
        if not isinstance(lon, (int, float)) or not (-180 <= lon <= 180):
            errors.append(f"Longitude out of bounds: {lon}.")

    # Classification check (must be A, B, C, or D per FFF PRD §7.6)
    if "classification" in evidence and evidence["classification"] is not None:
        cls = str(evidence["classification"]).upper()
        if cls not in {"A", "B", "C", "D"}:
            errors.append(f"Invalid evidence classification level: '{cls}'. Expected A, B, C, or D.")

    is_valid = len(errors) == 0
    return is_valid, errors
