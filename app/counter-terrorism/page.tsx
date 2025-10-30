'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Eye, Target, MapPin, Users, DollarSign, Calendar } from 'lucide-react';
import { cn, countries, getRiskColor } from '@/lib/utils';

interface TerrorismData {
  id: number;
  country: string;
  organization: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  fundingSources: string;
  lastActivity: string;
}

const mockTerrorismData: TerrorismData[] = [
  {
    id: 1,
    country: 'Afghanistan',
    organization: 'Taliban',
    riskLevel: 'high',
    fundingSources: 'Drug trafficking, Illegal mining',
    lastActivity: '2024-01-15'
  },
  {
    id: 2,
    country: 'Syria',
    organization: 'ISIS Remnants',
    riskLevel: 'medium',
    fundingSources: 'Oil smuggling, Extortion',
    lastActivity: '2024-01-10'
  },
  {
    id: 3,
    country: 'Nigeria',
    organization: 'Boko Haram',
    riskLevel: 'high',
    fundingSources: 'Kidnapping, Cattle rustling',
    lastActivity: '2024-01-20'
  },
  {
    id: 4,
    country: 'Somalia',
    organization: 'Al-Shabaab',
    riskLevel: 'critical',
    fundingSources: 'Piracy, Charcoal trade',
    lastActivity: '2024-01-25'
  }
];

const threatLevels = [
  { level: 'Critical', count: 12, color: 'text-red-400', bgColor: 'bg-red-900/20' },
  { level: 'High', count: 28, color: 'text-orange-400', bgColor: 'bg-orange-900/20' },
  { level: 'Medium', count: 45, color: 'text-yellow-400', bgColor: 'bg-yellow-900/20' },
  { level: 'Low', count: 67, color: 'text-green-400', bgColor: 'bg-green-900/20' }
];

export default function CounterTerrorismPage() {
  const [terrorismData, setTerrorismData] = useState<TerrorismData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    fetchTerrorismData();
  }, []);

  const fetchTerrorismData = async () => {
    try {
      const response = await fetch('/api/terrorism');
      const data = await response.json();
      setTerrorismData(data);
    } catch (error) {
      console.error('Error fetching terrorism data:', error);
      setTerrorismData(mockTerrorismData);
    }
  };

  const analyzeThreat = async () => {
    if (!selectedCountry || !selectedOrganization) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-terrorism', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: selectedCountry, organization: selectedOrganization })
      });
      
      const data = await response.json();
      setAnalysis(data.analysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Error analyzing threat:', error);
      setAnalysis('Threat analysis temporarily unavailable. Please try again later.');
      setShowAnalysis(true);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-400" />;
      case 'medium': return <Eye className="h-5 w-5 text-yellow-400" />;
      case 'low': return <Shield className="h-5 w-5 text-green-400" />;
      default: return <Eye className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <h1 className="text-4xl font-bold text-white">Counter-Terrorism Dashboard</h1>
          </div>
          <p className="text-xl text-gray-300">
            Advanced threat analysis and security intelligence visualization
          </p>
        </div>

        {/* Threat Level Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {threatLevels.map((threat, index) => (
            <Card key={index} className={cn('bg-slate-800/50 border-slate-700', threat.bgColor)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={cn('text-2xl font-bold', threat.color)}>{threat.count}</div>
                    <div className="text-gray-400">{threat.level} Threats</div>
                  </div>
                  <AlertTriangle className={cn('h-8 w-8', threat.color)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analysis Tool */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Threat Analysis Tool
            </CardTitle>
            <CardDescription className="text-gray-400">
              Analyze specific terrorist organizations and their threat levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-slate-700 text-white border border-slate-600 rounded-md px-3 py-2"
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="Organization Name"
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
                className="bg-slate-700 text-white border border-slate-600 rounded-md px-3 py-2"
              />
              
              <Button
                onClick={analyzeThreat}
                disabled={!selectedCountry || !selectedOrganization || loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Analyzing...' : 'Analyze Threat'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Terrorism Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {terrorismData.map((data) => (
            <Card key={data.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    {data.country}
                  </CardTitle>
                  <div className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1',
                    getRiskColor(data.riskLevel)
                  )}>
                    {getRiskLevelIcon(data.riskLevel)}
                    <span>{data.riskLevel.toUpperCase()}</span>
                  </div>
                </div>
                <CardDescription className="text-gray-400">
                  {data.organization}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <DollarSign className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-white">Funding Sources</div>
                      <div className="text-sm text-gray-300">{data.fundingSources}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-4 w-4 text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-white">Last Activity</div>
                      <div className="text-sm text-gray-300">
                        {new Date(data.lastActivity).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analysis Modal */}
        {showAnalysis && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Threat Analysis Report
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Security intelligence analysis for {selectedOrganization} in {selectedCountry}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 p-4 rounded-lg mb-4">
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                    {analysis}
                  </pre>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setShowAnalysis(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => navigator.clipboard.writeText(analysis)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Copy Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Global Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-red-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">152</div>
                  <div className="text-gray-400">Active Organizations</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-orange-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">67</div>
                  <div className="text-gray-400">Countries Monitored</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">89%</div>
                  <div className="text-gray-400">Threat Detection Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}