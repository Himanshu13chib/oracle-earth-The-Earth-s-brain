import { NextResponse } from 'next/server';
import { initializeOracleEarth } from '@/lib/init-db';

export async function POST() {
  try {
    await initializeOracleEarth();
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}