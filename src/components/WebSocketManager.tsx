import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Wifi, WifiOff, Terminal, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { aiOrchestrator } from '@/services/aiOrchestrator';

interface Message {
  id: string;
  type: 'task' | 'agent' | 'system' | 'error' | 'success';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export function WebSocketManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false); // Disabled by default

  useEffect(() => {
    // Connect to AI Orchestrator events
    const handleTaskCreated = (task: any) => {
      addMessage({
        type: 'task',
        content: `New task created: ${task.type} - ${task.id.slice(0, 8)}`,
        metadata: task
      });
    };

    const handleTaskCompleted = (task: any) => {
      addMessage({
        type: 'success',
        content: `Task completed: ${task.id.slice(0, 8)} in ${task.endTime - task.startTime}ms`,
        metadata: task
      });
    };

    const handleTaskFailed = (task: any) => {
      addMessage({
        type: 'error',
        content: `Task failed: ${task.id.slice(0, 8)} - ${task.error}`,
        metadata: task
      });
    };

    const handleAgentStatus = (agent: any) => {
      addMessage({
        type: 'agent',
        content: `Agent ${agent.name} is now ${agent.status}`,
        metadata: agent
      });
    };

    // Subscribe to orchestrator events
    aiOrchestrator.on('task:created', handleTaskCreated);
    aiOrchestrator.on('task:completed', handleTaskCompleted);
    aiOrchestrator.on('task:failed', handleTaskFailed);
    aiOrchestrator.on('agent:status', handleAgentStatus);

    setIsConnected(true);
    
    // Update statistics every second
    const statsInterval = setInterval(() => {
      setStats(aiOrchestrator.getStatistics());
    }, 1000);

    // Add initial system message
    addMessage({
      type: 'system',
      content: 'AI Orchestration System Online - All agents ready'
    });

    // Simulate some activity every 30 seconds (reduced from 5 seconds)
    const activityInterval = setInterval(() => {
      const taskTypes = ['simple', 'pipeline', 'multi-agent'];
      const prompts = [
        'Analyze market trends',
        'Generate content strategy',
        'Optimize code performance',
        'Create visual assets',
        'Process data pipeline'
      ];
      
      const randomType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      
      aiOrchestrator.submitTask({
        type: 'text',
        prompt: randomPrompt,
        provider: 'openai'
      }, randomType as any, Math.floor(Math.random() * 10));
    }, 30000); // Changed from 5000ms to 30000ms

    return () => {
      aiOrchestrator.off('task:created', handleTaskCreated);
      aiOrchestrator.off('task:completed', handleTaskCompleted);
      aiOrchestrator.off('task:failed', handleTaskFailed);
      aiOrchestrator.off('agent:status', handleAgentStatus);
      clearInterval(statsInterval);
      clearInterval(activityInterval);
    };
  }, []);

  useEffect(() => {
    // Only scroll if auto-scroll is explicitly enabled by user
    if (autoScrollEnabled && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScrollEnabled]);

  const addMessage = (msg: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev.slice(-50), {
      ...msg,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }]);
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'task': return <Terminal className="h-4 w-4" />;
      case 'agent': return <Zap className="h-4 w-4" />;
      case 'system': return <Activity className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'task': return 'text-blue-400';
      case 'agent': return 'text-purple-400';
      case 'system': return 'text-gray-400';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="h-6 w-6 text-purple-400" />
            <div className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Orchestration Monitor
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
            className="border-purple-500/50"
          >
            Auto-Scroll: {autoScrollEnabled ? 'ON' : 'OFF'}
          </Button>
          <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Total Tasks</div>
            <div className="text-xl font-bold text-blue-400">{stats.totalTasks}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Processing</div>
            <div className="text-xl font-bold text-yellow-400">{stats.processingTasks}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Completed</div>
            <div className="text-xl font-bold text-green-400">{stats.completedTasks}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Active Agents</div>
            <div className="text-xl font-bold text-purple-400">{stats.activeAgents}/{stats.totalAgents}</div>
          </div>
        </div>
      )}

      <ScrollArea className="h-[400px] rounded-lg bg-gray-950/50 border border-purple-500/20 p-4">
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-purple-500/10 ${getMessageColor(message.type)}`}
            >
              <div className="mt-0.5">{getMessageIcon(message.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {message.type}
                  </Badge>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Showing last 50 messages</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMessages([])}
          className="text-xs"
        >
          Clear Messages
        </Button>
      </div>
    </Card>
  );
}

export default WebSocketManager;