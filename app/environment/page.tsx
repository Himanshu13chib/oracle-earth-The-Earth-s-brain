'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Thermometer, Droplets, TreePine, Factory, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn, regions, getRiskColor } from '@/lib/utils';

interface EnvironmentData {
  id: number;
  region: string;
  type: 'deforestation' | 'co2' | 'glacier' | 'temperature';
  value: number;
  unit: string;
  coordinates: string;
  timestamp: string;
}

const mockData = [
  { region: 'Amazon Basin', type: 'deforestation', value: 15.2, unit: '% loss/year', coordinates: '-3.4653,-62.2159', timestamp: new Date().toISOString() },
  { region: 'Arctic', type: 'glacier', value: -8.5, unit: '% ice loss/year', coordinates: '71.0,-8.0', timestamp: new Date().toISOString() },
  { region: 'Global', type: 'co2', value: 421.3, unit: 'ppm', coordinates: '0,0', timestamp: new Date().toISOString() },
  { region: 'Global', type: 'temperature', value: 1.2, unit: '°C above baseline', coordinates: '0,0', timestamp: new Date().toISOString() },
];

const chartData = [
  { month: 'Jan', co2: 415, temp: 1.1, deforestation: 12 },
  { month: 'Feb', co2: 417, temp: 1.15, deforestation: 13 },
  { month: 'Mar', co2: 418, temp: 1.18, deforestation: 14 },
  { month: 'Apr', co2: 419, temp: 1.2, deforestation: 15 },
  { month: 'May', co2: 420, temp: 1.22, deforestation: 15.5 },
  { month: 'Jun', co2: 421, temp: 1.25, deforestation: 16 },
];

export default function EnvironmentPage() {
  const [environmentData, setEnvironmentData] = useState<EnvironmentData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    fetchEnvironmentData();
  }, []);

  const fetchEnvironmentData = async () => {
    try {
      const response = await fetch('/api/environment');
      const data = await response.json();
      setEnvironmentData(data);
    } catch (error) {
      console.error('Error fetching environment data:', error);
      setEnvironmentData(mockData as EnvironmentData[]);
    }
  };

  const analyzeEnvironment = async () => {
    if (!selectedRegion || !selectedType) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-environment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region: selectedRegion, type: selectedType })
      });
      
      const data = await response.json();
      setRecommendations(data.recommendations);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error analyzing environment:', error);
      setRecommendations('Environmental analysis temporarily unavailable. Please try again later.');
      setShowRecommendations(true);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deforestation': return TreePine;
      case 'co2': return Factory;
      case 'glacier': return Droplets;
      case 'temperature': return Thermometer;
      default: return Leaf;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deforestation': return 'text-red-400';
      case 'co2': return 'text-orange-400';
      case 'glacier': return 'text-blue-400';
      case 'temperature': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getUrgencyLevel = (type: string, value: number) => {
    switch (type) {
      case 'deforestation':
        if (value > 10) return 'critical';
        if (value > 5) return 'high';
        if (value > 2) return 'medium';
        return 'low';
      case 'co2':
        if (value > 420) return 'critical';
        if (value > 400) return 'high';
        if (value > 380) return 'medium';
        return 'low';
      case 'glacier':
        if (Math.abs(value) > 8) return 'critical';
        if (Math.abs(value) > 5) return 'high';
        if (Math.abs(value) > 2) return 'medium';
        return 'low';
      case 'temperature':
        if (value > 1.5) return 'critical';
        if (value > 1.0) return 'high';
        if (value > 0.5) return 'medium';
        return 'low';
      default:
        return 'medium';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Leaf className="h-8 w-8 text-green-400" />
            <h1 className="text-4xl font-bold text-white">Environment Monitor</h1>
          </div>
          <p className="text-xl text-gray-300">
            Real-time environmental tracking with AI-driven sustainability recommendations
          </p>
        </div>

        {/* Analysis Tool */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Environmental Impact Analyzer
            </CardTitle>
            <CardDescription className="text-gray-400">
              Select a region and environmental factor to get AI-powered recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-slate-700 text-white border border-slate-600 rounded-md px-3 py-2"
              >
                <option value="">Select Region</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-700 text-white border border-slate-600 rounded-md px-3 py-2"
              >
                <option value="">Select Type</option>
                <option value="deforestation">Deforestation</option>
                <option value="co2">CO₂ Levels</option>
                <option value="glacier">Glacier Melt</option>
                <option value="temperature">Temperature</option>
              </select>
              
              <Button
                onClick={analyzeEnvironment}
                disabled={!selectedRegion || !selectedType || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Analyzing...' : 'Get Recommendations'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Global Environmental Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="co2" stroke="#F59E0B" strokeWidth={2} name="CO₂ (ppm)" />
                  <Line type="monotone" dataKey="temp" stroke="#EF4444" strokeWidth={2} name="Temperature (°C)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Deforestation by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="deforestation" fill="#10B981" name="Forest Loss %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {environmentData.map((data, index) => {
            const Icon = getTypeIcon(data.type);
            const urgency = getUrgencyLevel(data.type, data.value);
            
            return (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className={cn('h-6 w-6', getTypeColor(data.type))} />
                    <div className={cn('px-2 py-1 rounded-full text-xs font-medium', getRiskColor(urgency))}>
                      {urgency.toUpperCase()}
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">{data.region}</CardTitle>
                  <CardDescription className="text-gray-400 capitalize">
                    {data.type.replace('_', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {data.value > 0 && data.type !== 'co2' && data.type !== 'temperature' ? '+' : ''}
                    {data.value}
                  </div>
                  <div className="text-sm text-gray-400">{data.unit}</div>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    {data.value > 0 && data.type === 'deforestation' ? (
                      <TrendingUp className="h-3 w-3 mr-1 text-red-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1 text-green-400" />
                    )}
                    Updated {new Date(data.timestamp).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recommendations Modal */}
        {showRecommendations && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Leaf className="mr-2 h-5 w-5" />
                  AI Environmental Recommendations
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Sustainability recommendations for {selectedRegion} - {selectedType}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 p-4 rounded-lg mb-4">
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                    {recommendations}
                  </pre>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setShowRecommendations(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => navigator.clipboard.writeText(recommendations)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Copy Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TreePine className="h-8 w-8 text-green-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">2.1M</div>
                  <div className="text-gray-400">Trees Monitored</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Factory className="h-8 w-8 text-orange-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">421.3</div>
                  <div className="text-gray-400">CO₂ PPM Current</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Droplets className="h-8 w-8 text-blue-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">-8.5%</div>
                  <div className="text-gray-400">Arctic Ice Loss/Year</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Thermometer className="h-8 w-8 text-red-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">+1.2°C</div>
                  <div className="text-gray-400">Above Baseline</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}