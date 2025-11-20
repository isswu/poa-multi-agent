"""Simple example of using the multi-agent system."""

import asyncio
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from agents import Runner
from services.agent_runner import get_agent_system


async def main():
    """Run a simple analysis example."""

    print("🚀 Starting POA Multi-Agent System Example\n")

    # Initialize agent system
    print("📦 Initializing agent system...")
    coordinator = get_agent_system()
    print("✅ Agent system ready!\n")

    # Example request
    user_request = """
    确认无误，请继续操作！
    """

    print("📝 User Request:")
    print(user_request)
    print("\n" + "=" * 60 + "\n")

    # Run analysis
    print("🤖 Running multi-agent analysis...\n")

    try:
        result = await Runner.run(coordinator, input=user_request, max_turns=20)

        print("\n" + "=" * 60)
        print("\n✅ Analysis Complete!")
        print("\n📊 Result:")
        print(result.final_output)

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
