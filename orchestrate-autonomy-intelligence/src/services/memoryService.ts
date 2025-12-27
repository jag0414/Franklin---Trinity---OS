// Cognitive Memory Service for Franklin Trinity OS
// Provides timestamp-based memory storage for PFS, Air Weaver, and Raspberry Pi

const API_BASE_URL = 'http://localhost:8080';

export interface CognitiveMemoryEntry {
  id?: number;
  key: string;
  value: string;
  memory_type: 'general' | 'pfs' | 'air_weaver' | 'raspberry_pi';
  context?: string;
  metadata?: Record<string, any>;
  ttl_days?: number;
}

export interface MemoryListItem {
  id: number;
  key: string;
  type: string;
  access_count: number;
  created_at: string;
  last_accessed: string;
}

export class CognitiveMemoryService {
  /**
   * Store a memory with timestamp
   */
  async store(entry: CognitiveMemoryEntry): Promise<{ id: number; key: string; status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/memory/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry)
      });

      if (!response.ok) {
        throw new Error('Failed to store memory');
      }

      return await response.json();
    } catch (error) {
      console.error('Memory store error:', error);
      throw error;
    }
  }

  /**
   * Retrieve a memory by key
   */
  async retrieve(key: string, memoryType?: string): Promise<{ key: string; value: string }> {
    try {
      const url = new URL(`${API_BASE_URL}/api/memory/${key}`);
      if (memoryType) {
        url.searchParams.set('memory_type', memoryType);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Memory not found or expired');
        }
        throw new Error('Failed to retrieve memory');
      }

      return await response.json();
    } catch (error) {
      console.error('Memory retrieve error:', error);
      throw error;
    }
  }

  /**
   * List all stored memories
   */
  async list(memoryType?: string, limit: number = 100): Promise<MemoryListItem[]> {
    try {
      const url = new URL(`${API_BASE_URL}/api/memory/list`);
      if (memoryType) {
        url.searchParams.set('memory_type', memoryType);
      }
      url.searchParams.set('limit', limit.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Failed to list memories');
      }

      return await response.json();
    } catch (error) {
      console.error('Memory list error:', error);
      throw error;
    }
  }

  /**
   * Store PFS (Persistent File System) memory
   */
  async storePFS(key: string, value: string, context?: string, ttlDays?: number) {
    return this.store({
      key,
      value,
      memory_type: 'pfs',
      context,
      ttl_days: ttlDays
    });
  }

  /**
   * Store Air Weaver memory
   */
  async storeAirWeaver(key: string, value: string, context?: string, ttlDays?: number) {
    return this.store({
      key,
      value,
      memory_type: 'air_weaver',
      context,
      ttl_days: ttlDays
    });
  }

  /**
   * Store Raspberry Pi memory
   */
  async storeRaspberryPi(key: string, value: string, context?: string, ttlDays?: number) {
    return this.store({
      key,
      value,
      memory_type: 'raspberry_pi',
      context,
      ttl_days: ttlDays
    });
  }

  /**
   * Store conversation history with timestamps
   */
  async storeConversation(conversationId: string, messages: any[], metadata?: Record<string, any>) {
    return this.store({
      key: `conversation:${conversationId}`,
      value: JSON.stringify(messages),
      memory_type: 'general',
      context: 'conversation_history',
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        message_count: messages.length
      }
    });
  }

  /**
   * Retrieve conversation history
   */
  async getConversation(conversationId: string): Promise<any[]> {
    try {
      const result = await this.retrieve(`conversation:${conversationId}`);
      return JSON.parse(result.value);
    } catch (error) {
      console.error('Failed to retrieve conversation:', error);
      return [];
    }
  }

  /**
   * Store AI task results for future reference
   */
  async storeTaskResult(taskId: string, result: any, metadata?: Record<string, any>) {
    return this.store({
      key: `task:${taskId}`,
      value: JSON.stringify(result),
      memory_type: 'general',
      context: 'task_result',
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      },
      ttl_days: 30  // Keep for 30 days
    });
  }

  /**
   * Get task result from memory
   */
  async getTaskResult(taskId: string): Promise<any> {
    try {
      const result = await this.retrieve(`task:${taskId}`);
      return JSON.parse(result.value);
    } catch (error) {
      console.error('Failed to retrieve task result:', error);
      return null;
    }
  }
}

export const memoryService = new CognitiveMemoryService();
