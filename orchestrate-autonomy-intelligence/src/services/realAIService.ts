import { supabase } from '@/lib/supabase';

export interface AIResponse {
  success: boolean;
  data?: {
    provider: string;
    content: string;
    model: string;
    usage?: any;
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
  // Call the AI orchestrator with any provider
  async callAI(
    provider: 'openai' | 'anthropic' | 'google',
    prompt: string,
    model?: string,
    messages?: any[]
  ): Promise<AIResponse> {
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
      return {
        success: false,
        error: error.message || 'AI service unavailable'
      };
    }
  }

  // Execute an agent task
  async executeAgent(task: AgentTask): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('agent-executor', {
        body: task
      });

      if (error) throw error;
      
      // Store task in database
      await this.storeTask(task, data.data);
      
      return data;
    } catch (error) {
      console.error('Agent execution failed:', error);
      return {
        success: false,
        error: error.message || 'Agent execution failed'
      };
    }
  }

  // Store task in database
  async storeTask(task: AgentTask, result: any) {
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

    // Store workflow results
    await supabase.from('agent_workflows').insert({
      name,
      steps,
      results,
      status: 'completed',
      last_run: new Date().toISOString()
    });

    return results;
  }
}

export const aiService = new RealAIService();