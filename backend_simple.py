"""
Franklin OS - Simplified Backend for Quick Testing
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(title="Franklin OS")

# CORS - Allow all for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for quick testing
projects_db = {}
estimates_db = {}
files_db = {}
schedules_db = {}
daily_logs_db = {}
rfis_db = {}
submittals_db = {}
change_orders_db = {}
punch_items_db = {}
budgets_db = {}
invoices_db = {}
contacts_db = {}

# Models
class Project(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "active"

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    status: str
    created_at: str

# Health
@app.get("/health")
def health():
    return {"status": "ok", "service": "FranklinOS"}

# Projects
@app.get("/projects/")
def list_projects():
    return list(projects_db.values())

@app.post("/projects/")
def create_project(project: Project):
    project_id = str(uuid.uuid4())
    data = {
        "id": project_id,
        "name": project.name,
        "description": project.description,
        "status": project.status,
        "created_at": datetime.utcnow().isoformat()
    }
    projects_db[project_id] = data
    return data

@app.get("/projects/{project_id}")
def get_project(project_id: str):
    if project_id not in projects_db:
        raise HTTPException(404, "Project not found")
    return projects_db[project_id]

@app.get("/projects/{project_id}/estimates")
def get_project_estimates(project_id: str):
    return [e for e in estimates_db.values() if e.get("project_id") == project_id]

@app.get("/projects/{project_id}/files")
def get_project_files(project_id: str):
    return [f for f in files_db.values() if f.get("project_id") == project_id]

# Schedules
@app.get("/schedules/by-project/{project_id}")
def list_schedules(project_id: str):
    return [s for s in schedules_db.values() if s.get("project_id") == project_id]

@app.post("/schedules/")
def create_schedule(data: dict):
    schedule_id = str(uuid.uuid4())
    schedule = {"id": schedule_id, "tasks": [], **data}
    schedules_db[schedule_id] = schedule
    return schedule

@app.post("/schedules/{schedule_id}/tasks")
def add_task(schedule_id: str, task: dict):
    if schedule_id not in schedules_db:
        raise HTTPException(404, "Schedule not found")
    task_id = str(uuid.uuid4())
    task_data = {"id": task_id, **task}
    schedules_db[schedule_id]["tasks"].append(task_data)
    return task_data

# Daily Logs
@app.get("/daily-logs/by-project/{project_id}")
def list_logs(project_id: str):
    return [l for l in daily_logs_db.values() if l.get("project_id") == project_id]

@app.post("/daily-logs/")
def create_log(data: dict):
    log_id = str(uuid.uuid4())
    log = {"id": log_id, **data}
    daily_logs_db[log_id] = log
    return log

# RFIs
@app.get("/rfis/by-project/{project_id}")
def list_rfis(project_id: str):
    return [r for r in rfis_db.values() if r.get("project_id") == project_id]

@app.post("/rfis/")
def create_rfi(data: dict):
    rfi_id = str(uuid.uuid4())
    rfi = {"id": rfi_id, "status": "open", **data}
    rfis_db[rfi_id] = rfi
    return rfi

# Submittals
@app.get("/submittals/by-project/{project_id}")
def list_submittals(project_id: str):
    return [s for s in submittals_db.values() if s.get("project_id") == project_id]

@app.post("/submittals/")
def create_submittal(data: dict):
    sub_id = str(uuid.uuid4())
    sub = {"id": sub_id, "status": "open", **data}
    submittals_db[sub_id] = sub
    return sub

# Change Orders
@app.get("/change-orders/by-project/{project_id}")
def list_cos(project_id: str):
    return [c for c in change_orders_db.values() if c.get("project_id") == project_id]

@app.post("/change-orders/")
def create_co(data: dict):
    co_id = str(uuid.uuid4())
    co = {"id": co_id, "status": "draft", **data}
    change_orders_db[co_id] = co
    return co

# Punch List
@app.get("/punch-list/by-project/{project_id}")
def list_punch(project_id: str):
    return [p for p in punch_items_db.values() if p.get("project_id") == project_id]

@app.post("/punch-list/")
def create_punch(data: dict):
    item_id = str(uuid.uuid4())
    item = {"id": item_id, "status": "open", **data}
    punch_items_db[item_id] = item
    return item

@app.put("/punch-list/{item_id}")
def update_punch(item_id: str, data: dict):
    if item_id not in punch_items_db:
        raise HTTPException(404, "Item not found")
    punch_items_db[item_id].update(data)
    return punch_items_db[item_id]

# Budget
@app.post("/budgets/{project_id}")
def get_or_create_budget(project_id: str):
    if project_id not in budgets_db:
        budgets_db[project_id] = {"id": str(uuid.uuid4()), "project_id": project_id, "total_budget": 0, "items": []}
    return budgets_db[project_id]

@app.post("/budgets/{budget_id}/items")
def add_budget_item(budget_id: str, data: dict):
    for pid, budget in budgets_db.items():
        if budget["id"] == budget_id:
            item = {"id": str(uuid.uuid4()), "revised_budget": data.get("original_budget", 0), **data}
            budget["items"].append(item)
            return item
    raise HTTPException(404, "Budget not found")

# Invoices
@app.get("/invoices/by-project/{project_id}")
def list_invoices(project_id: str):
    return [i for i in invoices_db.values() if i.get("project_id") == project_id]

@app.post("/invoices/")
def create_invoice(data: dict):
    inv_id = str(uuid.uuid4())
    inv = {"id": inv_id, "status": "draft", **data}
    invoices_db[inv_id] = inv
    return inv

# Directory
@app.get("/directory/by-project/{project_id}")
def list_contacts(project_id: str):
    return [c for c in contacts_db.values() if c.get("project_id") == project_id]

@app.post("/directory/")
def create_contact(data: dict):
    contact_id = str(uuid.uuid4())
    contact = {"id": contact_id, **data}
    contacts_db[contact_id] = contact
    return contact

# Photos
@app.get("/photos/by-project/{project_id}")
def list_photos(project_id: str):
    return []

# RAG Chat (simplified)
@app.post("/rag/query")
def rag_query(data: dict):
    return {
        "answer": f"This is a demo response. In production, I would analyze your project data to answer: '{data.get('query', '')}'",
        "sources": ["Demo Mode"]
    }

# Uploads (simplified)
@app.post("/uploads/init")
def init_upload(filename: str, size: int = 0, content_type: str = None):
    return {
        "upload_id": str(uuid.uuid4()),
        "presigned_urls": ["http://localhost:8000/uploads/mock"],
        "chunk_size": 5242880
    }

@app.post("/uploads/complete")
def complete_upload(data: dict):
    file_id = str(uuid.uuid4())
    files_db[file_id] = {
        "id": file_id,
        "project_id": data.get("project_id"),
        "original_filename": "uploaded_file",
        "category": data.get("category", "uncategorized"),
        "file_size": 0,
        "created_at": datetime.utcnow().isoformat(),
        "metadata": None
    }
    return {"file_id": file_id, "status": "completed", "job_id": str(uuid.uuid4())}

@app.post("/uploads/mock")
def mock_upload():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
