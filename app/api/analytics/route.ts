import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data() || {};

    // For platform breakdown, we should ideally query the content collection
    // but for now we'll return what we have or some defaults
    const contentSnapshot = await db.collection('content')
      .where('userId', '==', userId)
      .limit(100)
      .get();

    const platformBreakdown: Record<string, number> = {
      twitter: 0,
      linkedin: 0,
      instagram: 0,
      facebook: 0,
      tiktok: 0,
      youtube: 0
    };

    contentSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.platform && platformBreakdown[data.platform] !== undefined) {
        platformBreakdown[data.platform]++;
      }
    });

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const totalGenerations = userData.generationCounts?.[monthKey] || 0;

    return NextResponse.json({
      totalGenerations,
      platformBreakdown,
      dailyUsage: [], // Placeholder for now
      topTopics: [] // Placeholder for now
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Unauthorized or failed to fetch analytics' }, { status: 401 });
  }
}

// POST is handled implicitly by the generate API which call incrementGenerationCount
