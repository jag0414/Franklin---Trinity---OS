# Franklin Trinity OS - Full Automation Mode Quick Reference

## 🚀 One-Command Launch

```bash
./auto-launch.sh start
```

This single command:
- ✅ Validates environment (Python, Node.js)
- ✅ Installs dependencies automatically
- ✅ Starts backend on port 8000
- ✅ Starts frontend on port 8080
- ✅ Monitors services and auto-restarts on failure
- ✅ Provides health checks
- ✅ Logs everything to `./logs/`

## 📊 Quick Commands

```bash
# Check system status
./auto-launch.sh status

# Stop all services
./auto-launch.sh stop

# Restart all services
./auto-launch.sh restart

# View live logs
./auto-launch.sh logs backend   # Backend logs
./auto-launch.sh logs frontend  # Frontend logs

# Validate automation setup
python3 validate-automation.py
```

## 🐳 Docker Alternative

```bash
# Start with full automation
docker-compose -f docker-compose-full.yml up -d

# Check status
docker-compose -f docker-compose-full.yml ps

# View logs
docker-compose -f docker-compose-full.yml logs -f

# Stop
docker-compose -f docker-compose-full.yml down
```

## 🎯 Key Features

### Auto-Recovery
Services automatically restart if they crash or become unhealthy.

### Health Monitoring
Continuous health checks ensure services are responding correctly.

### Centralized Logging
All logs in one place: `./logs/backend.log` and `./logs/frontend.log`

### Easy Management
Simple commands for start/stop/restart/status operations.

### Production Ready
Includes systemd service file for Linux servers.

## 🔧 Configuration

Create `.env` file:
```bash
cp .env.example .env
```

Set API keys (optional - works without them in mock mode):
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
```

## 📖 Full Documentation

See [AUTOMATION.md](AUTOMATION.md) for complete guide including:
- System service setup
- Windows service configuration
- Docker production deployment
- Monitoring with Prometheus & Grafana
- Troubleshooting guide
- Advanced configuration options

## ✅ Quick Validation

Before launching, validate your setup:

```bash
python3 validate-automation.py
```

This checks:
- Required tools (Python, Node.js, Docker)
- File permissions
- Dependencies
- Configuration files
- Directory structure

## 🎉 Full Continuity Achieved!

With full automation mode:
- ✅ Automatic startup
- ✅ Self-healing on failure
- ✅ Health monitoring
- ✅ Centralized logging
- ✅ Easy management
- ✅ Docker support
- ✅ System service integration

Your Franklin Trinity OS maintains full continuity and automatically recovers from failures! 🚀
