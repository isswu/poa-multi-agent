"""Crawler management tools for agents."""

import asyncio
from typing import Any, Dict, Optional

import httpx
from agents import function_tool

from config import settings


@function_tool
async def create_crawler_task(platform: str, crawler_type: str, config_json: str) -> str:
    """
    Creates a crawler task to collect social media content.

    Use this tool to start collecting content from social media platforms like Douyin,
    Xiaohongshu, Bilibili, etc.

    Args:
        platform: Platform name (douyin, xhs, bilibili, weibo, kuaishou)
        crawler_type: Type of crawler mode
            - "search": Search by keywords
            - "creator": Crawl specific creator's content
            - "detail": Crawl specific posts by ID
            - "homefeed": Crawl homepage feed
        config_json: Crawler configuration as JSON string, varies by platform and type:
            For search mode: '{"keywords": ["keyword1"], "max_count": 100}'
            For creator mode: '{"creator_list": ["creator_id"], "max_count": 40}'
            For detail mode: '{"aweme_ids": ["post_id1", "post_id2"]}'

    Returns:
        JSON string with task_id and initial status:
        '{
            "task_id": "crawl_20251106_001",
            "status": "pending",
            "platform": "douyin",
            "crawler_type": "search"
        }'

    Example:
        result = await create_crawler_task(
            platform="douyin",
            crawler_type="search",
            config_json='{"keywords": ["人工智能"], "max_count": 100}'
        )
    """
    try:
        import json

        config = json.loads(config_json)

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{settings.crawler_api_base}/tasks/crawl",
                json={"platform": platform, "crawler_type": crawler_type, "config": config},
            )
            response.raise_for_status()
            return json.dumps(response.json(), ensure_ascii=False)
    except httpx.HTTPError as e:
        import json

        return json.dumps(
            {
                "error": f"Failed to create crawler task: {str(e)}",
                "platform": platform,
                "crawler_type": crawler_type,
            },
            ensure_ascii=False,
        )
    except Exception as e:
        import json

        return json.dumps(
            {
                "error": f"Unexpected error: {str(e)}",
                "platform": platform,
                "crawler_type": crawler_type,
            },
            ensure_ascii=False,
        )


@function_tool
async def get_task_status(task_id: str) -> str:
    """
    Gets the status and progress of a crawler task.

    Use this tool to check if a crawler task has completed and get its results.

    Args:
        task_id: The unique task identifier returned from create_crawler_task

    Returns:
        JSON string with task status, progress, and results:
        '{
            "task_id": "crawl_20251106_001",
            "status": "completed",
            "progress": 75,
            "total_posts": 487,
            "total_accounts": 45,
            "execution_time": 325.6,
            "error": null
        }'

    Example:
        status = await get_task_status("crawl_20251106_001")
    """
    try:
        import json

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{settings.crawler_api_base}/tasks/{task_id}")
            response.raise_for_status()
            return json.dumps(response.json(), ensure_ascii=False)
    except httpx.HTTPError as e:
        import json

        return json.dumps(
            {"error": f"Failed to get task status: {str(e)}", "task_id": task_id},
            ensure_ascii=False,
        )
    except Exception as e:
        import json

        return json.dumps(
            {"error": f"Unexpected error: {str(e)}", "task_id": task_id}, ensure_ascii=False
        )


@function_tool
async def wait_for_task_completion(task_id: str, timeout: int = 600, poll_interval: int = 5) -> str:
    """
    Waits for a crawler task to complete.

    This tool polls the task status until it completes or times out.
    Use this when you need to wait for crawling to finish before proceeding.

    Args:
        task_id: The unique task identifier
        timeout: Maximum wait time in seconds (default: 600 = 10 minutes)
        poll_interval: How often to check status in seconds (default: 5)

    Returns:
        JSON string of final task result when completed or error if timeout

    Example:
        result = await wait_for_task_completion("crawl_20251106_001")
    """
    import json

    start_time = asyncio.get_event_loop().time()

    while True:
        status_result_json = await get_task_status(task_id)
        status_result = json.loads(status_result_json)

        if "error" in status_result:
            return status_result_json

        if status_result.get("status") in ["completed", "failed", "cancelled"]:
            return status_result_json

        elapsed = asyncio.get_event_loop().time() - start_time
        if elapsed > timeout:
            return json.dumps(
                {
                    "error": f"Task {task_id} did not complete within {timeout}s",
                    "task_id": task_id,
                    "status": "timeout",
                    "last_status": status_result,
                },
                ensure_ascii=False,
            )

        await asyncio.sleep(poll_interval)


@function_tool
async def get_crawler_statistics(task_id: str) -> str:
    """
    Gets detailed statistics for a crawler task.

    Use this to get comprehensive metrics about a completed or running crawler task.

    Args:
        task_id: The unique task identifier

    Returns:
        JSON string of statistics including counts, duration, errors:
        '{
            "total_posts": 487,
            "total_accounts": 45,
            "total_comments": 12453,
            "execution_time": 325.6,
            "errors_count": 2,
            "success_rate": 99.5
        }'

    Example:
        stats = await get_crawler_statistics("crawl_20251106_001")
    """
    try:
        import json

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{settings.crawler_api_base}/tasks/{task_id}/stats")
            response.raise_for_status()
            return json.dumps(response.json(), ensure_ascii=False)
    except httpx.HTTPError as e:
        import json

        return json.dumps(
            {"error": f"Failed to get statistics: {str(e)}", "task_id": task_id}, ensure_ascii=False
        )
    except Exception as e:
        import json

        return json.dumps(
            {"error": f"Unexpected error: {str(e)}", "task_id": task_id}, ensure_ascii=False
        )


@function_tool
async def query_crawled_posts(
    platform: Optional[str] = None,
    keyword: Optional[str] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    limit: int = 100,
) -> str:
    """
    Queries crawled posts from the database.

    Use this tool to retrieve previously crawled content for analysis.
    All parameters are optional filters.

    Args:
        platform: Filter by platform (douyin, xhs, bilibili, etc.) - optional
        keyword: Search keyword in title/description - optional
        start_time: Start time filter in ISO format (e.g., "2025-11-01T00:00:00") - optional
        end_time: End time filter in ISO format - optional
        limit: Maximum number of results (default: 100, max: 1000)

    Returns:
        JSON string of post list:
        '[
            {
                "post_id": "7123456789",
                "platform": "douyin",
                "title": "...",
                "desc": "...",
                "video_url": "...",
                "likes": 1000,
                "comments": 50,
                "created_time": "2025-11-06T10:30:00"
            },
            ...
        ]'

    Example:
        # Get recent Douyin posts about AI
        posts = await query_crawled_posts(
            platform="douyin",
            keyword="人工智能",
            limit=50
        )
    """
    try:
        import json

        params: Dict[str, Any] = {"limit": min(limit, 1000)}

        if platform:
            params["platform"] = platform
        if keyword:
            params["keyword"] = keyword
        if start_time:
            params["start_time"] = start_time
        if end_time:
            params["end_time"] = end_time

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{settings.crawler_api_base}/posts", params=params)
            response.raise_for_status()
            return json.dumps(response.json(), ensure_ascii=False)
    except httpx.HTTPError as e:
        import json

        return json.dumps([{"error": f"Failed to query posts: {str(e)}"}], ensure_ascii=False)
    except Exception as e:
        import json

        return json.dumps([{"error": f"Unexpected error: {str(e)}"}], ensure_ascii=False)
