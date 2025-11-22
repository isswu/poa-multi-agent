"""Configuration management for multi-agent system."""

import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=False, extra="ignore"
    )

    # OpenAI API Configuration
    openai_api_key: str = ""

    # Existing Service URLs
    crawler_api_base: str = "http://localhost:8000/api/v1"
    sensitive_content_api: str = "http://localhost:8001/api/v1"
    sentiment_api: str = "http://localhost:8002/api/v1"

    # Database Configuration
    database_url: str = "postgresql+asyncpg://postgres:dev123456@localhost:5432/poa_multi_agent_dev"

    # Redis Configuration
    redis_url: str = "redis://localhost:6379/0"

    # Agent Model Configuration
    default_model: str = "gpt-4-turbo"
    coordinator_model: str = "gpt-4-turbo"
    data_collection_model: str = "gpt-4o-mini"
    analysis_model: str = "gpt-4-turbo"
    report_model: str = "gpt-4-turbo"
    decision_model: str = "gpt-4-turbo"

    # Agent Settings
    max_turns: int = 30
    enable_tracing: bool = True
    tracing_backend: str = "logfire"

    # API Server Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8100
    api_reload: bool = True

    # Session Storage
    session_db_path: str = "./data/sessions.db"
    session_db_url: str = (
        "postgresql+asyncpg://postgres:devpass@localhost:5432/media_monitor_dev"
    )

    # Logging
    log_level: str = "INFO"
    log_file: str = "./logs/agent.log"

    def __init__(self, **kwargs):
        """Initialize settings."""
        super().__init__(**kwargs)
        # Set OpenAI API key as environment variable if provided
        if self.openai_api_key:
            os.environ["OPENAI_API_KEY"] = self.openai_api_key


# Global settings instance
settings = Settings()
