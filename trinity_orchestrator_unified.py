import asyncio
import uuid
from typing import Dict, List, Any, Optional
from pydantic import BaseModel

class Task(BaseModel):
    id: str
    type: str
    payload: Dict[str, Any]
    status: str = "pending"
    result: Optional[Any] = None

class Agent(BaseModel):
    id: str
    name: str
    capabilities: List[str]
    status: str = "idle"

class Orchestrator:
    def __init__(self):
        self.tasks: Dict[str, Task] = {}
        self.agents: Dict[str, Agent] = {}

    async def submit_task(self, task_type: str, payload: Dict[str, Any]) -> str:
        task_id = str(uuid.uuid4())
        task = Task(id=task_id, type=task_type, payload=payload)
        self.tasks[task_id] = task
        # In a real system, this would dispatch to a worker queue
        return task_id

    def get_task_status(self, task_id: str) -> Optional[Task]:
        return self.tasks.get(task_id)

    def register_agent(self, agent: Agent):
        self.agents[agent.id] = agent

# Singleton instance
orchestrator = Orchestrator()
