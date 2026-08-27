"""Authentication utilities — JWT, password hashing, phone verification OTP, and user context."""

from __future__ import annotations

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

security = HTTPBearer(auto_error=False)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

PBKDF2_ITERATIONS = 120_000


def hash_password(password: str) -> str:
    """Hash password with PBKDF2-SHA256 and a per-user random salt.

    Stored format: pbkdf2_sha256$<iterations>$<salt_hex>$<hash_hex>
    """
    salt_hex = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), PBKDF2_ITERATIONS
    )
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt_hex}${digest.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against a PBKDF2 hash (or legacy pilot HMAC-SHA256 hash)."""
    if hashed_password.startswith("pbkdf2_sha256$"):
        try:
            _, iterations, salt_hex, hash_hex = hashed_password.split("$")
            digest = hashlib.pbkdf2_hmac(
                "sha256",
                plain_password.encode("utf-8"),
                bytes.fromhex(salt_hex),
                int(iterations),
            )
        except (ValueError, TypeError):
            return False
        return hmac.compare_digest(digest.hex(), hash_hex)
    # Legacy pilot format: unsalted-lookup HMAC-SHA256 with static secret prefix
    legacy_salt = settings.jwt_secret[:16]
    expected = hmac.new(
        legacy_salt.encode(), plain_password.encode(), hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def generate_verification_code() -> str:
    """Generate a 6-digit SMS verification code for pilot registration."""
    return f"{secrets.randbelow(900000) + 100000}"


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """FastAPI dependency to extract authenticated user from Bearer JWT token."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload["sub"]
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=401, detail="Malformed user token")

    user = db.query(User).filter(User.id == user_uuid).one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")

    return user


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """FastAPI dependency to optionally extract authenticated user (allows anonymous smallholder fallback)."""
    if not credentials:
        return None
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
    try:
        user_uuid = uuid.UUID(payload["sub"])
        return db.query(User).filter(User.id == user_uuid).one_or_none()
    except Exception:
        return None
