import { NextRequest, NextResponse } from 'next/server';
import { generateReply } from '@/lib/gemini';
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
        const { comment, tone } = body;

        if (!comment || !tone) {
            return NextResponse.json(
                { error: 'Missing required fields: comment, tone' },
                { status: 400 }
            );
        }

        const replies = await generateReply(comment, tone);
        return NextResponse.json({ success: true, replies });

    } catch (error) {
        console.error('Auto-Reply error:', error);
        return NextResponse.json(
            { error: 'Failed to generate replies' },
            { status: 500 }
        );
    }
}
