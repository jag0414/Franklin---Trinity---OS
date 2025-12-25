# Franklin OS Cleanup Script (PowerShell)
# This script removes build artifacts, cache, and resets the development environment

Write-Host "🧹 Franklin OS Cleanup Script" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Remove build artifacts
Write-Host "📦 Removing build artifacts..." -ForegroundColor Yellow
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".vite" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Build artifacts removed" -ForegroundColor Green
Write-Host ""

# Remove Vite cache
Write-Host "🗂️  Removing Vite cache..." -ForegroundColor Yellow
Remove-Item -Path "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Vite cache removed" -ForegroundColor Green
Write-Host ""

# Remove Python cache
Write-Host "🐍 Removing Python cache..." -ForegroundColor Yellow
Get-ChildItem -Path . -Directory -Filter "__pycache__" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
Get-ChildItem -Path . -File -Filter "*.pyc" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem -Path . -File -Filter "*.pyo" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force
Write-Host "✅ Python cache removed" -ForegroundColor Green
Write-Host ""

# Optional: Remove node_modules (commented out by default)
# Uncomment the following lines to also remove node_modules
# Write-Host "📚 Removing node_modules..." -ForegroundColor Yellow
# Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
# Write-Host "✅ node_modules removed" -ForegroundColor Green
# Write-Host ""

Write-Host "✨ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. If you removed node_modules, run: npm install"
Write-Host "   2. Clear your browser cache (Ctrl+Shift+Delete)"
Write-Host "   3. In DevTools, unregister any service workers"
Write-Host "   4. Start the dev server: npm run dev"
Write-Host ""
Write-Host "🔗 For more help, see TROUBLESHOOTING.md" -ForegroundColor Cyan
