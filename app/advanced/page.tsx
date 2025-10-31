'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TimeMachine from '@/components/globe/TimeMachine';
import CrisisDashboard from '@/components/dashboard/CrisisDashboard';
import WhatIfSimulator from '@/components/simulator/WhatIfSimulator';
import VoiceChat from '@/components/voice/VoiceChat';
import { Clock, Radio, Brain, Mic, Zap, Globe } from 'lucide-react';
import NewsWidget from '@/components/news/NewsWidget';

export default function AdvancedPage() {
  const [activeFeature, setActiveFeature] = useState<'time' | 'crisis' | 'simulator' | 'voice'>('time');
  const [currentYear, setCurrentYear] = useState(2024);

  const features = [
    {
      id: 'time' as const,
      title: 'Time Machine',
      description: 'Travel through time to see historical events and future predictions',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'crisis' as const,
      title: 'Crisis Dashboard',
      description: 'Real-time monitoring of global crisis events and threats',
      icon: Radio,
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'simulator' as const,
      title: 'What-If Simulator',
      description: 'AI-powered scenario analysis and future predictions',
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'voice' as const,
      title: 'Voice Chat',
      description: 'Speak directly with Earth using advanced voice AI',
      icon: Mic,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-white">Advanced Features</h1>
          </div>
          <p className="text-xl text-gray-300">
            Cutting-edge AI tools for global intelligence analysis and interaction
          </p>
        </div>

        {/* Feature Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  activeFeature === feature.id
                    ? 'bg-slate-700 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Active Feature Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feature Component */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  {activeFeature === 'time' && <><Clock className="h-5 w-5" /> Time Machine Control</>}
                  {activeFeature === 'crisis' && <><Radio className="h-5 w-5" /> Crisis Monitoring</>}
                  {activeFeature === 'simulator' && <><Brain className="h-5 w-5" /> Scenario Simulator</>}
                  {activeFeature === 'voice' && <><Mic className="h-5 w-5" /> Voice Interface</>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeFeature === 'time' && (
                  <div className="space-y-6">
                    <TimeMachine 
                      currentYear={currentYear}
                      onTimeChange={setCurrentYear}
                    />
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Time Travel Instructions:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Use the slider to travel through time (1990-2050)</li>
                        <li>• Click play to auto-advance through years</li>
                        <li>• Jump to specific historical events with quick buttons</li>
                        <li>• View historical data, current events, or AI predictions</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeFeature === 'crisis' && (
                  <div className="space-y-6">
                    <CrisisDashboard 
                      onEventSelect={(event) => {
                        console.log('Crisis event selected:', event);
                      }}
                    />
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Crisis Monitoring Features:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Real-time global crisis event detection</li>
                        <li>• Filter by event type (conflict, environment, terrorism, etc.)</li>
                        <li>• Severity-based color coding and alerts</li>
                        <li>• Live updates every few seconds</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeFeature === 'simulator' && (
                  <div className="space-y-6">
                    <WhatIfSimulator 
                      onSimulationRun={(result) => {
                        console.log('Simulation result:', result);
                      }}
                    />
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Simulation Capabilities:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Test global policy scenarios and their outcomes</li>
                        <li>• Adjust parameters to see different results</li>
                        <li>• AI-powered probability and impact analysis</li>
                        <li>• Detailed positive/negative outcome predictions</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeFeature === 'voice' && (
                  <div className="space-y-6">
                    <VoiceChat 
                      onVoiceMessage={(message) => {
                        console.log('Voice message:', message);
                      }}
                      onResponseReceived={(response) => {
                        console.log('Voice response:', response);
                      }}
                    />
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Voice Chat Features:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Natural speech recognition in multiple languages</li>
                        <li>• Earth responds with synthesized voice</li>
                        <li>• Hands-free interaction with global intelligence</li>
                        <li>• Quick voice commands for common questions</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* Current Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Time Machine</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Crisis Monitor</span>
                  <span className="text-green-400">Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">AI Simulator</span>
                  <span className="text-green-400">Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Voice Chat</span>
                  <span className="text-blue-400">Available</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => setActiveFeature('time')}
                  variant="ghost" 
                  className="w-full justify-start text-blue-400 hover:bg-blue-400/20"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Jump to 2030
                </Button>
                <Button 
                  onClick={() => setActiveFeature('crisis')}
                  variant="ghost" 
                  className="w-full justify-start text-red-400 hover:bg-red-400/20"
                >
                  <Radio className="h-4 w-4 mr-2" />
                  View Live Crises
                </Button>
                <Button 
                  onClick={() => setActiveFeature('simulator')}
                  variant="ghost" 
                  className="w-full justify-start text-purple-400 hover:bg-purple-400/20"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Run Climate Simulation
                </Button>
                <Button 
                  onClick={() => setActiveFeature('voice')}
                  variant="ghost" 
                  className="w-full justify-start text-green-400 hover:bg-green-400/20"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Talk to Earth
                </Button>
              </CardContent>
            </Card>

            {/* Feature Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">About This Feature</CardTitle>
              </CardHeader>
              <CardContent>
                {activeFeature === 'time' && (
                  <p className="text-gray-300 text-sm">
                    The Time Machine allows you to explore Earth's past and future. View historical conflicts, 
                    environmental changes, and AI-predicted scenarios across a 60-year timeline.
                  </p>
                )}
                {activeFeature === 'crisis' && (
                  <p className="text-gray-300 text-sm">
                    Real-time crisis monitoring uses AI to detect and categorize global events as they happen. 
                    Stay informed about conflicts, natural disasters, and security threats worldwide.
                  </p>
                )}
                {activeFeature === 'simulator' && (
                  <p className="text-gray-300 text-sm">
                    The What-If Simulator uses advanced AI to model complex global scenarios. Test policy changes, 
                    environmental actions, and diplomatic solutions to see their potential outcomes.
                  </p>
                )}
                {activeFeature === 'voice' && (
                  <p className="text-gray-300 text-sm">
                    Voice Chat enables natural conversation with Earth's AI consciousness. Use speech recognition 
                    and synthesis to have fluid conversations about global affairs and planetary health.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}