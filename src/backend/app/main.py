"""FastAPI application entry point.

Run with:
    uvicorn app.main:app --reload
or via docker compose / Makefile.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pathlib import Path

from app.api.assessments import router as assessments_router
from app.api.health import router as health_router
from app.api.pillars import router as pillars_router
from app.core.config import settings

# ─── Logging ──────────────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, settings.app_log_level.upper(), logging.INFO),
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


from app.db.session import Base, engine


# ─── Lifespan ─────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown hooks."""
    logger.info("FFF backend starting (env=%s, debug=%s)", settings.app_env, settings.app_debug)
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified/created")
    except Exception as exc:
        logger.warning("Could not auto-create tables on startup: %s", exc)
    yield
    logger.info("FFF backend shutting down")


# ─── App ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="Future Farms Framework API",
    version="0.1.0",
    description="Backend API for the FFF Digital Platform — pilot build.",
    lifespan=lifespan,
)

# CORS — open in dev for the offline-first frontend on a different port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.app_debug else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Routers ─────────────────────────────────────────────────────────
app.include_router(health_router)
app.include_router(pillars_router)
app.include_router(assessments_router)


# ─── Optional static frontend (pilot-scale) ─────────────────────────
# In the pilot, FastAPI can serve the frontend directly. In production,
# nginx serves it and proxies /api to the backend.
_frontend_dir = Path(__file__).resolve().parents[3] / "src" / "frontend" / "public"
if _frontend_dir.exists():
    app.mount("/", StaticFiles(directory=str(_frontend_dir), html=True), name="frontend")
    logger.info("Serving frontend static files from %s", _frontend_dir)
else:
    @app.get("/", response_class=HTMLResponse)
    def root() -> str:
        return (
            "<html><body><h1>FFF API</h1>"
            "<p>Frontend not yet mounted. Visit <a href='/docs'>/docs</a> for the API.</p>"
            "</body></html>"
        )
