#!/bin/bash

# POA Multi-Agent System Start Script

set -e

echo "🚀 Starting POA Multi-Agent System..."
echo ""

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ Error: uv is not installed"
    echo "📥 Install uv: curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "📝 Creating .env from template..."
    cat > .env << 'ENVEOF'
# OpenAI API Configuration
OPENAI_API_KEY=your_key_here

# Existing Service URLs
CRAWLER_API_BASE=http://localhost:8000/api/v1
SENSITIVE_CONTENT_API=http://localhost:8001/api/v1
SENTIMENT_API=http://localhost:8002/api/v1

# Database
DATABASE_URL=postgresql+asyncpg://postgres:123456@localhost:5432/media_crawler_pro

# Redis
REDIS_URL=redis://localhost:6379/0
ENVEOF
    echo ""
    echo "⚠️  Please edit .env and add your OpenAI API key"
    echo "Then run this script again."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
uv sync --quiet

# Create necessary directories
mkdir -p data logs

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Available commands:"
echo "  1. Run API server:    make run-api"
echo "  2. Run example:       make run-example"
echo "  3. Run tests:         make test"
echo "  4. View API docs:     http://localhost:8100/docs (after starting API)"
echo ""
echo "🎯 Quick start:"
echo "  make run-api"
echo ""

