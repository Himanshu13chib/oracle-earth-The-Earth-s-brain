'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, TrendingUp, TrendingDown, Zap, Brain } from 'lucide-react';

interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  category: 'conflict' | 'environment' | 'economy' | 'policy';
  parameters: { [key: string]: number };
  icon: string;
}

interface SimulationResult {
  scenario: string;
  outcomes: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  probability: number;
  timeframe: string;
  globalImpact: number;
}

const predefinedScenarios: SimulationScenario[] = [
  {
    id: 'climate-action',
    title: 'Global Carbon Tax Implementation',
    description: 'What if all countries implement a $100/ton carbon tax?',
    category: 'environment',
    parameters: { carbonTax: 100, compliance: 85, economicImpact: -2.5 },
    icon: '🌱'
  },
  {
    id: 'peace-treaty',
    title: 'Major Conflict Resolution',
    description: 'What if Russia-Ukraine conflict ends with peace treaty?',
    category: 'conflict',
    parameters: { conflictReduction: 80, economicRecovery: 15, refugeeReturn: 60 },
    icon: '🕊️'
  },
  {
    id: 'economic-cooperation',
    title: 'Global Trade Alliance',
    description: 'What if major economies form new trade alliance?',
    category: 'economy',
    parameters: { tradeIncrease: 25, gdpGrowth: 3.2, inflation: -1.5 },
    icon: '🤝'
  },
  {
    id: 'renewable-transition',
    title: 'Rapid Renewable Energy Shift',
    description: 'What if renewable energy reaches 80% by 2030?',
    category: 'environment',
    parameters: { renewablePercent: 80, jobsCreated: 50000000, emissions: -45 },
    icon: '⚡'
  },
  {
    id: 'cyber-security',
    title: 'Global Cyber Defense Pact',
    description: 'What if all nations unite against cyber threats?',
    category: 'policy',
    parameters: { cyberAttacks: -70, cooperation: 90, techInvestment: 500 },
    icon: '🛡️'
  }
];

interface WhatIfSimulatorProps {
  onSimulationRun: (result: SimulationResult) => void;
}

export default function WhatIfSimulator({ onSimulationRun }: WhatIfSimulatorProps) {
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null);
  const [customParameters, setCustomParameters] = useState<{ [key: string]: number }>({});
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<SimulationResult | null>(null);

  const runSimulation = async () => {
    if (!selectedScenario) return;

    setIsRunning(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate realistic simulation results
    const result: SimulationResult = generateSimulationResult(selectedScenario, customParameters);
    
    setLastResult(result);
    onSimulationRun(result);
    setIsRunning(false);
  };

  const generateSimulationResult = (scenario: SimulationScenario, params: { [key: string]: number }): SimulationResult => {
    const mergedParams = { ...scenario.parameters, ...params };
    
    // AI-like result generation based on scenario type
    const results: { [key: string]: SimulationResult } = {
      'climate-action': {
        scenario: scenario.title,
        outcomes: {
          positive: [
            'Global CO2 emissions reduced by 35%',
            'Green technology investment increases by $2T',
            'Air quality improves in major cities',
            'Renewable energy jobs created: 25M+'
          ],
          negative: [
            'Initial GDP reduction of 2.5% globally',
            'Energy costs increase by 15-20%',
            'Some industries face significant restructuring',
            'Developing nations need financial support'
          ],
          neutral: [
            'Transition period of 5-7 years expected',
            'Consumer behavior adapts gradually',
            'Technology innovation accelerates'
          ]
        },
        probability: 75,
        timeframe: '10-15 years',
        globalImpact: 8.5
      },
      'peace-treaty': {
        scenario: scenario.title,
        outcomes: {
          positive: [
            'Military spending redirected to development',
            'Refugee crisis resolved for 6M+ people',
            'Regional economic recovery begins',
            'Global food security improves'
          ],
          negative: [
            'Reconstruction costs exceed $500B',
            'Political tensions remain in some areas',
            'War crimes tribunals create ongoing disputes'
          ],
          neutral: [
            'International monitoring required',
            'Gradual normalization of relations',
            'Energy markets stabilize'
          ]
        },
        probability: 65,
        timeframe: '2-5 years',
        globalImpact: 7.2
      },
      'economic-cooperation': {
        scenario: scenario.title,
        outcomes: {
          positive: [
            'Global GDP increases by $8T over 5 years',
            'Trade barriers reduced by 40%',
            'Technology transfer accelerates',
            'Emerging markets benefit significantly'
          ],
          negative: [
            'Some domestic industries face competition',
            'Regulatory harmonization challenges',
            'Potential for trade disputes'
          ],
          neutral: [
            'Gradual implementation over 3 years',
            'Mixed short-term effects',
            'Long-term benefits more pronounced'
          ]
        },
        probability: 70,
        timeframe: '3-8 years',
        globalImpact: 6.8
      }
    };

    const defaultResult = {
      scenario: scenario.title,
      outcomes: {
        positive: ['Positive outcomes likely', 'Innovation accelerated'],
        negative: ['Some challenges expected', 'Adaptation period required'],
        neutral: ['Mixed results anticipated']
      },
      probability: 60,
      timeframe: '5-10 years',
      globalImpact: 5.0
    };

    return results[scenario.id] || defaultResult;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'conflict': return 'border-red-500/50 bg-red-500/10';
      case 'environment': return 'border-green-500/50 bg-green-500/10';
      case 'economy': return 'border-purple-500/50 bg-purple-500/10';
      case 'policy': return 'border-blue-500/50 bg-blue-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          What-If Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scenario Selection */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Choose Scenario:</h4>
          <div className="grid grid-cols-1 gap-2">
            {predefinedScenarios.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedScenario?.id === scenario.id 
                    ? getCategoryColor(scenario.category) + ' border-opacity-100' 
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{scenario.icon}</span>
                  <div className="flex-1">
                    <h5 className="font-medium text-white text-sm">{scenario.title}</h5>
                    <p className="text-xs text-gray-400 mt-1">{scenario.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-slate-700 rounded text-xs text-gray-300 capitalize">
                      {scenario.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parameter Adjustment */}
        {selectedScenario && (
          <div className="space-y-3 border-t border-slate-600 pt-4">
            <h4 className="text-sm font-medium text-gray-300">Adjust Parameters:</h4>
            {Object.entries(selectedScenario.parameters).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-white">{customParameters[key] ?? value}</span>
                </div>
                <input
                  type="range"
                  min={value * 0.5}
                  max={value * 1.5}
                  step={Math.abs(value) > 10 ? 1 : 0.1}
                  value={customParameters[key] ?? value}
                  onChange={(e) => setCustomParameters(prev => ({
                    ...prev,
                    [key]: parseFloat(e.target.value)
                  }))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        )}

        {/* Run Simulation */}
        <div className="flex gap-2">
          <Button
            onClick={runSimulation}
            disabled={!selectedScenario || isRunning}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {isRunning ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
          
          <Button
            onClick={() => {
              setSelectedScenario(null);
              setCustomParameters({});
              setLastResult(null);
            }}
            variant="outline"
            className="border-slate-600"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Results */}
        {lastResult && (
          <div className="space-y-3 border-t border-slate-600 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300">Simulation Results</h4>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Probability: {lastResult.probability || 0}%</span>
                <span>•</span>
                <span>{lastResult.timeframe || 'Unknown'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Positive Outcomes */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Positive Outcomes</span>
                </div>
                <ul className="space-y-1">
                  {lastResult.outcomes?.positive?.map((outcome, index) => (
                    <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      {outcome}
                    </li>
                  )) || []}
                </ul>
              </div>

              {/* Negative Outcomes */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">Challenges</span>
                </div>
                <ul className="space-y-1">
                  {lastResult.outcomes?.negative?.map((outcome, index) => (
                    <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      {outcome}
                    </li>
                  )) || []}
                </ul>
              </div>

              {/* Global Impact Score */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Global Impact Score</span>
                  <span className="text-lg font-bold text-white">{lastResult.globalImpact || 0}/10</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((lastResult.globalImpact || 0) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}