@echo off
echo Starting Franklin Backend...
cd legacy_import\franklin_backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
pause
