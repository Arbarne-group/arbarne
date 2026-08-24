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
from fastapi.responses import HTMLResponse, RedirectResponse
from pathlib import Path

from app.api.assessments import router as assessments_router
from app.api.auth import router as auth_router
from app.api.gamification import router as gamification_router
from app.api.health import router as health_router
from app.api.pillars import router as pillars_router
from app.api.portal import router as portal_router
from app.api.ml import router as ml_router
from app.core.config import settings


# ─── Logging ──────────────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, settings.app_log_level.upper(), logging.INFO),
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


# ─── Lifespan ─────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for FastAPI startup and shutdown."""
    logger.info("FFF backend starting up")
    from app.db.session import engine, Base
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified/created successfully.")
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
app.include_router(auth_router, prefix="/api")
app.include_router(pillars_router)
app.include_router(assessments_router)
app.include_router(portal_router, prefix="/api")
app.include_router(gamification_router, prefix="/api")
app.include_router(ml_router)


# ─── Gradio Interactive ML Demo Route ───────────────────────────────
@app.get("/ml-demo", include_in_schema=False)
def redirect_to_gradio_demo():
    return RedirectResponse(url="/ml-demo/", status_code=307)


try:
    import gradio as gr
    from app.api.gradio_app import create_gradio_app
    gradio_demo = create_gradio_app()
    if gradio_demo:
        app = gr.mount_gradio_app(app, gradio_demo, path="/ml-demo")
        logger.info("Gradio interactive ML scenario simulator mounted at /ml-demo")
except Exception as exc:
    logger.warning("Could not mount Gradio demo route: %s", exc)


# ─── Optional static frontend (pilot-scale) ─────────────────────────
# In the pilot, FastAPI can serve the frontend directly. In production,
# nginx serves it and proxies /api to the backend.
def _find_frontend_dir() -> Path | None:
    candidates = [
        Path("/frontend/public"),
        Path("/app/frontend_public"),
    ]
    parents = Path(__file__).resolve().parents
    if len(parents) > 3:
        candidates.append(parents[3] / "src" / "frontend" / "public")
    if len(parents) > 2:
        candidates.append(parents[2] / "frontend" / "public")
        candidates.append(parents[2] / "src" / "frontend" / "public")
    for candidate in candidates:
        if candidate and candidate.exists() and candidate.is_dir():
            return candidate
    return None

_frontend_dir = _find_frontend_dir()
if _frontend_dir:
    app.mount("/", StaticFiles(directory=str(_frontend_dir), html=True), name="frontend")
    logger.info("Serving frontend static files from %s", _frontend_dir)
else:
    @app.get("/", response_class=HTMLResponse)
    def root() -> str:
        return (
            "<html><body><h1>FFF API</h1>"
            "<p>Frontend not mounted directly on backend. Open the frontend at <a href='http://localhost:8080'>http://localhost:8080</a> or visit <a href='/docs'>/docs</a> for API documentation.</p>"
            "</body></html>"
        )
