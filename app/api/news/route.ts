import { NextResponse } from 'next/server';
import { getLatestNews, getBreakingNews } from '@/lib/newsApi';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');
    const breaking = searchParams.get('breaking') === 'true';
    
    let news;
    if (breaking) {
      news = await getBreakingNews();
    } else {
      news = await getLatestNews(category, limit);
    }
    
    return NextResponse.json({
      success: true,
      data: news,
      timestamp: new Date().toISOString(),
      category,
      count: news.length
    });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch news',
        data: []
      },
      { status: 500 }
    );
  }
}