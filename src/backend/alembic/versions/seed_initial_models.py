"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-08-13

Creates the canonical FFF schema:
  pillars, capabilities, questions, rule_versions,
  users, farms, assessments, answers, evidence, recommendations.
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # pgvector extension
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # ─── pillars ────────────────────────────────────────────────────
    op.create_table(
        "pillars",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(255), nullable=False, unique=True),
        sa.Column("principle", sa.Text, nullable=False),
        sa.Column("seeks_to_achieve", postgresql.ARRAY(sa.Text), nullable=False, server_default="{}"),
        sa.Column("examples", postgresql.ARRAY(sa.Text), nullable=False, server_default="{}"),
        sa.Column("guiding_question", sa.Text, nullable=False),
    )

    # ─── capabilities ──────────────────────────────────────────────
    op.create_table(
        "capabilities",
        sa.Column("id", sa.String(8), primary_key=True),
        sa.Column("pillar_id", sa.Integer, sa.ForeignKey("pillars.id", ondelete="CASCADE"), nullable=False),
        sa.Column("number", sa.Integer, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.UniqueConstraint("pillar_id", "number", name="uq_capability_pillar_number"),
    )
    op.create_index("ix_capabilities_pillar_id", "capabilities", ["pillar_id"])

    # ─── questions ─────────────────────────────────────────────────
    op.create_table(
        "questions",
        sa.Column("id", sa.String(8), primary_key=True),
        sa.Column("pillar_id", sa.Integer, sa.ForeignKey("pillars.id", ondelete="CASCADE"), nullable=False),
        sa.Column("capability_id", sa.String(8), sa.ForeignKey("capabilities.id", ondelete="CASCADE"), nullable=False),
        sa.Column("question_number", sa.Integer, nullable=False),
        sa.Column("question_text", sa.Text, nullable=False),
        sa.Column("ffv_evidence_required", sa.Text, nullable=True),
        sa.Column("if_no_recommendation", sa.Text, nullable=True),
        sa.Column("why_it_matters", sa.Text, nullable=True),
        sa.Column("quick_win", sa.Text, nullable=True),
        sa.Column("support_available", postgresql.ARRAY(sa.Text), nullable=False, server_default="{}"),
        sa.Column("priority", sa.String(20), nullable=False),
        sa.Column("learning_resource_ref", sa.String(255), nullable=True),
        sa.Column("service_ref", sa.String(255), nullable=True),
        sa.UniqueConstraint("capability_id", "question_number", name="uq_question_capability_number"),
    )
    op.create_index("ix_questions_pillar_id", "questions", ["pillar_id"])
    op.create_index("ix_questions_capability_id", "questions", ["capability_id"])
    op.create_index("ix_questions_priority", "questions", ["priority"])

    # ─── rule_versions ─────────────────────────────────────────────
    op.create_table(
        "rule_versions",
        sa.Column("id", sa.String(16), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("bands", postgresql.JSON, nullable=False),
        sa.Column("notes", sa.Text, nullable=True),
    )

    # ─── users ─────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("email", sa.String(255), unique=True, nullable=True),
        sa.Column("phone", sa.String(32), unique=True, nullable=True),
        sa.Column("name", sa.String(255), nullable=True),
        sa.Column("role", sa.String(32), nullable=False, server_default="farmer"),
        sa.Column("organisation", sa.String(255), nullable=True),
        sa.Column("password_hash", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    # ─── farms ─────────────────────────────────────────────────────
    op.create_table(
        "farms",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.String(255), nullable=True),
        sa.Column("region", sa.String(128), nullable=True),
        sa.Column("crop_type", sa.String(128), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_farms_region", "farms", ["region"])

    # ─── assessments ───────────────────────────────────────────────
    op.create_table(
        "assessments",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("farm_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("farms.id", ondelete="CASCADE"), nullable=False),
        sa.Column("assessor_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("type", sa.String(32), nullable=False, server_default="self"),
        sa.Column("status", sa.String(32), nullable=False, server_default="draft"),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("rule_version_id", sa.String(16), sa.ForeignKey("rule_versions.id", ondelete="SET NULL"), nullable=True),
        sa.Column("ffmi_score", sa.Float, nullable=True),
        sa.Column("tier", sa.Integer, nullable=True),
        sa.Column("pillar_scores", postgresql.JSON, nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("capability_status", postgresql.JSON, nullable=False, server_default=sa.text("'{}'::jsonb")),
    )
    op.create_index("ix_assessments_farm_id", "assessments", ["farm_id"])
    op.create_index("ix_assessments_status", "assessments", ["status"])
    op.create_index("ix_assessments_submitted_at", "assessments", ["submitted_at"])

    # ─── answers ───────────────────────────────────────────────────
    op.create_table(
        "answers",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("assessment_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("question_id", sa.String(8), sa.ForeignKey("questions.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("value", sa.String(8), nullable=False),
        sa.Column("answered_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("assessment_id", "question_id", name="uq_answer_assessment_question"),
    )
    op.create_index("ix_answers_assessment_id", "answers", ["assessment_id"])

    # ─── evidence ──────────────────────────────────────────────────
    op.create_table(
        "evidence",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("assessment_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("question_id", sa.String(8), sa.ForeignKey("questions.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("evidence_class", sa.String(4), nullable=False),
        sa.Column("type", sa.String(32), nullable=False),
        sa.Column("file_url", sa.String(512), nullable=True),
        sa.Column("gps_lat", sa.Numeric(10, 7), nullable=True),
        sa.Column("gps_lng", sa.Numeric(10, 7), nullable=True),
        sa.Column("captured_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("verifier_notes", sa.Text, nullable=True),
        sa.Column("verified_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("verified_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_evidence_assessment_id", "evidence", ["assessment_id"])

    # ─── recommendations ──────────────────────────────────────────
    op.create_table(
        "recommendations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("assessment_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("question_id", sa.String(8), sa.ForeignKey("questions.id", ondelete="SET NULL"), nullable=True),
        sa.Column("capability_id", sa.String(8), sa.ForeignKey("capabilities.id", ondelete="SET NULL"), nullable=True),
        sa.Column("pillar_id", sa.Integer, sa.ForeignKey("pillars.id", ondelete="SET NULL"), nullable=True),
        sa.Column("gap", sa.Text, nullable=False),
        sa.Column("capability_status", sa.String(20), nullable=False),
        sa.Column("recommended_action", sa.Text, nullable=False),
        sa.Column("recommended_learning", sa.Text, nullable=False),
        sa.Column("potential_service", sa.Text, nullable=False),
        sa.Column("priority", sa.String(20), nullable=False),
    )
    op.create_index("ix_recommendations_assessment_id", "recommendations", ["assessment_id"])
    op.create_index("ix_recommendations_priority", "recommendations", ["priority"])


def downgrade() -> None:
    op.drop_table("recommendations")
    op.drop_table("evidence")
    op.drop_table("answers")
    op.drop_table("assessments")
    op.drop_table("farms")
    op.drop_table("users")
    op.drop_table("rule_versions")
    op.drop_table("questions")
    op.drop_table("capabilities")
    op.drop_table("pillars")
    op.execute("DROP EXTENSION IF EXISTS vector")
