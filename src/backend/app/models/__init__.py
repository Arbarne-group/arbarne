"""SQLAlchemy ORM models.

Every model that needs to be visible to Alembic must be imported here
so that Base.metadata is populated when the migration env is loaded.
"""

from app.models.assessment import Answer, Assessment, Farm
from app.models.evidence import Evidence
from app.models.framework import (
    Capability,
    Pillar,
    Question,
    RuleVersion,
)
from app.models.gamification import UserBadge, UserGamification
from app.models.portal import (
    LearningModule,
    LearningProgress,
    ServiceItem,
    ServiceRequest,
)
from app.models.recommendation import Recommendation
from app.models.user import User

__all__ = [
    "Answer",
    "Assessment",
    "Capability",
    "Evidence",
    "Farm",
    "LearningModule",
    "LearningProgress",
    "Pillar",
    "Question",
    "Recommendation",
    "RuleVersion",
    "ServiceItem",
    "ServiceRequest",
    "User",
    "UserBadge",
    "UserGamification",
]

