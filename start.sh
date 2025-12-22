#!/bin/bash
# Franklin OS Startup Script
# This script starts both the backend API and frontend dev server

set -e

echo "🚀 Franklin OS - Starting System..."
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Checking dependencies...${NC}"

# Install Python dependencies if needed
if [ ! -f "requirements.txt" ]; then
    echo -e "${YELLOW}⚠️  requirements.txt not found${NC}"
else
    echo -e "${GREEN}✓ Installing Python dependencies${NC}"
    python3 -m pip install -q -r requirements.txt
fi

# Install Node dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${GREEN}✓ Installing Node dependencies${NC}"
    npm install
fi

# Create PID file directory
mkdir -p .run

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    if [ -f .run/backend.pid ]; then
        kill $(cat .run/backend.pid) 2>/dev/null || true
        rm .run/backend.pid
    fi
    if [ -f .run/frontend.pid ]; then
        kill $(cat .run/frontend.pid) 2>/dev/null || true
        rm .run/frontend.pid
    fi
    echo -e "${GREEN}✓ Services stopped${NC}"
}

trap cleanup EXIT INT TERM

# Start backend
echo -e "${BLUE}🔧 Starting Backend API (port 8090)...${NC}"
python3 -m uvicorn app:app --host 0.0.0.0 --port 8090 --reload > .run/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > .run/backend.pid
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo -e "${BLUE}⏳ Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8090/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend failed to start${NC}"
        cat .run/backend.log
        exit 1
    fi
    sleep 1
done

# Start frontend
echo -e "${BLUE}🎨 Starting Frontend Dev Server (port 8080)...${NC}"
npm run dev > .run/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > .run/frontend.pid
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

# Wait for frontend to be ready
echo -e "${BLUE}⏳ Waiting for frontend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}⚠️  Frontend may still be starting...${NC}"
    fi
    sleep 1
done

echo ""
echo -e "${GREEN}=================================="
echo "🎉 Franklin OS is now running!"
echo "==================================${NC}"
echo ""
echo -e "Frontend:  ${BLUE}http://localhost:8080${NC}"
echo -e "Backend:   ${BLUE}http://localhost:8090${NC}"
echo -e "API Docs:  ${BLUE}http://localhost:8090/docs${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Tail logs
tail -f .run/backend.log .run/frontend.log
