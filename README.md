# POA Multi-Agent System

Multi-agent system for public opinion analysis powered by OpenAI Agents framework.

## Features

- 🤖 **10 Specialized Agents**: Coordinator, Data Collection, Analysis, Reporting, Decision Support
- 🔄 **Intelligent Workflow**: Automatic task routing and handoffs
- 📊 **Multi-dimensional Analysis**: Sensitive content, sentiment, topics, trends
- 🚀 **Scalable Architecture**: Independent scaling of each agent
- 🔌 **Easy Integration**: Works with existing crawler and detection modules

## Quick Start

### Installation

```bash
# Install dependencies
uv sync

# Set environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Configuration

Create a `.env` file:

```bash
# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Existing Services
CRAWLER_API_BASE=http://localhost:8000/api/v1
SENSITIVE_CONTENT_API=http://localhost:8001/api/v1
SENTIMENT_API=http://localhost:8002/api/v1

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/media_crawler_pro

# Redis
REDIS_URL=redis://localhost:6379/0

# Agent Configuration
DEFAULT_MODEL=gpt-4-turbo
COORDINATOR_MODEL=gpt-4-turbo
DATA_COLLECTION_MODEL=gpt-4o-mini
ANALYSIS_MODEL=gpt-4-turbo
```

### Run Examples

```bash
# Run simple coordinator example
uv run python examples/simple_coordinator.py

# Run full workflow example
uv run python examples/full_workflow.py

# Start FastAPI server
uv run python src/api/main.py
```

### API Server

```bash
# Start server
uvicorn src.api.main:app --reload --port 8100

# API docs available at:
# http://localhost:8100/docs
```

## Architecture

```
User Request (Natural Language)
    ↓
Coordinator Agent (Intent understanding, routing)
    ↓
Data Collection Agent (Multi-platform crawling)
    ↓
Content Analysis Agent (Coordinate analysis)
    ├─→ Sensitive Content Analyzer
    ├─→ Sentiment Analyzer
    ├─→ Topic Analyzer
    └─→ Trend Analyzer
    ↓
Report Generation Agent (Comprehensive report)
    ↓
Decision Support Agent (Strategic recommendations)
    ↓
Result + Action Plan
```

## Agents

- **Coordinator Agent**: Master orchestrator
- **Data Collection Agent**: Crawler management
- **Content Analysis Agent**: Analysis coordination
- **Sensitive Content Analyzer**: NSFW/violence detection
- **Sentiment Analyzer**: Emotion analysis
- **Topic Analyzer**: Theme extraction
- **Trend Analyzer**: Pattern identification
- **Report Generation Agent**: Report creation
- **Decision Support Agent**: Strategic recommendations
- **Notification Agent**: Alert management

## Usage Example

```python
from agents import Runner
from agents.coordinator import create_coordinator_agent
from agents.data_collection import create_data_collection_agent
from agents.content_analysis import create_content_analysis_agent

# Setup agents
coordinator = create_coordinator_agent(
    data_collection_agent,
    analysis_pipeline_agent
)

# Run analysis
result = await Runner.run(
    coordinator,
    input="分析抖音上关于'人工智能'的舆情"
)

print(result.final_output)
```

## Development

```bash
# Run tests
uv run pytest

# Type checking
uv run pyright

# Linting
uv run ruff check src/
```

## Documentation

See [design documentation](../docs/README_MULTI_AGENT.md) for detailed architecture and design decisions.

## License

MIT

