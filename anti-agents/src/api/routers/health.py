"""Health check API routes."""

from fastapi import APIRouter

router = APIRouter(prefix="", tags=["health"])


@router.get("/health")
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        Health status of the API service
    """
    return {
        "status": "healthy",
        "service": "poa-multi-agent",
        "version": "0.1.0"
    }
