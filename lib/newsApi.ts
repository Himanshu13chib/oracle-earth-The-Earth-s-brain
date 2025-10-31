// Real-time news integration for Oracle Earth
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: 'conflict' | 'environment' | 'terrorism' | 'economy' | 'general';
  country?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sentiment: 'positive' | 'neutral' | 'negative';
}

// Mock news data that looks like real-time feeds
const generateMockNews = (): NewsArticle[] => {
  const baseNews = [
    {
      title: "Diplomatic Tensions Rise Between Major Powers",
      description: "Recent diplomatic exchanges suggest increasing tensions over territorial disputes in the South China Sea.",
      source: "Global Intelligence Wire",
      category: 'conflict' as const,
      country: "China",
      severity: 'high' as const,
      sentiment: 'negative' as const
    },
    {
      title: "Climate Summit Reaches Breakthrough Agreement",
      description: "World leaders announce new commitments to reduce carbon emissions by 50% over the next decade.",
      source: "Environmental News Network",
      category: 'environment' as const,
      severity: 'medium' as const,
      sentiment: 'positive' as const
    },
    {
      title: "Economic Markets Show Signs of Recovery",
      description: "Global markets surge as inflation rates begin to stabilize across major economies.",
      source: "Economic Intelligence Daily",
      category: 'economy' as const,
      severity: 'low' as const,
      sentiment: 'positive' as const
    },
    {
      title: "Counter-Terrorism Operation Disrupts Major Network",
      description: "International cooperation leads to successful operation against terrorist financing networks.",
      source: "Security Intelligence Report",
      category: 'terrorism' as const,
      severity: 'high' as const,
      sentiment: 'positive' as const
    },
    {
      title: "Humanitarian Crisis Escalates in Conflict Zone",
      description: "UN reports increasing civilian casualties as regional conflict intensifies.",
      source: "Humanitarian Intelligence",
      category: 'conflict' as const,
      severity: 'critical' as const,
      sentiment: 'negative' as const
    },
    {
      title: "Breakthrough in Renewable Energy Technology",
      description: "New solar panel technology promises 40% increase in efficiency at lower costs.",
      source: "Tech & Environment Today",
      category: 'environment' as const,
      severity: 'low' as const,
      sentiment: 'positive' as const
    },
    {
      title: "Trade Agreement Reduces Regional Tensions",
      description: "Historic trade deal between neighboring countries expected to improve diplomatic relations.",
      source: "Economic Diplomacy Wire",
      category: 'economy' as const,
      severity: 'medium' as const,
      sentiment: 'positive' as const
    },
    {
      title: "Cyber Security Threat Level Elevated",
      description: "Intelligence agencies report increased cyber attack attempts on critical infrastructure.",
      source: "Cyber Intelligence Alert",
      category: 'terrorism' as const,
      severity: 'high' as const,
      sentiment: 'negative' as const
    }
  ];

  return baseNews.map((news, index) => ({
    id: `news-${Date.now()}-${index}`,
    ...news,
    url: `https://oracle-earth-intelligence.com/news/${news.title.toLowerCase().replace(/\s+/g, '-')}`,
    publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() // Random time in last 24h
  }));
};

// Simulate real-time news updates
let newsCache: NewsArticle[] = [];
let lastUpdate = 0;

export const getLatestNews = async (category?: string, limit: number = 10): Promise<NewsArticle[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Refresh news every 5 minutes
  const now = Date.now();
  if (now - lastUpdate > 5 * 60 * 1000 || newsCache.length === 0) {
    newsCache = generateMockNews();
    lastUpdate = now;
  }
  
  let filteredNews = newsCache;
  
  if (category && category !== 'all') {
    filteredNews = newsCache.filter(news => news.category === category);
  }
  
  return filteredNews
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

export const getBreakingNews = async (): Promise<NewsArticle[]> => {
  const news = await getLatestNews();
  return news.filter(article => 
    article.severity === 'critical' || 
    (article.severity === 'high' && new Date(article.publishedAt).getTime() > Date.now() - 2 * 60 * 60 * 1000)
  );
};

export const getNewsByCountry = async (country: string): Promise<NewsArticle[]> => {
  const news = await getLatestNews();
  return news.filter(article => 
    article.country?.toLowerCase().includes(country.toLowerCase()) ||
    article.title.toLowerCase().includes(country.toLowerCase()) ||
    article.description.toLowerCase().includes(country.toLowerCase())
  );
};

export const getNewsSentiment = (articles: NewsArticle[]): { positive: number; neutral: number; negative: number } => {
  const total = articles.length;
  if (total === 0) return { positive: 0, neutral: 0, negative: 0 };
  
  const counts = articles.reduce((acc, article) => {
    acc[article.sentiment]++;
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });
  
  return {
    positive: Math.round((counts.positive / total) * 100),
    neutral: Math.round((counts.neutral / total) * 100),
    negative: Math.round((counts.negative / total) * 100)
  };
};