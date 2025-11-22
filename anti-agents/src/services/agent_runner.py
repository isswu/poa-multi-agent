"""Agent system initialization and management."""

from agents import Agent

from poa_agents.content_analysis import create_content_analysis_agent
from poa_agents.coordinator import create_coordinator_agent
from poa_agents.data_collection import create_data_collection_agent
from poa_agents.decision_support import create_decision_support_agent
from poa_agents.report_generation import create_report_generation_agent

# Global agent system instance
_agent_system: Agent | None = None


def initialize_agent_system() -> Agent:
    """
    Initializes the complete agent system.

    Creates all agents and sets up handoffs in the correct order.

    Returns:
        Coordinator agent (entry point for the system)
    """
    # Create agents bottom-up to handle dependencies

    # Level 5: Decision Support (no dependencies)
    decision_support_agent = create_decision_support_agent()

    # Level 4: Report Generation (depends on decision support)
    report_generation_agent = create_report_generation_agent(
        decision_support_agent=decision_support_agent
    )

    # Level 3: Content Analysis (depends on report generation)
    content_analysis_agent = create_content_analysis_agent(
        report_generation_agent=report_generation_agent
    )

    # Level 2: Data Collection (depends on content analysis)
    data_collection_agent = create_data_collection_agent(
        content_analysis_agent=content_analysis_agent
    )

    # Level 1: Coordinator (entry point, depends on data collection and analysis)
    coordinator_agent = create_coordinator_agent(
        data_collection_agent=data_collection_agent, analysis_pipeline_agent=content_analysis_agent
    )

    return coordinator_agent


def get_agent_system() -> Agent:
    """
    Gets or creates the global agent system instance.

    This ensures we only create the agent system once (singleton pattern).

    Returns:
        Coordinator agent
    """
    global _agent_system

    if _agent_system is None:
        _agent_system = initialize_agent_system()

    return _agent_system


def reset_agent_system() -> None:
    """
    Resets the agent system (for testing purposes).
    """
    global _agent_system
    _agent_system = None
