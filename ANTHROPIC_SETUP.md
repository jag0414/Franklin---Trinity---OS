# Anthropic API Configuration

## Overview
This document describes the Anthropic Claude API key configuration for the Franklin Trinity OS system.

## Changes Made

### 1. Environment Configuration (.env)
A `.env` file has been created in the project root with the Anthropic API key:
- **File**: `.env` (git-ignored for security)
- **Key**: `ANTHROPIC_API_KEY=sk-ant-api03-...`
- **Format**: Valid Anthropic API key format (108 characters)

### 2. Dependencies Updated
**File**: `requirements.txt`
- Added `python-dotenv` to support automatic `.env` file loading

### 3. Configuration Module Enhanced
**File**: `config.py`
```python
from dotenv import load_dotenv
load_dotenv()  # Loads environment variables from .env file
```

The `TrinityConfig` class now automatically loads the Anthropic API key from the `.env` file at startup.

### 4. Main Application Updated
**File**: `app.py`
```python
from dotenv import load_dotenv
load_dotenv()  # Loads environment variables at app startup
```

The FastAPI application now loads environment variables before initializing API clients.

## Verification

The configuration has been verified:
- ✓ `.env` file created and properly formatted
- ✓ API key format validated (starts with `sk-ant-api03-`)
- ✓ Key length verified (108 characters)
- ✓ `config.py` successfully loads the key
- ✓ `TrinityConfig` class can access the key
- ✓ Trinity orchestrator can initialize Anthropic client
- ✓ `.env` file is git-ignored (not committed to repository)

## Usage

### For Local Development
The Anthropic API key is now automatically loaded when you:
1. Start the backend with `python app.py` or `./Start_Backend.ps1`
2. Use the Trinity orchestrator with `python trinity_orchestrator_unified.py`
3. Import the config module: `from config import get_config`

### For Production Deployment
For production environments (Railway, Docker, etc.), set the environment variable directly:
```bash
export ANTHROPIC_API_KEY=sk-ant-api03-...
```

Or add it to your hosting platform's environment variables dashboard.

## Testing

### Test Configuration Loading
```python
from config import get_config

cfg = get_config()
print(f"Anthropic key configured: {bool(cfg.anthropic_api_key)}")
```

### Test Anthropic Client
```python
from trinity_orchestrator_unified import _make_clients

clients = _make_clients()
print(f"Available clients: {list(clients.keys())}")
# Should output: ['anthropic']
```

### Test API Call (requires internet)
```python
from trinity_orchestrator_unified import run_anthropic

result = run_anthropic("Say hello!", max_tokens=50)
print(result['text'])
```

## Security Notes

1. **Never commit the `.env` file** - It's already in `.gitignore`
2. **API Key Format**: Anthropic keys start with `sk-ant-api03-`
3. **Key Length**: Valid keys are 108 characters long
4. **Rotation**: If the key needs to be rotated, update it in the `.env` file only

## Troubleshooting

### Key Not Loading
If the API key isn't loading:
1. Verify `.env` file exists in project root
2. Check that `python-dotenv` is installed: `pip install python-dotenv`
3. Ensure the key in `.env` has no quotes or extra spaces
4. Restart the application after modifying `.env`

### API Connection Errors
If you see connection errors:
- Sandboxed environments may not have internet access
- Verify you have network connectivity to `api.anthropic.com`
- Check that your API key is active and valid

### Import Errors
If you see module import errors:
```bash
pip install -r requirements.txt
```

## Related Files
- `.env` - Local environment variables (git-ignored)
- `.env.example` - Template for environment variables (committed)
- `config.py` - Configuration loader
- `app.py` - Main FastAPI application
- `trinity_orchestrator_unified.py` - AI orchestration engine
- `requirements.txt` - Python dependencies
- `RAILWAY_VARIABLES.env` - Production environment template

## Claude Model Details
The Trinity orchestrator uses:
- **Model**: `claude-sonnet-4-5-20250929`
- **Provider**: Anthropic
- **Use Cases**: Philosophy, ethics, meaning, law, spiritual queries
- **Fallback**: Automatically falls back to other providers if unavailable
