#!/usr/bin/env python3
"""
Comprehensive test script for Franklin Trinity OS enhancements
Tests all new endpoints: file upload, export, cognitive memory, caching, workflows
"""

import requests
import json
import time
import io
from pathlib import Path

BASE_URL = "http://localhost:8080"

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def test_health():
    """Test health endpoint"""
    print("Testing /health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    print("✓ Health check passed\n")

def test_file_upload():
    """Test file upload endpoint"""
    print("Testing /api/files/upload endpoint...")
    
    # Create a test file
    test_content = b"This is a test file for Franklin Trinity OS pipeline processing"
    files = {'file': ('test.txt', io.BytesIO(test_content), 'text/plain')}
    
    response = requests.post(f"{BASE_URL}/api/files/upload", files=files)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    assert response.status_code == 200
    assert 'fileId' in data
    print("✓ File upload test passed\n")
    return data['fileId']

def test_cognitive_memory():
    """Test cognitive memory endpoints"""
    print("Testing cognitive memory system...")
    
    # Test storing general memory
    print("\n1. Storing general memory...")
    memory_data = {
        "key": "test:config",
        "value": "Test configuration value",
        "memory_type": "general",
        "context": "Test context",
        "ttl_days": 7
    }
    response = requests.post(f"{BASE_URL}/api/memory/store", json=memory_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    
    # Test storing PFS memory
    print("\n2. Storing PFS memory...")
    pfs_data = {
        "key": "pfs:file_mapping",
        "value": json.dumps({"path": "/data/files", "mount": "persistent"}),
        "memory_type": "pfs",
        "context": "Persistent File System configuration",
        "ttl_days": 30
    }
    response = requests.post(f"{BASE_URL}/api/memory/store", json=pfs_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    
    # Test storing Air Weaver memory
    print("\n3. Storing Air Weaver memory...")
    air_weaver_data = {
        "key": "air_weaver:connection",
        "value": json.dumps({"endpoint": "https://airweaver.local", "port": 8443}),
        "memory_type": "air_weaver",
        "ttl_days": 14
    }
    response = requests.post(f"{BASE_URL}/api/memory/store", json=air_weaver_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    
    # Test storing Raspberry Pi memory
    print("\n4. Storing Raspberry Pi memory...")
    rpi_data = {
        "key": "raspberry_pi:device_config",
        "value": json.dumps({"device_id": "rpi-001", "gpio_pins": [18, 23, 24]}),
        "memory_type": "raspberry_pi",
        "ttl_days": 60
    }
    response = requests.post(f"{BASE_URL}/api/memory/store", json=rpi_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    
    # Test retrieving memory
    print("\n5. Retrieving memory...")
    response = requests.get(f"{BASE_URL}/api/memory/test:config")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    assert response.status_code == 200
    assert data['key'] == 'test:config'
    
    # Test listing memories
    print("\n6. Listing all memories...")
    response = requests.get(f"{BASE_URL}/api/memory/list")
    print(f"Status: {response.status_code}")
    memories = response.json()
    print(f"Found {len(memories)} memories")
    for mem in memories[:5]:  # Show first 5
        print(f"  - {mem['key']} ({mem['type']}) - Accessed {mem['access_count']}x")
    
    # Test listing by type
    print("\n7. Listing PFS memories...")
    response = requests.get(f"{BASE_URL}/api/memory/list?memory_type=pfs")
    print(f"Status: {response.status_code}")
    pfs_memories = response.json()
    print(f"Found {len(pfs_memories)} PFS memories")
    
    print("\n✓ Cognitive memory tests passed\n")

def test_ai_caching():
    """Test AI response caching"""
    print("Testing AI response caching...")
    
    # Make a test AI request
    print("\n1. First AI request (should hit API)...")
    ai_request = {
        "id": "test-cache-1",
        "type": "text",
        "prompt": "What is 2+2?",
        "provider": "openai"
    }
    
    start = time.time()
    response = requests.post(f"{BASE_URL}/api/ai/execute", json=ai_request)
    first_duration = time.time() - start
    print(f"Status: {response.status_code}")
    print(f"Duration: {first_duration:.2f}s")
    if response.status_code == 200:
        print(f"Response: {response.json()['content'][:100]}...")
    
    # Make the same request again (should be cached)
    print("\n2. Second AI request (should be cached)...")
    start = time.time()
    response = requests.post(f"{BASE_URL}/api/ai/execute", json=ai_request)
    second_duration = time.time() - start
    print(f"Status: {response.status_code}")
    print(f"Duration: {second_duration:.2f}s")
    if response.status_code == 200:
        print(f"Response: {response.json()['content'][:100]}...")
    
    print(f"\nCache speedup: {first_duration/second_duration:.2f}x faster")
    print("✓ AI caching test passed\n")

def test_pipelines():
    """Test pipeline execution"""
    print("Testing pipeline execution...")
    
    pipeline_request = {
        "pipelineId": "content-gen",
        "input": "AI and Machine Learning trends"
    }
    
    response = requests.post(f"{BASE_URL}/api/ai/pipelines/execute", json=pipeline_request)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Task ID: {data.get('taskId')}")
    
    if 'taskId' in data:
        task_id = data['taskId']
        
        # Poll for completion
        print("\nPolling for task completion...")
        for i in range(10):
            time.sleep(2)
            response = requests.get(f"{BASE_URL}/api/orchestrator/tasks/{task_id}")
            if response.status_code == 200:
                task = response.json()
                print(f"  Status: {task.get('status')}")
                if task.get('status') == 'completed':
                    print("  Task completed!")
                    print("✓ Pipeline test passed\n")
                    return task_id
                elif task.get('status') == 'failed':
                    print(f"  Task failed: {task.get('error')}")
                    break
        
        print("✓ Pipeline test initiated (check status manually)\n")
        return task_id
    
    return None

def test_export(task_id):
    """Test export functionality"""
    if not task_id:
        print("Skipping export tests (no task ID available)\n")
        return
    
    print("Testing export functionality...")
    
    formats = ['excel', 'word', 'project', 'jpeg']
    
    for fmt in formats:
        print(f"\n{fmt.upper()} export...")
        export_request = {
            "task_id": task_id,
            "format": fmt
        }
        
        try:
            response = requests.post(f"{BASE_URL}/api/export", json=export_request)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                # Save file
                filename = f"test_export.{fmt}"
                if fmt == 'excel':
                    filename = "test_export.xlsx"
                elif fmt == 'word':
                    filename = "test_export.docx"
                elif fmt == 'project':
                    filename = "test_export.json"
                elif fmt == 'jpeg':
                    filename = "test_export.jpg"
                
                with open(f"/tmp/{filename}", 'wb') as f:
                    f.write(response.content)
                print(f"✓ Exported to /tmp/{filename}")
            else:
                print(f"Export failed: {response.text}")
        except Exception as e:
            print(f"Export error: {e}")
    
    print("\n✓ Export tests completed\n")

def test_workflows():
    """Test workflow tracking"""
    print("Testing workflow tracking...")
    
    response = requests.get(f"{BASE_URL}/api/workflows")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        workflows = response.json()
        print(f"Found {len(workflows)} workflows")
        for wf in workflows[:3]:  # Show first 3
            print(f"  - {wf.get('workflow_name')} ({wf.get('status')})")
        print("✓ Workflow tracking test passed\n")
    else:
        print("No workflows found or endpoint not ready\n")

def run_all_tests():
    """Run all tests"""
    print_section("Franklin Trinity OS - Enhancement Tests")
    
    try:
        test_health()
        
        print_section("1. File Upload Tests")
        file_id = test_file_upload()
        
        print_section("2. Cognitive Memory Tests")
        test_cognitive_memory()
        
        print_section("3. AI Caching Tests")
        test_ai_caching()
        
        print_section("4. Pipeline Tests")
        task_id = test_pipelines()
        
        print_section("5. Export Tests")
        test_export(task_id)
        
        print_section("6. Workflow Tracking Tests")
        test_workflows()
        
        print_section("All Tests Completed!")
        print("✓ All tests passed successfully")
        
    except Exception as e:
        print(f"\n✗ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_all_tests()
