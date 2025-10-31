'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Radio, 
  RefreshCw, 
  ExternalLink, 
  AlertTriangle, 
  TrendingUp, 
  Globe,
  Shield,
  Leaf,
  DollarSign,
  Clock
} from 'lucide-react';
import { NewsArticle } from '@/lib/newsApi';

interface NewsWidgetProps {
  category?: string;
  limit?: number;
  showBreaking?: boolean;
  compact?: boolean;
}

export default function NewsWidget({ 
  category = 'all', 
  limit = 5, 
  showBreaking = false,
  compact = false 
}: NewsWidgetProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category,
        limit: limit.toString(),
        breaking: showBreaking.toString()
      });
      
      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [category, limit, showBreaking]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'conflict': return <Shield className="h-4 w-4" />;
      case 'environment': return <Leaf className="h-4 w-4" />;
      case 'terrorism': return <AlertTriangle className="h-4 w-4" />;
      case 'economy': return <DollarSign className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (compact) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center text-sm">
              <Radio className="mr-2 h-4 w-4 text-red-500 animate-pulse" />
              {showBreaking ? 'Breaking News' : 'Latest Intelligence'}
            </CardTitle>
            <Button
              onClick={fetchNews}
              variant="ghost"
              size="sm"
              disabled={loading}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-3 bg-slate-700 rounded w-full mb-1"></div>
                  <div className="h-2 bg-slate-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            news.slice(0, 3).map((article) => (
              <div key={article.id} className="border-l-2 border-blue-500 pl-3 py-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-medium truncate">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {getCategoryIcon(article.category)}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(article.publishedAt)}
                      </span>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getSeverityColor(article.severity)}`}>
                    {article.severity}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center">
              <Radio className="mr-2 h-5 w-5 text-red-500 animate-pulse" />
              {showBreaking ? 'Breaking News' : 'Global Intelligence Feed'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {showBreaking ? 'Critical updates' : 'Real-time global intelligence'} • 
              {lastUpdate && (
                <span className="ml-1">
                  Updated {formatTimeAgo(lastUpdate.toISOString())}
                </span>
              )}
            </CardDescription>
          </div>
          <Button
            onClick={fetchNews}
            variant="outline"
            size="sm"
            disabled={loading}
            className="border-slate-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
                <div className="flex gap-2">
                  <div className="h-5 bg-slate-700 rounded w-16"></div>
                  <div className="h-5 bg-slate-700 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Radio className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No news available at the moment</p>
            <Button onClick={fetchNews} variant="outline" size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((article) => (
              <div key={article.id} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1 leading-tight">
                      {article.title}
                    </h4>
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(article.category)}
                        <span className="text-gray-400 capitalize">{article.category}</span>
                      </div>
                      <Badge className={getSeverityColor(article.severity)}>
                        {article.severity}
                      </Badge>
                      <span className={`flex items-center gap-1 ${getSentimentColor(article.sentiment)}`}>
                        <TrendingUp className="h-3 w-3" />
                        {article.sentiment}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(article.publishedAt)}
                      </div>
                      <span className="text-gray-500">• {article.source}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}