import { NextResponse } from 'next/server';
import { openRouterClient } from '@/lib/openrouter';

export async function POST(request: Request) {
  try {
    const { country1, country2, factors } = await request.json();
    
    if (!country1 || !country2) {
      return NextResponse.json({ error: 'Both countries are required' }, { status: 400 });
    }

    // Generate peace treaty using OpenRouter
    const treaty = await openRouterClient.generatePeaceTreaty(country1, country2, factors);
    
    return NextResponse.json({ treaty });
  } catch (error) {
    console.error('Treaty generation error:', error);
    
    // Fallback treaty template
    const fallbackTreaty = `
PEACE TREATY PROPOSAL
Between ${country1} and ${country2}

PREAMBLE
Recognizing the need for lasting peace and mutual cooperation, both nations commit to resolving conflicts through diplomatic means.

ARTICLE I - CEASEFIRE AND NON-AGGRESSION
1. Immediate cessation of all hostile activities
2. Establishment of buffer zones and monitoring mechanisms
3. Commitment to peaceful resolution of disputes

ARTICLE II - ECONOMIC COOPERATION
1. Trade normalization and economic partnerships
2. Joint infrastructure development projects
3. Technology and knowledge sharing agreements

ARTICLE III - DIPLOMATIC RELATIONS
1. Re-establishment of full diplomatic relations
2. Regular high-level diplomatic consultations
3. Cultural and educational exchange programs

ARTICLE IV - CONFLICT RESOLUTION
1. Establishment of joint mediation committee
2. International arbitration for unresolved disputes
3. Regular review and assessment mechanisms

ARTICLE V - IMPLEMENTATION
1. Phased implementation over 24 months
2. International monitoring and verification
3. Regular progress reviews and adjustments

This treaty shall enter into force upon ratification by both parties.
    `;
    
    return NextResponse.json({ treaty: fallbackTreaty.trim() });
  }
}