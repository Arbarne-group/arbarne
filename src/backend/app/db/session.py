"""SQLAlchemy engine, session, and Base declarative class.

The Base is imported by every model module so the Alembic env can
discover all tables via Base.metadata.

The engine is built lazily — we don't open a connection at import time
so that tests can run against SQLite without psycopg2 installed.
"""

from collections.abc import Generator
from typing import Optional

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""


_engine: Optional[Engine] = None
_SessionLocal = None


def get_engine() -> Engine:
    """Lazy engine accessor — builds the engine on first use."""
    global _engine
    if _engine is None:
        url = settings.resolved_database_url()
        kwargs = {"echo": settings.app_debug, "future": True}
        if url.startswith("sqlite"):
            kwargs["connect_args"] = {"check_same_thread": False}
        else:
            kwargs.update({
                "pool_pre_ping": True,
                "pool_size": 10,
                "max_overflow": 20,
            })
        _engine = create_engine(url, **kwargs)
    return _engine


def get_session_factory():
    """Lazy session factory accessor."""
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(
            bind=get_engine(),
            autoflush=False,
            autocommit=False,
            expire_on_commit=False,
        )
    return _SessionLocal


# ─── Backwards-compatible module-level names ─────────────────────────
# Existing code does `from app.db.session import engine, SessionLocal, get_db`.
# These are looked up lazily so importing this module does not require
# psycopg2 to be installed.

class _LazyModule:
    """Module-level proxy that materialises engine / SessionLocal on demand."""

    @property
    def engine(self) -> Engine:
        return get_engine()

    @property
    def SessionLocal(self):
        return get_session_factory()


_lazy = _LazyModule()


def __getattr__(name: str):
    """PEP 562 module-level __getattr__ — proxies to the lazy holder."""
    if name == "engine":
        return _lazy.engine
    if name == "SessionLocal":
        return _lazy.SessionLocal
    raise AttributeError(f"module 'app.db.session' has no attribute {name!r}")


def get_db() -> Generator:
    """FastAPI dependency that yields a database session."""
    session = get_session_factory()()
    try:
        yield session
    finally:
        session.close()
