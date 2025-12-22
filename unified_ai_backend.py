"""
Franklin OS - Unified AI Backend API
Integrates all AI capabilities: Gemini, OpenAI, Anthropic, with multimodal support
"""
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import os
import json
import asyncio
from pathlib import Path

# Import Gemini master functions
try:
    from gemini_master import (
        generate_text, 
        generate_image, 
        generate_video, 
        generate_audio, 
        generate_embedding
    )
    GEMINI_AVAILABLE = True
except Exception as e:
    print(f"Warning: Gemini functions not available: {e}")
    GEMINI_AVAILABLE = False

# Import AI router
try:
    from ai_router_v2 import run_ai as ai_router_run
    AI_ROUTER_AVAILABLE = True
except Exception as e:
    print(f"Warning: AI router not available: {e}")
    AI_ROUTER_AVAILABLE = False

app = FastAPI(
    title="Franklin OS - Unified AI API",
    description="Complete AI backend with multimodal capabilities",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Storage directories
OUTPUTS_DIR = Path("outputs")
OUTPUTS_DIR.mkdir(exist_ok=True)

# In-memory storage for tasks and history
tasks_db = {}
generation_history = []

# Models
class TextGenerationRequest(BaseModel):
    prompt: str
    provider: Optional[str] = "gemini"  # gemini, openai, anthropic
    model: Optional[str] = None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 2000

class ImageGenerationRequest(BaseModel):
    prompt: str
    size: Optional[str] = "1024x1024"
    quality: Optional[str] = "hd"

class VideoGenerationRequest(BaseModel):
    prompt: str
    duration: Optional[int] = 5

class AudioGenerationRequest(BaseModel):
    text: str
    voice: Optional[str] = "en-US-Studio-O"
    language_code: Optional[str] = "en-US"

class EmbeddingRequest(BaseModel):
    text: str
    model: Optional[str] = "text-embedding-004"

class MultiModalRequest(BaseModel):
    prompt: str
    modalities: List[str]  # ["text", "image", "audio"]
    context: Optional[Dict[str, Any]] = None

class TaskResponse(BaseModel):
    task_id: str
    status: str
    created_at: str
    result: Optional[Any] = None
    error: Optional[str] = None

# Health Check
@app.get("/api/health")
async def health_check():
    return {
        "status": "operational",
        "services": {
            "gemini": GEMINI_AVAILABLE,
            "ai_router": AI_ROUTER_AVAILABLE
        },
        "timestamp": datetime.utcnow().isoformat()
    }

# Text Generation
@app.post("/api/ai/text")
async def generate_text_api(request: TextGenerationRequest):
    """Generate text using specified AI provider"""
    try:
        task_id = str(uuid.uuid4())
        
        if request.provider == "gemini" and GEMINI_AVAILABLE:
            result = generate_text(request.prompt)
            response = {
                "task_id": task_id,
                "provider": "gemini",
                "content": result.get("text", ""),
                "metadata": {
                    "latency": result.get("latency"),
                    "confidence": result.get("confidence")
                }
            }
        elif AI_ROUTER_AVAILABLE:
            # Use AI router for multi-provider support
            # This is a placeholder - actual implementation would capture stdout
            response = {
                "task_id": task_id,
                "provider": request.provider,
                "content": f"AI Router response for: {request.prompt[:50]}...",
                "metadata": {}
            }
        else:
            raise HTTPException(503, "No AI providers available")
        
        # Store in history
        generation_history.append({
            "task_id": task_id,
            "type": "text",
            "timestamp": datetime.utcnow().isoformat(),
            "request": request.dict(),
            "response": response
        })
        
        return response
    except Exception as e:
        raise HTTPException(500, f"Text generation failed: {str(e)}")

# Image Generation
@app.post("/api/ai/image")
async def generate_image_api(request: ImageGenerationRequest, background_tasks: BackgroundTasks):
    """Generate images using Gemini Imagen"""
    if not GEMINI_AVAILABLE:
        raise HTTPException(503, "Gemini service not available")
    
    try:
        task_id = str(uuid.uuid4())
        output_path = OUTPUTS_DIR / f"image_{task_id}.png"
        
        # Create task
        tasks_db[task_id] = {
            "status": "processing",
            "type": "image",
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Generate image in background
        def generate_bg():
            try:
                result = generate_image(request.prompt, str(output_path))
                tasks_db[task_id].update({
                    "status": "completed",
                    "result": {
                        "path": str(output_path),
                        "url": f"/api/outputs/{output_path.name}",
                        "metadata": result
                    },
                    "completed_at": datetime.utcnow().isoformat()
                })
            except Exception as e:
                tasks_db[task_id].update({
                    "status": "failed",
                    "error": str(e),
                    "completed_at": datetime.utcnow().isoformat()
                })
        
        background_tasks.add_task(generate_bg)
        
        return {
            "task_id": task_id,
            "status": "processing",
            "message": "Image generation started"
        }
    except Exception as e:
        raise HTTPException(500, f"Image generation failed: {str(e)}")

# Video Generation
@app.post("/api/ai/video")
async def generate_video_api(request: VideoGenerationRequest, background_tasks: BackgroundTasks):
    """Generate videos using Gemini Veo"""
    if not GEMINI_AVAILABLE:
        raise HTTPException(503, "Gemini service not available")
    
    try:
        task_id = str(uuid.uuid4())
        output_path = OUTPUTS_DIR / f"video_{task_id}.mp4"
        
        tasks_db[task_id] = {
            "status": "processing",
            "type": "video",
            "created_at": datetime.utcnow().isoformat()
        }
        
        def generate_bg():
            try:
                result = generate_video(request.prompt, str(output_path))
                tasks_db[task_id].update({
                    "status": "completed",
                    "result": {
                        "path": str(output_path),
                        "url": f"/api/outputs/{output_path.name}",
                        "metadata": result
                    },
                    "completed_at": datetime.utcnow().isoformat()
                })
            except Exception as e:
                tasks_db[task_id].update({
                    "status": "failed",
                    "error": str(e),
                    "completed_at": datetime.utcnow().isoformat()
                })
        
        background_tasks.add_task(generate_bg)
        
        return {
            "task_id": task_id,
            "status": "processing",
            "message": "Video generation started (this may take several minutes)"
        }
    except Exception as e:
        raise HTTPException(500, f"Video generation failed: {str(e)}")

# Audio Generation
@app.post("/api/ai/audio")
async def generate_audio_api(request: AudioGenerationRequest, background_tasks: BackgroundTasks):
    """Generate audio using Google Text-to-Speech"""
    if not GEMINI_AVAILABLE:
        raise HTTPException(503, "Gemini service not available")
    
    try:
        task_id = str(uuid.uuid4())
        output_path = OUTPUTS_DIR / f"audio_{task_id}.mp3"
        
        tasks_db[task_id] = {
            "status": "processing",
            "type": "audio",
            "created_at": datetime.utcnow().isoformat()
        }
        
        def generate_bg():
            try:
                result = generate_audio(request.text, str(output_path))
                tasks_db[task_id].update({
                    "status": "completed",
                    "result": {
                        "path": str(output_path),
                        "url": f"/api/outputs/{output_path.name}",
                        "metadata": result
                    },
                    "completed_at": datetime.utcnow().isoformat()
                })
            except Exception as e:
                tasks_db[task_id].update({
                    "status": "failed",
                    "error": str(e),
                    "completed_at": datetime.utcnow().isoformat()
                })
        
        background_tasks.add_task(generate_bg)
        
        return {
            "task_id": task_id,
            "status": "processing",
            "message": "Audio generation started"
        }
    except Exception as e:
        raise HTTPException(500, f"Audio generation failed: {str(e)}")

# Embeddings
@app.post("/api/ai/embeddings")
async def generate_embeddings_api(request: EmbeddingRequest):
    """Generate text embeddings"""
    if not GEMINI_AVAILABLE:
        raise HTTPException(503, "Gemini service not available")
    
    try:
        result = generate_embedding(request.text)
        return {
            "embedding_length": result.get("embedding_length"),
            "metadata": {
                "engine": result.get("engine"),
                "latency": result.get("latency"),
                "confidence": result.get("confidence")
            }
        }
    except Exception as e:
        raise HTTPException(500, f"Embedding generation failed: {str(e)}")

# Task Status
@app.get("/api/tasks/{task_id}")
async def get_task_status(task_id: str):
    """Get status of a background task"""
    if task_id not in tasks_db:
        raise HTTPException(404, "Task not found")
    return tasks_db[task_id]

# Output Files
@app.get("/api/outputs/{filename}")
async def get_output_file(filename: str):
    """Download generated output file"""
    file_path = OUTPUTS_DIR / filename
    if not file_path.exists():
        raise HTTPException(404, "File not found")
    return FileResponse(file_path)

# Generation History
@app.get("/api/history")
async def get_generation_history(limit: int = 50):
    """Get recent generation history"""
    return generation_history[-limit:]

# Multi-Modal Generation
@app.post("/api/ai/multimodal")
async def generate_multimodal(request: MultiModalRequest, background_tasks: BackgroundTasks):
    """Generate multiple modalities from a single prompt"""
    if not GEMINI_AVAILABLE:
        raise HTTPException(503, "Gemini service not available")
    
    try:
        task_id = str(uuid.uuid4())
        tasks_db[task_id] = {
            "status": "processing",
            "type": "multimodal",
            "modalities": request.modalities,
            "created_at": datetime.utcnow().isoformat(),
            "results": {}
        }
        
        async def generate_all():
            results = {}
            
            if "text" in request.modalities:
                try:
                    result = generate_text(request.prompt)
                    results["text"] = result
                except Exception as e:
                    results["text"] = {"error": str(e)}
            
            if "image" in request.modalities:
                try:
                    output_path = OUTPUTS_DIR / f"multimodal_{task_id}_image.png"
                    result = generate_image(request.prompt, str(output_path))
                    results["image"] = {
                        "url": f"/api/outputs/{output_path.name}",
                        "metadata": result
                    }
                except Exception as e:
                    results["image"] = {"error": str(e)}
            
            if "audio" in request.modalities and "text" in results:
                try:
                    output_path = OUTPUTS_DIR / f"multimodal_{task_id}_audio.mp3"
                    text_content = results["text"].get("text", request.prompt)
                    result = generate_audio(text_content, str(output_path))
                    results["audio"] = {
                        "url": f"/api/outputs/{output_path.name}",
                        "metadata": result
                    }
                except Exception as e:
                    results["audio"] = {"error": str(e)}
            
            tasks_db[task_id].update({
                "status": "completed",
                "results": results,
                "completed_at": datetime.utcnow().isoformat()
            })
        
        background_tasks.add_task(lambda: asyncio.run(generate_all()))
        
        return {
            "task_id": task_id,
            "status": "processing",
            "message": f"Multimodal generation started for: {', '.join(request.modalities)}"
        }
    except Exception as e:
        raise HTTPException(500, f"Multimodal generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
