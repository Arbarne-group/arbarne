"""Authentication & Farmer Profile API endpoints."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.auth import (
    create_access_token,
    decode_access_token,
    generate_verification_code,
    get_current_user,
    hash_password,
    security,
    token_blocklist,
    verify_password,
)
from app.db.session import get_db
from app.models.assessment import Farm
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    LoginIn,
    RegisterIn,
    RequestOtpIn,
    UpdateProfileIn,
    UserProfileOut,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/logout")
def logout(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    """Invalidate the caller's current token (server-side revocation).

    Stateless JWTs cannot be destroyed by the client alone, so we record the
    token's jti in a server-side blocklist. ``decode_access_token`` rejects any
    blocklisted jti on subsequent requests.
    """
    if credentials:
        payload = decode_access_token(credentials.credentials)
        jti = payload.get("jti") if payload else None
        if jti:
            token_blocklist.add(jti)
    return {"message": "Logged out successfully"}


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterIn, db: Session = Depends(get_db)) -> AuthResponse:
    """Register a new farmer or platform user with email + password, creating their default farm record."""
    existing = db.query(User).filter(User.email == str(payload.email)).one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"An account with email {payload.email} already exists. Please log in.",
        )
    if payload.phone:
        phone_clash = db.query(User).filter(User.phone == payload.phone).one_or_none()
        if phone_clash:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"An account with phone number {payload.phone} already exists. Please log in.",
            )

    # Create User
    user = User(
        name=payload.name,
        phone=payload.phone,
        email=str(payload.email),
        role="farmer",
        password_hash=hash_password(payload.password),
        is_verified=True,
        farmer_profile=payload.farmer_profile,
    )
    db.add(user)
    db.flush()

    # Create default Farm profile
    farm_name = payload.farm_name or f"{payload.name}'s Farm"
    farm = Farm(
        user_id=user.id,
        name=farm_name,
        region=payload.region or "Western Kenya",
        crop_type=payload.crop_type or "Mixed Crop & Livestock",
        size_acres=payload.size_acres or 5.0,
    )
    db.add(farm)
    db.commit()
    db.refresh(user)
    db.refresh(farm)

    # Generate JWT
    token = create_access_token({"sub": str(user.id), "role": user.role, "name": user.name})

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        name=user.name or "Farmer",
        role=user.role,
        phone=user.phone,
        email=user.email,
        farm_id=farm.id,
        farm_name=farm.name,
        region=farm.region,
        size_acres=farm.size_acres,
        crop_type=farm.crop_type,
        farm_image=farm.farm_image,
    )


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginIn, db: Session = Depends(get_db)) -> AuthResponse:
    """Log in with a registered email address and password."""
    user = db.query(User).filter(User.email == str(payload.email)).one_or_none()

    if not user or not user.password_hash:
        # Same message for unknown email and missing password to avoid account enumeration
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    farm = db.query(Farm).filter(Farm.user_id == user.id).first()
    if not farm:
        farm = Farm(
            user_id=user.id,
            name=f"{user.name or 'My'}'s Farm",
            region="Western Kenya",
            crop_type="Mixed Crop & Livestock",
            size_acres=5.0,
        )
        db.add(farm)
        db.commit()
        db.refresh(farm)

    token = create_access_token({"sub": str(user.id), "role": user.role, "name": user.name})

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        name=user.name or "Farmer",
        role=user.role,
        phone=user.phone,
        email=user.email,
        farm_id=farm.id,
        farm_name=farm.name,
        region=farm.region,
        size_acres=farm.size_acres,
        crop_type=farm.crop_type,
        farm_image=farm.farm_image,
    )


@router.post("/otp")
def request_otp(payload: RequestOtpIn, db: Session = Depends(get_db)) -> dict:
    """Request a simulated OTP code for SMS verification.

    Accepts either a ``phone`` (direct) or an ``email`` (resolved to the
    user's registered phone) so the forgot-password flow can trigger it.
    """
    code = generate_verification_code()
    target_phone = payload.phone
    if not target_phone and payload.email:
        user = db.query(User).filter(User.email == payload.email).first()
        if user and user.phone:
            target_phone = user.phone
    destination = target_phone or payload.email or "your registered contact"
    return {
        "message": f"Verification code sent to {destination}",
        "code": code,  # Provided in response for easy pilot verification testing
        "expires_in_seconds": 300,
    }


@router.get("/me", response_model=UserProfileOut)
def get_profile(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> UserProfileOut:
    """Retrieve the current user's profile and farm details."""
    farm = db.query(Farm).filter(Farm.user_id == current_user.id).first()

    return UserProfileOut(
        id=current_user.id,
        name=current_user.name,
        phone=current_user.phone,
        email=current_user.email,
        role=current_user.role,
        organisation=current_user.organisation,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at,
        farm_id=farm.id if farm else None,
        farm_name=farm.name if farm else None,
        farm_region=farm.region if farm else None,
        farm_crop=farm.crop_type if farm else None,
        farm_size_acres=farm.size_acres if farm else 5.0,
        farmer_profile=current_user.farmer_profile,
        farm_image=farm.farm_image if farm else None,
    )


@router.put("/me", response_model=UserProfileOut)
def update_profile(
    payload: UpdateProfileIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserProfileOut:
    """Update personal profile and farm metadata."""
    if payload.name is not None:
        current_user.name = payload.name
    if payload.phone is not None:
        current_user.phone = payload.phone
    if payload.email is not None:
        current_user.email = str(payload.email)

    farm = db.query(Farm).filter(Farm.user_id == current_user.id).first()
    if not farm:
        farm = Farm(user_id=current_user.id)
        db.add(farm)

    if payload.farm_name is not None:
        farm.name = payload.farm_name
    if payload.region is not None:
        farm.region = payload.region
    if payload.crop_type is not None:
        farm.crop_type = payload.crop_type
    if payload.size_acres is not None:
        farm.size_acres = payload.size_acres
    if payload.farmer_profile is not None:
        current_user.farmer_profile = payload.farmer_profile
    if payload.farm_image is not None:
        farm.farm_image = payload.farm_image

    db.commit()
    db.refresh(current_user)
    db.refresh(farm)

    return UserProfileOut(
        id=current_user.id,
        name=current_user.name,
        phone=current_user.phone,
        email=current_user.email,
        role=current_user.role,
        organisation=current_user.organisation,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at,
        farm_id=farm.id,
        farm_name=farm.name,
        farm_region=farm.region,
        farm_crop=farm.crop_type,
        farm_size_acres=farm.size_acres,
        farmer_profile=current_user.farmer_profile,
        farm_image=farm.farm_image,
    )
