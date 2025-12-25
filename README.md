# Franklin OS - Trinity Operating System

A sovereign AI operating system with autonomous agent orchestration, featuring decentralized AI ecosystem capabilities.

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Python 3.8+ (for backend)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jag0414/Franklin---Trinity---OS.git
cd Franklin---Trinity---OS
```

2. Install frontend dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your configuration
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

### Running the Backend

The Python FastAPI backend provides the API services:

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
# Or using uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at `http://localhost:8000`

Verify it's running:
```bash
curl http://localhost:8000/health
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run clean` - Remove build artifacts and cache
- `npm run clean:all` - Full clean including node_modules

## Project Structure

```
Franklin---Trinity---OS/
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── services/        # API and service layer
│   ├── contexts/        # React contexts
│   └── hooks/           # Custom React hooks
├── app.py               # Python FastAPI backend
├── frontend/            # Additional frontend resources
├── public/              # Static assets
└── docs/                # Documentation
```

## Features

- 🤖 **AI Agent Orchestration** - Coordinate multiple AI agents
- 🔐 **Security Fortress** - Built-in security features
- 🌐 **Sovereignty Stack** - Decentralized architecture
- 🎨 **Modern UI** - Built with React, TypeScript, and Tailwind CSS
- ⚡ **Fast Development** - Vite-powered development experience

## Troubleshooting

Encountering issues? Check the [Troubleshooting Guide](TROUBLESHOOTING.md) for common problems and solutions.

Common issues:
- **Connection errors to localhost:5000** - See troubleshooting guide
- **Backend not responding** - Ensure Python backend is running
- **Build failures** - Try running `npm run clean` and reinstalling

## Configuration

### Environment Variables

Key environment variables in `.env`:

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8000)
- `VITE_PORT` - Frontend dev server port (default: 8080)
- `VITE_OPENAI_API_KEY` - OpenAI API key (optional)
- `VITE_ANTHROPIC_API_KEY` - Anthropic API key (optional)
- `VITE_GOOGLE_API_KEY` - Google AI API key (optional)

See `.env.example` for all available options.

## Development

### Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Query

**Backend:**
- Python 3.8+
- FastAPI
- SQLModel
- JWT Authentication

### Code Style

- ESLint for JavaScript/TypeScript linting
- Prettier for code formatting (if configured)
- Follow existing code patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

See LICENSE file for details.

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/jag0414/Franklin---Trinity---OS/issues)
- 💬 [Discussions](https://github.com/jag0414/Franklin---Trinity---OS/discussions)

---

Built with ❤️ by the Franklin OS Team
