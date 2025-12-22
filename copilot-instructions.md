# FranklinOS - AI Agent Instructions

## Project Overview
**Production-ready multi-provider AI orchestration platform** built with FastAPI and React. Routes AI requests to OpenAI, Anthropic, Google, xAI with intelligent provider selection, automatic fallback, cost tracking, and authentication.

## Architecture

### Backend (FastAPI - Port 8000)
**Primary:** [franklin_backend/](franklin_backend/) - Full production system
- **Authentication**: JWT tokens + API keys ([core/security.py](franklin_backend/core/security.py))
- **Orchestrator**: [trinity_orchestrator_unified.py](franklin_backend/orchestrator/trinity_orchestrator_unified.py) - Intelligent routing, fallback, caching
- **Usage Tracking**: [core/usage_tracker.py](franklin_backend/core/usage_tracker.py) - Cost analytics, billing
- **Billing Management**: [routers/billing_router_minimal.py](franklin_backend/routers/billing_router_minimal.py) - Consolidated payment processing and provider management
- **Database**: SQLAlchemy models in [core/database.py](franklin_backend/core/database.py)
- **Pipeline System**: [pipeline_registry.py](franklin_backend/pipeline_registry.py) + [workers/](franklin_backend/workers/) - Advanced AI analysis pipelines
- **Ultimate Executor**: [ultimate_executor.py](franklin_backend/ultimate_executor.py) - WebSocket-based execution engine
- **Dashboard**: [routers/dashboard.py](franklin_backend/routers/dashboard.py) - Real-time analytics and reporting
- **Routers**: `/auth`, `/orchestrator`, `/usage`, `/billing`, `/agent`, `/pipeline`, `/memory`, `/job`, `/model`, `/dashboard`, `/api` (ultimate executor)

**Legacy:** [backend_unified/](backend_unified/) - Simple proxy (not actively maintained)

### Frontend (React + Vite - Port 8080)
- **Entry**: [src/App.tsx](src/App.tsx) → [src/pages/Index.tsx](src/pages/Index.tsx)
- **UI**: shadcn/ui + TailwindCSS
- **Services**: [src/services/aiOrchestrator.ts](src/services/aiOrchestrator.ts) - Frontend AI coordination
- **State**: React Context ([src/contexts/AppContext.tsx](src/contexts/AppContext.tsx)) + TanStack Query

## Development Workflows

### Starting the Application

**Option 1: PowerShell Scripts (Recommended for Windows)**
```powershell
.\Start_Backend.ps1   # Port 8000
.\Start_Frontend.ps1  # Port 8080
```

**Option 2: Docker (Production-like)**
```bash
docker-compose up -d
# Services: API (8000), Frontend (8080), PostgreSQL, Redis
```

**Option 3: Manual**
```bash
# Backend
cd franklin_backend
python main.py

# Frontend (new terminal)
npm run dev
```

### Configuration Setup
1. Copy `franklin_backend/.env.example` to `franklin_backend/.env`
2. Fill in API keys for desired providers
3. Configure database, Redis (optional), secrets

### Adding New AI Providers
1. Add config to `ProviderConfig.PROVIDERS` in [trinity_orchestrator_unified.py](franklin_backend/orchestrator/trinity_orchestrator_unified.py)
2. Implement `_call_<provider>()` method (follow `_call_openai` pattern)
3. Add API key to config.py `Settings` class
4. Add to `.env.example` and documentation

## Critical Patterns

### Authentication Flow
```python
# All /orchestrator and /usage endpoints require auth
# Header: Authorization: Bearer <jwt_token>

# Create user -> Login -> Get token -> Use token or create API key
POST /auth/register -> POST /auth/login -> POST /orchestrator/run
```

### Orchestrator Usage
```python
# In routers, always:
1. Validate auth: current_user = Depends(get_current_user)
2. Check rate limits: check_rate_limit(user_id)
3. Call orchestrator: result = await orchestrator.run(...)
4. Log usage: UsageTracker.log_usage(db, user_id, ...)
```

### Provider Selection Logic
- Auto-selects by priority (OpenAI > Anthropic > Google > Grok)
- Falls back on failure if `enable_fallback=True`
- Checks provider health before routing
- Caches responses to reduce costs

### Database Models
- `User`: Auth accounts
- `APIKey`: Programmatic access tokens
- `UsageLog`: Per-request cost/token tracking
- `Provider`: Provider health/config
- `OrchestrationJob`: Multi-step job tracking
- `CachedResponse`: Response caching

## Configuration (franklin_backend/config.py)

Uses `pydantic-settings` `BaseSettings` with `.env` loading:
```python
from config import settings

settings.OPENAI_API_KEY       # Provider API keys
settings.DATABASE_URL         # PostgreSQL/SQLite
settings.REDIS_URL            # Cache (optional)
settings.JWT_SECRET_KEY       # Token signing
settings.RATE_LIMIT_PER_MINUTE # Rate limits
```

## Security Features
- Password hashing with bcrypt
- JWT tokens (access + refresh)
- API key generation (`fos_` prefix, SHA256 hashing)
- Rate limiting per user
- CORS configuration
- Security headers middleware
- SQL injection prevention (SQLAlchemy ORM)

## Cost Tracking
Every orchestrator call logs:
- Provider used
- Model used
- Input/output tokens
- Cost in USD (calculated per provider)
- Response time
- Success/failure

Access via `/usage/stats`, `/usage/billing/summary`, `/usage/billing/invoice`

## Logging
- Structured JSON logging in production
- Request ID on all requests (`X-Request-ID` header)
- Sentry integration for errors (if configured)
- Logs stored in `logs/` directory

## Deployment

### Docker Compose (Recommended)
```bash
# Edit .env files
docker-compose up -d
# Includes: API, Frontend, PostgreSQL, Redis, Nginx
```

### Manual Production
```bash
# Install dependencies
pip install -r franklin_backend/requirements.txt

# Run with workers
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Testing
- Backend tests: `pytest franklin_backend/tests/`
- Frontend tests: `npm test`
- Test files: `*.test.{ts,tsx,py}`

## API Endpoints

### Core Orchestration
- `POST /orchestrator/run` - Execute AI request (requires auth)
- `GET /orchestrator/providers` - List available providers
- `GET /orchestrator/health` - Provider health status

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Get JWT tokens
- `POST /auth/api-keys` - Generate API key
- `GET /auth/me` - Current user info

### Usage & Billing
- `GET /usage/stats` - Usage statistics
- `GET /usage/daily` - Daily breakdown
- `GET /usage/billing/summary` - Billing summary
- `GET /usage/billing/invoice` - Generate invoice
- `GET /billing/overview` - Billing overview for all providers
- `GET /billing/usage/{period}` - Usage stats for period (7d, 30d, 90d)
- `POST /billing/payment` - Process payment
- `GET /billing/settings/{provider}` - Get provider billing settings
- `PUT /billing/settings/{provider}` - Update provider settings
- `GET /billing/alerts` - Billing alerts and notifications
- `POST /billing/alerts/{alert_id}/resolve` - Resolve alert
- `GET /billing/payments` - Payment history

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for full details.

## Common Tasks

### Add New Route
```python
# 1. Create router in franklin_backend/routers/
router = APIRouter(prefix="/myroute", tags=["MyTag"])

@router.get("/endpoint")
async def my_endpoint(current_user: dict = Depends(get_current_user)):
    return {"data": "value"}

# 2. Register in main.py
from routers.myroute_router import router as myroute_router
app.include_router(myroute_router)
```

### Add Database Model
```python
# 1. Add to franklin_backend/core/database.py
class MyModel(Base):
    __tablename__ = "my_table"
    id = Column(String, primary_key=True)
    # ... fields

# 2. Restart app (tables auto-create on startup)
```

### Add Frontend Component
```typescript
// src/components/MyComponent.tsx
import { Button } from "@/components/ui/button"

export const MyComponent = () => {
  return <Button>Click Me</Button>
}
```

## Important Files
- [franklin_backend/main.py](franklin_backend/main.py) - App initialization, middleware, routers
- [franklin_backend/config.py](franklin_backend/config.py) - Environment configuration
- [franklin_backend/orchestrator/trinity_orchestrator_unified.py](franklin_backend/orchestrator/trinity_orchestrator_unified.py) - Core orchestration
- [franklin_backend/core/security.py](franklin_backend/core/security.py) - Auth logic
- [franklin_backend/core/usage_tracker.py](franklin_backend/core/usage_tracker.py) - Usage tracking logic
- [franklin_backend/routers/billing_router_minimal.py](franklin_backend/routers/billing_router_minimal.py) - Billing and payment management
- [src/services/billingService.ts](src/services/billingService.ts) - Frontend billing service
- [src/components/BillingDashboard.tsx](src/components/BillingDashboard.tsx) - Billing dashboard component
- [README.md](README.md) - Main documentation
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference

## Nested Projects Warning
Ignore `TrinityAI/`, `GrokAEC-Elite/`, `Trinity ai consol/` - these are legacy/separate projects. Focus on root-level files.

## Key Conventions
- **Async everywhere**: All orchestrator/provider calls use `async/await`
- **Dependency injection**: Use FastAPI `Depends()` for auth, DB sessions
- **Type hints**: Use Pydantic models for request/response validation
- **Error handling**: Return `{"success": bool, "error": str}` pattern
- **Logging**: Use `logger.info/error` with structured data
- **Import alias**: Frontend uses `@/` for `src/`
