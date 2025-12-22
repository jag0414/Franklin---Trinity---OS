#!/bin/bash

# Franklin OS - Complete System Startup Script

echo "🚀 Starting Franklin OS - Complete System"
echo "=========================================="
echo ""

# Check if Python backend should be started
if [ "$1" == "--with-backend" ]; then
    echo "📦 Starting Backend Services..."
    
    # Check for required environment variables
    if [ -z "$GEMINI_API_KEY" ]; then
        echo "⚠️  Warning: GEMINI_API_KEY not set"
    fi
    
    # Start backend in background
    echo "Starting Unified AI Backend on port 8000..."
    python unified_ai_backend.py &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    
    # Wait for backend to start
    sleep 3
    
    # Health check
    if curl -s http://localhost:8000/api/health > /dev/null; then
        echo "✅ Backend is healthy"
    else
        echo "❌ Backend health check failed"
    fi
    
    echo ""
fi

# Start frontend
echo "🎨 Starting Frontend Development Server..."
echo "Frontend will be available at: http://localhost:8080"
echo ""

npm run dev

# Cleanup on exit
if [ ! -z "$BACKEND_PID" ]; then
    echo ""
    echo "🛑 Stopping backend..."
    kill $BACKEND_PID
fi
