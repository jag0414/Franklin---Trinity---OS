# Production Deployment Guide

This guide provides step-by-step instructions for deploying the Franklin Trinity OS Backend to production.

## Pre-Deployment Checklist

### Required Setup
- [ ] Node.js 18+ installed (or Docker for containerized deployment)
- [ ] MongoDB instance (local, cloud, or containerized)
- [ ] Domain name and SSL certificate (for HTTPS)
- [ ] Environment variables configured
- [ ] Strong JWT secret generated
- [ ] Firewall rules configured
- [ ] Backup strategy in place

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

#### Steps

1. **Clone the repository:**
```bash
git clone https://github.com/jag0414/Franklin---Trinity---OS.git
cd Franklin---Trinity---OS
```

2. **Create production environment file:**
```bash
cp .env.production.template .env.production
```

3. **Generate a strong JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. **Edit `.env.production` with your configuration:**
```env
JWT_SECRET=<paste-your-generated-secret-here>
CORS_ORIGIN=https://yourdomain.com
MONGODB_URI=mongodb://mongodb:27017/franklin-trinity-os
```

5. **Build and start services:**
```bash
# Start all services (MongoDB + Backend)
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend
```

6. **Verify deployment:**
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 1.234,
  "environment": "production",
  "database": {
    "status": "connected",
    "name": "franklin-trinity-os"
  }
}
```

### Option 2: Manual Deployment

#### Prerequisites
- Node.js 18+
- MongoDB 7.0+
- PM2 or systemd for process management

#### Steps

1. **Install dependencies:**
```bash
npm ci --only=production
```

2. **Create production environment file:**
```bash
cp .env.production.template .env
```

3. **Configure environment variables** (edit `.env`):
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/franklin-trinity-os
JWT_SECRET=<your-strong-secret>
CORS_ORIGIN=https://yourdomain.com
```

4. **Start MongoDB:**
```bash
# If using systemd
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

5. **Install PM2 (Process Manager):**
```bash
npm install -g pm2
```

6. **Start the application:**
```bash
pm2 start src/server.js --name franklin-trinity-os
pm2 save
pm2 startup
```

7. **Verify deployment:**
```bash
pm2 status
curl http://localhost:3000/health
```

### Option 3: Cloud Platform Deployment

#### Heroku

1. **Create Heroku app:**
```bash
heroku create franklin-trinity-os
```

2. **Add MongoDB:**
```bash
heroku addons:create mongolab:sandbox
```

3. **Set environment variables:**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
```

4. **Deploy:**
```bash
git push heroku main
```

#### AWS Elastic Beanstalk

1. **Install EB CLI:**
```bash
pip install awsebcli
```

2. **Initialize:**
```bash
eb init -p node.js-18 franklin-trinity-os
```

3. **Create environment:**
```bash
eb create production-env
```

4. **Set environment variables:**
```bash
eb setenv NODE_ENV=production JWT_SECRET=your-secret MONGODB_URI=your-mongodb-uri
```

5. **Deploy:**
```bash
eb deploy
```

## SSL/HTTPS Configuration

### With Nginx Reverse Proxy

1. **Install Nginx and Certbot:**
```bash
sudo apt-get update
sudo apt-get install nginx certbot python3-certbot-nginx
```

2. **Create Nginx configuration** (`/etc/nginx/sites-available/franklin-trinity-os`):
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Enable site and obtain SSL:**
```bash
sudo ln -s /etc/nginx/sites-available/franklin-trinity-os /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d api.yourdomain.com
```

## Post-Deployment

### Monitoring

1. **Check application logs:**
```bash
# Docker
docker-compose logs -f backend

# PM2
pm2 logs franklin-trinity-os

# Systemd
journalctl -u franklin-trinity-os -f
```

2. **Monitor health endpoint:**
```bash
watch -n 5 'curl -s http://localhost:3000/health | jq'
```

### Security Hardening

1. **Firewall Configuration:**
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

2. **Regular Updates:**
```bash
# Update dependencies monthly
npm audit
npm update
```

3. **Monitor logs for suspicious activity:**
```bash
# Set up log monitoring and alerting
pm2 install pm2-logrotate
```

### Backup Strategy

1. **Database Backups:**
```bash
# Daily MongoDB backup
mongodump --uri="mongodb://localhost:27017/franklin-trinity-os" --out=/backup/$(date +%Y%m%d)

# Set up cron job
0 2 * * * /usr/bin/mongodump --uri="mongodb://localhost:27017/franklin-trinity-os" --out=/backup/$(date +\%Y\%m\%d)
```

2. **Application Backups:**
- Keep Git repository up to date
- Back up environment variables securely
- Document configuration changes

## Scaling Considerations

### Horizontal Scaling
- Use a load balancer (nginx, HAProxy, or cloud load balancer)
- Deploy multiple instances of the backend
- Use a centralized MongoDB cluster (MongoDB Atlas or replica set)

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database queries and indexes
- Implement caching (Redis)

## Troubleshooting

### Service won't start
```bash
# Check logs
docker-compose logs backend
pm2 logs franklin-trinity-os

# Verify MongoDB connection
mongo mongodb://localhost:27017/franklin-trinity-os

# Check port availability
sudo netstat -tlnp | grep 3000
```

### Database connection issues
```bash
# Test MongoDB connection
mongo --eval "db.adminCommand('ping')"

# Check MongoDB status
sudo systemctl status mongodb
```

### Performance issues
```bash
# Monitor resource usage
htop
docker stats

# Check application metrics
curl http://localhost:3000/api/system/status
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | development | Environment (production/development) |
| `PORT` | No | 3000 | Server port |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Secret for JWT tokens (must be strong in production) |
| `JWT_EXPIRES_IN` | No | 7d | Token expiration time |
| `CORS_ORIGIN` | Yes | - | Allowed CORS origin (your frontend URL) |
| `LOG_LEVEL` | No | info | Logging level (error, warn, info, debug) |

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review logs for error messages

## Security Notes

**CRITICAL:**
- Never commit `.env` files to version control
- Use strong, unique JWT secrets (64+ random bytes)
- Keep dependencies updated
- Monitor security advisories
- Implement rate limiting (already configured)
- Use HTTPS in production
- Regularly backup your database
- Monitor application logs for suspicious activity
