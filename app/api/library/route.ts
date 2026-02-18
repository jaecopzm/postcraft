import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';
import { getUserContent, deleteContent, updateContent } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const content = await getUserContent(userId);
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Library GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
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

    await deleteContent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Library DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
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

    const { id, isFavorite, isEvergreen, folder, tags } = await request.json();
    await updateContent(id, { isFavorite, isEvergreen, folder, tags });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Library PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
