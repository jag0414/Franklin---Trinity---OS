import os
import logging
from functools import lru_cache

logger = logging.getLogger(__name__)


class TrinityConfig:
    """Centralized environment configuration for Trinity AI.
    
    SECURITY WARNING: Never hardcode API keys in this file or anywhere else.
    All API keys must be loaded from environment variables.
    See SECURITY.md for detailed security guidelines.
    """
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY", "")
        self.db_url = os.getenv("FRANKLIN_DB_URL", "sqlite:///franklin.db")
        self.jwt_secret = os.getenv("FRANKLIN_JWT_SECRET", "CHANGE_ME_NOW")
        
        # Security validation
        self._validate_security()

    def missing_keys(self):
        """Return list of missing API keys."""
        missing = []
        if not self.gemini_api_key:
            missing.append("GEMINI_API_KEY")
        if not self.openai_api_key:
            missing.append("OPENAI_API_KEY")
        if not self.anthropic_api_key:
            missing.append("ANTHROPIC_API_KEY")
        return missing
    
    def _validate_security(self):
        """Validate security configuration and warn about insecure settings."""
        # Check for default/insecure JWT secret
        if self.jwt_secret in ["CHANGE_ME_NOW", "your-secret-key-change-in-production"]:
            logger.warning(
                "⚠️  SECURITY WARNING: Using default JWT secret! "
                "Set FRANKLIN_JWT_SECRET environment variable to a secure random value."
            )
        
        # Log configuration status (without exposing keys)
        if self.missing_keys():
            logger.info(
                "Missing API keys: %s. System will operate in mock mode. "
                "See SECURITY.md for setup instructions.",
                ", ".join(self.missing_keys())
            )
        else:
            logger.info("All API keys configured. Real AI providers will be used.")
    
    def is_production_ready(self):
        """Check if configuration is ready for production use."""
        issues = []
        
        # Check JWT secret
        if self.jwt_secret in ["CHANGE_ME_NOW", "your-secret-key-change-in-production"]:
            issues.append("JWT secret is using default value")
        
        # Check database (SQLite is not recommended for production)
        if self.db_url.startswith("sqlite://"):
            issues.append("Using SQLite database (consider PostgreSQL for production)")
        
        # Check if at least one AI provider is configured
        if len(self.missing_keys()) == 3:
            issues.append("No AI provider API keys configured")
        
        return len(issues) == 0, issues


@lru_cache()
def get_config():
    return TrinityConfig()


# Export as settings for app.py compatibility
settings = get_config()
