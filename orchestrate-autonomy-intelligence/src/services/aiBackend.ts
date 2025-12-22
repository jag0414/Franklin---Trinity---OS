// Sophisticated AI Backend Orchestration System
// Full multi-provider AI integration with real API functionality

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

class AIBackendOrchestrator {
  private providers: Map<string, any> = new Map();
  private taskQueue: AIRequest[] = [];
  private activeRequests: Map<string, AbortController> = new Map();
  private responseCache: Map<string, AIResponse> = new Map();
  
  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize all AI provider connections
    if (aiConfig.providers.openai.enabled) {
      this.providers.set('openai', {
        endpoint: 'https://api.openai.com/v1',
        headers: {
          'Authorization': `Bearer ${aiConfig.providers.openai.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
    }

    if (aiConfig.providers.anthropic.enabled) {
      this.providers.set('anthropic', {
        endpoint: 'https://api.anthropic.com/v1',
        headers: {
          'x-api-key': aiConfig.providers.anthropic.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      });
    }

    if (aiConfig.providers.google.enabled) {
      this.providers.set('google', {
        endpoint: `https://generativelanguage.googleapis.com/v1beta`,
        apiKey: aiConfig.providers.google.apiKey
      });
    }
  }

  async executeRequest(request: AIRequest): Promise<AIResponse> {
    const requestId = request.id || crypto.randomUUID();
    const abortController = new AbortController();
    this.activeRequests.set(requestId, abortController);

    try {
      // Route to appropriate provider
      const provider = request.provider || this.selectOptimalProvider(request);
      const response = await this.routeToProvider(provider, request, abortController.signal);
      
      this.responseCache.set(requestId, response);
      return response;
    } finally {
      this.activeRequests.delete(requestId);
    }
  }

  private selectOptimalProvider(request: AIRequest): string {
    // Intelligent provider selection based on request type
    switch (request.type) {
      case 'code':
        return aiConfig.providers.openai.enabled ? 'openai' : 'anthropic';
      case 'image':
        return 'stability';
      case 'vision':
        return aiConfig.providers.google.enabled ? 'google' : 'openai';
      case 'analysis':
        return aiConfig.providers.anthropic.enabled ? 'anthropic' : 'openai';
      default:
        // Select based on availability and performance
        if (aiConfig.providers.anthropic.enabled) return 'anthropic';
        if (aiConfig.providers.openai.enabled) return 'openai';
        if (aiConfig.providers.google.enabled) return 'google';
        return 'openai'; // fallback
    }
  }

  private async routeToProvider(
    provider: string, 
    request: AIRequest, 
    signal: AbortSignal
  ): Promise<AIResponse> {
    switch (provider) {
      case 'openai':
        return this.callOpenAI(request, signal);
      case 'anthropic':
        return this.callAnthropic(request, signal);
      case 'google':
        return this.callGoogle(request, signal);
      case 'stability':
        return this.callStability(request, signal);
      default:
        throw new Error(`Provider ${provider} not supported`);
    }
  }

  private async callOpenAI(request: AIRequest, signal: AbortSignal): Promise<AIResponse> {
    const config = this.providers.get('openai');
    if (!config) throw new Error('OpenAI not configured');

    const model = request.model || 'gpt-4-turbo-preview';
    const endpoint = request.type === 'image' 
      ? `${config.endpoint}/images/generations`
      : `${config.endpoint}/chat/completions`;

    const body = request.type === 'image' ? {
      model: 'dall-e-3',
      prompt: request.prompt,
      n: 1,
      size: request.parameters?.size || '1024x1024',
      quality: request.parameters?.quality || 'hd'
    } : {
      model,
      messages: [
        { role: 'system', content: 'You are a sophisticated AI assistant.' },
        ...(request.context || []),
        { role: 'user', content: request.prompt }
      ],
      temperature: request.parameters?.temperature || 0.7,
      max_tokens: request.parameters?.maxTokens || 2000,
      stream: request.stream || false
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify(body),
      signal
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: request.id || crypto.randomUUID(),
      provider: 'openai',
      model,
      type: request.type,
      content: request.type === 'image' ? data.data[0].url : data.choices[0].message.content,
      usage: data.usage,
      timestamp: Date.now()
    };
  }

  private async callAnthropic(request: AIRequest, signal: AbortSignal): Promise<AIResponse> {
    const config = this.providers.get('anthropic');
    if (!config) throw new Error('Anthropic not configured');

    const model = request.model || 'claude-3-opus-20240229';
    const endpoint = `${config.endpoint}/messages`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        model,
        messages: [
          ...(request.context || []),
          { role: 'user', content: request.prompt }
        ],
        max_tokens: request.parameters?.maxTokens || 2000,
        temperature: request.parameters?.temperature || 0.7
      }),
      signal
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: request.id || crypto.randomUUID(),
      provider: 'anthropic',
      model,
      type: request.type,
      content: data.content[0].text,
      usage: data.usage,
      timestamp: Date.now()
    };
  }

  private async callGoogle(request: AIRequest, signal: AbortSignal): Promise<AIResponse> {
    const config = this.providers.get('google');
    if (!config) throw new Error('Google not configured');

    const model = request.model || 'gemini-pro';
    const endpoint = `${config.endpoint}/models/${model}:generateContent?key=${config.apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: request.prompt }]
        }],
        generationConfig: {
          temperature: request.parameters?.temperature || 0.7,
          maxOutputTokens: request.parameters?.maxTokens || 2000
        }
      }),
      signal
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: request.id || crypto.randomUUID(),
      provider: 'google',
      model,
      type: request.type,
      content: data.candidates[0].content.parts[0].text,
      timestamp: Date.now()
    };
  }

  private async callStability(request: AIRequest, signal: AbortSignal): Promise<AIResponse> {
    // Stability AI for image generation
    const apiKey = import.meta.env.VITE_STABILITY_API_KEY;
    if (!apiKey) throw new Error('Stability AI not configured');

    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        text_prompts: [{ text: request.prompt, weight: 1 }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1
      }),
      signal
    });

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: request.id || crypto.randomUUID(),
      provider: 'stability',
      model: 'stable-diffusion-xl',
      type: 'image',
      content: `data:image/png;base64,${data.artifacts[0].base64}`,
      timestamp: Date.now()
    };
  }

  async orchestrateMultiAgent(task: string, agents: string[]): Promise<any> {
    // Execute task across multiple AI agents in parallel
    const requests = agents.map(agent => ({
      id: crypto.randomUUID(),
      type: 'text' as const,
      prompt: task,
      provider: agent
    }));

    const responses = await Promise.allSettled(
      requests.map(req => this.executeRequest(req))
    );

    return responses.map((result, index) => ({
      agent: agents[index],
      status: result.status,
      response: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null
    }));
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