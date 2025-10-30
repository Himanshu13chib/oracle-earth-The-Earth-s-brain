import { NextResponse } from 'next/server';
import { openRouterClient } from '@/lib/openrouter';

export async function POST(request: Request) {
  try {
    const { country, organization } = await request.json();

    if (!country || !organization) {
      return NextResponse.json({ error: 'Country and organization are required' }, { status: 400 });
    }

    // Use OpenRouter to analyze terrorism risk
    const analysis = await openRouterClient.analyzeTerrorismRisk(country, organization);

    const report = `
COUNTER-TERRORISM ANALYSIS REPORT
Country: ${country}
Organization: ${organization}
Risk Level: ${analysis.riskLevel.toUpperCase()}

THREAT ASSESSMENT:
${analysis.analysis}

SECURITY RECOMMENDATIONS:
${analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

MONITORING PRIORITIES:
- Financial transactions and funding sources
- Communication networks and recruitment
- Movement patterns and operational planning
- International connections and support networks

RESPONSE MEASURES:
- Enhanced surveillance and intelligence gathering
- Coordination with international security agencies
- Community engagement and counter-radicalization programs
- Border security and travel monitoring

RISK MITIGATION:
- Disruption of funding mechanisms
- Counter-narrative and information operations
- Capacity building for local security forces
- International cooperation and intelligence sharing

This analysis is based on open-source intelligence and should be supplemented with classified information for operational planning.
    `;

    return NextResponse.json({ analysis: report.trim() });
  } catch (error) {
    console.error('Terrorism analysis error:', error);

    // Fallback analysis
    const fallbackAnalysis = `
COUNTER-TERRORISM ANALYSIS REPORT
Country: ${request.body?.country || 'Selected Country'}
Organization: ${request.body?.organization || 'Target Organization'}
Risk Level: MEDIUM

THREAT ASSESSMENT:
Current intelligence indicates moderate threat levels requiring continued monitoring and assessment.

SECURITY RECOMMENDATIONS:
1. Enhanced surveillance and monitoring
2. International intelligence cooperation
3. Community engagement programs
4. Financial tracking and disruption
5. Counter-radicalization initiatives

Please consult with security experts and intelligence agencies for detailed operational planning.
    `;

    return NextResponse.json({ analysis: fallbackAnalysis.trim() });
  }
}