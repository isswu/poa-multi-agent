"""Example of using the API client."""

import asyncio

import httpx


async def main():
    """Example API client usage."""

    print("🚀 POA Multi-Agent API Client Example\n")

    # API endpoint
    api_base = "http://localhost:8100/api/v1"

    # Analysis request
    request_data = {
        "session_id": "session_1234567890",
        "request": "确认无误，立即开始采集和分析过程",
        "max_turns": 20,
    }

    print("📝 Sending request to API...")
    print(f"Request: {request_data['request']}\n")

    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            # Submit analysis request
            response = await client.post(f"{api_base}/analysis", json=request_data)
            response.raise_for_status()

            result = response.json()

            print("✅ Analysis Complete!\n")
            print(f"Request ID: {result['request_id']}")
            print(f"Status: {result['status']}\n")

            if result["status"] == "completed":
                print("📊 Result:")
                print(result["result"])
            else:
                print(f"❌ Error: {result.get('error')}")

    except httpx.HTTPError as e:
        print(f"❌ HTTP Error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    # Note: Make sure API server is running first!
    # Run: uvicorn src.api.main:app --reload --port 8100
    asyncio.run(main())
