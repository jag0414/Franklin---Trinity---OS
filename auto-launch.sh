#!/bin/bash
# Franklin Trinity OS - Full Automation Mode Launcher
# This script provides automated startup with health checks, monitoring, and auto-recovery

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
BACKEND_PORT=${BACKEND_PORT:-8000}
FRONTEND_PORT=${FRONTEND_PORT:-8080}
MAX_RETRIES=${MAX_RETRIES:-3}
HEALTH_CHECK_TIMEOUT=${HEALTH_CHECK_TIMEOUT:-60}
AUTO_RESTART=${AUTO_RESTART:-true}
LOG_DIR="./logs"
PID_DIR="./pids"

# Create necessary directories
mkdir -p "$LOG_DIR" "$PID_DIR"

# Logging functions
log_info() {
    echo -e "${CYAN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -tuln 2>/dev/null | grep -q ":$port "; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Validate environment
validate_environment() {
    log_info "Validating environment..."
    
    # Check Python
    if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
        log_error "Python 3 is not installed. Please install Python 3.8 or higher."
        exit 1
    fi
    
    PYTHON_CMD=$(command -v python3 || command -v python)
    PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | grep -oP '\d+\.\d+')
    log_success "Python $PYTHON_VERSION detected"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_warning "Node.js is not installed. Frontend will not be available."
        return 1
    fi
    
    NODE_VERSION=$(node --version)
    log_success "Node.js $NODE_VERSION detected"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_warning "npm is not installed. Frontend will not be available."
        return 1
    fi
    
    return 0
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Backend dependencies
    if [ -f "requirements.txt" ]; then
        log_info "Installing Python dependencies..."
        $PYTHON_CMD -m pip install --quiet --upgrade pip
        $PYTHON_CMD -m pip install --quiet -r requirements.txt
        log_success "Python dependencies installed"
    fi
    
    # Frontend dependencies
    if [ -f "package.json" ] && command -v npm &> /dev/null; then
        log_info "Installing Node.js dependencies..."
        npm install --silent
        log_success "Node.js dependencies installed"
    fi
}

# Setup environment variables
setup_environment() {
    log_info "Setting up environment..."
    
    # Check if .env exists, if not create from example
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        log_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        log_info "Please edit .env file with your API keys for full functionality"
    fi
    
    # Load .env file if it exists
    if [ -f ".env" ]; then
        export $(cat .env | grep -v '^#' | xargs)
        log_success "Environment variables loaded"
    else
        log_warning "No .env file found. Running in mock mode."
    fi
    
    # Set default environment variables
    export PORT=${PORT:-$BACKEND_PORT}
    export NODE_ENV=${NODE_ENV:-production}
}

# Start backend server
start_backend() {
    log_info "Starting backend server on port $BACKEND_PORT..."
    
    # Check if port is already in use
    if check_port $BACKEND_PORT; then
        log_warning "Port $BACKEND_PORT is already in use. Attempting to stop existing process..."
        stop_backend
        sleep 2
    fi
    
    # Start backend
    cd "$(dirname "$0")"
    nohup $PYTHON_CMD -m uvicorn app:app --host 0.0.0.0 --port $BACKEND_PORT \
        > "$LOG_DIR/backend.log" 2>&1 &
    
    BACKEND_PID=$!
    echo $BACKEND_PID > "$PID_DIR/backend.pid"
    log_success "Backend server started with PID $BACKEND_PID"
    
    # Wait for backend to be ready
    wait_for_backend
}

# Wait for backend health check
wait_for_backend() {
    log_info "Waiting for backend to be ready..."
    local count=0
    local max_count=$HEALTH_CHECK_TIMEOUT
    
    while [ $count -lt $max_count ]; do
        if curl -s -f "http://localhost:$BACKEND_PORT/health" > /dev/null 2>&1; then
            log_success "Backend is ready and healthy"
            return 0
        fi
        sleep 1
        count=$((count + 1))
        if [ $((count % 10)) -eq 0 ]; then
            log_info "Still waiting for backend... ($count/$max_count)"
        fi
    done
    
    log_error "Backend failed to become ready within $HEALTH_CHECK_TIMEOUT seconds"
    return 1
}

# Start frontend server
start_frontend() {
    if ! command -v npm &> /dev/null; then
        log_warning "npm not available. Skipping frontend."
        return 1
    fi
    
    log_info "Starting frontend server on port $FRONTEND_PORT..."
    
    # Check if port is already in use
    if check_port $FRONTEND_PORT; then
        log_warning "Port $FRONTEND_PORT is already in use. Attempting to stop existing process..."
        stop_frontend
        sleep 2
    fi
    
    # Start frontend
    cd "$(dirname "$0")"
    nohup npm run dev -- --port $FRONTEND_PORT --host 0.0.0.0 \
        > "$LOG_DIR/frontend.log" 2>&1 &
    
    FRONTEND_PID=$!
    echo $FRONTEND_PID > "$PID_DIR/frontend.pid"
    log_success "Frontend server started with PID $FRONTEND_PID"
    
    # Wait for frontend to be ready
    wait_for_frontend
}

# Wait for frontend health check
wait_for_frontend() {
    log_info "Waiting for frontend to be ready..."
    local count=0
    local max_count=$HEALTH_CHECK_TIMEOUT
    
    while [ $count -lt $max_count ]; do
        if check_port $FRONTEND_PORT; then
            log_success "Frontend is ready"
            return 0
        fi
        sleep 1
        count=$((count + 1))
        if [ $((count % 10)) -eq 0 ]; then
            log_info "Still waiting for frontend... ($count/$max_count)"
        fi
    done
    
    log_error "Frontend failed to become ready within $HEALTH_CHECK_TIMEOUT seconds"
    return 1
}

# Stop backend server
stop_backend() {
    if [ -f "$PID_DIR/backend.pid" ]; then
        local pid=$(cat "$PID_DIR/backend.pid")
        if ps -p $pid > /dev/null 2>&1; then
            log_info "Stopping backend server (PID $pid)..."
            kill $pid 2>/dev/null || true
            sleep 2
            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                kill -9 $pid 2>/dev/null || true
            fi
            rm -f "$PID_DIR/backend.pid"
            log_success "Backend server stopped"
        fi
    fi
    
    # Also kill any process on the backend port
    if check_port $BACKEND_PORT; then
        local pid=$(lsof -ti:$BACKEND_PORT 2>/dev/null || true)
        if [ -n "$pid" ]; then
            kill $pid 2>/dev/null || true
        fi
    fi
}

# Stop frontend server
stop_frontend() {
    if [ -f "$PID_DIR/frontend.pid" ]; then
        local pid=$(cat "$PID_DIR/frontend.pid")
        if ps -p $pid > /dev/null 2>&1; then
            log_info "Stopping frontend server (PID $pid)..."
            kill $pid 2>/dev/null || true
            sleep 2
            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                kill -9 $pid 2>/dev/null || true
            fi
            rm -f "$PID_DIR/frontend.pid"
            log_success "Frontend server stopped"
        fi
    fi
    
    # Also kill any process on the frontend port
    if check_port $FRONTEND_PORT; then
        local pid=$(lsof -ti:$FRONTEND_PORT 2>/dev/null || true)
        if [ -n "$pid" ]; then
            kill $pid 2>/dev/null || true
        fi
    fi
}

# Monitor processes and restart if needed
monitor_processes() {
    log_info "Starting process monitor..."
    
    while true; do
        # Check backend
        if [ -f "$PID_DIR/backend.pid" ]; then
            local backend_pid=$(cat "$PID_DIR/backend.pid")
            if ! ps -p $backend_pid > /dev/null 2>&1; then
                log_error "Backend process died. Restarting..."
                start_backend
            elif ! curl -s -f "http://localhost:$BACKEND_PORT/health" > /dev/null 2>&1; then
                log_warning "Backend health check failed. Restarting..."
                stop_backend
                start_backend
            fi
        fi
        
        # Check frontend
        if [ -f "$PID_DIR/frontend.pid" ]; then
            local frontend_pid=$(cat "$PID_DIR/frontend.pid")
            if ! ps -p $frontend_pid > /dev/null 2>&1; then
                log_error "Frontend process died. Restarting..."
                start_frontend
            fi
        fi
        
        sleep 10
    done
}

# Display status
show_status() {
    echo ""
    echo "======================================================================"
    echo -e "${GREEN}Franklin Trinity OS - Full Automation Mode${NC}"
    echo "======================================================================"
    echo ""
    
    # Backend status
    if [ -f "$PID_DIR/backend.pid" ]; then
        local backend_pid=$(cat "$PID_DIR/backend.pid")
        if ps -p $backend_pid > /dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} Backend:  Running (PID $backend_pid) on http://localhost:$BACKEND_PORT"
            echo "           API Docs:    http://localhost:$BACKEND_PORT/docs"
            echo "           Health:      http://localhost:$BACKEND_PORT/health"
        else
            echo -e "${RED}✗${NC} Backend:  Not running"
        fi
    else
        echo -e "${RED}✗${NC} Backend:  Not started"
    fi
    
    echo ""
    
    # Frontend status
    if [ -f "$PID_DIR/frontend.pid" ]; then
        local frontend_pid=$(cat "$PID_DIR/frontend.pid")
        if ps -p $frontend_pid > /dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} Frontend: Running (PID $frontend_pid) on http://localhost:$FRONTEND_PORT"
        else
            echo -e "${RED}✗${NC} Frontend: Not running"
        fi
    else
        echo -e "${YELLOW}⚠${NC} Frontend: Not started"
    fi
    
    echo ""
    echo "======================================================================"
    echo -e "Logs:     ${CYAN}tail -f $LOG_DIR/backend.log${NC}"
    echo -e "          ${CYAN}tail -f $LOG_DIR/frontend.log${NC}"
    echo -e "Stop:     ${CYAN}$0 stop${NC}"
    echo -e "Restart:  ${CYAN}$0 restart${NC}"
    echo -e "Status:   ${CYAN}$0 status${NC}"
    echo "======================================================================"
    echo ""
}

# Cleanup on exit
cleanup() {
    log_info "Cleaning up..."
    stop_backend
    stop_frontend
    log_success "Cleanup complete"
}

# Handle interrupt signals
trap cleanup EXIT INT TERM

# Main function
main() {
    local command=${1:-start}
    
    case "$command" in
        start)
            log_info "Starting Franklin Trinity OS in full automation mode..."
            validate_environment
            setup_environment
            install_dependencies
            start_backend
            start_frontend
            show_status
            
            if [ "$AUTO_RESTART" = "true" ]; then
                log_info "Auto-restart is enabled. Monitoring processes..."
                log_info "Press Ctrl+C to stop all services"
                monitor_processes
            else
                log_success "All services started successfully!"
                log_info "Run '$0 stop' to stop all services"
            fi
            ;;
            
        stop)
            log_info "Stopping all services..."
            stop_backend
            stop_frontend
            log_success "All services stopped"
            ;;
            
        restart)
            log_info "Restarting all services..."
            stop_backend
            stop_frontend
            sleep 2
            start_backend
            start_frontend
            show_status
            log_success "All services restarted"
            ;;
            
        status)
            show_status
            ;;
            
        logs)
            local service=${2:-backend}
            if [ "$service" = "backend" ]; then
                tail -f "$LOG_DIR/backend.log"
            elif [ "$service" = "frontend" ]; then
                tail -f "$LOG_DIR/frontend.log"
            else
                log_error "Unknown service: $service. Use 'backend' or 'frontend'"
                exit 1
            fi
            ;;
            
        *)
            echo "Usage: $0 {start|stop|restart|status|logs [backend|frontend]}"
            echo ""
            echo "Commands:"
            echo "  start    - Start all services with auto-restart monitoring"
            echo "  stop     - Stop all services"
            echo "  restart  - Restart all services"
            echo "  status   - Show status of all services"
            echo "  logs     - Tail logs for specified service"
            echo ""
            echo "Environment Variables:"
            echo "  BACKEND_PORT           - Backend server port (default: 8000)"
            echo "  FRONTEND_PORT          - Frontend server port (default: 8080)"
            echo "  MAX_RETRIES            - Maximum retry attempts (default: 3)"
            echo "  HEALTH_CHECK_TIMEOUT   - Health check timeout in seconds (default: 60)"
            echo "  AUTO_RESTART           - Enable auto-restart (default: true)"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
