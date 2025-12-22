# Franklin OS - Trinity AI Intelligence Console

A powerful, sovereign AI operating system with autonomous agent orchestration, multi-provider AI integration, and voice-controlled interfaces.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python 3** (3.8 or higher)
- **npm** or **yarn**

### Installation & Running

1. **Clone the repository:**
```bash
git clone https://github.com/jag0414/Franklin---Trinity---OS.git
cd Franklin---Trinity---OS
```

2. **Start the system (easiest method):**
```bash
chmod +x start.sh
./start.sh
```

This will:
- Install all dependencies automatically
- Start the backend API on port 8090
- Start the frontend dev server on port 8080
- Display status and logs

3. **Access the application:**
- **Frontend UI:** http://localhost:8080
- **Backend API:** http://localhost:8090
- **API Documentation:** http://localhost:8090/docs

### Manual Setup (Alternative)

If you prefer manual control:

**Backend:**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start backend server
python -m uvicorn app:app --host 0.0.0.0 --port 8090 --reload
```

**Frontend:**
```bash
# Install Node dependencies
npm install

# Start development server
npm run dev

# Or build for production
npm run build
npm run preview
```

## 🎯 Features

### 🤖 AI Command Center
- **Multi-Provider Support:** OpenAI, Anthropic (Claude), Google (Gemini)
- **Intelligent Routing:** Auto-select the best AI provider for your task
- **Agent Orchestration:** Specialized agents for research, coding, analysis, writing, design, and strategy
- **Voice Control:** Hands-free operation with voice commands and responses
- **Pipeline Workflows:** Chain multiple agents for complex multi-step tasks

### 🎤 Voice Assistant
- **Speech Recognition:** Natural language voice input
- **Text-to-Speech:** AI responses read aloud
- **Voice Commands:**
  - "Execute [your prompt]" - Run AI commands
  - "Use researcher agent" - Select specialized agents
  - "Run pipeline" - Execute multi-step workflows
  - "Stop" / "Clear" - Control commands
  - "Read results" - Hear the latest response

### 🔐 Sovereignty Stack
- **Decentralized Infrastructure:** Run on bare metal or decentralized cloud
- **Zero Trust Security:** End-to-end encryption
- **Local-First:** No vendor lock-in
- **Mesh Networks:** Distributed communication

### 📊 Project Management (BidNova)
- **Bid Requests:** Create and manage project bids
- **Contracts:** Generate and track contracts
- **Audit Trail:** Complete transaction history
- **User Roles:** Client, Contractor, Admin

## 🛠️ Configuration

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
# AI Provider API Keys (optional - runs in demo mode without them)
VITE_OPENAI_API_KEY=your_openai_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_key_here
VITE_GOOGLE_API_KEY=your_google_key_here

# Backend Configuration
PORT=8090

# Supabase (optional - for cloud AI orchestration)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

**Note:** The system works in demo mode without API keys, providing mock AI responses for testing.

## 📦 Building for Production

```bash
# Build frontend
npm run build

# The dist/ folder contains production-ready files
# Serve with any static file server or integrate with your backend
```

## 🧪 Testing

### Linting
```bash
npm run lint
```

### Manual Testing
1. Open the application at http://localhost:8080
2. Try voice commands (Chrome/Edge recommended for best support)
3. Test the AI Command Center with sample prompts
4. Navigate through all sections to ensure proper rendering

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
- **Framework:** React 18 with TypeScript
- **UI Components:** Radix UI + Tailwind CSS
- **State Management:** React Query + Context API
- **Routing:** React Router v6
- **Build Tool:** Vite for fast development

### Backend (FastAPI + Python)
- **Framework:** FastAPI for high-performance APIs
- **Database:** SQLite with SQLModel ORM
- **Authentication:** JWT tokens
- **API Documentation:** Auto-generated Swagger/OpenAPI docs

### AI Integration
- **Primary:** Supabase Edge Functions for AI orchestration
- **Fallback:** Mock responses for demo/testing
- **Providers:** OpenAI, Anthropic, Google Gemini

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- Returns JWT token for subsequent requests

### Bid Requests
- `GET /requests` - List open bid requests
- `POST /requests` - Create new bid request (clients only)

### Bids
- `POST /bids` - Submit a bid (contractors only)
- `POST /bids/{bid_id}/accept` - Accept bid and create contract

### Health & Monitoring
- `GET /health` - System health check
- `GET /admin/audit` - View audit trail

## 🎨 UI Sections

1. **Hero Section** - System overview and status
2. **AI Command Center** - Interactive AI interface with voice control
3. **Agent Orchestrator** - Manage and deploy AI agents
4. **WebSocket Manager** - Real-time communication
5. **Task Flow Diagram** - Visualize workflows
6. **Sovereignty Stack** - Infrastructure overview
7. **Security Fortress** - Security features
8. **Integration Hub** - Third-party integrations
9. **Agent Academy** - Agent training and management
10. **Multi-Agent Collaboration** - Team-based AI workflows
11. **Deployment Wizard** - Deployment tools

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Change the backend port
python -m uvicorn app:app --host 0.0.0.0 --port 8091

# Change frontend port
npm run dev -- --port 8081
```

### Voice Features Not Working
- Use Chrome, Edge, or Safari (Firefox has limited support)
- Ensure microphone permissions are granted
- Check browser console for specific errors

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Backend Not Starting
```bash
# Reinstall Python dependencies
pip install --upgrade -r requirements.txt

# Check Python version
python --version  # Should be 3.8+
```

## 📚 Documentation

- **API Docs:** http://localhost:8090/docs (when running)
- **FIXES_APPLIED.md** - System validation and fixes
- **ENHANCEMENTS.md** - Production-grade features
- **ENGINE_MESH_PLAN.md** - Architecture details

## 🤝 Contributing

This is a sovereign AI platform designed for independence and extensibility. Contributions welcome!

## 📄 License

See LICENSE file for details.

## 🌟 Key Features Summary

- ✅ **Full-Stack Application** - React frontend + FastAPI backend
- ✅ **Multi-Provider AI** - OpenAI, Claude, Gemini support
- ✅ **Voice Interface** - Hands-free operation
- ✅ **Agent Orchestration** - Specialized AI agents
- ✅ **Project Management** - Complete bid/contract system
- ✅ **Modern UI** - Beautiful, responsive design
- ✅ **Production Ready** - Docker support, monitoring, logging
- ✅ **Demo Mode** - Works without API keys for testing

## 🚀 Get Started Now

```bash
./start.sh
```

Then open http://localhost:8080 and start exploring!

---

**Built for sovereignty. No dependencies. No compromises.**
