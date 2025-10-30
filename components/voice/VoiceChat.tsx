'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Radio, Loader2 } from 'lucide-react';

interface VoiceChatProps {
  onVoiceMessage: (message: string) => void;
  onResponseReceived: (response: string) => void;
}

export default function VoiceChat({ onVoiceMessage, onResponseReceived }: VoiceChatProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;

    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      
      // Initialize speech recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
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

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          handleVoiceInput(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      synthRef.current = speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleVoiceInput = async (message: string) => {
    setIsProcessing(true);
    onVoiceMessage(message);

    try {
      // Send to chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      
      if (data.response) {
        onResponseReceived(data.response);
        speakResponse(data.response);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      setError('Failed to process voice input');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    // Create a more natural Earth voice
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Natural') || 
      voice.name.includes('Enhanced') ||
      voice.name.includes('Premium') ||
      (voice.lang.startsWith('en') && voice.localService)
    ) || voices.find(voice => voice.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.9; // Slightly slower for wisdom
    utterance.pitch = 0.8; // Lower pitch for Earth's deep voice
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError('Speech synthesis failed');
    };

    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    
    setTranscript('');
    setError(null);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (!recognitionRef.current || !isListening) return;
    recognitionRef.current.stop();
  };

  const stopSpeaking = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  if (!isSupported) {
    return (
      <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <MicOff className="h-8 w-8 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400">Voice chat not supported in this browser</p>
          <p className="text-xs text-gray-500 mt-2">Try Chrome, Edge, or Safari</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Radio className="h-5 w-5 text-green-400" />
          Voice Chat with Earth
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isSpeaking}
            className={`w-16 h-16 rounded-full ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isListening ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>

          <Button
            onClick={stopSpeaking}
            disabled={!isSpeaking}
            variant="outline"
            className={`w-12 h-12 rounded-full border-slate-600 ${
              isSpeaking ? 'text-blue-400 border-blue-400' : ''
            }`}
          >
            {isSpeaking ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Status */}
        <div className="text-center">
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-blue-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Earth is thinking...</span>
            </div>
          )}
          
          {isListening && (
            <div className="text-green-400">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Listening...</span>
              </div>
            </div>
          )}

          {isSpeaking && (
            <div className="text-blue-400">
              <div className="flex items-center justify-center gap-2">
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Earth is speaking...</span>
              </div>
            </div>
          )}

          {!isListening && !isSpeaking && !isProcessing && (
            <p className="text-gray-400 text-sm">
              Click the microphone to talk to Earth
            </p>
          )}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-slate-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-300">
              <span className="text-blue-400">You:</span> {transcript}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Quick Voice Commands */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Try saying:</h4>
          <div className="grid grid-cols-1 gap-2">
            {[
              "How are you feeling today, Earth?",
              "What's happening in the Amazon?",
              "Tell me about climate change",
              "What conflicts worry you most?",
              "How can humanity help you heal?"
            ].map((command, index) => (
              <button
                key={index}
                onClick={() => handleVoiceInput(command)}
                disabled={isListening || isSpeaking || isProcessing}
                className="text-left p-2 text-xs text-gray-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
              >
                "{command}"
              </button>
            ))}
          </div>
        </div>

        {/* Voice Settings */}
        <div className="border-t border-slate-600 pt-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Earth's Voice</span>
            <span>Deep & Wise</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}