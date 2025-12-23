#!/bin/bash
# Frontend Deployment Verification Script

echo "🔍 Verifying Frontend is Ready for Deployment..."
echo ""

# Check 1: Verify package.json exists
echo "✓ Checking package.json..."
if [ -f "package.json" ]; then
    echo "  ✅ package.json found"
else
    echo "  ❌ package.json not found"
    exit 1
fi

# Check 2: Verify build script exists
echo ""
echo "✓ Checking build configuration..."
if grep -q '"build".*"vite build"' package.json; then
    echo "  ✅ Build script configured"
else
    echo "  ❌ Build script not found"
    exit 1
fi

# Check 3: Verify vite.config.ts exists
echo ""
echo "✓ Checking Vite configuration..."
if [ -f "vite.config.ts" ]; then
    echo "  ✅ vite.config.ts found"
else
    echo "  ❌ vite.config.ts not found"
    exit 1
fi

# Check 4: Verify vercel.json exists
echo ""
echo "✓ Checking Vercel configuration..."
if [ -f "vercel.json" ]; then
    echo "  ✅ vercel.json found"
    echo "  📄 Content:"
    cat vercel.json | sed 's/^/     /'
else
    echo "  ❌ vercel.json not found"
    exit 1
fi

# Check 5: Verify index.html exists
echo ""
echo "✓ Checking HTML entry point..."
if [ -f "index.html" ]; then
    echo "  ✅ index.html found"
else
    echo "  ❌ index.html not found"
    exit 1
fi

# Check 6: Verify src/main.tsx exists
echo ""
echo "✓ Checking main entry point..."
if [ -f "src/main.tsx" ]; then
    echo "  ✅ src/main.tsx found"
else
    echo "  ❌ src/main.tsx not found"
    exit 1
fi

# Check 7: Verify API backend service exists
echo ""
echo "✓ Checking API integration..."
if [ -f "src/services/aiBackend.ts" ]; then
    echo "  ✅ aiBackend.ts found"
    echo "  📡 API Base URL configuration:"
    grep -A 2 "API_BASE_URL" src/services/aiBackend.ts | sed 's/^/     /'
else
    echo "  ❌ aiBackend.ts not found"
    exit 1
fi

# Check 8: Try to build
echo ""
echo "✓ Testing production build..."
if npm run build > /dev/null 2>&1; then
    echo "  ✅ Build successful"
    echo "  📦 Build output:"
    ls -lh dist/ | tail -n +2 | sed 's/^/     /'
    echo ""
    echo "  📊 Build size:"
    du -sh dist/ | sed 's/^/     /'
else
    echo "  ❌ Build failed"
    exit 1
fi

# Summary
echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ FRONTEND IS READY FOR DEPLOYMENT!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "📋 Next Steps:"
echo "  1. Go to vercel.com"
echo "  2. Import repository: jag0414/Franklin---Trinity---OS"
echo "  3. Set environment variable:"
echo "     VITE_API_BASE_URL=https://franklin-trinity-os-roosevelt.up.railway.app"
echo "  4. Deploy!"
echo ""
echo "📚 Documentation:"
echo "  • Quick Guide: DEPLOY_FRONTEND_QUICK.md"
echo "  • Full Guide:  FRONTEND_DEPLOYMENT.md"
echo ""
