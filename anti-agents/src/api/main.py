"""FastAPI main application."""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.routers import analysis_router, health_router

# Create FastAPI app
app = FastAPI(
    title="POA Multi-Agent Analysis API",
    version="0.1.0",
    description="Multi-agent system for public opinion analysis powered by OpenAI Agents",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router, prefix="/api/v1")  # /api/v1/health
app.include_router(analysis_router, prefix="/api/v1")  # /api/v1/analysis/*



@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "POA Multi-Agent Analysis API",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs",
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    return JSONResponse(
        status_code=500, content={"error": "Internal server error", "detail": str(exc)}
    )


if __name__ == "__main__":
    import uvicorn

    from config import settings

    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_reload,
        log_level=settings.log_level.lower(),
    )
