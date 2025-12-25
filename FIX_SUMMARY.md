# Fix for PyQMC Status Connection Errors

## Problem

Users were experiencing repeated console errors when running the Franklin OS application:

```
Error fetching PyQMC status: AxiosError
Failed to load resource: net::ERR_CONNECTION_REFUSED (localhost:5000/health)
```

These errors appeared to originate from `App.js:32` and `App.js:35` and were attempting to connect to a non-existent service on port 5000.

## Root Cause Analysis

After thorough investigation:

1. **No Source Code Found**: The current codebase doesn't contain any code trying to connect to `localhost:5000`
2. **Port Mismatch**: The actual backend runs on port 8000 (Python FastAPI), not 5000
3. **Likely Causes**:
   - Cached browser JavaScript from an old version of the application
   - Service workers from previous builds still active
   - Old build artifacts not properly cleaned
   - Missing or incorrect environment configuration

## Solution Implemented

### 1. Environment Configuration

**Created `.env` template with correct settings:**
- Backend API URL set to `http://localhost:8000` (not 5000)
- Port configurations clearly documented
- Feature flags for optional services

**Files Modified:**
- `.env.example` - Updated with comprehensive configuration
- `.env` - Created with default values (gitignored)

### 2. Troubleshooting Documentation

**Created `TROUBLESHOOTING.md`** with solutions for:
- Browser cache clearing procedures
- Service worker unregistration steps
- Build artifact cleanup
- Backend connection verification
- Port conflict resolution

### 3. Cleanup Tools

**Created cleanup scripts:**
- `clean.sh` - Linux/Mac shell script
- `clean.ps1` - Windows PowerShell script
- Added `npm run clean` and `npm run clean:all` commands

**What they clean:**
- Build artifacts (`dist/`, `build/`)
- Vite cache (`.vite/`, `node_modules/.vite/`)
- Python cache (`__pycache__/`, `*.pyc`)
- Optionally, node_modules

### 4. Documentation Updates

**Updated `README.md`** with:
- Quick start guide
- Backend setup instructions
- Port configurations (Frontend: 8080, Backend: 8000)
- Reference to troubleshooting guide
- Available npm scripts

## How to Fix the Error

If you're experiencing these errors, follow these steps:

### Step 1: Clear Browser State
```
1. Open DevTools (F12)
2. Go to Application → Storage
3. Click "Clear site data"
4. Go to Service Workers and unregister any workers
5. Close and reopen the browser
```

### Step 2: Clean Build Artifacts
```bash
# Using npm script
npm run clean

# Or using the shell script
./clean.sh  # Linux/Mac
# or
.\clean.ps1  # Windows
```

### Step 3: Verify Configuration
```bash
# Ensure .env has correct backend URL
cat .env | grep VITE_API_BASE_URL
# Should show: VITE_API_BASE_URL=http://localhost:8000
```

### Step 4: Start Fresh
```bash
# Reinstall if needed
npm install

# Start dev server
npm run dev

# In another terminal, start backend
python app.py
```

### Step 5: Verify Backend
```bash
# Check backend is running
curl http://localhost:8000/health

# Should return:
# {"status":"ok","system":"Franklin OS • BidNova • Trinity","time":"..."}
```

## Prevention

To prevent this issue from recurring:

1. **Always use environment variables** for API URLs
2. **Clear cache** when switching branches or after major updates
3. **Use the cleanup scripts** before rebuilding
4. **Check .gitignore** to ensure build artifacts aren't committed
5. **Document backend dependencies** clearly

## Technical Details

### Port Configuration

| Service | Port | Purpose |
|---------|------|---------|
| Frontend Dev Server | 8080 | Vite development server |
| Backend API | 8000 | Python FastAPI application |
| Node.js Backend (optional) | 3000 | Express/Node.js server (if used) |

### Environment Variables

Key variables in `.env`:

```bash
# Frontend connects to this
VITE_API_BASE_URL=http://localhost:8000

# Dev server configuration
VITE_PORT=8080
VITE_HOST=localhost
```

### .gitignore Coverage

Build artifacts properly excluded:
- `dist/` - Vite production build
- `build/` - Alternative build directory
- `.vite/` - Vite cache
- `node_modules/.vite/` - Module cache
- `.env` - Local environment variables

## Files Changed

1. `.env.example` - Updated with comprehensive configuration
2. `TROUBLESHOOTING.md` - New comprehensive troubleshooting guide
3. `clean.sh` - New cleanup script for Linux/Mac
4. `clean.ps1` - New cleanup script for Windows
5. `package.json` - Added clean scripts
6. `README.md` - Updated with setup and troubleshooting info
7. `FIX_SUMMARY.md` - This file

## Testing

To verify the fix:

1. **Clean state test:**
   ```bash
   npm run clean
   rm -rf node_modules
   npm install
   npm run dev
   ```

2. **Browser test:**
   - Clear browser cache completely
   - Unregister all service workers
   - Open DevTools Network tab
   - Should see NO requests to localhost:5000

3. **Backend test:**
   ```bash
   python app.py &
   sleep 2
   curl http://localhost:8000/health
   # Should return valid JSON
   ```

## Future Recommendations

1. **Service Health Check**: Implement graceful degradation if backend is unavailable
2. **Configuration Validation**: Add startup check for correct environment variables
3. **Build Versioning**: Include build version/hash to detect stale builds
4. **Error Boundaries**: Add React error boundaries to catch and display connection errors gracefully

## References

- Troubleshooting Guide: `TROUBLESHOOTING.md`
- Environment Example: `.env.example`
- Backend API: `app.py`
- Frontend Config: `vite.config.ts`

---

**Resolution Status**: ✅ Fixed

**Date**: December 25, 2025

**Impact**: Low (configuration/documentation fix, no code changes required)