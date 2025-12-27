// Master AI Orchestration Service
// Coordinates all AI operations, manages state, and handles real-time updates

import { aiBackend, AIRequest, AIResponse } from './aiBackend';
import { aiPipeline } from './aiPipeline';
import { aiConfig } from './aiConfig';

export interface AITask {
  id: string;
  type: 'simple' | 'pipeline' | 'multi-agent' | 'autonomous';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
  request: AIRequest;
  response?: AIResponse;
  error?: string;
  startTime?: number;
  endTime?: number;
  retries: number;
}

export interface AIAgent {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
  status: 'idle' | 'busy' | 'error';
  currentTask?: string;
  performance: {
    tasksCompleted: number;
    averageResponseTime: number;
    successRate: number;
  };
}

type EventCallback = (data: unknown) => void;

class MasterAIOrchestrator {
  private tasks: Map<string, AITask> = new Map();
  private agents: Map<string, AIAgent> = new Map();
  private taskQueue: AITask[] = [];
  private eventListeners: Map<string, Set<EventCallback>> = new Map();
  private isProcessing = false;
  private processInterval?: NodeJS.Timeout;

  constructor() {
    this.initializeAgents();
    this.startProcessing();
  }

  private initializeAgents() {
    // Initialize AI agents based on available providers
    const providers = [
      { id: 'openai', name: 'OpenAI GPT-4', capabilities: ['text', 'code', 'vision', 'image'] },
      { id: 'anthropic', name: 'Claude 3', capabilities: ['text', 'code', 'analysis'] },
      { id: 'google', name: 'Gemini Pro', capabilities: ['text', 'vision', 'analysis'] },
      { id: 'stability', name: 'Stable Diffusion', capabilities: ['image'] },
      { id: 'meta', name: 'LLaMA 2', capabilities: ['text', 'code'] },
      { id: 'cohere', name: 'Cohere', capabilities: ['text', 'embeddings'] }
    ];

    providers.forEach(provider => {
      this.agents.set(provider.id, {
        id: provider.id,
        name: provider.name,
        type: 'ai-provider',
        capabilities: provider.capabilities,
        status: 'idle',
        performance: {
          tasksCompleted: 0,
          averageResponseTime: 0,
          successRate: 100
        }
      });
    });

    // Add specialized agents
    this.agents.set('coordinator', {
      id: 'coordinator',
      name: 'Task Coordinator',
      type: 'orchestrator',
      capabilities: ['task-routing', 'load-balancing', 'optimization'],
      status: 'idle',
      performance: {
        tasksCompleted: 0,
        averageResponseTime: 0,
        successRate: 100
      }
    });
  }

  private startProcessing() {
    this.isProcessing = true;
    this.processInterval = setInterval(() => this.processTasks(), 100);
  }

  stopProcessing() {
    this.isProcessing = false;
    if (this.processInterval) {
      clearInterval(this.processInterval);
    }
  }

  private async processTasks() {
    if (!this.isProcessing || this.taskQueue.length === 0) return;

    // Get next task by priority
    this.taskQueue.sort((a, b) => b.priority - a.priority);
    const task = this.taskQueue.shift();
    
    if (!task) return;

    task.status = 'processing';
    task.startTime = Date.now();
    this.tasks.set(task.id, task);
    this.emit('task:started', task);

    try {
      let response: AIResponse;

      switch (task.type) {
        case 'simple':
          response = await this.processSimpleTask(task);
          break;
        case 'pipeline':
          response = await this.processPipelineTask(task);
          break;
        case 'multi-agent':
          response = await this.processMultiAgentTask(task);
          break;
        case 'autonomous':
          response = await this.processAutonomousTask(task);
          break;
      }

      task.response = response;
      task.status = 'completed';
      task.endTime = Date.now();
      
      this.updateAgentPerformance(task);
      this.emit('task:completed', task);
      
    } catch (error: unknown) {
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.status = 'failed';
      task.endTime = Date.now();
      
      if (task.retries < 3) {
        task.retries++;
        task.status = 'pending';
        this.taskQueue.push(task);
        this.emit('task:retry', task);
      } else {
        this.emit('task:failed', task);
      }
    }

    this.tasks.set(task.id, task);
  }

  private async processSimpleTask(task: AITask): Promise<AIResponse> {
    const agent = this.selectBestAgent(task.request);
    this.updateAgentStatus(agent.id, 'busy', task.id);
    
    try {
      const response = await aiBackend.executeRequest(task.request);
      return response;
    } finally {
      this.updateAgentStatus(agent.id, 'idle');
    }
  }

  private async processPipelineTask(task: AITask): Promise<unknown> {
    const { pipelineId, input, context } = task.request as { pipelineId: string; input: unknown; context?: { role: string; content: string }[] };
    return await aiPipeline.executePipeline(pipelineId, input, context);
  }

  private async processMultiAgentTask(task: AITask): Promise<unknown> {
    const { prompt, agents } = task.request as { prompt: string; agents?: string[] };
    const selectedAgents = agents || ['openai', 'anthropic', 'google'];
    
    // Mark agents as busy
    selectedAgents.forEach((agentId: string) => {
      this.updateAgentStatus(agentId, 'busy', task.id);
    });

    try {
      const responses = await aiBackend.orchestrateMultiAgent(prompt, selectedAgents);
      
      // Aggregate responses
      const aggregatedResponse = await this.aggregateResponses(responses);
      return aggregatedResponse;
    } finally {
      selectedAgents.forEach((agentId: string) => {
        this.updateAgentStatus(agentId, 'idle');
      });
    }
  }

  private async processAutonomousTask(task: AITask): Promise<AIResponse> {
    // Autonomous task processing with self-directed goal completion
    const { goal, constraints, maxSteps = 10 } = task.request as { goal: string; constraints?: string[]; maxSteps?: number };
    const steps: AIResponse[] = [];
    let currentContext = goal;
    
    for (let i = 0; i < maxSteps; i++) {
      // Plan next step
      const planRequest: AIRequest = {
        id: crypto.randomUUID(),
        type: 'text',
        prompt: `Given the goal: "${goal}" and current context: "${currentContext}", what is the next step? Constraints: ${JSON.stringify(constraints)}`,
        provider: 'anthropic'
      };
      
      const plan = await aiBackend.executeRequest(planRequest);
      
      // Execute step
      const executeRequest: AIRequest = {
        id: crypto.randomUUID(),
        type: 'text',
        prompt: plan.content,
        provider: 'openai'
      };
      
      const result = await aiBackend.executeRequest(executeRequest);
      
      steps.push({
        step: i + 1,
        plan: plan.content,
        execution: result.content,
        timestamp: Date.now()
      });
      
      // Check if goal is achieved
      const checkRequest: AIRequest = {
        id: crypto.randomUUID(),
        type: 'text',
        prompt: `Has the following goal been achieved? Goal: "${goal}". Current state: ${JSON.stringify(steps)}. Answer with YES or NO and explain.`,
        provider: 'anthropic'
      };
      
      const check = await aiBackend.executeRequest(checkRequest);
      
      if (check.content.toLowerCase().includes('yes')) {
        break;
      }
      
      currentContext = result.content;
    }
    
    return {
      goal,
      steps,
      completed: true,
      timestamp: Date.now()
    };
  }

  private selectBestAgent(request: AIRequest): AIAgent {
    // Select the best available agent based on capabilities and current load
    const capability = request.type;
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => 
        agent.capabilities.includes(capability) && 
        agent.status === 'idle'
      )
      .sort((a, b) => b.performance.successRate - a.performance.successRate);
    
    return availableAgents[0] || this.agents.get('openai')!;
  }

  private updateAgentStatus(agentId: string, status: 'idle' | 'busy' | 'error', taskId?: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.currentTask = taskId;
      this.emit('agent:status', agent);
    }
  }

  private updateAgentPerformance(task: AITask) {
    if (!task.request.provider) return;
    
    const agent = this.agents.get(task.request.provider);
    if (agent && task.startTime && task.endTime) {
      const responseTime = task.endTime - task.startTime;
      const currentAvg = agent.performance.averageResponseTime;
      const completed = agent.performance.tasksCompleted;
      
      agent.performance.tasksCompleted++;
      agent.performance.averageResponseTime = 
        (currentAvg * completed + responseTime) / (completed + 1);
      
      if (task.status === 'failed') {
        agent.performance.successRate = 
          (agent.performance.successRate * completed) / (completed + 1);
      }
    }
  }

  private async aggregateResponses(responses: PromiseSettledResult<AIResponse>[]): Promise<AIResponse> {
    // Intelligently aggregate responses from multiple agents
    const validResponses = responses.filter(r => r.status === 'fulfilled');
    
    if (validResponses.length === 0) {
      throw new Error('All agents failed to respond');
    }
    
    // Use another AI to aggregate the responses
    const aggregateRequest: AIRequest = {
      id: crypto.randomUUID(),
      type: 'text',
      prompt: `Aggregate and synthesize these AI responses into a single comprehensive answer: ${JSON.stringify(validResponses)}`,
      provider: 'anthropic'
    };
    
    return await aiBackend.executeRequest(aggregateRequest);
  }

  // Public API
  async submitTask(request: AIRequest, type: AITask['type'] = 'simple', priority: number = 5): Promise<string> {
    const task: AITask = {
      id: crypto.randomUUID(),
      type,
      status: 'pending',
      priority,
      request,
      retries: 0
    };
    
    this.tasks.set(task.id, task);
    this.taskQueue.push(task);
    this.emit('task:created', task);
    
    return task.id;
  }

  getTask(taskId: string): AITask | undefined {
    return this.tasks.get(taskId);
  }

  getTasks(): AITask[] {
    return Array.from(this.tasks.values());
  }

  getAgents(): AIAgent[] {
    return Array.from(this.agents.values());
  }

  getAgent(agentId: string): AIAgent | undefined {
    return this.agents.get(agentId);
  }

  // Event system
  on(event: string, callback: EventCallback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: EventCallback) {
    this.eventListeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: unknown) {
    this.eventListeners.get(event)?.forEach(callback => callback(data));
  }

  // Statistics
  getStatistics() {
    const tasks = Array.from(this.tasks.values());
    const agents = Array.from(this.agents.values());
    
    return {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      processingTasks: tasks.filter(t => t.status === 'processing').length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      failedTasks: tasks.filter(t => t.status === 'failed').length,
      activeAgents: agents.filter(a => a.status === 'busy').length,
      totalAgents: agents.length,
      averageResponseTime: agents.reduce((sum, a) => sum + a.performance.averageResponseTime, 0) / agents.length,
      overallSuccessRate: agents.reduce((sum, a) => sum + a.performance.successRate, 0) / agents.length
    };
  }
}

export const aiOrchestrator = new MasterAIOrchestrator();