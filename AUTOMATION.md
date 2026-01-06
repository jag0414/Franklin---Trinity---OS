# Franklin Trinity OS - Full Automation Mode

This guide explains how to launch and maintain Franklin Trinity OS in **full automation mode** with complete continuity and self-healing capabilities.

## 🚀 Quick Start

### Automated Launch (Recommended)

```bash
# Make the script executable (first time only)
chmod +x auto-launch.sh

# Start all services with auto-monitoring and restart
./auto-launch.sh start
```

That's it! The system will:
- ✅ Validate your environment
- ✅ Install dependencies automatically
- ✅ Start backend and frontend services
- ✅ Monitor processes and auto-restart if they crash
- ✅ Perform health checks continuously
- ✅ Show real-time status

### Docker Compose (Production)

```bash
# Start with basic services
docker-compose -f docker-compose-full.yml up -d

# Start with PostgreSQL (production database)
docker-compose -f docker-compose-full.yml --profile production up -d

# Start with full monitoring stack (Prometheus + Grafana)
docker-compose -f docker-compose-full.yml --profile monitoring up -d

# Start everything
docker-compose -f docker-compose-full.yml --profile production --profile monitoring up -d
```

## 📋 Features

### 1. Automated Environment Setup
- Validates Python and Node.js installations
- Auto-installs missing dependencies
- Creates `.env` from template if missing
- Sets up required directories

### 2. Health Monitoring
- Continuous health checks for backend and frontend
- Automatic restart on failure
- Port conflict detection and resolution
- Resource monitoring

### 3. Process Management
- Graceful start/stop/restart commands
- PID tracking for all services
- Clean shutdown handling
- Zombie process cleanup

### 4. Logging
- Centralized logging in `./logs/` directory
- Separate logs for backend and frontend
- Automatic log rotation
- Easy log tailing

### 5. Auto-Recovery
- Detects crashed processes
- Restarts failed services automatically
- Health check-based recovery
- Configurable retry logic

## 🎯 Usage

### Starting Services

```bash
# Start all services (default: with monitoring)
./auto-launch.sh start

# Start without auto-restart monitoring
AUTO_RESTART=false ./auto-launch.sh start

# Start on custom ports
BACKEND_PORT=9000 FRONTEND_PORT=9001 ./auto-launch.sh start
```

### Stopping Services

```bash
# Stop all services gracefully
./auto-launch.sh stop
```

### Restarting Services

```bash
# Restart all services
./auto-launch.sh restart
```

### Checking Status

```bash
# Show current status
./auto-launch.sh status
```

### Viewing Logs

```bash
# Tail backend logs
./auto-launch.sh logs backend

# Tail frontend logs
./auto-launch.sh logs frontend

# Or directly
tail -f logs/backend.log
tail -f logs/frontend.log
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file or set these variables:

```bash
# Server Configuration
BACKEND_PORT=8000              # Backend API port
FRONTEND_PORT=8080             # Frontend UI port

# Automation Settings
AUTO_RESTART=true              # Enable auto-restart on failure
MAX_RETRIES=3                  # Maximum restart attempts
HEALTH_CHECK_TIMEOUT=60        # Health check timeout (seconds)

# API Keys (Optional - system works in mock mode without them)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
STABILITY_API_KEY=sk-...
XAI_API_KEY=xai-...

# Database (Optional - defaults to SQLite)
FRANKLIN_DB_URL=sqlite:///franklin.db
# Or for PostgreSQL:
# FRANKLIN_DB_URL=postgresql://user:pass@localhost/franklin

# Security
FRANKLIN_JWT_SECRET=your-secret-key-change-this

# Redis (Optional - for caching and queues)
REDIS_URL=redis://localhost:6379
```

## 🐳 Docker Deployment

### Basic Stack

```bash
docker-compose -f docker-compose-full.yml up -d
```

Services:
- **Backend**: `http://localhost:8000`
- **Frontend**: `http://localhost:8080`
- **Redis**: `localhost:6379`

### Production Stack

```bash
docker-compose -f docker-compose-full.yml --profile production up -d
```

Additional services:
- **PostgreSQL**: Production database
- **Nginx**: Reverse proxy and load balancer

### Full Monitoring Stack

```bash
docker-compose -f docker-compose-full.yml --profile monitoring up -d
```

Additional services:
- **Prometheus**: Metrics collection on `:9090`
- **Grafana**: Dashboards on `:3000` (admin/admin)

### Docker Commands

```bash
# View logs
docker-compose -f docker-compose-full.yml logs -f

# View specific service logs
docker logs -f franklin-backend
docker logs -f franklin-frontend

# Check service status
docker-compose -f docker-compose-full.yml ps

# Restart a service
docker-compose -f docker-compose-full.yml restart backend

# Stop all services
docker-compose -f docker-compose-full.yml down

# Stop and remove volumes (clean slate)
docker-compose -f docker-compose-full.yml down -v
```

## 🔄 Linux System Service (Systemd)

For true continuity with automatic start on boot:

### Installation

```bash
# Copy service file
sudo cp franklin-trinity.service /etc/systemd/system/

# Edit the service file to set correct user and path
sudo nano /etc/systemd/system/franklin-trinity.service

# Update WorkingDirectory to your installation path
# Update User to your username

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable franklin-trinity

# Start service
sudo systemctl start franklin-trinity
```

### Management

```bash
# Check status
sudo systemctl status franklin-trinity

# View logs
sudo journalctl -u franklin-trinity -f

# Restart service
sudo systemctl restart franklin-trinity

# Stop service
sudo systemctl stop franklin-trinity

# Disable auto-start
sudo systemctl disable franklin-trinity
```

## 🖥️ Windows Service

For Windows systems, use NSSM (Non-Sucking Service Manager):

### Installation

```powershell
# Download NSSM from https://nssm.cc/download

# Install service
nssm install FranklinTrinity "C:\Path\To\auto-launch.sh" start

# Configure service
nssm set FranklinTrinity AppDirectory "C:\Path\To\Franklin-Trinity-OS"
nssm set FranklinTrinity AppStdout "C:\Path\To\Franklin-Trinity-OS\logs\service.log"
nssm set FranklinTrinity AppStderr "C:\Path\To\Franklin-Trinity-OS\logs\service-error.log"

# Start service
nssm start FranklinTrinity
```

### Management

```powershell
# Check status
nssm status FranklinTrinity

# Stop service
nssm stop FranklinTrinity

# Restart service
nssm restart FranklinTrinity

# Remove service
nssm remove FranklinTrinity confirm
```

## 🔍 Health Checks

### Backend Health

```bash
# Simple health check
curl http://localhost:8000/health

# Detailed health info
curl http://localhost:8000/health/ai
```

### Frontend Health

```bash
# Check if frontend is running
curl http://localhost:8080
```

### Redis Health

```bash
# Check Redis
redis-cli ping
```

## 🛡️ Production Best Practices

### 1. Security

- Always change default passwords
- Use strong JWT secrets
- Enable HTTPS with SSL certificates
- Configure firewall rules
- Use environment variables for secrets

### 2. Monitoring

- Enable Prometheus and Grafana
- Set up alerts for failures
- Monitor disk space and memory
- Track API response times

### 3. Backups

```bash
# Backup SQLite database
cp franklin.db franklin.db.backup

# Backup PostgreSQL
docker exec franklin-postgres pg_dump -U franklin franklin > backup.sql

# Backup uploaded files
tar -czf uploads-backup.tar.gz uploads/
```

### 4. Updates

```bash
# Pull latest changes
git pull origin main

# Restart services to apply updates
./auto-launch.sh restart

# Or for Docker
docker-compose -f docker-compose-full.yml pull
docker-compose -f docker-compose-full.yml up -d
```

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check logs
./auto-launch.sh logs backend
./auto-launch.sh logs frontend

# Check port conflicts
lsof -i :8000
lsof -i :8080

# Force stop and restart
./auto-launch.sh stop
sleep 5
./auto-launch.sh start
```

### Health Checks Failing

```bash
# Check if backend is actually running
curl -v http://localhost:8000/health

# Check backend logs for errors
tail -f logs/backend.log

# Verify database connection
python -c "from app import engine; engine.connect()"
```

### High Memory Usage

```bash
# Check process memory
ps aux | grep python
ps aux | grep node

# Restart services
./auto-launch.sh restart

# Or limit memory with Docker
docker-compose -f docker-compose-full.yml up -d --scale backend=1
```

### Docker Issues

```bash
# Clean up Docker resources
docker system prune -a

# Remove all containers and start fresh
docker-compose -f docker-compose-full.yml down -v
docker-compose -f docker-compose-full.yml up -d --build

# Check container logs
docker logs franklin-backend
docker logs franklin-frontend
```

## 📊 Monitoring Dashboard

Once Grafana is running (`:3000`), import dashboards:

1. Login: `admin / admin`
2. Add Prometheus data source: `http://prometheus:9090`
3. Import dashboard ID: `1860` (Node Exporter Full)
4. Create custom dashboards for Franklin Trinity metrics

## 🎓 Advanced Usage

### Custom Health Check Intervals

Edit `auto-launch.sh`:
```bash
HEALTH_CHECK_TIMEOUT=120  # 2 minutes
```

### Multiple Instances

Run multiple instances on different ports:
```bash
# Instance 1
BACKEND_PORT=8000 FRONTEND_PORT=8080 ./auto-launch.sh start

# Instance 2 (in another terminal)
BACKEND_PORT=8001 FRONTEND_PORT=8081 ./auto-launch.sh start
```

### Load Balancing

Use nginx to load balance multiple instances:
```nginx
upstream backend {
    server localhost:8000;
    server localhost:8001;
    server localhost:8002;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

## 📞 Support

- GitHub Issues: https://github.com/jag0414/Franklin---Trinity---OS/issues
- Documentation: See `README.md`, `QUICKSTART.md`
- Health Status: `./auto-launch.sh status`

## ✅ Verification Checklist

After deployment, verify:

- [ ] Backend accessible at `http://localhost:8000`
- [ ] Frontend accessible at `http://localhost:8080`
- [ ] API docs at `http://localhost:8000/docs`
- [ ] Health check passes: `curl http://localhost:8000/health`
- [ ] Services auto-restart on failure
- [ ] Logs are being written to `./logs/`
- [ ] Environment variables loaded correctly
- [ ] All API keys configured (or mock mode working)

## 🎉 Full Continuity Achieved!

Your Franklin Trinity OS is now running in **full automation mode** with:

✅ **Automatic startup**
✅ **Health monitoring**
✅ **Auto-recovery on failure**
✅ **Centralized logging**
✅ **Easy management commands**
✅ **Docker support**
✅ **System service integration**
✅ **Production-ready configuration**

The system will maintain continuity and automatically recover from failures! 🚀
