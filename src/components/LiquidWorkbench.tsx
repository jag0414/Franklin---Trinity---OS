import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, Download, Code, FileText, Image, Music, 
  Play, Pause, Save, FolderOpen, Settings, Zap,
  Database, Cloud, Terminal, Sparkles, Brain, 
  MessageSquare, DollarSign, AlertCircle, CheckCircle,
  FileCode, Table, FileSpreadsheet, Presentation
} from 'lucide-react';

interface WorkbenchProps {
  className?: string;
}

const LiquidWorkbench: React.FC<WorkbenchProps> = ({ className }) => {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [files, setFiles] = useState<any[]>([]);
  
  // Simulate liquid animation
  const [liquidFlow, setLiquidFlow] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLiquidFlow(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate chunked upload
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const newFile = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };
      
      setFiles(prev => [...prev, newFile]);
      setActiveFile(newFile.id);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Call Oracle analyzer first
      const analysis = await fetch('http://localhost:8000/api/oracle/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, provider: 'openai' })
      }).then(r => r.json());
      
      setEstimatedCost(analysis.analysis?.final_cost || 0);
      
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResponse('AI Response: ' + prompt);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportFile = async (format: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/export/microsoft365?format=${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: 'current', title: 'Export', content: prompt })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export.${format}`;
        a.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className={`liquid-workbench ${className}`}>
      {/* Liquid Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          style={{
            transform: `translateX(${liquidFlow}%)`,
            filter: 'blur(100px)',
            transition: 'transform 0.5s ease-out'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Liquid Workbench Dashboard
          </h1>
          <p className="text-gray-400">VS Studio-Supercharged Interface for High-Volume AI Processing</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - File Explorer */}
          <div className="col-span-3">
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                  Files & Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <label className="block">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload (up to 500MB)
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                
                {uploadProgress > 0 && (
                  <div className="space-y-1">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-gray-400">{uploadProgress}% uploaded</p>
                  </div>
                )}
                
                <div className="space-y-1 mt-4">
                  {files.map(file => (
                    <div 
                      key={file.id}
                      className={`p-2 rounded cursor-pointer text-sm ${
                        activeFile === file.id 
                          ? 'bg-blue-600/20 border border-blue-500' 
                          : 'bg-gray-800/50 hover:bg-gray-800'
                      }`}
                      onClick={() => setActiveFile(file.id)}
                    >
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Editor Area */}
          <div className="col-span-6">
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-green-400" />
                    Command Center
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Est: ${estimatedCost.toFixed(4)}
                    </Badge>
                    <Badge variant={isProcessing ? "default" : "outline"}>
                      {isProcessing ? 'Processing...' : 'Ready'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="prompt" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                    <TabsTrigger value="prompt">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Prompt
                    </TabsTrigger>
                    <TabsTrigger value="response">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Response
                    </TabsTrigger>
                    <TabsTrigger value="code">
                      <Code className="w-4 h-4 mr-2" />
                      Code
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="prompt" className="space-y-4">
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter your AI prompt here... Chat is FREE, task execution is priced based on complexity"
                      className="min-h-[400px] bg-gray-950/50 border-gray-700 font-mono text-sm"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handlePromptSubmit} 
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        {isProcessing ? (
                          <>
                            <Play className="w-4 h-4 mr-2 animate-pulse" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Execute Task
                          </>
                        )}
                      </Button>
                      <Button variant="outline">
                        <Save className="w-4 h-4 mr-2" />
                        Save Project
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="response" className="space-y-4">
                    <div className="min-h-[400px] bg-gray-950/50 border border-gray-700 rounded-lg p-4">
                      {response ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-sm text-green-400">Response Generated</span>
                          </div>
                          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                            {response}
                          </pre>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <Brain className="w-12 h-12 mb-4 opacity-50" />
                          <p>Response will appear here</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="space-y-4">
                    <div className="min-h-[400px] bg-gray-950/50 border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-300">
                      <div className="text-gray-500">// Code view - Coming soon</div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Actions & Export */}
          <div className="col-span-3 space-y-4">
            {/* Export Panel */}
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Download className="w-5 h-5 text-purple-400" />
                  Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-gray-400 mb-3">Microsoft 365</p>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => exportFile('excel')}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2 text-green-400" />
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => exportFile('word')}
                >
                  <FileText className="w-4 h-4 mr-2 text-blue-400" />
                  Word
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => exportFile('powerpoint')}
                >
                  <Presentation className="w-4 h-4 mr-2 text-orange-400" />
                  PowerPoint
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => exportFile('project')}
                >
                  <Table className="w-4 h-4 mr-2 text-purple-400" />
                  Project
                </Button>
                
                <div className="border-t border-gray-700 my-4" />
                
                <p className="text-xs text-gray-400 mb-3">Google Workspace</p>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2 text-blue-400" />
                  Google Docs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileSpreadsheet className="w-4 h-4 mr-2 text-green-400" />
                  Google Sheets
                </Button>
                
                <div className="border-t border-gray-700 my-4" />
                
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Notion
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Music className="w-4 h-4 mr-2 text-pink-400" />
                  Audio (TTS)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Image className="w-4 h-4 mr-2 text-cyan-400" />
                  Image (JPEG)
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="w-5 h-5 text-cyan-400" />
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Files</span>
                  <Badge>{files.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Active Tasks</span>
                  <Badge variant="outline">{isProcessing ? 1 : 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total Cost</span>
                  <Badge className="bg-green-600">${estimatedCost.toFixed(2)}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Provider Status */}
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cloud className="w-5 h-5 text-yellow-400" />
                  Providers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">OpenAI</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Anthropic</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Google</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Local Llama</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Local Mistral</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidWorkbench;
