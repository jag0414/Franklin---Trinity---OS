# Franklin Trinity OS - Sovereign AI Operating System

A decentralized AI ecosystem orchestrating cognitive agents across multiple AI providers (OpenAI, Anthropic, Google, Stability AI).

## 🚀 Quick Start - Get Frontend Live

**Backend is already live!** 🎉

Now deploy your frontend in 5 minutes:

👉 **[Quick Deployment Guide](./DEPLOY_FRONTEND_QUICK.md)** - 5 simple steps to Vercel

📚 **[Full Frontend Deployment Guide](./FRONTEND_DEPLOYMENT.md)** - Complete documentation

## 📋 Architecture

### Backend (Railway) ✅ LIVE
- **URL**: `https://franklin-trinity-os-roosevelt.up.railway.app`
- **Health**: `https://franklin-trinity-os-roosevelt.up.railway.app/health`
- **API Docs**: `https://franklin-trinity-os-roosevelt.up.railway.app/docs`

### Frontend (Vite + React + TypeScript)
- **Local Dev**: `npm run dev` → `http://localhost:5173`
- **Production**: Deploy to Vercel (see guides above)

## 🛠️ Local Development

### Start Both Services
```powershell
.\Start_All.ps1
```

### Start Frontend Only
```powershell
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📖 Documentation

- **[Quick Deploy Guide](./DEPLOY_FRONTEND_QUICK.md)** - 5-minute frontend deployment
- **[Full Frontend Guide](./FRONTEND_DEPLOYMENT.md)** - Complete Vercel deployment
- **[Backend Production Guide](./FINAL_DEPLOYMENT_GUIDE.md)** - Railway backend setup
- **[Production Checklist](./PRODUCTION_CHECKLIST.md)** - Full production checklist

## 🎯 Features

- Multi-AI provider orchestration (OpenAI, Anthropic, Google, Stability)
- Advanced agent coordination and pipelines
- Mock mode for development (no API keys required)
- Real mode for production (with API keys)
- Secure API key handling (backend only)
- React frontend with ShadCN UI components

## 🔐 Security

- ✅ API keys stored securely in Railway (never in frontend)
- ✅ JWT authentication
- ✅ HTTPS enforced
- ✅ CORS properly configured

## 📦 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- ShadCN UI components
- TailwindCSS
- React Router v6

**Backend:**
- FastAPI (Python)
- PostgreSQL
- Multi-AI provider support
- Docker containerized

## 🎉 Deploy Now!

Your backend is ready. Get your frontend live:

**👉 [Start Here: DEPLOY_FRONTEND_QUICK.md](./DEPLOY_FRONTEND_QUICK.md)**
