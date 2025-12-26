# ? FINAL DEPLOYMENT INSTRUCTIONS

## Your System is Ready for Production ?

### Current Status
- ? **Code**: All Python files compile and import correctly
- ? **Docker**: Dockerfile configured for Port 8080
- ? **GitHub**: All changes pushed to `main`
- ? **Railway**: Service created and linked
- ? **Next**: Add 3 variables and PostgreSQL database

---

## ?? Final 5 Steps to Go Live

### Step 1: Add PostgreSQL to Railway
1. Go to **Railway Dashboard** ? Your **Franklin OS POWER** project canvas
2. **Right-click** empty space ? **Create** ? **Database** ? **PostgreSQL**
3. Wait ~30 seconds for it to spin up
4. You'll see a new Postgres card on the canvas

### Step 2: Add Variables to Railway
Go to **Variables** tab in your `Franklin---Trinity---OS` service and add **exactly these 3**:

```
Variable Name: FRANKLIN_DB_URL
Value: ${{Postgres.DATABASE_URL}}

Variable Name: FRANKLIN_JWT_SECRET
Value: prod-secret-trinity-2025

Variable Name: PORT
Value: 8080
```

Click **Add** after each one. 

### Step 3: Wait for Green Deployment
- Go to **Deployments** tab
- Watch the latest deployment
- It should turn **Green (Active)** within 2-3 minutes

### Step 4: Verify Production
Run this in PowerShell:
```powershell
.\verify_production.ps1
```

Expected output:
```
Verifying Production Deployment at: https://franklin-trinity-os-roosevelt.up.railway.app
1. Checking Health...
   OK
2. Checking Pipelines...
   OK (4 pipelines)
Deployment Verification PASSED! ?
```

### Step 5: Deploy Frontend (Optional)
When ready, deploy your React frontend to Vercel:
1. Go to [Vercel.com](https://vercel.com/)
2. Import: `jag0414/Franklin---Trinity---OS`
3. Set environment variable: `VITE_API_BASE_URL=https://franklin-trinity-os-roosevelt.up.railway.app`
4. Deploy!

---

## ?? What You Now Have

### Backend (Railway)
- **URL**: `https://franklin-trinity-os-roosevelt.up.railway.app`
- **Health**: `https://franklin-trinity-os-roosevelt.up.railway.app/health`
- **Mode**: Mock (without API keys) OR Real (with API keys in variables)
- **Database**: PostgreSQL (connected via `FRANKLIN_DB_URL`)

### Frontend (Local Dev or Vercel)
- **Dev**: `npm run dev` ? `http://localhost:5173`
- **Prod**: Deploy to Vercel (uses `vercel.json`)

### Local Testing
- **Backend**: `.\Start_Backend.ps1` ? `http://localhost:8000`
- **Frontend**: `.\Start_Frontend.ps1` ? `http://localhost:5173`
- **Both**: `.\Start_All.ps1`
- **Smoke Test**: `.\smoke_test.ps1`

---

## ?? Checklist

- [ ] PostgreSQL database added to Railway
- [ ] `FRANKLIN_DB_URL` variable set to `${{Postgres.DATABASE_URL}}`
- [ ] `FRANKLIN_JWT_SECRET` variable set to any long random string
- [ ] `PORT` variable set to `8080`
- [ ] Deployment turned Green in Railway Deployments tab
- [ ] Ran `verify_production.ps1` and got ? PASSED

**Once all checked: You are LIVE in production!** ??

---

## 🔧 If Something Goes Wrong

### Common Railway Issues and Solutions

1. **Build Fails with "Out of Memory"**
   - **Solution**: Railway builds use limited memory. The Dockerfile has been optimized to reduce dependencies.
   - Check that heavy packages like tesseract/OCR aren't being installed

2. **Deployment succeeds but app doesn't respond**
   - **Solution**: Check that `PORT` environment variable is set to `8080`
   - Verify the health check endpoint: `https://your-app.up.railway.app/health`

3. **Database connection errors**
   - **Solution**: Make sure PostgreSQL plugin is added and `FRANKLIN_DB_URL=${{Postgres.DATABASE_URL}}` is set
   - Railway auto-fills the DATABASE_URL when you reference the Postgres service

4. **GitHub Actions workflows failing with "action_required"**
   - **Solution**: This is fixed! The new workflows don't require any secrets
   - Simply merge this PR and workflows will pass

5. **API returns "Mock Mode" when you have API keys**
   - **Solution**: Double-check environment variable names (case-sensitive)
   - Make sure no trailing spaces in API keys
   - Variables: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`

### Debug Checklist

- [ ] PostgreSQL database added to Railway
- [ ] `FRANKLIN_DB_URL` variable set to `${{Postgres.DATABASE_URL}}`
- [ ] `FRANKLIN_JWT_SECRET` variable set to any long random string
- [ ] `PORT` variable set to `8080`
- [ ] Deployment turned Green in Railway Deployments tab
- [ ] Ran `verify_production.ps1` with your actual Railway URL

### Still Having Issues?

1. **Check Deploy Logs**: Railway → Deployments → Click latest → **Deploy Logs**
2. **Check App Logs**: Railway → Logs pane
3. **Verify locally first**: `.\smoke_test.ps1`
4. **Check variables**: Make sure no typos in `FRANKLIN_DB_URL`, `FRANKLIN_JWT_SECRET`
5. **Database exists**: Confirm PostgreSQL card visible on Railway canvas

---

## 🎉 You're Done!

The Franklin OS Trinity system is production-ready. It can run in:
- **Mock Mode** (no keys, instant responses for demos)
- **Real Mode** (with OpenAI/Anthropic/Google keys for production AI)

Choose whichever you need. Everything is containerized, scalable, and ready for the world.

**Go make it great!** 🚀
