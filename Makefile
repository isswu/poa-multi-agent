.PHONY: help install test run clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	uv sync

install-dev: ## Install development dependencies
	uv sync --all-groups

test: ## Run tests
	uv run pytest tests/ -v

test-cov: ## Run tests with coverage
	uv run pytest tests/ --cov=src --cov-report=html --cov-report=term

run-api: ## Run API server
	uv run python src/api/main.py

run-example: ## Run simple example
	uv run python examples/simple_example.py

lint: ## Run linter
	uv run ruff check src/

lint-fix: ## Run linter and fix issues
	uv run ruff check --fix src/

format: ## Format code
	uv run ruff format src/

typecheck: ## Run type checker
	uv run pyright src/

clean: ## Clean temporary files
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name '*.pyc' -delete
	find . -type f -name '*.pyo' -delete
	find . -type d -name '*.egg-info' -exec rm -rf {} +
	rm -rf .pytest_cache
	rm -rf htmlcov
	rm -rf dist
	rm -rf build

docker-build: ## Build Docker image
	docker build -t poa-multi-agent:latest .

docker-run: ## Run Docker container
	docker run -p 8100:8100 --env-file .env poa-multi-agent:latest

