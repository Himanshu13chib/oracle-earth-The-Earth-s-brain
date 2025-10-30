import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Oracle Earth API is working!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'POST request successful',
    timestamp: new Date().toISOString()
  });
}