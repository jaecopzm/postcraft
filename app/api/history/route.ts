import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';
import { getUserHistory, toggleHistoryFavorite, updateHistoryResults, saveContent } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const history = await getUserHistory(userId);
    return NextResponse.json({ history });
  } catch (error) {
    console.error('History GET error:', error);
    return NextResponse.json({ error: 'Unauthorized or failed to fetch history' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { topic, content, platform, folder, tags } = body;

    const entryId = await saveContent(userId, {
      title: topic,
      content,
      platform,
      folder: folder || 'All',
      tags: tags || [],
      isFavorite: false,
      isEvergreen: false,
    });

    return NextResponse.json({ success: true, id: entryId });
  } catch (error) {
    console.error('History POST error:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { id, favorite, results } = await request.json();

    if (favorite !== undefined) {
      await toggleHistoryFavorite(id, favorite);
    }

    if (results !== undefined) {
      await updateHistoryResults(id, results);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('History PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update history entry' }, { status: 500 });
  }
}
