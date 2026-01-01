# Vercel Frontend Deployment Guide

## Overview
This guide covers deploying the Franklin Trinity OS frontend (React + Vite + TypeScript) to Vercel.

## Prerequisites
- GitHub account with access to the repository
- Vercel account (free tier is sufficient)
- Backend deployed to Railway (optional, for API integration)

## Configuration Files

### vercel.json
The repository includes a properly configured `vercel.json` file with:
- **buildCommand**: `npm run build` - Compiles the Vite project
- **outputDirectory**: `dist` - Where Vite outputs the built files
- **installCommand**: `npm install` - Installs dependencies
- **framework**: `null` - Let Vercel auto-detect Vite
- **rewrites**: SPA routing to handle client-side navigation

### .vercelignore
Excludes unnecessary files from deployment:
- Python backend files
- Development dependencies (node_modules)
- Documentation (except README)
- Test files
- IDE configurations

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Login to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Sign in with GitHub

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose `jag0414/Franklin---Trinity---OS`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-filled from vercel.json)
   - **Output Directory**: `dist` (auto-filled from vercel.json)
   - **Install Command**: `npm install` (auto-filled from vercel.json)

4. **Environment Variables** (Optional)
   If connecting to backend API:
   ```
   Name: VITE_API_BASE_URL
   Value: https://your-backend.railway.app
   ```
   (Replace with your actual Railway URL from Railway dashboard)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build and deployment
   - Access at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project directory
cd /path/to/Franklin---Trinity---OS

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Post-Deployment

### Verify Deployment
1. Access your Vercel URL
2. Check that the home page loads
3. Test navigation (should work with SPA routing)
4. Verify API calls (if backend configured)

### Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Commits to `main` branch
- **Preview**: Pull requests and other branches

Each deployment gets a unique URL for testing.

## Environment Variables

### Frontend Variables (Vite)
- Must be prefixed with `VITE_`
- Example: `VITE_API_BASE_URL`
- Accessible in code via `import.meta.env.VITE_API_BASE_URL`

### Setting Variables in Vercel
1. Dashboard → Project → Settings → Environment Variables
2. Add variable name and value
3. Select environments (Production, Preview, Development)
4. Redeploy to apply changes

## Troubleshooting

### Build Fails with "Command not found"
**Problem**: Vercel can't find build commands
**Solution**: Verify `vercel.json` has correct buildCommand and installCommand

### 404 on Page Refresh
**Problem**: SPA routing not configured
**Solution**: Verify `vercel.json` has the rewrites rule for `/(.*)`

### Environment Variables Not Working
**Problem**: Variables not prefixed with `VITE_`
**Solution**: Rename variables to start with `VITE_` prefix

### Large Bundle Size Warning
**Problem**: Bundle exceeds 500 KB
**Solution**: Consider code-splitting or lazy loading (see vite.config.ts)

### API Calls Fail
**Problem**: CORS or incorrect API URL
**Solution**: 
- Verify `VITE_API_BASE_URL` is set correctly
- Check backend CORS configuration
- Verify backend is running on Railway

## Performance Optimization

### Enable Caching
Vercel automatically caches:
- Static assets (CSS, JS, images)
- Build output

### Image Optimization
For image optimization in Vite, consider:
```tsx
// Use standard img tags with proper sizing
<img src="/image.jpg" alt="Description" width={800} height={600} />

// Or use vite-imagetools for build-time optimization
// npm install vite-imagetools
import image from './image.jpg?w=800&format=webp'
```

### Analytics
Enable in Vercel Dashboard → Project → Analytics

## Security

### Environment Variables
- Never commit secrets to repository
- Use Vercel's environment variables for sensitive data
- Different values for Production vs Preview

### HTTPS
- Automatic SSL/TLS certificates
- Always uses HTTPS in production

## Cost
- **Free Tier**: 
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Automatic HTTPS
  - Preview deployments
- **Pro Tier**: $20/month for more bandwidth and team features

## Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

## Common Vercel Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel remove [deployment-url]

# Link local project to Vercel
vercel link
```

## Integration with Backend

### Railway Backend + Vercel Frontend
1. Deploy backend to Railway first
2. Get Railway backend URL from Railway dashboard
   - May be `https://your-app-name.up.railway.app` or `https://your-app-name.railway.app`
   - Check your Railway project's Settings → Domains
3. Add to Vercel environment variables:
   ```
   VITE_API_BASE_URL=https://your-app-name.up.railway.app
   ```
   (Replace with your actual Railway URL)
4. Redeploy Vercel frontend

### CORS Configuration
Ensure backend allows Vercel frontend domain:
```python
# In backend (FastAPI)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-project.vercel.app",
        "https://*.vercel.app"  # For preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Monitoring

### Vercel Dashboard
- Real-time deployment logs
- Build duration and success rate
- Traffic analytics
- Error tracking

### Recommended Tools
- Vercel Analytics (built-in)
- Sentry for error tracking
- LogRocket for session replay

## Best Practices

1. **Use Preview Deployments**: Test changes before merging to production
2. **Environment Variables**: Use different values for dev/preview/production
3. **Custom Domains**: Use for production deployments
4. **Branch Protection**: Require preview deployment success before merging
5. **Monitoring**: Enable analytics and error tracking
6. **Caching**: Leverage Vercel's automatic caching
7. **Versioning**: Use semantic versioning for releases

## Summary
With the properly configured `vercel.json` and `.vercelignore` files, deploying to Vercel is straightforward:
1. Import repository to Vercel
2. Configure environment variables (optional)
3. Deploy
4. Access at your Vercel URL

Vercel handles the rest: build, optimization, SSL, CDN, and continuous deployment.
