'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Globe, PieChart, Activity, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';

interface EconomicData {
  id: number;
  country: string;
  gdp: number;
  inflation: number;
  unemployment: number;
  tradeBalance: number;
  timestamp: string;
}

const mockEconomicData: EconomicData[] = [
  {
    id: 1,
    country: 'United States',
    gdp: 26.9,
    inflation: 3.2,
    unemployment: 3.7,
    tradeBalance: -948.1,
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    country: 'China',
    gdp: 17.7,
    inflation: 0.2,
    unemployment: 5.2,
    tradeBalance: 676.4,
    timestamp: new Date().toISOString()
  },
  {
    id: 3,
    country: 'Japan',
    gdp: 4.9,
    inflation: 3.3,
    unemployment: 2.6,
    tradeBalance: -29.8,
    timestamp: new Date().toISOString()
  },
  {
    id: 4,
    country: 'Germany',
    gdp: 4.3,
    inflation: 5.9,
    unemployment: 3.0,
    tradeBalance: 298.5,
    timestamp: new Date().toISOString()
  }
];

const globalTrends = [
  { month: 'Jan', gdpGrowth: 2.1, inflation: 3.2, unemployment: 3.8 },
  { month: 'Feb', gdpGrowth: 2.3, inflation: 3.1, unemployment: 3.7 },
  { month: 'Mar', gdpGrowth: 2.2, inflation: 3.4, unemployment: 3.6 },
  { month: 'Apr', gdpGrowth: 2.4, inflation: 3.3, unemployment: 3.5 },
  { month: 'May', gdpGrowth: 2.6, inflation: 3.2, unemployment: 3.4 },
  { month: 'Jun', gdpGrowth: 2.5, inflation: 3.0, unemployment: 3.3 },
];

const marketIndices = [
  { name: 'S&P 500', value: 4756.50, change: 1.2, changePercent: 0.025 },
  { name: 'NASDAQ', value: 14845.73, change: -23.42, changePercent: -0.16 },
  { name: 'Dow Jones', value: 37863.80, change: 45.86, changePercent: 0.12 },
  { name: 'FTSE 100', value: 7630.05, change: 12.34, changePercent: 0.16 },
  { name: 'Nikkei 225', value: 33486.89, change: -156.78, changePercent: -0.47 },
  { name: 'DAX', value: 16751.64, change: 89.23, changePercent: 0.53 }
];

export default function EconomyPage() {
  const [economicData, setEconomicData] = useState<EconomicData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState('');
  const [showForecast, setShowForecast] = useState(false);

  useEffect(() => {
    fetchEconomicData();
  }, []);

  const fetchEconomicData = async () => {
    try {
      const response = await fetch('/api/economy');
      const data = await response.json();
      setEconomicData(data);
    } catch (error) {
      console.error('Error fetching economic data:', error);
      setEconomicData(mockEconomicData);
    }
  };

  const generateForecast = async () => {
    if (!selectedCountry) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/economic-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: selectedCountry })
      });
      
      const data = await response.json();
      setForecast(data.forecast);
      setShowForecast(true);
    } catch (error) {
      console.error('Error generating forecast:', error);
      setForecast('Economic forecast temporarily unavailable. Please try again later.');
      setShowForecast(true);
    } finally {
      setLoading(false);
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Global Economy</h1>
          </div>
          <p className="text-xl text-gray-300">
            Economic indicators, trends, and AI-powered market analysis
          </p>
        </div>

        {/* Market Indices */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {marketIndices.map((index, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-400 mb-1">{index.name}</div>
                <div className="text-lg font-bold text-white mb-1">
                  {index.value.toLocaleString()}
                </div>
                <div className={cn('flex items-center text-sm', getChangeColor(index.change))}>
                  {getChangeIcon(index.change)}
                  <span className="ml-1">
                    {index.change > 0 ? '+' : ''}{index.change.toFixed(2)} 
                    ({index.changePercent > 0 ? '+' : ''}{(index.changePercent * 100).toFixed(2)}%)
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Economic Forecast Tool */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="mr-2 h-5 w-5" />
              AI Economic Forecast
            </CardTitle>
            <CardDescription className="text-gray-400">
              Generate AI-powered economic forecasts for specific countries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-slate-700 text-white border border-slate-600 rounded-md px-3 py-2"
              >
                <option value="">Select Country</option>
                {economicData.map(data => (
                  <option key={data.country} value={data.country}>{data.country}</option>
                ))}
              </select>
              
              <Button
                onClick={generateForecast}
                disabled={!selectedCountry || loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Generating...' : 'Generate Forecast'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Global Economic Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={globalTrends}>
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
                  <Line type="monotone" dataKey="gdpGrowth" stroke="#8B5CF6" strokeWidth={2} name="GDP Growth %" />
                  <Line type="monotone" dataKey="inflation" stroke="#F59E0B" strokeWidth={2} name="Inflation %" />
                  <Line type="monotone" dataKey="unemployment" stroke="#EF4444" strokeWidth={2} name="Unemployment %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">GDP Growth Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={globalTrends}>
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
                  <Area type="monotone" dataKey="gdpGrowth" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Economic Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {economicData.map((data) => (
            <Card key={data.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  {data.country}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Economic Indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">GDP (Trillion $)</span>
                    <span className="text-white font-medium">{data.gdp}T</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Inflation</span>
                    <span className={cn('font-medium', data.inflation > 3 ? 'text-red-400' : 'text-green-400')}>
                      {data.inflation}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Unemployment</span>
                    <span className={cn('font-medium', data.unemployment > 5 ? 'text-red-400' : 'text-green-400')}>
                      {data.unemployment}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Trade Balance</span>
                    <span className={cn('font-medium', getChangeColor(data.tradeBalance))}>
                      {data.tradeBalance > 0 ? '+' : ''}{data.tradeBalance}B
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Forecast Modal */}
        {showForecast && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Economic Forecast - {selectedCountry}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI-generated economic analysis and predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 p-4 rounded-lg mb-4">
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                    {forecast}
                  </pre>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setShowForecast(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => navigator.clipboard.writeText(forecast)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Copy Forecast
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">$104.6T</div>
                  <div className="text-gray-400">Global GDP</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">3.1%</div>
                  <div className="text-gray-400">Global Growth Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <PieChart className="h-8 w-8 text-yellow-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">5.2%</div>
                  <div className="text-gray-400">Global Inflation</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-purple-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">195</div>
                  <div className="text-gray-400">Countries Tracked</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}