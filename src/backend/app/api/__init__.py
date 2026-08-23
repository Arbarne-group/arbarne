"""API routers."""

from app.api.assessments import router as assessments_router
from app.api.auth import router as auth_router
from app.api.pillars import router as pillars_router
from app.api.portal import router as portal_router

__all__ = ["assessments_router", "auth_router", "pillars_router", "portal_router"]
