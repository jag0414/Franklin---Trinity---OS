# Franklin OS • Trinity • BidNova

A unified AI-powered operating system combining Trinity Intelligence Cloud and BidNova - an autonomous bidding and contract management platform.

## 🚀 Features

- **React + TypeScript Frontend** - Modern UI built with Vite, React, and shadcn/ui
- **FastAPI Backend** - Python-based backend with JWT authentication
- **AI Integration** - Gemini AI for text, image, audio, and video generation
- **Bidding System** - Complete bidding and contract management workflow
- **Microservices Architecture** - Orchestration with Redis and MinIO support
- **Docker Support** - Containerized deployment ready

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose (optional, for containerized deployment)

## 🛠️ Local Development Setup

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:8080`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   (Note: Create a requirements.txt if missing with: fastapi, uvicorn, sqlmodel, python-jwt, etc.)

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update configuration values (database URLs, API keys, etc.)

3. **Run the backend:**
   ```bash
   python -m uvicorn app:app --host 0.0.0.0 --port 8090 --reload
   ```
   The API will be available at `http://localhost:8090`

## 🐳 Docker Deployment

### Using Docker Compose

1. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Build and start services:**
   ```bash
   docker-compose up -d
   ```

3. **Scale workers (optional):**
   ```bash
   docker-compose up --scale worker=5 -d
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

5. **Stop services:**
   ```bash
   docker-compose down
   ```

## 🌐 Deployment Options

### Option 1: Vercel (Frontend)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

### Option 2: Netlify (Frontend)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to Netlify via:
   - Drag and drop to netlify.com/drop
   - Connect your Git repository
   - Use Netlify CLI: `netlify deploy --prod`

### Option 3: Railway/Render (Full Stack)

1. **Connect your GitHub repository**
2. **Configure build commands:**
   - Frontend: `npm install && npm run build`
   - Backend: `pip install -r requirements.txt`
3. **Set environment variables** from `.env.example`
4. **Deploy**

### Option 4: DigitalOcean/AWS (Docker)

1. **Set up a VPS/EC2 instance**
2. **Install Docker and Docker Compose**
3. **Clone the repository:**
   ```bash
   git clone https://github.com/jag0414/Franklin---Trinity---OS.git
   cd Franklin---Trinity---OS
   ```
4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```
5. **Deploy:**
   ```bash
   docker-compose up -d
   ```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example`):

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation
- `CORS_ORIGIN` - Allowed CORS origins

### Database

The application uses:
- SQLite for development (`franklin.db`)
- MongoDB for production (configure via `MONGODB_URI`)

## 📁 Project Structure

```
Franklin---Trinity---OS/
├── src/                 # React frontend source
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utilities
├── backend/            # Backend services
├── routers/            # API routers
├── middleware/         # Middleware functions
├── public/             # Static assets
├── app.py              # Main FastAPI application
├── docker-compose.yml  # Docker compose configuration
├── Dockerfile          # Docker container definition
└── package.json        # Frontend dependencies
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Run frontend tests (if configured)
npm test

# Run backend tests
python -m pytest tests/
```

## 📝 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8090/docs`
- ReDoc: `http://localhost:8090/redoc`

## 🔐 Security Notes

- Change default secrets in `.env` before deploying to production
- **IMPORTANT:** Move the `SECRET` variable from `app.py` to an environment variable
- Set strong `JWT_SECRET` in environment variables
- Configure proper CORS origins
- Use environment-specific configurations
- Never commit secrets to version control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions, please open an issue on GitHub.

## 🚢 Quick Deploy Commands

**Local Development:**
```bash
# Terminal 1 - Frontend
npm install && npm run dev

# Terminal 2 - Backend
pip install -r requirements.txt && python -m uvicorn app:app --reload
```

**Production Build:**
```bash
npm run build
# Serve dist/ folder with your preferred static hosting
# Run backend with: uvicorn app:app --host 0.0.0.0 --port 8090
```

---

Built with ❤️ using React, TypeScript, Vite, FastAPI, and AI
