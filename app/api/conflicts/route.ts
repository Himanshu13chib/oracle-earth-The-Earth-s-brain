import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';

export async function GET() {
  try {
    const conflicts = await dbOperations.getConflicts();
    return NextResponse.json(conflicts);
  } catch (error) {
    console.error('Conflicts API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conflicts data' },
      { status: 500 }
    );
  }
}