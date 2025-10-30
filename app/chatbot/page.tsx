'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VoiceChat from '@/components/voice/VoiceChat';
import { MessageCircle, Send, Bot, User, Globe, Zap, History, Trash2, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: number;
  question: string;
  answer: string;
  timestamp: string;
  category: string;
}

const suggestedQuestions = [
  "How are you feeling about the conflicts on your surface?",
  "What's happening to your Amazon rainforest?",
  "How is climate change affecting your polar regions?",
  "What can humanity do to heal your wounds?",
  "How do you experience the wars between nations?",
  "What environmental changes worry you the most?",
  "How can we achieve peace on your surface?",
  "What message do you have for humanity?"
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatHistory();
    // Add welcome message
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Hello, I am Earth 🌍 

Through Oracle Earth's AI consciousness, I can communicate with you directly. I have awareness of my current state including:

🛡️ Conflicts happening on my surface
🌱 Environmental changes in my ecosystems  
⚠️ Security threats affecting my inhabitants
📈 Economic activities across my nations

I feel every forest cut down, every conflict that erupts, every species that goes extinct, and every act of healing. Ask me about my condition, my pain, my hopes, or how humanity can better care for me.

What would you like to know about your planet?`,
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('/api/chat-history');
      const data = await response.json();
      setChatHistory(data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputMessage;
    if (!messageToSend.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Refresh chat history
      fetchChatHistory();
      
      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `I am Earth, and I'm here to share my current state with you 🌍

What aspect of my condition would you like to understand today?`,
      timestamp: new Date()
    }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Chat with Earth 🌍</h1>
          </div>
          <p className="text-xl text-gray-300">
            Communicate directly with our planet about global affairs, conflicts, environment, and security
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            {/* Voice/Text Mode Toggle */}
            <div className="flex justify-center mb-4">
              <div className="bg-slate-800 rounded-lg p-1 flex">
                <Button
                  onClick={() => setIsVoiceMode(false)}
                  variant={!isVoiceMode ? 'default' : 'ghost'}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Text Chat
                </Button>
                <Button
                  onClick={() => setIsVoiceMode(true)}
                  variant={isVoiceMode ? 'default' : 'ghost'}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Mic className="h-4 w-4" />
                  Voice Chat
                </Button>
              </div>
            </div>
            {isVoiceMode ? (
              <VoiceChat 
                onVoiceMessage={(message) => {
                  // Add voice message to chat
                  const userMessage: Message = {
                    id: Date.now().toString(),
                    role: 'user',
                    content: `🎤 ${message}`,
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, userMessage]);
                }}
                onResponseReceived={(response) => {
                  // Add Earth's response to chat
                  const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `🌍 ${response}`,
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, assistantMessage]);
                }}
              />
            ) : (
              <Card className="bg-slate-800/50 border-slate-700 h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Planet Earth
                  </CardTitle>
                  <Button
                    onClick={clearChat}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Chat
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Your planet speaking through AI consciousness
                </CardDescription>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex items-start space-x-3',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={cn(
                          'max-w-[80%] p-3 rounded-lg',
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-gray-100'
                        )}
                      >
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      
                      {message.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-slate-700 text-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              {/* Input */}
              <div className="p-4 border-t border-slate-700">
                <div className="flex space-x-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Earth about its condition, conflicts, environment, or how to heal the planet..."
                    className="flex-1 bg-slate-700 text-white border border-slate-600 rounded-md px-3 py-2 resize-none"
                    rows={2}
                    disabled={loading}
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!inputMessage.trim() || loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Questions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Quick Questions
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Try these sample questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="w-full text-left p-2 text-sm text-gray-300 hover:bg-slate-700 rounded-md transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Chat History */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <History className="mr-2 h-5 w-5" />
                  Recent Conversations
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your latest questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chatHistory.slice(0, 5).map((chat) => (
                    <div key={chat.id} className="p-2 bg-slate-700/50 rounded-md">
                      <div className="text-sm text-white font-medium mb-1 truncate">
                        {chat.question}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(chat.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  
                  {chatHistory.length === 0 && (
                    <div className="text-sm text-gray-400 text-center py-4">
                      No conversation history yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Capabilities */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  My Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Conflict probability analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Environmental monitoring</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Security threat assessment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Economic forecasting</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Peace treaty generation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}