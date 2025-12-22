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

# Function to check command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Check if Node.js is installed
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION detected${NC}"

# Check if npm is installed
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm $NPM_VERSION detected${NC}"
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
if command_exists python3; then
    PYTHON_VERSION=$(python3 -V)
    echo -e "${GREEN}✓ Python3 $PYTHON_VERSION detected${NC}"
    
    # Ask if user wants to start backend
    echo ""
    read -p "Do you want to install Python backend dependencies? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Setting up Python virtual environment..."
        
        # Create virtual environment if it doesn't exist
        if [ ! -d "venv" ]; then
            python3 -m venv venv
            echo -e "${GREEN}✓ Virtual environment created${NC}"
        fi
        
        # Activate virtual environment
        echo "Activating virtual environment..."
        source venv/bin/activate || . venv/Scripts/activate 2>/dev/null || {
            echo -e "${YELLOW}⚠ Could not activate virtual environment automatically${NC}"
            echo "Please run: source venv/bin/activate (Linux/Mac) or venv\\Scripts\\activate (Windows)"
        }
        
        # Install dependencies
        echo "Installing Python dependencies..."
        if pip install -r requirements.txt; then
            echo -e "${GREEN}✓ Python dependencies installed${NC}"
            echo ""
            echo -e "${YELLOW}Note: Virtual environment created at ./venv${NC}"
            echo -e "${YELLOW}Activate it with: source venv/bin/activate${NC}"
        else
            echo -e "${RED}❌ Failed to install Python dependencies${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠ Python3 not found. Backend will not be available.${NC}"
    echo "Install Python 3.11+ from https://www.python.org/ to use the backend."
fi

echo ""
echo "=============================="
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. To start the development server:"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "2. To start the backend (in a new terminal):"
echo -e "   ${YELLOW}source venv/bin/activate  # Activate virtual environment${NC}"
echo -e "   ${YELLOW}python3 -m uvicorn app:app --reload${NC}"
echo ""
echo "3. To preview the production build:"
echo -e "   ${YELLOW}npm run preview${NC}"
echo ""
echo "📚 For more information, see:"
echo "  - README.md for full documentation"
echo "  - QUICKSTART.md for quick start guide"
echo "  - DEPLOYMENT.md for deployment options"
echo ""
echo "=============================="
