# 🚀 Frontend Deployment Guide - Vercel

## ✅ Status: Ready to Deploy

The frontend is **production-ready** and can be deployed to Vercel in 5 simple steps.

---

## 📋 Prerequisites

- ✅ Backend is live at: `https://franklin-trinity-os-roosevelt.up.railway.app`
- ✅ Frontend builds successfully (verified locally)
- ✅ GitHub repository: `jag0414/Franklin---Trinity---OS`
- ✅ Vercel account (free tier works perfectly)

---

## 🎯 Deployment Steps

### Step 1: Go to Vercel

1. Visit [vercel.com](https://vercel.com/)
2. Click **"Sign Up"** or **"Log In"** (use your GitHub account for easiest integration)

### Step 2: Import Your Repository

1. On the Vercel dashboard, click **"Add New..."** → **"Project"**
2. Select **"Import Git Repository"**
3. Find and select: `jag0414/Franklin---Trinity---OS`
4. Click **"Import"**

### Step 3: Configure Project Settings

Vercel will auto-detect the Vite React project. Configure the following:

**Framework Preset:** Vite (auto-detected)

**Root Directory:** `./` (leave as default - project is in root, not in a subdirectory)

**Build Command:** 
```bash
npm run build
```

**Output Directory:** 
```
dist
```

**Install Command:**
```bash
npm install
```

### Step 4: Add Environment Variables

Click on **"Environment Variables"** and add:

```
Name: VITE_API_BASE_URL
Value: https://franklin-trinity-os-roosevelt.up.railway.app
```

**Important Notes:**
- ⚠️ Do NOT add API keys to the frontend environment variables
- ⚠️ API keys should ONLY be in the backend (Railway)
- ✅ The frontend communicates with the backend, which handles all API keys securely

### Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Vercel will provide you with a production URL (e.g., `franklin-trinity-os.vercel.app`)

---

## 🎉 Verify Deployment

Once deployed, verify your frontend is working:

1. **Visit your Vercel URL** (e.g., `https://franklin-trinity-os.vercel.app`)
2. **Check the console** (F12) for any errors
3. **Test AI functionality** to ensure it connects to the backend
4. **Check routing** by navigating to different pages

### Expected Behavior:
- ✅ Frontend loads without errors
- ✅ API calls go to `https://franklin-trinity-os-roosevelt.up.railway.app`
- ✅ Backend responds to requests
- ✅ All routes work correctly (thanks to `vercel.json` configuration)

---

## 🔧 Configuration Files

The following files are already configured for Vercel deployment:

### `vercel.json`
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This ensures SPA routing works correctly (all routes serve `index.html`).

### `vite.config.ts`
Already configured with proper build settings and aliases.

### `package.json`
Build scripts are properly configured:
- `npm run build` - Production build
- `npm run preview` - Preview production build locally

---

## 🌐 Your Production URLs

After deployment, you'll have:

### Frontend (Vercel)
- **URL**: `https://franklin-trinity-os.vercel.app` (or your custom domain)
- **Status**: You can check this at the Vercel dashboard

### Backend (Railway)
- **URL**: `https://franklin-trinity-os-roosevelt.up.railway.app`
- **Health**: `https://franklin-trinity-os-roosevelt.up.railway.app/health`
- **API Docs**: `https://franklin-trinity-os-roosevelt.up.railway.app/docs`

---

## 🔄 Continuous Deployment

Once connected to Vercel:
- ✅ Every push to `main` branch auto-deploys to production
- ✅ Pull requests get preview deployments
- ✅ Rollback to previous deployments is instant

---

## 🐛 Troubleshooting

### Frontend shows blank page
1. Check browser console for errors (F12)
2. Verify `VITE_API_BASE_URL` is set correctly in Vercel environment variables
3. Check Vercel build logs for build errors

### API calls fail
1. Verify backend is running: visit `https://franklin-trinity-os-roosevelt.up.railway.app/health`
2. Check that `VITE_API_BASE_URL` doesn't have a trailing slash
3. Check browser Network tab (F12) to see the actual API calls being made

### Routes don't work (404 on refresh)
1. Verify `vercel.json` is in the repository root
2. Check that it contains the rewrites configuration shown above

### Build fails on Vercel
1. Check Vercel build logs
2. Verify the build works locally: `npm run build`
3. Ensure all dependencies are in `package.json` (not just `devDependencies`)

---

## 📊 Performance Optimization

The frontend is already optimized:
- ✅ Vite provides code splitting
- ✅ Assets are minified and optimized
- ✅ Vercel provides global CDN
- ✅ Static assets are cached

For further optimization:
- Consider implementing dynamic imports for large components
- Use React.lazy() for route-based code splitting
- Optimize images (already configured with placeholder.svg)

---

## 🔐 Security Notes

- ✅ API keys are NEVER exposed to frontend (they're in Railway backend)
- ✅ All AI requests go through the backend API
- ✅ Environment variables are secure in Vercel
- ✅ HTTPS is enforced by both Vercel and Railway

---

## 🎯 Next Steps After Deployment

1. **Set up custom domain** (optional)
   - Go to Vercel project settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Monitor performance**
   - Use Vercel Analytics (built-in)
   - Monitor API response times
   - Check error logs in Vercel dashboard

3. **Configure CORS on backend** (if needed)
   - Add your Vercel domain to allowed origins in Railway backend
   - This is usually handled automatically by the backend configuration

---

## ✅ Deployment Checklist

- [ ] Vercel account created/logged in
- [ ] Repository imported to Vercel
- [ ] Build settings configured (Framework: Vite, Output: dist)
- [ ] Environment variable `VITE_API_BASE_URL` set to backend URL
- [ ] Deployment successful (check Vercel dashboard)
- [ ] Frontend loads correctly at Vercel URL
- [ ] API calls connect to Railway backend
- [ ] All routes work (no 404 on refresh)
- [ ] Console shows no errors (F12)

---

## 🎊 You're Live!

Once all steps are complete, your Franklin Trinity OS frontend is:
- 🌍 **Live on the internet** via Vercel
- 🔗 **Connected to your backend** on Railway
- 🚀 **Auto-deploying** on every Git push
- ⚡ **Fast and optimized** with Vercel's global CDN
- 🔒 **Secure** with HTTPS and proper API key handling

**Welcome to production!** 🎉
