import { NextResponse } from 'next/server';
import { openRouterClient } from '@/lib/openrouter';
import { dbOperations } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get context from recent data
    const conflicts = (await dbOperations.getConflicts()).slice(0, 5);
    const environmentData = (await dbOperations.getEnvironmentData()).slice(0, 5);
    const terrorismData = (await dbOperations.getTerrorismData()).slice(0, 5);
    
    const context = `
Recent Global Intelligence Data:
- Active Conflicts: ${conflicts.map(c => `${c.country1} vs ${c.country2} (${c.probability}% risk)`).join(', ')}
- Environmental Alerts: ${environmentData.map(e => `${e.region}: ${e.type} ${e.value}${e.unit}`).join(', ')}
- Security Threats: ${terrorismData.map(t => `${t.country}: ${t.organization} (${t.riskLevel} risk)`).join(', ')}
    `;

    // Get AI response
    const response = await openRouterClient.answerGlobalQuestion(message, context);
    
    // Determine category based on message content
    let category = 'general';
    if (message.toLowerCase().includes('conflict') || message.toLowerCase().includes('war')) {
      category = 'conflict';
    } else if (message.toLowerCase().includes('environment') || message.toLowerCase().includes('climate')) {
      category = 'environment';
    } else if (message.toLowerCase().includes('terrorism') || message.toLowerCase().includes('security')) {
      category = 'terrorism';
    } else if (message.toLowerCase().includes('economy') || message.toLowerCase().includes('economic')) {
      category = 'economy';
    }

    // Store in chat history
    await dbOperations.insertChatHistory(
      message,
      response,
      new Date().toISOString(),
      category
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    
    // Fallback response
    const fallbackResponse = `I understand you're asking about global affairs. While I'm currently experiencing some technical difficulties accessing my full intelligence database, I can still help with general questions about:

🛡️ Peace & Conflict Analysis
🌍 Environmental Monitoring  
⚠️ Counter-Terrorism Intelligence
📈 Economic Indicators

Please try rephrasing your question or ask about a specific topic area, and I'll do my best to provide insights based on available data.`;

    return NextResponse.json({ response: fallbackResponse });
  }
}