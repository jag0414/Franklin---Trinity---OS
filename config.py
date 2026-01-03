import os
from functools import lru_cache
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class TrinityConfig:
    """Centralized environment configuration for Trinity AI."""
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY", "")
        self.db_url = os.getenv("FRANKLIN_DB_URL", "sqlite:///franklin.db")
        self.jwt_secret = os.getenv("FRANKLIN_JWT_SECRET", "CHANGE_ME_NOW")

    def missing_keys(self):
        missing = []
        if not self.gemini_api_key:
            missing.append("GEMINI_API_KEY")
        if not self.openai_api_key:
            missing.append("OPENAI_API_KEY")
        if not self.anthropic_api_key:
            missing.append("ANTHROPIC_API_KEY")
        return missing


@lru_cache()
def get_config():
    return TrinityConfig()


# Export as settings for app.py compatibility
settings = get_config()
