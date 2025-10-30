import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';

export async function GET() {
  try {
    const economicData = await dbOperations.getEconomicData();
    return NextResponse.json(economicData);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch economic data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { country, gdp, inflation, unemployment, tradeBalance } = await request.json();
    
    const result = await dbOperations.insertEconomicData(
      country,
      gdp,
      inflation,
      unemployment,
      tradeBalance,
      new Date().toISOString()
    );
    
    return NextResponse.json({ id: result?.lastInsertRowid || Date.now(), success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to insert economic data' }, { status: 500 });
  }
}