import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';

export async function GET() {
  try {
    const environmentData = await dbOperations.getEnvironmentData();
    return NextResponse.json(environmentData);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch environment data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { region, type, value, unit, coordinates } = await request.json();
    
    const result = await dbOperations.insertEnvironmentData(
      region,
      type,
      value,
      unit,
      coordinates,
      new Date().toISOString()
    );
    
    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to insert environment data' }, { status: 500 });
  }
}