# Multi-Agent System Quick Reference Guide

## 🎯 Agent Responsibilities at a Glance

| Agent | Primary Role | Input | Output | Handoff To |
|-------|-------------|-------|--------|------------|
| **Coordinator** | Task routing & orchestration | User request (natural language) | Final aggregated result | Data Collection, Analysis Pipeline |
| **Data Collection** | Multi-platform crawling | Crawl requirements | Structured media data | Content Analysis |
| **Content Analysis** | Analysis coordination | Raw media content | Multi-dimensional analysis | Sub-analyzers (parallel) |
| **Sensitive Content** | NSFW/violence detection | Video/image data | Violation report | Report Generation |
| **Sentiment** | Emotion & attitude analysis | Text content | Sentiment scores | Report Generation |
| **Topic** | Theme extraction | Text content | Topics & keywords | Report Generation |
| **Trend** | Pattern identification | Time-series data | Trend indicators | Report Generation |
| **Report Generation** | Comprehensive reporting | All analysis results | Formatted report | Decision Support |
| **Decision Support** | Strategic recommendations | Report + context | Action plan | Notification |
| **Notification** | Alert management | High-priority events | Alerts sent | - |

---

## 🔄 Common Workflow Patterns

### Pattern 1: Simple Keyword Analysis
```
User Request
    ↓
Coordinator Agent
    ↓
Data Collection Agent (crawler)
    ↓
Content Analysis Agent
    ├─→ Sensitive Content Analyzer
    ├─→ Sentiment Analyzer
    ├─→ Topic Analyzer
    └─→ Trend Analyzer
    ↓
Report Generation Agent
    ↓
Decision Support Agent
    ↓
Return to User
```

### Pattern 2: High-Priority Content Monitoring
```
User Request (creator monitoring)
    ↓
Coordinator Agent
    ↓
Data Collection Agent
    ↓
Sensitive Content Analyzer (PRIORITY)
    ├─ If violations found → Notification Agent → Alert
    └─ Continue analysis
    ↓
[Continue normal workflow]
```

### Pattern 3: Cross-Platform Comparative Analysis
```
User Request (multi-platform)
    ↓
Coordinator Agent
    ↓
Data Collection Agent
    ├─→ Douyin Crawler
    ├─→ XHS Crawler
    └─→ Bilibili Crawler
    ↓
Content Analysis Agent (parallel per platform)
    ↓
Report Generation Agent (comparative report)
    ↓
Decision Support Agent
    ↓
Return to User
```

---

## 📊 Data Flow

```
┌──────────────┐
│ User Request │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Coordinator Agent    │ ← User intent understanding
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Data Collection      │ ← Crawler task submission
└──────┬───────────────┘
       │
       ▼ [Media Content Data]
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────────┐          ┌──────────────────┐
│ PostgreSQL       │          │ Redis Cache      │
│ (Persistent)     │          │ (Temporary)      │
└──────┬───────────┘          └──────┬───────────┘
       │                              │
       └──────────┬───────────────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │ Content Analysis     │ ← Multi-analyzer coordination
       └──────┬───────────────┘
              │
              ├────────┬────────┬────────┐
              ▼        ▼        ▼        ▼
          [Sensitive] [Sentiment] [Topic] [Trend]
              │        │        │        │
              └────────┴────────┴────────┘
                      │
                      ▼ [Analysis Results]
                      │
                      ▼
       ┌──────────────────────┐
       │ Report Generation    │ ← Aggregation & formatting
       └──────┬───────────────┘
              │
              ▼ [Structured Report]
              │
              ▼
       ┌──────────────────────┐
       │ Decision Support     │ ← Strategic recommendations
       └──────┬───────────────┘
              │
              ├─→ [High-Risk] → Notification Agent → Alerts
              │
              ▼ [Final Result]
              │
              ▼
       ┌──────────────────────┐
       │ Return to User       │
       └──────────────────────┘
```

---

## 🛠️ Key Tools by Agent

### Coordinator Agent Tools
```python
- create_crawler_task(platform, crawler_type, config)
- get_task_status(task_id)
- query_analysis_results(filters)
- cancel_task(task_id)
```

### Data Collection Agent Tools
```python
- submit_douyin_crawler(config)
- submit_xhs_crawler(config)
- submit_bilibili_crawler(config)
- validate_crawler_config(config)
- get_crawler_statistics(task_id)
- resume_interrupted_task(task_id)
```

### Content Analysis Agent Tools
```python
- analyze_sensitive_content(media_data)
- analyze_sentiment(text_data)
- extract_topics(text_data)
- detect_trends(time_series_data)
- analyze_engagement(post_data)
```

### Report Generation Agent Tools
```python
- aggregate_analysis_data(task_id)
- generate_summary(analysis_results)
- create_visualizations(data, chart_types)
- format_report(data, format="pdf"|"html"|"json")
- generate_recommendations(analysis_results)
```

### Decision Support Agent Tools
```python
- assess_risks(analysis_results)
- generate_action_plan(risk_assessment)
- prioritize_issues(issues_list)
- suggest_interventions(risk_items)
- estimate_impact(actions)
```

### Notification Agent Tools
```python
- send_alert(message, severity, recipients)
- escalate_issue(issue, authority_level)
- notify_stakeholders(event, stakeholder_groups)
- create_alert_summary(time_range)
```

---

## 📝 Output Schemas

### CrawlerResult
```python
{
    "task_id": "crawl_20251106_001",
    "platform": "douyin",
    "total_posts": 487,
    "total_accounts": 45,
    "status": "completed",
    "execution_time": 325.6,
    "data_summary": {
        "videos": 487,
        "comments": 12453,
        "time_range": "2025-10-30 to 2025-11-06"
    }
}
```

### AnalysisResult
```python
{
    "post_id": "7123456789",
    "platform": "douyin",
    "sensitive_content_score": {
        "has_violation": true,
        "violation_types": ["violence"],
        "confidence": 0.89
    },
    "sentiment_score": {
        "overall": "negative",
        "score": -0.65,
        "emotions": {"anger": 0.7, "sadness": 0.3}
    },
    "topics": ["社会事件", "公共安全"],
    "trends": [...],
    "risk_level": "high"
}
```

### AnalysisReport
```python
{
    "report_id": "report_20251106_001",
    "task_id": "task_20251106_001",
    "generated_at": "2025-11-06T14:30:00Z",
    "executive_summary": "...",
    "data_overview": {...},
    "sensitive_content_summary": {...},
    "sentiment_analysis": {...},
    "topic_analysis": {...},
    "trend_analysis": {...},
    "risk_assessment": {...},
    "recommendations": [...]
}
```

### DecisionSupport
```python
{
    "task_id": "task_20251106_001",
    "overall_risk_level": "high",
    "priority_issues": [
        {
            "issue_id": "issue_001",
            "type": "violence_content",
            "severity": "critical",
            "affected_posts": 15,
            "recommendation": "immediate_removal"
        }
    ],
    "recommended_actions": [
        {
            "action": "remove_content",
            "target_posts": ["7123456789", ...],
            "urgency": "immediate",
            "estimated_time": "1 hour"
        }
    ]
}
```

---

## 🚦 Agent Communication Protocol

### Handoff Pattern
```python
from agents import Agent, Runner

# Agent A defines handoff to Agent B
agent_a = Agent(
    name="Agent A",
    instructions="...",
    handoffs=[agent_b]  # Can handoff to Agent B
)

# During execution, Agent A can handoff
# LLM decides when to handoff based on context
```

### Tool Call Pattern
```python
from agents import function_tool

@function_tool
def my_tool(param1: str, param2: int) -> dict:
    """Tool description for LLM understanding."""
    # Tool implementation
    return {"result": "..."}

agent = Agent(
    name="My Agent",
    instructions="...",
    tools=[my_tool]
)
```

### Output Type Pattern
```python
from pydantic import BaseModel

class StructuredOutput(BaseModel):
    field1: str
    field2: int

agent = Agent(
    name="My Agent",
    instructions="...",
    output_type=StructuredOutput  # Agent must return this type
)
```

---

## ⚙️ Configuration Examples

### Coordinator Agent Setup
```python
from agents import Agent
from tools.crawler_tools import create_crawler_task, get_task_status
from tools.analysis_tools import query_analysis_results

coordinator_agent = Agent(
    name="Coordinator",
    model="gpt-4-turbo",
    instructions="""
    You are the Coordinator Agent for public opinion analysis.
    Route tasks to appropriate agents and aggregate results.
    """,
    tools=[
        create_crawler_task,
        get_task_status,
        query_analysis_results
    ],
    handoffs=[
        data_collection_agent,
        analysis_pipeline_agent
    ]
)
```

### Data Collection Agent Setup
```python
from agents import Agent
from tools.crawler_tools import *

data_collection_agent = Agent(
    name="Data Collection",
    model="gpt-4-turbo",
    instructions="""
    You manage multi-platform content crawling.
    Configure crawlers optimally and monitor execution.
    """,
    tools=[
        submit_douyin_crawler,
        submit_xhs_crawler,
        submit_bilibili_crawler,
        validate_crawler_config,
        get_crawler_statistics
    ],
    handoffs=[content_analysis_agent]
)
```

### Content Analysis Agent Setup
```python
from agents import Agent
from schemas.outputs import AnalysisResult

content_analysis_agent = Agent(
    name="Content Analysis",
    model="gpt-4-turbo",
    instructions="""
    Coordinate multi-dimensional content analysis.
    Route to specialized analyzers as needed.
    """,
    tools=[
        analyze_sensitive_content,
        analyze_sentiment,
        extract_topics,
        detect_trends
    ],
    handoffs=[
        sensitive_content_analyzer,
        sentiment_analyzer,
        topic_analyzer,
        trend_analyzer
    ],
    output_type=AnalysisResult  # Structured output
)
```

---

## 🔧 Running Agents

### Synchronous Execution
```python
from agents import Runner

result = Runner.run_sync(
    coordinator_agent,
    input="分析关键词'人工智能'的舆情"
)
print(result.final_output)
```

### Asynchronous Execution
```python
import asyncio
from agents import Runner

async def main():
    result = await Runner.run(
        coordinator_agent,
        input="分析关键词'人工智能'的舆情"
    )
    print(result.final_output)

asyncio.run(main())
```

### With Session Memory
```python
from agents import Runner, SQLiteSession

session = SQLiteSession("user_123")

# First request
result1 = await Runner.run(
    coordinator_agent,
    "分析抖音上关于AI的内容",
    session=session
)

# Second request (remembers context)
result2 = await Runner.run(
    coordinator_agent,
    "继续分析情感倾向",
    session=session
)
```

### With Max Turns Limit
```python
result = await Runner.run(
    coordinator_agent,
    input="...",
    max_turns=20  # Prevent infinite loops
)
```

---

## 📈 Performance Optimization Tips

### 1. Parallel Analysis
```python
# Use handoffs to multiple sub-agents for parallel processing
content_analysis_agent = Agent(
    name="Content Analysis",
    handoffs=[
        sensitive_content_analyzer,  # These run in parallel
        sentiment_analyzer,
        topic_analyzer,
        trend_analyzer
    ]
)
```

### 2. Caching Results
```python
from functools import lru_cache

@function_tool
@lru_cache(maxsize=1000)
def expensive_analysis(content_hash: str) -> dict:
    """Cache analysis results by content hash."""
    return perform_analysis(content_hash)
```

### 3. Batch Processing
```python
@function_tool
def analyze_batch(post_ids: List[str]) -> List[AnalysisResult]:
    """Analyze multiple posts in one call."""
    return [analyze_single(pid) for pid in post_ids]
```

### 4. Use Cheaper Models When Possible
```python
# Use GPT-4-mini for simpler tasks
simple_agent = Agent(
    name="Simple Task Agent",
    model="gpt-4o-mini",  # Cheaper model
    instructions="..."
)
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Agent Not Calling Tools
**Symptom**: Agent responds with text instead of calling tools

**Solution**: Make tool descriptions clear and explicit
```python
@function_tool
def my_tool(param: str) -> dict:
    """
    [Clear description of what the tool does]
    
    Args:
        param: [Clear parameter description]
    
    Returns:
        [Clear return value description]
    """
```

### Issue 2: Infinite Handoff Loops
**Symptom**: Agents keep handing off to each other

**Solution**: Use `max_turns` parameter and clear agent responsibilities
```python
result = await Runner.run(agent, input="...", max_turns=10)
```

### Issue 3: Slow Response Times
**Symptom**: Requests take too long

**Solutions**:
- Use parallel handoffs for independent sub-tasks
- Cache repeated computations
- Use faster models for simpler tasks
- Implement timeout mechanisms

### Issue 4: High API Costs
**Symptom**: OpenAI API costs too high

**Solutions**:
- Use GPT-4o-mini for simpler agents
- Reduce max_turns limit
- Optimize prompts to be more concise
- Cache analysis results
- Batch requests when possible

---

## 📊 Monitoring Checklist

### Agent Health Metrics
- [ ] Agent execution success rate (>95%)
- [ ] Average agent execution time (<30s per agent)
- [ ] Tool call success rate (>98%)
- [ ] Handoff success rate (>99%)

### Business Metrics
- [ ] Analysis completion rate (>95%)
- [ ] Average task duration (<10 min)
- [ ] Report quality score (>4/5)
- [ ] User satisfaction (>4.5/5)

### Cost Metrics
- [ ] Cost per analysis (<$0.50)
- [ ] Monthly API costs (within budget)
- [ ] Token usage optimization (>20% reduction)

### Error Metrics
- [ ] Critical error rate (<1%)
- [ ] Retry success rate (>80%)
- [ ] Mean time to recovery (<5 min)

---

## 🔐 Security Best Practices

### 1. API Key Management
```python
# Use environment variables
import os
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Never hardcode API keys
```

### 2. Input Validation
```python
from pydantic import BaseModel, validator

class AnalysisRequest(BaseModel):
    keywords: List[str]
    
    @validator('keywords')
    def validate_keywords(cls, v):
        if len(v) > 50:
            raise ValueError("Too many keywords")
        return v
```

### 3. Rate Limiting
```python
from slowapi import Limiter

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/v1/analysis")
@limiter.limit("10/minute")
async def create_analysis():
    ...
```

### 4. Output Sanitization
```python
def sanitize_output(data: dict) -> dict:
    """Remove sensitive information from output."""
    if "user_cookies" in data:
        del data["user_cookies"]
    return data
```

---

## 📚 Additional Resources

- **Main Design Doc**: `MULTI_AGENT_ARCHITECTURE_DESIGN.md`
- **OpenAI Agents Docs**: https://openai.github.io/openai-agents-python/
- **API Reference**: `/api/docs` (after deployment)
- **Example Code**: `/examples/` directory

---

**Last Updated**: 2025-11-06  
**Version**: 1.0

