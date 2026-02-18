import { NextRequest, NextResponse } from 'next/server';
import { generateHashtags, generateCTA } from '@/lib/gemini';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimitResult = await rateLimit(identifier, 20, 60000); // 20 requests per minute

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { type, input } = body;

    if (!type || !input) {
      return NextResponse.json(
        { error: 'Missing required fields: type, input' },
        { status: 400 }
      );
    }

    let results: string[] = [];

    switch (type) {
      case 'hashtags':
        results = await generateHashtags(input, 12);
        break;
      case 'cta':
        results = await generateCTA(input);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be: hashtags or cta' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error('AI Tools error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
