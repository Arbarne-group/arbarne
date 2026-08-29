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

# Server-side blocklist of revoked token IDs (jti). In-memory for the pilot;
# swap for a shared store (Redis/DB) if running multiple workers.
token_blocklist: set[str] = set()

PBKDF2_ITERATIONS = 120_000


def _resolve_jwt_secret() -> str:
    """Resolve the HMAC secret used to sign/verify JWTs.

    Refuses to run with the old guessable placeholder and, in production
    (APP_DEBUG=false), requires an explicit JWT_SECRET. In debug mode a random
    ephemeral secret is generated (and warned about) so local dev works, but a
    stolen/forged token cannot be reused across restarts.
    """
    secret = settings.jwt_secret
    if secret and secret != "change-me-in-production":
        return secret
    if settings.app_debug:
        import warnings

        warnings.warn(
            "JWT_SECRET is not set — using an ephemeral dev-only secret. "
            "Tokens are invalid after a server restart and this is NOT safe for production.",
            stacklevel=2,
        )
        return secrets.token_hex(32)
    raise RuntimeError(
        "JWT_SECRET environment variable must be set when APP_DEBUG is false."
    )


JWT_SECRET = _resolve_jwt_secret()


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
    legacy_salt = JWT_SECRET[:16]
    expected = hmac.new(
        legacy_salt.encode(), plain_password.encode(), hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token with a unique jti (for revocation)."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.jwt_expire_minutes)
    )
    to_encode.update({"exp": expire, "jti": secrets.token_hex(16)})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token. Revoked tokens (logout) return None."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
    except JWTError:
        return None
    if payload.get("jti") in token_blocklist:
        return None
    return payload


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
