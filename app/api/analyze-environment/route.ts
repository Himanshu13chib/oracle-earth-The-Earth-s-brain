import { NextResponse } from 'next/server';
import { openRouterClient } from '@/lib/openrouter';

export async function POST(request: Request) {
  try {
    const { region, type } = await request.json();
    
    if (!region || !type) {
      return NextResponse.json({ error: 'Region and type are required' }, { status: 400 });
    }

    // Mock current value for analysis
    const mockValue = type === 'deforestation' ? 15.2 : 
                     type === 'co2' ? 421.3 : 
                     type === 'glacier' ? -8.5 : 1.2;

    // Use OpenRouter to analyze environmental data
    const analysis = await openRouterClient.analyzeEnvironmentalData(region, type, mockValue);
    
    const recommendations = `
ENVIRONMENTAL ANALYSIS REPORT
Region: ${region}
Type: ${type}
Current Value: ${mockValue}

ANALYSIS:
${analysis.analysis}

RECOMMENDATIONS:
${analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

URGENCY LEVEL: ${analysis.urgency.toUpperCase()}

IMMEDIATE ACTIONS:
- Implement monitoring systems
- Engage local stakeholders
- Coordinate with international organizations
- Develop mitigation strategies

LONG-TERM STRATEGY:
- Sustainable development planning
- Technology transfer programs
- Capacity building initiatives
- Regular assessment and review
    `;

    return NextResponse.json({ recommendations: recommendations.trim() });
  } catch (error) {
    console.error('Environment analysis error:', error);
    
    // Fallback recommendations
    const fallbackRecommendations = `
ENVIRONMENTAL ANALYSIS REPORT
Region: ${request.body?.region || 'Selected Region'}
Type: ${request.body?.type || 'Environmental Factor'}

ANALYSIS:
Current environmental conditions require immediate attention and coordinated response efforts.

RECOMMENDATIONS:
1. Implement comprehensive monitoring systems
2. Engage local communities and stakeholders
3. Develop sustainable mitigation strategies
4. Coordinate with international environmental organizations
5. Establish regular assessment protocols

URGENCY LEVEL: HIGH

Please consult with environmental experts for detailed analysis and implementation strategies.
    `;
    
    return NextResponse.json({ recommendations: fallbackRecommendations.trim() });
  }
}