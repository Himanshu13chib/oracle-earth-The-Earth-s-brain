import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenRouterClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required');
    }
  }

  async chat(messages: OpenRouterMessage[], model = 'x-ai/grok-4-fast'): Promise<string> {
    try {
      const response = await axios.post(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model,
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://oracle-earth.com',
            'X-Title': 'Oracle Earth - AI Brain of Our Planet',
          },
        }
      );

      return response.data.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  async analyzeConflictProbability(country1: string, country2: string): Promise<{
    probability: number;
    factors: string[];
    reasoning: string;
  }> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `You are Oracle Earth's conflict analysis AI. Analyze the probability of war/conflict between countries based on:
        - Historical tensions
        - Current diplomatic relations
        - Economic dependencies
        - Military capabilities
        - Recent news and events
        - Geopolitical factors
        
        Respond with a JSON object containing:
        - probability: number between 0-100
        - factors: array of key contributing factors
        - reasoning: detailed explanation`
      },
      {
        role: 'user',
        content: `Analyze the conflict probability between ${country1} and ${country2}. Consider current geopolitical situation, historical context, and recent developments.`
      }
    ];

    const response = await this.chat(messages);

    try {
      return JSON.parse(response);
    } catch {
      // Fallback if JSON parsing fails
      return {
        probability: 15,
        factors: ['Diplomatic tensions', 'Economic competition', 'Regional disputes'],
        reasoning: response
      };
    }
  }

  async generatePeaceTreaty(country1: string, country2: string, conflictFactors: string[]): Promise<string> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `You are Oracle Earth's diplomatic AI. Generate comprehensive peace treaty proposals that address root causes of conflict and promote lasting peace. Include specific, actionable measures.`
      },
      {
        role: 'user',
        content: `Generate a peace treaty proposal between ${country1} and ${country2}. Address these conflict factors: ${conflictFactors.join(', ')}. Include economic cooperation, diplomatic measures, and conflict resolution mechanisms.`
      }
    ];

    return await this.chat(messages);
  }

  async analyzeEnvironmentalData(region: string, dataType: string, currentValue: number): Promise<{
    analysis: string;
    recommendations: string[];
    urgency: 'low' | 'medium' | 'high' | 'critical';
  }> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `You are Oracle Earth's environmental analysis AI. Analyze environmental data and provide actionable recommendations for sustainability and conservation.`
      },
      {
        role: 'user',
        content: `Analyze ${dataType} data for ${region}. Current value: ${currentValue}. Provide analysis, specific recommendations, and urgency level (low/medium/high/critical) as JSON.`
      }
    ];

    const response = await this.chat(messages);

    try {
      return JSON.parse(response);
    } catch {
      return {
        analysis: response,
        recommendations: ['Monitor trends', 'Implement conservation measures'],
        urgency: 'medium'
      };
    }
  }

  async analyzeTerrorismRisk(country: string, organization: string): Promise<{
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    analysis: string;
    recommendations: string[];
  }> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `You are Oracle Earth's counter-terrorism analysis AI. Analyze terrorism risks based on open-source intelligence and provide security recommendations.`
      },
      {
        role: 'user',
        content: `Analyze terrorism risk for ${organization} in ${country}. Provide risk level (low/medium/high/critical), analysis, and security recommendations as JSON.`
      }
    ];

    const response = await this.chat(messages);

    try {
      return JSON.parse(response);
    } catch {
      return {
        riskLevel: 'medium',
        analysis: response,
        recommendations: ['Enhanced monitoring', 'International cooperation']
      };
    }
  }

  async answerGlobalQuestion(question: string, context?: string): Promise<string> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `You are Oracle Earth, the AI Brain of Our Planet. You have access to global intelligence data including:
        - Conflict probabilities and peace analysis
        - Environmental monitoring and climate data
        - Counter-terrorism intelligence
        - Economic indicators and trends
        
        Provide accurate, insightful answers about global affairs, geopolitics, environment, and security. Be specific and data-driven when possible.`
      }
    ];

    if (context) {
      messages.push({
        role: 'system',
        content: `Additional context: ${context}`
      });
    }

    messages.push({
      role: 'user',
      content: question
    });

    return await this.chat(messages);
  }
}

// Lazy-loaded client to avoid requiring API key during build
let _openRouterClient: OpenRouterClient | null = null;

export const openRouterClient = {
  get client(): OpenRouterClient {
    if (!_openRouterClient) {
      _openRouterClient = new OpenRouterClient();
    }
    return _openRouterClient;
  },

  async chat(messages: OpenRouterMessage[], model?: string): Promise<string> {
    return this.client.chat(messages, model);
  },

  async analyzeConflictProbability(country1: string, country2: string) {
    return this.client.analyzeConflictProbability(country1, country2);
  },

  async generatePeaceTreaty(country1: string, country2: string, conflictFactors: string[]) {
    return this.client.generatePeaceTreaty(country1, country2, conflictFactors);
  },

  async analyzeEnvironmentalData(region: string, dataType: string, currentValue: number) {
    return this.client.analyzeEnvironmentalData(region, dataType, currentValue);
  },

  async analyzeTerrorismRisk(country: string, organization: string) {
    return this.client.analyzeTerrorismRisk(country, organization);
  },

  async answerGlobalQuestion(question: string, context?: string) {
    return this.client.answerGlobalQuestion(question, context);
  }
};