import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';

export async function GET() {
  try {
    const conflicts = await dbOperations.getConflicts();
    return NextResponse.json(conflicts);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch conflicts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { country1, country2, probability, factors } = await request.json();
    
    const result = await dbOperations.insertConflict(
      country1,
      country2,
      probability,
      factors,
      new Date().toISOString()
    );
    
    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to insert conflict' }, { status: 500 });
  }
}