@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo      Franklin Construction OS - Startup Script
echo ===================================================

:: 1. Check Prerequisites
echo [1/4] Checking prerequisites...
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH.
    pause
    exit /b 1
)
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js (npm) is not installed or not in PATH.
    pause
    exit /b 1
)
echo Prerequisites OK.

:: 2. Setup Backend
echo [2/4] Setting up Backend...
cd legacy_import\franklin_backend

:: Create uploads dir if missing
if not exist "uploads" mkdir uploads

:: Install Python deps
echo Installing Python dependencies...
pip install -r requirements.txt >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Failed to install some Python dependencies. Check requirements.txt.
)

:: 3. Setup Frontend
echo [3/4] Setting up Frontend...
cd ..\..
echo Installing Node dependencies...
call npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Failed to install Node dependencies.
)

:: 4. Start Servers
echo [4/4] Starting Servers...
echo.
echo ---------------------------------------------------
echo  Backend: http://localhost:8000/docs
echo  Frontend: http://localhost:5173
echo ---------------------------------------------------
echo.

:: Start Backend in new window with PYTHONPATH set
start "Franklin Backend" cmd /k "set PYTHONPATH=%cd%\legacy_import && cd legacy_import\franklin_backend && uvicorn main:app --reload --port 8000"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start Frontend in new window
start "Franklin Frontend" cmd /k "npm run dev"

echo Servers started! Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo Keep the other two windows open.
pause
