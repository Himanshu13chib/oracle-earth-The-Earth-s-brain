'use client';

import { useState, useEffect } from 'react';
import GlobeWrapper from '@/components/globe/GlobeWrapper';
import TimeMachine from '@/components/globe/TimeMachine';
import CrisisDashboard from '@/components/dashboard/CrisisDashboard';
import WhatIfSimulator from '@/components/simulator/WhatIfSimulator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Globe, AlertTriangle, Leaf, Clock, Radio, Brain } from 'lucide-react';

interface ConflictData {
  id: number;
  country1: string;
  country2: string;
  probability: number;
  factors: string;
  lastUpdated: string;
}

interface EnvironmentData {
  id: number;
  region: string;
  type: 'deforestation' | 'co2' | 'glacier' | 'temperature';
  value: number;
  unit: string;
  coordinates: string;
  timestamp: string;
}

export default function GlobePage() {
  const [conflicts, setConflicts] = useState<ConflictData[]>([]);
  const [environmentData, setEnvironmentData] = useState<EnvironmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(2024);
  const [activeTab, setActiveTab] = useState<'globe' | 'crisis' | 'simulator'>('globe');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [conflictsRes, environmentRes] = await Promise.all([
        fetch('/api/conflicts'),
        fetch('/api/environment')
      ]);

      if (!conflictsRes.ok || !environmentRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const conflictsData = await conflictsRes.json();
      const environmentDataRes = await environmentRes.json();

      setConflicts(conflictsData);
      setEnvironmentData(environmentDataRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = {
    totalConflicts: conflicts.length,
    highRiskConflicts: conflicts.filter(c => c.probability > 70).length,
    environmentalAlerts: environmentData.length,
    criticalRegions: environmentData.filter(e => 
      (e.type === 'deforestation' && e.value > 10) ||
      (e.type === 'co2' && e.value > 400) ||
      (e.type === 'temperature' && e.value > 1)
    ).length
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading global intelligence data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Data</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Global Intelligence Command Center</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Advanced 3D visualization with time travel, crisis monitoring, and scenario simulation.
        </p>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab('globe')}
            variant={activeTab === 'globe' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            3D Globe
          </Button>
          <Button
            onClick={() => setActiveTab('crisis')}
            variant={activeTab === 'crisis' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Radio className="h-4 w-4" />
            Crisis Dashboard
          </Button>
          <Button
            onClick={() => setActiveTab('simulator')}
            variant={activeTab === 'simulator' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            What-If Simulator
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conflicts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConflicts}</div>
              <p className="text-xs text-muted-foreground">Active monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.highRiskConflicts}</div>
              <p className="text-xs text-muted-foreground">70%+ probability</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Environmental Alerts</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.environmentalAlerts}</div>
              <p className="text-xs text-muted-foreground">Active monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Regions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.criticalRegions}</div>
              <p className="text-xs text-muted-foreground">Immediate attention</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Left Sidebar - Controls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Time Machine */}
          <TimeMachine 
            currentYear={currentYear}
            onTimeChange={setCurrentYear}
          />
          
          {/* Crisis Dashboard (when active) */}
          {activeTab === 'crisis' && (
            <CrisisDashboard 
              onEventSelect={(event) => {
                console.log('Crisis event selected:', event);
                // You can add logic to focus globe on event location
              }}
            />
          )}

          {/* What-If Simulator (when active) */}
          {activeTab === 'simulator' && (
            <WhatIfSimulator 
              onSimulationRun={(result) => {
                console.log('Simulation result:', result);
                // You can add logic to visualize results on globe
              }}
            />
          )}
        </div>

        {/* Main Display Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {activeTab === 'globe' && <><Globe className="h-5 w-5" /> Interactive Global Intelligence Map</>}
                    {activeTab === 'crisis' && <><Radio className="h-5 w-5" /> Real-Time Crisis Monitoring</>}
                    {activeTab === 'simulator' && <><Brain className="h-5 w-5" /> Scenario Simulation Results</>}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === 'globe' && `Viewing year ${currentYear} - Time travel through global events`}
                    {activeTab === 'crisis' && 'Live monitoring of global crisis events and threats'}
                    {activeTab === 'simulator' && 'AI-powered what-if analysis and predictions'}
                  </CardDescription>
                </div>
                <Button onClick={fetchData} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <GlobeWrapper conflicts={conflicts} environmentData={environmentData} />
                
                {/* Year Overlay */}
                {currentYear !== 2024 && (
                  <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-bold">{currentYear}</span>
                      {currentYear < 2024 && <span className="text-blue-400">Historical</span>}
                      {currentYear > 2024 && <span className="text-purple-400">Predicted</span>}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Navigation</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• <strong>Rotate:</strong> Click and drag to rotate the globe</li>
                <li>• <strong>Zoom:</strong> Scroll wheel to zoom in/out</li>
                <li>• <strong>Pan:</strong> Right-click and drag to pan</li>
                <li>• <strong>Reset:</strong> Double-click to reset view</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Markers</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• <strong>Red Diamonds:</strong> High-risk conflicts (70%+)</li>
                <li>• <strong>Yellow Diamonds:</strong> Medium-risk conflicts (40-70%)</li>
                <li>• <strong>Green Diamonds:</strong> Low-risk conflicts (&lt;40%)</li>
                <li>• <strong>Colored Shapes:</strong> Environmental monitoring points</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}