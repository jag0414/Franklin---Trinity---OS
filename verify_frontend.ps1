#!/usr/bin/env pwsh
# Frontend Deployment Verification Script (PowerShell)

Write-Host "🔍 Verifying Frontend is Ready for Deployment..." -ForegroundColor Cyan
Write-Host ""

$allChecks = $true

# Check 1: Verify package.json exists
Write-Host "✓ Checking package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "  ✅ package.json found" -ForegroundColor Green
} else {
    Write-Host "  ❌ package.json not found" -ForegroundColor Red
    $allChecks = $false
}

# Check 2: Verify build script exists
Write-Host ""
Write-Host "✓ Checking build configuration..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw -ErrorAction SilentlyContinue
    if ($packageJson -and $packageJson -match '"build".*"vite build"') {
        Write-Host "  ✅ Build script configured" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Build script not found" -ForegroundColor Red
        $allChecks = $false
    }
} else {
    Write-Host "  ❌ package.json not found" -ForegroundColor Red
    $allChecks = $false
}

# Check 3: Verify vite.config.ts exists
Write-Host ""
Write-Host "✓ Checking Vite configuration..." -ForegroundColor Yellow
if (Test-Path "vite.config.ts") {
    Write-Host "  ✅ vite.config.ts found" -ForegroundColor Green
} else {
    Write-Host "  ❌ vite.config.ts not found" -ForegroundColor Red
    $allChecks = $false
}

# Check 4: Verify vercel.json exists
Write-Host ""
Write-Host "✓ Checking Vercel configuration..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "  ✅ vercel.json found" -ForegroundColor Green
    Write-Host "  📄 Content:" -ForegroundColor Cyan
    Get-Content "vercel.json" | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
} else {
    Write-Host "  ❌ vercel.json not found" -ForegroundColor Red
    $allChecks = $false
}

# Check 5: Verify index.html exists
Write-Host ""
Write-Host "✓ Checking HTML entry point..." -ForegroundColor Yellow
if (Test-Path "index.html") {
    Write-Host "  ✅ index.html found" -ForegroundColor Green
} else {
    Write-Host "  ❌ index.html not found" -ForegroundColor Red
    $allChecks = $false
}

# Check 6: Verify src/main.tsx exists
Write-Host ""
Write-Host "✓ Checking main entry point..." -ForegroundColor Yellow
if (Test-Path "src/main.tsx") {
    Write-Host "  ✅ src/main.tsx found" -ForegroundColor Green
} else {
    Write-Host "  ❌ src/main.tsx not found" -ForegroundColor Red
    $allChecks = $false
}

# Check 7: Verify API backend service exists
Write-Host ""
Write-Host "✓ Checking API integration..." -ForegroundColor Yellow
if (Test-Path "src/services/aiBackend.ts") {
    Write-Host "  ✅ aiBackend.ts found" -ForegroundColor Green
    Write-Host "  📡 API Base URL configuration:" -ForegroundColor Cyan
    $content = Get-Content "src/services/aiBackend.ts" -Raw -ErrorAction SilentlyContinue
    if ($content) {
        $match = $content | Select-String -Pattern 'const API_BASE_URL =[\s\S]*?;' -AllMatches
        if ($match -and $match.Matches -and $match.Matches.Count -gt 0) {
            $match.Matches[0].Value.Split("`n") | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
        }
    }
} else {
    Write-Host "  ❌ aiBackend.ts not found" -ForegroundColor Red
    $allChecks = $false
}

# Check 8: Try to build
Write-Host ""
Write-Host "✓ Testing production build..." -ForegroundColor Yellow
try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Build successful" -ForegroundColor Green
        if (Test-Path "dist") {
            Write-Host "  📦 Build output:" -ForegroundColor Cyan
            Get-ChildItem "dist" | ForEach-Object { 
                Write-Host "     $($_.Name)" -ForegroundColor Gray 
            }
            Write-Host ""
            Write-Host "  📊 Build size:" -ForegroundColor Cyan
            $size = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum
            $sizeKB = [math]::Round($size / 1KB, 2)
            Write-Host "     ${sizeKB}KB" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ❌ Build failed" -ForegroundColor Red
        Write-Host $buildOutput
        $allChecks = $false
    }
} catch {
    Write-Host "  ❌ Build failed: $_" -ForegroundColor Red
    $allChecks = $false
}

# Summary
Write-Host ""
if ($allChecks) {
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "✅ FRONTEND IS READY FOR DEPLOYMENT!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Go to vercel.com"
    Write-Host "  2. Import repository: jag0414/Franklin---Trinity---OS"
    Write-Host "  3. Set environment variable:"
    Write-Host "     VITE_API_BASE_URL=https://franklin-trinity-os-roosevelt.up.railway.app" -ForegroundColor Yellow
    Write-Host "  4. Deploy!"
    Write-Host ""
    Write-Host "📚 Documentation:" -ForegroundColor Cyan
    Write-Host "  • Quick Guide: DEPLOY_FRONTEND_QUICK.md"
    Write-Host "  • Full Guide:  FRONTEND_DEPLOYMENT.md"
    Write-Host ""
} else {
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "❌ SOME CHECKS FAILED!" -ForegroundColor Red
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the issues above before deploying." -ForegroundColor Red
    exit 1
}