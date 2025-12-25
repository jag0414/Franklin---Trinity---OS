# Franklin Trinity OS - AI Orchestration System

A sophisticated decentralized AI ecosystem that orchestrates cognitive agents to execute tasks across domains with transparency, truth, and self-learning capabilities.

## 🚀 Features

- **Multi-Provider AI Integration**: OpenAI, Anthropic, Google Gemini, and Stability AI
- **Agent Orchestration**: Intelligent task distribution across AI providers
- **React + TypeScript Frontend**: Modern UI built with Vite, shadcn/ui, and Tailwind CSS
- **Python Backend**: FastAPI-based backend with multi-engine support
- **Real-time Chat**: WebSocket streaming support for AI interactions
- **Document Analysis**: Support for PDF, DOCX, images, and spreadsheets

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast builds
- Tailwind CSS + shadcn/ui components
- React Router for navigation
- TanStack Query for state management

### Backend
- Python FastAPI
- PostgreSQL database
- Redis for caching
- Multi-AI provider orchestration

## 📦 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080` to see the application.

### Build for Production

```bash
# Build the frontend
npm run build

# Preview the build
npm preview
```

## 🌐 Deployment

### Frontend (Vercel)

Deploy the React frontend to Vercel in 4 simple steps:

1. Go to [vercel.com](https://vercel.com)
2. Import repository: `jag0414/Franklin---Trinity---OS`
3. Set environment variable: `VITE_API_BASE_URL=https://franklin-trinity-os-roosevelt.up.railway.app`
4. Click Deploy

📖 **Detailed guide**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### Backend (Railway)

Backend is deployed at: `https://franklin-trinity-os-roosevelt.up.railway.app`

📖 **Detailed guide**: See [FINAL_DEPLOYMENT_GUIDE.md](./FINAL_DEPLOYMENT_GUIDE.md)

## 🔑 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000

# Optional: AI Provider API Keys (for direct API calls)
VITE_OPENAI_API_KEY=your-key-here
VITE_ANTHROPIC_API_KEY=your-key-here
VITE_GOOGLE_API_KEY=your-key-here
VITE_STABILITY_API_KEY=your-key-here
```

## 📚 Documentation

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md) - Deploy frontend to Vercel
- [Final Deployment Guide](./FINAL_DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Quick Start Guide](./QUICKSTART.md) - Get started with local development

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build project
npm run build
```

## 📄 License

See [LICENSE](./LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
