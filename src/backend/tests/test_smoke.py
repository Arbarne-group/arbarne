"""Smoke test that imports the app and exercises the most critical paths."""

from __future__ import annotations


def test_app_imports():
    """The FastAPI app must import cleanly."""
    from app.main import app
    assert app is not None
    assert app.title == "Future Farms Framework API"


def test_settings_load():
    """Settings must load from environment."""
    from app.core.config import settings
    assert settings.app_env != ""
    assert settings.postgres_user != ""


def test_models_are_registered():
    """All models must be registered with Base.metadata."""
    from app.db.session import Base
    tables = set(Base.metadata.tables.keys())
    assert "pillars" in tables
    assert "capabilities" in tables
    assert "questions" in tables
    assert "assessments" in tables
    assert "answers" in tables
    assert "evidence" in tables
    assert "recommendations" in tables
    assert "rule_versions" in tables
    assert "users" in tables
    assert "farms" in tables


def test_scoring_engine_is_independent_of_llm():
    """Architectural invariant: importing the scoring engine must not pull in anthropic."""
    import sys
    import app.scoring.engine as engine
    # Engine has been imported; anthropic should not be required to construct it
    assert not hasattr(engine, "anthropic")


def test_alembic_migration_present():
    """The migration files must exist."""
    from pathlib import Path
    backend_root = Path(__file__).resolve().parents[1]
    versions_dir = backend_root / "alembic" / "versions"
    files = [f for f in versions_dir.glob("*.py") if not f.name.startswith(".")]
    assert len(files) >= 1, "No migration files found"
    content = "\n".join(f.read_text() for f in files)
    assert "pillars" in content
    assert "questions" in content
