#!/bin/bash
# Franklin OS - Integration Test Script
# Tests all major components and endpoints

set -e

echo "🧪 Franklin OS Integration Test Suite"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected="$3"
    
    echo -ne "${BLUE}Testing ${name}...${NC} "
    
    if response=$(curl -s "$url"); then
        if echo "$response" | grep -q "$expected"; then
            echo -e "${GREEN}✓ PASS${NC}"
            ((PASS_COUNT++))
            return 0
        else
            echo -e "${RED}✗ FAIL${NC} (unexpected response)"
            echo "  Response: $response"
            ((FAIL_COUNT++))
            return 1
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (connection failed)"
        ((FAIL_COUNT++))
        return 1
    fi
}

# Test file exists
test_file() {
    local name="$1"
    local path="$2"
    
    echo -ne "${BLUE}Checking ${name}...${NC} "
    
    if [ -f "$path" ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASS_COUNT++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (file not found)"
        ((FAIL_COUNT++))
        return 1
    fi
}

echo "📁 File Structure Tests"
echo "----------------------"
test_file "index.html" "./index.html"
test_file "requirements.txt" "./requirements.txt"
test_file "start.sh" "./start.sh"
test_file "QUICKSTART.md" "./QUICKSTART.md"
test_file "package.json" "./package.json"
test_file "app.py" "./app.py"
echo ""

echo "🏗️ Build Tests"
echo "----------------------"
echo -ne "${BLUE}Testing frontend build...${NC} "
if [ -d "./dist" ] && [ -f "./dist/index.html" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASS_COUNT++))
else
    echo -e "${RED}✗ FAIL${NC} (dist folder not found or incomplete)"
    ((FAIL_COUNT++))
fi
echo ""

echo "🔧 Python Import Tests"
echo "----------------------"
echo -ne "${BLUE}Testing app imports...${NC} "
if python3 -c "from app import app, health" 2>/dev/null; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASS_COUNT++))
else
    echo -e "${RED}✗ FAIL${NC} (import failed)"
    ((FAIL_COUNT++))
fi
echo ""

echo "🚀 Backend API Tests"
echo "----------------------"
echo "Starting backend server..."
python3 -m uvicorn app:app --host 0.0.0.0 --port 8090 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}Backend started (PID: $BACKEND_PID)${NC}"
    
    test_endpoint "Health check" "http://localhost:8090/health" "ok"
    test_endpoint "Root endpoint" "http://localhost:8090/" "Franklin OS"
    test_endpoint "Requests list" "http://localhost:8090/requests" "\\[\\]"
    
    # Test POST endpoint
    echo -ne "${BLUE}Testing user registration...${NC} "
    if response=$(curl -s -X POST "http://localhost:8090/auth/register?email=test@example.com&role=client"); then
        if echo "$response" | grep -q "token"; then
            echo -e "${GREEN}✓ PASS${NC}"
            ((PASS_COUNT++))
        else
            echo -e "${RED}✗ FAIL${NC} (no token in response)"
            ((FAIL_COUNT++))
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (request failed)"
        ((FAIL_COUNT++))
    fi
    
    echo ""
    echo "Stopping backend..."
    kill $BACKEND_PID 2>/dev/null || true
    wait $BACKEND_PID 2>/dev/null || true
else
    echo -e "${RED}Backend failed to start${NC}"
    ((FAIL_COUNT++))
fi

echo ""
echo "======================================"
echo "📊 Test Results"
echo "======================================"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
