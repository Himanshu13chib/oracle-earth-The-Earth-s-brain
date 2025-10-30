import { NextResponse } from 'next/server';
import { openRouterClient } from '@/lib/openrouter';
import { dbOperations } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check if API key is available
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'demo-key') {
      return NextResponse.json({ 
        response: "I'm Earth, but I'm currently experiencing some technical difficulties with my AI consciousness. My human caretakers need to configure my neural pathways (API keys) properly. Please check back soon! 🌍" 
      });
    }

    // Get context from recent data (with fallbacks)
    let conflicts, environmentData, terrorismData;
    try {
      conflicts = (await dbOperations.getConflicts()).slice(0, 5);
      environmentData = (await dbOperations.getEnvironmentData()).slice(0, 5);
      terrorismData = (await dbOperations.getTerrorismData()).slice(0, 5);
    } catch (error) {
      console.error('Error fetching context data:', error);
      // Use empty arrays as fallback
      conflicts = [];
      environmentData = [];
      terrorismData = [];
    }
    
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

    // Store in chat history (with error handling)
    try {
      await dbOperations.insertChatHistory(
        message,
        response,
        new Date().toISOString(),
        category
      );
    } catch (error) {
      console.error('Error storing chat history:', error);
      // Continue without storing - don't fail the request
    }

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