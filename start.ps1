# Franklin OS Startup Script for Windows
# This script starts both the backend API and frontend dev server

Write-Host "🚀 Franklin OS - Starting System..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    if (-not (Get-Command python3 -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Python 3 is not installed" -ForegroundColor Red
        Write-Host "Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
        exit 1
    }
    # Create alias if python3 exists but python doesn't
    Set-Alias -Name python -Value python3 -Scope Script
}

# Check if Node is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Checking dependencies..." -ForegroundColor Blue

# Install Python dependencies if needed
if (Test-Path "requirements.txt") {
    Write-Host "✓ Installing Python dependencies" -ForegroundColor Green
    python -m pip install -q -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Some Python dependencies may need attention" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  requirements.txt not found" -ForegroundColor Yellow
}

# Install Node dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "✓ Installing Node dependencies" -ForegroundColor Green
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Node dependencies" -ForegroundColor Red
        exit 1
    }
}

# Create run directory
if (-not (Test-Path ".run")) {
    New-Item -ItemType Directory -Path ".run" | Out-Null
}

Write-Host ""

# Function to cleanup on exit
$CleanupScript = {
    Write-Host "`n🛑 Shutting down services..." -ForegroundColor Yellow
    
    if (Test-Path ".run\backend.pid") {
        $backendPid = Get-Content ".run\backend.pid" -ErrorAction SilentlyContinue
        if ($backendPid) {
            Stop-Process -Id $backendPid -Force -ErrorAction SilentlyContinue
        }
        Remove-Item ".run\backend.pid" -ErrorAction SilentlyContinue
    }
    
    if (Test-Path ".run\frontend.pid") {
        $frontendPid = Get-Content ".run\frontend.pid" -ErrorAction SilentlyContinue
        if ($frontendPid) {
            Stop-Process -Id $frontendPid -Force -ErrorAction SilentlyContinue
        }
        Remove-Item ".run\frontend.pid" -ErrorAction SilentlyContinue
    }
    
    Write-Host "✓ Services stopped" -ForegroundColor Green
}

# Register cleanup on exit
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action $CleanupScript | Out-Null

# Handle Ctrl+C
try {
    # Start backend
    Write-Host "🔧 Starting Backend API (port 8090)..." -ForegroundColor Blue
    $backendProcess = Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8090", "--reload" -PassThru -NoNewWindow -RedirectStandardOutput ".run\backend.log" -RedirectStandardError ".run\backend-error.log"
    $backendProcess.Id | Out-File ".run\backend.pid"
    Write-Host "✓ Backend started (PID: $($backendProcess.Id))" -ForegroundColor Green

    # Wait for backend to be ready
    Write-Host "⏳ Waiting for backend to be ready..." -ForegroundColor Blue
    $maxAttempts = 30
    $attempt = 0
    $backendReady = $false

    while ($attempt -lt $maxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8090/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ Backend is ready" -ForegroundColor Green
                $backendReady = $true
                break
            }
        } catch {
            # Backend not ready yet
        }
        Start-Sleep -Seconds 1
        $attempt++
    }

    if (-not $backendReady) {
        Write-Host "❌ Backend failed to start" -ForegroundColor Red
        Write-Host "Check .run\backend.log and .run\backend-error.log for details" -ForegroundColor Yellow
        exit 1
    }

    # Start frontend
    Write-Host "🎨 Starting Frontend Dev Server (port 8080)..." -ForegroundColor Blue
    $frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -NoNewWindow -RedirectStandardOutput ".run\frontend.log" -RedirectStandardError ".run\frontend-error.log"
    $frontendProcess.Id | Out-File ".run\frontend.pid"
    Write-Host "✓ Frontend started (PID: $($frontendProcess.Id))" -ForegroundColor Green

    # Wait for frontend to be ready
    Write-Host "⏳ Waiting for frontend to be ready..." -ForegroundColor Blue
    $attempt = 0
    while ($attempt -lt 30) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
            Write-Host "✓ Frontend is ready" -ForegroundColor Green
            break
        } catch {
            # Frontend not ready yet
        }
        Start-Sleep -Seconds 1
        $attempt++
    }

    Write-Host ""
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "🎉 Franklin OS is now running!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend:  http://localhost:8080" -ForegroundColor Blue
    Write-Host "Backend:   http://localhost:8090" -ForegroundColor Blue
    Write-Host "API Docs:  http://localhost:8090/docs" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Logs are available in:" -ForegroundColor Cyan
    Write-Host "  - .run\backend.log" -ForegroundColor Gray
    Write-Host "  - .run\frontend.log" -ForegroundColor Gray
    Write-Host ""

    # Keep the script running and monitor processes
    while ($true) {
        if ($backendProcess.HasExited -or $frontendProcess.HasExited) {
            Write-Host "⚠️  One of the services has stopped unexpectedly" -ForegroundColor Yellow
            break
        }
        Start-Sleep -Seconds 2
    }

} catch {
    Write-Host "❌ An error occurred: $_" -ForegroundColor Red
} finally {
    # Cleanup
    & $CleanupScript
}
