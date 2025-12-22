# Franklin OS - Quick Start for Windows

## 🚀 Running on Windows

### Step 1: Open PowerShell in Project Directory

**Option A - From File Explorer:**
1. Open File Explorer
2. Navigate to the Franklin---Trinity---OS folder
3. Click on the address bar at the top
4. Type `powershell` and press Enter

**Option B - Shift + Right-Click:**
1. Open File Explorer
2. Navigate to the Franklin---Trinity---OS folder
3. Hold Shift and Right-click in the folder
4. Select "Open PowerShell window here"

**Option C - From Visual Studio Code:**
1. Open the project in VS Code
2. Go to View → Terminal (or press Ctrl+`)
3. Make sure PowerShell is selected (check the dropdown next to the + icon)

### Step 2: Run the Startup Script

In PowerShell, type:
```powershell
.\start.ps1
```

Press Enter and the system will:
- Install dependencies automatically
- Start the backend server on port 8090
- Start the frontend server on port 8080
- Display status and logs

### Step 3: Access the Application

Once you see "🎉 Franklin OS is now running!", open your browser and go to:
- **http://localhost:8080** (Main application)
- **http://localhost:8090/docs** (API documentation)

### 🛑 Stopping the Application

Press **Ctrl+C** in the PowerShell window to stop all services.

---

## ⚠️ Important Notes

- **Do NOT** try to run `start.sh` in PowerShell - it won't work! Use `start.ps1` instead
- If you have Git Bash installed, you can use `./start.sh` in Git Bash as an alternative
- Make sure Python 3 and Node.js are installed on your system first

## 📚 Full Documentation

For complete documentation, see [QUICKSTART.md](QUICKSTART.md)

---

**Need Help?** Check the [Troubleshooting section](QUICKSTART.md#-troubleshooting) in QUICKSTART.md
