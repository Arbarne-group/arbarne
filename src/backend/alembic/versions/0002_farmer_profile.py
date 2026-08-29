"""add farmer_profile to users

Revision ID: 0002_farmer_profile
Revises: 0001_initial
Create Date: 2026-08-28

Adds the `farmer_profile` JSON column that stores the structured answers
captured during the Farmer Profile onboarding step (job title, experience,
operating style, aspirations, digital-platform readiness, etc.).
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0002_farmer_profile"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "farmer_profile",
            sa.JSON().with_variant(postgresql.JSON, "postgresql"),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "farmer_profile")
