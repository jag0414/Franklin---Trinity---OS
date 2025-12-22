# 🚀 Deployment Guide - Franklin OS

This guide provides step-by-step instructions for deploying Franklin OS to various platforms.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Platform-Specific Guides](#platform-specific-guides)
   - [Vercel (Frontend)](#vercel-deployment)
   - [Netlify (Frontend)](#netlify-deployment)
   - [Railway (Full Stack)](#railway-deployment)
   - [Render (Full Stack)](#render-deployment)
   - [DigitalOcean (Docker)](#digitalocean-deployment)
   - [AWS (Docker)](#aws-deployment)
3. [Environment Configuration](#environment-configuration)
4. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Python 3.11+ installed (for backend)
- [ ] Git installed
- [ ] Account on deployment platform (Vercel/Netlify/Railway/etc.)

### Build Test (Local)

Before deploying, ensure the project builds successfully:

```bash
# Test frontend build
npm install
npm run build

# Test backend (optional)
pip install -r requirements.txt
python -m uvicorn app:app --host 0.0.0.0 --port 8090
```

---

## Platform-Specific Guides

### Vercel Deployment

**Best for:** Frontend-only or JAMstack deployments

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Or via GitHub:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Configure:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click "Deploy"

**Environment Variables:**
Add in Vercel dashboard under Settings → Environment Variables:
- `VITE_API_URL` - Your backend API URL

---

### Netlify Deployment

**Best for:** Frontend static sites

#### Method 1: Drag and Drop

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [netlify.com/drop](https://app.netlify.com/drop)

3. Drag the `dist` folder to deploy

#### Method 2: GitHub Integration

1. Go to [netlify.com](https://www.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

#### Method 3: Netlify CLI

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
npm run build
netlify deploy --prod --dir=dist
```

**Custom Domain:**
- Go to Site settings → Domain management
- Add your custom domain
- Configure DNS records as instructed

---

### Railway Deployment

**Best for:** Full-stack applications (Frontend + Backend)

#### Deploy Frontend

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Name: `franklin-os-frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx vite preview --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `NODE_ENV=production`
   - `VITE_API_URL` (your backend URL)
6. Deploy

#### Deploy Backend

1. Click "New Service" in the same project
2. Configure:
   - Name: `franklin-os-backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
3. Add environment variables from `.env.example`
4. Deploy

---

### Render Deployment

**Best for:** Full-stack with database

#### Deploy Frontend

1. Go to [render.com](https://render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - Name: `franklin-os-frontend`
   - Branch: `main`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
5. Add environment variables
6. Click "Create Static Site"

#### Deploy Backend

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - Name: `franklin-os-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Add environment variables
5. Click "Create Web Service"

---

### DigitalOcean Deployment

**Best for:** Full control with Docker

#### 1. Create Droplet

```bash
# Create a Droplet with Docker pre-installed
# Or install Docker manually:
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

#### 2. Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 3. Clone Repository

```bash
git clone https://github.com/jag0414/Franklin---Trinity---OS.git
cd Franklin---Trinity---OS
```

#### 4. Configure Environment

```bash
cp .env.example .env
nano .env  # Edit with production values
```

#### 5. Deploy

```bash
docker-compose up -d
```

#### 6. Set Up Nginx (Optional)

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/franklin-os
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8090;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/franklin-os /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### AWS Deployment

**Best for:** Enterprise-grade scalability

#### Option 1: EC2 + Docker

1. **Launch EC2 Instance:**
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t2.medium or larger
   - Security Group: Allow ports 22, 80, 443

2. **Connect and Install Docker:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   sudo apt update
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker ubuntu
   ```

3. **Deploy Application:**
   ```bash
   git clone https://github.com/jag0414/Franklin---Trinity---OS.git
   cd Franklin---Trinity---OS
   cp .env.example .env
   # Edit .env with production values
   docker-compose up -d
   ```

#### Option 2: AWS Elastic Beanstalk

1. **Install EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Initialize:**
   ```bash
   eb init -p docker franklin-os
   ```

3. **Create Environment:**
   ```bash
   eb create franklin-os-prod
   ```

4. **Deploy:**
   ```bash
   eb deploy
   ```

#### Option 3: AWS ECS (Fargate)

Use the provided `docker-compose.yml` with ECS Compose:
```bash
docker compose --file docker-compose.yml --project-name franklin-os up
```

---

## Environment Configuration

### Required Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://your-mongodb-url/franklin-trinity-os
DB_NAME=franklin-trinity-os

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Logging
LOG_LEVEL=info

# Backend API (for frontend)
VITE_API_URL=https://your-backend-api.com
```

### Security Checklist

- [ ] Move `SECRET` from `app.py` to environment variables
- [ ] Set strong `JWT_SECRET` in `.env`
- [ ] Configure proper `CORS_ORIGIN`
- [ ] Use HTTPS in production
- [ ] Keep `.env` files out of version control
- [ ] Use environment-specific configurations
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

---

## Troubleshooting

### Build Fails

**Problem:** `Cannot find module 'vite'`
```bash
# Solution:
npm install
```

**Problem:** `Could not resolve entry module "index.html"`
```bash
# Solution: Ensure index.html exists in root
# This should already be fixed in the repository
```

### Deployment Issues

**Problem:** 404 errors on page refresh (SPA)
```bash
# Solution: Configure your hosting for SPA routing
# For Netlify, create _redirects file:
echo "/*    /index.html   200" > dist/_redirects
```

**Problem:** CORS errors
```bash
# Solution: Update CORS_ORIGIN in backend .env
# Ensure frontend and backend URLs are correctly configured
```

**Problem:** Database connection fails
```bash
# Solution: Verify MongoDB URI is correct
# For Railway/Render, add MongoDB addon
```

### Docker Issues

**Problem:** Container won't start
```bash
# Check logs:
docker-compose logs -f

# Restart services:
docker-compose restart

# Rebuild:
docker-compose up --build -d
```

---

## Post-Deployment

### 1. Verify Deployment

- [ ] Frontend loads correctly
- [ ] Backend API responds (check /health endpoint)
- [ ] Authentication works
- [ ] Database connections are stable
- [ ] All features are functional

### 2. Set Up Monitoring

- Configure error tracking (Sentry, etc.)
- Set up uptime monitoring
- Enable application logs
- Configure alerts

### 3. Performance Optimization

- Enable CDN for static assets
- Configure caching headers
- Optimize images and assets
- Enable compression

### 4. Backup Strategy

- Set up automated database backups
- Configure backup retention policy
- Test restore procedures

---

## Continuous Deployment

### GitHub Actions (Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

---

## Support

For deployment issues:
1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Open an issue on GitHub
4. Check application logs

---

**Last Updated:** December 2024
