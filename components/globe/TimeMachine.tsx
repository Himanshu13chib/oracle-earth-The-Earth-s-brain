'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, FastForward, Calendar, Clock } from 'lucide-react';

interface TimeMachineProps {
  onTimeChange: (year: number) => void;
  currentYear: number;
}

const historicalEvents = [
  { year: 1990, event: "End of Cold War", type: "conflict" },
  { year: 1995, event: "Kyoto Protocol discussions begin", type: "environment" },
  { year: 2001, event: "9/11 Attacks", type: "terrorism" },
  { year: 2008, event: "Global Financial Crisis", type: "economy" },
  { year: 2011, event: "Arab Spring", type: "conflict" },
  { year: 2015, event: "Paris Climate Agreement", type: "environment" },
  { year: 2020, event: "COVID-19 Pandemic", type: "global" },
  { year: 2022, event: "Russia-Ukraine War", type: "conflict" },
  { year: 2024, event: "Present Day", type: "current" },
  { year: 2030, event: "Climate Targets Deadline", type: "future" },
  { year: 2050, event: "Net Zero Goals", type: "future" },
];

export default function TimeMachine({ onTimeChange, currentYear }: TimeMachineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const minYear = 1990;
  const maxYear = 2050;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedYear(prev => {
          const nextYear = prev + speed;
          if (nextYear > maxYear) {
            setIsPlaying(false);
            return maxYear;
          }
          onTimeChange(nextYear);
          return nextYear;
        });
      }, 200);
    }

    return () => clearInterval(interval);
  }, [isPlaying, speed, onTimeChange, maxYear]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    onTimeChange(year);
  };

  const getCurrentEvent = () => {
    return historicalEvents.find(event => event.year === selectedYear) || 
           historicalEvents.reduce((prev, curr) => 
             Math.abs(curr.year - selectedYear) < Math.abs(prev.year - selectedYear) ? curr : prev
           );
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'conflict': return 'text-red-400';
      case 'environment': return 'text-green-400';
      case 'terrorism': return 'text-orange-400';
      case 'economy': return 'text-purple-400';
      case 'future': return 'text-blue-400';
      case 'current': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const currentEvent = getCurrentEvent();

  return (
    <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          Time Machine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Year Display */}
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">{selectedYear}</div>
          {currentEvent && (
            <div className={`text-sm ${getEventColor(currentEvent.type)}`}>
              {currentEvent.event}
            </div>
          )}
        </div>

        {/* Timeline Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={selectedYear}
            onChange={(e) => handleYearChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((selectedYear - minYear) / (maxYear - minYear)) * 100}%, #475569 ${((selectedYear - minYear) / (maxYear - minYear)) * 100}%, #475569 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{minYear}</span>
            <span className="text-yellow-400">Now: 2024</span>
            <span>{maxYear}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => handleYearChange(minYear)}
            variant="outline"
            size="sm"
            className="border-slate-600"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant="outline"
            size="sm"
            className="border-slate-600"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button
            onClick={() => setSpeed(speed === 1 ? 2 : speed === 2 ? 5 : 1)}
            variant="outline"
            size="sm"
            className="border-slate-600"
          >
            <FastForward className="h-4 w-4" />
            <span className="ml-1 text-xs">{speed}x</span>
          </Button>
        </div>

        {/* Quick Jump Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleYearChange(2001)}
            variant="ghost"
            size="sm"
            className="text-xs text-orange-400 hover:bg-orange-400/20"
          >
            9/11 (2001)
          </Button>
          <Button
            onClick={() => handleYearChange(2008)}
            variant="ghost"
            size="sm"
            className="text-xs text-purple-400 hover:bg-purple-400/20"
          >
            Crisis (2008)
          </Button>
          <Button
            onClick={() => handleYearChange(2022)}
            variant="ghost"
            size="sm"
            className="text-xs text-red-400 hover:bg-red-400/20"
          >
            Ukraine (2022)
          </Button>
          <Button
            onClick={() => handleYearChange(2030)}
            variant="ghost"
            size="sm"
            className="text-xs text-blue-400 hover:bg-blue-400/20"
          >
            Future (2030)
          </Button>
        </div>

        {/* Era Indicator */}
        <div className="text-center text-xs text-gray-400">
          {selectedYear < 2024 ? '📜 Historical Data' : 
           selectedYear === 2024 ? '🔴 Live Data' : 
           '🔮 AI Predictions'}
        </div>
      </CardContent>
    </Card>
  );
}