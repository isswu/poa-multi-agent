"""API router initialization."""

from api.routers.analysis import router as analysis_router
from api.routers.health import router as health_router

__all__ = ["analysis_router", "health_router"]
