Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "Checking API Keys..." -ForegroundColor Cyan
$missing = @()
if (-not $env:OPENAI_API_KEY) { $missing += "OPENAI_API_KEY" }
if (-not $env:ANTHROPIC_API_KEY) { $missing += "ANTHROPIC_API_KEY" }

if ($missing.Count -gt 0) {
    Write-Host "Warning: Missing environment variables: $($missing -join ', ')" -ForegroundColor Red
    Write-Host "Proceeding in MOCK MODE." -ForegroundColor Yellow
}

Write-Host "1. Launching Backend (new window)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\Start_Backend.ps1"

Write-Host "Waiting 5 seconds for backend to warm up..."
Start-Sleep -Seconds 5

Write-Host "2. Launching Frontend (new window)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\Start_Frontend.ps1"

Write-Host "3. Running Smoke Test (this window)..." -ForegroundColor Green
.\smoke_test.ps1
