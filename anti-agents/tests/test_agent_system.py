"""Tests for agent system initialization."""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from services.agent_runner import initialize_agent_system, reset_agent_system


def test_agent_system_initialization():
    """Test that agent system initializes correctly."""
    reset_agent_system()

    coordinator = initialize_agent_system()

    assert coordinator is not None
    assert coordinator.name == "Coordinator"
    assert len(coordinator.handoffs) == 2  # Data Collection and Analysis Pipeline


def test_agent_system_singleton():
    """Test that agent system follows singleton pattern."""
    from services.agent_runner import get_agent_system

    reset_agent_system()

    agent1 = get_agent_system()
    agent2 = get_agent_system()

    assert agent1 is agent2
