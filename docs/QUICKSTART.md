# POA Multi-Agent System - Quick Start Guide

快速开始使用 POA Multi-Agent 舆情分析系统。

---

## 📋 前提条件

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) package manager
- OpenAI API Key
- 运行中的 poa-media-crawler 服务（在 http://localhost:8000）

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd poa-multi-agent

# 安装依赖
uv sync
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Existing Service URLs
CRAWLER_API_BASE=http://localhost:8000/api/v1
SENSITIVE_CONTENT_API=http://localhost:8001/api/v1
SENTIMENT_API=http://localhost:8002/api/v1

# Database
DATABASE_URL=postgresql+asyncpg://postgres:123456@localhost:5432/media_crawler_pro

# Redis
REDIS_URL=redis://localhost:6379/0

# Models (可选，默认配置已优化)
COORDINATOR_MODEL=gpt-4-turbo
DATA_COLLECTION_MODEL=gpt-4o-mini
ANALYSIS_MODEL=gpt-4-turbo
```

### 3. 运行示例

#### 方式 1: 直接运行 Python 示例

```bash
# 运行简单示例
uv run python examples/simple_example.py
```

#### 方式 2: 启动 API 服务

```bash
# 启动 API 服务
uv run python src/api/main.py

# 或使用 Makefile
make run-api
```

API 文档：http://localhost:8100/docs

#### 方式 3: 使用 API 客户端

```bash
# 确保 API 服务正在运行
# 在新终端运行：
uv run python examples/api_client_example.py
```

---

## 💡 使用示例

### Python 代码示例

```python
import asyncio
from agents import Runner
from services.agent_runner import get_agent_system

async def analyze():
    # 初始化 agent 系统
    coordinator = get_agent_system()
    
    # 发送分析请求
    result = await Runner.run(
        coordinator,
        input="分析抖音上关于'人工智能'的舆情，最近7天，分析200条",
        max_turns=20
    )
    
    print(result.final_output)

asyncio.run(analyze())
```

### API 请求示例

```bash
curl -X POST http://localhost:8100/api/v1/analysis \
  -H "Content-Type: application/json" \
  -d '{
    "request": "分析抖音上关于'\''ChatGPT'\''的讨论，分析100条内容",
    "max_turns": 20
  }'
```

### 使用 httpx (Python)

```python
import asyncio
import httpx

async def call_api():
    async with httpx.AsyncClient(timeout=300.0) as client:
        response = await client.post(
            "http://localhost:8100/api/v1/analysis",
            json={
                "request": "分析抖音上关于'人工智能'的舆情",
                "max_turns": 20
            }
        )
        print(response.json())

asyncio.run(call_api())
```

---

## 🛠️ 开发命令

```bash
# 安装开发依赖
make install-dev

# 运行测试
make test

# 运行测试并生成覆盖率报告
make test-cov

# 代码检查
make lint

# 自动修复代码问题
make lint-fix

# 代码格式化
make format

# 类型检查
make typecheck

# 清理临时文件
make clean
```

---

## 📊 工作流程

```
用户请求 (自然语言)
    ↓
Coordinator Agent
    ↓
Data Collection Agent (爬取数据)
    ↓
Content Analysis Agent (分析内容)
    ├─ 敏感内容检测
    ├─ 情感分析
    ├─ 主题提取
    └─ 趋势识别
    ↓
Report Generation Agent (生成报告)
    ↓
Decision Support Agent (决策建议)
    ↓
返回结果
```

---

## 🎯 请求示例

### 1. 关键词分析

```
分析抖音平台上关于"人工智能"的舆情。
收集最近7天的内容，分析200条帖子。
重点关注：敏感内容、情感倾向、热点话题、趋势。
```

### 2. 创作者监控

```
监控抖音创作者 MS4wLjABAAAA... 的最新内容。
分析最近40条视频。
检测敏感内容，分析观众反应。
```

### 3. 跨平台对比

```
对比抖音、小红书、B站上关于"双十一"的讨论。
各平台分析100条内容。
比较用户情感和讨论热点。
```

---

## ⚙️ 高级配置

### 自定义模型

在 `.env` 中配置：

```bash
# 使用 GPT-4o-mini 降低成本
COORDINATOR_MODEL=gpt-4o-mini
DATA_COLLECTION_MODEL=gpt-4o-mini
ANALYSIS_MODEL=gpt-4o-mini

# 或混合使用
COORDINATOR_MODEL=gpt-4-turbo      # 复杂推理用 GPT-4
DATA_COLLECTION_MODEL=gpt-4o-mini  # 简单任务用 GPT-4o-mini
ANALYSIS_MODEL=gpt-4-turbo         # 重要分析用 GPT-4
```

### 会话管理

```python
from agents import Runner, SQLiteSession

# 创建持久会话
session = SQLiteSession("user_123")

# 第一次请求
result1 = await Runner.run(
    coordinator,
    "分析抖音上关于AI的内容",
    session=session
)

# 第二次请求（记住上下文）
result2 = await Runner.run(
    coordinator,
    "继续分析情感倾向",  # 记住是关于AI的
    session=session
)
```

---

## 🐛 故障排查

### 问题 1: OpenAI API Key 错误

```
Error: Incorrect API key provided
```

**解决**：
- 检查 `.env` 文件中的 `OPENAI_API_KEY`
- 确保 API key 有效且有余额

### 问题 2: 爬虫服务连接失败

```
Error: Failed to create crawler task: Connection refused
```

**解决**：
- 确保 poa-media-crawler 服务正在运行
- 检查 `CRAWLER_API_BASE` 配置是否正确

### 问题 3: 请求超时

```
TimeoutError: Task did not complete within 600s
```

**解决**：
- 减少分析数量
- 增加 `max_turns` 参数
- 检查网络连接

---

## 📚 更多资源

- [完整架构设计](../docs/MULTI_AGENT_ARCHITECTURE_DESIGN.md)
- [快速参考手册](../docs/MULTI_AGENT_QUICK_REFERENCE.md)
- [代码示例](../docs/MULTI_AGENT_CODE_EXAMPLES.md)
- [API 文档](http://localhost:8100/docs) (运行后访问)

---

## 💬 获取帮助

遇到问题？

1. 查看 [故障排查](#故障排查) 部分
2. 查看 [完整文档](../docs/README_MULTI_AGENT.md)
3. 检查日志文件 `logs/agent.log`

---

**祝使用愉快！** 🎉

