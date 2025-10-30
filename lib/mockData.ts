// Mock data for when database is not available
export const mockConflicts = [
  {
    id: 1,
    country1: "Russia",
    country2: "Ukraine", 
    probability: 85,
    factors: "Territorial disputes, military buildup, historical tensions",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    country1: "China",
    country2: "Taiwan",
    probability: 65,
    factors: "Political tensions, military exercises, sovereignty claims",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    country1: "India",
    country2: "Pakistan",
    probability: 45,
    factors: "Border disputes, Kashmir conflict, military presence",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 4,
    country1: "Israel",
    country2: "Palestine",
    probability: 70,
    factors: "Territorial disputes, settlement expansion, security concerns",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 5,
    country1: "North Korea",
    country2: "South Korea",
    probability: 35,
    factors: "Nuclear program, sanctions, historical tensions",
    lastUpdated: new Date().toISOString()
  }
];

export const mockEnvironmentData = [
  {
    id: 1,
    region: "Amazon Rainforest",
    type: "deforestation" as const,
    value: 15.2,
    unit: "% annual loss",
    coordinates: "-3.4653,-62.2159",
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    region: "Arctic Ice Cap",
    type: "glacier" as const,
    value: 8.7,
    unit: "% annual loss",
    coordinates: "71.0,-8.0",
    timestamp: new Date().toISOString()
  },
  {
    id: 3,
    region: "Global Average",
    type: "co2" as const,
    value: 421,
    unit: "ppm",
    coordinates: "0,0",
    timestamp: new Date().toISOString()
  },
  {
    id: 4,
    region: "Global Average",
    type: "temperature" as const,
    value: 1.2,
    unit: "°C above baseline",
    coordinates: "0,0",
    timestamp: new Date().toISOString()
  },
  {
    id: 5,
    region: "Great Barrier Reef",
    type: "temperature" as const,
    value: 2.1,
    unit: "°C above normal",
    coordinates: "-18.2871,147.6992",
    timestamp: new Date().toISOString()
  }
];

export const mockTerrorismData = [
  {
    id: 1,
    country: "Afghanistan",
    organization: "Taliban",
    riskLevel: "high" as const,
    fundingSources: "Drug trade, external support",
    lastActivity: new Date().toISOString()
  },
  {
    id: 2,
    country: "Syria",
    organization: "ISIS remnants",
    riskLevel: "medium" as const,
    fundingSources: "Smuggling, kidnapping",
    lastActivity: new Date().toISOString()
  },
  {
    id: 3,
    country: "Nigeria",
    organization: "Boko Haram",
    riskLevel: "high" as const,
    fundingSources: "Kidnapping, local extortion",
    lastActivity: new Date().toISOString()
  }
];

export const mockChatHistory = [
  {
    id: 1,
    question: "How are you feeling about climate change?",
    answer: "I feel the warming in my atmosphere and the melting of my ice caps. It's concerning, but I have hope that humanity will take action.",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    category: "environment"
  },
  {
    id: 2,
    question: "What can we do about conflicts?",
    answer: "Peace comes through understanding, dialogue, and addressing root causes like resource scarcity and inequality.",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    category: "conflict"
  }
];