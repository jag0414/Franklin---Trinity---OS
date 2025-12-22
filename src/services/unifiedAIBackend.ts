/**
 * Unified AI Backend Service
 * Connects frontend to the comprehensive AI backend with multimodal capabilities
 */

const API_BASE_URL = import.meta.env.VITE_AI_BACKEND_URL || 'http://localhost:8000';

export interface TextGenerationRequest {
  prompt: string;
  provider?: 'gemini' | 'openai' | 'anthropic';
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ImageGenerationRequest {
  prompt: string;
  size?: string;
  quality?: string;
}

export interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
}

export interface AudioGenerationRequest {
  text: string;
  voice?: string;
  language_code?: string;
}

export interface MultiModalRequest {
  prompt: string;
  modalities: ('text' | 'image' | 'audio' | 'video')[];
  context?: Record<string, any>;
}

export interface TaskStatus {
  task_id: string;
  status: 'processing' | 'completed' | 'failed';
  type: string;
  created_at: string;
  completed_at?: string;
  result?: any;
  error?: string;
}

class UnifiedAIBackendService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(error.detail || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  async healthCheck() {
    return this.request<{
      status: string;
      services: Record<string, boolean>;
      timestamp: string;
    }>('/api/health');
  }

  async generateText(request: TextGenerationRequest) {
    return this.request<{
      task_id: string;
      provider: string;
      content: string;
      metadata: Record<string, any>;
    }>('/api/ai/text', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateImage(request: ImageGenerationRequest) {
    return this.request<{
      task_id: string;
      status: string;
      message: string;
    }>('/api/ai/image', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateVideo(request: VideoGenerationRequest) {
    return this.request<{
      task_id: string;
      status: string;
      message: string;
    }>('/api/ai/video', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateAudio(request: AudioGenerationRequest) {
    return this.request<{
      task_id: string;
      status: string;
      message: string;
    }>('/api/ai/audio', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateMultiModal(request: MultiModalRequest) {
    return this.request<{
      task_id: string;
      status: string;
      message: string;
    }>('/api/ai/multimodal', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    return this.request<TaskStatus>(`/api/tasks/${taskId}`);
  }

  async getGenerationHistory(limit: number = 50) {
    return this.request<any[]>(`/api/history?limit=${limit}`);
  }

  getOutputUrl(filename: string): string {
    return `${this.baseUrl}/api/outputs/${filename}`;
  }

  // Poll task status until completion
  async pollTaskStatus(
    taskId: string,
    onUpdate?: (status: TaskStatus) => void,
    maxAttempts: number = 60,
    interval: number = 2000
  ): Promise<TaskStatus> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const status = await this.getTaskStatus(taskId);
      
      if (onUpdate) {
        onUpdate(status);
      }

      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }

    throw new Error('Task polling timeout');
  }
}

export const unifiedAIService = new UnifiedAIBackendService();
export default unifiedAIService;
