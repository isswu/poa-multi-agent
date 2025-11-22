#!/bin/bash

# POA Multi-Agent System - Development Startup Script

set -e

echo "🚀 Starting POA Multi-Agent System..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -d "anti-agents" ] || [ ! -d "web" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists python; then
    echo "❌ Python is not installed"
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command_exists uv; then
    echo "⚠️  uv is not installed. Install with: pip install uv"
    echo "Falling back to pip/venv..."
fi

# Setup backend
echo -e "\n${BLUE}Setting up backend...${NC}"
cd anti-agents

if command_exists uv; then
    uv sync
else
    python -m venv .venv
    source .venv/bin/activate
    pip install -e .
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}No .env file found in backend. Creating from .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file. Please update it with your configuration."
    fi
fi

cd ..

# Setup frontend
echo -e "\n${BLUE}Setting up frontend...${NC}"
cd web

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}No .env file found in frontend. Creating from .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file."
    fi
fi

cd ..

# Start services
echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo -e "\n${BLUE}Starting services...${NC}"

# Start backend in background
echo -e "${BLUE}Starting backend API...${NC}"
cd anti-agents
if command_exists uv; then
    uv run python src/api/main.py &
else
    source .venv/bin/activate
    python src/api/main.py &
fi
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo -e "${BLUE}Starting frontend...${NC}"
cd web
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "\n${GREEN}✨ POA Multi-Agent System is running!${NC}"
echo -e "\n📍 Services:"
echo -e "  Backend API:  ${BLUE}http://localhost:8100${NC}"
echo -e "  API Docs:     ${BLUE}http://localhost:8100/docs${NC}"
echo -e "  Frontend:     ${BLUE}http://localhost:5173${NC}"
echo -e "\n⏹️  Press Ctrl+C to stop all services"

# Trap Ctrl+C to kill both processes
trap "echo -e '\n\n${YELLOW}Stopping services...${NC}'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Wait for both processes
wait
