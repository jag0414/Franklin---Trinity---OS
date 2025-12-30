# Franklin Trinity OS

**End-to-End Sovereign AI Orchestration System**

A FastAPI-powered AI orchestration platform with support for OpenAI, Anthropic, Google Gemini, and Stability AI. Features intelligent pipeline execution, multi-agent workflows, and automatic fallback to mock mode for development.

## 🚀 Quick Start - Railway Deployment

### Prerequisites
- GitHub account
- Railway account (free tier available at [railway.app](https://railway.app))
- API keys (optional, system works in Mock Mode without them)

### 5-Minute Deploy to Railway

1. **Fork or Clone this repository**
   ```bash
   git clone https://github.com/jag0414/Franklin---Trinity---OS.git
   cd Franklin---Trinity---OS
   ```

2. **Connect to Railway**
   - Go to [railway.app](https://railway.app) and sign in
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `Franklin---Trinity---OS` repository
   - Railway will automatically detect the Dockerfile and start building

3. **Add PostgreSQL Database**
   - In Railway dashboard, right-click on canvas → "Create" → "Database" → "PostgreSQL"
   - Wait ~30 seconds for database to initialize

4. **Set Environment Variables**
   Go to your service → "Variables" tab and add:
   ```
   FRANKLIN_DB_URL=${{Postgres.DATABASE_URL}}
   FRANKLIN_JWT_SECRET=your-secret-key-here-change-this
   PORT=8080
   ```

   **Optional** (for real AI, not mock mode):
   ```
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   GOOGLE_API_KEY=AI...
   ```

5. **Verify Deployment**
   ```powershell
   # Edit verify_production.ps1 to use your Railway URL, then run:
   .\verify_production.ps1
   ```

## 📖 Documentation

- **[ANTHROPIC_SETUP.md](ANTHROPIC_SETUP.md)** - Anthropic Claude API configuration guide
- **[PRODUCTION_READY.md](PRODUCTION_READY.md)** - Complete deployment checklist
- **[FINAL_DEPLOYMENT_GUIDE.md](FINAL_DEPLOYMENT_GUIDE.md)** - Step-by-step guide with troubleshooting
- **[RAILWAY_VARIABLES.env](RAILWAY_VARIABLES.env)** - Environment variables template

## 🏃 Local Development

### Backend
```powershell
# Install Python dependencies
pip install -r requirements.txt

# Start backend server
.\Start_Backend.ps1
# Or manually: python -m uvicorn app:app --reload --port 8000
```

### Frontend
```powershell
# Install Node dependencies
npm install

# Start frontend dev server
.\Start_Frontend.ps1
# Or manually: npm run dev
```

### Run Both
```powershell
.\Start_All.ps1
```

### Testing
```powershell
# Smoke test (tests all 4 AI pipelines)
.\smoke_test.ps1

# Mock capabilities demo
.\demo_mock_capabilities.ps1
```

## 🎯 Features

- **Multi-Provider AI**: OpenAI GPT-4, Anthropic Claude, Google Gemini, Stability AI
- **Smart Pipelines**: Pre-configured workflows for content generation, code generation, analysis
- **Mock Mode**: Instant fake responses for development without API keys
- **Real Mode**: Automatic activation when valid API keys are detected
- **Async Task Queue**: Handle long-running AI operations
- **Database**: PostgreSQL with SQLModel ORM
- **Security**: JWT authentication, CORS protection
- **Monitoring**: Prometheus metrics, health checks

## 🏗️ Architecture

```
Franklin Trinity OS
├── Backend (FastAPI)
│   ├── AI Provider Integration (OpenAI, Anthropic, Google, Stability)
│   ├── Pipeline Orchestration
│   ├── Task Queue System
│   └── Mock Mode Fallback
├── Frontend (React + TypeScript + Vite)
│   └── [Optional] Deploy to Vercel/Netlify
└── Database (PostgreSQL on Railway)
```

## 🔐 Environment Variables

See [RAILWAY_VARIABLES.env](RAILWAY_VARIABLES.env) for complete list.

**Required:**
- `PORT=8080`
- `FRANKLIN_DB_URL` - PostgreSQL connection string
- `FRANKLIN_JWT_SECRET` - Secret key for JWT tokens

**Optional (for real AI):**
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_API_KEY`
- `STABILITY_API_KEY`

## 📊 API Endpoints

- `GET /health` - Health check
- `GET /api/ai/pipelines` - List available AI pipelines
- `POST /api/ai/execute` - Execute single AI request
- `POST /api/ai/pipeline` - Run multi-stage pipeline
- `GET /docs` - Interactive API documentation (Swagger UI)

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🆘 Support

- Check [FINAL_DEPLOYMENT_GUIDE.md](FINAL_DEPLOYMENT_GUIDE.md) for troubleshooting
- Review Railway deployment logs
- Test locally with `.\smoke_test.ps1`

---

**Made with ❤️ by the Franklin Trinity team**
