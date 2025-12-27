// Voice Service using Web Speech API
// Handles speech recognition, text-to-speech, and voice commands

export interface VoiceCommand {
  action: 'execute' | 'agent' | 'pipeline' | 'stop' | 'help' | 'clear' | 'read' | 'unknown';
  target?: string;
  parameters?: Record<string, string>;
  rawText: string;
}

export interface VoiceServiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  voiceRate?: number;
  voicePitch?: number;
  voiceVolume?: number;
}

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
  message?: string;
};

interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private config: VoiceServiceConfig;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private onResultCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onStartCallback: (() => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor(config: VoiceServiceConfig = {}) {
    this.config = {
      language: config.language || 'en-US',
      continuous: config.continuous ?? false,
      interimResults: config.interimResults ?? true,
      voiceRate: config.voiceRate ?? 1.0,
      voicePitch: config.voicePitch ?? 1.0,
      voiceVolume: config.voiceVolume ?? 1.0,
    };

    this.synthesis = window.speechSynthesis;
    this.initRecognition();
    this.loadVoices();
  }

  private initRecognition(): void {
    const SpeechRecognitionAPI = 
      (window as WindowWithSpeech).SpeechRecognition || 
      (window as WindowWithSpeech).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognitionAPI();
    this.recognition.lang = this.config.language!;
    this.recognition.continuous = this.config.continuous!;
    this.recognition.interimResults = this.config.interimResults!;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStartCallback?.();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onEndCallback?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        this.onResultCallback?.(finalTranscript, true);
      } else if (interimTranscript) {
        this.onResultCallback?.(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      this.onErrorCallback?.(event.error);
    };
  }

  private loadVoices(): void {
    const setVoice = () => {
      const voices = this.synthesis.getVoices();
      // Prefer a natural-sounding English voice
      this.selectedVoice = voices.find(v => 
        v.lang.startsWith('en') && v.name.includes('Google')
      ) || voices.find(v => 
        v.lang.startsWith('en') && v.name.includes('Natural')
      ) || voices.find(v => 
        v.lang.startsWith('en')
      ) || voices[0] || null;
    };

    setVoice();
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = setVoice;
    }
  }

  // Check if speech recognition is supported
  isRecognitionSupported(): boolean {
    return !!(
      (window as WindowWithSpeech).SpeechRecognition || 
      (window as WindowWithSpeech).webkitSpeechRecognition
    );
  }

  // Check if speech synthesis is supported
  isSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // Start listening for voice input
  startListening(): boolean {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      return false;
    }

    if (this.isListening) {
      return true;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start recognition:', error);
      return false;
    }
  }

  // Stop listening
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Toggle listening state
  toggleListening(): boolean {
    if (this.isListening) {
      this.stopListening();
      return false;
    } else {
      return this.startListening();
    }
  }

  // Get listening state
  getIsListening(): boolean {
    return this.isListening;
  }

  // Set callbacks
  onResult(callback: (transcript: string, isFinal: boolean) => void): void {
    this.onResultCallback = callback;
  }

  onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  onStart(callback: () => void): void {
    this.onStartCallback = callback;
  }

  onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  // Text-to-speech: Speak text
  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSynthesisSupported()) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.selectedVoice;
      utterance.rate = options?.rate ?? this.config.voiceRate!;
      utterance.pitch = options?.pitch ?? this.config.voicePitch!;
      utterance.volume = options?.volume ?? this.config.voiceVolume!;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(event.error));

      this.synthesis.speak(utterance);
    });
  }

  // Stop speaking
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Check if currently speaking
  isSpeaking(): boolean {
    return this.synthesis?.speaking || false;
  }

  // Parse voice command to determine action
  parseCommand(transcript: string): VoiceCommand {
    const text = transcript.toLowerCase().trim();
    
    // Execute command patterns
    if (text.includes('execute') || text.includes('run command') || text.includes('send')) {
      const promptMatch = text.match(/(?:execute|run command|send)\s+(.+)/i);
      return {
        action: 'execute',
        parameters: { prompt: promptMatch?.[1] || '' },
        rawText: transcript
      };
    }

    // Agent command patterns
    if (text.includes('agent') || text.includes('use')) {
      const agentTypes = ['researcher', 'coder', 'analyst', 'writer', 'designer', 'strategist'];
      const foundAgent = agentTypes.find(agent => text.includes(agent));
      
      if (foundAgent) {
        const taskMatch = text.match(/(?:to|for)\s+(.+)/i);
        return {
          action: 'agent',
          target: foundAgent,
          parameters: { task: taskMatch?.[1] || '' },
          rawText: transcript
        };
      }
    }

    // Pipeline command patterns
    if (text.includes('pipeline') || text.includes('workflow')) {
      if (text.includes('research') && text.includes('write')) {
        return {
          action: 'pipeline',
          target: 'research-write',
          rawText: transcript
        };
      }
      if (text.includes('code') && text.includes('document')) {
        return {
          action: 'pipeline',
          target: 'code-document',
          rawText: transcript
        };
      }
      return {
        action: 'pipeline',
        rawText: transcript
      };
    }

    // Stop command
    if (text.includes('stop') || text.includes('cancel') || text.includes('abort')) {
      return {
        action: 'stop',
        rawText: transcript
      };
    }

    // Help command
    if (text.includes('help') || text.includes('what can you do')) {
      return {
        action: 'help',
        rawText: transcript
      };
    }

    // Clear command
    if (text.includes('clear') || text.includes('reset')) {
      return {
        action: 'clear',
        rawText: transcript
      };
    }

    // Read results command
    if (text.includes('read') || text.includes('tell me')) {
      return {
        action: 'read',
        rawText: transcript
      };
    }

    // Default: treat as a prompt to execute
    return {
      action: 'execute',
      parameters: { prompt: transcript },
      rawText: transcript
    };
  }

  // Get available voices
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis?.getVoices() || [];
  }

  // Set voice by name or index
  setVoice(voiceNameOrIndex: string | number): void {
    const voices = this.getVoices();
    if (typeof voiceNameOrIndex === 'number') {
      this.selectedVoice = voices[voiceNameOrIndex] || null;
    } else {
      this.selectedVoice = voices.find(v => v.name === voiceNameOrIndex) || null;
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<VoiceServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.recognition) {
      if (newConfig.language) this.recognition.lang = newConfig.language;
      if (newConfig.continuous !== undefined) this.recognition.continuous = newConfig.continuous;
      if (newConfig.interimResults !== undefined) this.recognition.interimResults = newConfig.interimResults;
    }
  }

  // Cleanup
  destroy(): void {
    this.stopListening();
    this.stopSpeaking();
    this.recognition = null;
  }
}

// Export singleton instance
export const voiceService = new VoiceService();

// Export class for custom instances
export { VoiceService };
