# ✅ Vercel Deployment Checklist

Use this checklist when deploying the Franklin Trinity OS frontend to Vercel.

## Pre-Deployment

- [ ] Code is committed and pushed to GitHub
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables are documented
- [ ] Backend API is deployed and accessible

## Vercel Setup

- [ ] Signed in to [vercel.com](https://vercel.com)
- [ ] Repository imported: `jag0414/Franklin---Trinity---OS`
- [ ] Vercel detected the Vite framework automatically

## Environment Variables

Configure in Vercel Dashboard → Settings → Environment Variables:

### Required
- [ ] `VITE_API_BASE_URL` = `https://franklin-trinity-os-roosevelt.up.railway.app`

### Optional (AI Provider Keys)
- [ ] `VITE_OPENAI_API_KEY` (if using OpenAI directly from frontend)
- [ ] `VITE_ANTHROPIC_API_KEY` (if using Anthropic directly from frontend)
- [ ] `VITE_GOOGLE_API_KEY` (if using Google Gemini directly from frontend)
- [ ] `VITE_STABILITY_API_KEY` (if using Stability AI directly from frontend)

> ⚠️ **Security Note**: Frontend environment variables are publicly accessible. Avoid storing sensitive keys here. Use backend API calls instead.

## Deployment

- [ ] Clicked "Deploy" button
- [ ] Build completed successfully
- [ ] Deployment status shows "Ready"
- [ ] Assigned URL is accessible

## Post-Deployment Testing

- [ ] Visit the deployed URL
- [ ] Check browser console for errors
- [ ] Test navigation between pages
- [ ] Verify API connectivity (if applicable)
- [ ] Test AI interactions (if configured)

## Optional: Custom Domain

- [ ] Custom domain added in Vercel settings
- [ ] DNS records configured
- [ ] SSL certificate issued
- [ ] Domain is accessible

## Continuous Deployment

- [ ] Verified automatic deployments work for `main` branch
- [ ] Preview deployments work for pull requests
- [ ] Deployment notifications configured (if desired)

## Documentation

- [ ] Team members notified of deployment
- [ ] Deployment URL documented
- [ ] Environment variables documented securely

## Troubleshooting

If something goes wrong:

1. Check Vercel deployment logs
2. Review browser console errors
3. Verify environment variables are set correctly
4. Ensure backend API is accessible from Vercel's network
5. Check CORS settings on backend
6. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) troubleshooting section

---

**Deployment Complete!** 🎉

Your Franklin Trinity OS frontend is now live on Vercel.
