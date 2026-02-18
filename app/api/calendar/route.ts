import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';
import { getScheduledPosts, schedulePost, deleteScheduledPost, updateScheduledPost } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const scheduled = await getScheduledPosts(userId);
    return NextResponse.json({ scheduled });
  } catch (error) {
    console.error('Calendar GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch scheduled posts' }, { status: 500 });
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

    const { date, time, platform, content } = await request.json();

    const id = await schedulePost(userId, { date, time, platform, content });
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Calendar POST error:', error);
    return NextResponse.json({ error: 'Failed to schedule post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(idToken);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await deleteScheduledPost(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Calendar DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete scheduled post' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(idToken);

    const { id, date, time, platform, content } = await request.json();
    await updateScheduledPost(id, { date, time, platform, content });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Calendar PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update scheduled post' }, { status: 500 });
  }
}
