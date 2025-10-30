import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';

export async function GET() {
  try {
    const chatHistory = await dbOperations.getChatHistory();
    return NextResponse.json(chatHistory);
  } catch (error) {
    console.error('Chat history API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}