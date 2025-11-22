"""Content analysis tools for agents."""

from typing import Any, Dict, List

import httpx
from agents import function_tool
from pydantic import BaseModel

from config import settings


class PostEngagementData(BaseModel):
    """Post engagement data for analysis."""

    likes: int = 0
    comments: int = 0
    shares: int = 0
    views: int = 1
    platform: str = "douyin"


@function_tool
async def analyze_sensitive_content(video_url: str, video_id: str) -> Dict[str, Any]:
    """
    Analyzes video content for sensitive material (NSFW, violence, illegal content).

    This tool uses the existing sensitive content detection module to analyze
    videos for pornography, violence, and other violations.

    Args:
        video_url: URL to the video file to analyze
        video_id: Unique video identifier for tracking

    Returns:
        Dictionary with violation detection results:
        {
            "video_id": "7123456789",
            "has_violation": true | false,
            "violation_types": ["violence", "porn"],
            "confidence_scores": {"violence": 0.89, "porn": 0.12},
            "violation_segments": [
                {"start_ms": 1000, "end_ms": 5000, "type": "violence"}
            ],
            "recommendation": "block" | "review" | "approve"
        }

    Example:
        result = await analyze_sensitive_content(
            video_url="https://example.com/video.mp4",
            video_id="7123456789"
        )
        if result["has_violation"]:
            print(f"Violations found: {result['violation_types']}")
    """
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{settings.sensitive_content_api}/analyze",
                json={"video_url": video_url, "video_id": video_id},
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        return {
            "error": f"Failed to analyze sensitive content: {str(e)}",
            "video_id": video_id,
            "has_violation": False,
        }
    except Exception as e:
        return {
            "error": f"Unexpected error: {str(e)}",
            "video_id": video_id,
            "has_violation": False,
        }


@function_tool
async def analyze_sentiment(text: str, post_id: str) -> Dict[str, Any]:
    """
    Analyzes sentiment and emotions in text content.

    This tool performs natural language processing to determine the emotional
    tone and attitude expressed in social media posts.

    Args:
        text: Text content to analyze (title + description combined)
        post_id: Unique post identifier for tracking

    Returns:
        Dictionary with sentiment scores and emotion labels:
        {
            "post_id": "post_123",
            "overall_sentiment": "positive" | "negative" | "neutral",
            "sentiment_score": 0.75,  # Range: -1.0 (negative) to 1.0 (positive)
            "emotions": {
                "joy": 0.8,
                "anger": 0.1,
                "sadness": 0.0,
                "fear": 0.05,
                "surprise": 0.3
            },
            "attitude": "supportive" | "critical" | "neutral",
            "confidence": 0.92
        }

    Example:
        result = await analyze_sentiment(
            text="这个产品太棒了！非常喜欢！",
            post_id="post_123"
        )
        print(f"Sentiment: {result['overall_sentiment']}")
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{settings.sentiment_api}/analyze", json={"text": text, "post_id": post_id}
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        # Return neutral sentiment on error
        return {
            "error": f"Failed to analyze sentiment: {str(e)}",
            "post_id": post_id,
            "overall_sentiment": "neutral",
            "sentiment_score": 0.0,
            "emotions": {},
            "confidence": 0.0,
        }
    except Exception as e:
        return {
            "error": f"Unexpected error: {str(e)}",
            "post_id": post_id,
            "overall_sentiment": "neutral",
            "sentiment_score": 0.0,
            "emotions": {},
            "confidence": 0.0,
        }


@function_tool
async def extract_topics(texts: List[str], num_topics: int = 5) -> str:
    """
    Extracts main topics from a collection of texts.

    This tool uses topic modeling (LDA/BERTopic) to identify main themes
    and subjects discussed in a corpus of social media content.

    Args:
        texts: List of text content (titles and descriptions)
        num_topics: Number of topics to extract (default: 5, range: 3-20)

    Returns:
        JSON string of topic list:
        '[
            {
                "topic_id": 0,
                "topic_name": "人工智能发展",
                "keywords": [
                    {"word": "人工智能", "score": 0.25},
                    {"word": "AI", "score": 0.20},
                    {"word": "技术", "score": 0.15}
                ],
                "document_count": 145,
                "percentage": 29.5
            },
            ...
        ]'

    Example:
        topics = await extract_topics(
            texts=["文本1", "文本2", ...],
            num_topics=5
        )
        for topic in topics:
            print(f"Topic: {topic['topic_name']}")
    """
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.sentiment_api}/topics",
                json={"texts": texts, "num_topics": max(3, min(num_topics, 20))},
            )
            response.raise_for_status()
            import json

            return json.dumps(response.json(), ensure_ascii=False)
    except httpx.HTTPError as e:
        import json

        return json.dumps([{"error": f"Failed to extract topics: {str(e)}"}], ensure_ascii=False)
    except Exception as e:
        import json

        return json.dumps([{"error": f"Unexpected error: {str(e)}"}], ensure_ascii=False)


@function_tool
async def detect_trends(post_data_json: str, time_window: str = "7d") -> str:
    """
    Detects trends and patterns in social media posts.

    This tool analyzes time-series data to identify trending topics,
    viral content, and emerging patterns.

    Args:
        post_data_json: JSON string of post list with timestamps and engagement metrics
            Each post should have: post_id, created_time, likes, comments, shares
            Example: '[{"post_id": "123", "created_time": "2025-11-06", "likes": 100}]'
        time_window: Time window for trend analysis
            Options: "1d" (1 day), "7d" (7 days), "30d" (30 days)

    Returns:
        JSON string of detected trends:
        '[
            {
                "trend_id": "trend_001",
                "trend_name": "AI热潮",
                "trend_type": "rising",
                "growth_rate": 145.5,
                "post_count": 487,
                "total_engagement": 125430,
                "related_keywords": ["AI", "人工智能", "ChatGPT"],
                "top_posts": ["post_id1", "post_id2"],
                "forecast": {
                    "next_24h": "继续上升",
                    "confidence": 0.85
                }
            },
            ...
        ]'

    Example:
        posts_json = '[{"post_id": "123", "likes": 100}]'
        trends = await detect_trends(
            post_data_json=posts_json,
            time_window="7d"
        )
    """
    try:
        import json

        post_data = json.loads(post_data_json)

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.sentiment_api}/trends",
                json={"posts": post_data, "time_window": time_window},
            )
            response.raise_for_status()
            return json.dumps(response.json(), ensure_ascii=False)
    except httpx.HTTPError as e:
        import json

        return json.dumps([{"error": f"Failed to detect trends: {str(e)}"}], ensure_ascii=False)
    except Exception as e:
        import json

        return json.dumps([{"error": f"Unexpected error: {str(e)}"}], ensure_ascii=False)


@function_tool
def analyze_engagement(likes: int, comments: int, shares: int, views: int) -> str:
    """
    Analyzes engagement metrics for a post.

    This tool calculates engagement rates and benchmarks performance
    against typical social media metrics.

    Args:
        likes: Number of likes
        comments: Number of comments
        shares: Number of shares
        views: Number of views

    Returns:
        JSON string of engagement analysis with scores and benchmarks:
        '{
            "engagement_rate": 10.7,
            "interaction_rate": 0.7,
            "engagement_level": "very_high",
            "total_interactions": 1070,
            "metrics": {
                "likes": 1000,
                "comments": 50,
                "shares": 20,
                "views": 10000
            },
            "benchmarks": {
                "platform_average": 5.2,
                "percentile": 85
            }
        }'

    Example:
        analysis = analyze_engagement(
            likes=1000,
            comments=50,
            shares=20,
            views=10000
        )
    """
    likes = likes or 0
    comments = comments or 0
    shares = shares or 0
    views = views or 1  # Avoid division by zero

    # Calculate engagement metrics
    total_interactions = likes + comments + shares
    engagement_rate = (total_interactions / views) * 100 if views > 0 else 0
    interaction_rate = ((comments + shares) / views) * 100 if views > 0 else 0

    # Determine engagement level based on engagement rate
    if engagement_rate > 10:
        level = "very_high"
        percentile = 95
    elif engagement_rate > 5:
        level = "high"
        percentile = 75
    elif engagement_rate > 2:
        level = "medium"
        percentile = 50
    else:
        level = "low"
        percentile = 25

    # Platform-specific average (simplified)
    platform_avg = 5.2  # This would ideally be calculated from historical data

    result = {
        "engagement_rate": round(engagement_rate, 2),
        "interaction_rate": round(interaction_rate, 2),
        "engagement_level": level,
        "total_interactions": total_interactions,
        "metrics": {"likes": likes, "comments": comments, "shares": shares, "views": views},
        "benchmarks": {
            "platform_average": platform_avg,
            "percentile": percentile,
            "vs_average": round((engagement_rate / platform_avg - 1) * 100, 1)
            if platform_avg > 0
            else 0,
        },
    }

    import json

    return json.dumps(result, ensure_ascii=False)
