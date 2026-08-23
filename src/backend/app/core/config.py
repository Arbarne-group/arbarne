"""Application configuration loaded from environment variables.

All settings live here so the rest of the code depends on a single
typed object instead of scattered `os.environ.get(...)` calls.
"""

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings — populated from environment / .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ─── App ────────────────────────────────────────────────────────
    app_env: str = Field(default="development", alias="APP_ENV")
    app_debug: bool = Field(default=True, alias="APP_DEBUG")
    app_host: str = Field(default="0.0.0.0", alias="APP_HOST")
    app_port: int = Field(default=8000, alias="APP_PORT")
    app_log_level: str = Field(default="INFO", alias="APP_LOG_LEVEL")

    # ─── Database ───────────────────────────────────────────────────
    postgres_host: str = Field(default="localhost", alias="POSTGRES_HOST")
    postgres_port: int = Field(default=5432, alias="POSTGRES_PORT")
    postgres_user: str = Field(default="fff", alias="POSTGRES_USER")
    postgres_password: str = Field(default="fff_dev", alias="POSTGRES_PASSWORD")
    postgres_db: str = Field(default="fff", alias="POSTGRES_DB")
    database_url: str | None = Field(default=None, alias="DATABASE_URL")

    # ─── Redis / Celery ─────────────────────────────────────────────
    redis_host: str = Field(default="localhost", alias="REDIS_HOST")
    redis_port: int = Field(default=6379, alias="REDIS_PORT")
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    celery_broker_url: str = Field(
        default="redis://localhost:6379/0", alias="CELERY_BROKER_URL"
    )
    celery_result_backend: str = Field(
        default="redis://localhost:6379/1", alias="CELERY_RESULT_BACKEND"
    )

    # ─── LLM ────────────────────────────────────────────────────────
    anthropic_api_key: str = Field(default="", alias="ANTHROPIC_API_KEY")
    anthropic_model: str = Field(default="claude-sonnet-4-5", alias="ANTHROPIC_MODEL")
    llm_daily_token_budget: int = Field(default=200_000, alias="LLM_DAILY_TOKEN_BUDGET")
    llm_monthly_token_budget: int = Field(
        default=5_000_000, alias="LLM_MONTHLY_TOKEN_BUDGET"
    )

    # ─── Auth ───────────────────────────────────────────────────────
    jwt_secret: str = Field(default="change-me-in-production", alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    jwt_expire_minutes: int = Field(default=1440, alias="JWT_EXPIRE_MINUTES")

    # ─── Paths ──────────────────────────────────────────────────────
    backend_dir: Path = (
        Path(__file__).resolve().parents[2]
        if len(Path(__file__).resolve().parents) > 2
        else Path(__file__).resolve().parent
    )
    project_dir: Path = (
        Path(__file__).resolve().parents[4]
        if len(Path(__file__).resolve().parents) > 4
        else (
            Path(__file__).resolve().parents[2]
            if len(Path(__file__).resolve().parents) > 2
            else Path(__file__).resolve().parent
        )
    )
    uploads_dir: Path = backend_dir / "uploads"
    alembic_dir: Path = backend_dir / "alembic"

    def resolved_database_url(self) -> str:
        """Build the SQLAlchemy database URL from components if not given.

        If a Postgres URL/host is specified (like Docker 'postgres') but cannot
        be reached/resolved in local standalone development, falls back to SQLite
        so local execution without Docker works out of the box.
        """
        import os
        import socket

        url = os.environ.get("DATABASE_URL") or self.database_url
        if url and url.startswith("sqlite"):
            return url

        # If pointing to docker service 'postgres', test if resolvable on host
        if url and "@postgres:" in url:
            try:
                socket.gethostbyname("postgres")
            except OSError:
                return "sqlite:///fff_dev.db"

        if url:
            return url

        try:
            import psycopg2  # noqa: F401
            has_psycopg2 = True
        except ImportError:
            has_psycopg2 = False

        if not has_psycopg2 or self.postgres_host == "postgres":
            if self.postgres_host == "postgres":
                try:
                    socket.gethostbyname("postgres")
                except OSError:
                    return "sqlite:///fff_dev.db"
            if not has_psycopg2:
                return "sqlite:///fff_dev.db"

        # Final reachability check: probe TCP port before building the URL.
        # If localhost Postgres isn't running we fall back to SQLite so that
        # local development without a Postgres service always works.
        try:
            with socket.create_connection((self.postgres_host, self.postgres_port), timeout=1):
                pass
        except OSError:
            return "sqlite:///fff_dev.db"

        return (
            f"postgresql+psycopg2://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor."""
    return Settings()


settings = get_settings()
