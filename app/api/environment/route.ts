import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';

export async function GET() {
  try {
    const environmentData = await dbOperations.getEnvironmentData();
    return NextResponse.json(environmentData);
  } catch (error) {
    console.error('Environment API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch environment data' },
      { status: 500 }
    );
  }
}