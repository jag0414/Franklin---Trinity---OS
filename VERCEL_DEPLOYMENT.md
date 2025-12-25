# 🚀 Vercel Deployment Guide

This guide walks you through deploying the Franklin Trinity OS React frontend to Vercel.

## 📋 Prerequisites

- GitHub repository: `jag0414/Franklin---Trinity---OS`
- Backend deployed on Railway: `https://franklin-trinity-os-roosevelt.up.railway.app`
- Vercel account (sign up at [vercel.com](https://vercel.com))

## 🎯 Deployment Steps

### Step 1: Go to Vercel

1. Navigate to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account

### Step 2: Import Repository

1. Click "Add New Project" or "Import Project"
2. Select "Import Git Repository"
3. Search for or select: `jag0414/Franklin---Trinity---OS`
4. Click "Import"

### Step 3: Configure Project

Vercel will auto-detect this as a Vite project. Ensure these settings:

- **Framework Preset**: Vite
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

### Step 4: Set Environment Variables

In the "Environment Variables" section, add:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://franklin-trinity-os-roosevelt.up.railway.app` |

**Optional AI Provider Keys** (if you want direct AI provider access from frontend):
| Name | Value |
|------|-------|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key |
| `VITE_ANTHROPIC_API_KEY` | Your Anthropic API key |
| `VITE_GOOGLE_API_KEY` | Your Google API key |
| `VITE_STABILITY_API_KEY` | Your Stability AI API key |

> ⚠️ **Note**: The AI provider keys are optional. The frontend can call the backend API which has these keys configured, or you can provide them directly for client-side AI calls.

### Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete (typically 1-3 minutes)
3. Once deployed, you'll receive a URL like: `https://franklin-trinity-os.vercel.app`

## ✅ Verify Deployment

After deployment completes:

1. Visit your Vercel URL
2. Open browser developer console (F12)
3. Check that the app loads without errors
4. Test any API-dependent features

### Health Check

If your frontend makes backend API calls, verify the backend is accessible:

```bash
# Test backend health endpoint
curl https://franklin-trinity-os-roosevelt.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "Franklin Trinity OS",
  "timestamp": "..."
}
```

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production**: On every push to `main` branch
- **Preview**: On every pull request

No additional configuration needed!

## 🛠️ Troubleshooting

### Build Fails

**Problem**: Build fails with TypeScript errors

**Solution**:
1. Check the build logs in Vercel dashboard
2. Ensure all TypeScript errors are fixed locally
3. Test locally with: `npm run build`
4. Push fixes to GitHub and Vercel will auto-redeploy

### Environment Variables Not Working

**Problem**: API calls fail or show `undefined`

**Solution**:
1. Verify environment variables are set in Vercel dashboard
2. Ensure variable names start with `VITE_` prefix
3. Redeploy the project after adding/changing variables
4. Variables are built into the frontend at build time

### Backend Connection Issues

**Problem**: Frontend can't reach backend API

**Solution**:
1. Verify backend is running: Visit Railway URL in browser
2. Check CORS configuration on backend allows Vercel domain
3. Ensure `VITE_API_BASE_URL` is correctly set (no trailing slash)
4. Check browser console for CORS errors

## 📝 Configuration Files

### vercel.json

Located at project root, configures SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures all routes are handled by the React app.

### .env.example

Template for local development environment variables:

```env
VITE_API_BASE_URL=https://franklin-trinity-os-roosevelt.up.railway.app
```

Copy to `.env.local` for local development:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

## 🔐 Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use environment variables** - All secrets should be in Vercel dashboard
3. **Rotate API keys regularly** - Update in both Railway and Vercel
4. **Enable Vercel authentication** - For staging/preview deployments
5. **Monitor usage** - Check Vercel analytics for unusual activity

## 📊 Monitoring

### Vercel Analytics

Enable in Vercel dashboard to track:
- Page load times
- Web vitals
- Real user monitoring

### Vercel Logs

View deployment and runtime logs:
1. Go to your project in Vercel
2. Click on "Logs" tab
3. Filter by deployment or time range

## 🎨 Custom Domain (Optional)

To use a custom domain:

1. Go to project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for DNS propagation (can take up to 48 hours)

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Railway Documentation](https://docs.railway.app/)
- [React Documentation](https://react.dev/)

## 🎉 Success!

Once deployed, your Franklin Trinity OS frontend will be live at your Vercel URL, connected to your Railway backend, and automatically deploying on every push to `main`.

**Your deployment URLs:**
- **Frontend (Vercel)**: `https://franklin-trinity-os.vercel.app`
- **Backend (Railway)**: `https://franklin-trinity-os-roosevelt.up.railway.app`
- **API Health**: `https://franklin-trinity-os-roosevelt.up.railway.app/health`

Happy deploying! 🚀
