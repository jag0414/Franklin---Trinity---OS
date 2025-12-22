// Sophisticated AI Backend Orchestration System
// Routes all AI calls through the local FastAPI backend (server-side API keys)

import { aiConfig } from './aiConfig';

export interface AIRequest {
  id: string;
  type: 'text' | 'image' | 'audio' | 'code' | 'analysis' | 'vision';
  prompt: string;
  provider?: string;
  model?: string;
  parameters?: Record<string, any>;
  context?: any[];
  stream?: boolean;
}

export interface AIResponse {
  id: string;
  provider: string;
  model: string;
  type: string;
  content: any;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    cost?: number;
  };
  metadata?: Record<string, any>;
  timestamp: number;
}

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (aiConfig as any)?.backend?.baseUrl ||
  'http://127.0.0.1:8000';

async function pollTask(taskId: string, timeoutMs: number = 240000): Promise<any> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${API_BASE_URL}/api/orchestrator/tasks/${taskId}`);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const task = await res.json();
    if (task.status === 'completed') return task.response;
    if (task.status === 'failed') throw new Error(task.error || 'Task failed');
    await new Promise(r => setTimeout(r, 250));
  }
  throw new Error('Timed out waiting for task completion');
}

class AIBackendOrchestrator {
  private activeRequests: Map<string, AbortController> = new Map();
  private responseCache: Map<string, AIResponse> = new Map();

  async executeRequest(request: AIRequest): Promise<AIResponse> {
    const requestId = request.id || crypto.randomUUID();
    const abortController = new AbortController();
    this.activeRequests.set(requestId, abortController);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...request, id: requestId }),
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data: AIResponse = await response.json();
      this.responseCache.set(requestId, data);
      return data;
    } finally {
      this.activeRequests.delete(requestId);
    }
  }

  async orchestrateMultiAgent(task: string, agents: string[]): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/ai/multi-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: task, agents, requestType: 'text' })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    if (!data?.taskId) {
      throw new Error('Backend did not return taskId');
    }

    return await pollTask(data.taskId);
  }

  cancelRequest(requestId: string) {
    const controller = this.activeRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
    }
  }

  getCache(requestId: string): AIResponse | undefined {
    return this.responseCache.get(requestId);
  }

  clearCache() {
    this.responseCache.clear();
  }
}

export const aiBackend = new AIBackendOrchestrator();