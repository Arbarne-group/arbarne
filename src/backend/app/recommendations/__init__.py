"""Recommendation engine — data-driven from the question rows."""

from app.recommendations.engine import (
    Recommendation,
    build_recommendations,
    strongest_and_priority_pillars,
)

__all__ = [
    "Recommendation",
    "build_recommendations",
    "strongest_and_priority_pillars",
]
