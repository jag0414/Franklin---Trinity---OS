# Franklin Trinity OS - AI Orchestration System

A decentralized AI ecosystem led by Franklin, orchestrating cognitive agents to execute tasks across domains with transparency, truth, and self-learning.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite (SPA)
- **Backend**: Python FastAPI (Railway)
- **Database**: PostgreSQL (Railway)
- **AI Providers**: OpenAI, Anthropic, Google Gemini, Stability AI

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:8080
```

### Environment Setup

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
VITE_API_BASE_URL=https://franklin-trinity-os-roosevelt.up.railway.app
```

## 📦 Deployment

### Frontend Deployment (Vercel)

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

**Quick steps:**
1. Go to [vercel.com](https://vercel.com)
2. Import repository: `jag0414/Franklin---Trinity---OS`
3. Set environment variable: `VITE_API_BASE_URL=https://franklin-trinity-os-roosevelt.up.railway.app`
4. Deploy

### Backend Deployment (Railway)

See [FINAL_DEPLOYMENT_GUIDE.md](./FINAL_DEPLOYMENT_GUIDE.md) for backend deployment instructions.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── config/         # Configuration files
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility libraries
├── public/             # Static assets
└── vercel.json         # Vercel configuration
```

## 📚 Documentation

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Backend Deployment Guide](./FINAL_DEPLOYMENT_GUIDE.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)
- [Quick Reference](./QUICKREF.md)

## 🔧 Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Query
- React Router

## 📄 License

See [LICENSE](./LICENSE) file for details.
