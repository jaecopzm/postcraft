import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';
import { analyzeAura } from '@/lib/gemini';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        let userId;
        try {
            const decodedToken = await adminAuth.verifyIdToken(idToken);
            userId = decodedToken.uid;
        } catch (error) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // 2. Check Subscription & Usage Gating
        const { db } = await import('@/lib/firebase-admin');
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        const isPro = userData?.subscription?.isPro || false;

        if (!isPro) {
            const now = new Date();
            const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const voiceUsage = userData?.voiceAnalysisCounts?.[monthKey] || 0;

            if (voiceUsage >= 1) {
                return NextResponse.json(
                    {
                        error: 'Voice analysis limit reached',
                        details: 'Free Tier is limited to 1 voice analysis per month. Upgrade to Pro for unlimited brand harvesting.'
                    },
                    { status: 403 }
                );
            }
        }

        // 3. Rate limiting (5 analysis per hour)
        const rateLimitResult = await rateLimit(userId, 5, 3600000);
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Analysis limit reached. Please try again in an hour.' },
                { status: 429 }
            );
        }

        // 3. Extract content
        const { url, text } = await request.json();
        let contentToAnalyze = text || '';

        if (url && !text) {
            try {
                const response = await fetch(url);
                const html = await response.text();
                // Basic HTML to text conversion for Gemini
                contentToAnalyze = html
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
                    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
                    .replace(/<[^>]*>?/gm, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .slice(0, 10000); // Limit to first 10k chars
            } catch (error) {
                console.error('Failed to fetch URL:', error);
                return NextResponse.json({ error: 'Failed to access the provided URL' }, { status: 400 });
            }
        }

        if (!contentToAnalyze || contentToAnalyze.length < 50) {
            return NextResponse.json({ error: 'Insufficient content for analysis. Please provide more text or a valid URL.' }, { status: 400 });
        }

        // 3. Analyze Aura
        const aura = await analyzeAura(contentToAnalyze);

        // 4. Record usage
        try {
            const now = new Date();
            const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            await db.collection('users').doc(userId).set({
                voiceAnalysisCounts: {
                    [monthKey]: (userData?.voiceAnalysisCounts?.[monthKey] || 0) + 1
                }
            }, { merge: true });
        } catch (err) {
            console.error('Failed to record voice analysis usage:', err);
        }

        return NextResponse.json({ success: true, aura, sourceText: contentToAnalyze });

    } catch (error) {
        console.error('Aura Analysis error:', error);
        return NextResponse.json({ error: 'Failed to analyze brand voice.' }, { status: 500 });
    }
}
