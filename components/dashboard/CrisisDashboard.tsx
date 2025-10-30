'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Radio, Globe, TrendingUp, Clock, Bell } from 'lucide-react';

interface CrisisEvent {
  id: string;
  title: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'conflict' | 'environment' | 'terrorism' | 'economy' | 'natural';
  timestamp: Date;
  description: string;
  coordinates?: [number, number];
}

interface CrisisDashboardProps {
  onEventSelect: (event: CrisisEvent) => void;
}

export default function CrisisDashboard({ onEventSelect }: CrisisDashboardProps) {
  const [events, setEvents] = useState<CrisisEvent[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  // Simulate real-time crisis events
  useEffect(() => {
    const generateMockEvent = (): CrisisEvent => {
      const types = ['conflict', 'environment', 'terrorism', 'economy', 'natural'] as const;
      const severities = ['low', 'medium', 'high', 'critical'] as const;
      
      const mockEvents = [
        {
          title: "Cyber Attack on Infrastructure",
          location: "Eastern Europe",
          type: "terrorism" as const,
          description: "Major cyber attack targeting power grid systems"
        },
        {
          title: "Wildfire Spreading Rapidly",
          location: "California, USA",
          type: "environment" as const,
          description: "Forest fires threatening residential areas"
        },
        {
          title: "Border Tensions Escalating",
          location: "South China Sea",
          type: "conflict" as const,
          description: "Naval vessels from multiple nations in standoff"
        },
        {
          title: "Market Volatility Spike",
          location: "Global Markets",
          type: "economy" as const,
          description: "Sudden drop in major stock indices worldwide"
        },
        {
          title: "Earthquake Magnitude 6.2",
          location: "Pacific Ring of Fire",
          type: "natural" as const,
          description: "Seismic activity detected, tsunami warning issued"
        }
      ];

      const event = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      
      return {
        id: Date.now().toString() + Math.random(),
        ...event,
        severity: severities[Math.floor(Math.random() * severities.length)],
        timestamp: new Date(),
        coordinates: [
          (Math.random() - 0.5) * 360,
          (Math.random() - 0.5) * 180
        ]
      };
    };

    // Add initial events
    const initialEvents = Array.from({ length: 5 }, generateMockEvent);
    setEvents(initialEvents);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isLive && Math.random() > 0.7) { // 30% chance every interval
        const newEvent = generateMockEvent();
        setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep only 10 most recent
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-500 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50';
      case 'low': return 'text-green-500 bg-green-500/20 border-green-500/50';
      default: return 'text-gray-500 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conflict': return '⚔️';
      case 'environment': return '🌍';
      case 'terrorism': return '⚠️';
      case 'economy': return '📈';
      case 'natural': return '🌪️';
      default: return '📡';
    }
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.type === filter);

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Radio className={`h-5 w-5 ${isLive ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
            Crisis Dashboard
          </CardTitle>
          <Button
            onClick={() => setIsLive(!isLive)}
            variant="outline"
            size="sm"
            className={`border-slate-600 ${isLive ? 'text-red-400' : 'text-gray-400'}`}
          >
            {isLive ? 'LIVE' : 'PAUSED'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['all', 'conflict', 'environment', 'terrorism', 'economy', 'natural'].map((type) => (
            <Button
              key={type}
              onClick={() => setFilter(type)}
              variant={filter === type ? 'default' : 'ghost'}
              size="sm"
              className="text-xs capitalize"
            >
              {type === 'all' ? '🌐 All' : `${getTypeIcon(type)} ${type}`}
            </Button>
          ))}
        </div>

        {/* Crisis Events List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No crisis events detected</p>
              <p className="text-xs">All systems monitoring...</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onEventSelect(event)}
                className={`p-3 rounded-lg border cursor-pointer hover:bg-slate-700/50 transition-colors ${getSeverityColor(event.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getTypeIcon(event.type)}</span>
                      <h4 className="font-semibold text-white text-sm">{event.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                        {event.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mb-1">{event.location}</p>
                    <p className="text-xs text-gray-400">{event.description}</p>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getTimeAgo(event.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Alert Settings */}
        <div className="border-t border-slate-600 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alert Threshold
            </span>
            <select className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs">
              <option value="all">All Events</option>
              <option value="medium">Medium+</option>
              <option value="high">High+</option>
              <option value="critical">Critical Only</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}