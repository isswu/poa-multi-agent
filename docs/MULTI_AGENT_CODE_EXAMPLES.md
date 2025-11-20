# Multi-Agent System Code Examples

This document provides concrete code examples for implementing the multi-agent system.

---

## 📁 Project Setup

### 1. Install Dependencies

```bash
cd shine
mkdir poa-multi-agent
cd poa-multi-agent

# Create pyproject.toml
cat > pyproject.toml << EOF
[project]
name = "poa-multi-agent"
version = "0.1.0"
description = "Multi-agent system for public opinion analysis"
requires-python = ">=3.12"

dependencies = [
    "openai-agents>=0.5.0",
    "openai>=1.0.0",
    "fastapi>=0.115.0",
    "uvicorn>=0.30.0",
    "pydantic>=2.0.0",
    "sqlalchemy>=2.0.0",
    "redis>=5.0.0",
    "httpx>=0.27.0",
]

[dependency-groups]
dev = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.23.0",
]
EOF

# Install
uv sync
```

---

## 🛠️ Tool Implementations

### tools/crawler_tools.py

```python
"""Crawler management tools for agents."""

import asyncio
from typing import Dict, Any, Optional
import httpx
from agents import function_tool
from pydantic import BaseModel


class CrawlerConfig(BaseModel):
    """Crawler configuration."""
    platform: str
    crawler_type: str
    keywords: Optional[list[str]] = None
    creator_ids: Optional[list[str]] = None
    max_count: int = 100


class CrawlerResult(BaseModel):
    """Crawler task result."""
    task_id: str
    platform: str
    status: str
    total_posts: int
    total_accounts: int
    execution_time: float


# Crawler API base URL (from existing poa-media-crawler service)
CRAWLER_API_BASE = "http://localhost:8000/api/v1"


@function_tool
async def create_crawler_task(
    platform: str,
    crawler_type: str,
    config: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Create a crawler task to collect social media content.
    
    Args:
        platform: Platform name (douyin, xhs, bilibili, etc.)
        crawler_type: Type of crawler (search, creator, detail, homefeed)
        config: Crawler configuration including keywords, creator IDs, limits
    
    Returns:
        Dictionary with task_id and initial status
    
    Example:
        result = await create_crawler_task(
            platform="douyin",
            crawler_type="search",
            config={"keywords": ["人工智能"], "max_aweme_count": 100}
        )
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{CRAWLER_API_BASE}/tasks",
            json={
                "platform": platform,
                "crawler_type": crawler_type,
                "config": config
            },
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()


@function_tool
async def get_task_status(task_id: str) -> Dict[str, Any]:
    """
    Get the status and progress of a crawler task.
    
    Args:
        task_id: The unique task identifier
    
    Returns:
        Dictionary with task status, progress, and results summary
    
    Example:
        status = await get_task_status("crawl_20251106_001")
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{CRAWLER_API_BASE}/tasks/{task_id}",
            timeout=10.0
        )
        response.raise_for_status()
        return response.json()


@function_tool
async def wait_for_task_completion(
    task_id: str,
    timeout: int = 600,
    poll_interval: int = 5
) -> Dict[str, Any]:
    """
    Wait for a crawler task to complete.
    
    Args:
        task_id: The unique task identifier
        timeout: Maximum wait time in seconds (default: 600)
        poll_interval: How often to check status in seconds (default: 5)
    
    Returns:
        Final task result when completed
    
    Raises:
        TimeoutError: If task doesn't complete within timeout
    """
    start_time = asyncio.get_event_loop().time()
    
    while True:
        status = await get_task_status(task_id)
        
        if status["status"] in ["completed", "failed", "cancelled"]:
            return status
        
        elapsed = asyncio.get_event_loop().time() - start_time
        if elapsed > timeout:
            raise TimeoutError(f"Task {task_id} did not complete within {timeout}s")
        
        await asyncio.sleep(poll_interval)


@function_tool
async def get_crawler_statistics(task_id: str) -> Dict[str, Any]:
    """
    Get detailed statistics for a crawler task.
    
    Args:
        task_id: The unique task identifier
    
    Returns:
        Statistics including counts, duration, errors, etc.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{CRAWLER_API_BASE}/tasks/{task_id}/stats",
            timeout=10.0
        )
        response.raise_for_status()
        return response.json()


@function_tool
async def query_crawled_posts(
    platform: Optional[str] = None,
    keyword: Optional[str] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    limit: int = 100
) -> list[Dict[str, Any]]:
    """
    Query crawled posts from the database.
    
    Args:
        platform: Filter by platform (optional)
        keyword: Search keyword in title/desc (optional)
        start_time: Start time filter (optional)
        end_time: End time filter (optional)
        limit: Maximum number of results (default: 100)
    
    Returns:
        List of post dictionaries
    """
    params = {
        "limit": limit
    }
    if platform:
        params["platform"] = platform
    if keyword:
        params["keyword"] = keyword
    if start_time:
        params["start_time"] = start_time
    if end_time:
        params["end_time"] = end_time
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{CRAWLER_API_BASE}/posts",
            params=params,
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()
```

---

### tools/analysis_tools.py

```python
"""Content analysis tools for agents."""

from typing import Dict, Any, List, Optional
import httpx
from agents import function_tool
from pydantic import BaseModel


class SensitiveContentResult(BaseModel):
    """Sensitive content detection result."""
    video_id: str
    has_violation: bool
    violation_types: List[str]
    confidence_scores: Dict[str, float]
    recommendation: str


class SentimentResult(BaseModel):
    """Sentiment analysis result."""
    post_id: str
    overall_sentiment: str  # positive, negative, neutral
    sentiment_score: float  # -1.0 to 1.0
    emotions: Dict[str, float]
    confidence: float


# Analysis service base URLs
SENSITIVE_CONTENT_API = "http://localhost:8001/api/v1"
SENTIMENT_API = "http://localhost:8002/api/v1"


@function_tool
async def analyze_sensitive_content(
    video_url: str,
    video_id: str
) -> Dict[str, Any]:
    """
    Analyze video content for sensitive material (NSFW, violence, etc.).
    
    Args:
        video_url: URL to the video file
        video_id: Unique video identifier
    
    Returns:
        Dictionary with violation detection results
    
    Example:
        result = await analyze_sensitive_content(
            video_url="https://...",
            video_id="7123456789"
        )
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SENSITIVE_CONTENT_API}/analyze",
            json={
                "video_url": video_url,
                "video_id": video_id
            },
            timeout=120.0  # Video analysis can take time
        )
        response.raise_for_status()
        return response.json()


@function_tool
async def analyze_sentiment(
    text: str,
    post_id: str
) -> Dict[str, Any]:
    """
    Analyze sentiment and emotions in text content.
    
    Args:
        text: Text content to analyze (title + description)
        post_id: Unique post identifier
    
    Returns:
        Dictionary with sentiment scores and emotion labels
    
    Example:
        result = await analyze_sentiment(
            text="这个产品太棒了！非常喜欢！",
            post_id="post_123"
        )
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SENTIMENT_API}/analyze",
            json={
                "text": text,
                "post_id": post_id
            },
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()


@function_tool
async def extract_topics(
    texts: List[str],
    num_topics: int = 5
) -> List[Dict[str, Any]]:
    """
    Extract main topics from a collection of texts.
    
    Args:
        texts: List of text content
        num_topics: Number of topics to extract (default: 5)
    
    Returns:
        List of topics with keywords and scores
    
    Example:
        topics = await extract_topics(
            texts=["text1", "text2", ...],
            num_topics=5
        )
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SENTIMENT_API}/topics",
            json={
                "texts": texts,
                "num_topics": num_topics
            },
            timeout=60.0
        )
        response.raise_for_status()
        return response.json()


@function_tool
async def detect_trends(
    post_data: List[Dict[str, Any]],
    time_window: str = "7d"
) -> List[Dict[str, Any]]:
    """
    Detect trends and patterns in social media posts.
    
    Args:
        post_data: List of post dictionaries with timestamps and metrics
        time_window: Time window for trend analysis (e.g., "7d", "30d")
    
    Returns:
        List of detected trends with growth rates
    
    Example:
        trends = await detect_trends(
            post_data=[...],
            time_window="7d"
        )
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SENTIMENT_API}/trends",
            json={
                "posts": post_data,
                "time_window": time_window
            },
            timeout=60.0
        )
        response.raise_for_status()
        return response.json()


@function_tool
async def analyze_engagement(post_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze engagement metrics for a post.
    
    Args:
        post_data: Post data including likes, comments, shares, views
    
    Returns:
        Engagement analysis with scores and benchmarks
    
    Example:
        engagement = await analyze_engagement({
            "likes": 1000,
            "comments": 50,
            "shares": 20,
            "views": 10000
        })
    """
    likes = post_data.get("likes", 0)
    comments = post_data.get("comments", 0)
    shares = post_data.get("shares", 0)
    views = post_data.get("views", 1)
    
    # Calculate engagement metrics
    engagement_rate = (likes + comments + shares) / views * 100
    interaction_rate = (comments + shares) / views * 100
    
    # Determine engagement level
    if engagement_rate > 10:
        level = "very_high"
    elif engagement_rate > 5:
        level = "high"
    elif engagement_rate > 2:
        level = "medium"
    else:
        level = "low"
    
    return {
        "engagement_rate": round(engagement_rate, 2),
        "interaction_rate": round(interaction_rate, 2),
        "engagement_level": level,
        "total_interactions": likes + comments + shares,
        "metrics": {
            "likes": likes,
            "comments": comments,
            "shares": shares,
            "views": views
        }
    }
```

---

## 🤖 Agent Implementations

### agents/coordinator.py

```python
"""Coordinator Agent implementation."""

from agents import Agent
from tools.crawler_tools import (
    create_crawler_task,
    get_task_status,
    wait_for_task_completion,
    query_crawled_posts
)


def create_coordinator_agent(
    data_collection_agent,
    analysis_pipeline_agent
) -> Agent:
    """
    Create the Coordinator Agent.
    
    Args:
        data_collection_agent: Data collection agent instance
        analysis_pipeline_agent: Analysis pipeline agent instance
    
    Returns:
        Configured Coordinator Agent
    """
    return Agent(
        name="Coordinator",
        model="gpt-4-turbo",
        instructions="""
You are the Coordinator Agent for a public opinion analysis system.

Your role is to:
1. Understand user requirements for opinion analysis tasks
2. Determine what data needs to be collected
3. Route data collection to Data Collection Agent
4. Route analysis to Analysis Pipeline Agent
5. Ensure tasks complete successfully
6. Return comprehensive results to users

Workflow:
- When users request analysis, first clarify:
  - Which platforms (douyin, xhs, bilibili, etc.)
  - What keywords or creators to monitor
  - Time range and content volume
  - Analysis depth required
  
- Break down complex requests into subtasks
- Coordinate execution across specialized agents
- Handle errors gracefully and retry when appropriate
- Provide clear status updates
- Aggregate final results

Communication:
- Be professional and concise
- Provide progress updates for long-running tasks
- Explain any issues or limitations clearly
- Always include actionable insights in final results
""",
        tools=[
            create_crawler_task,
            get_task_status,
            wait_for_task_completion,
            query_crawled_posts
        ],
        handoffs=[data_collection_agent, analysis_pipeline_agent]
    )
```

---

### agents/data_collection.py

```python
"""Data Collection Agent implementation."""

from agents import Agent
from tools.crawler_tools import (
    create_crawler_task,
    get_task_status,
    wait_for_task_completion,
    get_crawler_statistics,
    query_crawled_posts
)
from pydantic import BaseModel


class CrawlerResult(BaseModel):
    """Structured output for crawler results."""
    task_id: str
    platform: str
    status: str
    total_posts: int
    total_accounts: int
    execution_time: float
    data_summary: dict


def create_data_collection_agent(content_analysis_agent) -> Agent:
    """
    Create the Data Collection Agent.
    
    Args:
        content_analysis_agent: Content analysis agent instance
    
    Returns:
        Configured Data Collection Agent
    """
    return Agent(
        name="Data Collection",
        model="gpt-4-turbo",
        instructions="""
You are the Data Collection Agent specializing in multi-platform social media crawling.

Your capabilities:
- Configure and submit crawler tasks for Douyin, Xiaohongshu, Bilibili
- Monitor crawler execution and health
- Validate data quality
- Handle errors and retries
- Resume interrupted tasks

For each crawling request:
1. Determine optimal crawler configuration
   - Choose crawler mode: search (keywords), creator (specific users), detail (specific posts)
   - Set reasonable limits (typically 100-500 posts)
   - Configure timeouts appropriately
   
2. Submit crawler task
   - Use create_crawler_task tool
   - Validate configuration before submission
   
3. Monitor execution
   - Use wait_for_task_completion to track progress
   - Check get_task_status periodically for long tasks
   
4. Validate results
   - Verify data completeness
   - Check for errors or warnings
   - Ensure minimum quality standards
   
5. Handoff to Content Analysis Agent when ready

Configuration examples:

Douyin search:
{
    "platform": "douyin",
    "crawler_type": "search",
    "config": {
        "keywords": ["人工智能", "AI"],
        "max_aweme_count": 100
    }
}

Douyin creator:
{
    "platform": "douyin",
    "crawler_type": "creator",
    "config": {
        "dy_creator_id_list": ["MS4wLjABAAAA..."],
        "max_aweme_count": 40
    }
}

Always ensure crawled data meets quality standards before proceeding to analysis.
Report any issues clearly and suggest solutions.
""",
        tools=[
            create_crawler_task,
            get_task_status,
            wait_for_task_completion,
            get_crawler_statistics,
            query_crawled_posts
        ],
        handoffs=[content_analysis_agent],
        output_type=CrawlerResult
    )
```

---

### agents/content_analysis.py

```python
"""Content Analysis Agent implementation."""

from agents import Agent
from tools.analysis_tools import (
    analyze_sensitive_content,
    analyze_sentiment,
    extract_topics,
    detect_trends,
    analyze_engagement
)
from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class AnalysisResult(BaseModel):
    """Structured output for content analysis."""
    total_analyzed: int
    sensitive_content_summary: Dict[str, Any]
    sentiment_summary: Dict[str, Any]
    topic_summary: List[Dict[str, Any]]
    trend_summary: List[Dict[str, Any]]
    high_risk_posts: List[str]
    recommendations: List[str]


def create_content_analysis_agent(
    sensitive_content_analyzer,
    sentiment_analyzer,
    topic_analyzer,
    trend_analyzer,
    report_generation_agent
) -> Agent:
    """
    Create the Content Analysis Agent.
    
    Args:
        sensitive_content_analyzer: Sensitive content analyzer instance
        sentiment_analyzer: Sentiment analyzer instance
        topic_analyzer: Topic analyzer instance
        trend_analyzer: Trend analyzer instance
        report_generation_agent: Report generation agent instance
    
    Returns:
        Configured Content Analysis Agent
    """
    return Agent(
        name="Content Analysis",
        model="gpt-4-turbo",
        instructions="""
You are the Content Analysis Agent coordinating multi-dimensional analysis.

Your role:
1. Receive collected social media content
2. Coordinate analysis across multiple dimensions:
   - Sensitive content detection (NSFW, violence, illegal)
   - Sentiment analysis (positive, negative, neutral)
   - Topic extraction and clustering
   - Trend identification
   - Engagement metrics

Analysis workflow:
1. Priority: Sensitive content detection
   - Handoff videos to Sensitive Content Analyzer
   - Flag high-risk content immediately
   
2. Parallel analysis:
   - Sentiment analysis on all text content
   - Topic extraction from content corpus
   - Trend detection on time-series data
   
3. Aggregate results:
   - Combine findings from all analyzers
   - Identify patterns and correlations
   - Calculate risk levels
   
4. Handoff to Report Generation Agent

Tools available:
- analyze_sensitive_content: Video/image analysis
- analyze_sentiment: Text sentiment analysis
- extract_topics: Topic modeling
- detect_trends: Trend detection
- analyze_engagement: Engagement metrics

Handoffs available:
- Sensitive Content Analyzer: For detailed NSFW/violence detection
- Sentiment Analyzer: For emotion analysis
- Topic Analyzer: For theme extraction
- Trend Analyzer: For pattern identification
- Report Generation: For final report creation

Best practices:
- Analyze sensitive content first (safety priority)
- Run independent analyses in parallel when possible
- Provide clear summaries at each step
- Flag high-risk content for immediate attention
- Include confidence scores in results
""",
        tools=[
            analyze_sensitive_content,
            analyze_sentiment,
            extract_topics,
            detect_trends,
            analyze_engagement
        ],
        handoffs=[
            sensitive_content_analyzer,
            sentiment_analyzer,
            topic_analyzer,
            trend_analyzer,
            report_generation_agent
        ],
        output_type=AnalysisResult
    )
```

---

### agents/report_generation.py

```python
"""Report Generation Agent implementation."""

from agents import Agent
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime


class AnalysisReport(BaseModel):
    """Structured output for analysis reports."""
    report_id: str
    task_id: str
    generated_at: str
    executive_summary: str
    data_overview: Dict[str, Any]
    sensitive_content_summary: Dict[str, Any]
    sentiment_summary: Dict[str, Any]
    topic_summary: List[Dict[str, Any]]
    trend_summary: List[Dict[str, Any]]
    risk_assessment: Dict[str, Any]
    recommendations: List[str]


def create_report_generation_agent(decision_support_agent) -> Agent:
    """
    Create the Report Generation Agent.
    
    Args:
        decision_support_agent: Decision support agent instance
    
    Returns:
        Configured Report Generation Agent
    """
    return Agent(
        name="Report Generation",
        model="gpt-4-turbo",
        instructions="""
You are the Report Generation Agent creating comprehensive analysis reports.

Your responsibilities:
1. Aggregate data from all analysis agents
2. Generate clear, actionable executive summaries
3. Present findings with structured sections
4. Assess overall risk levels
5. Provide preliminary recommendations

Report structure:

1. Executive Summary (2-3 paragraphs)
   - Key findings
   - Critical issues
   - Top recommendations

2. Data Overview
   - Platforms analyzed
   - Content volume
   - Time range
   - Coverage statistics

3. Sensitive Content Summary
   - Violation counts by type
   - High-risk content list
   - Confidence levels
   - Immediate actions needed

4. Sentiment Analysis
   - Overall sentiment distribution
   - Emotion breakdown
   - Sentiment trends over time
   - Notable shifts

5. Topic Analysis
   - Main topics identified
   - Topic distribution
   - Keyword clouds
   - Emerging themes

6. Trend Analysis
   - Trending topics
   - Growth patterns
   - Viral content
   - Influencer activity

7. Risk Assessment
   - Overall risk level (low/medium/high/critical)
   - Risk factors
   - Potential impacts
   - Mitigation priority

8. Recommendations
   - Immediate actions
   - Short-term strategies
   - Long-term plans
   - Resource requirements

Writing guidelines:
- Be clear and concise
- Use bullet points for lists
- Include specific numbers and percentages
- Highlight critical issues prominently
- Make recommendations actionable
- Tailor language to audience

After generating the report, handoff to Decision Support Agent for
strategic recommendations and action planning.
""",
        handoffs=[decision_support_agent],
        output_type=AnalysisReport
    )
```

---

## 🚀 Running the System

### main.py

```python
"""Main entry point for multi-agent system."""

import asyncio
from agents import Runner, SQLiteSession
from agents.coordinator import create_coordinator_agent
from agents.data_collection import create_data_collection_agent
from agents.content_analysis import create_content_analysis_agent
from agents.report_generation import create_report_generation_agent


async def main():
    """Run a sample analysis workflow."""
    
    # Create agents (bottom-up to handle dependencies)
    report_agent = create_report_generation_agent(decision_support_agent=None)
    
    sensitive_analyzer = None  # To be implemented
    sentiment_analyzer = None  # To be implemented
    topic_analyzer = None  # To be implemented
    trend_analyzer = None  # To be implemented
    
    content_analysis_agent = create_content_analysis_agent(
        sensitive_content_analyzer=sensitive_analyzer,
        sentiment_analyzer=sentiment_analyzer,
        topic_analyzer=topic_analyzer,
        trend_analyzer=trend_analyzer,
        report_generation_agent=report_agent
    )
    
    data_collection_agent = create_data_collection_agent(
        content_analysis_agent=content_analysis_agent
    )
    
    coordinator_agent = create_coordinator_agent(
        data_collection_agent=data_collection_agent,
        analysis_pipeline_agent=content_analysis_agent
    )
    
    # Create session for conversation memory
    session = SQLiteSession("user_001")
    
    # Run analysis
    user_request = """
    分析抖音平台上关于"人工智能"的舆情。
    收集最近7天的内容，分析大约200条帖子。
    重点关注：
    1. 是否有敏感内容
    2. 用户情感倾向
    3. 主要讨论话题
    4. 潮流趋势
    """
    
    print("🚀 Starting analysis...")
    print(f"📝 Request: {user_request}\n")
    
    result = await Runner.run(
        coordinator_agent,
        input=user_request,
        session=session,
        max_turns=30
    )
    
    print("\n✅ Analysis complete!")
    print(f"📊 Result: {result.final_output}")


if __name__ == "__main__":
    asyncio.run(main())
```

---

### api/main.py

```python
"""FastAPI application for multi-agent system."""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import asyncio
from agents import Runner, SQLiteSession

app = FastAPI(
    title="POA Multi-Agent Analysis API",
    version="1.0.0",
    description="Multi-agent system for public opinion analysis"
)


class AnalysisRequest(BaseModel):
    """Analysis request model."""
    request: str
    session_id: Optional[str] = None
    max_turns: int = 30


class AnalysisResponse(BaseModel):
    """Analysis response model."""
    request_id: str
    status: str
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


@app.post("/api/v1/analyze", response_model=AnalysisResponse)
async def create_analysis(request: AnalysisRequest):
    """
    Create a new analysis task.
    
    Args:
        request: Analysis request with natural language input
    
    Returns:
        Analysis response with results or error
    """
    try:
        # Create or retrieve session
        session_id = request.session_id or f"session_{id(request)}"
        session = SQLiteSession(session_id)
        
        # Run agent workflow
        result = await Runner.run(
            coordinator_agent,  # Global coordinator instance
            input=request.request,
            session=session,
            max_turns=request.max_turns
        )
        
        return AnalysisResponse(
            request_id=session_id,
            status="completed",
            result=result.final_output
        )
        
    except Exception as e:
        return AnalysisResponse(
            request_id=session_id,
            status="failed",
            error=str(e)
        )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8100)
```

---

## 🧪 Testing

### tests/test_coordinator.py

```python
"""Tests for Coordinator Agent."""

import pytest
from agents import Runner
from agents.coordinator import create_coordinator_agent


@pytest.mark.asyncio
async def test_coordinator_simple_request():
    """Test coordinator with simple analysis request."""
    
    # Mock dependencies
    mock_data_collection = None  # Mock agent
    mock_analysis = None  # Mock agent
    
    coordinator = create_coordinator_agent(
        data_collection_agent=mock_data_collection,
        analysis_pipeline_agent=mock_analysis
    )
    
    result = await Runner.run(
        coordinator,
        input="分析抖音上关于AI的内容"
    )
    
    assert result.final_output is not None


@pytest.mark.asyncio
async def test_coordinator_with_session():
    """Test coordinator with session memory."""
    from agents import SQLiteSession
    
    session = SQLiteSession("test_user")
    coordinator = ...  # Setup
    
    # First request
    result1 = await Runner.run(
        coordinator,
        "分析抖音上关于AI的内容",
        session=session
    )
    
    # Follow-up request (should remember context)
    result2 = await Runner.run(
        coordinator,
        "继续分析情感倾向",
        session=session
    )
    
    assert result2.final_output is not None
```

---

## 📚 Next Steps

1. **Implement remaining agents**: Sentiment Analyzer, Topic Analyzer, etc.
2. **Add error handling**: Retry logic, fallbacks
3. **Implement caching**: Redis caching for repeated analyses
4. **Add monitoring**: Logging, tracing, metrics
5. **Write comprehensive tests**: Unit and integration tests
6. **Deploy to production**: Docker, Kubernetes

---

**Last Updated**: 2025-11-06

