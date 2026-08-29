"""Add diagnosis_report JSON column to assessments table.

Revision: 0003_diagnosis_report
Down revision: 0002_farmer_profile
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0003_diagnosis_report"
down_revision = "0002_farmer_profile"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "assessments",
        sa.Column("diagnosis_report", sa.JSON(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("assessments", "diagnosis_report")
