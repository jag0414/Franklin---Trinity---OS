# Franklin OS Troubleshooting Guide

## Common Issues and Solutions

### Connection Errors to localhost:5000

**Symptoms:**
- Browser console shows repeated errors: `Error fetching PyQMC status: AxiosError`
- `Failed to load resource: net::ERR_CONNECTION_REFUSED` for `localhost:5000/health`
- Errors appear to come from `App.js`

**Root Cause:**
These errors typically occur when:
1. Your browser has cached an old version of the application
2. A service worker from a previous version is still active
3. You're running an old build of the application

**Solutions:**

#### 1. Clear Browser Cache
1. Open browser DevTools (F12)
2. Right-click the refresh button and select "Empty Cache and Hard Reload"
3. Or go to Application/Storage → Clear Site Data

#### 2. Unregister Service Workers
1. Open DevTools → Application tab → Service Workers
2. Click "Unregister" for any Franklin OS service workers
3. Reload the page

#### 3. Clear Build Artifacts and Rebuild
```bash
# Remove old build files
rm -rf dist/ build/ node_modules/.vite/

# Clear npm cache (if needed)
npm cache clean --force

# Reinstall dependencies
npm install

# Start fresh development server
npm run dev
```

#### 4. Check Environment Configuration
Ensure your `.env` file has the correct backend URL:
```bash
# The backend should match your actual backend server port
VITE_API_BASE_URL=http://localhost:8000
```

### Backend Connection Issues

**Symptoms:**
- Cannot connect to backend API
- 404 errors for API endpoints

**Solutions:**

#### 1. Start the Backend Server
The Franklin OS backend is a Python FastAPI application. Start it with:
```bash
# Using Python directly
python app.py

# Or using uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Verify Backend is Running
Check that the backend is accessible:
```bash
curl http://localhost:8000/health
```

Should return:
```json
{
  "status": "ok",
  "system": "Franklin OS • BidNova • Trinity",
  "time": "2025-12-25T..."
}
```

#### 3. Check Port Configuration
- Frontend dev server: Port 8080 (configured in `vite.config.ts`)
- Backend API: Port 8000 (default for FastAPI)
- Node.js backend (if used): Port 3000

Ensure no other services are using these ports:
```bash
# Check what's running on ports
lsof -i :8080
lsof -i :8000
lsof -i :3000
```

### AI Features Not Working

**Symptoms:**
- AI commands don't execute
- "Provider not configured" errors

**Solutions:**

1. Add API keys to `.env` file:
```bash
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_GOOGLE_API_KEY=...
```

2. Enable AI features:
```bash
VITE_ENABLE_AI_FEATURES=true
```

3. Restart the development server after updating `.env`

### Build Issues

**Problem:** Build fails with dependency errors

**Solution:**
```bash
# Remove lock files and node_modules
rm -rf node_modules package-lock.json

# Clean install
npm install

# Try building again
npm run build
```

### Development Server Won't Start

**Problem:** `npm run dev` fails

**Solutions:**

1. Check Node.js version (should be 18 or higher):
```bash
node --version
```

2. Check for port conflicts:
```bash
lsof -i :8080
# Kill the process if needed
kill -9 <PID>
```

3. Clear Vite cache:
```bash
rm -rf node_modules/.vite
npm run dev
```

## Getting Help

If you're still experiencing issues:

1. Check the [GitHub Issues](https://github.com/jag0414/Franklin---Trinity---OS/issues)
2. Review logs in the browser console (F12)
3. Check terminal output for backend errors
4. Ensure all environment variables are set correctly

## Useful Commands

```bash
# Clean everything and start fresh
npm run clean  # if available, or manually:
rm -rf dist/ build/ node_modules/.vite/
npm install
npm run dev

# Check backend health
curl http://localhost:8000/health

# View backend logs
# (run the backend in terminal to see logs)

# Frontend build (production)
npm run build

# Preview production build
npm run preview
```
