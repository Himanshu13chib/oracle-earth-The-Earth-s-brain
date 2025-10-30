'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertCircle, FileText, TrendingUp, Globe, Users } from 'lucide-react';
import { cn, countries, getProbabilityColor } from '@/lib/utils';

interface ConflictData {
  id: number;
  country1: string;
  country2: string;
  probability: number;
  factors: string;
  lastUpdated: string;
}

export default function PeaceConflictPage() {
  const [conflicts, setConflicts] = useState<ConflictData[]>([]);
  const [selectedCountry1, setSelectedCountry1] = useState('');
  const [selectedCountry2, setSelectedCountry2] = useState('');
  const [loading, setLoading] = useState(false);
  const [peaceTreaty, setPeaceTreaty] = useState('');
  const [showTreaty, setShowTreaty] = useState(false);

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    try {
      const response = await fetch('/api/conflicts');
      const data = await response.json();
      setConflicts(data);
    } catch (error) {
      console.error('Error fetching conflicts:', error);
      // Mock data for demo
      setConflicts([
        {
          id: 1,
          country1: 'Russia',
          country2: 'Ukraine',
          probability: 85,
          factors: 'Territorial disputes, Military buildup, Historical tensions',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 2,
          country1: 'China',
          country2: 'Taiwan',
          probability: 65,
          factors: 'Sovereignty claims, Military exercises, Economic pressure',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 3,
          country1: 'India',
          country2: 'Pakistan',
          probability: 45,
          factors: 'Kashmir dispute, Border tensions, Nuclear capabilities',
          lastUpdated: new Date().toISOString()
        }
      ]);
    }
  };

  const analyzeConflict = async () => {
    if (!selectedCountry1 || !selectedCountry2) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-conflict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country1: selectedCountry1, country2: selectedCountry2 })
      });
      
      const data = await response.json();
      
      // Add to conflicts list
      const newConflict = {
        id: Date.now(),
        country1: selectedCountry1,
        country2: selectedCountry2,
        probability: data.probability,
        factors: data.factors.join(', '),
        lastUpdated: new Date().toISOString()
      };
      
      setConflicts(prev => [newConflict, ...prev]);
    } catch (error) {
      console.error('Error analyzing conflict:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePeaceTreaty = async (conflict: ConflictData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-treaty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country1: conflict.country1,
          country2: conflict.country2,
          factors: conflict.factors.split(', ')
        })
      });
      
      const data = await response.json();
      setPeaceTreaty(data.treaty);
      setShowTreaty(true);
    } catch (error) {
      console.error('Error generating treaty:', error);
      setPeaceTreaty('Peace treaty generation temporarily unavailable. Please try again later.');
      setShowTreaty(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Peace & Conflict Intelligence</h1>
          </div>
          <p className="text-xl text-gray-300">
            AI-powered conflict probability analysis and peace treaty generation
          </p>
        </div>

        {/* Analysis Tool */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Conflict Probability Analyzer
            </CardTitle>
            <CardDescription className="text-gray-400">
              Select two countries to analyze potential conflict probability using AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                value={selectedCountry1}
                onChange={(e) => setSelectedCountry1(e.target.value)}
                className="bg-slate-700 text-white border border-slate-600 rounded-md px-3 py-2"
              >
                <option value="">Select Country 1</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              
              <select
                value={selectedCountry2}
                onChange={(e) => setSelectedCountry2(e.target.value)}
                className="bg-slate-700 text-white border border-slate-600 rounded-md px-3 py-2"
              >
                <option value="">Select Country 2</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              
              <Button
                onClick={analyzeConflict}
                disabled={!selectedCountry1 || !selectedCountry2 || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Analyzing...' : 'Analyze Conflict'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conflicts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {conflicts.map((conflict) => (
            <Card key={conflict.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    {conflict.country1} vs {conflict.country2}
                  </CardTitle>
                  <div className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getProbabilityColor(conflict.probability)
                  )}>
                    {conflict.probability}% Risk
                  </div>
                </div>
                <CardDescription className="text-gray-400">
                  Last updated: {new Date(conflict.lastUpdated).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2 flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Key Factors
                  </h4>
                  <p className="text-gray-300 text-sm">{conflict.factors}</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => generatePeaceTreaty(conflict)}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Peace Treaty
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Peace Treaty Modal */}
        {showTreaty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  AI-Generated Peace Treaty
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Comprehensive peace proposal addressing root causes of conflict
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 p-4 rounded-lg mb-4">
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                    {peaceTreaty}
                  </pre>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setShowTreaty(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => navigator.clipboard.writeText(peaceTreaty)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Copy Treaty
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">{conflicts.length}</div>
                  <div className="text-gray-400">Active Conflicts Monitored</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">1,247</div>
                  <div className="text-gray-400">Peace Treaties Generated</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">87%</div>
                  <div className="text-gray-400">Prediction Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}