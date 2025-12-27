import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Brain,
  Plus,
  Search,
  Clock,
  Database,
  Cpu,
  HardDrive,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { memoryService, MemoryListItem, CognitiveMemoryEntry } from '@/services/memoryService';

export function CognitiveMemoryPanel() {
  const [memories, setMemories] = useState<MemoryListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchKey, setSearchKey] = useState('');
  
  // Form state for adding new memory
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState<CognitiveMemoryEntry>({
    key: '',
    value: '',
    memory_type: 'general',
    context: '',
    ttl_days: undefined
  });

  useEffect(() => {
    loadMemories();
  }, [filterType]);

  const loadMemories = async () => {
    setLoading(true);
    setError(null);
    try {
      const type = filterType === 'all' ? undefined : filterType;
      const data = await memoryService.list(type);
      setMemories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemory = async () => {
    if (!newMemory.key || !newMemory.value) {
      setError('Key and value are required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await memoryService.store(newMemory);
      setSuccess('Memory stored successfully');
      setShowAddForm(false);
      setNewMemory({
        key: '',
        value: '',
        memory_type: 'general',
        context: '',
        ttl_days: undefined
      });
      await loadMemories();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to store memory');
    } finally {
      setLoading(false);
    }
  };

  const handleRetrieve = async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await memoryService.retrieve(key);
      setSuccess(`Retrieved: ${result.value.substring(0, 100)}...`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve memory');
    } finally {
      setLoading(false);
    }
  };

  const getMemoryTypeIcon = (type: string) => {
    switch (type) {
      case 'pfs':
        return <HardDrive className="h-4 w-4 text-blue-400" />;
      case 'air_weaver':
        return <Database className="h-4 w-4 text-cyan-400" />;
      case 'raspberry_pi':
        return <Cpu className="h-4 w-4 text-green-400" />;
      default:
        return <Brain className="h-4 w-4 text-purple-400" />;
    }
  };

  const getMemoryTypeColor = (type: string) => {
    switch (type) {
      case 'pfs':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'air_weaver':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'raspberry_pi':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  const filteredMemories = searchKey
    ? memories.filter(m => m.key.toLowerCase().includes(searchKey.toLowerCase()))
    : memories;

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="h-7 w-7 text-purple-400" />
          <div>
            <h3 className="text-2xl font-bold text-white">Cognitive Memory System</h3>
            <p className="text-sm text-gray-400">
              Timestamp-based memory for PFS, Air Weaver & Raspberry Pi
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Memory
        </Button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="mb-4 border-green-500/50 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4 border-red-500/50 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      {/* Add Memory Form */}
      {showAddForm && (
        <Card className="mb-6 p-4 bg-gray-900/50 border-purple-500/30">
          <h4 className="text-lg font-semibold mb-4 text-white">Store New Memory</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Memory Key</label>
              <Input
                value={newMemory.key}
                onChange={(e) => setNewMemory({ ...newMemory, key: e.target.value })}
                placeholder="e.g., config:api_settings"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Value</label>
              <Textarea
                value={newMemory.value}
                onChange={(e) => setNewMemory({ ...newMemory, value: e.target.value })}
                placeholder="Memory value or JSON data"
                className="bg-gray-800 border-gray-700"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Memory Type</label>
                <Select
                  value={newMemory.memory_type}
                  onValueChange={(value: any) => setNewMemory({ ...newMemory, memory_type: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="pfs">PFS</SelectItem>
                    <SelectItem value="air_weaver">Air Weaver</SelectItem>
                    <SelectItem value="raspberry_pi">Raspberry Pi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">TTL (Days)</label>
                <Input
                  type="number"
                  value={newMemory.ttl_days || ''}
                  onChange={(e) => setNewMemory({ 
                    ...newMemory, 
                    ttl_days: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  placeholder="Optional"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Context (Optional)</label>
              <Input
                value={newMemory.context}
                onChange={(e) => setNewMemory({ ...newMemory, context: e.target.value })}
                placeholder="Additional context"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddMemory}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Store Memory
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
                className="border-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Search by key..."
              className="pl-10 bg-gray-800 border-gray-700"
            />
          </div>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="pfs">PFS</SelectItem>
            <SelectItem value="air_weaver">Air Weaver</SelectItem>
            <SelectItem value="raspberry_pi">Raspberry Pi</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={loadMemories}
          variant="outline"
          className="border-gray-700"
        >
          Refresh
        </Button>
      </div>

      {/* Memory List */}
      <ScrollArea className="h-[400px]">
        {loading && memories.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <Database className="h-16 w-16 text-purple-400/30 mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">No Memories Found</h4>
            <p className="text-sm text-gray-500">
              {searchKey ? 'Try a different search term' : 'Add your first memory to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className="p-4 rounded-lg border border-gray-700 bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMemoryTypeIcon(memory.type)}
                    <code className="text-sm text-purple-300">{memory.key}</code>
                  </div>
                  <Badge className={getMemoryTypeColor(memory.type)}>
                    {memory.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(memory.created_at)}
                    </span>
                    <span>Accessed: {memory.access_count}x</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRetrieve(memory.key)}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    Retrieve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
