import { NextRequest, NextResponse } from 'next/server';
import { analyzeVirality } from '@/lib/gemini';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
    try {
        const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
        const rateLimitResult = await rateLimit(identifier, 15, 60000); // 15 req/min

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Rate limit exceeded' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { content, platform } = body;

        if (!content || !platform) {
            return NextResponse.json(
                { error: 'Missing required fields: content, platform' },
                { status: 400 }
            );
        }

        const result = await analyzeVirality(content, platform);
        return NextResponse.json({ success: true, result });

    } catch (error) {
        console.error('Virality Analysis error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze content virality' },
            { status: 500 }
        );
    }
}
