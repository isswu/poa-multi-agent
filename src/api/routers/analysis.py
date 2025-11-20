"""Analysis API routes."""

import os
from typing import Optional

from agents import Runner
from agents.extensions.memory import SQLAlchemySession
from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from config import settings
from services.agent_runner import get_agent_system

# Create a global async engine for SQLAlchemy sessions
_async_engine: Optional[AsyncEngine] = None


def get_async_engine() -> AsyncEngine:
    """Gets or creates the global async engine."""
    global _async_engine
    if _async_engine is None:
        _async_engine = create_async_engine(
            os.getenv("DATABASE_URL", settings.session_db_url),
            echo=False,
            pool_pre_ping=True,
        )
    return _async_engine


router = APIRouter(prefix="/analysis", tags=["analysis"])


class AnalysisRequest(BaseModel):
    """Analysis request model."""

    request: str
    session_id: Optional[str] = None
    max_turns: int = 30


class AnalysisResponse(BaseModel):
    """Analysis response model."""

    request_id: str
    status: str
    result: Optional[dict] = None
    error: Optional[str] = None


@router.post("", response_model=AnalysisResponse)
async def create_analysis(request: AnalysisRequest):
    """
    Creates a new analysis task.

    This endpoint accepts a natural language request and processes it through
    the multi-agent system.

    Args:
        request: Analysis request with natural language input

    Returns:
        Analysis response with results or error

    Example:
        ```python
        {
            "request": "分析抖音上关于'人工智能'的舆情，最近7天，分析200条"
        }
        ```
    """
    try:
        # Create or retrieve session
        session_id = request.session_id or f"session_{id(request)}"
        engine = get_async_engine()
        session = SQLAlchemySession(session_id, engine=engine, create_tables=True)

        # Get agent system
        coordinator = get_agent_system()

        # Run agent workflow
        result = await Runner.run(
            coordinator, input=request.request, session=session, max_turns=request.max_turns
        )

        return AnalysisResponse(
            request_id=session_id,
            status="completed",
            result=result.final_output
            if hasattr(result.final_output, "model_dump")
            else {"output": str(result.final_output)},
        )

    except Exception as e:
        return AnalysisResponse(
            request_id=request.session_id or "unknown", status="failed", error=str(e)
        )


@router.get("/health")
async def health_check():
    """
    Health check endpoint.

    Returns:
        Health status
    """
    return {"status": "healthy", "service": "poa-multi-agent", "version": "0.1.0"}
