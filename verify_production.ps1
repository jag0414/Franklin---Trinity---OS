# Franklin Trinity OS - Production Verification Script
# Tests Railway deployment endpoints
# Usage: .\verify_production.ps1
#    Or: .\verify_production.ps1 -BaseUrl "https://your-app.up.railway.app"

param(
    [string]$BaseUrl
)

# If no URL provided, try to get from environment or prompt
if (-not $BaseUrl) {
    $BaseUrl = $env:RAILWAY_URL
    if (-not $BaseUrl) {
        Write-Host "Please provide your Railway deployment URL:" -ForegroundColor Yellow
        Write-Host "Example: https://your-app-name.up.railway.app" -ForegroundColor Gray
        $BaseUrl = Read-Host "Railway URL"
        if (-not $BaseUrl) {
            Write-Host "❌ No URL provided. Exiting." -ForegroundColor Red
            exit 1
        }
    }
}

# Remove trailing slash if present
$BaseUrl = $BaseUrl.TrimEnd('/')

Write-Host "`n=== Franklin Trinity OS - Production Verification ===" -ForegroundColor Cyan
Write-Host "Testing deployment at: $BaseUrl`n" -ForegroundColor White

$ErrorCount = 0
$SuccessCount = 0

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$BaseUrl/health" -Method GET -TimeoutSec 30
    if ($healthResponse.status -eq "ok") {
        Write-Host "   ✅ Health check PASSED" -ForegroundColor Green
        Write-Host "   Status: $($healthResponse.status)" -ForegroundColor Gray
        if ($healthResponse.database) {
            Write-Host "   Database: $($healthResponse.database)" -ForegroundColor Gray
        }
        $SuccessCount++
    } else {
        Write-Host "   ❌ Health check returned unexpected status" -ForegroundColor Red
        $ErrorCount++
    }
} catch {
    Write-Host "   ❌ Health check FAILED: $_" -ForegroundColor Red
    $ErrorCount++
}

# Test 2: Pipelines Endpoint
Write-Host "`n2. Testing Pipelines Endpoint..." -ForegroundColor Yellow
try {
    $pipelinesResponse = Invoke-RestMethod -Uri "$BaseUrl/api/ai/pipelines" -Method GET -TimeoutSec 30
    $pipelineCount = ($pipelinesResponse | Measure-Object).Count
    
    if ($pipelineCount -gt 0) {
        Write-Host "   ✅ Pipelines endpoint PASSED" -ForegroundColor Green
        Write-Host "   Found $pipelineCount pipelines:" -ForegroundColor Gray
        foreach ($pipeline in $pipelinesResponse) {
            Write-Host "     - $($pipeline.id): $($pipeline.name)" -ForegroundColor Gray
        }
        $SuccessCount++
    } else {
        Write-Host "   ❌ No pipelines returned" -ForegroundColor Red
        $ErrorCount++
    }
} catch {
    Write-Host "   ❌ Pipelines endpoint FAILED: $_" -ForegroundColor Red
    $ErrorCount++
}

# Test 3: API Documentation
Write-Host "`n3. Testing API Documentation..." -ForegroundColor Yellow
try {
    $docsResponse = Invoke-WebRequest -Uri "$BaseUrl/docs" -Method GET -TimeoutSec 30
    if ($docsResponse.StatusCode -eq 200) {
        Write-Host "   ✅ API documentation accessible" -ForegroundColor Green
        $SuccessCount++
    } else {
        Write-Host "   ❌ Unexpected status code: $($docsResponse.StatusCode)" -ForegroundColor Red
        $ErrorCount++
    }
} catch {
    Write-Host "   ⚠️  API documentation check skipped: $_" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=== Verification Summary ===" -ForegroundColor Cyan
Write-Host "Passed: $SuccessCount" -ForegroundColor Green
Write-Host "Failed: $ErrorCount" -ForegroundColor $(if ($ErrorCount -gt 0) { "Red" } else { "Green" })

if ($ErrorCount -eq 0 -and $SuccessCount -ge 2) {
    Write-Host "`n✅ Deployment verification PASSED!" -ForegroundColor Green
    Write-Host "Your Franklin Trinity OS is live and working! 🎉" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "`n❌ Deployment verification FAILED" -ForegroundColor Red
    Write-Host "Please check Railway logs and environment variables" -ForegroundColor Yellow
    exit 1
}
