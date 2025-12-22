#!/bin/bash

# Franklin OS - Quick Start Script
# This script helps you get Franklin OS up and running quickly

set -e

echo "🚀 Franklin OS - Quick Start"
echo "=============================="
echo ""

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm $(npm -v) detected${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
if npm install; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Build the project
echo "🔨 Building the project..."
if npm run build; then
    echo -e "${GREEN}✓ Build completed successfully${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Check if Python is available for backend
echo "🐍 Checking Python setup..."
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✓ Python3 $(python3 -V) detected${NC}"
    
    # Ask if user wants to start backend
    echo ""
    read -p "Do you want to install Python backend dependencies? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing Python dependencies..."
        pip3 install -r requirements.txt
        echo -e "${GREEN}✓ Python dependencies installed${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Python3 not found. Backend will not be available.${NC}"
fi

echo ""
echo "=============================="
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "To start the development server:"
echo -e "${YELLOW}npm run dev${NC}"
echo ""
echo "To start the backend (in a new terminal):"
echo -e "${YELLOW}python3 -m uvicorn app:app --reload${NC}"
echo ""
echo "To preview the production build:"
echo -e "${YELLOW}npm run preview${NC}"
echo ""
echo "📚 For more information, see:"
echo "  - README.md for full documentation"
echo "  - QUICKSTART.md for quick start guide"
echo "  - DEPLOYMENT.md for deployment options"
echo ""
echo "=============================="
