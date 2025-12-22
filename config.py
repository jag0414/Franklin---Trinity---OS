import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Franklin OS"
    ENV: str = os.getenv("ENV", "development")
    DB_URL: str = os.getenv("FRANKLIN_DB_URL", "sqlite:///franklin.db")
    
    # AI Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    
    class Config:
        env_file = ".env"

settings = Settings()
