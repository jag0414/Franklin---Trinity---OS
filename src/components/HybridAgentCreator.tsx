import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, Zap, Plus, Trash2, Settings, 
  Target, Layers, Network, Sparkles, CheckCircle
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  provider: string;
  model: string;
  strength: string;
  color: string;
}

const AVAILABLE_AGENTS: Agent[] = [
  { id: 'gpt4', name: 'GPT-4', provider: 'openai', model: 'gpt-4', strength: 'General Intelligence', color: 'text-green-400' },
  { id: 'claude', name: 'Claude 3', provider: 'anthropic', model: 'claude-3-opus', strength: 'Reasoning & Ethics', color: 'text-purple-400' },
  { id: 'gemini', name: 'Gemini Pro', provider: 'google', model: 'gemini-pro', strength: 'Multimodal Analysis', color: 'text-blue-400' },
  { id: 'llama', name: 'Llama 3', provider: 'local', model: 'llama-3-70b', strength: 'Local Processing', color: 'text-yellow-400' },
  { id: 'mistral', name: 'Mistral', provider: 'local', model: 'mistral-7b', strength: 'Fast Inference', color: 'text-orange-400' },
  { id: 'codellama', name: 'CodeLlama', provider: 'local', model: 'codellama-34b', strength: 'Code Generation', color: 'text-cyan-400' },
];

const HybridAgentCreator: React.FC = () => {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [hybridName, setHybridName] = useState('');
  const [agentWeights, setAgentWeights] = useState<Record<string, number>>({});
  const [collaborationMode, setCollaborationMode] = useState<'sequential' | 'parallel' | 'consensus'>('parallel');
  const [savedHybrids, setSavedHybrids] = useState<any[]>([]);

  const toggleAgent = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
      const newWeights = { ...agentWeights };
      delete newWeights[agentId];
      setAgentWeights(newWeights);
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
      setAgentWeights({ ...agentWeights, [agentId]: 50 });
    }
  };

  const updateWeight = (agentId: string, weight: number) => {
    setAgentWeights({ ...agentWeights, [agentId]: weight });
  };

  const createHybridAgent = () => {
    if (selectedAgents.length < 2) {
      alert('Select at least 2 agents to create a hybrid');
      return;
    }

    if (!hybridName) {
      alert('Enter a name for your hybrid agent');
      return;
    }

    const hybrid = {
      id: crypto.randomUUID(),
      name: hybridName,
      agents: selectedAgents.map(id => {
        const agent = AVAILABLE_AGENTS.find(a => a.id === id);
        return {
          ...agent,
          weight: agentWeights[id] || 50
        };
      }),
      mode: collaborationMode,
      createdAt: new Date().toISOString()
    };

    setSavedHybrids([...savedHybrids, hybrid]);
    
    // Reset form
    setHybridName('');
    setSelectedAgents([]);
    setAgentWeights({});
    
    alert('Hybrid agent created successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-4">
          Hybrid Hyper Agent Creator
        </h2>
        <p className="text-gray-400">Combine multiple AI models for super-complex tasking</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Agent Selection */}
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Select Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {AVAILABLE_AGENTS.map(agent => (
              <div 
                key={agent.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedAgents.includes(agent.id)
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
                onClick={() => toggleAgent(agent.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={selectedAgents.includes(agent.id)}
                      onCheckedChange={() => toggleAgent(agent.id)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{agent.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {agent.provider}
                        </Badge>
                      </div>
                      <div className={`text-xs ${agent.color} mt-1`}>
                        {agent.strength}
                      </div>
                    </div>
                  </div>
                  {selectedAgents.includes(agent.id) && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>

                {/* Weight Slider */}
                {selectedAgents.includes(agent.id) && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Influence Weight</span>
                      <span className="text-purple-400">{agentWeights[agent.id] || 50}%</span>
                    </div>
                    <Slider
                      value={[agentWeights[agent.id] || 50]}
                      onValueChange={(values) => updateWeight(agent.id, values[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Configuration & Preview */}
        <div className="space-y-6">
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Hybrid Agent Name</label>
                <Input
                  value={hybridName}
                  onChange={(e) => setHybridName(e.target.value)}
                  placeholder="e.g., Super Analyst Pro"
                  className="bg-gray-950/50 border-gray-700"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Collaboration Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={collaborationMode === 'sequential' ? 'default' : 'outline'}
                    onClick={() => setCollaborationMode('sequential')}
                    className="flex flex-col items-center py-4 h-auto"
                  >
                    <Target className="w-5 h-5 mb-1" />
                    <span className="text-xs">Sequential</span>
                  </Button>
                  <Button
                    variant={collaborationMode === 'parallel' ? 'default' : 'outline'}
                    onClick={() => setCollaborationMode('parallel')}
                    className="flex flex-col items-center py-4 h-auto"
                  >
                    <Network className="w-5 h-5 mb-1" />
                    <span className="text-xs">Parallel</span>
                  </Button>
                  <Button
                    variant={collaborationMode === 'consensus' ? 'default' : 'outline'}
                    onClick={() => setCollaborationMode('consensus')}
                    className="flex flex-col items-center py-4 h-auto"
                  >
                    <Sparkles className="w-5 h-5 mb-1" />
                    <span className="text-xs">Consensus</span>
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <Button
                  onClick={createHybridAgent}
                  disabled={selectedAgents.length < 2 || !hybridName}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Hybrid Agent
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-pink-400" />
                Hybrid Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAgents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select agents to preview hybrid</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-2">
                      {hybridName || 'Unnamed Hybrid'}
                    </div>
                    <Badge>{selectedAgents.length} Agents</Badge>
                    <Badge variant="outline" className="ml-2">{collaborationMode}</Badge>
                  </div>

                  <div className="border-t border-gray-700 pt-3 space-y-2">
                    {selectedAgents.map(id => {
                      const agent = AVAILABLE_AGENTS.find(a => a.id === id);
                      const weight = agentWeights[id] || 50;
                      return (
                        <div key={id} className="flex items-center justify-between text-sm">
                          <span className={agent?.color}>{agent?.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                style={{ width: `${weight}%` }}
                              />
                            </div>
                            <span className="text-gray-400 w-10 text-right">{weight}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Saved Hybrids */}
      {savedHybrids.length > 0 && (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Saved Hybrid Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {savedHybrids.map(hybrid => (
                <div 
                  key={hybrid.id}
                  className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{hybrid.name}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setSavedHybrids(savedHybrids.filter(h => h.id !== hybrid.id))}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>{hybrid.agents.length} agents • {hybrid.mode}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hybrid.agents.map((agent: any) => (
                        <Badge key={agent.id} variant="outline" className="text-xs">
                          {agent.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HybridAgentCreator;
