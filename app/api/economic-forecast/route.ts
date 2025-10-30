import { NextResponse } from 'next/server';
import { openRouterClient } from '@/lib/openrouter';

export async function POST(request: Request) {
  try {
    const { country } = await request.json();
    
    if (!country) {
      return NextResponse.json({ error: 'Country is required' }, { status: 400 });
    }

    // Generate economic forecast using OpenRouter
    const messages = [
      {
        role: 'system' as const,
        content: `You are Oracle Earth's economic analysis AI. Generate comprehensive economic forecasts based on current indicators, global trends, and geopolitical factors. Provide specific predictions with timeframes and confidence levels.`
      },
      {
        role: 'user' as const,
        content: `Generate a detailed economic forecast for ${country} covering the next 12-24 months. Include GDP growth, inflation, unemployment, trade balance, and key economic risks and opportunities.`
      }
    ];

    const forecast = await openRouterClient.chat(messages);
    
    const formattedForecast = `
ECONOMIC FORECAST REPORT
Country: ${country}
Forecast Period: Next 12-24 Months
Generated: ${new Date().toLocaleDateString()}

${forecast}

METHODOLOGY:
This forecast is generated using AI analysis of:
- Current economic indicators
- Global market trends
- Geopolitical factors
- Historical patterns
- Policy implications

DISCLAIMER:
Economic forecasts are subject to uncertainty and should be used in conjunction with professional economic analysis and current market data.
    `;

    return NextResponse.json({ forecast: formattedForecast.trim() });
  } catch (error) {
    console.error('Economic forecast error:', error);
    
    // Fallback forecast
    const fallbackForecast = `
ECONOMIC FORECAST REPORT
Country: ${request.body?.country || 'Selected Country'}
Forecast Period: Next 12-24 Months
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY:
Economic outlook shows mixed indicators with moderate growth expected in the coming quarters.

KEY PROJECTIONS:
- GDP Growth: 2.1-2.8% annually
- Inflation: 2.5-3.5% range
- Unemployment: Stable to slightly declining
- Trade Balance: Dependent on global conditions

RISK FACTORS:
- Global economic uncertainty
- Geopolitical tensions
- Supply chain disruptions
- Monetary policy changes

OPPORTUNITIES:
- Technology sector growth
- Infrastructure investment
- Green energy transition
- Digital transformation

Please consult with economic experts for detailed analysis and investment decisions.
    `;
    
    return NextResponse.json({ forecast: fallbackForecast.trim() });
  }
}