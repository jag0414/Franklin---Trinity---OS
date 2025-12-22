import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Image, 
  Video, 
  Music, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Download,
  Sparkles,
  Zap
} from 'lucide-react';
import { unifiedAIService, TaskStatus } from '@/services/unifiedAIBackend';

export function MultiModalGenerator() {
  const [prompt, setPrompt] = useState('');
  const [selectedModalities, setSelectedModalities] = useState<string[]>(['text']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const modalities = [
    { id: 'text', label: 'Text', icon: FileText, description: 'AI-generated text response' },
    { id: 'image', label: 'Image', icon: Image, description: 'Generated image via Gemini Imagen' },
    { id: 'audio', label: 'Audio', icon: Music, description: 'Text-to-speech audio' },
    { id: 'video', label: 'Video', icon: Video, description: 'Generated video (experimental)' },
  ];

  const toggleModality = (modalityId: string) => {
    setSelectedModalities(prev => 
      prev.includes(modalityId)
        ? prev.filter(m => m !== modalityId)
        : [...prev, modalityId]
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || selectedModalities.length === 0) {
      setError('Please enter a prompt and select at least one modality');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResults(null);
    setTaskStatus(null);

    try {
      // For multimodal generation
      if (selectedModalities.length > 1) {
        const response = await unifiedAIService.generateMultiModal({
          prompt,
          modalities: selectedModalities as any,
        });

        setCurrentTask(response.task_id);

        // Poll for status
        const finalStatus = await unifiedAIService.pollTaskStatus(
          response.task_id,
          (status) => setTaskStatus(status)
        );

        setResults(finalStatus.result);
      } else {
        // Single modality generation
        const modality = selectedModalities[0];
        
        if (modality === 'text') {
          const response = await unifiedAIService.generateText({ prompt });
          setResults({ text: response });
        } else if (modality === 'image') {
          const response = await unifiedAIService.generateImage({ prompt });
          setCurrentTask(response.task_id);
          const finalStatus = await unifiedAIService.pollTaskStatus(
            response.task_id,
            (status) => setTaskStatus(status)
          );
          setResults({ image: finalStatus.result });
        } else if (modality === 'audio') {
          const response = await unifiedAIService.generateAudio({ text: prompt });
          setCurrentTask(response.task_id);
          const finalStatus = await unifiedAIService.pollTaskStatus(
            response.task_id,
            (status) => setTaskStatus(status)
          );
          setResults({ audio: finalStatus.result });
        } else if (modality === 'video') {
          const response = await unifiedAIService.generateVideo({ prompt });
          setCurrentTask(response.task_id);
          const finalStatus = await unifiedAIService.pollTaskStatus(
            response.task_id,
            (status) => setTaskStatus(status),
            120, // Video takes longer
            5000
          );
          setResults({ video: finalStatus.result });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
          Multimodal AI Generator
        </h2>
        <p className="text-gray-400">
          Generate text, images, audio, and video using Gemini AI
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Create Your Vision
            </CardTitle>
            <CardDescription>
              Describe what you want to create
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="A futuristic city at sunset with flying cars and neon lights..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px] bg-gray-800 border-gray-700 text-white"
              disabled={isGenerating}
            />

            <div>
              <Label className="text-sm font-semibold mb-3 block">Output Modalities</Label>
              <div className="grid grid-cols-2 gap-3">
                {modalities.map((modality) => {
                  const Icon = modality.icon;
                  const isSelected = selectedModalities.includes(modality.id);
                  
                  return (
                    <div
                      key={modality.id}
                      onClick={() => !isGenerating && toggleModality(modality.id)}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${isSelected 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }
                        ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          disabled={isGenerating}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
                            <span className="font-medium text-sm">{modality.label}</span>
                          </div>
                          <p className="text-xs text-gray-500">{modality.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || selectedModalities.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate {selectedModalities.length > 1 ? 'All' : selectedModalities[0]}
                </>
              )}
            </Button>

            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {taskStatus && (
              <Alert className="bg-blue-900/20 border-blue-500/50">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  {taskStatus.status === 'processing' 
                    ? 'Processing your request...' 
                    : taskStatus.status === 'completed'
                    ? 'Generation complete!'
                    : 'Generation failed'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Results
            </CardTitle>
            <CardDescription>
              Your generated content will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!results && !isGenerating && (
              <div className="flex items-center justify-center h-[400px] text-gray-500">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p>No results yet. Start generating!</p>
                </div>
              </div>
            )}

            {isGenerating && !results && (
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-purple-400" />
                  <p className="text-gray-400">Creating your content...</p>
                </div>
              </div>
            )}

            {results && (
              <Tabs defaultValue={Object.keys(results)[0]} className="w-full">
                <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(results).length}, 1fr)` }}>
                  {results.text && <TabsTrigger value="text">Text</TabsTrigger>}
                  {results.image && <TabsTrigger value="image">Image</TabsTrigger>}
                  {results.audio && <TabsTrigger value="audio">Audio</TabsTrigger>}
                  {results.video && <TabsTrigger value="video">Video</TabsTrigger>}
                </TabsList>

                {results.text && (
                  <TabsContent value="text" className="mt-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-200 whitespace-pre-wrap">
                        {results.text.content || results.text.text}
                      </p>
                    </div>
                  </TabsContent>
                )}

                {results.image && (
                  <TabsContent value="image" className="mt-4">
                    <div className="space-y-4">
                      <img 
                        src={results.image.url} 
                        alt="Generated" 
                        className="w-full rounded-lg"
                      />
                      <Button variant="outline" className="w-full" asChild>
                        <a href={results.image.url} download>
                          <Download className="w-4 h-4 mr-2" />
                          Download Image
                        </a>
                      </Button>
                    </div>
                  </TabsContent>
                )}

                {results.audio && (
                  <TabsContent value="audio" className="mt-4">
                    <div className="space-y-4">
                      <audio controls className="w-full">
                        <source src={results.audio.url} type="audio/mp3" />
                      </audio>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={results.audio.url} download>
                          <Download className="w-4 h-4 mr-2" />
                          Download Audio
                        </a>
                      </Button>
                    </div>
                  </TabsContent>
                )}

                {results.video && (
                  <TabsContent value="video" className="mt-4">
                    <div className="space-y-4">
                      <video controls className="w-full rounded-lg">
                        <source src={results.video.url} type="video/mp4" />
                      </video>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={results.video.url} download>
                          <Download className="w-4 h-4 mr-2" />
                          Download Video
                        </a>
                      </Button>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MultiModalGenerator;
