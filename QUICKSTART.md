# 🚀 Quick Start Guide - Franklin OS

Get Franklin OS up and running in minutes!

## ⚡ 30-Second Local Setup

```bash
# Clone the repository
git clone https://github.com/jag0414/Franklin---Trinity---OS.git
cd Franklin---Trinity---OS

# Install dependencies and run
npm install
npm run dev
```

Visit `http://localhost:8080` - You're done! 🎉

---

## 🌐 Deploy to Production (5 Minutes)

### Option 1: Netlify (Easiest)

1. **Fork this repository** on GitHub
2. Go to [netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub and select your fork
5. Settings are auto-detected - just click **"Deploy"**
6. Done! ✅

### Option 2: Vercel

1. **Fork this repository** on GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Connect GitHub and select your fork
5. Click **"Deploy"**
6. Done! ✅

### Option 3: One-Click Deploy

Click one of these buttons:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jag0414/Franklin---Trinity---OS)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jag0414/Franklin---Trinity---OS)

---

## 🔧 What You Get

- ✅ Modern React + TypeScript frontend
- ✅ FastAPI Python backend
- ✅ AI integration (Gemini)
- ✅ Bidding and contract management
- ✅ Authentication system
- ✅ Responsive UI with shadcn/ui
- ✅ Docker support

---

## 📚 Next Steps

After deployment:

1. **Configure Backend API:**
   - Create a `.env` file (copy from `.env.example`)
   - Set your `JWT_SECRET`, database URLs, etc.
   - Deploy backend separately or use Docker

2. **Connect Frontend to Backend:**
   - Set `VITE_API_URL` environment variable in your hosting platform
   - Point it to your backend API URL

3. **Customize:**
   - Update branding in `src/` components
   - Modify API endpoints in `app.py`
   - Add your own features

---

## 🆘 Need Help?

- 📖 Full documentation: [README.md](README.md)
- 🚀 Deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 Report issues: [GitHub Issues](https://github.com/jag0414/Franklin---Trinity---OS/issues)

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run linter

# Backend (Python)
pip install -r requirements.txt
python -m uvicorn app:app --reload

# Docker
docker-compose up -d     # Start all services
docker-compose logs -f   # View logs
docker-compose down      # Stop all services
```

---

## 🎯 Project Structure

```
Franklin-Trinity-OS/
├── src/              # React frontend
├── app.py            # FastAPI backend
├── public/           # Static assets
├── dist/             # Build output (generated)
└── docker-compose.yml # Docker config
```

---

## ⚙️ Environment Variables

### Frontend (.env in root)
```env
VITE_API_URL=http://localhost:8090
```

### Backend (.env for Python)
```env
PORT=8090
JWT_SECRET=your-secret-key-here
MONGODB_URI=your-mongodb-uri
```

---

## 🔐 Security Notes

⚠️ **Before deploying to production:**

1. Change `SECRET` in `app.py` (line 13)
2. Set a strong `JWT_SECRET` in `.env`
3. Configure proper CORS origins
4. Use HTTPS in production
5. Don't commit `.env` files

---

## 🎨 Features Overview

### Frontend
- Modern React with TypeScript
- Vite for fast builds
- shadcn/ui components
- React Router
- TanStack Query
- Tailwind CSS

### Backend
- FastAPI framework
- SQLModel ORM
- JWT authentication
- RESTful API
- Database support (SQLite/MongoDB)

### AI Capabilities
- Text generation
- Image generation
- Audio generation
- Video generation
- Embeddings

---

## 📱 Platform Support

- ✅ Netlify
- ✅ Vercel
- ✅ Railway
- ✅ Render
- ✅ DigitalOcean
- ✅ AWS
- ✅ Any Docker host

---

## 💡 Pro Tips

1. **Fast iterations:** Use `npm run dev` for hot reload
2. **Build locally first:** Test with `npm run build` before deploying
3. **Check logs:** Use `docker-compose logs` to debug issues
4. **Scale workers:** `docker-compose up --scale worker=5`
5. **Monitor performance:** Enable logging in `.env`

---

## 🚀 Ready to Deploy?

Choose your path:
- **Quick & Easy:** Use Netlify/Vercel (frontend only)
- **Full Stack:** Use Railway/Render (frontend + backend)
- **Full Control:** Use Docker on your own server

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed platform-specific instructions.

---

**Built with ❤️ by the Franklin OS Team**

Made this easier? Star the repo! ⭐
