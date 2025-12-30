#!/usr/bin/env python3
"""
Verify Anthropic API Key Configuration
Run this script to confirm the Anthropic API key is properly configured.
"""
import os
import sys

def check_mark(condition):
    return "✓" if condition else "✗"

def main():
    print("=" * 70)
    print(" ANTHROPIC API KEY CONFIGURATION VERIFICATION")
    print("=" * 70)
    
    all_passed = True
    
    # Check 1: .env file exists
    print("\n[1/6] Checking .env file...")
    env_exists = os.path.exists('.env')
    print(f"      {check_mark(env_exists)} .env file exists: {env_exists}")
    if not env_exists:
        print("      ℹ Run this from the project root directory")
        all_passed = False
    
    # Check 2: python-dotenv installed
    print("\n[2/6] Checking python-dotenv installation...")
    try:
        from dotenv import load_dotenv
        print(f"      ✓ python-dotenv is installed")
    except ImportError:
        print(f"      ✗ python-dotenv not installed")
        print(f"      ℹ Run: pip install python-dotenv")
        all_passed = False
        return
    
    # Check 3: Load environment
    print("\n[3/6] Loading environment variables...")
    load_dotenv('.env')
    key = os.getenv('ANTHROPIC_API_KEY')
    if key:
        print(f"      ✓ ANTHROPIC_API_KEY loaded")
        print(f"      ℹ Key length: {len(key)} characters")
    else:
        print(f"      ✗ ANTHROPIC_API_KEY not found in environment")
        all_passed = False
        return
    
    # Check 4: Validate key format
    print("\n[4/6] Validating key format...")
    valid_prefix = key.startswith('sk-ant-api03-')
    valid_length = len(key) == 108
    print(f"      {check_mark(valid_prefix)} Key starts with 'sk-ant-api03-': {valid_prefix}")
    print(f"      {check_mark(valid_length)} Key length is 108 characters: {valid_length}")
    if not (valid_prefix and valid_length):
        all_passed = False
    
    # Check 5: Check config module
    print("\n[5/6] Testing config module...")
    try:
        from config import get_config
        cfg = get_config()
        if cfg.anthropic_api_key:
            print(f"      ✓ config.py loads key successfully")
        else:
            print(f"      ✗ config.py did not load key")
            all_passed = False
    except Exception as e:
        print(f"      ✗ Error loading config: {e}")
        all_passed = False
    
    # Check 6: Check anthropic client
    print("\n[6/6] Testing Anthropic client initialization...")
    try:
        import anthropic
        from trinity_orchestrator_unified import _make_clients
        clients = _make_clients()
        if 'anthropic' in clients:
            print(f"      ✓ Anthropic client initialized")
            print(f"      ℹ Client type: {type(clients['anthropic']).__name__}")
        else:
            print(f"      ⚠ Anthropic client not initialized")
            print(f"      ℹ This may be expected if anthropic package is not installed")
    except ImportError as e:
        print(f"      ⚠ anthropic package not installed: {e}")
        print(f"      ℹ Run: pip install anthropic")
    except Exception as e:
        print(f"      ✗ Error: {e}")
        all_passed = False
    
    # Summary
    print("\n" + "=" * 70)
    if all_passed:
        print(" ✓ ALL CHECKS PASSED")
        print("=" * 70)
        print("\n✅ Anthropic API key is properly configured!")
        print("\nNext steps:")
        print("  • Start backend: ./Start_Backend.ps1 or python app.py")
        print("  • Test AI: python trinity_orchestrator_unified.py -p 'Hello!'")
        print("  • View docs: See ANTHROPIC_SETUP.md for more information")
    else:
        print(" ✗ SOME CHECKS FAILED")
        print("=" * 70)
        print("\n❌ Configuration incomplete")
        print("\nTroubleshooting:")
        print("  • Ensure .env file exists in project root")
        print("  • Run: pip install -r requirements.txt")
        print("  • Check ANTHROPIC_SETUP.md for detailed instructions")
        sys.exit(1)
    
    print("=" * 70)

if __name__ == "__main__":
    main()
