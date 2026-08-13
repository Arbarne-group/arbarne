"""User table — for verifiers and admins (farmers may be anonymous in pilot)."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, String, Uuid as UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base
import uuid


class User(Base):
    """A platform user. Roles: farmer / verifier / admin."""

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(32), unique=True, nullable=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    role: Mapped[str] = mapped_column(String(32), nullable=False, default="farmer")
    organisation: Mapped[str | None] = mapped_column(String(255), nullable=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
