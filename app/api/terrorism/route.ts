import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';

export async function GET() {
  try {
    const terrorismData = await dbOperations.getTerrorismData();
    return NextResponse.json(terrorismData);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch terrorism data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { country, organization, riskLevel, fundingSources, lastActivity } = await request.json();
    
    const result = await dbOperations.insertTerrorismData(
      country,
      organization,
      riskLevel,
      fundingSources,
      lastActivity
    );
    
    return NextResponse.json({ id: result?.lastInsertRowid || Date.now(), success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to insert terrorism data' }, { status: 500 });
  }
}