"""Tests for agent tools."""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from tools.analysis_tools import analyze_engagement


def test_analyze_engagement():
    """Test engagement analysis tool."""
    post_data = {"likes": 1000, "comments": 50, "shares": 20, "views": 10000}

    result = analyze_engagement(post_data)

    assert result["engagement_rate"] > 0
    assert result["engagement_level"] in ["very_high", "high", "medium", "low"]
    assert result["total_interactions"] == 1070
    assert "benchmarks" in result


def test_analyze_engagement_zero_views():
    """Test engagement analysis with zero views."""
    post_data = {"likes": 100, "comments": 10, "shares": 5, "views": 0}

    result = analyze_engagement(post_data)

    assert result["engagement_rate"] == 0
    assert result["total_interactions"] == 115
