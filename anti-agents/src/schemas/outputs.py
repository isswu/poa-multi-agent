"""Output schemas for agent responses."""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class CrawlerResult(BaseModel):
    """Structured output for crawler results."""

    task_id: str = Field(..., description="Crawler task ID")
    platform: str = Field(..., description="Platform name")
    crawler_type: str = Field(..., description="Crawler type")
    status: str = Field(..., description="Task status")
    total_posts: int = Field(..., description="Total posts collected")
    total_accounts: int = Field(..., description="Total accounts identified")
    execution_time: float = Field(..., description="Execution time in seconds")
    data_summary: Dict[str, Any] = Field(default_factory=dict, description="Data summary")
    error: Optional[str] = Field(None, description="Error message if failed")


class SensitiveContentResult(BaseModel):
    """Sensitive content detection result."""

    video_id: str = Field(..., description="Video identifier")
    has_violation: bool = Field(..., description="Whether violations found")
    violation_types: List[str] = Field(default_factory=list, description="Types of violations")
    confidence_scores: Dict[str, float] = Field(
        default_factory=dict, description="Confidence scores per type"
    )
    violation_segments: List[Dict[str, Any]] = Field(
        default_factory=list, description="Violation time segments"
    )
    recommendation: str = Field(..., description="Action recommendation: block, review, or approve")


class SentimentResult(BaseModel):
    """Sentiment analysis result."""

    post_id: str = Field(..., description="Post identifier")
    overall_sentiment: str = Field(
        ..., description="Overall sentiment: positive, negative, or neutral"
    )
    sentiment_score: float = Field(..., description="Sentiment score from -1.0 to 1.0")
    emotions: Dict[str, float] = Field(default_factory=dict, description="Emotion scores")
    attitude: Optional[str] = Field(None, description="Attitude: supportive, critical, or neutral")
    confidence: float = Field(..., description="Confidence score")


class TopicResult(BaseModel):
    """Topic extraction result."""

    topic_id: int = Field(..., description="Topic identifier")
    topic_name: str = Field(..., description="Topic name/label")
    keywords: List[Dict[str, Any]] = Field(default_factory=list, description="Keywords with scores")
    document_count: int = Field(..., description="Number of documents in topic")
    percentage: float = Field(..., description="Percentage of corpus")


class TrendResult(BaseModel):
    """Trend detection result."""

    trend_id: str = Field(..., description="Trend identifier")
    trend_name: str = Field(..., description="Trend name")
    trend_type: str = Field(..., description="Trend type: rising, declining, stable, or viral")
    growth_rate: float = Field(..., description="Growth rate percentage")
    post_count: int = Field(..., description="Number of posts in trend")
    total_engagement: int = Field(..., description="Total engagement count")
    related_keywords: List[str] = Field(default_factory=list, description="Related keywords")
    top_posts: List[str] = Field(default_factory=list, description="Top post IDs")
    forecast: Dict[str, Any] = Field(default_factory=dict, description="Trend forecast")


class EngagementResult(BaseModel):
    """Engagement analysis result."""

    engagement_rate: float = Field(..., description="Engagement rate percentage")
    interaction_rate: float = Field(..., description="Interaction rate percentage")
    engagement_level: str = Field(
        ..., description="Engagement level: very_high, high, medium, or low"
    )
    total_interactions: int = Field(..., description="Total interaction count")
    metrics: Dict[str, int] = Field(default_factory=dict, description="Individual metrics")
    benchmarks: Dict[str, Any] = Field(default_factory=dict, description="Benchmark comparisons")


class AnalysisResult(BaseModel):
    """Structured output for content analysis."""

    total_analyzed: int = Field(..., description="Total items analyzed")

    sensitive_content_summary: Dict[str, Any] = Field(
        default_factory=dict, description="Summary of sensitive content findings"
    )

    sentiment_summary: Dict[str, Any] = Field(
        default_factory=dict, description="Summary of sentiment analysis"
    )

    topic_summary: List[Dict[str, Any]] = Field(
        default_factory=list, description="Summary of topics identified"
    )

    trend_summary: List[Dict[str, Any]] = Field(
        default_factory=list, description="Summary of trends detected"
    )

    engagement_summary: Dict[str, Any] = Field(
        default_factory=dict, description="Summary of engagement metrics"
    )

    high_risk_posts: List[str] = Field(
        default_factory=list, description="Post IDs flagged as high risk"
    )

    recommendations: List[str] = Field(default_factory=list, description="Analysis recommendations")


class AnalysisReport(BaseModel):
    """Structured output for analysis reports."""

    report_id: str = Field(..., description="Report identifier")
    task_id: str = Field(..., description="Associated task ID")
    generated_at: str = Field(
        default_factory=lambda: datetime.now().isoformat(), description="Generation timestamp"
    )

    executive_summary: str = Field(..., description="Executive summary in Chinese")

    data_overview: Dict[str, Any] = Field(
        default_factory=dict, description="Overview of data analyzed"
    )

    sensitive_content_summary: Dict[str, Any] = Field(
        default_factory=dict, description="Sensitive content findings summary"
    )

    sentiment_summary: Dict[str, Any] = Field(
        default_factory=dict, description="Sentiment analysis summary"
    )

    topic_summary: List[Dict[str, Any]] = Field(
        default_factory=list, description="Topic analysis summary"
    )

    trend_summary: List[Dict[str, Any]] = Field(
        default_factory=list, description="Trend analysis summary"
    )

    risk_assessment: Dict[str, Any] = Field(
        default_factory=dict, description="Overall risk assessment"
    )

    recommendations: List[str] = Field(
        default_factory=list, description="Strategic recommendations in Chinese"
    )


class DecisionSupport(BaseModel):
    """Structured output for decision support."""

    task_id: str = Field(..., description="Associated task ID")

    overall_risk_level: str = Field(
        ..., description="Overall risk level: low, medium, high, or critical"
    )

    priority_issues: List[Dict[str, Any]] = Field(
        default_factory=list, description="Priority issues requiring attention"
    )

    recommended_actions: List[Dict[str, Any]] = Field(
        default_factory=list, description="Recommended actions with details"
    )

    risk_mitigation_strategies: List[str] = Field(
        default_factory=list, description="Risk mitigation strategies in Chinese"
    )

    resource_allocation_suggestions: Dict[str, Any] = Field(
        default_factory=dict, description="Resource allocation suggestions"
    )

    timeline: Dict[str, Any] = Field(default_factory=dict, description="Implementation timeline")

    success_metrics: List[str] = Field(default_factory=list, description="Success metrics to track")
