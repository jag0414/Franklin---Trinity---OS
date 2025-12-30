#!/usr/bin/env python3
"""
Franklin Trinity OS - System Validation Script

Tests all critical system components to ensure proper operation.
Run this after any changes to verify system health.
"""

from app import app, engine, User, CognitiveMemory, AIResponseCache
from fastapi.testclient import TestClient
from sqlmodel import Session, select
import os
import sys

def test_api_endpoints():
    """Test critical API endpoints"""
    print('1. Testing Backend API Endpoints...')
    client = TestClient(app)
    
    endpoints = [
        ('/health', 'Health Check'),
        ('/api/ai/pipelines', 'AI Pipelines List'),
        ('/', 'Home Page'),
    ]
    
    all_passed = True
    for endpoint, name in endpoints:
        try:
            response = client.get(endpoint)
            if response.status_code == 200:
                print(f'   ✅ {name}: {response.status_code}')
            else:
                print(f'   ❌ {name}: {response.status_code}')
                all_passed = False
        except Exception as e:
            print(f'   ❌ {name}: {e}')
            all_passed = False
    
    return all_passed

def test_database():
    """Test database connection and models"""
    print('\n2. Testing Database Connection...')
    try:
        with Session(engine) as session:
            from sqlalchemy import text
            result = session.execute(text('SELECT 1')).fetchone()
            print(f'   ✅ Database query successful')
        
        print('\n3. Testing Database Models...')
        with Session(engine) as session:
            user_count = len(session.exec(select(User)).all())
            memory_count = len(session.exec(select(CognitiveMemory)).all())
            cache_count = len(session.exec(select(AIResponseCache)).all())
            print(f'   ✅ Users: {user_count} records')
            print(f'   ✅ Cognitive Memories: {memory_count} records')
            print(f'   ✅ AI Cache: {cache_count} records')
        
        return True
    except Exception as e:
        print(f'   ❌ Database error: {e}')
        return False

def test_configuration():
    """Test configuration settings"""
    print('\n4. Testing Configuration...')
    configs = [
        ('FRANKLIN_JWT_SECRET', 'JWT Secret', 'CHANGE_ME_NOW'),
        ('FRANKLIN_DB_URL', 'Database URL', None),
        ('OPENAI_API_KEY', 'OpenAI API Key', None),
        ('ANTHROPIC_API_KEY', 'Anthropic API Key', None),
        ('GOOGLE_API_KEY', 'Google API Key', None),
    ]
    
    config_ok = True
    for key, name, default in configs:
        value = os.getenv(key)
        if value and value != default:
            print(f'   ✅ {name}: Configured')
        elif key in ['FRANKLIN_JWT_SECRET', 'FRANKLIN_DB_URL']:
            print(f'   ⚠️  {name}: Using default (set in production!)')
            if value == default:
                config_ok = False
        else:
            print(f'   ⚠️  {name}: Not set (optional, mock mode available)')
    
    return config_ok

def main():
    """Run all validation tests"""
    print('=== Franklin Trinity OS - System Validation ===\n')
    
    results = {
        'API Endpoints': test_api_endpoints(),
        'Database': test_database(),
        'Configuration': test_configuration(),
    }
    
    print('\n=== Validation Results ===')
    all_passed = True
    for component, passed in results.items():
        status = '✅' if passed else '❌'
        print(f'{status} {component}: {"PASS" if passed else "FAIL"}')
        if not passed:
            all_passed = False
    
    if all_passed:
        print('\n✅ System Status: ALL CHECKS PASSED')
        return 0
    else:
        print('\n⚠️  System Status: SOME CHECKS FAILED')
        print('   Review the output above for details.')
        return 1

if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print('\n\n⚠️  Validation interrupted by user')
        sys.exit(130)
    except Exception as e:
        print(f'\n\n❌ Validation error: {e}')
        import traceback
        traceback.print_exc()
        sys.exit(1)
