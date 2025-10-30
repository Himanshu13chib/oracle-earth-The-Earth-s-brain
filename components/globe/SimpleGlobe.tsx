'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, RefreshCw, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface SimpleGlobeProps {
  conflicts: ConflictData[];
  environmentData: EnvironmentData[];
}

// Country coordinates for markers
const countryCoordinates: { [key: string]: [number, number] } = {
  'Russia': [61.5240, 105.3188],
  'Ukraine': [48.3794, 31.1656],
  'China': [35.8617, 104.1954],
  'Taiwan': [23.6978, 120.9605],
  'India': [20.5937, 78.9629],
  'Pakistan': [30.3753, 69.3451],
  'Israel': [31.0461, 34.8516],
  'Palestine': [31.9522, 35.2332],
  'North Korea': [40.3399, 127.5101],
  'South Korea': [35.9078, 127.7669],
  'Afghanistan': [33.9391, 67.7100],
  'Syria': [34.8021, 38.9968],
  'Nigeria': [9.0820, 8.6753]
};

export default function SimpleGlobe({ conflicts, environmentData }: SimpleGlobeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg border border-slate-700">
        <div className="text-center">
          <div className="relative mb-6">
            <Globe className="h-16 w-16 text-blue-400 animate-spin mx-auto" />
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <p className="text-blue-400 text-lg font-semibold">Initializing Global Intelligence</p>
          <p className="text-gray-400 text-sm mt-2">Loading conflict and environmental data...</p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-slate-900 rounded-lg border border-slate-700">
        <div className="text-center p-8">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">3D Globe Unavailable</h3>
          <p className="text-gray-400 mb-4 max-w-md">
            The interactive 3D globe couldn't load. Showing data visualization instead.
          </p>
          <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try 3D Globe Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] bg-gradient-to-b from-slate-900 via-blue-900/20 to-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      {/* World Map Background */}
      <div className="absolute inset-0 opacity-30">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          {/* Simplified world map paths */}
          <path
            d="M200,200 Q300,150 400,200 T600,200 Q700,180 800,200 L800,300 Q700,320 600,300 T400,300 Q300,350 200,300 Z"
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="1"
          />
          <path
            d="M150,250 Q250,230 350,250 T550,250 Q650,270 750,250 L750,350 Q650,370 550,350 T350,350 Q250,380 150,350 Z"
            fill="rgba(34, 197, 94, 0.2)"
            stroke="rgba(34, 197, 94, 0.4)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Conflict Markers */}
      <div className="absolute inset-0">
        {conflicts.map((conflict, index) => {
          const country1Coords = countryCoordinates[conflict.country1];
          const country2Coords = countryCoordinates[conflict.country2];
          
          if (!country1Coords && !country2Coords) return null;
          
          const coords = country1Coords || country2Coords;
          const x = ((coords[1] + 180) / 360) * 100;
          const y = ((90 - coords[0]) / 180) * 100;
          
          const getRiskColor = (probability: number) => {
            if (probability >= 70) return 'bg-red-500 border-red-400';
            if (probability >= 40) return 'bg-yellow-500 border-yellow-400';
            return 'bg-green-500 border-green-400';
          };

          return (
            <div
              key={conflict.id}
              className={`absolute w-4 h-4 rounded-full border-2 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 animate-pulse ${getRiskColor(conflict.probability)}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setSelectedMarker(conflict)}
              title={`${conflict.country1} vs ${conflict.country2}: ${conflict.probability}% risk`}
            >
              <div className={`absolute inset-0 rounded-full ${getRiskColor(conflict.probability).replace('bg-', 'bg-').replace('border-', '')} opacity-50 animate-ping`}></div>
            </div>
          );
        })}
      </div>

      {/* Environment Markers */}
      <div className="absolute inset-0">
        {environmentData.map((env, index) => {
          const [lat, lng] = env.coordinates.split(',').map(Number);
          if (isNaN(lat) || isNaN(lng)) return null;
          
          const x = ((lng + 180) / 360) * 100;
          const y = ((90 - lat) / 180) * 100;
          
          const getEnvColor = (type: string) => {
            switch (type) {
              case 'deforestation': return 'bg-orange-500 border-orange-400';
              case 'co2': return 'bg-purple-500 border-purple-400';
              case 'glacier': return 'bg-cyan-500 border-cyan-400';
              case 'temperature': return 'bg-red-400 border-red-300';
              default: return 'bg-gray-500 border-gray-400';
            }
          };

          return (
            <div
              key={`env-${env.id}`}
              className={`absolute w-3 h-3 rounded-sm border cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${getEnvColor(env.type)}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setSelectedMarker(env)}
              title={`${env.region}: ${env.type} ${env.value}${env.unit}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg text-sm">
        <h4 className="font-semibold mb-2">Global Intelligence Map</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Risk Conflicts (70%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium Risk (40-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low Risk (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
            <span>Environmental Alerts</span>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {selectedMarker && (
        <div className="absolute top-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-sm">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold">
              {selectedMarker.country1 ? 
                `${selectedMarker.country1} vs ${selectedMarker.country2}` : 
                selectedMarker.region
              }
            </h4>
            <button 
              onClick={() => setSelectedMarker(null)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          {selectedMarker.probability ? (
            <div>
              <p className="text-sm text-gray-300 mb-1">
                Conflict Probability: <span className="text-red-400 font-semibold">{selectedMarker.probability}%</span>
              </p>
              <p className="text-xs text-gray-400">{selectedMarker.factors}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-300 mb-1">
                {selectedMarker.type}: <span className="text-blue-400 font-semibold">{selectedMarker.value}{selectedMarker.unit}</span>
              </p>
              <p className="text-xs text-gray-400">Environmental monitoring point</p>
            </div>
          )}
        </div>
      )}

      {/* Try 3D Button */}
      <div className="absolute bottom-4 right-4">
        <Button 
          onClick={() => setHasError(true)}
          variant="outline"
          size="sm"
          className="bg-black/50 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
        >
          <Globe className="h-4 w-4 mr-2" />
          Try 3D Globe
        </Button>
      </div>
    </div>
  );
}