#!/bin/bash
# Setup script for Franklin Trinity OS development environment
# This script configures security hooks and validates the environment

set -e

echo "🚀 Franklin Trinity OS - Development Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file found${NC}"
else
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "   Creating from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env from template${NC}"
    echo -e "${YELLOW}   ⚠️  IMPORTANT: Edit .env and add your API keys!${NC}"
fi

# Configure git hooks
echo ""
echo "🔒 Configuring security hooks..."
if [ -d ".githooks" ]; then
    chmod +x .githooks/pre-commit 2>/dev/null || true
    git config core.hooksPath .githooks
    echo -e "${GREEN}✅ Git hooks configured${NC}"
    echo "   Pre-commit hook will scan for API keys before each commit"
else
    echo -e "${RED}❌ .githooks directory not found${NC}"
    exit 1
fi

# Verify .gitignore
echo ""
echo "🔍 Verifying .gitignore..."
if grep -q "^\.env$" .gitignore; then
    echo -e "${GREEN}✅ .env is properly gitignored${NC}"
else
    echo -e "${RED}❌ .env not in .gitignore!${NC}"
    echo "   Adding .env to .gitignore..."
    echo ".env" >> .gitignore
    echo -e "${GREEN}✅ Added .env to .gitignore${NC}"
fi

# Check for accidentally committed .env
echo ""
echo "🔍 Checking for committed secrets..."
if git ls-files | grep -q "^\.env$"; then
    echo -e "${RED}❌ WARNING: .env file is tracked by git!${NC}"
    echo "   This is a security risk. To fix:"
    echo "   1. git rm --cached .env"
    echo "   2. git commit -m 'Remove .env from version control'"
    echo "   3. Ensure .env is in .gitignore"
else
    echo -e "${GREEN}✅ No .env file in git history${NC}"
fi

# Install Python dependencies (optional)
echo ""
read -p "Install Python dependencies? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Installing Python dependencies..."
    if command -v pip &> /dev/null; then
        pip install -r requirements.txt
        echo -e "${GREEN}✅ Python dependencies installed${NC}"
    else
        echo -e "${RED}❌ pip not found. Install Python and pip first.${NC}"
    fi
fi

# Install Node dependencies (optional)
echo ""
read -p "Install Node dependencies? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Installing Node dependencies..."
    if command -v npm &> /dev/null; then
        npm install
        echo -e "${GREEN}✅ Node dependencies installed${NC}"
    else
        echo -e "${RED}❌ npm not found. Install Node.js first.${NC}"
    fi
fi

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "   1. Edit .env and add your API keys (see SECURITY.md)"
echo "   2. Run the backend: ./Start_Backend.ps1 or python app.py"
echo "   3. Run the frontend: ./Start_Frontend.ps1 or npm run dev"
echo ""
echo "📖 Documentation:"
echo "   - SECURITY.md - API key security guidelines"
echo "   - README.md - Getting started guide"
echo "   - PRODUCTION_READY.md - Deployment checklist"
echo ""
echo "🔒 Security is enabled:"
echo "   - Pre-commit hooks will scan for API keys"
echo "   - .env is gitignored"
echo "   - See SECURITY.md for best practices"
echo ""
