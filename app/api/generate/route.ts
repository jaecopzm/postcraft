import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';
import { rateLimit } from '@/lib/rateLimit';
import { incrementGenerationCount, saveHistory } from '@/lib/firestore';
import { generationSchema } from '@/lib/validations';
import { auth as adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the request
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.uid;

    // 2. Check Subscription & Usage Gating
    const { db } = await import('@/lib/firebase-admin');
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const isPro = userData?.subscription?.isPro || false;

    if (!isPro) {
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const usage = userData?.generationCounts?.[monthKey] || 0;

      if (usage >= 10) {
        return NextResponse.json(
          {
            error: 'Monthly limit reached',
            details: 'Free Tier is limited to 10 generations per month. Upgrade to Pro for unlimited neural power.'
          },
          { status: 403 }
        );
      }
    }

    // 3. Validate request body
    const body = await request.json();
    const validation = generationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { topic, platforms, tone, variationCount, brandGuide } = validation.data;

    // 3. Rate limiting (bound to userId)
    const rateLimitResult = await rateLimit(userId, 20, 60000); // 20 requests per minute for authenticated users

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          }
        }
      );
    }

    // 4. Generate content for each platform
    const results = await Promise.all(
      platforms.map(async (platform) => {
        const variations = await generateContent(topic, platform, tone, variationCount, brandGuide);
        return {
          platform,
          variations: variations.map((content, index) => ({
            id: `${platform}-${index}`,
            content,
            characterCount: content.length
          }))
        };
      })
    );

    // 5. Record usage and save to history
    let historyId = null;
    try {
      const resultsToSave = results.flatMap(r => r.variations.map(v => ({
        platform: r.platform,
        content: v.content,
        characterCount: v.characterCount,
        status: 'draft' as const
      })));

      const [saveHistoryResult] = await Promise.all([
        saveHistory(userId, {
          topic,
          results: resultsToSave,
          favorite: false
        }),
        incrementGenerationCount(userId)
      ]);
      historyId = saveHistoryResult;
    } catch (err) {
      console.error('Failed to record usage or history for user:', err);
    }

    return NextResponse.json(
      {
        success: true,
        results,
        historyId
      },
      {
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        }
      }
    );

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    );
  }
}
