#!/usr/bin/env python3
"""
Franklin Trinity OS - Automation Validation Script
Tests the automation setup and verifies all components are ready
"""

import os
import sys
import subprocess
import json
from pathlib import Path

# Colors for output
RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
CYAN = '\033[0;36m'
NC = '\033[0m'  # No Color

def log_info(msg):
    print(f"{CYAN}[INFO]{NC} {msg}")

def log_success(msg):
    print(f"{GREEN}[✓]{NC} {msg}")

def log_warning(msg):
    print(f"{YELLOW}[⚠]{NC} {msg}")

def log_error(msg):
    print(f"{RED}[✗]{NC} {msg}")

def check_file(filepath, required=True):
    """Check if a file exists"""
    if os.path.exists(filepath):
        log_success(f"Found: {filepath}")
        return True
    else:
        if required:
            log_error(f"Missing: {filepath}")
        else:
            log_warning(f"Optional file missing: {filepath}")
        return False

def check_command(cmd, name):
    """Check if a command is available"""
    try:
        result = subprocess.run([cmd, '--version'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if result.returncode == 0:
            version = result.stdout.strip().split('\n')[0]
            log_success(f"{name} available: {version}")
            return True
    except (subprocess.SubprocessError, FileNotFoundError):
        pass
    
    log_warning(f"{name} not available")
    return False

def check_python_packages():
    """Check if required Python packages are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'sqlmodel',
        'pydantic',
        'httpx',
        'jwt'
    ]
    
    log_info("Checking Python packages...")
    missing = []
    
    for package in required_packages:
        try:
            __import__(package)
            log_success(f"  {package}")
        except ImportError:
            log_error(f"  {package}")
            missing.append(package)
    
    if missing:
        log_warning(f"Missing packages: {', '.join(missing)}")
        log_info("Run: pip install -r requirements.txt")
        return False
    
    return True

def check_node_packages():
    """Check if Node.js packages are installed"""
    if os.path.exists('node_modules'):
        log_success("Node.js dependencies installed")
        return True
    else:
        log_warning("Node.js dependencies not installed")
        log_info("Run: npm install")
        return False

def check_automation_files():
    """Check automation-related files"""
    log_info("Checking automation files...")
    
    files = {
        'auto-launch.sh': True,
        'franklin-trinity.service': False,
        'docker-compose-full.yml': True,
        'Dockerfile': True,
        'Dockerfile.frontend': True,
        'AUTOMATION.md': True,
        'requirements.txt': True,
        'package.json': True,
    }
    
    all_good = True
    for filename, required in files.items():
        if not check_file(filename, required):
            if required:
                all_good = False
    
    return all_good

def check_executable_permissions():
    """Check if automation script is executable"""
    log_info("Checking file permissions...")
    
    if os.path.exists('auto-launch.sh'):
        if os.access('auto-launch.sh', os.X_OK):
            log_success("auto-launch.sh is executable")
            return True
        else:
            log_warning("auto-launch.sh is not executable")
            log_info("Run: chmod +x auto-launch.sh")
            return False
    
    return False

def check_environment():
    """Check environment configuration"""
    log_info("Checking environment configuration...")
    
    if os.path.exists('.env'):
        log_success(".env file exists")
        return True
    elif os.path.exists('.env.example'):
        log_warning(".env file missing, but .env.example exists")
        log_info("Run: cp .env.example .env")
        return False
    else:
        log_warning("No environment configuration found")
        return False

def check_directories():
    """Check required directories"""
    log_info("Checking directories...")
    
    dirs = ['logs', 'pids', 'uploads']
    for dirname in dirs:
        if os.path.exists(dirname):
            log_success(f"Directory exists: {dirname}")
        else:
            log_info(f"Creating directory: {dirname}")
            os.makedirs(dirname, exist_ok=True)
            log_success(f"Created: {dirname}")
    
    return True

def test_automation_script():
    """Test the automation script"""
    log_info("Testing automation script...")
    
    if not os.path.exists('auto-launch.sh'):
        log_error("auto-launch.sh not found")
        return False
    
    try:
        result = subprocess.run(['./auto-launch.sh', 'status'],
                              capture_output=True,
                              text=True,
                              timeout=10)
        
        if result.returncode == 0:
            log_success("Automation script test passed")
            return True
        else:
            log_error(f"Automation script test failed: {result.stderr}")
            return False
    except subprocess.SubprocessError as e:
        log_error(f"Failed to test automation script: {e}")
        return False

def main():
    """Main validation function"""
    print("\n" + "=" * 70)
    print(f"{GREEN}Franklin Trinity OS - Automation Validation{NC}")
    print("=" * 70 + "\n")
    
    results = {
        'Python': check_command('python3', 'Python'),
        'Node.js': check_command('node', 'Node.js'),
        'npm': check_command('npm', 'npm'),
        'Docker': check_command('docker', 'Docker'),
        'Git': check_command('git', 'Git'),
        'Automation Files': check_automation_files(),
        'Executable Permissions': check_executable_permissions(),
        'Environment Config': check_environment(),
        'Directories': check_directories(),
        'Python Packages': check_python_packages(),
        'Node Packages': check_node_packages(),
        'Automation Script': test_automation_script(),
    }
    
    print("\n" + "=" * 70)
    print(f"{CYAN}Validation Summary{NC}")
    print("=" * 70 + "\n")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for name, status in results.items():
        icon = f"{GREEN}✓{NC}" if status else f"{RED}✗{NC}"
        print(f"  {icon} {name}")
    
    print("\n" + "=" * 70)
    print(f"Results: {passed}/{total} checks passed")
    print("=" * 70 + "\n")
    
    if passed == total:
        log_success("All checks passed! System is ready for full automation mode.")
        print(f"\n{CYAN}Next steps:{NC}")
        print("  1. Configure API keys in .env file (optional)")
        print("  2. Run: ./auto-launch.sh start")
        print("  3. Access backend at http://localhost:8000")
        print("  4. Access frontend at http://localhost:8080")
        print(f"\n{CYAN}Documentation:{NC}")
        print("  - AUTOMATION.md - Full automation guide")
        print("  - README.md - Quick start guide")
        return 0
    else:
        log_warning(f"{total - passed} checks failed. Please fix the issues above.")
        print(f"\n{CYAN}Quick fixes:{NC}")
        if not results['Python Packages']:
            print("  pip install -r requirements.txt")
        if not results['Node Packages']:
            print("  npm install")
        if not results['Executable Permissions']:
            print("  chmod +x auto-launch.sh")
        if not results['Environment Config']:
            print("  cp .env.example .env")
        return 1

if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print(f"\n{YELLOW}Validation interrupted by user{NC}")
        sys.exit(1)
    except Exception as e:
        log_error(f"Validation failed with error: {e}")
        sys.exit(1)
