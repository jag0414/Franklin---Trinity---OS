@echo off
echo ===================================================
echo      Franklin Construction OS - Manual Start
echo ===================================================

echo [1/2] Installing Frontend Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed. Please install Node.js.
    pause
    exit /b 1
)

echo [2/2] Starting Frontend...
echo.
echo Open your browser to: http://localhost:5173 (or similar)
echo.
npm run dev
pause
