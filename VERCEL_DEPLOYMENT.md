# 🚀 Vercel Deployment Guide

This guide will walk you through deploying the Franklin Trinity OS React frontend to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com) (free tier works fine)
- GitHub repository access
- Backend deployed at Railway (https://franklin-trinity-os-roosevelt.up.railway.app)

## 🎯 Quick Deployment (4 Steps)

### Step 1: Go to Vercel
Navigate to [vercel.com](https://vercel.com) and sign in with your GitHub account.

### Step 2: Import Repository
1. Click **"Add New..."** → **"Project"**
2. Import the GitHub repository: `jag0414/Franklin---Trinity---OS`
3. Vercel will automatically detect the Vite configuration

### Step 3: Configure Environment Variables
Before deploying, add the following environment variable:

**Variable Name:** `VITE_API_BASE_URL`  
**Value:** `https://franklin-trinity-os-roosevelt.up.railway.app`

#### Optional: Add AI Provider API Keys
If you want the frontend to call AI APIs directly (not recommended for production):

- `VITE_OPENAI_API_KEY` - Your OpenAI API key
- `VITE_ANTHROPIC_API_KEY` - Your Anthropic API key
- `VITE_GOOGLE_API_KEY` - Your Google Gemini API key
- `VITE_STABILITY_API_KEY` - Your Stability AI API key

> ⚠️ **Security Note**: Storing API keys in frontend environment variables exposes them to clients. Consider using backend API calls instead for production.

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for the build to complete (typically 1-2 minutes)
3. Your app will be live at: `https://your-project.vercel.app`

## 📋 Configuration Details

### Build Settings (Auto-configured)

The `vercel.json` file in the repository contains:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This configuration:
- Uses Vite's build command
- Sets the output directory to `dist`
- Enables SPA routing (all routes point to index.html)

### Environment Variables

The frontend supports these Vite environment variables:

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_API_BASE_URL` | Backend API endpoint | Yes |
| `VITE_OPENAI_API_KEY` | OpenAI API access | Optional |
| `VITE_ANTHROPIC_API_KEY` | Anthropic API access | Optional |
| `VITE_GOOGLE_API_KEY` | Google Gemini API access | Optional |
| `VITE_STABILITY_API_KEY` | Stability AI API access | Optional |

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production**: Every push to the `main` branch
- **Preview**: Every push to other branches and pull requests

### Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

## 🧪 Testing Your Deployment

After deployment, verify:

1. **Health Check**: Visit your Vercel URL
2. **API Connection**: Check browser console for any API errors
3. **Routing**: Navigate to different pages to test SPA routing

## 🐛 Troubleshooting

### Build Fails

**Issue**: Build fails with "npm command not found"
**Solution**: Vercel auto-detects npm. Check that `package.json` is in the root directory.

**Issue**: Build fails with dependency errors
**Solution**: Ensure `package-lock.json` is committed to the repository.

### Blank Page After Deploy

**Issue**: App shows blank page
**Solution**: 
1. Check browser console for errors
2. Verify `VITE_API_BASE_URL` is set correctly
3. Check that all environment variables start with `VITE_`

### API Connection Errors

**Issue**: Frontend can't connect to backend
**Solution**:
1. Verify `VITE_API_BASE_URL` is set to the correct Railway URL
2. Check that Railway backend is running
3. Verify CORS settings on backend allow Vercel domain

### Environment Variables Not Working

**Issue**: Environment variables are undefined
**Solution**:
1. All frontend env vars MUST start with `VITE_`
2. Redeploy after adding/changing environment variables
3. Access with `import.meta.env.VITE_VARIABLE_NAME`

## 📊 Monitoring

Monitor your deployment:

1. **Analytics**: Vercel Dashboard → Analytics
2. **Logs**: Vercel Dashboard → Deployments → [Select Deployment] → Logs
3. **Performance**: Vercel provides automatic performance monitoring

## 🔒 Security Best Practices

1. **Never** commit `.env` files with real API keys
2. **Use** backend API calls for sensitive operations
3. **Enable** Vercel's security headers in project settings
4. **Consider** using Vercel's Edge Functions for sensitive API calls

## 🎉 You're Live!

Your Franklin Trinity OS frontend is now deployed on Vercel!

### Next Steps

- Set up a custom domain
- Configure monitoring and alerts
- Review Vercel's performance metrics
- Set up staging/preview environments

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Backend API Documentation](https://franklin-trinity-os-roosevelt.up.railway.app/api/docs)

---

**Questions?** Check the [main deployment guide](./FINAL_DEPLOYMENT_GUIDE.md) or open an issue on GitHub.
