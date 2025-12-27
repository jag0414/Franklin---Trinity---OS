import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Clock,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface AgentResponse {
  id: string;
  type: 'success' | 'error' | 'info';
  content: string;
  timestamp: Date;
  provider?: string;
  model?: string;
  agent?: string;
}

interface AgentResponseWindowProps {
  responses: AgentResponse[];
  isProcessing?: boolean;
  currentTask?: string;
}

export function AgentResponseWindow({ 
  responses, 
  isProcessing = false,
  currentTask 
}: AgentResponseWindowProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Highlight code blocks
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [responses]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getResponseIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Sparkles className="h-5 w-5 text-blue-400" />;
    }
  };

  const getResponseColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/5';
      case 'error':
        return 'border-red-500/30 bg-red-500/5';
      default:
        return 'border-blue-500/30 bg-blue-500/5';
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-purple-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Agent Response Window</h3>
            <p className="text-sm text-gray-400">Real-time AI agent responses and processing status</p>
          </div>
        </div>
        {responses.length > 0 && (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            {responses.length} {responses.length === 1 ? 'Response' : 'Responses'}
          </Badge>
        )}
      </div>

      {/* Current Processing Status */}
      {isProcessing && currentTask && (
        <div className="mb-4 p-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
            <div>
              <p className="text-sm font-medium text-cyan-300">Processing...</p>
              <p className="text-xs text-cyan-400/70">{currentTask}</p>
            </div>
          </div>
        </div>
      )}

      {/* Response List */}
      <ScrollArea className="h-[500px] pr-4">
        {responses.length === 0 && !isProcessing ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <Brain className="h-16 w-16 text-purple-400/30 mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">No Responses Yet</h4>
            <p className="text-sm text-gray-500">
              Agent responses will appear here once tasks are executed
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response, index) => (
              <div
                key={response.id}
                className={`p-4 rounded-lg border ${getResponseColor(response.type)} transition-all duration-300 hover:shadow-lg`}
                style={{
                  animation: index === 0 ? 'slideIn 0.3s ease-out' : 'none'
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getResponseIcon(response.type)}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        {response.agent && (
                          <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                            {response.agent}
                          </Badge>
                        )}
                        {response.provider && (
                          <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                            {response.provider}
                          </Badge>
                        )}
                        {response.model && (
                          <Badge className="bg-gray-500/20 text-gray-300 text-xs">
                            {response.model}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(response.timestamp)}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(response.content, response.id)}
                      className="h-7 w-7 p-0"
                    >
                      {copiedId === response.id ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-200 whitespace-pre-wrap">
                  {response.content.includes('```') ? (
                    // Render code blocks
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: response.content
                          .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => 
                            `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
                          )
                      }} 
                    />
                  ) : (
                    response.content
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Inline styles for animation */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
}
