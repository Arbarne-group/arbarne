"""Pytest configuration.

Tests run against an in-memory SQLite database when ``DATABASE_URL`` is
not set, so they can run without Docker. The unit tests (scoring,
recommendations) do not need a real database at all.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

# Ensure DATABASE_URL is set before any app code or settings load during test collection
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault("APP_DEBUG", "true")
os.environ.setdefault("ANTHROPIC_API_KEY", "test-key")
os.environ.setdefault("JWT_SECRET", "test-secret-key-for-jwt-signing-12345")

import pytest

# Make the backend package importable
BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))


@pytest.fixture(autouse=True)
def _ensure_test_env(monkeypatch):
    """Default to SQLite + a dummy API key for tests."""
    monkeypatch.setenv("APP_ENV", "test")
    monkeypatch.setenv("APP_DEBUG", "true")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-key")
    monkeypatch.setenv("JWT_SECRET", "test-secret-key-for-jwt-signing-12345")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///:memory:")
    yield

