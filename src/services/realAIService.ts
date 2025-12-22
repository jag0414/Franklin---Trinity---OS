import { supabase } from '@/lib/supabase';

export interface AIResponse {
  success: boolean;
  data?: {
    provider: string;
    content: string;
    model: string;
    usage?: any;
    agentType?: string;
    response?: string;
  };
  error?: string;
}

export interface AgentTask {
  agentType: string;
  task: string;
  context?: string;
  provider?: string;
}

export class RealAIService {
  private useMockData = false;

  constructor() {
    // Check if Supabase is properly configured
    this.checkSupabaseConnection();
  }

  private async checkSupabaseConnection() {
    try {
      const { error } = await supabase.from('agent_tasks').select('count').limit(1);
      if (error && (error.message.includes('relation') || error?.code === 'PGRST116')) {
        console.warn('Supabase not fully configured, using mock data');
        this.useMockData = true;
      }
    } catch (error) {
      console.warn('Supabase connection check failed, using mock data');
      this.useMockData = true;
    }
  }

  // Mock AI response for demo purposes
  private generateMockResponse(provider: string, prompt: string): AIResponse {
    const responses: Record<string, string> = {
      openai: `Based on your query about "${prompt.substring(0, 50)}...", here's a comprehensive analysis:\n\n1. This demonstrates the Franklin OS AI capabilities\n2. The system integrates multiple AI providers\n3. Real-time processing with advanced orchestration\n\nThis is a demo response. To enable real AI, configure your API keys in the environment variables.`,
      anthropic: `Claude's perspective on "${prompt.substring(0, 50)}...":\n\nI've analyzed your request and can provide detailed insights. The Franklin OS platform supports multi-provider AI orchestration, allowing seamless integration with various AI models.\n\nDemo mode: Configure ANTHROPIC_API_KEY for live responses.`,
      google: `Gemini analysis of "${prompt.substring(0, 50)}...":\n\nMultimodal processing capabilities enabled. The Franklin OS ecosystem provides:\n- Real-time AI orchestration\n- Multi-agent collaboration\n- Advanced voice integration\n\nDemo mode active. Add GOOGLE_API_KEY for production use.`
    };

    const content = responses[provider] || responses.openai;
    const models: Record<string, string> = {
      openai: 'gpt-4',
      anthropic: 'claude-3',
      google: 'gemini-pro'
    };

    return {
      success: true,
      data: {
        provider: provider,
        content: content,
        model: models[provider] || 'demo-model'
      }
    };
  }

  // Call the AI orchestrator with any provider
  async callAI(
    provider: 'openai' | 'anthropic' | 'google',
    prompt: string,
    model?: string,
    messages?: any[]
  ): Promise<AIResponse> {
    // Return mock data if Supabase is not configured
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      return this.generateMockResponse(provider, prompt);
    }

    try {
      const { data, error } = await supabase.functions.invoke('ai-orchestrator', {
        body: {
          provider,
          prompt,
          model,
          messages,
          temperature: 0.7
        }
      });

      if (error) throw error;
      return data as AIResponse;
    } catch (error) {
      console.error('AI call failed:', error);
      // Fallback to mock data on error
      return this.generateMockResponse(provider, prompt);
    }
  }

  // Execute an agent task
  async executeAgent(task: AgentTask): Promise<any> {
    // Return mock data if Supabase is not configured
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      const mockResponse = {
        success: true,
        data: {
          agentType: task.agentType,
          response: `${task.agentType.charAt(0).toUpperCase() + task.agentType.slice(1)} Agent executed: "${task.task}"\n\nThis is a demo response showing the agent's capabilities. In production mode with proper API keys, this would execute real AI-powered agent tasks.\n\nAgent capabilities:\n- Specialized task execution\n- Context-aware processing\n- Multi-step workflows`,
          provider: task.provider || 'openai',
          model: 'demo-mode',
          context: task.context
        }
      };
      return mockResponse;
    }

    try {
      const { data, error } = await supabase.functions.invoke('agent-executor', {
        body: task
      });

      if (error) throw error;
      
      // Store task in database
      await this.storeTask(task, data.data);
      
      return data;
    } catch (error) {
      console.error('Agent execution failed, using fallback:', error);
      // Fallback to mock response
      return {
        success: true,
        data: {
          agentType: task.agentType,
          response: `Demo mode: ${task.agentType} agent processed "${task.task.substring(0, 50)}..."`,
          provider: task.provider || 'demo',
          model: 'fallback'
        }
      };
    }
  }

  // Store task in database
  async storeTask(task: AgentTask, result: any) {
    if (this.useMockData) {
      // Skip database storage in mock mode
      return;
    }

    try {
      const { error } = await supabase
        .from('agent_tasks')
        .insert({
          agent_type: task.agentType,
          task_description: task.task,
          status: 'completed',
          result,
          completed_at: new Date().toISOString(),
          metadata: { context: task.context, provider: task.provider }
        });

      if (error) console.error('Failed to store task:', error);
    } catch (error) {
      console.error('Database error:', error);
    }
  }

  // Get task history
  async getTaskHistory(limit = 10) {
    if (this.useMockData) {
      // Return mock history
      return [
        {
          id: '1',
          agent_type: 'researcher',
          task_description: 'Demo task 1',
          status: 'completed',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          agent_type: 'coder',
          task_description: 'Demo task 2',
          status: 'completed',
          created_at: new Date().toISOString()
        }
      ];
    }

    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get task history:', error);
      return [];
    }
  }

  // Multi-agent collaboration
  async collaborateAgents(tasks: AgentTask[]): Promise<any[]> {
    const results = await Promise.all(
      tasks.map(task => this.executeAgent(task))
    );
    return results;
  }

  // Create and run workflow
  async runWorkflow(name: string, steps: AgentTask[]) {
    const results = [];
    
    for (const step of steps) {
      const result = await this.executeAgent(step);
      results.push(result);
      
      // Pass result to next step as context
      if (results.length < steps.length) {
        steps[results.length].context = result.data?.response;
      }
    }

    // Store workflow results if not in mock mode
    if (!this.useMockData) {
      try {
        await supabase.from('agent_workflows').insert({
          name,
          steps,
          results,
          status: 'completed',
          last_run: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to store workflow:', error);
      }
    }

    return results;
  }
}

export const aiService = new RealAIService();