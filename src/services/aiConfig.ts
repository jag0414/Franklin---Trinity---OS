// AI Provider Configuration
export interface AIProvider {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
  model: string;
  capabilities: string[];
  maxTokens: number;
  temperature: number;
}

export const AI_PROVIDERS: Record<string, Partial<AIProvider>> = {
  openai: {
    id: 'openai',
    name: 'OpenAI GPT-4',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4-turbo-preview',
    capabilities: ['text', 'code', 'analysis', 'creative'],
    maxTokens: 4096,
    temperature: 0.7
  },
  claude: {
    id: 'claude',
    name: 'Claude 3',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-opus-20240229',
    capabilities: ['text', 'code', 'analysis', 'reasoning'],
    maxTokens: 4096,
    temperature: 0.7
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    model: 'gemini-pro',
    capabilities: ['text', 'multimodal', 'analysis'],
    maxTokens: 2048,
    temperature: 0.7
  },
  dalle: {
    id: 'dalle',
    name: 'DALL-E 3',
    endpoint: 'https://api.openai.com/v1/images/generations',
    model: 'dall-e-3',
    capabilities: ['image'],
    maxTokens: 0,
    temperature: 0
  },
  stability: {
    id: 'stability',
    name: 'Stable Diffusion',
    endpoint: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    model: 'stable-diffusion-xl-1024-v1-0',
    capabilities: ['image'],
    maxTokens: 0,
    temperature: 0
  }
};
export const aiConfig = {
  providers: {
    openai: {
      enabled: !!import.meta.env.VITE_OPENAI_API_KEY,
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      models: ['gpt-4-turbo-preview', 'gpt-3.5-turbo']
    },
    anthropic: {
      enabled: !!import.meta.env.VITE_ANTHROPIC_API_KEY,
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
      models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229']
    },
    google: {
      enabled: !!import.meta.env.VITE_GOOGLE_API_KEY,
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
      models: ['gemini-pro']
    },
    stability: {
      enabled: !!import.meta.env.VITE_STABILITY_API_KEY,
      apiKey: import.meta.env.VITE_STABILITY_API_KEY || '',
      models: ['stable-diffusion-xl-1024-v1-0']
    }
  }
};

export const getAPIKeys = () => ({
  openai: import.meta.env.VITE_OPENAI_API_KEY || '',
  claude: import.meta.env.VITE_CLAUDE_API_KEY || '',
  gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
  stability: import.meta.env.VITE_STABILITY_API_KEY || ''
});