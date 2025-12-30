# Setup script for Franklin Trinity OS development environment
# This script configures security hooks and validates the environment

Write-Host "🚀 Franklin Trinity OS - Development Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    Write-Host "   Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env from template" -ForegroundColor Green
    Write-Host "   ⚠️  IMPORTANT: Edit .env and add your API keys!" -ForegroundColor Yellow
}

# Configure git hooks
Write-Host ""
Write-Host "🔒 Configuring security hooks..." -ForegroundColor Cyan
if (Test-Path ".githooks") {
    git config core.hooksPath .githooks
    Write-Host "✅ Git hooks configured" -ForegroundColor Green
    Write-Host "   Pre-commit hook will scan for API keys before each commit" -ForegroundColor Gray
} else {
    Write-Host "❌ .githooks directory not found" -ForegroundColor Red
    exit 1
}

# Verify .gitignore
Write-Host ""
Write-Host "🔍 Verifying .gitignore..." -ForegroundColor Cyan
$gitignoreContent = Get-Content ".gitignore" -Raw
if ($gitignoreContent -match "^\\.env$") {
    Write-Host "✅ .env is properly gitignored" -ForegroundColor Green
} else {
    Write-Host "❌ .env not in .gitignore!" -ForegroundColor Red
    Write-Host "   Adding .env to .gitignore..." -ForegroundColor Yellow
    Add-Content ".gitignore" "`n.env"
    Write-Host "✅ Added .env to .gitignore" -ForegroundColor Green
}

# Check for accidentally committed .env
Write-Host ""
Write-Host "🔍 Checking for committed secrets..." -ForegroundColor Cyan
$trackedFiles = git ls-files
if ($trackedFiles -match "^\\.env$") {
    Write-Host "❌ WARNING: .env file is tracked by git!" -ForegroundColor Red
    Write-Host "   This is a security risk. To fix:" -ForegroundColor Yellow
    Write-Host "   1. git rm --cached .env" -ForegroundColor Yellow
    Write-Host "   2. git commit -m 'Remove .env from version control'" -ForegroundColor Yellow
    Write-Host "   3. Ensure .env is in .gitignore" -ForegroundColor Yellow
} else {
    Write-Host "✅ No .env file in git history" -ForegroundColor Green
}

# Install Python dependencies (optional)
Write-Host ""
$installPython = Read-Host "Install Python dependencies? (y/n)"
if ($installPython -eq "y" -or $installPython -eq "Y") {
    Write-Host "📦 Installing Python dependencies..." -ForegroundColor Cyan
    if (Get-Command pip -ErrorAction SilentlyContinue) {
        pip install -r requirements.txt
        Write-Host "✅ Python dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ pip not found. Install Python and pip first." -ForegroundColor Red
    }
}

# Install Node dependencies (optional)
Write-Host ""
$installNode = Read-Host "Install Node dependencies? (y/n)"
if ($installNode -eq "y" -or $installNode -eq "Y") {
    Write-Host "📦 Installing Node dependencies..." -ForegroundColor Cyan
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        npm install
        Write-Host "✅ Node dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ npm not found. Install Node.js first." -ForegroundColor Red
    }
}

# Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Edit .env and add your API keys (see SECURITY.md)"
Write-Host "   2. Run the backend: .\Start_Backend.ps1"
Write-Host "   3. Run the frontend: .\Start_Frontend.ps1"
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "   - SECURITY.md - API key security guidelines"
Write-Host "   - README.md - Getting started guide"
Write-Host "   - PRODUCTION_READY.md - Deployment checklist"
Write-Host ""
Write-Host "🔒 Security is enabled:" -ForegroundColor Cyan
Write-Host "   - Pre-commit hooks will scan for API keys"
Write-Host "   - .env is gitignored"
Write-Host "   - See SECURITY.md for best practices"
Write-Host ""
