"""Authentication & Farmer Profile schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class RegisterIn(BaseModel):
    email: EmailStr = Field(..., description="Email address used to sign in")
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    name: str = Field(..., description="Farmer or User Full Name")
    phone: Optional[str] = Field(None, description="Optional phone number (e.g. +254712345678)")
    farm_name: Optional[str] = Field(None, description="Farm name")
    region: Optional[str] = Field("Western Kenya", description="Farm agro-ecological region")
    crop_type: Optional[str] = Field("Mixed Crop & Livestock", description="Primary enterprise")
    size_acres: Optional[float] = Field(5.0, description="Farm acreage")
    farmer_profile: Optional[dict] = Field(
        None, description="Structured Farmer Profile onboarding answers"
    )


class LoginIn(BaseModel):
    email: EmailStr = Field(..., description="Registered email address")
    password: str = Field(..., description="Account password")


class RequestOtpIn(BaseModel):
    phone: Optional[str] = Field(None, description="Phone number to receive OTP")
    email: Optional[str] = Field(None, description="Email to resolve the registered phone for OTP")


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: UUID
    name: str
    role: str
    phone: Optional[str] = None
    email: Optional[str] = None
    farm_id: Optional[UUID] = None
    farm_name: Optional[str] = None
    region: Optional[str] = None
    size_acres: Optional[float] = None
    crop_type: Optional[str] = None
    farm_image: Optional[str] = None


class UserProfileOut(BaseModel):
    id: UUID
    name: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    role: str
    organisation: Optional[str]
    is_verified: bool
    created_at: datetime
    farm_id: Optional[UUID] = None
    farm_name: Optional[str] = None
    farm_region: Optional[str] = None
    farm_crop: Optional[str] = None
    farm_size_acres: Optional[float] = None
    farmer_profile: Optional[dict] = None
    farm_image: Optional[str] = None


class UpdateProfileIn(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    farm_name: Optional[str] = None
    region: Optional[str] = None
    crop_type: Optional[str] = None
    size_acres: Optional[float] = None
    farmer_profile: Optional[dict] = None
    farm_image: Optional[str] = None
