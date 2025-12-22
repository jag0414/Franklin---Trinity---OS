import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Radio,
  Activity,
  X,
  ChevronUp
} from 'lucide-react';
import { voiceService, VoiceCommand } from '@/services/voiceService';

interface VoiceAssistantProps {
  onCommand: (command: VoiceCommand) => void;
  onTranscript: (text: string) => void;
  lastResponse?: string;
  isProcessing?: boolean;
}

export function VoiceAssistant({ 
  onCommand, 
  onTranscript, 
  lastResponse,
  isProcessing = false 
}: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const [isSupported, setIsSupported] = useState(true);

  // Initialize voice service callbacks
  useEffect(() => {
    // Check browser support
    const recognitionSupported = voiceService.isRecognitionSupported();
    const synthesisSupported = voiceService.isSynthesisSupported();
    setIsSupported(recognitionSupported && synthesisSupported);

    if (!recognitionSupported) {
      setError('Speech recognition not supported in this browser. Try Chrome or Edge.');
      return;
    }

    // Set up callbacks
    voiceService.onResult((text, isFinal) => {
      if (isFinal) {
        setTranscript(text);
        setInterimTranscript('');
        onTranscript(text);
        
        // Parse and execute command
        const command = voiceService.parseCommand(text);
        setCommandHistory(prev => [command, ...prev].slice(0, 10));
        onCommand(command);
      } else {
        setInterimTranscript(text);
      }
    });

    voiceService.onError((err) => {
      setError(err);
      setIsListening(false);
    });

    voiceService.onStart(() => {
      setIsListening(true);
      setError(null);
    });

    voiceService.onEnd(() => {
      setIsListening(false);
    });

    // Load available voices
    const loadVoices = () => {
      const voices = voiceService.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !selectedVoice) {
        const englishVoice = voices.find(v => v.lang.startsWith('en'));
        setSelectedVoice(englishVoice?.name || voices[0].name);
      }
    };

    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      voiceService.destroy();
    };
  }, []);

  // Speak response when it changes
  useEffect(() => {
    if (lastResponse && voiceEnabled && !isProcessing) {
      speakResponse(lastResponse);
    }
  }, [lastResponse, voiceEnabled, isProcessing]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      voiceService.stopListening();
    } else {
      setError(null);
      voiceService.startListening();
    }
  }, [isListening]);

  const speakResponse = useCallback(async (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      setIsSpeaking(true);
      await voiceService.speak(text, {
        rate: voiceRate,
        pitch: voicePitch,
        volume: voiceVolume
      });
    } catch (err) {
      console.error('Speech synthesis error:', err);
    } finally {
      setIsSpeaking(false);
    }
  }, [voiceEnabled, voiceRate, voicePitch, voiceVolume]);

  const stopSpeaking = useCallback(() => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    voiceService.setVoice(voiceName);
  };

  if (!isSupported) {
    return (
      <Card className="bg-black/40 backdrop-blur-xl border-red-500/20 p-4">
        <div className="flex items-center gap-3 text-red-400">
          <MicOff className="h-5 w-5" />
          <span className="text-sm">Voice features not supported in this browser</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isListening ? 'bg-cyan-500/20 animate-pulse' : 'bg-gray-800'}`}>
            <Radio className={`h-5 w-5 ${isListening ? 'text-cyan-400' : 'text-gray-400'}`} />
          </div>
          <div>
            <h4 className="font-semibold text-white">Voice Assistant</h4>
            <p className="text-xs text-gray-400">
              {isListening ? 'Listening...' : 'Click mic to speak'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={isListening ? 'border-cyan-500 text-cyan-400' : 'border-gray-600 text-gray-400'}
          >
            {isListening ? 'Active' : 'Ready'}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="h-8 w-8"
          >
            {showSettings ? <ChevronUp className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-4 mb-4">
        {/* Microphone Button */}
        <Button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`relative h-16 w-16 rounded-full transition-all ${
            isListening 
              ? 'bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/50' 
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          {isListening ? (
            <>
              <Mic className="h-6 w-6 text-white" />
              {/* Pulse rings */}
              <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75" />
              <span className="absolute inset-0 rounded-full border border-cyan-400 animate-pulse" />
            </>
          ) : (
            <MicOff className="h-6 w-6 text-gray-400" />
          )}
        </Button>

        {/* Transcription Display */}
        <div className="flex-1 min-h-[60px] bg-gray-900/50 rounded-lg p-3 border border-gray-700">
          {isListening && interimTranscript && (
            <p className="text-gray-400 text-sm italic animate-pulse">
              {interimTranscript}
            </p>
          )}
          {transcript && !interimTranscript && (
            <p className="text-white text-sm">
              {transcript}
            </p>
          )}
          {!transcript && !interimTranscript && !isListening && (
            <p className="text-gray-500 text-sm">
              Say a command like "Execute analyze market trends" or "Use researcher agent"
            </p>
          )}
        </div>

        {/* Voice Output Controls */}
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`h-10 w-10 ${voiceEnabled ? 'border-green-500 text-green-400' : 'border-gray-600 text-gray-400'}`}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          {isSpeaking && (
            <Button
              variant="outline"
              size="icon"
              onClick={stopSpeaking}
              className="h-10 w-10 border-red-500 text-red-400"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-green-500/10 rounded-lg border border-green-500/30">
          <Activity className="h-4 w-4 text-green-400 animate-pulse" />
          <span className="text-sm text-green-400">Speaking response...</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={stopSpeaking}
            className="ml-auto text-green-400 hover:text-green-300"
          >
            Stop
          </Button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-2 bg-red-500/10 rounded-lg border border-red-500/30">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 mb-4">
          <h5 className="text-sm font-semibold text-gray-300">Voice Settings</h5>
          
          {/* Voice Selection */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Voice</label>
            <Select value={selectedVoice} onValueChange={handleVoiceChange}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                {availableVoices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rate Slider */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Speed: {voiceRate.toFixed(1)}x
            </label>
            <Slider
              value={[voiceRate]}
              onValueChange={([value]) => setVoiceRate(value)}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Pitch Slider */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Pitch: {voicePitch.toFixed(1)}
            </label>
            <Slider
              value={[voicePitch]}
              onValueChange={([value]) => setVoicePitch(value)}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Volume Slider */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Volume: {Math.round(voiceVolume * 100)}%
            </label>
            <Slider
              value={[voiceVolume]}
              onValueChange={([value]) => setVoiceVolume(value)}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Test Voice Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => speakResponse("Voice assistant is ready. How can I help you today?")}
            className="w-full"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Test Voice
          </Button>
        </div>
      )}

      {/* Voice Commands Help */}
      <div className="space-y-2">
        <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Voice Commands</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-gray-900/30 rounded border border-gray-800">
            <span className="text-cyan-400">"Execute [prompt]"</span>
            <p className="text-gray-500">Run AI command</p>
          </div>
          <div className="p-2 bg-gray-900/30 rounded border border-gray-800">
            <span className="text-cyan-400">"Use researcher agent"</span>
            <p className="text-gray-500">Select agent type</p>
          </div>
          <div className="p-2 bg-gray-900/30 rounded border border-gray-800">
            <span className="text-cyan-400">"Run pipeline"</span>
            <p className="text-gray-500">Execute workflow</p>
          </div>
          <div className="p-2 bg-gray-900/30 rounded border border-gray-800">
            <span className="text-cyan-400">"Stop" / "Clear"</span>
            <p className="text-gray-500">Control commands</p>
          </div>
        </div>
      </div>

      {/* Recent Commands */}
      {commandHistory.length > 0 && (
        <div className="mt-4 space-y-2">
          <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Voice Commands</h5>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {commandHistory.slice(0, 5).map((cmd, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs p-2 bg-gray-900/30 rounded">
                <Badge variant="outline" className="text-[10px]">{cmd.action}</Badge>
                <span className="text-gray-400 truncate">{cmd.rawText}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default VoiceAssistant;
