#!/bin/bash

# Franklin OS Cleanup Script
# This script removes build artifacts, cache, and resets the development environment

echo "🧹 Franklin OS Cleanup Script"
echo "============================="
echo ""

# Remove build artifacts
echo "📦 Removing build artifacts..."
rm -rf dist/
rm -rf build/
rm -rf .vite/
echo "✅ Build artifacts removed"
echo ""

# Remove Vite cache
echo "🗂️  Removing Vite cache..."
rm -rf node_modules/.vite/
echo "✅ Vite cache removed"
echo ""

# Remove Python cache
echo "🐍 Removing Python cache..."
find . -type d -name "__pycache__" -prune -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true
find . -type f -name "*.pyo" -delete 2>/dev/null || true
echo "✅ Python cache removed"
echo ""

# Optional: Remove node_modules (commented out by default)
# Uncomment the following lines to also remove node_modules
# echo "📚 Removing node_modules..."
# rm -rf node_modules/
# echo "✅ node_modules removed"
# echo ""

echo "✨ Cleanup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. If you removed node_modules, run: npm install"
echo "   2. Clear your browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)"
echo "   3. In DevTools, unregister any service workers"
echo "   4. Start the dev server: npm run dev"
echo ""
echo "🔗 For more help, see TROUBLESHOOTING.md"
